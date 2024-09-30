const apiKey = '69418701003548ec90161300241909'; // Actual API key
const baseUrl = 'https://api.weatherapi.com/v1'; // HTTPS is recommended
let city = 'sanandaj'; // Default city name

async function getWeather(city) {
    const url = `${baseUrl}/forecast.json?key=${apiKey}&q=${city}&days=7`; // Get the forecast for the next 7 days

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Debug log to see the API response

        // Display the city and country name in the box with id "city-name"
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
                ${data.location.name} - ${data.location.country}
            </div>
        `;

        // Extracting today's data for detailed info display (Day 0 - Today)
        const astroInfo = document.querySelector('.astro-info');

        const todayForecast = data.forecast.forecastday[0];
        const forecastedWindSpeed = todayForecast.day.maxwind_kph;
        const forecastedPressure = todayForecast.hour[0].pressure_mb;
        const forecastedHumidity = todayForecast.hour[0].humidity;
        const forecastedTempC = todayForecast.hour[0].temp_c;
        const uvIndex = todayForecast.day.uv;  // UV index
        const sunrise = todayForecast.astro.sunrise;
        const sunset = todayForecast.astro.sunset;
        const conditionIcon = todayForecast.day.condition.icon;
        const visibility = todayForecast.hour[0].visibility; // Extract visibility

        // Display detailed weather data for today along with the condition icon
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
        <div style="margin-top: 15px;">
            <span style="color: #4F5658;">Visibility: </span>
            <span style="color: black;">${visibility} km</span> <!-- Display visibility -->
        </div>
        <div>
            <img src="https:${conditionIcon}" alt="Weather Condition" style="margin-left: 25vh; transform: translate(30%, -230%); height: 11vh; width: 11vh; margin-bottom:20vh;" />
        </div>`;

        // Extracting forecast data for the next 6 days (Day 1 to Day 6)
        const dayBoxes = document.querySelectorAll('.day-box');
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayIndex = new Date().getDay(); // Get the current day (0 = Sunday, 6 = Saturday)

        data.forecast.forecastday.slice(1).forEach((day, index) => { // Skip today's forecast (slice(1))
            if (index < dayBoxes.length) {
                const dayBox = dayBoxes[index];

                const forecastedTempC = day.day.avgtemp_c;
                const conditionIcon = day.day.condition.icon;

                // Calculate the correct day name for next 6 days
                const correctDayName = dayNames[(todayIndex + index + 1) % 7]; 

                dayBox.innerHTML = `
                    <p style="transform: translate(0% , -100%);">${correctDayName}</p>
                    <img src="https:${conditionIcon}" alt="Weather Condition" style="height: 10vh; width: 10vh; transform: translate(0%, -25%);" />
                    <p style="transform: translate(-0% , 50%); font-size: larger;">${forecastedTempC}°</p>
                `;
            }
        });

        // Display wind speed in lower-box-1 (in km)
        const lowerBox1 = document.querySelector('.lower-box-1');
        lowerBox1.innerHTML = `
            <p style="margin-top:0px;">Wind Status</p>
            <p style="margin-top: 20.5vh;"> ${forecastedWindSpeed} km/h</p>
        `;

        // Display UV index in lower-box-2
        const lowerBox2 = document.querySelector('.lower-box-2');
        lowerBox2.innerHTML = `
            <p style="margin-top:0px;">UV Index</p>
            <p style="margin-top: 20.5vh; margin-left: 15vh;"> ${uvIndex} UV</p>
        `;

        // Display humidity in lower-box-3
        const lowerBox3 = document.querySelector('.lower-box-3');
        lowerBox3.innerHTML = `
            <p style="margin-top:0px;">Humidity</p>
            <p style="margin-top: 20.5vh;"> ${forecastedHumidity}%</p>
        `;

        // Display visibility in lower-box-4
        const lowerBox4 = document.querySelector('.lower-box-4');
        lowerBox4.innerHTML = `
            <p style="margin-top:0px;">Visibility</p>
            <p style="margin-top: 20.5vh;"> ${visibility} km</p>
        `;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        const astroInfo = document.querySelector('.astro-info');
        astroInfo.innerHTML = `<div>Error fetching weather data. Please try again later.</div>`;
    }
}

// Event listener for the search bar to update the city name on "Enter"
document.querySelector('.search-bar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const newCity = event.target.value;
        console.log(`Searching for: ${newCity}`); // Debug log
        city = newCity; // Update the city variable
        getWeather(city); // Fetch and display weather for the new city
        event.target.value = ''; // Clear the input field
    }
});

// Initial weather fetch for the default city
getWeather(city);













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