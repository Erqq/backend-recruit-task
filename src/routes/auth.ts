import * as express from 'express';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../Errors';
import { password, jwt } from '../accounts'
import { userNameExists, checkPassword, checkToken } from '../queries'


export default (router: express.Router) => {

    router.post('/login', async (req, res) => {
        const user = req.body
        if (await userNameExists(user.username)) {
            if (await checkPassword(user.username, user.password)) {
                res.send({ token: jwt.issueToken(user.username) })
            } else {
                throw new BadRequestError('Wrong username or password');
            }

        } else {
            throw new BadRequestError('Wrong username or password');

        }
    });

    router.post('/changepassword', async (req, res) => {

        const validToken: any = await checkToken(req.body.token)

        if (await checkPassword(validToken.sub, req.body.password)) {
            const newPassword = await password.hashPassword(req.body.newPassword)

            try {
                await User.query()
                    .update({ username: validToken.sub, password: newPassword.hash })
                    .where("username", validToken.sub)
            } catch (error) {
                throw new BadRequestError("something went wrong")
            }

        } else {
            throw new BadRequestError("Wrong username or password")
        }

        res.send("Password changed successfully")

    })

    router.post('/forgotpassword', async (req, res) => {
        const newPassword = await password.hashPassword(req.body.newPassword)

        try {
            await User.query()
                .update({ username: req.body.username, password: newPassword.hash })
                .where("username", req.body.username)
        } catch (error) {
            console.log(error);
            throw new BadRequestError("something went wrong")
        }
        res.send("password changed")
    })

}