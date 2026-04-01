const timeSpan = document.querySelector('.time')
const ampmSpan = document.querySelector('.ampm')
const weatherDiv = document.querySelector('.weather')
const day = document.querySelector('.date') //actually the whole date div :) 
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weatherDescriptions = {
     0: '☀️ Clear',
    1: '🌤️ Mostly Clear',
    2: '⛅ Partly Cloudy',
    3: '☁️ Overcast',
    45: '🌫️ Foggy',
    61: '🌧️ Light Rain',
    63: '🌧️ Rain',
    80: '🌦️ Showers',
    95: '⛈️ Thunderstorm'
}

function updateClock(){
const now = new Date()

//clock//
const minutes = String(now.getMinutes()).padStart(2, '0')
const hours24 = now.getHours()
const hours12 = hours24 % 12 || 12
const ampm = hours24 >= 12 ? 'PM' : 'AM'
const hours = String(hours12).padStart(2, '0')
//dates//
const dayIndex = now.getDay()
const monthIndex = now.getMonth()
const dayNumber = now.getDate()

timeSpan.textContent = hours + ':' + minutes  
ampmSpan.textContent = ampm
day.textContent = dayNames[dayIndex] + ' ' + dayNumber + ' ' + monthNames[monthIndex]
}
updateClock() //initial run on load
setInterval(updateClock,1000) //update once a sec ;)

async function fetchweather() {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.6249&longitude=-115.4436&current_weather=true&temperature_unit=fahrenheit')
    const data = await response.json()
    const weatherSymbol = data.current_weather.weathercode
    const weatherTemp = data.current_weather.temperature    
    weatherDiv.textContent = weatherDescriptions[weatherSymbol] + "  " + Math.round(weatherTemp) + '°F'
}

fetchweather()
setInterval(fetchweather,90000) // updates once every 15 mins :) 