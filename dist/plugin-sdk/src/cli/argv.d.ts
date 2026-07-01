export declare function hasHelpOrVersion(argv: string[]): boolean;
export declare function isHelpOrVersionInvocation(argv: string[]): boolean;
export declare function hasFlag(argv: string[], name: string): boolean;
export declare function hasRootVersionAlias(argv: string[]): boolean;
export declare function isRootVersionInvocation(argv: string[]): boolean;
export declare function isRootHelpInvocation(argv: string[]): boolean;
export declare function normalizeGeneratedHelpCommandArgv(argv: string[]): string[];
export declare function normalizeRootHelpTargetArgv(argv: string[]): string[];
export type NormalizeRootNoColorArgvOptions = {
    shouldPreserveNoColor?: (params: {
        remainingArgs: readonly string[];
        noColorIndex: number;
    }) => boolean;
};
export type NormalizeRootLogLevelArgvOptions = {
    shouldPreserveLogLevel?: (params: {
        remainingArgs: readonly string[];
        logLevelIndex: number;
        consumed: number;
    }) => boolean;
};
export declare function normalizeRootNoColorArgv(argv: string[], options?: NormalizeRootNoColorArgvOptions): string[];
export declare function normalizeRootLogLevelArgv(argv: string[], options?: NormalizeRootLogLevelArgvOptions): string[];
export declare function getFlagValue(argv: string[], name: string): string | null | undefined;
export declare function getVerboseFlag(argv: string[], options?: {
    includeDebug?: boolean;
}): boolean;
export declare function getPositiveIntFlagValue(argv: string[], name: string): number | null | undefined;
export declare function getCommandPathWithRootOptions(argv: string[], depth?: number): string[];
export declare function getPrimaryCommand(argv: string[]): string | null;
type CommandPositionalsParseOptions = {
    commandPath: ReadonlyArray<string>;
    booleanFlags?: ReadonlyArray<string>;
    valueFlags?: ReadonlyArray<string>;
};
export declare function getCommandPositionalsWithRootOptions(argv: string[], options: CommandPositionalsParseOptions): string[] | null;
export declare function buildParseArgv(params: {
    programName?: string;
    rawArgs?: string[];
    fallbackArgv?: string[];
}): string[];
export declare function shouldMigrateStateFromPath(path: string[]): boolean;
export {};
