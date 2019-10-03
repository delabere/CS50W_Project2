// function for creating message elements
function printMessage(message) {
    const li = document.createElement('li');
    if (message['user'] === localStorage['user']) {
        li.className = 'list-group-item list-group-item-warning d-flex justify-content-between';
    } else {
        li.className = 'list-group-item list-group-item-dark d-flex justify-content-between';
    }
    li.innerHTML = `<span><b>${message['user']}:</b> ${message['message']}</span> <small>${message['timestamp']}</small>`;
    document.querySelector('#scroll-list-chat').append(li);
}


// when the DOM has loaded - start the below
document.addEventListener('DOMContentLoaded', () => {

    // does not redirect if user is logged in
    if (localStorage['user']) {
    }
    // redirects the user to the start page if not logged in
    else {
        window.location = `http://${window.location.hostname}:${window.location.port}/start`;
    }

    // place username in top left of window
    document.querySelector('#username').innerText = localStorage['user'];


    // remove user variable when pressing 'logout' and log user out
    document.querySelector('#logout').onclick = () => {
        // remove localstorage user
        delete localStorage['user'];
        // redirect back to login
        window.location = `http://${window.location.hostname}:${window.location.port}/start`;
    };

    // load in chatroom elements to chat-nav list
    const request = new XMLHttpRequest();
    request.open('POST', '/get_rooms');

    // Callback function for when request completes
    request.onload = () => {

        // Extract JSON data from request
        const data = JSON.parse(request.responseText);

        //update the result div
        // Populate last 100 messages todo: add limit to 100
        data.forEach((room) => {
            const a = document.createElement('a');

            a.className = 'list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center';
            a.id = 'chat-selector';
            // if (room['user'] === localStorage['user']) {
            //     li.className = 'list-group-item list-group-item-warning d-flex justify-content-between';
            // } else {
            //     li.className = 'list-group-item list-group-item-dark d-flex justify-content-between';
            // }
            a.innerHTML = room;
            document.querySelector('#scroll-lists').append(a);

            // add onclick() to each chat in left pane and load chat data
            document.querySelectorAll('#chat-selector').forEach((chat) => {

                console.log(localStorage['user']);

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
                            printMessage(message);
                        });
                        var scroller = document.querySelector('#chat-middle');
                        scroller.scrollTop = scroller.scrollHeight;
                    };

                    // Add data to send with request
                    const data = new FormData();
                    data.append('chat_room', chat_room);

                    // Send request
                    request.send(data);
                    return false;


                };
            });
        });
    };

    // Add data to send with request
    // const data = new FormData();
    // data.append('chat_room', chat_room);

    // Send request
    request.send();
    // return false;


    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // when the form is submitted - do the below
        document.querySelector('#form').onsubmit = () => {
            const message = document.querySelector('#message').value;
            document.querySelector('#message').value = '';
            socket.emit('send message', {'message': message, 'chat_room': chat_room, 'user': localStorage['user']});

            // stop the form from sending GET request to chat view-function
            return false;
        };

        socket.on('all messages', data => {
            if (data['chat_room'] === chat_room) {
                printMessage(data);
                var scroller = document.querySelector('#chat-middle');
                scroller.scrollTop = scroller.scrollHeight;
            }
        });

    });
});
