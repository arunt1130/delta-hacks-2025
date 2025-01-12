from django.urls import path
from .views import FireDataView  # Or import your API view function
from .views import FireDataSubmissionView
from.views import ReturnFireRisk

urlpatterns = [
    path('fire-data/', FireDataView.as_view(), name='fire-data'),
    path('submit-fire-data/', FireDataSubmissionView.as_view(), name='submit-fire-data'),
    path('retrive_fire_risk/', ReturnFireRisk.as_view(), name='return_fire_risk') #http://127.0.0.1:8000/api/get-fire-risk/
]