import type { OptionalBootstrapFileName } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveControlUiLinks } from "../gateway/control-ui-links.js";
import { detectBrowserOpenSupport, openUrl, resolveBrowserOpenCommand } from "../infra/browser-open.js";
import { detectBinary } from "../infra/detect-binary.js";
import type { RuntimeEnv } from "../runtime.js";
import type { NodeManagerChoice, OnboardMode, ResetScope } from "./onboard-types.js";
export { randomToken } from "./random-token.js";
export { detectBinary };
export { detectBrowserOpenSupport, openUrl, resolveBrowserOpenCommand };
export { resolveControlUiLinks };
/** Handles Clack cancellation by exiting through the runtime. */
export declare function guardCancel<T>(value: T | symbol, runtime: RuntimeEnv): T;
/** Summarizes existing config values before onboarding overwrites or reuses them. */
export declare function summarizeExistingConfig(config: OpenClawConfig): string;
/** Normalizes gateway token prompts while rejecting JS stringification sentinels. */
export declare function normalizeGatewayTokenInput(value: unknown): string;
/** Validates gateway password prompt input. */
export declare function validateGatewayPasswordInput(value: unknown): string | undefined;
/** Prints the onboarding banner. */
export declare function printWizardHeader(runtime: RuntimeEnv): void;
/** Records wizard provenance metadata on config writes. */
export declare function applyWizardMetadata(cfg: OpenClawConfig, params: {
    command: string;
    mode: OnboardMode;
}): OpenClawConfig;
/** Formats the no-GUI SSH tunnel hint for opening the Control UI remotely. */
export declare function formatControlUiSshHint(params: {
    port: number;
    basePath?: string;
    token?: string;
}): string;
/** Ensures workspace bootstrap files and session transcript directories exist. */
export declare function ensureWorkspaceAndSessions(workspaceDir: string, runtime: RuntimeEnv, options?: {
    skipBootstrap?: boolean;
    skipOptionalBootstrapFiles?: OptionalBootstrapFileName[];
    agentId?: string;
}): Promise<void>;
/** Returns package manager choices offered by onboarding. */
export declare function resolveNodeManagerOptions(): Array<{
    value: NodeManagerChoice;
    label: string;
}>;
/** Moves a path to Trash when it exists, logging a manual-delete fallback on failure. */
export declare function moveToTrash(pathname: string, runtime: RuntimeEnv): Promise<void>;
/** Deletes onboarding-managed state according to the selected reset scope. */
export declare function handleReset(scope: ResetScope, workspaceDir: string, runtime: RuntimeEnv): Promise<void>;
/** Runs a single lightweight gateway probe for onboarding readiness checks. */
export declare function probeGatewayReachable(params: {
    url: string;
    token?: string;
    password?: string;
    timeoutMs?: number;
}): Promise<{
    ok: boolean;
    detail?: string;
}>;
/** Polls gateway reachability until success or deadline. */
export declare function waitForGatewayReachable(params: {
    url: string;
    token?: string;
    password?: string;
    /** Total time to wait before giving up. */
    deadlineMs?: number;
    /** Per-probe timeout (each probe makes a full gateway health request). */
    probeTimeoutMs?: number;
    /** Delay between probes. */
    pollMs?: number;
}): Promise<{
    ok: boolean;
    detail?: string;
}>;
/** Default workspace path shown by onboarding prompts. */
export declare const DEFAULT_WORKSPACE: string;
