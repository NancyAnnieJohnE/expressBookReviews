const express = require('express');
const axios = require('axios');   // For async/await requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});


// =====================
// TASK 10
// Get book list using async/await
// =====================
public_users.get('/', async (req, res) => {
  try {
    // Simulate async fetch with axios
    const response = await axios.get("http://localhost:5000/booksdb");
    return res.json(response.data);
  } catch (err) {
    return res.json(books); // fallback to local books
  }
});

// Add an internal endpoint so axios can call it
public_users.get('/booksdb', (req, res) => {
  return res.json(books);
});


// =====================
// TASK 11
// Get book details based on ISBN using async/await
// =====================
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});


// =====================
// TASK 12
// Get book details based on Author using async/await
// =====================
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const matchingBooks = Object.entries(books).filter(([isbn, book]) =>
      book.author.toLowerCase() === author
    );
    if (matchingBooks.length > 0) {
      res.json(Object.fromEntries(matchingBooks));
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});


// =====================
// TASK 13
// Get book details based on Title using async/await
// =====================
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const matchingBooks = Object.entries(books).filter(([isbn, book]) =>
      book.title.toLowerCase() === title
    );
    if (matchingBooks.length > 0) {
      res.json(Object.fromEntries(matchingBooks));
    } else {
      res.status(404).json({ message: "No books found for this title" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});


// Task 5 (old one kept)
// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
