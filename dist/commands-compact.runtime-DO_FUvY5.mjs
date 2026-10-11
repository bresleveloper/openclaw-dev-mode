import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BbdrsVIR.mjs";
import "./session-accessor-BhE5D_VR.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-1VQeqQMi.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-BvOnR0by.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-CjpdwbpI.mjs";
import { n as incrementCompactionCount } from "./session-updates-BmlU9TW3.mjs";
import { n as formatContextUsageShort } from "./status-message-BPUWz_5v.mjs";
import "./status-B1Da8cdO.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
