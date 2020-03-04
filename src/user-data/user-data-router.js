const express = require('express');
const UserDataService = require('./user-data-service');
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const userDataRouter = express.Router();

const serializeItem = item => ({
    id: item.id,
    status: item.status,
    project: xss(item.project),
    project_url: xss(item.project_url),
    contact: xss(item.contact),
    contact_url: xss(item.contact_url),
    date_created: new Date(item.date_created),
    notes: xss(item.notes),
    pm_name: item.pm_name,
    pm_email: item.pm_email
})

userDataRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        UserDataService.getAllUserData(req.app.get('db'), userId)
        .then(items => {
            return res.json(items)
        })
    })

module.exports = userDataRouter;