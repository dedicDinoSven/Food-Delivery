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

    restaurants.forEach(restaurant => {
        let restaurantLng = restaurant.location.lng;
        let restaurantLat = restaurant.location.lat;
        deliveryDistances.push(restaurant.deliveryDistance);
        distancesCustomerRestaurant.push(getDistanceFromLatLonInKm(lat, lng, restaurantLat, restaurantLng).toFixed(2));
    });

    let availableRestaurants = [];
    
    for (let i = 0; i < restaurants.length; ++i) {
        if (distancesCustomerRestaurant[i] <= deliveryDistances[i])
            availableRestaurants.push(restaurants[i]);
    }

    const markers = availableRestaurants.map(restaurant => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    restaurant.location.lng,
                    restaurant.location.lat
                ]
            },
            properties: {
                title: restaurant.name,
                icon: 'restaurant',
                description: `<strong>${restaurant.location.address}</strong>`
            }
        }
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

    availableRestaurants.forEach(restaurant => {
        let container = document.createElement('div');
        container.classList.add('text-center', 'col-md-5', 'container');
        container.style.border = '1px solid black';
        container.style.borderRadius = '3px';

        container.innerHTML = `<h3>${restaurant.name}</h3><a href="./restaurant/${restaurant._id}">More details</a>`;

        const current = document.getElementById('restaurantsData');
        current.appendChild(container);
    });
});



