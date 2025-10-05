import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "models"

# Load trained model
with open(BASE_DIR / "house_price_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load columns (list of features)
with open(BASE_DIR / "columns.pkl", "rb") as f:
    columns = pickle.load(f)

# Extract location columns (skip numeric features)
location_columns = columns[3:]
