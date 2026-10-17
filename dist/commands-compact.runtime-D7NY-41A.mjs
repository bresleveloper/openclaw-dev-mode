import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BZlUzQZy.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-CzCPh-gu.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
import "./sessions-D_sxp1B4.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-CI14IRBZ.mjs";
import { n as incrementCompactionCount } from "./session-updates-D5za5de4.mjs";
import { n as formatContextUsageShort } from "./status-message-CIKPsod5.mjs";
import "./status-CfTtcZO_.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
