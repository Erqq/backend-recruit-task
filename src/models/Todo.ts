import { Model } from 'objection';
import { tables } from '../../constants';

export default class Todo extends Model {
  static tableName = tables.TODO_TABLE;

  readonly id!: number;
  title: string;
  description?: string;

  todolistId?: number;

  static jsonSchema = {
    type: 'object',
    required: ['title'],

    properties: {
      id: { type: 'integer' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 255 },
      todolistId: { type: ['integer', 'null'] },
    },
  };
}
