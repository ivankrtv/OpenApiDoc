export const ModelDescription = (description: string): ClassDecorator => {
  return <TFunction extends Function>(target: TFunction): void => {
    Reflect.defineMetadata('API_DOC_SCHEMA_DESCRIPTION', description, target);
  }
}