// 
// DEFINE VARIABLES
//
// search form container
var userFormEl = document.querySelector("#user-form");
// text input
var userInputEl = document.querySelector("#search");
// current day container
var currentDayEl = document.querySelector("#current-day-text");
// given current day temp
var tempEl = document.getElementById("temp");
// given current wind
var windEl = document.querySelector("#wind");
// given current humidity
var humidityEl = document.querySelector("#humidity");
// given current UV index
var uvEl = document.querySelector("#UV-index");
// city name
var cityEl = document.querySelector("#city-name");
var historyEl = document.querySelector("#search-history");
var fiveHeaderEl = document.querySelector("#five-day-header");
var currentDayEl = document.querySelector("#current-day");


// HANDLE SUBMIT EVENT
function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value form input element
    var cityName = userInputEl.value;

    if (cityName) {
        getWeatherInfo(cityName);

        // clear old content
        userInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

// GET CITY WEATHER INFO - GEOCODE VERSION SO USER CAN TYPE CITY
function getWeatherInfo(local_names) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + local_names + "&units=imperial&appid=3737458997a633ff13858ff4dd053537";

    // make get request to URL
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            // display current day in header
            response.json()
            .then(function(data) {
                console.log(data);
                console.log(tempEl);
                displayForecast(data);
            });
            // response recieved but error with request
        } else {
            alert("Error: " + response.statusText);
        }
    })
    // provide user info if server can't be reached
    .catch(function(error) {
        alert("Unable to connect to Open Weather");
    });
};

// DISPLAY 5 DAY FORECAST
function displayForecast(data) {
    // check if API returned any cities
    if (data === 0) {
        currentDayEl.textContent = "No cities by that name were found.";
        return;
    }

    if (data) {
        cityEl.innerHTML = data.name;
        tempEl.innerHTML = "Temperature: " + data.main.temp + "°";
        windEl.innerHTML = "Wind Speed: " + data.wind.speed + "mph";
        humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        uvEl.innerHTML = "UV-Index: " + data.uvi + "";
    }
};

// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);