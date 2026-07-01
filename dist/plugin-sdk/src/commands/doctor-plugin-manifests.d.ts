import { note } from "../../packages/terminal-core/src/note.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
type LegacyManifestContractMigration = {
    manifestPath: string;
    pluginId: string;
    nextRaw: Record<string, unknown>;
    changeLines: string[];
};
/** Collects manifest rewrites needed to move legacy top-level capability keys under contracts. */
export declare function collectLegacyPluginManifestContractMigrations(params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    manifestRoots?: string[];
    workspaceDir?: string;
}): LegacyManifestContractMigration[];
/** Prompts and rewrites legacy plugin manifest contract fields when doctor repair is enabled. */
export declare function maybeRepairLegacyPluginManifestContracts(params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    manifestRoots?: string[];
    workspaceDir?: string;
    runtime: RuntimeEnv;
    prompter: DoctorPrompter;
    note?: typeof note;
}): Promise<void>;
export {};
