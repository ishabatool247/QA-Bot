from dotenv import load_dotenv
import os

load_dotenv()

import streamlit as st

from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI

st.set_page_config(page_title="AI PDF Chatbot")

st.title("📄 AI PDF Chatbot")

# Load PDF
loader = PyPDFLoader("data/LangChain_Mastery_Guide.pdf")
documents = loader.load()

# Split
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = splitter.split_documents(documents)

# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Vector DB
db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embeddings
)

retriever = db.as_retriever(search_kwargs={"k": 3})

# OpenAI model
llm = ChatOpenAI(
    model="gpt-4.1-mini",
    api_key=os.getenv("OPENAI_API_KEY")
)

question = st.text_input("Ask a question about your PDF")

if st.button("Ask"):

    if question:

        retrieved_docs = retriever.invoke(question)

        context = "\n\n".join(
            [doc.page_content for doc in retrieved_docs]
        )

        prompt = f"""
Answer ONLY from the context.

Context:
{context}

Question:
{question}
"""

        answer = llm.invoke(prompt)

        st.subheader("Answer")

        st.write(answer.content)