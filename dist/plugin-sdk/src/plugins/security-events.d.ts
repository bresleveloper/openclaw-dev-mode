export type PluginSecuritySourceFamily = "archive" | "directory" | "file" | "git" | "installed-package" | "npm";
type PluginSecurityMode = "install" | "update";
type PluginAuditReason = "security_scan_blocked" | "security_scan_failed";
export declare function pluginAuditOutcomeForReason(reason: PluginAuditReason): "denied" | "error";
export declare function emitPluginInstallSecurityEvent(params: {
    pluginId: string;
    mode: PluginSecurityMode;
    sourceFamily: PluginSecuritySourceFamily;
    extensionCount?: number;
    hasVersion?: boolean;
    trustedSourceLinkedOfficialInstall?: boolean;
}): void;
export declare function emitPluginAuditSecurityEvent(params: {
    outcome: "denied" | "error";
    reason: PluginAuditReason;
    pluginId?: string;
    mode?: PluginSecurityMode;
    sourceFamily?: PluginSecuritySourceFamily;
}): void;
export {};
