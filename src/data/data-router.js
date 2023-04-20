const express = require('express');
const moment = require('moment');
const DataService = require('./data-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dataRouter = express.Router();



dataRouter
    .route('/pm-data')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        DataService.getItemCountByPm(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/completed-timespan-data')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        DataService.getCompletedTimespanData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/created-timespan-data')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        DataService.getCreatedTimespanData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/timespan-data/:type/:span')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        const { type, span } = req.params;
        DataService.getTimespanData(req.app.get('db'), userId, type, span)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/time-completed-data')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        DataService.getTimeData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

dataRouter
    .route('/dashboard-data')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        DataService.getDashboardData(req.app.get('db'), userId)
            .then(data => {
                return res.json(data)
            })
    })

module.exports = dataRouter;