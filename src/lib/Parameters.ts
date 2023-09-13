import { Model } from './decorators/ApiProperty.decorators';
import {
  CookieParameter,
  HeaderParameter,
  Parameter,
  PathParameter,
  QueryParameter,
  Reference,
  Schema,
  SchemaObject,
} from '@fosfad/openapi-typescript-definitions/3.1.0';

export class Parameters {
  create(
    paramsModel: Model | undefined,
    queryModel: Model | undefined,
    headers: Model | undefined,
    cookies: Model | undefined,
  ): Array<Parameter | Reference> {
    const parameters: Array<Parameter | Reference> = [];

    if (paramsModel !== undefined) {
      parameters.push(...this.getParamsByModel(paramsModel));
    }
    if (queryModel !== undefined) {
      parameters.push(...this.getQueryParametersByModel(queryModel));
    }
    if (headers !== undefined) {
      parameters.push(...this.getHeaderParametersByModel(headers));
    }
    if (cookies !== undefined) {
      parameters.push(...this.getCookieParameters(cookies));
    }

    return parameters;
  }

  private getParamsByModel(model: Model): Array<Parameter | Reference> {
    const schema: SchemaObject = Reflect.getMetadata('API_DOC_SCHEMA', model);
    const propertyNames = Object.keys(schema.properties);

    const params: PathParameter[] = [];

    propertyNames.forEach((propertyName) => {
      const property = schema.properties[propertyName];
      params.push({
        in: 'path',
        required: true,
        name: propertyName,
        description: property['description'],
        example: property['example'],
        examples: property['examples'],
        deprecated: property['deprecated'],
        schema: {
          type: property['type'],
        } as Schema,
      });
    });

    return params;
  }

  private getQueryParametersByModel(model: Model): Array<Parameter | Reference> {
    const schema: SchemaObject = Reflect.getMetadata('API_DOC_SCHEMA', model);
    const propertyNames = Object.keys(schema.properties);

    const queryParameters: QueryParameter[] = [];

    propertyNames.forEach((propertyName) => {
      const property = schema.properties[propertyName];
      queryParameters.push({
        in: 'query',
        required: schema.required.includes(propertyName),
        name: propertyName,
        description: property['description'],
        example: property['example'],
        examples: property['examples'],
        deprecated: property['deprecated'],
        schema: {
          type: property['type'],
        } as Schema,
      });
    });

    return queryParameters;
  }

  private getHeaderParametersByModel(model: Model): Array<Parameter | Reference> {
    const schema: SchemaObject = Reflect.getMetadata('API_DOC_SCHEMA', model);
    const propertyNames = Object.keys(schema.properties);

    const headerParameters: HeaderParameter[] = [];

    propertyNames.forEach((propertyName) => {
      const property = schema.properties[propertyName];
      headerParameters.push({
        in: 'header',
        required: schema.required.includes(propertyName),
        name: propertyName,
        description: property['description'],
        example: property['example'],
        examples: property['examples'],
        deprecated: property['deprecated'],
        schema: {
          type: property['type'],
        } as Schema,
      });
    });

    return headerParameters;
  }

  private getCookieParameters(model: Model): Array<Parameter | Reference> {
    const schema: SchemaObject = Reflect.getMetadata('API_DOC_SCHEMA', model);
    const propertyNames = Object.keys(schema.properties);

    const cookieParameters: CookieParameter[] = [];

    propertyNames.forEach((propertyName) => {
      const property = schema.properties[propertyName];
      cookieParameters.push({
        in: 'cookie',
        required: schema.required.includes(propertyName),
        name: propertyName,
        description: property['description'],
        example: property['example'],
        examples: property['examples'],
        deprecated: property['deprecated'],
        schema: {
          type: property['type'],
        } as Schema,
      });
    });

    return cookieParameters;
  }
}
