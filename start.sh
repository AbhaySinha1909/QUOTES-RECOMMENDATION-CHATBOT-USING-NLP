#!/bin/bash

echo "Starting Rasa..."
rasa run --enable-api --cors "*" --port 5005 &

sleep 15

echo "Starting Flask..."
gunicorn app:app --bind 0.0.0.0:$PORT