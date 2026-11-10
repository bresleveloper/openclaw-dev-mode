import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as isSessionStoreReadCandidateCurrent, n as captureSessionStoreCandidateIdentities, r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-source-authority.ts
/** Capture the owner once; effect predicates read its current acknowledged entry. */
function captureSessionEntryMetadataRead(scope, assertCallerCurrent) {
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent: assertCallerCurrent,
		authorize: assertCallerCurrent
	});
	if (!memory) return;
	const assertCurrent = () => {
		memory.authority.assertCurrent();
		memory.owner?.assertCurrent();
		memory.binding?.actor.assertReadable();
	};
	return {
		assertCurrent,
		readCurrent() {
			assertCurrent();
			return readCapturedSessionActorEntry(memory, scope.sessionKey);
		}
	};
}
/** Retain a selected entry's authority while its predicates move into the destination writer. */
function captureSessionEntrySourceAssertion(params) {
	const incognito = captureSessionEntryMetadataRead(params.scope, () => params.assertHostCurrent?.());
	if (incognito) {
		if (params.prepareConversations) throw new Error("Incognito conversation predicates require their actor preparation owner");
		const fields = [...params.fields];
		const expected = params.expected ? structuredClone(Object.fromEntries(fields.map((field) => [field, params.expected?.[field]]))) : void 0;
		const assertScopeCurrent = () => incognito.assertCurrent();
		const assertCurrent = () => {
			const current = incognito.readCurrent();
			if (current === void 0 !== (expected === void 0) || fields.some((field) => !isDeepStrictEqual(current?.[field], expected?.[field]))) params.refuse();
			params.assertCurrent();
		};
		return Object.assign(assertCurrent, {
			assertScopeCurrent,
			async prepareSessionSource() {
				assertCurrent();
				return {
					assertCurrent,
					checks: []
				};
			}
		});
	}
	const locator = captureSessionStoreReadCandidate(resolveUnsuffixedSqliteTargetFromSessionStorePath(params.scope.storePath).path);
	const candidates = params.readSource ? [captureSessionStoreReadCandidate(params.readSource.path)] : captureSessionStoreReadCandidates(params.scope.storePath);
	const identities = captureSessionStoreCandidateIdentities(candidates);
	const fields = [...params.fields];
	const expected = params.expected ? structuredClone(Object.fromEntries(fields.map((field) => [field, params.expected?.[field]]))) : void 0;
	const env = captureSessionTranscriptStorageEnvironment(params.scope.env ?? process.env);
	const scope = {
		...params.scope,
		env
	};
	return Object.assign(() => params.assertCurrent(), { async prepareSessionSource() {
		params.assertHostCurrent?.();
		if (![locator, ...candidates].every(isSessionStoreReadCandidateCurrent)) params.refuse();
		const target = params.readSource ?? toDatabaseOptions(await prepareSqliteScope(scope));
		if (!target.path) params.refuse();
		let physicalPath;
		try {
			physicalPath = assertSessionStoreReadCandidate(target.path, candidates);
		} catch {
			params.refuse();
		}
		const identity = identities.get(physicalPath);
		if (!identity?.key.startsWith("file:")) params.refuse();
		const source = params.readSource ?? {
			agentId: target.agentId,
			path: physicalPath,
			databaseIdentity: identity.key.slice(5),
			databaseBirthtime: identity.birthtime
		};
		const assertCaptured = () => {
			params.assertHostCurrent?.();
			if (typeof source.databaseIdentity !== "string" || source.path !== physicalPath || ![locator, ...candidates].every(isSessionStoreReadCandidateCurrent)) params.refuse();
			assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
		};
		assertCaptured();
		const database = {
			agentId: source.agentId,
			path: source.path,
			env
		};
		const retained = retainSessionHistoryWorkerDatabase(database);
		const predicate = params.preparedEntry ?? retainPreparedSessionEntryPredicate({
			databaseIdentity: identity.key,
			sessionKey: scope.sessionKey,
			entry: void 0,
			matches: (_before, current) => current === void 0 === (expected === void 0) && fields.every((field) => isDeepStrictEqual(current?.[field], expected?.[field]))
		});
		const revision = predicate.captureRevision();
		let active = true;
		let conversations;
		const assertCurrent = () => {
			assertCaptured();
			retained.owner.assertCurrent();
			conversations?.assertCurrent();
			if (!active || !predicate.isCurrent()) params.refuse();
		};
		try {
			if (!params.preparedEntry) {
				const result = await retained.owner.readExactEntries({
					sessionKeys: [scope.sessionKey],
					projection: "full",
					includeAuthorization: true,
					env
				});
				const entry = result.entries.find((row) => row.sessionKey === scope.sessionKey)?.entry;
				if (result.databaseIdentity?.identity !== source.databaseIdentity || result.databaseIdentity?.birthtime !== source.databaseBirthtime || !predicate.acknowledge(entry, revision)) params.refuse();
			}
			assertCurrent();
			conversations = await params.prepareConversations?.(async (conversationRefs) => {
				if (conversationRefs.length === 0) return /* @__PURE__ */ new Map();
				const rows = await retained.owner.readConversations({
					query: {
						conversationRefs,
						currentBindingOnly: true
					},
					env
				});
				assertCurrent();
				return new Map(rows.map((row) => [row.conversationRef, row.sessionKey && row.sessionId ? row.sessionKey : null]));
			});
			assertCurrent();
			return {
				assertCurrent,
				checks: [{
					predicate: {
						source,
						sessionKey: scope.sessionKey,
						fields,
						expected,
						...conversations ? { conversationAlternatives: conversations.alternatives } : {}
					},
					refuse: params.refuse,
					acceptConversationMatches: conversations?.acceptMatches
				}],
				release: () => {
					active = false;
					if (!params.preparedEntry) predicate.release();
					retained.release();
				}
			};
		} catch (error) {
			active = false;
			if (!params.preparedEntry) predicate.release();
			await releaseSessionSourceAuthorities([retained], [error]);
			throw error;
		}
	} });
}
//#endregion
export { captureSessionEntrySourceAssertion as n, captureSessionEntryMetadataRead as t };
