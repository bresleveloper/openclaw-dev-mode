import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { _t as unresolvedMemorySessionTarget, ht as resolveMemorySessionSince } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { d as readSessionEntryInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-memory-targets-CX7-WPJG.mjs";
//#region src/config/sessions/session-transcript-inventory-runtime.ts
function captureMemoryInventory(scope) {
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => signal?.throwIfAborted();
	return captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
}
async function readMemoryInventory(memory, missing, consume) {
	const selected = memory.binding?.agentId === memory.agentId ? memory.binding : void 0;
	const sessionKey = selected?.actor.target.sessionKey ?? memory.owner?.listSessions(memory.authority)[0]?.target.sessionKey;
	if (!sessionKey) {
		memory.authority.assertCurrent();
		return missing;
	}
	return await withSessionActorStorage({
		agentId: memory.agentId,
		storePath: memory.path,
		sessionKey,
		sessionActor: selected
	}, {
		authority: memory.authority,
		lifetime: {
			assertCurrent: () => memory.authority.assertCurrent(),
			assertReadable: () => memory.authority.assertCurrent()
		}
	}, consume) ?? missing;
}
async function listSessionTranscriptArchivesInWorker(input) {
	const memory = captureMemoryInventory(input);
	if (memory) {
		memory.authority.assertCurrent();
		return [];
	}
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env),
		sessionIds: [...new Set(input.sessionIds ?? [])],
		archiveNames: [...new Set(input.archiveNames ?? [])]
	};
	if (scope.sessionIds.length === 0 && scope.archiveNames.length === 0) return [];
	const storePath = resolveSessionStorePathForScope(scope);
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
async function readSessionTranscriptCorpusInWorker(scope, options, prepareArtifacts) {
	const input = {
		agentId: scope.normalizedAgentId,
		storePath: scope.storePath,
		env: scope.env
	};
	const memory = captureMemoryInventory(input);
	if (memory) return readMemoryInventory(memory, [], (binding) => binding.actor.storage.read({
		type: "session.corpus.list",
		input: { options }
	}, binding.authority));
	return withSessionStoreReaderInWorker(input, async ({ reader, database, continuation, assertCurrent, onRegistryChange }) => {
		const artifacts = await prepareArtifacts();
		assertCurrent();
		if (options.readOnly !== true && !continuation) await readSessionEntryInWorker({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			sessionKey: ""
		}, assertCurrent, onRegistryChange);
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
		dataOnly: true,
		capturePhysicalSource: true
	});
}
async function resolveMemorySessionTargetsInWorker(input) {
	if (!input.sessionIds?.length && !input.hookSources?.length && !input.participants?.length) return [];
	const memory = captureMemoryInventory(input);
	if (memory) {
		resolveMemorySessionSince(input.since);
		return readMemoryInventory(memory, [...new Set(input.sessionIds ?? [])].map((sessionId) => unresolvedMemorySessionTarget(input.agentId, sessionId)), (binding) => binding.actor.storage.read({
			type: "session.memory.targets",
			input: { selectors: {
				...input,
				storePath: memory.path
			} }
		}, binding.authority));
	}
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(process.env),
		sessionIds: [...new Set(input.sessionIds ?? [])],
		hookSources: [...new Set(input.hookSources ?? [])],
		participants: [...new Set(input.participants ?? [])]
	};
	const storePath = resolveSessionStorePathForScope(scope);
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
