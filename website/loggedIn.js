const userToken = localStorage.getItem('authToken');

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

if (userToken) {
  const user = await fetchUserProfile();
  if (user) {
    console.log('User profile fetched successfully:', user);
  }
}
