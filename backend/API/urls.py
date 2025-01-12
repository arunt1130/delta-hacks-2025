from django.urls import path
from .views import FireDataView  # Or import your API view function
from .views import FireDataSubmissionView

urlpatterns = [
    path('fire-data/', FireDataView.as_view(), name='fire-data'),
    path('submit-fire-data/', FireDataSubmissionView.as_view(), name='submit-fire-data'),
]
