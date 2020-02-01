const express = require('express');
const path = require('path');
const PmsService = require('./pms-service')

const pmsRouter = express.Router();
const jsonBodyParser = express.json();

pmsRouter
    .route('/')
    .get((req, res, next) => {
        PmsService.getAllPms(req.app.get('db'))
        .then(pms => {
            res.json(pms)
        })
    })

module.exports = pmsRouter;