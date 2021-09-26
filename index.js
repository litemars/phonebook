const express = require('express')
const app =express()
const morgan = require('morgan')
const cors=require('cors')
morgan.token('json', function (req, res) {  if(req.method==='POST') return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const Note = require('./models/Person')
const mongoose = require('mongoose')
const Person = require('./models/Person')
var password='fullstack'
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

  
app.put('/api/persons/:id', (request, response) => {
    //phone = phone.filter(p => p.name !== request.body.name)
    const person = {
      name: request.body.name,
      number: request.body.number,
      id: request.body.id
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error=>next(error))
  })

app.post('/api/persons',(request,response)=>{
      const person =  new Person({
        name: request.body.name,
        number: request.body.number    
    })
    
    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
    .catch(error => next(error))
})





app.get('/',(req,res)=>{
    res.send("Hello")
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
      response.json(result)
    })
})


app.get('/info',(request,response)=>{
    let num_phone=phone.length
    response.send('<div>Phonebook has info for ' + num_phone + ' people</div><div>' + new Date() + '</div>')
  })
 
app.get('/api/persons/:id',(request, response) => {
    Person.findById(request.params.id).then(per => {
      if(per){
        response.json(per)
      } else {
        response.status(404).end()
      }
  })})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end()
  })})




const port = process.env.PORT || 3001
app.listen(port,()=>{
  console.log(`Server running on port ${port}`)
})