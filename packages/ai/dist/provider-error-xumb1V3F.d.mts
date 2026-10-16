//#region packages/ai/src/utils/provider-error.d.ts
type ProviderErrorProjection = {
  stopReason: "aborted" | "error";
  errorMessage: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
};
type ProviderErrorRedactor = (value: unknown) => unknown;
declare function configureProviderErrorRedactor(redactor: ProviderErrorRedactor | undefined): ProviderErrorRedactor | undefined;
/** Projects one hostile provider throw into final, bounded assistant terminal fields. */
declare function projectProviderError(error: unknown, signal?: AbortSignal): ProviderErrorProjection;
//#endregion
export { projectProviderError as i, ProviderErrorRedactor as n, configureProviderErrorRedactor as r, ProviderErrorProjection as t };