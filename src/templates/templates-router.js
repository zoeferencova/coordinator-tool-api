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
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
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
            if (value === null || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        console.log(newTemplate)
        
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
    .all((req, res, next) => {
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

module.exports = templatesRouter;