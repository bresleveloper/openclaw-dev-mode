import { requestHeartbeat as requestHeartbeatImpl } from "../../infra/heartbeat-wake.js";
import { enqueueSystemEvent as enqueueSystemEventImpl } from "../../infra/system-events.js";
import { getProcessSupervisor as getProcessSupervisorImpl } from "../../process/supervisor/index.js";
import { type CliOutput } from "../cli-output.js";
import { writeCliSystemPromptFile } from "./helpers.js";
import type { PreparedCliRunContext } from "./types.js";
declare const executeDeps: {
    getProcessSupervisor: typeof getProcessSupervisorImpl;
    enqueueSystemEvent: typeof enqueueSystemEventImpl;
    requestHeartbeat: typeof requestHeartbeatImpl;
    writeCliSystemPromptFile: typeof writeCliSystemPromptFile;
};
/** Overrides process/event dependencies for CLI runner execution tests. */
export declare function setCliRunnerExecuteTestDeps(overrides: Partial<typeof executeDeps>): void;
/** Builds the compact execution summary logged before a CLI backend run. */
export declare function buildCliExecLogLine(params: {
    provider: string;
    model: string;
    promptChars: number;
    trigger?: string;
    useResume: boolean;
    cliSessionId?: string;
    resolvedSessionId?: string;
    reusableSessionId?: string;
    invalidatedReason?: string;
    hasHistoryPrompt: boolean;
}): string;
/** Summarizes auth-related env keys preserved or cleared for a CLI child process. */
export declare function buildCliEnvAuthLog(childEnv: Record<string, string>): string;
/** Executes a prepared CLI run context and returns normalized CLI output. */
export declare function executePreparedCliRun(context: PreparedCliRunContext, cliSessionIdToUse?: string): Promise<CliOutput>;
export {};
