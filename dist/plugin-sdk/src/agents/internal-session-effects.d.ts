/** Resolves the private transcript path for an internal session-effect run. */
export declare function resolveInternalSessionEffectsTranscriptPath(runId: string): string;
/** Copies or creates a private transcript for internal session-effect recovery. */
export declare function prepareInternalSessionEffectsTranscript(params: {
    sessionFile?: string;
    runId: string;
}): Promise<string>;
/** Removes an internal session-effect transcript if it is inside the owned dir. */
export declare function removeInternalSessionEffectsTranscript(sessionFile: string | undefined): Promise<void>;
