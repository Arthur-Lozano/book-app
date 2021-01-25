'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
require('ejs');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');


// Step 2:  Set up our application

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// declare port for server
const PORT = process.env.PORT || 3000;

// Creating postgres client added by mc
const client = new pg.Client(process.env.DATABASE_URL);

//routes
// app.get('/index', homeHandler);
app.get('/', homePage);
app.get('/new', searchPage)
app.post('/searches', searchHandler);
app.post('/books', addBookToDatabase);
app.get('/books/:book_id', singleBookHandler)
app.delete('/update/:book_id', deleteBook);
app.get('*', handleError);

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
  if (request.body.keyword === 'title' ? url += `+intitle:${request.body.name}` : url += `+inauthor:${request.body.name}`)

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
  // Based off movie object
  const pic = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = result.volumeInfo.title;
  this.authors = result.volumeInfo.authors;
  this.isbn = result.isbn;
  this.imageLinks = result.volumeInfo.imageLinks;
  if (this.imageLinks === this.imageLinks ? this.imageLinks : pic);
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

