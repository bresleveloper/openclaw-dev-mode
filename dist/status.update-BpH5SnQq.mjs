import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as compareSemverStrings, t as checkUpdateStatus } from "./update-check-CtYi2ZDp.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
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
/** Runs the update check using the configured update channel and current install root. */
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
		const stale = await import("./update-run-ledger-DW5PE1dq.mjs").then(({ getLatestUpdateFetchFailure }) => getLatestUpdateFetchFailure()).catch(() => void 0);
		if (stale) update.git = {
			...update.git,
			stale,
			countsCached: true
		};
	}
	return update;
}
/** Determines whether git and/or registry data indicate an available update. */
function resolveUpdateAvailability(update) {
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
/** Formats the actionable update hint shown in status footers. */
function formatUpdateAvailableHint(update) {
	const availability = resolveUpdateAvailability(update);
	if (!availability.available) return null;
	const details = [];
	if (availability.hasGitUpdate && availability.gitBehind != null) details.push(`git behind ${availability.gitBehind}${update.git?.countsCached ? " (cached)" : ""}`);
	if (availability.hasRegistryUpdate && availability.latestVersion) details.push(`npm ${availability.latestVersion}`);
	return `Update available${details.length > 0 ? ` (${details.join(" · ")})` : ""}. Run: ${formatCliCommand("openclaw update")}`;
}
/** Formats a compact one-line update summary for overview rows. */
function formatUpdateOneLiner(update) {
	if (update.error) return `Update: update status ${update.error.status}: ${update.error.message}; run ${formatCliCommand("openclaw update status")}`;
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
			if (update.registry.reason === "unsupported_git_channel") {
				parts.push("extended-stable requires a package install");
				return;
			}
			if (update.registry.reason === "selector_missing") {
				parts.push("npm extended-stable selector missing");
				return;
			}
			if (update.registry.reason === "selector_query_failed") {
				parts.push("npm extended-stable query failed");
				return;
			}
			if (update.registry.reason === "exact_package_mismatch") {
				parts.push("npm extended-stable exact package verification failed");
				return;
			}
			parts.push(`${registryLabel} unknown`);
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
