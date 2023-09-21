

var map;

//array que ira guardar todos os pontos do mapa 
var markers = [];
var dados = jsonData;


setTimeout(function () {
    location.reload();
}, 600000);
function test(latitude, longitude) {
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const markerPosition = marker.getPosition();

        const tolerance = 0.0001;
        if (
            Math.abs(markerPosition.lat() - latitude) <= tolerance &&
            Math.abs(markerPosition.lng() - longitude) <= tolerance
        ) {
            return marker;
        }
    }
    return null;
}

function initMap() {
    if (map) {
        // percorre o array e limpa os marcadores e a tabela se o mapa já foi inicializado
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        //seleciono a tabela
        var table = document.querySelector('table');
        // Remove todas as linhas da tabela, exceto a primeira (cabeçalho)
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }

    var mapOptions = {
        zoom: 6,
        disableDefaultUI: true,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }] // Oculta rótulos de POIs
            }
        ]
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var table = document.querySelector('table');

    //metodo para ajustar o mapa nos marcadores 
    var bounds = new google.maps.LatLngBounds();

    dados.forEach(function (item, index) {
        var markerIcon = {
            url: item.DomStatus === 'W' ? '/icones/radar-de-velocidade.png' :
                item.DomStatus === 'A' ? '/icones/radar-de-velocidade-green.png':
                '/icones/radar-de-velocidade-red.png',
            scaledSize: new google.maps.Size(28,28)
        };

        var marker = new google.maps.Marker({
            position: { lat: item.NumLatitude, lng: item.NumLongitude },
            map: map,
            title: item.Localizacao,
            icon: markerIcon
        });
        markers.push(marker);

        bounds.extend(marker.getPosition());

        var row = table.insertRow(index + 1);
       

    });
    map.fitBounds(bounds);



    document.addEventListener("DOMContentLoaded", function () {
        const enderecoRows = document.querySelectorAll("tr[data-latitude][data-longitude]");
     

        enderecoRows.forEach(function (row) {
            row.addEventListener("click", function () {
                const latitude = row.getAttribute("data-latitude");
                const longitude = row.getAttribute("data-longitude");
                console.log('> MARKER:', markers.length)
                console.log('> LONG:', longitude)
                console.log('> LAT:', latitude)

               
                const icon = test(parseFloat(latitude), parseFloat(longitude));

                if (icon) {
                    const marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)),
                        map: map,
                        icon: icon,
                        // Outras opções do marcador, se necessário
                    });

                    // Ajustar o mapa para o novo marcador
                    map.setCenter(marker.getPosition());
                    map.setZoom(15); // Defina o nível de zoom desejado
                }


                const marker = findMarkerByCoordinates(parseFloat(latitude), parseFloat(longitude));
                console.log('> MARKER:', marker)
                if (marker) {
                    // Aplique efeitos no marcador existente, por exemplo, aumente o ícone
                    marker.setIcon({
                        url: marker.getIcon().url, // Mantenha a URL atual do ícone

                    });

                    // Ajuste o mapa para a posição do marcador
                    map.setCenter(marker.getPosition());
                    map.setZoom(15); // Defina o nível de zoom desejado
                }

            });
        });
    });




}






