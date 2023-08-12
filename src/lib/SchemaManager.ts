import { OpenAPI, Reference, SchemaObject } from '@fosfad/openapi-typescript-definitions/3.1.0';
import { Model } from './decorators/ApiProperty.decorators';

export class SchemaManager {
  private readonly openApiState: OpenAPI;

  constructor(openApi: OpenAPI) {
    this.openApiState = openApi;
  }

  getReference(model: Model): Reference {
    this.addToSchemas(model);
    return {
      description: model.name,
      $ref: `#/components/schemas/${model.name}`,
    };
  }

  getManyReferences(models: Model[]): SchemaObject {
    if (models.length === 1) {
      return {
        description: models[0].name,
        ...this.getReference(models[0]),
      };
    }

    const schema: SchemaObject = {
      oneOf: [],
    };

    models.forEach((model) => {
      schema.oneOf.push({
        description: model.name,
        ...this.getReference(model),
      });
    });

    return schema;
  }

  private addToSchemas(model: Model): void {
    const schema = Reflect.getMetadata('API_DOC_SCHEMA', model) as SchemaObject;
    if (schema === undefined) return;

    this.checkUniqueSchemaName(model.name, schema);

    this.openApiState.components.schemas[model.name] = schema;

    const dependedSchemas: SchemaObject[] | undefined = Reflect.getMetadata('API_DOC_DEPENDED_SCHEMAS', model);
    if (!dependedSchemas) return;

    for (const dependedSchema of dependedSchemas) {
      this.checkUniqueSchemaName(dependedSchema.title, dependedSchema);
      this.openApiState.components.schemas[dependedSchema.title] = dependedSchema;
    }
  }

  private checkUniqueSchemaName(schemaName: string, schema: SchemaObject): void {
    if (this.openApiState.components.schemas[schemaName] === undefined) return;

    const existSchemas = this.openApiState.components.schemas as { [p: string]: SchemaObject };

    const existSchema = {
      properties: existSchemas[schemaName].properties,
      required: existSchemas[schemaName].required,
      description: existSchemas[schemaName].description,
    };

    const newSchema = {
      properties: schema.properties,
      required: schema.required,
      description: schema.description,
    };

    if (JSON.stringify(existSchema, null, 2) !== JSON.stringify(newSchema, null, 2)) {
      throw new Error(`Duplicate schema name: '${schemaName}' is already exist.`);
    }
  }
}
