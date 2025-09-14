const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Authenticate user credentials
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Task 8: Add/Modify book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session?.authorization?.username;
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }
    const isbn = req.params.isbn;
    const { review } = req.body;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review successfully added/modified", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session?.authorization?.username;
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review successfully deleted", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
