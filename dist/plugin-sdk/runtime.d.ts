import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime, t as OutputRuntimeEnv } from "../runtime-C7vMCRi6.js";
import { t as PluginServiceSchedulerV1 } from "../service-scheduler.types-CvTX8qsX.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-D3oSvOwT.js";
import { n as resolveRuntimeEnv, t as createLoggerBackedRuntime } from "../runtime-logger.internal-BYGSeHkU.js";
type ResolveCommandSecretsResult = {
  resolvedConfig: OpenClawConfig;
  diagnostics: string[];
  targetStatesByPath: Record<string, CommandSecretTargetState>;
  hadUnresolvedTargets: boolean;
};
type CommandSecretResolutionMode = "enforce_resolved" | "read_only_status" | "read_only_operational";
type LegacyCommandSecretResolutionMode = "strict" | "summary" | "operational_readonly";
type CommandSecretResolutionModeInput = CommandSecretResolutionMode | LegacyCommandSecretResolutionMode;
type CommandSecretTargetState = "resolved_gateway" | "resolved_local" | "inactive_surface" | "unresolved";
type CommandSecretScope = {
  config: OpenClawConfig;
  commandName: string;
  targetIds: Set<string>;
  agentId?: string;
  allowedPaths?: ReadonlySet<string>;
  forcedActivePaths?: ReadonlySet<string>;
  optionalActivePaths?: ReadonlySet<string>;
};
export declare function resolveCommandSecretRefsViaGateway(params: CommandSecretScope & {
  mode?: CommandSecretResolutionModeInput;
  allowLocalExecSecretRefs?: boolean;
  scrubUnresolvedSecretRefs?: boolean;
  gatewaySecretResolveTimeoutMs?: number;
}): Promise<ResolveCommandSecretsResult>;
/** All registered channel secret targets, regardless of current config. */
export declare function getChannelsCommandSecretTargetIds(): Set<string>;
/** Published factories borrow their caller's admitted lifetime; no process owner is inferred. */
export declare function resolvePluginServiceScheduler(scheduler?: PluginServiceSchedulerV1): PluginServiceSchedulerV1;
export { type OutputRuntimeEnv, type RuntimeEnv, createLoggerBackedRuntime, createNonExitingRuntime, defaultRuntime, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resolveRuntimeEnv, waitForAbortSignal };