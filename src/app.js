require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router');
const listItemsRouter = require('./list_items/list_items-router');
const pmsRouter = require('./pms/pms-router');
const templatesRouter = require('./templates/templates-router');
const authRouter = require('./auth/auth-router');
const completedRouter = require('./completed/completed-router');
const dataRouter = require('./data/data-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/list', listItemsRouter);
app.use('/api/pms', pmsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/auth', authRouter)
app.use('/api/completed', completedRouter)
app.use('/api/data', dataRouter)

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;