from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import string
import nltk
import os
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download stopwords (important for Render)
nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)

# Load model (use correct path)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "models/spam_classifier.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "models/tfidf_vectorizer.pkl"))

stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def clean_text(text):
    text = text.lower()
    text = ''.join([ch for ch in text if ch not in string.punctuation])
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    return ' '.join(words)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json.get("email", "")

    if data.strip() == "":
        return jsonify({"error": "No input provided"}), 400

    cleaned = clean_text(data)
    vectorized = vectorizer.transform([cleaned])

    prediction = model.predict(vectorized)[0]
    proba = model.predict_proba(vectorized)[0][prediction]

    return jsonify({
        "prediction": int(prediction),
        "confidence": float(proba)
    })

# IMPORTANT FOR RENDER
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))