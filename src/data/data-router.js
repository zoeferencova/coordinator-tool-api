const express = require('express');
const moment = require('moment');
const DataService = require('./data-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dataRouter = express.Router();



dataRouter
    .route('/pm-data')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        DataService.getItemCountByPm(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/completed-timespan-data')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        DataService.getCompletedTimespanData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/created-timespan-data')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        DataService.getCreatedTimespanData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/time-completed-data')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        DataService.getTimeCompletedData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

module.exports = dataRouter;