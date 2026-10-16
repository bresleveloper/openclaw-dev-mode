import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BZlUzQZy.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-BErx7xDZ.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-B_DdyEe2.mjs";
import { n as incrementCompactionCount } from "./session-updates-pHkVZ2Mw.mjs";
import { n as formatContextUsageShort } from "./status-message-_AscdlbR.mjs";
import "./status-po7UBajb.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
