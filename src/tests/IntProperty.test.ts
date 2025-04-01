import { OpenApiDoc } from "../lib/OpenApiDoc";
import { IntProperty, StringProperty } from "../lib/decorators/ApiProperty.decorators";
import { Schema } from "@fosfad/openapi-typescript-definitions/3.1.0";

describe('IntProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');


    class User {
      @IntProperty({ description: 'age', example: 25 })
      age: string;

      @IntProperty({
        description: 'height',
        example: 180,
        nullable: true,
        minimum: 50,
        maximum: 300,
      })
      height: string;

      @IntProperty({
        description: 'weight',
        example: 60,
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

    expect(schema['properties']['age']).toBeDefined();
    expect(schema['properties']['age']['type']).toBe('integer');
    expect(schema['properties']['age']['description']).toBe('age');
    expect(schema['properties']['age']['example']).toBe(25);
    expect(schema['properties']['age']['nullable']).toBeUndefined();
    expect(schema['properties']['age']['minimum']).toBeUndefined();
    expect(schema['properties']['age']['maximum']).toBeUndefined();

    expect(schema['properties']['height']).toBeDefined();
    expect(schema['properties']['height']['type']).toBe('integer');
    expect(schema['properties']['height']['description']).toBe('height');
    expect(schema['properties']['height']['example']).toBe(180);
    expect(schema['properties']['height']['nullable']).toBeTruthy();
    expect(schema['properties']['height']['minimum']).toBe(50);
    expect(schema['properties']['height']['maximum']).toBe(300);

    expect(schema['properties']['weight']).toBeDefined();
    expect(schema['properties']['weight']['type']).toBe('integer');

    expect(schema['required']).toBeDefined();
    expect(schema['required'].length).toBe(2);
    expect(schema['required'][0]).toBe('age');
    expect(schema['required'][1]).toBe('height');
  })
})