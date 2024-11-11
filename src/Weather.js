import React, { useState, useEffect } from 'react';
import './App.css';

function Weather() {
  const [location, setLocation] = useState('Berlin');
  const [weatherData, setWeatherData] = useState(null);


  const fetchWeatherData = (loc) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Berlin`)
      .then(response => response.json())
      .then(data => setWeatherData(data.daily))
      /*.then(data => {
        setWeatherData(data.daily);
        console.log("Weather Data:", data.daily); // Hier werden die Wettercodes geloggt
      })*/
      .catch(error => console.error("Fehler beim Abrufen der Wetterdaten:", error));
  };

  const fetchCoordinates = () => {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=e1d2f0c0f87944aa8e73a12fa0b64c7b`)
      .then(response => response.json())
      .then(data => {
        const { lat, lng } = data.results[0].geometry;
        fetchWeatherData({ latitude: lat, longitude: lng });
      })
      .catch(error => console.error("Fehler beim Abrufen der Koordinaten:", error));
  };

  useEffect(() => {
    fetchCoordinates(); // fetching weather data on first load
  }, []);

  // function to format the current date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
  };

  // function mapping weather codes to corresponding icons and descriptions
const weatherIcons = {
  0: { iconClass: 'wi-day-sunny', description: 'Sunny' },
  1: { iconClass: 'wi-day-cloudy', description: 'Partly Cloudy' },
  2: { iconClass: 'wi-cloudy', description: 'Cloudy' },
  3: { iconClass: 'wi-rain', description: 'Rainy' },
  4: { iconClass: 'wi-snow', description: 'Snowy' },
  5: { iconClass: 'wi-storm-showers', description: 'Stormy Showers' },
  6: { iconClass: 'wi-fog', description: 'Foggy' },
  7: { iconClass: 'wi-windy', description: 'Windy' },
  8: { iconClass: 'wi-day-sleet', description: 'Sleet' },
  9: { iconClass: 'wi-showers', description: 'Showers' },
  10: { iconClass: 'wi-thunderstorm', description: 'Thunderstorm' },
  11: { iconClass: 'wi-snow-wind', description: 'Snow with Wind' },
  12: { iconClass: 'wi-day-sunny-overcast', description: 'Sunny Overcast' },
  13: { iconClass: 'wi-rain-mix', description: 'Mixed Rain' },
  14: { iconClass: 'wi-day-rain', description: 'Daytime Rain' },
  15: { iconClass: 'wi-night-clear', description: 'Clear Night' },
  16: { iconClass: 'wi-night-cloudy', description: 'Cloudy Night' },
  17: { iconClass: 'wi-night-rain', description: 'Rainy Night' },
  18: { iconClass: 'wi-night-snow', description: 'Snowy Night' },
  19: { iconClass: 'wi-night-storm-showers', description: 'Stormy Night Showers' },
  20: { iconClass: 'wi-night-windy', description: 'Windy Night' },
  21: { iconClass: 'wi-day-hail', description: 'Hail' },
  22: { iconClass: 'wi-night-hail', description: 'Night Hail' },
  23: { iconClass: 'wi-dust', description: 'Dusty' },
  24: { iconClass: 'wi-sand', description: 'Sandy' },
  45: { iconClass: 'wi-fog', description: 'Dense Fog' },
  51: { iconClass: 'wi-showers', description: 'Light Showers' },
  61: { iconClass: 'wi-rain-mix', description: 'Mixed Rain' },
  71: { iconClass: 'wi-snowflake-cold', description: 'Cold Snow' },
  77: { iconClass: 'wi-snow-wind', description: 'Snow with Wind' },
  80: { iconClass: 'wi-showers', description: 'Heavy Showers' },
};

// Function to return the icon class and description
const getWeatherIcon = (weatherCode) => {
  return weatherIcons[weatherCode] || { iconClass: 'wi-na', description: 'No Data' };
};


const getDayLabel = (dateString, index) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const forecastDate = new Date(dateString);
  if (forecastDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (forecastDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return formatDate(dateString);
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    fetchCoordinates();
  }
};

return (
  <div className="container text-center mt-5">
    <div className="input-group mb-4">
      <input
        type="text"
        className="form-control"
        id="search-input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter location"
      />
      <button className="btn" id='search-btn' onClick={fetchCoordinates}>Search</button>
    </div>
    <h2>Weather forecast for <span id="location">{location}</span></h2>
    
    {weatherData ? (
      <div className="row d-flex flex-column flex-md-row flex-wrap justify-content-center" id="weather-output">
        {weatherData.time.map((date, index) => (
          <div key={index} className="col-12 col-md-3 col-lg-1 m-2 day-container flex-effect">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{getDayLabel(date, index)}</h5>
                <i className={`wi ${getWeatherIcon(weatherData.weathercode[index]).iconClass} display-5 padding`}></i>
                <p className="description">{getWeatherIcon(weatherData.weathercode[index]).description}</p>
                <p className="card-text mt-auto temperature">
                  Max: <b>{weatherData.temperature_2m_max[index]}°C</b><br />
                  Min: <b>{weatherData.temperature_2m_min[index]}°C</b>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="spinner"></div>
    )}
  </div>
);

}
export default Weather;
