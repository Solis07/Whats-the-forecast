$(document).ready(function () {
  
  // OpenWeather API
  const apiKey = "ec4c9727c66b6022014b99c09152f2a9;";

  // Selectors for HTML elements to display weather information
  const cityName = $("h2#city");
  const date = $("h32#current-date");
  const weatherImg = $("img#weather-icon");
  const temperature = $("span#current-temperature");
  const humidity = $("span#current-humidity");
  const wind = $("span#current-wind");
  const cityList = $("div.cityList");

  // Selectors for form elements
  const cityInput = $("#city-search");

  // Store past searched cities
  let recentCities = [];

  // Helper function to sort cities from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
      comparison = 1;
    } else if (cityA < cityB) {
      comparison = -1;
    }
    return comparison;
  }

  // Local storage functions for past searched cities

  // Load events from local storage
  function loadCities() {
    const savedCities = JSON.parse(localStorage.getItem("recentCities"));
    if (savedCities) {
      recentCities = savedCities;
    }
  }

  // Store searched cities in local storage
  function searchedCities() {
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }

   function buildURLFromInputs(city) {
     if (city) {
       return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
     }
   }

    function buildURLFromId(id) {
      return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    // Function to display the last 5 searched cities
    function displayCities(recentCities) {
      cityList.empty();
      recentCities.splice(5);
      let sortedCities = [...recentCities];
      sortedCities.sort(compare);
      sortedCities.forEach(function (location) {
        let cityDiv = $("<div>").addClass("col-12 city");
        let cityBtn = $("<button>")
          .addClass("btn btn-light city-btn")
          .text(location.city);
        cityDiv.append(cityBtn);
        cityList.append(cityDiv);
      });
    }
  
    // Search for weather conditions by calling the OpenWeather API
  function searchWeather(queryURL) {

    // Create an AJAX call to retrieve weather data
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      // Store current city in past cities
      let city = response.name;
      let id = response.id;
      // Remove duplicate cities
      if (recentCities[0]) {
        recentCities = $.grep(recentCities, function (storedCity) {
          return id !== storedCity.id;
        });
      }
      recentCities.unshift({ city, id });
      searchedCities();
      displayCities(recentCities);

      // Display current weather in DOM elements
      cityName.text(response.name);
      let formattedDate = moment.unix(response.dt).format("L");
      date.text(formattedDate);
      let weatherIcon = response.weather[0].icon;
      weatherImg
        .attr("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`)
        .attr("alt", response.weather[0].description);
      temperature.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
      humidity.text(response.main.humidity);
      wind.text((response.wind.speed * 2.237).toFixed(1));
    });
  };
  
});