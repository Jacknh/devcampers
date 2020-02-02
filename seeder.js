const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const Bootcamp = require('./models/Bootcamp')

mongoose.connect('mongodb://localhost:27017/devcamper', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const importData = async () => {
  try {
    await Bootcamp.create(JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')));
    console.log('Data imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data destroyed'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === '-i') {
  importData();
}
if (process.argv[2] === '-d') {
  deleteData();
}