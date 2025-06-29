import { useEffect, useState } from "react"
import countryService from "./countryService"

const CountryView = ({ country }) => {

    const iconBaseUrl = "https://openweathermap.org/img/wn/"

    const [countryWeather, setCountryWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const weather = await countryService.getWeather(country.capital[0]);
                setCountryWeather(weather);
            } catch (err) {
                console.log(err);
            }
        }

        fetchWeather();
    }, [])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>
                <p>Capital {country.capital[0]}</p>
                <p>Area {country.area}</p>
            </div>
            <h2>Languages</h2>
            <div>
                {Object.values(country.languages).map(language => <p key={language}>{language}</p>)}
            </div>
            <img src={country.flags.png} />
            {countryWeather &&
                <div>
                    <h2>Weather in {country.capital[0]}</h2>
                    <p>Temperature {countryWeather.main.temp} Celsius</p>
                    <img
                        src={`${iconBaseUrl}/${countryWeather.weather[0].icon}@2x.png`}
                    />
                    <p>Wind {countryWeather.wind.speed} m/s</p>
                </div>
            }
        </div>
    )
}

export default CountryView