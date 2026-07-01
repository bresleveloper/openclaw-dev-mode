interface SessionCwdSource {
    getCwd(): string;
    getSessionFile(): string | undefined;
}
/** Throws when a persisted session cwd is missing and the caller does not handle prompts. */
export declare function assertSessionCwdExists(sessionManager: SessionCwdSource, fallbackCwd: string): void;
export {};
