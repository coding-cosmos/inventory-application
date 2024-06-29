#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Instrument = require("./models/instrument");
const Category = require("./models/category");

const instruments = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createInstruments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function instrumentCreate(
  index,
  name,
  description,
  category,
  price,
  number,
  image
) {
  const instrumentDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number: number,
  };

  if (image != false) instrumentDetail.image = image;

  const instrument = new Instrument(instrumentDetail);
  await instrument.save();
  instruments[index] = instrument;
  console.log(`Added instrument ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(
      0,
      "Percussion Instruments",
      "These produce sound when struck, shaken, or scraped."
    ),
    categoryCreate(
      1,
      "String Instruments",
      "These instruments produce sound through vibrating strings."
    ),
    categoryCreate(
      2,
      "Brass Instruments",
      "These produce sound through buzzing lips into a mouthpiece."
    ),
    categoryCreate(
      3,
      "Keyboard Instruments",
      "These produce sound through keys that trigger hammers or pluck strings."
    ),
    categoryCreate(
      4,
      "Woodwind Instruments",
      "These produce sound by vibrating a column of air within the instrument."
    ),
  ]);
}

async function createInstruments() {
  console.log("Adding Instruments");
  await Promise.all([
    instrumentCreate(
      0,
      "Drum Set",
      "A set of drums played by striking them with sticks or mallets.",
      categories[0],
      1000,
      3,
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT5AOl-2zChwR0y0s2RUpUgLTmqXMaywWJNZjm7cVwAw1PZzIJfHMLliyhr3f8J"
    ),
    instrumentCreate(
      1,
      "Acoustic Guitar",
      "A string instrument with a wooden body and six strings that are plucked or strummed to create sound.",
      categories[1],
      500,
      4,
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQc0r2rEXJTYIUm5zAS9gtG6VljMartsaeQOjz6ChmQqQKaQaiBOtjrLJ4Ut7OW"
    ),
    instrumentCreate(
      2,
      "Trumpet",
      "A brass instrument with a valved slide that produces sound by vibrating air through a mouthpiece.",
      categories[2],
      300,
      2,
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQofDikQxKXwv_8ADXq3yeGu_zfywUWdqBBEuRtveLFR3-DsBpAly3bW4RZ2LSo"
    ),
    instrumentCreate(
      3,
      "Piano",
      "A keyboard instrument with a wooden frame and metal strings that are struck by hammers when a key is pressed.",
      categories[3],
      2000,
      1,
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpwbgkceTcyqOKDM1STX4K-QXHaAuMDovpjvkafq4FR83DRi5D3f85GEAgdS0e"
    ),
    instrumentCreate(
      4,
      "Clarinet",
      "A woodwind instrument with a single reed that produces sound by vibrating air blown through the mouthpiece.",
      categories[4],
      800,
      5,
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQRSc1IWAByRFCUkrBeaBw28R2Ffnu3QR5G-ZgZ2vDzrukQo5gXii9wSMru4h_m"
    ),
  ]);
}
