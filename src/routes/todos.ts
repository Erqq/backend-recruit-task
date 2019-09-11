import * as express from 'express';
import { BadRequestError, NotFoundError } from '../Errors';
import Todo from '../models/Todo';
import Todolist from '../models/Todolist';
import { checkToken } from '../queries';


export default (router: express.Router) => {
  router.get('/todos', async (req, res) => {
    const user = await checkToken(req.body.token);
    try {
      const list = await Todo.query()
      .innerJoin('todolist', 'todos.todolistId', 'todolist.userId')
      .where('userId', user.id);
      res.send(list);

    } catch (error) {
      console.log(error);

    }
  });

  router.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');
    const user: any = await checkToken(req.body.token);

    const todo = await Todo.query()
      .innerJoin('todolist', 'todos.todolistId', 'todolist.userId')
      .where('userId', user.id).where('todos.id', id).first();
    if (!todo) throw new NotFoundError('No such Todo!');
    res.send(todo);
  });

  router.post('/todo', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todo = req.body.todo;
    const list: any = await Todolist.query().where('userId', user.id).first();

    try {
      await Todo.query().insert({
        title: todo.title,
        description: `${user.name} remember: ${todo.description}`,
        todolistId: list.id,
      });
    } catch (error) {
      console.log(error);

    }
    res.send('Todo added successfully');
  });

  router.get('/todolists', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todoLists: any = await Todolist.query().where('userId', user.id);

    if (!todoLists) throw new NotFoundError('No todolists!');
    res.send(todoLists);
  });

  router.post('/todolist', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todo = req.body.todo;
    const list: any = await Todolist.query().where('userId', user.id).first();

    try {
      await Todo.query().insert({
        title: todo.title,
        description: `${user.name} remember: ${todo.description}`,
        todolistId: list.id,
      });
    } catch (error) {
      console.log(error);

    }
    res.send('Todo added successfully');
  });

};
