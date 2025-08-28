import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)


  useEffect(() => {
    const request = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    request.then(response => setCountries(response.data))
  }, [])

  //const countries = ['Rwanda', 'Burundi', 'Uganda', 'Tanzania', 'Kenya', 'South Sudan', 'Somalia', 'Ethiopia', 'Djibouti']

  const handleSearching = (e) => {
    setSearch(e.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  
  const toShow = search ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())) : []

  let content
  if(toShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (toShow.length === 1 || selectedCountry) {
    const country = selectedCountry ? selectedCountry : toShow[0]
    content = (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} km²</p>
        <h4>Languages:</h4>
        <ul>
          {Object.values(country.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      </div>
    )
  } else {
    content = (
      <ul>
        {toShow.map(country => (
          <li key={country.cca3}>{country.name.common} <button onClick={() => showCountry(country)}>Show</button></li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      Find countries <input value={search} onChange={handleSearching} />
      <div>{content}</div>
    </div>
  )
}

export default App
