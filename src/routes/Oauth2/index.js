const express = require('express');
const passport = require('passport');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const oauth2Controller = require('../../controllers/oauth2.controller');
const { authenOauth, authencationV1 } = require('../../auth/auth2');

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get("/google/callback", authenOauth, handlerError(oauth2Controller.oauthGoogleCallback));

router.post("/login-success", handlerError(oauth2Controller.loginSuccess));
router.get("/getCurrent",authencationV1 , handlerError(oauth2Controller.getcurrentUser));

module.exports = router;