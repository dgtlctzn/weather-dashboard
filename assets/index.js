var cityList = $(".list-group");
// var storedLocal = JSON.parse(localStorage.getItem("storedCities"));
// var storedCities = [];
var currentDate = moment().format("M/D/YY");

function storeWeather(city) {

    currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544"

    requestCurrent = {
        url: currentWeatherURL,
        method: "GET",
    }

    $.ajax(requestCurrent).then(function(response) {

        var currentStats = {
            name: response.name,
            weather: response.weather[0].main,
            temperature: response.main.temp + " °F",
            humidity: response.main.humidity + "%",
            windSpeed: response.wind.speed + " MPH",
            date: moment().utc(response.dt).format("M/D/YY"), 
        }

        addToStorage("currentValues", currentStats);
    });

    futureWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544"

    requestFuture = {
        url: futureWeatherURL,
        method: "GET",
    }

    $.ajax(requestFuture).then(function(response) {

        var futureStats = [];
        // console.log(response);

        start = moment(response.list[0].dt_txt);
        for (var i = 0; i < response.list.length; i++) {
            if (start.format("M/D/YY") === moment(response.list[i].dt_txt).format("M/D/YY")) {
                //adding 4 to index gets weather at noon
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

$("#search-button").on("click", function(event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);

    storeWeather(cityInput);
})
