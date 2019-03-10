module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            //req.flash('error_msg', 'Not authorized');
            res.redirect('/');
        }
    },

    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            //req.flash('error_msg', 'Not authorized');
            return next();
        }
    }
}