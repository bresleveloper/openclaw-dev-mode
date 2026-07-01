import type { AgentRuntimeDeliveryPlan, AgentRuntimeOutcomePlan, AgentRuntimePlan, BuildAgentRuntimeDeliveryPlanParams, BuildAgentRuntimePlanParams } from "./types.js";
/** Build delivery-specific runtime decisions for one provider/model. */
export declare function buildAgentRuntimeDeliveryPlan(params: BuildAgentRuntimeDeliveryPlanParams): AgentRuntimeDeliveryPlan;
/** Build run-outcome classification hooks for model fallback decisions. */
export declare function buildAgentRuntimeOutcomePlan(): AgentRuntimeOutcomePlan;
/** Build the complete runtime plan for an embedded agent attempt. */
export declare function buildAgentRuntimePlan(params: BuildAgentRuntimePlanParams): AgentRuntimePlan;
