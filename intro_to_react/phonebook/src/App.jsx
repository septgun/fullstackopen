import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import phonebookService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebookService.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (existingPerson.number !== newNumber) {
        const confirmUpdate = confirm(
          `${existingPerson.name} is already in the phonebook, replace the old number with a new one?`
        )
        if (confirmUpdate) {
          phonebookService
            .update(existingPerson.id, newPerson)
            .then(updatedPerson => {
              setPersons(persons.map(p => 
                p.id !== existingPerson.id ? p : updatedPerson
              ))
              setNewName('')
              setNewNumber('')
              setNotification({message: `Updated ${newPerson.name}'s number`, class: "success"})
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            })
            .catch(error => {
              setNotification({message: error.response.data.error, class: "error"})
              setTimeout(() => {
                setNotification(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== existingPerson.id))
            })
        }
      } else {
        alert(`${existingPerson.name} is already in the phonebook`)
      }
      return
    }

    phonebookService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNotification({message: `Added ${newPerson.name}`, class: "success"})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        console.log(error.response.data.error)
        setNotification({message: error.response.data.error, class: "error"})
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((person) =>
      person.id === id
    )
    if (!confirm(`Delete ${person.name} ?`)){
      return
    }
    phonebookService.deletePerson(id)
      // eslint-disable-next-line no-unused-vars
      .then(response => {
        setNotification({message: `Deleted ${person.name}`, class: "error"})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        const updatedList = persons.filter(person => person.id !== id)
        setPersons(updatedList)
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        alert(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase()
    ))
    : persons


  return (
    <div>
      <h2>Phonebook</h2>
      {notification ? <Notification notification={notification}/> : ""}
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Person personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App