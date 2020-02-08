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
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { project, advisor, pm_id } = req.body;
        const newItem = { project, advisor, pm_id }
        newItem.user_id = req.user.id;
        newItem.status = 'none';

        for (const [key, value] of Object.entries(newItem)) {
            if (value === null || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }
        newItem.notes = req.body.notes;
        
        ListItemsService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res
                    .status(201)
                    .json(item)
            })
            .catch(next)
    })

listItemsRouter
    .route('/:id')
    .delete((req, res, next) => {
        const id = req.params.id;
        ListItemsService.deleteItem(req.app.get('db'), id)
           .then(id => {
               res.status(204)
           })

    })
    .patch((req, res) => {

    })

module.exports = listItemsRouter;