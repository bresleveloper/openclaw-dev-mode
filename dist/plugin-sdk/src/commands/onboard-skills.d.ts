import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Runs the interactive skills setup step and returns the updated config. */
export declare function setupSkills(cfg: OpenClawConfig, workspaceDir: string, runtime: RuntimeEnv, prompter: WizardPrompter): Promise<OpenClawConfig>;
