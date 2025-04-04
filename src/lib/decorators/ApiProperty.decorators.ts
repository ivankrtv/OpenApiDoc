import { Schema, SchemaObject } from '@fosfad/openapi-typescript-definitions/3.1.0';
import {
  arraySchema,
  ArraySchemaParams,
  booleanSchema,
  BooleanSchemaParams,
  enumSchema,
  EnumSchemaParams,
  floatSchema,
  FloatSchemaParams,
  integerSchema,
  IntegerSchemaParams,
  stringSchema,
  StringSchemaParams,
} from '../factories/schemasFactory';

import('reflect-metadata');

export type Model = Function;
export type ArrayItemType = Model | 'string' | 'number';
type ArrayItemSchema =
  | { type: 'string'; format?: string; example: string }
  | { type: 'number'; example: number }
  | { $ref: string }
  | Schema;
/**
 * @prop items
 * to handle circular references use items as `items: { $ref: getSchemaPath(Model) }`
 */
export type ArrayParams = Omit<ArraySchemaParams, 'items'> & {
  items: ArrayItemType | ArrayItemSchema;
  isOptional?: boolean;
};
export type EnumParams = Omit<EnumSchemaParams, 'enum'> & {
  enum: Record<string, any> | string[];
  isOptional?: boolean;
};
export type IntegerParams = IntegerSchemaParams & {
  isOptional?: boolean;
};
export type FloatParams = FloatSchemaParams & {
  isOptional?: boolean;
};
export type StringParams = StringSchemaParams & {
  isOptional?: boolean;
};
export type BooleanParams = BooleanSchemaParams & {
  isOptional?: boolean;
};
export type ObjectParams = {
  description: string;
  deprecated?: boolean;
  nullable?: boolean;
  isOptional?: boolean;
  oneOf?: Model[];
};

const getUpdatedSchema = (
  currentMetadata: SchemaObject,
  className: string,
  propertyKey: string,
  schema: SchemaObject,
  isOptional: boolean = false,
) => {
  let schemaObject: SchemaObject = JSON.parse(JSON.stringify(currentMetadata));
  if (schemaObject === null) {
    schemaObject = {
      type: 'object',
      title: className,
      properties: {},
      additionalProperties: undefined,
      required: [],
    };
  }
  schemaObject.title = className;

  if (schemaObject.properties[propertyKey] !== undefined) {
    throw new Error(`duplicate property ${propertyKey} in ${className} schema`);
  }

  schemaObject.properties[propertyKey] = schema;
  if (!isOptional) {
    schemaObject.required.push(propertyKey);
  }

  return schemaObject;
};

export const IntProperty = (params: IntegerParams): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    const { isOptional, ...schemaParams } = params;
    const propertySchema = integerSchema(schemaParams);
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
  };
};

export const FloatProperty = (params: FloatParams): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    const { isOptional, ...schemaParams } = params;
    const propertySchema = floatSchema(schemaParams);
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
  };
};

export const StringProperty = (params: StringParams): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    const { isOptional, ...schemaParams } = params;
    const propertySchema = stringSchema(schemaParams);
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
  };
};

export const BoolProperty = (params: BooleanParams): PropertyDecorator => {
  if (params.description === undefined) {
    params.description = null;
  }

  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    const { isOptional, ...schemaParams } = params;
    const propertySchema = booleanSchema(schemaParams);
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
  };
};

export const ObjectProperty = (params: ObjectParams): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;

    let ref = undefined;

    const dependedMetadata = Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', constructor) || [];

    if (params.oneOf !== undefined) {
      const oneOfMetadata = params.oneOf.map((propType) => Reflect.getMetadata('API_DOC_SCHEMA', propType));
      const oneOfDependedMetadata = params.oneOf.map(
        (propType) => Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', propType) || [],
      );

      ref = [];
      const oneOfDependedMeta = [];
      oneOfMetadata.forEach((metadata) => {
        if (!metadata) {
          throw new Error(`Nested object in "${constructor.name}", field: "${propertyKey}" has not OpenApi metadata.
        Check if you have set the decorator in type of field "${propertyKey}"`);
        }
        ref.push({ $ref: `#/components/schemas/${metadata.title}` });
      });
      oneOfDependedMetadata.forEach((schemasMetadata) => {
        oneOfDependedMeta.push(...schemasMetadata);
      });

      dependedMetadata.push(...oneOfMetadata, ...oneOfDependedMeta);
    } else {
      const propertyType = Reflect.getMetadata('design:type', target, propertyKey);
      const nestedMetadata = Reflect.getMetadata('API_DOC_SCHEMA', propertyType);
      const nestedDependedMetadata = Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', propertyType) || [];

      if (!nestedMetadata) {
        throw new Error(`Nested object in "${constructor.name}", field: "${propertyKey}" has not OpenApi metadata.
        Check if you have set the decorator in type of field "${propertyKey}"`);
      }

      ref = `#/components/schemas/${nestedMetadata.title}`;

      dependedMetadata.push(nestedMetadata, ...nestedDependedMetadata);
    }

    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    const refSchema: SchemaObject & { nullable?: boolean } = {
      description: params.description,
      deprecated: params.deprecated !== undefined ? params.deprecated : false,
      nullable: params.nullable ?? false,
      $ref: params.oneOf === undefined ? ref : undefined,
      oneOf: params.oneOf === undefined ? undefined : ref,
    };

    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      refSchema,
      params.isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
      Reflect.defineMetadata('API_DOC_DEPENDED_SCHEMAS', dependedMetadata, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
    Reflect.defineMetadata('API_DOC_DEPENDED_SCHEMAS', dependedMetadata, constructor);
  };
};

export const EnumProperty = (params: EnumParams): PropertyDecorator => {
  return (target: Object, propertyKey: string): void => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;

    let Enum: string[] = undefined;
    if (Array.isArray(params.enum)) {
      Enum = params.enum;
    }
    if (typeof params.enum === 'object') {
      Enum = Object.values(params.enum);
    }

    const propertySchema = enumSchema({
      description: params.description,
      nullable: params.nullable ?? false,
      enum: Enum,
    });
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      params.isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
  };
};

export const ArrayProperty = (params: ArrayParams): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const constructor = target.constructor;
    const currentMetadata = Reflect.getMetadata('API_DOC_SCHEMA', constructor) || null;
    const dependedMetadata = Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', constructor) || [];

    let items: SchemaObject;

    if (typeof params.items === 'function') {
      items = Reflect.getMetadata('API_DOC_SCHEMA', params.items);
      const dependItem = Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', params.items) || [];
      dependedMetadata.push(items);
      dependedMetadata.push(...dependItem);
    } else if (typeof params.items === 'object') {
      items = params.items;
    } else {
      if (params.items === 'string') {
        items = {
          type: 'string',
        };
      }
      if (params.items === 'number') {
        items = {
          type: 'number',
        };
      }
    }

    const schema: ArraySchemaParams = {
      description: params.description,
      uniqueItems: params.uniqueItems !== undefined ? params.uniqueItems : true,
      minItems: params.minItems !== undefined ? params.minItems : undefined,
      maxItems: params.maxItems !== undefined ? params.maxItems : undefined,
      items: items,
      nullable: params.nullable ?? false,
    };

    const propertySchema = arraySchema(schema);
    const updatedMetadata = getUpdatedSchema(
      currentMetadata,
      constructor.name,
      propertyKey,
      propertySchema,
      params.isOptional ?? false,
    );

    if (currentMetadata === null) {
      Reflect.defineMetadata('API_DOC_SCHEMA', constructor.name, constructor);
      Reflect.defineMetadata('API_DOC_DEPENDED_SCHEMAS', dependedMetadata, constructor);
    }

    Reflect.defineMetadata('API_DOC_SCHEMA', updatedMetadata, constructor);
    Reflect.defineMetadata('API_DOC_DEPENDED_SCHEMAS', dependedMetadata, constructor);
  };
};
