const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const Person = require("./models/person");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const url = process.env.MONGODB_URI;

const connectToMongoDb = async () => {
    try {
        console.log('connecting to', url);
        await mongoose.connect(url);
        console.log('connected to MongoDB');
    } catch (err) {
        console.log('error connecting to MongoDB:', err.message)
    }
};

connectToMongoDb();

const app = express();

app.use(express.json());

app.use(cors());

morgan.token('content', (req) => {
    return req.body ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

app.use(express.static(path.join(__dirname, "../phonebook-frontend/dist")));

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

app.get("/api/persons", async (req, res, next) => {
    try {
        const persons = await Person.find({});
        if (!persons) return res.status(404).json({ message: "No persons in db" });
        return res.status(200).json(persons);
    } catch (err) {
        next(err);
    }
});

app.get("/info", (req, res) => {
    const now = new Date();

    return res.status(200).send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
        `)
});

app.get("/api/persons/:id", async (req, res, next) => {

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "id of person required" });

    try {
        const person = await Person.findById(id);
        if (!person) return res.status(404).json({ message: "no person found" });
        return res.status(200).json(person);
    } catch (err) {
        next(err);
    }
});

app.delete("/api/persons/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "id of person required" });

    try {
        const personToDelete = await Person.findByIdAndDelete(id);
        if (!personToDelete) return res.status(404).json({ message: "person not found" });
        return res.status(200).json(personToDelete);
    } catch (err) {
        next(err)
    }
});

app.put("/api/persons/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "id of person required" });

    const updatedData = req.body;

    if (!updatedData) return res.status(400).json({ message: "Update data required!" });

    try {
        const personToUpdate = await Person.findByIdAndUpdate(id, updatedData, { new: true });
        if (!personToUpdate) return res.status(404).json({ message: "person not found" });
        return res.status(200).json(personToUpdate);
    } catch (err) {
        next(err)
    }
});

app.post("/api/persons", async (req, res, next) => {
    const person = req.body;
    if (!person) return res.status(400).json({ message: "person info missing from request" });
    const { name, number } = person;
    if (!name) return res.status(400).json({ message: "name missing from request" });
    if (!number) return res.status(400).json({ message: "number missing from request" });

    try {
        const newPerson = new Person({
            name: name,
            number: number
        })
        const savedPerson = await newPerson.save();
        return res.status(201).json(savedPerson);
    } catch (err) {
        next(err);
    }
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ message: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ message: error.message })
    }

    next(error)
}

app.use(errorHandler);

const port = process.env.PORT || 5001;

app.listen(port);

console.log(`App is running in port ${port}`);