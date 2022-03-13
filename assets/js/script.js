// DEFINE VARIABLES
var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentForecastEl = document.querySelector("#current-forecast");
var futureForecastEl = document.querySelector("#five-day-forecast");

// HANDLE SUBMIT EVENT
function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value form input element
    var cityName = searchEl.name.trim();

    if (cityName) {
        getWeatherInfo(cityName);

        // clear old content
        searchEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

// GET CITY WEATHER INFO
function getWeatherInfo(name) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=5&appid=3737458997a633ff13858ff4dd053537";

    // make get request to URL
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayForecast(data, name);
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
function displayForecast(name) {
    // check if API returned any cities
    if (name.length === 0) {
        currentForecastEl.textContent = "No cities by that name were found.";
        return;
    }

    // create current day text
    var currentDay = document.createElement("div");
    currentDay.classList = "list-item flex-row justify-space-between align-center";

    var dayEl = document.createElement("span");
    dayEl.textContent = name;

    // append to container
    currentDay.appendChild(currentForecastEl);
}

// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);