import { OpenApiDoc } from "../lib/OpenApiDoc";
import { ObjectProperty, StringProperty } from "../lib/decorators/ApiProperty.decorators";
import { Schema } from "@fosfad/openapi-typescript-definitions/3.1.0";

describe('StringProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');


    class User {
      @StringProperty({ description: 'name', example: 'John' })
      name: string;

      @StringProperty({
        description: 'last name',
        example: 'Russell',
        nullable: true,
        minLength: 1,
        maxLength: 50,
        pattern: '^[a-zA-Z-]',
      })
      lastName: string;

      @StringProperty({
        description: 'last name',
        example: 'qwerty',
        isOptional: true,
      })
      someString: string;
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

    expect(schema['properties']['name']).toBeDefined();
    expect(schema['properties']['name']['type']).toBe('string');
    expect(schema['properties']['name']['description']).toBe('name');
    expect(schema['properties']['name']['example']).toBe('John');
    expect(schema['properties']['name']['nullable']).toBeUndefined();
    expect(schema['properties']['name']['minLength']).toBeUndefined();
    expect(schema['properties']['name']['maxLength']).toBeUndefined();
    expect(schema['properties']['name']['pattern']).toBeUndefined();

    expect(schema['properties']['lastName']).toBeDefined();
    expect(schema['properties']['lastName']['type']).toBe('string');
    expect(schema['properties']['lastName']['description']).toBe('last name');
    expect(schema['properties']['lastName']['example']).toBe('Russell');
    expect(schema['properties']['lastName']['nullable']).toBeTruthy();
    expect(schema['properties']['lastName']['minLength']).toBe(1);
    expect(schema['properties']['lastName']['maxLength']).toBe(50);
    expect(schema['properties']['lastName']['pattern']).toBe('^[a-zA-Z-]');

    expect(schema['required']).toBeDefined();
    expect(schema['required'].length).toBe(2);
    expect(schema['required'][0]).toBe('name');
    expect(schema['required'][1]).toBe('lastName');
  });
})