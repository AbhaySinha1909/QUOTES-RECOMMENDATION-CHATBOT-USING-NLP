#!/bin/bash

echo "Starting Rasa..."
rasa run \
  --model models/20260307-122807-tranquil-cricket.tar.gz \
  --enable-api \
  --cors "*" \
  --port 5005 &

sleep 20

echo "Starting Flask..."
gunicorn app:app --bind 0.0.0.0:$PORT
