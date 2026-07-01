import { completeSimple } from "../llm/stream.js";
import type { Api, Model } from "../llm/types.js";
/** Return whether live tests are enabled by standard or caller-specific env flags. */
export declare function isLiveTestEnabled(extraEnvVars?: readonly string[], env?: NodeJS.ProcessEnv): boolean;
/** Return whether live tests must prefer profile credentials over env keys. */
export declare function isLiveProfileKeyModeEnabled(env?: NodeJS.ProcessEnv): boolean;
/** Return whether a provider requires profile credentials in the current live mode. */
export declare function requiresLiveProfileCredential(provider: string, requireProfileKeys: boolean): boolean;
/** Resolve whether profile or env credentials should be tried first. */
export declare function resolveLiveCredentialPrecedence(provider: string, requireProfileKeys: boolean): "profile-first" | "env-first";
/** Build a single user-message prompt for simple live model probes. */
export declare function createSingleUserPromptMessage(content?: string): {
    role: "user";
    content: string;
    timestamp: number;
}[];
/** Extract non-empty assistant text from content blocks. */
export declare function extractNonEmptyAssistantText(content: Array<{
    type?: string;
    text?: string;
}>): string;
export type CompleteSimpleContent<TApi extends Api = Api> = Awaited<ReturnType<typeof completeSimple<TApi>>>["content"];
/** Write a namespaced live-test progress line to stderr. */
export declare function logLiveProgress(message: string): void;
/** Run completeSimple with abort and hard-timeout guards for live tests. */
export declare function completeSimpleWithTimeout<TApi extends Api>(model: Model<TApi>, context: Parameters<typeof completeSimple<TApi>>[1], options: Parameters<typeof completeSimple<TApi>>[2], timeoutMs: number): Promise<Awaited<ReturnType<typeof completeSimple<TApi>>>>;
