import type { SessionMaintenanceWarning } from "../config/sessions/store-maintenance.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type WarningParams = {
    cfg: OpenClawConfig;
    sessionKey: string;
    entry: SessionEntry;
    warning: SessionMaintenanceWarning;
};
declare function resetSessionMaintenanceWarningForTests(): void;
export declare const testing: {
    readonly resetSessionMaintenanceWarningForTests: typeof resetSessionMaintenanceWarningForTests;
};
/** Deliver or enqueue a warn-only session maintenance notification. */
export declare function deliverSessionMaintenanceWarning(params: WarningParams): Promise<void>;
export { testing as __testing };
