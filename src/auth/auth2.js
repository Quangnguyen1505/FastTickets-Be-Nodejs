const passport = require('passport');

const authenOauth = async (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}

module.exports = {
    authenOauth
}