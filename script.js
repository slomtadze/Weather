
const citySearchBtn = document.querySelector('.input-box');
const citySearchInput = document.getElementById('city');


//DOM Elements 

const temperatureDOM = document.querySelector('.temperature h2');
const cityDOM = document.querySelector('.city-name h3');
const timeDOM = document.querySelector('.city-name span');
const iconDOM = document.querySelector('.icon-small');
const iconStrDOM = document.querySelector('.weather-icon span')
const feelsLikeDOM = document.querySelector('.feelslike-detail h3')
const humidityDOM = document.querySelector('.humidity-detail h3')
const windDOM = document.querySelector('.wind-detail h3')
const weatherImgDiv = document.querySelector('.weather-img')
const searchHistoryCities = [...document.querySelectorAll('.search-history p')]


const resetError = () => {
    let error = document.querySelector('.error');
    error.style.display = 'none'
}

const showError = () => {
    let error = document.querySelector('.error');
    error.style.display = 'block'
}

const getIcon = (iconId) => {
    let iconNum = iconId.slice(0,2)
    let iconStr = ''
    new Date().getHours() < 7 ? iconStr = 'n' : iconStr = 'd'

    return `https://openweathermap.org/img/wn/${iconNum}${iconStr}@2x.png`
}

const weatherImgGenerate = (condition) => {

    if(condition.includes('Clear')){
        weatherImgDiv.style.backgroundImage = "url('resources/sunny.jpg')"
    } else if(condition.includes('Cloud')){
        weatherImgDiv.style.backgroundImage = "url('resources/cloudy.jpg')"
    } else if(condition.includes('Rain')){
        weatherImgDiv.style.backgroundImage = "url('resources/rainy.jpg')"
    } else if(condition.includes('Snow')){
        weatherImgDiv.style.backgroundImage = "url('resources/snow.jpg')"
  }
}

const createSearchHistory = (search) => {
    const searchHistory = JSON.parse(localStorage.getItem('city')) || [];
    if (!searchHistory.includes(search)){
        if(searchHistory.length < 4){
            searchHistory.push(search);
        }else if(searchHistory.length == 4){
            searchHistory.shift();
            searchHistory.push(search);
        }
    }
    localStorage.setItem('city', JSON.stringify(searchHistory))
}

const searchHistoryDOM = (arr) => {
    for (let i=arr.length-1; i >= 0; i--){
        searchHistoryCities[i].textContent = arr[i].toLocaleUpperCase()
    }
}
const getCurDate = () => {
    const curDate = new Date;
    return curDate.toString().slice(0,24)
}

const weatherCall = async (city) => {
    resetError()
    try {
        const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20daa21043c1a67f1554f168ea9a184f&units=metric`)
        const result = await responce.json();
            temperatureDOM.textContent = `${Math.round(result.main.temp)}`
            cityDOM.textContent = result.name.toLocaleUpperCase();
            timeDOM.textContent = getCurDate();
            iconDOM.src = getIcon(result.weather[0].icon);
            iconStrDOM.textContent = result.weather[0].main;
            feelsLikeDOM.textContent = `${Math.round(result.main.feels_like)}`
            humidityDOM.textContent = result.main.humidity
            windDOM.textContent = `${Math.round(result.wind.speed)} m/s `
            weatherImgGenerate (result.weather[0].main);
            createSearchHistory(city);
            searchHistoryDOM(JSON.parse(localStorage.getItem('city')));
    } catch (error) {
        console.log(error)
        showError()
    }
}

weatherCall('kutaisi');

citySearchBtn.addEventListener('submit', e => {
    e.preventDefault();
    weatherCall(citySearchInput.value);
})
