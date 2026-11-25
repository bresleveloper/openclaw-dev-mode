import{a as e}from"./git-operation.worker-fs-safe-2XqdJR5K.mjs";import{i as t}from"./git-operation.worker-record-coerce-BUlpHiHI.mjs";import{W as n}from"./git-operation.worker-git-XMicPiS-.mjs";import{a as r,c as i,i as a,n as o,s,t as c,y as l}from"./git-operation.worker-workspace-manifest-BVX59ZzQ.mjs";import{r as u}from"./git-operation.worker-workspace-actual-manifest-DjlLc3qv.mjs";import{i as d}from"./git-operation.worker-workspace-manifest-comparison-B7m6Kaa2.mjs";import{absoluteEntryMatches as f,localPath as p,readWorkspaceTreeFile as m}from"./git-operation.worker-workspace-reconcile-fs-BFwF4wO0.mjs";import{a as h,i as g,t as _}from"./git-operation.worker-workspace-result-inventory-BcwQoY1w.mjs";import v from"node:path";import{createHash as y}from"node:crypto";const b=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`];function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}const x={worktreeConfigArgs:b,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(b.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
if (worktreeConfig.error || worktreeConfig.status !== 0) {
  throw new Error("Publication workspace has unsupported Git transport configuration");
}
// Git rejects --worktree on linked checkouts unless the separate config is enabled.
if (worktreeConfig.stdout.toString("utf8").trim() === "true") scopes.push("--worktree");
for (const scope of scopes) {
  const result = spawnSync("git", ["config", scope, "--includes", "--get-regexp",
    ${JSON.stringify(githubPublicationUnsafeConfigArgs(`--local`).at(-1))}], {
    cwd, env, timeout: 60000, maxBuffer: 128 * 1024,
  });
  if (result.error || result.status !== 1 || result.stdout.length) {
    throw new Error("Publication workspace has unsupported Git transport configuration");
  }
}
`},S=/^[a-f0-9]{40}$/u;String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${o};
const maxTotal = ${a};
const maxEntries = ${c};
const objectPattern = /^[a-f0-9]{40}$/;
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  ${JSON.stringify(n()).slice(1,-1)} };
function git(args, options = {}) {
  const result = spawnSync("git", ["-c", "core.hooksPath=" + gitNullPath, "-c",
    "core.fsmonitor=false", "-c", "core.attributesFile=" + gitNullPath, ...args], {
    cwd, env, timeout: 60000, maxBuffer: maxFile + 1, ...options,
  });
  if (result.error || result.status !== 0) throw new Error("Publication snapshot Git command failed");
  return result.stdout;
}
function text(args) { return git(args).toString("utf8").trim(); }
function noFilters(raw) {
  for (const line of raw.toString("latin1").split(/\r?\n/)) {
    const fields = line.trimStart().split(/[\t ]+/);
    if (fields[0] && !fields[0].startsWith("#") &&
      fields.slice(1).some((field) => /^(?:-|!)?filter(?:=|$)/.test(field))) {
      throw new Error("Publication snapshot uses an unsupported Git clean filter");
    }
  }
}
if (!objectPattern.test(baseCommit)) throw new Error("Publication snapshot base commit is invalid");
const relativeOutput = path.relative(path.resolve(cwd), path.resolve(output));
if (!relativeOutput.startsWith(".." + path.sep) && !path.isAbsolute(relativeOutput)) {
  throw new Error("Publication snapshot output must be outside the workspace");
}
${x.script}
if (text(["for-each-ref", "--count=1", "--format=%(refname)", "refs/replace"])) {
  throw new Error("Publication snapshot has unsupported Git replacement metadata");
}
for (const name of ["info/grafts", "info/attributes"]) {
  const file = path.resolve(cwd, text(["rev-parse", "--git-path", name]));
  if (!fs.existsSync(file)) continue;
  const bytes = fs.readFileSync(file);
  if (name === "info/grafts" && bytes.length) throw new Error("Publication snapshot has Git grafts");
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
    if (++attributeCount > 1024) throw new Error("Publication snapshot has too many attribute files");
    noFilters(git(["cat-file", "blob", entry.slice(0, tab).split(" ")[2]]));
  }
  const raw = git(["diff-tree", "--no-commit-id", "--raw", "-r", "-z", "--no-renames", baseTree, workspaceTree]);
  const decoded = raw.toString("utf8");
  if (!Buffer.from(decoded, "utf8").equals(raw)) throw new Error("Publication snapshot paths must be UTF-8");
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
      (sha !== null && !objectPattern.test(sha))) throw new Error("Publication snapshot entry is invalid");
    entries.push({ path: fields[i + 1], mode, sha });
    if (entries.length > maxEntries) throw new Error("Publication snapshot has too many changes");
    if (!sha || mode === "160000" || blobs.has(sha)) continue;
    const size = Number(text(["cat-file", "-s", sha]));
    if (!Number.isSafeInteger(size) || size < 0 || size > maxFile || total + size > maxTotal) {
      throw new Error("Publication snapshot exceeds its byte budget");
    }
    const bytes = git(["cat-file", "blob", sha]);
    if (bytes.length !== size) throw new Error("Publication snapshot blob changed");
    total += size;
    fs.writeFileSync(path.join(output, "blobs", sha), bytes, { mode: 0o600, flag: "wx" });
    blobs.add(sha);
  }
  const snapshot = JSON.stringify({ version: 1, baseCommit, baseTree, workspaceTree, entries });
  fs.writeFileSync(path.join(output, "snapshot.json"), snapshot, { mode: 0o600, flag: "wx" });
  process.stdout.write("sha256:" + crypto.createHash("sha256").update(snapshot).digest("hex"));
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
`;function parseGitHubRepositoryPublicationSnapshot(e,n){if(Buffer.byteLength(e)>67108864||`sha256:`+y(`sha256`).update(e).digest(`hex`)!==n)throw Error(`GitHub publication checkpoint digest changed.`);let r=JSON.parse(e);if(!t(r)||r.version!==1||typeof r.baseCommit!=`string`||!S.test(r.baseCommit)||typeof r.baseTree!=`string`||!S.test(r.baseTree)||typeof r.workspaceTree!=`string`||!S.test(r.workspaceTree)||!Array.isArray(r.entries)||r.entries.length>c)throw Error(`GitHub publication checkpoint is invalid.`);let i=/* @__PURE__ */ new Set,a=r.entries.map(e=>{if(!t(e)||typeof e.path!=`string`||!e.path||e.path.includes(`\\`)||e.path.includes(`\0`)||v.posix.isAbsolute(e.path)||v.posix.normalize(e.path)!==e.path||e.path===`.`||e.path===`..`||e.path.startsWith(`../`)||e.path.split(`/`).some(e=>e.toLowerCase()===`.git`)||i.has(e.path)||e.mode!==`100644`&&e.mode!==`100755`&&e.mode!==`120000`&&e.mode!==`160000`||e.sha!==null&&(typeof e.sha!=`string`||!S.test(e.sha)))throw Error(`GitHub publication checkpoint entry is invalid.`);return i.add(e.path),{path:e.path,mode:e.mode,sha:e.sha}});return{version:1,baseCommit:r.baseCommit,baseTree:r.baseTree,workspaceTree:r.workspaceTree,entries:a}}async function readPublicationFile(t,n){return(await e(t)).read(n,{maxBytes:o,symlinks:`reject`,hardlinks:`reject`})}async function readGitHubRepositoryPublicationBlob(e,t){if(!S.test(t))throw Error(`GitHub publication blob identity is invalid.`);let{buffer:n}=await readPublicationFile(e,`blobs/`+t);if(y(`sha1`).update(`blob `+n.length+`\0`).update(n).digest(`hex`)!==t)throw Error(`GitHub publication blob changed after checkpoint capture.`);return n}async function readWorkspaceGitEntry(e,t){let n=p(e,t.path);if(t.type===`symlink`){if(await f(n,t))return Buffer.from(t.target)}else{let e=await u(n,t.size);if(e.type===`file`&&e.size===t.size&&e.mode===t.mode&&e.sha256===t.sha256)return e.content}throw Error(`Cloud workspace snapshot is invalid: ${t.path}`)}function quoteFastImportPath(e){let t=Buffer.from(e),n=`"`;for(let e of t){if(e===0)throw Error(`Cloud workspace staged result path contains a null byte`);n+=e===34||e===92?`\\${String.fromCharCode(e)}`:e>=32&&e<127?String.fromCharCode(e):`\\${e.toString(8).padStart(3,`0`)}`}return`${n}"`}async function writeWorkspaceGitInput(t){let n=t.entries.toSorted((e,t)=>e.path.localeCompare(t.path));async function*chunks(){for(let[e,r]of n.entries()){if(t.existingObjects?.has(r.path))continue;let n=await t.readVerifiedContent(r);yield Buffer.from(`blob\nmark :${e+1}\ndata ${n.byteLength}\n`),yield n,yield Buffer.from(`
`)}yield Buffer.from(`commit ${t.ref}\nmark :${n.length+1}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${t.message?.byteLength??0}\n`),yield*t.message?.chunks??[],yield Buffer.from(`\n${t.parentCommit?`from ${t.parentCommit}\n`:``}deleteall\n`);for(let e=0;e<n.length;e+=256)yield Buffer.from(n.slice(e,e+256).map((n,r)=>`M ${n.type===`symlink`?`120000`:n.mode&73?`100755`:`100644`} ${t.existingObjects?.get(n.path)??`:${e+r+1}`} ${quoteFastImportPath(n.path)}\n`).join(``));yield Buffer.from(`\n${t.result===`tree`?`ls :${n.length+1} ""`:`get-mark :${n.length+1}`}\ndone\n`)}await(await e(v.dirname(t.inputPath))).create(v.basename(t.inputPath),chunks(),{assertBeforeMutation:t.assertBeforeMutation,mode:384,mkdir:!1,durable:!1,maxBytes:l*2})}const bufferView=e=>Buffer.from(e.buffer,e.byteOffset,e.byteLength);function stagedResultMessage(e){let t=bufferView(e.baseManifestRaw),n=bufferView(e.currentManifestRaw),r=Buffer.from(`${_}\nversion ${e.gitHistory?3:2}\nbase-ref ${e.baseManifestRef}\ncurrent-ref ${e.currentManifestRef}\nbase-bytes ${t.byteLength}\ncurrent-bytes ${n.byteLength}\n${e.gitHistory?`git-history ${JSON.stringify(e.gitHistory)}\n`:``}\n`);return{chunks:[r,t,n],byteLength:r.byteLength+t.byteLength+n.byteLength}}const sha256=e=>y(`sha256`).update(e).digest(`hex`);async function publicationStageSource(e,t){let{publication:n,stagingRoot:r}=e,a=bufferView(n.metadata),o=parseGitHubRepositoryPublicationSnapshot(a.toString(`utf8`),n.publicationDigest);if(o.baseCommit!==n.baseCommit)throw Error(`Repository publication checkpoint base changed`);let s=/* @__PURE__ */ new Map([[`snapshot.json`,a],[`binding.json`,Buffer.from(JSON.stringify({currentManifestRef:n.currentManifestRef,publicationDigest:n.publicationDigest}))]]),file=(e,t)=>({path:e,type:`file`,mode:420,size:t.byteLength,sha256:sha256(t)}),c=Array.from(s,([e,t])=>file(e,t)),l=new Set(o.entries.flatMap(e=>e.sha&&e.mode!==`160000`?[e.sha]:[])),u=a.byteLength;for(let e of l){t?.();let n=await readGitHubRepositoryPublicationBlob(r,e);if(t?.(),u+=n.byteLength,u>805306368)throw Error(`Repository publication checkpoint exceeds its byte budget`);c.push(file(`blobs/${e}`,n))}let manifestBytes=(e,t=[])=>new TextEncoder().encode(i({version:1,baseCommit:null,directories:t,entries:e})),d=manifestBytes([]),f=manifestBytes(c,[`blobs`]);return{baseManifestRaw:d,currentManifestRaw:f,baseManifestRef:`sha256:${sha256(d)}`,currentManifestRef:`sha256:${sha256(f)}`,readVerifiedContent:async e=>{let t=s.get(e.path)??await readGitHubRepositoryPublicationBlob(r,e.path.slice(6));if(e.type!==`file`||t.byteLength!==e.size||sha256(t)!==e.sha256)throw Error(`Repository publication blob changed during preparation`);return t}}}async function buildWorkspaceStageInput(e,t){let n=h(e.stagedResultRef),i=`publication`in e?await publicationStageSource(e,t):{...e,readVerifiedContent:async t=>await readWorkspaceGitEntry(e.stagingRoot,t).catch(e=>{throw Error(`Cloud workspace staged payload is invalid: ${t.path}`,{cause:e})})},a=s(bufferView(i.baseManifestRaw).toString(`utf8`),i.baseManifestRef,e.buildCacheInputs),o;try{o=s(bufferView(i.currentManifestRaw).toString(`utf8`),i.currentManifestRef,e.buildCacheInputs)}catch(e){throw e instanceof r?new g(e.message,{cause:e}):e}let c=d(a,o);return await writeWorkspaceGitInput({assertBeforeMutation:t,inputPath:e.inputPath,ref:n,entries:c.entries,existingObjects:`publication`in e?void 0:new Map(e.existingObjects),message:stagedResultMessage({...i,gitHistory:e.gitHistory}),parentCommit:e.parentCommit??(e.gitHistory?.descendsFromBase&&!e.gitHistory.unavailableReason?e.gitHistory.headCommit:void 0),readVerifiedContent:i.readVerifiedContent}),null}async function buildWorkspaceTreeInput(e,t){let n=e.source;return await writeWorkspaceGitInput({...e,result:`tree`,assertBeforeMutation:t,readVerifiedContent:async e=>n.tree===void 0?await readWorkspaceGitEntry(n.root,e):e.type===`file`?await m({repositoryRoot:n.root,tree:n.tree,entry:e}):Buffer.from(e.target)}),null}export{buildWorkspaceStageInput,buildWorkspaceTreeInput};