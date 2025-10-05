from .model import columns,model
import numpy as np
import pandas as pd

def predict_price(location:str,sqft: float, bath: int, bhk: int)->float:
    """
    Predict house price using trained model and columns.
    Returns rounded predicted price.
    """
     # Input vector
    column_list = list(columns)
    x = np.zeros(len(column_list))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    # Set location dummy
    if location in column_list:
        loc_index = column_list.index(location)
        x[loc_index] = 1

  # Convert x to DataFrame with correct column names
    input_df = pd.DataFrame([x], columns=columns)

    price = model.predict(input_df)[0]
    return round(price, 2)