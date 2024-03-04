const logger = require('../utils/logger')

const requestLogger = (tok, req, res) => {
  return [
    `Method:         ${tok.method(req, res)}`,
    `URL:            ${tok.url(req, res)}`,
    `status:         ${tok.status(req, res)}`,
    `Content-length: ${tok.res(req, res, 'content-length')} - ${tok['response-time'](req, res)}ms`,
    `Payload:        ${tok.body(req)}`,
    '--------------------------------'
  ].join('\n')
}

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error('errorHandler catched: ', err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

module.exports = { unknownEndpoint, errorHandler, requestLogger }