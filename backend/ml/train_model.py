import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os
import re

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text.replace(" ", "_")

# Ensure models directory exists
models_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(models_dir, exist_ok=True)

# Load the CSV data
data = pd.read_csv(os.path.join(os.path.dirname(__file__), 'problems_data.csv'))

# Apply preprocessing
data['tags_topic'] = data.apply(lambda row: preprocess_text(row['tags']) + "," + preprocess_text(row['topic']), axis=1)

# Vectorization
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(data['tags_topic'])


# Encode difficulty and estimated_time
difficulty_encoder = LabelEncoder()
y_difficulty = difficulty_encoder.fit_transform(data['difficulty'])


y_time = data['estimated_time']  # Keep as integers for Linear Regression

# Train-test split
X_train, X_test, y_difficulty_train, y_difficulty_test = train_test_split(X, y_difficulty, test_size=0.2, random_state=42)
X_train_time, X_test_time, y_time_train, y_test_time = train_test_split(X, y_time, test_size=0.2, random_state=42)

# Train models
difficulty_model = LogisticRegression()
difficulty_model.fit(X_train, y_difficulty_train)

from sklearn.metrics import r2_score,accuracy_score
y_pred = difficulty_model.predict(X_test)
print("Accuracy of Difficulty : ",accuracy_score(y_difficulty_test,y_pred))


time_model = LinearRegression()
time_model.fit(X_train_time, y_time_train)

y_pred_time = time_model.predict(X_test_time)
print("R2 score : ",r2_score(y_test_time,y_pred_time))

# Save everything
joblib.dump(difficulty_model, os.path.join(models_dir, 'difficulty_model.pkl'))
joblib.dump(time_model, os.path.join(models_dir, 'time_model.pkl'))
joblib.dump(vectorizer, os.path.join(models_dir, 'vectorizer.pkl'))
joblib.dump(difficulty_encoder, os.path.join(models_dir, 'difficulty_encoder.pkl'))

print("Training complete. Models and encoders saved to 'backend/ml/models'")
