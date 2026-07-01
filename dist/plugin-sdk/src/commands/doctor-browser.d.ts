import { note } from "../../packages/terminal-core/src/note.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type BrowserDoctorDeps = {
    platform?: NodeJS.Platform;
    noteFn?: typeof note;
    env?: NodeJS.ProcessEnv;
    getUid?: () => number;
    resolveManagedExecutable?: (resolved: unknown, platform: NodeJS.Platform) => {
        path: string;
    } | null;
    resolveChromeExecutable?: (platform: NodeJS.Platform) => {
        path: string;
    } | null;
    readVersion?: (executablePath: string) => string | null;
    configDir?: string;
    pathExists?: (targetPath: string) => boolean;
};
type BrowserDoctorRepairDeps = {
    env?: NodeJS.ProcessEnv;
    configDir?: string;
    pathExists?: (targetPath: string) => boolean;
    movePathToTrash?: (targetPath: string) => Promise<string>;
};
/** Legacy browser profile paths detected before cleanup moves them aside. */
export type LegacyClawdBrowserProfileResidue = {
    legacyProfileDir: string;
    legacyUserDataDir: string;
    canonicalUserDataDir: string;
};
/** Emits browser readiness notes through the bundled browser plugin doctor surface. */
export declare function noteChromeMcpBrowserReadiness(cfg: OpenClawConfig, deps?: BrowserDoctorDeps): Promise<void>;
/** Detects old clawd browser profile residue without loading plugin cleanup when paths are absent. */
export declare function detectLegacyClawdBrowserProfileResidue(cfg: OpenClawConfig, deps?: BrowserDoctorRepairDeps): Promise<LegacyClawdBrowserProfileResidue | null>;
/** Archives legacy clawd browser profile residue through the browser plugin repair hook. */
export declare function maybeArchiveLegacyClawdBrowserProfileResidue(cfg: OpenClawConfig, deps?: BrowserDoctorRepairDeps): Promise<{
    changes: string[];
    warnings: string[];
}>;
export {};
