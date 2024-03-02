require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan((tok, req, res) => {
  return [
    tok.method(req, res),
    tok.url(req, res),
    tok.status(req, res),
    tok.res(req, res, 'content-length'), '-',
    tok['response-time'](req, res), 'ms',
    tok.body(req, res)
  ].join(' ')
}))

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(err)
}
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200)
})

app.get('/info', (req,res) => {
  let peopleCount = persons.length
  const currentData = new Date()
  res.send(`
    <p>Phonebook has info for ${peopleCount} people.</P>
    <br />
    <p>${currentData}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(removedPerson => {
      console.log(removedPerson)
      res.json(removedPerson)
    })
    .catch(err => next(error))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name) {
    res.statusMessage = 'Field Name is empty'
    return res.status(400).json({
        error: 'Field Name is empty'
    })
  }

  Person.find({ name: req.body.name })
  .then(result => {
    if (result.length > 0) {
      res.status(400).send({ error: 'Name is already existed' })

    } else {
      const person = new Person({
        name: req.body.name,
        number: req.body.number,
      })

      person
        .save()
        .then(persons => {
            console.log(JSON.stringify(person))
            res.json(persons)
        })
        .catch(err => next(err))
    }
  })
  .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})