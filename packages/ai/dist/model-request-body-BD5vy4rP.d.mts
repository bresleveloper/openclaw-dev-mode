//#region packages/ai/src/transports/model-request-body.d.ts
type EncodedModelRequestBody = {
  body: Uint8Array<ArrayBuffer>;
  stream: boolean;
};
type ModelRequestBodyState = {
  enabled?: boolean;
  encode?: (payload: unknown) => Promise<EncodedModelRequestBody>;
  onEncoded?: (body: Blob, payload: unknown) => void;
  onBytes?: (bytes: number) => void;
};
/** Call-local state survives option spreads; no payload is cached across requests. */
declare function modelRequestBodyState(options: object, inheritFrom?: object): ModelRequestBodyState;
declare function serializeModelRequestBody(payload: unknown, onSerializedPayload?: (payload: unknown) => void): EncodedModelRequestBody;
declare function encodedModelRequestBodyStream(body: unknown): boolean | undefined;
//#endregion
export { modelRequestBodyState as n, serializeModelRequestBody as r, encodedModelRequestBodyStream as t };