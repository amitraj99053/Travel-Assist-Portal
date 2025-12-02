const axios = require('axios');
const config = require('../config/config');

// Get distance between two points
const getDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: `${lat1},${lon1}`,
          destinations: `${lat2},${lon2}`,
          key: config.googleMapsApiKey,
        },
      }
    );

    if (response.data.rows[0].elements[0].status === 'OK') {
      return response.data.rows[0].elements[0].distance.value / 1000; // in km
    }
    throw new Error('Unable to calculate distance');
  } catch (error) {
    console.error('Google Maps API error:', error);
    // Fallback: Simple Haversine formula
    return calculateHaversineDistance(lat1, lon1, lat2, lon2);
  }
};

// Haversine formula for approximate distance
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get weather information
const getWeatherInfo = async (lat, lon) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: config.weatherApiKey,
        units: 'metric',
      },
    });

    return {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};

module.exports = {
  getDistance,
  getWeatherInfo,
  calculateHaversineDistance,
};
