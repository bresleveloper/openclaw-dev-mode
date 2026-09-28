import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-ciDkXIOQ.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-Cesa3L0p.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-mYH3aiyf.mjs";
import { n as incrementCompactionCount } from "./session-updates-pIOkIxtZ.mjs";
import { n as formatContextUsageShort } from "./status-message-Dx_7seNu.mjs";
import "./status-DvUfrrnt.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
