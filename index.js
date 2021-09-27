const express = require('express')
const app =express()
const morgan = require('morgan')
const cors=require('cors')
morgan.token('json', function (req, res) {  if(req.method==='POST') return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const Person = require('./models/Person')
// DATA


let phone = [
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

//


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

  
app.put('/api/persons/:id', (request, response, next) => {
    //phone = phone.filter(p => p.name !== request.body.name)
    console.log(request.body)
    const person = {
      name: request.body.name,
      number: request.body.number
    }
    Person.findByIdAndUpdate((request.body.id), person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error=>next(error))
  })
//works
app.post('/api/persons',(request,response, next)=>{
      console.log(request.body)
      const person =  new Person({
        name: request.body.name,
        number: request.body.number    
    })
    
    person.save()
    .then(savedPerson =>  {
      console.log("log ",savedPerson)
      response.json(savedPerson)
      
    }) 
    .catch(error => next(error))
})




//works
app.get('/',(req,res)=>{
    res.send("Hello")
})

//works
app.get('/api/persons', (request, response,next) => {
  Person.find({}).then(result => {
      response.json(result)
    }).catch(error => next(error))
})

//works
app.get('/info',(request,response,next)=>{
    let num_phone=phone.length
    response.send('<div>Phonebook has info for ' + num_phone + ' people</div><div>' + new Date() + '</div>')
  })
 
//Works  
app.get('/api/persons/:id',(request, response) => {
  console.log("here1")
    Person.findById(request.params.id).then(per => {
      console.log(per)
      if(per){
        response.json(per)
      } else {
        response.status(404).end()
      }
  })})
//works
app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})




const port = process.env.PORT || 3001
app.listen(port,()=>{
  console.log(`Server running on port ${port}`)
})