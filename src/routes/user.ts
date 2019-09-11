import * as express from 'express';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../Errors';
import { password, jwt } from '../accounts';
import { userNameExists, checkPassword, checkToken } from '../queries';


export default (router: express.Router) => {

  /**
   * Gets all the users if the token is valid.
   */
  router.get('/users', async (req, res) => {
    await checkToken(req.body.token);
    const users = await User.query().select('username', 'name', 'lastname');
    res.send(users);
  });

  /**
   * Gets the user's information if they are logged in.
   */
  router.get('/user', async (req, res) => {
    const validUser: any = await checkToken(req.body.token);
    const user = await User.query().select('username', 'name', 'lastname').where('id', validUser.id);
    res.send(user);
  });

  /**
   * Adds a new user.
   */
  router.post('/user', async (req, res) => {
    const newuser = req.body.newUser;
    if (!newuser) throw new BadRequestError('no user information');

    if (await userNameExists(newuser.username))  throw new BadRequestError('Username is already in use');

    const hashedPassword = await password.hashPassword(newuser.password);
    newuser.password = hashedPassword.hash;
    await User.query().insert(newuser);
    res.send('Success: new user added');


  });

};
