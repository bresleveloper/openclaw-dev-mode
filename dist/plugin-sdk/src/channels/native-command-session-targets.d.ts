/**
 * Inputs for resolving where a native channel command should attach session state.
 */
export type ResolveNativeCommandSessionTargetsParams = {
    agentId: string;
    sessionPrefix: string;
    userId: string;
    targetSessionKey: string;
    boundSessionKey?: string;
    lowercaseSessionKey?: boolean;
};
/**
 * Resolves the storage session key and command target key for native command events.
 */
export declare function resolveNativeCommandSessionTargets(params: ResolveNativeCommandSessionTargetsParams): {
    sessionKey: string;
    commandTargetSessionKey: string;
};
