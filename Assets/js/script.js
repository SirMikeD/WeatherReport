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
    // Implement logic to display forecast data in your HTML
}
