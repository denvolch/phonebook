const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (num) => /^\d{2,3}-\d{6,8}$/.test(num),
      message: (props) => `${props.value} isn't a valid`
    }
  },
})
personSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

