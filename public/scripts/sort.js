$(document).ready(function() {
    $('#sort-new').on('click', function() {
        window.location.href="/?sort=new"
    });
    $('#sort-hot').on('click', function() {
        window.location.href="/?sort=hot"
    });
    $('#sort-top').on('click', function() {
        window.location.href="/?sort=top"
    });
})