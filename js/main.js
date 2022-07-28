import {key, appId} from "../src/key.js";

const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
const baseURL1 = 'https://api.openweathermap.org/data/2.5/forecast?';
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const hours = ['00:00', '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00',
    '11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

const generateWeatherRequest = (city)=> `${baseURL}q=${city}&units=metric&appid=${key}`;
const generateHourlyWeather = (city)=> `${baseURL1}q=${city}&units=metric&cnt=3&appid=${appId}`;

const renderWeatherForToday = (result) => {
    const day = new Date();
    const dayFull = `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`;
    document.getElementById('name').innerHTML = `${result.name}, ${days[day.getDay()]}, ${dayFull}`;

    const icon = result.weather[0].icon;
    document.getElementById('img').setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`);
    document.getElementById('temp').innerHTML = `${result.main.temp} C`;
    document.getElementById('feel').innerHTML = `Feels like: ${result.main.feels_like} C`;
    document.getElementById('max').innerHTML = `Max temp: ${result.main.temp_max} C`;
    document.getElementById('min').innerHTML = `Min temp: ${result.main.temp_min} C`;
    document.getElementById('visibility').innerHTML = `Visibility: ${Number(result.visibility) / 1000} km`;
    document.getElementById('wind').innerHTML = `Wind: ${result.wind.speed} m/s`;
}

const renderWeatherForThreeHours = (result) => {
    const weekly = document.getElementById('weekly');
    weekly.textContent = '';

    const listInfo = result.list;

    for(let i=0; i<listInfo.length; i++){
        const day = new Date(listInfo[i].dt*1000);
        console.log(day);
        let currentHour = hours[day.getHours()];
        let currentDay = days[day.getDay()];
        const temp = listInfo[i]?.main?.temp;
        const humidity = listInfo[i]?.main.humidity;
        const wind = listInfo[i]?.wind?.speed;
        const icon = listInfo[i]?.weather[0].icon;
        const src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const markup = `
            <div class="additional-info">
                <img src=${src} alt="weather">
                <div>${currentDay}, ${currentHour}</div>
                <div>${temp} C</div>
                <div>${humidity} %</div>
                <div>${wind} m/s</div>
            </div>
        `;
        weekly.insertAdjacentHTML('beforeend', markup);
    }
}

const getWeather = async()=>{
    const wrapper = document.getElementById('wrapper');
    const city = document.getElementById('city')?.value;

    const response = await fetch(generateWeatherRequest(city));
    const result = await response.json();
    renderWeatherForToday(result);

    const hourlyResponse = await fetch(generateHourlyWeather(city));
    const hourlyResult = await hourlyResponse.json();
    renderWeatherForThreeHours(hourlyResult);
    wrapper.classList.remove('hide');
}

document.getElementById('search').addEventListener('click', getWeather);
