import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# -----------------------------
# 1️⃣ Load Dataset
# -----------------------------
data = pd.read_csv("Crop_recommendation.csv")

print("Dataset Loaded Successfully!")
print("Columns in Dataset:", data.columns)
print("Total Records:", len(data))
print("----------------------------------")

# -----------------------------
# 2️⃣ Separate Features & Label
# -----------------------------
X = data.drop("label", axis=1)
y = data["label"]

print("Feature Order Used For Training:")
print(X.columns)
print("----------------------------------")

# -----------------------------
# 3️⃣ Train-Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# 4️⃣ Train Random Forest Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# 5️⃣ Evaluate Model
# -----------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("----------------------------------")

# -----------------------------
# 6️⃣ Save Model
# -----------------------------
joblib.dump(model, "crop_model.pkl")

print("Model saved successfully as crop_model.pkl")
print("Training Completed Successfully!")