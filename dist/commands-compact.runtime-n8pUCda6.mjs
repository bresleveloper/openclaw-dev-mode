import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-Cjzxx3Pg.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-DE4llkPV.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-DGv6YF31.mjs";
import { n as incrementCompactionCount } from "./session-updates-CAatLhCF.mjs";
import { n as formatContextUsageShort } from "./status-message-BDmXuxv_.mjs";
import "./status-CmSayByl.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
