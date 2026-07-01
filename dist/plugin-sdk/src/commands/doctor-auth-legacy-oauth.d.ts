import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
/**
 * Applies provider-declared OAuth profile id repairs to config after prompting.
 *
 * Providers own the legacy id mapping; doctor only loads setup-time provider metadata and asks
 * before writing config so stale provider-specific ids do not silently shadow current profiles.
 */
export declare function maybeRepairLegacyOAuthProfileIds(cfg: OpenClawConfig, prompter: DoctorPrompter): Promise<OpenClawConfig>;
