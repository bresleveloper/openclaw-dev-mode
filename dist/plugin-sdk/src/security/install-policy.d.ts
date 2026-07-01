import type { OpenClawConfig } from "../config/types.openclaw.js";
export type InstallPolicyTarget = "skill" | "plugin";
export type InstallPolicyRequestKind = "skill-install" | "plugin-dir" | "plugin-archive" | "plugin-file" | "plugin-npm" | "plugin-git";
export type InstallPolicyOrigin = {
    type: string;
    [key: string]: string | number | boolean | null | undefined;
};
export type InstallPolicySource = {
    kind: "archive" | "bundled" | "clawhub" | "file" | "git" | "local-path" | "managed" | "npm" | "upload" | "workspace";
    authority: "openclaw" | "official" | "third-party" | "unknown" | "user";
    mutable: boolean;
    network: boolean;
};
export type InstallPolicyFinding = {
    ruleId: string;
    severity: "info" | "warn" | "critical";
    message: string;
    file?: string;
    line?: number;
    evidence?: string;
};
export type InstallPolicyRequest = {
    targetType: InstallPolicyTarget;
    targetName: string;
    sourcePath: string;
    sourcePathKind: "file" | "directory";
    source?: InstallPolicySource;
    origin: InstallPolicyOrigin;
    request: {
        kind: InstallPolicyRequestKind;
        mode: "install" | "update";
        requestedSpecifier?: string;
    };
    skill?: {
        installId: string;
        installSpec?: {
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
    };
    plugin?: {
        pluginId: string;
        contentType: "bundle" | "package" | "file" | "dependency-tree";
        packageName?: string;
        manifestId?: string;
        version?: string;
        extensions?: string[];
    };
};
export type InstallPolicyResult = {
    blocked?: undefined;
    findings?: InstallPolicyFinding[];
} | {
    blocked: {
        code: "security_scan_blocked" | "security_scan_failed";
        reason: string;
    };
    findings?: InstallPolicyFinding[];
};
export type InstallPolicyValidationIssue = {
    severity: "error" | "warning";
    message: string;
};
export type InstallPolicyStaticValidation = {
    enabled: boolean;
    targets: InstallPolicyTarget[];
    issues: InstallPolicyValidationIssue[];
};
export declare function validateInstallPolicyStatic(config: OpenClawConfig | undefined): Promise<InstallPolicyStaticValidation>;
export declare function runInstallPolicy(params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    logger?: {
        debug?: (message: string) => void;
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
    request: InstallPolicyRequest;
}): Promise<InstallPolicyResult | undefined>;
export declare function probeInstallPolicy(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    logger?: {
        debug?: (message: string) => void;
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
    sourcePath: string;
}): Promise<InstallPolicyResult | undefined>;
