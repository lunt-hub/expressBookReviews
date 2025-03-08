const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_secret = "377dcaeeae11ac29e1ac973f4929c73c3c97b0f3abe0ed6c4b04e41dfac1654800d499e7085b24d0d4fdebfb20e7a150fddb6b6de37873933663d38418d5926f2c8b73556d9829a4bcc251eab247c82b06ffb9201b4ee563bb6275c796e57e9d0d77bb314d8aec09a4187147a21f6703039d3b48a8ba492554ea0250607c7023bcbea1db693ea086cad2e2d827b74c14831d149640fa88e386a41363eba554e0fe5876ba001d1b3feb9b8cf112ca6a39a51a43cbad21190bc771f0cff75e6a48b5c01dded1a3efafc8ac4d73c046b2b571383e1ab901465b093f4938f08d6ce691d07bb3d6481acdac5a99f170ec428a1b6b96850fa3a3e4a689d108747b31ab"
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
//write code to check is the username is valid
  return users.find(user => user.username === username);
}

const authenticatedUser = (username, password)=>{
//write code to check if username and password match the one we have in records.
  const user = isValid(username);
  return (user && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let status = 500;
  let msg = {msg: 'unknown error'};
  //Write your code here
  let user = isValid(req.body.username);
  
  if (user && user.password === req.body.password) {
    [status, msg] = [200, {access_token: jwt.sign(req.body, jwt_secret)}];
  } else {
    [status, msg] = [400, {msg: "I don't know you!"}];
  }
  return res.status(status).json(msg);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let status = 500;
  let msg = {msg: 'unknown error'};
  //Write your code here

  const valid = authenticatedUser(req.body.username, req.body.password);
  
  if (valid) {
    books[req.body.isbn].reviews = {
      ...books[req.body.isbn].reviews,
      [req.body.username]: req.body.comment
    };

    [status, msg] = [200, {msg: 'review added'}];
  } else {
    [status, msg] = [500, {msg: 'could not authenticate you :-('}];
  }

  return res.status(status).json(msg);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let status = 500;
  let msg = {msg: 'unknown error'};
  //Write your code here

  const valid = authenticatedUser(req.body.username, req.body.password);
  
  if (valid) {
    delete books[req.body.isbn].reviews[req.body.username];
    
    [status, msg] = [200, {msg: 'review removed'}];
  } else {
    [status, msg] = [500, {msg: 'could not authenticate you :-('}];
  }

  return res.status(status).json(msg);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
