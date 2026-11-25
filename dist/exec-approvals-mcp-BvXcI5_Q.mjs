import{a as loadExecApprovalsReadOnlyAsync}from"./exec-approvals-store-ZQRuKtoJ.mjs";
//!src/infra/exec-approvals-mcp.ts
async function loadMcpToolGrants(e,t){return e===`*`?[]:(await loadExecApprovalsReadOnlyAsync(t)).agents?.[e]?.mcpTools??[]}export{loadMcpToolGrants as t};