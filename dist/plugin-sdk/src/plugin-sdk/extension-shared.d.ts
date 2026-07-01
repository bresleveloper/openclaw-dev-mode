import type { z } from "zod";
import type { OpenClawConfig } from "../config/config.js";
import { createLoggerBackedRuntime } from "./runtime-logger.js";
export { safeParseJsonWithSchema, safeParseWithSchema } from "../utils/zod-parse.js";
export { buildTimeoutAbortSignal } from "../utils/fetch-timeout.js";
type PassiveChannelStatusSnapshot = {
    configured?: boolean;
    running?: boolean;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
    probe?: unknown;
    lastProbeAt?: number | null;
};
type TrafficStatusSnapshot = {
    lastInboundAt?: number | null;
    lastOutboundAt?: number | null;
};
type StoppableMonitor = {
    stop: () => void;
};
type RequireOpenAllowFromFn = (params: {
    policy?: string;
    allowFrom?: Array<string | number>;
    ctx: z.RefinementCtx;
    path: Array<string | number>;
    message: string;
}) => void;
/**
 * Builds the standard passive-channel status object used by plugin status surfaces.
 * Missing lifecycle fields are normalized to stable defaults so callers can merge
 * plugin-specific extras without leaking `undefined` into status responses.
 */
export declare function buildPassiveChannelStatusSummary<TExtra extends object>(snapshot: PassiveChannelStatusSnapshot, extra?: TExtra): {
    configured: boolean;
} & TExtra & {
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
};
/** Adds probe state to the standard passive-channel status summary. */
export declare function buildPassiveProbedChannelStatusSummary<TExtra extends object>(snapshot: PassiveChannelStatusSnapshot, extra?: TExtra): {
    configured: boolean;
} & TExtra & {
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
    probe: unknown;
    lastProbeAt: number | null;
};
/** Normalizes optional traffic timestamps for channel status payloads. */
export declare function buildTrafficStatusSummary(snapshot?: TrafficStatusSnapshot | null): {
    lastInboundAt: number | null;
    lastOutboundAt: number | null;
};
/**
 * Runs a passive monitor until the supplied abort signal fires, then calls `stop()`.
 * This adapts simple plugin monitors to the shared passive account lifecycle.
 */
export declare function runStoppablePassiveMonitor<TMonitor extends StoppableMonitor>(params: {
    abortSignal: AbortSignal;
    start: () => Promise<TMonitor>;
}): Promise<void>;
/**
 * Returns the provided runtime or creates a logger-backed fallback for monitor-only paths.
 * The fallback cannot exit the process, so command/runtime callers should inject a real runtime.
 */
export declare function resolveLoggerBackedRuntime<TRuntime>(runtime: TRuntime | undefined, logger: Parameters<typeof createLoggerBackedRuntime>[0]["logger"]): TRuntime;
/** Applies the shared validation rule for open DM policies that require wildcard allowlists. */
export declare function requireChannelOpenAllowFrom(params: {
    channel: string;
    policy?: string;
    allowFrom?: Array<string | number>;
    ctx: z.RefinementCtx;
    requireOpenAllowFrom: RequireOpenAllowFromFn;
}): void;
/** Extracts a fixed set of fields from unknown status issue payloads without trusting shape. */
export declare function readStatusIssueFields<TField extends string>(value: unknown, fields: readonly TField[]): Record<TField, unknown> | null;
/** Converts string or numeric account identifiers from status issue payloads to strings. */
export declare function coerceStatusIssueAccountId(value: unknown): string | undefined;
/** Creates a promise with externally controlled resolve/reject hooks for async handoff code. */
export declare function createDeferred<T>(): {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};
type PackageJsonRequire = (id: string) => unknown;
type PluginConfigIssuePathSegment = string | number;
type PluginConfigIssue = {
    path: PluginConfigIssuePathSegment[];
    message: string;
};
type PluginConfigIssueMessageOptions = {
    invalidConfigMessage?: string;
    unknownKeyMessage?: (key: string) => string;
    rootInvalidTypeMessage?: string;
};
/** Formats Zod plugin-config issues into stable user-facing status messages. */
export declare function formatPluginConfigIssue(issue: z.ZodIssue | undefined, options?: PluginConfigIssueMessageOptions): string;
/** Keeps only string/number path segments so config issue paths stay JSON-safe. */
export declare function normalizePluginConfigIssuePath(path: readonly unknown[]): PluginConfigIssuePathSegment[];
/** Converts raw Zod issues into the plugin status issue shape used by bundled channels. */
export declare function mapPluginConfigIssues(issues: readonly z.ZodIssue[], options?: PluginConfigIssueMessageOptions): PluginConfigIssue[];
/** Checks whether a read-only plugin path may resolve a secret through an env provider. */
export declare function canResolveEnvSecretRefInReadOnlyPath(params: {
    cfg?: OpenClawConfig;
    provider: string;
    id: string;
}): boolean;
/** Reads plugin package versions across source, bundled, and test layouts with a fallback. */
export declare function readPluginPackageVersion(params: {
    require: PackageJsonRequire;
    candidates?: readonly string[];
    fallback?: string;
}): string;
/**
 * Builds an ambient Node proxy agent when proxy env/config is active.
 * Managed proxy CA trust is attached when available; creation errors are reported
 * through `onError` and otherwise degrade to no agent.
 */
export declare function resolveAmbientNodeProxyAgent<TAgent>(params?: {
    onError?: (error: unknown) => void;
    onUsingProxy?: () => void;
    protocol?: "http" | "https";
}): Promise<TAgent | undefined>;
