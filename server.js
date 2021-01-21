'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
// const cors = require('cors');
const cors = require('cors');
const superagent = require('superagent');
// const pg = require('pg');

// Step 2:  Set up our application/Specify port
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


// Database Connection Setup
// const client = new pg.Client(process.env.DATABASE_URL);//Take in path of database server
// client.connect(); // Use this when database is set up
// client.on('error', err => { throw err; });

//Application Middleware // EXRPESS MIDDLEWARE// Database Connection Setup
app.use(express.urlencoded({ extended: true }));//Double check
app.use(express.static('./public'));


//Set the view engine
app.set('view engine', 'ejs');// How you can tell you're using ejs at a quick glance


// Routes
app.get('/index', homeHandler);
app.post('/', searchHandler);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));



app.post('/searches', showHandler);


//Handlers

function searchHandler(request, response) {
  // let SQL = ``
  // const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:dune`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:king`;

  console.log(url);
  superagent.get(url)
    .then(value => {
      console.log(value);
      const yourBook = value.body.data.map(current => {
        return new Book(current);
      });
      response.status(200).send(yourBook);
    }).catch(error => {
      console.log('ERROR', error);
      response.status(500).send('So sorry, something went wrong.');
    });
}


function homeHandler(request, response) {
  response.status(200).render('pages/index');
}

function showHandler(request, response) {
  response.status(200).render('pages/searches/show');
}

//Constructors
function Book(result, image) {
  // Based off movie object
  this.title = result.volumeInfo.title;
  this.author = result.volumeInfo.arthur;
  this.isbn = result.isbn;
  this.image_url = `https://i.imgur.com/J5LVHEL.jpg`;//For missing images
  this.description = result.description;
}


// Connect to DB and Start the Web Server
app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});
