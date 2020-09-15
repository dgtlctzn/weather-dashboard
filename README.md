# Weather Dashboard

I was tasked with creating a weather dashboard that generates dynamic content based on a user's city input. A user can search for any city in the search bar and the site will retrieve and display the current weather and a five day forecast for that city. 

![Weather Dashboard](assets/images/WeatherDashboard.png)

The weather search was enabled by the [OpenWeather](https://openweathermap.org/api) Api. The first api call uses the [Current Weather Data](https://openweathermap.org/current) api which retrieves the latitude and longitude of the city. The geocoordinates are then used to make another api call through the [One Call API](https://openweathermap.org/api/one-call-api). The second api is where most of the weather data is taken from. 

Weather data is stored in local storage to ensure it persists on the page. The information retrieved for each city is stored in the following object notation: 
```
weatherStats = {
    cityName: Atlanta,
    currentWeather: {
        date: "9/15/20",
        weather: "Clear",
        temperature: "74 °F",
        humidity: "60%",
        windSpeed: "4.0 MPH",
        uvIndex: 8.9,
        },
    futureWeather: [
                {date: "9/16/20"
                humidity: "76%"
                temperature: "65.52 °F"
                weather: "Rain"},
                {date: "9/17/20"
                humidity: "88%"
                temperature: "70.72 °F"
                weather: "Rain"} ...
                ],
    };
```

## Usage
The website can be found in the following link:

[Weather Dashboard](https://dgtlctzn.github.io/weather-dashboard/)

## Credits
The OpenWeather API was used for the city weather information. Moment.js was used for the current datetime. FontAwesome was used for the icon generation. Bootstrap was used for the css layout. JQuery was used for the DOM manipulation. 

## License
MIT License

Copyright (c) 2020 Joseph Perry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 