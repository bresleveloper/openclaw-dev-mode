import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { s as withSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./sessions-CnzPI1yx.mjs";
import { c as waitForEmbeddedAgentRunEnd } from "./active-run-projections-Crpg2l0z.mjs";
import { n as abortEmbeddedAgentRun, u as isEmbeddedAgentRunAbortableForCompaction } from "./runs-Czr-I6_B.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-B8S-WtrO.mjs";
import { n as incrementCompactionCount } from "./session-updates-gu7HvAu8.mjs";
import { n as formatContextUsageShort } from "./status-message-CyVwyOmt.mjs";
import "./status-C1roEmta.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
async function prepareCurrentSessionEntry(params) {
	const matchesExpected = (entry) => entry?.sessionId === params.expected.sessionId && entry.lifecycleRevision === params.expected.lifecycleRevision;
	if (isIncognitoSessionKey(params.sessionKey)) {
		const entry = loadSessionEntryReadOnly(params);
		if (!entry || !matchesExpected(entry)) return;
		return {
			entry,
			assertCurrent() {
				const current = loadSessionEntryReadOnly(params);
				if (!matchesExpected(current) || current?.activeWriterRunId !== entry.activeWriterRunId) throw new Error("command session changed");
			},
			release() {}
		};
	}
	return withSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKeys: [params.sessionKey]
	}, async ({ result }) => {
		const entry = result.entries.find((row) => row.sessionKey === params.sessionKey)?.entry;
		const identity = result.databaseIdentity?.identity;
		if (!entry || !identity || !matchesExpected(entry)) return;
		const retained = retainPreparedSessionEntryPredicate({
			databaseIdentity: `file:${identity}`,
			sessionKey: params.sessionKey,
			entry,
			matches: (before, after) => after?.sessionId === before?.sessionId && after?.lifecycleRevision === before?.lifecycleRevision && after?.activeWriterRunId === before?.activeWriterRunId
		});
		return {
			entry,
			assertCurrent() {
				if (!retained.isCurrent()) throw new Error("command session changed");
			},
			release: retained.release
		};
	});
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, prepareCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
