// when the DOM has loaded - start the below
document.addEventListener('DOMContentLoaded', () => {

    // when the form is submitted for "what's your handle?"
    document.querySelector('#handle-form').onsubmit = () => {
        let user = document.querySelector('#handle').value;
        localStorage.setItem('user', user);
    };
});
