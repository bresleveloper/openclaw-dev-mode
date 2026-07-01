/** Flatten string-only text block content arrays into newline-joined strings. */
export declare function flattenCompletionMessagesToStringContent(messages: unknown[]): unknown[];
/** Strip completion messages to role/content fields for strict providers. */
export declare function stripCompletionMessagesToRoleContent(messages: unknown[]): unknown[];
