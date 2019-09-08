import * as express from 'express';
import User from './models/User';
import Todo from './models/Todo';
import { BadRequestError, NotFoundError } from './Errors';

export default (router: express.Router) => {
  router.get('/users', async (req, res) => {
    const users = await User.query();

    res.send(users);
  });

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

  router.post('/user', async (req, res) => {
    console.log(req.body);
    const newuser= req.body.newUser 
    if (!newuser) throw new  BadRequestError('No Body');
    

    await User.query().insert(newuser);
    
    
  res.send()
  });
};
