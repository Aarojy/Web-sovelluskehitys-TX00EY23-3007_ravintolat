const loginButton = document.getElementById('loginSubmit');

loginButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log('Attempting login...');

  const response = await fetch('https://10.120.32.62/testi/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  });

  if (response.ok) {
    const result = await response.json();
    localStorage.setItem('authToken', result.token);
    window.location.href = '/website';
  } else {
    alert('Login failed. Please check your credentials.');
  }
});
