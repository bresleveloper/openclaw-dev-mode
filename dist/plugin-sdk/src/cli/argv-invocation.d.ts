export type CliArgvInvocation = {
    argv: string[];
    commandPath: string[];
    primary: string | null;
    hasHelpOrVersion: boolean;
    isRootHelpInvocation: boolean;
};
/** Resolves command path and help/version mode from a raw process argv array. */
export declare function resolveCliArgvInvocation(argv: string[]): CliArgvInvocation;
