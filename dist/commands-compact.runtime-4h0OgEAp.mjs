import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BS_nB9DT.mjs";
import "./session-accessor-hXSUswC9.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-DA0exOSb.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-BvWA0t48.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-DAtpL61W.mjs";
import { n as incrementCompactionCount } from "./session-updates-D8GT4igk.mjs";
import { n as formatContextUsageShort } from "./status-message-BhclXyUm.mjs";
import "./status-Cqrd-Omw.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
