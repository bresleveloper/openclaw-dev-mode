import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as gitCommitPrefixesMatch } from "./git-commit-eT_9FBYG.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import "./backoff-BrzXG7iD.mjs";
import { u as resolveEffectiveUpdateChannel } from "./update-channels-BquD107I.mjs";
import { t as checkUpdateStatus } from "./update-check-eI0vGW6V.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-DH-onosx.mjs";
import { y as readVerifiedGitUpdateReceipt } from "./restart-sentinel-CWHFSDjo.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
//#region src/infra/update-install-status.ts
async function resolveStartupInstallStatus(fetchRemoteGit, signal) {
	const [root, installReceipt] = await Promise.all([resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	}), readVerifiedGitUpdateReceipt()]);
	const gitUpstreamFallback = installReceipt?.upstreamRef && root && updateInstallRootsMatch(root, installReceipt.root) ? {
		currentSha: installReceipt.sha,
		upstreamRef: installReceipt.upstreamRef
	} : void 0;
	const timeoutMs = resolveGatewayStartupTiming().deadlineMs;
	const options = {
		root,
		signal,
		...fetchRemoteGit ? {} : { timeoutMs },
		fetchGit: fetchRemoteGit,
		includeRegistry: false,
		...fetchRemoteGit ? { useDetachedDevUpstream: true } : {},
		...gitUpstreamFallback ? { gitUpstreamFallback } : {}
	};
	for (let attempt = 0;; attempt++) {
		let status;
		let timedOut = false;
		let failure;
		try {
			status = await checkUpdateStatus({
				...options,
				...!fetchRemoteGit ? { onGitProbeTimeout: () => {
					timedOut = true;
				} } : {}
			});
			signal.throwIfAborted();
			if (!timedOut) return {
				root,
				status,
				installReceipt
			};
		} catch (error) {
			if (!timedOut) throw error;
			failure = error;
		}
		signal.throwIfAborted();
		if (attempt === 0) {
			await sleepWithAbort(1e3, signal);
			continue;
		}
		const message = failure ? formatErrorMessage(failure) : `Git update facts unavailable after two ${timeoutMs / 1e3}s probes`;
		status = {
			...status ?? {
				root,
				installKind: "unknown",
				packageManager: "unknown"
			},
			...status?.git ? { git: {
				...status.git,
				error: message
			} } : {},
			error: {
				status: "failed",
				message,
				timeoutMs
			}
		};
		return {
			root,
			status,
			installReceipt
		};
	}
}
async function prepareStartupUpdateInstall(initialize, configChannel, signal) {
	let installStatus = await initialize();
	signal.throwIfAborted();
	if (installStatus.status.error) throw new Error(installStatus.status.error.message);
	const resolveChannel = () => resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		...installStatus.status
	}).channel;
	let channel = resolveChannel();
	if (channel === "dev" && installStatus.status.installKind === "git") {
		installStatus = await resolveStartupInstallStatus(true, signal);
		signal.throwIfAborted();
		channel = resolveChannel();
	}
	const { status, installReceipt, root } = installStatus;
	const readOnlySchedule = status.installKind === "host" || status.installKind === "immutable" ? withUpdateInstallStatus({
		channel,
		autoEnabled: false
	}, status, false, installReceipt, root) : void 0;
	return {
		installStatus,
		channel,
		readOnlySchedule
	};
}
function resolveGitInstalledAtMs(git, installReceipt, root) {
	return installReceipt && root !== null && updateInstallRootsMatch(root, installReceipt.root) && git.sha && gitCommitPrefixesMatch(installReceipt.sha, git.sha) ? installReceipt.installedAtMs : void 0;
}
function resolveGitScheduleStatus(update, installReceipt, root) {
	if (update.error?.timeoutMs) return {
		status: "unavailable",
		reason: "git-unavailable"
	};
	if (update.installKind !== "git") return;
	const git = update.git;
	const installedAtMs = git ? resolveGitInstalledAtMs(git, installReceipt, root) : void 0;
	const metadata = git ? {
		...git.sha ? { currentSha: git.sha } : {},
		...typeof git.commitAtMs === "number" ? { commitAtMs: git.commitAtMs } : {},
		...installedAtMs === void 0 ? {} : { installedAtMs }
	} : {};
	if (!git || git.error || !git.sha) return {
		...metadata,
		status: "unavailable",
		reason: "git-unavailable"
	};
	if (!git.upstream) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream"
	};
	if (git.fetchOk !== true) return {
		...metadata,
		status: "unavailable",
		reason: "fetch-failed"
	};
	if (!git.upstreamSha) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream-sha"
	};
	if (git.ahead === null || git.behind === null) return {
		...metadata,
		status: "unavailable",
		reason: "comparison-failed"
	};
	const comparison = {
		...metadata,
		upstreamSha: git.upstreamSha,
		...git.repositoryUrl ? { repositoryUrl: git.repositoryUrl } : {}
	};
	if (git.ahead > 0 && git.behind > 0) return {
		...comparison,
		status: "diverged",
		commitsAhead: git.ahead,
		commitsBehind: git.behind
	};
	if (git.behind > 0) return {
		...comparison,
		status: "behind",
		commitsBehind: git.behind
	};
	if (git.ahead > 0) return {
		...comparison,
		status: "ahead",
		commitsAhead: git.ahead
	};
	return {
		...comparison,
		status: "current"
	};
}
function withUpdateInstallStatus(schedule, update, includeGitStatus, installReceipt, root) {
	if (update.installKind === "host") {
		const { install: _install, target: _target, campaign: _campaign, ...rest } = schedule;
		return {
			...rest,
			autoEnabled: false
		};
	}
	if (update.installKind === "immutable") {
		const { target: _target, campaign: _campaign, ...rest } = schedule;
		return {
			...rest,
			autoEnabled: false,
			install: {
				kind: "immutable",
				...update.immutable ? { immutable: update.immutable } : {}
			}
		};
	}
	const git = includeGitStatus ? resolveGitScheduleStatus(update, installReceipt, root) : void 0;
	return {
		...schedule,
		install: {
			kind: update.installKind,
			...git ? { git } : {}
		}
	};
}
//#endregion
export { resolveStartupInstallStatus as n, withUpdateInstallStatus as r, prepareStartupUpdateInstall as t };
