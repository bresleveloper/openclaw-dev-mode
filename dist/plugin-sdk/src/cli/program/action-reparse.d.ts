import type { Command } from "commander";
/** Rebuild argv from Commander action args and re-run parsing after lazy registration. */
export declare function reparseProgramFromActionArgs(program: Command, actionArgs: unknown[]): Promise<void>;
