from rest_framework import serializers

from .models import FeedbackSubmission


class FeedbackSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackSubmission
        fields = (
            "name",
            "email",
            "phone",
            "company",
            "telegram_username",
            "message",
            "lang",
        )

    def validate_lang(self, value):
        allowed = {choice.value for choice in FeedbackSubmission.Language}
        if value not in allowed:
            raise serializers.ValidationError("Unsupported language.")
        return value

    def validate_telegram_username(self, value):
        if not value:
            return ""
        return value.strip().lstrip("@")
