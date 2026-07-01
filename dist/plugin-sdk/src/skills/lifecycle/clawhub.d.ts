import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ClawHubDownloadResult, type ClawHubSkillDetail, type ClawHubSkillSearchResult, type ClawHubSkillVerificationResponse } from "../../infra/clawhub.js";
type ClawHubSkillDownloadedArtifactLock = {
    kind: ClawHubDownloadResult["artifact"];
    sha256: string;
    integrity: string;
};
type ClawHubSkillFileLock = {
    path: string;
    sha256: string;
};
type ClawHubSkillVerificationLock = {
    schema: ClawHubSkillVerificationResponse["schema"];
    ok: boolean;
    decision: ClawHubSkillVerificationResponse["decision"];
    reasons: string[];
    card?: unknown;
    artifact?: unknown;
    provenance?: unknown;
    security?: unknown;
    signature?: unknown;
};
type ClawHubSkillLockEntry = {
    version: string;
    installedAt: number;
    registry?: string;
    ownerHandle?: string;
    sourceUrl?: string;
    artifact?: ClawHubSkillDownloadedArtifactLock;
    skillFile?: ClawHubSkillFileLock;
    verification?: ClawHubSkillVerificationLock;
};
type ClawHubSkillsLockfile = {
    version: 1;
    skills: Record<string, ClawHubSkillLockEntry>;
};
export type ClawHubSkillsLockfileStatusRead = {
    kind: "found";
    lock: ClawHubSkillsLockfile;
    path: string;
} | {
    kind: "missing";
} | {
    kind: "malformed";
    path: string;
    error: string;
};
export type ClawHubSkillStatusLink = {
    status: "linked";
    valid: true;
    registry: string;
    slug: string;
    ownerHandle?: string;
    installedVersion: string;
    installedAt: number;
    originPath: string;
    lockPath: string;
    sourceUrl?: string;
    artifact?: ClawHubSkillDownloadedArtifactLock;
    skillFile?: ClawHubSkillFileLock;
} | {
    status: "invalid";
    valid: false;
    reason: string;
    registry?: string;
    slug?: string;
    installedVersion?: string;
    installedAt?: number;
    originPath?: string;
    lockPath?: string;
};
export type LocalSkillCardStatus = {
    present: true;
    path: string;
    sizeBytes: number;
};
type InstallClawHubSkillResult = {
    ok: true;
    slug: string;
    version: string;
    targetDir: string;
    detail?: ClawHubSkillDetail;
} | {
    ok: false;
    error: string;
};
type UpdateClawHubSkillResult = {
    ok: true;
    slug: string;
    previousVersion: string | null;
    version: string;
    changed: boolean;
    targetDir: string;
} | {
    ok: false;
    error: string;
};
type Logger = {
    info?: (message: string) => void;
};
type ClawHubSkillVerificationResolutionSource = "installed" | "registry";
type ClawHubSkillVerificationSelector = "installed-version" | "version" | "tag" | "latest";
type ClawHubSkillVerificationTargetResult = {
    ok: true;
    slug: string;
    ownerHandle?: string;
    baseUrl: string;
    version: string | undefined;
    tag: string | undefined;
    resolution: {
        source: ClawHubSkillVerificationResolutionSource;
        selector: ClawHubSkillVerificationSelector;
        registry: string;
        skillDir: string | undefined;
        installedVersion: string | undefined;
    };
} | {
    ok: false;
    error: string;
};
export declare function readVerifiedClawHubSkillSourceUrl(raw: unknown): string | undefined;
export declare function readClawHubSkillsLockfileStatusSync(workspaceDir: string): ClawHubSkillsLockfileStatusRead;
export declare function resolveClawHubSkillStatusLinkSync(params: {
    workspaceDir: string;
    skillDir: string;
    skillKey: string;
    lockRead?: ClawHubSkillsLockfileStatusRead;
}): ClawHubSkillStatusLink | undefined;
export declare function resolveLocalSkillCardStatusSync(skillDir: string): LocalSkillCardStatus | undefined;
export declare function readLocalSkillCardContentSync(skillDir: string): string | undefined;
export declare function searchSkillsFromClawHub(params: {
    query?: string;
    limit?: number;
    baseUrl?: string;
}): Promise<ClawHubSkillSearchResult[]>;
export declare function resolveClawHubSkillVerificationTarget(params: {
    workspaceDir: string;
    slug: string;
    version?: string;
    tag?: string;
    baseUrl?: string;
}): Promise<ClawHubSkillVerificationTargetResult>;
export declare function installSkillFromClawHub(params: {
    workspaceDir: string;
    slug: string;
    version?: string;
    baseUrl?: string;
    force?: boolean;
    forceInstall?: boolean;
    logger?: Logger;
    config?: OpenClawConfig;
}): Promise<InstallClawHubSkillResult>;
export declare function updateSkillsFromClawHub(params: {
    workspaceDir: string;
    slug?: string;
    baseUrl?: string;
    forceInstall?: boolean;
    logger?: Logger;
    config?: OpenClawConfig;
}): Promise<UpdateClawHubSkillResult[]>;
export declare function readTrackedClawHubSkillSlugs(workspaceDir: string): Promise<string[]>;
export declare function untrackClawHubSkill(workspaceDir: string, slug: string): Promise<void>;
export {};
