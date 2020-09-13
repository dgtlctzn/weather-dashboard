var cityList = $(".list-group");
// var storedLocal = JSON.parse(localStorage.getItem("storedCities"));
// var storedCities = [];
var currentDate = moment().format("M/D/YY");

function storeWeather(city) {
  currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544";

  requestCurrent = {
    url: currentWeatherURL,
    method: "GET",
  };

  $.ajax(requestCurrent).then(function (responseOne) {
    var lat = responseOne.coord.lat;
    var long = responseOne.coord.lon;

    uviURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&%20&exclude=daily,hourly,minutely&appid=f2f448fdff7880f3d298bdf08e187544";

    requestUVI = {
      url: uviURL,
      method: "GET",
    };

    $.ajax(requestUVI).then(function (responseTwo) {
      var currentStats = {
        name: responseOne.name,
        weather: responseOne.weather[0].main,
        temperature: responseOne.main.temp + " °F",
        humidity: responseOne.main.humidity + "%",
        windSpeed: responseOne.wind.speed + " MPH",
        uvIndex: responseTwo.current.uvi,
        date: moment().utc(responseOne.dt).format("M/D/YY"),
      };
      addToStorage("currentValues", currentStats);
      displayCityList();
      displayCurrentWeather(city);
    });
  });

  futureWeatherURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544";

  requestFuture = {
    url: futureWeatherURL,
    method: "GET",
  };

  $.ajax(requestFuture).then(function (response) {
    var futureStats = [];
    // console.log(response);

    start = moment(response.list[0].dt_txt);
    start = start.add(12, "hours");
    for (var i = 0; i < response.list.length; i++) {
      if (
        start.format("M/D/YY") ===
        moment(response.list[i].dt_txt).format("M/D/YY")
      ) {
        futureObject = {
          date: moment(response.list[i + 4].dt_txt).format("M/D/YY"),
          name: response.city.name,
          temperature: response.list[i + 4].main.temp,
          humidity: response.list[i + 4].main.humidity,
          weather: response.list[i + 4].weather[0].main,
        };

        start = start.add(1, "days");
        futureStats.push(futureObject);
      }
    }
    addToStorage("futureValues", futureStats);
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
  var storedLocal = JSON.parse(localStorage.getItem("currentValues"));
  console.log(storedLocal);
  for (var i = 0; i < storedLocal.length; i++) {
    if (storedLocal[i].name.toLowerCase() === city.toLowerCase()) {
      console.log("yep");
      $("#city-date").text(
        storedLocal[i].name + " (" + storedLocal[i].date + ") "
      );
      $("#temp").text("Temperature: " + storedLocal[i].temperature);
      $("#humid").text("Humidity: " + storedLocal[i].humidity);
      $("#wind").text("Wind Speed: " + storedLocal[i].windSpeed);

      var currentIMG = $("<img>");
      if (storedLocal[i].weather === "Clear") {
        currentIMG.attr("src", "assets/images/sun.png");
        currentIMG.attr("alt", "Sunny");
      } else if (storedLocal[i].weather === "Clouds") {
        currentIMG.attr("src", "assets/images/cloud.png");
        currentIMG.attr("alt", "Cloudy");
      } else if (storedLocal[i].weather === "Rain") {
        currentIMG.attr("src", "assets/images/water.png");
        currentIMG.attr("alt", "Rainy");
      } else if (
        storedLocal[i].weather === "Smoke" ||
        storedLocal[i].weather === "Haze" ||
        storedLocal[i].weather === "Fog"
      ) {
        currentIMG.attr("src", "assets/images/fog.png");
        currentIMG.attr("alt", "Foggy");
      }

      $("#city-date").append(currentIMG);

      var uvSpan = $("<span>").text(storedLocal[i].uvIndex);
      if (storedLocal[i].uvIndex > 7) {
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
  var storedLocal = JSON.parse(localStorage.getItem("currentValues"));
  if (storedLocal) {
    cityList.empty();
    for (var i = 0; i < storedLocal.length; i++) {
      var listEl = $("<li>").addClass("list-group-item").text(storedLocal[i].name);
      cityList.append(listEl);
    }
  }
}

$(document).ready(function () {
    
  displayCityList();
  var storedLocal = JSON.parse(localStorage.getItem("currentValues"));
  if (storedLocal) {
      displayCurrentWeather(storedLocal[storedLocal.length - 1].name);
  }

  $("#search-button").on("click", function (event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);

    storeWeather(cityInput);
  });

  $(".list-group").on("click", ".list-group-item", function () {
    var citySelection = $(this).text();
    console.log(citySelection);
    displayCurrentWeather(citySelection);
  });
});
