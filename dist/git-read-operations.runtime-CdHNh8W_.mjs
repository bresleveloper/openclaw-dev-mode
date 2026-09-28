import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as resolveGitRefsBase, i as readGitRefs, n as readGitHead } from "./git-root-DLNHL8nb.mjs";
import { t as canReadGitFilesystemRefs } from "./git-worker-context-Cywc-SH2.mjs";
import { t as GIT_TIMEOUT_MS, u as requireGitCommandOutput } from "./git-exec-B6ZpVpQV.mjs";
import { d as runGit, f as runGitBuffered, o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import { t as resolveCheckoutRootFromRealPath } from "./repository-paths-D-QkusC-.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CloOx2kv.mjs";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/agents/worktrees/branches.runtime.ts
const BRANCH_INVENTORY_MAX_OUTPUT_BYTES = 262144;
const BRANCH_SUGGESTIONS_PER_KIND = 100;
async function listRepositoryBranchRefs(repoRoot, patterns, count) {
	const result = await runGit(repoRoot, [
		"-c",
		"core.warnAmbiguousRefs=true",
		"for-each-ref",
		...count === void 0 ? [] : [`--count=${count}`],
		"--sort=refname",
		count === void 0 ? "--format=%(refname)%00%(refname:short)%00%(symref)%00%(HEAD)" : "--format=%(refname)%00%(refname:short)",
		...patterns
	], {
		maxOutputBytes: BRANCH_INVENTORY_MAX_OUTPUT_BYTES,
		terminateOnOutputLimit: count === void 0
	});
	const output = requireGitCommandOutput("git for-each-ref", result);
	const branches = [];
	for (const line of output.trim().split("\n")) {
		const [ref, name, symbolicRef, head] = line.split("\0");
		const metadata = {
			symbolicRef: symbolicRef || void 0,
			current: head === "*"
		};
		if (!ref || !name) continue;
		if (ref.startsWith("refs/heads/")) branches.push({
			ref,
			...metadata,
			branchName: ref.slice(11),
			branch: {
				name,
				kind: "local"
			}
		});
		else if (ref.startsWith("refs/remotes/")) {
			const remoteRef = ref.slice(13);
			const slash = remoteRef.indexOf("/");
			const branchName = slash > 0 ? remoteRef.slice(slash + 1) : "";
			branches.push({
				ref,
				branchName,
				...metadata,
				branch: {
					name,
					kind: "remote"
				}
			});
		}
	}
	return branches;
}
async function readRepositoryBranches(repoRoot, options = {}) {
	let sourceRoot;
	try {
		const requested = await fs$1.realpath(repoRoot).catch(() => {
			throw new Error(`repository does not exist: ${repoRoot}`);
		});
		if (options.includeRepositoryStatus) {
			if (!(await fs$1.stat(requested)).isDirectory()) return {
				branches: [],
				repositoryStatus: "unavailable"
			};
			if (!insideGitCheckout(requested)) return {
				branches: [],
				repositoryStatus: "not_git"
			};
		}
		sourceRoot = await resolveCheckoutRootFromRealPath(requested, repoRoot);
	} catch (error) {
		if (options.includeRepositoryStatus) return {
			branches: [],
			repositoryStatus: "unavailable"
		};
		throw error;
	}
	let inventory;
	try {
		inventory = await listRepositoryBranchRefs(sourceRoot, ["refs/heads/", "refs/remotes/"]);
	} catch {
		inventory = void 0;
	}
	const branches = /* @__PURE__ */ new Map();
	let branchesUnavailable = false;
	for (const prefix of ["refs/remotes/", "refs/heads/"]) try {
		const entries = inventory ? inventory.filter((entry) => entry.ref.startsWith(prefix)).slice(0, BRANCH_SUGGESTIONS_PER_KIND) : await listRepositoryBranchRefs(sourceRoot, [prefix], BRANCH_SUGGESTIONS_PER_KIND);
		for (const entry of entries) if (entry.branchName && (entry.branch.kind !== "remote" || entry.branchName !== "HEAD")) branches.set(entry.branchName, entry);
	} catch {
		branchesUnavailable = true;
	}
	let defaultRef;
	let headRef;
	if (inventory) {
		defaultRef = inventory.find((entry) => entry.ref === "refs/remotes/origin/HEAD")?.symbolicRef;
		headRef = inventory.find((entry) => entry.current)?.ref;
	} else {
		const remoteHead = await runGit(sourceRoot, [
			"symbolic-ref",
			"--quiet",
			"refs/remotes/origin/HEAD"
		]);
		defaultRef = remoteHead.code === 0 ? remoteHead.stdout.trim() : void 0;
		const head = await runGit(sourceRoot, [
			"symbolic-ref",
			"--quiet",
			"HEAD"
		]);
		headRef = head.code === 0 ? head.stdout.trim() : void 0;
	}
	const resolveBranch = async (ref) => {
		if (!ref) return;
		const known = (inventory ?? [...branches.values()]).find((entry) => entry.ref === ref);
		if (known || inventory) return known?.branchName && (known.branch.kind !== "remote" || known.branchName !== "HEAD") ? known : void 0;
		try {
			return (await listRepositoryBranchRefs(sourceRoot, [ref], 1)).find((entry) => entry.ref === ref && entry.branchName && (entry.branch.kind !== "remote" || entry.branchName !== "HEAD"));
		} catch {
			branchesUnavailable = true;
			return;
		}
	};
	const defaultEntry = await resolveBranch(defaultRef?.startsWith("refs/remotes/origin/") ? `refs/heads/${defaultRef.slice(20)}` : void 0) ?? await resolveBranch(defaultRef);
	const headEntry = await resolveBranch(headRef);
	for (const entry of [defaultEntry, headEntry]) if (entry) branches.set(entry.branchName, entry);
	const rank = (entry) => entry.ref === defaultEntry?.ref ? 0 : entry.ref === headEntry?.ref ? 1 : 2;
	return {
		branches: [...branches.values()].toSorted((a, b) => rank(a) - rank(b) || a.branch.name.localeCompare(b.branch.name)).map((entry) => entry.branch),
		...defaultEntry ? { defaultBranch: defaultEntry.branch.name } : {},
		...headEntry ? { headBranch: headEntry.branch.name } : {},
		...options.includeRepositoryStatus ? { repositoryStatus: "git" } : {},
		...branchesUnavailable ? { branchesUnavailable: true } : {}
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs-landing.ts
/** Only ordinary file-backed refs bypass Git; unusual discovery/layouts retain its semantics. */
function readCheckoutHead(root) {
	if (!canReadGitFilesystemRefs()) return null;
	try {
		const head = readGitHead(root, { maxDepth: 1 });
		if (!head?.value || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(head.value) || fs.lstatSync(head.headPath).isSymbolicLink()) return null;
		const sha = head.value.toLowerCase();
		const refsBase = head.refsBase ?? resolveGitRefsBase(head.headPath);
		if (fs.existsSync(path.join(refsBase, "reftable")) || head.ref !== null && !head.ref.startsWith("refs/heads/")) return null;
		const branch = head.ref?.slice(11) ?? null;
		if (branch !== null && /^(?:[A-Z_]+$|(?:refs|bisect|worktree|rewritten|main-worktree|worktrees)\/)/.test(branch)) return null;
		const headAliases = [
			"refs/HEAD",
			"refs/tags/HEAD",
			"refs/heads/HEAD",
			"refs/remotes/HEAD",
			"refs/remotes/HEAD/HEAD"
		];
		const branchAliases = branch === null ? [] : [
			`refs/${branch}`,
			`refs/tags/${branch}`,
			`refs/remotes/${branch}`,
			`refs/remotes/${branch}/HEAD`
		];
		const aliases = readGitRefs(refsBase, [...headAliases, ...branchAliases]);
		if (headAliases.some((ref) => aliases.get(ref) !== null)) return null;
		if (branch === null) return {
			sha,
			branch
		};
		return {
			sha,
			...fs.existsSync(path.join(refsBase, branch)) || branchAliases.some((ref) => aliases.get(ref) !== null) ? {} : { branch }
		};
	} catch {
		return null;
	}
}
async function gitOutput(cwd, args) {
	try {
		const result = await runGit(cwd, args);
		return result.code === 0 ? result.stdout.trim() || null : null;
	} catch {
		return null;
	}
}
async function readRemoteRevisions(root, refs) {
	try {
		const result = await runGit(root, [
			"for-each-ref",
			"--format=%(refname)%00%(objectname)",
			"--",
			...refs
		], {
			maxOutputBytes: 16384,
			terminateOnOutputLimit: true
		});
		const output = requireGitCommandOutput("git for-each-ref", result);
		const revisions = /* @__PURE__ */ new Map();
		for (const line of output.trim().split("\n")) {
			const separator = line.indexOf("\0");
			const ref = line.slice(0, separator);
			if (separator > 0 && refs.includes(ref)) revisions.set(ref, line.slice(separator + 1));
		}
		return revisions;
	} catch {
		const revisions = /* @__PURE__ */ new Map();
		for (const ref of refs) {
			const revision = await gitOutput(root, [
				"rev-parse",
				"--verify",
				"--quiet",
				ref
			]);
			if (revision) revisions.set(ref, revision);
		}
		return revisions;
	}
}
async function isAncestor(root, ancestor, descendant) {
	try {
		return (await runGit(root, [
			"merge-base",
			"--is-ancestor",
			ancestor,
			descendant
		])).code === 0;
	} catch {
		return false;
	}
}
/**
* Picks the newest of the known-published baseline candidates. Two candidates
* (the dominant case) stay a single ancestry call; larger sets batch through
* one `merge-base --independent`. Among incomparable maxima, a candidate
* containing the first entry (the merge base) is preferred — any such pick is
* sound because it covers everything the merge base covers — and otherwise
* the earliest candidate wins, keeping the merge base as the safe default.
*/
async function maximalCommit(root, candidates) {
	const unique = [...new Set(candidates)];
	const first = unique[0];
	if (first === void 0) return null;
	if (unique.length === 1) return first;
	const second = unique[1];
	if (unique.length === 2 && second !== void 0) return await isAncestor(root, first, second) ? second : first;
	const out = await gitOutput(root, [
		"merge-base",
		"--independent",
		...unique
	]);
	if (!out) return first;
	const independent = new Set(out.split("\n").map((line) => line.trim()).filter(Boolean));
	const maxima = unique.filter((candidate) => independent.has(candidate));
	for (const candidate of maxima) if (candidate === first || maxima.length === 1 || await isAncestor(root, first, candidate)) return candidate;
	return maxima[0] ?? first;
}
async function resolveBranchLanding(root, params) {
	const pushedRef = `refs/remotes/origin/${params.branch}`;
	const defaultRef = params.defaultBranch ? `refs/remotes/origin/${params.defaultBranch}` : null;
	const revisions = await readRemoteRevisions(root, [pushedRef, ...defaultRef ? [defaultRef] : []]);
	const pushedSha = revisions.get(pushedRef) ?? null;
	const headSha = readCheckoutHead(root)?.sha ?? await gitOutput(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	]);
	const defaultSha = defaultRef ? revisions.get(defaultRef) ?? null : null;
	const possibleLandings = params.mergedHeads.filter((head) => head.baseRef === params.defaultBranch || Boolean(params.defaultBranch && head.mergeCommitSha));
	const landedHeads = [];
	for (const head of possibleLandings) if (head.baseRef === params.defaultBranch) landedHeads.push(head);
	else if (defaultSha && head.mergeCommitSha && await isAncestor(root, head.mergeCommitSha, defaultSha)) landedHeads.push(head);
	const landedShas = new Set(landedHeads.map((head) => head.sha));
	const mergeBase = defaultSha && headSha ? await gitOutput(root, [
		"merge-base",
		defaultSha,
		headSha
	]) : null;
	const baselines = mergeBase ? [mergeBase] : [];
	if (headSha) {
		for (const merged of landedShas) if (await isAncestor(root, merged, headSha)) baselines.push(merged);
		else if (await isAncestor(root, headSha, merged)) baselines.push(headSha);
	}
	const statsBase = await maximalCommit(root, baselines);
	let provenNewPushedWork = false;
	if (pushedSha && mergeBase && !landedShas.has(pushedSha.toLowerCase())) {
		provenNewPushedWork = landedHeads.length > 0;
		for (const head of landedHeads) if (!((head.mergeCommitSha ? await isAncestor(root, head.mergeCommitSha, mergeBase) : false) || await isAncestor(root, head.sha, mergeBase))) {
			provenNewPushedWork = false;
			break;
		}
	}
	return {
		pushedSha,
		defaultSha,
		statsBase,
		hasLandedPullRequest: landedHeads.length > 0,
		provenNewPushedWork
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs-git.runtime.ts
async function readCheckoutGitContext(root) {
	const head = readCheckoutHead(root);
	const branch = head?.branch === null ? "HEAD" : head?.branch ?? await gitOutput(root, [
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	]);
	if (!branch) return null;
	const remoteUrl = await gitOutput(root, [
		"remote",
		"get-url",
		"origin"
	]);
	const remote = remoteUrl ? parseGitHubRemoteUrl(remoteUrl) : null;
	if (!remote) return null;
	const defaultBranch = (await gitOutput(root, [
		"symbolic-ref",
		"--short",
		"refs/remotes/origin/HEAD"
	]))?.replace(/^origin\//, "");
	return {
		...remote,
		branch: branch === "HEAD" ? null : branch,
		root,
		...defaultBranch ? { defaultBranch } : {}
	};
}
const SHORTSTAT_FILES = /(\d+) files? changed/;
const SHORTSTAT_INSERTIONS = /(\d+) insertion/;
const SHORTSTAT_DELETIONS = /(\d+) deletion/;
const MAX_UNTRACKED_STAT_FILES = 100;
const MAX_UNTRACKED_STAT_BYTES = 524288;
/**
* Line count for one untracked file, computed in-process: this runs on the
* chat view's poll, so it must not spawn one git subprocess per path. lstat
* gates on regular files so FIFOs/sockets can never block the RPC and symlinks
* never resolve outside the checkout; only a line count is exposed, so
* sessions-diff's hardlink content guard is unnecessary here.
*/
async function untrackedFileAdditions(root, filePath) {
	try {
		const abs = path.resolve(root, filePath);
		const info = await fs$1.lstat(abs);
		if (!info.isFile() || info.size === 0 || info.size > MAX_UNTRACKED_STAT_BYTES) return 0;
		const body = await fs$1.readFile(abs);
		if (body.subarray(0, 8192).includes(0)) return 0;
		let lines = 0;
		for (const byte of body) if (byte === 10) lines += 1;
		return body[body.length - 1] === 10 ? lines : lines + 1;
	} catch {
		return 0;
	}
}
async function untrackedStats(root) {
	const paths = (await gitOutput(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]) ?? "").split("\0").filter(Boolean);
	let additions = 0;
	for (const filePath of paths.slice(0, MAX_UNTRACKED_STAT_FILES)) additions += await untrackedFileAdditions(root, filePath);
	return {
		additions,
		files: paths.length
	};
}
/**
* Working-tree diff counts vs an explicit base, untracked files included:
* the size the PR would have if the current work were committed and pushed;
* changedFiles decides row visibility for unpushed branches. Unlike bare
* `git diff`, this also counts unmerged (conflict) paths.
*/
async function diffStatsAgainst(root, base) {
	try {
		const result = await runGit(root, [
			"diff",
			"--shortstat",
			"--no-ext-diff",
			"--no-textconv",
			base
		]);
		if (result.code !== 0) return null;
		const summary = result.stdout.trim();
		const untracked = await untrackedStats(root);
		return {
			additions: Number(SHORTSTAT_INSERTIONS.exec(summary)?.[1] ?? 0) + untracked.additions,
			deletions: Number(SHORTSTAT_DELETIONS.exec(summary)?.[1] ?? 0),
			changedFiles: Number(SHORTSTAT_FILES.exec(summary)?.[1] ?? 0) + untracked.files
		};
	} catch {
		return null;
	}
}
/**
* GitHub's pull/new page only has something to offer once the pushed branch
* carries commits the default branch lacks. Rename-only commits still count:
* this gate keys on commits, not line counts.
*/
async function branchHasCreatablePullRequest(root, defaultSha, pushedSha, defaultBranch) {
	if (!defaultBranch || !pushedSha) return false;
	if (!defaultSha) return true;
	const ahead = await gitOutput(root, [
		"rev-list",
		"--count",
		`${defaultSha}..${pushedSha}`
	]);
	return ahead === null || Number(ahead) > 0;
}
async function readPullRequestBranchFacts(input) {
	const landing = await resolveBranchLanding(input.root, input);
	const noPushedChanges = landing.defaultSha !== null && landing.defaultSha === landing.pushedSha && landing.statsBase === landing.defaultSha;
	const creatable = (!landing.hasLandedPullRequest || landing.provenNewPushedWork) && !noPushedChanges && await branchHasCreatablePullRequest(input.root, landing.defaultSha, landing.pushedSha, input.defaultBranch);
	const stats = landing.statsBase ? await diffStatsAgainst(input.root, landing.statsBase) : null;
	return !creatable && !(stats && stats.changedFiles > 0) ? void 0 : {
		creatable,
		stats
	};
}
//#endregion
//#region src/sessions/session-diff-parser.ts
/** Parses `git diff --name-status -z -M` output; R/C entries consume two paths. */
function parseNameStatusZ(text) {
	return parseNameStatusTokens(text.split("\0"));
}
function parseNameStatusTokens(tokens) {
	const entries = [];
	for (let i = 0; i < tokens.length; i += 1) {
		const code = tokens[i];
		if (!code) continue;
		const letter = code[0];
		if (letter === "R" || letter === "C") {
			const oldPath = tokens[i + 1];
			const path = tokens[i + 2];
			i += 2;
			if (path) entries.push({
				path,
				oldPath,
				status: letter === "R" ? "renamed" : "added"
			});
			continue;
		}
		const path = tokens[i + 1];
		i += 1;
		if (!path) continue;
		const status = letter === "A" ? "added" : letter === "D" ? "deleted" : "modified";
		entries.push({
			path,
			status
		});
	}
	return entries;
}
/** Parses `git diff --numstat -z -M`; rename entries put paths in follow-up tokens. */
function parseNumstatZ(text) {
	return parseNumstatTokens(text.split("\0"), 0);
}
function parseNumstatTokens(tokens, start) {
	const byPath = /* @__PURE__ */ new Map();
	for (let i = start; i < tokens.length; i += 1) {
		const token = tokens[i];
		if (!token) continue;
		const [added, deleted, ...pathParts] = token.split("	");
		const inlinePath = pathParts.join("	");
		if (added === void 0 || deleted === void 0) continue;
		const binary = added === "-";
		const entry = {
			additions: binary ? 0 : Number.parseInt(added, 10) || 0,
			deletions: binary ? 0 : Number.parseInt(deleted, 10) || 0,
			binary
		};
		if (inlinePath) {
			byPath.set(inlinePath, entry);
			continue;
		}
		const path = tokens[i + 2];
		i += 2;
		if (path) byPath.set(path, entry);
	}
	return byPath;
}
/** Git emits all raw records before the numstat records in `--raw --numstat -z`. */
function parseDiffInventoryZ(text) {
	const tokens = text.split("\0");
	const nameStatus = [];
	let index = 0;
	while (index < tokens.length) {
		const header = tokens[index];
		if (!header?.startsWith(":")) break;
		const code = header.slice(header.lastIndexOf(" ") + 1);
		const pathCount = code[0] === "R" || code[0] === "C" ? 2 : 1;
		nameStatus.push(code, ...tokens.slice(index + 1, index + pathCount + 1));
		index += pathCount + 1;
	}
	return {
		entries: parseNameStatusTokens(nameStatus),
		numstat: parseNumstatTokens(tokens, index)
	};
}
const GIT_PATH_ESCAPES = {
	a: "\x07",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	",
	v: "\v"
};
function decodeGitPath(value) {
	if (!value.startsWith("\"")) return value;
	const decoded = Buffer.from(value.slice(1, -1)).toString("latin1").replace(/\\([0-3][0-7]{2}|[abfnrtv"\\])/g, (_, escape) => escape.length === 3 ? String.fromCharCode(Number.parseInt(escape, 8)) : GIT_PATH_ESCAPES[escape] ?? escape);
	return Buffer.from(decoded, "latin1").toString("utf8");
}
function chunkPath(chunk) {
	const newFile = /(?:^|\n)\+\+\+ (b\/[^\t\n]+|"b\/[^\n]+")\t?(?:\n|$)/.exec(chunk);
	if (newFile) return decodeGitPath(expectDefined(newFile[1], "new file capture group 1")).slice(2);
	const oldFile = /(?:^|\n)--- (a\/[^\t\n]+|"a\/[^\n]+")\t?(?:\n|$)/.exec(chunk);
	if (oldFile) return decodeGitPath(expectDefined(oldFile[1], "old file capture group 1")).slice(2);
	const renameTo = /(?:^|\n)rename to ([^\n]+)(?:\n|$)/.exec(chunk);
	if (renameTo) return decodeGitPath(expectDefined(renameTo[1], "rename to capture group 1"));
	const header = /(?:^|\n)diff --git (?:"a\/((?:\\.|[^"\\\n])*)" "b\/\1"|a\/([^\n]+) b\/\2)(?:\n|$)/.exec(chunk);
	if (!header) return null;
	return header[1] === void 0 ? expectDefined(header[2], "header capture group 2") : decodeGitPath(`"${header[1]}"`);
}
/** Splits a multi-file `git diff --patch` into per-file chunks keyed by path. */
function splitPatchByFile(patch) {
	const byPath = /* @__PURE__ */ new Map();
	if (!patch.trim()) return byPath;
	const parts = patch.split(/(?<=\n)(?=diff --git )/);
	for (const part of parts) {
		if (!part.startsWith("diff --git ")) continue;
		const path = chunkPath(part);
		if (path) byPath.set(path, part);
	}
	return byPath;
}
//#endregion
//#region src/sessions/session-diff-revisions.ts
/** Picks the merge base used for branch-relative session diffs. */
async function resolveSessionDiffBase(params) {
	const remoteDefault = (await params.gitOut(params.root, [
		"symbolic-ref",
		"--short",
		"refs/remotes/origin/HEAD"
	]))?.trim() || null;
	const defaultShort = remoteDefault?.replace(/^origin\//, "");
	if (remoteDefault && defaultShort && params.branch && params.branch !== defaultShort) {
		const mergeBase = await params.gitOut(params.root, [
			"merge-base",
			remoteDefault,
			params.head
		]);
		if (mergeBase?.trim()) return {
			base: mergeBase.trim(),
			baseRef: defaultShort
		};
	}
	if (params.branch && params.branch !== "main" && params.branch !== "master") for (const candidate of [
		"main",
		"master",
		"origin/main",
		"origin/master"
	]) {
		const verified = await params.gitOut(params.root, [
			"rev-parse",
			"--verify",
			"--quiet",
			candidate
		]);
		if (verified?.trim()) {
			const mergeBase = await params.gitOut(params.root, [
				"merge-base",
				verified.trim(),
				params.head
			]);
			if (mergeBase?.trim()) return {
				base: mergeBase.trim(),
				baseRef: candidate
			};
		}
	}
	return {
		base: params.head,
		baseRef: "HEAD"
	};
}
/** Resolves the repository-format-specific empty tree without writing it. */
async function resolveSessionDiffEmptyTree(root, objectFormat) {
	if (objectFormat === "sha1") return { base: "4b825dc642cb6eb9a060e54bf8d69288fbee4904" };
	if (objectFormat === "sha256") return { base: "6ef19b41225c5369f1c104d45d8d85efa9b057b53b14b4b9b939dd74decc5321" };
	try {
		const result = await runGit(root, [
			"hash-object",
			"-t",
			"tree",
			"--stdin"
		], { input: "" });
		const emptyTree = result.code === 0 ? result.stdout.trim() : "";
		return emptyTree ? { base: emptyTree } : null;
	} catch {
		return null;
	}
}
function parseCommitRecord(line) {
	const separator = line.indexOf("\0");
	if (separator <= 0) return;
	return {
		sha: line.slice(0, separator),
		subject: line.slice(separator + 1)
	};
}
function parseCommitRecords(text) {
	return text.split("\n").map(parseCommitRecord).filter((record) => record !== void 0);
}
/** Loads the bounded branch history metadata shared by every diff scope. */
async function loadSessionDiffBranchMetadata(params) {
	if (params.base === "HEAD" || params.base === params.head) return {};
	const range = `${params.base}..${params.head}`;
	const [aheadText, commitsText, mergeBaseText] = await Promise.all([
		params.gitOut(params.root, [
			"rev-list",
			"--count",
			range
		]),
		params.gitOut(params.root, [
			"log",
			"--max-count=50",
			"--format=%h%x00%s",
			range,
			"--"
		]),
		params.gitOut(params.root, [
			"show",
			"--no-patch",
			"--format=%h%x00%s",
			params.base,
			"--"
		])
	]);
	const normalizedAhead = aheadText?.trim();
	const aheadCount = normalizedAhead && /^\d+$/.test(normalizedAhead) ? Number.parseInt(normalizedAhead, 10) : void 0;
	const mergeBase = mergeBaseText ? parseCommitRecords(mergeBaseText)[0] : void 0;
	return {
		...aheadCount !== void 0 ? { aheadCount } : {},
		...commitsText !== null ? { commits: parseCommitRecords(commitsText) } : {},
		...mergeBase ? { mergeBase } : {}
	};
}
//#endregion
//#region src/sessions/session-diff.runtime.ts
const MAX_FILES = 500;
const MAX_UNTRACKED_FILES = 100;
const MAX_PATCH_BYTES_PER_FILE = 1e5;
const MAX_TOTAL_PATCH_BYTES = 15e5;
const MAX_BASELINE_GIT_OUTPUT_BYTES = 512e3;
const MAX_BASELINE_FILE_BYTES = 4194304;
const MAX_BASELINE_TOTAL_BYTES = 16777216;
const MAX_TOTAL_CHANGED_LINES = 1e5;
const PATCH_DIFF_ARGS = [
	"--patch",
	"--no-color",
	"--no-ext-diff",
	"--no-textconv",
	"--src-prefix=a/",
	"--dst-prefix=b/"
];
async function gitOut(cwd, args, okCodes = [0]) {
	try {
		const result = await runGit(cwd, [
			"-c",
			"core.quotePath=false",
			...args
		]);
		return okCodes.includes(result.code ?? -1) ? result.stdout : null;
	} catch {
		return null;
	}
}
async function loadCheckoutRevision(cwd) {
	try {
		const result = await runGit(cwd, [
			"rev-parse",
			"--show-object-format",
			"--show-toplevel",
			"--verify",
			"--quiet",
			"HEAD"
		]);
		if (result.termination !== "exit" || result.code !== 0 && result.code !== 1) return;
		const lines = result.stdout.replace(/\n$/, "").split("\n");
		const objectFormat = lines.shift();
		const head = result.code === 0 ? lines.pop() : void 0;
		const root = lines.join("\n");
		if (!root) return;
		const branchOut = head ? (await gitOut(root, [
			"rev-parse",
			"--abbrev-ref",
			"HEAD"
		]))?.trim() : void 0;
		return {
			root,
			head,
			branch: branchOut && branchOut !== "HEAD" ? branchOut : void 0,
			objectFormat
		};
	} catch {
		return;
	}
}
function readPatchHeader(chunk) {
	const header = /(?:^|\n)(@@ [^\n]*|Binary files [^\n]* differ|GIT binary patch)\n/.exec(chunk)?.[1];
	const added = /^@@ -0,0 \+1(?:,(\d+))? @@(?: |$)/.exec(header ?? "");
	return {
		...added ? { additions: Number(added[1] ?? 1) } : {},
		binary: header !== void 0 && !header.startsWith("@@ ")
	};
}
/**
* A patch-producing `git diff` reads working-tree file contents, so a
* checkout-planted hardlink to an out-of-tree secret would otherwise leak
* through this read-scoped RPC (same threat the fs-safe workspace readers
* reject). Content is only emitted for a real, single-linked regular file
* whose realpath stays inside the checkout. Deleted files are exempt: git
* reads their content from the object DB, never the filesystem.
*/
async function isPatchableWorkingTreePath(realRoot, relPath) {
	const abs = path.resolve(realRoot, relPath);
	try {
		const info = await fs$1.lstat(abs);
		if (!info.isFile() || info.nlink !== 1) return false;
		const resolved = await fs$1.realpath(abs);
		return resolved === realRoot || resolved.startsWith(realRoot + path.sep);
	} catch {
		return false;
	}
}
function takePatch(chunk, budget) {
	if (!chunk) return { truncated: true };
	const bytes = Buffer.byteLength(chunk, "utf8");
	if (bytes > MAX_PATCH_BYTES_PER_FILE || bytes > budget.remaining) return { truncated: true };
	budget.remaining -= bytes;
	return { patch: chunk };
}
async function collectUntrackedFiles(root, realRoot, budget) {
	const paths = (await gitOut(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]) ?? "").split("\0").filter(Boolean);
	const truncated = paths.length > MAX_UNTRACKED_FILES;
	const files = [];
	for (const filePath of paths.slice(0, MAX_UNTRACKED_FILES)) {
		const file = {
			path: filePath,
			status: "added",
			additions: 0,
			deletions: 0,
			untracked: true
		};
		files.push(file);
		if (!await isPatchableWorkingTreePath(realRoot, filePath)) {
			file.truncated = true;
			continue;
		}
		const result = await runGitBuffered(root, [
			"-c",
			"core.quotePath=false",
			"diff",
			...PATCH_DIFF_ARGS,
			"--no-index",
			"--",
			"/dev/null",
			filePath
		], {
			timeoutMs: GIT_TIMEOUT_MS,
			maxOutputBytes: MAX_PATCH_BYTES_PER_FILE,
			discardOutput: { stderr: true }
		});
		const patchTruncated = result.termination === "output-limit" && result.outputLimitStream === "stdout";
		if (!patchTruncated && (result.termination !== "exit" || result.code !== 0 && result.code !== 1)) {
			file.truncated = true;
			continue;
		}
		const patch = result.stdout.toString("utf8");
		if (!patch.startsWith("diff --git ")) {
			file.truncated = true;
			continue;
		}
		const header = readPatchHeader(patch);
		file.additions = header.additions ?? 0;
		if (header.binary) {
			file.binary = true;
			continue;
		}
		Object.assign(file, takePatch(patchTruncated ? void 0 : patch, budget));
	}
	return {
		files,
		truncated
	};
}
async function collectTrackedFiles(root, realRoot, revisions, budget) {
	const diffArgs = (options) => [
		"diff",
		"-M",
		...options,
		...revisions,
		"--"
	];
	const inventoryText = await gitOut(root, diffArgs([
		"--raw",
		"--numstat",
		"--no-color",
		"-z"
	]));
	let inventory;
	if (inventoryText !== null) inventory = parseDiffInventoryZ(inventoryText);
	else {
		const entries = parseNameStatusZ(await gitOut(root, diffArgs(["--name-status", "-z"])) ?? "");
		if (entries.length === 0) return {
			files: [],
			truncated: false
		};
		inventory = {
			entries,
			numstat: parseNumstatZ(await gitOut(root, diffArgs(["--numstat", "-z"])) ?? "")
		};
	}
	const { entries, numstat } = inventory;
	if (entries.length === 0) return {
		files: [],
		truncated: false
	};
	const patchText = [...numstat.values()].reduce((sum, entry) => sum + entry.additions + entry.deletions, 0) > MAX_TOTAL_CHANGED_LINES ? null : await gitOut(root, diffArgs(PATCH_DIFF_ARGS));
	const chunks = patchText === null ? /* @__PURE__ */ new Map() : splitPatchByFile(patchText);
	const truncated = entries.length > MAX_FILES;
	const files = [];
	for (const entry of entries.slice(0, MAX_FILES)) {
		const stat = numstat.get(entry.path);
		const chunk = chunks.get(entry.path);
		const binary = stat?.binary === true || chunk !== void 0 && readPatchHeader(chunk).binary;
		const file = {
			path: entry.path,
			status: entry.status,
			additions: stat?.additions ?? 0,
			deletions: stat?.deletions ?? 0
		};
		if (entry.oldPath) file.oldPath = entry.oldPath;
		if (binary) {
			file.binary = true;
			files.push(file);
			continue;
		}
		if (!(revisions.length === 2 || entry.status === "deleted" || await isPatchableWorkingTreePath(realRoot, entry.path))) {
			file.truncated = true;
			files.push(file);
			continue;
		}
		const taken = takePatch(chunk, budget);
		if (taken.patch !== void 0) file.patch = taken.patch;
		if (taken.truncated) file.truncated = true;
		files.push(file);
	}
	return {
		files,
		truncated
	};
}
async function collectCheckoutDiff(params) {
	const empty = (unavailableReason) => ({
		files: [],
		additions: 0,
		deletions: 0,
		...unavailableReason ? { unavailableReason } : {}
	});
	const checkout = await loadCheckoutRevision(params.cwd);
	if (!checkout) return empty("not_git");
	const { root, head, branch, objectFormat } = checkout;
	const realRoot = await fs$1.realpath(root).catch(() => root);
	const branchBase = params.baseCommit ? {
		base: params.baseCommit,
		baseRef: params.baseCommit
	} : head ? await resolveSessionDiffBase({
		branch,
		gitOut,
		head,
		root
	}) : await resolveSessionDiffEmptyTree(root, objectFormat);
	const metadata = head && branchBase ? await loadSessionDiffBranchMetadata({
		base: branchBase.base,
		gitOut,
		head,
		root
	}) : {};
	const repositoryFields = {
		root,
		...branch ? { branch } : {},
		...branchBase?.baseRef ? { baseRef: branchBase.baseRef } : {},
		...metadata
	};
	const unknownCommit = () => ({
		...repositoryFields,
		files: [],
		additions: 0,
		deletions: 0,
		unavailableReason: "unknown_commit"
	});
	const scope = params.scope ?? "all";
	let revisions;
	if (scope === "commit") {
		if (!head || !branchBase || branchBase.base === "HEAD" || branchBase.base === head) return unknownCommit();
		const commit = (await gitOut(root, [
			"rev-parse",
			"--verify",
			"--quiet",
			"--end-of-options",
			`${params.commit}^{commit}`
		]))?.trim();
		if (!commit) return unknownCommit();
		const isCommitInHeadHistory = await gitOut(root, [
			"merge-base",
			"--is-ancestor",
			commit,
			head
		], [0]) !== null;
		const isCommitInBaseHistory = await gitOut(root, [
			"merge-base",
			"--is-ancestor",
			commit,
			branchBase.base
		], [0]) !== null;
		if (!isCommitInHeadHistory || isCommitInBaseHistory) return unknownCommit();
		const parent = (await gitOut(root, [
			"rev-parse",
			"--verify",
			"--quiet",
			`${commit}^`
		]))?.trim();
		const commitBase = parent ? { base: parent } : await resolveSessionDiffEmptyTree(root, objectFormat);
		revisions = commitBase ? [commitBase.base, commit] : void 0;
	} else if (scope === "uncommitted") revisions = head ? [head] : branchBase ? [branchBase.base] : void 0;
	else revisions = branchBase ? [branchBase.base] : void 0;
	const budget = { remaining: MAX_TOTAL_PATCH_BYTES };
	const tracked = revisions ? await collectTrackedFiles(root, realRoot, revisions, budget) : {
		files: [],
		truncated: false
	};
	const untracked = scope === "commit" ? {
		files: [],
		truncated: false
	} : await collectUntrackedFiles(root, realRoot, budget);
	const files = [...tracked.files, ...untracked.files].toSorted((a, b) => a.path.localeCompare(b.path));
	const additions = files.reduce((sum, file) => sum + file.additions, 0);
	const deletions = files.reduce((sum, file) => sum + file.deletions, 0);
	const truncated = tracked.truncated || untracked.truncated || files.some((file) => file.truncated === true);
	const diff = {
		...repositoryFields,
		files,
		additions,
		deletions,
		...truncated ? { truncated: true } : {}
	};
	return params.sessionId ? await applySessionDiffBaseline({
		baseline: params.baseline,
		diff,
		sessionId: params.sessionId
	}) : diff;
}
function sameMutationFingerprint(left, right) {
	return left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.mtimeNs === right.mtimeNs && left.nlink === right.nlink && left.size === right.size;
}
function hashBaselineDescriptor(candidate, content) {
	return crypto.createHash("sha256").update([
		candidate.path,
		candidate.oldPath ?? "",
		candidate.status,
		candidate.untracked === true ? "untracked" : "tracked",
		content
	].join("\0")).digest("hex");
}
async function fingerprintBaselineCandidate(params) {
	const { candidate } = params;
	if (candidate.status === "deleted") return hashBaselineDescriptor(candidate, "deleted");
	const absolutePath = path.resolve(params.root, candidate.path);
	const relativePath = path.relative(params.root, absolutePath);
	if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return;
	const initial = await fs$1.lstat(absolutePath, { bigint: true }).catch(() => void 0);
	if (!initial) return;
	if (initial.isSymbolicLink()) {
		const target = await fs$1.readlink(absolutePath).catch(() => void 0);
		return target === void 0 ? void 0 : hashBaselineDescriptor(candidate, `symlink:${target}`);
	}
	if (!initial.isFile() || initial.nlink !== 1n || initial.size > BigInt(MAX_BASELINE_FILE_BYTES) || initial.size > BigInt(params.budget.remaining)) return;
	const resolved = await fs$1.realpath(absolutePath).catch(() => void 0);
	if (!resolved || resolved !== params.realRoot && !resolved.startsWith(params.realRoot + path.sep)) return;
	const handle = await fs$1.open(absolutePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0)).catch(() => void 0);
	if (!handle) return;
	params.budget.remaining -= Number(initial.size);
	try {
		const opened = await handle.stat({ bigint: true });
		if (!opened.isFile() || opened.nlink !== 1n || !sameMutationFingerprint(initial, opened)) return;
		const digest = crypto.createHash("sha256");
		digest.update([
			candidate.path,
			candidate.oldPath ?? "",
			candidate.status,
			candidate.untracked === true ? "untracked" : "tracked",
			opened.mode.toString(),
			opened.size.toString()
		].join("\0"));
		const buffer = Buffer.allocUnsafe(65536);
		let offset = 0;
		while (offset < Number(opened.size)) {
			const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.length, Number(opened.size) - offset), offset);
			if (bytesRead === 0) return;
			digest.update(buffer.subarray(0, bytesRead));
			offset += bytesRead;
		}
		return sameMutationFingerprint(opened, await handle.stat({ bigint: true })) ? digest.digest("hex") : void 0;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function gitOutForBaseline(cwd, args) {
	const result = await runGitBuffered(cwd, [
		"-c",
		"core.quotePath=false",
		...args
	], {
		timeoutMs: 3e4,
		maxOutputBytes: {
			stdout: MAX_BASELINE_GIT_OUTPUT_BYTES,
			stderr: 32768
		}
	});
	if (result.termination !== "exit" || result.code !== 0) return null;
	return result.stdout.toString("utf8");
}
async function collectBaselineCandidates(params) {
	const checkout = await loadCheckoutRevision(params.cwd);
	if (!checkout) return;
	const { root, head, branch, objectFormat } = checkout;
	const baseInfo = head ? await resolveSessionDiffBase({
		branch,
		gitOut,
		head,
		root
	}) : await resolveSessionDiffEmptyTree(root, objectFormat);
	const [trackedResult, untrackedResult] = await Promise.allSettled([baseInfo ? gitOutForBaseline(root, [
		"diff",
		"-M",
		baseInfo.base,
		"--name-status",
		"-z"
	]) : Promise.resolve(""), gitOutForBaseline(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	])]);
	if (trackedResult.status === "rejected") throw trackedResult.reason;
	if (untrackedResult.status === "rejected") throw untrackedResult.reason;
	const trackedText = trackedResult.value;
	const untrackedText = untrackedResult.value;
	if (trackedText === null || untrackedText === null) return {
		root,
		candidates: [],
		truncated: true
	};
	const tracked = parseNameStatusZ(trackedText);
	const untrackedPaths = untrackedText.split("\0").filter(Boolean);
	return {
		root,
		candidates: [...tracked.slice(0, MAX_FILES), ...untrackedPaths.slice(0, MAX_UNTRACKED_FILES).map((path) => ({
			path,
			status: "added",
			untracked: true
		}))].toSorted((left, right) => left.path.localeCompare(right.path)),
		truncated: tracked.length > MAX_FILES || untrackedPaths.length > MAX_UNTRACKED_FILES
	};
}
async function fingerprintBaselineCandidates(params) {
	const realRoot = await fs$1.realpath(params.root).catch(() => params.root);
	const budget = { remaining: MAX_BASELINE_TOTAL_BYTES };
	const files = [];
	for (const candidate of params.candidates) {
		const fingerprint = await fingerprintBaselineCandidate({
			budget,
			candidate,
			realRoot,
			root: params.root
		});
		if (fingerprint) files.push({
			path: candidate.path,
			fingerprint
		});
	}
	return {
		files,
		truncated: files.length !== params.candidates.length
	};
}
async function collectCheckoutDiffBaseline(params) {
	const collected = await collectBaselineCandidates({ cwd: params.cwd });
	if (!collected) return;
	const fingerprinted = await fingerprintBaselineCandidates({
		candidates: collected.candidates,
		root: collected.root
	});
	return {
		version: 1,
		root: collected.root,
		files: fingerprinted.files,
		...collected.truncated || fingerprinted.truncated ? { truncated: true } : {}
	};
}
async function applySessionDiffBaseline(params) {
	const { baseline, diff } = params;
	if (baseline?.version !== 1 || baseline.sessionId !== params.sessionId || !diff.root || baseline.root !== diff.root) return diff;
	const fingerprints = new Map(baseline.files.map((file) => [file.path, file.fingerprint]));
	const current = await fingerprintBaselineCandidates({
		candidates: diff.files.filter((file) => fingerprints.has(file.path)),
		root: diff.root
	});
	const currentFingerprints = new Map(current.files.map((file) => [file.path, file.fingerprint]));
	const files = diff.files.filter((file) => {
		const baselineFingerprint = fingerprints.get(file.path);
		return !baselineFingerprint || currentFingerprints.get(file.path) !== baselineFingerprint;
	});
	if (files.length === diff.files.length) return diff;
	return {
		...diff,
		files,
		additions: files.reduce((sum, file) => sum + file.additions, 0),
		deletions: files.reduce((sum, file) => sum + file.deletions, 0)
	};
}
//#endregion
//#region src/infra/git-read-operations.runtime.ts
async function executeGitReadOperation(operation) {
	switch (operation.type) {
		case "checkout.context": return await readCheckoutGitContext(operation.input.root);
		case "checkout.diff": return await collectCheckoutDiff(operation.input);
		case "checkout.baseline": return await collectCheckoutDiffBaseline(operation.input);
		case "repository.branches": return await readRepositoryBranches(operation.input.repoRoot, operation.input);
		case "pull-request.branch-facts": return await readPullRequestBranchFacts(operation.input);
	}
	throw new Error("Unsupported Git read operation");
}
//#endregion
export { executeGitReadOperation };
