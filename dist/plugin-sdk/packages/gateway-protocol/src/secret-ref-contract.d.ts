/** Canonical id for file secret providers that expose exactly one value. */
export declare const SINGLE_VALUE_FILE_REF_ID = "value";
/** Shared alias grammar for env/file/exec secret provider names. */
export declare const SECRET_PROVIDER_ALIAS_PATTERN: RegExp;
/** JSON-schema fragment that rejects absolute file secret ref ids. */
export declare const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
export declare const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
export declare const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
