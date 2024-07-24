async function blockUrl() {
    const url = document.getElementById('blockUrl').value;
    const token = localStorage.getItem('token');

    const response = await fetch('/api/url/block', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    alert(data.msg);
}

async function extractUrls() {
    const url = document.getElementById('extractUrl').value;
    const token = localStorage.getItem('token');

    const response = await fetch('/api/url/extract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    let urlList = document.getElementById('urlList');
    urlList.innerHTML = "<h3>URLs extraídas:</h3><ul>" + data.urls.map(u => `<li>${u}</li>`).join('') + "</ul>";
}

async function enable2FA() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const response = await fetch('/api/auth/enable-2fa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user._id })
    });

    const data = await response.json();
    document.getElementById('qrcode').innerHTML = `<img src="${data.data_url}" alt="QR Code">`;
    alert('Escanea el código QR con Google Authenticator y guarda el secreto.');
}

async function verifyOTP() {
    const otp = document.getElementById('otp').value;
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user._id, otp })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.msg);
    } else {
        alert(data.msg);
    }
}
