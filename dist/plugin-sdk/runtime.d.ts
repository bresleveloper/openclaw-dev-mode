import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime, t as OutputRuntimeEnv } from "../runtime-DlqUc5_p.js";
import { n as resolveRuntimeEnv, t as createLoggerBackedRuntime } from "../runtime-logger.internal-Dlpp6FcE.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-CGRXXrIP.js";
//#region src/cli/command-secret-gateway.d.ts
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
export declare function resolveCommandSecretRefsViaGateway(params: {
  config: OpenClawConfig;
  commandName: string;
  targetIds: Set<string>;
  agentId?: string;
  mode?: CommandSecretResolutionModeInput;
  allowedPaths?: ReadonlySet<string>;
  forcedActivePaths?: ReadonlySet<string>;
  optionalActivePaths?: ReadonlySet<string>;
  allowLocalExecSecretRefs?: boolean;
  scrubUnresolvedSecretRefs?: boolean;
  gatewaySecretResolveTimeoutMs?: number;
}): Promise<ResolveCommandSecretsResult>;
//#endregion
//#region src/cli/command-secret-targets.d.ts
/** All registered channel secret targets, regardless of current config. */
export declare function getChannelsCommandSecretTargetIds(): Set<string>;
//#endregion
export { type OutputRuntimeEnv, type RuntimeEnv, createLoggerBackedRuntime, createNonExitingRuntime, defaultRuntime, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resolveRuntimeEnv, waitForAbortSignal };