const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

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


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
    res.json(persons)
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

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    persons.filter(person => person.id !== id)
    res.statusMessage = 'Record has deleted'
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name) {
        res.statusMessage = 'Field Name is empty'
        return res.status(400).json({
            error: 'Field Name is empty'
        })
    }
    if (persons.some(person => person.name === req.body.name)) {
        res.statusMessage = 'Name is already existed'
        return res.status(400).json({
            error: 'Name is already existed'
        })
    }

    let nextId
    do {
        nextId = Math.floor(Math.random() * (1000 - persons.length) + persons.length)
    } while (persons.find(person => person.id === nextId))

    const id = persons.length > 0
        ? nextId
        : 0

    const newPerson = {
        ...req.body,
        id: id,
    }
    persons = persons.concat(newPerson)
    res.json(newPerson).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})