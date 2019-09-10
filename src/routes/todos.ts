import * as express from 'express';
import Todo from '../models/User';
import { BadRequestError, NotFoundError } from '../Errors';
import { password, jwt } from '../accounts'
import { userNameExists, checkPassword, checkToken } from '../queries'


export default (router: express.Router) => {
    router.get('/todos', async (req, res) => {
        const todos = await Todo.query();
        res.send(todos);
    });

    router.get('/todos/:id', async (req, res) => {
        const id = req.params.id;
        if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');

        const todo = await Todo.query().where({ id }).first();
        if (!todo) throw new NotFoundError('No such Todo!');
        res.send(todo);
    });

    router.post('/todo', async (req, res) => {

    })

}