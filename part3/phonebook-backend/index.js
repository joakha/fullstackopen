import express from "express"

const app = express();

app.use(express.json());

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get("/api/persons", (req, res) => {
    return res.status(200).json(persons);
});

app.get("/info", (req, res) => {
    const now = new Date();

    return res.status(200).send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
        `)
});

app.get("/api/persons/:id", (req, res) => {

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "id of person required" });

    const person = persons.find(person => person.id === id);

    if (!person) return res.status(404).json({ message: "no person found" });

    return res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "id of person required" });

    persons = persons.filter(person => person.id !== id);

    return res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const person = req.body;
    if (!person) return res.status(400).json({ message: "person info missing from request" });
    const { name, number } = person;
    if (!name) return res.status(400).json({ message: "name missing from request" });
    if (!number) return res.status(400).json({ message: "number missing from request" });
    const nameExists = persons.some(person => person.name.toLowerCase() === name.toLowerCase());
    if (nameExists) return res.status(400).json({ message: "name must be unique" });
    const personId = Math.floor(Math.random() * 1000000);
    const newPerson = { ...person, id: personId.toString() };
    persons.push(newPerson);
    return res.status(201).json({ message: "person added to phonebook!" });
});

const port = 3001;

app.listen(port);

console.log(`App is running in port ${port}`);