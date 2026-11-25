import{n as explainShellCommand}from"./extract-CubEbmia.mjs";import{t as formatCommandSpans}from"./format-4apo2mHJ.mjs";
//!src/agents/bash-tools.exec-approval-request.runtime.ts
async function resolveExecApprovalCommandSpans(e){const t=await explainShellCommand(e);const n=formatCommandSpans(t);return n.length>0?n:void 0}export{resolveExecApprovalCommandSpans};