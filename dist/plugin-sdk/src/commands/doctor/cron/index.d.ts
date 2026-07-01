import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { DoctorPrompter, DoctorOptions } from "../../doctor-prompter.js";
export { collectLegacyWhatsAppCrontabHealthWarning, noteLegacyWhatsAppCrontabHealthCheck, } from "./warnings.js";
export type LegacyCronRepairResult = {
    changes: string[];
    warnings: string[];
};
export declare function repairLegacyCronStoreWithoutPrompt(params: {
    cfg: OpenClawConfig;
}): Promise<LegacyCronRepairResult>;
/** Inspect cron storage and optionally repair legacy JSON/SQLite/payload shapes. */
export declare function maybeRepairLegacyCronStore(params: {
    cfg: OpenClawConfig;
    options: DoctorOptions;
    prompter: Pick<DoctorPrompter, "confirm">;
}): Promise<void>;
