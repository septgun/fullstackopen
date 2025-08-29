const express = require("express")
const morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.send(persons)
})

app.get("/info", (request, response) => {
    const now = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people </p> ${now}`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.send(person)
    } else {
        response.statusMessage = `Person Not Found`
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * (1000000 - 1) + 1)
}

app.post("/api/persons", (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({
            error: "missing name"
        })
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "missing number"
        })
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }

        persons = persons.concat(person)
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
