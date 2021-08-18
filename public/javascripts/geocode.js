mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9kaTE5MjEiLCJhIjoiY2tqaGJycDZ2MjZ4bDMxc2NmYjUyMGlsMCJ9.E1UD5UfxO54qrcxYrGxLcw';
const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

const formMap = new mapboxgl.Map({
	container: 'formMap',
	style: 'mapbox://styles/mapbox/streets-v11',
	zoom: 14,
	center: [18.413029, 43.85643]
});

formMap.addControl(new mapboxgl.FullscreenControl());
formMap.addControl(new mapboxgl.NavigationControl());

const geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl,
	type: 'address',
	placeholder: 'Enter an address',
	marker: false,
});

$('#geocoder').append(geocoder.onAdd(formMap));
$('.mapboxgl-ctrl-geocoder--input').addClass('form-control');

const marker = new mapboxgl.Marker({ draggable: true });

geocoder.on('result', (e) => {
	marker.setLngLat(e.result.center).addTo(formMap);
	
	$('#address').val(e.result.place_name);
	$('#lng').val(e.result.center[0]);
	$('#lat').val(e.result.center[1]);
	$('#hiddenDiv').fadeIn(1000);
});

geocoder.on('clear', () => {
	marker.setLngLat([0, 0]);
	$('#address').val('');
	$('#lng').val('');
	$('#lat').val('');
	$('#streetNum').val('');
	$('#hiddenDiv').fadeOut(1000);
});

const getReverseGeocodeData = (coords) => {
	mapboxClient.geocoding
		.reverseGeocode({
			query: [coords.lng, coords.lat],
		})
		.send()
		.then(function (response) {
			if (response && response.body && response.body.features && response.body.features.length) {
				let feature = response.body.features[0];
				geocoder.query(feature.place_name);
			}
		});
};

formMap.on('click', function (e) {
	const coords = e.lngLat;
	getReverseGeocodeData(coords);
});

const onDragEnd = () => {
	const coords = marker.getLngLat();
	getReverseGeocodeData(coords);
};

marker.on('dragend', onDragEnd);
