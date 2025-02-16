// on document ready:

$(document).ready(function() {
    $.get('http://localhost:3000/checkCookie', function (response) {
        console.log(response);
        if (response) {
            window.location.href = "../index.html"
        } else {
            window.location.href = "../cookieChange/cookieChange.html"
        }
    })
})