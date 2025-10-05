from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .utils import predict_price
from .model import location_columns
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Real Estate Price Predictor API",
    description="API to predict Bangalore house prices",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for prediction input
class HouseFeatures(BaseModel):
    location: str
    sqft: float
    bath: int
    bhk: int

@app.get("/")
def home():
    return {"message": "Real Estate Price Predictor API is running 🚀"}

@app.get("/locations")
def get_locations():
    """
    Returns a list of all available locations in JSON format.
    """
    locations = list(location_columns)  # converts any type to Python list
    return {"locations": locations}


@app.post("/predict")
def predict(features: HouseFeatures):
    if features.location not in location_columns:
        raise HTTPException(status_code=400, detail="Invalid location")
    try:
        price = predict_price(
            location=features.location,
            sqft=features.sqft,
            bath=features.bath,
            bhk=features.bhk
        )
        return {"predicted_price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

get_locations()