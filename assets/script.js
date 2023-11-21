$(document).ready(function () {
  // OpenWeather API
  const apiKey = "ec4c9727c66b6022014b99c09152f2a9;";

  // Selectors for HTML elements to display weather information
  const city = $("h2#city");
  const date = $("h32#current-date");
  const weatherIcon = $("img#weather-icon");
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

    function buildURLFromId(id) {
      return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    // Function to display the last 5 searched cities
    function displayCities(pastCities) {
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
});