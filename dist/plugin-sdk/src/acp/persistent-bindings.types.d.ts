import type { AcpRuntimeSessionMode } from "@openclaw/acp-core/runtime/types";
import type { ChannelId } from "../channels/plugins/types.public.js";
import type { SessionBindingRecord } from "../infra/outbound/session-binding-service.js";
export { normalizeText } from "@openclaw/acp-core/normalize-text";
export type ConfiguredAcpBindingChannel = ChannelId;
/** Normalized configured binding that maps one channel conversation to one ACP session. */
export type ConfiguredAcpBindingSpec = {
    channel: ConfiguredAcpBindingChannel;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    /** Owning OpenClaw agent id (used for session identity/storage). */
    agentId: string;
    /** ACP harness agent id override (falls back to agentId when omitted). */
    acpAgentId?: string;
    mode: AcpRuntimeSessionMode;
    cwd?: string;
    backend?: string;
    label?: string;
};
export type ResolvedConfiguredAcpBinding = {
    spec: ConfiguredAcpBindingSpec;
    record: SessionBindingRecord;
};
type AcpBindingConfigShape = {
    mode?: string;
    cwd?: string;
    backend?: string;
    label?: string;
};
/** Normalizes binding mode, defaulting to persistent sessions. */
export declare function normalizeMode(value: unknown): AcpRuntimeSessionMode;
/** Extracts supported ACP binding config keys from unknown plugin config. */
export declare function normalizeBindingConfig(raw: unknown): AcpBindingConfigShape;
/** Builds the stable generated ACP session key for a configured binding. */
export declare function buildConfiguredAcpSessionKey(spec: ConfiguredAcpBindingSpec): string;
/** Converts a configured ACP binding spec into an outbound session binding record. */
export declare function toConfiguredAcpBindingRecord(spec: ConfiguredAcpBindingSpec): SessionBindingRecord;
/** Parses generated configured-binding session keys back to channel/account identity. */
export declare function parseConfiguredAcpSessionKey(sessionKey: string): {
    channel: ConfiguredAcpBindingChannel;
    accountId: string;
} | null;
export declare function resolveConfiguredAcpBindingSpecFromRecord(record: SessionBindingRecord): ConfiguredAcpBindingSpec | null;
export declare function toResolvedConfiguredAcpBinding(record: SessionBindingRecord): ResolvedConfiguredAcpBinding | null;
