/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
export declare function configureAcpErrorRedactor(redactor: ((value: string) => string) | undefined): void;
/** Redacts common provider, GitHub, HTTP, payment, bot, and private-key secrets from error text. */
export declare function redactSensitiveText(value: string): string;
/**
 * Render a non-Error `cause` value without leaking `[object Object]` or throwing
 * while formatting nested ACP runtime failures.
 */
export declare function stringifyNonErrorCause(value: unknown): string;
