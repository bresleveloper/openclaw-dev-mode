import type { Command } from "commander";
/** Remove an exact Command instance from a parent program. */
export declare function removeCommand(program: Command, command: Command): boolean;
/** Remove a command by primary name or alias. */
export declare function removeCommandByName(program: Command, name: string): boolean;
