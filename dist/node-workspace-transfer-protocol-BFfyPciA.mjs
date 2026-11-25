import{Jn as string,or as union,xn as literal}from"./schemas-DuCQi-Qb.mjs";import{a as workerProtocolObject}from"./protocol-record-DLQ06AtL.mjs";import{o as WorkerWorkspaceGitHistorySchema}from"./workspace-result-inventory-Cl0lnMl9.mjs";import"./node-runner-inventory-0_sWHjPC.mjs";import{createHash}from"node:crypto";
//!src/worker/node-workspace-transfer-protocol.ts
const NODE_WORKSPACE_EMPTY_MANIFEST=JSON.stringify({version:1,baseCommit:null,entries:[]});const NODE_WORKSPACE_EMPTY_MANIFEST_REF=`sha256:${createHash(`sha256`).update(NODE_WORKSPACE_EMPTY_MANIFEST).digest(`hex`)}`;const NODE_WORKSPACE_TRANSFER_PATH=`/__openclaw__/worker-transfer/v1`;const MAX_WORKSPACE_RESULT_GIT_PACK_BYTES=268435456;const NODE_WORKSPACE_GIT_HISTORY_SCRIPT=String.raw`
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
        callback(bytes > ${MAX_WORKSPACE_RESULT_GIT_PACK_BYTES} ? new Error("Worker Git pack exceeds its byte limit") : null, chunk);
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
`;const NODE_WORKSPACE_TRANSFER_ERROR_CODE=`WORKSPACE_TRANSFER_FAILED`;const NODE_WORKSPACE_PUBLICATION_CONFLICT_CODE=`PUBLICATION_CONFLICT`;var NodeWorkerPublicationConflictError=class extends Error{constructor(){super(`The accepted checkpoint conflicts with the current publication base.`);this.code=NODE_WORKSPACE_PUBLICATION_CONFLICT_CODE}};const NODE_WORKSPACE_TRANSFER_INVALID_REASONS=[`content_length`,`file_digest`,`file_size`,`manifest`,`payload`,`premature_eof`,`staging`,`trailing_bytes`];function isNodeWorkspaceTransferInvalidReason(e){return NODE_WORKSPACE_TRANSFER_INVALID_REASONS.some(t=>t===e)}var NodeWorkerWorkspaceTransferError=class extends Error{constructor(e,t){super(e,t);this.code=NODE_WORKSPACE_TRANSFER_ERROR_CODE;this.name=`NodeWorkerWorkspaceTransferError`;this.operation=t?.operation;this.stage=t?.stage}};const ManifestRef=string().regex(/^sha256:[a-f0-9]{64}$/u);const TransferToken=string().min(1).max(1024).refine(e=>!e.includes(`\0`));const NodeWorkerWorkspaceTransferInputSchema=union([workerProtocolObject({direction:literal(`publication`),token:TransferToken,inputToken:TransferToken,inputManifestRef:ManifestRef,inputDigest:ManifestRef,sourceUrl:string().url(),targetUrl:string().url(),targetCommit:string().regex(/^[a-f0-9]{40}$/u),gitToken:TransferToken,checkpointGitHistory:WorkerWorkspaceGitHistorySchema.optional()}),workerProtocolObject({direction:literal(`download`),token:TransferToken,manifestRef:ManifestRef,seedKey:string().regex(/^[a-f0-9]{64}$/u).optional(),attachments:literal(true).optional(),checkpointBaseManifestRef:ManifestRef.optional(),checkpointGitHistory:WorkerWorkspaceGitHistorySchema.optional()}).refine(e=>(e.seedKey===void 0||e.attachments===void 0)&&(e.checkpointBaseManifestRef===void 0||e.attachments===void 0&&e.seedKey===void 0)&&(e.checkpointGitHistory===void 0||e.checkpointBaseManifestRef!==void 0)),workerProtocolObject({direction:literal(`upload`),token:TransferToken,baseManifestRef:ManifestRef,resultVersion:literal(2).optional(),referenceManifestRef:ManifestRef,publicationBaseCommit:string().regex(/^[a-f0-9]{40}$/u).optional()})]);function nodeWorkspaceTransferEnvironmentPath(e){return`${NODE_WORKSPACE_TRANSFER_PATH}/environments/${encodeURIComponent(e)}`}function nodeWorkspaceTransferManifestPath(e,t){return`${nodeWorkspaceTransferEnvironmentPath(e)}/snapshots/${t.slice(7)}/manifest`}function nodeWorkspaceTransferPackPath(e,t){return`${nodeWorkspaceTransferEnvironmentPath(e)}/snapshots/${t.slice(7)}/pack`}function nodeWorkspaceTransferBlobPath(e,t){return`${nodeWorkspaceTransferEnvironmentPath(e)}/blobs/${t}`}function nodeWorkspaceTransferReconcilePath(e,t){return`${nodeWorkspaceTransferEnvironmentPath(e)}/reconciliations/${t.slice(7)}`}export{NODE_WORKSPACE_PUBLICATION_CONFLICT_CODE as a,NodeWorkerPublicationConflictError as c,isNodeWorkspaceTransferInvalidReason as d,nodeWorkspaceTransferBlobPath as f,nodeWorkspaceTransferReconcilePath as h,NODE_WORKSPACE_GIT_HISTORY_SCRIPT as i,NodeWorkerWorkspaceTransferError as l,nodeWorkspaceTransferPackPath as m,NODE_WORKSPACE_EMPTY_MANIFEST as n,NODE_WORKSPACE_TRANSFER_ERROR_CODE as o,nodeWorkspaceTransferManifestPath as p,NODE_WORKSPACE_EMPTY_MANIFEST_REF as r,NODE_WORKSPACE_TRANSFER_PATH as s,MAX_WORKSPACE_RESULT_GIT_PACK_BYTES as t,NodeWorkerWorkspaceTransferInputSchema as u};