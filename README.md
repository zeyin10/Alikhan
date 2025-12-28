# Weather & News Dashboard - Assignment 2

A full-stack web application that integrates OpenWeather API and News API to provide real-time weather data and local news for any city. All API calls are made server-side for security and clean architecture.

## 🌟 Features

- **Real-time Weather Data**: Get comprehensive weather information including:
  - Temperature
  - Weather description
  - Coordinates (latitude/longitude)
  - Feels-like temperature
  - Wind speed
  - Country code
  - Rain volume (last 3 hours)
  - Humidity and pressure

- **Local News Integration**: Fetch relevant news articles related to the searched city/region using News API

- **Responsive Design**: Beautiful, modern UI that works seamlessly on desktop, tablet, and mobile devices

- **Server-Side API Calls**: All third-party API communications happen on the server, keeping API keys secure

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **APIs**: 
  - OpenWeather API (Weather data)
  - News API (News articles)
- **Dependencies**: axios, express, cors, dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- API Keys:
  - OpenWeather API key (free from [openweathermap.org](https://openweathermap.org/api))
  - News API key (free from [newsapi.org](https://newsapi.org/))

## 🚀 Setup Instructions

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd assignment2
```

### 2. Install Dependencies

Install all required npm packages:
```bash
npm install
```

This will install:
- express
- axios
- cors
- dotenv

### 3. Configure API Keys

Create a `.env` file in the root directory:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_news_api_key_here
PORT=3000
```

**How to get API keys:**

1. **OpenWeather API Key:**
   - Visit [https://openweathermap.org/api](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API keys section
   - Copy your API key

2. **News API Key:**
   - Visit [https://newsapi.org/](https://newsapi.org/)
   - Sign up for a free account
   - Copy your API key from the dashboard

### 4. Start the Server

Run the server:
```bash
npm start
```

Or:
```bash
node server.js
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### 5. Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## 📡 API Endpoints

### 1. Weather Endpoint
**GET** `/api/weather?city={cityName}`

Returns weather data for the specified city.

**Example:**
```
GET /api/weather?city=London
```

**Response:**
```json
{
  "temperature": 15,
  "description": "clear sky",
  "coordinates": {
    "lat": 51.5074,
    "lon": -0.1278
  },
  "feelsLike": 14,
  "windSpeed": 3.5,
  "countryCode": "GB",
  "rainVolume": 0,
  "city": "London",
  "humidity": 65,
  "pressure": 1013,
  "icon": "01d"
}
```

### 2. News Endpoint
**GET** `/api/news?city={cityName}` or `/api/news?country={countryCode}`

Returns news articles related to the city or country.

**Example:**
```
GET /api/news?city=London
```

**Response:**
```json
{
  "totalResults": 1234,
  "articles": [
    {
      "title": "Article Title",
      "description": "Article description",
      "url": "https://example.com/article",
      "publishedAt": "2024-01-01T12:00:00Z",
      "source": "BBC News",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### 3. Combined Endpoint
**GET** `/api/data?city={cityName}`

Returns both weather and news data in a single request.

**Example:**
```
GET /api/data?city=London
```

**Response:**
```json
{
  "weather": { /* weather data */ },
  "news": { /* news data */ }
}
```

## 🎨 Design Decisions

### 1. Server-Side API Integration
- **Reason**: API keys are kept secure on the server, not exposed to the client
- **Benefit**: Prevents API key theft and maintains security best practices
- **Implementation**: All API calls made via Express server using axios

### 2. Responsive Design
- **Approach**: CSS Grid and Flexbox for layout, media queries for breakpoints
- **Breakpoints**: 
  - Desktop: > 768px (full grid layout)
  - Tablet: 481px - 768px (adjusted grid)
  - Mobile: < 480px (single column layout)
- **Features**: Touch-friendly buttons, readable fonts, optimized spacing

### 3. Error Handling
- Client-side validation for empty inputs
- Server-side error handling with appropriate HTTP status codes
- User-friendly error messages displayed in the UI
- Graceful degradation (news API failures don't block weather display)

### 4. Code Organization
- **Backend**: Single `server.js` file with clear route separation and comments
- **Frontend**: Separate files for HTML, CSS, and JavaScript
- **Modular Functions**: Frontend JavaScript uses separate functions for each UI operation

### 5. User Experience
- Loading indicators during API calls
- Smooth animations and transitions
- Clear visual hierarchy
- Accessible color contrast
- Keyboard navigation support (Enter key to search)

## 📁 Project Structure

```
assignment2/
├── public/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Stylesheet with responsive design
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server and API routes
├── package.json        # Dependencies and scripts
├── .env                # Environment variables (create this file)
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (set in `.env` file):

- `OPENWEATHER_API_KEY`: Your OpenWeather API key (required)
- `NEWS_API_KEY`: Your News API key (required)
- `PORT`: Server port (default: 3000)

### Port Configuration

Change the port by:
1. Setting `PORT` in `.env` file, or
2. Setting the `PORT` environment variable, or
3. Modifying the default in `server.js`

## 🐛 Troubleshooting

### Server won't start
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is already in use

### API errors
- Verify API keys are correct in `.env` file
- Check API key quotas/limits on OpenWeather and News API websites
- Ensure internet connection is active

### No data displayed
- Check browser console for errors (F12)
- Verify server is running
- Check server logs for API errors
- Ensure city name is spelled correctly

### News API rate limits
- Free tier of News API has rate limits
- If exceeded, weather data will still display
- Consider upgrading API plan or implementing caching

## 📝 Testing with Postman

### Testing Weather Endpoint

1. Open Postman
2. Create a new GET request
3. URL: `http://localhost:3000/api/weather?city=London`
4. Send request
5. Check response for weather data

### Testing News Endpoint

1. Create a new GET request
2. URL: `http://localhost:3000/api/news?city=London`
3. Send request
4. Check response for news articles

### Testing Combined Endpoint

1. Create a new GET request
2. URL: `http://localhost:3000/api/data?city=London`
3. Send request
4. Check response for both weather and news data

## 📸 Screenshots

*Note: Add screenshots of your application here showing:*
- Main interface with weather data
- News section
- Mobile responsive view
- Postman API responses

## 🚦 API Rate Limits

- **OpenWeather API**: Free tier allows 60 calls/minute
- **News API**: Free tier allows 100 requests/day

Consider implementing caching or request throttling for production use.

## 📄 License

This project is created for educational purposes as part of Assignment 2.

## 👨‍💻 Author

[Your Name]

## 🙏 Acknowledgments

- OpenWeather for weather data API
- News API for news articles
- Express.js community for excellent documentation
