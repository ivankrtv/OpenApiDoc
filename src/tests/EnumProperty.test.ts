import { OpenApiDoc } from '../lib/OpenApiDoc';
import { EnumProperty } from '../lib/decorators/ApiProperty.decorators';
import { Schema } from '@fosfad/openapi-typescript-definitions/3.1.0';

describe('EnumProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    /* eslint-disable no-unused-vars */
    enum Status {
      active = 'active',
      inactive = 'inactive',
    }

    enum Type {
      admin = 'admin',
      client = 'client',
    }
    /* eslint-enable no-unused-vars */

    class User {
      @EnumProperty({ enum: Status })
      status: string;

      @EnumProperty({ enum: Status, isOptional: true })
      status2: string;

      @EnumProperty({ enum: Type, nullable: true })
      type: string;
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

    expect(schema['properties']['status']).toBeDefined();
    expect(schema['properties']['status']['type']).toBe('string');
    expect(schema['properties']['status']['enum']).toBeDefined();
    expect(schema['properties']['status']['enum'].length).toBe(2);

    expect(schema['properties']['type']).toBeDefined();
    expect(schema['properties']['type']['type']).toBe('string');
    expect(schema['properties']['type']['enum']).toBeDefined();
    expect(schema['properties']['type']['enum'].length).toBe(2);

    expect(schema['properties']['status2']).toBeDefined();
    expect(schema['properties']['status2']['type']).toBe('string');
    expect(schema['properties']['status2']['enum']).toBeDefined();
    expect(schema['properties']['status2']['enum'].length).toBe(2);

    expect(schema['required']).toBeDefined();
    expect(schema['required'].length).toBe(2);
    expect(schema['required'][0]).toBe('status');
    expect(schema['required'][1]).toBe('type');
  });
});
