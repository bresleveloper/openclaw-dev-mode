import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{G as t,H as n,j as r}from"./worker-chunk-NLl7b0Cm.mjs";import{t as i}from"./worker-chunk-yj5UkYJA.mjs";import{a,r as o}from"./worker-chunk-Bf0whSJg.mjs";import{i as s}from"./worker-chunk-_J3Jh4P_.mjs";import{a as c,s as l}from"./worker-chunk-CbFNn_pG.mjs";import{createHash as u}from"node:crypto";var d,f,p,m,h,g=e((()=>{i(),l(),s(),o(),d=JSON.stringify({version:1,baseCommit:null,entries:[]}),`${u(`sha256`).update(d).digest(`hex`)}`,f=268435456,String.raw`
const fs = require("node:fs");
const cp = require("node:child_process");
const { pipeline } = require("node:stream/promises");
const { Transform } = require("node:stream");
const [root, baseCommit, packPath] = process.argv.slice(1);
const git = (args) => cp.spawnSync("git", ["-C", root, ...args], {encoding:"utf8"});
(async () => {
  const head = git(["rev-parse", "--verify", "HEAD^{commit}"]);
  if (head.status !== 0) throw new Error("Worker Git HEAD is unavailable");
  const headCommit = head.stdout.trim();
  if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(headCommit)) throw new Error("Invalid worker Git HEAD");
  const ancestry = git(["merge-base", "--is-ancestor", baseCommit, headCommit]);
  // A rewritten worker can have pruned the dispatch commit; it cannot be adopted.
  if (ancestry.status !== 0 && ancestry.status !== 1 && ancestry.status !== 128) throw new Error("Worker Git ancestry is unavailable");
  const descendsFromBase = ancestry.status === 0;
  let unavailableReason;
  if (descendsFromBase && headCommit !== baseCommit) {
    const child = cp.spawn("git", ["-C", root, "pack-objects", "--revs", "--stdout"], {stdio:["pipe","pipe","pipe"]});
    let bytes = 0;
    let stderr = "";
    child.stderr.on("data", chunk => { stderr = (stderr + chunk).slice(-4096); });
    const exit = new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", code => code === 0 ? resolve() : reject(new Error("Worker Git pack failed: " + stderr)));
    });
    child.stdin.end(headCommit + "\n^" + baseCommit + "\n");
    try {
      await Promise.all([exit, pipeline(child.stdout, new Transform({transform(chunk, encoding, callback) {
        bytes += chunk.length;
        callback(bytes > ${f} ? new Error("Worker Git pack exceeds its byte limit") : null, chunk);
      }}), fs.createWriteStream(packPath, {flags:"wx", mode:0o600}))]);
    } catch (error) {
      child.kill("SIGKILL");
      await exit.catch(() => {});
      fs.rmSync(packPath, {force:true});
      unavailableReason = (error instanceof Error ? error.message : String(error)).slice(0, 512);
    }
  }
  process.stdout.write(JSON.stringify({baseCommit, headCommit, descendsFromBase, unavailableReason}));
})().catch(reportFailure);
/** @param {unknown} error */
function reportFailure(error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
`,p=n().regex(/^sha256:[a-f0-9]{64}$/u),m=n().min(1).max(1024).refine(e=>!e.includes(`\0`)),h=t([a({direction:r(`publication`),token:m,inputToken:m,inputManifestRef:p,inputDigest:p,sourceUrl:n().url(),targetUrl:n().url(),targetCommit:n().regex(/^[a-f0-9]{40}$/u),gitToken:m,checkpointGitHistory:c.optional()}),a({direction:r(`download`),token:m,manifestRef:p,seedKey:n().regex(/^[a-f0-9]{64}$/u).optional(),attachments:r(!0).optional(),checkpointBaseManifestRef:p.optional(),checkpointGitHistory:c.optional()}).refine(e=>(e.seedKey===void 0||e.attachments===void 0)&&(e.checkpointBaseManifestRef===void 0||e.attachments===void 0&&e.seedKey===void 0)&&(e.checkpointGitHistory===void 0||e.checkpointBaseManifestRef!==void 0)),a({direction:r(`upload`),token:m,baseManifestRef:p,resultVersion:r(2).optional(),referenceManifestRef:p,publicationBaseCommit:n().regex(/^[a-f0-9]{40}$/u).optional()})])}));export{h as n,g as r,f as t};