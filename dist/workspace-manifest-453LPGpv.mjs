import { c as stagedInputDirectoriesFromEntries, o as isStagedInputPath, r as STAGED_INPUT_PATHS_JS } from "./staged-inputs-De-HBXyz.mjs";
import { n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { r as isManagedSandboxSkillsPath$1, t as MATERIALIZED_SANDBOX_SKILLS_WORKSPACE } from "./sandbox-workspace-paths-UF9Y-Qu5.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-path-exclusions.ts
const isManagedSandboxSkillsPath = isManagedSandboxSkillsPath$1;
const DERIVED_WORKSPACE_DIRECTORY_NAMES = [
	"__pycache__",
	".pytest_cache",
	".mypy_cache",
	".ruff_cache",
	"node_modules"
];
const DERIVED_WORKSPACE_FILE_NAMES = [".DS_Store"];
const DERIVED_WORKSPACE_FILE_SUFFIXES = [".pyc", ".pyo"];
const WORKER_ATTACHMENT_DIRECTORY_PREFIX = "openclaw-inbound-";
const UUID_HEX = "[0-9a-f]";
const WORKER_ATTACHMENT_DIRECTORY_PATTERN = WORKER_ATTACHMENT_DIRECTORY_PREFIX + [
	UUID_HEX.repeat(8),
	UUID_HEX.repeat(4),
	`4${UUID_HEX.repeat(3)}`,
	`[89ab]${UUID_HEX.repeat(3)}`,
	UUID_HEX.repeat(12)
].join("-");
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(`^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$`);
function isDerivedWorkspacePath(relativePath, retainedInput = false) {
	if (isManagedSandboxSkillsPath(relativePath)) return true;
	if (retainedInput) return false;
	return relativePath.split("/").some((segment) => WORKER_ATTACHMENT_DIRECTORY_RE.exec(segment)?.[0] === segment || DERIVED_WORKSPACE_DIRECTORY_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_SUFFIXES.some((suffix) => segment.endsWith(suffix)));
}
const DERIVED_WORKSPACE_RSYNC_EXCLUDES = [
	`/${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}`,
	...DERIVED_WORKSPACE_DIRECTORY_NAMES,
	...DERIVED_WORKSPACE_FILE_NAMES,
	...DERIVED_WORKSPACE_FILE_SUFFIXES.map((suffix) => `*${suffix}`),
	WORKER_ATTACHMENT_DIRECTORY_PATTERN
];
const WORKSPACE_PATH_EXCLUSIONS_JS = `
${STAGED_INPUT_PATHS_JS}
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE)};
const isManagedSandboxSkillsPath = ${isManagedSandboxSkillsPath.toString()};
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_DIRECTORY_NAMES)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_NAMES)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_SUFFIXES)};
const WORKER_ATTACHMENT_DIRECTORY_RE = ${WORKER_ATTACHMENT_DIRECTORY_RE.toString()};
const isDerivedWorkspacePath = ${isDerivedWorkspacePath.toString()};`;
const WORKSPACE_STAGED_INPUT_OWNERSHIP_JS = String.raw`
const stagedInputOwnership = new Map();
function isStagedInput(relativePath) {
  const directory = stagedInputPathDirectory(relativePath);
  if (!directory) return false;
  if (stagedInputOwnership.has(directory)) return stagedInputOwnership.get(directory);
  let owned = false;
  let descriptor;
  try {
    let parent = root;
    for (const segment of directory.split("/")) {
      parent = path.join(parent, segment);
      const stats = fs.lstatSync(parent);
      if (!stats.isDirectory() || stats.isSymbolicLink()) return false;
    }
    const marker = path.join(parent, ".gitignore");
    const before = fs.lstatSync(marker);
    if (!before.isFile() || before.nlink !== 1 || before.size !== STAGED_INPUT_GITIGNORE.length) return false;
    descriptor = fs.openSync(marker, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    const opened = fs.fstatSync(descriptor);
    if (!opened.isFile() || opened.nlink !== 1 || opened.dev !== before.dev || opened.ino !== before.ino) return false;
    const bytes = Buffer.alloc(STAGED_INPUT_GITIGNORE.length + 1);
    const length = fs.readSync(descriptor, bytes, 0, bytes.length, 0);
    const after = fs.lstatSync(marker);
    owned = after.isFile() && after.nlink === 1 && after.dev === opened.dev && after.ino === opened.ino &&
      after.mtimeMs === opened.mtimeMs && after.ctimeMs === opened.ctimeMs &&
      fs.realpathSync(marker) === marker && length === STAGED_INPUT_GITIGNORE.length &&
      bytes.subarray(0, length).toString("utf8") === STAGED_INPUT_GITIGNORE;
  } catch {
    // An ignored project directory with an absent or unsafe marker is not an input.
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    stagedInputOwnership.set(directory, owned);
  }
  return owned;
}`;
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.ts
const MAX_RECONCILIATION_ENTRIES = MAX_WORKSPACE_INVENTORY_ENTRIES * 2;
const MAX_RECONCILIATION_FILE_BYTES = 67108864;
const MAX_RECONCILIATION_TOTAL_BYTES = 805306368;
const MAX_RECONCILIATION_PACK_BYTES = 268435456;
const MANIFEST_REF_PATTERN = /^sha256:([a-f0-9]{64})$/u;
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
function manifestPath(value) {
	if (typeof value !== "string" || !value || value.includes("\\") || path.posix.isAbsolute(value) || path.posix.normalize(value) !== value || value === "." || value === ".." || value.startsWith("../")) throw new Error("Worker workspace manifest contains an unsafe path");
	return value;
}
function manifestMode(value) {
	if (!Number.isInteger(value) || value < 0 || value > 511) throw new Error("Worker workspace manifest contains an invalid mode");
	return value;
}
function gitFileMode(mode) {
	return (mode & 73) === 0 ? 420 : 493;
}
function compareManifestPaths(left, right) {
	return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}
function parseRawEntry(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest contains an invalid entry");
	const entry = value;
	const entryPath = manifestPath(entry.path);
	const mode = manifestMode(entry.mode);
	if (entry.type === "directory") return {
		path: entryPath,
		type: "directory",
		mode
	};
	if (entry.type === "file") {
		if (!Number.isSafeInteger(entry.size) || entry.size < 0 || typeof entry.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error("Worker workspace manifest contains invalid file metadata");
		return {
			path: entryPath,
			type: "file",
			mode: gitFileMode(mode),
			size: entry.size,
			sha256: entry.sha256
		};
	}
	if (entry.type === "symlink") {
		if (typeof entry.target !== "string" || !entry.target || entry.target.includes("\\") || path.posix.isAbsolute(entry.target) || path.win32.parse(entry.target).root !== "") throw new Error("Worker workspace manifest contains an unsafe symlink");
		const syntheticRoot = "/workspace";
		const resolved = path.posix.resolve(path.posix.dirname(`${syntheticRoot}/${entryPath}`), entry.target);
		if (resolved !== syntheticRoot && !resolved.startsWith(`${syntheticRoot}/`)) throw new Error("Worker workspace manifest symlink escapes its root");
		return {
			path: entryPath,
			type: "symlink",
			mode: 511,
			target: entry.target
		};
	}
	throw new Error("Worker workspace manifest contains an unsupported entry type");
}
function validateAndProjectEntries(values) {
	if (values.length > 25e4) throw new Error("Worker workspace manifest has too many entries");
	const rawEntries = values.map(parseRawEntry);
	const stagedInputs = stagedInputDirectoriesFromEntries(rawEntries);
	let previous = "";
	let pathBytes = 0;
	let totalBytes = 0;
	const byPath = /* @__PURE__ */ new Map();
	for (const entry of rawEntries) {
		if (byPath.has(entry.path) || previous && previous >= entry.path) throw new Error("Worker workspace manifest paths are not unique and sorted");
		const segments = entry.path.split("/");
		for (let index = 1; index < segments.length; index += 1) if (byPath.get(segments.slice(0, index).join("/"))?.type !== "directory") throw new Error("Worker workspace manifest entry has a non-directory parent");
		pathBytes += Buffer.byteLength(entry.path);
		totalBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		if (pathBytes > 67108864) throw new Error("Worker workspace manifest paths exceed their byte limit");
		if (totalBytes > 4294967296) throw new Error("Worker workspace manifest exceeds its eligible byte limit");
		byPath.set(entry.path, entry);
		previous = entry.path;
	}
	return {
		entries: rawEntries.filter((entry) => entry.type !== "directory" && !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputs))),
		directories: rawEntries.filter((entry) => entry.type === "directory" && !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputs))).map((entry) => entry.path)
	};
}
function serializeWorkerWorkspaceManifest(manifest) {
	const stagedInputs = stagedInputDirectoriesFromEntries(manifest.entries);
	const entries = [...(manifest.directories ?? []).map((entryPath) => ({
		path: entryPath,
		type: "directory",
		mode: 448
	})), ...manifest.entries].filter((entry) => !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputs))).toSorted(compareManifestPaths);
	if (entries.length > 25e4) throw new Error("Worker workspace manifest has too many entries");
	let pathBytes = 0;
	let totalBytes = 0;
	let entryBytes = 0;
	const emptyBytes = Buffer.byteLength(JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries: []
	}));
	for (const entry of entries) {
		pathBytes += Buffer.byteLength(entry.path);
		totalBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		entryBytes += Buffer.byteLength(JSON.stringify(entry));
		if (pathBytes > 67108864) throw new Error("Worker workspace manifest paths exceed their byte limit");
		if (totalBytes > 4294967296) throw new Error("Worker workspace manifest exceeds its eligible byte limit");
		if (emptyBytes + entryBytes + Math.max(0, entries.length - 1) > 67108864) throw new Error("Worker workspace manifest exceeds the 64 MiB safety limit");
	}
	return JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries
	});
}
function parseWorkerWorkspaceManifest(raw, expectedRef) {
	if (Buffer.byteLength(raw) > 67108864) throw new Error("Worker workspace manifest exceeds the 64 MiB safety limit");
	const match = MANIFEST_REF_PATTERN.exec(expectedRef);
	if (!match) throw new Error("Worker workspace manifest reference is invalid");
	if (createHash("sha256").update(raw).digest("hex") !== match[1]) throw new Error("Worker workspace manifest digest does not match its reference");
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest is invalid");
	const manifest = value;
	if (manifest.version !== 1 || manifest.baseCommit !== null && (typeof manifest.baseCommit !== "string" || !GIT_COMMIT_PATTERN.test(manifest.baseCommit)) || !Array.isArray(manifest.entries)) throw new Error("Worker workspace manifest has an unsupported shape");
	return {
		version: 1,
		baseCommit: manifest.baseCommit,
		...validateAndProjectEntries(manifest.entries)
	};
}
function parseJournalEntry(value) {
	const entry = parseRawEntry(value);
	if (entry.type === "directory") throw new Error("Worker workspace reconciliation journal contains a directory entry");
	return entry;
}
function serializeWorkerWorkspaceReconciliationPlan(journal) {
	return JSON.stringify({
		version: journal.version,
		temporaryNonce: journal.temporaryNonce,
		baseManifestRef: journal.baseManifestRef,
		currentManifestRef: journal.currentManifestRef,
		baseEntries: journal.baseEntries,
		appliedEntries: journal.appliedEntries,
		baseDirectories: journal.baseDirectories ?? [],
		appliedDirectories: journal.appliedDirectories ?? [],
		appliedManifestRef: journal.appliedManifestRef,
		baseTree: journal.baseTree,
		basePackSha256: journal.basePackSha256
	});
}
function parseWorkerWorkspaceReconciliationPlan(raw) {
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace reconciliation journal is invalid");
	const plan = value;
	if (plan.version !== 1 || typeof plan.temporaryNonce !== "string" || !/^[a-f0-9]{32}$/u.test(plan.temporaryNonce) || typeof plan.baseManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.baseManifestRef) || typeof plan.currentManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.currentManifestRef) || typeof plan.baseTree !== "string" || !/^[a-f0-9]{40}$/u.test(plan.baseTree) || typeof plan.basePackSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(plan.basePackSha256) || !Array.isArray(plan.baseEntries) || !Array.isArray(plan.appliedEntries) || plan.baseDirectories !== void 0 && !Array.isArray(plan.baseDirectories) || plan.appliedDirectories !== void 0 && !Array.isArray(plan.appliedDirectories) || plan.appliedManifestRef !== void 0 && (typeof plan.appliedManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.appliedManifestRef)) || plan.baseEntries.length + plan.appliedEntries.length + (plan.baseDirectories?.length ?? 0) + (plan.appliedDirectories?.length ?? 0) > MAX_RECONCILIATION_ENTRIES) throw new Error("Worker workspace reconciliation journal has an unsupported shape");
	const baseEntries = plan.baseEntries.map(parseJournalEntry);
	const appliedEntries = plan.appliedEntries.map(parseJournalEntry);
	const baseDirectories = (plan.baseDirectories ?? []).map(manifestPath);
	const appliedDirectories = (plan.appliedDirectories ?? []).map(manifestPath);
	for (const entries of [baseEntries, appliedEntries]) {
		const paths = entries.map((entry) => entry.path);
		if (new Set(paths).size !== paths.length) throw new Error("Worker workspace reconciliation journal has duplicate paths");
	}
	for (const directories of [baseDirectories, appliedDirectories]) if (new Set(directories).size !== directories.length) throw new Error("Worker workspace reconciliation journal has duplicate directories");
	return {
		version: 1,
		temporaryNonce: plan.temporaryNonce,
		baseManifestRef: plan.baseManifestRef,
		currentManifestRef: plan.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		appliedManifestRef: plan.appliedManifestRef,
		baseTree: plan.baseTree,
		basePackSha256: plan.basePackSha256
	};
}
//#endregion
export { gitFileMode as a, serializeWorkerWorkspaceManifest as c, WORKER_ATTACHMENT_DIRECTORY_PATTERN as d, WORKER_ATTACHMENT_DIRECTORY_PREFIX as f, isDerivedWorkspacePath as h, MAX_RECONCILIATION_TOTAL_BYTES as i, serializeWorkerWorkspaceReconciliationPlan as l, WORKSPACE_STAGED_INPUT_OWNERSHIP_JS as m, MAX_RECONCILIATION_FILE_BYTES as n, parseWorkerWorkspaceManifest as o, WORKSPACE_PATH_EXCLUSIONS_JS as p, MAX_RECONCILIATION_PACK_BYTES as r, parseWorkerWorkspaceReconciliationPlan as s, MAX_RECONCILIATION_ENTRIES as t, DERIVED_WORKSPACE_RSYNC_EXCLUDES as u };
