import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,i as n,s as r,u as i}from"./worker-chunk-DUoRUj-3.mjs";import{i as a,n as o,t as s}from"./worker-chunk-CoypJMOT.mjs";import{n as c,o as l}from"./worker-chunk-BjbSxtLY.mjs";import u from"node:path";import{createHash as d}from"node:crypto";import{compileFunction as f}from"node:vm";function*workspacePathAncestors(e){for(let t=e.indexOf(`/`);t>=0;t=e.indexOf(`/`,t+1))yield e.slice(0,t)}var p=e((()=>{})),m,h,g,_,v,y,b,x,S,C,w=e((()=>{r(),a(),m=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`],h=[`.DS_Store`],g=[`.pyc`,`.pyo`],_=`openclaw-inbound-`,v=`[0-9a-f]`,y=_+[v.repeat(8),v.repeat(4),`4${v.repeat(3)}`,`[89ab]${v.repeat(3)}`,v.repeat(12)].join(`-`),b=`
${n}
${s}
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(m)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(h)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(g)};
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(${JSON.stringify(`^${y}$`)});
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
}`,x=f(`${b}\nreturn isDerivedWorkspacePath;`)(),S=[`/${o}`,...m,...h,...g.map(e=>`*${e}`),y],C=String.raw`
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
}`}));function manifestPath(e){if(typeof e!=`string`||!e||e.includes(`\\`)||u.posix.isAbsolute(e)||u.posix.normalize(e)!==e||e===`.`||e===`..`||e.startsWith(`../`))throw Error(`Worker workspace manifest contains an unsafe path`);return e}function manifestMode(e){if(!Number.isInteger(e)||e<0||e>511)throw Error(`Worker workspace manifest contains an invalid mode`);return e}function gitFileMode(e){return e&73?493:420}function compareManifestPaths(e,t){return e.path<t.path?-1:+(e.path>t.path)}function parseRawEntry(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`Worker workspace manifest contains an invalid entry`);let t=e,n=manifestPath(t.path),r=manifestMode(t.mode);if(t.type===`directory`)return{path:n,type:`directory`,mode:r};if(t.type===`file`){if(!Number.isSafeInteger(t.size)||t.size<0||typeof t.sha256!=`string`||!/^[a-f0-9]{64}$/u.test(t.sha256))throw Error(`Worker workspace manifest contains invalid file metadata`);return{path:n,type:`file`,mode:gitFileMode(r),size:t.size,sha256:t.sha256}}if(t.type===`symlink`){if(typeof t.target!=`string`||!t.target||t.target.includes(`\\`)||u.posix.isAbsolute(t.target)||u.win32.parse(t.target).root!==``)throw Error(`Worker workspace manifest contains an unsafe symlink`);let e=`/workspace`,r=u.posix.resolve(u.posix.dirname(`${e}/${n}`),t.target);if(r!==e&&!r.startsWith(`${e}/`))throw Error(`Worker workspace manifest symlink escapes its root`);return{path:n,type:`symlink`,mode:511,target:t.target}}throw Error(`Worker workspace manifest contains an unsupported entry type`)}function validateAndProjectEntries(e){if(e.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let n=e.map(parseRawEntry),r=i(n),a=``,o=0,s=0,c=/* @__PURE__ */ new Map;for(let e of n){if(c.has(e.path)||a&&a>=e.path)throw Error(`Worker workspace manifest paths are not unique and sorted`);for(let t of workspacePathAncestors(e.path))if(c.get(t)?.type!==`directory`)throw Error(`Worker workspace manifest entry has a non-directory parent`);if(o+=Buffer.byteLength(e.path),s+=e.type===`file`?e.size:e.type===`symlink`?Buffer.byteLength(e.target):0,o>67108864)throw Error(`Worker workspace manifest paths exceed their byte limit`);if(s>4294967296)throw Error(`Worker workspace manifest exceeds its eligible byte limit`);c.set(e.path,e),a=e.path}let l=n.filter(e=>!x(e.path,t(e.path,r)));return{entries:l.filter(e=>e.type!==`directory`),directories:l.filter(e=>e.type===`directory`).map(e=>e.path)}}function serializeWorkerWorkspaceManifest(e){let n=i(e.entries),r=[...(e.directories??[]).map(e=>({path:e,type:`directory`,mode:448})),...e.entries].filter(e=>!x(e.path,t(e.path,n))).toSorted(compareManifestPaths);if(r.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let a=0,o=0,s=0,c=Buffer.byteLength(JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:[]}));for(let e of r){if(a+=Buffer.byteLength(e.path),o+=e.type===`file`?e.size:e.type===`symlink`?Buffer.byteLength(e.target):0,s+=Buffer.byteLength(JSON.stringify(e)),a>67108864)throw Error(`Worker workspace manifest paths exceed their byte limit`);if(o>4294967296)throw Error(`Worker workspace manifest exceeds its eligible byte limit`);if(c+s+Math.max(0,r.length-1)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`)}return JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:r})}function parseWorkerWorkspaceManifest(e,t){if(Buffer.byteLength(e)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`);let n=k.exec(t);if(!n)throw Error(`Worker workspace manifest reference is invalid`);if(d(`sha256`).update(e).digest(`hex`)!==n[1])throw Error(`Worker workspace manifest digest does not match its reference`);let r=JSON.parse(e);if(!r||typeof r!=`object`||Array.isArray(r))throw Error(`Worker workspace manifest is invalid`);let i=r;if(i.version!==1||i.baseCommit!==null&&(typeof i.baseCommit!=`string`||!A.test(i.baseCommit))||!Array.isArray(i.entries))throw Error(`Worker workspace manifest has an unsupported shape`);return{version:1,baseCommit:i.baseCommit,...validateAndProjectEntries(i.entries)}}function parseJournalEntry(e){let t=parseRawEntry(e);if(t.type===`directory`)throw Error(`Worker workspace reconciliation journal contains a directory entry`);return t}function serializeWorkerWorkspaceReconciliationPlan(e){return JSON.stringify({version:e.version,temporaryNonce:e.temporaryNonce,baseManifestRef:e.baseManifestRef,currentManifestRef:e.currentManifestRef,baseEntries:e.baseEntries,appliedEntries:e.appliedEntries,baseDirectories:e.baseDirectories??[],appliedDirectories:e.appliedDirectories??[],appliedManifestRef:e.appliedManifestRef,baseTree:e.baseTree,basePackSha256:e.basePackSha256})}function parseWorkerWorkspaceReconciliationPlan(e){let t=JSON.parse(e);if(!t||typeof t!=`object`||Array.isArray(t))throw Error(`Worker workspace reconciliation journal is invalid`);let n=t;if(n.version!==1||typeof n.temporaryNonce!=`string`||!/^[a-f0-9]{32}$/u.test(n.temporaryNonce)||typeof n.baseManifestRef!=`string`||!k.test(n.baseManifestRef)||typeof n.currentManifestRef!=`string`||!k.test(n.currentManifestRef)||typeof n.baseTree!=`string`||!/^[a-f0-9]{40}$/u.test(n.baseTree)||typeof n.basePackSha256!=`string`||!/^[a-f0-9]{64}$/u.test(n.basePackSha256)||!Array.isArray(n.baseEntries)||!Array.isArray(n.appliedEntries)||n.baseDirectories!==void 0&&!Array.isArray(n.baseDirectories)||n.appliedDirectories!==void 0&&!Array.isArray(n.appliedDirectories)||n.appliedManifestRef!==void 0&&(typeof n.appliedManifestRef!=`string`||!k.test(n.appliedManifestRef))||n.baseEntries.length+n.appliedEntries.length+(n.baseDirectories?.length??0)+(n.appliedDirectories?.length??0)>T)throw Error(`Worker workspace reconciliation journal has an unsupported shape`);let r=n.baseEntries.map(parseJournalEntry),i=n.appliedEntries.map(parseJournalEntry),a=(n.baseDirectories??[]).map(manifestPath),o=(n.appliedDirectories??[]).map(manifestPath);for(let e of[r,i]){let t=e.map(e=>e.path);if(new Set(t).size!==t.length)throw Error(`Worker workspace reconciliation journal has duplicate paths`)}for(let e of[a,o])if(new Set(e).size!==e.length)throw Error(`Worker workspace reconciliation journal has duplicate directories`);return{version:1,temporaryNonce:n.temporaryNonce,baseManifestRef:n.baseManifestRef,currentManifestRef:n.currentManifestRef,baseEntries:r,appliedEntries:i,baseDirectories:a,appliedDirectories:o,appliedManifestRef:n.appliedManifestRef,baseTree:n.baseTree,basePackSha256:n.basePackSha256}}var T,E,D,O,k,A,j=e((()=>{r(),l(),p(),w(),T=c*2,E=67108864,D=805306368,O=268435456,k=/^sha256:([a-f0-9]{64})$/u,A=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u}));export{x as _,gitFileMode as a,parseWorkerWorkspaceReconciliationPlan as c,S as d,y as f,w as g,C as h,D as i,serializeWorkerWorkspaceManifest as l,b as m,E as n,j as o,_ as p,O as r,parseWorkerWorkspaceManifest as s,T as t,serializeWorkerWorkspaceReconciliationPlan as u,p as v,workspacePathAncestors as y};