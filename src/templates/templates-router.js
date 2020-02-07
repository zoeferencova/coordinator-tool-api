const express = require('express');
const path = require('path');
const TemplatesService = require('./templates-service')
const AuthService = require('../auth/auth-service')

const templatesRouter = express.Router();
const jsonBodyParser = express.json();

templatesRouter
    .route('/')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        TemplatesService.getAllTemplates(req.app.get('db'), userId)
        .then(templates => {
            return res.json(templates)
        })
    })

module.exports = templatesRouter;