/** Classifies credential-bearing fields, including case-insensitive HTTP header names. */
declare function isCredentialFieldName(name: string): boolean;
type DiagnosticMediaField = {
  kind: "context";
} | {
  kind: "redacted";
  bytes?: number;
  source?: string | Uint8Array;
};
type DiagnosticProjectionPolicy = {
  maxNodes?: number;
  maxKeys?: number;
  redactCredentials?: boolean;
  omitField?: (key: string) => boolean;
  propertyScope?: "enumerable" | "error";
  projectBinary?: (binary: Uint8Array) => unknown;
  projectMedia?: (key: string, media: Extract<DiagnosticMediaField, {
    kind: "redacted";
  }>) => Record<string, unknown>;
};
declare function projectDiagnosticValue(value: unknown, policy?: DiagnosticProjectionPolicy, seen?: WeakSet<object>, mediaPayload?: boolean, state?: {
  changed: boolean;
  nodesRemaining: number;
}): unknown;
/** Internal producers transfer fresh ordinary records and dense arrays; arrays may be reused. */
declare function projectPreparedDiagnosticValue(value: unknown, policy?: DiagnosticProjectionPolicy): unknown;
export { projectPreparedDiagnosticValue as i, isCredentialFieldName as n, projectDiagnosticValue as r, DiagnosticProjectionPolicy as t };