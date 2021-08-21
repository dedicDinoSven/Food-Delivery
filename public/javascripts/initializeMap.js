let lng = JSON.parse($('#hiddenLng').text());
let lat = JSON.parse($('#hiddenLat').text());

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	zoom: 17,
	center: [lng, lat]
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());

const locationMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
