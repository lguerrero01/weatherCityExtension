import browser from 'webextension-polyfill'

let city = '';
let country = '';

browser.runtime.onInstalled.addListener(function () {
  let url = `http://api.ipstack.com/check?access_key=46d55efd82cf8067ed7c334ec534bb52`;
  fetch(url) 
    .then((response) => response.json())
    .then((data) => {
      city = data.city 
      country = data.country_code

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=fa18105bdf564f523c9a11cb88aea36f`,
      ) 
        .then((response) => response.json())    
        .then((info) => {        
          const temperature = parseFloat((info.main.temp - 273).toFixed(2)) 
          browser.storage.local.set({
            // saving the data
            country: country, 
            city: city, 
            weather: info.weather[0].main,         
            temperature: `${temperature}ºC`, 
          })
        })
    })
    .catch((error) => console.log(error))
})

const handleMessage= (request, sender, sendResponse) => {

  const apiKey = 'fa18105bdf564f523c9a11cb88aea36f'  
  const {valid, city, country} = request;//destructuring

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`
  console.log('este es el url',url);

  if (valid === true) {
    fetch(url) 
      .then( respuesta => respuesta.json()) 
      .then(datos => sendResponse(datos))
  }
  return true;
}


browser.runtime.onMessage.addListener(handleMessage);