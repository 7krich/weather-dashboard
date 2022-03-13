// DEFINE VARIABLES
var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");

// HANDLE SUBMIT EVENT
function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value form input element
    var cityName = searchEl.ariaValueMax.trim();

    if (cityName) {
        getSearchResult(cityName);

        // clear old content
        searchEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

// GET CITY WEATHER INFO
function getWeatherInfo(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=3737458997a633ff13858ff4dd053537";

    // make get request to URL
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayCity(data, city);
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

//