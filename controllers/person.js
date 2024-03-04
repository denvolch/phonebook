const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const currentData = new Date()

      res.send(`
          <p>Phonebook has info for ${persons.length} people.</P>
          <br />
          <p>${currentData}</p>
        `)
    })
})

personsRouter.get('/', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(foundPerson => res.json(foundPerson))
    .catch(err => next(err))
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(removedPerson => {
      res.json(removedPerson)
    })
    .catch(err => next(err))
})

personsRouter.post('/', (req, res, next) => {
  if (!req.body.name) {
    res.statusMessage = 'Field Name is empty'

    return res.status(400).json({ error: 'Field Name is empty' })
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  })

  person.save()
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

personsRouter.put('/:id', (req, res, next) => {
  Person.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

module.exports = personsRouter