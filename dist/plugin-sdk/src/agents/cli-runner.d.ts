import type { PreparedCliRunContext, RunCliAgentParams } from "./cli-runner/types.js";
import { claudeCliSessionTranscriptHasContent as claudeCliSessionTranscriptHasContentImpl } from "./command/attempt-execution.helpers.js";
import type { EmbeddedAgentRunResult } from "./embedded-agent-runner.js";
declare const cliRunnerDeps: {
    claudeCliSessionTranscriptHasContent: typeof claudeCliSessionTranscriptHasContentImpl;
    delay: (delayMs: number) => Promise<void>;
};
/** Overrides top-level CLI runner dependencies for tests. */
export declare function setCliRunnerTestDeps(overrides: Partial<typeof cliRunnerDeps>): void;
/** Restores default top-level CLI runner dependencies after tests. */
export declare function restoreCliRunnerTestDeps(): void;
/** Checks whether a Claude CLI session binding has reached its transcript file. */
export declare function isCliBindingFlushed(sessionId: string | undefined, provider: string | undefined, workspaceDir?: string): Promise<boolean>;
/** Prepares and runs one CLI-backed agent turn. */
export declare function runCliAgent(paramsInput: RunCliAgentParams): Promise<EmbeddedAgentRunResult>;
/** Runs an already-prepared CLI agent context through hooks and execution. */
export declare function runPreparedCliAgent(context: PreparedCliRunContext): Promise<EmbeddedAgentRunResult>;
export {};
