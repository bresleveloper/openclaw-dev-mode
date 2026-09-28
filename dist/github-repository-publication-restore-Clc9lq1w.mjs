import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { f as retryableGitNetworkOperation, p as withGitNetworkRetry, s as gitNullConfigPath } from "./git-exec-B6ZpVpQV.mjs";
import { c as splitNullBuffer } from "./git-path-inventory-q-EbMqyF.mjs";
import { a as GitHubPublicationWorkflowChangesError, n as GitHubPublicationKnownFailure } from "./github-publication-failure-B1jd4XaP.mjs";
import { n as NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES } from "./node-workspace-protocol-DpYnx7G7.mjs";
import { c as githubPublicationUnsafeConfigArgs, i as GITHUB_PUBLICATION_CONFIG_GUARD_JS, r as readGitHubRepositoryPublicationMetadata } from "./github-repository-publication-snapshot-BsI_wN-N.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/gateway/github-publication-workflows.ts
const workflowDirectory = ".github/workflows/";
function assertGitHubPublicationWorkflowChangesAllowed(requester) {
	requester.assertCurrent();
	if (!roleScopesAllow({
		role: "operator",
		requestedScopes: ["operator.write"],
		allowedScopes: requester.snapshot.scopes
	})) throw new GitHubPublicationWorkflowChangesError();
}
function isGitHubPublicationWorkflowPath(file) {
	return file.startsWith(workflowDirectory) && /^[^/]+\.ya?ml$/iu.test(file.slice(18));
}
/** Full-authority publishers need no extra GitHub tree reads; restricted requests prove their delta. */
async function prepareGitHubPublicationWorkflowGuard(assertWorkflowChangesAllowed, hasWorkflowChanges) {
	try {
		assertWorkflowChangesAllowed();
	} catch (error) {
		if (!(error instanceof GitHubPublicationWorkflowChangesError) || await hasWorkflowChanges()) throw error;
		return () => {};
	}
	return assertWorkflowChangesAllowed;
}
function unavailableWorkflowTree() {
	return new GitHubPublicationKnownFailure("GitHub workflow definitions could not be verified.", {
		code: "unavailable",
		nextAction: "Restore repository read access and retry publication after the workflow definitions can be verified. Your saved changes are intact."
	});
}
/** Compare executable definitions before the accepted checkpoint creates any GitHub objects. */
async function hasRepositoryGitHubPublicationWorkflowChanges(params) {
	const trees = /* @__PURE__ */ new Map();
	const readTree = (repository, sha) => {
		const key = repository + "\0" + sha;
		let pending = trees.get(key);
		if (!pending) {
			pending = (async () => {
				const value = await params.readTree(repository, sha);
				if (!isRecord(value) || value.sha !== sha || value.truncated !== false || !Array.isArray(value.tree)) throw unavailableWorkflowTree();
				const names = /* @__PURE__ */ new Set();
				return value.tree.map((entry) => {
					if (!isRecord(entry) || typeof entry.path !== "string" || !entry.path || entry.path.includes("/") || names.has(entry.path) || typeof entry.sha !== "string" || !/^[a-f0-9]{40}$/u.test(entry.sha) || typeof entry.mode !== "string" || !(entry.mode === "040000" && entry.type === "tree" || entry.mode === "160000" && entry.type === "commit" || [
						"100644",
						"100755",
						"120000"
					].includes(entry.mode) && entry.type === "blob")) throw unavailableWorkflowTree();
					names.add(entry.path);
					return {
						path: entry.path,
						mode: entry.mode,
						sha: entry.sha
					};
				});
			})();
			trees.set(key, pending);
		}
		return pending;
	};
	const workflows = async (repository, root) => {
		let entries = await readTree(repository, root);
		for (const name of [".github", "workflows"]) {
			const directory = entries.find((entry) => entry.path === name);
			if (directory?.mode !== "040000") return /* @__PURE__ */ new Map();
			entries = await readTree(repository, directory.sha);
		}
		return new Map(entries.flatMap((entry) => {
			const file = workflowDirectory + entry.path;
			return entry.mode !== "040000" && isGitHubPublicationWorkflowPath(file) ? [[file, entry.mode + ":" + entry.sha]] : [];
		}));
	};
	const [before, accepted] = await Promise.all([workflows(params.comparisonRepository, params.comparisonTree), workflows(params.sourceRepository, params.snapshot.baseTree)]);
	if (params.snapshot.entries.some((entry) => entry.path === ".github" || entry.path === ".github/workflows")) accepted.clear();
	for (const entry of params.snapshot.entries) {
		if (!isGitHubPublicationWorkflowPath(entry.path)) continue;
		if (entry.sha === null) accepted.delete(entry.path);
		else accepted.set(entry.path, entry.mode + ":" + entry.sha);
	}
	return before.size !== accepted.size || [...before].some(([file, object]) => accepted.get(file) !== object);
}
//#endregion
//#region src/gateway/github-publication-git-transport.ts
async function runPublicationCommand(argv, options = {}) {
	return await withGitNetworkRetry(argv[0] === "git" ? retryableGitNetworkOperation(argv.slice(1)) : void 0, {
		timeoutMs: 6e4,
		beforeRun: options.beforeRun
	}, (timeoutMs) => runCommandBuffered(argv, {
		...options.cwd ? { cwd: options.cwd } : {},
		env: {
			...options.env ?? process.env,
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_CONFIG_COUNT: "1",
			GIT_CONFIG_KEY_0: "core.hooksPath",
			GIT_CONFIG_VALUE_0: os.devNull
		},
		...options.input !== void 0 ? { input: options.input } : {},
		timeoutMs,
		maxOutputBytes: options.maxOutputBytes ?? 262144
	}));
}
async function requirePublicationCommand(argv, options = {}) {
	const result = await runPublicationCommand(argv, options);
	if (result.code !== 0) throw new Error(`${argv[0]} command failed`);
	return result.stdout.toString("utf8").trim();
}
function createGitHubPublicationCommandRunner(assertCurrent) {
	const step = async (operation) => {
		assertCurrent?.();
		const result = await operation();
		assertCurrent?.();
		return result;
	};
	const run = async (argv, options = {}) => {
		const result = await runPublicationCommand(argv, {
			...options,
			beforeRun: assertCurrent
		});
		assertCurrent?.();
		return result;
	};
	return {
		step,
		run,
		require: async (argv, options = {}) => {
			const result = await requirePublicationCommand(argv, {
				...options,
				beforeRun: assertCurrent
			});
			assertCurrent?.();
			return result;
		}
	};
}
const TREE_LISTING_MAX_OUTPUT_BYTES = 67108864;
async function hasGitHubPublicationWorkflowChanges(params) {
	const changed = await params.run([
		"git",
		"diff-tree",
		"--no-commit-id",
		"--name-only",
		"-r",
		"-z",
		"--no-renames",
		params.comparisonCommit,
		params.workspaceTree,
		"--",
		".github/workflows"
	], {
		cwd: params.cwd,
		maxOutputBytes: TREE_LISTING_MAX_OUTPUT_BYTES
	});
	if (changed.code !== 0) throw new Error("GitHub publication workspace workflow changes could not be verified.");
	return changed.stdout.toString("latin1").split("\0").some(isGitHubPublicationWorkflowPath);
}
async function assertSafeGitPublicationWorkspace(cwd, run) {
	const isolatedConfig = {
		GIT_CONFIG_GLOBAL: gitNullConfigPath(),
		GIT_CONFIG_SYSTEM: gitNullConfigPath()
	};
	const [localUnsafe, worktreeConfig] = await Promise.all([run(githubPublicationUnsafeConfigArgs("--local"), {
		cwd,
		env: isolatedConfig
	}), run([
		"git",
		"config",
		"--local",
		"--includes",
		"--bool",
		"--get",
		"extensions.worktreeConfig"
	], {
		cwd,
		env: isolatedConfig
	})]);
	const worktreeConfigValue = worktreeConfig.stdout.toString("utf8").trim();
	const worktreeConfigKnown = worktreeConfig.code === 0 && (worktreeConfigValue === "true" || worktreeConfigValue === "false") || worktreeConfig.code === 1 && worktreeConfig.stdout.length === 0;
	if (localUnsafe.code !== 1 || localUnsafe.stdout.length > 0 || !worktreeConfigKnown) throw new Error("GitHub publication workspace has unsupported Git transport configuration.");
	const worktreeUnsafe = worktreeConfigValue === "true" ? await run(githubPublicationUnsafeConfigArgs("--worktree"), {
		cwd,
		env: isolatedConfig
	}) : void 0;
	if (worktreeUnsafe && (worktreeUnsafe.code !== 1 || worktreeUnsafe.stdout.length > 0)) throw new Error("GitHub publication workspace has unsupported Git transport configuration.");
	const [replacements, graftPath] = await Promise.all([run([
		"git",
		"for-each-ref",
		"--count=1",
		"--format=%(refname)",
		"refs/replace"
	], { cwd }), run([
		"git",
		"rev-parse",
		"--git-path",
		"info/grafts"
	], { cwd })]);
	if (replacements.code !== 0 || replacements.stdout.length > 0 || graftPath.code !== 0) throw new Error("GitHub publication workspace has unsupported Git replacement metadata.");
	const grafts = await readOptionalAttributeFile(path.resolve(cwd, graftPath.stdout.toString("utf8").trim()));
	if (grafts && grafts.length > 0) throw new Error("GitHub publication workspace has unsupported Git replacement metadata.");
}
function assertNoGitFilterAttributes(contents) {
	for (const line of contents.toString("latin1").split(/\r?\n/u)) {
		const fields = line.trimStart().split(/[\t ]+/u);
		if (!fields[0] || fields[0].startsWith("#")) continue;
		if (fields.slice(1).some((field) => /^(?:-|!)?filter(?:=|$)/u.test(field))) throw new Error("GitHub publication workspace uses an unsupported Git clean filter.");
	}
}
async function readOptionalAttributeFile(file) {
	try {
		return await fs.readFile(file);
	} catch (error) {
		if ((typeof error === "object" && error !== null && "code" in error ? error.code : void 0) === "ENOENT") return;
		throw error;
	}
}
async function readGitHubPublicationTree(cwd, workspaceTree, run) {
	const listing = await run([
		"git",
		"ls-tree",
		"-r",
		"-z",
		"--full-tree",
		workspaceTree
	], {
		cwd,
		maxOutputBytes: TREE_LISTING_MAX_OUTPUT_BYTES
	});
	if (listing.code !== 0) throw new Error("GitHub publication workspace tree could not be verified.");
	return listing.stdout;
}
async function assertGitHubPublicationTreeHasNoFilters(cwd, workspaceTree, run) {
	const listing = await readGitHubPublicationTree(cwd, workspaceTree, run);
	const attributeObjects = /* @__PURE__ */ new Set();
	for (const record of listing.toString("latin1").split("\0")) {
		const tab = record.indexOf("	");
		if (tab < 0) continue;
		const file = record.slice(tab + 1).toLowerCase();
		if (file !== ".gitattributes" && !file.endsWith("/.gitattributes")) continue;
		const objectId = record.slice(0, tab).split(" ")[2];
		if (objectId) attributeObjects.add(objectId);
	}
	if (attributeObjects.size > 1024) throw new Error("GitHub publication workspace has too many Git attribute files.");
	for (const objectId of attributeObjects) {
		const blob = await run([
			"git",
			"cat-file",
			"blob",
			objectId
		], { cwd });
		if (blob.code !== 0) throw new Error("GitHub publication workspace attributes could not be verified.");
		assertNoGitFilterAttributes(blob.stdout);
	}
	const infoPath = await run([
		"git",
		"rev-parse",
		"--git-path",
		"info/attributes"
	], { cwd });
	if (infoPath.code !== 0) throw new Error("GitHub publication workspace attributes could not be verified.");
	const attributeFiles = await Promise.all(["GIT_ATTR_GLOBAL", "GIT_ATTR_SYSTEM"].map(async (name) => await run([
		"git",
		"var",
		name
	], { cwd })));
	if (attributeFiles.some((result) => result.code !== 0)) throw new Error("GitHub publication workspace attributes could not be verified.");
	const paths = [path.resolve(cwd, infoPath.stdout.toString("utf8").trim()), ...attributeFiles.flatMap((result) => result.stdout.length > 0 ? [result.stdout.toString("utf8").trim()] : [])];
	for (const file of paths) {
		const contents = await readOptionalAttributeFile(file);
		if (contents) assertNoGitFilterAttributes(contents);
	}
}
async function captureGitHubPublicationWorkspaceSnapshot(params) {
	const { withSettledLocalWorkspacePath } = await import("./local-workspace-projection-lXm7FxN2.mjs");
	return await withSettledLocalWorkspacePath(params, async (custody) => {
		const admittedPaths = await custody?.canonicalPaths();
		const bound = {
			...params,
			assertCurrent: () => {
				params.assertCurrent?.();
				custody?.assertCurrent();
			}
		};
		const [{ findLiveRegistryWorktreeByPath }, { withManagedWorktreeGit }, { getRuntimeConfig }] = await Promise.all([
			import("./registry-BWGLBd2p.mjs"),
			import("./checkout-policy-D0Het_06.mjs"),
			import("./config/config.js")
		]);
		const record = findLiveRegistryWorktreeByPath(process.env, params.cwd);
		return record ? await withManagedWorktreeGit({
			record,
			env: process.env,
			getConfig: getRuntimeConfig,
			beforeRun: bound.assertCurrent
		}, (git) => captureSettledGitHubPublicationWorkspaceSnapshot(bound, git.sourceOnly ? git : void 0, admittedPaths)) : await captureSettledGitHubPublicationWorkspaceSnapshot(bound, void 0, admittedPaths);
	});
}
async function captureSettledGitHubPublicationWorkspaceSnapshot(params, policy, admittedPaths) {
	const { step, require: command } = createGitHubPublicationCommandRunner(params.assertCurrent);
	const git = (args, env, input) => policy ? step(() => policy.require(params.cwd, args, {
		env,
		input,
		beforeRun: params.assertCurrent
	})) : command([
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		...args
	], {
		cwd: params.cwd,
		env,
		input
	});
	await step(() => assertSafeGitPublicationWorkspace(params.cwd, runPublicationCommand));
	const sourceHeadCommit = await command([
		"git",
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], { cwd: params.cwd });
	const index = path.resolve(params.cwd, await git([
		"rev-parse",
		"--git-path",
		"index"
	]));
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-github-snapshot-"));
	try {
		const env = {
			GIT_ATTR_NOSYSTEM: "1",
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath(),
			GIT_INDEX_FILE: path.join(tempDir, "index")
		};
		const indexStat = await step(() => fs.stat(index, { bigint: true }));
		await step(() => fs.copyFile(index, env.GIT_INDEX_FILE));
		const indexTimestamp = Number(indexStat.mtimeNs / 1000000000n);
		await step(() => fs.utimes(env.GIT_INDEX_FILE, indexTimestamp, indexTimestamp));
		const sourceIndexTree = await git(["write-tree"], env);
		await git([
			"-c",
			`core.attributesFile=${os.devNull}`,
			"add",
			"-A"
		], env);
		let workspaceTree = await git(["write-tree"], env);
		if (admittedPaths) {
			const staged = await step(() => readGitHubPublicationTree(params.cwd, workspaceTree, runPublicationCommand));
			const admitted = new Set([...admittedPaths].map((entry) => Buffer.from(entry).toString("hex")));
			const excluded = splitNullBuffer(staged).map((record) => record.subarray(record.indexOf(9) + 1)).filter((entry) => !admitted.has(entry.toString("hex")));
			if (excluded.length) {
				await git([
					"update-index",
					"--force-remove",
					"-z",
					"--stdin"
				], env, Buffer.concat(excluded.flatMap((entry) => [entry, Buffer.from([0])])));
				workspaceTree = await git(["write-tree"], env);
			}
		}
		await step(() => assertGitHubPublicationTreeHasNoFilters(params.cwd, workspaceTree, runPublicationCommand));
		return {
			sourceHeadCommit,
			sourceIndexTree,
			workspaceTree
		};
	} finally {
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
const GITHUB_CREDENTIAL_ARGS = [
	"git",
	"-c",
	"credential.helper=",
	"-c",
	"credential.helper=!gh auth git-credential"
];
function appendGitHubPublicationMessage(base, lines) {
	const present = new Set(base.split(/\r?\n/u).map((line) => line.trim()));
	const missing = lines.filter((line) => !present.has(line));
	return missing.length > 0 ? `${base.trimEnd()}\n\n${missing.join("\n")}` : base.trimEnd();
}
async function assertGitHubPublicationBranchRef(branch, run) {
	const code = await run([
		"git",
		"symbolic-ref",
		"--quiet",
		`refs/heads/${branch}`
	]);
	if (code === 0) throw new Error("GitHub publication workspace branch ref became symbolic.");
	if (code !== 1) throw new Error("GitHub publication workspace branch ref could not be verified.");
}
function githubPublicationPushArgs(remote, headCommit, branch, expectedRemoteHead) {
	return [
		...GITHUB_CREDENTIAL_ARGS,
		"-c",
		`core.hooksPath=${os.devNull}`,
		"push",
		"--porcelain",
		`--force-with-lease=refs/heads/${branch}:${expectedRemoteHead}`,
		"--no-follow-tags",
		"--recurse-submodules=no",
		"--",
		remote,
		`${headCommit}:refs/heads/${branch}`
	];
}
function githubPublicationRemoteHeadArgs(remote, branch) {
	return [
		...GITHUB_CREDENTIAL_ARGS,
		"ls-remote",
		"--refs",
		remote,
		`refs/heads/${branch}`
	];
}
function githubPublicationUpdateRefArgs(branch, commit, previousHead) {
	return [
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"update-ref",
		`refs/heads/${branch}`,
		commit,
		previousHead
	];
}
//#endregion
//#region src/gateway/github-repository-publication-restore.ts
const RESTORE_PUBLICATION_INDEX_JS = String.raw`
const fs = require("node:fs");
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const { spawnSync } = require("node:child_process");
const paths = JSON.parse(fs.readFileSync(0, "utf8"));
const cwd = process.cwd();
const env = { ...process.env };
for (const key of Object.keys(env)) if (/^GIT_/i.test(key)) delete env[key];
Object.assign(env, { GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  GIT_CONFIG_COUNT: "0", GIT_ATTR_NOSYSTEM: "1", GIT_NO_REPLACE_OBJECTS: "1" });
${GITHUB_PUBLICATION_CONFIG_GUARD_JS}
const action = process.argv[1];
if (action !== "add" && action !== "remove") throw Error("Invalid publication restore operation");
const operation = action === "remove" ? ["update-index", "--force-remove", "-z", "--stdin"] :
  ["add", "--intent-to-add", "--force", "--pathspec-from-file=-", "--pathspec-file-nul"];
const result = spawnSync("git", ["--literal-pathspecs", "-c", "core.hooksPath=" + gitNullPath,
  "-c", "core.fsmonitor=false", "-c", "core.attributesFile=" + gitNullPath,
  ...operation], {
  env,
  input: paths.join("\0") + "\0", timeout: 60000, maxBuffer: 128 * 1024,
});
if (result.error || result.status !== 0) {
  throw Error("Repository publication paths could not be restored; retry workspace preparation");
}
`;
/** Recover publication membership, not the prior staging contents or private recovery-only paths. */
async function prepareRepositoryPublicationRestore(params) {
	if (!params.publicationStagingRoot || !params.publicationDigest) return [];
	const { snapshot } = await readGitHubRepositoryPublicationMetadata(params.publicationStagingRoot, params.publicationDigest);
	if (snapshot.baseCommit !== params.current.baseCommit) throw new Error("Repository publication paths differ from the restored source baseline");
	const current = new Map(params.current.entries.map((entry) => [entry.path, entry]));
	const overlay = new Map(snapshot.entries.map((entry) => [entry.path, entry]));
	const accepted = new Map(overlay);
	const removed = new Set(snapshot.entries.filter((entry) => entry.sha === null && entry.mode !== "160000").map((entry) => entry.path));
	let indexed;
	if (params.indexBase) {
		const { root, commit, assertCurrent } = params.indexBase;
		const { run } = createGitHubPublicationCommandRunner(assertCurrent);
		const readTree = async (tree) => {
			const raw = await readGitHubPublicationTree(root, tree, run);
			const text = raw.toString("utf8");
			if (!Buffer.from(text).equals(raw)) throw new Error("Repository publication paths are not valid UTF-8");
			return text.split("\0").filter(Boolean).map((record) => {
				const tab = record.indexOf("	");
				const [mode, , sha] = record.slice(0, tab).split(" ");
				if (tab < 0 || !mode || !sha) throw new Error("Repository publication tree inventory is invalid");
				return {
					path: record.slice(tab + 1),
					mode,
					sha
				};
			});
		};
		const [baseTree, indexTree] = await Promise.all([readTree(snapshot.baseTree), readTree(commit)]);
		indexed = new Set(indexTree.map((entry) => entry.path));
		for (const entry of baseTree) if (!overlay.has(entry.path) && (entry.mode === "100644" || entry.mode === "100755" || entry.mode === "120000")) accepted.set(entry.path, {
			...entry,
			mode: entry.mode,
			sha: entry.sha
		});
		for (const entry of indexTree) if (entry.mode !== "160000" && !accepted.get(entry.path)?.sha) removed.add(entry.path);
	}
	const added = [...accepted.values()].flatMap((entry) => {
		const raw = current.get(entry.path);
		const file = (entry.mode === "100644" || entry.mode === "100755") && raw?.type === "file";
		const symlink = entry.mode === "120000" && raw?.type === "symlink";
		return entry.sha && !indexed?.has(entry.path) && (file || symlink || !overlay.has(entry.path)) ? [entry.path] : [];
	});
	const commands = [];
	for (const [action, paths] of [["remove", [...removed]], ["add", added]]) {
		let batch = [];
		let bytes = 2;
		const flush = () => {
			if (batch.length) {
				commands.push({
					argv: [
						"node",
						"-e",
						RESTORE_PUBLICATION_INDEX_JS,
						action
					],
					input: JSON.stringify(batch)
				});
				batch = [];
				bytes = 2;
			}
		};
		const limit = NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES / 2;
		for (const file of paths) {
			const size = Buffer.byteLength(JSON.stringify(file)) + 1;
			if (size + 2 > limit) throw new Error("Repository publication path exceeds the restore command limit");
			if (bytes + size > limit) flush();
			batch.push(file);
			bytes += size;
		}
		flush();
	}
	return commands;
}
//#endregion
export { captureGitHubPublicationWorkspaceSnapshot as a, githubPublicationRemoteHeadArgs as c, requirePublicationCommand as d, runPublicationCommand as f, prepareGitHubPublicationWorkflowGuard as h, assertSafeGitPublicationWorkspace as i, githubPublicationUpdateRefArgs as l, hasRepositoryGitHubPublicationWorkflowChanges as m, appendGitHubPublicationMessage as n, createGitHubPublicationCommandRunner as o, assertGitHubPublicationWorkflowChangesAllowed as p, assertGitHubPublicationBranchRef as r, githubPublicationPushArgs as s, prepareRepositoryPublicationRestore as t, hasGitHubPublicationWorkflowChanges as u };
