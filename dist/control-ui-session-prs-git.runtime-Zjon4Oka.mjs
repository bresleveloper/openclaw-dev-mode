import { c as resolveGitRefsBase, i as readGitMetadataPrefix, n as readGitHead, o as readGitRefs } from "./git-root-toH5zPNI.mjs";
import { n as GitCommandTimeoutError, p as requireGitCommandOutput, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { u as runGit } from "./git-CljZIJM8.mjs";
import { t as canReadGitFilesystemRefs } from "./git-worker-context-Bo3RTsYA.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-rTdEnJZN.mjs";
import fs from "node:fs";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
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
			branch,
			refsBase
		};
		return {
			sha,
			refsBase,
			...fs.existsSync(path.join(refsBase, branch)) || branchAliases.some((ref) => aliases.get(ref) !== null) ? {} : { branch }
		};
	} catch {
		return null;
	}
}
/** Background PR reads never hydrate objects; old Git also has no permitted transport. */
async function runPullRequestGit(cwd, args, options = {}) {
	const result = await runGit(cwd, args, {
		...options,
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_ALLOW_PROTOCOL: ""
		}
	});
	if (result.termination === "timeout") throw createGitCommandError(`git ${args[0]}`, result);
	return result;
}
async function gitOutput(cwd, args, onUnavailable) {
	const result = await runPullRequestGit(cwd, args);
	if (result.code !== 0 && result.code !== 1) onUnavailable?.();
	return result.code === 0 ? result.stdout.trim() || null : null;
}
async function readRemoteRevisions(root, refs, head) {
	if (head) try {
		const values = readGitRefs(head.refsBase, refs);
		if (refs.every((ref) => {
			const value = values.get(ref);
			return !ref.split("/").includes("..") && !fs.lstatSync(path.join(head.refsBase, ref), { throwIfNoEntry: false })?.isSymbolicLink() && (value === null || typeof value === "string" && value.length === head.sha.length && /^[a-f0-9]+$/i.test(value));
		})) return new Map([...values].flatMap(([ref, value]) => value ? [[ref, value.toLowerCase()]] : []));
	} catch {}
	try {
		const result = await runPullRequestGit(root, [
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
	} catch (error) {
		if (error instanceof GitCommandTimeoutError) throw error;
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
async function isAncestor(root, ancestor, descendant, onUnavailable) {
	const result = await runPullRequestGit(root, [
		"merge-base",
		"--is-ancestor",
		ancestor,
		descendant
	]);
	if (result.code !== 0 && result.code !== 1) onUnavailable?.();
	return result.code === 0;
}
/** Prefer a maximal published baseline containing the merge base, then input order. */
async function maximalCommit(root, candidates, onUnavailable) {
	const unique = [...new Set(candidates)];
	const first = unique[0];
	if (first === void 0 || unique.length === 1) return first ?? null;
	const second = unique[1];
	if (unique.length === 2 && second !== void 0) return await isAncestor(root, first, second, onUnavailable) ? second : first;
	const out = await gitOutput(root, [
		"merge-base",
		"--independent",
		...unique
	], onUnavailable);
	if (!out) return first;
	const independent = new Set(out.split("\n").map((line) => line.trim()).filter(Boolean));
	const maxima = unique.filter((candidate) => independent.has(candidate));
	for (const candidate of maxima) if (candidate === first || maxima.length === 1 || await isAncestor(root, first, candidate, onUnavailable)) return candidate;
	return maxima[0] ?? first;
}
async function resolveBranchLanding(root, params) {
	let complete = true;
	const onUnavailable = () => {
		complete = false;
	};
	const pushedRef = `refs/remotes/origin/${params.branch}`;
	const defaultRef = params.defaultBranch ? `refs/remotes/origin/${params.defaultBranch}` : null;
	const checkoutHead = readCheckoutHead(root);
	const revisions = await readRemoteRevisions(root, [pushedRef, ...defaultRef ? [defaultRef] : []], checkoutHead);
	const pushedSha = revisions.get(pushedRef) ?? null;
	const headSha = checkoutHead?.sha ?? await gitOutput(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	]);
	const defaultSha = defaultRef ? revisions.get(defaultRef) ?? null : null;
	const possibleLandings = params.mergedHeads.filter((head) => head.baseRef === params.defaultBranch || Boolean(params.defaultBranch && head.mergeCommitSha));
	const landedHeads = [];
	for (const head of possibleLandings) if (head.baseRef === params.defaultBranch) landedHeads.push(head);
	else if (defaultSha && head.mergeCommitSha && await isAncestor(root, head.mergeCommitSha, defaultSha, onUnavailable)) landedHeads.push(head);
	const landedShas = new Set(landedHeads.map((head) => head.sha));
	const mergeBase = defaultSha && headSha ? defaultSha === headSha ? headSha : await gitOutput(root, [
		"merge-base",
		defaultSha,
		headSha
	], onUnavailable) : null;
	const baselines = mergeBase ? [mergeBase] : [];
	if (headSha) {
		for (const merged of landedShas) if (await isAncestor(root, merged, headSha, onUnavailable)) baselines.push(merged);
		else if (await isAncestor(root, headSha, merged, onUnavailable)) baselines.push(headSha);
	}
	const statsBase = await maximalCommit(root, baselines, onUnavailable);
	let provenNewPushedWork = false;
	if (pushedSha && mergeBase && !landedShas.has(pushedSha.toLowerCase())) {
		provenNewPushedWork = landedHeads.length > 0;
		for (const head of landedHeads) if (!((head.mergeCommitSha ? await isAncestor(root, head.mergeCommitSha, mergeBase, onUnavailable) : false) || await isAncestor(root, head.sha, mergeBase, onUnavailable))) {
			provenNewPushedWork = false;
			break;
		}
	}
	return {
		complete,
		pushedSha,
		defaultSha,
		statsBase,
		hasLandedPullRequest: landedHeads.length > 0,
		provenNewPushedWork
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs-git.runtime.ts
/** Observe only this checkout's refs; snapshot publication does not change PR facts. */
async function readCheckoutGitRevision({ root, scope, branch, defaultBranch }) {
	if (!canReadGitFilesystemRefs()) return null;
	try {
		const head = readGitHead(root, { maxDepth: 1 });
		const checkout = readCheckoutHead(root);
		const defaultRef = readDefaultRef(checkout);
		if (!head || !checkout || checkout.branch === void 0 || scope === "context" && defaultRef === void 0) return null;
		const gitDir = path.dirname(head.headPath);
		const paths = [
			path.join(root, ".git"),
			path.join(checkout.refsBase, "config"),
			path.join(gitDir, "config.worktree")
		];
		if (scope === "worktree") paths.push(path.join(gitDir, "index"));
		const replacements = path.join(checkout.refsBase, "refs/replace");
		let packedReplacements = [];
		if (scope !== "context") {
			paths.push(path.join(checkout.refsBase, "shallow"), path.join(checkout.refsBase, "info/grafts"));
			if (fs.existsSync(replacements)) paths.push(...fs.readdirSync(replacements, {
				recursive: true,
				encoding: "utf8"
			}).map((name) => path.join(replacements, name)));
			const packed = path.join(checkout.refsBase, "packed-refs");
			if (fs.existsSync(packed)) packedReplacements = fs.readFileSync(packed, "utf8").split("\n").filter((line) => /\srefs\/replace\//u.test(line)).toSorted();
		}
		const selectedBranch = branch ?? checkout.branch;
		const selectedDefault = defaultBranch ? `origin/${defaultBranch}` : defaultRef;
		const tips = scope !== "context" ? await readRemoteRevisions(root, [...selectedBranch ? [`refs/remotes/origin/${selectedBranch}`] : [], ...selectedDefault ? [`refs/remotes/${selectedDefault}`] : []], checkout) : [];
		return JSON.stringify([
			scope !== "context" ? checkout : {
				branch: checkout.branch,
				refsBase: checkout.refsBase
			},
			defaultRef,
			[...tips],
			packedReplacements,
			paths.toSorted().map((file) => {
				const stat = fs.lstatSync(file, { throwIfNoEntry: false });
				if (stat?.isSymbolicLink() || stat?.isFile() && file.startsWith(`${replacements}${path.sep}`) && readGitMetadataPrefix(file).startsWith("ref:")) throw new Error("Symbolic Git metadata requires Git discovery");
				return stat?.isDirectory() ? [
					file,
					stat.dev,
					stat.ino
				] : [
					file,
					stat?.ino,
					stat?.size,
					stat?.mtimeMs,
					stat?.ctimeMs
				];
			})
		]);
	} catch {
		return null;
	}
}
function readDefaultRef(head) {
	if (!head) return;
	try {
		const ref = "refs/remotes/origin/HEAD";
		if (fs.lstatSync(path.join(head.refsBase, ref), { throwIfNoEntry: false })?.isSymbolicLink()) return;
		const raw = readGitRefs(head.refsBase, [ref]).get(ref);
		if (raw === null) return null;
		const match = /^ref:\s+(refs\/remotes\/(origin\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*))$/u.exec(raw ?? "");
		if (!match) return;
		const target = match[1];
		const short = match[2];
		const aliases = [
			`refs/${short}`,
			`refs/tags/${short}`,
			`refs/heads/${short}`,
			`refs/remotes/${short}/HEAD`
		];
		const values = readGitRefs(head.refsBase, [target, ...aliases]);
		const value = values.get(target);
		return (value === null || /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(value ?? "")) && !fs.lstatSync(path.join(head.refsBase, target), { throwIfNoEntry: false })?.isSymbolicLink() && !fs.existsSync(path.join(head.refsBase, short)) && aliases.every((alias) => values.get(alias) === null) ? short : void 0;
	} catch {
		return;
	}
}
async function readCheckoutGitContext(root, githubHost = "github.com") {
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
	const publicRemote = remoteUrl ? parseGitHubRemoteUrl(remoteUrl) : null;
	const remote = publicRemote ?? (remoteUrl ? parseGitHubRemoteUrl(remoteUrl, githubHost) : null);
	if (!remote) return null;
	const preparedDefaultRef = readDefaultRef(head);
	const defaultBranch = (preparedDefaultRef === void 0 ? await gitOutput(root, [
		"symbolic-ref",
		"--short",
		"refs/remotes/origin/HEAD"
	]) : preparedDefaultRef)?.replace(/^origin\//, "");
	return {
		...remote,
		...!publicRemote ? { host: githubHost } : {},
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
/** Count lines without a subprocess per file; hardlinked content only exposes a count. */
async function untrackedFileAdditions(root, filePath) {
	try {
		const { buffer: body } = await readRegularFile({
			filePath: path.resolve(root, filePath),
			maxBytes: MAX_UNTRACKED_STAT_BYTES
		});
		if (body.length === 0 || body.subarray(0, 8192).includes(0)) return 0;
		let lines = 0;
		for (const byte of body) if (byte === 10) lines += 1;
		return body[body.length - 1] === 10 ? lines : lines + 1;
	} catch {
		return 0;
	}
}
async function untrackedStats(root) {
	const listing = await runPullRequestGit(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]);
	const paths = listing?.code === 0 ? listing.stdout.split("\0").filter(Boolean) : [];
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
async function diffStatsAgainst(root, base, refreshIndex) {
	try {
		const inventory = await runPullRequestGit(root, [
			"-c",
			"diff.autoRefreshIndex=false",
			"diff",
			"--raw",
			"--no-abbrev",
			"--no-renames",
			"--no-ext-diff",
			"--no-textconv",
			"-z",
			base,
			"--"
		]);
		const objects = /* @__PURE__ */ new Set();
		const fields = requireGitCommandOutput("git diff --raw", inventory).split("\0");
		for (let i = 0; i < fields.length - 1; i += 2) {
			const [oldMode, newMode, oldObject, newObject] = fields[i].slice(1).split(" ");
			for (const [mode, object] of [[oldMode, oldObject], [newMode, newObject]]) if (mode !== "160000" && object && !/^0+$/u.test(object)) objects.add(object);
		}
		if (objects.size > 0) {
			const input = `${[...objects].join("\n")}\n`;
			const available = await runPullRequestGit(root, ["cat-file", "--batch-check=%(objectname)"], { input });
			if (requireGitCommandOutput("git cat-file", available) !== input) return null;
		}
		const result = await runPullRequestGit(root, [
			"-c",
			`diff.autoRefreshIndex=${refreshIndex}`,
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
	} catch (error) {
		if (error instanceof GitCommandTimeoutError) throw error;
		return null;
	}
}
async function readPullRequestBranchComparison(input) {
	const landing = await resolveBranchLanding(input.root, input);
	const creatable = (!landing.hasLandedPullRequest || landing.provenNewPushedWork) && Boolean(input.defaultBranch) && landing.pushedSha !== null && (!landing.defaultSha || !await isAncestor(input.root, landing.pushedSha, landing.defaultSha, () => {
		landing.complete = false;
	}));
	return {
		complete: landing.complete,
		statsBase: landing.statsBase,
		equalPushedTips: landing.defaultSha !== null && landing.defaultSha === landing.pushedSha && landing.statsBase === landing.defaultSha,
		creatable
	};
}
async function readPullRequestBranchFacts(input) {
	const { comparison } = input;
	const stats = comparison.statsBase ? await diffStatsAgainst(input.root, comparison.statsBase, input.refreshIndex === true) : null;
	const creatable = comparison.creatable && !(stats !== null && comparison.equalPushedTips);
	return !creatable && !(stats && stats.changedFiles > 0) ? void 0 : {
		creatable,
		stats
	};
}
//#endregion
export { readCheckoutGitContext, readCheckoutGitRevision, readPullRequestBranchComparison, readPullRequestBranchFacts };
