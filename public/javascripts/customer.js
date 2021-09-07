$(document).ready(function () {
	$('#productSearch').click(function () {
		$(this).next().toggle();
	});

	$('#productTypeSearch').click(function () {
		$(this).next().toggle();
	});

	const map = new mapboxgl.Map({
		container: 'customerMap',
		style: 'mapbox://styles/mapbox/streets-v11',
		zoom: 14,
		center: [lng, lat]
	});

	map.addControl(new mapboxgl.FullscreenControl());
	map.addControl(new mapboxgl.NavigationControl());

	let deliveryDistances = [];
	let distancesCustomerRestaurant = [];

	restaurants.forEach((restaurant) => {
		let restaurantLng = restaurant.location.lng;
		let restaurantLat = restaurant.location.lat;
		deliveryDistances.push(restaurant.deliveryDistance);
		distancesCustomerRestaurant.push(
			getDistanceFromLatLonInKm(lat, lng, restaurantLat, restaurantLng).toFixed(
				2
			)
		);
	});

	let availableRestaurants = [];

	for (let i = 0; i < restaurants.length; ++i) {
		if (distancesCustomerRestaurant[i] <= deliveryDistances[i])
			availableRestaurants.push(restaurants[i]);
	}

	const markers = availableRestaurants.map((restaurant) => {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [restaurant.location.lng, restaurant.location.lat]
			},
			properties: {
				title: restaurant.name,
				icon: 'restaurant',
				description: `<strong>${restaurant.location.address}</strong>`
			}
		};
	});
	loadMap(markers);

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
					'text-field': '{title}',
					'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
					'text-offset': [0, 0.9],
					'text-anchor': 'top'
				}
			});
		});
	}

    const container = $('#restaurantCardsContainer');
	availableRestaurants.forEach((restaurant) => {
        let cardHolder = $('<div></div>').addClass('col-md-6');
		let card = $('<div></div>').addClass('card border-primary');
		let cardBody = $('<div></div>').addClass('card-body');
		let cardTitle = $('<h4></h4>').addClass('card-title').text(restaurant.name);
		let cardSubtitle = $('<h5></h5>')
			.addClass('card-subtitle text-muted')
			.text(restaurant.restaurantType.name);
		let cardText = $('<p></p>')
			.addClass('card-text')
			.text(`Working hours: ${restaurant.workingHoursStart} - ${restaurant.workingHoursEnd}`);
		let cardText2 = $('<p></p>').addClass('card-text').text(`Delivery distance: ${restaurant.deliveryDistance} km`);
		let cardLink = $('<a></a>')
			.addClass('card-link text-center')
			.attr('href', './restaurant/' + restaurant._id)
			.text('More info');

        cardBody.append(cardTitle, cardSubtitle, cardText, cardText2, cardLink);
        card.append(cardBody);
        cardHolder.append(card);
        container.append(cardHolder);	
	});
});
