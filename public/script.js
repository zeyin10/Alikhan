/**
 * Weather & News Dashboard - Frontend JavaScript
 * Handles API calls and UI updates
 */

const API_BASE_URL = '';

/**
 * Fetch weather and news data for a given city
 */
async function fetchWeatherData() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    // Reset UI state
    hideErrorMessage();
    hideWeatherSection();
    hideNewsSection();
    
    if (!city) {
        showErrorMessage('Please enter a city name');
        return;
    }
    
    showLoading();
    
    try {
        // Fetch combined data (weather + news)
        const response = await fetch(`${API_BASE_URL}/api/data?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to fetch data');
        }
        
        hideLoading();
        
        // Display weather data
        displayWeatherData(data.weather);
        
        // Display news data if available
        if (data.news && data.news.articles && data.news.articles.length > 0) {
            displayNewsData(data.news.articles);
        } else {
            displayNoNews();
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoading();
        showErrorMessage(error.message || 'Failed to fetch data. Please try again.');
    }
}

/**
 * Display weather data in the UI
 */
function displayWeatherData(weather) {
    document.getElementById('cityName').textContent = weather.city;
    document.getElementById('countryCode').textContent = weather.countryCode;
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('description').textContent = weather.description;
    document.getElementById('feelsLike').textContent = `${weather.feelsLike}°C`;
    document.getElementById('windSpeed').textContent = `${weather.windSpeed} m/s`;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
    document.getElementById('pressure').textContent = `${weather.pressure} hPa`;
    document.getElementById('rainVolume').textContent = weather.rainVolume > 0 
        ? `${weather.rainVolume} mm` 
        : 'No rain';
    document.getElementById('coordinates').textContent = 
        `${weather.coordinates.lat.toFixed(2)}, ${weather.coordinates.lon.toFixed(2)}`;
    
    // Set weather icon
    if (weather.icon) {
        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        document.getElementById('weatherIcon').alt = weather.description;
    }
    
    showWeatherSection();
}

/**
 * Display news articles in the UI
 */
function displayNewsData(articles) {
    const newsContainer = document.getElementById('newsArticles');
    newsContainer.innerHTML = '';
    
    articles.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
    
    showNewsSection();
}

/**
 * Create a news card element
 */
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const image = article.imageUrl 
        ? `<img src="${article.imageUrl}" alt="${article.title}" class="news-image" onerror="this.style.display='none'">`
        : '';
    
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        ${image}
        <div class="news-content">
            <div class="news-source">${article.source || 'Unknown Source'}</div>
            <h3 class="news-title">${article.title || 'No title available'}</h3>
            <p class="news-description">${article.description || 'No description available'}</p>
            <div class="news-date">${publishedDate}</div>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-link">
                Read more →
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Display message when no news is available
 */
function displayNoNews() {
    const newsContainer = document.getElementById('newsArticles');
    newsContainer.innerHTML = '<div class="no-news">No news articles available for this location.</div>';
    showNewsSection();
}

/**
 * Show/hide UI elements
 */
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function showWeatherSection() {
    document.getElementById('weatherSection').style.display = 'block';
}

function hideWeatherSection() {
    document.getElementById('weatherSection').style.display = 'none';
}

function showNewsSection() {
    document.getElementById('newsSection').style.display = 'block';
}

function hideNewsSection() {
    document.getElementById('newsSection').style.display = 'none';
}

function showErrorMessage(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function hideErrorMessage() {
    const errorEl = document.getElementById('errorMessage');
    errorEl.classList.remove('show');
}

/**
 * Event Listeners
 */

// Search button click
document.getElementById('searchBtn').addEventListener('click', fetchWeatherData);

// Enter key press in input field
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherData();
    }
});

// Clear error message when user starts typing
document.getElementById('cityInput').addEventListener('input', () => {
    hideErrorMessage();
});
