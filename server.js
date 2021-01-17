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
app.set('view engine', 'ejs');// How you can tell you're using ejs at a quick glance
// app.use(cors());


// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));
// Routes
app.get('/', homeHandler);
app.get('/hello', helloHandler);//Used to test application without database



//Handlers
function homeHandler(request, response) {
  response.status(200).send('');
}

function helloHandler(request, response) {
  response.status(200).render('pages/index');//.render instead of .sendFile
}



// Connect to DB and Start the Web Server
app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});
