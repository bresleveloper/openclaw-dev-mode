import{i as e}from"./git-operation.worker-record-coerce-BUlpHiHI.mjs";import{i as t,r as n,t as r}from"./git-operation.worker-staged-inputs-DZiTgX91.mjs";import i from"node:path";import{createHash as a}from"node:crypto";import{compileFunction as o}from"node:vm";const s=5e4,c=25e4,l=c*4,u=67108864,d=67108864,f=4294967296;var WorkspaceResultLimitError=class extends Error{constructor(e){super(`${e} Remove generated dependencies/build output from Git tracking and add it to .gitignore, exclude it from the workspace, or split intentional changes before retrying. Saved workspace files were preserved.`),this.code=`WORKSPACE_RESULT_LIMIT`}};function*workspacePathAncestors(e){for(let t=e.indexOf(`/`);t>=0;t=e.indexOf(`/`,t+1))yield e.slice(0,t)}const p=`
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(`.openclaw/sandbox-skills`)};
function isManagedSandboxSkillsPath(relativePath) {
  return (
    relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE ||
    relativePath.startsWith(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE + "/")
  );
}`,m=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`],h=[`.artifacts/build-all-cache`,`.artifacts/build-cache-inputs`],g=`.openclaw/.pnpm-store`,_=[[`.npm/_cacache`,`npm cache`,`npm_config_cache`],[`.npm/_logs`,`npm logs`,`npm_config_cache`],[`.cache/pip`,`pip cache`,`PIP_CACHE_DIR`],[`.cache/uv`,`uv cache`,`UV_CACHE_DIR`],[`.pnpm-store`,`pnpm store`,`PNPM_CONFIG_STORE_DIR`],[`.bun/install/cache`,`Bun cache`,`BUN_INSTALL_CACHE_DIR`],[`.cargo/registry`,`Cargo registry cache`,`CARGO_HOME`],[`.cargo/git`,`Cargo Git cache`,`CARGO_HOME`],[`.gradle/caches`,`Gradle cache`,`GRADLE_USER_HOME`],[`.local/share/NuGet/http-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.local/share/NuGet/v3-cache`,`NuGet HTTP cache`,`NUGET_HTTP_CACHE_PATH`],[`.nuget/packages`,`NuGet global packages`,`NUGET_PACKAGES`]];function workspaceToolCacheHint(e){let t=_.find(([t])=>`/${e}/`.includes(`/${t}/`));return t?`\nCache guidance: Directory class: ${t[1]}. Set ${t[2]} to a writable path outside the workspace, move the cache there, and retry recovery.`:``}const v=[..._.map(([e])=>e),`.cache/vitest`,`.cache/bun-transpiler`,`.cache/openclaw/bun`,`.cache/ms-playwright`,`.cache/convex/binaries`,`.local/share/pnpm/store`,`artifacts/task-environment/local/share/pnpm/store`,g,`.openclaw/tools`,`.artifacts/vitest-workers`,`.artifacts/vitest-worker-cache`,`.artifacts/vitest-shard-timings.json`],y=[`.artifacts/dist-artifacts.lock`,`.openclaw/tmp`],b=[`.DS_Store`],x=[`.pyc`,`.pyo`],S=`[0-9a-f]`,C=`openclaw-inbound-`+[S.repeat(8),S.repeat(4),`4${S.repeat(3)}`,`[89ab]${S.repeat(3)}`,S.repeat(12)].join(`-`),w=`(?:^|/)(?:${[...m.map(e=>e.replaceAll(`.`,`\\.`)),...b.map(e=>e.replaceAll(`.`,`\\.`)),...x.map(e=>`[^/]*${e.replaceAll(`.`,`\\.`)}`),C].join(`|`)})(?![^/])`;function isIgnoredWorkspaceBuildOutput(e,t){if(![`dist`,`.cache/openclaw-bun`].some(t=>e===t||e.startsWith(t+`/`)))return!1;let n=e;for(;n;){if(t.has(n)||t.has(n+`/`))return!0;n=n.slice(0,Math.max(0,n.lastIndexOf(`/`)))}return!1}const T=`
${r}
${p}
const DERIVED_WORKSPACE_ROOT_PATHS = ${JSON.stringify(v)};
const PNPM_FALLBACK_STORE_ROOT_PATH = ${JSON.stringify(g)};
const BUILD_CACHE_ROOT_PATHS = ${JSON.stringify(h)};
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
const RUNTIME_WORKSPACE_ROOT_PATHS = ${JSON.stringify(y)};
const DERIVED_WORKSPACE_SEGMENT_RE = new RegExp(${JSON.stringify(w)});
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
}`,{isDerivedWorkspacePath:E,isRuntimeOwnedWorkspacePath:D,projectWorkspaceEntries:O,buildCacheInputPaths:k}=o(`${T}\nreturn { isDerivedWorkspacePath, isRuntimeOwnedWorkspacePath, projectWorkspaceEntries, buildCacheInputPaths };`)();[...v.map(e=>`/${e}`),...y.map(e=>`/${e}`),...m,...b,...x.map(e=>`*${e}`)],String.raw`
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
}`;const A=c*2,j=67108864,M=805306368,N=268435456,P=/^sha256:([a-f0-9]{64})$/u,F=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;var UnsafeWorkspaceManifestPathError=class extends Error{constructor(){super(`Worker workspace manifest contains an unsafe path`)}};function manifestPath(e){if(typeof e!=`string`||!e||e.includes(`\\`)||i.posix.isAbsolute(e)||i.posix.normalize(e)!==e||e===`.`||e===`..`||e.startsWith(`../`))throw new UnsafeWorkspaceManifestPathError;return e}function manifestMode(e){if(typeof e!=`number`||!Number.isInteger(e)||e<0||e>511)throw Error(`Worker workspace manifest contains an invalid mode`);return e}function gitFileMode(e){return e&73?493:420}function compareManifestPaths(e,t){return e.path<t.path?-1:+(e.path>t.path)}function createManifestBudget(){let e=0,t=0;return n=>{if(e+=Buffer.byteLength(n.path),t+=n.type===`file`?n.size:n.type===`symlink`?Buffer.byteLength(n.target):0,e>67108864)throw new WorkspaceResultLimitError(`Worker workspace manifest paths exceed their byte limit.`);if(t>4294967296)throw new WorkspaceResultLimitError(`Worker workspace manifest exceeds its eligible byte limit.`)}}function parseRawEntry(t){if(!e(t))throw Error(`Worker workspace manifest contains an invalid entry`);let n=manifestPath(t.path),r=manifestMode(t.mode);if(t.type===`directory`)return{path:n,type:`directory`,mode:r};if(t.type===`file`){if(typeof t.size!=`number`||!Number.isSafeInteger(t.size)||t.size<0||typeof t.sha256!=`string`||!/^[a-f0-9]{64}$/u.test(t.sha256))throw Error(`Worker workspace manifest contains invalid file metadata`);return{path:n,type:`file`,mode:gitFileMode(r),size:t.size,sha256:t.sha256}}if(t.type===`symlink`){if(typeof t.target!=`string`||!t.target||t.target.includes(`\\`)||i.posix.isAbsolute(t.target)||i.win32.parse(t.target).root!==``)throw Error(`Worker workspace manifest contains an unsafe symlink`);let e=`/workspace`,r=i.posix.resolve(i.posix.dirname(`${e}/${n}`),t.target);if(r!==e&&!r.startsWith(`${e}/`))throw Error(`Worker workspace manifest symlink escapes its root`);return{path:n,type:`symlink`,mode:511,target:t.target}}throw Error(`Worker workspace manifest contains an unsupported entry type`)}function validateAndProjectEntries(e,r,i=`current`){if(e.length>25e4)throw new WorkspaceResultLimitError(`Worker workspace manifest has too many entries: ${e.length} files/directories (limit ${c}).`);let a=e.map(parseRawEntry),o=``,s=createManifestBudget(),l=/* @__PURE__ */ new Map;for(let e of a){if(o>=e.path)throw Error(`Worker workspace manifest paths are not unique and sorted`);for(let t of workspacePathAncestors(e.path))if(l.get(t)?.type!==`directory`)throw Error(`Worker workspace manifest entry has a non-directory parent`);s(e),l.set(e.path,e),o=e.path}let u=t(a),d=k(r),f=i===`stored`?a:O(a,e=>d.has(e)||n(e,u),r!==void 0);return{entries:f.filter(e=>e.type!==`directory`),directories:f.filter(e=>e.type===`directory`).map(e=>e.path)}}function serializeWorkerWorkspaceManifest(e,r=`current`){let i=[...(e.directories??[]).map(e=>({path:e,type:`directory`,mode:448})),...e.entries].toSorted(compareManifestPaths),a=t(i),o=k(e.buildCacheInputs),s=r===`stored`?i:O(i,e=>o.has(e)||n(e,a),e.buildCacheInputs!==void 0);if(s.length>25e4)throw new WorkspaceResultLimitError(`Worker workspace manifest has too many entries: ${s.length} files/directories (limit ${c}).`);let l=createManifestBudget(),u=0,d=Buffer.byteLength(JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:[]}));for(let e of s)if(u+=Buffer.byteLength(JSON.stringify(e)),l(e),d+u+Math.max(0,s.length-1)>67108864)throw new WorkspaceResultLimitError(`Worker workspace manifest exceeds the 64 MiB safety limit.`);return JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:s})}function parseWorkerWorkspaceManifest(t,n,r,i=`current`){if(Buffer.byteLength(t)>67108864)throw new WorkspaceResultLimitError(`Worker workspace manifest exceeds the 64 MiB safety limit.`);let o=P.exec(n);if(!o)throw Error(`Worker workspace manifest reference is invalid`);if(a(`sha256`).update(t).digest(`hex`)!==o[1])throw Error(`Worker workspace manifest digest does not match its reference`);let s=JSON.parse(t);if(!e(s))throw Error(`Worker workspace manifest is invalid`);if(s.version!==1||s.baseCommit!==null&&(typeof s.baseCommit!=`string`||!F.test(s.baseCommit))||!Array.isArray(s.entries))throw Error(`Worker workspace manifest has an unsupported shape`);return{version:1,baseCommit:s.baseCommit,...validateAndProjectEntries(s.entries,r,i),...r===void 0?{}:{buildCacheInputs:r}}}export{WorkspaceResultLimitError as S,c as _,UnsafeWorkspaceManifestPathError as a,d as b,serializeWorkerWorkspaceManifest as c,isIgnoredWorkspaceBuildOutput as d,D as f,l as g,workspacePathAncestors as h,M as i,k as l,workspaceToolCacheHint as m,j as n,gitFileMode as o,O as p,N as r,parseWorkerWorkspaceManifest as s,A as t,E as u,u as v,s as x,f as y};