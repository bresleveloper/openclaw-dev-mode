import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { i as normalizeLegacyDotBetaVersion, n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { f as createUpdatePreflightFailure } from "./service-inspection-error-Bsltcpi4.mjs";
import { i as executeGitCommand, n as createGitCommandError } from "./git-exec-rH66305f.mjs";
import { r as readPackageName } from "./package-json-DuhFvY5l.mjs";
import { t as detectPackageManager } from "./detect-package-manager-DsIv0glm.mjs";
import { n as readInstallOwner } from "./install-owner-ImshV9Dw.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { a as channelToNpmTag, n as DEV_BRANCH, p as selectNpmChannelVersion } from "./update-channels-BquD107I.mjs";
import "./npm-install-env-CROOzau_.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-BYX-I5ww.mjs";
import { a as readGitRuntimeArtifactStatus, r as readBuiltRuntimeCommit } from "./update-git-runtime-Cg4widap.mjs";
import { o as detectGlobalInstallManagerForRoot } from "./update-global-rkW-mKvG.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-DH-onosx.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { n as buildUpdateCommandRunner } from "./update-runner-command-rYXXMsH4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import hostedGitInfo from "hosted-git-info";
//#region src/infra/update-git-metadata.ts
const DEV_COMMIT_LIMIT = 5;
const DEV_COMMIT_SUBJECT_MAX_LENGTH = 120;
const DEV_COMMIT_LOG_MAX_OUTPUT_BYTES = 8192;
/** Select source authority before requiring its local tracking ref to exist. */
async function readGitBranchFetchTarget(readGit, branch) {
	const [remote, mergeRefs] = await Promise.all([readGit("config", "--get", `branch.${branch}.remote`), readGit("config", "--get-all", `branch.${branch}.merge`)]);
	const mergeRef = mergeRefs?.split("\n")[0];
	if (remote && mergeRef) return {
		remote,
		mergeRef
	};
	return null;
}
function matchRefspec(pattern, ref) {
	const star = pattern.indexOf("*");
	if (star < 0) return pattern === ref ? "" : void 0;
	const prefix = pattern.slice(0, star);
	const suffix = pattern.slice(star + 1);
	return ref.startsWith(prefix) && ref.endsWith(suffix) && ref.length >= prefix.length + suffix.length ? ref.slice(prefix.length, ref.length - suffix.length) : void 0;
}
/** Receipts retain only a destination; require one configured source before fetching it. */
async function readGitReceiptFetchTarget(readGit, display, fetchRemote) {
	const resolved = await readGit("rev-parse", "--symbolic-full-name", "--verify", "--end-of-options", display);
	const revisions = resolved ? [resolved] : (await Promise.all((display.startsWith("refs/") ? [display] : [
		`refs/${display}`,
		`refs/tags/${display}`,
		`refs/heads/${display}`,
		`refs/remotes/${display}`,
		`refs/remotes/${display}/HEAD`
	]).map((ref) => readGit("check-ref-format", "--normalize", ref)))).filter((ref) => ref !== null);
	const refspecs = (await readGit("config", "--get-regexp", "^remote\\..*\\.fetch$"))?.split("\n") ?? [];
	const targets = refspecs.flatMap((line) => {
		const [, remote, source, destination] = /^remote\.(.+)\.fetch \+?([^:]+):(.+)$/.exec(line) ?? [];
		return revisions.flatMap((revision) => {
			const matched = destination ? matchRefspec(destination, revision) : void 0;
			return remote && source && matched !== void 0 ? [{
				remote,
				mergeRef: source.replace("*", matched),
				revision
			}] : [];
		});
	});
	const eligible = targets.filter((target) => {
		const prefix = `remote.${target.remote}.fetch ^`;
		return !refspecs.some((line) => line.startsWith(prefix) && matchRefspec(line.slice(prefix.length), target.mergeRef) !== void 0);
	});
	let unique = [...new Map(eligible.map((target) => [JSON.stringify(target), target])).values()];
	if (targets.length === 0 && resolved?.startsWith("refs/heads/")) return {
		remote: ".",
		mergeRef: resolved,
		revision: resolved
	};
	if (!resolved && !display.startsWith("refs/") && unique.length > 1) {
		const remotes = new Set(unique.map((target) => target.remote));
		const [remote] = remotes;
		if (!fetchRemote || !remote || remotes.size !== 1 || new Set(unique.map((target) => target.revision)).size !== unique.length) return null;
		const advertised = await readGit("ls-remote", "--refs", "--", remote, ...new Set(unique.map((target) => target.mergeRef)));
		const refs = new Set(advertised?.split("\n").map((line) => line.split("	")[1]));
		unique = unique.filter((target) => refs.has(target.mergeRef));
	}
	return unique.length === 1 ? unique[0] ?? null : null;
}
async function resolveGitRepositoryMetadata(readGit, target) {
	const remote = target?.remote;
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
	const { inspectImmutableInstall } = await import("./update-immutable-install-CUd78TYv.mjs");
	const immutable = await inspectImmutableInstall(root);
	if (immutable) return {
		installKind: "immutable",
		immutable
	};
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
	const trackingBranch = branch === "HEAD" ? params.useDetachedDevUpstream ? DEV_BRANCH : null : branch;
	let tracking = trackingBranch ? await readGitBranchFetchTarget(readGit, trackingBranch) : null;
	const commitAtSeconds = Number.parseInt(commitAtRaw ?? "", 10);
	const commitAtMs = Number.isSafeInteger(commitAtSeconds) ? commitAtSeconds * 1e3 : null;
	const receiptUpstream = !tracking && branch === "HEAD" && sha && params.upstreamFallback?.currentSha.trim().toLowerCase() === sha.toLowerCase() ? params.upstreamFallback.upstreamRef.trim() || null : null;
	const receiptTarget = receiptUpstream ? await readGitReceiptFetchTarget(readGit, receiptUpstream, Boolean(params.fetch)) : null;
	if (!tracking && !receiptUpstream && branch === "HEAD" && trackingBranch && await readGit("remote", "get-url", "--", "origin")) tracking = {
		remote: "origin",
		mergeRef: `refs/heads/${trackingBranch}`
	};
	const fetchTarget = tracking ?? receiptTarget;
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
	const trackingRevision = tracking && trackingBranch ? await readGit("-c", `branch.${trackingBranch}.remote=${tracking.remote}`, "-c", `branch.${trackingBranch}.merge=${tracking.mergeRef}`, "rev-parse", "--symbolic-full-name", `${trackingBranch}@{upstream}`) : null;
	const upstream = trackingRevision ? await readGit("rev-parse", "--abbrev-ref", "--symbolic-full-name", trackingRevision) : receiptUpstream;
	const upstreamSource = trackingRevision ? "tracking" : receiptUpstream ? "receipt" : void 0;
	const upstreamRevision = `${trackingRevision ?? receiptTarget?.revision ?? upstream}^{commit}`;
	let upstreamCommit = (!params.fetch || fetchOk === true) && upstream && sha ? await readGit("rev-parse", "--verify", upstreamRevision) : null;
	if (params.fetch && fetchTarget?.remote !== "." && upstreamCommit !== fetchedCommit) upstreamCommit = null;
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
	const paths = {
		manager,
		lockfilePath,
		markerPath
	};
	const lockExists = await exists(lockfilePath);
	const markerExists = await exists(markerPath);
	if (!lockExists) return {
		...paths,
		status: "unknown",
		reason: "lockfile missing"
	};
	if (!markerExists) return {
		...paths,
		status: "missing",
		reason: "node_modules marker missing"
	};
	return {
		...paths,
		status: "ok"
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
export { resolveExtendedStablePackage as a, resolveUpdateInstallKind as c, looksLikeGitCheckout as d, resolveUnmanagedUpdateInstallReason as f, formatGitInstallLabel as i, resolveUpdateRegistryTarget as l, resolveDevGitCommits as m, compareSemverStrings as n, resolveNpmChannelTag as o, resolveUpdateInstallSurface as p, fetchNpmTagVersion as r, resolveUpdateInstallIdentity as s, checkUpdateStatus as t, describeUpdateInstallRoot as u };
