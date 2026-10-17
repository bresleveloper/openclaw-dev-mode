import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { r as matchesTranscriptEvent } from "./transcript-visible-record-C_2yzTED.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { g as readTranscriptEventId, r as findTranscriptEventInDatabase } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-match.ts
/** Select one record inside the caller's existing SQLite snapshot. */
function findTranscriptEventMatchingInDatabase(database, request) {
	const { target, match } = request;
	return findTranscriptEventInDatabase(database, target.sessionId, (event) => {
		if (!matchesTranscriptEvent(event, match)) return false;
		if (match.kind !== "active-assistant") return true;
		const entryId = readTranscriptEventId(event);
		return Boolean(entryId && target.sessionKey && readActiveTranscriptEntryAnchorInTransaction({
			database,
			resolved: {
				...target,
				sessionKey: target.sessionKey
			},
			entryId
		}));
	});
}
/** Disk reads and matching belong to the existing read-only history worker. */
async function findTranscriptEvent(scope, match) {
	const captured = {
		...scope,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const selection = { ...match };
	if (isIncognitoSessionKey(captured.sessionKey)) {
		const target = resolveSqliteTranscriptReadScope(captured);
		const opened = withOpenClawAgentDatabaseReadOnly((database) => findTranscriptEventMatchingInDatabase(database, {
			target,
			match: selection
		}), toDatabaseOptions(target));
		return opened.found ? opened.value : void 0;
	}
	const context = captureOpenClawStateWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const target = await prepareSqliteTranscriptReadScope(captured);
	assertStateCurrent();
	const options = toDatabaseOptions(target);
	target.path = resolveOpenClawAgentSqlitePath(options);
	return await withSessionHistoryWorkerDatabase(options, async (owner) => {
		const assertCurrent = () => {
			assertStateCurrent();
			owner.assertCurrent();
		};
		try {
			return await readRestoredSessionTranscript(captured, () => owner.findTranscriptEvent({
				target,
				match: selection
			}), {
				assertCurrent,
				coldRead: {
					target,
					readMetadata: async () => {
						const metadata = await owner.readColdMetadata({
							sessionId: target.sessionId,
							env: captured.env
						});
						assertCurrent();
						return metadata.archive;
					}
				}
			});
		} finally {
			assertCurrent();
		}
	});
}
//#endregion
export { findTranscriptEventMatchingInDatabase as n, findTranscriptEvent as t };
