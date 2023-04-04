var APIKey = "ffeb73927eb2b06f79200e91ee53b3ab";
var lastCitySearched;
var storedCities;
var cities = [];
var lastCity


if (localStorage.getItem("cities")) {
	storedCities = JSON.parse(localStorage.getItem("cities"));
	console.log(storedCities);lastCity = storedCities[storedCities.length - 1] || "Houston";
	for (var i = 0; i < storedCities.length; i++) {
		lastCitySearched = storedCities.length - 1;
		
	}
} else {
	lastCity= "houston"
}
console.log(lastCity)
renderLastCityInfo(lastCity);
console.log("cities", cities);

$("#search-city").on("click", function (event) {
	event.preventDefault();
	var city = $("#city-input").val();
	console.log(city);

	var queryURL1 =
		"" +
		city +
		"&appid=" +
		APIKey;

        $.ajax({
            url: queryURL1,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            lat = response.coord.lat;
            lon = response.coord.lon;

			fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ffeb73927eb2b06f79200e91ee53b3ab`)
			.then(response => response.json())
			.then(response => {
				console.log(response)
			});
            
            cities.push(city);
        
            localStorage.setItem("cities", JSON.stringify(cities));
    
            var cityItem = $("<li>");
            cityItem.addClass("list-group-item city-item");
            cityItem.text(response.name);
            cityItem.attr("lat", response.coord.lat);
            cityItem.attr("lon", response.coord.lon);
            $("#city-list").prepend(cityItem);
    
            
            cityItem.on("click", function () {
                lat = $(this).attr("lat");
                lon = $(this).attr("lon");
                renderCityName(response);
                renderCityInfo(lat, lon);
            });
            renderCityName(response);
            renderCityInfo(lat, lon);
    });
});

function renderLastCityInfo(lastCity) {
	$("#city-list").empty();
	var queryURL1 =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		lastCity +
		"&appid=" +
		APIKey;



	$.ajax({
		url: queryURL1,
		method: "GET",
	}).then(function (response) {
		console.log(response);
		lat = response.coord.lat;
		lon = response.coord.lon;

		renderCityName(response);
		renderCityInfo(lat, lon);
	});
}

function renderCityName(response) {
	
	var currentDate = moment().format("L");
	
	$(".card-title").text(`${response.name} (${currentDate})`);
	var weatherIcon = $("<img>");
	var iconCode = response.weather[0].icon;
	var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
	weatherIcon.attr("src", iconUrl);
	$(".card-title").append(weatherIcon);
}

function renderCityInfo(lat, lon) {
	var queryURL2 =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		lon +
		"&units=imperial&appid=" +
		APIKey;

	$.ajax({
		url: queryURL2,
		method: "GET",
	}).then(function (response) {
		console.log(response)
        $("#temperature").text(`Temperature: ${response.temp} \xB0F`);
		$("#humidity").text(`Humidity: ${response.humidity}%`);
		$("#wind-speed").text(`Wind Speed: ${response.wind_speed} MPH`);
	});
}
function renderForecast(response) {
	$("#forecast").empty();
    var days = response.daily;
    days.slice(1, 6).map((day) => {
		var dayCard = $("<div>");
		dayCard.addClass("card col-md-4 daycard");
        dayCard.css("background-color", "lightblue");
		dayCard.css("margin-right", "5px");
		dayCard.css("font-size", "15px");

		var dayCardBody = $("<div>");
		dayCardBody.addClass("card-body");
		dayCard.append(dayCardBody);

		var dayCardName = $("<h6>");
		dayCardName.addClass("card-title");
        var datestamp = moment.unix(day.dt);
		var forecastDate = datestamp.format("L");
		dayCardName.text(forecastDate);
		dayCardBody.append(dayCardName);
        var weatherIcon = $("<img>");
		var iconCode = day.weather[0].icon;
		var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
		weatherIcon.attr("src", iconUrl);
		dayCardBody.append(weatherIcon);

		var dayTemp = $("<p>");
		dayTemp.text(`Temp: ${day.temp.max} \xB0F`);
		dayCardBody.append(dayTemp);

		var dayHumidity = $("<p>");
		dayHumidity.text(`Humidity: ${day.humidity}%`);
		dayCardBody.append(dayHumidity);

		$("#forecast").append(dayCard);
	});
}
