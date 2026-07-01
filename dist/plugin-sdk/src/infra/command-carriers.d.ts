export declare const COMMAND_CARRIER_EXECUTABLES: Set<string>;
export declare const SOURCE_EXECUTABLES: Set<string>;
export declare function isEnvAssignmentToken(token: string): boolean;
export type ParsedEnvInvocationPrelude = {
    assignmentKeys: string[];
    commandIndex: number;
    splitArgv?: string[];
    usesModifiers: boolean;
};
/** Parse the option and assignment prelude of an `env` invocation. */
export declare function parseEnvInvocationPrelude(argv: string[], depth?: number): ParsedEnvInvocationPrelude | null;
export declare function envInvocationUsesModifiers(argv: string[]): boolean;
/** Return the argv carried by `env`, including argv reconstructed from `env -S`. */
export declare function unwrapEnvInvocation(argv: string[]): string[] | null;
/** Resolve the command argv behind an `env` carrier, honoring bounded `env -S` recursion. */
export declare function resolveEnvCarriedArgv(argv: string[], depth?: number): string[] | null;
export declare function resolveCarrierCommandArgv(argv: string[], depth?: number, options?: {
    includeExec?: boolean;
}): string[] | null;
