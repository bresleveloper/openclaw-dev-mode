import { type PackageUpdateStepAdvisory, type UpdatePostInstallDoctorResult } from "./update-doctor-result.js";
export type { PackageUpdateStepAdvisory } from "./update-doctor-result.js";
import { type CommandRunner, type ResolvedGlobalInstallTarget } from "./update-global.js";
/**
 * Captures one package-manager or filesystem step from the global update flow.
 * Callers surface these records directly in update diagnostics.
 */
export type PackageUpdateStepResult = {
    name: string;
    command: string;
    cwd: string;
    durationMs: number;
    exitCode: number | null;
    stdoutTail?: string | null;
    stderrTail?: string | null;
    signal?: NodeJS.Signals | null;
    killed?: boolean;
    termination?: "exit" | "timeout" | "no-output-timeout" | "signal";
    advisory?: PackageUpdateStepAdvisory;
};
type PackageUpdateStepRunner = (params: {
    name: string;
    argv: string[];
    cwd?: string;
    timeoutMs: number;
    env?: NodeJS.ProcessEnv;
}) => Promise<PackageUpdateStepResult>;
export declare function markPackagePostInstallDoctorAdvisory<T extends {
    exitCode: number | null;
    stderrTail?: string | null;
    signal?: NodeJS.Signals | null;
    killed?: boolean;
    termination?: "exit" | "timeout" | "no-output-timeout" | "signal";
    advisory?: PackageUpdateStepAdvisory;
}>(step: T, result: UpdatePostInstallDoctorResult | null): T & {
    advisory?: PackageUpdateStepAdvisory;
};
/**
 * Runs the global package update flow, including npm staging when possible,
 * package verification, optional post-verification, and cleanup.
 */
export declare function runGlobalPackageUpdateSteps(params: {
    installTarget: ResolvedGlobalInstallTarget;
    installSpec: string;
    packageName: string;
    packageRoot?: string | null;
    runCommand: CommandRunner;
    runStep: PackageUpdateStepRunner;
    timeoutMs: number;
    env?: NodeJS.ProcessEnv;
    installCwd?: string;
    postVerifyStep?: (packageRoot: string) => Promise<PackageUpdateStepResult | null>;
}): Promise<{
    steps: PackageUpdateStepResult[];
    verifiedPackageRoot: string | null;
    afterVersion: string | null;
    failedStep: PackageUpdateStepResult | null;
}>;
