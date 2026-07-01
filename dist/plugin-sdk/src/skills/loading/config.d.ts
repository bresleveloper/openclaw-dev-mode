import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillConfig } from "../../config/types.skills.js";
import { hasBinary } from "../../shared/config-eval.js";
import type { SkillEligibilityContext, SkillEntry, SkillsInstallPreferences } from "../types.js";
/** Platform helpers re-exported for skill loading callers and tests. */
export { hasBinary };
export declare function resolveSkillsInstallPreferences(config?: OpenClawConfig): SkillsInstallPreferences;
export declare function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean;
export declare function resolveSkillConfig(config: OpenClawConfig | undefined, skillKey: string): SkillConfig | undefined;
export declare function resolveBundledAllowlist(config?: OpenClawConfig): ReadonlySet<string> | undefined;
export declare function isBundledSkillAllowed(entry: SkillEntry, allowlist?: ReadonlySet<string>): boolean;
export declare function shouldIncludeSkill(params: {
    entry: SkillEntry;
    config?: OpenClawConfig;
    bundledAllowlist: ReadonlySet<string> | undefined;
    eligibility?: SkillEligibilityContext;
}): boolean;
