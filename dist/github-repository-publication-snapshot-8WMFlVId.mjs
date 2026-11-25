import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{x as root}from"./fs-safe-Bxzu1j4h.mjs";import{r as gitMaintenanceEnvironment}from"./git-maintenance-env-CIA5le3f.mjs";import{i as MAX_RECONCILIATION_TOTAL_BYTES,n as MAX_RECONCILIATION_FILE_BYTES,t as MAX_RECONCILIATION_ENTRIES}from"./workspace-manifest-Dyc7BkNp.mjs";import{t as GITHUB_PUBLICATION_CONFIG_GUARD}from"./github-publication-base-BoRNavWF.mjs";import path from"node:path";import{createHash}from"node:crypto";
//!src/gateway/github-repository-publication-snapshot.ts
const gitObjectPattern=/^[a-f0-9]{40}$/u;const REMOTE_GITHUB_PUBLICATION_SNAPSHOT_JS=String.raw`
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const [cwd, baseCommit, output] = process.argv.slice(1);
const maxFile = ${MAX_RECONCILIATION_FILE_BYTES};
const maxTotal = ${MAX_RECONCILIATION_TOTAL_BYTES};
const maxEntries = ${MAX_RECONCILIATION_ENTRIES};
const objectPattern = /^[a-f0-9]{40}$/;
const gitNullPath = process.platform === "win32" ? "NUL" : "/dev/null";
const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: gitNullPath, GIT_CONFIG_SYSTEM: gitNullPath,
  ${JSON.stringify(gitMaintenanceEnvironment()).slice(1,-1)} };
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
${GITHUB_PUBLICATION_CONFIG_GUARD.script}
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
`;function parseGitHubRepositoryPublicationSnapshot(e,t){if(Buffer.byteLength(e)>67108864||`sha256:`+createHash(`sha256`).update(e).digest(`hex`)!==t)throw new Error(`GitHub publication checkpoint digest changed.`);const n=JSON.parse(e);if(!isRecord(n)||n.version!==1||typeof n.baseCommit!==`string`||!gitObjectPattern.test(n.baseCommit)||typeof n.baseTree!==`string`||!gitObjectPattern.test(n.baseTree)||typeof n.workspaceTree!==`string`||!gitObjectPattern.test(n.workspaceTree)||!Array.isArray(n.entries)||n.entries.length>MAX_RECONCILIATION_ENTRIES)throw new Error(`GitHub publication checkpoint is invalid.`);const r=/* @__PURE__ */ new Set;const i=n.entries.map(e=>{if(!isRecord(e)||typeof e.path!==`string`||!e.path||e.path.includes(`\\`)||e.path.includes(`\0`)||path.posix.isAbsolute(e.path)||path.posix.normalize(e.path)!==e.path||e.path===`.`||e.path===`..`||e.path.startsWith(`../`)||e.path.split(`/`).some(e=>e.toLowerCase()===`.git`)||r.has(e.path)||e.mode!==`100644`&&e.mode!==`100755`&&e.mode!==`120000`&&e.mode!==`160000`||e.sha!==null&&(typeof e.sha!==`string`||!gitObjectPattern.test(e.sha)))throw new Error(`GitHub publication checkpoint entry is invalid.`);r.add(e.path);return{path:e.path,mode:e.mode,sha:e.sha}});return{version:1,baseCommit:n.baseCommit,baseTree:n.baseTree,workspaceTree:n.workspaceTree,entries:i}}async function readPublicationFile(e,t){return(await root(e)).read(t,{maxBytes:MAX_RECONCILIATION_FILE_BYTES,symlinks:`reject`,hardlinks:`reject`})}async function readGitHubRepositoryPublicationBlob(e,t){if(!gitObjectPattern.test(t))throw new Error(`GitHub publication blob identity is invalid.`);const{buffer:n}=await readPublicationFile(e,`blobs/`+t);if(createHash(`sha1`).update(`blob `+n.length+`\0`).update(n).digest(`hex`)!==t)throw new Error(`GitHub publication blob changed after checkpoint capture.`);return n}async function readGitHubRepositoryPublicationMetadata(e,t){const{buffer:n}=await readPublicationFile(e,`snapshot.json`);const r=n.toString(`utf8`);return{raw:r,snapshot:parseGitHubRepositoryPublicationSnapshot(r,t)}}export{readGitHubRepositoryPublicationBlob as n,readGitHubRepositoryPublicationMetadata as r,parseGitHubRepositoryPublicationSnapshot as t};