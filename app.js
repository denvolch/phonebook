const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const personsRouter = require('./controllers/person')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(() => logger.error('error connecting to MongoDB'))

morgan.token('body', (req) => !Object.keys(req.body).length === 0
  ? JSON.stringify(req.body)
  : null
)

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(middleware.requestLogger))
app.use('/api/persons', personsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app