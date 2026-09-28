import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { i as MAX_RECONCILIATION_TOTAL_BYTES, n as MAX_RECONCILIATION_FILE_BYTES, t as MAX_RECONCILIATION_ENTRIES } from "./workspace-manifest-453LPGpv.mjs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/gateway/github-publication-base.ts
function githubPublicationBaseLookupArgs(repository, baseBranch) {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		`repos/${repository}/git/ref/heads/${baseBranch}`,
		"--jq",
		"{ref: .ref, sha: .object.sha}"
	];
}
function githubPublicationBaseFetchArgs(repository, sha) {
	return [
		"git",
		"-c",
		"credential.helper=",
		"-c",
		"credential.helper=!gh auth git-credential",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"-c",
		"maintenance.auto=false",
		"-c",
		"gc.auto=0",
		"fetch",
		"--no-auto-maintenance",
		"--no-tags",
		"--no-write-fetch-head",
		"--recurse-submodules=no",
		"--",
		`https://github.com/${repository}.git`,
		sha
	];
}
function githubPublicationBaseLineageArgs(ancestor, descendant) {
	return [
		"git",
		"merge-base",
		"--is-ancestor",
		ancestor,
		descendant
	];
}
function githubPublicationUnsafeConfigArgs(scope) {
	return [
		"git",
		"config",
		scope,
		"--includes",
		"--get-regexp",
		"^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$"
	];
}
const GITHUB_PUBLICATION_CONFIG_GUARD_JS = String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ["config", "--local", "--includes", "--bool",
  "--default=false", "--get", "extensions.worktreeConfig"], { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
if (worktreeConfig.error || worktreeConfig.status !== 0) {
  throw Error("Publication workspace has unsupported Git transport configuration");
}
// Git rejects --worktree on linked checkouts unless the separate config is enabled.
if (worktreeConfig.stdout.toString("utf8").trim() === "true") scopes.push("--worktree");
for (const scope of scopes) {
  const result = spawnSync("git", ["config", scope, "--includes", "--get-regexp",
    ${JSON.stringify(githubPublicationUnsafeConfigArgs("--local").at(-1))}], {
    cwd, env, timeout: 60000, maxBuffer: 128 * 1024,
  });
  if (result.error || result.status !== 1 || result.stdout.length) {
    throw Error("Publication workspace has unsupported Git transport configuration");
  }
}
`;
function parseGitHubPublicationBaseBranch(baseRef, defaultBranch) {
	const trimmed = baseRef.trim();
	if (!trimmed || trimmed === "HEAD" || /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(trimmed)) return defaultBranch;
	for (const prefix of [
		"refs/remotes/origin/",
		"origin/",
		"refs/heads/"
	]) if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	return trimmed;
}
/** Returns the authenticated target-base SHA or fails the publication boundary closed. */
function parseGitHubPublicationBaseRef(raw, baseBranch) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error("GitHub publication workspace base branch could not be verified.");
	}
	const ref = isRecord(parsed) ? readNonBlankString(parsed.ref) : void 0;
	const sha = isRecord(parsed) ? readNonBlankString(parsed.sha) : void 0;
	if (ref !== `refs/heads/${baseBranch}` || !sha || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(sha)) throw new Error("GitHub publication workspace base branch could not be verified.");
	return sha;
}
//#endregion
//#region src/gateway/github-repository-publication-snapshot.ts
const gitObjectPattern = /^[a-f0-9]{40}$/u;
/** Capture before releasing the worker: recovery bytes have not passed Git's clean conversion. */
const REMOTE_GITHUB_PUBLICATION_SNAPSHOT_JS = String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${MAX_RECONCILIATION_FILE_BYTES};
const maxTotal = ${MAX_RECONCILIATION_TOTAL_BYTES};
const maxEntries = ${MAX_RECONCILIATION_ENTRIES};
const objectPattern = /^[a-f0-9]{40}$/;
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  GIT_CONFIG_COUNT: "0" };
function git(args, options = {}) {
  const result = spawnSync("git", ["-c", "core.hooksPath=" + gitNullPath, "-c",
    "core.fsmonitor=false", "-c", "core.attributesFile=" + gitNullPath, ...args], {
    cwd, env, timeout: 60000, maxBuffer: maxFile + 1, ...options,
  });
  if (result.error || result.status !== 0) throw Error("Publication snapshot Git command failed");
  return result.stdout;
}
function text(args) { return git(args).toString("utf8").trim(); }
function noFilters(raw) {
  for (const line of raw.toString("latin1").split(/\r?\n/)) {
    const fields = line.trimStart().split(/[\t ]+/);
    if (fields[0] && !fields[0].startsWith("#") &&
      fields.slice(1).some((field) => /^(?:-|!)?filter(?:=|$)/.test(field))) {
      throw Error("Publication snapshot uses an unsupported Git clean filter");
    }
  }
}
if (!objectPattern.test(baseCommit)) throw Error("Publication snapshot base commit is invalid");
const relativeOutput = path.relative(path.resolve(cwd), path.resolve(output));
if (!relativeOutput.startsWith(".." + path.sep) && !path.isAbsolute(relativeOutput)) {
  throw Error("Publication snapshot output must be outside the workspace");
}
${GITHUB_PUBLICATION_CONFIG_GUARD_JS}
if (text(["for-each-ref", "--count=1", "--format=%(refname)", "refs/replace"])) {
  throw Error("Publication snapshot has unsupported Git replacement metadata");
}
for (const name of ["info/grafts", "info/attributes"]) {
  const file = path.resolve(cwd, text(["rev-parse", "--git-path", name]));
  if (!fs.existsSync(file)) continue;
  const bytes = fs.readFileSync(file);
  if (name === "info/grafts" && bytes.length) throw Error("Publication snapshot has Git grafts");
  if (name === "info/attributes") noFilters(bytes);
}
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-publication-index-"));
try {
  const index = path.resolve(cwd, text(["rev-parse", "--git-path", "index"]));
  env.GIT_INDEX_FILE = path.join(temporary, "index");
  // Keep explicitly staged ignored paths and cached removals; stage changes only in the copy.
  const indexStat = fs.statSync(index, { bigint: true });
  fs.copyFileSync(index, env.GIT_INDEX_FILE);
  // A newer copy timestamp hides racy-clean edits. Round down so lost precision only adds reads.
  const indexTimestamp = Number(indexStat.mtimeNs / 1_000_000_000n);
  fs.utimesSync(env.GIT_INDEX_FILE, indexTimestamp, indexTimestamp);
  // Unresolved merge stages cannot define an accepted tree.
  git(["write-tree"]);
  // Ordinary staging preserves unchanged blobs; renormalization would rewrite unrelated CRLF files.
  git(["add", "-A"]);
  const workspaceTree = text(["write-tree"]);
  const baseTree = text(["rev-parse", baseCommit + "^{tree}"]);
  const attributes = git(["ls-tree", "-r", "-z", "--full-tree", workspaceTree]);
  let attributeCount = 0;
  for (const entry of attributes.toString("utf8").split("\0")) {
    const tab = entry.indexOf("\t");
    const name = entry.slice(tab + 1).toLowerCase();
    if (tab < 0 || (name !== ".gitattributes" && !name.endsWith("/.gitattributes"))) continue;
    if (++attributeCount > 1024) throw Error("Publication snapshot has too many attribute files");
    noFilters(git(["cat-file", "blob", entry.slice(0, tab).split(" ")[2]]));
  }
  const raw = git(["diff-tree", "--no-commit-id", "--raw", "-r", "-z", "--no-renames", baseTree, workspaceTree]);
  const decoded = raw.toString("utf8");
  if (!Buffer.from(decoded, "utf8").equals(raw)) throw Error("Publication snapshot paths must be UTF-8");
  const fields = decoded.split("\0");
  const entries = [];
  const blobs = new Set();
  let total = 0;
  fs.mkdirSync(path.join(output, "blobs"), { recursive: true, mode: 0o700 });
  for (let i = 0; i < fields.length - 1; i += 2) {
    const [oldMode, newMode, , newSha, status] = fields[i].slice(1).split(" ");
    const deleted = status === "D";
    const mode = deleted ? oldMode : newMode;
    const sha = deleted ? null : newSha;
    if (!["100644", "100755", "120000", "160000"].includes(mode) ||
      (sha !== null && !objectPattern.test(sha))) throw Error("Publication snapshot entry is invalid");
    entries.push({ path: fields[i + 1], mode, sha });
    if (entries.length > maxEntries) throw Error("Publication snapshot has too many changes");
    if (!sha || mode === "160000" || blobs.has(sha)) continue;
    const size = Number(text(["cat-file", "-s", sha]));
    if (!Number.isSafeInteger(size) || size < 0 || size > maxFile || total + size > maxTotal) {
      throw Error("Publication snapshot exceeds its byte budget");
    }
    const bytes = git(["cat-file", "blob", sha]);
    if (bytes.length !== size) throw Error("Publication snapshot blob changed");
    total += size;
    fs.writeFileSync(path.join(output, "blobs", sha), bytes, { mode: 0o600, flag: "wx" });
    blobs.add(sha);
  }
  const snapshot = JSON.stringify({ version: 1, baseCommit, baseTree, workspaceTree, entries });
  fs.writeFileSync(path.join(output, "snapshot.json"), snapshot, { mode: 0o600, flag: "wx" });
  process.stdout.write("sha256:" + crypto.createHash("sha256").update(snapshot).digest("hex"));
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
`;
function parseGitHubRepositoryPublicationSnapshot(raw, digest) {
	if (Buffer.byteLength(raw) > 67108864 || "sha256:" + createHash("sha256").update(raw).digest("hex") !== digest) throw new Error("GitHub publication checkpoint digest changed.");
	const value = JSON.parse(raw);
	if (!isRecord(value) || value.version !== 1 || typeof value.baseCommit !== "string" || !gitObjectPattern.test(value.baseCommit) || typeof value.baseTree !== "string" || !gitObjectPattern.test(value.baseTree) || typeof value.workspaceTree !== "string" || !gitObjectPattern.test(value.workspaceTree) || !Array.isArray(value.entries) || value.entries.length > MAX_RECONCILIATION_ENTRIES) throw new Error("GitHub publication checkpoint is invalid.");
	const paths = /* @__PURE__ */ new Set();
	const entries = value.entries.map((entry) => {
		if (!isRecord(entry) || typeof entry.path !== "string" || !entry.path || entry.path.includes("\\") || entry.path.includes("\0") || path.posix.isAbsolute(entry.path) || path.posix.normalize(entry.path) !== entry.path || entry.path === "." || entry.path === ".." || entry.path.startsWith("../") || entry.path.split("/").some((part) => part.toLowerCase() === ".git") || paths.has(entry.path) || entry.mode !== "100644" && entry.mode !== "100755" && entry.mode !== "120000" && entry.mode !== "160000" || entry.sha !== null && (typeof entry.sha !== "string" || !gitObjectPattern.test(entry.sha))) throw new Error("GitHub publication checkpoint entry is invalid.");
		paths.add(entry.path);
		return {
			path: entry.path,
			mode: entry.mode,
			sha: entry.sha
		};
	});
	return {
		version: 1,
		baseCommit: value.baseCommit,
		baseTree: value.baseTree,
		workspaceTree: value.workspaceTree,
		entries
	};
}
async function readGitHubRepositoryPublicationBlob(root$1, sha) {
	if (!gitObjectPattern.test(sha)) throw new Error("GitHub publication blob identity is invalid.");
	const { buffer: bytes } = await (await root(root$1)).read("blobs/" + sha, {
		maxBytes: MAX_RECONCILIATION_FILE_BYTES,
		symlinks: "reject",
		hardlinks: "reject"
	});
	if (createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex") !== sha) throw new Error("GitHub publication blob changed after checkpoint capture.");
	return bytes;
}
async function readGitHubRepositoryPublicationMetadata(root$2, digest) {
	const { buffer } = await (await root(root$2)).read("snapshot.json", {
		maxBytes: MAX_RECONCILIATION_FILE_BYTES,
		symlinks: "reject",
		hardlinks: "reject"
	});
	const raw = buffer.toString("utf8");
	return {
		raw,
		snapshot: parseGitHubRepositoryPublicationSnapshot(raw, digest)
	};
}
//#endregion
export { githubPublicationBaseFetchArgs as a, githubPublicationUnsafeConfigArgs as c, GITHUB_PUBLICATION_CONFIG_GUARD_JS as i, parseGitHubPublicationBaseBranch as l, readGitHubRepositoryPublicationBlob as n, githubPublicationBaseLineageArgs as o, readGitHubRepositoryPublicationMetadata as r, githubPublicationBaseLookupArgs as s, REMOTE_GITHUB_PUBLICATION_SNAPSHOT_JS as t, parseGitHubPublicationBaseRef as u };
