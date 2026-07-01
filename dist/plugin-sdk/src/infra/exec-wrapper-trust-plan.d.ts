type ExecWrapperTrustPlan = {
    argv: string[];
    policyArgv: string[];
    wrapperChain: string[];
    policyBlocked: boolean;
    blockedWrapper?: string;
    shellWrapperExecutable: boolean;
    shellInlineCommand: string | null;
};
/**
 * Resolves transparent dispatch wrappers into the executable that policy should inspect.
 * Shell multiplexers keep their original argv as the trust target while exposing the
 * nested shell command for shell-specific approval checks.
 */
export declare function resolveExecWrapperTrustPlan(argv: string[], maxDepth?: number, platform?: NodeJS.Platform): ExecWrapperTrustPlan;
export {};
