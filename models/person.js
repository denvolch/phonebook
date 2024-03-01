const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
    .connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB'))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

