const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})  //Datenbanksuche nach * (* ist in noSQL leere "{}" -
                                    // jetzt nach ideas des eingeloggten users
                                    //"Idea" kommt von: const Idea = mongoose.model('ideas') - Line 14
        .sort({ date: 'desc'})  //Ergebnisse nach datum sortieren
        .then(ideas => {
            res.render('ideas/index', { // Verweist auf ./views/ideas/index.handlebars
                ideas:ideas             //gibt das gefundene ideas-array weiter
            });
        }); 
});

//Add Idea form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add'); // Verweist auf ./views/ideas/add.handlebars
    
});
//Edit Idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
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
        if (idea.user != req.user.id) {  //id eingeloggter user != Userid des idea-erstellers
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {  // Verweist auf ./views/ideas/edit.handlebar
                idea:idea               //gibt den gefundenen DB eintrag weiter
            });
        }
    });
});

//Process form
router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user:req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea added');
            res.redirect('/ideas');
        });
    }
});

// Process Edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea updated');
            res.redirect('/ideas');
        })
    });
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router