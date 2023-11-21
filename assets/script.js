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
});