import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,l as n}from"./worker-chunk-D-pM6VZQ.mjs";import{c as r,i,s as a,u as o}from"./worker-chunk-BlSriebv.mjs";import{i as s,n as c,t as l}from"./worker-chunk-CoypJMOT.mjs";import{n as u,o as d}from"./worker-chunk-BjbSxtLY.mjs";import f from"node:path";import{createHash as p}from"node:crypto";import{compileFunction as m}from"node:vm";function*workspacePathAncestors(e){for(let t=e.indexOf(`/`);t>=0;t=e.indexOf(`/`,t+1))yield e.slice(0,t)}var h=e((()=>{})),g,_,v,y,b,x,S,C,w,T,E=e((()=>{a(),s(),g=[`__pycache__`,`.pytest_cache`,`.mypy_cache`,`.ruff_cache`,`node_modules`],_=[`.DS_Store`],v=[`.pyc`,`.pyo`],y=`openclaw-inbound-`,b=`[0-9a-f]`,x=y+[b.repeat(8),b.repeat(4),`4${b.repeat(3)}`,`[89ab]${b.repeat(3)}`,b.repeat(12)].join(`-`),S=`
${i}
${l}
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(g)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(_)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(v)};
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(${JSON.stringify(`^${x}$`)});
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
}`,C=m(`${S}\nreturn isDerivedWorkspacePath;`)(),w=[`/${c}`,...g,..._,...v.map(e=>`*${e}`),x],T=String.raw`
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
}`}));function manifestPath(e){if(typeof e!=`string`||!e||e.includes(`\\`)||f.posix.isAbsolute(e)||f.posix.normalize(e)!==e||e===`.`||e===`..`||e.startsWith(`../`))throw Error(`Worker workspace manifest contains an unsafe path`);return e}function manifestMode(e){if(typeof e!=`number`||!Number.isInteger(e)||e<0||e>511)throw Error(`Worker workspace manifest contains an invalid mode`);return e}function gitFileMode(e){return e&73?493:420}function compareManifestPaths(e,t){return e.path<t.path?-1:+(e.path>t.path)}function createManifestBudget(){let e=0,t=0;return n=>{if(e+=Buffer.byteLength(n.path),t+=n.type===`file`?n.size:n.type===`symlink`?Buffer.byteLength(n.target):0,e>67108864)throw Error(`Worker workspace manifest paths exceed their byte limit`);if(t>4294967296)throw Error(`Worker workspace manifest exceeds its eligible byte limit`)}}function parseRawEntry(e){if(!n(e))throw Error(`Worker workspace manifest contains an invalid entry`);let t=manifestPath(e.path),r=manifestMode(e.mode);if(e.type===`directory`)return{path:t,type:`directory`,mode:r};if(e.type===`file`){if(typeof e.size!=`number`||!Number.isSafeInteger(e.size)||e.size<0||typeof e.sha256!=`string`||!/^[a-f0-9]{64}$/u.test(e.sha256))throw Error(`Worker workspace manifest contains invalid file metadata`);return{path:t,type:`file`,mode:gitFileMode(r),size:e.size,sha256:e.sha256}}if(e.type===`symlink`){if(typeof e.target!=`string`||!e.target||e.target.includes(`\\`)||f.posix.isAbsolute(e.target)||f.win32.parse(e.target).root!==``)throw Error(`Worker workspace manifest contains an unsafe symlink`);let n=`/workspace`,r=f.posix.resolve(f.posix.dirname(`${n}/${t}`),e.target);if(r!==n&&!r.startsWith(`${n}/`))throw Error(`Worker workspace manifest symlink escapes its root`);return{path:t,type:`symlink`,mode:511,target:e.target}}throw Error(`Worker workspace manifest contains an unsupported entry type`)}function validateAndProjectEntries(e){if(e.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let t=e.map(parseRawEntry),n=o(t),i=``,a=createManifestBudget(),s=/* @__PURE__ */ new Map;for(let e of t){if(i>=e.path)throw Error(`Worker workspace manifest paths are not unique and sorted`);for(let t of workspacePathAncestors(e.path))if(s.get(t)?.type!==`directory`)throw Error(`Worker workspace manifest entry has a non-directory parent`);a(e),s.set(e.path,e),i=e.path}let c=t.filter(e=>!C(e.path,r(e.path,n)));return{entries:c.filter(e=>e.type!==`directory`),directories:c.filter(e=>e.type===`directory`).map(e=>e.path)}}function serializeWorkerWorkspaceManifest(e){let t=o(e.entries),n=[...(e.directories??[]).map(e=>({path:e,type:`directory`,mode:448})),...e.entries].filter(e=>!C(e.path,r(e.path,t))).toSorted(compareManifestPaths);if(n.length>25e4)throw Error(`Worker workspace manifest has too many entries`);let i=createManifestBudget(),a=0,s=Buffer.byteLength(JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:[]}));for(let e of n)if(a+=Buffer.byteLength(JSON.stringify(e)),i(e),s+a+Math.max(0,n.length-1)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`);return JSON.stringify({version:e.version,baseCommit:e.baseCommit,entries:n})}function parseWorkerWorkspaceManifest(e,t){if(Buffer.byteLength(e)>67108864)throw Error(`Worker workspace manifest exceeds the 64 MiB safety limit`);let r=j.exec(t);if(!r)throw Error(`Worker workspace manifest reference is invalid`);if(p(`sha256`).update(e).digest(`hex`)!==r[1])throw Error(`Worker workspace manifest digest does not match its reference`);let i=JSON.parse(e);if(!n(i))throw Error(`Worker workspace manifest is invalid`);if(i.version!==1||i.baseCommit!==null&&(typeof i.baseCommit!=`string`||!M.test(i.baseCommit))||!Array.isArray(i.entries))throw Error(`Worker workspace manifest has an unsupported shape`);return{version:1,baseCommit:i.baseCommit,...validateAndProjectEntries(i.entries)}}function parseJournalEntry(e){let t=parseRawEntry(e);if(t.type===`directory`)throw Error(`Worker workspace reconciliation journal contains a directory entry`);return t}function serializeWorkerWorkspaceReconciliationPlan(e){return JSON.stringify({version:e.version,temporaryNonce:e.temporaryNonce,baseManifestRef:e.baseManifestRef,currentManifestRef:e.currentManifestRef,baseEntries:e.baseEntries,appliedEntries:e.appliedEntries,baseDirectories:e.baseDirectories??[],appliedDirectories:e.appliedDirectories??[],appliedManifestRef:e.appliedManifestRef,baseTree:e.baseTree,basePackSha256:e.basePackSha256})}function parseWorkerWorkspaceReconciliationPlan(e){let t=JSON.parse(e);if(!n(t))throw Error(`Worker workspace reconciliation journal is invalid`);let{baseDirectories:r=[],appliedDirectories:i=[]}=t;if(t.version!==1||typeof t.temporaryNonce!=`string`||!/^[a-f0-9]{32}$/u.test(t.temporaryNonce)||typeof t.baseManifestRef!=`string`||!j.test(t.baseManifestRef)||typeof t.currentManifestRef!=`string`||!j.test(t.currentManifestRef)||typeof t.baseTree!=`string`||!/^[a-f0-9]{40}$/u.test(t.baseTree)||typeof t.basePackSha256!=`string`||!/^[a-f0-9]{64}$/u.test(t.basePackSha256)||!Array.isArray(t.baseEntries)||!Array.isArray(t.appliedEntries)||!Array.isArray(r)||!Array.isArray(i)||t.appliedManifestRef!==void 0&&(typeof t.appliedManifestRef!=`string`||!j.test(t.appliedManifestRef))||t.baseEntries.length+t.appliedEntries.length+r.length+i.length>D)throw Error(`Worker workspace reconciliation journal has an unsupported shape`);let a=t.baseEntries.map(parseJournalEntry),o=t.appliedEntries.map(parseJournalEntry),s=r.map(manifestPath),c=i.map(manifestPath);for(let e of[a,o]){let t=e.map(e=>e.path);if(new Set(t).size!==t.length)throw Error(`Worker workspace reconciliation journal has duplicate paths`)}for(let e of[s,c])if(new Set(e).size!==e.length)throw Error(`Worker workspace reconciliation journal has duplicate directories`);return{version:1,temporaryNonce:t.temporaryNonce,baseManifestRef:t.baseManifestRef,currentManifestRef:t.currentManifestRef,baseEntries:a,appliedEntries:o,baseDirectories:s,appliedDirectories:c,appliedManifestRef:t.appliedManifestRef,baseTree:t.baseTree,basePackSha256:t.basePackSha256}}var D,O,k,A,j,M,N=e((()=>{t(),a(),d(),h(),E(),D=u*2,O=67108864,k=805306368,A=268435456,j=/^sha256:([a-f0-9]{64})$/u,M=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u}));export{C as _,gitFileMode as a,parseWorkerWorkspaceReconciliationPlan as c,w as d,x as f,E as g,T as h,k as i,serializeWorkerWorkspaceManifest as l,S as m,O as n,N as o,y as p,A as r,parseWorkerWorkspaceManifest as s,D as t,serializeWorkerWorkspaceReconciliationPlan as u,h as v,workspacePathAncestors as y};