#!/usr/bin/env bash

echo "Starting Rasa Server..."

rasa run \
  -m models/20260307-122807-tranquil-cricket.tar.gz \
  --enable-api \
  --cors "*" \
  -p 5005 \
  -i 0.0.0.0 > rasa.log 2>&1 &

echo "Waiting for Rasa to start..."
sleep 50

echo "Checking if Rasa started..."
cat rasa.log

echo "Starting Flask with Gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT