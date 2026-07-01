/** Resolves agent runtime metadata from model/provider policy and ACP session overlays. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type AgentRuntimeMetadata } from "./acp-runtime-overlay.js";
/** Resolves the runtime id/source that should be reported for a model-backed agent session. */
export declare function resolveModelAgentRuntimeMetadata(params: {
    cfg: OpenClawConfig;
    agentId: string;
    provider?: string;
    model?: string;
    sessionKey?: string;
    /**
     * True when the loaded session entry has persisted ACP metadata. ACP-shaped
     * keys without this marker can be bridge sessions that use the configured
     * model/runtime.
     */
    acpRuntime?: boolean;
    /**
     * The ACP backend identifier stored on the session entry (`entry.acp.backend`).
     * When provided for an ACP-keyed session, the overlay reports this value as the
     * runtime id instead of the generic fallback "acpx", so sessions backed by a
     * non-default registered ACP backend are classified correctly.
     */
    acpBackend?: string;
}): AgentRuntimeMetadata;
