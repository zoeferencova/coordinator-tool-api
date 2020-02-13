const express = require('express');
const path = require('path');
const CompletedService = require('./completed-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const completedRouter = express.Router();
const jsonBodyParser = express.json();

completedRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        CompletedService.getCompletedItems(req.app.get('db'), userId)
            .then(items => {
                return res.json(items)
            })
    })

module.exports = completedRouter;