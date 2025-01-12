import cohere

co = cohere.ClientV2("88nb99FJsBIdnUFpPwU7LWlDuPxF1gvbDX9hCVQ1")

def chat(message):
    # Generate the response
    response = co.chat(model="command-r-plus-08-2024",
                    messages=[{'role':'user', 'content': message}])

    return response.message.content[0].text


print(chat("who created cohere?"))