import * as express from 'express';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../Errors';
import { password, jwt } from '../accounts';
import { userNameExists, checkPassword, checkToken } from '../queries';


export default (router: express.Router) => {

   /**
   * Logs the user in to the application.
   */
  router.post('/login', async (req, res) => {
    const user = req.body;
    if (!await userNameExists(user.username)) throw new BadRequestError('Wrong username or password');
    if (!await checkPassword(user.username, user.password)) {
      throw new BadRequestError('Wrong username or password');
    }

    const userId = await User.query().select('id').where('username', user.username).first();

    res.send({ token: jwt.issueToken(userId.id) });
  });

  /**
   * Changes users password that has logged in.
   */
  router.post('/changepassword', async (req, res) => {
    const user: any = await checkToken(req.body.token);

    if (!await checkPassword(user.username, req.body.password)) throw new BadRequestError('Wrong username or password');
    const newPassword = await password.hashPassword(req.body.newPassword);

    await User.query()
              .update({ username: user.username, password: newPassword.hash })
              .where('id', user.id)
              .catch(() => { throw new BadRequestError('something went wrong'); });

    res.send('Password changed successfully');
  });

  /**
   * Changes the password without asking any permissions. This is not secure at all.
   * I used this to change the password from people if they didnt have hashed passwords
   * like the people from seed. There should be some kind of email verification etc.
   */
  router.post('/forgotpassword', async (req, res) => {
    const newPassword = await password.hashPassword(req.body.newPassword);

    await User.query()
              .update({ username: req.body.username, password: newPassword.hash })
              .where('username', req.body.username)
              .catch(() => {
                throw new BadRequestError('something went wrong');
              });

    res.send('password changed');
  });
};
