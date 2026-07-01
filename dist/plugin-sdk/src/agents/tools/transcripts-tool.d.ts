import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AnyAgentTool } from "./common.js";
type TranscriptsLogger = {
    warn: (message: string) => void;
};
type TranscriptsRuntimeContext = {
    config?: OpenClawConfig;
    stateDir: string;
    logger: TranscriptsLogger;
};
/** Create the agent-facing transcripts tool. */
export declare function createTranscriptsTool(options?: {
    config?: OpenClawConfig;
    stateDir?: string;
    logger?: TranscriptsLogger;
}): AnyAgentTool;
/** Create the process lifecycle service that starts configured transcript captures. */
export declare function createTranscriptsAutoStartService(ctx: TranscriptsRuntimeContext): {
    start: () => void;
    stop: () => Promise<void>;
};
export {};
