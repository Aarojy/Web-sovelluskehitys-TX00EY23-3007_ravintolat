const userToken = localStorage.getItem('authToken');

const changeLoggedIn = (user) => {
  const infoCont = document.getElementById('restaurant-info-container');

  if (infoCont) {
    const favoriteBtn = document.createElement('button');
    favoriteBtn.innerText = 'Lisää suosikiksi';
    infoCont.appendChild(favoriteBtn);
    favoriteBtn.addEventListener('click', () => {
      const restaurantName = document.getElementById('restaurant').innerText;
      postFavorite(restaurantName, user);
    });
  }

  const navbar = document.getElementById('navbar');
  const title = document.getElementById('title');
  const loginButton = document.getElementById('loginBtn');
  const registerButton = document.getElementById('registerBtn');

  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  const userTitle = document.createElement('p');
  userTitle.innerText = 'Käyttäjä:';
  const usernameText = document.createElement('p');
  usernameText.innerText = user.user.username;
  userInfo.appendChild(userTitle);
  userInfo.appendChild(usernameText);
  title.appendChild(userInfo);

  const profileButton = document.createElement('a');
  profileButton.href = '/website/profile.html';
  profileButton.innerText = 'Profiili';
  navbar.appendChild(profileButton);

  const logoutButton = document.createElement('a');
  logoutButton.href = '/website/';
  logoutButton.innerText = 'Kirjaudu ulos';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = '/website/';
  });
  navbar.appendChild(logoutButton);

  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
};

const postFavorite = async (restaurantName, user) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/favorite/${user.user.username}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({favorite: restaurantName}),
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await fetch('https://10.120.32.62/testi/api/v1/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const main = async () => {
  if (userToken) {
    const user = await fetchUserProfile();
    if (user) {
      changeLoggedIn(user);
    }
  }
};

main();
