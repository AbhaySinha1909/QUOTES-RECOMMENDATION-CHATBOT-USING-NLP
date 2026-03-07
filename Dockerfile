FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
EXPOSE 5005

CMD bash -c "\
rasa run --model models/20260307-122807-tranquil-cricket.tar.gz \
--enable-api --cors '*' --port 5005 --host 0.0.0.0 & \
sleep 20 && \
gunicorn app:app --bind 0.0.0.0:5000"