import type { OpenClawConfig } from "../../config/types.openclaw.js";
export declare function patchSkillConfigEntry(cfg: OpenClawConfig, skillKey: string, patch: {
    enabled?: boolean;
    apiKey?: string;
    env?: Record<string, string>;
}): OpenClawConfig;
export declare function updateSkillConfigEntry(params: {
    skillKey: string;
    enabled?: boolean;
    apiKey?: string;
    env?: Record<string, string>;
}): Promise<Record<string, unknown>>;
