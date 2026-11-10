import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as matchesTranscriptEvent } from "./transcript-visible-record-CmGktXrb.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as readRestoredSessionTranscriptInWorker } from "./session-cold-storage-read-DxurMT4l.mjs";
import { _ as readTranscriptEventId, i as findTranscriptEventInDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { o as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-match.ts
/** Select one record inside the caller's existing SQLite snapshot. */
function findTranscriptEventMatchingInDatabase(database, request) {
	const { target, match } = request;
	const matches = (event) => {
		const entryId = readTranscriptEventId(event);
		return matchesTranscriptEvent(event, match) && (match.kind !== "active-assistant" || Boolean(entryId && target.sessionKey && readActiveTranscriptEntryAnchorInTransaction({
			database,
			resolved: {
				...target,
				sessionKey: target.sessionKey
			},
			entryId
		})));
	};
	return findTranscriptEventInDatabase(database, target.sessionId, matches, match.kind === "latest" ? void 0 : (event) => matchesTranscriptEvent(event, match, "navigation"));
}
/** Disk reads and matching belong to the existing read-only history worker. */
async function findTranscriptEvent(scope, match) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return memory.missing ? void 0 : (await memory.read("session.history.match", { match })).result;
	const captured = {
		...scope,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const selection = { ...match };
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
			return await readRestoredSessionTranscriptInWorker({
				scope: captured,
				resolved: target,
				owner,
				assertCurrent
			}, () => owner.findTranscriptEvent({
				target,
				match: selection
			}));
		} finally {
			assertCurrent();
		}
	});
}
//#endregion
export { findTranscriptEventMatchingInDatabase as n, findTranscriptEvent as t };
