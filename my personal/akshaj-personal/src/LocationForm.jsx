import React, { useState } from "react";
import axios from "axios";

const LocationForm = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCoordinates(null);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (response.data.length > 0) {
        const location = response.data[0]; // Take the first result
        setCoordinates({
          lat: location.lat,
          lng: location.lon,
        });
      } else {
        setError("Location not found. Try a different address.");
      }
    } catch (err) {
      console.error("Error fetching location data:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Enter a Location</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city or street"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit">Get Coordinates</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {coordinates && (
        <div>
          <h3>Coordinates:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationForm;
