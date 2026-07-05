from django.urls import path

from .views import FeedbackCreateView, HealthCheckView

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("feedback/", FeedbackCreateView.as_view(), name="feedback-create"),
]
