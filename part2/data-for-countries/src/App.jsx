import { useEffect, useState } from "react"
import countryService from "./countryService";
import CountryView from "./CountryView";
import CountryLine from "./CountryLine";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [shownCountry, setShownCountry] = useState(null);

  const countriesToShow = searchTerm ?
    countries.filter(country => country.name.common.toLowerCase().includes(searchTerm.toLowerCase())) :
    [];

  const onlyCountry = countriesToShow.length === 1 ? countriesToShow[0] : null;

  const handleChange = (e) => {
    setShownCountry(null);
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    const findCountries = async () => {
      try {
        const countries = await countryService.getAll();
        setCountries(countries);
      } catch (err) {
        console.log(err);
      }
    }

    findCountries();
  }, [])

  return (
    <div>
      <div>
        find countries <input onChange={handleChange} value={searchTerm} />
      </div>
      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 || shownCountry ? (
        <CountryView country={shownCountry ? shownCountry : onlyCountry} />
      ) : countriesToShow.length <= 10 && countriesToShow.length > 1 ? (
        countriesToShow.map(country => (
          <CountryLine key={country.name.common} country={country} setShownCountry={setShownCountry} />
        ))
      ) : (
        <p>No countries to show</p>
      )}
    </div>
  )
}

export default App