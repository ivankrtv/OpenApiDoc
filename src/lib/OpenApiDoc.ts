import { Info, OpenAPI, SecurityScheme, Tag } from '@fosfad/openapi-typescript-definitions/3.1.0';
import { Controller } from "./Controller";
import * as fs from "fs";

export type OpenAPIDocConfig = Info & {
  /**
   * Use description from external file in md format, in field expected path to file with description
   */
  additionalDescription?: string
}

export type TagGroup = { name: string; tags: string[] };

export class OpenApiDoc {
  private openApi: OpenAPI & { 'x-tagGroups': Array<{ name: string; tags: string[] }> };
  private externalDescriptionPath: string;

  constructor(config: OpenAPIDocConfig) {
    const { additionalDescription, ...info } = config;

    this.openApi = {
      openapi: '3.1.0',
      info: info,
      paths: {},
      tags: [],
      components: {
        schemas: {},
      },
      'x-tagGroups': [],
    }
    this.openApi.info = info;
    this.externalDescriptionPath = additionalDescription;
  }

  createController(prefix?: string, defaultTags?: Tag[]): Controller {
    return new Controller(this.openApi, prefix, defaultTags);
  }

  createTag(name: string, description?: string): Tag {
    const newTag: Tag = {
      name: name,
      description: description,
    }
    this.openApi.tags.push(newTag);
    return newTag;
  }

  addTagGroup(name: string, tags: Tag[]): void {
    if (this.openApi['x-tagGroups'] === undefined) {
      this.openApi['x-tagGroups'] = [];
    }
    const newTagGroup: TagGroup = {
      name: name,
      tags: tags.map((tag: Tag) => tag.name),
    }
    this.openApi['x-tagGroups'].push(newTagGroup);
  }

  setAuthorization(security: { [key: string]: SecurityScheme; }): void {
    this.openApi.components.securitySchemes = security;
  }

  compileOpenApi(): OpenAPI {
    if (this.externalDescriptionPath !== undefined) {
      this.addExternalDescription();
    }
    return this.openApi as OpenAPI;
  }

  // ------ private methods ------------

  private addExternalDescription(): void {
    const externalDescription = fs.readFileSync(this.externalDescriptionPath).toString().trim();
    if (this.openApi.info.description === undefined) {
      this.openApi.info.description = '';
    }
    this.openApi.info.description += '\n\n';
    this.openApi.info.description += externalDescription;
  }
}