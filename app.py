import os
import subprocess
import requests
from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder="web")

RASA_URL = "http://localhost:5005/webhooks/rest/webhook"


# Start Rasa server (Linux compatible)
def start_rasa():
    subprocess.Popen(
        [
            "rasa",
            "run",
            "--enable-api",
            "--cors",
            "*",
            "--port",
            "5005"
        ]
    )


# Start Rasa before Flask starts
start_rasa()


@app.route("/")
def index():
    return send_from_directory("web", "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("web", path)


@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        sender = request.json.get("sender")

        response = requests.post(
            RASA_URL,
            json={"sender": sender, "message": user_message},
            timeout=15
        )

        return jsonify(response.json())

    except Exception:
        return jsonify([{"text": "Rasa server not ready yet... please wait a few seconds."}])


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)