import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { sendDataToBackend } from './send_data';
import logo from './assets/logo_FINAL.jpg'; 
import axios from "axios";


function App() {
  const [fires, setFires] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [city, setCity] = useState('');
  const [fireRiskData, setFireRiskData] = useState(null);
  const [survivalChance, setSurvivalChance] = useState('Calculating...');

  useEffect(() => {
        const fetchFireRiskData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/API/retrive_fire_risk/');
                setFireRiskData(response.data); 
            } catch (error) {
                console.error('Error fetching fire risk data:', error);
            }
        };

        fetchFireRiskData(); 
    }, []);

  useEffect(() => {
    const apiKey = 'bcba66dd6814936acfb57a37018a4848'; 
    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?api_key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const recentFires = data.events.filter(event => new Date(event.geometry[0].date) >= tenDaysAgo);
        setFires(recentFires);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          alert(`Your location: Latitude ${location[0]}, Longitude ${location[1]}`);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  
  const handleCitySubmit = (e) => {
    e.preventDefault();
    const geocodingApiKey = '45006f4114e645bc80b14ac0f6530c1d'; 
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodingApiKey}`;

    fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        const { lat, lng } = data.results[0].geometry;
        setUserLocation([lat, lng]);
        alert(`Location for ${city}: Latitude ${lat}, Longitude ${lng}`);
      })
      .catch(error => console.error('Error fetching geocoding data:', error));
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: (event) => {
        setMapBounds(event.target.getBounds());
      },
    });
    return null;
  };

  const filteredFires = fires.filter(fire =>
    fire.geometry.some(geo =>
      mapBounds && mapBounds.contains([geo.coordinates[1], geo.coordinates[0]])
    )
  );

  const formatFireRiskData = (data) => {
    if (!data) return 'Loading...';
    if (typeof data !== 'string') {
      data = JSON.stringify(data, null, 2); // Convert non-string data to a formatted string
    }
    const lines = data.split('\n\n');
    return (
      <ul className="fire-risk-list">
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  };


  return (
    <>
      <div>
        <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
      </div>
      <h1 className="alerts">Alerts in Your Area</h1>
      <form onSubmit={handleCitySubmit}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
          className="city-input"
        />
        <button type="submit" className="city-submit">Search</button>
      </form>
      <div className="map-and-data">
        <MapContainer center={userLocation} zoom={2} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents />
          {filteredFires.map((fire, index) => (
            fire.geometry.map((geo, idx) => (
              <Marker key={`${index}-${idx}`} position={[geo.coordinates[1], geo.coordinates[0]]}>
                <Popup>
                  {fire.title}
                </Popup>
              </Marker>
            ))
          ))}
        </MapContainer>
        <h2>Chance of Survival: {survivalChance}</h2>
        <hr className="divider" />
        <h2>How AI Can Help You!</h2>
        <div className="fire-risk-data">
          {formatFireRiskData(fireRiskData)}
        </div>
      </div>
    </>
  );
}

export default App;