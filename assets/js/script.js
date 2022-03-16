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
var dayOneEl = document.querySelector("#day-1");
var dayTwoEl = document.querySelector("#day-2");
var dayThreeEl = document.querySelector("#day-3");
var dayFourEl = document.querySelector("#day-4");
var dayFiveEl = document.querySelector("#day-5");
const searchEl = document.getElementById("search-button-container");
const clearEl = document.getElementById("clear-history");
let searchHistory = JSON.parse(localStorage.getItem("search"));


// HANDLE SUBMIT EVENT
function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value form input element
    var cityName = userInputEl.value;

    if (cityName) {
        getWeatherInfo(cityName);
        addToSearchHistory();

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
        tempEl.innerHTML = "Temperature: " + data.main.temp + "°F";
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

    if (lonLat.current.uvi <= 2) {
        uvEl.style.backgroundColor = "#5CF144";
    } else if (lonLat.current.uvi <= 5) {
        uvEl.style.backgroundColor = "#FAFA75";
    } else {
        uvEl.style.backgroundColor = "#FE1515";
    }
};

// DISPLAY 5 DAY FORCAST & PULL DATA FROM LonLat
function displayFiveDay(lonLat) {
    for (var i = 1; i < lonLat.daily.length - 2; i++) {
        
        // date
        // convert unix to readable day
        const unixTimestamp = lonLat.daily[i].dt;
        const milliseconds = unixTimestamp * 1000;
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        console.log(humanDateFormat);
        // display Date
        const forecastDate = document.createElement("p");
        forecastDate.innerText = humanDateFormat;
        
        // 5 day temp
        console.log(lonLat.daily[i].feels_like.day);
        const forecastTemp = document.createElement("p");
        forecastTemp.innerText = "Temp: " + lonLat.daily[i].feels_like.day + "°F";
        //fiveDayEl.appendChild(forecastTemp);

        // wind speed
        const forecastWind = document.createElement("p");
        forecastWind.innerText = "Wind Speed: " + lonLat.daily[i].wind_speed + " mph";
        //fiveDayEl.appendChild(forecastWind);

        // humidity
        const forecastHumidity = document.createElement("p");
        forecastHumidity.innerText = "Humidity: " + lonLat.daily[i].humidity + "%";
        //fiveDayEl.appendChild(forecastHumidity);

        // display information in certain div based on index date
        if (i == 1) {
            dayOneEl.innerHTML = ""
            dayOneEl.append(forecastDate);
            dayOneEl.append(forecastTemp);
            dayOneEl.append(forecastWind);
            dayOneEl.append(forecastHumidity);
        } else if (i == 2) {
            dayTwoEl.innerHTML = ""
            dayTwoEl.append(forecastDate);
            dayTwoEl.append(forecastTemp);
            dayTwoEl.append(forecastWind);
            dayTwoEl.append(forecastHumidity);
        } else if (i == 3) {
            dayThreeEl.innerHTML = ""
            dayThreeEl.append(forecastDate);
            dayThreeEl.append(forecastTemp);
            dayThreeEl.append(forecastWind);
            dayThreeEl.append(forecastHumidity);
        } else if (i == 4) {
            dayFourEl.innerHTML = ""
            dayFourEl.append(forecastDate);
            dayFourEl.append(forecastTemp);
            dayFourEl.append(forecastWind);
            dayFourEl.append(forecastHumidity);
        } else {
            dayFiveEl.innerHTML = ""
            dayFiveEl.append(forecastDate);
            dayFiveEl.append(forecastTemp);
            dayFiveEl.append(forecastWind);
            dayFiveEl.append(forecastHumidity);
        };
    }
};

function addToSearchHistory () {
    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory.push(userInputEl.value);
    localStorage.setItem("search", JSON.stringify(searchHistory));

    historyEl.insertAdjacentHTML("afterbegin", `<button id="${userInputEl.value}" onclick = "handleHistoryClick(event)">${userInputEl.value}</button>`)
};

if (searchHistory) {
    for (let i = 0; i < searchHistory.length; i++) {
        historyEl.insertAdjacentHTML("afterbegin", `<button id="${searchHistory[i]}" onclick = "handleHistoryClick(event)">${searchHistory[i]}</button>`)
    }
};

function handleHistoryClick(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value form input element
    var cityName = event.target.id;

    if (cityName) {
        getWeatherInfo(cityName);

        // clear old content
        userInputEl.value = "";
    }
};

function clearSearch() {
    historyEl.innerHTML = "";
    localStorage.clear();

}

// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);
