export { parseClawHubPluginSpec } from "./clawhub-spec.js";
export type ClawHubPackageFamily = "skill" | "code-plugin" | "bundle-plugin";
export type ClawHubPackageChannel = "official" | "community" | "private";
export type ClawHubPackageCompatibility = {
    pluginApiRange?: string;
    builtWithOpenClawVersion?: string;
    pluginSdkVersion?: string;
    minGatewayVersion?: string;
};
export type ClawHubPackageHostTarget = {
    os?: string | null;
    arch?: string | null;
    libc?: string | null;
    key?: string | null;
};
export type ClawHubPackageEnvironmentSummary = {
    requiresLocalDesktop?: boolean;
    requiresBrowser?: boolean;
    requiresAudioDevice?: boolean;
    requiresNetwork?: boolean;
    requiresExternalServices?: string[];
    requiresOsPermissions?: string[];
    supportsRemoteHost?: boolean;
    knownUnsupported?: string[];
};
export type ClawHubPackageArtifactSummary = {
    kind?: string | null;
    sha256?: string | null;
    size?: number | null;
    format?: string | null;
    npmIntegrity?: string | null;
    npmShasum?: string | null;
    npmTarballName?: string | null;
    npmUnpackedSize?: number | null;
    npmFileCount?: number | null;
    downloadUrl?: string | null;
    tarballUrl?: string | null;
    legacyDownloadUrl?: string | null;
};
export type ClawHubArtifactScanState = "pending" | "clean" | "suspicious" | "malicious" | "not-run" | (string & {});
export type ClawHubArtifactModerationState = "approved" | "quarantined" | "revoked" | (string & {});
export type ClawHubResolvedArtifact = {
    source: "clawhub";
    artifactKind: "legacy-zip";
    packageName: string;
    version: string;
    downloadUrl?: string | null;
    artifactSha256?: string | null;
    scanState?: ClawHubArtifactScanState | null;
    moderationState?: ClawHubArtifactModerationState | null;
} | {
    source: "clawhub";
    artifactKind: "npm-pack";
    packageName: string;
    version: string;
    downloadUrl?: string | null;
    npmIntegrity: string;
    npmShasum?: string | null;
    artifactSha256?: string | null;
    scanState?: ClawHubArtifactScanState | null;
    moderationState?: ClawHubArtifactModerationState | null;
};
export type ClawHubPackageArtifactResolverResponse = {
    package?: {
        name?: string | null;
        displayName?: string | null;
        family?: ClawHubPackageFamily | (string & {}) | null;
    } | null;
    version?: ({
        version?: string | null;
        createdAt?: number | null;
        changelog?: string | null;
        distTags?: string[];
        files?: unknown[];
        sha256hash?: string | null;
        compatibility?: ClawHubPackageCompatibility | null;
        artifact?: ClawHubPackageArtifactSummary | null;
        clawpack?: ClawHubPackageClawPackSummary | null;
    } & Record<string, unknown>) | string | null;
    artifact?: ClawHubResolvedArtifact | null;
};
export type ClawHubPackageClawPackSummary = {
    available: boolean;
    specVersion?: number | null;
    format?: string | null;
    sha256?: string | null;
    size?: number | null;
    fileCount?: number | null;
    manifestSha256?: string | null;
    npmIntegrity?: string | null;
    npmShasum?: string | null;
    npmTarballName?: string | null;
    builtAt?: number | null;
    buildVersion?: string | null;
    hostTargets?: ClawHubPackageHostTarget[];
    environment?: ClawHubPackageEnvironmentSummary | null;
    runtimeBundles?: unknown[];
};
export type ClawHubPackageListItem = {
    name: string;
    displayName: string;
    family: ClawHubPackageFamily;
    runtimeId?: string | null;
    channel: ClawHubPackageChannel;
    isOfficial: boolean;
    summary?: string | null;
    ownerHandle?: string | null;
    createdAt: number;
    updatedAt: number;
    latestVersion?: string | null;
    capabilityTags?: string[];
    executesCode?: boolean;
    verificationTier?: string | null;
    clawpackAvailable?: boolean;
    hostTargetKeys?: string[];
    environmentFlags?: string[];
    artifact?: ClawHubPackageArtifactSummary | null;
    clawpack?: ClawHubPackageClawPackSummary;
};
export type ClawHubPackageDetail = {
    package: (ClawHubPackageListItem & {
        tags?: Record<string, string>;
        compatibility?: ClawHubPackageCompatibility | null;
        capabilities?: {
            executesCode?: boolean;
            runtimeId?: string;
            capabilityTags?: string[];
            bundleFormat?: string;
            hostTargets?: string[];
            pluginKind?: string;
            channels?: string[];
            providers?: string[];
            hooks?: string[];
            bundledSkills?: string[];
        } | null;
        verification?: {
            tier?: string;
            scope?: string;
            summary?: string;
            sourceRepo?: string;
            sourceCommit?: string;
            hasProvenance?: boolean;
            scanStatus?: string;
        } | null;
        artifact?: ClawHubPackageArtifactSummary | null;
        clawpack?: ClawHubPackageClawPackSummary;
    }) | null;
    owner?: {
        handle?: string | null;
        displayName?: string | null;
        image?: string | null;
    } | null;
};
export type ClawHubPackageVersion = {
    package: {
        name: string;
        displayName: string;
        family: ClawHubPackageFamily;
    } | null;
    version: {
        version: string;
        createdAt: number;
        changelog: string;
        distTags?: string[];
        files?: Array<{
            path: string;
            size?: number;
            sha256: string;
            contentType?: string;
        }>;
        sha256hash?: string | null;
        compatibility?: ClawHubPackageCompatibility | null;
        capabilities?: ClawHubPackageDetail["package"] extends infer T ? T extends {
            capabilities?: infer C;
        } ? C : never : never;
        verification?: ClawHubPackageDetail["package"] extends infer T ? T extends {
            verification?: infer C;
        } ? C : never : never;
        artifact?: ClawHubPackageArtifactSummary | null;
        clawpack?: ClawHubPackageClawPackSummary;
    } | null;
};
export type ClawHubPackageSearchResult = {
    score: number;
    package: ClawHubPackageListItem;
};
export type ClawHubSkillSearchResult = {
    score: number;
    slug: string;
    displayName: string;
    summary?: string;
    version?: string;
    updatedAt?: number;
};
export type ClawHubSkillDetail = {
    skill: {
        slug: string;
        displayName: string;
        summary?: string;
        tags?: Record<string, string>;
        createdAt: number;
        updatedAt: number;
    } | null;
    latestVersion?: {
        version: string;
        createdAt: number;
        changelog?: string;
    } | null;
    metadata?: {
        os?: string[] | null;
        systems?: string[] | null;
    } | null;
    owner?: {
        handle?: string | null;
        displayName?: string | null;
        image?: string | null;
    } | null;
};
export type ClawHubSkillInstallResolutionResponse = {
    ok: true;
    slug: string;
    installKind: "archive";
    archive: {
        version: string;
        downloadUrl: string;
    };
} | {
    ok: true;
    slug: string;
    installKind: "github";
    github: {
        repo: string;
        path: string;
        commit: string;
        contentHash: string;
        sourceUrl: string;
    };
} | {
    ok: false;
    slug: string;
    reason: string;
    message: string;
    status: number;
};
export type ClawHubSkillVerificationDecision = "pass" | "fail" | (string & {});
export type ClawHubSkillVerificationResponse = {
    schema: "clawhub.skill.verify.v1";
    ok: boolean;
    decision: ClawHubSkillVerificationDecision;
    reasons: string[];
    skill: unknown;
    publisher: unknown;
    version: unknown;
    card: unknown;
    artifact: unknown;
    provenance: unknown;
    security: unknown;
    signature: unknown;
};
export type ClawHubSkillSecurityVerdictRequestItem = {
    slug: string;
    version: string;
};
export type ClawHubSkillSecurityVerdictItem = {
    ok: boolean;
    decision: ClawHubSkillVerificationDecision;
    reasons: string[];
    requestedSlug: string;
    requestedVersion: string;
    slug?: string | null;
    version?: string | null;
    displayName?: string | null;
    publisherHandle?: string | null;
    publisherDisplayName?: string | null;
    createdAt?: number | null;
    checkedAt?: number | null;
    skillUrl?: string | null;
    securityAuditUrl?: string | null;
    security?: unknown;
    error?: {
        code?: string;
        message?: string;
    };
};
export type ClawHubSkillSecurityVerdictsResponse = {
    schema: "clawhub.skill.security-verdicts.v1";
    items: ClawHubSkillSecurityVerdictItem[];
};
export type ClawHubDownloadResult = {
    archivePath: string;
    integrity: string;
    sha256Hex: string;
    artifact: "archive" | "clawpack";
    clawpackHeaderSha256?: string;
    clawpackHeaderSpecVersion?: number;
    npmIntegrity?: string;
    npmShasum?: string;
    npmTarballName?: string;
    cleanup: () => Promise<void>;
};
export type ClawHubInstallTelemetrySkill = {
    version?: string | null;
};
type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
export declare class ClawHubRequestError extends Error {
    readonly status: number;
    readonly requestPath: string;
    readonly responseBody: string;
    constructor(params: {
        path: string;
        status: number;
        body: string;
    });
}
export declare function resolveClawHubAuthToken(): Promise<string | undefined>;
/** Resolves the configured ClawHub base URL, falling back to the default public host. */
export declare function resolveClawHubBaseUrl(baseUrl?: string): string;
export declare function isDefaultClawHubBaseUrl(baseUrl?: string): boolean;
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
export declare function normalizeClawHubSha256Integrity(value: string): string | null;
/** Normalizes ClawHub SHA-256 metadata into lowercase hex form. */
export declare function normalizeClawHubSha256Hex(value: string): string | null;
export declare function fetchClawHubPackageDetail(params: {
    name: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubPackageDetail>;
export declare function fetchClawHubPackageVersion(params: {
    name: string;
    version: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubPackageVersion>;
export declare function fetchClawHubPackageArtifact(params: {
    name: string;
    version: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubPackageArtifactResolverResponse>;
export declare function searchClawHubPackages(params: {
    query: string;
    family?: ClawHubPackageFamily;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
    limit?: number;
}): Promise<ClawHubPackageSearchResult[]>;
export declare function searchClawHubSkills(params: {
    query: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
    limit?: number;
}): Promise<ClawHubSkillSearchResult[]>;
export declare function fetchClawHubSkillDetail(params: {
    slug: string;
    ownerHandle?: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubSkillDetail>;
export declare function fetchClawHubSkillInstallResolution(params: {
    slug: string;
    ownerHandle?: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
    forceInstall?: boolean;
}): Promise<ClawHubSkillInstallResolutionResponse>;
export declare function fetchClawHubSkillVerification(params: {
    slug: string;
    ownerHandle?: string;
    version?: string;
    tag?: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubSkillVerificationResponse>;
export declare function fetchClawHubSkillSecurityVerdicts(params: {
    items: ClawHubSkillSecurityVerdictRequestItem[];
    baseUrl?: string;
    token?: string;
    skipAuth?: boolean;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubSkillSecurityVerdictsResponse>;
export declare function fetchClawHubSkillCard(params: {
    slug?: string;
    ownerHandle?: string;
    url?: string;
    version?: string;
    tag?: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<string>;
export declare function downloadClawHubPackageArchive(params: {
    name: string;
    version?: string;
    tag?: string;
    artifact?: "archive" | "clawpack";
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubDownloadResult>;
export declare function downloadClawHubSkillArchive(params: {
    slug: string;
    ownerHandle?: string;
    version?: string;
    tag?: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubDownloadResult>;
export declare function downloadClawHubSkillArchiveUrl(params: {
    url: string;
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubDownloadResult>;
export declare function downloadClawHubGitHubSkillArchive(params: {
    repo: string;
    commit: string;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<ClawHubDownloadResult>;
export declare function reportClawHubSkillInstallTelemetry(params: {
    baseUrl?: string;
    token?: string;
    root: string;
    skills: Record<string, ClawHubInstallTelemetrySkill>;
    timeoutMs?: number;
    fetchImpl?: FetchLike;
}): Promise<void>;
/** Resolves the preferred latest package version from detail metadata. */
export declare function resolveLatestVersionFromPackage(detail: ClawHubPackageDetail): string | null;
/** Checks whether a host plugin API version satisfies a ClawHub plugin API range. */
export declare function satisfiesPluginApiRange(pluginApiVersion: string, pluginApiRange?: string | null): boolean;
/** Checks whether the current gateway version satisfies a package minimum gateway version. */
export declare function satisfiesGatewayMinimum(currentVersion: string, minGatewayVersion?: string | null): boolean;
