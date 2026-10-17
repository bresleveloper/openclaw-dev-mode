import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-De4L8VNW.mjs";
import { a as readSessionEntryInWorker, f as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { n as readMemorySessionTargets } from "./session-memory-targets-DRzulbKx.mjs";
//#region src/config/sessions/session-transcript-inventory-runtime.ts
async function listSessionTranscriptArchivesInWorker(input) {
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env),
		sessionIds: [...new Set(input.sessionIds ?? [])],
		archiveNames: [...new Set(input.archiveNames ?? [])]
	};
	if (scope.sessionIds.length === 0 && scope.archiveNames.length === 0) return [];
	const storePath = resolveSessionStorePathForScope(scope);
	if (isIncognitoOpenClawAgentSqlitePath(storePath, {
		...scope,
		agentId: scope.agentId ?? "main"
	})) return listSessionTranscriptArchivesReadOnly({
		...scope,
		storePath
	});
	return withSessionStoreReaderInWorker({
		...scope,
		storePath
	}, async ({ reader, database, logicalAgentId, assertCurrent }) => {
		const archives = await reader.readArchiveInventory({
			...scope,
			agentId: logicalAgentId,
			storePath: database.path
		});
		assertCurrent();
		return archives;
	}, {
		backing: true,
		dataOnly: true
	});
}
async function readSessionTranscriptCorpusInWorker(scope, options, artifacts) {
	const input = {
		agentId: scope.normalizedAgentId,
		storePath: scope.storePath,
		env: scope.env
	};
	return withSessionStoreReaderInWorker(input, async ({ reader, database, continuation, assertCurrent, onRegistryChange, revalidateTarget }) => {
		if (options.readOnly !== true && !continuation) {
			await readSessionEntryInWorker({
				agentId: database.agentId,
				storePath: database.path,
				env: database.env,
				sessionKey: ""
			}, assertCurrent, onRegistryChange);
			await revalidateTarget?.();
			assertCurrent();
		}
		const entries = await reader.readCorpusInventory({
			scope,
			options,
			artifacts,
			continuation
		});
		assertCurrent();
		return entries;
	}, {
		backing: true,
		dataOnly: true
	});
}
async function resolveMemorySessionTargetsInWorker(input) {
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(process.env),
		sessionIds: [...new Set(input.sessionIds ?? [])],
		hookSources: [...new Set(input.hookSources ?? [])],
		participants: [...new Set(input.participants ?? [])]
	};
	if (!scope.sessionIds.length && !scope.hookSources.length && !scope.participants.length) return [];
	const storePath = resolveSessionStorePathForScope(scope);
	if (isIncognitoOpenClawAgentSqlitePath(storePath, scope)) return readMemorySessionTargets({
		...scope,
		storePath
	});
	return withSessionStoreReaderInWorker({
		...scope,
		storePath
	}, async ({ reader, database, logicalAgentId, continuation, assertCurrent }) => {
		const targets = await reader.readMemorySessionTargets({
			params: {
				...scope,
				agentId: logicalAgentId,
				storePath: database.path
			},
			continuation
		});
		assertCurrent();
		return targets;
	}, {
		backing: true,
		dataOnly: true
	});
}
//#endregion
export { readSessionTranscriptCorpusInWorker as n, resolveMemorySessionTargetsInWorker as r, listSessionTranscriptArchivesInWorker as t };
