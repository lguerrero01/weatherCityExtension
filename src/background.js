import browser from 'webextension-polyfill'

const handleMessage= (request, sender, sendResponse) => {
    console.log('este es el sender',sender);
      if (request === 'clima') {
        fetch('') 
          .then( respuesta => {
              return respuesta.json();
          }) 
          .then(resultado => {
            sendResponse(resultado);
          })
      }
    
  }
  
    browser.runtime.onMessage.addListener(handleMessage);