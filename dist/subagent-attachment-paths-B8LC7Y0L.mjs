import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/subagents/subagent-attachment-paths.ts
const SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT = "/openclaw/attachments";
function resolveSubagentAttachmentRootDir(agentId, env = process.env) {
	return path.join(resolveStateDir(env), "attachments", "subagents", normalizeAgentId(agentId));
}
function resolveSubagentSessionAttachmentRootDir(params) {
	const sessionRef = createHash("sha256").update(params.childSessionKey).digest("hex").slice(0, 32);
	return path.join(resolveSubagentAttachmentRootDir(params.agentId, params.env), sessionRef);
}
/** Resolves a per-session attachment root only when a run identity is available. */
function subagentAttachmentRootForRun(agentId, childSessionKey) {
	return agentId && childSessionKey ? resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey
	}) : void 0;
}
function resolveSubagentAttachmentDir(agentId, childSessionKey, attachmentId, env) {
	return path.join(resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey,
		env
	}), attachmentId);
}
//#endregion
export { subagentAttachmentRootForRun as i, resolveSubagentAttachmentDir as n, resolveSubagentSessionAttachmentRootDir as r, SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT as t };
