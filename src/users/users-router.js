const express = require('express');
const path = require('path');
const UsersService = require('./users-service')

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, email, full_name } = req.body;

        for(const field of ['full_name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }
    })

module.exports = usersRouter;