let user = null;
const profilePic = document.getElementById('profile-picture');
const userToken = localStorage.getItem('authToken');
const imgSubmitButton = document.getElementById('imgSubmit');
const usernameText = document.getElementById('username');

imgSubmitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    formData.append('file', file);

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/img/${user.user.username}`, // Correct URL
        {
          method: 'POST', // Specify the HTTP method here
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data);
      } else {
        console.error('Error uploading image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  } else {
    alert('Please select an image to upload.');
  }
});

const fetchUserProfile = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/me', {
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

const updateFavorite = async (user) => {
  const favoriteList = document.getElementById('favorite');

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/favorite/${user.user.username}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const data = await response.json();
    console.log('Favorite data:', data);

    if (data.error) {
      console.warn('No favorite found:', data.error);
      favoriteList.innerHTML = 'Lempi ravintola: Ei valittua suosikkia.';
    } else {
      // Display the favorite restaurant
      favoriteList.innerHTML = `Lempi ravintola: ${data}`;
    }
  } catch (error) {
    console.error('Error fetching favorite: ', error);
  }
};

const updateProfilePic = (user) => {
  profilePic.src = `http://localhost:3000/uploads/${user.user.username}.png`;
};

const main = async () => {
  user = await fetchUserProfile();
  usernameText.innerText = user.user.username;
  updateProfilePic(user);
  updateFavorite(user);
};
main();
