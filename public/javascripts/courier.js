$('.deliverOrder').click(function () {
    let id = $(this).data('id');
    let customer = $(this).data('customer');
    $.ajax({
        url: `./deliverOrder/${id}`,
        type: 'put',
        data: { id },
        success: function (data) {
            location.reload();
        }
    });

    const data = {
        customer: customer,
        courier: courier,
        deliveryTime: new Date().toLocaleTimeString()
    };
    socket.emit('courier-notification', data);
});

const populateMap = () => {
    let marker;

    orders.forEach((order) => {
        if (order.orderStatus.name === 'Ordered' || order.orderStatus.name === 'Approved') {
            marker = new mapboxgl.Marker({ color: '#FF0000' })
                .setLngLat([order.customer.location.lng, order.customer.location.lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h1>${order.customer.fullName}</h1>
                        <h2>${order.customer.location.address} ${order.customer.location.streetNum}</h2>`))
                .addTo(map);
        } else {
            marker = new mapboxgl.Marker({ color: '#00FF00' })
                .setLngLat([order.customer.location.lng, order.customer.location.lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h1>${order.customer.fullName}</h1>
                        <h2>${order.customer.location.address} ${order.customer.location.streetNum}</h2>`))
                .addTo(map);
        }
    });
};

populateMap();