const express = require('express');
const path = require('path');
const ListItemsService = require('./list_items-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const listItemsRouter = express.Router();
const jsonBodyParser = express.json();

listItemsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        ListItemsService.getAllListItems(req.app.get('db'), userId)
        .then(items => {
            return res.json(items)
        })
    })

module.exports = listItemsRouter;