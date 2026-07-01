import type { GatewayServiceCommandConfig } from "./service-types.js";
/** Summary of the installed gateway service command and package layout. */
export type GatewayServiceLayoutSummary = {
    execStart: string;
    sourcePath?: string;
    sourcePathReal?: string;
    sourceScope?: "user" | "system";
    entrypoint?: string;
    entrypointReal?: string;
    packageRoot?: string;
    packageRootReal?: string;
    packageVersion?: string;
    entrypointSourceCheckout?: boolean;
};
export declare function summarizeGatewayServiceLayout(command: GatewayServiceCommandConfig | null): Promise<GatewayServiceLayoutSummary | undefined>;
