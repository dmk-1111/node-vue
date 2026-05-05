$(() => {
    $('.table-responsive .table').on('click', '.btn-edit', function() {
        const id = $(this).data('id');
        const name = $(this).closest('tr').find('td.td_name').text();
        const email = $(this).closest('tr').find('td.td_email').text();
        const phone = $(this).closest('tr').find('td.td_phone').text();
        const detail = $(this).closest('tr').find('td.td_detail').text();
        $('#modalEdit #e_id').val(id);
        $('#modalEdit #e_name').val(name);
        $('#modalEdit #e_email').val(email);
        $('#modalEdit #e_phone').val(phone);
        $('#modalEdit #e_detail').val(detail);
    });
    $('.table-responsive .table').on('click', '.btn-del', function() {
        const id = $(this).data('id');
        $('#modalDelete #d_id').val(id);
    });
});