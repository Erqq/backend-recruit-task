import * as express from 'express';
import User from './models/User';
import Todo from './models/Todo';
import { BadRequestError, NotFoundError } from './Errors';
import {password, jwt} from './accounts'
import {userNameExists, checkPassword} from './queries'

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
    const newuser= req.body.newUser 
    if (!newuser) throw new  BadRequestError('no user information');
    
    if(await userNameExists(newuser.username)) {
      throw new  BadRequestError('Username is already in use');
    }
    else {
      const hashedPassword = await password.hashPassword(newuser.password)
      newuser.password= hashedPassword.hash
      await User.query().insert(newuser);
      res.send('Success: new user added')
    }

  });

  router.post('/login', async (req,res) =>{
    const user = req.body
    if(await userNameExists(user.username)){
      if( await checkPassword(user.username,user.password)){
        res.send({token: jwt.issueToken(user.username)})
      }else{
        throw new BadRequestError('Wrong username or password');
      }
      
    } else {
      throw new BadRequestError('Wrong username or password');

    }
  });

  router.post('/changepassword', async (req,res)=>{
    let validToken: any
    try {
      validToken = jwt.validateToken(req.body.token) 
    } catch (error) {
      throw new BadRequestError("invalid token")
    }

    if (await checkPassword(validToken.sub, req.body.password)){
      const newPassword =  await password.hashPassword(req.body.newPassword)
      try {
        await User.query()
        .update({username: validToken.sub, password: newPassword.hash})
        .where("username", validToken.sub)
      } catch (error) {
        console.log(error);
        throw new BadRequestError("something went wrong")
      }

    } else {
      throw new BadRequestError("Wrong username or password")
    }
    
    res.send("Password changed successfully")
    
  })

  router.post('/forgotpassword', async (req, res)=>{
    const newPassword =  await password.hashPassword(req.body.newPassword)

    try {
      await User.query()
      .update({username: req.body.username, password: newPassword.hash})
      .where("username", req.body.username)
    } catch (error) {
      console.log(error);
      throw new BadRequestError("something went wrong")
    }
    res.send("password changed")
  })

};
