//helper functions
var dayOfWeek = "";
function formatDate(date, month, year)
{
  month = (month.length < 2) ? ('0' + month) : month;
  date = (date.length < 2)? ('0' + date) : date;
  return [year,month,date].join('-');
}
function getDayofWeek(date, month, year){
  var week_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayOfWeek =  week_names[new Date([month,date,year].join('-')).getDay()];
}
function getFarenheitTemp(temp){
  return (9*temp/5)+32;
}

//run when the document object model is ready for javascript code to execute
$(document).ready(function() {
  
  // Custom coordinates in url string. Figure out how to execute code below with new url
  var latitude = document.getElementById("latitude");
  var longitude = document.getElementById("longitude");
  var button = document.getElementById("formButton");

  var url ='https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=40.015,-105.27&forecast_days=5'; //Place your weatherstack API Call Here - access_key to be used: 5bc82451636190abd9d7afe6fe9b20b5

  // button.addEventListener("click", function(){
  //   url ='https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=' + latitude.value + ',' + longitude.value + '&forecast_days=5;';
  // });

  $.ajax({url:url, dataType:"jsonp"}).then(function(data) {

    console.log(data);
    
    var image = document.getElementById("image_today");
    var image_api = data.current.weather_icons[0];
    image.setAttribute('src', image_api);

    var heading = document.getElementById("heading");
    var heading_api = "Today's Weather Forecast - " + data.location.name;
    heading.innerHTML = heading_api;

    var temp = document.getElementById("temp_today");
    var temp_api = getFarenheitTemp(data.current.temperature);
    temp.innerHTML = temp_api;

    var thermometer = document.getElementById("thermometer_inner");
    thermometer.style.height = temp_api + "%";

    if(parseInt(temp_api) > 85){
      thermometer.style.backgroundColor = "red";
    }
    else if(parseInt(temp_api) >= 65){
      thermometer.style.backgroundColor = "grey";
    }
    else{
      thermometer.style.backgroundColor = "blue";
    }

    var precipitation = document.getElementById("precip_today");
    var precipitation_api = data.current.precip + "%";
    precipitation.innerHTML = precipitation_api;

    var humidity = document.getElementById("humidity_today");
    var humidity_api = data.current.humidity + "%";
    humidity.innerHTML = humidity_api;

    var wind = document.getElementById("wind_today");
    var wind_api = data.current.wind_speed;
    wind.innerHTML = wind_api;

    var summary = document.getElementById("summary_today");
    var summary_api = data.current.weather_descriptions[0];
    summary.innerHTML = summary_api;

    var time = document.getElementById("local_time");
    var time_api = new Date(data.location.localtime);
    var month = time_api.getMonth() + 1;
    var new_time = time_api.getFullYear() + "-" + month + "-" + time_api.getDate() + " ";
    var hour = time_api.getHours();
    var hour_full;
    if(hour == 0){
      hour_full = "12:" + time_api.getMinutes() + "AM";  
    }
    else if(hour < 13){
      hour_full = hour + ":" + time_api.getMinutes() + "AM";
    }
    else{
      hour = hour - 12;
      hour_full = hour + ":" + time_api.getMinutes() + "PM";
    }

    time.innerHTML = new_time + hour_full;

    var forecast = document.getElementById("5_day_forecast");
    var forecast_object = data.forecast;
    var forecast_string = '';

    console.log(forecast_object);

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = '';
    var forecast_date;

    for(const object in forecast_object){
      // forecast_object[object] gets the object to access properties. object in this gives the current date
      forecast_date = new Date(object);
      day = weekday[forecast_date.getDay()];
      forecast_string += '<div style="width: 20%;"> <div class="card"> <div class="card-body"> <h5 class="card-title">' + day + '</h5> <p class="card-text">High: ' + getFarenheitTemp(forecast_object[object].maxtemp) + '<br>Low: ' + getFarenheitTemp(forecast_object[object].mintemp) + '<br>Sunrise: ' + forecast_object[object].astro.sunrise + "<br>Sunset: " + forecast_object[object].astro.sunset + '</p> </div> </div> </div>';

    }

    forecast.innerHTML = forecast_string;

  })
});
