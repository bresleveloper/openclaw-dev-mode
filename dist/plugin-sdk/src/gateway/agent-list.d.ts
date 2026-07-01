import type { SessionScope } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type GatewayAgentListRow = {
    id: string;
    name?: string;
};
export declare function listGatewayAgentIds(cfg: OpenClawConfig): string[];
/** Lists gateway-visible agent ids with default/main session metadata. */
export declare function listGatewayAgentsBasic(cfg: OpenClawConfig): {
    defaultId: string;
    mainKey: string;
    scope: SessionScope;
    agents: GatewayAgentListRow[];
};
export {};
