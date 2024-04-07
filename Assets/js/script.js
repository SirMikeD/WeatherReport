const apiKey = '12be7b08bc68b0a7b150b8337fea0c8e';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
const geoBaseUrl = 'https://api.openweathermap.org/geo/1.0/reverse';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');
    const cityName = cityInput.value.trim();
    console.log('City name:', cityName);
    if (cityName) {
        reverseGeocode(cityName);
    }
});

function reverseGeocode(city) {
    console.log('Reverse geocoding for city:', city);
    fetch(`${geoBaseUrl}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0 || !data[0].lat || !data[0].lon) {
                throw new Error('Invalid data returned from API');
            }
            const { lat, lon } = data[0];
            console.log('Reverse geocoding response:', data);
            console.log('Latitude:', lat, 'Longitude:', lon);
            getWeatherData(lat, lon, city);
        })
        .catch(error => console.error('Error fetching reverse geocoding data:', error.message));
}

function getWeatherData(latitude, longitude, city) {
    console.log('Fetching weather data for city:', city);
    fetch(`${weatherBaseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            displayCurrentWeather(data, city);
            saveToLocalStorage(city);
        })
        .catch(error => console.error('Error fetching current weather:', error));
}

function displayCurrentWeather(data, city) {
    currentWeather.innerHTML = `
        <h2>${city}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function saveToLocalStorage(city) {
    let searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryData.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
    displaySearchHistory(searchHistoryData);
}

function displaySearchHistory(history) {
    searchHistory.innerHTML = '';
    history.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => reverseGeocode(city));
        searchHistory.appendChild(button);
    });
}
