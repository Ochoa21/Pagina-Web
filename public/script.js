async function register() {
    const username = document.getElementById('registerUser').value;
    const password = document.getElementById('registerPass').value;
    const ownerKey = prompt('Ingrese la clave de dueño:');

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, ownerKey })
    });

    const data = await response.json();
    alert(data.msg);
}

async function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    } else {
        alert(data.msg);
    }
}
