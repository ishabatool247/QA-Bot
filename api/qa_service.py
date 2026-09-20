
from pathlib import Path
import re

from dotenv import load_dotenv
from pypdf import PdfReader
from groq import Groq
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

def load_pdf_text():
    reader = PdfReader(str(PDF_PATH))

    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""

        if text.strip():
            pages.append(text)

    return "\n".join(pages)


# --------------------------------------------------
# Split text
# --------------------------------------------------

def split_text(text, chunk_size=500, overlap=50):

    words = re.split(r"\s+", text.strip())

    chunks = []

    start = 0

    while start < len(words):

        end = min(start + chunk_size, len(words))

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks


# --------------------------------------------------
# Prepare Knowledge Base
# --------------------------------------------------

pdf_text = load_pdf_text()

docs = split_text(pdf_text)


# --------------------------------------------------
# TF-IDF Search
# --------------------------------------------------

vectorizer = TfidfVectorizer(
    stop_words="english"
)

document_vectors = vectorizer.fit_transform(docs)


# --------------------------------------------------
# Groq Client
# --------------------------------------------------

client = Groq(
    api_key=None
)


# --------------------------------------------------
# QA Function
# --------------------------------------------------

def ask_question(question):

    question_vector = vectorizer.transform([question])

    similarities = cosine_similarity(
        question_vector,
        document_vectors
    ).flatten()

    top_indices = similarities.argsort()[-3:][::-1]

    results = [
        docs[index]
        for index in top_indices
        if similarities[index] > 0
    ]

    if not results:
        return (
            "The information is not available "
            "in the provided document."
        )

    context = "\n\n".join(results)

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

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content
