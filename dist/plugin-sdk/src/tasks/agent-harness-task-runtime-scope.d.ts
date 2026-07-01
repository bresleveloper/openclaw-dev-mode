import type { DeliveryContext } from "../utils/delivery-context.types.js";
export type AgentHarnessTaskRuntimeScope = {
    readonly requesterSessionKey: string;
    readonly requesterOrigin?: DeliveryContext;
};
/** Creates a host-issued task runtime scope for agent harness task execution. */
export declare function createAgentHarnessTaskRuntimeScope(params: {
    requesterSessionKey: string;
    requesterOrigin?: DeliveryContext;
}): AgentHarnessTaskRuntimeScope;
export declare function assertAgentHarnessTaskRuntimeScope(scope: AgentHarnessTaskRuntimeScope): AgentHarnessTaskRuntimeScope;
