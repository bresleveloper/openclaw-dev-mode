/**
 * Channel binding route resolver.
 *
 * Applies configured and runtime conversation bindings to agent route resolution.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ConversationRef, type SessionBindingRecord } from "../../infra/outbound/session-binding-service.js";
import type { ResolvedAgentRoute } from "../../routing/resolve-route.js";
import type { ConfiguredBindingResolution } from "./binding-types.js";
/**
 * Route resolution after applying a configured channel binding.
 */
export type ConfiguredBindingRouteResult = {
    bindingResolution: ConfiguredBindingResolution | null;
    route: ResolvedAgentRoute;
    boundSessionKey?: string;
    boundAgentId?: string;
};
/**
 * Route resolution after applying a runtime conversation binding record.
 */
export type RuntimeConversationBindingRouteResult = {
    bindingRecord: SessionBindingRecord | null;
    route: ResolvedAgentRoute;
    boundSessionKey?: string;
    boundAgentId?: string;
};
type ConfiguredBindingRouteConversationInput = {
    conversation: ConversationRef;
} | {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
};
/**
 * Rewrites an agent route when the current conversation matches a configured binding.
 */
export declare function resolveConfiguredBindingRoute(params: {
    cfg: OpenClawConfig;
    route: ResolvedAgentRoute;
} & ConfiguredBindingRouteConversationInput): ConfiguredBindingRouteResult;
/**
 * Rewrites an agent route using a persisted runtime conversation binding, when applicable.
 */
export declare function resolveRuntimeConversationBindingRoute(params: {
    route: ResolvedAgentRoute;
} & ConfiguredBindingRouteConversationInput): RuntimeConversationBindingRouteResult;
/**
 * Ensures a configured binding target is ready without blocking route resolution indefinitely.
 */
export declare function ensureConfiguredBindingRouteReady(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
export {};
