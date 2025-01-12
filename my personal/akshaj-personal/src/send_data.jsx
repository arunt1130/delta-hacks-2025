import axios from 'axios';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';


export const sendDataToBackend = (userData) => {
    axios.post('http://127.0.0.1:8000/API/submit-fire-data/', userData, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        console.log('Response from backend:', response.data);
    })
    .catch((error) => {
        console.error('Error sending data to backend:', error);
    });
};





// Call the function with user data
// sendDataToBackend(exampleData);