import axios from "axios"

const API_KEY = import.meta.env.VITE_API_KEY;

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"
const weatherAPIUrl = "https://api.openweathermap.org/data/2.5"

const getAll = async () => {
    const response = await axios.get(`${baseURL}/all`);
    return response.data;
}

const getWeather = async (capital) => {
    const response = await axios.get(`${weatherAPIUrl}/weather?q=${capital}&units=metric&appid=${API_KEY}`);
    return response.data;
}


export default {
    getAll,
    getWeather
}