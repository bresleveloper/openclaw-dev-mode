import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { resolveSkillsInstallPreferences as defaultResolveSkillsInstallPreferences } from "../loading/config.js";
import { loadWorkspaceSkillEntries as defaultLoadWorkspaceSkillEntries } from "../loading/workspace.js";
import type { SkillInstallResult } from "./install-types.js";
export type SkillInstallRequest = {
    workspaceDir: string;
    skillName: string;
    installId: string;
    timeoutMs?: number;
    config?: OpenClawConfig;
};
export type { SkillInstallResult } from "./install-types.js";
type SkillsInstallDeps = {
    hasBinary: (bin: string) => boolean;
    loadWorkspaceSkillEntries: typeof defaultLoadWorkspaceSkillEntries;
    resolveNodeInstallStateDir: () => string;
    resolveBrewExecutable: () => string | undefined;
    isContainerEnvironment: () => boolean;
    resolveSkillsInstallPreferences: typeof defaultResolveSkillsInstallPreferences;
};
declare function resolveDefaultNodeInstallStateDir({ cwd, getuid, homedir, platform, }?: {
    cwd?: string;
    getuid?: () => number;
    homedir?: () => string;
    platform?: NodeJS.Platform;
}): string;
export declare function installSkill(params: SkillInstallRequest): Promise<SkillInstallResult>;
export declare const testing: {
    resolveDefaultNodeInstallStateDir: typeof resolveDefaultNodeInstallStateDir;
    setDepsForTest(overrides?: Partial<SkillsInstallDeps>): void;
};
export { testing as __testing };
