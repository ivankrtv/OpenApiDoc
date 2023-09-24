import { OpenAPI } from '@fosfad/openapi-typescript-definitions/3.1.0';
import { EventOperationParams, OperationManager } from './OperationManager';

export class EventsManager {
  private readonly openApiState: OpenAPI;
  private readonly operationManager: OperationManager;

  constructor(openApiState: OpenAPI) {
    this.openApiState = openApiState;
    this.operationManager = new OperationManager(this.openApiState, []);
  }

  addApiEvent(params: EventOperationParams): void {
    const operation = this.operationManager.createEventOperation(params);

    if (this.openApiState.webhooks[params.event] !== undefined) {
      throw new Error(`Event ${params.event} is already exist`);
    }

    this.openApiState.webhooks[params.event] = { get: operation };
  }
}
