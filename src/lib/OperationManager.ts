import { Model } from './decorators/ApiProperty.decorators';
import {
  OpenAPI,
  Operation,
  SchemaObject,
  SecurityRequirement,
  Tag,
} from '@fosfad/openapi-typescript-definitions/3.1.0';
import { Parameters } from './Parameters';
import { SchemaManager } from './SchemaManager';
import { ResponsesManager } from './ResponsesManager';
import { RequestBodyManager } from './RequestBodyManager';

export type ResponseSchemas = { [statusCode: string]: Model[] | undefined };

export type OperationParams = {
  title: string;
  description?: string | undefined;
  isImplemented: boolean;
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';
  requestBody?: Model | undefined;
  content?: string | undefined;
  pathParams?: Model | undefined;
  query?: Model | undefined;
  header?: Model | undefined;
  cookie?: Model | undefined;
  requiresAuthorization: boolean;
  responses?: ResponseSchemas | undefined;
  errorSchemas?: Array<SchemaObject>;
  tags?: Tag | Tag[];
  deprecationMessage?: string | undefined;
};

export type EventOperationParams = {
  /** event - unique name of event */
  event: string;
  title: string;
  description?: string | undefined;
  isImplemented: boolean;
  tags?: Tag | Tag[];
  deprecationMessage?: string | undefined;
  responses: Model[];
};

export class OperationManager {
  private readonly openApiState: OpenAPI;
  private readonly defaultTags: Tag[];
  private readonly parameters: Parameters;
  private readonly schemaManager: SchemaManager;
  private readonly responsesManager: ResponsesManager;
  private readonly requestBodyManager: RequestBodyManager;

  constructor(openApiState: OpenAPI, defaultTags: Tag[]) {
    this.openApiState = openApiState;
    this.defaultTags = defaultTags;
    this.parameters = new Parameters();
    this.schemaManager = new SchemaManager(this.openApiState);
    this.responsesManager = new ResponsesManager(this.schemaManager);
    this.requestBodyManager = new RequestBodyManager(this.schemaManager);
  }

  createOperation(path: string, params: OperationParams): Operation {
    let description = params.description ?? '';
    if (params.deprecationMessage) {
      description = `**_Deprecated:_** ${params.deprecationMessage}\n\n${description}`;
    }
    if (!params.isImplemented) {
      params.title = '⏳ ' + params.title;
      description = '⏳️ — Данный метод еще **не реализован** \n\n' + description;
    }

    const tags = this.getTagsToApiMethod(params.tags, path);

    return {
      summary: params.title,
      security: params.requiresAuthorization ? this.getSecurity() : undefined,
      description: description,
      deprecated: params.deprecationMessage !== undefined,
      operationId: `${params.method}_${path}`,
      requestBody: this.requestBodyManager.create(params.requestBody, params.content),
      parameters: this.parameters.create(params.pathParams, params.query, params.header, params.cookie),
      responses: this.responsesManager.createResponse(params.responses),
      tags: tags,
    };
  }

  createEventOperation(params: EventOperationParams): Operation {
    let description = params.description ?? '';
    if (params.deprecationMessage) {
      description = `**_Deprecated:_** ${params.deprecationMessage}\n\n${description}`;
    }
    if (!params.isImplemented) {
      params.title = '⏳ ' + params.title;
      description = '⏳️ — Данный ивент еще **не реализован** \n\n' + description;
    }

    const tags = this.getTagsToApiMethod(params.tags, params.event);

    return {
      summary: `${params.title} [${params.event}]`,
      description: description,
      deprecated: params.deprecationMessage !== undefined,
      operationId: `EVENT_${params.event}`,
      responses: this.responsesManager.createEventResponse(params.responses),
      tags: tags,
    };
  }

  private getTagsToApiMethod(newTags: Tag | Tag[], path: string): string[] | undefined {
    const tags = this.defaultTags.map((tag: Tag) => tag.name);

    if (newTags === undefined) {
      return tags;
    }
    if (!Array.isArray(newTags)) newTags = [newTags];

    newTags.forEach((newTag: Tag) => {
      if (tags.includes(newTag.name)) {
        throw new Error(`Duplicate tag '${newTag.name}' in method '${path}'`);
      }
    });

    tags.push(...newTags.map((tag: Tag) => tag.name));

    if (tags.length === 0) return undefined;

    return tags;
  }

  private getSecurity(): SecurityRequirement[] {
    const securitySchemes = this.openApiState.components.securitySchemes;
    if (!securitySchemes) return [];

    const securities = Object.keys(securitySchemes);
    return securities.map((security: string) => {
      const auth = {};
      auth[security] = [];
      return auth;
    });
  }
}
