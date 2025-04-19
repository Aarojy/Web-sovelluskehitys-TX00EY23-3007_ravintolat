import {fetchData} from './utils/fetchData.js';
import {addMarker} from './leaflet.js';
import {parseFinnishDate} from './utils/parseDate.js';

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];
let selectedRestaurantID = '';
let selectedDay = 0;
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

  weeklyMenu.days.forEach((day) => {
    if (locale === 'fi') {
      dateTime = parseFinnishDate(day.date);
    } else if (locale === 'en') {
      dateTime = day.date;
    }
  });
};

const changeMenu = (menu) => {
  const menuElement = document.getElementById('menu');
  menuElement.innerHTML = '';

  const daymenu = menu.days[0];
  const courses = daymenu.courses;

  courses.forEach((course) => {
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

  selectedRestaurantWeeklyMenu = await getWeeklyMenu(
    selectedRestaurantID,
    locale
  );
  parseWeekday(selectedRestaurantWeeklyMenu);
  changeMenu(selectedRestaurantWeeklyMenu);
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

      selectedDay = event.target.value;
      console.log(`Selected day: ${selectedDay}`);
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
