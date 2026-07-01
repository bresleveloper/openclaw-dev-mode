import type { GatewayBindMode } from "../config/types.js";
/** Return a LAN IPv4 for display, or undefined when interface discovery fails. */
export declare function pickBestEffortPrimaryLanIPv4(): string | undefined;
/** Return a tailnet IPv4 plus an optional warning suitable for user output. */
export declare function inspectBestEffortPrimaryTailnetIPv4(params?: {
    warningPrefix?: string;
}): {
    tailnetIPv4: string | undefined;
    warning?: string;
};
/** Resolve the gateway bind host for display, falling back to a safe placeholder. */
export declare function resolveBestEffortGatewayBindHostForDisplay(params: {
    bindMode: GatewayBindMode;
    customBindHost?: string;
    warningPrefix?: string;
}): Promise<{
    bindHost: string;
    warning?: string;
}>;
