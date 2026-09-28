import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { i as executeGitCommand, p as withGitNetworkRetry, s as gitNullConfigPath, u as requireGitCommandOutput } from "./git-exec-B6ZpVpQV.mjs";
import { d as prepareProjectRegistration, f as registerPreparedProjectRegistry, g as withProjectCheckoutLifecycle, h as resolveProjectDirectory, i as removeProjectCheckoutReference, o as resolveProjectCloneRefreshOwner, t as listProjectRegistry } from "./project-registry-CT4rCnL9.mjs";
import { l as slugifyWorktreeTitle } from "./project-registry.kernel-BVX6sQ_I.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D2byNTeD.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/projects/project-clone-runtime.ts
const PROJECT_CLONE_TIMEOUT_MS = 6e5;
const PROJECT_FETCH_TIMEOUT_MS = 6e4;
var ProjectCloneError = class extends Error {
	constructor(failure, message) {
		super(message);
		this.failure = failure;
		this.name = "ProjectCloneError";
	}
};
function cloneCommandEnv(token, env) {
	const gitEnv = {
		...env,
		GIT_TERMINAL_PROMPT: "0",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_CONFIG_GLOBAL: gitNullConfigPath(),
		GIT_TEMPLATE_DIR: "",
		GIT_EDITOR: "",
		GIT_SEQUENCE_EDITOR: "",
		GIT_EXTERNAL_DIFF: "",
		GIT_ASKPASS: void 0,
		SSH_ASKPASS: void 0,
		GIT_DIR: void 0,
		GIT_WORK_TREE: void 0,
		GIT_COMMON_DIR: void 0,
		GIT_INDEX_FILE: void 0,
		GIT_OBJECT_DIRECTORY: void 0,
		GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
		GIT_NAMESPACE: void 0,
		GIT_EXEC_PATH: void 0,
		GIT_SSH: void 0,
		GIT_SSH_COMMAND: void 0,
		GIT_SSL_NO_VERIFY: void 0
	};
	if (token) {
		gitEnv.GIT_CONFIG_COUNT = "1";
		gitEnv.GIT_CONFIG_KEY_0 = "http.https://github.com/.extraHeader";
		gitEnv.GIT_CONFIG_VALUE_0 = `Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`;
	}
	return gitEnv;
}
function classifyProjectGitFailure(params) {
	const detail = params.output.toLowerCase();
	if (params.timedOut || /could not resolve host|connection timed out|failed to connect/u.test(detail)) return new ProjectCloneError("network", `Git ${params.operation} could not reach GitHub. Check the Gateway network connection and retry.`);
	if (/authentication failed|permission denied|could not read username|access denied/u.test(detail)) return new ProjectCloneError("auth_required", params.tokenConfigured ? "GitHub rejected the active Control UI credential. Update gateway.controlUi.github.token when set; otherwise update the shared Gateway process environment, then retry." : "GitHub authentication is required. Configure gateway.controlUi.github.token or set GH_TOKEN/GITHUB_TOKEN in the shared Gateway process environment to clone private repositories.");
	if (/repository not found|not found/u.test(detail)) return params.tokenConfigured ? new ProjectCloneError("not_found", "GitHub could not find that repository. Check the URL and repository access.") : new ProjectCloneError("auth_required", "The repository was not found or is private. Check the URL, or configure gateway.controlUi.github.token (or the shared Gateway process environment) for private repositories.");
	return new ProjectCloneError("clone_failed", `Git could not ${params.operation === "clone" ? "clone" : "refresh"} that repository. Check the URL and Gateway Git configuration, then retry.`);
}
/** Clones one already-validated source into an unoccupied managed target. */
async function cloneProjectCheckout(input, options = {}) {
	const env = options.env ?? process.env;
	if (await fs.lstat(input.target).then(() => true, () => false)) throw new ProjectCloneError("target_exists", "A managed checkout already exists for this repository. Register or remove it before retrying.");
	await fs.mkdir(path.dirname(input.target), { recursive: true });
	const commandEnv = cloneCommandEnv(options.token, env);
	const result = await withGitNetworkRetry("clone", {
		timeoutMs: options.timeoutMs ?? PROJECT_CLONE_TIMEOUT_MS,
		signal: options.signal
	}, async (timeoutMs) => {
		const attempt = await runCommandWithTimeout([
			"git",
			"clone",
			"--no-recurse-submodules",
			"--",
			input.url,
			input.target
		], {
			env: commandEnv,
			timeoutMs,
			signal: options.signal,
			killProcessTree: true,
			maxOutputBytes: 262144
		});
		if (attempt.code !== 0 || attempt.termination !== "exit") await fs.rm(input.target, {
			recursive: true,
			force: true
		}).catch(() => {});
		return attempt;
	});
	if (result.code === 0 && result.termination === "exit") {
		if (input.requiredCommit) try {
			await ensureProjectCheckoutCommit({
				...input,
				commit: input.requiredCommit
			}, options);
		} catch (error) {
			await fs.rm(input.target, {
				recursive: true,
				force: true
			});
			throw error;
		}
		return;
	}
	throw classifyProjectGitFailure({
		output: `${result.stderr}\n${result.stdout}`,
		operation: "clone",
		tokenConfigured: Boolean(options.token),
		timedOut: result.termination === "timeout" || result.termination === "no-output-timeout"
	});
}
/** Refreshes refs in an existing Gateway-managed project checkout. */
async function refreshProjectCheckout(input, options = {}) {
	const [objectPath, objectFormatResult, currentRefs] = await Promise.all([
		runProjectCheckoutGit(input, options, [
			"rev-parse",
			"--path-format=absolute",
			"--git-path",
			"objects"
		]),
		runProjectCheckoutGit(input, options, ["rev-parse", "--show-object-format"]),
		readProjectRemoteRefs(input, options)
	]);
	if (objectPath.code !== 0 || objectPath.termination !== "exit") throw new ProjectCloneError("clone_failed", "The managed repository object store could not be verified. Remove the repository and retry.");
	const objectFormat = objectFormatResult.stdout.trim();
	if (objectFormatResult.code !== 0 || objectFormatResult.termination !== "exit" || objectFormat !== "sha1" && objectFormat !== "sha256") throw new ProjectCloneError("clone_failed", "The managed repository object format could not be verified. Remove the repository and retry.");
	const objects = await fs.realpath(objectPath.stdout.trim());
	const staging = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-project-fetch-"));
	try {
		const initialized = await runProjectCheckoutGit({ target: staging }, options, [
			"init",
			"--bare",
			`--object-format=${objectFormat}`
		]);
		if (initialized.code !== 0 || initialized.termination !== "exit") throw new ProjectCloneError("clone_failed", "Git could not prepare a safe repository refresh. Retry the session.");
		const stagingOptions = {
			...options,
			objectDirectory: objects
		};
		if (currentRefs.size > 0) {
			const seeded = await runProjectCheckoutGit({ target: staging }, stagingOptions, ["update-ref", "--stdin"], { input: `${Array.from(currentRefs, ([ref, commit]) => `update ${ref} ${commit}`).join("\n")}\n` });
			if (seeded.code !== 0 || seeded.termination !== "exit") throw new ProjectCloneError("clone_failed", "Git could not prepare the managed repository refs for refresh. Retry the session.");
		}
		const result = await runProjectCheckoutGit({ target: staging }, {
			...stagingOptions,
			timeoutMs: options.timeoutMs ?? PROJECT_FETCH_TIMEOUT_MS
		}, [
			"fetch",
			"--no-auto-maintenance",
			"--no-recurse-submodules",
			"--prune",
			"--",
			input.url,
			"+refs/heads/*:refs/remotes/origin/*"
		]);
		if (result.code !== 0 || result.termination !== "exit") throw classifyProjectGitFailure({
			output: `${result.stderr}\n${result.stdout}`,
			operation: "fetch",
			tokenConfigured: Boolean(options.token),
			timedOut: result.termination === "timeout" || result.termination === "no-output-timeout"
		});
		const fetchedRefs = await readProjectRemoteRefs({ target: staging }, stagingOptions);
		const updates = [...Array.from(fetchedRefs, ([ref, commit]) => `update ${ref} ${commit}`), ...Array.from(currentRefs.keys()).filter((ref) => !fetchedRefs.has(ref)).map((ref) => `delete ${ref}`)];
		if (updates.length > 0) {
			const updated = await runProjectCheckoutGit(input, options, ["update-ref", "--stdin"], { input: `${updates.join("\n")}\n` });
			if (updated.code !== 0 || updated.termination !== "exit") throw new ProjectCloneError("clone_failed", "The managed repository changed while its branches were refreshed. Retry the session.");
		}
	} finally {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
	}
}
async function readProjectRemoteRefs(input, options) {
	const result = await runProjectCheckoutGit(input, options, [
		"for-each-ref",
		"--format=%(refname) %(objectname) %(symref)",
		"refs/remotes/origin"
	]);
	const stdout = requireGitCommandOutput("git for-each-ref", result, (_command, failed) => failed.outputLimitExceeded ? new ProjectCloneError("clone_failed", "Git returned too many managed repository refs to refresh safely. Remove obsolete remote branches, then retry.") : new ProjectCloneError("clone_failed", "Git could not read the managed repository refs."));
	const refs = /* @__PURE__ */ new Map();
	for (const line of stdout.trim().split("\n").filter(Boolean)) {
		const match = /^(refs\/remotes\/origin\/\S+) ([a-f0-9]{40}|[a-f0-9]{64})(?: (\S+))?$/u.exec(line.trimEnd());
		if (!match) throw new ProjectCloneError("clone_failed", "Git returned an invalid managed repository ref.");
		const [, ref, commit, symbolicTarget] = match;
		if (!ref || !commit) throw new ProjectCloneError("clone_failed", "Git returned an incomplete managed repository ref.");
		if (symbolicTarget) continue;
		refs.set(ref, commit);
	}
	return refs;
}
function runProjectCheckoutGit(input, options, args, commandOptions = {}) {
	return executeGitCommand(input.target, [
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		...args
	], {
		env: {
			...cloneCommandEnv(options.token, options.env ?? process.env),
			...options.objectDirectory ? { GIT_OBJECT_DIRECTORY: options.objectDirectory } : {}
		},
		timeoutMs: options.timeoutMs ?? PROJECT_CLONE_TIMEOUT_MS,
		signal: options.signal,
		killProcessTree: true,
		maxOutputBytes: 262144,
		...commandOptions
	});
}
/** Fetch the pinned source when a reused project clone predates the remote session. */
async function ensureProjectCheckoutCommit(input, options = {}) {
	if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(input.commit)) throw new ProjectCloneError("clone_failed", "The repository commit is invalid.");
	const command = (args) => runProjectCheckoutGit(input, options, args);
	const present = await command([
		"cat-file",
		"-e",
		`${input.commit}^{commit}`
	]);
	if (present.code === 0 && present.termination === "exit") return;
	const fetched = await command([
		"fetch",
		"--no-tags",
		"--no-recurse-submodules",
		"--",
		input.url,
		input.commit
	]);
	if (fetched.code !== 0 || fetched.termination !== "exit") throw classifyProjectGitFailure({
		operation: "fetch",
		output: `${fetched.stderr}\n${fetched.stdout}`,
		tokenConfigured: Boolean(options.token),
		timedOut: fetched.termination === "timeout" || fetched.termination === "no-output-timeout"
	});
}
/** Observe only the named source branch using the same shared fetch identity as cloning. */
async function readProjectCheckoutRemoteHead(input, options = {}) {
	const ref = `refs/heads/${input.branch}`;
	const result = await runProjectCheckoutGit(input, options, [
		"ls-remote",
		"--refs",
		"--",
		input.url,
		ref
	]);
	if (result.code !== 0 || result.termination !== "exit") throw new ProjectCloneError("network", "The repository branch could not be verified; retry the Gateway move.");
	const raw = result.stdout.trim();
	if (!raw) return;
	const [sha, observedRef, ...extra] = raw.split(/\s+/u);
	if (!sha || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(sha) || observedRef !== ref || extra.length) throw new ProjectCloneError("clone_failed", "The repository branch observation is invalid.");
	return sha;
}
//#endregion
//#region src/projects/project-clone.ts
const PROJECT_CLONE_LEASE_MS = 3e4;
const PROJECT_CLONE_WAIT_MS = 3e4;
async function existingCanonicalProject(cfg, canonicalUrl, options) {
	return (await listProjectRegistry(cfg, options)).find((project) => {
		return (project.originUrl ? parseProjectGitUrl(project.originUrl) : null)?.url === canonicalUrl;
	});
}
/** Materializes and registers a project from an accepted GitHub remote. */
async function materializeProjectClone(input, options = {}) {
	const { cfg, gitUrl, name, requiredCommit } = input;
	const { signal, timeoutMs, token } = options;
	const parsed = parseProjectGitUrl(gitUrl);
	if (!parsed) throw new ProjectCloneError("invalid_url", "Use a GitHub HTTPS or git@github.com repository URL. Local paths and file URLs are not accepted.");
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	const databaseOptions = {
		path: context.admission.databasePath,
		env
	};
	const fingerprint = sha256HexPrefixCore(parsed.url, 16);
	return await withOpenClawStateLease({
		scope: "projects.clone",
		key: fingerprint,
		database: {
			scope: "shared",
			options: databaseOptions
		},
		leaseMs: PROJECT_CLONE_LEASE_MS,
		waitMs: PROJECT_CLONE_WAIT_MS,
		...signal ? { signal } : {},
		leaseLabel: "project clone lease",
		operationLabel: "projects.clone.lease"
	}, async (lease) => {
		while (true) {
			const candidate = await existingCanonicalProject(cfg, parsed.url, databaseOptions);
			lease.assertOwned();
			if (!candidate) break;
			const existing = await withProjectCheckoutLifecycle(candidate.repoRoot, {
				...databaseOptions,
				signal: lease.signal
			}, async (checkoutLease) => {
				const current = await existingCanonicalProject(cfg, parsed.url, databaseOptions);
				lease.assertOwned();
				checkoutLease.assertOwned();
				if (current?.repoRoot !== candidate.repoRoot) return;
				if (requiredCommit) {
					await ensureProjectCheckoutCommit({
						url: parsed.url,
						target: current.repoRoot,
						commit: requiredCommit
					}, {
						env,
						signal: checkoutLease.signal,
						timeoutMs,
						token
					});
					checkoutLease.assertOwned();
				}
				return current;
			});
			if (existing) return existing;
		}
		const displayName = name?.trim() || parsed.name;
		const directoryName = slugifyWorktreeTitle(displayName) ?? "project";
		const target = path.join(resolveStateDir(env), "projects", fingerprint, directoryName);
		await cloneProjectCheckout({
			url: parsed.url,
			target,
			requiredCommit
		}, {
			env,
			signal: lease.signal,
			timeoutMs,
			token
		});
		lease.assertOwned();
		const repoRoot = await resolveProjectDirectory(target);
		lease.assertOwned();
		return await withProjectCheckoutLifecycle(repoRoot, {
			...databaseOptions,
			signal: lease.signal
		}, async (checkoutLease) => {
			let registered = false;
			try {
				lease.assertOwned();
				const prepared = await prepareProjectRegistration({
					path: repoRoot,
					name: displayName,
					originUrl: parsed.url,
					source: "cloned"
				});
				return await registerPreparedProjectRegistry(prepared, checkoutLease, context, () => {
					registered = true;
				});
			} catch (error) {
				if (registered || collectNestedErrorCandidates(error).some((candidate) => extractErrorCode(candidate) === "outcome-unknown")) throw error;
				try {
					lease.assertOwned();
					checkoutLease.assertOwned();
					await fs.rm(target, {
						recursive: true,
						force: true
					});
				} catch {}
				throw error;
			}
		});
	});
}
/** Refreshes an existing project clone while holding its checkout lifecycle lease. */
async function refreshProjectClone(project, options = {}) {
	if (project.source !== "cloned") return;
	const selectedProject = {
		id: project.id,
		repoRoot: project.repoRoot,
		source: project.source,
		originUrl: project.originUrl
	};
	const { signal, timeoutMs, token } = options;
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	await withProjectCheckoutLifecycle(selectedProject.repoRoot, {
		path: context.admission.databasePath,
		env,
		signal
	}, async (lease) => {
		const current = await resolveProjectCloneRefreshOwner(selectedProject, lease, context);
		lease.assertOwned();
		if (!current) throw new ProjectCloneError("clone_failed", "This project is no longer a Gateway-managed clone. Reselect the repository and retry.");
		const originUrl = current.originUrl;
		if (!originUrl) throw new ProjectCloneError("invalid_url", "Saved project repository is invalid; select the repository and retry.");
		await refreshProjectCheckout({
			target: current.repoRoot,
			url: originUrl
		}, {
			env,
			signal: lease.signal,
			timeoutMs,
			token
		});
		lease.assertOwned();
	});
}
async function resolveClonedProjectCheckout(project, options = {}) {
	if (project.source !== "cloned") throw new ProjectCloneError("clone_failed", "Only projects cloned by the Gateway can delete their checkout.");
	const managedRoot = await fs.realpath(path.join(resolveStateDir(options.env), "projects"));
	const checkout = await fs.realpath(project.repoRoot).catch(() => {
		throw new ProjectCloneError("clone_failed", "The managed project checkout is already unavailable. Remove only its registry entry instead.");
	});
	const relative = path.relative(managedRoot, checkout);
	const segments = relative.split(path.sep);
	if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || segments.length !== 2 || !/^[a-f0-9]{16}$/u.test(segments[0] ?? "")) throw new ProjectCloneError("clone_failed", "The cloned project is outside the Gateway-managed projects area, so its checkout was not deleted.");
	return checkout;
}
/** Removes one cloned-project reference and deletes its checkout only after the final reference. */
async function removeClonedProjectCheckout(project, assertUnreferenced, options = {}) {
	return await withProjectCheckoutLifecycle(project.repoRoot, options, async (lease) => {
		const checkout = await resolveClonedProjectCheckout(project, options);
		await assertUnreferenced();
		const result = removeProjectCheckoutReference(project, lease, options);
		if (result === "missing") return false;
		if (result === "changed") throw new ProjectCloneError("clone_failed", "The cloned project changed before deletion.");
		if (result === "remaining") return true;
		lease.assertOwned();
		await fs.rm(checkout, { recursive: true });
		await fs.rmdir(path.dirname(checkout)).catch(() => {});
		return true;
	});
}
//#endregion
export { readProjectCheckoutRemoteHead as a, ProjectCloneError as i, refreshProjectClone as n, removeClonedProjectCheckout as r, materializeProjectClone as t };
