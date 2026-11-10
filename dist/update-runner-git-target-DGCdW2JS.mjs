import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { f as selectNpmChannelVersion, n as DEV_BRANCH, o as isBetaTag, s as isStableTag } from "./update-channels-l0GQCX9n.mjs";
import { a as executeGitCommand, d as normalizeGitPathForFilesystem, l as gitNullConfigPath } from "./git-exec-CvORirty.mjs";
import { r as isFullGitObjectId } from "./update-dev-target-yMMMhCo4.mjs";
import { n as readGitTargetSchemaVersions, r as readGitUpdateFetchTarget, t as readGitRefFetchTarget } from "./update-git-metadata-Bci7Iprk.mjs";
import { a as runStep } from "./update-runner-command-DETznIV7.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { n as compareSemverStrings } from "./update-check-hpRujh0z.mjs";
import { n as cleanupUpdateTemporaryDirectory } from "./update-maintenance-H05X8e5F.mjs";
import { a as gitCleanCheckArgs, r as createGitStepFactory } from "./update-runner-git-commands-X6nu_XbS.mjs";
import { r as runClassifiedGitStep, t as runGitCandidatePreflight } from "./update-runner-git-preflight-BsvOuY5n.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-runner-git-target.ts
const UNVERIFIED_GIT_CORRUPTION = /(?:in the commit graph file but not in the object database|probably due to repo corruption)/iu;
const VERIFIED_GIT_CORRUPTION = /(?:broken link from|dangling (?:commit|tree|blob)|hash mismatch|invalid sha1 pointer|missing (?:blob|commit|tree)|object corrupt)/iu;
/** Replace Git's unverified corruption guess when promised objects may be intentionally absent. */
async function classifyPartialCloneGitFailure(params) {
	if (params.result.code === 0 || !UNVERIFIED_GIT_CORRUPTION.test(params.result.stderr)) return params.result;
	const withDiagnostic = (stderr) => ({
		...params.result,
		stderr
	});
	const promisorConfig = await params.runCommand([
		"git",
		"-C",
		params.root,
		"config",
		"--includes",
		"--get-regexp",
		"^remote\\..*\\.promisor$"
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	if (promisorConfig?.code === 0 && promisorConfig.stdout.split("\n").some((line) => /\s(?:true|yes|on|1)$/iu.test(line.trim()))) return withDiagnostic("Git could not resolve one or more promised objects in this partial clone. This does not by itself indicate repository corruption. Bulk-fetch the missing object IDs from the configured promisor remote, then retry the update (for example: git rev-list --objects --missing=print --all | sed -n 's/^?//p' | git fetch \"<promisor-remote>\" --stdin).");
	const fsck = await params.runCommand([
		"git",
		"--no-lazy-fetch",
		"-C",
		params.root,
		"fsck",
		"--connectivity-only",
		"--no-dangling"
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	const fsckOutput = `${fsck?.stdout ?? ""}\n${fsck?.stderr ?? ""}`.trim();
	if (fsck?.code !== 0 && VERIFIED_GIT_CORRUPTION.test(fsckOutput)) return withDiagnostic(`Git verified repository corruption with git fsck: ${fsckOutput}`);
	return withDiagnostic("Git reported an object-database inconsistency, but OpenClaw did not verify repository corruption with git fsck. Retry the update; if it recurs, inspect the repository with git fsck before attempting repair.");
}
function quoteGitConfig(value) {
	return `"${value.replace(/\\/gu, "\\\\").replace(/"/gu, "\\\"").replace(/\n/gu, "\\n").replace(/\t/gu, "\\t").replaceAll("\b", "\\b")}"`;
}
function gitConfigEntry(key, value) {
	const match = /^([a-z][a-z0-9-]*)\.(?:(.*)\.)?([a-z][a-z0-9-]*)$/iu.exec(key);
	if (!match || /[\r\n]/u.test(match[2] ?? "")) throw new Error("Could not preserve Git target inspection configuration");
	return `[${match[1]}${match[2] === void 0 ? "" : ` ${quoteGitConfig(match[2])}`}]\n\t${match[3]} = ${quoteGitConfig(value)}\n`;
}
/** Fetch and candidate selection must not update the installed repository before admission. */
async function withGitTargetInspectionRoot(params, inspect) {
	const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-git-admission-"));
	const inspectionRoot = path.join(temporaryRoot, "repository.git");
	const command = async (root, args, allowMissing = false, options = { timeoutMs: params.timeoutMs }) => {
		const result = await params.runCommand([
			"git",
			"-C",
			root,
			...args
		], {
			cwd: root,
			terminateOnOutputLimit: true,
			...options
		});
		if (result.killed || result.signal || result.termination && result.termination !== "exit" || result.code !== 0 && !(allowMissing && result.code === 1)) throw new Error(`Git target inspection ${args[0]} failed (exit ${result.code})`);
		return result.stdout;
	};
	let cleanupUncertain = false;
	try {
		const head = (await command(params.root, ["rev-parse", "HEAD"])).trim();
		const headRef = (await command(params.root, [
			"symbolic-ref",
			"-q",
			"HEAD"
		], true)).trim();
		const objects = normalizeGitPathForFilesystem((await command(params.root, [
			"rev-parse",
			"--git-path",
			"objects"
		])).trim());
		const shallow = normalizeGitPathForFilesystem((await command(params.root, [
			"rev-parse",
			"--git-path",
			"shallow"
		])).trim());
		const refs = await command(params.root, ["for-each-ref", "--format=%(objectname) %(refname)"]);
		await command(params.root, [
			"init",
			"--bare",
			"--template=",
			inspectionRoot
		], false, {
			...params.work ?? { timeoutMs: params.timeoutMs },
			env: {
				GIT_DEFAULT_HASH: head.length === 64 ? "sha256" : "sha1",
				GIT_DEFAULT_REF_FORMAT: "files"
			}
		});
		await fs.writeFile(path.join(inspectionRoot, "objects", "info", "alternates"), `${quoteGitConfig(path.resolve(params.root, objects))}\n`);
		await fs.copyFile(path.resolve(params.root, shallow), path.join(inspectionRoot, "shallow")).catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		});
		const objectIds = /* @__PURE__ */ new Set();
		const branchObjects = /* @__PURE__ */ new Set();
		for (const ref of refs.trim().split("\n").filter(Boolean)) {
			const separator = ref.indexOf(" ");
			const oid = ref.slice(0, separator);
			objectIds.add(oid);
			if (ref.slice(separator + 1).startsWith("refs/heads/")) branchObjects.add(oid);
		}
		if (objectIds.size > 0) {
			const ids = [...objectIds];
			const checkedObjects = (await command(inspectionRoot, ["cat-file", "--batch-check=%(objectname) %(objecttype)"], false, {
				timeoutMs: params.timeoutMs,
				input: ids.map((oid) => `${oid}^{object}\n`).join("")
			})).trimEnd().split("\n");
			if (checkedObjects.length !== ids.length || ids.some((oid, index) => ![
				"commit",
				"tree",
				"blob",
				"tag"
			].some((type) => checkedObjects[index] === `${oid} ${type}` && (!branchObjects.has(oid) || type === "commit")))) throw new Error("Git target inspection references an invalid object");
		}
		await fs.writeFile(path.join(inspectionRoot, "packed-refs"), refs);
		await command(inspectionRoot, headRef ? [
			"symbolic-ref",
			"HEAD",
			headRef
		] : [
			"update-ref",
			"--no-deref",
			"HEAD",
			head
		]);
		const config = await command(params.root, [
			"config",
			"--includes",
			"--null",
			"--get-regexp",
			"^((remote|branch|url|http|credential|protocol|filter|fetch|transfer|ssh|user|author|committer|gpg)\\.|commit\\.gpgsign$|core\\.(sshcommand|gitproxy|askpass)$)"
		], true);
		const entries = [];
		for (const entry of config.split("\0").filter(Boolean)) {
			const separator = entry.indexOf("\n");
			const key = separator === -1 ? entry : entry.slice(0, separator);
			const value = separator === -1 ? "true" : entry.slice(separator + 1);
			entries.push(gitConfigEntry(key, value));
		}
		await fs.appendFile(path.join(inspectionRoot, "config"), entries.join(""), { mode: 384 });
		const runInspectionCommand = (argv, options) => params.runCommand(argv[0] === "git" && argv[1] === "-C" && argv[2] === inspectionRoot ? [
			"git",
			"-C",
			argv[3] === "worktree" && (argv[4] === "remove" || argv[4] === "prune") ? inspectionRoot : params.root,
			`--git-dir=${inspectionRoot}`,
			...argv.slice(3)
		] : argv, argv[0] === "git" ? {
			...options,
			env: {
				...options.env,
				GIT_CONFIG_NOSYSTEM: "1",
				GIT_CONFIG_GLOBAL: gitNullConfigPath(),
				GIT_CONFIG_COUNT: "0"
			}
		} : options);
		return await inspect(inspectionRoot, runInspectionCommand);
	} catch (error) {
		cleanupUncertain = hasCommandProcessCleanupError(error);
		throw error;
	} finally {
		if (!cleanupUncertain) {
			const cleanup = async () => {
				let removed = true;
				await cleanupUpdateTemporaryDirectory({
					directory: temporaryRoot,
					root: params.root,
					name: "git-target-inspection-cleanup",
					onWarning: (warning) => {
						removed = false;
						return params.onWarning(warning);
					}
				});
				return removed;
			};
			if (!params.retainCleanup?.(cleanup)) await cleanup();
		}
	}
}
async function prepareGitMutation(params) {
	const target = await readGitTargetSchemaVersions(params);
	const sha = isFullGitObjectId(params.revision) ? params.revision.toLowerCase() : void 0;
	await params.beforeGitMutation({
		...sha ? { sha } : {},
		...target.status === "ok" ? {
			...target.version ? { version: target.version } : {},
			...target.schemaVersions ? { schemaVersions: target.schemaVersions } : {},
			...target.databaseEngines === void 0 ? {} : { databaseEngines: target.databaseEngines }
		} : { metadataUnreadable: target.reason }
	});
}
async function selectGitInspectionTarget(params) {
	const tag = params.channel === "dev" ? void 0 : await resolveChannelTag(params.runCommand, params.gitRoot, params.timeoutMs, params.channel);
	if (params.channel !== "dev" && !tag) return {
		status: "error",
		reason: "no-release-tag"
	};
	return runGitCandidatePreflight({
		...params,
		targetRevision: tag ?? void 0
	});
}
async function readBranchName(runCommand, root, timeoutMs) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	], { timeoutMs }).catch(() => null);
	return result?.code === 0 ? result.stdout.trim() || null : null;
}
async function resolveChannelTag(runCommand, root, timeoutMs, channel) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"tag",
		"--list",
		"v*",
		"--sort=-v:refname"
	], { timeoutMs }).catch(() => null);
	return selectChannelTag(result?.code === 0 ? result.stdout.split("\n") : [], channel);
}
async function fetchGitUpdateTarget(params) {
	const { root, channel, devTarget, name, step: targetStep, workStep, steps } = params;
	const step = createGitStepFactory(root, targetStep);
	const work = createGitStepFactory(root, workStep);
	const refreshedRemotes = [];
	let devSource = null;
	const result = (ok) => ({
		ok,
		refreshedRemotes,
		...devSource ? { devSource } : {}
	});
	if (channel === "dev" && devTarget?.mode === "detached" && isFullGitObjectId(devTarget.ref)) {
		const options = step("git-resolve-target", "--no-lazy-fetch", "cat-file", "--batch-check=%(objectname) %(objecttype)");
		const cachedTarget = await runClassifiedGitStep({
			...options,
			input: `${devTarget.ref}\n`
		}, (cached) => {
			const interrupted = cached.termination === "signal" || cached.exitCode === 130 || cached.exitCode === 143;
			const available = !isFailedUpdateStep(cached) && !cached.signal && !interrupted && cached.stdoutTail?.trim() === `${devTarget.ref.toLowerCase()} commit`;
			if (!interrupted && isFailedUpdateStep(cached)) cached.advisory = {
				kind: "recoverable-maintenance",
				message: `Could not inspect the cached target; continuing remote discovery. ${cached.stderrTail ?? ""}`
			};
			return {
				interrupted,
				available
			};
		});
		if (cachedTarget.interrupted || cachedTarget.available) return result(cachedTarget.available);
	}
	const remote = await runStep(step("git-remote", "remote"));
	if (remote.exitCode !== 0) return result(false);
	const remotes = normalizeStringEntries((remote.stdoutTail ?? "").split("\n"));
	const tracked = await runStep(step("git-config-update-upstream", "config", "--get", `branch.${DEV_BRANCH}.remote`));
	if (tracked.exitCode !== 0 && tracked.exitCode !== 1) return result(false);
	const trackedRemote = (tracked.stdoutTail ?? "").trim();
	const targetRef = devTarget?.mode === "tracked" ? devTarget.upstreamRef : devTarget?.ref;
	const remoteRef = devTarget?.mode === "tracked" || targetRef?.startsWith("refs/remotes/") || targetRef?.startsWith("origin/") ? targetRef?.replace(/^refs\/remotes\//u, "") : void 0;
	const targetRemote = remoteRef ? remotes.toSorted((left, right) => right.length - left.length).find((candidate) => remoteRef.startsWith(`${candidate}/`)) : void 0;
	const tagRemote = trackedRemote && remotes.includes(trackedRemote) ? trackedRemote : remotes.includes("origin") ? "origin" : remotes.length === 1 ? remotes[0] : void 0;
	const readGit = async (...args) => {
		const probe = await runStep(step("git-config-update-upstream", ...args));
		return !isFailedUpdateStep(probe) ? probe.stdoutTail?.trim() ?? "" : null;
	};
	devSource = channel !== "dev" || devTarget?.mode === "detached" ? null : devTarget?.mode === "tracked" ? await readGitRefFetchTarget(readGit, devTarget.upstreamRef, true) : await readGitUpdateFetchTarget(readGit, DEV_BRANCH, true);
	const authority = channel !== "dev" ? tagRemote : devTarget?.mode === "detached" ? targetRemote ?? (targetRef?.startsWith("refs/heads/") ? "origin" : void 0) : devSource?.remote;
	if (channel === "dev" && devTarget?.mode !== "detached" && !devSource) return devTarget ? {
		...result(false),
		reason: "tracked-upstream-invalid"
	} : result(true);
	const fetchRemotes = authority ? [authority] : channel !== "dev" || remoteRef || targetRef?.startsWith("refs/tags/") ? [] : targetRef && !isFullGitObjectId(targetRef) ? remotes.filter((candidate) => candidate === "origin") : remotes;
	const fetchConfigKey = `remote.${devSource?.remote}.fetch`;
	const exclusions = devSource ? await runStep(step("git-config-update-upstream", "config", "--get-all", fetchConfigKey)) : void 0;
	if (exclusions && isFailedUpdateStep(exclusions) && exclusions.exitCode !== 1) return result(false);
	const negatives = (exclusions?.stdoutTail ?? "").split("\n").filter((ref) => ref.startsWith("^"));
	for (const fetchRemote of fetchRemotes) {
		if (fetchRemote === ".") continue;
		const options = work(authority ? name : `${name}:${fetchRemote}`, "fetch", fetchRemote, devSource ? "--no-prune" : "--prune", "--no-tags", "--no-prune-tags", ...devSource ? [
			"--no-recurse-submodules",
			"--",
			devSource.mergeRef,
			...negatives
		] : []);
		const fetchOutcome = await runClassifiedGitStep(options, (fetch) => {
			const interrupted = fetch.termination === "signal" || fetch.exitCode === 130 || fetch.exitCode === 143;
			const fetchedSuccessfully = fetch.exitCode === 0 && !isFailedUpdateStep(fetch);
			if (fetchedSuccessfully && !interrupted) {
				refreshedRemotes.push(fetchRemote);
				if (authority && remotes.some((candidate) => candidate !== authority)) fetch.warnings = [`Fetched only the update remote ${authority}; unrelated remotes were left untouched.`];
			} else if (!authority && !interrupted) fetch.advisory = {
				kind: "recoverable-maintenance",
				message: `Could not refresh optional target remote ${fetchRemote}; continuing target resolution. ${fetch.stderrTail ?? ""}`
			};
			return {
				interrupted,
				fetchedSuccessfully
			};
		});
		if (fetchOutcome.interrupted || !fetchOutcome.fetchedSuccessfully && authority) return result(false);
	}
	if (channel === "dev") {
		const fetched = devSource && devSource.remote !== "." ? await runStep(step("git-resolve-target", "rev-parse", "--verify", "FETCH_HEAD^{commit}")) : void 0;
		return result(!fetched || !isFailedUpdateStep(fetched));
	}
	if (!tagRemote) {
		steps.push({
			name: "git-release-remote",
			command: "git remote",
			cwd: root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: "Cannot determine the release remote. Set branch.main.remote to the remote that publishes releases."
		});
		return result(false);
	}
	const tags = await runStep(work("git-fetch-tags", "fetch", "--no-tags", "--no-prune", "--no-prune-tags", tagRemote, "+refs/tags/*:refs/tags/*"));
	return {
		...result(tags.exitCode === 0 && !isFailedUpdateStep(tags)),
		releaseRemote: tagRemote
	};
}
/** Observe the preferred release without entering candidate admission or changing installed refs. */
async function readPreferredGitChannelTarget(params) {
	const runGit = async (argv, options) => {
		const root = argv[2];
		if (argv[0] !== "git" || argv[1] !== "-C" || !root) throw new Error("Expected a Git target inspection command");
		const result = await executeGitCommand(root, argv.slice(3), {
			...options,
			killProcessTree: true,
			terminateOnOutputLimit: true
		});
		if (result.killed || result.signal || result.outputLimitExceeded || result.termination && result.termination !== "exit") throw new Error("Git target observation did not complete");
		return result;
	};
	let cleanupFailed = false;
	const target = await withGitTargetInspectionRoot({
		...params,
		runCommand: runGit,
		onWarning: () => {
			cleanupFailed = true;
		}
	}, async (root, runCommand) => {
		const step = (name, argv, cwd) => ({
			name,
			argv,
			cwd,
			runCommand,
			timeoutMs: params.timeoutMs,
			stepIndex: 0,
			totalSteps: 0
		});
		const fetched = await fetchGitUpdateTarget({
			root,
			channel: params.channel,
			name: "git-status-target-fetch",
			step,
			workStep: step,
			steps: []
		});
		if (!fetched.ok || !fetched.releaseRemote) return;
		const tag = await resolveChannelTag(runCommand, root, params.timeoutMs, params.channel);
		if (!tag) return;
		const ref = `refs/tags/${tag}`;
		const resolved = await runCommand([
			"git",
			"-C",
			root,
			"rev-parse",
			"--verify",
			`${ref}^{commit}`
		], { timeoutMs: params.timeoutMs });
		const sha = resolved.code === 0 ? resolved.stdout.trim() : "";
		if (!isFullGitObjectId(sha)) return;
		const advertised = await runCommand([
			"git",
			"-C",
			root,
			"ls-remote",
			"--tags",
			"--",
			fetched.releaseRemote,
			ref,
			`${ref}^{}`
		], { timeoutMs: params.timeoutMs });
		if (advertised.code !== 0) return;
		const refs = new Map(advertised.stdout.trim().split("\n").map((line) => {
			const [oid, name] = line.split("	");
			return [name, oid];
		}));
		return (refs.get(`${ref}^{}`) ?? refs.get(ref)) === sha ? {
			channel: params.channel,
			tag,
			sha
		} : void 0;
	});
	if (!target || cleanupFailed) return;
	const [head, dirty] = await Promise.all([runGit([
		"git",
		"-C",
		params.root,
		"rev-parse",
		"HEAD"
	], { timeoutMs: params.timeoutMs }).catch(() => null), runGit(gitCleanCheckArgs(params.root), { timeoutMs: params.timeoutMs }).catch(() => null)]);
	return head?.code === 0 && head.stdout.trim() === params.sha && dirty?.code === 0 && !dirty.stdout.trim() ? target : void 0;
}
function selectChannelTag(tags, channel) {
	const orderedTags = normalizeStringEntries(tags).toSorted((left, right) => {
		const comparison = compareSemverStrings(left, right);
		return comparison == null ? right.localeCompare(left) : -comparison;
	});
	if (channel === "beta") return selectNpmChannelVersion({ version: orderedTags.find(isBetaTag) ?? null }, { version: orderedTags.find(isStableTag) ?? null }).version;
	return orderedTags.find(isStableTag) ?? null;
}
//#endregion
export { readPreferredGitChannelTarget as a, withGitTargetInspectionRoot as c, readBranchName as i, fetchGitUpdateTarget as n, selectChannelTag as o, prepareGitMutation as r, selectGitInspectionTarget as s, classifyPartialCloneGitFailure as t };
