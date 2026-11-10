import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
import { compileFunction } from "node:vm";
//#region src/media/staged-inputs.ts
const STAGED_INPUT_DIRECTORY_PREFIX = "media/inbound/openclaw-staged-";
const STAGED_INPUT_GIT_PATHSPEC = `:(glob)${STAGED_INPUT_DIRECTORY_PREFIX}*/**`;
const STAGED_INPUT_GITIGNORE = "# Raw task inputs remain private; copy outputs into the project to publish.\n*\n";
const STAGED_INPUT_GITIGNORE_SHA256 = createHash("sha256").update(STAGED_INPUT_GITIGNORE).digest("hex");
const STAGED_INPUT_PATHS_JS = String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(STAGED_INPUT_DIRECTORY_PREFIX)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(STAGED_INPUT_GITIGNORE)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(STAGED_INPUT_GITIGNORE_SHA256)};
// A producer-shaped name is only a candidate; the marker establishes ownership.
function stagedInputPathDirectory(relativePath) {
  if (!relativePath.startsWith(STAGED_INPUT_DIRECTORY_PREFIX)) {
    return undefined;
  }
  const identity = relativePath.slice(STAGED_INPUT_DIRECTORY_PREFIX.length).split("/")[0];
  const match =
    /^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/u.exec(
      identity,
    );
  return match?.[0] === identity ? STAGED_INPUT_DIRECTORY_PREFIX + identity : undefined;
}

function isStagedInputPath(relativePath, directories) {
  const directory = stagedInputPathDirectory(relativePath);
  return directory !== undefined && directories.has(directory);
}

// Complete manifests bind the regular marker's exact bytes through their file digest.
function stagedInputDirectoriesFromEntries(entries) {
  const directories = new Set();
  for (const entry of entries) {
    const directory = stagedInputPathDirectory(entry.path);
    if (
      directory &&
      entry.path === directory + "/.gitignore" &&
      entry.type === "file" &&
      entry.size === STAGED_INPUT_GITIGNORE.length &&
      entry.sha256 === STAGED_INPUT_GITIGNORE_SHA256
    ) {
      directories.add(directory);
    }
  }
  return directories;
}`;
const { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries } = compileFunction(`${STAGED_INPUT_PATHS_JS}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)();
/** Capture-scoped, including negative results: never read the marker once per file. */
function createStagedInputPathMatcher(root) {
	const directories = /* @__PURE__ */ new Map();
	return async (relativePath) => {
		const directory = stagedInputPathDirectory(relativePath);
		if (!directory) return false;
		let owned = directories.get(directory);
		if (!owned) {
			owned = root.readText(`${directory}/.gitignore`, { maxBytes: 78 }).then((text) => text === STAGED_INPUT_GITIGNORE, () => false);
			directories.set(directory, owned);
		}
		return await owned;
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-inventory-limits.ts
const MAX_WORKSPACE_INVENTORY_ENTRIES = 25e4;
const MAX_WORKSPACE_GIT_CANDIDATES = MAX_WORKSPACE_INVENTORY_ENTRIES * 4;
const MAX_WORKSPACE_INVENTORY_PATH_BYTES = 67108864;
const MAX_WORKSPACE_MANIFEST_BYTES = 67108864;
const MAX_WORKSPACE_INVENTORY_TOTAL_BYTES = 4294967296;
//#endregion
//#region src/gateway/worker-environments/workspace-path-ancestors.ts
function* workspacePathAncestors(entryPath) {
	for (let separator = entryPath.indexOf("/"); separator >= 0; separator = entryPath.indexOf("/", separator + 1)) yield entryPath.slice(0, separator);
}
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = [".openclaw", "sandbox-skills"].join("/");
const MANAGED_SANDBOX_SKILLS_PATH_JS = `
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE)};
function isManagedSandboxSkillsPath(relativePath) {
  return (
    relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE ||
    relativePath.startsWith(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE + "/")
  );
}`;
const isManagedSandboxSkillsPath = compileFunction(`${MANAGED_SANDBOX_SKILLS_PATH_JS}\nreturn isManagedSandboxSkillsPath;`)();
//#endregion
//#region src/gateway/worker-environments/workspace-path-exclusions.ts
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
const WORKSPACE_PATH_EXCLUSIONS_JS = `
${STAGED_INPUT_PATHS_JS}
${MANAGED_SANDBOX_SKILLS_PATH_JS}
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_DIRECTORY_NAMES)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_NAMES)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_SUFFIXES)};
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(${JSON.stringify(`^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$`)});
function isDerivedWorkspacePath(relativePath, retainedInput = false) {
  if (isManagedSandboxSkillsPath(relativePath)) {
    return true;
  }
  if (retainedInput) {
    return false;
  }
  const segments = relativePath.split("/");
  // "$" can match before a final newline; require the entire path segment.
  return segments.some(
    (segment) =>
      WORKER_ATTACHMENT_DIRECTORY_RE.exec(segment)?.[0] === segment ||
      DERIVED_WORKSPACE_DIRECTORY_NAMES.includes(segment) ||
      DERIVED_WORKSPACE_FILE_NAMES.includes(segment) ||
      DERIVED_WORKSPACE_FILE_SUFFIXES.some((suffix) => segment.endsWith(suffix)),
  );
}`;
const isDerivedWorkspacePath = compileFunction(`${WORKSPACE_PATH_EXCLUSIONS_JS}\nreturn isDerivedWorkspacePath;`)();
[
	`${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}`,
	...DERIVED_WORKSPACE_DIRECTORY_NAMES,
	...DERIVED_WORKSPACE_FILE_NAMES,
	...DERIVED_WORKSPACE_FILE_SUFFIXES.map((suffix) => `*${suffix}`)
];
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
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 511) throw new Error("Worker workspace manifest contains an invalid mode");
	return value;
}
function gitFileMode(mode) {
	return (mode & 73) === 0 ? 420 : 493;
}
function compareManifestPaths(left, right) {
	return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}
function createManifestBudget() {
	let pathBytes = 0;
	let totalBytes = 0;
	return (entry) => {
		pathBytes += Buffer.byteLength(entry.path);
		totalBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		if (pathBytes > 67108864) throw new Error("Worker workspace manifest paths exceed their byte limit");
		if (totalBytes > 4294967296) throw new Error("Worker workspace manifest exceeds its eligible byte limit");
	};
}
function parseRawEntry(entry) {
	if (!isRecord(entry)) throw new Error("Worker workspace manifest contains an invalid entry");
	const entryPath = manifestPath(entry.path);
	const mode = manifestMode(entry.mode);
	if (entry.type === "directory") return {
		path: entryPath,
		type: "directory",
		mode
	};
	if (entry.type === "file") {
		if (typeof entry.size !== "number" || !Number.isSafeInteger(entry.size) || entry.size < 0 || typeof entry.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error("Worker workspace manifest contains invalid file metadata");
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
	const recordBudget = createManifestBudget();
	const byPath = /* @__PURE__ */ new Map();
	for (const entry of rawEntries) {
		if (previous >= entry.path) throw new Error("Worker workspace manifest paths are not unique and sorted");
		for (const ancestor of workspacePathAncestors(entry.path)) if (byPath.get(ancestor)?.type !== "directory") throw new Error("Worker workspace manifest entry has a non-directory parent");
		recordBudget(entry);
		byPath.set(entry.path, entry);
		previous = entry.path;
	}
	const eligible = rawEntries.filter((entry) => !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputs)));
	return {
		entries: eligible.filter((entry) => entry.type !== "directory"),
		directories: eligible.filter((entry) => entry.type === "directory").map((entry) => entry.path)
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
	const recordBudget = createManifestBudget();
	let entryBytes = 0;
	const emptyBytes = Buffer.byteLength(JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries: []
	}));
	for (const entry of entries) {
		entryBytes += Buffer.byteLength(JSON.stringify(entry));
		recordBudget(entry);
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
	const manifest = JSON.parse(raw);
	if (!isRecord(manifest)) throw new Error("Worker workspace manifest is invalid");
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
function parseWorkerWorkspaceReconciliationPlan(raw) {
	const plan = JSON.parse(raw);
	if (!isRecord(plan)) throw new Error("Worker workspace reconciliation journal is invalid");
	const { baseDirectories: rawBaseDirectories = [], appliedDirectories: rawAppliedDirectories = [] } = plan;
	if (plan.version !== 1 || typeof plan.temporaryNonce !== "string" || !/^[a-f0-9]{32}$/u.test(plan.temporaryNonce) || typeof plan.baseManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.baseManifestRef) || typeof plan.currentManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.currentManifestRef) || typeof plan.baseTree !== "string" || !/^[a-f0-9]{40}$/u.test(plan.baseTree) || typeof plan.basePackSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(plan.basePackSha256) || !Array.isArray(plan.baseEntries) || !Array.isArray(plan.appliedEntries) || !Array.isArray(rawBaseDirectories) || !Array.isArray(rawAppliedDirectories) || plan.appliedManifestRef !== void 0 && (typeof plan.appliedManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.appliedManifestRef)) || plan.baseEntries.length + plan.appliedEntries.length + rawBaseDirectories.length + rawAppliedDirectories.length > MAX_RECONCILIATION_ENTRIES) throw new Error("Worker workspace reconciliation journal has an unsupported shape");
	const baseEntries = plan.baseEntries.map(parseJournalEntry);
	const appliedEntries = plan.appliedEntries.map(parseJournalEntry);
	const baseDirectories = rawBaseDirectories.map(manifestPath);
	const appliedDirectories = rawAppliedDirectories.map(manifestPath);
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
export { stagedInputDirectoriesFromEntries as S, MAX_WORKSPACE_INVENTORY_TOTAL_BYTES as _, gitFileMode as a, createStagedInputPathMatcher as b, serializeWorkerWorkspaceManifest as c, isDerivedWorkspacePath as d, isManagedSandboxSkillsPath as f, MAX_WORKSPACE_INVENTORY_PATH_BYTES as g, MAX_WORKSPACE_INVENTORY_ENTRIES as h, MAX_RECONCILIATION_TOTAL_BYTES as i, WORKSPACE_PATH_EXCLUSIONS_JS as l, MAX_WORKSPACE_GIT_CANDIDATES as m, MAX_RECONCILIATION_FILE_BYTES as n, parseWorkerWorkspaceManifest as o, workspacePathAncestors as p, MAX_RECONCILIATION_PACK_BYTES as r, parseWorkerWorkspaceReconciliationPlan as s, MAX_RECONCILIATION_ENTRIES as t, WORKSPACE_STAGED_INPUT_OWNERSHIP_JS as u, MAX_WORKSPACE_MANIFEST_BYTES as v, isStagedInputPath as x, STAGED_INPUT_GIT_PATHSPEC as y };
