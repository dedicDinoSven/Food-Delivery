$('.reviewOrder').click(function () {
    let id = $(this).data('id');
    $('#orderId').val(id);
});

$('#submitReview').click(function () {
    let id = $('#orderId').val();

    let data = {
        comment: $('#comment').val(),
        rating: $('#rating').val()
    };

    $.ajax({
        url: `./reviewOrder/${id}`,
        type: 'post',
        data: data,
        success: function (data) {
            location.reload();
        },
    });
});