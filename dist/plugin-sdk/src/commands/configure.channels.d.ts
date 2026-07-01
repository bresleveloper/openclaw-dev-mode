import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
/** Prompt for configured channel sections to remove from openclaw.json. */
export declare function removeChannelConfigWizard(cfg: OpenClawConfig, runtime: RuntimeEnv): Promise<OpenClawConfig>;
