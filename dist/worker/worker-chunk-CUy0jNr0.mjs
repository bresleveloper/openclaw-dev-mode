import{n as e}from"./worker-chunk-IQf3eJtA.mjs";import{o as t}from"./worker-chunk-BESy_QZo.mjs";import n from"node:path";import{createHash as r}from"node:crypto";import{compileFunction as i}from"node:vm";function createStagedInputPathMatcher(e){let t=/* @__PURE__ */ new Map;return async n=>{let r=u(n);if(!r)return!1;let i=t.get(r);return i||(i=e.readText(`${r}/.gitignore`,{maxBytes:78}).then(e=>e===s,()=>!1),t.set(r,i)),await i}}var a,o,s,c,l,u,d,f;function init_staged_inputs(){return(init_staged_inputs=e((()=>{a=`media/inbound/openclaw-staged-`,o=`:(glob)${a}*/**`,s=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`,c=r(`sha256`).update(s).digest(`hex`),l=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(a)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(s)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(c)};
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
}`,{stagedInputPathDirectory:u,isStagedInputPath:d,stagedInputDirectoriesFromEntries:f}=i(`${l}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)()})))()}var p,m,h,g,_;function init_workspace_inventory_limits(){return(init_workspace_inventory_limits=e((()=>{p=25e4,m=p*4,h=67108864,g=67108864,_=4294967296})))()}function*workspacePathAncestors(e){for(let t=e.indexOf(`/`);t>=0;t=e.indexOf(`/`,t+1))yield e.slice(0,t)}function init_workspace_path_ancestors(){return(init_workspace_path_ancestors=e((()=>{})))()}var v,y,b,x;function init_sandbox_workspace_paths(){return(init_sandbox_workspace_paths=e((()=>{v=[`.openclaw`,`sandbox-skills`],y=v.join(`/`),b=`
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(y)};
function isManagedSandboxSkillsPath(relativePath) {
  return (
    relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE ||
    relativePath.startsWith(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE + "/")
  );
}`,x=i(`${b}\nreturn isManagedSandboxSkillsPath;`)()})))()}var S,C,w,T,E,D,O,k,A;function init_workspace_path_exclusions(){return(init_workspace_path_exclusions=e((()=>{init_staged_inputs(),init_sandbox_workspace_paths(),S=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`],C=[`.DS_Store`],w=[`.pyc`,`.pyo`],T=`openclaw-inbound-`,E=`[0-9a-f]`,D=T+[E.repeat(8),E.repeat(4),`4${E.repeat(3)}`,`[89ab]${E.repeat(3)}`,E.repeat(12)].join(`-`),O=`
${l}
${b}
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(S)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(C)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(w)};
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(${JSON.stringify(`^${D}$`)});
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
}`,k=i(`${O}\nreturn isDerivedWorkspacePath;`)(),[`${y}`,...S,...C,...w.map(e=>`*${e}`)],A=String.raw`
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
}`})))()}function manifestPath(e){if(typeof e!=`string`||!e||e.includes(`\\`)||n.posix.isAbsolute(e)||n.posix.normalize(e)!==e||e===`.`||e===`..`||e.startsWith(`../`))throw Error(`Worker workspace manifest contains an unsafe path`);return e}function manifestMode(e){if(typeof e!=`number`||!Number.isInteger(e)||e<0||e>511)throw Error(`Worker workspace manifest contains an invalid mode`);return e}function gitFileMode(e){return e&73?493:420}function compareManifestPaths(e,t){return e.path<t.path?-1:+(e.path>t.path)}function createManifestBudget(){let e=0,t=0;return n=>{if(e+=Buffer.byteLength(n.path),t+=n.type===`file`?n.size:n.type===`symlink`?Buffer.byteLength(n.target):0,e>67108864)throw Error(`Worker workspace manifest paths exceed their byte limit`);if(t>4294967296)throw Error(`Worker workspace manifest exceeds its eligible byte limit`)}}function parseRawEntry(e){if(!t(e))throw Error(`Worker workspace manifest contains an invalid entry`);let r=manifestPath(e.path),i=manifestMode(e.mode);if(e.type===`directory`)return{path:r,type:`directory`,mode:i};if(e.type===`file`){if(typeof e.size!=`number`||!Number.isSafeInteger(e.size)||e.size<0||typeof e.sha256!=`string`||!/^[a-f0-9]{64}$/u.test(e.sha256))throw Error(`Worker workspace manifest contains invalid file metadata`);return{path:r,type:`file`,mode:gitFileMode(i),size:e.size,sha256:e.sha256}}if(e.type===`symlink`){if(typeof e.target!=`string`||!e.target||e.target.includes(`\\`)||n.posix.isAbsolute(e.target)||n.win32.parse(e.target).root!==``)throw Error(`Worker workspace manifest contains an unsafe symlink`);let t=`/workspace`,i=n.posix.resolve(n.posix.dirname(`${t}/${r}`),e.target);if(i!==t&&!i.startsWith(`${t}/`))throw Error(`Worker workspace manifest symlink escapes its root`);return{path:r,type:`symlink`,mode:511,target:e.target}}throw Error(`Worker workspace manifest contains an unsupported entry type`)}function validateAndProjectEntries(e){if(e.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let t=e.map(parseRawEntry),n=f(t),r=``,i=createManifestBudget(),a=/* @__PURE__ */ new Map;for(let e of t){if(r>=e.path)throw Error(`Worker workspace manifest paths are not unique and sorted`);for(let t of workspacePathAncestors(e.path))if(a.get(t)?.type!==`directory`)throw Error(`Worker workspace manifest entry has a non-directory parent`);i(e),a.set(e.path,e),r=e.path}let o=t.filter(e=>!k(e.path,d(e.path,n)));return{entries:o.filter(e=>e.type!==`directory`),directories:o.filter(e=>e.type===`directory`).map(e=>e.path)}}function serializeWorkerWorkspaceManifest(e){let t=f(e.entries),n=[...(e.directories??[]).map(e=>({path:e,type:`directory`,mode:448})),...e.entries].filter(e=>!k(e.path,d(e.path,t))).toSorted(compareManifestPaths);if(n.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let r=createManifestBudget(),i=0,a=Buffer.byteLength(JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:[]}));for(let e of n)if(i+=Buffer.byteLength(JSON.stringify(e)),r(e),a+i+Math.max(0,n.length-1)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`);return JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:n})}function parseWorkerWorkspaceManifest(e,n){if(Buffer.byteLength(e)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`);let i=F.exec(n);if(!i)throw Error(`Worker workspace manifest reference is invalid`);if(r(`sha256`).update(e).digest(`hex`)!==i[1])throw Error(`Worker workspace manifest digest does not match its reference`);let a=JSON.parse(e);if(!t(a))throw Error(`Worker workspace manifest is invalid`);if(a.version!==1||a.baseCommit!==null&&(typeof a.baseCommit!=`string`||!I.test(a.baseCommit))||!Array.isArray(a.entries))throw Error(`Worker workspace manifest has an unsupported shape`);return{version:1,baseCommit:a.baseCommit,...validateAndProjectEntries(a.entries)}}function parseJournalEntry(e){let t=parseRawEntry(e);if(t.type===`directory`)throw Error(`Worker workspace reconciliation journal contains a directory entry`);return t}function parseWorkerWorkspaceReconciliationPlan(e){let n=JSON.parse(e);if(!t(n))throw Error(`Worker workspace reconciliation journal is invalid`);let{baseDirectories:r=[],appliedDirectories:i=[]}=n;if(n.version!==1||typeof n.temporaryNonce!=`string`||!/^[a-f0-9]{32}$/u.test(n.temporaryNonce)||typeof n.baseManifestRef!=`string`||!F.test(n.baseManifestRef)||typeof n.currentManifestRef!=`string`||!F.test(n.currentManifestRef)||typeof n.baseTree!=`string`||!/^[a-f0-9]{40}$/u.test(n.baseTree)||typeof n.basePackSha256!=`string`||!/^[a-f0-9]{64}$/u.test(n.basePackSha256)||!Array.isArray(n.baseEntries)||!Array.isArray(n.appliedEntries)||!Array.isArray(r)||!Array.isArray(i)||n.appliedManifestRef!==void 0&&(typeof n.appliedManifestRef!=`string`||!F.test(n.appliedManifestRef))||n.baseEntries.length+n.appliedEntries.length+r.length+i.length>j)throw Error(`Worker workspace reconciliation journal has an unsupported shape`);let a=n.baseEntries.map(parseJournalEntry),o=n.appliedEntries.map(parseJournalEntry),s=r.map(manifestPath),c=i.map(manifestPath);for(let e of[a,o]){let t=e.map(e=>e.path);if(new Set(t).size!==t.length)throw Error(`Worker workspace reconciliation journal has duplicate paths`)}for(let e of[s,c])if(new Set(e).size!==e.length)throw Error(`Worker workspace reconciliation journal has duplicate directories`);return{version:1,temporaryNonce:n.temporaryNonce,baseManifestRef:n.baseManifestRef,currentManifestRef:n.currentManifestRef,baseEntries:a,appliedEntries:o,baseDirectories:s,appliedDirectories:c,appliedManifestRef:n.appliedManifestRef,baseTree:n.baseTree,basePackSha256:n.basePackSha256}}var j,M,N,P,F,I;function init_workspace_manifest(){return(init_workspace_manifest=e((()=>{init_staged_inputs(),init_workspace_inventory_limits(),init_workspace_path_exclusions(),j=p*2,M=67108864,N=805306368,P=268435456,F=/^sha256:([a-f0-9]{64})$/u,I=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u})))()}export{init_workspace_inventory_limits as C,d as D,init_staged_inputs as E,f as O,g as S,createStagedInputPathMatcher as T,workspacePathAncestors as _,gitFileMode as a,h as b,parseWorkerWorkspaceReconciliationPlan as c,A as d,init_workspace_path_exclusions as f,init_workspace_path_ancestors as g,x as h,N as i,serializeWorkerWorkspaceManifest as l,init_sandbox_workspace_paths as m,M as n,init_workspace_manifest as o,k as p,P as r,parseWorkerWorkspaceManifest as s,j as t,O as u,m as v,o as w,_ as x,p as y};