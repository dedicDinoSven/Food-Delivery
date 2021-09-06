$(document).ready(function () {
    let total = 0;
    let restaurant = '';
    
    order.forEach(orderProduct => {
        total += parseFloat(orderProduct.fullPrice);
        restaurant = orderProduct.product.restaurant;
    });

    $('#total').append(total + ' KM');
    $('#toPay').val(total);
    $('#restaurant').val(restaurant);
});

$('.removeFromBasket').click(function () {
    let id = $(this).data('id');

    $.ajax({
        url: `./basket/${id}`,
        type: 'put',
        success: function (data) {
            location.reload();
        },
    });
});

$('#submitOrder').click(function () {
    const data = {
        customer: customer,
        price: $('#toPay').val(),
        requestedDeliveryTime: $('#orderTime').val() || new Date(),
        paymentType: $('#paymentType').val()
    }
    socket.emit('customer-notification', data);
});