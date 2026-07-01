/** Context needed to redact paths and environment-derived private prefixes. */
export type SupportRedactionContext = {
    env: NodeJS.ProcessEnv;
    stateDir: string;
};
type RedactSupportStringOptions = {
    maxLength?: number;
    truncationSuffix?: string;
};
export declare function redactPathForSupport(file: string | null | undefined, options: SupportRedactionContext): string;
export declare function redactTextForSupport(value: string): string;
export declare function redactSupportString(value: string, redaction: SupportRedactionContext, options?: RedactSupportStringOptions): string;
/** Sanitizes general diagnostic snapshots while keeping bounded object/array structure. */
export declare function sanitizeSupportSnapshotValue(value: unknown, redaction: SupportRedactionContext, key?: string, depth?: number): unknown;
/** Sanitizes config-shaped values with stricter private field handling. */
export declare function sanitizeSupportConfigValue(value: unknown, redaction: SupportRedactionContext, key?: string, depth?: number): unknown;
export {};
