var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/lizzz';   // URI for the database

router.get('/', function (req, res) {
  // retrieve books from db
  // res.send({message: 'OK'});
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books', function (err, result) {  //"result" param can be called anything
    done(); // Done with this connection. Can only have 10 queries running at a time.
      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });  // first parameter is SQL query; second is a function
  });
});

router.post('/', function (req, res) {
  var book = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('INSERT INTO books (author, title, published, edition, publisher)'
                + 'VALUES ($1, $2, $3, $4, $5)', // "prepared statement"
              [book.author, book.title, book.published, book.edition, book.publisher],
              function (err, result) {
                done();

                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});

module.exports = router;
