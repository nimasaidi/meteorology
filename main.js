document.addEventListener("DOMContentLoaded", () => {
    const apiKey = '69418701003548ec90161300241909';
    const baseUrl = 'https://api.weatherapi.com/v1';
    let city = 'sanandaj';
    const cityWeatherInfoElements = document.querySelectorAll('.city-weather-info');
    let weatherChart;

    let ball = document.querySelector('.ball');
    let modeBtn = document.querySelector('.mode-btn');
    let moon = document.querySelector('.moon');

    ball.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        modeBtn.classList.toggle('active');
    });

    async function getWeather(city) {
        const url = `${baseUrl}/forecast.json?key=${apiKey}&q=${city}&days=7`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const cityNameElement = document.getElementById('city-name');
            cityNameElement.innerHTML = `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    position: absolute;
                    top: 2.5vh;
                    left: 45vh;
                    font-size: x-large; 
                    background-color: transparent;">
                    ${data.location.name}
                </div>
            `;

            const astroInfo = document.querySelector('.astro-info');
            const todayForecast = data.forecast.forecastday[0];
            const forecastedWindSpeed = todayForecast.day.maxwind_kph;
            const forecastedPressure = todayForecast.day.pressure_mb;
            const forecastedHumidity = todayForecast.day.avghumidity;
            const forecastedTempC = todayForecast.day.avgtemp_c;
            const sunrise = todayForecast.astro.sunrise;
            const sunset = todayForecast.astro.sunset;
            const conditionIcon = todayForecast.day.condition.icon;
            const uvIndex = todayForecast.day.uv;
            const visibility = todayForecast.day.avgvis_km;

            astroInfo.innerHTML = `
                <div style="margin-top: 15px;">
                    <span style="color: #4F5658;">Temperature: </span>
                    <span style="color: black;">${forecastedTempC}°C</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 20px;">
                    <span style="color: #4F5658; margin-right: 10px;">Wind Speed: </span>
                    <span style="color: black; margin-right: 15px;">${forecastedWindSpeed} kph</span>
                    <span style="color: #4F5658; margin-right: 3px;">Sunrise: </span>
                    <span style="color: black;">${sunrise}</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 15px;">
                    <span style="color: #4F5658; margin-right: 10px;">Pressure: </span>
                    <span style="color: black; margin-right: 15px;">${forecastedPressure} mb</span>
                    <span style="color: #4F5658; margin-right: 3px;">Sunset: </span>
                    <span style="color: black;">${sunset}</span>
                </div>
                <div style="margin-top: 15px;">
                    <span style="color: #4F5658;">Humidity: </span>
                    <span style="color: black;">${forecastedHumidity}%</span>
                </div>
                <div>
                    <img src="https:${conditionIcon}" alt="Weather Condition" style="height: 11vh; width: 11vh; transform: translate(255%, -220%);" />
                </div>
            `;

            const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            const forecastDays = data.forecast.forecastday;

            forecastDays.forEach((forecast, index) => {
                const dayBox = document.querySelector(`.day-box.${daysOfWeek[index].toLowerCase()}`);
                const dayName = daysOfWeek[index];

                if (index < 6) {
                    dayBox.innerHTML = `
                        <div style="text-align: center; font-weight: bold; color: white; transform: translate(0, -150%);">${dayName}</div>
                        <img src="https:${forecast.day.condition.icon}" alt="${forecast.day.condition.text}" />
                        <p style="text-align: center; color: white; transform: translate(0, 150%); font-size: larger;">${forecast.day.avgtemp_c}°</p>
                    `;
                }
            });

            const lowerBox1 = document.querySelector('.lower-box-1');
            lowerBox1.innerHTML = `
                <p style="margin-top:0px;">Wind Status</p>
                <p style="margin-top: 20.5vh;">${forecastedWindSpeed} km/h</p>
            `;

            const lowerBox2 = document.querySelector('.lower-box-2');
            lowerBox2.innerHTML = `
                <p style="margin-top:0px;">UV Index</p>
                <p style="margin-top: 20.5vh; margin-left: 15vh;">${uvIndex}</p>
            `;

            const lowerBox3 = document.querySelector('.lower-box-3');
            lowerBox3.innerHTML = `
                <p style="margin-top:0px;">Pressure</p>
                <p style="margin-top: 20.5vh;">${forecastedPressure} hPa</p>
            `;

            const lowerBox4 = document.querySelector('.lower-box-4');
            lowerBox4.innerHTML = `
                <p style="margin-top:0px;">Visibility</p>
                <p style="margin-top: 20.5vh;">${visibility} km</p>
            `;

            saveCity(data.location.name, data.location.country, todayForecast.day.condition.text, conditionIcon);

            // Add chart for rain chances
            const ctx = document.getElementById('weatherChart').getContext('2d');
            const labels = ['09:00', '11:00', '14:00', '16:00', '18:00'];
            const rainChances = forecastDays[0].hour.map(hour => hour.chance_of_rain).slice(0, labels.length);

            if (weatherChart) {
                weatherChart.destroy();
            }

            weatherChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Chance of Rain (%)',
                        data: rainChances,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Chance of Rain (%)'
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error fetching weather data:', error);
            const astroInfo = document.querySelector('.astro-info');
            astroInfo.innerHTML = `<div>Error fetching weather data. Please try again later.</div>`;
        }
    }

    function saveCity(city, country, condition, icon) {
        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        let cityInfo = { name: city, country, condition, icon };

        if (!cities.find(c => c.name === city)) {
            cities.unshift(cityInfo);
            if (cities.length > 4) {
                cities.pop();
            }
            localStorage.setItem('cities', JSON.stringify(cities));
            updateCityWeatherInfo();
        }
    }

    function updateCityWeatherInfo() {
        const cities = JSON.parse(localStorage.getItem('cities')) || [];
        cityWeatherInfoElements.forEach((element, index) => {
            if (cities[index]) {
                element.innerHTML = `
                    <div style="text-align: start; color: white;">
                        <span style="color: gray; font-size: medium; display: block; margin-bottom:2vh;">${cities[index].country}</span>
                        <strong style="font-size: large; display: block;">${cities[index].name}</strong>
                        <div style="display: flex; align-items: center; justify-content: start; margin-top: 5px;">
                            <span style="color: white; margin-right: 5px; justify-content: start;">${cities[index].condition}</span>
                            <img src="https:${cities[index].icon}" alt="Condition Icon" style="height: 9vh; width: 9vh; position: absolute; right: 5.5vw; bottom: ;" />
                        </div>
                    </div>
                `;
            } else {
                element.innerHTML = '';
            }
        });
    }

    const searchInput = document.querySelector('.search-bar');
    searchInput.addEventListener('input', () => {
        city = searchInput.value.trim();
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            city = searchInput.value.trim();
            if (city !== '') {
                getWeather(city);
                searchInput.value = '';
            }
        }
    });

    const infoBox = document.querySelector('.info-box');
    const dayNameDisplayElement = document.createElement('div');
    dayNameDisplayElement.classList.add('day-name-display');
    dayNameDisplayElement.style = `
        font-size: x-large; 
        font-weight: bold; 
        color: black;
        position: absolute;
        top: 3vh; 
        left: 5px;
    `;
    const timeDisplayElement = document.createElement('div');
    timeDisplayElement.classList.add('time-display');
    timeDisplayElement.style = `
        font-size: x-large; 
        font-weight: bold; 
        color: black;
        position: absolute;
        top: 3vh; 
        left: 13vw;
    `;
    infoBox.appendChild(dayNameDisplayElement);
    infoBox.appendChild(timeDisplayElement);
    updateTime();

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function getDayName() {
        const now = new Date();
        const options = { weekday: 'long' }; 
        return now.toLocaleDateString('en-US', options);
    }

    function updateTime() {
        const timeElement = document.querySelector('.time-display');
        const dayNameElement = document.querySelector('.day-name-display');
        const currentTime = getCurrentTime();
        const currentDayName = getDayName();

        timeElement.textContent = currentTime;
        dayNameElement.textContent = currentDayName;
    }

    setInterval(updateTime, 1000);
    updateCityWeatherInfo();
    getWeather(city);
});

    



















// import AWN from 'awesome-notifications';import './style.css'
// import axios from "axios";
// const Key = '198c32d1a5fd44f596174131241909'
// const baseurl = "https://api.weatherapi.com/v1"
// const q = 'dehgolan';
// function getWeather() {    const url = `${baseurl}/current.json?key=${Key}&q=${q}`;
//     axios.post(url) // جایگزین URL با URL واقعی API
//         .then(function (response) {            new AWN().success('با موفقیت درخواست گرفته شد', { durations: { success: 0 }, labels: { success: "موفقیت" } })
//             const data = response.data;
//             document.querySelectorAll('#location-name')[0].innerHTML = `${data.location.name} - ${data.location.country}`;            
//         })        .catch(function (error) {
//             new AWN().alert('با مشکل:| درخواست گرفته شد', { durations: { success: 0 }, labels: { alert: "مشکل" } })        });
// }
// // فراخوانی تابع برای گرفتن اطلاعات
// getWeather();


                
                




                // import { getCurrentWeather } from "./src/api/CurrentWeather";
                // getCurrentWeather("sanandaj").then(x => console.log(x.data))