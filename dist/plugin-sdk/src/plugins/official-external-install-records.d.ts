import type { PluginInstallRecord } from "../config/types.plugins.js";
/** Resolves the official npm spec when an install record matches the trusted catalog package. */
export declare function resolveTrustedSourceLinkedOfficialNpmSpec(params: {
    pluginId: string;
    record: PluginInstallRecord;
}): string | undefined;
/** Resolves the official ClawHub spec when a trusted-source install record matches. */
export declare function resolveTrustedSourceLinkedOfficialClawHubSpec(params: {
    pluginId: string;
    record: PluginInstallRecord;
}): string | undefined;
/** Resolves official ClawHub/npm specs linked to a trusted-source install record. */
export declare function resolveTrustedSourceLinkedOfficialClawHubInstall(params: {
    pluginId: string;
    record: PluginInstallRecord;
}): {
    clawhubSpec?: string;
    npmSpec?: string;
} | undefined;
