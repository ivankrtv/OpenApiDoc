import { ObjectProperty, StringProperty, OpenApiDoc, OpenAPIDocConfig } from "../index";

describe("ObjectProperty", () => {
  it("Nested object success", () => {
    class Profile {
      @StringProperty({ description: 'name', example: 'Ivan' })
      name: string;
    }

    class User {
      @ObjectProperty({ description: 'profile' })
      profile: Profile;
    }

    class TestClass {
      @ObjectProperty({ description: 'user' })
      user: User;
    }

    const config: OpenAPIDocConfig = {
      title: 'Test',
      version: '0.0.0',
    }
    const openApi = new OpenApiDoc(config);

    const controller = openApi.createController();
    controller.addApiMethod('/', {
      title: 'Example',
      isImplemented: true,
      requestBody: TestClass,
      description: 'test endpoint',
      method: 'POST',
      requiresAuthorization: false,
    });

    const doc = openApi.compileOpenApi();

    expect(doc.components.schemas.hasOwnProperty('TestClass')).toBe(true);
    expect(doc.components.schemas.hasOwnProperty('User')).toBe(true);
    expect(doc.components.schemas.hasOwnProperty('Profile')).toBe(true);
  })
})