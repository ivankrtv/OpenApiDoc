import { OpenApiDoc } from "../lib/OpenApiDoc";
import { FloatProperty } from "../lib/decorators/ApiProperty.decorators";
import { Schema } from "@fosfad/openapi-typescript-definitions/3.1.0";

describe('FloatProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class User {
      @FloatProperty({
        description: 'height',
        example: 180.0,
        nullable: true,
        minimum: 50.0,
        maximum: 300.0,
      })
      height: string;

      @FloatProperty({
        description: 'weight',
        example: 60.0,
        isOptional: true,
      })
      weight: string;
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

    expect(schema['properties']['height']).toBeDefined();
    expect(schema['properties']['height']['type']).toBe('number');
    expect(schema['properties']['height']['description']).toBe('height');
    expect(schema['properties']['height']['example']).toBe(180.0);
    expect(schema['properties']['height']['nullable']).toBeTruthy();
    expect(schema['properties']['height']['minimum']).toBe(50.0);
    expect(schema['properties']['height']['maximum']).toBe(300.0);

    expect(schema['properties']['weight']).toBeDefined();
    expect(schema['properties']['weight']['type']).toBe('number');

    expect(schema['required']).toBeDefined();
    expect(schema['required'].length).toBe(1);
    expect(schema['required'][0]).toBe('height');
  });
})