import {fetchData} from './utils/fetchData.js';
import {addMarker} from './leaflet.js';
import {parseFinnishDate} from './utils/parseDate.js';

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];
let selectedRestaurantID = '';
let selectedDay = 1;
let locale = 'fi';
let selectedRestaurantWeeklyMenu = null;

async function getRestaurants() {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants/');
  } catch (error) {
    console.error(error.message);
  }
}

async function getWeeklyMenu(id, lang) {
  try {
    return await fetchData(`${apiUrl}/restaurants/weekly/${id}/${lang}`);
  } catch (error) {
    console.error(error.message);
  }
}

const parseWeekday = (weeklyMenu) => {
  let dateTime = null;
  let changed = false;

  weeklyMenu.days.forEach((day) => {
    if (locale === 'fi') {
      dateTime = parseFinnishDate(day.date);
    } else if (locale === 'en') {
      dateTime = new Date(day.date);
    }

    if (dateTime.getDay() === selectedDay) {
      changeMenu(day.courses);
      document.getElementById('menuTitle').innerHTML =
        'Ruokalista (' + day.date + ')';
      changed = true;
    }
  });
  if (!changed) {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = '';

    const courseElement = document.createElement('div');
    courseElement.className = 'menu-item';
    courseElement.innerHTML = `<p>Ei ruokalistaa tarjolla</p>`;

    menuElement.appendChild(courseElement);

    document.getElementById('menuTitle').innerHTML = 'Ruokalista';
  }
};

const changeMenu = (menu) => {
  const menuElement = document.getElementById('menu');
  menuElement.innerHTML = '';

  menu.forEach((course) => {
    const courseElement = document.createElement('div');
    courseElement.className = 'menu-item';
    courseElement.innerHTML = `
      <p>${course.name}<p>
      <p>Price: ${course.price} €</p>
      <p>${course.diets}</p>
    `;
    menuElement.appendChild(courseElement);
  });
};

const handleMarkerClick = async (name) => {
  selectedRestaurantID = restaurants.find(
    (restaurant) => restaurant.name === name
  )._id;
  document.getElementById('restaurant').innerText = name;
  document.getElementById('menuTitle').innerHTML = 'Ruokalistaa Ladataan...';

  selectedRestaurantWeeklyMenu = await getWeeklyMenu(
    selectedRestaurantID,
    locale
  );
  parseWeekday(selectedRestaurantWeeklyMenu);
};

const addRestaurantMarkers = (restaurants) => {
  restaurants.forEach((restaurant) => {
    const {location, name} = restaurant;
    addMarker(
      location.coordinates[1],
      location.coordinates[0],
      name,
      handleMarkerClick
    );
  });
};

const createDateButtonHooks = () => {
  const buttons = document.querySelectorAll('#weekdays button');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      buttons.forEach((btn) => {
        btn.classList.remove('selected');
      });
      event.target.classList.add('selected');
      document.getElementById('menuTitle').innerHTML =
        'Ruokalistaa Ladataan...';

      selectedDay = parseInt(event.target.value);

      selectedRestaurantWeeklyMenu = await getWeeklyMenu(
        selectedRestaurantID,
        locale
      );
      parseWeekday(selectedRestaurantWeeklyMenu);
    });
  });
};

async function main() {
  createDateButtonHooks();

  try {
    await getRestaurants();
  } catch (error) {
    console.error(error.message);
  }
  addRestaurantMarkers(restaurants);
}

main();
