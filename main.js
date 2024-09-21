import AWN from "awesome-notifications";
import axios from "axios";

const apiKey = '69418701003548ec90161300241909';
const baseUrl = "http://api.weatherapi.com/v1";
const city = 'sanandaj';
const locationIconElements = document.getElementById("response");

function getCurrentWeather(city) {
    const url = `${baseUrl}/current.json?key=${apiKey}&q=${city}`;

    axios.get(url)
        .then(response => {
            new AWN().success('با موفقیت درخواست گرفته شد', { durations: { success: 0 }, labels: { success: "موفقیت" } })

            locationIconElements.innerText = response.data.location.country;

        })
        .catch(error => {
            new AWN().warning('خطا در دریافت اطلاعات', { durations: { success: 0 }, labels: { warning: "عدم موفقیت" } })

        });
}


getCurrentWeather(city);
console.log(response.data);


// import axios from "axios";
// const apiKey = '69418701003548ec90161300241909';
// const baseUrl = " http://api.weatherapi.com/v1"
// const q = 'sanandaj'
// function geCurrenttWeather(city) {
//     const url = `${baseUrl}/current.json?key=${apiKey}&q=${q}`;

//     axios.post(url, {}, {})
//     .then(p =>{
//             document.getElementById("dwedwd").innerText = p.data.location.country;

//     })
//     .catch(p => alert("Error while getting data"))
//     geCurrenttWeather('London');

// fetch(url)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })
// .catch(error => {
//     console.log('Error:', error);
// });

