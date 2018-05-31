const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


//-------------------------------------------------------------------------------------------------------
//------------------------------------------- DATABASE --------------------------------------------------
//-------------------------------------------------------------------------------------------------------

//Connect to mongoose
mongoose.connect('mongoDB://localhost/vidjot-dev')
.then(() => console.log('mongoDb connected'))
.catch(err => console.log(err));
//Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');


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

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method-override Middleware
app.use(methodOverride('_method'));


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

//Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})               //Datenbanksuche nach * (* ist in noSQL leere "{}"  
                                //"Idea" kommt von: const Idea = mongoose.model('ideas') - Line 14
        .sort({ date: 'desc'})  //Ergebnisse nach datum sortieren
        .then(ideas => {
            res.render('ideas/index', { // Verweist auf ./views/ideas/index.handlebars
                ideas:ideas             //gibt das gefundene ideas-array weiter
            });
        }); 
});

//Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add'); // Verweist auf ./views/ideas/add.handlebars
    
});
//Edit Idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({          //findOne gibt genau 1 Eintrag zurück (erstaunlichwerise... :-D)
        _id: req.params.id  //_id = die id des Eintrags in der DB
                            //
                            //in Terminal:
                            //mongo
                            //use vidjot-dev
                            //show collections
                            //db.ideas.find();
                            //
                            //req.params.id nimmt :id aus dem Requestaufruf /ideas/edit/:id
    })
    .then(idea => {
        res.render('ideas/edit', {  // Verweist auf ./views/ideas/edit.handlebar
            idea:idea               //gibt den gefundenen DB eintrag weiter
        });
    });
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

// Process Edit form
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        })
    });
});

//Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect('/ideas');
    });
});

//-------------------------------------------------------------------------------------------------------
//------------------------------------------------ SERVER -----------------------------------------------
//-------------------------------------------------------------------------------------------------------

const port= 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});