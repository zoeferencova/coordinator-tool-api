const express = require('express');
const moment = require('moment');
const DataService = require('./data-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dataRouter = express.Router();

const timeSpans = []
const units = {
    days: 7,
    weeks: 4,
    months: 6
}

for (let [key, value] of Object.entries(units)) {
    const unit = key;
    const number = value;

    for (let i=0; i < number; i++) {
        timeSpans.push({
            start: moment().startOf(`${unit}`).subtract(i+1, `${unit}`).toISOString(),
            end: moment().startOf(`${unit}`).subtract(i, `${unit}`).toISOString()
        })
    }
}

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
        const arr = []
        timeSpans.forEach((span) => {
            arr.push(DataService.getTimespanData(req.app.get('db'), userId, span))
        })
        console.log(arr)
        
    })

module.exports = dataRouter;