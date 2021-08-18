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
	})
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
		data: { id: id },
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
		data: { id: id },
		success: function (data) {
			location.reload();
		},
	});
});

$('.deactivateRestaurant').click(function () {
	let id = $(this).data('id');

	$.ajax({
		url: `./deactivateRestaurant/${id}`,
		type: 'put',
		data: { id: id },
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
		data: { id: id },
		success: function (data) {
			location.reload();
		}
	});
});
