import browser from 'webextension-polyfill'
const container = document.querySelector('.container');
const result = document.querySelector('#resultado');
const form= document.querySelector('#formulario');

window.addEventListener('load', () => {
    form.addEventListener('submit', searchWeather);
})
let data = {
    valid: true,
    city: '',
    country: ''
}

function searchWeather(e) {
    e.preventDefault();
    //validating
    const city = document.querySelector('#ciudad').value;
    const country = document.querySelector('#pais').value;
    data.city = city;
    data.country = country;
    notifyBackgroundPage(data);

    // console.log('esto es data', data);
    if(city === '' || country === '' ){
        showError('Ambos campos son obligatorios!');
    }
}

function showError(message){
    clearHtml();
    console.log(message)
    const alerta = document.querySelector('.alert-danger');

    if(!alerta){//if there are no alerts then
            //create alert 
        const alerta = document.createElement('div');
        alerta.classList.add('alert', 'alert-danger', 'd-flex', 'align-items-center', 'text-center',"px-1", "py-2", "mx-5", "fw-bold", "row");

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${message}</span>
        `
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
    
    
}

function showWeather(data) {
    clearHtml();
    const { name , main: {temp, temp_max, temp_min} } = data;
    const centigrade = kelvinToCentigrade(temp);
    const max = kelvinToCentigrade(temp_max);
    const min = kelvinToCentigrade(temp_min);

    const nameCity = document.createElement('p');
    nameCity.innerHTML = `Clima en: ${name}`;
    nameCity.classList.add('fw-bold', 'fs-1')

    const act = document.createElement('p');
    act.innerHTML = `${centigrade} &#8451`;
    act.classList.add('fw-bold', 'fs-1', 'text-center','text-white','bg-dark', 'badge', 'row', 'd-block');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Temp Maxima: ${max}&#8451`;
    tempMax.classList.add('badge', 'bg-danger','text-white', 'fs-6', 'row', 'd-block');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Temp Minima: ${min}&#8451`;
    tempMin.classList.add('badge', 'bg-primary','text-white','fs-6','row', 'd-block');

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('text-center', 'container');
    resultDiv.appendChild(nameCity);
    resultDiv.appendChild(act);
    resultDiv.appendChild(tempMax);
    resultDiv.appendChild(tempMin);
    
    result.appendChild(resultDiv);
    
}

const kelvinToCentigrade = grades => parseInt(grades - 273.15);

function clearHtml(){
    while (result.firstChild) {
        result.removeChild(result.firstChild);
      }
}

const handleResponse = (message) => {
    console.log('estoy en el popup', message);
   
    if(message.cod == '404'){
        showError('Ciudad no encontrada, intente con otra')
        return;
    }
    showWeather(message);
}

const handleError = (error) => {
    console.log(`Error: ${error}`);
}
  
const notifyBackgroundPage = (data) => {
    console.log('data linea 61',data)
    let sending = browser.runtime.sendMessage(data);
    sending.then(handleResponse, handleError);
}

