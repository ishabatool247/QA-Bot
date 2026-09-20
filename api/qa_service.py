from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

PDF_PATH = BASE_DIR / "data" / "LangChain_Mastery_Guide.pdf"
CHROMA_PATH = BASE_DIR / "chroma_db"


# --------------------------------------------------
# Environment
# --------------------------------------------------

load_dotenv(BASE_DIR / ".env")


# --------------------------------------------------
# Load PDF
# --------------------------------------------------

loader = PyPDFLoader(str(PDF_PATH))
documents = loader.load()


# --------------------------------------------------
# Split text
# --------------------------------------------------

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = splitter.split_documents(documents)


# --------------------------------------------------
# Embedding model
# --------------------------------------------------

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# --------------------------------------------------
# Vector database
# --------------------------------------------------

if CHROMA_PATH.exists() and any(CHROMA_PATH.iterdir()):
    db = Chroma(
        persist_directory=str(CHROMA_PATH),
        embedding_function=embeddings
    )
else:
    db = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=str(CHROMA_PATH)
    )


# --------------------------------------------------
# OpenAI model
# --------------------------------------------------
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)
# --------------------------------------------------
# QA Function
# --------------------------------------------------

def ask_question(question):
    results = db.similarity_search(question, k=3)

    context = "\n\n".join(
        [doc.page_content for doc in results]
    )

    prompt = f"""
Use only the context below to answer the question.

If the answer is not available in the context,
say that the information is not available in the provided document.

Context:
{context}

Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)

    return response.content