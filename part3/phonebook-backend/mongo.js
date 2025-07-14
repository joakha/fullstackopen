const mongoose = require("mongoose");

const username = process.argv[2];
const password = process.argv[3];

const url = `mongodb+srv://${username}:${password}@cluster0.lsu7d93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema);

async function main() {
  await mongoose.connect(url);

  const newPerson = new Person({
    name: process.argv[4],
    number: process.argv[5]
  });

  try {
    await newPerson.save();
    console.log('Person saved!');
  } catch (err) {
    console.error('Error saving person:', err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
