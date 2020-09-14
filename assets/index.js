var cityList = $(".list-group");
var currentDate = moment().format("M/D/YY");
var apiKey = "f2f448fdff7880f3d298bdf08e187544";

function storeWeather(city) {
  latLongURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  requestLatLong = {
    url: latLongURL,
    method: "GET",
  };

  $.ajax(requestLatLong).then(function (responseOne) {
    var currentCity = responseOne.name;
    var lat = responseOne.coord.lat;
    var long = responseOne.coord.lon;

    weatherURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&%20&exclude=minutely,hourly&units=imperial&appid=" +
      apiKey;

    requestWeather = {
      url: weatherURL,
      method: "GET",
    };

    $.ajax(requestWeather).then(function (responseTwo) {
      var weatherStats = {
        cityName: currentCity,
        currentWeather: {
          date: moment().utc(responseTwo.current.dt).format("M/D/YY"),
          weather: responseTwo.current.weather[0].main,
          temperature: responseTwo.current.temp + " °F",
          humidity: responseTwo.current.humidity + "%",
          windSpeed: responseTwo.current.wind_speed + " MPH",
          uvIndex: responseTwo.current.uvi,
        },
        futureWeather: [],
      };

      for (var i = 1; i < 6; i++) {
        fiveDayForecast = {
          date: moment.unix(responseTwo.daily[i].dt).format("M/D/YY"),
          weather: responseTwo.daily[i].weather[0].main,
          temperature: responseTwo.daily[i].temp.day + " °F",
          humidity: responseTwo.daily[i].humidity + "%",
        };

        weatherStats.futureWeather.push(fiveDayForecast);
      }

      addToStorage("weatherValues", weatherStats);
      displayCityList();
      displayCurrentWeather(city);
      displayFutureWeather(city);
    });
  });
}

function addToStorage(key, value) {
  var storedLocal = JSON.parse(localStorage.getItem(key));
  if (storedLocal) {
    storedLocal.push(value);
    localStorage.setItem(key, JSON.stringify(storedLocal));
  } else {
    var storedLocal = [];
    storedLocal.push(value);
    localStorage.setItem(key, JSON.stringify(storedLocal));
  }
}

function displayCurrentWeather(city) {
  var storedLocal = JSON.parse(localStorage.getItem("weatherValues"));
  for (var i = 0; i < storedLocal.length; i++) {
    if (storedLocal[i].cityName.toLowerCase() === city.toLowerCase()) {
      $("#city-date").text(
        storedLocal[i].cityName +
          " (" +
          storedLocal[i].currentWeather.date +
          ") "
      );
      $("#temp").text(
        "Temperature: " + storedLocal[i].currentWeather.temperature
      );
      $("#humid").text("Humidity: " + storedLocal[i].currentWeather.humidity);
      $("#wind").text("Wind Speed: " + storedLocal[i].currentWeather.windSpeed);

      var weatherIcon = $("<i>");

      displayWeatherIcon(weatherIcon, storedLocal[i].currentWeather.weather);

      $("#city-date").append(weatherIcon);

      var uvSpan = $("<span>").text(storedLocal[i].currentWeather.uvIndex);
      if (storedLocal[i].currentWeather.uvIndex > 7) {
        uvSpan.addClass("uv-severe");
      } else if (storedLocal[i].uvIndex < 3) {
        uvSpan.addClass("uv-favorable");
      } else {
        uvSpan.addClass("uv-moderate");
      }

      $("#uvIndex").empty().text("UV Index: ").append(uvSpan);
    }
  }
}

function displayCityList() {
  var storedLocal = JSON.parse(localStorage.getItem("weatherValues"));
  if (storedLocal) {
    cityList.empty();
    for (var i = 0; i < storedLocal.length; i++) {
      if (storedLocal[i].currentWeather.date === currentDate) {
        var listEl = $("<li>")
          .addClass("list-group-item")
          .text(storedLocal[i].cityName);
        cityList.append(listEl);
      }
    }
  }
}

function displayFutureWeather(city) {
  var fiveDayEl = $("#five-day");
  fiveDayEl.empty();
  var storedLocal = JSON.parse(localStorage.getItem("weatherValues"));
  for (var i = 0; i < storedLocal.length; i++) {
    if (storedLocal[i].cityName.toLowerCase() === city.toLowerCase()) {
      for (var c = 0; c < storedLocal[i].futureWeather.length; c++) {
        var weatherBlock = $("<div>").addClass("weather-block");

        var futureDate = $("<h5>").text(storedLocal[i].futureWeather[c].date);
        var futureIcon = $("<i>");
        var futureTemp = $("<p>").text(
          "Temp: " + storedLocal[i].futureWeather[c].temperature
        );
        var futureHumid = $("<p>").text(
          "Humidity: " + storedLocal[i].futureWeather[c].humidity
        );

        displayWeatherIcon(futureIcon, storedLocal[i].futureWeather[c].weather);

        weatherBlock.append(futureDate, futureIcon, futureTemp, futureHumid);
        fiveDayEl.append(weatherBlock);
      }
    }
  }
}

function displayWeatherIcon(icon, weatherEvent) {
  if (weatherEvent === "Clear") {
    icon.addClass("fas fa-sun");
  } else if (weatherEvent === "Clouds") {
    icon.addClass("fas fa-cloud");
  } else if (weatherEvent === "Rain") {
    icon.addClass("fas fa-cloud-rain");
  } else if (
    weatherEvent === "Smoke" ||
    weatherEvent === "Haze" ||
    weatherEvent === "Fog" ||
    weatherEvent === "Mist"
  ) {
    icon.addClass("fas fa-smog");
  } else if (weatherEvent === "Thunderstorm") {
    icon.addClass("fas fa-bolt");
  } else if (weatherEvent === "Snow") {
    icon.addClass("fas fa-snowflake");
  }
}

$(document).ready(function () {
  displayCityList();
  var storedLocal = JSON.parse(localStorage.getItem("weatherValues"));
  if (storedLocal) {
    displayCurrentWeather(storedLocal[storedLocal.length - 1].cityName);
    displayFutureWeather(storedLocal[storedLocal.length - 1].cityName);
  }

  $("#city-search").on("submit", function (event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);

    storeWeather(cityInput);
  });

  $(".list-group").on("click", ".list-group-item", function () {
    var citySelection = $(this).text();
    displayCurrentWeather(citySelection);
    displayFutureWeather(citySelection);
  });
});
