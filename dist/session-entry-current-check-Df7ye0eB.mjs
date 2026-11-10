import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { i as isSessionStoreReadCandidateCurrent, r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as buildConversationIdentity } from "./conversation-identity-BApT92qN.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { a as captureSessionEntryReadScope, s as isNativeSessionEntryRead } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { n as captureSessionEntrySourceAssertion } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { o as resolveCurrentConversationSession, s as resolveCurrentConversationSessionAsync } from "./conversation-registry-DdNx9ZQ8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-current-check.ts
async function prepareSessionEntryCurrentCheck(inputParams) {
	const params = { ...inputParams };
	const incognito = captureMemoryExactSessionReader(params, () => {
		if (params.isActive?.() === false) throw new Error(params.errorMessage ?? "Session operation is no longer active");
	});
	const storePath = incognito?.path ?? params.storePath ?? resolveSessionStorePathForScope(params);
	const input = {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath,
		projection: params.fields ? void 0 : "list",
		env: params.env
	};
	const captured = captureSessionEntryReadScope(input);
	const scope = {
		...captured.scope,
		storePath: captured.scope.storePath ?? storePath
	};
	const fields = [.../* @__PURE__ */ new Set([...params.matchGeneration === false ? [] : ["sessionId", "lifecycleRevision"], ...params.fields ?? []])];
	const expected = params.expected && structuredClone(params.expected);
	const inputCandidates = incognito || isNativeSessionEntryRead(scope, captured.agentId) ? [] : captureSessionStoreReadCandidates(scope.storePath);
	const refuse = () => {
		throw new Error(params.errorMessage ?? "The selected session changed before its operation committed.");
	};
	const assertActive = () => {
		if (params.isActive?.() === false) refuse();
	};
	const alternatives = (params.alternatives ?? [{ conversations: [] }]).map((alternative) => ({
		isActive: alternative.isActive,
		conversations: alternative.conversations.map((condition) => {
			const identity = buildConversationIdentity({
				...condition,
				deliveryTarget: condition.peerId
			});
			if (!identity) throw new Error("Session currentness requires a valid conversation address");
			const conversationStorePath = condition.storePath ?? scope.storePath;
			const locator = captureMemoryExactSessionReader({
				agentId: condition.agentId ?? params.agentId,
				storePath: conversationStorePath,
				env: scope.env
			}) ? void 0 : captureSessionStoreReadCandidate(resolveUnsuffixedSqliteTargetFromSessionStorePath(conversationStorePath).path);
			return {
				scope: {
					agentId: condition.agentId ?? params.agentId,
					storePath: conversationStorePath,
					env: scope.env
				},
				locator,
				predicate: {
					conversationRef: identity.conversationRef,
					sessionKey: condition.sessionKey
				}
			};
		})
	}));
	const entryOnly = alternatives.every((alternative) => alternative.conversations.length === 0);
	let entryPredicate;
	let predicateRevision = 0;
	return withSessionEntryReadOnlyInWorker(scope, assertActive, async (read, owner) => {
		if (!read.ok) throw read.error;
		const selected = read.value;
		const selectedValues = fields.map((field) => structuredClone(selected?.[field]));
		if (expected && (!selected || fields.some((field) => !isDeepStrictEqual(selected[field], expected[field])))) refuse();
		const matchesSelectedEntry = (current) => current === void 0 === (selected === void 0) && fields.every((field, index) => isDeepStrictEqual(current?.[field], selectedValues[index]));
		if (entryPredicate && !entryPredicate.acknowledge(structuredClone(selected), predicateRevision)) refuse();
		const readScope = owner.scope ?? scope;
		const target = {
			agentId: readScope.agentId ?? params.agentId,
			sessionKey: resolveSqliteSessionKey(readScope.sessionKey, readScope.agentId ?? params.agentId),
			storePath: owner.scope?.storePath ?? scope.storePath,
			env: scope.env
		};
		const identity = incognito ? void 0 : readDatabasePathIdentitySync(target.storePath);
		const readSource = identity?.key.startsWith("file:") ? {
			agentId: owner.scope?.databaseAgentId ?? params.agentId,
			path: identity.canonicalPath,
			databaseIdentity: identity.key.slice(5),
			databaseBirthtime: identity.birthtime
		} : void 0;
		const selectedStore = owner.selectedStore;
		let active = true;
		const release = () => {
			active = false;
			entryPredicate?.release();
		};
		const sourceIsCurrent = () => {
			if (!active) return false;
			if (incognito) {
				incognito.assertCurrent();
				return true;
			}
			try {
				if (inputCandidates.some((candidate) => !isSessionStoreReadCandidateCurrent(candidate)) || alternatives.some((alternative) => alternative.conversations.some(({ locator }) => locator && !isSessionStoreReadCandidateCurrent(locator))) || selectedStore && assertSessionStoreReadCandidate(selectedStore.path, inputCandidates) !== selectedStore.physicalPath) return false;
				const current = readDatabasePathIdentitySync(target.storePath);
				return !identity?.key.startsWith("file:") || current.key === identity.key && current.birthtime === identity.birthtime;
			} catch {
				return false;
			}
		};
		const check = () => {
			if (params.isActive?.() === false || !sourceIsCurrent()) return false;
			if (fields.length > 0) {
				if (!(entryPredicate ? entryPredicate.isCurrent() : matchesSelectedEntry(incognito ? incognito.read(target.sessionKey) : loadSessionEntryReadOnly(readScope)))) return false;
			}
			return alternatives.some((alternative) => alternative.isActive?.() !== false && alternative.conversations.every(({ scope: conversationScope, predicate }) => (resolveCurrentConversationSession(conversationScope, predicate.conversationRef)?.sessionKey ?? null) === predicate.sessionKey));
		};
		const assertCurrent = () => {
			if (!check()) refuse();
		};
		const assertScopeCurrent = () => {
			assertActive();
			if (!sourceIsCurrent()) refuse();
		};
		const nativeSource = incognito || !identity?.key.startsWith("file:") || alternatives.some((alternative) => alternative.conversations.some(({ locator }) => locator?.physicalPath !== identity?.canonicalPath));
		const source = !readSource || nativeSource ? Object.assign(assertCurrent, {
			nativeSource: true,
			async prepareSessionSource() {
				return {
					nativeSource: true,
					checks: [],
					assertCurrent
				};
			}
		}) : captureSessionEntrySourceAssertion({
			scope: target,
			readSource,
			expected: selected,
			fields,
			preparedEntry: entryPredicate,
			assertCurrent,
			assertHostCurrent: assertScopeCurrent,
			async prepareConversations(readConversations) {
				const predicates = alternatives.map((alternative) => alternative.conversations.map(({ predicate }) => predicate));
				const rows = await readConversations([...new Set(predicates.flatMap((alternative) => alternative.map(({ conversationRef }) => conversationRef)))]);
				if (!alternatives.some((alternative, index) => alternative.isActive?.() !== false && predicates[index].every((predicate) => (rows.get(predicate.conversationRef) ?? null) === predicate.sessionKey))) refuse();
				let matches;
				const accepted = [];
				return {
					alternatives: predicates,
					acceptMatches: (validated) => {
						matches = validated;
						accepted.length = 0;
						return accepted;
					},
					assertCurrent: () => {
						assertActive();
						accepted.length = 0;
						for (const [index, alternative] of alternatives.entries()) if ((!matches || matches.includes(index)) && alternative.isActive?.() !== false) accepted.push(index);
						if (accepted.length === 0) refuse();
					}
				};
			},
			refuse
		});
		const preparedSource = Object.assign(source, { assertScopeCurrent });
		const entryCurrent = readSource && entryOnly ? {
			source: {
				...readSource,
				sessionKey: target.sessionKey
			},
			assertCurrent(current) {
				assertScopeCurrent();
				if (!matchesSelectedEntry(current)) refuse();
			}
		} : void 0;
		const isCurrentAsync = Object.assign(async () => {
			if (incognito || entryPredicate || entryOnly && fields.length === 0) return check();
			const sameStore = readSource && alternatives.every((alternative) => alternative.conversations.every(({ locator }) => locator?.physicalPath === readSource.path));
			let matches;
			if (sameStore && readSource) {
				const result = await withSessionHistoryWorkerDatabase({
					agentId: readSource.agentId,
					path: readSource.path,
					env: scope.env
				}, (reader) => reader.readExactEntries({
					sessionKeys: [],
					env: scope.env ?? process.env,
					sourceChecks: [{
						source: readSource,
						sessionKey: target.sessionKey,
						fields,
						expected: selected,
						conversationAlternatives: alternatives.map((alternative) => alternative.conversations.map(({ predicate }) => predicate))
					}]
				}));
				if (result.sourceValidation?.refusedSource) return false;
				matches = result.sourceValidation?.conversationMatches[0]?.alternatives ?? [];
			} else {
				const current = await withSessionEntryReadOnlyInWorker(readScope, () => {}, async (currentRead) => {
					if (!currentRead.ok) throw currentRead.error;
					return currentRead.value;
				});
				if (!matchesSelectedEntry(current)) return false;
				matches = (await Promise.all(alternatives.map(async (alternative, index) => {
					return (await Promise.all(alternative.conversations.map(async ({ scope: conversationScope, predicate }) => (await resolveCurrentConversationSessionAsync(conversationScope, predicate.conversationRef))?.sessionKey ?? null))).every((key, position) => key === alternative.conversations[position].predicate.sessionKey) ? index : void 0;
				}))).filter((index) => index !== void 0);
			}
			return params.isActive?.() !== false && sourceIsCurrent() && matches.some((index) => alternatives[index]?.isActive?.() !== false);
		}, { sessionSource: preparedSource });
		const assertCurrentAsync = async () => {
			if (!await isCurrentAsync()) refuse();
		};
		owner.assertCurrent();
		return {
			entry: selected,
			isCurrentAsync,
			assertCurrentAsync,
			source: preparedSource,
			entryCurrent,
			release
		};
	}, (_database, identity) => {
		if (!entryOnly || fields.length === 0 || !identity.key.startsWith("file:")) return;
		entryPredicate?.release();
		entryPredicate = retainPreparedSessionEntryPredicate({
			databaseIdentity: identity.key,
			sessionKey: resolveSqliteSessionKey(scope.sessionKey, captured.agentId ?? params.agentId),
			entry: void 0,
			acquiring: true,
			matches: (before, current) => before === void 0 === (current === void 0) && fields.every((field) => isDeepStrictEqual(before?.[field], current?.[field]))
		});
		predicateRevision = entryPredicate.captureRevision();
	}).catch((error) => {
		entryPredicate?.release();
		throw error;
	});
}
/** Current rows are read in the existing worker; mutations carry the prepared source. */
async function captureSessionEntryCurrentCheckAsyncInternal(params) {
	const prepared = await prepareSessionEntryCurrentCheck(params);
	return {
		entry: prepared.entry,
		isCurrent: prepared.isCurrentAsync,
		assertCurrent: prepared.assertCurrentAsync,
		source: prepared.source,
		entryCurrent: prepared.entryCurrent,
		release: prepared.release
	};
}
//#endregion
export { captureSessionEntryCurrentCheckAsyncInternal as t };
