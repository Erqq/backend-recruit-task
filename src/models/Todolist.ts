import { Model } from 'objection';
import { tables } from '../../constants';

export default class Todolist extends Model {
  static tableName = tables.TODOLIST_TABLE;

  readonly id!: number;
  name: string;

  userId?: number;

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      userId: { type: ['integer', 'null'] },
    },
  };
}
