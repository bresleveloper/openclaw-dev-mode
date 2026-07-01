/** Hook session sources that carry untrusted external content into agent prompts. */
export type HookExternalContentSource = "gmail" | "webhook";
/**
 * Resolve a hook session key into its external content source.
 * Unknown `hook:*` sessions are treated as webhooks so legacy/custom hooks stay wrapped.
 */
export declare function resolveHookExternalContentSource(sessionKey: string): HookExternalContentSource | undefined;
/** Map hook session provenance to the prompt-facing external content source label. */
export declare function mapHookExternalContentSource(source: HookExternalContentSource): "email" | "webhook";
/** Return true when a session key should receive external-content prompt wrapping. */
export declare function isExternalHookSession(sessionKey: string): boolean;
