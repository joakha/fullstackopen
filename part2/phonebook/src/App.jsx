import { useEffect, useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import personService from './personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: "", number: "" })
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    const getPersons = async () => {
      try {
        const allPersons = await personService.getAll();
        setPersons(allPersons);
      } catch (err) {
        console.log(err);
      }
    }

    getPersons();
  }, [])

  const personsToShow = searchWord ?
    persons.filter(person => person.name.toLowerCase().includes(searchWord)) :
    persons;

  const handleChange = (e) => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value });
  }

  const addPerson = async (e) => {
    e.preventDefault();

    const existingPerson = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase());

    if (existingPerson) {
      updatePersonNumber(existingPerson);
      return
    }

    try {
      const postedPerson = await personService.postPerson(newPerson);
      const newPersons = persons.concat(postedPerson);
      setPersons(newPersons);
      setNewPerson({ name: "", number: "" });
    } catch (err) {
      console.log(err);
    }
  }

  const updatePersonNumber = async (existingPerson) => {
    if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      try {
        const updatedPerson = await personService.updateNumber(existingPerson.id, { number: newPerson.number });
        const newPersons = persons.map((person) => {
          return person.id === updatedPerson.id ? updatedPerson : person;
        })
        setPersons(newPersons);
        setNewPerson({ name: "", number: "" });
      } catch (err) {
        console.log(err);
      }
    };
  }

  const deletePerson = async (personToDelete) => {
    if (confirm(`Do you want to delete ${personToDelete.name}?`)) {
      try {
        const deletedPerson = await personService.deletePerson(personToDelete.id);
        setPersons(persons.filter(person => person.id !== deletedPerson.id));
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter setSearchWord={setSearchWord} searchWord={searchWord} />

      <PersonForm addPerson={addPerson} handleChange={handleChange} newPerson={newPerson} />

      <div>
        <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
      </div>
    </div>
  )
}

export default App