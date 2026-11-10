import{n as e}from"./worker-chunk-IQf3eJtA.mjs";import{n as t,t as n}from"./worker-chunk-auMwGu3N.mjs";import{o as r}from"./worker-chunk-BESy_QZo.mjs";import{C as i,i as a,l as o,n as s,o as c,s as l,t as u,x as d}from"./worker-chunk-CUy0jNr0.mjs";import{n as f,t as p}from"./worker-chunk-CchHhor-.mjs";import{a as m,r as h}from"./worker-chunk-CBXKordP.mjs";import{i as g,o as _,r as v,t as y}from"./worker-chunk-01N17aOE.mjs";import{i as b,r as x,t as S}from"./worker-chunk-vDRIQd5d.mjs";import C from"node:path";import{createHash as w}from"node:crypto";function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}var T,E;function init_github_publication_base(){return(init_github_publication_base=e((()=>{T=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`],E={worktreeConfigArgs:T,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(T.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
if (worktreeConfig.error || worktreeConfig.status !== 0) {
  throw Error("Publication workspace has unsupported Git transport configuration");
}
// Git rejects --worktree on linked checkouts unless the separate config is enabled.
if (worktreeConfig.stdout.toString("utf8").trim() === "true") scopes.push("--worktree");
for (const scope of scopes) {
  const result = spawnSync("git", ["config", scope, "--includes", "--get-regexp",
    ${JSON.stringify(githubPublicationUnsafeConfigArgs(`--local`).at(-1))}], {
    cwd, env, timeout: 60000, maxBuffer: 128 * 1024,
  });
  if (result.error || result.status !== 1 || result.stdout.length) {
    throw Error("Publication workspace has unsupported Git transport configuration");
  }
}
`}})))()}function parseGitHubRepositoryPublicationSnapshot(e,t){if(Buffer.byteLength(e)>67108864||`sha256:`+w(`sha256`).update(e).digest(`hex`)!==t)throw Error(`GitHub publication checkpoint digest changed.`);let n=JSON.parse(e);if(!r(n)||n.version!==1||typeof n.baseCommit!=`string`||!D.test(n.baseCommit)||typeof n.baseTree!=`string`||!D.test(n.baseTree)||typeof n.workspaceTree!=`string`||!D.test(n.workspaceTree)||!Array.isArray(n.entries)||n.entries.length>u)throw Error(`GitHub publication checkpoint is invalid.`);let i=/* @__PURE__ */ new Set,a=n.entries.map(e=>{if(!r(e)||typeof e.path!=`string`||!e.path||e.path.includes(`\\`)||e.path.includes(`\0`)||C.posix.isAbsolute(e.path)||C.posix.normalize(e.path)!==e.path||e.path===`.`||e.path===`..`||e.path.startsWith(`../`)||e.path.split(`/`).some(e=>e.toLowerCase()===`.git`)||i.has(e.path)||e.mode!==`100644`&&e.mode!==`100755`&&e.mode!==`120000`&&e.mode!==`160000`||e.sha!==null&&(typeof e.sha!=`string`||!D.test(e.sha)))throw Error(`GitHub publication checkpoint entry is invalid.`);return i.add(e.path),{path:e.path,mode:e.mode,sha:e.sha}});return{version:1,baseCommit:n.baseCommit,baseTree:n.baseTree,workspaceTree:n.workspaceTree,entries:a}}async function readPublicationFile(e,n){return(await t(e)).read(n,{maxBytes:s,symlinks:`reject`,hardlinks:`reject`})}async function readGitHubRepositoryPublicationBlob(e,t){if(!D.test(t))throw Error(`GitHub publication blob identity is invalid.`);let{buffer:n}=await readPublicationFile(e,`blobs/`+t);if(w(`sha1`).update(`blob `+n.length+`\0`).update(n).digest(`hex`)!==t)throw Error(`GitHub publication blob changed after checkpoint capture.`);return n}var D;function init_github_repository_publication_snapshot(){return(init_github_repository_publication_snapshot=e((()=>{n(),init_github_publication_base(),c(),D=/^[a-f0-9]{40}$/u,String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${s};
const maxTotal = ${a};
const maxEntries = ${u};
const objectPattern = /^[a-f0-9]{40}$/;
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  GIT_CONFIG_COUNT: "0" };
function git(args, options = {}) {
  const result = spawnSync("git", ["-c", "core.hooksPath=" + gitNullPath, "-c",
    "core.fsmonitor=false", "-c", "core.attributesFile=" + gitNullPath, ...args], {
    cwd, env, timeout: 60000, maxBuffer: maxFile + 1, ...options,
  });
  if (result.error || result.status !== 0) throw Error("Publication snapshot Git command failed");
  return result.stdout;
}
function text(args) { return git(args).toString("utf8").trim(); }
function noFilters(raw) {
  for (const line of raw.toString("latin1").split(/\r?\n/)) {
    const fields = line.trimStart().split(/[\t ]+/);
    if (fields[0] && !fields[0].startsWith("#") &&
      fields.slice(1).some((field) => /^(?:-|!)?filter(?:=|$)/.test(field))) {
      throw Error("Publication snapshot uses an unsupported Git clean filter");
    }
  }
}
if (!objectPattern.test(baseCommit)) throw Error("Publication snapshot base commit is invalid");
const relativeOutput = path.relative(path.resolve(cwd), path.resolve(output));
if (!relativeOutput.startsWith(".." + path.sep) && !path.isAbsolute(relativeOutput)) {
  throw Error("Publication snapshot output must be outside the workspace");
}
${E.script}
if (text(["for-each-ref", "--count=1", "--format=%(refname)", "refs/replace"])) {
  throw Error("Publication snapshot has unsupported Git replacement metadata");
}
for (const name of ["info/grafts", "info/attributes"]) {
  const file = path.resolve(cwd, text(["rev-parse", "--git-path", name]));
  if (!fs.existsSync(file)) continue;
  const bytes = fs.readFileSync(file);
  if (name === "info/grafts" && bytes.length) throw Error("Publication snapshot has Git grafts");
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
    if (++attributeCount > 1024) throw Error("Publication snapshot has too many attribute files");
    noFilters(git(["cat-file", "blob", entry.slice(0, tab).split(" ")[2]]));
  }
  const raw = git(["diff-tree", "--no-commit-id", "--raw", "-r", "-z", "--no-renames", baseTree, workspaceTree]);
  const decoded = raw.toString("utf8");
  if (!Buffer.from(decoded, "utf8").equals(raw)) throw Error("Publication snapshot paths must be UTF-8");
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
      (sha !== null && !objectPattern.test(sha))) throw Error("Publication snapshot entry is invalid");
    entries.push({ path: fields[i + 1], mode, sha });
    if (entries.length > maxEntries) throw Error("Publication snapshot has too many changes");
    if (!sha || mode === "160000" || blobs.has(sha)) continue;
    const size = Number(text(["cat-file", "-s", sha]));
    if (!Number.isSafeInteger(size) || size < 0 || size > maxFile || total + size > maxTotal) {
      throw Error("Publication snapshot exceeds its byte budget");
    }
    const bytes = git(["cat-file", "blob", sha]);
    if (bytes.length !== size) throw Error("Publication snapshot blob changed");
    total += size;
    fs.writeFileSync(path.join(output, "blobs", sha), bytes, { mode: 0o600, flag: "wx" });
    blobs.add(sha);
  }
  const snapshot = JSON.stringify({ version: 1, baseCommit, baseTree, workspaceTree, entries });
  fs.writeFileSync(path.join(output, "snapshot.json"), snapshot, { mode: 0o600, flag: "wx" });
  process.stdout.write("sha256:" + crypto.createHash("sha256").update(snapshot).digest("hex"));
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
`})))()}async function readWorkspaceGitEntry(e,t){let n=g(e,t.path);if(t.type===`symlink`){if(await y(n,t))return Buffer.from(t.target)}else{let e=await f(n,t.size);if(e.type===`file`&&e.size===t.size&&e.mode===t.mode&&e.sha256===t.sha256)return e.content}throw Error(`Cloud workspace snapshot is invalid: ${t.path}`)}function quoteFastImportPath(e){let t=Buffer.from(e),n=`"`;for(let e of t){if(e===0)throw Error(`Cloud workspace staged result path contains a null byte`);n+=e===34||e===92?`\\${String.fromCharCode(e)}`:e>=32&&e<127?String.fromCharCode(e):`\\${e.toString(8).padStart(3,`0`)}`}return`${n}"`}async function writeWorkspaceGitInput(e){let n=e.entries.toSorted((e,t)=>e.path.localeCompare(t.path));async function*chunks(){for(let[t,r]of n.entries()){let n=await e.readVerifiedContent(r);yield Buffer.from(`blob\nmark :${t+1}\ndata ${n.byteLength}\n`),yield n,yield Buffer.from(`
`)}yield Buffer.from(`commit ${e.ref}\nmark :${n.length+1}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${e.message?.byteLength??0}\n`),yield*e.message?.chunks??[],yield Buffer.from(`
deleteall
`);for(let e=0;e<n.length;e+=256)yield Buffer.from(n.slice(e,e+256).map((t,n)=>`M ${t.type===`symlink`?`120000`:t.mode&73?`100755`:`100644`} :${e+n+1} ${quoteFastImportPath(t.path)}\n`).join(``));yield Buffer.from(`\nget-mark :${n.length+1}\ndone\n`)}await(await t(C.dirname(e.inputPath))).create(C.basename(e.inputPath),chunks(),{assertBeforeMutation:e.assertBeforeMutation,mode:384,mkdir:!1,durable:!1,maxBytes:d*2})}function init_workspace_git_input(){return(init_workspace_git_input=e((()=>{n(),p(),i(),v()})))()}function stagedResultMessage(e){let t=bufferView(e.baseManifestRaw),n=bufferView(e.currentManifestRaw),r=Buffer.from(`${S}\nversion 2\nbase-ref ${e.baseManifestRef}\ncurrent-ref ${e.currentManifestRef}\nbase-bytes ${t.byteLength}\ncurrent-bytes ${n.byteLength}\n\n`);return{chunks:[r,t,n],byteLength:r.byteLength+t.byteLength+n.byteLength}}async function publicationStageSource(e,t){let{publication:n,stagingRoot:r}=e,i=bufferView(n.metadata),a=parseGitHubRepositoryPublicationSnapshot(i.toString(`utf8`),n.publicationDigest);if(a.baseCommit!==n.baseCommit)throw Error(`Repository publication checkpoint base changed`);let s=/* @__PURE__ */ new Map([[`snapshot.json`,i],[`binding.json`,Buffer.from(JSON.stringify({currentManifestRef:n.currentManifestRef,publicationDigest:n.publicationDigest}))]]),file=(e,t)=>({path:e,type:`file`,mode:420,size:t.byteLength,sha256:sha256(t)}),c=[...s].map(([e,t])=>file(e,t)),l=new Set(a.entries.flatMap(e=>e.sha&&e.mode!==`160000`?[e.sha]:[])),u=i.byteLength;for(let e of l){t?.();let n=await readGitHubRepositoryPublicationBlob(r,e);if(t?.(),u+=n.byteLength,u>805306368)throw Error(`Repository publication checkpoint exceeds its byte budget`);c.push(file(`blobs/${e}`,n))}let manifestBytes=(e,t=[])=>new TextEncoder().encode(o({version:1,baseCommit:null,directories:t,entries:e})),d=manifestBytes([]),f=manifestBytes(c,[`blobs`]);return{baseManifestRaw:d,currentManifestRaw:f,baseManifestRef:`sha256:${sha256(d)}`,currentManifestRef:`sha256:${sha256(f)}`,readVerifiedContent:async e=>{let t=s.get(e.path)??await readGitHubRepositoryPublicationBlob(r,e.path.slice(6));if(e.type!==`file`||t.byteLength!==e.size||sha256(t)!==e.sha256)throw Error(`Repository publication blob changed during preparation`);return t}}}async function buildWorkspaceStageInput(e,t){let n=b(e.stagedResultRef),r=`publication`in e?await publicationStageSource(e,t):{...e,readVerifiedContent:async t=>await readWorkspaceGitEntry(e.stagingRoot,t).catch(e=>{throw Error(`Cloud workspace staged payload is invalid: ${t.path}`,{cause:e})})},i=m(l(bufferView(r.baseManifestRaw).toString(`utf8`),r.baseManifestRef),l(bufferView(r.currentManifestRaw).toString(`utf8`),r.currentManifestRef));return await writeWorkspaceGitInput({assertBeforeMutation:t,inputPath:e.inputPath,ref:n,entries:i.entries,message:stagedResultMessage(r),readVerifiedContent:r.readVerifiedContent}),null}async function buildWorkspaceTreeInput(e,t){let n=e.source;return await writeWorkspaceGitInput({...e,assertBeforeMutation:t,readVerifiedContent:async e=>n.tree===void 0?await readWorkspaceGitEntry(n.root,e):e.type===`file`?await _({repositoryRoot:n.root,tree:n.tree,entry:e}):Buffer.from(e.target)}),null}var bufferView,sha256;function init_workspace_result_preparation_runtime(){return(init_workspace_result_preparation_runtime=e((()=>{init_github_repository_publication_snapshot(),init_workspace_git_input(),h(),c(),v(),x(),bufferView=e=>Buffer.from(e.buffer,e.byteOffset,e.byteLength),sha256=e=>w(`sha256`).update(e).digest(`hex`)})))()}init_workspace_result_preparation_runtime();export{buildWorkspaceStageInput,buildWorkspaceTreeInput};