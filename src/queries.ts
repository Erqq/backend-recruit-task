import User from './models/User';
import { password , jwt } from './accounts';
import { BadRequestError } from './Errors';


export const userNameExists = async username => {

  return await User.query().select('username')
    .where('username', username)
    .then(async uNameList => {
      if (uNameList.length === 0) {
        return false;
      }
      return true;
    });

};

export const checkPassword = async (username: string, userPassword: string) => {
  return await User.query().select('password')
    .where('username', username).first()
    .then(async user => {

      if (await password.comparePassword(userPassword, user.password)) {
        return true;
      }
      return false;

    });
};

export const checkToken = async (token:string) => {
  try {
    const validToken: any = jwt.validateToken(token);
    return await User.query().select('id', 'username', 'name')
        .where('id', validToken.sub).first();

  } catch (error) {
    throw new BadRequestError('invalid token');
  }
};
