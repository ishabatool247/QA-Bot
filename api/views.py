from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .qa_service import ask_question


@api_view(["POST"])
def ask_question_api(request):
    question = request.data.get("question")

    if not question:
        return Response(
            {
                "error": "Question is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        answer = ask_question(question)

        return Response(
            {
                "question": question,
                "answer": answer
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )