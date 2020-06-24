var apiKey = "21f119b277dc1287bf9bd8d85a0a56ab";

function getCompleteWeatherApiUrlForCoord(lat, lon) {
	return "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey;
}

function getCurrentWeatherForCity(city) {
	return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
}

function showWeather() {
	var city = $("#get-weather").val();
	showWeatherForCity(city);
}

function showWeatherForCity(city) {
	console.log("show weather for city - ", city);
	getCoordForCity(city);
}

function getCoordForCity(city) {
	var urlToCall = getCurrentWeatherForCity(city);

	console.log("url called: " + urlToCall);



	$.ajax({
		url: urlToCall,
		method: "GET"
	}).then(function (response) {
		console.log("response holds: ", response);

		fetchWeatherForCoord(response.coord);
		curCity = city;
	});

}

function fetchWeatherForCoord(coord) {
	var urlToCall = getCompleteWeatherApiUrlForCoord(coord.lat, coord.lon);

	$.ajax({
		url: urlToCall,
		method: "GET"
	}).then(function (response) {
		console.log("response holds: ", response);
		populateWeather(response);
		populateHistory(curCity);
	});
}

function populateWeather(jsonWeather) {

	$("#cityAndDate").text(curCity + " (" + getDateFrom(jsonWeather.current.dt) + ")");
	$("#temp").text("Temperature: " + jsonWeather.current.temp);
	var jsonDaily = jsonWeather.daily;

	var dateElements = $('.date');
	var tempElements = $('.temp');
	var humidityElements = $('.humidity');
	var IconElements = $('.icon');

	for (var x = 0; x < 5; x++) {

		var imgFile = "./Assets/" + jsonDaily[x].weather[0].main + ".png";

		$(dateElements[x]).text(getDateFrom(jsonDaily[x].dt));
		$(IconElements[x]).attr("src", imgFile);
		$(tempElements[x]).text("Temp: " + jsonDaily[x].temp.day)
		$(humidityElements[x]).text("Humidity: " + jsonDaily[x].humidity)

	}
}

function getDateFrom(secSinceEpoch) {
	var d = new Date(secSinceEpoch * 1000);

	return getMmDdYyFromDate(d);
}

function getMmDdYyFromDate(inDate) {
	var month = inDate.getMonth() + 1;
	var day = inDate.getDate();
	var year = inDate.getFullYear();

	return month + "/" + day + "/" + year;
}

function populateDates() {
	var todDate = new Date();

	$('#cityAndDate').text(" - (" + getMmDdYyFromDate(todDate) + ")");

	var dateElements = $('.date');

	for (var x = 1; x <= 5; x++) {
		$(dateElements[x - 1]).text(getMmDdYyFromDate(addDays(todDate, x)));
	}
}

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

