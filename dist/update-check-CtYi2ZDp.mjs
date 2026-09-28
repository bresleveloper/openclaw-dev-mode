import { i as normalizeLegacyDotBetaVersion, n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as channelToNpmTag, l as resolveDevUpstreamRefs, n as DEV_BRANCH, p as selectNpmChannelVersion } from "./update-channels-BDINqyML.mjs";
import { l as createUpdatePreflightFailure } from "./update-failure-facts-DiyYJNo1.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as readPackageName } from "./package-json-skO3uhlG.mjs";
import { O as updateInstallRootsMatch } from "./restart-sentinel-KM6PPxhT.mjs";
import "./npm-install-env-D6spEEnI.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-wgYVxidq.mjs";
import { d as detectGlobalInstallManagerForRoot, j as detectPackageManager$1 } from "./update-runner-command-DZBJTDir.mjs";
import { r as readBuiltRuntimeCommit } from "./update-git-runtime-CAxWdF8c.mjs";
import { t as describeUpdateInstallRoot } from "./update-runner-install-surface-DTETdBMu.mjs";
import { i as executeGitCommand, n as createGitCommandError } from "./git-exec-B6ZpVpQV.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import hostedGitInfo from "hosted-git-info";
//#region src/infra/update-git-metadata.ts
const DEV_COMMIT_LIMIT = 5;
const DEV_COMMIT_SUBJECT_MAX_LENGTH = 120;
const DEV_COMMIT_LOG_MAX_OUTPUT_BYTES = 8192;
async function resolveGitRepositoryMetadata(readGit, tracking, branch) {
	const remote = tracking ? tracking.fetch === "prune" ? await readGit("config", "--get", `branch.${branch}.remote`) : tracking.fetch.remote : null;
	const remoteUrl = remote && remote !== "." ? await readGit("remote", "get-url", "--", remote) : null;
	const repository = remoteUrl && /^(?:(?:https?|ssh|git):\/\/|git@github\.com:)/u.test(remoteUrl) ? hostedGitInfo.fromUrl(remoteUrl) : void 0;
	const repositoryUrl = repository?.type === "github" ? repository.browse({ noCommittish: true }) : void 0;
	return repositoryUrl ? { repositoryUrl } : {};
}
async function resolveDevGitCommits(params) {
	const result = await executeGitCommand(params.root, [
		"log",
		"--format=%h%x09%s",
		`--max-count=${DEV_COMMIT_LIMIT}`,
		`${params.currentSha}..${params.upstreamSha}`
	], {
		timeoutMs: 2500,
		signal: params.signal,
		killProcessTree: true,
		maxOutputBytes: {
			stdout: DEV_COMMIT_LOG_MAX_OUTPUT_BYTES,
			stderr: 1024
		}
	}).catch(() => null);
	if (!result || result.code !== 0 || result.termination !== "exit") return [];
	return result.stdout.split("\n").flatMap((line) => {
		const separator = line.indexOf("	");
		const sha = separator < 0 ? "" : line.slice(0, separator).trim();
		if (!sha) return [];
		return [{
			sha,
			subject: line.slice(separator + 1).trim().slice(0, DEV_COMMIT_SUBJECT_MAX_LENGTH)
		}];
	}).slice(0, DEV_COMMIT_LIMIT);
}
//#endregion
//#region src/infra/update-check.ts
const PUBLIC_NPM_REGISTRY_URL = "https://registry.npmjs.org/";
const PUBLIC_NPM_PACKAGE_NAME = "openclaw";
function isLoopbackNpmRegistry(raw) {
	try {
		const url = new URL(raw);
		return (url.protocol === "http:" || url.protocol === "https:") && (url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "[::1]");
	} catch {
		return false;
	}
}
function resolveExtendedStableRegistryTarget(params) {
	const env = params.env ?? process.env;
	const packageName = params.packageName?.trim() || PUBLIC_NPM_PACKAGE_NAME;
	const packageSpecOverride = env.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim();
	const registryOverride = env.NPM_CONFIG_REGISTRY?.trim() || env.npm_config_registry?.trim() || "";
	if (packageSpecOverride === packageName && isLoopbackNpmRegistry(registryOverride)) return {
		registryUrl: registryOverride,
		packageName
	};
	return {
		registryUrl: PUBLIC_NPM_REGISTRY_URL,
		packageName: PUBLIC_NPM_PACKAGE_NAME
	};
}
/** Resolves the extended-stable selector and verifies its exact package manifest. */
async function resolveExtendedStablePackage(params) {
	if (params.installKind === "git") return {
		status: "failed",
		reason: "unsupported_git_channel"
	};
	const timeoutMs = params.timeoutMs ?? 3e5;
	const registryTarget = resolveExtendedStableRegistryTarget(params);
	const selector = await fetchNpmPackageTargetStatus({
		target: "extended-stable",
		timeoutMs,
		...registryTarget
	});
	if (!selector.version) return {
		status: "failed",
		reason: selector.error === "HTTP 404" ? "selector_missing" : "selector_query_failed"
	};
	if ((await fetchNpmPackageTargetStatus({
		target: selector.version,
		timeoutMs,
		...registryTarget
	})).version !== selector.version) return {
		status: "failed",
		reason: "exact_package_mismatch"
	};
	return {
		status: "resolved",
		selector: "extended-stable",
		version: selector.version,
		packageSpec: `${registryTarget.packageName}@${selector.version}`
	};
}
function formatGitInstallLabel(update) {
	if (update.installKind !== "git") return null;
	const shortSha = update.git?.sha ? update.git.sha.slice(0, 8) : null;
	const branch = update.git?.branch && update.git.branch !== "HEAD" ? update.git.branch : null;
	const tag = update.git?.tag ?? null;
	return [
		branch ?? (tag ? "detached" : "git"),
		tag ? `tag ${tag}` : null,
		shortSha ? `@ ${shortSha}` : null
	].filter(Boolean).join(" · ");
}
async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}
async function detectPackageManager(root) {
	return await detectPackageManager$1(root) ?? "unknown";
}
/** Classify installation ownership without reading Git history or dependency state. */
async function resolveUpdateInstallKind(root, options = {}) {
	options.signal?.throwIfAborted();
	if (!root) return "unknown";
	const result = await runUpdateGitCommand(root, ["rev-parse", "--show-toplevel"], {
		...options,
		timeoutMs: options.timeoutMs ?? 12e5
	});
	options.signal?.throwIfAborted();
	if (result?.termination === "timeout") throw createGitCommandError("git rev-parse --show-toplevel", result);
	const gitRoot = result?.code === 0 ? result.stdout.trim() : "";
	if (gitRoot && updateInstallRootsMatch(gitRoot, root)) return "git";
	const packageName = await readPackageName(root);
	options.signal?.throwIfAborted();
	return packageName === PUBLIC_NPM_PACKAGE_NAME ? "package" : "unknown";
}
/** Read the install and local Git identity needed to select an update channel. */
async function resolveUpdateInstallIdentity(params) {
	const { root, ...options } = params;
	const installKind = await resolveUpdateInstallKind(root, options);
	const git = installKind === "git" && root ? await readGitUpdateIdentity(root, options) : void 0;
	options.signal?.throwIfAborted();
	return {
		installKind,
		git
	};
}
async function runUpdateGitCommand(root, args, options) {
	if (options.signal?.aborted) return null;
	const { onGitProbeTimeout, ...commandOptions } = options;
	const result = await executeGitCommand(root, args, {
		...commandOptions,
		killProcessTree: true
	}).catch(() => null);
	if (result?.termination === "timeout" && args[0] !== "fetch") onGitProbeTimeout?.(result.timeoutMs);
	return result;
}
async function readGitUpdateIdentity(root, options = {}) {
	const [branch, tag] = await Promise.all([[
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	], [
		"describe",
		"--tags",
		"--exact-match"
	]].map((args) => runUpdateGitCommand(root, args, {
		...options,
		timeoutMs: options.timeoutMs ?? 6e3
	})));
	return branch?.code === 0 ? {
		branch: branch.stdout.trim() || null,
		tag: tag?.code === 0 ? tag.stdout.trim() || null : null
	} : {
		branch: null,
		tag: null,
		error: branch?.stderr?.trim() || "git unavailable"
	};
}
async function checkGitUpdateStatus(params) {
	const timeoutMs = params.timeoutMs ?? (params.fetch ? 3e5 : 6e3);
	const root = path.resolve(params.root);
	const runGit = (...args) => runUpdateGitCommand(root, args, {
		timeoutMs,
		signal: params.signal,
		onGitProbeTimeout: params.onGitProbeTimeout
	});
	const readGit = async (...args) => {
		const result = await runGit(...args);
		return result?.code === 0 ? result.stdout.trim() || null : null;
	};
	const base = {
		root,
		sha: null,
		tag: null,
		branch: null,
		upstream: null,
		upstreamSha: null,
		commitAtMs: null,
		dirty: null,
		ahead: null,
		behind: null,
		fetchOk: null
	};
	const [{ branch, tag, error }, sha, commitAtRaw, dirtyRes] = await Promise.all([
		params.identity,
		readGit("rev-parse", "HEAD"),
		readGit("show", "-s", "--format=%ct", "HEAD"),
		runGit("status", "--porcelain", "--", ":!dist/control-ui/")
	]);
	if (error) return {
		...base,
		error
	};
	const trackingRevisions = branch === "HEAD" ? params.useDetachedDevUpstream ? resolveDevUpstreamRefs(true, [`refs/remotes/origin/${DEV_BRANCH}`]) : [] : resolveDevUpstreamRefs(false);
	let tracking = null;
	for (const revision of trackingRevisions) {
		const display = await readGit("rev-parse", "--abbrev-ref", "--symbolic-full-name", revision);
		if (!display) continue;
		let fetch = "prune";
		if (branch === "HEAD") {
			if (revision === `main@{upstream}`) {
				const [remote, mergeRef] = await Promise.all([readGit("config", "--get", `branch.${DEV_BRANCH}.remote`), readGit("config", "--get", `branch.${DEV_BRANCH}.merge`)]);
				if (!remote || !mergeRef) continue;
				fetch = {
					remote,
					mergeRef
				};
			} else fetch = {
				remote: "origin",
				mergeRef: `refs/heads/${DEV_BRANCH}`
			};
		}
		tracking = {
			revision,
			display,
			fetch
		};
		break;
	}
	const commitAtSeconds = Number.parseInt(commitAtRaw ?? "", 10);
	const commitAtMs = Number.isSafeInteger(commitAtSeconds) ? commitAtSeconds * 1e3 : null;
	const receiptUpstream = !tracking && branch === "HEAD" && sha && params.upstreamFallback?.currentSha.trim().toLowerCase() === sha.toLowerCase() ? params.upstreamFallback.upstreamRef.trim() || null : null;
	const upstream = tracking?.display ?? receiptUpstream;
	const upstreamSource = tracking ? "tracking" : receiptUpstream ? "receipt" : void 0;
	const dirty = dirtyRes && dirtyRes.code === 0 ? dirtyRes.stdout.trim().length > 0 : null;
	const fetchTarget = tracking?.fetch && tracking.fetch !== "prune" ? [
		"--",
		tracking.fetch.remote,
		`+${tracking.fetch.mergeRef}:refs/remotes/${tracking.display}`
	] : ["--prune"];
	const fetchOk = params.fetch ? (await runGit("fetch", "--quiet", ...fetchTarget))?.code === 0 : null;
	const upstreamRevision = `${upstreamSource === "tracking" ? tracking?.revision : upstream}^{commit}`;
	const upstreamCommit = (!params.fetch || fetchOk === true) && upstream && sha ? await readGit("rev-parse", "--verify", upstreamRevision) : null;
	const mergeBase = sha && upstreamCommit ? await readGit("merge-base", sha, upstreamCommit) : null;
	const parsed = (sha && upstreamCommit && mergeBase ? await readGit("rev-list", "--left-right", "--count", `${sha}...${upstreamCommit}`) : null)?.match(/^(\d+)\s+(\d+)$/u);
	return {
		root,
		sha,
		tag,
		branch,
		upstream,
		...upstreamSource ? { upstreamSource } : {},
		upstreamSha: upstreamCommit,
		...await resolveGitRepositoryMetadata(readGit, tracking, branch),
		commitAtMs,
		dirty,
		ahead: parsed ? Number(parsed[1]) : null,
		behind: parsed ? Number(parsed[2]) : null,
		fetchOk,
		builtSha: await readBuiltRuntimeCommit(root)
	};
}
async function resolveDepsMarker(params) {
	const root = params.root;
	if (params.manager === "pnpm") return {
		lockfilePath: path.join(root, "pnpm-lock.yaml"),
		markerPath: path.join(root, "node_modules", ".modules.yaml")
	};
	if (params.manager === "bun") {
		const textLockfilePath = path.join(root, "bun.lock");
		return {
			lockfilePath: await exists(textLockfilePath) ? textLockfilePath : path.join(root, "bun.lockb"),
			markerPath: path.join(root, "node_modules")
		};
	}
	if (params.manager === "npm") return {
		lockfilePath: path.join(root, "package-lock.json"),
		markerPath: path.join(root, "node_modules")
	};
	return {
		lockfilePath: null,
		markerPath: null
	};
}
async function checkDepsStatus(params) {
	const { lockfilePath, markerPath } = await resolveDepsMarker({
		root: path.resolve(params.root),
		manager: params.manager
	});
	if (!lockfilePath || !markerPath) return {
		manager: params.manager,
		status: "unknown",
		lockfilePath,
		markerPath,
		reason: "unknown package manager"
	};
	const lockExists = await exists(lockfilePath);
	const markerExists = await exists(markerPath);
	if (!lockExists) return {
		manager: params.manager,
		status: "unknown",
		lockfilePath,
		markerPath,
		reason: "lockfile missing"
	};
	if (!markerExists) return {
		manager: params.manager,
		status: "missing",
		lockfilePath,
		markerPath,
		reason: "node_modules marker missing"
	};
	return {
		manager: params.manager,
		status: "ok",
		lockfilePath,
		markerPath
	};
}
async function fetchNpmLatestVersion(params) {
	const res = await fetchNpmTagVersion({
		tag: "latest",
		timeoutMs: params?.timeoutMs,
		cwd: params?.cwd,
		env: params?.env,
		runCommand: params?.runCommand
	});
	return {
		latestVersion: res.version,
		error: res.error
	};
}
async function fetchNpmRegistryVersionForChannel(params) {
	const res = await resolveNpmChannelTag({
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	return {
		latestVersion: res.version,
		tag: res.tag,
		error: res.error,
		...res.reason ? {
			error: res.reason,
			reason: res.reason
		} : {}
	};
}
async function fetchNpmTagVersion(params) {
	const res = await fetchNpmPackageTargetStatus({
		target: params.tag,
		timeoutMs: params.timeoutMs,
		spec: params.spec,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	return {
		tag: params.tag,
		version: res.version,
		error: res.error
	};
}
async function resolveNpmChannelTag(params) {
	const channelTag = channelToNpmTag(params.channel);
	if (params.channel === "extended-stable") {
		const resolved = await resolveExtendedStablePackage({
			installKind: "package",
			timeoutMs: params.timeoutMs
		});
		return resolved.status === "resolved" ? {
			tag: resolved.selector,
			version: resolved.version
		} : {
			tag: channelTag,
			version: null,
			reason: resolved.reason
		};
	}
	const fetchTag = (tag) => fetchNpmTagVersion({
		tag,
		timeoutMs: params.timeoutMs,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	if (params.channel !== "beta") return await fetchTag(channelTag);
	const [channelStatus, latestStatus] = await Promise.all([fetchTag(channelTag), fetchTag("latest")]);
	return selectNpmChannelVersion(channelStatus, latestStatus);
}
function compareSemverStrings(a, b) {
	if (a && b) {
		const openClawReleaseCmp = compareOpenClawReleaseVersions(a, b);
		if (openClawReleaseCmp != null) return openClawReleaseCmp;
	}
	const normalizedA = a ? normalizeLegacyDotBetaVersion(a) : null;
	const normalizedB = b ? normalizeLegacyDotBetaVersion(b) : null;
	return normalizedA && normalizedB ? compareValidSemver(normalizedA, normalizedB) : null;
}
async function checkUpdateStatus(params) {
	params.signal?.throwIfAborted();
	const timeoutMs = params.timeoutMs ?? 3e5;
	const resolveRegistryChannel = (status) => params.registryChannel ?? params.resolveRegistryChannel?.(status);
	const fetchRegistry = (registryChannel) => registryChannel ? fetchNpmRegistryVersionForChannel({
		channel: registryChannel,
		timeoutMs
	}) : fetchNpmLatestVersion({ timeoutMs });
	const root = params.root ? path.resolve(params.root) : null;
	if (!root) {
		const registryChannel = resolveRegistryChannel({ installKind: "unknown" });
		const registry = params.includeRegistry ? await fetchRegistry(registryChannel) : void 0;
		params.signal?.throwIfAborted();
		return {
			root: null,
			installKind: "unknown",
			packageManager: "unknown",
			registry
		};
	}
	const installKind = await resolveUpdateInstallKind(root, {
		signal: params.signal,
		timeoutMs: params.timeoutMs,
		onGitProbeTimeout: params.onGitProbeTimeout
	});
	const isGit = installKind === "git";
	if (installKind === "unknown") {
		const failure = createUpdatePreflightFailure("installation-unclassified", `${await describeUpdateInstallRoot(root)} Service unit target: not inspected by update status installation checks; run openclaw gateway status --deep.`);
		params.signal?.throwIfAborted();
		return {
			root,
			installKind,
			packageManager: "unknown",
			error: {
				status: "unknown",
				code: "installation-unclassified",
				message: failure.message
			}
		};
	}
	const packageManager = isGit ? await detectPackageManager(root) : await detectGlobalInstallManagerForRoot(async (argv, options) => {
		params.signal?.throwIfAborted();
		return runCommandWithTimeout(argv, {
			...options,
			signal: params.signal,
			killProcessTree: true
		});
	}, root, timeoutMs) ?? "unknown";
	params.signal?.throwIfAborted();
	const identity = isGit ? readGitUpdateIdentity(root, {
		timeoutMs: params.timeoutMs ?? (params.fetchGit ? 3e5 : 6e3),
		signal: params.signal,
		onGitProbeTimeout: params.onGitProbeTimeout
	}) : void 0;
	const registryPromise = Promise.resolve(identity).then((git) => {
		if (params.signal?.aborted) return;
		const registryChannel = resolveRegistryChannel({
			installKind,
			git
		});
		return params.includeRegistry ? registryChannel === "extended-stable" && isGit ? {
			latestVersion: null,
			tag: "extended-stable",
			error: "unsupported_git_channel",
			reason: "unsupported_git_channel"
		} : fetchRegistry(registryChannel) : void 0;
	});
	const [git, deps, registry] = await Promise.all([
		identity ? checkGitUpdateStatus({
			root,
			identity,
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			onGitProbeTimeout: params.onGitProbeTimeout,
			fetch: Boolean(params.fetchGit),
			useDetachedDevUpstream: params.useDetachedDevUpstream,
			upstreamFallback: params.gitUpstreamFallback
		}) : Promise.resolve(void 0),
		checkDepsStatus({
			root,
			manager: packageManager
		}),
		registryPromise
	]);
	params.signal?.throwIfAborted();
	return {
		root,
		installKind,
		packageManager,
		git,
		deps,
		registry
	};
}
//#endregion
export { resolveExtendedStablePackage as a, resolveUpdateInstallKind as c, formatGitInstallLabel as i, resolveDevGitCommits as l, compareSemverStrings as n, resolveNpmChannelTag as o, fetchNpmTagVersion as r, resolveUpdateInstallIdentity as s, checkUpdateStatus as t };
