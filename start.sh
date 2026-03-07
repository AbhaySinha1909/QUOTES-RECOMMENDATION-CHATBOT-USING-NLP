#!/usr/bin/env bash

echo "Starting Rasa Server..."

rasa run \
  --model models/20260307-122807-tranquil-cricket.tar.gz \
  --enable-api \
  --cors "*" \
  --port 5005 \
  --host 0.0.0.0 &

echo "Waiting for Rasa to become ready..."

until curl -s http://localhost:5005/status > /dev/null
do
  sleep 3
done

echo "Rasa is ready."

echo "Starting Flask with Gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT