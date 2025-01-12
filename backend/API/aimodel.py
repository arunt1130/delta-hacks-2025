import cohere
from views import distance, closest_wildfire, percent_danger

co = cohere.ClientV2("88nb99FJsBIdnUFpPwU7LWlDuPxF1gvbDX9hCVQ1")

def chat(message):
    # Generate the response
    response = co.chat(model="command-r-plus-08-2024",
                    messages=[{'role':'user', 'content': message}])

    return response.message.content[0].text



print(chat(f"Based off the information I will present, give me plausible solutions on what to"
           f"do if you were in this scenario. You are currently in the area of a wildfire, in the region of: "
           f"{distance}, and you have a {percent_danger}% of being caught by a wildfire, "
           f"you are {closest_wildfire} far away from the fire. Keep in mind these are longitude and latitude coordinates respectively, so convert them to the nearest city or region. Display all these facts and give me some solutions on what to do to stay safe."
           "Make sure that you mention specific values that I have provided during the prompt."))

