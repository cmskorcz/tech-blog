const signupFormHandler = async(event) => {
    event.preventDefault();
    const username = document.getElementById('username-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value.trim();

    if (username && email && password) {
        console.log(username, email, password)
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('success')
            document.location.replace('/')
        } else {
            alert(response.statusText);
        }
    }
};

const loginFormHandler = async(event) => {
    event.preventDefault();
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: {
                email,
                password
            },
            headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
            document.location.replace('/profile')
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);