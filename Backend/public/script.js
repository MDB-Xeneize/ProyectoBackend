

function login(usuario){
    
    const url = 'http://localhost:8080/api/login';
    dato=document.querySelector('#usuario1')
    nick=dato.value;
    dato=document.querySelector('#password1')
    pass=dato.value;
    const data = {
        nickname: nick,
        password: pass
    };

    // Realiza una solicitud POST al servidor con el JSON
fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud POST no fue exitosa');
      }
      return response.json();
    })
    .then(jsonResponse => {
      // Maneja la respuesta JSON del servidor
      console.log(jsonResponse);
  
      // Verifica si la respuesta JSON no está vacía
      if (Object.keys(jsonResponse).length !== 0) {
        // Si la respuesta JSON no está vacía, realiza una solicitud GET adicional
        return fetch('http://localhost:8080/menu/menu.html', {
          method: 'GET'
        });
      } else {
        // Si la respuesta JSON está vacía, simplemente resuelve con null
        return null;
      }
    })
    .then(otraRespuesta => {
      if (otraRespuesta === null) {
        // No se realizó la segunda solicitud, puede que la respuesta JSON estuviera vacía
        console.log('No se realizó la segunda solicitud porque la respuesta JSON estaba vacía.');
      } else if (!otraRespuesta.ok) {
        throw new Error('La segunda solicitud no fue exitosa');
      } else {
        // Maneja la respuesta HTML de la segunda solicitud
        console.log('Segunda solicitud exitosa:', otraRespuesta);
        return otraRespuesta.text();
      }
    })
    .then(htmlResponse => {
      // Maneja el contenido HTML de la segunda solicitud
      console.log('Contenido HTML:', htmlResponse);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}