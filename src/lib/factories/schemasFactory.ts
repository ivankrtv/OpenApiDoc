import type { SchemaObject } from '@fosfad/openapi-typescript-definitions/3.1.0';

export type IntegerSchemaParams = {
  description: NonNullable<SchemaObject['description']>;
  example: number;
  examples?: NonNullable<SchemaObject['examples']>;
  externalDocs?: SchemaObject['externalDocs'];
  maximum?: SchemaObject['maximum'];
  minimum?: SchemaObject['minimum'];
  nullable?: boolean;
  deprecated?: boolean;
};

export type StringSchemaParams = {
  description: NonNullable<SchemaObject['description']>;
  examples?: NonNullable<SchemaObject['examples']>;
  example: string;
  externalDocs?: SchemaObject['externalDocs'];
  format?: SchemaObject['format'];
  maxLength?: SchemaObject['minLength'];
  minLength?: SchemaObject['minLength'];
  pattern?: SchemaObject['pattern'];
  nullable?: boolean;
  deprecated?: boolean;
};

export type DateSchemaPath = {
  description: NonNullable<SchemaObject['description']>;
  example: string | Date;
  examples?: NonNullable<SchemaObject['examples']>;
  pattern?: SchemaObject['pattern'];
  nullable?: boolean;
  deprecated?: boolean;
};

export type FloatSchemaParams = {
  description: NonNullable<SchemaObject['description']>;
  example: number;
  examples?: NonNullable<SchemaObject['examples']>;
  externalDocs?: SchemaObject['externalDocs'];
  maximum?: SchemaObject['maximum'];
  minimum?: SchemaObject['minimum'];
  nullable?: boolean;
  deprecated?: boolean;
};

export type ObjectSchemaParams = {
  additionalProperties: NonNullable<SchemaObject['additionalProperties']>;
  deprecated?: SchemaObject['deprecated'];
  description: NonNullable<SchemaObject['description']>;
  externalDocs?: SchemaObject['externalDocs'];
  properties: NonNullable<SchemaObject['properties']>;
  nullable?: boolean;
};

export type BooleanSchemaParams = {
  description?: SchemaObject['description'];
  nullable?: boolean;
  isOptional?: boolean;
  deprecated?: boolean;
};

export type ArraySchemaParams = {
  description: NonNullable<SchemaObject['description']>;
  items: NonNullable<SchemaObject['items']>;
  maxItems?: SchemaObject['maxItems'];
  minItems?: SchemaObject['minItems'];
  uniqueItems?: NonNullable<SchemaObject['uniqueItems']>;
  nullable?: boolean;
  deprecated?: boolean;
};

export type EnumSchemaParams = {
  description?: NonNullable<SchemaObject['description']>;
  enum: Array<string>;
  nullable?: boolean;
  deprecated?: boolean;
};

export const stringSchema = (schema: StringSchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'string',
  };
};

export const integerSchema = (schema: IntegerSchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'integer',
  };
};

export const floatSchema = (schema: FloatSchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'number',
  };
};

export const dateSchema = (schema: DateSchemaPath): SchemaObject => {
  return {
    ...schema,
    type: 'string',
  };
};

export const booleanSchema = (schema: BooleanSchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'boolean',
  };
};

export const objectSchema = (schema: ObjectSchemaParams): SchemaObject => {
  return {
    ...schema,
    required: Object.keys(schema.properties).sort(),
    type: 'object',
  };
};

export const arraySchema = (schema: ArraySchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'array',
  };
};

export const enumSchema = (schema: EnumSchemaParams): SchemaObject => {
  return {
    ...schema,
    type: 'string',
  };
};

export const schemas: { [schemaTitle: string]: SchemaObject } = {};
