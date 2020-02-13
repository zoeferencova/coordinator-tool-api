const express = require('express');
const moment = require('moment');
const DataService = require('./data-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dataRouter = express.Router();

const start1 = moment().startOf('day').subtract(1, 'day').toISOString()
const end1 = moment().startOf('day').toISOString()
const start2 = moment().startOf('day').subtract(2, 'day').toISOString()
const end2 = moment().startOf('day').subtract(1, 'day').toISOString()

const dateRanges = [
    {
        start: start1,
        end:  end1
    },
    {
        start: start2,
        end: end2
    }
]

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
    .route('/timespan-data')
    .get((req, res, next) => {
        const authToken = req.get('Authorization');
        const bearerToken = authToken.slice(7, authToken.length)
        const payload = AuthService.verifyJwt(bearerToken);
        const userId = payload.user_id;
        DataService.getTimespanData(req.app.get('db'), userId, dateRanges)
            .then(data => {
                return res.json(data)
            })
    })

module.exports = dataRouter;