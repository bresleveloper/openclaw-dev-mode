/**
 * Builds sandbox/full-access status metadata for embedded-agent run results.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ExecElevatedDefaults, ExecToolDefaults } from "../bash-tools.js";
import type { resolveSandboxContext } from "../sandbox.js";
import type { EmbeddedFullAccessBlockedReason, EmbeddedSandboxInfo } from "./types.js";
/**
 * Resolves the sandbox/elevated-exec facts exposed to embedded agent results.
 *
 * This keeps host policy, per-agent exec defaults, and sandbox runtime state in one place so
 * channel/status consumers do not infer full-access availability from partial config fields.
 */
type EmbeddedFullAccessExecPolicy = Pick<ExecToolDefaults, "mode" | "security" | "ask">;
type EmbeddedFullAccessHostPolicy = Pick<ExecToolDefaults, "security" | "ask">;
type EmbeddedSandboxInfoExecOverrides = Pick<ExecToolDefaults, "host" | "security" | "ask" | "node">;
/** Computes whether elevated exec can provide full host access for an embedded turn. */
export declare function resolveEmbeddedFullAccessState(params: {
    execElevated?: ExecElevatedDefaults;
    execPolicy?: EmbeddedFullAccessExecPolicy;
    hostPolicy?: EmbeddedFullAccessHostPolicy;
}): {
    available: boolean;
    blockedReason?: EmbeddedFullAccessBlockedReason;
};
/** Resolves the effective exec policy for sandbox-info reporting. */
export declare function resolveEmbeddedSandboxInfoExecPolicy(params: {
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    sandboxAvailable?: boolean;
    execOverrides?: EmbeddedSandboxInfoExecOverrides;
}): EmbeddedFullAccessExecPolicy;
/** Builds the serializable sandbox metadata attached to embedded agent run results. */
export declare function buildEmbeddedSandboxInfo(sandbox?: Awaited<ReturnType<typeof resolveSandboxContext>>, execElevated?: ExecElevatedDefaults, execPolicy?: EmbeddedFullAccessExecPolicy, hostPolicy?: EmbeddedFullAccessHostPolicy): EmbeddedSandboxInfo | undefined;
export {};
