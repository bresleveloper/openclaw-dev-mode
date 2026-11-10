import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync } from "../../sqlite-worker-identity-DLqVBf5J.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as sqlPublicationAnchor } from "../../sql-connection-DmQzXTVz.mjs";
import { U as withSqliteDatabaseWriteScope } from "../../sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications, i as prepareSqliteTransactionCommit, s as stageSqliteTransactionState } from "../../sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "../../kysely-sync-9fPQaMlh.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "../../openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as runSqliteSingleStatementSync, l as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "../../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "../../openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as captureSessionRowChanges } from "../../session-row-changes-vFaNnKNM.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "../../openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as createSqliteCommitReceipt } from "../../sqlite-commit-receipt-DafgyYOc.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "../../openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { v as ensureSessionParticipantsSchema } from "../../openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen } from "../../openclaw-agent-db-_fC-kf1x.mjs";
import "../../user-profile-list-BdNJnrJe.mjs";
import { t as isInternalSessionEffectsKey } from "../../internal-session-key-B6hhdgLR.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "../../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as publishSessionSharingMemberChange } from "../../session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { n as participantIdentityNamespace, o as sessionEntryCaches, r as readParticipantIdentity, t as mergeParticipantAggregate } from "../../session-participant-identity-Btc25HNW.mjs";
import { n as emitSessionLifecycleEvent } from "../../session-lifecycle-events-76OxWRqj.mjs";
import { s as MAX_SESSION_PARTICIPANTS } from "../../session-entry-lineage-B7Mubzwj.mjs";
import { n as parseSessionEntryJson, r as selectSessionEntryRows } from "../../session-accessor.sqlite-status-B58ALiNV.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "../../session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "../../session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { d as prepareSessionActorParticipantUpdate, f as readSessionActorParticipants, o as readSqliteSessionParticipantProjection } from "../../session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { i as publishSessionEntryCacheParticipantUpdate, s as trackSessionEntryCacheWrite, t as prepareSessionEntryCacheWrite } from "../../session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { _ as validateDeliveryCanonicalSessionEntry, i as prepareExactSessionEntryRowReads, o as readExactSessionEntryRow } from "../../session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as writeSessionEntry } from "../../session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as sessionMetadataExpectedEntryMatches, t as assignSessionOwner } from "../../session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { n as mergeSessionProfileInvolvement, t as isNewerSessionMention } from "../../session-involvement-BgsP4dje.mjs";
import { r as readUserProfileAliasesNative } from "../../user-profile-list.native-CFnyItI2.mjs";
import { n as readSessionGroupCatalogEntry } from "../../session-group-catalog.kernel-CnGzKY3A.mjs";
import { t as readSessionEntryInstanceId } from "../../session-accessor.sqlite-entry-identity-DNiqiZkm.mjs";
import { t as getSessionMemberKysely } from "../../session-sharing-store.kernel-DHH7VvHM.mjs";
import { a as releaseSessionSuggestionDispatchInDatabase, n as claimSessionSuggestionDispatchInDatabase, r as finalizeSessionSuggestionClaimInDatabase, t as addSessionSuggestionInDatabase } from "../../session-suggestion-store.kernel-C7B_i7gt.mjs";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-involvement.worker.ts
/** One logical-node owner for explicit personal choices and committed mentions. */
function updatePreparedSessionProfileInvolvement(scope, params, profiles) {
	const resolved = resolveSqliteScope(scope);
	return runOpenClawAgentWriteTransaction((database) => {
		params.assertCurrent?.();
		const current = readExactSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (!current || current.sessionId !== params.expectedSessionId || current.incognito) return {
			accepted: false,
			changed: false
		};
		if (params.expectedEntry && !sessionMetadataExpectedEntryMatches(database, resolved.sessionKey, params.expectedEntry)) return {
			accepted: false,
			changed: false
		};
		const involvement = { ...current.profileInvolvement?.profiles };
		let changed = false;
		for (const { profileId, aliases } of profiles) {
			const previous = mergeSessionProfileInvolvement([...aliases].map((alias) => involvement[alias]));
			const lastMention = previous?.lastMention;
			const change = params.change;
			if (change.kind === "mention" && lastMention && !isNewerSessionMention(change.source, lastMention)) continue;
			const hidden = change.kind === "visibility" && change.hidden;
			if (change.kind === "visibility" && previous?.hidden === hidden) continue;
			for (const alias of aliases) delete involvement[alias];
			involvement[profileId] = {
				hidden,
				updatedAt: Math.max(Date.now(), (previous?.updatedAt ?? 0) + 1),
				...change.kind === "mention" ? { lastMention: change.source } : lastMention ? { lastMention } : {}
			};
			changed = true;
		}
		if (changed) {
			writeSessionEntry(database, resolved.sessionKey, current, {
				canonicalPreviousEntry: current,
				profileInvolvement: {
					key: resolved.sessionKey,
					profiles: involvement
				}
			});
			deferOpenClawAgentPostCommitPublication(database, () => emitSessionLifecycleEvent({
				agentId: resolved.agentId,
				sessionKey: resolved.sessionKey,
				reason: "involvement"
			}));
		}
		return {
			accepted: true,
			changed
		};
	}, toDatabaseOptions(resolved), { operationLabel: "sessions.involvement" });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participants.native.ts
/** The sharing worker already holds its agent transaction when resolving profile aliases. */
function recordSessionParticipantFromWorker(database, scope, params) {
	return recordSessionParticipantWithAliasRead(scope, params, () => readUserProfileAliasesNative(params.identity.id, { env: scope.env }), database);
}
function recordSessionParticipantWithAliasRead(scope, params, readAliases, transaction) {
	const actorId = params.identity.id;
	if (!actorId || params.identity.type === "agent" && actorId === params.sessionAgentId) return {
		value: null,
		projectionChanged: false
	};
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const promptedAt = params.promptedAt ?? Date.now();
	const namespace = participantIdentityNamespace(params.identity);
	const write = (database) => {
		ensureSessionParticipantsSchema(database.db);
		const kysely = getSessionKysely(database.db);
		const participants = readSessionActorParticipants(database, resolved.sessionKey);
		const publishActor = prepareSessionActorParticipantUpdate(database, resolved.sessionKey);
		const retainedRows = participants?.map((participant) => ({
			actor_id: participant.identity.id,
			identity_namespace: participantIdentityNamespace(participant.identity),
			contribution_count: participant.contributionCount,
			first_prompted_at: participant.firstPromptedAt,
			last_prompted_at: participant.lastPromptedAt
		}));
		const participantQuery = kysely.selectFrom("session_participants").select([
			"actor_id",
			"contribution_count",
			"first_prompted_at",
			"last_prompted_at"
		]).where("session_key", "=", resolved.sessionKey).where("identity_namespace", "=", namespace);
		const exact = retainedRows ? retainedRows.find((row) => row.actor_id === actorId && row.identity_namespace === namespace) : executeSqliteQueryTakeFirstSync(database.db, participantQuery.where("actor_id", "=", actorId));
		let existing = exact?.actor_id === actorId ? exact : void 0;
		if (!existing && params.identity.type === "profile") {
			const aliases = readAliases();
			if (aliases && aliases.size > 1) existing = (retainedRows ? retainedRows.filter((row) => row.identity_namespace === namespace).toSorted((a, b) => Buffer.compare(Buffer.from(a.actor_id), Buffer.from(b.actor_id))) : executeSqliteQuerySync(database.db, participantQuery.orderBy("actor_id")).rows).find((row) => aliases.has(row.actor_id));
		}
		if (!existing) {
			if ((participants ? participants.length : executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("session_participants").select((eb) => eb.fn.countAll().as("count")).where("session_key", "=", resolved.sessionKey))?.count ?? 0) >= MAX_SESSION_PARTICIPANTS) return {
				value: "capped",
				projectionChanged: false
			};
		}
		const aggregate = mergeParticipantAggregate(existing, {
			contribution_count: 1,
			first_prompted_at: promptedAt,
			last_prompted_at: promptedAt
		}, "sum");
		const writeGeneration = trackSessionEntryCacheWrite(database, () => withSqliteDatabaseWriteScope(database.db, [resolved.sessionKey], () => executeSqliteQuerySync(database.db, kysely.insertInto("session_participants").values({
			session_key: resolved.sessionKey,
			identity_namespace: namespace,
			actor_id: existing?.actor_id ?? actorId,
			...aggregate
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"identity_namespace",
			"actor_id"
		]).doUpdateSet(aggregate)))));
		const projectionChanged = !existing || existing.actor_id !== actorId || aggregate.first_prompted_at !== existing.first_prompted_at;
		if (participants && publishActor) {
			const identity = readParticipantIdentity(namespace, existing?.actor_id ?? actorId.toWellFormed());
			publishActor.publish([...participants.filter((participant) => participant.identity.id !== identity.id || participantIdentityNamespace(participant.identity) !== namespace), {
				identity,
				contributionCount: aggregate.contribution_count,
				firstPromptedAt: aggregate.first_prompted_at,
				lastPromptedAt: aggregate.last_prompted_at
			}]);
		}
		publishSessionEntryCacheParticipantUpdate(database, resolved.sessionKey, {
			writeGeneration,
			projectionChanged
		});
		deferOpenClawAgentPostCommitPublication(database, () => emitSessionLifecycleEvent({
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey,
			reason: "participants",
			scope: "session-entry"
		}));
		return {
			value: existing ? "updated" : "inserted",
			projectionChanged
		};
	};
	if (transaction) {
		assertTransactionUsable(transaction.db);
		return write(transaction);
	}
	return runOpenClawAgentWriteTransaction(write, options, { operationLabel: "sessions.record-participant" });
}
//#endregion
//#region src/config/sessions/session-group-categories.kernel.ts
const MIN_BATCHED_CATEGORY_KEYS = 10;
function applySessionGroupCategoryMutation(database, keys, from, to, env) {
	const current = /* @__PURE__ */ new Map();
	const readPrepared = keys.length >= MIN_BATCHED_CATEGORY_KEYS ? prepareExactSessionEntryRowReads(database, keys) : void 0;
	for (const key of keys) {
		const row = readPrepared ? readPrepared(key) : readExactSessionEntryRow(database, key);
		if (row?.entry.category?.trim() === from) current.set(key, row);
	}
	assertSessionGroupCategoryDestination(to, env);
	for (const [key, row] of current) {
		const next = { ...row.entry };
		if (to === void 0) delete next.category;
		else next.category = to;
		writeSessionEntry(database, key, next, {
			canonicalPreviousEntry: row.entry,
			previousEntry: row.entry
		});
	}
	return [...current].map(([sessionKey, { entry }]) => ({
		sessionKey,
		sessionId: entry.sessionId
	}));
}
function assertSessionGroupCategoryDestination(to, env) {
	if (to !== void 0 && !withExistingOpenClawStateDatabaseReadOnly(({ db }) => readSessionGroupCatalogEntry(db, to), { env })) throw new Error(`unknown session group: ${to}`);
}
//#endregion
//#region src/config/sessions/session-group-categories.read.ts
function readSessionGroupCategoryKeys(database, name) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "list").orderBy("session_key")).rows.flatMap((row) => {
		if (isInternalSessionEffectsKey(row.session_key)) return [];
		const entry = parseSessionEntryJson(row, "list");
		if (!entry) return [];
		validateDeliveryCanonicalSessionEntry(row.session_key, entry);
		return entry.category?.trim() === name ? [row.session_key] : [];
	});
}
//#endregion
//#region src/config/sessions/session-participant-contribution.worker.ts
/** A resident contribution changes one row; aliases, new participants and reordering keep the transaction. */
function prepareSessionParticipantContribution(database, scope, params) {
	const resolved = resolveSqliteScope(scope);
	const participants = readSessionActorParticipants(database, resolved.sessionKey);
	const namespace = participantIdentityNamespace(params.identity);
	const existing = participants?.find((participant) => participant.identity.id === params.identity.id && participantIdentityNamespace(participant.identity) === namespace);
	if (!participants || !existing || params.identity.type === "agent" && params.identity.id === params.sessionAgentId) return;
	const promptedAt = params.promptedAt ?? Date.now();
	const aggregate = mergeParticipantAggregate({
		contribution_count: existing.contributionCount,
		first_prompted_at: existing.firstPromptedAt,
		last_prompted_at: existing.lastPromptedAt
	}, {
		contribution_count: 1,
		first_prompted_at: promptedAt,
		last_prompted_at: promptedAt
	}, "sum");
	if (aggregate.first_prompted_at !== existing.firstPromptedAt) return;
	const publishActor = prepareSessionActorParticipantUpdate(database, resolved.sessionKey, true);
	if (!publishActor) return;
	const updated = participants.map((participant) => participant === existing ? {
		identity: participant.identity,
		contributionCount: aggregate.contribution_count,
		firstPromptedAt: aggregate.first_prompted_at,
		lastPromptedAt: aggregate.last_prompted_at
	} : participant);
	const query = getSessionKysely(database.db).insertInto("session_participants").values({
		session_key: resolved.sessionKey,
		identity_namespace: namespace,
		actor_id: existing.identity.id,
		...aggregate
	}).onConflict((conflict) => conflict.columns([
		"session_key",
		"identity_namespace",
		"actor_id"
	]).doUpdateSet(aggregate));
	const completeCacheWrite = prepareSessionEntryCacheWrite(database);
	return {
		result: {
			value: "updated",
			projectionChanged: false,
			participants: {},
			records: updated,
			actorVersion: publishActor.version
		},
		stage() {
			publishActor.publish(updated);
			stageSqliteTransactionState(database.db, {
				stage() {},
				rollback() {},
				commit() {
					publishSessionEntryCacheParticipantUpdate(database, resolved.sessionKey, {
						writeGeneration: completeCacheWrite(),
						projectionChanged: false
					});
				},
				invalidate: () => sessionEntryCaches.delete(database.db)
			});
			deferOpenClawAgentPostCommitPublication(database, () => emitSessionLifecycleEvent({
				agentId: resolved.agentId,
				sessionKey: resolved.sessionKey,
				reason: "participants",
				scope: "session-entry"
			}));
		},
		statement: () => withSqliteDatabaseWriteScope(database.db, [resolved.sessionKey], () => executeSqliteQuerySync(database.db, query))
	};
}
//#endregion
//#region src/config/sessions/session-sharing-store.native.ts
function assertAuthorizedSessionInstance(database, sessionKey, expectedSessionId, expectedEntry) {
	const entry = expectedEntry ? readExactSessionEntryRow(database, sessionKey, "list")?.entry : void 0;
	const sessionId = expectedEntry ? entry?.sessionId : readSessionEntryInstanceId(database, sessionKey);
	if (sessionId === void 0 || expectedSessionId !== void 0 && sessionId !== expectedSessionId) throw new Error("session changed before sharing mutation");
	if (expectedEntry) {
		if (!entry || !isDeepStrictEqual({
			sessionId: entry.sessionId,
			createdActor: entry.createdActor,
			visibility: entry.visibility,
			incognito: entry.incognito
		}, expectedEntry)) throw new Error("session ownership changed before sharing mutation");
	}
	return sessionId;
}
function publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, identityId, present) {
	publishSessionSharingMemberChange(database, sessionKey, {
		kind: "member",
		sessionId,
		identityId: toUSVString(identityId),
		present
	}, agentId);
}
function addSessionMember(scope, params) {
	const identityId = params.identityId.trim();
	const addedBy = params.addedBy.trim();
	if (!identityId || !addedBy) throw new Error("session member identity and actor are required");
	const resolved = resolveSqliteScope(scope);
	const { agentId, sessionKey } = resolved;
	const addedAt = params.addedAt ?? Date.now();
	const inserted = runOpenClawAgentWriteTransaction((database) => {
		const sessionId = assertAuthorizedSessionInstance(database, sessionKey, params.expectedSessionId, params.expectedEntry);
		const db = getSessionMemberKysely(database);
		const changed = (withSqliteDatabaseWriteScope(database.db, [sessionKey], () => executeSqliteQuerySync(database.db, db.insertInto("session_members").values({
			session_key: sessionKey,
			identity_id: identityId,
			added_by: addedBy,
			added_at: addedAt
		}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()))).numAffectedRows ?? 0n) > 0n;
		if (changed) publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, identityId, true);
		return changed;
	}, toDatabaseOptions(resolved), { operationLabel: "session.sharing.add-member" });
	return {
		member: {
			identityId,
			addedBy,
			addedAt
		},
		inserted
	};
}
function removeSessionMember(scope, identityId, expected, expectedSessionId, expectedEntry) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return null;
	const resolved = resolveSqliteScope(scope);
	const { agentId, sessionKey } = resolved;
	return runOpenClawAgentWriteTransaction((database) => {
		const sessionId = assertAuthorizedSessionInstance(database, sessionKey, expectedSessionId, expectedEntry);
		const db = getSessionMemberKysely(database);
		if (expected && expected.addedBy !== toUSVString(expected.addedBy)) return null;
		let removal = db.deleteFrom("session_members").where("session_key", "=", sessionKey).where("identity_id", "=", normalizedIdentityId);
		if (expected) removal = removal.where("added_by", "=", expected.addedBy).where("added_at", "=", expected.addedAt);
		const row = withSqliteDatabaseWriteScope(database.db, [sessionKey], () => executeSqliteQueryTakeFirstSync(database.db, removal.returning([
			"identity_id",
			"added_by",
			"added_at"
		])));
		if (!row) return null;
		publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, normalizedIdentityId, false);
		return {
			identityId: row.identity_id,
			addedBy: row.added_by,
			addedAt: row.added_at
		};
	}, toDatabaseOptions(resolved), { operationLabel: "session.sharing.remove-member" });
}
//#endregion
//#region src/config/sessions/session-sharing-store.worker.ts
/** The canonical agent executor retains the connection and both live admission checks. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	const source = readOpenClawAgentDatabaseIdentity({ db });
	let categoryPlan;
	const workerDatabase = (scope) => {
		const database = getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(resolveSqliteScope(scope)));
		if (!database || database.db !== db || database.path !== context.databasePath) throw new Error("Session collaboration write lost its physical store owner");
		return database;
	};
	return {
		execute(command) {
			const scope = { ...command.input.scope };
			const target = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteScope(scope)));
			if (!(db.location() ? readDatabasePathIdentitySync(target).canonicalPath === context.databasePath : target === context.databasePath && getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(resolveSqliteScope(scope)))?.db === db)) throw new Error("Session collaboration target changed its database owner");
			scope.storePath = context.databasePath;
			if (command.type === "category.prepare") {
				const database = workerDatabase(scope);
				categoryPlan = {
					from: command.input.from,
					storePath: database.path,
					keys: readSessionGroupCategoryKeys(database, command.input.from)
				};
				return categoryPlan.keys;
			}
			if (command.type === "participant" && typeof source.identity === "string") {
				const contribution = prepareSessionParticipantContribution(workerDatabase(scope), scope, command.input.params);
				if (contribution) {
					const candidate = {
						kind: "session-collaboration-committed",
						type: command.type,
						result: contribution.result,
						publication: createSqliteCommitReceipt({
							source,
							domain: "session-collaboration",
							keys: [scope.sessionKey],
							readFact: () => ({ kind: "unchanged" })
						})
					};
					context.admit("transaction");
					context.admit("commit", (request, dispatch) => {
						if (!isRecord(request.facts)) throw new Error("Session collaboration commit omitted its facts");
						dispatch({
							...request,
							facts: {
								...request.facts,
								publication: candidate
							}
						});
					});
					return runSqliteSingleStatementSync(db, () => {
						contribution.stage();
						deferSqliteWorkerCommitReceipt(db, candidate);
						prepareSqliteTransactionCommit(sqlPublicationAnchor(db));
						contribution.statement();
						return contribution.result;
					});
				}
			}
			let candidate;
			let keys = [scope.sessionKey];
			let participantResult;
			let membershipResult;
			let ownerResult;
			return withSqlitePostCommitPublications(sqlPublicationAnchor(db), () => runSqliteWorkerTransactionSync({
				...context,
				admit(stage) {
					context.admit(stage, stage === "commit" && typeof source.identity === "string" ? (request, dispatch) => {
						if (!candidate || !isRecord(request.facts)) throw new Error("Session collaboration commit omitted its candidate");
						dispatch({
							...request,
							facts: {
								...request.facts,
								publication: candidate
							}
						});
					} : void 0);
				}
			}, () => {
				const captured = captureSessionRowChanges(db, () => {
					if (command.type === "involvement") return updatePreparedSessionProfileInvolvement(scope, command.input.params, command.input.profiles);
					if (command.type === "owner.assign") {
						ownerResult = { value: assignSessionOwner(scope, command.input.params) };
						return ownerResult;
					}
					if (command.type === "suggestion.add") {
						const database = workerDatabase(scope);
						return addSessionSuggestionInDatabase(database, scope.sessionKey, command.input.params);
					}
					if (command.type === "suggestion.claim") {
						const database = workerDatabase(scope);
						return claimSessionSuggestionDispatchInDatabase(database, scope.sessionKey, command.input.params);
					}
					if (command.type === "suggestion.release") {
						const database = workerDatabase(scope);
						return releaseSessionSuggestionDispatchInDatabase(database, scope.sessionKey, command.input.params);
					}
					if (command.type === "suggestion.finalize") {
						const database = workerDatabase(scope);
						return finalizeSessionSuggestionClaimInDatabase(database, scope.sessionKey, command.input.params);
					}
					if (command.type === "category.apply") {
						const database = workerDatabase(scope);
						if (!categoryPlan || categoryPlan.from !== command.input.from || categoryPlan.storePath !== database.path) throw new Error("Session group category mutation has no matching prepared rows");
						keys = categoryPlan.keys;
						return applySessionGroupCategoryMutation(database, categoryPlan.keys, command.input.from, command.input.to, scope.env ?? process.env);
					}
					if (command.type === "participant") {
						const result = recordSessionParticipantFromWorker(workerDatabase(scope), scope, command.input.params);
						participantResult = {
							...result,
							participants: result.projectionChanged ? readSqliteSessionParticipantProjection(db, scope.sessionKey) : {}
						};
						return participantResult;
					}
					if (command.type === "add") {
						const result = { value: addSessionMember(scope, command.input.params) };
						membershipResult = result;
						return result;
					}
					const result = { value: removeSessionMember(scope, command.input.identityId, command.input.expected, command.input.expectedSessionId, command.input.expectedEntry) };
					membershipResult = result;
					return result;
				});
				const factsByKey = /* @__PURE__ */ new Map();
				const recordFact = (sessionKey, facts) => {
					const current = factsByKey.get(sessionKey) ?? [];
					current.push(facts);
					factsByKey.set(sessionKey, current);
				};
				for (const change of captured.changes) {
					if (!("sessionKey" in change) || !change.facts) continue;
					const facts = change.facts;
					if (membershipResult && facts.kind === "member") {
						membershipResult.facts = facts;
						recordFact(change.sessionKey, facts);
					} else if (ownerResult && facts.kind === "owner") {
						ownerResult.facts = facts;
						recordFact(change.sessionKey, facts);
					} else if (participantResult?.projectionChanged && facts.kind === "participants") recordFact(change.sessionKey, {
						...facts,
						projection: participantResult.participants
					});
					else if (command.type === "category.apply" && facts.kind === "entry") recordFact(change.sessionKey, {
						kind: "category",
						sessionId: facts.sessionId,
						category: facts.category
					});
					else if (command.type === "involvement" && facts.kind === "entry") recordFact(change.sessionKey, { kind: "unchanged" });
				}
				if (typeof source.identity === "string") {
					const publication = createSqliteCommitReceipt({
						source,
						domain: "session-collaboration",
						keys,
						readFact: (key) => {
							const current = factsByKey.get(key);
							return current && current.length > 0 ? {
								kind: "postimage",
								value: current
							} : { kind: "unchanged" };
						}
					});
					candidate = {
						kind: "session-collaboration-committed",
						type: command.type,
						result: captured.result,
						publication
					};
					deferSqliteWorkerCommitReceipt(db, candidate);
				}
				return captured.result;
			}, {
				operationLabel: `sessions.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath
			}));
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Session collaboration transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
