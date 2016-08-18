var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/lizzz';   // URI for the database

router.get('/', function (req, res) {
  // retrieve books from db
  // res.send({message: 'OK'});
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log('cannot connect');
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books', function (err, result) {  //"result" param can be called anything
    done(); // Done with this connection. Can only have 10 queries running at a time.
      if (err) {
        console.log('bad query');
        res.sendStatus(500);
      }
      res.send(result.rows);
    });  // first parameter is SQL query; second is a function
  });
});

router.get('/:genre', function (req, res) {
  var genre = req.params.genre;
  console.log(req.params.genre);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books ' +
                  'WHERE genre = $1',
                  [genre],
                  function (err, result) {
                    done();
                    if (err) {
                      console.log(err);
                      res.sendStatus(500);
                    } else {
                    res.send(result.rows);
                    }
                });
  });

});

router.post('/', function (req, res) {
  var book = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('INSERT INTO books (author, title, published, genre)'
                + 'VALUES ($1, $2, $3, $4)', // "prepared statement"
              [book.author, book.title, book.published, book.genre],
              function (err, result) {
                done();

                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var book = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('UPDATE books ' +
                  'SET title = $1, ' +
                  'author = $2, ' +
                  'published = $3, ' +
                  'genre = $4 ' +
                  'WHERE id = $5',
                [book.title, book.author, book.published, book.genre, id],
              function (err, result) {
                done();
                if (err) {
                  console.log('err', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
  });
})   //:id can be named anything. Colon is the impt part.

router.delete('/:id', function (req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('DELETE FROM books ' +
                  'WHERE id = $1',
                  [id],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                    } else {
                    res.sendStatus(200);
                  }
                });
  });

});

module.exports = router;
