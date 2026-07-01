import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SkillStatusEntry } from "../skills/discovery/status.js";
import type { HealthFinding } from "./health-checks.js";
export declare function detectUnavailableSkills(cfg: OpenClawConfig): SkillStatusEntry[];
export declare function collectProviderCatalogProjectionFindings(cfg: OpenClawConfig): Promise<readonly HealthFinding[]>;
export declare function collectRuntimeToolSchemaFindings(cfg: OpenClawConfig): Promise<readonly HealthFinding[]>;
