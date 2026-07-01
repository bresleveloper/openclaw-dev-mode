import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves gateway probe auth plus any non-secret warning about credential lookup. */
export declare function resolveGatewayProbeAuthResolution(cfg: OpenClawConfig): Promise<{
    auth: {
        token?: string;
        password?: string;
    };
    warning?: string;
}>;
