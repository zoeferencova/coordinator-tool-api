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
        const userId = AuthService.getUserId(req.get('Authorization'));
        CompletedService.getCompletedItems(req.app.get('db'), userId)
            .then(items => {
                return res.json(items)
            })
    })

module.exports = completedRouter;