const express = require('express');
const path = require('path');
const TemplatesService = require('./templates-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const templatesRouter = express.Router();
const jsonBodyParser = express.json();

const serializeTemplate = template => ({
    id: template.id,
    user_id: template.user_id,
    template_name: xss(template.template_name),
    template_subject: xss(template.template_subject),
    template_content: xss(template.template_content),
})

templatesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        TemplatesService.getAllTemplates(req.app.get('db'), userId)
        .then(templates => {
            return res.json(templates)
        })
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { template_name, template_subject, template_content } = req.body;
        const newTemplate = { template_name, template_subject, template_content }
        newTemplate.user_id = req.user.id;

        for (const [key, value] of Object.entries(newTemplate)) {
            if (value === '' || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }
        
        TemplatesService.insertTemplate(
            req.app.get('db'),
            newTemplate
        )
            .then(template => {
                res
                    .status(201)
                    .json(serializeTemplate(template))
            })
            .catch(next)
    })

templatesRouter
    .route('/:id')
    .all(requireAuth, (req, res, next) => {
        TemplatesService.getById(
            req.app.get('db'),
            req.params.id, 
        )
            .then(template => {
                if (!template) {
                    return res.status(404).json({
                        error: { message: `Template doesn't exist` }
                    })
                }
                res.template = template
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const id = req.params.id;
        TemplatesService.getById(req.app.get('db'), id)
            .then(template => {
                return res.json(serializeTemplate(template))
            })
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        TemplatesService.deleteTemplate(req.app.get('db'), id)
           .then(id => {
               res.status(204).end()
           })
           .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { template_name, template_subject, template_content } = req.body;
        const templateToUpdate = { template_name, template_subject, template_content }
        
        const numberOfValues = Object.values(templateToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'template_name', 'template_subject' or 'template_content'`
                }
            })
        }

        TemplatesService.updateTemplate(
            req.app.get('db'),
            req.params.id,
            templateToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    

module.exports = templatesRouter;