#!/usr/bin/env bash

echo "Starting Rasa Server..."

rasa run \
  --enable-api \
  --cors "*" \
  --port 5005 \
  --host 0.0.0.0 &

echo "Waiting for Rasa to start..."
sleep 25

echo "Starting Flask with Gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT