const map = new mapboxgl.Map({
	container: 'customerMap',
	style: 'mapbox://styles/mapbox/streets-v11',
	zoom: 12,
	center: [18.413029, 43.85643]
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());
let rests = JSON.parse('<%- JSON.stringify(restaurants) %>');
	const markers = rests.map((rest) => {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [rest.location.lng, rest.location.lat]
			},
			properties: {
				address:
					rest.location.address + ' ' + rest.location.streetNum,
				icon: 'restaurant'
			}
		};
	});

	loadMap(markers); 

// set markers with data from db
function loadMap(markers) {
	map.on('load', function () {
		map.addLayer({
			id: 'points',
			type: 'symbol',
			source: {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: markers
				}
			},
			layout: {
				'icon-image': '{icon}-15',
				'icon-size': 1,
				'text-field': '{address}',
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-offset': [0, 0.9],
				'text-anchor': 'top'
			}
		});
	});
}
