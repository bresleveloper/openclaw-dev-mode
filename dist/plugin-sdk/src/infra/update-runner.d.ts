import { type CommandOptions } from "../process/exec.js";
import { type PackageUpdateStepAdvisory } from "./package-update-steps.js";
import { type UpdateChannel } from "./update-channels.js";
import { type GlobalInstallManager } from "./update-global.js";
export type UpdateStepAdvisory = PackageUpdateStepAdvisory;
export type UpdateStepResult = {
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
    advisory?: UpdateStepAdvisory;
};
export type UpdateRunResult = {
    status: "ok" | "error" | "skipped";
    mode: "git" | "pnpm" | "bun" | "npm" | "unknown";
    root?: string;
    reason?: string;
    before?: {
        sha?: string | null;
        version?: string | null;
    };
    after?: {
        sha?: string | null;
        version?: string | null;
    };
    steps: UpdateStepResult[];
    durationMs: number;
    postUpdate?: {
        plugins?: {
            status: "ok" | "warning" | "skipped" | "error";
            reason?: string;
            changed: boolean;
            warnings?: Array<{
                pluginId?: string;
                reason: string;
                message: string;
                guidance: string[];
            }>;
            sync: {
                changed: boolean;
                switchedToBundled: string[];
                switchedToNpm: string[];
                warnings: string[];
                errors: string[];
            };
            npm: {
                changed: boolean;
                outcomes: Array<{
                    pluginId: string;
                    status: "updated" | "unchanged" | "skipped" | "error";
                    message: string;
                    currentVersion?: string;
                    nextVersion?: string;
                    channelFallback?: {
                        requestedSpec: string;
                        usedSpec: string;
                        requestedLabel: string;
                        usedLabel: string;
                        reason: "unavailable" | "failed";
                        message: string;
                    };
                }>;
            };
            integrityDrifts: Array<{
                pluginId: string;
                spec: string;
                expectedIntegrity: string;
                actualIntegrity: string;
                resolvedSpec?: string;
                resolvedVersion?: string;
                action: "aborted";
            }>;
        };
    };
};
type CommandRunner = (argv: string[], options: CommandOptions) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
    signal?: NodeJS.Signals | null;
    killed?: boolean;
    termination?: "exit" | "timeout" | "no-output-timeout" | "signal";
}>;
export type UpdateStepInfo = {
    name: string;
    command: string;
    index: number;
    total: number;
};
export type UpdateStepCompletion = UpdateStepInfo & {
    durationMs: number;
    exitCode: number | null;
    stderrTail?: string | null;
    signal?: NodeJS.Signals | null;
    killed?: boolean;
    termination?: "exit" | "timeout" | "no-output-timeout" | "signal";
    advisory?: UpdateStepAdvisory;
};
export type UpdateStepProgress = {
    onStepStart?: (step: UpdateStepInfo) => void;
    onStepComplete?: (step: UpdateStepCompletion) => void;
};
type UpdateRunnerOptions = {
    cwd?: string;
    argv1?: string;
    tag?: string;
    channel?: UpdateChannel;
    devTargetRef?: string;
    deferConfiguredPluginInstallRepair?: boolean;
    beforeGitMutation?: () => Promise<void>;
    timeoutMs?: number;
    runCommand?: CommandRunner;
    progress?: UpdateStepProgress;
};
export type UpdateInstallSurface = {
    kind: "git";
    mode: "git";
    root: string;
    packageRoot: string;
} | {
    kind: "global";
    mode: GlobalInstallManager;
    root: string;
    packageRoot: string;
} | {
    kind: "package-root";
    mode: "unknown";
    root: string;
    packageRoot: string;
} | {
    kind: "missing";
    mode: "unknown";
    root?: string;
    packageRoot?: undefined;
};
export declare function resolveUpdateInstallSurface(opts?: Pick<UpdateRunnerOptions, "cwd" | "argv1" | "timeoutMs" | "runCommand">): Promise<UpdateInstallSurface>;
export declare function runGatewayUpdate(opts?: UpdateRunnerOptions): Promise<UpdateRunResult>;
export {};
