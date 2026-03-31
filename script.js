const timeSpan = document.querySelector('.time')
const ampmSpan = document.querySelector('.ampm')
const day = document.querySelector('.date') //actually the whole date div :) 
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function updateClock(){

console.log(timeSpan)

const now = new Date()
console.log(now)
console.log(now.getHours())
console.log(now.getMinutes())
console.log(now.getSeconds())

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