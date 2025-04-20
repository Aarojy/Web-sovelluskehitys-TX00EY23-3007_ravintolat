const registerButton = document.getElementById('registerSubmit');

registerButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordAgain = document.getElementById('passwordagain').value;

  if (password !== passwordAgain) {
    alert('Passwords do not match.');
    return;
  }

  console.log('Attempting registration...');

  const response = await fetch('https://10.120.32.62/testi/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  });

  if (response.ok) {
    const result = await response.json();
    console.log('Registration successful:', result);

    const loginResponse = await fetch(
      'https://10.120.32.62/testi/api/v1/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      }
    );

    const loginResult = await loginResponse.json();
    localStorage.setItem('authToken', loginResult.token);
    window.location.href = 'index.html';
  } else {
    alert('Registration failed. Please check your credentials.');
  }
});
