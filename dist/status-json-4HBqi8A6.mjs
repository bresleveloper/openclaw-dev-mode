import{t as createStatusGatewayProbeBudget}from"./status.gateway-probe-budget-D5QwMFzz.mjs";import{n as runStatusJsonCommand}from"./status-json-command-R4BOGpCb.mjs";
//!src/commands/status-json.ts
async function statusJsonCommand(e,t){await runStatusJsonCommand({opts:{...e,...createStatusGatewayProbeBudget(e.timeoutMs)},runtime:t})}export{statusJsonCommand};