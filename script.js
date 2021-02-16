const WEATHER_API_KEY = "1a3d5b7d34963716d551a5d2de0ef98b";
const weatherIconCodes = {
    '2XX': {
        default:'thunderstorm',
        200:'thunderstorm',
        201:'thunderstorm',
        202:'thunderstorm',
        210:'thunderstorm',
        211:'thunderstorm',
        212:'thunderstorm',
        221:'thunderstorm',
        230:'thunderstorm',
        231:'thunderstorm',
        232:'thunderstorm',
    },
    '3XX': {
        default:'sprinkle',
        300:'sprinkle',
        301:'sprinkle',
        302:'sprinkle',
        310:'sprinkle',
        311:'sprinkle',
        312:'sprinkle',
        313:'sprinkle',
        314:'sprinkle',
        321:'sprinkle',
    },
    '5XX': {
        default:'rain',
        500:'rain',
        501:'rain',
        502:'rain',
        503:'rain',
        504:'rain',
        511:'rain',
        520:'rain',
        521:'rain',
        522:'rain',
        531:'rain',
    },
    '6XX': {
        default: 'snow',
        600: 'snow',
        601: 'snow',
        602: 'snow',  
        611: 'sleet', 
        612: 'sleet', 
        613: 'sleet', 
        615: 'rain-mix', 
        616: 'rain-mix', 
        620: 'rain-mix', 
        621: 'rain-mix', 
        622: 'rain-mix', 
    },
    '7XX': {
        default: 'barometer',
        701:'mist',
        711:'smoke',
        721:'smog',
        731:'meteor',
        741:'fog',
        751:'sandstorm',
        761:'dust',
        762:'volcano',
        771:'windy',
        781:'tornado',
    },
    '8XX': {
        default:'cloud',
        800:'sunny',
        801:'cloud',
        802:'cloud',
        803:'cloud',
        804:'cloud',
    }
}

function getWeatherIcon(code) {
    const groupKey = code.toString()[0] + 'XX';


    if (weatherIconCodes[groupKey]) {
       
        if(weatherIconCodes[groupKey][code]) {
            return `wi-${weatherIconCodes[groupKey][code]}`;
        } else {
            return `wi-${weatherIconCodes[groupKey]['default']}`
        }

    } else {
        return `wi-alien`;
    }
    
}  
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
        $('#current_temp').html(`${currentWeatherResult.main.temp} &deg;C`);
        $('#current_wind').text(currentWeatherResult.wind.speed);
        $('#current_humidity').text(currentWeatherResult.main.humidity);
        $('#current_emoji')[0].className = `emoji wi ${getWeatherIcon(currentWeatherResult.weather[0].id)}`;


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
                            
                            <i class="emoji wi ${getWeatherIcon(currentDay.weather[0].id)}"></i>
                            <div class='temp'>${currentDay.temp.day} &deg;C</div>
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