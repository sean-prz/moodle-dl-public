// handle the form submission
$('#moodleCookieForm').submit(function(event) {
    // make a post request to localhost:3000/changeCookie
    event.preventDefault();
    const cookieValue = $('#moodleCookieInput').val();
    console.log(cookieValue);
    $.post('http://localhost:3000/changeCookie', { cookie: cookieValue }, function(response) {
        console.log(response);
        window.location.href = '../cookieCheck/cookieCheck.html';
    });
})