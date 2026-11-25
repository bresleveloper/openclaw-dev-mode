import{n as e}from"./worker-chunk-DyeIuPEC.mjs";import{n as t,r as n}from"./worker-chunk-Bwdak6BW.mjs";import{o as r}from"./worker-chunk-NJiGoVJN.mjs";import{a as i,c as a,g as o,i as s,n as c,p as l,s as u,t as d,u as f}from"./worker-chunk-BauTQuY5.mjs";import{c as p,s as m}from"./worker-chunk-D1maHJSe.mjs";import{i as h,o as g,r as _,t as v}from"./worker-chunk-CHgZj9-t.mjs";import{r as y,t as b}from"./worker-chunk-Mq1m_UGj.mjs";import{a as x,r as S}from"./worker-chunk-rUpsvDnB.mjs";import{a as C,i as w,o as T,t as E}from"./worker-chunk-C1DKqIq0.mjs";import D from"node:path";import{createHash as O}from"node:crypto";function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}var k,A;function init_github_publication_base(){return(init_github_publication_base=e((()=>{k=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`],A={worktreeConfigArgs:k,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(k.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
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
`}})))()}function parseGitHubRepositoryPublicationSnapshot(e,t){if(Buffer.byteLength(e)>67108864||`sha256:`+O(`sha256`).update(e).digest(`hex`)!==t)throw Error(`GitHub publication checkpoint digest changed.`);let n=JSON.parse(e);if(!r(n)||n.version!==1||typeof n.baseCommit!=`string`||!j.test(n.baseCommit)||typeof n.baseTree!=`string`||!j.test(n.baseTree)||typeof n.workspaceTree!=`string`||!j.test(n.workspaceTree)||!Array.isArray(n.entries)||n.entries.length>d)throw Error(`GitHub publication checkpoint is invalid.`);let i=/* @__PURE__ */ new Set,a=n.entries.map(e=>{if(!r(e)||typeof e.path!=`string`||!e.path||e.path.includes(`\\`)||e.path.includes(`\0`)||D.posix.isAbsolute(e.path)||D.posix.normalize(e.path)!==e.path||e.path===`.`||e.path===`..`||e.path.startsWith(`../`)||e.path.split(`/`).some(e=>e.toLowerCase()===`.git`)||i.has(e.path)||e.mode!==`100644`&&e.mode!==`100755`&&e.mode!==`120000`&&e.mode!==`160000`||e.sha!==null&&(typeof e.sha!=`string`||!j.test(e.sha)))throw Error(`GitHub publication checkpoint entry is invalid.`);return i.add(e.path),{path:e.path,mode:e.mode,sha:e.sha}});return{version:1,baseCommit:n.baseCommit,baseTree:n.baseTree,workspaceTree:n.workspaceTree,entries:a}}async function readPublicationFile(e,t){return(await n(e)).read(t,{maxBytes:c,symlinks:`reject`,hardlinks:`reject`})}async function readGitHubRepositoryPublicationBlob(e,t){if(!j.test(t))throw Error(`GitHub publication blob identity is invalid.`);let{buffer:n}=await readPublicationFile(e,`blobs/`+t);if(O(`sha1`).update(`blob `+n.length+`\0`).update(n).digest(`hex`)!==t)throw Error(`GitHub publication blob changed after checkpoint capture.`);return n}var j;function init_github_repository_publication_snapshot(){return(init_github_repository_publication_snapshot=e((()=>{t(),p(),init_github_publication_base(),u(),j=/^[a-f0-9]{40}$/u,String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${c};
const maxTotal = ${s};
const maxEntries = ${d};
const objectPattern = /^[a-f0-9]{40}$/;
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  ${JSON.stringify(m()).slice(1,-1)} };
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
${A.script}
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
`})))()}async function readWorkspaceGitEntry(e,t){let n=h(e,t.path);if(t.type===`symlink`){if(await v(n,t))return Buffer.from(t.target)}else{let e=await y(n,t.size);if(e.type===`file`&&e.size===t.size&&e.mode===t.mode&&e.sha256===t.sha256)return e.content}throw Error(`Cloud workspace snapshot is invalid: ${t.path}`)}function quoteFastImportPath(e){let t=Buffer.from(e),n=`"`;for(let e of t){if(e===0)throw Error(`Cloud workspace staged result path contains a null byte`);n+=e===34||e===92?`\\${String.fromCharCode(e)}`:e>=32&&e<127?String.fromCharCode(e):`\\${e.toString(8).padStart(3,`0`)}`}return`${n}"`}async function writeWorkspaceGitInput(e){let t=e.entries.toSorted((e,t)=>e.path.localeCompare(t.path));async function*chunks(){for(let[n,r]of t.entries()){if(e.existingObjects?.has(r.path))continue;let t=await e.readVerifiedContent(r);yield Buffer.from(`blob\nmark :${n+1}\ndata ${t.byteLength}\n`),yield t,yield Buffer.from(`
`)}yield Buffer.from(`commit ${e.ref}\nmark :${t.length+1}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${e.message?.byteLength??0}\n`),yield*e.message?.chunks??[],yield Buffer.from(`\n${e.parentCommit?`from ${e.parentCommit}\n`:``}deleteall\n`);for(let n=0;n<t.length;n+=256)yield Buffer.from(t.slice(n,n+256).map((t,r)=>`M ${t.type===`symlink`?`120000`:t.mode&73?`100755`:`100644`} ${e.existingObjects?.get(t.path)??`:${n+r+1}`} ${quoteFastImportPath(t.path)}\n`).join(``));yield Buffer.from(`\n${e.result===`tree`?`ls :${t.length+1} ""`:`get-mark :${t.length+1}`}\ndone\n`)}await(await n(D.dirname(e.inputPath))).create(D.basename(e.inputPath),chunks(),{assertBeforeMutation:e.assertBeforeMutation,mode:384,mkdir:!1,durable:!1,maxBytes:l*2})}function init_workspace_git_input(){return(init_workspace_git_input=e((()=>{t(),b(),o(),_()})))()}function stagedResultMessage(e){let t=bufferView(e.baseManifestRaw),n=bufferView(e.currentManifestRaw),r=Buffer.from(`${E}\nversion ${e.gitHistory?3:2}\nbase-ref ${e.baseManifestRef}\ncurrent-ref ${e.currentManifestRef}\nbase-bytes ${t.byteLength}\ncurrent-bytes ${n.byteLength}\n${e.gitHistory?`git-history ${JSON.stringify(e.gitHistory)}\n`:``}\n`);return{chunks:[r,t,n],byteLength:r.byteLength+t.byteLength+n.byteLength}}async function publicationStageSource(e,t){let{publication:n,stagingRoot:r}=e,i=bufferView(n.metadata),a=parseGitHubRepositoryPublicationSnapshot(i.toString(`utf8`),n.publicationDigest);if(a.baseCommit!==n.baseCommit)throw Error(`Repository publication checkpoint base changed`);let o=/* @__PURE__ */ new Map([[`snapshot.json`,i],[`binding.json`,Buffer.from(JSON.stringify({currentManifestRef:n.currentManifestRef,publicationDigest:n.publicationDigest}))]]),file=(e,t)=>({path:e,type:`file`,mode:420,size:t.byteLength,sha256:sha256(t)}),s=Array.from(o,([e,t])=>file(e,t)),c=new Set(a.entries.flatMap(e=>e.sha&&e.mode!==`160000`?[e.sha]:[])),l=i.byteLength;for(let e of c){t?.();let n=await readGitHubRepositoryPublicationBlob(r,e);if(t?.(),l+=n.byteLength,l>805306368)throw Error(`Repository publication checkpoint exceeds its byte budget`);s.push(file(`blobs/${e}`,n))}let manifestBytes=(e,t=[])=>new TextEncoder().encode(f({version:1,baseCommit:null,directories:t,entries:e})),u=manifestBytes([]),d=manifestBytes(s,[`blobs`]);return{baseManifestRaw:u,currentManifestRaw:d,baseManifestRef:`sha256:${sha256(u)}`,currentManifestRef:`sha256:${sha256(d)}`,readVerifiedContent:async e=>{let t=o.get(e.path)??await readGitHubRepositoryPublicationBlob(r,e.path.slice(6));if(e.type!==`file`||t.byteLength!==e.size||sha256(t)!==e.sha256)throw Error(`Repository publication blob changed during preparation`);return t}}}async function buildWorkspaceStageInput(e,t){let n=T(e.stagedResultRef),r=`publication`in e?await publicationStageSource(e,t):{...e,readVerifiedContent:async t=>await readWorkspaceGitEntry(e.stagingRoot,t).catch(e=>{throw Error(`Cloud workspace staged payload is invalid: ${t.path}`,{cause:e})})},o=a(bufferView(r.baseManifestRaw).toString(`utf8`),r.baseManifestRef,e.buildCacheInputs),s;try{s=a(bufferView(r.currentManifestRaw).toString(`utf8`),r.currentManifestRef,e.buildCacheInputs)}catch(e){throw e instanceof i?new w(e.message,{cause:e}):e}let c=x(o,s);return await writeWorkspaceGitInput({assertBeforeMutation:t,inputPath:e.inputPath,ref:n,entries:c.entries,existingObjects:`publication`in e?void 0:new Map(e.existingObjects),message:stagedResultMessage({...r,gitHistory:e.gitHistory}),parentCommit:e.parentCommit??(e.gitHistory?.descendsFromBase&&!e.gitHistory.unavailableReason?e.gitHistory.headCommit:void 0),readVerifiedContent:r.readVerifiedContent}),null}async function buildWorkspaceTreeInput(e,t){let n=e.source;return await writeWorkspaceGitInput({...e,result:`tree`,assertBeforeMutation:t,readVerifiedContent:async e=>n.tree===void 0?await readWorkspaceGitEntry(n.root,e):e.type===`file`?await g({repositoryRoot:n.root,tree:n.tree,entry:e}):Buffer.from(e.target)}),null}var bufferView,sha256;function init_workspace_result_preparation_runtime(){return(init_workspace_result_preparation_runtime=e((()=>{init_github_repository_publication_snapshot(),init_workspace_git_input(),S(),u(),_(),C(),bufferView=e=>Buffer.from(e.buffer,e.byteOffset,e.byteLength),sha256=e=>O(`sha256`).update(e).digest(`hex`)})))()}init_workspace_result_preparation_runtime();export{buildWorkspaceStageInput,buildWorkspaceTreeInput};