import{i as STAGED_INPUT_PATHS_JS}from"./staged-inputs-CPADsu98.mjs";import{n as MATERIALIZED_SANDBOX_SKILLS_WORKSPACE,t as MANAGED_SANDBOX_SKILLS_PATH_JS}from"./sandbox-workspace-paths-BGnXkx1X.mjs";import{compileFunction}from"node:vm";
//!src/gateway/worker-environments/workspace-path-exclusions.ts
const DERIVED_WORKSPACE_DIRECTORY_NAMES=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`];const BUILD_CACHE_ROOT_PATHS=[`.artifacts/build-all-cache`,`.artifacts/build-cache-inputs`];const PNPM_FALLBACK_STORE_ROOT_PATH=`.openclaw/.pnpm-store`;const TOOL_CACHE_ROOTS=[[`.npm/_cacache`,`npm cache`,`npm_config_cache`],[`.npm/_logs`,`npm logs`,`npm_config_cache`],[`.cache/pip`,`pip cache`,`PIP_CACHE_DIR`],[`.cache/uv`,`uv cache`,`UV_CACHE_DIR`],[`.pnpm-store`,`pnpm store`,`PNPM_CONFIG_STORE_DIR`],[`.bun/install/cache`,`Bun cache`,`BUN_INSTALL_CACHE_DIR`],[`.cargo/registry`,`Cargo registry cache`,`CARGO_HOME`],[`.cargo/git`,`Cargo Git cache`,`CARGO_HOME`],[`.gradle/caches`,`Gradle cache`,`GRADLE_USER_HOME`],[`.local/share/NuGet/http-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.local/share/NuGet/v3-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.nuget/packages`,`NuGet global packages`,`NUGET_PACKAGES`]];function workspaceToolCacheHint(e){const t=TOOL_CACHE_ROOTS.find(([t])=>`/${e}/`.includes(`/${t}/`));return t?`\nCache guidance: Directory class: ${t[1]}. Set ${t[2]} to a writable path outside the workspace, move the cache there, and retry recovery.`:``}const DERIVED_WORKSPACE_ROOT_PATHS=[...TOOL_CACHE_ROOTS.map(([e])=>e),`.cache/vitest`,`.cache/bun-transpiler`,`.cache/openclaw/bun`,`.cache/ms-playwright`,`.cache/convex/binaries`,`.local/share/pnpm/store`,`artifacts/task-environment/local/share/pnpm/store`,PNPM_FALLBACK_STORE_ROOT_PATH,`.openclaw/tools`,`.artifacts/vitest-workers`,`.artifacts/vitest-worker-cache`,`.artifacts/vitest-shard-timings.json`];const RUNTIME_WORKSPACE_ROOT_PATHS=[`.artifacts/dist-artifacts.lock`,`.openclaw/tmp`];const DERIVED_WORKSPACE_FILE_NAMES=[`.DS_Store`];const DERIVED_WORKSPACE_FILE_SUFFIXES=[`.pyc`,`.pyo`];const WORKER_ATTACHMENT_DIRECTORY_PREFIX=`openclaw-inbound-`;const UUID_HEX=`[0-9a-f]`;const WORKER_ATTACHMENT_DIRECTORY_PATTERN=WORKER_ATTACHMENT_DIRECTORY_PREFIX+[UUID_HEX.repeat(8),UUID_HEX.repeat(4),`4${UUID_HEX.repeat(3)}`,`[89ab]${UUID_HEX.repeat(3)}`,UUID_HEX.repeat(12)].join(`-`);const DERIVED_WORKSPACE_SEGMENT_PATTERN=`(?:^|/)(?:${[...DERIVED_WORKSPACE_DIRECTORY_NAMES.map(e=>e.replaceAll(`.`,`\\.`)),...DERIVED_WORKSPACE_FILE_NAMES.map(e=>e.replaceAll(`.`,`\\.`)),...DERIVED_WORKSPACE_FILE_SUFFIXES.map(e=>`[^/]*${e.replaceAll(`.`,`\\.`)}`),WORKER_ATTACHMENT_DIRECTORY_PATTERN].join(`|`)})(?![^/])`;function isIgnoredWorkspaceBuildOutput(e,t){if(![`dist`,`.cache/openclaw-bun`].some(t=>e===t||e.startsWith(t+`/`)))return false;let n=e;while(n){if(t.has(n)||t.has(n+`/`))return true;n=n.slice(0,Math.max(0,n.lastIndexOf(`/`)))}return false}const WORKSPACE_PATH_EXCLUSIONS_JS=`
${STAGED_INPUT_PATHS_JS}
${MANAGED_SANDBOX_SKILLS_PATH_JS}
const DERIVED_WORKSPACE_ROOT_PATHS = ${JSON.stringify(DERIVED_WORKSPACE_ROOT_PATHS)};
const PNPM_FALLBACK_STORE_ROOT_PATH = ${JSON.stringify(PNPM_FALLBACK_STORE_ROOT_PATH)};
const BUILD_CACHE_ROOT_PATHS = ${JSON.stringify(BUILD_CACHE_ROOT_PATHS)};
function isBuildCacheWorkspacePath(relativePath) {
  return BUILD_CACHE_ROOT_PATHS.some((root) => relativePath === root || relativePath.startsWith(root + "/"));
}
function buildCacheInputPaths(paths = []) {
  const retained = new Set();
  for (const entryPath of paths) {
    if (!isBuildCacheWorkspacePath(entryPath)) continue;
    const segments = entryPath.split("/");
    for (let index = 1; index <= segments.length; index++) retained.add(segments.slice(0, index).join("/"));
  }
  return retained;
}
const RUNTIME_WORKSPACE_ROOT_PATHS = ${JSON.stringify(RUNTIME_WORKSPACE_ROOT_PATHS)};
const DERIVED_WORKSPACE_SEGMENT_RE = new RegExp(${JSON.stringify(DERIVED_WORKSPACE_SEGMENT_PATTERN)});
function isRuntimeOwnedWorkspacePath(relativePath) {
  return relativePath === ".git" || relativePath.startsWith(".git/") ||
    relativePath.endsWith("/.git") || relativePath.includes("/.git/") ||
    isManagedSandboxSkillsPath(relativePath) || RUNTIME_WORKSPACE_ROOT_PATHS.some(
    (root) => relativePath === root || relativePath.startsWith(root + "/"),
  );
}
function isDerivedWorkspacePath(relativePath, retainedInput = false, excludeBuildCaches = false, includeLegacyPnpmStore = false) {
  if (isRuntimeOwnedWorkspacePath(relativePath)) {
    return true;
  }
  if (retainedInput) {
    return false;
  }
  if (excludeBuildCaches && isBuildCacheWorkspacePath(relativePath)) return true;
  if (DERIVED_WORKSPACE_ROOT_PATHS.some(
    (root) => (!includeLegacyPnpmStore || root !== PNPM_FALLBACK_STORE_ROOT_PATH) &&
      (relativePath === root || relativePath.startsWith(root + "/")),
  )) {
    return true;
  }
  return DERIVED_WORKSPACE_SEGMENT_RE.test(relativePath);
}
function projectWorkspaceEntries(entries, isRetainedInput, excludeBuildCaches = false) {
  const nonemptyDirectories = new Set();
  const retainedParents = new Set();
  const parent = (entryPath) => entryPath.slice(0, Math.max(0, entryPath.lastIndexOf("/")));
  for (const entry of entries) nonemptyDirectories.add(parent(entry.path));
  const eligible = [];
  // Children precede parents in this reverse walk of the sorted inventory.
  // Prune ancestry created only by excluded contents, but retain original empty directories.
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    if (
      isDerivedWorkspacePath(entry.path, isRetainedInput(entry.path), excludeBuildCaches) ||
      (entry.type === "directory" && nonemptyDirectories.has(entry.path) && !retainedParents.has(entry.path))
    ) continue;
    eligible.push(entry);
    retainedParents.add(parent(entry.path));
  }
  return eligible.toReversed();
}`;const{isDerivedWorkspacePath,isRuntimeOwnedWorkspacePath,projectWorkspaceEntries,buildCacheInputPaths}=compileFunction(`${WORKSPACE_PATH_EXCLUSIONS_JS}\nreturn { isDerivedWorkspacePath, isRuntimeOwnedWorkspacePath, projectWorkspaceEntries, buildCacheInputPaths };`)();const DERIVED_WORKSPACE_RSYNC_EXCLUDES=[`/${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}`,...DERIVED_WORKSPACE_ROOT_PATHS.map(e=>`/${e}`),...RUNTIME_WORKSPACE_ROOT_PATHS.map(e=>`/${e}`),...DERIVED_WORKSPACE_DIRECTORY_NAMES,...DERIVED_WORKSPACE_FILE_NAMES,...DERIVED_WORKSPACE_FILE_SUFFIXES.map(e=>`*${e}`),WORKER_ATTACHMENT_DIRECTORY_PATTERN];const WORKSPACE_STAGED_INPUT_OWNERSHIP_JS=String.raw`
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
}`;export{WORKSPACE_STAGED_INPUT_OWNERSHIP_JS as a,isIgnoredWorkspaceBuildOutput as c,workspaceToolCacheHint as d,WORKSPACE_PATH_EXCLUSIONS_JS as i,isRuntimeOwnedWorkspacePath as l,WORKER_ATTACHMENT_DIRECTORY_PATTERN as n,buildCacheInputPaths as o,WORKER_ATTACHMENT_DIRECTORY_PREFIX as r,isDerivedWorkspacePath as s,DERIVED_WORKSPACE_RSYNC_EXCLUDES as t,projectWorkspaceEntries as u};