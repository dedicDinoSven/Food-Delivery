$(document).on('click', '.addNew', function() {
	const group = $(this).data('group');
	$('#group').val(group);

	const modal = $('#addNewModal')[0];
	let modalTitle = modal.querySelector('.modal-title');
	modalTitle.textContent = 'New ' + group + ' type';
});

$('#submitBtn').click(function() {
	let name = $('#name').val()
	let group = $('#group').val();

	$.ajax({
		url: `./add${group}Type/`,
		type: 'post',
		data: { name: name },
		success: function (data) {
			location.reload();
		}
	});
});

$(document).on('click', '.update', function() {
	let id = $(this).data('id');
	let name = $('#' + id).children('td[data-target=name]').text();
	let group = $(this).data('group');
	
	$('#updateId').val(id);
	$('#updateName').val(name.trim());
	$('#updateGroup').val(group);

	const modal = $('#updateModal')[0];
	let modalTitle = modal.querySelector('.modal-title');
	modalTitle.textContent = 'Update ' + group + ' type';
});

$('#updateBtn').click(function() {
	let id = $('#updateId').val();
	let name = $('#updateName').val();
	let group = $('#updateGroup').val();

	$.ajax({
		url: `./update${group}Type/${id}`,
		type: 'put',
		data: { name: name },
		success: function (data) {
			location.reload();
		}
	})
});

$('.deactivate').click(function () {
	let id = $(this).data('id');
	let group = $(this).data('group');

	$.ajax({
		url: `./deactivate${group}Type/${id}`,
		type: 'put',
		success: function (data) {
			location.reload();
		},
	});
});

$('.activate').click(function () {
	let id = $(this).data('id');
	let group = $(this).data('group');

	$.ajax({
		url: `./activate${group}Type/${id}`,
		type: 'put',
		success: function (data) {
			location.reload();
		},
	});
});

$('#updateRestaurantModal').on('shown.bs.modal', function () {
	formMap.resize();
});

$(document).on('click', '#updateRestaurant', function () {
	let id = $(this).data('id');
	let name = $('span[data-target=name]').text().trim();
	let restaurantType = $('span[data-target=restaurantType]').text().trim();
	let workingHoursStart = $('span[data-target=workingHoursStart]').text().trim();
	let workingHoursEnd = $('span[data-target=workingHoursEnd]').text().trim();
	let address = $('span[data-target=address]').text().trim();
	let streetNum = $('span[data-target=streetNum]').text().trim();

	$('#id').val(id);
	$('#name').val(name);
	$('#restaurantType').val(restaurantType);
	$('#workingHoursStart').val(workingHoursStart);
	$('#workingHoursEnd').val(workingHoursEnd);
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
		address: $('#address').val(),
		lng: $('#lng').val(),
		lat: $('#lat').val(),
		streetNum: $('#streetNum').val()
	};

	$.ajax({
		url: `/superAdmin/updateRestaurant/${id}`,
		type: 'put',
		data: data,
		success: function (data) {
			location.reload();
		}
	});
});

$('.deactivateRestaurant').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./deactivateRestaurant/${id}`,
		type: 'put',
		success: function (data) {
			location.reload();
		}
	});
});

$('.activateRestaurant').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./activateRestaurant/${id}`,
		type: 'put',
		success: function (data) {
			location.reload();
		}
	});
});

