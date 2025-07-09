const PersonForm = ({addPerson, handleChange, newPerson}) => {
  return (
      <form onSubmit={addPerson}>
        <div>
          name: <input name='name' onChange={handleChange} value={newPerson.name} />
        </div>

        <div>
          number: <input name='number' onChange={handleChange} value={newPerson.number} />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm