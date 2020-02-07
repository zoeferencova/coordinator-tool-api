const express = require('express');
const path = require('path');
const UsersService = require('./users-service')
const AuthService = require('../auth/auth-service')

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .get('/', (req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        console.log(payload)
        UsersService.getUserInfo(req.app.get('db'), userId)
        .then(user => {
            return res.json(user)
        })
    })
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, email, full_name } = req.body;

        for(const field of ['full_name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = UsersService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
        .then(hasUserWithEmail => {
            if (hasUserWithEmail)
              return res.status(400).json({ error: `Email already taken` })
        
            return UsersService.hashPassword(password)
              .then(hashedPassword => {
                  const newUser = {
                    email,
                    password: hashedPassword,
                    full_name,
                  }
        
                  return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                  )
                    .then(user => {
                      res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user))
                    })
                })
        })
        .catch(next)
    })

module.exports = usersRouter;