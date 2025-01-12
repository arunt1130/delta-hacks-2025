from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser

class FireDataView(APIView):
    def get(self, request):
        data = {
            'message': 'Wildfire data will be returned here.'
        }
        return Response(data, status=status.HTTP_200_OK)



class FireDataSubmissionView(APIView):
    def post(self, request):
        data = request.data   # So this is teh data from the frontend


        #here we can use the data for its applications, so calling the other functions 

        return Response({"received_data": data}, status=status.HTTP_200_OK)
    
    
