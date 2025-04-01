import { OpenApiDoc } from '../lib/OpenApiDoc';
import { ObjectProperty, StringProperty } from '../lib/decorators/ApiProperty.decorators';
import { Schema } from '@fosfad/openapi-typescript-definitions/3.1.0';

describe('ObjectProperty', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class Password {
      @StringProperty({ description: 'password as string', example: 'ajklhfsuails' })
      passwordString: string;
    }

    class Credentials {
      @StringProperty({ description: 'phone number', example: '89998887766' })
      phoneNumber: string;

      @ObjectProperty({ description: 'password' })
      password: Password;
    }

    class User {
      @ObjectProperty({ description: 'credentials' })
      credentials: Credentials;
    }

    class Client {
      @ObjectProperty({ description: 'user' })
      user: User;
    }

    controller.addApiMethod('/', {
      method: 'POST',
      title: 'Test',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: Client,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.schemas['Password']).toBeDefined();
    const passwordSchema: Schema = document.components.schemas['Password'];
    expect(passwordSchema['type']).toBe('object');
    expect(passwordSchema['properties']).toBeDefined();
    expect(passwordSchema['properties']['passwordString']).toBeDefined();
    expect(passwordSchema['properties']['passwordString']['type']).toBe('string');

    expect(document.components.schemas['Credentials']).toBeDefined();
    const credentialsSchema: Schema = document.components.schemas['Credentials'];
    expect(credentialsSchema['type']).toBe('object');
    expect(credentialsSchema['properties']).toBeDefined();
    expect(credentialsSchema['properties']['password']).toBeDefined();
    expect(credentialsSchema['properties']['password']['$ref']).toBe('#/components/schemas/Password');

    expect(document.components.schemas['User']).toBeDefined();
    const userSchema: Schema = document.components.schemas['User'];
    expect(userSchema['type']).toBe('object');
    expect(userSchema['properties']).toBeDefined();
    expect(userSchema['properties']['credentials']).toBeDefined();
    expect(userSchema['properties']['credentials']['$ref']).toBe('#/components/schemas/Credentials');

    expect(document.components.schemas['Client']).toBeDefined();
    const clientSchema: Schema = document.components.schemas['Client'];
    expect(clientSchema['type']).toBe('object');
    expect(clientSchema['properties']).toBeDefined();
    expect(clientSchema['properties']['user']).toBeDefined();
    expect(clientSchema['properties']['user']['$ref']).toBe('#/components/schemas/User');
  });

  it('success: oneOf schemas', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class D {
      @StringProperty({ description: 'd', example: 'qwerty' })
      d: string;
    }

    class A {
      @StringProperty({ description: 'a', example: 'qwerty' })
      a: string;

      @ObjectProperty({ description: 'd' })
      d: D;
    }

    class B {
      @StringProperty({ description: 'b', example: 'qwerty' })
      b: string;
    }

    class C {
      @ObjectProperty({ description: 'c', oneOf: [A, B] })
      c: A | B;
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
    expect(document.components.schemas['B']).toBeDefined();
    expect(document.components.schemas['C']).toBeDefined();
    expect(document.components.schemas['D']).toBeDefined();

    const schema: Schema = document.components.schemas['C'];
    expect(schema['type']).toBe('object');
    expect(schema['properties']).toBeDefined();
    expect(schema['properties']['c']['oneOf']).toBeDefined();
    expect(schema['properties']['c']['oneOf'].length).toBe(2);
    expect(schema['properties']['c']['oneOf'][0]['$ref']).toBe('#/components/schemas/A');
    expect(schema['properties']['c']['oneOf'][1]['$ref']).toBe('#/components/schemas/B');
  });

  it('success: nullable', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class B {
      @StringProperty({ description: 'b', example: 'qwerty' })
      b: string;
    }

    class A {
      @ObjectProperty({ description: 'b', nullable: true })
      b: B;
    }

    controller.addApiMethod('/', {
      method: 'POST',
      title: 'Test',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: A,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.schemas['A']).toBeDefined();
    expect(document.components.schemas['B']).toBeDefined();

    const schema = document.components.schemas['A'];
    expect(schema['properties']).toBeDefined();
    expect(schema['properties']['b']).toBeDefined();
    expect(schema['properties']['b']['nullable']).toBeTruthy();
  });

  it('success: optional', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    class B {
      @StringProperty({ description: 'b', example: 'qwerty' })
      b: string;
    }

    class A {
      @ObjectProperty({ description: 'b', isOptional: true })
      b: B;
    }

    controller.addApiMethod('/', {
      method: 'POST',
      title: 'Test',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: A,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.schemas['A']).toBeDefined();
    expect(document.components.schemas['B']).toBeDefined();

    const schema: Schema = document.components.schemas['A'];
    expect(schema['properties']).toBeDefined();
    expect(schema['properties']['b']).toBeDefined();
    expect(schema['required'].length).toBe(0);
  });

  it('fail: nested class has not metadata', () => {
    try {
      class Password {
        passwordString: string;
      }

      /* eslint-disable no-unused-vars */
      class Credentials {
        @ObjectProperty({ description: 'password' })
        password: Password;
      }
      /* eslint-enable no-unused-vars */
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const errorMessage = error.message;
      expect(errorMessage).toBe(
        'Nested object in "Credentials", field: "password" has not OpenApi metadata.\n' +
          '        Check if you have set the decorator in type of field "password"',
      );
    }
  });
});
