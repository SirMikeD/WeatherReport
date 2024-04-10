const apiKey = '12be7b08bc68b0a7b150b8337fea0c8e';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const forecast = document.getElementById('forecast');
const cityListContainer = document.querySelector('.city-list');
const searchHistoryList = document.getElementById('search-history-list');
const cities = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'];

// Load search history from local storage when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistoryList(searchHistory);
});

// Append top 10 cities to the city list container
cities.forEach(city => {
    const cityItem = document.createElement('div');
    cityItem.classList.add('city-item');
    cityItem.textContent = city;
    cityItem.addEventListener('click', () => getWeatherForecast(city));
    cityListContainer.appendChild(cityItem);
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherForecast(cityName);
        saveToLocalStorage(cityName);
    }
});

function saveToLocalStorage(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.unshift(city);
    searchHistory = [...new Set(searchHistory)];
    searchHistory = searchHistory.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateSearchHistoryList(searchHistory);
}

function getWeatherForecast(city) {
    clearCurrentWeatherContainer(); // Clear previous current weather container
    fetch(`${weatherBaseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(city, data.list[0]); // Display current weather with city name
            displayForecast(data); // Display forecast for next five days
            displayDate(date);
        })
        .catch(error => console.error('Error fetching weather forecast:', error.message));
}

function displayForecast(data) {
    // Clear previous forecast data
    forecast.innerHTML = '';

    // Group forecast data by day
    const forecastByDay = groupForecastByDay(data.list);

    // Get the next 5 days from the forecast data, starting from index 1 to exclude the current day
    const nextFiveDays = Object.entries(forecastByDay).slice(1, 6);

    // Loop through each day's forecast
    for (const [date, forecastItems] of nextFiveDays) {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        // Create a header for the day
        const dayHeader = document.createElement('h2');
        dayHeader.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        forecastCard.appendChild(dayHeader);

        // Create an element for the weather icon
        const weatherIcon = document.createElement('img');
        weatherIcon.classList.add('weather-icon');
        const iconUrl = `http://openweathermap.org/img/wn/${forecastItems[0].weather[0].icon}.png`;
        weatherIcon.src = iconUrl;
        forecastCard.appendChild(weatherIcon);

        // Loop through forecast items for the day and display them
        forecastItems.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');

            const timeString = new Date(item.dt * 1000).toLocaleTimeString();
            const temperature = item.main.temp;
            const description = item.weather[0].description;

            forecastItem.innerHTML = `
                <h3>${timeString}</h3>
                <p>Temperature: ${temperature}°C</p>
                <p>Description: ${description}</p>
            `;

            forecastCard.appendChild(forecastItem);
        });

        forecast.appendChild(forecastCard);
    }
}

function displayCurrentWeather(city, currentWeather) {
    const currentWeatherContainer = document.getElementById('current-weather');
    currentWeatherContainer.innerHTML = ''; // Clear previous weather data

    // Create elements to display current weather information
    const currentWeatherHeader = document.createElement('h2');
    currentWeatherHeader.textContent = 'Current Weather';
    currentWeatherContainer.appendChild(currentWeatherHeader); // Add Current Weather header first

    const cityName = document.createElement('h3');
    cityName.textContent = `City: ${city}`;
    currentWeatherContainer.appendChild(cityName); // Add City Name below Current Weather header

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const date = document.createElement('p');
    date.textContent = `Date: ${currentDate}`;
    currentWeatherContainer.appendChild(date); // Add Date after City Name

    const description = document.createElement('p');
    description.textContent = `Description: ${currentWeather.weather[0].description}`;
    currentWeatherContainer.appendChild(description); // Add Description after Date

    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${currentWeather.main.temp}°C`;
    currentWeatherContainer.appendChild(temperature); // Add Temperature after Description

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weather-icon');
    const iconUrl = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
    weatherIcon.src = iconUrl;
    currentWeatherContainer.appendChild(weatherIcon);

    // Show the current weather container
    currentWeatherContainer.style.display = 'block';
}

function clearCurrentWeatherContainer() {
    const currentWeatherContainer = document.getElementById('current-weather');
    currentWeatherContainer.innerHTML = ''; // Clear previous weather data
    currentWeatherContainer.style.display = 'none'; // Hide the current weather container
}

function groupForecastByDay(forecastList) {
    const forecastByDay = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(item);
    });
    return forecastByDay;
}

function updateSearchHistoryList(history) {
    // Clear previous search history list
    searchHistoryList.innerHTML = '';
    // Add new search history items
    history.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('city-item');
        listItem.textContent = city;
        listItem.addEventListener('click', () => getWeatherForecast(city));
        searchHistoryList.appendChild(listItem);
    });
}
