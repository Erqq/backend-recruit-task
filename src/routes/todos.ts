import * as express from 'express';
import { BadRequestError, NotFoundError } from '../Errors';
import Todo from '../models/Todo';
import Todolist from '../models/Todolist';
import { checkToken } from '../queries';


export default (router: express.Router) => {

  /**
   * Gets all the users todos. There should probably be a route that only gets
   * all the todos of a specific list or this should do it already.
   */
  router.get('/todos', async (req, res) => {
    const user = await checkToken(req.body.token);
    const list = await Todo.query()
        .innerJoin('todolist', 'todos.todolistId', 'todolist.id')
        .where('userId', user.id);

    if (list.length === 0) throw new NotFoundError('No such todos');
    res.send(list);
  });

  /**
   * Gets specific todo with the given id.
   */
  router.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');
    const user: any = await checkToken(req.body.token);

    const todo = await Todo.query()
      .innerJoin('todolist', 'todos.todolistId', 'todolist.id')
      .where('userId', user.id).where('todos.id', id).first();
    if (!todo) throw new NotFoundError('No such Todo!');
    res.send(todo);
  });

  /**
   * Posts a todo to todolist that the user chose.
   */
  router.post('/todo', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todo = req.body.todo;
    const listId = req.body.todolistId;

    await Todo.query().insert({
      title: todo.title,
      description: `${user.name} remember: ${todo.description}`,
      todolistId: listId,
    }).catch(() => { throw new BadRequestError('Could not add new todo'); });

    res.send('Todo added successfully');
  });

  /**
   * Gets all the todolists of the user.
   */
  router.get('/todolists', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todoLists: any = await Todolist.query().where('userId', user.id);

    if (todoLists.length === 0) throw new NotFoundError('No todolists!');
    res.send(todoLists);
  });

  /**
   * Posts users todolist with todos.
   */
  router.post('/todolist', async (req, res) => {
    const user: any = await checkToken(req.body.token);
    const todolist: any = req.body.todoList;
    const todos: any = req.body.todoList.todos;

    await Todolist.query().insert({ name: todolist.name, userId: user.id }).then(async (list) => {
      return await todos.map(async (todo) => {
        return await Todo.query().insert({
          title: todo.title,
          description: `${user.name} remember: ${todo.description}`,
          todolistId: list.id,
        }).catch(() => {  throw new BadRequestError('Could not add new todos'); });

      });

    }).catch(() => {
      throw new BadRequestError('Could not add new todolist');
    });


    res.send('Todo added successfully');
  });

};
