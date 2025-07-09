const Persons = ({ personsToShow, deletePerson }) => {
    return (
        <table>
            <tbody>
                {personsToShow.map((person) => (
                    <tr key={person.name}>
                        <td>{person.name}</td>
                        <td>{person.number}</td>
                        <td>
                            <button onClick={() => deletePerson(person)}>delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Persons