import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type InstallPolicyOrigin, type InstallPolicyRequestKind, type InstallPolicySource } from "../security/install-policy.js";
import type { InstallSafetyOverrides } from "./install-security-scan.types.js";
type InstallScanLogger = {
    warn?: (message: string) => void;
};
type PluginInstallRequestKind = Exclude<InstallPolicyRequestKind, "skill-install">;
type PackageExecutableScanMetadata = {
    runtimeExtensions?: readonly string[];
    runtimeSetupEntry?: string;
    setupEntry?: string;
};
type SkillInstallSpec = {
    id?: string;
    kind: "brew" | "node" | "go" | "uv" | "download";
    label?: string;
    bins?: string[];
    os?: string[];
    formula?: string;
    package?: string;
    module?: string;
    url?: string;
    archive?: string;
    extract?: boolean;
    stripComponents?: number;
    targetDir?: string;
};
export type InstallSecurityScanResult = {
    blocked?: {
        code?: "security_scan_blocked" | "security_scan_failed";
        reason: string;
    };
};
export declare function scanBundleInstallSourceRuntime(params: InstallSafetyOverrides & {
    config?: OpenClawConfig;
    logger: InstallScanLogger;
    pluginId: string;
    sourceDir: string;
    requestKind?: PluginInstallRequestKind;
    requestedSpecifier?: string;
    mode?: "install" | "update";
    version?: string;
    source?: InstallPolicySource;
}): Promise<InstallSecurityScanResult | undefined>;
export declare function scanPackageInstallSourceRuntime(params: InstallSafetyOverrides & {
    config?: OpenClawConfig;
    extensions: string[];
    logger: InstallScanLogger;
    packageDir: string;
    packageMetadata?: PackageExecutableScanMetadata;
    pluginId: string;
    requestKind?: PluginInstallRequestKind;
    requestedSpecifier?: string;
    mode?: "install" | "update";
    packageName?: string;
    manifestId?: string;
    version?: string;
    source?: InstallPolicySource;
}): Promise<InstallSecurityScanResult | undefined>;
export declare function scanInstalledPackageDependencyTreeRuntime(params: {
    additionalPackageDirs?: string[];
    allowManagedNpmRootPackagePeerSymlinks?: boolean;
    config?: OpenClawConfig;
    dangerouslyForceUnsafeInstall?: boolean;
    dependencyScanRootDir?: string;
    logger: InstallScanLogger;
    mode?: "install" | "update";
    packageDir: string;
    pluginId: string;
    requestKind?: PluginInstallRequestKind;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
    trustedSourceLinkedOfficialInstall?: boolean;
}): Promise<InstallSecurityScanResult | undefined>;
export declare function scanFileInstallSourceRuntime(params: InstallSafetyOverrides & {
    config?: OpenClawConfig;
    filePath: string;
    logger: InstallScanLogger;
    mode?: "install" | "update";
    pluginId: string;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
}): Promise<InstallSecurityScanResult | undefined>;
export declare function preflightPluginNpmInstallPolicyRuntime(params: {
    config?: OpenClawConfig;
    logger: InstallScanLogger;
    mode?: "install" | "update";
    packageName: string;
    pluginId?: string;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
    sourcePath: string;
    sourcePathKind: "file" | "directory";
}): Promise<InstallSecurityScanResult | undefined>;
export declare function preflightPluginGitInstallPolicyRuntime(params: {
    config?: OpenClawConfig;
    logger: InstallScanLogger;
    mode?: "install" | "update";
    pluginId: string;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
    sourcePath: string;
}): Promise<InstallSecurityScanResult | undefined>;
export declare function evaluateSkillInstallPolicyRuntime(params: {
    config?: OpenClawConfig;
    installId: string;
    installSpec?: SkillInstallSpec;
    logger: InstallScanLogger;
    origin: InstallPolicyOrigin;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
    mode?: "install" | "update";
    skillName: string;
    sourceDir: string;
}): Promise<InstallSecurityScanResult | undefined>;
export {};
