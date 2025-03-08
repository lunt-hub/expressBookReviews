const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const exists = users.filter(user => user.username === req.body.username).length > 0;
  const [status, msg] = exists ? [400, 'There are too many of us, sorry!'] : [200, 'welcome_amigo'];
  
  if(!exists) users.push(req.body);

  return res.status(status).json({msg: msg});
});

const loadBooks = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(books);
    }, 500)
  })
};

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  const l_books = await loadBooks();
  //Write your code here
  return res.status(200).json(l_books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  //Write your code here  
  const l_books = await loadBooks();
  return res.status(200).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
  const l_books = await loadBooks();
  return res.status(200)
    .json(
      Object.values(books)
      .filter((value) => value.author.includes(req.params.author))
    );
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  const l_books = await loadBooks();
  return res.status(200)
  .json(
    Object.values(books)
    .filter((value) => value.title.includes(req.params.title))
  );
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  //Write your code here
  const l_books = await loadBooks();
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
