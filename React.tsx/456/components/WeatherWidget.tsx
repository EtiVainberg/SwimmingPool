import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ripple from '../assets/SwimmingPool/Ripple.gif'
import Box from '@mui/material/Box';
import { sendTempToManager } from '../api/api';

interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        description: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
    };
    visibility: number;
}

const API_KEY = 'a319648e388d2cf5d1d2794f83fe98d8';
const LATITUDE = '31.926614007416106';
const LONGITUDE = '35.041902450100054';
const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

const WeatherWidget: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setWeatherData(response.data);
                await sendTempToManager(response.data.main.temp);

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchData();
    }, []);

    const calculatePoolTemperature = (weatherTemperature: number): number => {
        // Desired pool temperature
        const desiredPoolTemperature = 28; // Adjust as needed
    
        // Calculate the difference between the weather temperature and the desired pool temperature
        const temperatureDifference = desiredPoolTemperature - weatherTemperature;
    
        // Adjust the pool temperature based on the difference
        let poolTemperature = desiredPoolTemperature - temperatureDifference;
    
        // Ensure that the pool temperature is within a reasonable range (e.g., between 20°C and 32°C)
        poolTemperature = Math.max(20, Math.min(32, poolTemperature));
    
        return poolTemperature;
    };
    

    if (!weatherData) {
        return <Box sx={{ display: 'flex' }}>
            <img src={ripple} />
        </Box>

    }

    const weatherTemperature = weatherData.main.temp;
    const poolTemperature = calculatePoolTemperature(weatherTemperature);

    return (
        <div>
            <p>Temperature: <b>{weatherData?.main.temp} °C</b></p>
            <p>Pool Temperature: <b>{poolTemperature.toFixed(2)} °C</b> </p>
        </div>
    );
};

export default WeatherWidget;
