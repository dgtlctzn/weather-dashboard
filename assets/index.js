var cityList = $(".list-group");

function displayCurrentWeather(city) {
    currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f2f448fdff7880f3d298bdf08e187544"

    request = {
        url: currentWeatherURL,
        method: "GET",
    }

    $.ajax(request).then(function(response) {
        console.log(response);
    })
}

$("#search-button").on("click", function(event) {
    event.preventDefault();

    var cityInput = $("#search-input").val();
    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);
})

displayCurrentWeather("Atlanta")