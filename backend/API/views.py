from django.shortcuts import render

# views here
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http import JsonResponse

import json
from .wildfire_tools import wildfire_data, find_closest_wildfire


from .aimodel import chat

#import wildfire_tools




class FireDataView(APIView):
    def get(self, request):
        data = {
            'message': 'Wildfire data will be returned here.'
        }
        return Response(data, status=status.HTTP_200_OK)
class FireDataSubmissionView(APIView):
    def post(self, request):


        data = request.data


        if request.method == 'POST':
            #database = open("API/fireinformation.txt", 'r')
            #try:
                # Get user coordinates from the request
                user_lat = float(data['longitude']) # SHOULD be latitude
                user_lon =float( data['latitude']) #SHOULD BE LONGITUDE

                closest_wildfire, distance = find_closest_wildfire(user_lat, user_lon)

                percent_danger = distance // 30

                if closest_wildfire:

                    global dp 
                    dp = percent_danger
                    global cw 
                    cw = closest_wildfire
                    global di 
                    di = distance




                    return JsonResponse({
                        'closest_wildfire': closest_wildfire,
                        'distance': distance,
                    })

                '''
            except (TypeError, ValueError):
                return JsonResponse({'error': 'Invalid or missing coordinates'}, status=400)
            ''' 



        #here we can use the data for its applications, so calling the other functions 

        return Response({"received_data": wildfire_data}, status=status.HTTP_200_OK)

class ReturnFireRisk(APIView):
     def get(self, request):


          fire_data = {
               "danger" : 20, 
               "ai_response" : chat(20, 100,  300) 
          }
          return Response(fire_data,  status=status.HTTP_200_OK)