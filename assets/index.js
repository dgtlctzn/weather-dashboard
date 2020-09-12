var cityList = $(".list-group");
var storedLocal = JSON.parse(localStorage.getItem("storedCities"));
var storedCities = [];
var currentDate = moment().format("M/D/YY");
console.log(currentDate);

function storeCurrentWeather(city) {
    currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544"

    request = {
        url: currentWeatherURL,
        method: "GET",
    }

    $.ajax(request).then(function(response) {

        cityStats = {
            name: response.name,
            temperature: response.main.temp + " °F",
            humidity: response.main.humidity + "%",
            windSpeed: response.wind.speed + " MPH",
            date: currentDate, 
        }

        if (storedLocal) {
            storedLocal.push(cityStats);
            localStorage.setItem("storedCities", JSON.stringify(storedLocal));
        } else {
            storedCities.push(cityStats);
            localStorage.setItem("storedCities", JSON.stringify(storedCities));
        }
    });
}

$("#search-button").on("click", function(event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);

    storeCurrentWeather(cityInput);
})
