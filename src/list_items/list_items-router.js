const express = require('express');
const path = require('path');
const ListItemsService = require('./list_items-service')

const listItemsRouter = express.Router();
const jsonBodyParser = express.json();

listItemsRouter
    .route('/')
    .get((req, res, next) => {
        ListItemsService.getAllListItems(req.app.get('db'))
        .then(items => {
            res.json(items)
        })
    })

module.exports = listItemsRouter;