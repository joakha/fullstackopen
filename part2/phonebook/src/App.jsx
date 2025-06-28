import { useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newPerson, setNewPerson] = useState({ name: "", number: "" })
  const [searchWord, setSearchWord] = useState("");

  const personsToShow = searchWord ?
    persons.filter(person => person.name.toLowerCase().includes(searchWord)) :
    persons;

  const handleChange = (e) => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value });
  }

  const addPerson = (e) => {
    e.preventDefault();

    if (persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
      alert(`${newPerson.name} is already added to phonebook`);
      return
    }

    const newPersons = persons.concat(newPerson)
    setPersons(newPersons);
    setNewPerson({ name: "", number: "" });
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter setSearchWord={setSearchWord} searchWord={searchWord} />

      <PersonForm addPerson={addPerson} handleChange={handleChange} newPerson={newPerson} />

      <div>
        <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} />
      </div>
    </div>
  )
}

export default App