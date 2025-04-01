import { OpenApiDoc } from "../lib/OpenApiDoc";
import { ArrayProperty, ObjectProperty, StringProperty } from "../lib/decorators/ApiProperty.decorators";
import { Schema } from "@fosfad/openapi-typescript-definitions/3.1.0";

describe('ArrayProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class A {
      @StringProperty({ description: 'A', example: 'ajklhfsuails' })
      a: string;
    }

    class B {
      @ArrayProperty({ description: 'B', items: A, minItems: 1, maxItems: 10 })
      b: A[];
    }

    class C {
      @ArrayProperty({ description: 'C', items: B, uniqueItems: false })
      c: B[];
    }

    controller.addApiMethod('/', {
      method: 'POST',
      title: 'Test',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: C,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.schemas['A']).toBeDefined();
    const schemaA: Schema = document.components.schemas['A'];
    expect(schemaA['type']).toBe('object');
    expect(schemaA['properties']).toBeDefined();
    expect(schemaA['properties']['a']).toBeDefined();

    expect(document.components.schemas['B']).toBeDefined();
    const schemaB: Schema = document.components.schemas['B'];
    expect(schemaB['type']).toBe('object');
    expect(schemaB['properties']).toBeDefined();
    expect(schemaB['properties']['b']).toBeDefined();
    expect(schemaB['properties']['b']['type']).toBe('array');
    expect(schemaB['properties']['b']['items']).toBeDefined();
    expect(schemaB['properties']['b']['uniqueItems']).toBeTruthy();
    expect(schemaB['properties']['b']['minItems']).toBe(1);
    expect(schemaB['properties']['b']['maxItems']).toBe(10);

    expect(document.components.schemas['C']).toBeDefined();
    const schemaC: Schema = document.components.schemas['C'];
    expect(schemaC['type']).toBe('object');
    expect(schemaC['properties']).toBeDefined();
    expect(schemaC['properties']['c']).toBeDefined();
    expect(schemaC['properties']['c']['items']).toBeDefined();
    expect(schemaC['properties']['c']['uniqueItems']).toBeFalsy();
  });
})