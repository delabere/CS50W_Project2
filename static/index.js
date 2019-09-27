

    document.addEventListener('DOMContentLoaded', () => {

      // change title of chat to the selected element's innerhtml
      document.querySelectorAll('#chat-selector').forEach((chat) => {
        chat.onclick = () => {
          title = chat.innerHTML;
          document.querySelector('#chat-title').innerHTML = title;
        };
      });

    });
