import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as parseComparableSemver } from "./semver-compare-ComZ6Fah.js";
//#region src/infra/update-channels.ts
/** Default channel for npm/package installs when no config or version signal overrides it. */
const DEFAULT_PACKAGE_CHANNEL = "stable";
/**
* Env var carrying the *effective* update channel into `openclaw update finalize`
* (e.g. the git/dev channel a source update actually ran on) without making it a
* *requested* channel. Convergence uses it as a fallback; it is never persisted
* to `update.channel`. Mirrors the CLI post-core resume's effective/requested
* channel split (`OPENCLAW_UPDATE_POST_CORE_CHANNEL` vs `…_REQUESTED_CHANNEL`).
*/
const UPDATE_EFFECTIVE_CHANNEL_ENV = "OPENCLAW_UPDATE_EFFECTIVE_CHANNEL";
/** Git branch that represents the development update stream. */
const DEV_BRANCH = "main";
/** Normalizes config or CLI channel input to a supported update channel. */
function normalizeUpdateChannel(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return null;
	if (normalized === "stable" || normalized === "beta" || normalized === "dev") return normalized;
	return null;
}
/** Maps an OpenClaw update channel to the npm dist-tag used for package lookups. */
function channelToNpmTag(channel) {
	if (channel === "beta") return "beta";
	if (channel === "dev") return "dev";
	return "latest";
}
/** Returns whether a version/tag explicitly targets the beta stream. */
function isBetaTag(tag) {
	return /(?:^|[.-])beta(?:[.-]|$)/i.test(tag);
}
/** Detects prerelease tags, including legacy dot-beta tags and named prerelease channels. */
function isPrereleaseTag(tag) {
	const parsed = parseComparableSemver(tag, { normalizeLegacyDotBeta: true });
	if (parsed) return Boolean(parsed.prerelease?.some((part) => !/^[0-9]+$/.test(part)));
	return /(?:^|[.-])(alpha|beta|rc|pre|preview|canary|dev|next|nightly|experimental)(?:[.-]|$)/i.test(tag);
}
/** Returns whether a tag should be treated as a stable release candidate for updates. */
function isStableTag(tag) {
	return !isPrereleaseTag(tag);
}
/** Resolves registry update channel for package checks, preserving beta installs by default. */
function resolveRegistryUpdateChannel(params) {
	if (params.currentVersion && isBetaTag(params.currentVersion) && params.configChannel !== "beta" && params.configChannel !== "dev") return "beta";
	return params.configChannel ?? "stable";
}
/** Resolves the effective channel and the signal that selected it. */
function resolveEffectiveUpdateChannel(params) {
	if (params.currentVersion && isBetaTag(params.currentVersion) && params.configChannel !== "beta" && params.configChannel !== "dev") return {
		channel: "beta",
		source: "installed-version"
	};
	if (params.configChannel) return {
		channel: params.configChannel,
		source: "config"
	};
	if (params.installKind === "git") {
		const tag = params.git?.tag;
		if (tag) return {
			channel: isBetaTag(tag) ? "beta" : isStableTag(tag) ? "stable" : "dev",
			source: "git-tag"
		};
		const branch = params.git?.branch;
		if (branch && branch !== "HEAD") return {
			channel: "dev",
			source: "git-branch"
		};
		return {
			channel: "dev",
			source: "default"
		};
	}
	if (params.installKind === "package") return {
		channel: DEFAULT_PACKAGE_CHANNEL,
		source: "default"
	};
	return {
		channel: DEFAULT_PACKAGE_CHANNEL,
		source: "default"
	};
}
/** Formats an operator-facing channel label that includes the deciding source. */
function formatUpdateChannelLabel(params) {
	if (params.source === "config") return `${params.channel} (config)`;
	if (params.source === "git-tag") return params.gitTag ? `${params.channel} (${params.gitTag})` : `${params.channel} (tag)`;
	if (params.source === "git-branch") return params.gitBranch ? `${params.channel} (${params.gitBranch})` : `${params.channel} (branch)`;
	if (params.source === "installed-version") return "beta (installed version)";
	return `${params.channel} (default)`;
}
/** Resolves channel metadata plus display label for status and update UIs. */
function resolveUpdateChannelDisplay(params) {
	const channelInfo = resolveEffectiveUpdateChannel({
		configChannel: params.configChannel,
		currentVersion: params.currentVersion,
		installKind: params.installKind,
		git: params.gitTag || params.gitBranch ? {
			tag: params.gitTag ?? null,
			branch: params.gitBranch ?? null
		} : void 0
	});
	return {
		channel: channelInfo.channel,
		source: channelInfo.source,
		label: formatUpdateChannelLabel({
			channel: channelInfo.channel,
			source: channelInfo.source,
			gitTag: params.gitTag ?? null,
			gitBranch: params.gitBranch ?? null
		})
	};
}
//#endregion
export { formatUpdateChannelLabel as a, normalizeUpdateChannel as c, resolveUpdateChannelDisplay as d, channelToNpmTag as i, resolveEffectiveUpdateChannel as l, DEV_BRANCH as n, isBetaTag as o, UPDATE_EFFECTIVE_CHANNEL_ENV as r, isStableTag as s, DEFAULT_PACKAGE_CHANNEL as t, resolveRegistryUpdateChannel as u };
