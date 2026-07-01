import type { Command } from "commander";
type JsonMode = "output" | "parse-only";
/** Mark a command as having a special JSON mode beyond ordinary JSON output. */
export declare function setCommandJsonMode(command: Command, mode: JsonMode): Command;
/** Return true only when `--json` selects machine-readable command output. */
export declare function isCommandJsonOutputMode(command: Command, argv?: string[]): boolean;
export {};
