/**
 * Classifies config paths whose values should be redacted from UI/API output.
 *
 * This intentionally works from path labels, not schema nodes, so plugin-owned
 * fields and raw local-service env vars get the same conservative treatment.
 */
export declare function isSensitiveConfigPath(path: string): boolean;
