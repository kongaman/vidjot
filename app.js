const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//Load routes from route-files in ./routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);


//-------------------------------------------------------------------------------------------------------
//------------------------------------------- DATABASE --------------------------------------------------
//-------------------------------------------------------------------------------------------------------

//Connect to mongoose
mongoose.connect('mongoDB://localhost/vidjot-dev')
.then(() => console.log('mongoDb connected'))
.catch(err => console.log(err));

//Ideas-model moved to ./routes/ideas.js

//-------------------------------------------------------------------------------------------------------
//------------------------------------------- MIDDLEWARE ------------------------------------------------
//-------------------------------------------------------------------------------------------------------
// Lines below are copied from the coresponding github READMEs or Documentation Files

//Handlebars Middleware 
app.engine('handlebars', exphbs({
    //What you want on every page (defined in: ./views/layout/main.handlebars)
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
//sets public folder to be the express static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override Middleware
app.use(methodOverride('_method'));

// express-session Middleware
app.use(session({ 
    secret: 'konga',
    resave: true,
    saveUninitialized: true
}));

// connect-flash Middleware
app.use(flash());

//Middleware - Global Variables for Messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//-------------------------------------------------------------------------------------------------------
//---------------------------------------------- ROUTES -------------------------------------------------
//-------------------------------------------------------------------------------------------------------

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome!'
    res.render('INDEX', {
        title: title  // const title = 'Welcome!'
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('ABOUT');
});

//Idea-Routes moved to seperate File ./routes/ideas.js
//See top --> Load routes from... 

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

//-------------------------------------------------------------------------------------------------------
//------------------------------------------------ SERVER -----------------------------------------------
//-------------------------------------------------------------------------------------------------------

const port= 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});