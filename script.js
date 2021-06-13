var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206],  14);


//Inicializar el plugin para Geolocalizacion
L.control.locate().addTo(map);
map.locate({setView: true, maxZoom: 20});


//
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];



function cargarRestaurantes() { //cargar los datos de la base de datos en la array 'data_markers' y llamar a la función 'cargarTiposDeRestaurantes()'

	$.getJSON("api/apiRestaurants.php", function (dato, status, xhr) {
		data_markers = dato;
		console.log(dato);
		cargarTiposDeRestaurantes(data_markers);
	});
}



//Función que guarda en el array 'tiposRestaurantes' los diferentes tipos de restaurantes posibles (sin repeticiones)
function cargarTiposDeRestaurantes(data_markers) {
	let tiposRestaurantes = []; // Array que va a contener el total de tipos de restaurantes, sin repeticiones

	for (i = 0; i < data_markers.length; i++) { //recorrer array con los datos de la api
		let tipo = data_markers[i].kind_food; // cogemos el dato del campo 'kind_food'
		tiposCocina = tipo.split(","); // separar el contenido del campo 'kind_food' que está dividido por comas


		for (j = 0; j < tiposCocina.length; j++) { // recorrer la variable splitada de 'tipos cocina'
			if (!tiposRestaurantes.includes(tiposCocina[j])) { //verificar si la array 'tiposRestaurantes' no contiene el valor de 'tiposCocina' para cada posición
				tiposRestaurantes.push(tiposCocina[j]); // si no lo contiene se añade el valor al array 'tiposRestaurantes'
			}
		}
	}
	iniciaSelector(tiposRestaurantes); // llamar a la función iniciarSelector pasando como parámetro la array 'tiposRestaurantes' para mostrar en el filtro los diferentes tipos
}


function iniciaSelector(tiposRestaurantes) {
	for (i = 0; i < tiposRestaurantes.length; i++) {
		$("#kind_food_selector").append(`<option value="${tiposRestaurantes[i]}">${tiposRestaurantes[i]}</option>`) // añadir el valor y el nombre al selector
	}
    marcadoresMapa(data_markers);
}



// Mostrar resturantes en mapa con imagen insertada
function marcadoresMapa(data_markers) {
       
	for (i = 0; i < data_markers.length; i++) {
		let dm = data_markers[i];
        
        let photoImg = '<img src="images/'+data_markers[i].photo+'">';
        
		data_markers[i].marker = L.marker([dm.lat, dm.lng], { // ir guardando el objeto 'marker' correspondiente a cada posición del array 'data_markers'
	        
		}).bindPopup("Restaurant: " + "<b>" + data_markers[i].name + "</b>" + "<br>" + data_markers[i].address + "<br>" + "<b>" + data_markers[i].kind_food + "</b>"+"<br><br>"+ photoImg) // ir mostrando en popup la información del restaurante en cada posición y la imagen
			.addTo(map); // ir añadiendo al mapa cada marcador
	}
}


//Mostrar sólo los marcadores filtrados
function filtrarMarcador(){
    let filter = document.getElementById("kind_food_selector").value;
    for(i=0; i<data_markers.length; i++){
        
        if(filter != "Todos" &&  !data_markers[i].kind_food.includes(filter) ){
           data_markers[i].marker.remove(map);
        } else {
            data_markers[i].marker.addTo(map);
        }
    }
}



function onMapLoad() {

	console.log("Mapa cargado");
	cargarRestaurantes();
	/*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/
}
