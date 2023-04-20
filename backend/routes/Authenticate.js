const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateMiddelware = require('../middlewares/VerifyToken');
const { refreshTokens } = require('../utils/tokens');
const Errors = require('../utils/errors');
const router = express.Router();''

router.post('/', authenticateMiddelware);

router.post('/token', (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new Errors.NoToken();
        if (!refreshTokens.includes(refreshToken)) throw new Errors.InvalidRefreshToken();
        const secret = process.env.SECRET;
        const refreshSecret = process.env.REFRESH_SECRET;
        const parsedUser = jwt.verify(refreshToken, refreshSecret);
        console.log(parsedUser);
        const userForToken = {
            id: parsedUser.id,
            username: parsedUser.username,
        }
        const token = jwt.sign(userForToken, secret, { expiresIn: '1m' });
        res.status(200).json({ token })
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 500).json({ msg: err.message });
    }
});

router.post('/logout', (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) throw new Errors.NoToken();
        refreshTokens = refreshTokens.filter(token => t !== token);
        res.status(200).json({ msg: "success. the last token deleted" })
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message })
    }
});
module.exports = router;
