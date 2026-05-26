import sys
import os
from fastapi.testclient import TestClient

# Add ml-model folder to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_model")))

from app import app

client = TestClient(app)

# Test 1: Root route
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the ML Model API"}

# Test 2: Valid prediction
def test_predict_valid():
    response = client.post("/predict", json={
        "soil_type": "Black",
        "weather": {
            "temperature": 26,
            "humidity": 80,
            "rainfall": 200
        }
    })
    assert response.status_code == 200
    assert "recommended_crop" in response.json()

# Test 3: Missing input data
def test_predict_missing_input():
    response = client.post("/predict", json={
        "soil_type": "Black"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing input data"

# Test 4: Invalid soil type
def test_predict_invalid_soil():
    response = client.post("/predict", json={
        "soil_type": "Stone",
        "weather": {
            "temperature": 26,
            "humidity": 80,
            "rainfall": 200
        }
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid soil type"

def test_predict_missing_weather_field():
    response = client.post("/predict", json={
        "soil_type": "Black",
        "weather": {
            "temperature": 26
        }
    })
    assert response.status_code in [400, 422]