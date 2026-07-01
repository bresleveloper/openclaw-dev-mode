import type { CommandHandler } from "./commands-types.js";
/** Parses /goal action text, defaulting unknown actions to goal creation. */
export declare function parseGoalCommand(raw: string): {
    action: string;
    text: string;
} | null;
/** Formats the model prompt used to continue a newly started goal. */
export declare function formatGoalContinuationPrompt(objective: string): string;
/** Formats the model prompt used when resuming a paused goal. */
export declare function formatGoalResumeContinuationPrompt(note: string): string;
/** Returns true for internally generated goal continuation prompts. */
export declare function isFormattedGoalContinuationPrompt(message: string): boolean;
/** Command handler for /goal lifecycle commands. */
export declare const handleGoalCommand: CommandHandler;
