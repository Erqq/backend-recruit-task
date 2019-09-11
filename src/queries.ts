import User from './models/User';
import { password , jwt } from './accounts';
import { BadRequestError } from './Errors';

/**
 * Checks if the username na is already in the database
 * @param username The username to be checked
 */
export const userNameExists = async (username) => {

  return await User.query().select('username')
    .where('username', username)
    .then(async (uNameList) => {

      return uNameList.length === 0 ? false : true;
    });
};

/**
 * Checks if the password is correct
 * @param username The users username
 * @param userPassword The password to be checked
 */
export const checkPassword = async (username: string, userPassword: string) => {
  return await User.query().select('password')
    .where('username', username).first()
    .then(async (user) => {

      return await password.comparePassword(userPassword, user.password) ? true : false;
    });
};

/**
 * Checks if the token is valid and returns user information.
 * @param token The signed JSON Web token to validate
 */
export const checkToken = async (token:string) => {
  try {
    const validToken: any = jwt.validateToken(token);
    return await User.query().select('id', 'username', 'name')
        .where('id', validToken.sub).first();

  } catch (error) {
    throw new BadRequestError('invalid token');
  }
};
