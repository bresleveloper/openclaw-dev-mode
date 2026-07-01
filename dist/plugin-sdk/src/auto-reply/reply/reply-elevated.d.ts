import type { OpenClawConfig } from "../../config/config.js";
import type { MsgContext } from "../templating.js";
export { formatElevatedUnavailableMessage } from "./elevated-unavailable.js";
/** Resolves whether elevated tools are enabled and allowed for the inbound sender. */
export declare function resolveElevatedPermissions(params: {
    cfg: OpenClawConfig;
    agentId: string;
    ctx: MsgContext;
    provider: string;
}): {
    enabled: boolean;
    allowed: boolean;
    failures: Array<{
        gate: string;
        key: string;
    }>;
};
