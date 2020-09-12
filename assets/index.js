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

        console.log(response);
        console.log(response.name);
        console.log(response.main.temp);
        console.log(response.main.humidity);
        console.log(response.wind.speed);

        if (storedLocal) {

        } else {
            
        }
    });
}

$("#search-button").on("click", function(event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);
})

storeCurrentWeather("Atlanta")