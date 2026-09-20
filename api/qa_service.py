
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

PDF_PATH = BASE_DIR / "data" / "LangChain_Mastery_Guide.pdf"


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
# Lightweight TF-IDF Search
# --------------------------------------------------

texts = [doc.page_content for doc in docs]

vectorizer = TfidfVectorizer(
    stop_words="english"
)

document_vectors = vectorizer.fit_transform(texts)


# --------------------------------------------------
# Groq Model
# --------------------------------------------------

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)


# --------------------------------------------------
# QA Function
# --------------------------------------------------

def ask_question(question):

    # Convert question into TF-IDF vector
    question_vector = vectorizer.transform([question])

    # Calculate similarity with all document chunks
    similarities = cosine_similarity(
        question_vector,
        document_vectors
    ).flatten()

    # Get top 3 relevant chunks
    top_indices = similarities.argsort()[-3:][::-1]

    results = [
        docs[index]
        for index in top_indices
        if similarities[index] > 0
    ]

    # No relevant information found
    if not results:
        return (
            "The information is not available "
            "in the provided document."
        )

    # Build context
    context = "\n\n".join(
        doc.page_content
        for doc in results
    )

    # Prompt
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

