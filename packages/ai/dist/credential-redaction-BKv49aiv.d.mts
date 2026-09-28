//#region packages/ai/src/utils/credential-redaction.d.ts
type DiagnosticMediaField = {
  kind: "context";
} | {
  kind: "redacted";
  bytes?: number;
  source?: string | Uint8Array;
};
type DiagnosticProjectionPolicy = {
  omitField?: (key: string) => boolean;
  propertyScope?: "enumerable" | "error";
  projectBinary?: (binary: Uint8Array) => unknown;
  projectMedia?: (key: string, media: Extract<DiagnosticMediaField, {
    kind: "redacted";
  }>) => Record<string, unknown>;
};
/** Fresh records need no native-object probe while their prototype stays ordinary. */
declare function createDiagnosticRecord(): Record<string, unknown>;
declare function projectDiagnosticValue(value: unknown, policy?: DiagnosticProjectionPolicy, seen?: WeakSet<object>, mediaPayload?: boolean, state?: {
  changed: boolean;
  nodesRemaining: number;
}): unknown;
//#endregion
export { createDiagnosticRecord as n, projectDiagnosticValue as r, DiagnosticProjectionPolicy as t };