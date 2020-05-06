//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//Express Session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


//Connection URL
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Arregla un depricate
mongoose.set("useCreateIndex", true);

//Creates a schema por this collection
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//Passport plugin
userSchema.plugin(passportLocalMongoose);

//Creates a model for mongoose
const User = mongoose.model("User", userSchema);

//Passport
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get(("/"), (req, res) => {
    res.render("home");
});

app.get(("/login"), (req, res) => {
    res.render("login");
});

app.get(("/register"), (req, res) => {
    res.render("register");
});

app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.post(("/register"), (req, res) => {

    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});

app.post(("/login"), (req, res) => {

});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});