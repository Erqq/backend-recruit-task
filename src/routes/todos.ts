import * as express from 'express';
import { BadRequestError, NotFoundError } from '../Errors';
import Todo from '../models/Todo';
import { checkToken } from '../queries';


export default (router: express.Router) => {

  /**
   * Gets all the todos of the user if the token is valid.
   */
  router.get('/todos', async (req, res) => {
    const user = await checkToken(req.body.token);
    const todos: any = await Todo.query().where('userid', user.id);

    if (todos.length === 0) throw new NotFoundError('No Todos!');
    res.send(todos);
  });

  /**
   * Gets specific todo with the given id.
   */
  router.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');
    const user: any = await checkToken(req.body.token);

    const todo = await Todo.query().where({ id }).andWhere('userId', user.id).first();
    if (!todo) throw new NotFoundError('No such Todo!');
    res.send(todo);
  });

/**
 * Adds a todo.
 */
  router.post('/todo', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todo = req.body.todo;

    await Todo.query().insert({
      title: todo.title,
      description: `${user.name} remember: ${todo.description}`,
      userId: user.id,
    }).catch(() => { throw new BadRequestError('Could not add new todo'); });

    res.send('Todo added successfully');
  });

};
