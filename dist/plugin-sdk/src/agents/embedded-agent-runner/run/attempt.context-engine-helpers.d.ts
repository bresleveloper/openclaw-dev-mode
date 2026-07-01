/**
 * Bridges attempt bootstrap/history data to context-engine prompt-cache helpers.
 */
import type { ContextEngine } from "../../../context-engine/types.js";
import type { AssistantMessage } from "../../../llm/types.js";
import type { BootstrapMode } from "../../bootstrap-mode.js";
import type { AgentMessage } from "../../runtime/index.js";
import { type NormalizedUsage } from "../../usage.js";
import type { PromptCacheChange } from "../prompt-cache-observability.js";
import type { EmbeddedRunAttemptResult } from "./types.js";
export { assembleHarnessContextEngine as assembleAttemptContextEngine, bootstrapHarnessContextEngine as runAttemptContextEngineBootstrap, finalizeHarnessContextEngineTurn as finalizeAttemptContextEngineTurn, } from "../../harness/context-engine-lifecycle.js";
export type AttemptContextEngine = ContextEngine;
type AttemptBootstrapContext<TBootstrapFile = unknown, TContextFile = unknown> = {
    bootstrapFiles: TBootstrapFile[];
    contextFiles: TContextFile[];
};
/**
 * Resolves bootstrap/context files for this attempt and reports whether the
 * caller should persist a completed bootstrap marker. Continuation-skip mode
 * intentionally suppresses reinjection after a full bootstrap turn has already
 * been recorded for the session.
 */
export declare function resolveAttemptBootstrapContext<TBootstrapFile, TContextFile>(params: {
    contextInjectionMode: "always" | "continuation-skip" | "never";
    bootstrapContextMode?: string;
    bootstrapContextRunKind?: string;
    bootstrapMode?: BootstrapMode;
    sessionFile: string;
    hasCompletedBootstrapTurn: (sessionFile: string) => Promise<boolean>;
    resolveBootstrapContextForRun: () => Promise<AttemptBootstrapContext<TBootstrapFile, TContextFile>>;
}): Promise<AttemptBootstrapContext<TBootstrapFile, TContextFile> & {
    isContinuationTurn: boolean;
    shouldRecordCompletedBootstrapTurn: boolean;
}>;
/**
 * Builds the compact prompt-cache metadata stored on an attempt result. Empty
 * inputs return undefined so callers do not serialize meaningless cache fields.
 */
export declare function buildContextEnginePromptCacheInfo(params: {
    retention?: "none" | "short" | "long";
    lastCallUsage?: NormalizedUsage;
    observation?: {
        broke: boolean;
        previousCacheRead?: number;
        cacheRead?: number;
        changes?: PromptCacheChange[] | null;
    } | undefined;
    lastCacheTouchAt?: number | null;
}): EmbeddedRunAttemptResult["promptCache"];
/**
 * Finds the assistant message produced by the current attempt, ignoring
 * historical messages that were present before prompt submission.
 */
export declare function findCurrentAttemptAssistantMessage(params: {
    messagesSnapshot: AgentMessage[];
    prePromptMessageCount: number;
}): AssistantMessage | undefined;
/**
 * Resolves the effective prompt-cache touch timestamp for the current assistant
 * turn. Cache-read/write usage is required before an assistant timestamp can
 * advance the touch time; otherwise the previous touch is carried forward.
 */
export declare function resolvePromptCacheTouchTimestamp(params: {
    lastCallUsage?: NormalizedUsage;
    assistantTimestamp?: unknown;
    fallbackLastCacheTouchAt?: number | null;
}): number | null;
/**
 * Derives prompt-cache metadata from the loop transcript snapshot after a model
 * attempt finishes. It combines the current attempt assistant usage with the
 * carried-forward touch timestamp from earlier attempts.
 */
export declare function buildLoopPromptCacheInfo(params: {
    messagesSnapshot: AgentMessage[];
    prePromptMessageCount: number;
    retention?: "none" | "short" | "long";
    fallbackLastCacheTouchAt?: number | null;
}): EmbeddedRunAttemptResult["promptCache"];
