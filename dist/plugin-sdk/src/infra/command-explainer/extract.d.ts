import type { CommandExplanation } from "./types.js";
/** Parses a shell command into command steps, shapes, risks, and source spans. */
export declare function explainShellCommand(source: string): Promise<CommandExplanation>;
