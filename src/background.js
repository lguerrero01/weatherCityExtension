import browser from 'webextension-polyfill'



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