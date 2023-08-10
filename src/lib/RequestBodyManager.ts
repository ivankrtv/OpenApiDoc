import { SchemaManager } from "./SchemaManager";
import { Model } from "./decorators/ApiProperty.decorators";
import { RequestBody } from "@fosfad/openapi-typescript-definitions/3.1.0";

export class RequestBodyManager {
  constructor(private readonly schemaManager: SchemaManager) {
  }

  create(requestBody: Model | undefined, content: string | undefined): RequestBody {
    if (!requestBody) {
      return undefined;
    }

    const description = Reflect.getMetadata('API_DOC_SCHEMA_DESCRIPTION', requestBody);

    const contentType = content ?? 'application/json';

    const body: RequestBody = { content: {}, description: description };
    body.content[contentType] = {
      schema: this.schemaManager.getReference(requestBody),
    }

    return body;
  }
}