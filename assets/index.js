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
          temperature: responseTwo.daily[i].temp.day,
        }

        weatherStats.futureWeather.push(fiveDayForecast)
      }

      addToStorage("weatherValues", weatherStats);
      displayCityList();
      displayCurrentWeather(city);
    });
  });

  // futureWeatherURL =
  //   "https://api.openweathermap.org/data/2.5/forecast?q=" +
  //   city +
  //   "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544";

  // requestFuture = {
  //   url: futureWeatherURL,
  //   method: "GET",
  // };

  // $.ajax(requestFuture).then(function (response) {
  //   var futureStats = [];

  //   start = moment(response.list[0].dt_txt);
  //   start = start.add(12, "hours");
  //   for (var i = 0; i < response.list.length; i++) {
  //     if (
  //       start.format("M/D/YY") ===
  //       moment(response.list[i].dt_txt).format("M/D/YY")
  //     ) {
  //       futureObject = {
  //         date: moment(response.list[i + 4].dt_txt).format("M/D/YY"),
  //         name: response.city.name,
  //         temperature: response.list[i + 4].main.temp,
  //         humidity: response.list[i + 4].main.humidity,
  //         weather: response.list[i + 4].weather[0].main,
  //       };

  //       start = start.add(1, "days");
  //       futureStats.push(futureObject);
  //     }
  //   }
  //   addToStorage("futureValues", futureStats);
  // });
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
    if (storedLocal[i].name.toLowerCase() === city.toLowerCase()) {
      $("#city-date").text(
        storedLocal[i].name + " (" + storedLocal[i].currentWeather.date + ") "
      );
      $("#temp").text("Temperature: " + storedLocal[i].currentWeather.temperature);
      $("#humid").text("Humidity: " + storedLocal[i].currentWeather.humidity);
      $("#wind").text("Wind Speed: " + storedLocal[i].currentWeather.windSpeed);

      var currentIMG = $("<img>");
      if (storedLocal[i].currentWeather.weather === "Clear") {
        currentIMG.attr("src", "assets/images/sun.png");
        currentIMG.attr("alt", "Sunny");
      } else if (storedLocal[i].currentWeather.weather === "Clouds") {
        currentIMG.attr("src", "assets/images/cloud.png");
        currentIMG.attr("alt", "Cloudy");
      } else if (storedLocal[i].currentWeather.weather === "Rain") {
        currentIMG.attr("src", "assets/images/water.png");
        currentIMG.attr("alt", "Rainy");
      } else if (
        storedLocal[i].currentWeather.weather === "Smoke" ||
        storedLocal[i].currentWeather.weather === "Haze" ||
        storedLocal[i].currentWeather.weather === "Fog"
      ) {
        currentIMG.attr("src", "assets/images/fog.png");
        currentIMG.attr("alt", "Foggy");
      } else if (storedLocal[i].currentWeather.weather === "Thunderstorm") {
        currentIMG.attr("src", "assets/images/thunderstorm.png");
        currentIMG.attr("alt", "Thunderstorms");
      }

      $("#city-date").append(currentIMG);

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
      var listEl = $("<li>")
        .addClass("list-group-item")
        .text(storedLocal[i].name);
      cityList.append(listEl);
    }
  }
}

$(document).ready(function () {
  displayCityList();
  var storedLocal = JSON.parse(localStorage.getItem("weatherValues"));
  if (storedLocal) {
    displayCurrentWeather(storedLocal[storedLocal.length - 1].name);
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
  });
});
