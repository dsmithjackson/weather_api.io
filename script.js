const WEATHER_API_KEY = "1a3d5b7d34963716d551a5d2de0ef98b";

let cityName = "Detroit";
const cityList = [];

function searchCity() {
    cityName = $('#city-input').val();
    makeOldCityButton(cityName);
    buildCityPage(cityName);
}

function searchOldCity(oldCityName) {
    cityName = oldCityName;
    buildCityPage(cityName);
}

function makeOldCityButton(oldCity) {
    // Make the HTML for old city button
    const oldCityButton = `<button onclick='searchOldCity("${oldCity}")' class='past-city btn btn-secondary'>${oldCity}</button>`;
    $('#past-cities').prepend(oldCityButton);

    // Save Old City list
    cityList.push(oldCity);
    localStorage.setItem('cityList', cityList.join());
}

function makeIcon(id) {
    return `http://openweathermap.org/img/wn/${id}@4x.png`;
}

function buildCityPage(currentcity) {
    $('#cityname').text(currentcity);
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${currentcity}&units=metric&appid=${WEATHER_API_KEY}`,
        method: 'GET'
    }).done((currentWeatherResult) => {
        console.log(currentWeatherResult);
        $('#current_temp').text(`${currentWeatherResult.main.temp} °C`);
        $('#current_wind').text(currentWeatherResult.wind.speed);
        $('#current_humidity').text(currentWeatherResult.main.humidity);
        $('#current_emoji').attr('src', makeIcon(currentWeatherResult.weather[0].icon));


        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherResult.coord.lat}&lon=${currentWeatherResult.coord.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`,
            method: 'GET'
        }).done((multiDayResult) => {
            // console.log(JSON.stringify(multiDayResult));
            console.log(multiDayResult);

            let fiveDay = [];

            for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
                const currentDay = multiDayResult.daily[dayIndex];
                if (dayIndex === 0) {

                    $('#danger-level').text(`${currentDay.uvi}`);
                    let bgColor = '';
                    let color = '#000';
                    if (currentDay.uvi <= 2) {
                        bgColor = 'green';
                        color = '#fff';
                    } else if (currentDay.uvi > 2 && currentDay.uvi < 6) {
                        bgColor = 'yellow';
                    } else if (currentDay.uvi > 5 && currentDay.uvi < 8) {
                        bgColor = 'orange';
                    } else if (currentDay.uvi > 7 && currentDay.uvi < 11) {
                        bgColor = 'red';
                        color = '#fff';
                    } else if (currentDay.uvi > 10) {
                        color = 'violet';
                        color = '#fff';
                    }
                    $('#danger-level').css('color', color);
                    $('#danger-level').css('background-color', bgColor);


                } else {
                    const processedDate = new Date(currentDay.dt * 1000).toDateString();

                    let dayBox = `<div class='col-3'><div id='day-${dayIndex}' class='forecast'>
                            <h1 class='date'>${processedDate}</h1>
                            <img src='${makeIcon(currentDay.weather[0].icon)}' class='emoji'></img>
                            <div class='temp'>${currentDay.temp.day} °C</div>
                            <div class='humidity'>${currentDay.humidity}</div>
                        </div></div>`;

                    fiveDay.push(dayBox);
                }
            }
            $('#fiveday').html(fiveDay.join(''));

        });
    });
}

function getOldCityList() {
    const oldCityList = localStorage.getItem('cityList').split(',')
    console.log(oldCityList);
    oldCityList.forEach((oldCity) => {
        makeOldCityButton(oldCity);
    });
}

$(document).ready(() => {
    getOldCityList();

    // buildCityPage(cityName);
});