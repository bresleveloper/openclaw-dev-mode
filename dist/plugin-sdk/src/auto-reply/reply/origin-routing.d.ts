import type { OriginatingChannelType } from "../templating.js";
/** Resolves the original message provider before reply redirection. */
export declare function resolveOriginMessageProvider(params: {
    originatingChannel?: OriginatingChannelType;
    provider?: string;
}): string | undefined;
/** Resolves the original message target before reply redirection. */
export declare function resolveOriginMessageTo(params: {
    originatingTo?: string;
    to?: string;
}): string | undefined;
/** Resolves the original account id before reply redirection. */
export declare function resolveOriginAccountId(params: {
    originatingAccountId?: string;
    accountId?: string;
}): string | undefined;
