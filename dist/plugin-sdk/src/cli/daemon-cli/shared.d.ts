import { resolveDaemonContainerContext } from "../../daemon/container-context.js";
import { formatRuntimeStatus } from "../../daemon/runtime-format.js";
import { parsePort } from "../shared/parse-port.js";
export { formatRuntimeStatus };
export { parsePort };
export { resolveDaemonContainerContext };
/** Create install action context with JSON flag normalization. */
export declare function createDaemonInstallActionContext(jsonFlag: unknown): {
    stdout: import("node:stream").Writable;
    warnings: string[];
    emit: (payload: Omit<import("./response.js").DaemonActionResponse, "action">) => void;
    fail: (message: string, hints?: string[]) => void;
    json: boolean;
};
/** Block service installation in Nix mode, where managed service install is unsupported. */
export declare function failIfNixDaemonInstallMode(fail: (message: string, hints?: string[]) => void, env?: NodeJS.ProcessEnv): boolean;
/** Build terminal style helpers for status output with no-color fallback. */
export declare function createCliStatusTextStyles(): {
    rich: boolean;
    label: (value: string) => string;
    accent: (value: string) => string;
    infoText: (value: string) => string;
    okText: (value: string) => string;
    warnText: (value: string) => string;
    errorText: (value: string) => string;
};
/** Pick the color function for a runtime status label. */
export declare function resolveRuntimeStatusColor(status: string | undefined): (value: string) => string;
/** Extract `--port` from service ProgramArguments. */
export declare function parsePortFromArgs(programArguments: string[] | undefined): number | null;
/** Pick the best local probe host for a configured Gateway bind mode. */
export declare function pickProbeHostForBind(bindMode: string, tailnetIPv4: string | undefined, customBindHost?: string): string;
/** Keep only daemon env keys safe to print in diagnostics. */
export declare function filterDaemonEnv(env: Record<string, string> | undefined): Record<string, string>;
/** Format safe daemon env entries for status output. */
export declare function safeDaemonEnv(env: Record<string, string> | undefined): string[];
/** Normalize listener address strings from platform socket tools. */
export declare function normalizeListenerAddress(raw: string): string;
/** Render platform-specific hints for missing/stopped Gateway runtimes. */
export declare function renderRuntimeHints(runtime: {
    missingUnit?: boolean;
    missingSupervision?: boolean;
    missingGuiSession?: boolean;
    status?: string;
} | undefined, env?: NodeJS.ProcessEnv, logFile?: string | null): string[];
/** Render install/start hints for the current service platform/container context. */
export declare function renderGatewayServiceStartHints(env?: NodeJS.ProcessEnv): string[];
/** Drop generic systemd hints when a container-specific hint is clearer. */
export declare function filterContainerGenericHints(hints: string[], env?: NodeJS.ProcessEnv): string[];
