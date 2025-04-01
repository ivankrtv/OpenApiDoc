import { OpenApiDoc } from "../lib/OpenApiDoc";
import { BoolProperty } from "../lib/decorators/ApiProperty.decorators";
import { Schema } from "@fosfad/openapi-typescript-definitions/3.1.0";

describe('BooleanProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class User {
      @BoolProperty({ description: 'is Active' })
      isActive: string;

      @BoolProperty({ description: 'is Deleted', nullable: true })
      isDeleted: string;

      @BoolProperty({ description: 'is Banned', isOptional: true })
      isBanned: string;
    }

    controller.addApiMethod('/', {
      method: 'POST',
      title: 'Test',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: User,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.schemas['User']).toBeDefined();
    const schema: Schema = document.components.schemas['User'];
    expect(schema['type']).toBe('object');
    expect(schema['properties']).toBeDefined();

    expect(schema['properties']['isActive']).toBeDefined();
    expect(schema['properties']['isActive']['type']).toBe('boolean');
    expect(schema['properties']['isActive']['description']).toBe('is Active');

    expect(schema['properties']['isDeleted']).toBeDefined();
    expect(schema['properties']['isDeleted']['type']).toBe('boolean');
    expect(schema['properties']['isDeleted']['description']).toBe('is Deleted');
    expect(schema['properties']['isDeleted']['nullable']).toBeTruthy();

    expect(schema['properties']['isBanned']).toBeDefined();
    expect(schema['properties']['isBanned']['type']).toBe('boolean');
    expect(schema['properties']['isBanned']['description']).toBe('is Banned');

    expect(schema['required']).toBeDefined();
    expect(schema['required'].length).toBe(2);
    expect(schema['required'][0]).toBe('isActive');
    expect(schema['required'][1]).toBe('isDeleted');
  });
})