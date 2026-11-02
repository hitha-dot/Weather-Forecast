
const API_KEY = "9e65d1830b8fb6429fa1e376d74d4d0c";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchWeather();
});

async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    return;
  }

  if (API_KEY === "YOUR_API_KEY_HERE") {
    message.textContent = "Please add your OpenWeatherMap API key in script.js.";
    return;
  }

  message.textContent = "Loading weather...";
  searchBtn.disabled = true;

  try {
    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();

    if (!currentResponse.ok) {
      throw new Error(currentData.message || "Unable to find this city.");
    }

    displayWeather(currentData);

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (!forecastResponse.ok) {
      throw new Error(forecastData.message || "Forecast unavailable.");
    }

    displayForecast(forecastData);
    message.textContent = "";

  } catch (error) {
    message.textContent = error.message;
    document.getElementById("weatherCard").hidden = true;
    document.getElementById("forecastSection").hidden = true;
  } finally {
    searchBtn.disabled = false;
  }
}

function displayWeather(data) {
  document.getElementById("weatherCard").hidden = false;

  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("description").textContent =
    data.weather[0].description;

  document.getElementById("feelsLike").textContent =
    `Feels like ${Math.round(data.main.feels_like)}°C`;

  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `${data.wind.speed} m/s`;

  document.getElementById("pressure").textContent =
    `${data.main.pressure} hPa`;

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
  document.getElementById("forecastSection").hidden = false;

  const forecastGrid = document.getElementById("forecastGrid");
  forecastGrid.innerHTML = "";

  const dailyForecasts = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];

    if (!dailyForecasts[date] || item.dt_txt.includes("12:00:00")) {
      dailyForecasts[date] = item;
    }
  });

  Object.values(dailyForecasts).slice(0, 5).forEach(item => {
    const date = new Date(item.dt * 1000);

    const day = date.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const card = document.createElement("div");

    const dayText = document.createElement("p");
    dayText.textContent = day;

    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    icon.alt = item.weather[0].description;

    const description = document.createElement("p");
    description.textContent = item.weather[0].description;

    const temperature = document.createElement("strong");
    temperature.textContent = `${Math.round(item.main.temp)}°C`;

    card.append(dayText, icon, description, temperature);
    forecastGrid.appendChild(card);
  });
}
