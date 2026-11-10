import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { t as root } from "./openclaw-state-read-fs-safe-Dwk-JnuH.mjs";
import { _ as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES, c as serializeWorkerWorkspaceManifest, i as MAX_RECONCILIATION_TOTAL_BYTES, n as MAX_RECONCILIATION_FILE_BYTES, o as parseWorkerWorkspaceManifest, t as MAX_RECONCILIATION_ENTRIES } from "./openclaw-state-read-workspace-manifest-Bt7MNi5H.mjs";
import { t as readWorkspaceFileContentsWithLimit } from "./openclaw-state-read-workspace-actual-manifest-vzd42adM.mjs";
import { r as requireWorkerResultStorageRef, t as STAGED_RESULT_MESSAGE } from "./openclaw-state-read-workspace-result-inventory-B0SKl8di.mjs";
import { O as parseChangedWorkspaceResult, S as localPath, b as absoluteEntryMatches, w as readWorkspaceTreeFile } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/github-publication-base.ts
const worktreeConfigArgs = [
	"git",
	"config",
	"--local",
	"--includes",
	"--bool",
	"--default=false",
	"--get",
	"extensions.worktreeConfig"
];
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
const GITHUB_PUBLICATION_CONFIG_GUARD = {
	worktreeConfigArgs,
	script: String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(worktreeConfigArgs.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
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
`
};
//#endregion
//#region src/gateway/github-repository-publication-snapshot.ts
const gitObjectPattern = /^[a-f0-9]{40}$/u;
String.raw`
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
${GITHUB_PUBLICATION_CONFIG_GUARD.script}
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
async function readPublicationFile(root$1, file) {
	return (await root(root$1)).read(file, {
		maxBytes: MAX_RECONCILIATION_FILE_BYTES,
		symlinks: "reject",
		hardlinks: "reject"
	});
}
async function readGitHubRepositoryPublicationBlob(root, sha) {
	if (!gitObjectPattern.test(sha)) throw new Error("GitHub publication blob identity is invalid.");
	const { buffer: bytes } = await readPublicationFile(root, "blobs/" + sha);
	if (createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex") !== sha) throw new Error("GitHub publication blob changed after checkpoint capture.");
	return bytes;
}
//#endregion
//#region src/gateway/worker-environments/workspace-git-input.ts
async function readWorkspaceGitEntry(root, entry) {
	const source = localPath(root, entry.path);
	if (entry.type === "symlink") {
		if (await absoluteEntryMatches(source, entry)) return Buffer.from(entry.target);
	} else {
		const snapshot = await readWorkspaceFileContentsWithLimit(source, entry.size);
		if (snapshot.type === "file" && snapshot.size === entry.size && snapshot.mode === entry.mode && snapshot.sha256 === entry.sha256) return snapshot.content;
	}
	throw new Error(`Cloud workspace snapshot is invalid: ${entry.path}`);
}
function quoteFastImportPath(entryPath) {
	const bytes = Buffer.from(entryPath);
	let quoted = "\"";
	for (const byte of bytes) {
		if (byte === 0) throw new Error("Cloud workspace staged result path contains a null byte");
		if (byte === 34 || byte === 92) quoted += `\\${String.fromCharCode(byte)}`;
		else if (byte >= 32 && byte < 127) quoted += String.fromCharCode(byte);
		else quoted += `\\${byte.toString(8).padStart(3, "0")}`;
	}
	return `${quoted}"`;
}
/** Both durable results and rollback trees import the exact authenticated bytes. */
async function writeWorkspaceGitInput(params) {
	const entries = params.entries.toSorted((left, right) => left.path.localeCompare(right.path));
	async function* chunks() {
		for (const [index, entry] of entries.entries()) {
			const content = await params.readVerifiedContent(entry);
			yield Buffer.from(`blob\nmark :${index + 1}\ndata ${content.byteLength}\n`);
			yield content;
			yield Buffer.from("\n");
		}
		yield Buffer.from(`commit ${params.ref}\nmark :${entries.length + 1}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${params.message?.byteLength ?? 0}\n`);
		yield* params.message?.chunks ?? [];
		yield Buffer.from("\ndeleteall\n");
		for (let offset = 0; offset < entries.length; offset += 256) yield Buffer.from(entries.slice(offset, offset + 256).map((entry, index) => {
			return `M ${entry.type === "symlink" ? "120000" : (entry.mode & 73) !== 0 ? "100755" : "100644"} :${offset + index + 1} ${quoteFastImportPath(entry.path)}\n`;
		}).join(""));
		yield Buffer.from(`\nget-mark :${entries.length + 1}\ndone\n`);
	}
	await (await root(path.dirname(params.inputPath))).create(path.basename(params.inputPath), chunks(), {
		assertBeforeMutation: params.assertBeforeMutation,
		mode: 384,
		mkdir: false,
		durable: false,
		maxBytes: MAX_WORKSPACE_INVENTORY_TOTAL_BYTES * 2
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-preparation.runtime.ts
const bufferView = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
function stagedResultMessage(params) {
	const base = bufferView(params.baseManifestRaw);
	const current = bufferView(params.currentManifestRaw);
	const header = Buffer.from(`${STAGED_RESULT_MESSAGE}\nversion 2\nbase-ref ${params.baseManifestRef}\ncurrent-ref ${params.currentManifestRef}\nbase-bytes ${base.byteLength}\ncurrent-bytes ${current.byteLength}\n\n`);
	return {
		chunks: [
			header,
			base,
			current
		],
		byteLength: header.byteLength + base.byteLength + current.byteLength
	};
}
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function publicationStageSource(params, assertBeforeMutation) {
	const { publication, stagingRoot } = params;
	const metadata = bufferView(publication.metadata);
	const snapshot = parseGitHubRepositoryPublicationSnapshot(metadata.toString("utf8"), publication.publicationDigest);
	if (snapshot.baseCommit !== publication.baseCommit) throw new Error("Repository publication checkpoint base changed");
	const inline = /* @__PURE__ */ new Map([["snapshot.json", metadata], ["binding.json", Buffer.from(JSON.stringify({
		currentManifestRef: publication.currentManifestRef,
		publicationDigest: publication.publicationDigest
	}))]]);
	const file = (pathname, content) => ({
		path: pathname,
		type: "file",
		mode: 420,
		size: content.byteLength,
		sha256: sha256(content)
	});
	const entries = [...inline].map(([pathname, content]) => file(pathname, content));
	const blobs = new Set(snapshot.entries.flatMap((entry) => entry.sha && entry.mode !== "160000" ? [entry.sha] : []));
	let bytes = metadata.byteLength;
	for (const sha of blobs) {
		assertBeforeMutation?.();
		const content = await readGitHubRepositoryPublicationBlob(stagingRoot, sha);
		assertBeforeMutation?.();
		bytes += content.byteLength;
		if (bytes > 805306368) throw new Error("Repository publication checkpoint exceeds its byte budget");
		entries.push(file(`blobs/${sha}`, content));
	}
	const manifestBytes = (files, directories = []) => new TextEncoder().encode(serializeWorkerWorkspaceManifest({
		version: 1,
		baseCommit: null,
		directories,
		entries: files
	}));
	const baseManifestRaw = manifestBytes([]);
	const currentManifestRaw = manifestBytes(entries, ["blobs"]);
	return {
		baseManifestRaw,
		currentManifestRaw,
		baseManifestRef: `sha256:${sha256(baseManifestRaw)}`,
		currentManifestRef: `sha256:${sha256(currentManifestRaw)}`,
		readVerifiedContent: async (entry) => {
			const content = inline.get(entry.path) ?? await readGitHubRepositoryPublicationBlob(stagingRoot, entry.path.slice(6));
			if (entry.type !== "file" || content.byteLength !== entry.size || sha256(content) !== entry.sha256) throw new Error("Repository publication blob changed during preparation");
			return content;
		}
	};
}
async function buildWorkspaceStageInput(params, assertBeforeMutation) {
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	const source = "publication" in params ? await publicationStageSource(params, assertBeforeMutation) : {
		...params,
		readVerifiedContent: async (entry) => await readWorkspaceGitEntry(params.stagingRoot, entry).catch((error) => {
			throw new Error(`Cloud workspace staged payload is invalid: ${entry.path}`, { cause: error });
		})
	};
	const compared = parseChangedWorkspaceResult(parseWorkerWorkspaceManifest(bufferView(source.baseManifestRaw).toString("utf8"), source.baseManifestRef), parseWorkerWorkspaceManifest(bufferView(source.currentManifestRaw).toString("utf8"), source.currentManifestRef));
	await writeWorkspaceGitInput({
		assertBeforeMutation,
		inputPath: params.inputPath,
		ref: stagedResultRef,
		entries: compared.entries,
		message: stagedResultMessage(source),
		readVerifiedContent: source.readVerifiedContent
	});
	return null;
}
async function buildWorkspaceTreeInput(params, assertBeforeMutation) {
	const source = params.source;
	await writeWorkspaceGitInput({
		...params,
		assertBeforeMutation,
		readVerifiedContent: async (entry) => source.tree === void 0 ? await readWorkspaceGitEntry(source.root, entry) : entry.type === "file" ? await readWorkspaceTreeFile({
			repositoryRoot: source.root,
			tree: source.tree,
			entry
		}) : Buffer.from(entry.target)
	});
	return null;
}
//#endregion
export { buildWorkspaceStageInput, buildWorkspaceTreeInput };
