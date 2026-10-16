import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/config.d.ts
/** Full generated config schema response. */
declare const ConfigSchemaResponseSchema: Type.TObject<{
  schema: Type.TUnknown;
  uiHints: Type.TRecord<"^.*$", Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    docsUrl: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    groups: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      title: Type.TString;
      order: Type.TOptional<Type.TInteger>;
      properties: Type.TArray<Type.TString>;
    }>>>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    presentation: Type.TOptional<Type.TLiteral<"phone-number">>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
  }>>;
  version: Type.TString;
  generatedAt: Type.TString;
}>;
type ConfigSchemaResponse = Static<typeof ConfigSchemaResponseSchema>;
//#endregion
export { ConfigSchemaResponse as t };