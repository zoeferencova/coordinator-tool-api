import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { NODE_ENV } from './config';
import userDataRouter from './user-data/user-data-router';
import usersRouter from './users/users-router';
import listItemsRouter from './list_items/list_items-router';
import pmsRouter from './pms/pms-router';
import templatesRouter from './templates/templates-router';
import authRouter from './auth/auth-router';
import completedRouter from './completed/completed-router';
import dataRouter from './data/data-router';

dotenv.config()

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/user-data', userDataRouter)
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
        response = { error: { message: error.message, error } };
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

export default app;