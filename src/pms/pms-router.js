const express = require('express');
const path = require('path');
const PmsService = require('./pms-service')
const AuthService = require('../auth/auth-service')

const pmsRouter = express.Router();
const jsonBodyParser = express.json();

pmsRouter
    .route('/')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        PmsService.getAllPms(req.app.get('db'), userId)
        .then(pms => {
            return res.json(pms)
        })
    })

module.exports = pmsRouter;