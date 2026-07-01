import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ConfiguredAcpBindingSpec, type ResolvedConfiguredAcpBinding } from "./persistent-bindings.types.js";
/** Resolves a configured ACP binding for a concrete channel conversation. */
export declare function resolveConfiguredAcpBindingRecord(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
}): ResolvedConfiguredAcpBinding | null;
/** Resolves the configured ACP binding spec that owns a generated session key. */
export declare function resolveConfiguredAcpBindingSpecBySessionKey(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
}): ConfiguredAcpBindingSpec | null;
