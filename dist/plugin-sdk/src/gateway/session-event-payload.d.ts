import type { GatewaySessionRow } from "./session-utils.js";
export declare function buildGatewaySessionEventFields(params: {
    sessionRow: GatewaySessionRow;
    agentId?: string;
    label?: string;
    displayName?: string;
    parentSessionKey?: string;
    hasActiveRun?: boolean;
}): Record<string, unknown>;
