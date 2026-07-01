import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Chooses the runtime config snapshot unless it would hide skill secret refs. */
export declare function resolveSkillRuntimeConfig(config?: OpenClawConfig): OpenClawConfig | undefined;
