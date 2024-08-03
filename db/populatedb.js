#! /usr/bin/env node

const {Client} = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS categories(
    category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (52),
    description VARCHAR (255),
    url TEXT GENERATED ALWAYS AS ('/catalog/category/'||category_id) STORED
);

INSERT INTO categories(name, description)
VALUES 
('Percussion Instruments','These produce sound when struck, shaken, or scraped.'),
('String Instruments','These instruments produce sound through vibrating strings.'),
('Brass Instruments','These produce sound through buzzing lips into a mouthpiece.'),
('Keyboard Instruments','These produce sound through keys that trigger hammers or pluck strings.'),
('Woodwind Instruments','These produce sound by vibrating a column of air within the instrument.');

CREATE TABLE IF NOT EXISTS instruments(
    instrument_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (52),
    description TEXT,
    price DECIMAL ,
    image TEXT,
    number INTEGER,
    category_id INTEGER REFERENCES categories(category_id),
    url TEXT GENERATED ALWAYS AS ('/catalog/instrument/'||instrument_id) STORED
);

INSERT INTO instruments (name, description,price,image,number,category_id)
VALUES
    ('Drum Set','A set of drums played by striking them with sticks or mallets.',1000,'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT5AOl-2zChwR0y0s2RUpUgLTmqXMaywWJNZjm7cVwAw1PZzIJfHMLliyhr3f8J',3,1),
    ('Acoustic Guitar','A string instrument with a wooden body and six strings that are plucked or strummed to create sound.',500,'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQc0r2rEXJTYIUm5zAS9gtG6VljMartsaeQOjz6ChmQqQKaQaiBOtjrLJ4Ut7OW',4,2),
    ('Trumpet','A brass instrument with a valved slide that produces sound by vibrating air through a mouthpiece.',300,'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQofDikQxKXwv_8ADXq3yeGu_zfywUWdqBBEuRtveLFR3-DsBpAly3bW4RZ2LSo',2,3),
    ('Piano','A keyboard instrument with a wooden frame and metal strings that are struck by hammers when a key is pressed.',2000,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpwbgkceTcyqOKDM1STX4K-QXHaAuMDovpjvkafq4FR83DRi5D3f85GEAgdS0e',1,4),
    ('Clarinet','A woodwind instrument with a single reed that produces sound by vibrating air blown through the mouthpiece.',800,'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQRSc1IWAByRFCUkrBeaBw28R2Ffnu3QR5G-ZgZ2vDzrukQo5gXii9wSMru4h_m',5,5);

`;

async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: "postgresql://sujal:mittal@localhost:5432/inventory",
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  }

  main();