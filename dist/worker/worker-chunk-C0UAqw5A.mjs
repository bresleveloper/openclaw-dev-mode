import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{h as t,n}from"./worker-chunk-Beu5zrK3.mjs";import{o as r,s as i}from"./worker-chunk-ol4R2Y93.mjs";import{c as a,l as o}from"./worker-chunk-D-pM6VZQ.mjs";import{a as s,n as c}from"./worker-chunk-DtA3s48u.mjs";import{i as l,n as u,o as d,t as f}from"./worker-chunk-DgvS5Yo7.mjs";import p from"node:path";import{createHash as m}from"node:crypto";function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}function parseGitHubPublicationBaseBranch(e,t){let n=e.trim();if(!n||n===`HEAD`||/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(n))return t;for(let e of[`refs/remotes/origin/`,`origin/`,`refs/heads/`])if(n.startsWith(e))return n.slice(e.length);return n}function parseGitHubPublicationBaseRef(e,n){let r=i(e),a=o(r)?t(r.ref):void 0,s=o(r)?t(r.sha):void 0;if(a!==`refs/heads/${n}`||!s||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(s))throw Error(`GitHub publication workspace base branch could not be verified.`);return s}var h,g,_=e((()=>{r(),a(),n(),h=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`],g={worktreeConfigArgs:h,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(h.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
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
`}}));function parseGitHubRepositoryPublicationSnapshot(e,t){if(Buffer.byteLength(e)>67108864||`sha256:`+m(`sha256`).update(e).digest(`hex`)!==t)throw Error(`GitHub publication checkpoint digest changed.`);let n=JSON.parse(e);if(!o(n)||n.version!==1||typeof n.baseCommit!=`string`||!v.test(n.baseCommit)||typeof n.baseTree!=`string`||!v.test(n.baseTree)||typeof n.workspaceTree!=`string`||!v.test(n.workspaceTree)||!Array.isArray(n.entries)||n.entries.length>f)throw Error(`GitHub publication checkpoint is invalid.`);let r=/* @__PURE__ */ new Set,i=n.entries.map(e=>{if(!o(e)||typeof e.path!=`string`||!e.path||e.path.includes(`\\`)||e.path.includes(`\0`)||p.posix.isAbsolute(e.path)||p.posix.normalize(e.path)!==e.path||e.path===`.`||e.path===`..`||e.path.startsWith(`../`)||e.path.split(`/`).some(e=>e.toLowerCase()===`.git`)||r.has(e.path)||e.mode!==`100644`&&e.mode!==`100755`&&e.mode!==`120000`&&e.mode!==`160000`||e.sha!==null&&(typeof e.sha!=`string`||!v.test(e.sha)))throw Error(`GitHub publication checkpoint entry is invalid.`);return r.add(e.path),{path:e.path,mode:e.mode,sha:e.sha}});return{version:1,baseCommit:n.baseCommit,baseTree:n.baseTree,workspaceTree:n.workspaceTree,entries:i}}async function readPublicationFile(e,t){return(await s(e)).read(t,{maxBytes:u,symlinks:`reject`,hardlinks:`reject`})}async function readGitHubRepositoryPublicationBlob(e,t){if(!v.test(t))throw Error(`GitHub publication blob identity is invalid.`);let{buffer:n}=await readPublicationFile(e,`blobs/`+t);if(m(`sha1`).update(`blob `+n.length+`\0`).update(n).digest(`hex`)!==t)throw Error(`GitHub publication blob changed after checkpoint capture.`);return n}async function readGitHubRepositoryPublicationMetadata(e,t){let{buffer:n}=await readPublicationFile(e,`snapshot.json`),r=n.toString(`utf8`);return{raw:r,snapshot:parseGitHubRepositoryPublicationSnapshot(r,t)}}var v,y=e((()=>{a(),c(),_(),d(),v=/^[a-f0-9]{40}$/u,String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${u};
const maxTotal = ${l};
const maxEntries = ${f};
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
${g.script}
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
`}));export{g as a,parseGitHubPublicationBaseBranch as c,readGitHubRepositoryPublicationMetadata as i,parseGitHubPublicationBaseRef as l,parseGitHubRepositoryPublicationSnapshot as n,githubPublicationUnsafeConfigArgs as o,readGitHubRepositoryPublicationBlob as r,_ as s,y as t};