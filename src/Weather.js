import React, { useState, useEffect } from 'react';

function Weather() {
  const [location, setLocation] = useState('Berlin'); // Standardort
  const [weatherData, setWeatherData] = useState(null);

  // Funktion, um Wetterdaten basierend auf den Koordinaten abzurufen
  const fetchWeatherData = (loc) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Berlin`)
      .then(response => response.json())
      .then(data => setWeatherData(data.daily))
      .catch(error => console.error("Fehler beim Abrufen der Wetterdaten:", error));
  };

  // Funktion, um Koordinaten für den eingegebenen Standort abzurufen
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
    fetchCoordinates(); // Wetterdaten beim ersten Laden abrufen
  }, []);

  // Funktion zur Formatierung des Datums
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
  };

  // Funktion zur Zuordnung der Wettercodes zu den passenden Icons
  const getWeatherIconClass = (weatherCode) => {
    const weatherIcons = {
      0: 'wi-day-sunny',
      1: 'wi-day-cloudy',
      2: 'wi-cloudy',
      3: 'wi-rain',
      4: 'wi-snow',
      5: 'wi-storm-showers',
      6: 'wi-fog',
      7: 'wi-windy',
      8: 'wi-day-sleet',
      9: 'wi-showers',
      10: 'wi-thunderstorm',
      11: 'wi-snow-wind',
      12: 'wi-day-sunny-overcast',
      13: 'wi-rain-mix',
      14: 'wi-day-rain',
      15: 'wi-night-clear',
      16: 'wi-night-cloudy',
      17: 'wi-night-rain',
      18: 'wi-night-snow',
      19: 'wi-night-storm-showers',
      20: 'wi-night-windy',
      21: 'wi-day-hail',
      22: 'wi-night-hail',
      23: 'wi-dust',
      24: 'wi-sand',
      45: 'wi-fog',
      61: 'wi-rain-mix',
    };
    return weatherIcons[weatherCode] || 'wi-na';
  };

  // Funktion zur Bestimmung, ob es sich um den heutigen oder morgigen Tag handelt
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
      return formatDate(dateString); // Für alle anderen Tage den vollständigen Namen
    }
  };

  return (
    <div>
      <h2>Wettervorhersage für {location}</h2>
      <input 
        type="text" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        placeholder="Ort eingeben" 
      />
      <button onClick={fetchCoordinates}>Suche</button>

      {weatherData ? (
        weatherData.time.map((date, index) => (
          <div key={index}>
            <p>
              {getDayLabel(date, index)}: 
              <i className={`wi ${getWeatherIconClass(weatherData.weathercode[index])}`}></i>
              Max: {weatherData.temperature_2m_max[index]}°C, Min: {weatherData.temperature_2m_min[index]}°C
            </p>
          </div>
        ))
      ) : (
        <p>Lade Wetterdaten...</p>
      )}
    </div>
  );
}

export default Weather;
