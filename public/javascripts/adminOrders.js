let distancesCouriersRestaurant = [];
let index;

couriers.forEach((courier) => {
	let restaurantLng = restaurant.location.lng;
	let restaurantLat = restaurant.location.lat;

	if (typeof courier.location !== 'undefined' ) {
	distancesCouriersRestaurant.push(
		getDistanceFromLatLonInKm(
			courier.location.lat,
			courier.location.lng,
			restaurantLat,
			restaurantLng
		).toFixed(2)
	);

	let shortestDistance = Math.min(...distancesCouriersRestaurant);
	index = distancesCouriersRestaurant.indexOf(shortestDistance.toString());
		}
});

let nearestCourier = couriers[index];
console.log(distancesCouriersRestaurant);
console.log(index);
console.log(nearestCourier);

$('.approveOrder').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./approveOrder/${id}`,
		type: 'put',
		data: { courier: nearestCourier._id },
		success: function (data) {
			location.reload();
		}
	});
});
