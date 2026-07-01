/**
 * Activates and injects OpenAI/Codex native web-search tools when config,
 * model API, and auth state allow it.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type CodexNativeSearchMode } from "./codex-native-web-search.shared.js";
import type { SandboxToolPolicy } from "./sandbox.js";
import { type WebSearchToolPolicyParams } from "./web-search-tool-policy.js";
type CodexNativeSearchActivation = {
    globalWebSearchEnabled: boolean;
    codexNativeEnabled: boolean;
    codexMode: CodexNativeSearchMode;
    nativeEligible: boolean;
    hasRequiredAuth: boolean;
    state: "managed_only" | "native_active";
    inactiveReason?: "globally_disabled" | "codex_not_enabled" | "model_not_eligible" | "codex_auth_missing" | "tool_policy_denied";
};
type CodexNativeSearchPayloadPatchResult = {
    status: "payload_not_object" | "native_tool_already_present" | "injected";
};
export type NativeWebSearchToolPolicyParams = WebSearchToolPolicyParams;
/** Returns whether a model API can accept the native Codex web_search tool. */
export declare function isCodexNativeSearchEligibleModel(params: {
    modelProvider?: string;
    modelApi?: string;
}): boolean;
/** Checks whether OpenAI/Codex auth is available for native web search. */
export declare function hasAvailableCodexAuth(params: {
    config?: OpenClawConfig;
    agentDir?: string;
}): boolean;
/** Resolves whether native search is active or why managed search should remain. */
export declare function resolveCodexNativeSearchActivation(params: {
    config?: OpenClawConfig;
    modelProvider?: string;
    modelApi?: string;
    modelId?: string;
    agentId?: string;
    sessionKey?: string;
    sandboxToolPolicy?: SandboxToolPolicy;
    messageProvider?: string;
    agentAccountId?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    spawnedBy?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
    agentDir?: string;
}): CodexNativeSearchActivation;
export declare function isNativeWebSearchAllowedByToolPolicy(params: NativeWebSearchToolPolicyParams): boolean;
/** Builds the OpenAI Responses `web_search` tool payload from config. */
export declare function buildCodexNativeWebSearchTool(config: OpenClawConfig | undefined): Record<string, unknown>;
/** Injects a native Codex web-search tool into a mutable provider payload. */
export declare function patchCodexNativeWebSearchPayload(params: {
    payload: unknown;
    config?: OpenClawConfig;
}): CodexNativeSearchPayloadPatchResult;
/** Returns whether the managed OpenClaw web-search tool should be hidden. */
export declare function shouldSuppressManagedWebSearchTool(params: {
    config?: OpenClawConfig;
    modelProvider?: string;
    modelApi?: string;
    modelId?: string;
    agentId?: string;
    sessionKey?: string;
    sandboxToolPolicy?: SandboxToolPolicy;
    messageProvider?: string;
    agentAccountId?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    spawnedBy?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
    agentDir?: string;
}): boolean;
export {};
