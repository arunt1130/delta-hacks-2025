from django.urls import path
from .views import FireDataView  # Or import your API view function

urlpatterns = [
    path('fire-data/', FireDataView.as_view(), name='fire-data'),
]
