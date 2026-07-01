import { n as CodexAppServerRpcError } from "./client-DinqpOpQ.js";
//#region extensions/codex/src/app-server/capabilities.ts
/**
* Capability helpers for optional Codex app-server control-plane methods.
*/
/** Known app-server methods used by OpenClaw control surfaces. */
const CODEX_CONTROL_METHODS = {
	account: "account/read",
	compact: "thread/compact/start",
	feedback: "feedback/upload",
	listMcpServers: "mcpServerStatus/list",
	listSkills: "skills/list",
	listThreads: "thread/list",
	rateLimits: "account/rateLimits/read",
	resumeThread: "thread/resume",
	review: "review/start"
};
/** Formats unsupported control calls differently from ordinary RPC failures. */
function describeControlFailure(error) {
	if (isUnsupportedControlError(error)) return "unsupported by this Codex app-server";
	return error instanceof Error ? error.message : String(error);
}
function isUnsupportedControlError(error) {
	return error instanceof CodexAppServerRpcError && error.code === -32601;
}
//#endregion
export { describeControlFailure as n, CODEX_CONTROL_METHODS as t };
