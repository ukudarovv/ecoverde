from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import FeedbackSubmissionSerializer
from .services.telegram import process_feedback_notifications


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class FeedbackCreateView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = FeedbackSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        confirmation_status = process_feedback_notifications(submission)

        return Response(
            {
                "id": submission.id,
                "message": "Заявка принята",
                "telegram_confirmation": confirmation_status,
            },
            status=status.HTTP_201_CREATED,
        )
