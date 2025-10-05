import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    sqft: "",
    bhk: "",
    bath: "",
    location: "",
  });

  const [locations, setLocations] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://127.0.0.1:8000"; // your FastAPI URL

  // Fetch available locations when app loads
  useEffect(() => {
    axios
      .get(`${API_BASE}/locations`)
      .then((res) => setLocations(res.data.locations))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit to FastAPI
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);

    try {
      const res = await axios.post(`${API_BASE}/predict`, {
        location: formData.location,
        sqft: parseFloat(formData.sqft),
        bath: parseInt(formData.bath),
        bhk: parseInt(formData.bhk),
      });
      setPredictedPrice(res.data.predicted_price);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="realEstate p-5 m-2 container">
        <div className="text-center mb-4">
          <h3 className="fw-bold">🏠 Real Estate Price Predictor</h3>
        </div>

        {/* Estimated Price Section */}
        {predictedPrice && (
          <div className="row mb-4 justify-content-center">
            <div className="col-lg-4">
              <h3
                className="bg-success text-white text-center p-2 rounded"
                style={{ fontSize: "18px" }}
              >
                Estimated Price: ₹
                {Math.round(predictedPrice).toLocaleString() + " Lakh"} /-
              </h3>
            </div>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="form py-4">
          <div className="row">
            <div className="col-lg-6 p-2">
              <label className="fw-semibold">Area (Square Feet)</label>
              <input
                type="number"
                name="sqft"
                className="form-control"
                placeholder="Enter area in Sq. Ft"
                value={formData.sqft}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-lg-6 p-2">
              <label className="fw-semibold">BHK</label>
              <select
                className="form-select"
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                required
              >
                <option value="">Select BHK</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-6 p-2">
              <label className="fw-semibold">Bathrooms</label>
              <select
                className="form-select"
                name="bath"
                value={formData.bath}
                onChange={handleChange}
                required
              >
                <option value="">Select Bathrooms</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-6 p-2">
              <label className="fw-semibold">Location</label>
              <select
                className="form-select"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Choose Location</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center py-4">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={loading}
            >
              {loading ? "Estimating..." : "Estimate Price"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
