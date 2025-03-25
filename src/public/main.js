
// load jquery

// make a get request to localhost:300=
$.get('http://localhost:3000/settings', function(data) {
  $("#yourCourses").html(data.courses[0].title);
  console.log(data)
})

$("#downloadButton").click(function() {
  $.get('http://localhost:3000/download', function(data) {
    console.log(data)
  })
})

$("#cookieForm").submit(function(event) {
  event.preventDefault();
  const cookieValue = $("#cookieInput").val();
  console.log(cookieValue);
  $.post('http://localhost:3000/changeCookie', { cookie: cookieValue }, function(response) {
    console.log(response);
  });
});




const statusDiv = document.getElementById('status');
const ws = new WebSocket('ws://localhost:8080');
const logDiv = document.getElementById('log');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.channel === "log") {
    logDiv.innerHTML = data.content + '<br>';
  }
  if (data.channel === "status") {
    statusDiv.innerHTML = data.content + '<br>';
  }
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket server');
};

ws.onerror = (error) => {
  console.error('WebSocket error: ', error);
};

// on document ready with jQuery

