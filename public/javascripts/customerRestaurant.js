$(document).on('click', '.basket', function () {
    const id = $(this).data('id');
    const price = $('#' + id).children('div').children('p')
        .children('span[data-target=productPrice]')
        .text()
        .trim();
    const quantity = $('#' + id).children('div').children('input[data-target=quantity]').val();
    const fullPrice = price * quantity;

    $.ajax({
        url: `/customer/basket/${id}`,
        method: 'post',
        data: { price, quantity, fullPrice },
        success: (function (data) {
            location.reload();
        })
    });
});

$(document).on('click', '.basketOffer', function () {
    const id = $(this).data('id');
    const price = $('#' + id).children('div').children('p')
        .children('span[data-target=offerPrice]')
        .text()
        .trim();
    const quantity = $('#' + id).children('div').children('input[data-target=quantityOffer]').val();
    const fullPrice = price * quantity;

    $.ajax({
        url: `/customer/basket/${id}`,
        method: 'post',
        data: { price, quantity, fullPrice },
        success: (function (data) {
            location.reload();
        })
    });
});