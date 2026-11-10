import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/agents/subagents/subagent-attachment-paths.ts
const SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT = "/openclaw/attachments";
function resolveSubagentSessionAttachmentRootDir(params) {
	const sessionRef = createHash("sha256").update(params.childSessionKey).digest("hex").slice(0, 32);
	return path.join(resolveStateDir(params.env), "attachments", "subagents", normalizeAgentId(params.agentId), sessionRef);
}
function subagentAttachmentRootForRun(agentId, childSessionKey) {
	return agentId && childSessionKey ? resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey
	}) : void 0;
}
//#endregion
export { resolveSubagentSessionAttachmentRootDir as n, subagentAttachmentRootForRun as r, SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT as t };
