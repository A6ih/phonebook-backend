const mongoose = require('mongoose')

if (process.argv.length > 5) {
  console.log('Please use your password or enclose names in a string')
  process.exit(1)
}

const password = process.argv[2]

if (process.argv.length === 3) {
  const url = `mongodb+srv://Fullstack:${password}@cluster0.bq6qvnd.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

  mongoose.set('strictQuery', false)

  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })

  return
}

const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://Fullstack:${password}@cluster0.bq6qvnd.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

person.save().then((result) => {
  console.log('added', result.name, 'number', result.number, 'to phonebook')
  mongoose.connection.close()
})
