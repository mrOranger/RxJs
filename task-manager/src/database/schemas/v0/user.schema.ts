import { RxJsonSchema } from 'rxdb';
import { v4 } from 'uuid';

export const user: RxJsonSchema<any> = {
      title: 'users',
      version: 0,
      description: 'Collection of registered users',
      type: 'object',
      primaryKey: 'id',
      properties: {
            id: {
                  type: 'string',
                  maxLength: 255,
                  default: v4(),
            },
            firstName: {
                  type: 'string',
                  maxLength: 255,
            },
            lastName: {
                  type: 'string',
                  maxLength: 255,
            },
            email: {
                  type: 'string',
                  maxLength: 255,
            },
            password: {
                  type: 'string',
                  maxLength: 255,
            },
            createdAt: {
                  type: 'string',
                  format: 'date-time',
                  default: new Date().toISOString(),
                  final: true,
            },
            updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  default: new Date().toISOString(),
            },
      },
      encrypted: ['password'],
      attachments: { encrypted: true },
      required: ['id', 'firstName', 'lastName', 'email', 'password'],
};
