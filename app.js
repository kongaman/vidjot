const express = require('express');
const exphbs = require('express-handlebars');
const port= 5000;
const app = express();

//Handlebars Middleware
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



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});