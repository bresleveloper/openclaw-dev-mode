import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { i as normalizeLegacyDotBetaVersion, n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-B_IER0ZB.mjs";
import { a as channelToNpmTag, f as selectNpmChannelVersion, n as DEV_BRANCH } from "./update-channels-l0GQCX9n.mjs";
import { m as createUpdatePreflightFailure } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import "./npm-install-env-B76s0YXJ.mjs";
import { a as executeGitCommand, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { t as detectPackageManager } from "./detect-package-manager-Bj0ojQ-Y.mjs";
import { n as readInstallOwner } from "./install-owner-BPfYmnil.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-B_9onsoT.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-Nv-hNWki.mjs";
import { a as resolveGitRepositoryMetadata, o as resolveGitUpdateTrackingRef, r as readGitUpdateFetchTarget } from "./update-git-metadata-Bci7Iprk.mjs";
import { a as readGitRuntimeArtifactStatus, r as readBuiltRuntimeCommit } from "./update-git-runtime-S2Kgafdv.mjs";
import { a as detectGlobalInstallManagerForRoot } from "./update-global-BlXQRfes.mjs";
import { n as buildUpdateCommandRunner } from "./update-runner-command-DETznIV7.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/update-runner-install-surface.ts
function resolveUnmanagedUpdateInstallReason() {
	return isContainerEnvironment() ? "container-image-install" : "unmanaged-package-install";
}
async function looksLikeGitCheckout(root) {
	try {
		await fs.access(path.join(root, ".git"));
		return true;
	} catch {
		return false;
	}
}
/** Evidence for an unresolved owner, not permission to mutate an arbitrary directory. */
async function describeUpdateInstallRoot(root) {
	const [git, modules, packageName] = await Promise.all([
		looksLikeGitCheckout(root),
		fs.stat(path.join(root, "node_modules")).then((entry) => entry.isDirectory(), () => false),
		readPackageName(root)
	]);
	return `Root: ${root}; Git metadata: ${git ? "present" : "absent or unreadable"}; node_modules layout: ${root.split(path.sep).includes("node_modules") ? "package under node_modules" : "outside node_modules"}, local node_modules ${modules ? "present" : "absent or unreadable"}; package.json name: ${packageName ?? "missing or unreadable"}.`;
}
async function resolveUpdateInstallSurface(opts) {
	const root = opts.root;
	if (!root || opts.installKind === "unknown" || opts.installKind === "host") return {
		kind: "missing",
		mode: "unknown"
	};
	if (opts.installKind === "git") return {
		kind: "git",
		mode: "git",
		root,
		packageRoot: root
	};
	if (opts.installKind === "immutable") return {
		kind: "immutable",
		mode: "unknown",
		root,
		packageRoot: root
	};
	const { runCommand } = await buildUpdateCommandRunner(opts.runCommand);
	const globalManager = await detectGlobalInstallManagerForRoot(runCommand, root, opts.timeoutMs ?? 12e5);
	if (globalManager) return {
		kind: "global",
		mode: globalManager,
		root,
		packageRoot: root
	};
	return {
		kind: "package-root",
		mode: "unknown",
		root,
		packageRoot: root
	};
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
function resolveUpdateRegistryTarget(params = {}) {
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
	const registryTarget = resolveUpdateRegistryTarget(params);
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
/** Classify installation ownership without reading Git history or dependency state. */
async function resolveUpdateInstallKind(root, options = {}) {
	return (await resolveUpdateInstallOwnership(root, options)).installKind;
}
async function resolveUpdateInstallOwnership(root, options) {
	options.signal?.throwIfAborted();
	if (!root) return { installKind: "unknown" };
	const installOwner = await readInstallOwner(root);
	options.signal?.throwIfAborted();
	if (installOwner) return {
		installKind: "host",
		installOwner
	};
	const { inspectImmutableInstall } = await import("./update-immutable-install-DTI7lmvh.mjs");
	const immutable = await inspectImmutableInstall(root, { allowExternalOwner: true });
	if (immutable) {
		if (immutable.installOwner) return {
			installKind: "host",
			installOwner: immutable.installOwner
		};
		return {
			installKind: "immutable",
			immutable
		};
	}
	const result = process.env.GIT_DIR || process.env.GIT_WORK_TREE || await fs.lstat(path.join(root, ".git")).then(() => true, (error) => !isMissingPathError(error)) ? await runUpdateGitCommand(root, ["rev-parse", "--show-toplevel"], {
		...options,
		timeoutMs: options.timeoutMs ?? 12e5
	}) : null;
	options.signal?.throwIfAborted();
	if (result?.termination === "timeout") throw createGitCommandError("git rev-parse --show-toplevel", result);
	const gitRoot = result?.code === 0 ? result.stdout.trim() : "";
	if (gitRoot && updateInstallRootsMatch(gitRoot, root)) return { installKind: "git" };
	const packageName = await readPackageName(root);
	options.signal?.throwIfAborted();
	return { installKind: packageName === PUBLIC_NPM_PACKAGE_NAME ? "package" : "unknown" };
}
/** Read the install and local Git identity needed to select an update channel. */
async function resolveUpdateInstallIdentity(params) {
	const { root, ...options } = params;
	const identity = await resolveUpdateInstallOwnership(root, options);
	const { installKind } = identity;
	const git = installKind === "git" && root ? await readGitUpdateIdentity(root, options) : void 0;
	options.signal?.throwIfAborted();
	return {
		...identity,
		git
	};
}
async function runUpdateGitCommand(root, args, options) {
	if (options.signal?.aborted) return null;
	const { onGitProbeTimeout, ...commandOptions } = options;
	const result = await executeGitCommand(root, args, {
		...commandOptions,
		operation: "update.inspect",
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
		return result?.code === 0 ? result.stdout.trim() : null;
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
	const trackingBranch = branch === "HEAD" ? params.useDetachedDevUpstream || params.gitSourceHint?.upstreamRef ? DEV_BRANCH : null : branch;
	const fetchTarget = trackingBranch ? await readGitUpdateFetchTarget(readGit, trackingBranch, branch === "HEAD" && Boolean(params.useDetachedDevUpstream), {
		root,
		sha,
		receipt: params.gitSourceHint ?? null,
		fetchRemote: Boolean(params.fetch)
	}) : null;
	const commitAtSeconds = Number.parseInt(commitAtRaw ?? "", 10);
	const commitAtMs = Number.isSafeInteger(commitAtSeconds) ? commitAtSeconds * 1e3 : null;
	const dirty = dirtyRes && dirtyRes.code === 0 ? dirtyRes.stdout.trim().length > 0 : null;
	let fetchOk = null;
	let fetchedCommit = null;
	if (params.fetch && fetchTarget) {
		if (fetchTarget.remote === ".") fetchOk = true;
		else {
			const exclusions = (await readGit("config", "--get-all", `remote.${fetchTarget.remote}.fetch`))?.split("\n").filter((refspec) => refspec.startsWith("^")) ?? [];
			const fetched = await runGit("fetch", "--quiet", "--no-tags", "--no-prune", "--no-prune-tags", "--no-recurse-submodules", "--", fetchTarget.remote, fetchTarget.mergeRef, ...exclusions);
			fetchedCommit = fetched?.code === 0 ? await readGit("rev-parse", "--verify", "FETCH_HEAD^{commit}") : null;
			fetchOk = fetched?.code === 0 && fetchedCommit !== null;
		}
	}
	const trackingRevision = fetchTarget && trackingBranch ? await resolveGitUpdateTrackingRef(readGit, trackingBranch, fetchTarget) : null;
	const upstream = fetchTarget?.upstreamSource === "receipt" ? params.gitSourceHint?.upstreamRef?.trim() || null : trackingRevision ? await readGit("rev-parse", "--abbrev-ref", "--symbolic-full-name", trackingRevision) : null;
	const upstreamRevision = `${trackingRevision}^{commit}`;
	let upstreamCommit = (!params.fetch || fetchOk === true) && upstream && sha ? await readGit("rev-parse", "--verify", upstreamRevision) : null;
	if (params.fetch && fetchTarget?.remote !== "." && upstreamCommit !== fetchedCommit) upstreamCommit = null;
	const mergeBases = sha && upstreamCommit ? await readGit("merge-base", "--all", sha, upstreamCommit) : null;
	let counts = sha && upstreamCommit && mergeBases ? await readGit("rev-list", "--left-right", "--count", `${sha}...${upstreamCommit}`) : null;
	if (counts && mergeBases && await readGit("rev-parse", "--is-shallow-repository") !== "false") {
		for (const mergeBase of mergeBases.split("\n")) if ((await Promise.all([[sha, upstreamCommit], [upstreamCommit, sha]].map(([tip, opposite]) => readGit("rev-list", "--count", "--ancestry-path", `${mergeBase}..${tip}`, `^${opposite}`)))).join("	") !== counts) {
			counts = null;
			break;
		}
	}
	const parsed = counts?.match(/^(\d+)\s+(\d+)$/u);
	return {
		root,
		sha,
		tag,
		branch,
		upstream,
		...fetchTarget ? { upstreamSource: fetchTarget.upstreamSource } : {},
		upstreamSha: upstreamCommit,
		...await resolveGitRepositoryMetadata(readGit, fetchTarget),
		commitAtMs,
		dirty,
		ahead: parsed ? Number(parsed[1]) : null,
		behind: parsed ? Number(parsed[2]) : null,
		fetchOk,
		builtSha: await readBuiltRuntimeCommit(root),
		artifacts: await readGitRuntimeArtifactStatus({
			root,
			sha
		})
	};
}
async function checkDepsStatus(params) {
	const root = path.resolve(params.root);
	const manager = params.manager;
	if (manager === "unknown") return {
		manager,
		lockfilePath: null,
		markerPath: null,
		status: "unknown",
		reason: "unknown package manager"
	};
	const lockfile = manager === "pnpm" ? "pnpm-lock.yaml" : manager === "npm" ? "package-lock.json" : await exists(path.join(root, "bun.lock")) ? "bun.lock" : "bun.lockb";
	const lockfilePath = path.join(root, lockfile);
	const markerPath = path.join(root, "node_modules", ...manager === "pnpm" ? [".modules.yaml"] : []);
	const lockExists = await exists(lockfilePath);
	const markerExists = await exists(markerPath);
	return {
		manager,
		lockfilePath,
		markerPath,
		...!lockExists ? {
			status: "unknown",
			reason: "lockfile missing"
		} : !markerExists ? {
			status: "missing",
			reason: "node_modules marker missing"
		} : { status: "ok" }
	};
}
async function fetchNpmTagVersion(params) {
	const { tag, ...options } = params;
	const res = await fetchNpmPackageTargetStatus({
		...options,
		target: tag
	});
	return {
		tag,
		version: res.version,
		error: res.error,
		metadata: res
	};
}
async function resolveNpmChannelTag(params) {
	const { channel, ...options } = params;
	const channelTag = channelToNpmTag(channel);
	if (channel === "extended-stable") {
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
		...options,
		tag
	});
	if (channel !== "beta") return await fetchTag(channelTag);
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
	const fetchRegistry = async (channel) => {
		const result = await resolveNpmChannelTag({
			channel: channel ?? "stable",
			timeoutMs
		});
		return {
			latestVersion: result.version,
			...channel ? { tag: result.tag } : {},
			error: result.error,
			...result.reason ? {
				error: result.reason,
				reason: result.reason
			} : {}
		};
	};
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
	const { installKind, installOwner, immutable } = await resolveUpdateInstallOwnership(root, {
		signal: params.signal,
		timeoutMs: params.timeoutMs,
		onGitProbeTimeout: params.onGitProbeTimeout
	});
	if (installKind === "host") return {
		root,
		installKind,
		installOwner,
		packageManager: "unknown"
	};
	if (installKind === "immutable") return {
		root,
		installKind,
		immutable,
		packageManager: "unknown"
	};
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
	const packageManager = isGit ? await detectPackageManager(root) ?? "unknown" : await detectGlobalInstallManagerForRoot(async (argv, options) => {
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
			gitSourceHint: params.gitSourceHint
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
export { resolveExtendedStablePackage as a, resolveUpdateInstallKind as c, looksLikeGitCheckout as d, resolveUnmanagedUpdateInstallReason as f, formatGitInstallLabel as i, resolveUpdateRegistryTarget as l, compareSemverStrings as n, resolveNpmChannelTag as o, resolveUpdateInstallSurface as p, fetchNpmTagVersion as r, resolveUpdateInstallIdentity as s, checkUpdateStatus as t, describeUpdateInstallRoot as u };
