FROM rasa/rasa:3.6.2

WORKDIR /app

COPY . /app

USER root
RUN pip install -r requirements.txt

USER 1001

CMD ["run", "--enable-api", "--cors", "*", "--port", "5005"]