from django.urls import path
from .views import ProcessListAPIView, ProcessTerminateAPIView, SystemSummaryAPIView

urlpatterns = [
    path('processes/', ProcessListAPIView.as_view(), name='process-list'),
    path('processes/terminate/<int:pid>/', ProcessTerminateAPIView.as_view(), name='terminate_process'),
    path('system-summary/', SystemSummaryAPIView.as_view(), name='system-summary'),
]
