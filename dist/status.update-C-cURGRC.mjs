import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BquD107I.mjs";
import { n as compareSemverStrings, t as checkUpdateStatus } from "./update-check-CWEQyown.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
//#region src/commands/status.update.ts
/** Chooses a registry tag only after the status check has identified the install. */
function resolveStatusRegistryUpdateChannel(params) {
	return resolveEffectiveUpdateChannel({
		configChannel: params.configChannel,
		currentVersion: VERSION,
		installKind: params.installKind,
		git: params.git
	}).channel;
}
async function getUpdateCheckResult(params) {
	const configChannel = normalizeUpdateChannel(params.updateConfigChannel);
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	let gitProbeTimeoutMs;
	const update = await checkUpdateStatus({
		root,
		timeoutMs: params.timeoutMs,
		fetchGit: params.fetchGit,
		includeRegistry: params.includeRegistry,
		onGitProbeTimeout: (timeoutMs) => {
			gitProbeTimeoutMs ??= timeoutMs;
		},
		resolveRegistryChannel: ({ installKind, git }) => resolveStatusRegistryUpdateChannel({
			configChannel,
			installKind,
			git
		})
	}).catch((error) => ({
		root,
		installKind: "unknown",
		packageManager: "unknown",
		error: {
			status: "failed",
			message: sanitizeTerminalText(formatErrorMessage(error))
		}
	}));
	if (gitProbeTimeoutMs !== void 0) update.error = {
		status: "unknown",
		timeoutMs: gitProbeTimeoutMs,
		message: `git probe did not finish within ${gitProbeTimeoutMs / 1e3} s (slow host)`
	};
	else if (update.git?.error) update.error = {
		status: "failed",
		message: sanitizeTerminalText(update.git.error)
	};
	if (update.installKind === "git" && update.git && !params.fetchGit) {
		const stale = await import("./update-run-ledger-D0iBe9hy.mjs").then(({ getLatestUpdateFetchFailure }) => getLatestUpdateFetchFailure()).catch(() => void 0);
		if (stale) update.git = {
			...update.git,
			stale,
			countsCached: true
		};
	}
	return update;
}
function resolveUpdateAvailability(update) {
	if (update.installKind === "host" || update.installKind === "immutable") return {
		available: false,
		hasGitUpdate: false,
		hasRegistryUpdate: false,
		latestVersion: null,
		gitBehind: null
	};
	const latestVersion = update.registry?.latestVersion ?? null;
	const registryCmp = latestVersion ? compareSemverStrings(VERSION, latestVersion) : null;
	const hasRegistryUpdate = !update.error && registryCmp != null && registryCmp < 0;
	const gitBehind = !update.error && update.installKind === "git" && typeof update.git?.behind === "number" ? update.git.behind : null;
	const hasGitUpdate = gitBehind != null && gitBehind > 0;
	return {
		available: hasGitUpdate || hasRegistryUpdate,
		hasGitUpdate,
		hasRegistryUpdate,
		latestVersion: hasRegistryUpdate ? latestVersion : null,
		gitBehind
	};
}
function formatUpdateAvailableHint(update) {
	const availability = resolveUpdateAvailability(update);
	if (!availability.available) return null;
	const details = [];
	if (availability.hasGitUpdate && availability.gitBehind != null) details.push(`git behind ${availability.gitBehind}${update.git?.countsCached ? " (cached)" : ""}`);
	if (availability.hasRegistryUpdate && availability.latestVersion) details.push(`npm ${availability.latestVersion}`);
	return `Update available${details.length > 0 ? ` (${details.join(" · ")})` : ""}. Run: ${formatCliCommand("openclaw update")}`;
}
function formatUpdateOneLiner(update) {
	if (update.installKind === "host" && update.installOwner) return `Update: ${formatInstallOwnerMessage(update.installOwner)}`;
	if (update.error) return `Update: update status ${update.error.status}: ${update.error.message}; run ${formatCliCommand("openclaw update status")}`;
	if (update.installKind === "immutable") {
		const install = update.immutable;
		return install ? `Update: immutable ${install.currentSha.slice(0, 12)}${install.prepared ? ` · prepared ${install.prepared.sha.slice(0, 12)}` : ""} · activation unavailable` : "Update: immutable · installation facts unavailable";
	}
	const parts = [];
	const appendRegistryUpdateSummary = () => {
		const registryLabel = update.registry?.tag && update.registry.tag !== "latest" ? `npm ${update.registry.tag}` : "npm latest";
		if (update.registry?.latestVersion) {
			const cmp = compareSemverStrings(VERSION, update.registry.latestVersion);
			if (cmp === 0) {
				if (update.installKind !== "git") parts.push("up to date");
				parts.push(`${registryLabel} ${update.registry.latestVersion}`);
			} else if (cmp != null && cmp < 0) parts.push(update.registry.tag && update.registry.tag !== "latest" ? `${registryLabel} update ${update.registry.latestVersion}` : `npm update ${update.registry.latestVersion}`);
			else parts.push(update.registry.tag === "extended-stable" ? `ahead of extended-stable (${update.registry.latestVersion})` : `${registryLabel} ${update.registry.latestVersion} (local newer)`);
			return;
		}
		if (update.registry?.error) {
			const errors = /* @__PURE__ */ new Map([
				["unsupported_git_channel", "extended-stable requires a package install"],
				["selector_missing", "npm extended-stable selector missing"],
				["selector_query_failed", "npm extended-stable query failed"],
				["exact_package_mismatch", "npm extended-stable exact package verification failed"]
			]);
			parts.push(errors.get(update.registry.reason ?? "") ?? `${registryLabel} unknown`);
		}
	};
	if (update.installKind === "git" && update.git) {
		const branch = update.git.branch ? `git ${update.git.branch}` : "git";
		parts.push(branch);
		if (update.git.upstream) parts.push(`↔ ${update.git.upstream}`);
		if (update.git.dirty === true) parts.push("dirty");
		if (update.git.stale) {
			const { failedAtMs, detail } = update.git.stale;
			parts.push(`update check stale: last update fetch failed ${formatTimeAgo(Math.max(0, Date.now() - failedAtMs))} (${detail})`);
			if (update.git.behind != null && update.git.ahead != null) parts.push(`cached: ahead ${update.git.ahead}, behind ${update.git.behind}`);
		} else if (update.git.behind != null && update.git.ahead != null) {
			if (update.git.behind === 0 && update.git.ahead === 0) parts.push("up to date");
			else if (update.git.behind > 0 && update.git.ahead === 0) parts.push(`behind ${update.git.behind}`);
			else if (update.git.behind === 0 && update.git.ahead > 0) parts.push(`ahead ${update.git.ahead}`);
			else if (update.git.behind > 0 && update.git.ahead > 0) parts.push(`diverged (ahead ${update.git.ahead}, behind ${update.git.behind})`);
		}
		if (update.git.fetchOk === false) parts.push("fetch failed");
		if (update.git.builtSha && update.git.sha && update.git.builtSha !== update.git.sha) parts.push(`stale build (running ${update.git.builtSha.slice(0, 8)}, run pnpm build)`);
		appendRegistryUpdateSummary();
	} else {
		parts.push(update.packageManager !== "unknown" ? update.packageManager : "pkg");
		appendRegistryUpdateSummary();
	}
	if (update.deps) {
		if (update.deps.status === "ok") parts.push("deps ok");
		if (update.deps.status === "missing") parts.push("deps missing");
	}
	return `Update: ${parts.join(" · ")}`;
}
//#endregion
export { resolveUpdateAvailability as a, resolveStatusRegistryUpdateChannel as i, formatUpdateOneLiner as n, getUpdateCheckResult as r, formatUpdateAvailableHint as t };
