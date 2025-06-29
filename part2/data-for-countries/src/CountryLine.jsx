const CountryLine = ({ country, setShownCountry }) => {
    return (
        <div>
            <span>{country.name.common}</span>
            <button onClick={() => setShownCountry(country)}>show</button>
        </div>
    )
}

export default CountryLine