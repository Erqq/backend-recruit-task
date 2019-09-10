require('dotenv').config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as Knex from 'knex';
import * as morgan from 'morgan';
import registerUsers from './routes/user'
import registerTodos from './routes/todos'
import registerAuth from './routes/auth'
import { Model } from 'objection';
import { HttpError } from './Errors';

// Initialize knex the SQL query builder.
const knexConfig = require('../knexfile');
export const knex = Knex(knexConfig.development);

// Create or migrate the database:
knex.migrate.latest();

// Bind the knex instance to the base Model class
Model.knex(knex);

// Unfortunately the express-promise-router types are borked. Just require():
const router = require('express-promise-router')();
const app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(router)
  .set('json spaces', 2);

// Register our REST API.
registerAuth(router)
registerTodos(router)
registerUsers(router)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    if (err instanceof HttpError) {
      res.status(err.statusCode).send({
        status: err.statusCode,
        message: err.message,
      });
    } else {
      res.status(500).send({
        status: 500,
        message: 'An unexpected error occurred!',
      });
    }
  } else {
    next();
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Todo app listening at port %s', port);
});
