from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import warnings

# Suppress scikit-learn feature name warning
import warnings
warnings.filterwarnings("ignore", message=".*valid feature names.*")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the ML Model API"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load model safely
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "crop_model.pkl")
model = joblib.load(model_path)

soil_nutrient_map = {
    "Black": {"N": 90, "P": 40, "K": 43, "ph": 7.0},
    "Red": {"N": 60, "P": 30, "K": 35, "ph": 6.5},
    "Sandy": {"N": 40, "P": 20, "K": 25, "ph": 6.8},
    "Alluvial": {"N": 80, "P": 45, "K": 40, "ph": 7.2}
}

@app.post("/predict")
def predict(data: dict):
    soil = data.get("soil_type")
    weather = data.get("weather")

    if not soil or not weather:
        raise HTTPException(status_code=400, detail="Missing input data")

    if soil not in soil_nutrient_map:
        raise HTTPException(status_code=400, detail="Invalid soil type")

    required_weather_fields = ["temperature", "humidity", "rainfall"]
    if not all(field in weather for field in required_weather_fields):
        raise HTTPException(status_code=400, detail="Missing weather data")

    nutrients = soil_nutrient_map[soil]

    input_features = [[
        float(nutrients["N"]),
        float(nutrients["P"]),
        float(nutrients["K"]),
        float(weather["temperature"]),
        float(weather["humidity"]),
        float(nutrients["ph"]),
        float(weather["rainfall"])
    ]]

    prediction = model.predict(input_features)

    return {"recommended_crop": prediction[0]}