import type { PluginInstallRecord } from "../config/types.plugins.js";
import type { ClawHubPackageChannel, ClawHubPackageFamily } from "../infra/clawhub.js";
/** Install record fields captured for ClawHub plugin installs. */
export type ClawHubPluginInstallRecordFields = {
    source: "clawhub";
    clawhubUrl: string;
    clawhubPackage: string;
    clawhubFamily: Exclude<ClawHubPackageFamily, "skill">;
    clawhubChannel?: ClawHubPackageChannel;
    version?: string;
    integrity?: string;
    resolvedAt?: string;
    installedAt?: string;
    artifactKind?: "legacy-zip" | "npm-pack";
    artifactFormat?: "zip" | "tgz";
    npmIntegrity?: string;
    npmShasum?: string;
    npmTarballName?: string;
    clawpackSha256?: string;
    clawpackSpecVersion?: number;
    clawpackManifestSha256?: string;
    clawpackSize?: number;
};
/** Builds plugin install record fields from resolved ClawHub package metadata. */
export declare function buildClawHubPluginInstallRecordFields(fields: ClawHubPluginInstallRecordFields): Pick<PluginInstallRecord, "source" | "clawhubUrl" | "clawhubPackage" | "clawhubFamily" | "clawhubChannel" | "version" | "integrity" | "resolvedAt" | "installedAt" | "artifactKind" | "artifactFormat" | "npmIntegrity" | "npmShasum" | "npmTarballName" | "clawpackSha256" | "clawpackSpecVersion" | "clawpackManifestSha256" | "clawpackSize">;
