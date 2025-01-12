// filepath: /Users/akshaj/Coding (on mac)/my personal/akshaj-personal/src/App.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { sendDataToBackend } from './send_data';

function App() {
  const [fires, setFires] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [city, setCity] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const apiKey = 'bcba66dd6814936acfb57a37018a4848'; // Replace with your actual API key
    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?api_key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the data to verify the structure
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const recentFires = data.events.filter(event => new Date(event.geometry[0].date) >= oneMonthAgo);
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

          const locationData = {
            longitude: location[0],
            latitude: location[1]
          }
          
          sendDataToBackend(locationData);

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
    const geocodingApiKey = '45006f4114e645bc80b14ac0f6530c1d'; // Replace with your actual OpenCage API key
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

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    // Call Cohere API
    const cohereApiKey = '88nb99FJsBIdnUFpPwU7LWlDuPxF1gvbDX9hCVQ1'; 
    axios.post('https://api.cohere.ai/generate', {
      model: 'xlarge',
      prompt: `User: ${input}\nAI:`,
      max_tokens: 50,
      temperature: 0.7,
      k: 0,
      stop_sequences: ['\n'],
      return_likelihoods: 'NONE'
    }, {
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const aiMessage = { text: response.data.generations[0].text.trim(), sender: 'ai' };
      setMessages([...messages, newMessage, aiMessage]);
    })
    .catch(error => console.error('Error fetching data from Cohere API:', error));
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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="./assets/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Search</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <form onSubmit={handleCitySubmit}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
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
      <div className="chatbot">
        <h2>Chatbot</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;