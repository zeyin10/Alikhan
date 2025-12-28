/**
 * Weather & News API Server
 * Backend server that integrates OpenWeather API and News API
 * All API calls are made server-side for security and clean architecture
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// API Keys (should be stored in .env file in production)
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';

/**
 * Weather API Endpoint
 * Fetches weather data from OpenWeather API for a given city
 * Returns: temperature, description, coordinates, feels-like, wind speed, country code, rain volume
 */
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'City parameter is required',
        example: '/api/weather?city=London'
      });
    }

    // OpenWeather API endpoint
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const weatherResponse = await axios.get(weatherUrl);

    const weatherData = weatherResponse.data;

    // Process and structure the response
    const processedData = {
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      },
      feelsLike: Math.round(weatherData.main.feels_like),
      windSpeed: weatherData.wind?.speed || 0,
      countryCode: weatherData.sys.country,
      rainVolume: weatherData.rain?.['3h'] || 0, // Rain volume for last 3 hours in mm
      city: weatherData.name,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      icon: weatherData.weather[0].icon
    };

    res.json(processedData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'City not found',
        message: 'Please check the city name and try again'
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your OpenWeather API key'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

/**
 * News API Endpoint
 * Fetches news articles related to the city/country from News API
 * This is the additional API integration as required
 */
app.get('/api/news', async (req, res) => {
  try {
    const { city, country } = req.query;

    if (!city && !country) {
      return res.status(400).json({
        error: 'City or country parameter is required',
        example: '/api/news?city=London or /api/news?country=GB'
      });
    }

    // Use city or country as search query
    const query = city || country;
    
    // News API endpoint (using free tier)
    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;

    const newsResponse = await axios.get(newsUrl);

    const newsData = newsResponse.data;

    // Process and structure the response
    const processedNews = {
      totalResults: newsData.totalResults,
      articles: newsData.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        imageUrl: article.urlToImage
      }))
    };

    res.json(processedNews);
  } catch (error) {
    console.error('News API Error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your News API key'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'API rate limit exceeded',
        message: 'Please try again later'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch news data',
      message: error.message
    });
  }
});

/**
 * Combined Endpoint
 * Fetches both weather and news data for a city
 * This provides a convenient single endpoint for the frontend
 */
app.get('/api/data', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'City parameter is required',
        example: '/api/data?city=London'
      });
    }

    // Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    // Process weather data
    const processedWeather = {
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      },
      feelsLike: Math.round(weatherData.main.feels_like),
      windSpeed: weatherData.wind?.speed || 0,
      countryCode: weatherData.sys.country,
      rainVolume: weatherData.rain?.['3h'] || 0,
      city: weatherData.name,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      icon: weatherData.weather[0].icon
    };

    // Fetch news data for the city
    let newsData = null;
    try {
      const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(city)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
      const newsResponse = await axios.get(newsUrl);
      
      newsData = {
        totalResults: newsResponse.data.totalResults,
        articles: newsResponse.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name,
          imageUrl: article.urlToImage
        }))
      };
    } catch (newsError) {
      console.error('News API Error (non-blocking):', newsError.message);
      // Continue without news data if it fails
      newsData = {
        totalResults: 0,
        articles: [],
        error: 'News data unavailable'
      };
    }

    res.json({
      weather: processedWeather,
      news: newsData
    });
  } catch (error) {
    console.error('Combined API Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'City not found',
        message: 'Please check the city name and try again'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch data',
      message: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Weather API endpoint: http://localhost:${PORT}/api/weather?city=London`);
  console.log(`📰 News API endpoint: http://localhost:${PORT}/api/news?city=London`);
  console.log(`🌐 Combined endpoint: http://localhost:${PORT}/api/data?city=London`);
  
  if (OPENWEATHER_API_KEY === 'demo_key' || NEWS_API_KEY === 'demo_key') {
    console.warn('⚠️  Warning: Using demo API keys. Please set your API keys in .env file');
  }
});
