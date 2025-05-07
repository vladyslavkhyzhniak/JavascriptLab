const API_KEY = "0b8d97ab96ccfc4759d440854c0a9774";

const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const weatherList = document.getElementById("weather-list");

let cities = JSON.parse(localStorage.getItem("cities")) || [];

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;
    const response = await fetch(url);

    if (response.status === 404) {
        return null;
    }
    return await response.json();
}

function clearWeatherList() {
    while (weatherList.firstChild) {
        weatherList.removeChild(weatherList.firstChild);
    }
}

function createWeatherCard(data, cityKey) {
    const card = document.createElement("div");
    card.className = "weather-card";

    const infoDiv = document.createElement("div");

    const cityName = document.createElement("strong");
    cityName.textContent = data.name;

    const temp = document.createElement("div");
    temp.textContent = `Temp: ${Math.round(data.main.temp)}°C`;

    const humidity = document.createElement("div");
    humidity.textContent = `Wilgotność: ${data.main.humidity}%`;

    infoDiv.appendChild(cityName);
    infoDiv.appendChild(document.createElement("br"));
    infoDiv.appendChild(temp);
    infoDiv.appendChild(humidity);

    const iconDiv = document.createElement("div");

    const icon = document.createElement("img");
    icon.src = getWeatherIconUrl(data.weather[0].icon);
    icon.alt = data.weather[0].description;
    icon.title = data.weather[0].description;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Usuń";
    removeBtn.setAttribute("data-city", cityKey);

    iconDiv.appendChild(icon);
    iconDiv.appendChild(removeBtn);

    card.appendChild(infoDiv);
    card.appendChild(iconDiv);

    return card;
}

async function renderWeatherList() {
    clearWeatherList();
    for (const city of cities) {
        const data = await fetchWeather(city);
        if (data !== null) {
            const card = createWeatherCard(data, city);
            weatherList.appendChild(card);
        }
    }
}

cityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim().toLowerCase();

    if (!city || cities.includes(city) || cities.length >= 10) return;

    const weatherData = await fetchWeather(city);
    if (weatherData === null) {
        cityInput.value = "";
        return;
    }

    cities.push(city);
    saveCities();
    cityInput.value = "";
    renderWeatherList();
});

weatherList.addEventListener("click", (e) => {
    if (e.target.matches(".remove-btn")) {
        const cityToRemove = e.target.getAttribute("data-city");
        cities = cities.filter((city) => city !== cityToRemove);
        saveCities();
        renderWeatherList();
    }
});

renderWeatherList();
