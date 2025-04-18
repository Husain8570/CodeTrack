import joblib
import numpy as np
import sys
import os
import re

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text.replace(" ", "_")

# Get the absolute path to the models folder relative to this script
models_directory = os.path.join(os.path.dirname(__file__), 'models')

# Load models and vectorizer
difficulty_model = joblib.load(os.path.join(models_directory, 'difficulty_model.pkl'))
time_model = joblib.load(os.path.join(models_directory, 'time_model.pkl'))
vectorizer = joblib.load(os.path.join(models_directory, 'vectorizer.pkl'))

# Load label encoder
difficulty_encoder = joblib.load(os.path.join(models_directory, 'difficulty_encoder.pkl'))

# Predict difficulty from topic and tags
def predict_difficulty(topic, tags):
    input_text = preprocess_text(tags) + " " + preprocess_text(topic)
    vectorized = vectorizer.transform([input_text])
    prediction = difficulty_model.predict(vectorized)[0]
    decoded_difficulty = difficulty_encoder.inverse_transform([prediction])[0]
    return decoded_difficulty.capitalize()

# Predict time from topic and tags
def predict_time(topic, tags):
    input_text = preprocess_text(tags) + " " + preprocess_text(topic)
    vectorized = vectorizer.transform([input_text])
    prediction = time_model.predict(vectorized)[0]
    return int(round(prediction))  # Ensure it's an integer

# Main function for command line testing
if __name__ == "__main__":
    try:
        topic = sys.argv[1]
        tags = sys.argv[2]
        
        difficulty = predict_difficulty(topic, tags)
        time = predict_time(topic, tags)

        print(f"{difficulty},{time}")
    
    except Exception as e:
        print("Medium,30")
