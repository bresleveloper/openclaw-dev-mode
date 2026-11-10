import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as unquoteGitPath } from "./git-path-quote-DUm87W5B.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as GIT_TIMEOUT_MS } from "./git-exec-CvORirty.mjs";
import { d as runGitBuffered, u as runGit } from "./git-CljZIJM8.mjs";
import { t as isSqliteFilePath } from "./sqlite-file-path-jAGhu7_w.mjs";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { readFileWindowFully } from "@openclaw/fs-safe/advanced";
import { root } from "@openclaw/fs-safe/root";
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
function decodeGitPath(value) {
	if (!value.startsWith("\"")) return value;
	const bytes = Buffer.from(value);
	const decoded = unquoteGitPath(bytes);
	return decoded?.end === bytes.length ? decoded.bytes.toString("utf8") : value;
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
		const info = await fs.lstat(abs);
		if (!info.isFile() || info.nlink !== 1) return false;
		const resolved = await fs.realpath(abs);
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
	if (inventoryText === null) throw new Error("Unable to read tracked Git changes");
	const { entries, numstat } = parseDiffInventoryZ(inventoryText);
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
		Object.assign(file, takePatch(chunk, budget));
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
	const realRoot = await fs.realpath(root).catch(() => root);
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
		scope,
		sessionId: params.sessionId
	}) : diff;
}
function hashBaselineDescriptor(candidate, content, bytes) {
	return crypto.createHash("sha256").update([
		candidate.path,
		candidate.oldPath ?? "",
		candidate.status,
		candidate.untracked === true ? "untracked" : "tracked",
		content
	].join("\0")).update(bytes ?? "").digest("hex");
}
async function fingerprintBaselineCandidate(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { candidate } = params;
		if (candidate.status === "deleted") return hashBaselineDescriptor(candidate, "deleted");
		const absolutePath = path.resolve(params.root, candidate.path);
		const relativePath = path.relative(params.root, absolutePath);
		if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return;
		const initial = await fs.lstat(absolutePath).catch(() => void 0);
		if (!initial) return;
		if (initial.isSymbolicLink()) {
			const target = await fs.readlink(absolutePath).catch(() => void 0);
			return target === void 0 ? void 0 : hashBaselineDescriptor(candidate, `symlink:${target}`);
		}
		if (initial.nlink !== 1 || isSqliteFilePath(absolutePath)) return;
		const opened = await params.directory?.open(`.${path.sep}${relativePath}`).catch(() => void 0);
		if (!opened) return;
		const file = _usingCtx$1.a(opened);
		const { mode, size } = file.stat;
		if (size > MAX_BASELINE_FILE_BYTES || size > params.budget.remaining) return;
		params.budget.remaining -= size;
		const buffer = Buffer.allocUnsafe(size);
		if (await readFileWindowFully(file.handle, buffer, 0) !== size) return;
		return hashBaselineDescriptor(candidate, `${mode}\0${size}`, buffer);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
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
	const [trackedText, untrackedText] = await Promise.all([baseInfo ? gitOutForBaseline(root, [
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
async function collectCheckoutDiffBaseline(params) {
	const collected = await collectBaselineCandidates(params);
	if (!collected) return;
	const fingerprinted = await fingerprintBaselineCandidates(collected);
	return {
		version: 1,
		root: collected.root,
		files: fingerprinted.files,
		...collected.truncated || fingerprinted.truncated ? { truncated: true } : {}
	};
}
async function fingerprintBaselineCandidates(params) {
	const directory = await root(params.root, {
		hardlinks: "reject",
		symlinks: "follow-parents-within-root"
	}).catch(() => void 0);
	const budget = { remaining: MAX_BASELINE_TOTAL_BYTES };
	const files = [];
	for (const candidate of params.candidates) {
		const fingerprint = await fingerprintBaselineCandidate({
			budget,
			candidate,
			directory,
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
async function applySessionDiffBaseline(params) {
	const { baseline, diff } = params;
	if (baseline?.version !== 1 || baseline.sessionId !== params.sessionId || !diff.root || baseline.root !== diff.root) return diff;
	const fingerprints = new Map(baseline.files.map((file) => [file.path, file.fingerprint]));
	const candidates = params.scope === "uncommitted" ? (await collectBaselineCandidates({ cwd: diff.root }))?.candidates ?? [] : diff.files;
	const visiblePaths = new Set(diff.files.map((file) => file.path));
	const current = await fingerprintBaselineCandidates({
		candidates: candidates.filter((file) => fingerprints.has(file.path) && visiblePaths.has(file.path)),
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
export { collectCheckoutDiff, collectCheckoutDiffBaseline };
