import * as express from 'express';
import User from './models/User';
import Todo from './models/Todo';
import { BadRequestError, NotFoundError } from './Errors';
import {password} from './accounts'

export default (router: express.Router) => {

  const userNameExists = async username => {

    const exists = await User.query().select("username")
    .where('username', username)
    .then(async uNameList => {
        if(uNameList.length===0){
          return false
        }
      return true
    })
    return exists
  }

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
    const newuser= req.body.newUser 
    if (!newuser) throw new  BadRequestError('No Body');
    
    if(await userNameExists(newuser.username)) {
      throw new  BadRequestError('Username already in use');
    }
    else {
      const hashedPassword = await password.hashPassword(newuser.password)
      newuser.password= hashedPassword.hash
      await User.query().insert(newuser);
    }
   
  res.send('Success: new user added')

  });

  router.post('/userlogin', async (req,res) =>{

    console.log(req.body);
    if(await userNameExists(req.body.username)){
        User.query().select("password")
        .where("username", req.body.username)
        .first()
        .then(async asd =>{
          console.log(await password.comparePassword(req.body.password, asd.password));
          
          
        })
    }else{
      throw new  BadRequestError('Username or password is wrong');

    }


    res.send('username or password is wrong')

  });

};
