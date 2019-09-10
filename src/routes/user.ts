import * as express from 'express';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../Errors';
import { password, jwt } from '../accounts'
import { userNameExists, checkPassword, checkToken } from '../queries'


export default (router: express.Router) => {
    router.get('/users', async (req, res) => {

        const users = await User.query().select("username", "name", "lastname");
        res.send(users);
    });

    router.post('/user', async (req, res) => {
        const newuser = req.body.newUser
        if (!newuser) throw new BadRequestError('no user information');

        if (await userNameExists(newuser.username)) {
            throw new BadRequestError('Username is already in use');
        }
        else {
            const hashedPassword = await password.hashPassword(newuser.password)
            newuser.password = hashedPassword.hash
            await User.query().insert(newuser);
            res.send('Success: new user added')
        }

    });

}