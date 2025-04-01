import { OpenApiDoc } from '../lib/OpenApiDoc';
import { Controller } from '../lib/Controller';
import { IntProperty } from '../lib/decorators/ApiProperty.decorators';

describe('addApiMethod', () => {
  it('success', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    const controller = openapi.createController('/');

    expect(controller).toBeInstanceOf(Controller);

    class RequestBody {
      @IntProperty({ description: 'param', example: 1 })
      param: number;
    }

    class PathParams {
      @IntProperty({ description: 'path param', example: 1 })
      param: number;
    }

    class QueryParams {
      @IntProperty({ description: 'query param', example: 1 })
      param: number;
    }

    class ResponseBody {
      @IntProperty({ description: 'field', example: 1 })
      field: number;
    }

    controller.addApiMethod('/testMethod', {
      method: 'POST',
      title: 'Test method',
      isImplemented: true,
      requiresAuthorization: false,
      requestBody: RequestBody,
      pathParams: PathParams,
      query: QueryParams,
      responses: {
        '200': [ResponseBody],
      },
    });

    const document = openapi.compileOpenApi();

    expect(document.paths['/testMethod']).toBeTruthy();
    expect(document.paths['/testMethod'].post).toBeDefined();

    const path = document.paths['/testMethod'];
    expect(path.post.operationId).toBe('POST_/testMethod');
    expect(path.post.summary).toBe('Test method');
    expect(path.post.requestBody).toBeDefined();
    expect(path.post.parameters).toBeDefined();
    expect(path.post.parameters.length).toBe(2);
    expect(path.post.responses).toBeDefined();
    expect(path.post.responses['200']).toBeDefined();
  });

  it('success with security', () => {
    const openapi = new OpenApiDoc({
      title: 'Test',
      version: '0.0.0',
    });

    openapi.setAuthorization({
      bearer: {
        type: 'apiKey',
        name: 'Bearer auth',
        in: 'header',
      },
    });

    const controller = openapi.createController('/');

    expect(controller).toBeInstanceOf(Controller);

    controller.addApiMethod('/testMethod', {
      method: 'GET',
      title: 'Test method',
      isImplemented: true,
      requiresAuthorization: true,
    });

    const document = openapi.compileOpenApi();

    expect(document.components.securitySchemes).toBeDefined();
    expect(document.components.securitySchemes['bearer']).toBeDefined();
    expect(document.components.securitySchemes['bearer']['type']).toBe('apiKey');

    expect(document.paths['/testMethod']).toBeTruthy();
    expect(document.paths['/testMethod'].get).toBeDefined();

    const path = document.paths['/testMethod'];

    expect(path.get.operationId).toBe('GET_/testMethod');
    expect(path.get.security).toBeDefined();
    expect(path.get.security.length).toBe(1);
    expect(path.get.security[0]['bearer']).toBeDefined();
  });
});
