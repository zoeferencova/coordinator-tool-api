const express = require('express');
const path = require('path');
const PmsService = require('./pms-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const pmsRouter = express.Router();
const jsonBodyParser = express.json();

const serializePm = pm => ({
    id: pm.id,
    user_id: pm.user_id,
    pm_name: xss(pm.pm_name),
    pm_email: xss(pm.pm_email),
})

pmsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        PmsService.getAllPms(req.app.get('db'), userId)
        .then(pms => {
            return res.json(pms)
        })
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { pm_name, pm_email } = req.body;
        const newPm = { pm_name, pm_email }
        newPm.user_id = req.user.id;

        for (const [key, value] of Object.entries(newPm)) {
            if (value === '' || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }
        
        PmsService.insertPm(
            req.app.get('db'),
            newPm
        )
            .then(pm => {
                res
                    .status(201)
                    .json(serializePm(pm))
            })
            .catch(next)
    })

pmsRouter
    .route('/:id')
    .all(requireAuth, (req, res, next) => {
        PmsService.getById(
            req.app.get('db'),
            req.params.id,
            
        )
            .then(pm => {
                if (!pm) {
                    return res.status(404).json({
                        error: { message: `PM doesn't exist` }
                    })
                }
                res.pm = pm
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const id = req.params.id;
        PmsService.getById(req.app.get('db'), id)
            .then(pm => {
                return res.json(serializePm(pm))
            })
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        PmsService.deletePm(req.app.get('db'), id)
           .then(id => {
               res.status(204).end()
           })
           .catch(next)
    })

module.exports = pmsRouter;