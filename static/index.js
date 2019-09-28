// when the DOM has loaded - start the below
document.addEventListener('DOMContentLoaded', () => {

    // change title of chat to the selected element's innerhtml
    document.querySelectorAll('#chat-selector').forEach((chat) => {
        chat.onclick = () => {
            chat_room = chat.innerText;
            document.querySelector('#chat-title').innerHTML = chat_room;
            document.querySelector('#scroll-list-chat').innerText = '';
            //   todo: here I need to be able to pull all the data from this chat into the list
            // initialise new request
            const request = new XMLHttpRequest();
            request.open('POST', '/get_history');

            // Callback function for when request completes
            request.onload = () => {

                // Extract JSON data from request
                const data = JSON.parse(request.responseText);

                //update the result div
                // Populate last 100 messages todo: add limit to 100
                data.forEach((message) => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item list-group-item-dark d-flex justify-content-between';
                    li.innerHTML = `<span><b>${message['user']}:</b> ${message['message']}</span> <small>${message['timestamp']}</small>`;
                    document.querySelector('#scroll-list-chat').append(li);
                });
            };

            // Add data to send with request
            const data = new FormData();
            data.append('chat_room', chat_room);

            // Send request
            request.send(data);
            return false;


        };
    });
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // when the form is submitted - do the below
        document.querySelector('#form').onsubmit = () => {
            const message = document.querySelector('#message').value;
            document.querySelector('#message').value = '';
            socket.emit('send message', {'message': message, 'chat_room': chat_room});

            // stop the form from sending GET request to chat view-function
            return false;
        };

        socket.on('all messages', data => {
            if (data['chat_room'] === chat_room) {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-dark d-flex justify-content-between';
                li.innerHTML = `<span><b>${data['user']}:</b> ${data['message']}</span> <small>${data['timestamp']}</small>`;
                document.querySelector('#scroll-list-chat').append(li);
            }
        });

    });
});
