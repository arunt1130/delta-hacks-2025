import requests
import datetime
from math import radians, sin, cos, sqrt, atan2

#NASA API key
API_KEY = 'bcba66dd6814936acfb57a37018a4848'

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
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    # Radius of Earth in kilometers
    R = 6371.0

    # Calculate the distance
    distance = R * c
    return distance

def find_closest_wildfire(user_lat, user_lon, wildfire_data):
    closest_distance = float('inf')
    closest_wildfire = None

    for fire in wildfire_data['features']:
        # Extract wildfire coordinates (latitude and longitude)
        fire_lat = fire['geometry']['coordinates'][1]
        fire_lon = fire['geometry']['coordinates'][0]

        # Calculate the distance to the user's location
        distance = haversine(user_lon, user_lat, fire_lon, fire_lat)

        # Update closest wildfire if we find a closer one
        if distance < closest_distance:
            closest_distance = distance
            closest_wildfire = fire

    return closest_wildfire, closest_distance