import { type VerboseLevel } from "../auto-reply/thinking.js";
import type { CliDeps } from "../cli/deps.types.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type RuntimeEnv } from "../runtime.js";
import { resolveAgentRuntimeConfig } from "./agent-runtime-config.js";
import type { AgentCommandIngressOpts, AgentCommandOpts } from "./command/types.js";
declare function resolveExplicitAgentCommandSessionKey(params: {
    rawExplicitSessionKey?: string;
    agentIdOverride?: string;
    shouldScopeDefaultAgentKey?: boolean;
    cfg: OpenClawConfig;
}): string | undefined;
declare function prepareAgentCommandExecution(opts: AgentCommandOpts, runtime: RuntimeEnv): Promise<{
    opts: AgentCommandOpts;
    body: string;
    transcriptBody: string;
    cfg: OpenClawConfig;
    configuredThinkingCatalog: import("./model-catalog.types.ts").ModelCatalogEntry[];
    normalizedSpawned: {
        spawnedBy?: string;
        groupId?: string;
        groupChannel?: string;
        groupSpace?: string;
        workspaceDir?: string;
    };
    agentCfg: import("../config/types.agent-defaults.ts").AgentDefaultsConfig | undefined;
    thinkOverride: import("../auto-reply/thinking.shared.ts").ThinkLevel | undefined;
    thinkOnce: import("../auto-reply/thinking.shared.ts").ThinkLevel | undefined;
    verboseOverride: VerboseLevel | undefined;
    timeoutMs: number;
    runTimeoutOverrideMs: number | undefined;
    sessionId: string;
    sessionKey: string | undefined;
    sessionEntry: SessionEntry | undefined;
    sessionStore: Record<string, SessionEntry> | undefined;
    storePath: string;
    isNewSession: boolean;
    persistedThinking: import("../auto-reply/thinking.shared.ts").ThinkLevel | undefined;
    persistedVerbose: VerboseLevel | undefined;
    sessionAgentId: string;
    outboundSession: import("../infra/outbound/session-context.js").OutboundSessionContext | undefined;
    workspaceDir: string;
    cwd: string | undefined;
    agentDir: string;
    pluginsEnabled: boolean;
    manifestMetadataSnapshot: import("../plugins/plugin-metadata-snapshot.types.ts").PluginMetadataSnapshot | undefined;
    modelManifestContext: {
        manifestPlugins: readonly import("../plugins/manifest-registry.ts").PluginManifestRecord[];
    };
    runId: string;
    isSubagentLane: boolean;
    acpManager: import("../acp/control-plane/manager.core.ts").AcpSessionManager;
    acpResolution: import("../acp/control-plane/manager.types.ts").AcpSessionResolution | null;
}>;
/** Runs an agent turn from CLI/runtime options against the resolved session and model policy. */
export declare function agentCommand(opts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: ReturnType<typeof import("../infra/outbound/payloads.ts").projectOutboundPayloadPlanForJson>;
    meta: import("./embedded-agent.ts").EmbeddedAgentRunMeta & import("./command/types.js").AgentCommandResultMetaOverrides;
    didSendViaMessagingTool?: boolean;
    messagingToolSentTexts?: string[];
    messagingToolSentMediaUrls?: string[];
    messagingToolSentTargets?: import("./embedded-agent-messaging.types.ts").MessagingToolSend[];
    deliverySucceeded?: boolean;
    deliveryStatus?: {
        requested: true;
        attempted: boolean;
        status: "sent" | "suppressed" | "partial_failed" | "failed";
        succeeded: true | false | "partial";
        error?: true;
        errorMessage?: string;
        reason?: string;
        resultCount?: number;
        sentBeforeError?: true;
        payloadOutcomes?: {
            index: number;
            status: "failed" | "sent" | "suppressed";
            reason?: string;
            resultCount?: number;
            sentBeforeError?: boolean;
            stage?: string;
            error?: string;
            hookEffect?: {
                cancelReason?: string;
                metadata?: Record<string, unknown>;
            };
        }[];
    };
}>;
/** Runs an agent turn from an inbound channel/gateway ingress context. */
export declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: ReturnType<typeof import("../infra/outbound/payloads.ts").projectOutboundPayloadPlanForJson>;
    meta: import("./embedded-agent.ts").EmbeddedAgentRunMeta & import("./command/types.js").AgentCommandResultMetaOverrides;
    didSendViaMessagingTool?: boolean;
    messagingToolSentTexts?: string[];
    messagingToolSentMediaUrls?: string[];
    messagingToolSentTargets?: import("./embedded-agent-messaging.types.ts").MessagingToolSend[];
    deliverySucceeded?: boolean;
    deliveryStatus?: {
        requested: true;
        attempted: boolean;
        status: "sent" | "suppressed" | "partial_failed" | "failed";
        succeeded: true | false | "partial";
        error?: true;
        errorMessage?: string;
        reason?: string;
        resultCount?: number;
        sentBeforeError?: true;
        payloadOutcomes?: {
            index: number;
            status: "failed" | "sent" | "suppressed";
            reason?: string;
            resultCount?: number;
            sentBeforeError?: boolean;
            stage?: string;
            error?: string;
            hookEffect?: {
                cancelReason?: string;
                metadata?: Record<string, unknown>;
            };
        }[];
    };
}>;
export declare const testing: {
    resolveAgentRuntimeConfig: typeof resolveAgentRuntimeConfig;
    prepareAgentCommandExecution: typeof prepareAgentCommandExecution;
    resolveExplicitAgentCommandSessionKey: typeof resolveExplicitAgentCommandSessionKey;
};
/** @deprecated Use `testing`. */
export { testing as __testing };
