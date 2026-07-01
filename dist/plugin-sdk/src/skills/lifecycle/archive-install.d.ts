import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ArchiveLogger } from "../../infra/archive.js";
import type { InstallPolicyOrigin, InstallPolicySource } from "../../security/install-policy.js";
/** Accepted root marker names for ClawHub skill archive uploads. */
export declare const CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS: readonly ["SKILL.md", "skill.md", "skills.md", "SKILL.MD"];
type SkillArchiveInstallPolicy = {
    config?: OpenClawConfig;
    installId?: string;
    origin: InstallPolicyOrigin;
    requestedSpecifier?: string;
    source?: InstallPolicySource;
};
/** Result shape for installing a skill archive into a workspace skills dir. */
type SkillArchiveInstallResult = {
    ok: true;
    targetDir: string;
} | {
    ok: false;
    error: string;
    failureKind: SkillArchiveInstallFailureKind;
};
export type SkillArchiveInstallFailureKind = "invalid-request" | "unavailable";
/** Normalizes a tracked slug without accepting traversal or path separators. */
export declare function normalizeTrackedSkillSlug(raw: string): string;
export declare function validateRequestedSkillSlug(raw: string): string;
export declare function resolveWorkspaceSkillInstallDir(workspaceDir: string, slug: string): string;
export declare function installExtractedSkillRoot(params: {
    workspaceDir: string;
    slug: string;
    extractedRoot: string;
    mode: "install" | "update";
    timeoutMs?: number;
    logger?: ArchiveLogger;
    policy?: SkillArchiveInstallPolicy;
    rootMarkers?: readonly string[];
}): Promise<SkillArchiveInstallResult>;
export declare function installSkillArchiveFromPath(params: {
    archivePath: string;
    workspaceDir: string;
    slug: string;
    force?: boolean;
    timeoutMs?: number;
    logger?: ArchiveLogger;
    policy?: SkillArchiveInstallPolicy;
}): Promise<SkillArchiveInstallResult>;
export {};
