import{createHash}from"node:crypto";
//!src/worker/worker-exec-approval-binding.ts
function workerExecApprovalDigest(e){return createHash(`sha256`).update(JSON.stringify([e.command,e.execCommand,e.cwd,e.environment,e.pty])).digest(`hex`)}export{workerExecApprovalDigest as t};