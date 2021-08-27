formMap.setCenter([lng, lat]);

$('#updateRestaurantModal').on('shown.bs.modal', function () {
    $(formMap).resize();
});

$(document).on('click', '#updateRestaurant', function () {
    let id = $(this).data('id');
    let name = $('span[data-target=name]').text().trim();
    let restaurantType = $('span[data-target=restaurantType]').text().trim();
    let workingHoursStart = $('span[data-target=workingHoursStart]').text().trim();
    let workingHoursEnd = $('span[data-target=workingHoursEnd]').text().trim();
    let deliveryDistance = $('span[data-target=deliveryDistance').text().trim();
    let address = $('span[data-target=address]').text().trim();
    let streetNum = $('span[data-target=streetNum]').text().trim();

    $('#id').val(id);
    $('#name').val(name);
    $('#restaurantType').val(restaurantType);
    $('#workingHoursStart').val(workingHoursStart);
    $('#workingHoursEnd').val(workingHoursEnd);
    $('#deliveryDistance').val(deliveryDistance);
    geocoder.query(address);
    $('#streetNum').val(streetNum);
});

$('#submitUpdate').click(function () {
    let id = $('#id').val();

    let data = {
        name: $('#name').val(),
        restaurantType: $('#restaurantType').val(),
        workingHoursStart: $('#workingHoursStart').val(),
        workingHoursEnd: $('#workingHoursEnd').val(),
        deliveryDistance: $('#deliveryDistance').val(),
        address: $('#address').val(),
        lng: $('#lng').val(),
        lat: $('#lat').val(),
        streetNum: $('#streetNum').val()
    };

    $.ajax({
        url: `/admin/updateRestaurant/${id}`,
        type: 'put',
        data: data,
        success: function (data) {
            location.reload();
        }
    });
});

$('.deactivateProduct').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./deactivateProduct/${id}`,
		type: 'put',
		data: { id: id },
		success: function (data) {
			location.reload();
		}
	});
});

$('.activateProduct').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./activateProduct/${id}`,
		type: 'put',
		data: { id: id },
		success: function (data) {
			location.reload();
		}
	});
});

$(document).on('click', '.updateProduct', function () {
	let id = $(this).data('id');
	let menu = $('#' + id)
		.children('div')
		.children('p[data-target=menu]')
		.text()
		.trim();
	let name = $('#' + id)
		.children('div')
		.children('h5[data-target=productName]')
		.text()
		.trim();
	let description = $('#' + id)
		.children('div')
		.children('p[data-target=productDesc]')
		.text()
		.trim();
	let price = $('#' + id)
		.children('div')
		.children('p')
		.children('span[data-target=productPrice]')
		.text()
		.trim();

	$('#productId').val(id);
	$('#updateProductMenu').val(menu);
	$('#updateProductName').val(name);
	$('#updateProductDesc').val(description);
	$('#updateProductPrice').val(price);
});

$('#submitProductUpdate').click(function () {
	let id = $('#productId').val();

	let data = {
		menu: $('#updateProductMenu').val(),
		name: $('#updateProductName').val(),
		description: $('#updateProductDesc').val(),
		price: $('#updateProductPrice').val(),
	};

	$.ajax({
		url: `/admin/updateProduct/${id}`,
		type: 'put',
		data: data,
		success: function (data) {
			location.reload();
		}
	});
});
