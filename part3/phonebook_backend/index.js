require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()


app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get("/info", (request, response, next) => {
    const now = new Date()
	Person.countDocuments({})
		.then(count => {
    		response.send(`<p>Phonebook has info for ${count} people </p> ${now}`)
		})
		.catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (!person) {
				return response.status(404).end()
			}
			response.json(person)
		})
		.catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({
      error: "missing name"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "missing number"
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(person => {
      response.json(person)
    })
    .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body
	const updatedPerson = { name, number }
	
	Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
		.then(result => {
			if (!result) {
				return response.status(404).end()
			}
			response.json(result)
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
