from django.urls import path

from .views import ask_question_api


urlpatterns = [
    path("ask/", ask_question_api, name="ask-question"),
]