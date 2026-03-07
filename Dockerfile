FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Train model if needed (optional)
# RUN rasa train

# Expose ports
EXPOSE 5005
EXPOSE 5000

# Start both Rasa and Flask
CMD bash -c "\
rasa run --enable-api --cors '*' -p 5005 -i 0.0.0.0 & \
sleep 20 && \
gunicorn app:app --bind 0.0.0.0:5000"