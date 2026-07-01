import { type CompletionShell } from "../cli/completion-runtime.js";
import type { HealthFinding, HealthRepairEffect } from "../flows/health-checks.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
export type ShellCompletionStatusOptions = {
    shell?: CompletionShell;
};
export type ShellCompletionStatus = {
    shell: CompletionShell;
    profileInstalled: boolean;
    cacheExists: boolean;
    cachePath: string;
    /** True if profile uses slow dynamic pattern like `source <(openclaw completion ...)` */
    usesSlowPattern: boolean;
};
/** Check the status of shell completion for the current shell. */
export declare function checkShellCompletionStatus(binName?: string, options?: ShellCompletionStatusOptions): Promise<ShellCompletionStatus>;
/** Converts shell completion status into health findings shown by check flows. */
export declare function shellCompletionStatusToHealthFindings(status: ShellCompletionStatus): readonly HealthFinding[];
/** Converts shell completion status into dry-run repair effects for health check reporting. */
export declare function shellCompletionStatusToRepairEffects(status: ShellCompletionStatus): readonly HealthRepairEffect[];
export type DoctorCompletionOptions = {
    nonInteractive?: boolean;
};
/**
 * Repairs shell completion setup when doctor runs interactively.
 *
 * Slow dynamic profiles are upgraded to cached completion; configured profiles with a missing
 * cache regenerate it; missing completion prompts unless non-interactive mode is active.
 */
export declare function doctorShellCompletion(_runtime: RuntimeEnv, prompter: DoctorPrompter, options?: DoctorCompletionOptions): Promise<void>;
/** Ensures the shell completion cache exists without prompting during setup/update flows. */
export declare function ensureCompletionCacheExists(binName?: string, options?: ShellCompletionStatusOptions): Promise<boolean>;
