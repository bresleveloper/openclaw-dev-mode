import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions, DoctorPrompter } from "./doctor-prompter.js";
/**
 * Loads config, runs doctor migrations/repairs, and returns the config write plan.
 *
 * This is the config-side orchestration boundary for doctor; it keeps preview notes, repair
 * mutations, gateway auth refreshes, and final write confirmation in one ordered flow.
 */
export declare function loadAndMaybeMigrateDoctorConfig(params: {
    options: DoctorOptions;
    confirm: (p: {
        message: string;
        initialValue: boolean;
    }) => Promise<boolean>;
    runtime?: RuntimeEnv;
    prompter?: DoctorPrompter;
}): Promise<{
    cfg: OpenClawConfig;
    path: string;
    shouldWriteConfig: boolean;
    sourceConfigValid: boolean;
    preservedLegacyRootKeys: string[];
    sourceLastTouchedVersion?: string | undefined;
    skipPluginValidationOnWrite?: boolean | undefined;
}>;
