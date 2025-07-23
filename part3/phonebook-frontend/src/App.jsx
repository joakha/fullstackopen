import { useEffect, useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import personService from './personService'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: "", number: "" })
  const [searchWord, setSearchWord] = useState("");
  const [notification, setNotification] = useState(null);

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
      return;
    }

    try {
      const postedPerson = await personService.postPerson(newPerson);
      const newPersons = persons.concat(postedPerson);
      setPersons(newPersons);
      setNewPerson({ name: "", number: "" });
      setNotification({message: `Added ${postedPerson.name}`, type: "success"});
    } catch (err) {
      console.log(err);
      setNotification({message: err.response.data.message, type: "failure"});
    }
  }

  const updatePersonNumber = async (existingPerson) => {
    if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      try {
        const updatedPerson = await personService.updateNumber(existingPerson.id, newPerson);
        const newPersons = persons.map((person) => {
          return person.id === updatedPerson.id ? updatedPerson : person;
        })
        setPersons(newPersons);
        setNewPerson({ name: "", number: "" });
        setNotification({message: `Updated number for ${updatedPerson.name}`, type: "success"});
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
        setNotification({message: `Deleted ${deletedPerson.name}`, type: "success"});
      } catch (err) {
        console.log(err);
        err.status === 404 && 
        setNotification({message: `Information of ${personToDelete.name} has already been removed from server`, type: "failure"});
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification notification={notification} setNotification={setNotification} />}
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