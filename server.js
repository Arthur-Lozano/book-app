'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
// const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


// Step 2:  Set up our application/Specify port
const app = express();
const PORT = process.env.PORT || 3000;

//Application Middleware
app.use(express.urlencoded({extended:true}));//Double check
app.use(express.static('public'));


app.set('view engine', 'ejs');// How you can tell you're using ejs at a quick glance
// app.use(cors());


// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));
// Routes
app.get('/', homeHandler);
app.post('/searches', searchHandler);
app.get('/hello', helloHandler);//Used to test application without database
app.get('*', ('Sorry, you have reached an error page'));



//Handlers

function searchHandler(request, response) {
  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${key}&lat=${lat}&lon=${lon}&days=8`;
  superagent.get(url)
    .end(value => {
      const yourBook = value.body.data.map(current => {
        return new Book(current);
      });
      response.status(200).send(yourBook);
    }).catch(error => {
      console.log('ERROR', error);
      response.status(500).send('So sorry, something went wrong.');
    });
}

function helloHandler(request, response) {
  response.status(200).render('pages/index');//.render instead of .sendFile
}

function homeHandler(request, response) {
  response.status(200).render('pages/searches/new');
}

//Constructors
function Book(result, image) {
  // Based off movie object
  this.title = result.original_title;
  this.overview = result.overview;
  this.average_votes = result.vote_average;
  this.total_votes = result.vote_count;
  this.image_url = image;
  this.popularity = result.popularity;
  this.released_on = result.release_date;
}


// Connect to DB and Start the Web Server
app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});
