import type { AgentModelConfig } from "../../../config/types.agents-shared.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export declare function resolveDoctorPrimaryModelRef(cfg: OpenClawConfig, agentModel?: AgentModelConfig): {
    provider: string;
    model: string;
};
