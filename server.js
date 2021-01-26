'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
// const cors = require('cors');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });

// Step 2:  Set up our application/Specify port
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Creating postgres client added by mc

// Database Connection Setup
// const client = new pg.Client(process.env.DATABASE_URL);//Take in path of database server
// client.connect(); // Use this when database is set up
// client.on('error', err => { throw err; });

//Application Middleware // EXRPESS MIDDLEWARE// Database Connection Setup
app.use(express.urlencoded({ extended: true }));//Double check
app.use(express.static('./public'));


//Set the view engine
app.set('view engine', 'ejs');// How you can tell you're using ejs at a quick glance

//routes
// app.get('/index', homeHandler);
app.get('/', homePage);
app.get('/new', searchPage)
//book handler added by mc
app.get('/books/:id', singleBookHandler)
app.post('/searches', searchHandler);

function homePage(request, response) {
  response.render('pages/index');
}

function searchPage(request, response) {
  response.render('pages/searches/new');
}

function searchHandler(request, response) {
  console.log('!!!!!!!!!!!', request.body);
  // let SQL = ``
  // const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:dune`;
  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
  if (request.body.name[0] === 'title' ? url += `+intitle:${request.body.name[1]}` : url += `+inauthor:${request.body.name[1]}`)

    superagent.get(url)
      .then(value => {
        console.log('!!!!!!!!!!!!!!!!', value.body.items);
        const yourBook = value.body.items.map(current => {
          return new Book(current);
        });
        response.status(200).render('pages/searches/show', { data: yourBook });//key value
        // response.status(200).send(yourBook);//key value
      })
      .catch(error => {
        console.log('ERROR', error);
        response.status(500).send('So sorry, something went wrong.');
      });
}


function errHandler(request, response) {
  response.status(500).send('So sorry, something went wrong.');
}


//Constructors
function Book(result) {
  // const pic = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = result.volumeInfo.title;
  this.authors = result.volumeInfo.authors;
  this.isbn = result.isbn;
  this.imageLinks = result.volumeInfo.imageLinks.thumbnail;
  // if (this.imageLinks === result.volumeInfo.imageLinks.thumbnail ? result.volumeInfo.imageLinks.thumbnail : pic);
  this.description = result.volumeInfo.description;
}

app.get('*', errHandler);

// Connect to DB and Start the Web Server

app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});


// single book handler function added by mc
function singleBookHandler(request, response) {
  const id = require.params.book_id;
  console.log('in the one book function', id);
  const sql = 'SELECT * FROM booktable WHERE id=$1;';
  const safeValues = [id];
  client.query(sql, safeValues)
    .then((results) => {
      console.log(results);
      const myFavBook = results.rows[0];
      response.render('pages/books/detail', { value: myFavBook });
    })
    .catch((error) => {
      console.log(error);
      response.render('pages/error');
    });
}
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  });


// app.listen(PORT, () => {
//   console.log(`now listening on port ${PORT}`);
// });

// Connect to DB and Start the Web Server
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server up on', PORT);
      console.log(`Connected to database ${client.connectionParameters.database}`);
    });
  })
  .catch(err => {
    console.log('ERROR', err);
  });

