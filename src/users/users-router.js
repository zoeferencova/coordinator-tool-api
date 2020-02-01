const express = require('express');
const path = require('path');
const UsersService = require('./users-service')

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
        .then(users => {
            res.json(users)
        })
    })

module.exports = usersRouter;