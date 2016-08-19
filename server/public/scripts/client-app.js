$(document).ready(function () {
  getBooks();

  //select by genre
  $('#genre-submit').on('click', getByGenre);
    // add a book
  $('#book-submit').on('click', postBook);
  $('#book-list').on('click', '.update', putBook);
  $('#book-list').on('click', '.delete', deleteBook);
});
/**
 * Retrieve books from server and append to DOM
 */

 function getByGenre() {
   $('#book-list').empty();
   var genreSelected = $('#genre-select').val();
   console.log (genreSelected);
  $.ajax({
    type: 'GET',
    url: '/books/' + genreSelected,
    success: function (books) {
      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');
        var bookProperties = ['title','author','published','genre'];

        bookProperties.forEach(function(property){
          var inputType = 'text';
          if (property == 'published') {
             book[property] = new Date(book[property]);
            //get strings for month/day/year
             var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
             var day = book[property].getUTCDate(book[property]);
             var year = book[property].getUTCFullYear(book[property]);
           //concatenate into one string month/day/year and set to book.published as text
           book[property] = month + "/" + day + "/" + year;
           }   
          var $input = $('<input type ="text" id="'+property+'"name="'+property +'"/>')
          $input.val(book[property]);
          $el.append($input);
        });
        $el.data('bookId', book.id);
        //we use this to uniquely identify it by the book.id
        $el.append('<button class ="update">Update</button>');
        $el.append('<button class ="delete">Delete</button>');
        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
 }


 function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {

      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');
        var bookProperties = ['title','author','published','genre'];

        bookProperties.forEach(function(property){
          var inputType = 'text';
          if (property == 'published') {
             book[property] = new Date(book[property]);
            //get strings for month/day/year
             var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
             var day = book[property].getUTCDate(book[property]);
             var year = book[property].getUTCFullYear(book[property]);
           //concatenate into one string month/day/year and set to book.published as text
           book[property] = month + "/" + day + "/" + year;
           }   
          var $input = $('<input type ="text" id="'+property+'"name="'+property +'"/>')
          $input.val(book[property]);
          $el.append($input);
        });
        $el.data('bookId',book.id);
        //we use this to uniquely identify it by the book.id
        $el.append('<button class ="update">Update</button>');
        $el.append('<button class ="delete">Delete</button>');
        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
 }
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function () {
      console.log('POST /books works!');
      $('#book-list').empty();
      getBooks();
    },

    error: function (response) {
      console.log('POST /books does not work...');
    },
  });
}

function putBook() {
  var book = {};
  var inputs = $(this).parent().children().serializeArray();
  $.each(inputs, function (i, field) {
    book[field.name] = field.value;
  });
  console.log('books we are putting', book);
  var bookId = $(this).parent().data('bookId');
  $.ajax({
    type: 'PUT',
    url: '/books/' + bookId,
    data: book,
    success: function () {
      $('#book-list').empty();
      getBooks();
    },
    error: function () {
      console.log('Error PUT /books/' + bookId);
    },
  });
};

function deleteBook() {
  var bookId = $(this).parent().data('bookId');
  $.ajax({
    type: 'DELETE',
    url: '/books/' + bookId,
    success: function () {
      console.log('DELETE success');
      $('#book-list').empty();
      getBooks();
    },
    error: function () {
      console.log('DELETE failed');
    }
  });
}
