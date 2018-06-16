module.exports = {
    ensureAuthenticated : function(req, res, next) {
        if (req.isAuthenticated()) { //isAuthenticated = passport function
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login');
    }
}