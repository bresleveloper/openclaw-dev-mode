import type { OpenClawConfig } from "../config/types.openclaw.js";
type HeartbeatTemplateRepairAnalysis = {
    status: "clean";
} | {
    status: "dirty-template";
} | {
    status: "dirty-template-with-custom-content";
    customLines: string[];
};
/** Classifies heartbeat template content as clean, repairable, or risky because it has user text. */
export declare function analyzeHeartbeatTemplateForRepair(content: string): HeartbeatTemplateRepairAnalysis;
/** Replaces known dirty heartbeat templates with the clean runtime template when repair is enabled. */
export declare function maybeRepairHeartbeatTemplate(params: {
    cfg: OpenClawConfig;
    shouldRepair: boolean;
}): Promise<void>;
export {};
