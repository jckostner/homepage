$(document).ready(function() {
    var weatherWidth = $("#weather").width();
    var etherWidth = $("#ether").width();

    if (weatherWidth > etherWidth) {
        $("#main").css({
            'width': (weatherWidth + 'px')
        });
    } else {
        $("#main").css({
            'width': (etherWidth + 'px')
        });
    }
});
