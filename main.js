import axios from "axios";

const apiKey = '69418701003548ec90161300241909';
const baseUrl = "http://api.weatherapi.com/v1";
const city = 'sanandaj';

function getCurrentWeather(city) {
    const url = `${baseUrl}/current.json?key=${apiKey}&q=${city}`;


    axios.get($)
        .then(response => {
            
            const locationIconElements = document.getElementsById("response");
            if (locationIconElements.length > 0) {
                locationIconElements[0].innerText = response.data.location.country; 
            } else {
                console.error("No elements found with class 'location-icon'");
            }
        })
        .catch(error => {
            console.error("Error while getting data:", error);
            alert("Error while getting data: " + error.message); 
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

