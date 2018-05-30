const express = require('express');
const exphbs = require('express-handlebars');
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

const port= 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});