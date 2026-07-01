import type { ElevatedLevel, ReasoningLevel, ThinkLevel, VerboseLevel } from "../thinking.js";
import { type FastMode } from "../thinking.js";
/** Resolves current directive levels from session, agent, and config defaults. */
export declare function resolveCurrentDirectiveLevels(params: {
    sessionEntry?: {
        thinkingLevel?: unknown;
        fastMode?: unknown;
        verboseLevel?: unknown;
        reasoningLevel?: unknown;
        elevatedLevel?: unknown;
    };
    agentEntry?: {
        fastModeDefault?: unknown;
        reasoningDefault?: unknown;
    };
    agentCfg?: {
        thinkingDefault?: unknown;
        verboseDefault?: unknown;
        reasoningDefault?: unknown;
        elevatedDefault?: unknown;
    };
    resolveDefaultThinkingLevel: () => Promise<ThinkLevel | undefined>;
}): Promise<{
    currentThinkLevel: ThinkLevel | undefined;
    currentFastMode: FastMode | undefined;
    currentVerboseLevel: VerboseLevel | undefined;
    currentReasoningLevel: ReasoningLevel;
    currentElevatedLevel: ElevatedLevel | undefined;
}>;
