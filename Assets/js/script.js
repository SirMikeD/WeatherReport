const apiKey = '12be7b08bc68b0a7b150b8337fea0c8e';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const forecast = document.getElementById('forecast');
const cityListContainer = document.querySelector('.city-list');
const cities = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'];

cities.forEach(city => {
    const cityItem = document.createElement('div');
    cityItem.classList.add('city-item');
    cityItem.textContent = city;
    cityItem.addEventListener('click', () => getWeatherForecast(city)); // Add click event listener to fetch forecast
    cityListContainer.appendChild(cityItem);
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherForecast(cityName);
    }
});

function getWeatherForecast(city) {
    fetch(`${weatherBaseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
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

    // Group forecast data by day
    const forecastByDay = groupForecastByDay(data.list);

    // Loop through each day's forecast
    for (const [date, forecastItems] of Object.entries(forecastByDay)) {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        // Create a header for the day
        const dayHeader = document.createElement('h2');
        dayHeader.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        forecastCard.appendChild(dayHeader);

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
