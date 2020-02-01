const express = require('express');
const path = require('path');
const TemplatesService = require('./templates-service')

const templatesRouter = express.Router();
const jsonBodyParser = express.json();

templatesRouter
    .route('/')
    .get((req, res, next) => {
        TemplatesService.getAllTemplates(req.app.get('db'))
        .then(templates => {
            res.json(templates)
        })
    })

module.exports = templatesRouter;