import { OpenAPI, Tag } from '@fosfad/openapi-typescript-definitions/3.1.0';
import { OperationManager, OperationParams } from './OperationManager';

export class Controller {
  private readonly openApiState: OpenAPI;
  private readonly prefix: string;
  private readonly defaultTags: Tag[];
  private readonly operationsManager: OperationManager;

  /**
   * @param openApi - instance of OpenApiDoc class
   * @param prefix - prefix in the endpoint path
   * @param defaultTags - default tags will be add to each method of controller
   */
  constructor(openApi: OpenAPI, prefix?: string, defaultTags?: Tag[]) {
    this.openApiState = openApi;
    this.prefix = this.getValidPrefix(prefix);
    this.defaultTags = defaultTags ?? [];
    this.operationsManager = new OperationManager(this.openApiState, this.defaultTags);
  }

  /**
   * Method create and return child controller. The Child controller's prefix would has parent Controller's prefix
   * and own prefix
   *
   * Default tags whould be added to parent Controller's default tags.
   */
  createController(prefix?: string, defaultTags?: Tag[]): Controller {
    return new Controller(this.openApiState, this.getFullPrefix(prefix), defaultTags);
  }

  /**
   * Method add new endpoint
   */
  addApiMethod(path: string, params: OperationParams): void {
    const methodPath = this.getFullPath(path);

    const operation = this.operationsManager.createOperation(path, params);

    if (params.method === 'POST') {
      if (this.openApiState.paths[methodPath]?.post !== undefined) {
        throw new Error(`Method POST is already exist in ${methodPath}`);
      }
      if (this.openApiState.paths[methodPath] !== undefined) {
        this.openApiState.paths[methodPath].post = operation;
        return;
      }
      this.openApiState.paths[methodPath] = {
        post: operation,
      };
    }
    if (params.method === 'GET') {
      if (this.openApiState.paths[methodPath]?.get !== undefined) {
        throw new Error(`Method GET is already exist in ${methodPath}`);
      }
      if (this.openApiState.paths[methodPath] !== undefined) {
        this.openApiState.paths[methodPath].get = operation;
        return;
      }
      this.openApiState.paths[methodPath] = {
        get: operation,
      };
    }
    if (params.method === 'DELETE') {
      if (this.openApiState.paths[methodPath]?.delete !== undefined) {
        throw new Error(`Method DELETE is already exist in ${methodPath}`);
      }
      if (this.openApiState.paths[methodPath] !== undefined) {
        this.openApiState.paths[methodPath].delete = operation;
        return;
      }
      this.openApiState.paths[methodPath] = {
        delete: operation,
      };
    }
    if (params.method === 'PUT') {
      if (this.openApiState.paths[methodPath]?.put !== undefined) {
        throw new Error(`Method PUT is already exist in ${methodPath}`);
      }
      if (this.openApiState.paths[methodPath] !== undefined) {
        this.openApiState.paths[methodPath].put = operation;
        return;
      }
      this.openApiState.paths[methodPath] = {
        put: operation,
      };
    }
    if (params.method === 'PATCH') {
      if (this.openApiState.paths[methodPath]?.patch !== undefined) {
        throw new Error(`Method PATCH is already exist in ${methodPath}`);
      }
      if (this.openApiState.paths[methodPath] !== undefined) {
        this.openApiState.paths[methodPath].patch = operation;
        return;
      }
      this.openApiState.paths[methodPath] = {
        patch: operation,
      };
    }
  }

  private getFullPath(path: string): string {
    if (path[0] !== '/') return this.prefix + '/' + path;
    return this.prefix + path;
  }

  private getFullPrefix(newPrefix: string): string {
    if (newPrefix[0] !== '/') return this.prefix + '/' + newPrefix;
    return this.prefix + newPrefix;
  }

  private getValidPrefix(prefix: string): string {
    if (prefix === undefined || prefix === '') return '';

    let validPrefix = prefix;

    if (validPrefix[0] !== '/') validPrefix = '/' + validPrefix;
    if (validPrefix[validPrefix.length - 1] === '/') validPrefix = validPrefix.slice(0, -1);

    return validPrefix;
  }
}
