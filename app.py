import os
import subprocess
import time
import requests
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder="web", static_url_path="")

RASA_URL = "http://localhost:5005/webhooks/rest/webhook"

rasa_process = None


# -----------------------------------------
# Start Rasa Server
# -----------------------------------------
def start_rasa():
    global rasa_process

    rasa_process = subprocess.Popen(
        ["rasa", "run", "--enable-api", "--cors", "*"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # Wait for Rasa to boot
    time.sleep(10)


# Start Rasa when Flask starts
start_rasa()


# -----------------------------------------
# Serve Frontend
# -----------------------------------------
@app.route("/")
def index():
    return send_from_directory("web", "index.html")


@app.route("/about.html")
def about():
    return send_from_directory("web", "about.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("web", path)


# -----------------------------------------
# Chat API
# -----------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json

        response = requests.post(
            RASA_URL,
            json={
                "sender": data["sender"],
                "message": data["message"]
            },
            timeout=15
        )

        return jsonify(response.json())

    except Exception as e:
        return jsonify([{
            "text": "⚠️ Server warming up... please try again in a few seconds."
        }])


# -----------------------------------------
# Run Flask
# -----------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)