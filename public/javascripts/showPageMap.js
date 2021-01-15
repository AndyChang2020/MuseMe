mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: museum.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(museum.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${museum.name}</h3><p>${museum.address}</p>`
            )
    )
    .addTo(map);