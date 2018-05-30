const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Connect to mongoose
mongoose.connect('mongoDB://localhost/vidjot-dev')
.then(() => console.log('mongoDb connected'))
.catch(err => console.log(err));
//Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware (app.engine & app.set lines copied from handlebars documentation)
app.engine('handlebars', exphbs({
    //What you want on every page (views/layout/main.handlebars)
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome!'
    res.render('INDEX', {
        title: title
    });
});

app.get('/about', (req, res) => {
    res.render('ABOUT');
});

//Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Process form
app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({text: 'Please add a title'})
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'})
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });    
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
    }
});

const port= 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});