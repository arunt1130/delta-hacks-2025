import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { sendDataToBackend } from './send_data';
import axios from 'axios';


export const retirveData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/API/retrive_fire_risk/');
        return response.data; // Return the data received from the backend
    } catch (error) {
        console.error('Error fetching fire risk data:', error);
        throw error; // Throw error to handle it in the calling component
    }
};