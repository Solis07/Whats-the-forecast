$(document).ready(function () {
  // OpenWeather API
  const apiKey = "96076f068c047cec03b9b5a523ca0775";

  // Selectors for HTML elements to display weather information
  const cityName = $("h2#city");
  const date = $("h3#current-date");
  const weatherImg = $("img#weather-icon");
  const temperature = $("span#current-temperature");
  const humidity = $("span#current-humidity");
  const wind = $("span#current-wind");
  const cityList = $("div.city-list");

  // Selectors for form elements
  const cityInput = $("#city-input");

  // Store past searched cities
  let recentCities = [];

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
    const storedCities = JSON.parse(localStorage.getItem("recentCities"));
    if (storedCities) {
      recentCities = storedCities;
    }
  }

  // Store searched cities in local storage
  function storeCities() {
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
      method: "GET",
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
      storeCities();
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

      // Call OpenWeather API OneCall with lat and lon to get the UV index and 5 day forecast
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      let queryURLAll = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;                       
       $.ajax({
        url: queryURLAll,
        method: "GET",
      }).then(function (response) {

        let fiveDay = response.daily;

        // Display 5 day forecast in DOM elements
        for (let i = 0; i <= 5; i++) {
          let currDay = fiveDay[i];
          $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format("L"));
          $(`div.day-${i} .future-img`).attr(
              "src",
              `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
            )
            .attr("alt", currDay.weather[0].description);
          $(`div.day-${i} .future-temperature`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
          $(`div.day-${i} .future-humidity`).text(currDay.humidity);
        }
      });
    });
  }

  // Function to display the last searched city
  function displayLastSearchedCity() {
    if (recentCities[0]) {
      let queryURL = buildURLFromId(recentCities[0].id);
      searchWeather(queryURL);
    } else {
      // if no past searched cities, load San Antonio weather data
      let queryURL = buildURLFromInputs("San Antonio");
      searchWeather(queryURL);
    }
  }

  // Click handler for search button
  $("#search-btn").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    // Retrieving and scrubbing the city from the inputs
    let city = cityInput.val().trim();
    city = city.replace(" ", "%20");

    // Clear the input fields
    cityInput.val("");

    // Build the query url with the city and searchWeather
    if (city) {
      let queryURL = buildURLFromInputs(city);
      searchWeather(queryURL);
    }
  });

  // Click handler for city buttons to load that city's weather
  $(document).on("click", "button.city-btn", function (event) {
    let clickedCity = $(this).text();
    let foundCity = $.grep(recentCities, function (storedCity) {
      return clickedCity === storedCity.city;
    });
    let queryURL = buildURLFromId(foundCity[0].id);
    searchWeather(queryURL);
  });

  // Initialization - when page loads

  // load any cities in local storage into array
  loadCities();
  displayCities(recentCities);

  // Display weather for last searched city
  displayLastSearchedCity();
});