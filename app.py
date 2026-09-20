from dotenv import load_dotenv
import os

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI

# Load PDF
loader = PyPDFLoader("data/LangChain_Mastery_Guide.pdf")
documents = loader.load()

# Split text
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = splitter.split_documents(documents)

# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create vector database
db = Chroma.from_documents(
    docs,
    embeddings,
    persist_directory="chroma_db"
)

print("Database created successfully!")

# Load OpenAI model
llm = ChatOpenAI(
    model="gpt-4.1-mini",
    temperature=0
)

# Chat loop
while True:
    question = input("\nAsk a question (type 'exit' to quit): ")

    if question.lower() == "exit":
        break

    results = db.similarity_search(question, k=3)

    context = "\n\n".join([doc.page_content for doc in results])

    prompt = f"""
Use only the context below to answer the question.

Context:
{context}

Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)

    print("\nAnswer:\n")
    print(response.content)