import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def upload_file_to_gist(file_path):
    """
    Uploads a file to GitHub Gist and returns the URL of the created Gist.

    Parameters:
        file_path (str): The path to the file that needs to be uploaded.

    Returns:
        str: The URL of the created Gist if successful, None otherwise.
    """
    # Your GitHub API token
    token = os.getenv('TOKEN_UPLOAD_GIT')

    # Extract filename and read content
    file_name = os.path.basename(file_path)
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()
    except Exception as e:
        print(f"Failed to read the file: {e}")
        return None

    # Gist information with dynamic content
    gist_info = {
        "description": "Sample file upload",
        "public": True,
        "files": {
            file_name: {
                "content": file_content
            }
        }
    }

    # API URL
    api_url = "https://api.github.com/gists"

    # Headers to authenticate and make API request
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    # Make a POST request to create the Gist
    response = requests.post(api_url, headers=headers, json=gist_info)

    # Check if the request was successful
    if response.status_code == 201:
        # Get the URL of the created Gist
        gist_url = response.json()['html_url']
        print("Gist created successfully:", gist_url)
        return gist_url
    else:
        print("Failed to create Gist")
        print("Status code:", response.status_code)
        print("Response:", response.text)
        return None

