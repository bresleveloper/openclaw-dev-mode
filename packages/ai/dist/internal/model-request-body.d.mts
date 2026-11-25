/** Input observers may patch request settings; caller hooks still require editable input. */
export declare function markModelPayloadObserver<T extends object>(observer: T, wrapped?: object, isObserver?: () => boolean): T;
export declare function hasMutableModelPayloadHook(hook: object | undefined): boolean;
export type EncodedModelRequestBody = {
  body: Uint8Array<ArrayBuffer>;
  stream: boolean;
};
/** A slice of JSON.stringify output; only keys need decoding to inspect its shape. */
declare class ModelRequestJson {
  readonly json: string;
  constructor(json: string);
  members(): Generator<[string, ModelRequestJson]>;
  private valueEnd;
}
type ModelRequestBodyState = {
  enabled?: boolean;
  reportsBytes?: boolean;
  encode?: (payload: unknown) => Promise<EncodedModelRequestBody>;
  onBytes?: (bytes: number) => void;
};
/** Call-local state survives option spreads; no payload is cached across requests. */
export declare function modelRequestBodyState(options: object, inheritFrom?: object): ModelRequestBodyState;
/** Observe JSON fetch bodies without opting into host-owned request encoding. */
export declare function withModelRequestBodyBytes(options: object | undefined, fetch: typeof globalThis.fetch): typeof globalThis.fetch;
export declare function serializeModelRequestBody(payload: unknown, onSerializedPayload?: (payload: unknown) => void): EncodedModelRequestBody & {
  json: ModelRequestJson | undefined;
};
export declare function markEncodedModelRequestBody(body: Blob | Uint8Array, stream: boolean): void;
export declare function encodedModelRequestBodyStream(body: unknown): boolean | undefined;
/** SDK RequestOptions.body overrides encoding while the original params retain stream metadata. */
export declare function prepareModelRequestBody(options: object | undefined): (payload: unknown) => Promise<{
  body: Uint8Array<ArrayBuffer>;
  headers: {
    "content-type": string;
  };
}>;
export {};