document.addEventListener('DOMContentLoaded', () => {

    // change title of chat to the selected element's innerhtml
    document.querySelectorAll('#chat-selector').forEach((chat) => {
        chat.onclick = () => {
            document.querySelector('#chat-title').innerHTML = chat.innerHTML;
        };
    });

});
