/**
 * Channel target resolver helpers.
 *
 * Builds unresolved rows and token-gated resolution flows for setup/allowlist targets.
 */
import type { ChannelResolveResult } from "./types.adapters.js";
/**
 * Builds unresolved target results with one common note.
 */
export declare function buildUnresolvedTargetResults(inputs: string[], note: string): ChannelResolveResult[];
/**
 * Resolves targets only when a required token is available.
 */
export declare function resolveTargetsWithOptionalToken<TResult>(params: {
    token?: string | null;
    inputs: string[];
    missingTokenNote: string;
    resolveWithToken: (params: {
        token: string;
        inputs: string[];
    }) => Promise<TResult[]>;
    mapResolved: (entry: TResult) => ChannelResolveResult;
}): Promise<ChannelResolveResult[]>;
