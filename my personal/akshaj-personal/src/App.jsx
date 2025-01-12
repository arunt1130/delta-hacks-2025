// filepath: /Users/akshaj/Coding (on mac)/FINAL/delta-hacks-2025/my personal/akshaj-personal/src/App.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { sendDataToBackend } from './send_data';




function App() {
  const [count, setCount] = useState(0);
  const [fires, setFires] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState([0, 0]);

  useEffect(() => {
    const apiKey = 'bcba66dd6814936acfb57a37018a4848'; // Replace with your actual API key
    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?api_key=${apiKey}`;

    // Fetch data from the NASA FIRMS API using fetch
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the data to verify the structure
        setFires(data.events);
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


          const locationData = {
            longatude: location[0],
            latatude: location[1]
        };

        sendDataToBackend(locationData);

        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Search</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <MapContainer center={userLocation} zoom={2} style={{ height: '500px', width: '100%' }}>
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
    </>
  );
}

export default App;