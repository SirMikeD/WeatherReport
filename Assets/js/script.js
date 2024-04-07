const apiKey = '12be7b08bc68b0a7b150b8337fea0c8e';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherForecast(cityName);
    }
});

function getWeatherForecast(city) {
    fetch(`${weatherBaseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching weather forecast:', error.message));
}

function displayForecast(data) {
    // Clear previous forecast data
    forecast.innerHTML = '';

    // Loop through forecast data and display each day's forecast
    data.list.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();

        const temperature = item.main.temp;
        const description = item.weather[0].description;

        forecastItem.innerHTML = `
            <h3>${dateString} - ${timeString}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Description: ${description}</p>
        `;

        forecast.appendChild(forecastItem);
    });
}