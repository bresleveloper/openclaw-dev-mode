import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{i as t,s as n}from"./worker-chunk-BNORavZE.mjs";import{i as r,n as i,t as a}from"./worker-chunk-C9GCflWa.mjs";import{compileFunction as o}from"node:vm";function workspaceToolCacheHint(e){let t=u.find(([t])=>`/${e}/`.includes(`/${t}/`));return t?`\nCache guidance: Directory class: ${t[1]}. Set ${t[2]} to a writable path outside the workspace, move the cache there, and retry recovery.`:``}function isIgnoredWorkspaceBuildOutput(e,t){if(![`dist`,`.cache/openclaw-bun`].some(t=>e===t||e.startsWith(t+`/`)))return!1;let n=e;for(;n;){if(t.has(n)||t.has(n+`/`))return!0;n=n.slice(0,Math.max(0,n.lastIndexOf(`/`)))}return!1}var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w=e((()=>{n(),r(),s=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`],c=[`.artifacts/build-all-cache`,`.artifacts/build-cache-inputs`],l=`.openclaw/.pnpm-store`,u=[[`.npm/_cacache`,`npm cache`,`npm_config_cache`],[`.npm/_logs`,`npm logs`,`npm_config_cache`],[`.cache/pip`,`pip cache`,`PIP_CACHE_DIR`],[`.cache/uv`,`uv cache`,`UV_CACHE_DIR`],[`.pnpm-store`,`pnpm store`,`PNPM_CONFIG_STORE_DIR`],[`.bun/install/cache`,`Bun cache`,`BUN_INSTALL_CACHE_DIR`],[`.cargo/registry`,`Cargo registry cache`,`CARGO_HOME`],[`.cargo/git`,`Cargo Git cache`,`CARGO_HOME`],[`.gradle/caches`,`Gradle cache`,`GRADLE_USER_HOME`],[`.local/share/NuGet/http-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.local/share/NuGet/v3-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.nuget/packages`,`NuGet global packages`,`NUGET_PACKAGES`]],d=[...u.map(([e])=>e),`.cache/vitest`,`.cache/bun-transpiler`,`.cache/openclaw/bun`,`.cache/ms-playwright`,`.cache/convex/binaries`,`.local/share/pnpm/store`,`artifacts/task-environment/local/share/pnpm/store`,l,`.openclaw/tools`,`.artifacts/vitest-workers`,`.artifacts/vitest-worker-cache`,`.artifacts/vitest-shard-timings.json`],f=[`.artifacts/dist-artifacts.lock`,`.openclaw/tmp`],p=[`.DS_Store`],m=[`.pyc`,`.pyo`],h=`openclaw-inbound-`,g=`[0-9a-f]`,_=h+[g.repeat(8),g.repeat(4),`4${g.repeat(3)}`,`[89ab]${g.repeat(3)}`,g.repeat(12)].join(`-`),v=`(?:^|/)(?:${[...s.map(e=>e.replaceAll(`.`,`\\.`)),...p.map(e=>e.replaceAll(`.`,`\\.`)),...m.map(e=>`[^/]*${e.replaceAll(`.`,`\\.`)}`),_].join(`|`)})(?![^/])`,y=`
${t}
${a}
const DERIVED_WORKSPACE_ROOT_PATHS = ${JSON.stringify(d)};
const PNPM_FALLBACK_STORE_ROOT_PATH = ${JSON.stringify(l)};
const BUILD_CACHE_ROOT_PATHS = ${JSON.stringify(c)};
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
const RUNTIME_WORKSPACE_ROOT_PATHS = ${JSON.stringify(f)};
const DERIVED_WORKSPACE_SEGMENT_RE = new RegExp(${JSON.stringify(v)});
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
}`,{isDerivedWorkspacePath:b,isRuntimeOwnedWorkspacePath:x,projectWorkspaceEntries:S,buildCacheInputPaths:C}=o(`${y}\nreturn { isDerivedWorkspacePath, isRuntimeOwnedWorkspacePath, projectWorkspaceEntries, buildCacheInputPaths };`)(),[`${i}`,...d.map(e=>`/${e}`),...f.map(e=>`/${e}`),...s,...p,...m.map(e=>`*${e}`)],String.raw`
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
}`}));export{isIgnoredWorkspaceBuildOutput as a,workspaceToolCacheHint as c,b as i,C as n,x as o,w as r,S as s,y as t};