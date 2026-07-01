type DiagnosticErrorFailureKind = "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
/** Returns a low-cardinality error category without trusting mutable `Error.name`. */
export declare function diagnosticErrorCategory(err: unknown): string;
/** Extracts a safe HTTP status code from own `status` or `statusCode` data properties. */
export declare function diagnosticHttpStatusCode(err: unknown): string | undefined;
/** Classifies transport-style failures without exposing raw error messages. */
export declare function diagnosticErrorFailureKind(err: unknown): DiagnosticErrorFailureKind | undefined;
/** Extracts and hashes bounded provider request ids so diagnostics never expose raw ids. */
export declare function diagnosticProviderRequestIdHash(err: unknown): string | undefined;
export {};
