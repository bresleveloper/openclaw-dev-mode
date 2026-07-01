import type { GatewayService, GatewayServiceStartRepairIssue, GatewayServiceState } from "../../daemon/service.js";
/** Repair a loaded but stale Gateway service definition and report the start result. */
export declare function repairLoadedGatewayServiceForStart(params: {
    service: GatewayService;
    state: GatewayServiceState;
    issues: GatewayServiceStartRepairIssue[];
    json: boolean;
    stdout: NodeJS.WritableStream;
    warn?: (message: string) => void;
}): Promise<{
    result: "started";
    message: string;
    warnings?: string[];
    loaded: boolean;
}>;
