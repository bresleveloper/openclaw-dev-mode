import type { HookInstallRecord } from "../config/types.hooks.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Install record plus the hook pack id being updated in config. */
export type HookInstallUpdate = HookInstallRecord & {
    hookId: string;
};
/** Return config with one hook install record merged into hooks.internal.installs. */
export declare function recordHookInstall(cfg: OpenClawConfig, update: HookInstallUpdate): OpenClawConfig;
