# QUOTES RECOMMENDATION CHATBOT USING NLP

Live Demo:
https://abhaysinha1909.github.io/QUOTES-RECOMMENDATION-CHATBOT-USING-NLP/

Backend:
Deployed using Rasa on Railway

## 📌 Project Description

This is an NLP-based chatbot that recommends quotes based on user intent. 
Users can ask for motivational, inspirational, love, funny, or success quotes.

The chatbot is built using Rasa for Natural Language Processing and deployed on Railway, 
with a responsive frontend hosted on GitHub Pages.

## ✨ Features

- Intent-based quote recommendation
- Multiple quote categories (Motivation, Inspiration, Love, Funny, Success)
- Persistent chat history using localStorage
- Clean and responsive UI
- Dark mode support
- Cloud deployed backend using Railway

- ## 🛠 Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Rasa (NLP Framework)

Deployment:
- Railway (Backend Hosting)
- GitHub Pages (Frontend Hosting)

- ## 🏗 Architecture

GitHub Pages (Frontend UI)
        ↓
Railway (Rasa NLP API)

## 💻 Run Locally

1. Clone the repository
2. Install dependencies:
   pip install -r requirements.txt
3. Train the model:
   rasa train
4. Run the server:
   rasa run --enable-api --cors "*"
