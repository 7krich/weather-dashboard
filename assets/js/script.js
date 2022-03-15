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
var fiveDayEl = document.querySelector(".five-day");
var dayOneEl = document.querySelector(".day-1");
var day2El = document.querySelector(".day-2");
var day3El = document.querySelector("#day-3");
var day4El = document.querySelector("#day-4");
var day5El = document.querySelector("#day-5");





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

// DISPLAY CURRENT DAY FORECAST
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
    }

    // STORE LON & LAT FROM GETWEATHERINFO TO PASS THROUGH GETGEOINFO BELOW
    if (data){
    let lon = data.coord.lon;
    let lat = data.coord.lat;
    getGeoInfo(lon, lat);
    }
};

//TAKE GEOCODE LON & LAT & REQUEST CALL FROM API WITH COORDINATES FOR ADDITIONAL DATA
function getGeoInfo(lon, lat) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=3737458997a633ff13858ff4dd053537`;

    // make get request to URL
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            // display current day in header
            response.json()
            // call data lonLat to discern from data
            .then(function(lonLat) {
                console.log(lonLat);
                // console.log(tempEl);
                displayUv(lonLat);
                displayFiveDay(lonLat);
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

// DISPLAY CURRENT UV INDEX
function displayUv(lonLat) {
    // check if API returned any cities
    if (lonLat === 0) {
        currentDayEl.textContent = "No cities by that name were found.";
        return;
    }

    if (lonLat) {
        console.log(lonLat);
        uvEl.innerHTML = "UV-Index: " + lonLat.current.uvi;
    }
};

// DISPLAY 5 DAY FORCAST & PULL DATA FROM LonLat
function displayFiveDay(lonLat) {
    for (var i = 0; i < lonLat.daily.length - 3; i++) {
        
        // Date
        // convert unix to readable day
        const unixTimestamp = lonLat.daily[i].dt;
        const milliseconds = unixTimestamp * 1000;
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        console.log(humanDateFormat);
        // display Date
        const forecastDate = document.createElement("p");
        forecastDate.innerText = humanDateFormat;
        document.body.appendChild(forecastDate);
        // 5 day temp
        console.log(lonLat.daily[i].feels_like.day);
        const forecastDays = document.createElement("p");
        forecastDays.innerText = "Temp: " + lonLat.daily[i].feels_like.day;
        document.body.appendChild(forecastDays);
        // styles for 5 day
        //forecastDays.style = "background:";

    }
};





// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);