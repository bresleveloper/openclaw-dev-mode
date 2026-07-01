import type { CommandsConfig } from "./types.js";
/** Boolean command flags accepted by the normalized commands config. */
export type CommandFlagKey = {
    [K in keyof CommandsConfig]-?: Exclude<CommandsConfig[K], undefined> extends boolean ? K : never;
}[keyof CommandsConfig];
/** Returns true only when a command flag is explicitly enabled. */
export declare function isCommandFlagEnabled(config: {
    commands?: unknown;
} | undefined, key: CommandFlagKey): boolean;
/** Returns the public restart command state; restart defaults on and is disabled only by false. */
export declare function isRestartEnabled(config?: {
    commands?: unknown;
}): boolean;
