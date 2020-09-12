var cityList = $(".list-group");

$("#search-button").on("click", function(event) {
    event.preventDefault();
    var cityInput = $("#search-input").val();
    console.log(cityInput);

    var listEl = $("<li>").addClass("list-group-item").text(cityInput);
    cityList.append(listEl);
})