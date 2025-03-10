import { SchemaManager } from './SchemaManager';
import { Responses } from '@fosfad/openapi-typescript-definitions/3.1.0';
import { ResponseSchemas } from './OperationManager';
import { Model } from './decorators/ApiProperty.decorators';

export class ResponsesManager {
  private readonly schemaManager: SchemaManager;

  constructor(schemaManager: SchemaManager) {
    this.schemaManager = schemaManager;
  }

  createResponse(responseSchemas: ResponseSchemas | undefined): Responses | undefined {
    if (responseSchemas === undefined) {
      return undefined;
    }
    const codes = Object.keys(responseSchemas);

    const descriptions: { [code: string]: string } = {
      '201': 'Сущность создана успешно',
      '200': 'Успешный ответ',
      '400': 'Валидационная или доменная ошибка',
      '404': 'Сущность не найдена',
      '403': 'Ошибка доступа',
      '401': 'Неавторизованный запрос',
      '500': 'Серверная ошибка',
    };

    const responses: Responses = {};

    codes.forEach((statusCode: string) => {
      if (responseSchemas[statusCode].length === 1) {
        responses[statusCode] = {
          description: descriptions[statusCode] + ` (${responseSchemas[statusCode][0]?.name})`,
          content: {
            'application/json': {
              schema: this.schemaManager.getManyReferences(responseSchemas[statusCode]),
            },
          },
        };
        return;
      }
      responses[statusCode] = {
        description: descriptions[statusCode],
        content:
          responseSchemas[statusCode].length === 0
            ? undefined
            : {
                'application/json': {
                  schema: this.schemaManager.getManyReferences(responseSchemas[statusCode]),
                },
              },
      };
    });

    return responses;
  }

  createEventResponse(responseSchemas: Model[]): Responses {
    return {
      '200': {
        description: 'Событие',
        headers: {
          'Content-Type': {
            schema: {
              type: 'string',
              enum: ['text/event-stream'],
            },
          },
        },
        content: {
          'text/event-stream as json': {
            schema: this.schemaManager.getManyReferences(responseSchemas),
          },
        },
      },
    };
  }
}
