import requests
import datetime
from math import radians, sin, cos, sqrt, asin

#NASA API key
API_KEY = '7f7632b8281d59c35ef769fa5c6c9987'

# Get today's date
today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')  # Format date as YYYY-MM-DD

url = f"https://eonet.gsfc.nasa.gov/api/v3/events?api_key={API_KEY}"

# Make the GET request to the NASA API
response = requests.get(url)

if response.status_code == 200:
    wildfire_data = response.json()  # Parse the response into JSON

def haversine(lon1, lat1, lon2, lat2):
    # Convert latitude and longitude from degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [float(lon1), float(lat1), float(lon2), float(lat2)])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    R = 6371.0

    # Calculate the distance
    distance = R * c
    return distance

def find_closest_wildfire(user_lat, user_lon):
    closest_distance = float('inf')
    closest_wildfire = None

    wildfire_data = open("API/fireinformation.txt", 'r')

    for fire in wildfire_data.readlines():
        # Extract wildfire coordinates (latitude and longitude)
        lines = fire.split(',')

        fire_lat = lines[0]
        fire_lon = lines[1]

        # Calculate the distance to the user's location
        distance = haversine(user_lon, user_lat, fire_lon, fire_lat)

        # Update closest wildfire if we find a closer one
        if distance < closest_distance:
            closest_distance = distance
            closest_wildfire = lines

    return (float(closest_wildfire[0]),float(closest_wildfire[1])) , closest_distance