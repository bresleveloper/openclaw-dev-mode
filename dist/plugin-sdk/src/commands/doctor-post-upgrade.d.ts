import { type PostUpgradeReport } from "./doctor-post-upgrade.types.js";
/** Runs post-upgrade plugin probes and returns structured findings for the caller to render. */
export declare function runPostUpgradeProbes(params: {
    installsPath?: string;
    stateDir?: string;
}): Promise<PostUpgradeReport>;
