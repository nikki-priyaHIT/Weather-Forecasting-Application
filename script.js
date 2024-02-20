// Function to update weather information based on the response from the API
function updateWeather(response) {
  // Selecting elements to display weather data
  let temperatureElement = document.querySelector("#current-stats-value");
  let cityElementOne = document.querySelector("#city-search-one");
  let cityElementTwo = document.querySelector("#city-search-two");
  let conditionsElement = document.querySelector("#condition-description");
  let windSpeedElement = document.querySelector("#current-wind-speed");
  let humidityElement = document.querySelector("#current-humidity");
  let dateTimeElement = document.querySelector("#current-date-time");
  let iconElement = document.querySelector("#current-stats-icon");

  // Updating weather data with information from the API response
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  cityElementOne.innerHTML = response.data.city;
  cityElementTwo.innerHTML = response.data.city;
  conditionsElement.innerHTML = capitalizeFirstLetter(response.data.condition.description);
  windSpeedElement.innerHTML = response.data.wind.speed;
  humidityElement.innerHTML = response.data.temperature.humidity;
  let date = new Date(response.data.time * 1000);
  dateTimeElement.innerHTML = formatedDate(date);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" />`;

  // Fetching forecast data for the selected city
  getForecastData(response.data.city);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to format date and time
function formatedDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day} ${hours}:${minutes}`;
}

// Function to search for a city and update weather data
function searchCity(city) {
  let apiKey = "23e75f7acb80e43d1aa43c2eod7017bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  
  // Making a GET request to the weather API
  axios.get(apiUrl).then(updateWeather);
}

// Function to handle city search form submission
function changeCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-search-input");
  searchCity(searchInput.value);
}

// Event listener for city search form submission
let citySearchElement = document.querySelector("#city-search-form");
citySearchElement.addEventListener("submit", changeCity);

// Default city search on page load
searchCity("Ranchi");

// Function to fetch forecast data for the selected city
function getForecastData(city) {
  let apiKeyForecast = "23e75f7acb80e43d1aa43c2eod7017bt";
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKeyForecast}&units=metric`;
  
  // Making a GET request to the forecast API
  axios.get(apiUrlForecast).then(displayForecast);
}

// Function to format the day for forecast display
function formatDayForForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Function to display forecast data
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  // Looping through each day in the forecast data and generating HTML
  response.data.daily.forEach(function (day) {
    forecastHtml += `<div class="row day-one">
        <div class="col-sm-2">${formatDayForForecast(day.time)}</div>
        <div class="col-sm-3"><strong>${Math.round(day.temperature.maximum)}°C</strong>|${Math.round(day.temperature.minimum)}°C</div>
        <div class="col-sm-3">${day.wind.speed}m/sec</div>
        <div class="col-sm-2"><img src="${day.condition.icon_url}" class="icon-url"/></div>
        <div class="col-sm-2">${day.condition.description}</div>
      </div>`;
  });

  // Updating forecast HTML content
  forecastElement.innerHTML = forecastHtml;
}
