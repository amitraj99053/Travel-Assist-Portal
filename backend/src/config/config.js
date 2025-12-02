require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-assist-portal',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
};
