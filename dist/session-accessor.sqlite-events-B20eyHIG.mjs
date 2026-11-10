import { r as emitSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
//#region src/config/sessions/session-accessor.sqlite-events.ts
function emitArchivedTranscriptUpdates(archivedTranscripts) {
	for (const archived of archivedTranscripts) emitSessionTranscriptUpdate({ sessionFile: archived.archivedPath });
}
async function publishTranscriptUpdate(scope, update = {}, readSource) {
	const target = readSource ? {
		...scope,
		agentId: readSource.agentId,
		storePath: readSource.path
	} : scope;
	const memory = getSessionActorStorageBinding(target);
	if (!memory) {
		const assertCurrent = captureOwnedTranscriptWriteAssertion(target);
		const authority = {
			assertCurrent,
			authorize: assertCurrent
		};
		if (captureSessionActorStorageOwner(target, authority)) {
			if (!await withSessionActorStorage(target, {
				authority,
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				}
			}, async () => {
				await publishTranscriptUpdate(target, update);
				return true;
			})) throw new IncognitoSessionMissingError();
			return;
		}
	}
	const resolved = memory ? {
		agentId: memory.agentId,
		path: memory.path,
		sessionKey: memory.actor.target.sessionKey,
		sessionId: scope.sessionId ?? memory.actor.snapshot(memory.authority)?.entry?.sessionId
	} : resolveSqliteTranscriptScope(scope, readSource);
	if (!resolved.sessionId) throw new Error("Transcript publication requires its selected session window");
	memory?.actor.assertReadable();
	memory?.authority.assertCurrent();
	emitSessionTranscriptUpdate({
		...update,
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		sessionId: resolved.sessionId,
		target: {
			agentId: resolved.agentId,
			sessionId: resolved.sessionId,
			sessionKey: resolved.sessionKey,
			storePath: resolved.path
		}
	});
}
//#endregion
export { publishTranscriptUpdate as n, emitArchivedTranscriptUpdates as t };
