const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const url = "mongodb+srv://fullstack:fullstack@cluster0-ostce.mongodb.net/test?retryWrites=true"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    number: {type: String, required: true},
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log("transform")
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)