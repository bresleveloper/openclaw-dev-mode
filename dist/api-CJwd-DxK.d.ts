//#region extensions/xai/api.d.ts
declare function isXaiModelHint(modelId: string): boolean;
declare function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): {
  api: "openai-responses";
  baseUrl?: string;
} | undefined;
declare function resolveXaiBaseUrl(baseUrlOrConfig?: unknown): string;
//#endregion
export { resolveXaiBaseUrl as n, resolveXaiTransport as r, isXaiModelHint as t };