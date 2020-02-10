const express = require('express');
const path = require('path');
const ListItemsService = require('./list_items-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const listItemsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeItem = item => ({
    id: item.id,
    status: item.status,
    project: xss(item.project),
    advisor: xss(item.advisor),
    date_created: new Date(item.date_created),
    notes: xss(item.notes),
    pm_name: item.pm_name,
    pm_email: item.pm_email
})

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
            return res.json(items.map(serializeItem))
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
                    .json(serializeItem(item))
            })
            .catch(next)
    })

listItemsRouter
    .route('/:id')
    .all((req, res, next) => {
        ListItemsService.getById(
            req.app.get('db'),
            req.params.id,
            
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: { message: `Item doesn't exist` }
                    })
                }
                res.item = item
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const id = req.params.id;
        ListItemsService.getById(req.app.get('db'), id)
            .then(item => {
                return res.json(serializeItem(item))
            })
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        ListItemsService.deleteItem(req.app.get('db'), id)
           .then(id => {
               res.status(204).end()
           })
           .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        console.log(req.body);
        const { project, advisor, status, pm_id, notes } = req.body;
        const itemToUpdate = { project, advisor, status, pm_id, notes }
        
        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'project', 'advisor', 'pm_id', 'notes' or 'status'`
                }
            })
        }

        ListItemsService.updateItem(
            req.app.get('db'),
            req.params.id,
            itemToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = listItemsRouter;