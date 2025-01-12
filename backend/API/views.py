from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class FireDataView(APIView):
    def get(self, request):
        data = {
            'message': 'Wildfire data will be returned here.'
        }
        return Response(data, status=status.HTTP_200_OK)
