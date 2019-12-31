// when the DOM has loaded - start the below
document.addEventListener('DOMContentLoaded', () => {

    // redirects the user to the chat page if already logged in
    if (localStorage['user']) {
        window.location = `http://${window.location.hostname}:${window.location.port}/chat`;
    }
    // does not redirect if user needs to choose a handle
    else{
    }
    // when the form is submitted for "what's your handle?"
    document.querySelector('#handle-form').onsubmit = () => {
        let user = document.querySelector('#handle').value;
        localStorage.setItem('user', user);
    };
});
