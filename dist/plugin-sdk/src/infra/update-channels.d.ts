/** Release stream used to choose registry tags and update policy defaults. */
export type UpdateChannel = "stable" | "beta" | "dev";
/** Evidence source that decided the effective update channel. */
export type UpdateChannelSource = "config" | "git-tag" | "git-branch" | "installed-version" | "default";
/** Default channel for npm/package installs when no config or version signal overrides it. */
export declare const DEFAULT_PACKAGE_CHANNEL: UpdateChannel;
/** Default channel for source installs where branch metadata is unavailable. */
export declare const DEFAULT_GIT_CHANNEL: UpdateChannel;
/**
 * Env var carrying the *effective* update channel into `openclaw update finalize`
 * (e.g. the git/dev channel a source update actually ran on) without making it a
 * *requested* channel. Convergence uses it as a fallback; it is never persisted
 * to `update.channel`. Mirrors the CLI post-core resume's effective/requested
 * channel split (`OPENCLAW_UPDATE_POST_CORE_CHANNEL` vs `…_REQUESTED_CHANNEL`).
 */
export declare const UPDATE_EFFECTIVE_CHANNEL_ENV = "OPENCLAW_UPDATE_EFFECTIVE_CHANNEL";
/** Git branch that represents the development update stream. */
export declare const DEV_BRANCH = "main";
/** Normalizes config or CLI channel input to a supported update channel. */
export declare function normalizeUpdateChannel(value?: string | null): UpdateChannel | null;
/** Maps an OpenClaw update channel to the npm dist-tag used for package lookups. */
export declare function channelToNpmTag(channel: UpdateChannel): string;
/** Returns whether a version/tag explicitly targets the beta stream. */
export declare function isBetaTag(tag: string): boolean;
/** Detects prerelease tags, including legacy dot-beta tags and named prerelease channels. */
export declare function isPrereleaseTag(tag: string): boolean;
/** Returns whether a tag should be treated as a stable release candidate for updates. */
export declare function isStableTag(tag: string): boolean;
/** Resolves registry update channel for package checks, preserving beta installs by default. */
export declare function resolveRegistryUpdateChannel(params: {
    configChannel?: UpdateChannel | null;
    currentVersion?: string | null;
}): UpdateChannel;
/** Resolves the effective channel and the signal that selected it. */
export declare function resolveEffectiveUpdateChannel(params: {
    configChannel?: UpdateChannel | null;
    currentVersion?: string | null;
    installKind: "git" | "package" | "unknown";
    git?: {
        tag?: string | null;
        branch?: string | null;
    };
}): {
    channel: UpdateChannel;
    source: UpdateChannelSource;
};
/** Formats an operator-facing channel label that includes the deciding source. */
export declare function formatUpdateChannelLabel(params: {
    channel: UpdateChannel;
    source: UpdateChannelSource;
    gitTag?: string | null;
    gitBranch?: string | null;
}): string;
/** Resolves channel metadata plus display label for status and update UIs. */
export declare function resolveUpdateChannelDisplay(params: {
    configChannel?: UpdateChannel | null;
    currentVersion?: string | null;
    installKind: "git" | "package" | "unknown";
    gitTag?: string | null;
    gitBranch?: string | null;
}): {
    channel: UpdateChannel;
    source: UpdateChannelSource;
    label: string;
};
