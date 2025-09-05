const mongoose = require('mongoose')
if (process.argv.length < 3) {
	console.log('give password, name, and number')
	process.exit(1)
}

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

const password = process.argv[2]

const url = `mongodb+srv://nifab:${password}@cluster0.mkdqul6.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		console.log('phonebook:')
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
}

if (process.argv.length === 5) {
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new Person({ name, number })

	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}
