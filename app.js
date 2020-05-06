//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//Connection URL
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Creates a schema por this collection
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



//Creates a model for mongoose
const User = mongoose.model("User", userSchema);



app.get(("/"), (req, res) => {
    res.render("home");
});

app.get(("/login"), (req, res) => {
    res.render("login");
});

app.get(("/register"), (req, res) => {
    res.render("register");
});

app.post(("/register"), (req, res) => {

    const newEmail = req.body.username;
    const newPassword = req.body.password;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            // Store hash in your password DB.

            const newUser = new User({
                email: newEmail,
                password: hash
            });

            newUser.save((err) => {
                if (!err) {
                    res.render("secrets");
                } else {
                    console.log(err);
                }
            });


        });
    });


});

app.post(("/login"), (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password).then(isMatch => {
                    if (isMatch) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});