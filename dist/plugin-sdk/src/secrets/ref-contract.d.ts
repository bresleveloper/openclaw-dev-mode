/** Shared SecretRef grammar and validation helpers for config, schema, SDK, and gateway parity. */
import { type SecretRef, type SecretRefSource } from "../config/types.secrets.js";
/** Shared alias grammar for env/file/exec secret provider names. */
export declare const SECRET_PROVIDER_ALIAS_PATTERN: RegExp;
/** Canonical id for file secret providers that expose exactly one value. */
export declare const SINGLE_VALUE_FILE_REF_ID = "value";
/** JSON-schema fragment that rejects absolute file secret ref ids. */
export declare const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
export declare const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
export declare const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
/** Failure class returned when an exec secret ref id is syntactically invalid. */
export type ExecSecretRefIdValidationReason = "pattern" | "traversal-segment";
/** Result for callers that need to distinguish grammar failures from traversal attempts. */
export type ExecSecretRefIdValidationResult = {
    ok: true;
} | {
    ok: false;
    reason: ExecSecretRefIdValidationReason;
};
/** Minimal config shape needed to resolve default provider aliases for a secret source. */
export type SecretRefDefaultsCarrier = {
    /** Secrets config subset; callers pass full config objects or narrow test doubles. */
    secrets?: {
        /** Explicit per-source provider aliases selected by the operator. */
        defaults?: {
            /** Default provider alias for environment-variable secret refs. */
            env?: string;
            /** Default provider alias for file-backed secret refs. */
            file?: string;
            /** Default provider alias for exec-backed secret refs. */
            exec?: string;
        };
        /** Provider declarations used only when callers ask to prefer the first matching source. */
        providers?: Record<string, {
            source?: string;
        }>;
    };
};
/** Builds the stable map key used to cache or compare resolved secret refs. */
export declare function secretRefKey(ref: SecretRef): string;
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
export declare function resolveDefaultSecretProviderAlias(config: SecretRefDefaultsCarrier, source: SecretRefSource, options?: {
    preferFirstProviderForSource?: boolean;
}): string;
/** Validates file secret ref ids against the shared JSON-pointer-style contract. */
export declare function isValidFileSecretRefId(value: string): boolean;
/** Validates a secret provider alias against the shared config/gateway grammar. */
export declare function isValidSecretProviderAlias(value: string): boolean;
/** Validates exec secret ref ids and reports why invalid ids failed. */
export declare function validateExecSecretRefId(value: string): ExecSecretRefIdValidationResult;
/** Boolean convenience wrapper for callers that only need accept/reject behavior. */
export declare function isValidExecSecretRefId(value: string): boolean;
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
export declare function isValidSecretRef(ref: SecretRef): boolean;
/** Formats the user-facing validation message for rejected exec secret ref ids. */
export declare function formatExecSecretRefIdValidationMessage(): string;
