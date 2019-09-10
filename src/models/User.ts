import { Model } from 'objection';
import { tables } from '../../constants';
import { join } from 'path';

export default class User extends Model {
  static tableName = tables.USER_TABLE;

  readonly id!: number;
  username: string;
  name?: string;
  password: string;

  static jsonSchema = {
    type: 'object',
    required: ['username', 'password'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      lastname: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },


    },
  };
}
