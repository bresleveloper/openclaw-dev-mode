import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/subagents/subagent-attachment-paths.ts
const SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT = "/openclaw/attachments";
function resolveSubagentSessionAttachmentRootDir(params) {
	const sessionRef = createHash("sha256").update(params.childSessionKey).digest("hex").slice(0, 32);
	return path.join(resolveStateDir(params.env), "attachments", "subagents", normalizeAgentId(params.agentId), sessionRef);
}
/** Resolves a per-session attachment root only when a run identity is available. */
function subagentAttachmentRootForRun(agentId, childSessionKey) {
	return agentId && childSessionKey ? resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey
	}) : void 0;
}
//#endregion
export { resolveSubagentSessionAttachmentRootDir as n, subagentAttachmentRootForRun as r, SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT as t };
