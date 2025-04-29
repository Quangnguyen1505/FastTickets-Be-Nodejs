const passport = require('passport');

const authenOauth = async (req, res, next) => {
    const { provider } = req.params;
    passport.authenticate(provider, (err, profile) => {
        req.user = profile
        req.userId = profile.userId
        next()
    })(req, res, next)
}

module.exports = {
    authenOauth
}