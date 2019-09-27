// This code changes the title of the page based on the chat that is selected
// document.addEventListener('DOMContentLoaded', () => {
//
//     // change title of chat to the selected element's innerhtml
//     document.querySelectorAll('#chat-selector').forEach((chat) => {
//         chat.onclick = () => {
//             document.querySelector('#chat-title').innerHTML = chat.innerHTML;
//         };
//     });
//
// });

// when the DOM has loaded - start the below
document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // when the form is submitted - do the below
        document.querySelector('#form').onsubmit = () => {
            const message = document.querySelector('#message').value;
            alert(message);

            return false
        }

    })
    });
