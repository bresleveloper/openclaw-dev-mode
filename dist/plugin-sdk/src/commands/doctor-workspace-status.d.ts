import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginVersionDriftReport } from "../plugins/plugin-version-drift.js";
type NoteWorkspaceStatusOptions = {
    pluginVersionDrift?: PluginVersionDriftReport;
};
/** Emits workspace, skills, plugin, and TaskFlow recovery status notes for doctor. */
export declare function noteWorkspaceStatus(cfg: OpenClawConfig, options?: NoteWorkspaceStatusOptions): {
    workspaceDir: string;
};
export {};
