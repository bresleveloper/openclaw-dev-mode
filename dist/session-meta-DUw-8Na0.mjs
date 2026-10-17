import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { F as captureRuntimeConfigWithSource } from "./runtime-snapshot-DYptB0Cf.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-BSum32pK.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { l as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { y as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { c as legacyAcpMigrationBindingMatches, d as recordLegacyAcpMigrationCompletion, n as readLegacyAcpMigrationContext } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { x as kickSessionEntryMaintenanceAfterWrite } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { a as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { i as kickSessionHistoryDiskBudgetMaintenance } from "./session-history-eviction-D6jaTF6N.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { t as captureMaintenanceConfigAsyncReader } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { r as patchSessionEntryWithKey } from "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { a as parseAcpDatabaseSessionKeyCandidates, d as selectLegacyFreeAcpSessionRows, f as upsertAcpSessionMetaRow, i as legacyAcpDatabaseSessionKeys, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, r as getAcpSessionKysely, s as resolveReadableAcpSessionRow, t as acpSessionRowMatchesEntry, u as selectAcpSessionRowForStoreEntry } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { n as resolveSessionStorePathForAcp, t as readSessionEntryFromStore } from "./session-meta-store-C2kPc7n-.mjs";
import { a as resolveAcpSessionControlOwner, i as matchesAcpSessionRuntimeLocator, n as captureAcpSessionEntryBinding, t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-Cn1WSw9n.mjs";
import { n as readAcpSessionMetaForEntry, r as rowToAcpSessionMeta, t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CvCR0QQG.mjs";
import { n as bindAcpSessionMeta, t as applyAcpSessionMutation } from "./session-meta-write.kernel-BOulBPup.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { MessagePort } from "node:worker_threads";
//#region src/acp/runtime/session-meta-read-context.ts
/** Capture routing inputs before a read yields, retaining the caller's live assertion. */
async function captureAcpSessionReadContext(params) {
	const cwd = tryProcessCwd();
	const assertCallerCurrent = params.assertCurrent;
	const databasePath = params.databasePath ? path.resolve(params.databasePath) : void 0;
	const suppliedEnv = params.env ? cloneEnvWithPlatformSemantics(params.env) : void 0;
	const assertInputCurrent = () => {
		assertCallerCurrent?.();
		if (tryProcessCwd() !== cwd) throw new Error("ACP session read working directory changed; retry the read.");
	};
	assertInputCurrent();
	let assertCurrent = assertInputCurrent;
	let captured;
	if (params.cfg) captured = {
		config: captureRuntimeConfigWithSource(params.cfg, params.cfg),
		env: cloneEnvWithPlatformSemantics(process.env)
	};
	else {
		const read = captureRuntimeConfigAsyncReader({
			capture: true,
			assertCurrent: assertInputCurrent
		});
		captured = await read();
		assertCurrent = read.assertCurrent;
	}
	assertCurrent();
	const env = suppliedEnv ?? captured.env;
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	return {
		cfg: captured.config,
		env,
		databasePath,
		assertCurrent
	};
}
//#endregion
//#region src/acp/runtime/session-meta-list.ts
/** Join ACP metadata through the existing shared-state and physical session readers. */
async function listAcpSessionEntries(params) {
	const { cfg, env, databasePath, assertCurrent } = await captureAcpSessionReadContext(params);
	const result = await executeExistingOpenClawStateRead({
		env,
		path: databasePath
	}, { type: "acpSessions.list" });
	assertCurrent();
	if (!result) return [];
	if (!result.ok || result.type !== "acpSessions.list") throw new Error("Unexpected ACP session list read result");
	const entries = [];
	for (const row of result.rows) for (const identity of parseAcpDatabaseSessionKeyCandidates(row.session_key)) {
		const sessionKey = identity.storeSessionKey;
		const { agentId, storePath } = resolveSessionStorePathForAcp({
			sessionKey,
			agentId: identity.agentId,
			cfg,
			env
		});
		const storeSessionKey = normalizeStoreSessionKey(sessionKey);
		if (!storePath || !storeSessionKey) continue;
		const joined = await withSessionEntryReadOnlyInWorker({
			agentId,
			storePath,
			sessionKey: storeSessionKey,
			env
		}, assertCurrent, async (read) => {
			if (!read.ok || !read.value) return;
			const entry = read.value;
			const readableRow = resolveReadableAcpSessionRow({
				row,
				entry
			});
			return readableRow ? {
				cfg,
				agentId,
				storePath,
				sessionKey,
				storeSessionKey,
				entry,
				acp: rowToAcpSessionMeta(readableRow)
			} : void 0;
		});
		if (joined) {
			entries.push(joined);
			break;
		}
	}
	assertCurrent();
	return entries;
}
//#endregion
//#region src/acp/runtime/session-meta-read.ts
/** Retain the canonical session source through its lifecycle-bound ACP metadata join. */
async function readAcpSessionEntryAsync(params) {
	return withAcpSessionEntryRead(params, (entry) => entry);
}
/** The consuming owner can verify the exact selected physical source before custody ends. */
async function withAcpSessionEntryRead(params, consume, options = {}) {
	const input = { ...params };
	const sessionKey = input.sessionKey.trim();
	input.assertCurrent?.();
	if (!sessionKey) return consume(null, void 0);
	const { cfg, env, databasePath, assertCurrent } = await captureAcpSessionReadContext(input);
	assertCurrent();
	const target = resolveSessionStorePathForAcp({
		...input,
		sessionKey,
		cfg,
		env
	});
	const storeSessionKey = normalizeStoreSessionKey(target.storeSessionKey);
	if (isIncognitoSessionKey(storeSessionKey)) {
		const stored = readSessionEntryFromStore({
			...input,
			sessionKey,
			cfg,
			env
		});
		const acp = readAcpSessionMetaForEntry({
			sessionKey: stored.storeSessionKey,
			agentId: stored.agentId,
			cfg,
			entry: stored.entry,
			env,
			databasePath
		}, { current: options.currentMetadata });
		assertCurrent();
		return consume({
			...target,
			...stored,
			storePath: target.storePath,
			sessionKey,
			acp
		}, {
			kind: "native",
			assertCurrent
		});
	}
	return await withSessionEntryReadOnlyInWorker({
		agentId: target.agentId,
		storePath: target.storePath,
		sessionKey: storeSessionKey,
		env
	}, assertCurrent, async (read, owner) => {
		const entry = read.ok ? read.value : void 0;
		const [acp] = await readAcpSessionMetaForEntries({
			entries: [{
				sessionKey: storeSessionKey,
				agentId: target.agentId,
				entry
			}],
			cfg,
			env,
			databasePath
		}, { current: options.currentMetadata });
		assertCurrent();
		return consume({
			cfg,
			agentId: target.agentId,
			storePath: target.storePath,
			sessionKey,
			storeSessionKey,
			entry,
			acp: acp ?? void 0,
			...!read.ok ? { storeReadFailed: true } : {}
		}, owner);
	});
}
async function readAcpSessionMetaAsync(params) {
	return (await readAcpSessionEntryAsync({
		...params,
		clone: false
	}))?.acp;
}
//#endregion
//#region src/acp/runtime/session-meta-entry.ts
async function updateAcpSessionStoreEntry(params) {
	let admitted;
	let publication;
	let result;
	const { options, execution, scope } = params;
	const maintenanceConfig = await params.prepareMaintenance();
	params.assertCurrent();
	await withSessionEntryWorker(options, execution.fileIdentity?.physicalIdentity, params.assertCurrent, async (owner, source) => {
		source.onRegistryChange = params.readOwner.onRegistryChange;
		await params.readOwner.refreshBeforeDispatch?.(() => owner.assertCurrent());
		await owner.prepare(source);
		params.assertCurrent();
		const identity = owner.fileIdentity;
		if (!identity) throw new Error("ACP entry mutation has no admitted physical owner");
		publication = retainSessionEntryWorkerPublication({
			agentId: options.agentId,
			storePath: options.path,
			databaseIdentity: identity.physicalIdentity
		});
		if (!await owner.runExisting(source, async (worker) => {
			const outcome = await worker.execute({
				type: "session.entry.acp",
				input: {
					agentId: scope.agentId,
					sessionKey: scope.sessionKey,
					mutation: params.mutation,
					expectedEntry: params.expectedEntry === null ? null : captureAcpSessionEntryBinding(params.expectedEntry),
					expectedControlBinding: params.expectedControlBinding
				}
			}).then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			if (admitted) {
				await admitted.retained.settled;
				const receipt = admitted.admission.committed?.facts;
				if (isRecord(receipt) && receipt.kind === "acp-entry-mutation") result = receipt.result;
				const unknown = admitted.admission.settlement?.kind !== "completed" || !result;
				const published = publication?.settle(result?.publication, unknown);
				if (published) publishCommittedSessionIdentity(scope.agentId, identity.physicalIdentity, published.previous, published.current, published.prepared);
				if (unknown) throw new SqliteWorkerError("ACP entry mutation has no confirmed native settlement", "outcome-unknown");
			}
			if (!outcome.ok) throw outcome.error;
			result ??= outcome.value;
			return result;
		})) throw new Error("ACP entry database disappeared before mutation");
		await params.readOwner.revalidateTarget?.();
	}, (admission, retained, facts) => {
		admitted = {
			admission,
			retained
		};
		if (isRecord(facts) && isRecord(facts.publication) && facts.publication.kind === "session-entry-replacements") {
			const receipt = facts.publication;
			publication?.begin(receipt.changedKeys, receipt.membershipInvalidatedKeys, receipt.sharingUnchangedKeys);
		}
	}, execution);
	if (!result) throw new Error("ACP entry mutation returned no result");
	params.assertCurrent();
	if (result.publication) kickSessionEntryMaintenanceAfterWrite({
		activeSessionKey: scope.sessionKey,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(scope),
		scope,
		skipMaintenance: params.skipMaintenance,
		maintenanceConfig,
		storePath: params.storePath
	});
	kickSessionHistoryDiskBudgetMaintenance({
		agentId: scope.agentId,
		env: scope.env,
		storePath: params.storePath,
		maintenanceConfig
	});
	return result;
}
//#endregion
//#region src/acp/runtime/session-meta-legacy-cleanup.ts
async function clearLegacyEmbeddedAcpMetadata(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => sessionKey?.trim()).filter((sessionKey) => Boolean(sessionKey)));
	for (const sessionKey of sessionKeys) if (!await patchSessionEntryWithKey({
		storePath: params.storePath,
		agentId: params.agentId,
		sessionKey
	}, (entry, context) => {
		if (params.expectedEntry !== void 0) assertAcpSessionMutationEntry(context.existingEntry, params.expectedEntry, params.expectedControlBinding, "entry mutation");
		if (!entry.acp) return null;
		const next = { ...entry };
		delete next.acp;
		return next;
	}, {
		replaceEntry: true,
		skipMaintenance: true,
		assertCommitAllowed: params.assertCommitAllowed
	}) && params.expectedEntry !== void 0) assertAcpSessionMutationEntry(void 0, params.expectedEntry, params.expectedControlBinding, "entry mutation");
}
//#endregion
//#region src/acp/runtime/session-meta-write.native.ts
function sessionStoreUpdateOptions(params) {
	return {
		activeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
		...params.skipMaintenance === true ? { skipMaintenance: true } : {},
		...params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}
	};
}
function consumeLegacyAcpMigrationSources(params) {
	const current = readLegacyAcpMigrationContext(params);
	assertAcpSessionMutationEntry(current.entry, params.entry ?? null, params.expectedControlBinding, "legacy source consumption");
	for (const source of current.sources) if (legacyAcpMigrationBindingMatches(source, current.entry)) recordLegacyAcpMigrationCompletion(params.database, source, params.now);
}
async function upsertAcpSessionMetaNative(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env,
		clone: false
	});
	if (!storeEntry.storePath) return null;
	const { entry, storePath } = storeEntry;
	const storageSessionKey = storeEntry.storeSessionKey;
	let current;
	let currentRowKey;
	let nextMeta;
	let preparedEntry;
	const updatedAt = params.now?.() ?? Date.now();
	runOpenClawStateWriteTransaction((database) => {
		params.assertCommitAllowed?.();
		const fresh = readLegacyAcpMigrationContext({
			agentId: storeEntry.agentId,
			storePath,
			sessionKey: storageSessionKey,
			env: params.env
		});
		assertAcpSessionMutationEntry(fresh.entry, entry ?? null, params.expectedControlBinding, "metadata preparation");
		const currentRow = selectAcpSessionRowForStoreEntry(database.db, storageSessionKey, storeEntry.agentId, storeEntry.cfg, entry);
		currentRowKey = currentRow?.session_key;
		current = currentRow ? rowToAcpSessionMeta(currentRow) : void 0;
		preparedEntry = mergeSessionEntry(entry, {
			updatedAt,
			...entry ? {} : { lifecycleRevision: randomUUID() }
		});
		nextMeta = params.mutate(current, current ? mergeSessionEntry(preparedEntry, { acp: current }) : entry);
	}, {
		env: params.env,
		path: params.databasePath
	});
	const publish = (publishedSessionKey, publishedEntry, decision) => {
		return runOpenClawStateWriteTransaction((database) => {
			params.assertCommitAllowed?.();
			consumeLegacyAcpMigrationSources({
				database: database.db,
				agentId: storeEntry.agentId,
				storePath,
				sessionKey: publishedSessionKey,
				entry: publishedEntry,
				expectedControlBinding: params.expectedControlBinding,
				env: params.env,
				now: updatedAt
			});
			applyAcpSessionMutation(database.db, {
				agentId: storeEntry.agentId,
				storageSessionKey,
				sessionKey: publishedSessionKey,
				entry: publishedEntry,
				currentRowKey,
				decision
			});
			sessionChanges.emit({
				agentId: storeEntry.agentId,
				sessionKey: publishedSessionKey
			}, database.db);
		}, {
			env: params.env,
			path: params.databasePath
		});
	};
	const metaToPersist = nextMeta;
	if (metaToPersist === void 0) return current ? mergeSessionEntry(entry, { acp: current }) : entry ?? null;
	if (metaToPersist === null) {
		const patched = entry ? await patchSessionEntryWithKey({
			...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
			storePath: storeEntry.storePath,
			sessionKey: storageSessionKey
		}, (currentEntry, context) => {
			assertAcpSessionMutationEntry(context.existingEntry, entry ?? null, params.expectedControlBinding, "entry mutation");
			const next = { ...currentEntry };
			delete next.acp;
			return next;
		}, {
			...sessionStoreUpdateOptions({
				...params,
				sessionKey: storageSessionKey
			}),
			replaceEntry: true,
			assertCommitAllowed: params.assertCommitAllowed
		}) : null;
		publish(patched?.sessionKey ?? storageSessionKey, patched?.entry ?? entry, { kind: "clear" });
		await clearLegacyEmbeddedAcpMetadata({
			agentId: storeEntry.agentId,
			storePath: storeEntry.storePath,
			sessionKeys: [storageSessionKey, patched?.sessionKey],
			expectedEntry: patched?.entry ?? entry ?? null,
			expectedControlBinding: params.expectedControlBinding,
			assertCommitAllowed: params.assertCommitAllowed
		});
		return patched?.entry ?? null;
	}
	const persisted = await patchSessionEntryWithKey({
		...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
		storePath: storeEntry.storePath,
		sessionKey: storageSessionKey
	}, (currentEntry, context) => {
		assertAcpSessionMutationEntry(context.existingEntry, entry ?? null, params.expectedControlBinding, "entry mutation");
		const next = mergeSessionEntry(currentEntry, { updatedAt });
		delete next.acp;
		return next;
	}, {
		...sessionStoreUpdateOptions({
			...params,
			sessionKey: storageSessionKey
		}),
		fallbackEntry: preparedEntry,
		replaceEntry: true,
		assertCommitAllowed: params.assertCommitAllowed
	});
	if (!persisted) return null;
	await clearLegacyEmbeddedAcpMetadata({
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKeys: [storageSessionKey, persisted.sessionKey],
		expectedEntry: persisted.entry,
		expectedControlBinding: params.expectedControlBinding,
		assertCommitAllowed: params.assertCommitAllowed
	});
	publish(persisted.sessionKey, persisted.entry, {
		kind: "set",
		meta: metaToPersist
	});
	return mergeSessionEntry(persisted.entry, { acp: metaToPersist });
}
//#endregion
//#region src/acp/runtime/session-meta-write.ts
/** File-backed writes retain their read source through both canonical storage owners. */
async function upsertAcpSessionMeta(params) {
	return mutateAcpSessionMeta(params);
}
/** Private control updates cannot recreate metadata that disappeared after preparation. */
async function upsertAcpSessionMetaForControl(params, constraint) {
	return mutateAcpSessionMeta(params, structuredClone(constraint));
}
async function mutateAcpSessionMeta(params, control) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const expectedControlBinding = params.expectedControlBinding ? {
		sessionId: params.expectedControlBinding.sessionId,
		lifecycleRevision: params.expectedControlBinding.lifecycleRevision,
		sessionStartedAt: params.expectedControlBinding.sessionStartedAt,
		ownerKey: params.expectedControlBinding.ownerKey
	} : void 0;
	const captured = await captureAcpSessionReadContext({
		...params,
		assertCurrent: params.assertCommitAllowed
	});
	const store = resolveSessionStorePathForAcp({
		...captured,
		sessionKey,
		agentId: params.agentId
	});
	const mutateNative = (assertCommitAllowed = captured.assertCurrent) => {
		if (control) throw new Error("ACP controlled metadata mutation requires its durable worker source");
		return upsertAcpSessionMetaNative({
			...params,
			...captured,
			expectedControlBinding,
			assertCommitAllowed
		});
	};
	if (isIncognitoSessionKey(sessionKey)) return mutateNative();
	return withSessionEntryReadOnlyInWorker({
		agentId: store.agentId,
		storePath: store.storePath,
		sessionKey: store.storeSessionKey,
		env: captured.env
	}, captured.assertCurrent, async (read, readOwner) => {
		if (!read.ok) throw read.error;
		const entry = read.value;
		const readerScope = readOwner.scope;
		if (readOwner.kind === "native") return mutateNative();
		if (!readerScope?.storePath) throw new Error("ACP mutation has no retained canonical source");
		const options = {
			agentId: readerScope.databaseAgentId ?? readerScope.agentId ?? store.agentId,
			path: readerScope.storePath,
			env: captured.env
		};
		if (!supportsOpenClawAgentDatabaseExecution(options)) return mutateNative(readOwner.assertCurrent);
		const identity = readDatabasePathIdentitySync(options.path);
		const context = captureOpenClawStateWorkerContext({
			path: captured.databasePath,
			env: captured.env
		});
		const prepareMaintenance = captureMaintenanceConfigAsyncReader(captured.assertCurrent);
		const key = normalizeStoreSessionKey(store.storeSessionKey);
		const metadataRead = {
			keys: [buildAcpDatabaseSessionKey(key, store.agentId), ...legacyAcpDatabaseSessionKeys(key, store.agentId, captured.cfg)],
			legacyKey: resolveLegacyFreeAcpSessionKey(key)
		};
		if (control && (control.agentId !== store.agentId || control.sessionKey !== key || control.source.agentId !== options.agentId || !isDeepStrictEqual(control.source.identity, identity) || !isDeepStrictEqual(control.sharedSource.identity, context.admission.identity) || !isDeepStrictEqual(control.read.keys, metadataRead.keys) || control.read.legacyKey !== metadataRead.legacyKey)) throw new Error("ACP controlled metadata mutation does not match its prepared target");
		const updatedAt = params.now?.() ?? Date.now();
		const execution = captureOpenClawAgentDatabaseExecution(options, identity.key.startsWith("file:") ? { expectedIdentity: {
			kind: "file",
			physicalIdentity: identity.key.slice(5),
			nativeLocation: identity.canonicalPath,
			birthtime: identity.birthtime
		} } : { expectedCreationIdentity: identity });
		const assertCurrent = () => {
			captured.assertCurrent();
			readOwner.assertCurrent();
			execution.assertCurrent();
			context.admission.assertCurrent();
			prepareMaintenance.assertCurrent();
		};
		const source = () => {
			const accepted = execution.fileIdentity;
			return {
				agentId: options.agentId,
				path: options.path,
				identity: accepted ? {
					key: `file:${accepted.physicalIdentity}`,
					canonicalPath: identity.canonicalPath,
					birthtime: accepted.birthtime
				} : identity
			};
		};
		let decision;
		try {
			const nonce = randomUUID();
			const preparation = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "acp.prepareMutation",
				input: {
					nonce,
					read: {
						...metadataRead,
						entry
					},
					entry,
					updatedAt,
					source: source(),
					sessionKey: key,
					agentId: store.agentId,
					expectedControlBinding,
					control
				}
			}), {
				assertCurrent,
				createAdmission() {
					let phase = "transaction";
					const admission = createSqliteWorkerOperationAdmission((request, grant) => {
						const facts = request.facts;
						const port = isRecord(facts) && facts.preparationPort instanceof MessagePort ? facts.preparationPort : void 0;
						try {
							assertCurrent();
							if (!isRecord(facts) || facts.nonce !== nonce || request.stage !== phase) throw new Error("ACP callback differs from its retained transaction");
							if (request.stage === "transaction") {
								if (!port || decision) throw new Error("ACP callback has no unique decision port");
								const prepared = facts.preparation;
								const next = params.mutate(prepared.current, prepared.current ? mergeSessionEntry(prepared.preparedEntry, { acp: prepared.current }) : prepared.entry);
								decision = next === void 0 ? { kind: "keep" } : next === null ? { kind: "clear" } : {
									kind: "set",
									meta: next
								};
								assertCurrent();
								port.postMessage(decision, []);
								phase = "commit";
							} else phase = "settled";
							if (!grant()) throw new Error("ACP callback admission expired");
						} finally {
							port?.close();
						}
					});
					return {
						nativeLocations: [context.admission.databasePath, options.path],
						admission
					};
				}
			});
			assertCurrent();
			const selected = decision;
			if (!selected) throw new Error("ACP metadata mutation returned no decision");
			if (selected.kind === "keep") return preparation.current ? mergeSessionEntry(preparation.entry, { acp: preparation.current }) : preparation.entry ?? null;
			const scope = {
				agentId: store.agentId,
				databaseAgentId: options.agentId,
				path: options.path,
				env: captured.env,
				sessionKey: resolveSqliteSessionKey(key, store.agentId)
			};
			const update = (mutation, expectedEntry = preparation.entry ?? null, skipMaintenance = params.skipMaintenance) => updateAcpSessionStoreEntry({
				options,
				scope,
				storePath: store.storePath,
				execution,
				assertCurrent,
				readOwner,
				mutation,
				expectedEntry,
				expectedControlBinding,
				prepareMaintenance,
				skipMaintenance
			});
			const changed = selected.kind === "clear" ? preparation.entry ? await update({ kind: "clear" }) : { entry: null } : await update({
				kind: "touch",
				updatedAt,
				fallbackEntry: preparation.preparedEntry
			});
			assertCurrent();
			if (selected.kind === "set" && !changed.entry) return null;
			const commitEntry = changed.entry ?? preparation.entry;
			const cleanup = async () => {
				await update({ kind: "clear-legacy" }, commitEntry ?? null, true);
				assertCurrent();
			};
			if (selected.kind === "set") await cleanup();
			await commitAcpSessionMutation(context, {
				agentId: store.agentId,
				storageSessionKey: key,
				sessionKey: key,
				entry: commitEntry,
				currentRowKey: preparation.currentRowKey,
				currentRowSessionId: preparation.currentRowSessionId,
				updatedAt,
				decision: selected,
				source: source(),
				expectedControlBinding,
				control
			}, assertCurrent);
			assertCurrent();
			if (selected.kind === "clear") {
				await cleanup();
				return changed.entry;
			}
			return mergeSessionEntry(changed.entry ?? void 0, { acp: selected.meta });
		} finally {
			await execution.release();
		}
	});
}
async function commitAcpSessionMutation(context, input, assertCurrent) {
	const nonce = randomUUID();
	let admitted;
	let published = false;
	const publish = () => {
		const receipt = admitted?.admission.committed?.facts;
		if (!published && isRecord(receipt) && receipt.nonce === nonce) {
			published = true;
			sessionChanges.emit({
				agentId: input.agentId,
				sessionKey: input.sessionKey
			});
		}
	};
	try {
		await runOpenClawStateWorkerOperation(context, async (scope) => {
			try {
				await scope.execute({
					type: "acp.commitMutation",
					input: {
						...input,
						nonce
					}
				});
			} finally {
				await admitted?.retained.settled;
				publish();
			}
		}, {
			assertCurrent,
			createAdmission(retained) {
				let phase = "transaction";
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					if (!isRecord(request.facts) || request.facts.nonce !== nonce || request.stage !== phase) throw new Error("ACP metadata commit differs from its retained owner");
					phase = request.stage === "transaction" ? "commit" : "settled";
					if (!grant()) throw new Error("ACP metadata commit admission expired");
				});
				admitted = {
					admission,
					retained
				};
				return {
					nativeLocations: [context.admission.databasePath, input.source.path],
					admission
				};
			}
		});
	} finally {
		await admitted?.retained.settled;
		publish();
	}
}
//#endregion
//#region src/acp/runtime/session-meta-control.ts
/** Retain source custody; each effect gets a fresh metadata join, never a presence cache. */
async function prepareAcpSessionControlRead(params) {
	const captured = await captureAcpSessionReadContext(params);
	const target = resolveSessionStorePathForAcp({
		...params,
		...captured
	});
	const databasePath = resolveOpenClawStateSqlitePath(captured.env);
	const incognito = isIncognitoSessionKey(target.storeSessionKey);
	const shared = captureOpenClawStateReadContext(databasePath);
	const { prepareSessionMutationFacts, SessionMutationFactsUnavailableError } = await import("./session-sharing-preparation-Cz7xRJdn.mjs");
	captured.assertCurrent();
	shared.maintenanceScope?.assertAdmission();
	shared.admission.assertCurrent();
	const facts = await prepareSessionMutationFacts({
		cfg: captured.cfg,
		sessionKey: params.sessionKey,
		agentId: target.agentId,
		allowMissing: true
	});
	let active = true;
	let source;
	let initial;
	const release = () => {
		active = false;
		facts.release();
	};
	const assertCurrent = (cfg) => {
		if (!active) throw new SessionMutationFactsUnavailableError();
		captured.assertCurrent();
		shared.maintenanceScope?.assertAdmission();
		shared.admission.assertCurrent();
		const identity = readDatabasePathIdentitySync(databasePath);
		const expected = shared.admission.identity;
		if (identity.key !== expected.key || identity.canonicalPath !== expected.canonicalPath || identity.birthtime !== expected.birthtime) throw new SessionMutationFactsUnavailableError();
		const current = facts.readCurrent(cfg);
		if (source) {
			const observed = readDatabasePathIdentitySync(source.path);
			if (current.sourcePath !== source.path || current.sourceAgentId !== source.agentId || observed.key !== source.identity.key || observed.canonicalPath !== source.identity.canonicalPath || observed.birthtime !== source.identity.birthtime) throw new SessionMutationFactsUnavailableError();
		}
		if (initial) {
			assertAcpSessionMutationEntry(current.target?.entry, initial.entry, void 0, "control read");
			if (resolveAcpSessionControlOwner(current.target?.entry) !== initial.ownerKey) throw new SessionMutationFactsUnavailableError();
		}
		return current;
	};
	const readCurrent = async (cfg) => {
		assertCurrent(cfg);
		const read = await withAcpSessionEntryRead({
			cfg,
			sessionKey: params.sessionKey,
			agentId: target.agentId,
			env: captured.env,
			databasePath,
			assertCurrent: () => {
				assertCurrent(cfg);
			}
		}, (entry, owner) => {
			owner?.assertCurrent();
			if (source) {
				const scope = owner?.scope;
				if (owner?.kind !== "file" || !scope?.storePath) throw new SessionMutationFactsUnavailableError();
				const identity = readDatabasePathIdentitySync(scope.storePath);
				if ((scope.databaseAgentId ?? scope.agentId) !== source.agentId || identity.key !== source.identity.key || identity.canonicalPath !== source.identity.canonicalPath || identity.birthtime !== source.identity.birthtime) throw new SessionMutationFactsUnavailableError();
			}
			return entry;
		}, { currentMetadata: true });
		const current = assertCurrent(cfg);
		if (!read || read.storeReadFailed) throw new SessionMutationFactsUnavailableError();
		const entry = read.entry;
		assertAcpSessionMutationEntry(entry, current.target?.entry ?? null, void 0, "control read");
		if (resolveAcpSessionControlOwner(entry) !== resolveAcpSessionControlOwner(current.target?.entry)) throw new SessionMutationFactsUnavailableError();
		const ownerKey = resolveAcpSessionControlOwner(entry);
		initial ??= {
			entry: entry ? captureAcpSessionEntryBinding(entry) : null,
			ownerKey
		};
		let constraint;
		if (!incognito && source) constraint = {
			source,
			sharedSource: {
				path: databasePath,
				identity: { ...shared.admission.identity }
			},
			agentId: target.agentId,
			sessionKey: read.storeSessionKey,
			entry: entry ? captureAcpSessionEntryBinding(entry) : void 0,
			ownerKey,
			read: {
				keys: [buildAcpDatabaseSessionKey(read.storeSessionKey, target.agentId), ...legacyAcpDatabaseSessionKeys(read.storeSessionKey, target.agentId, cfg)],
				legacyKey: resolveLegacyFreeAcpSessionKey(read.storeSessionKey)
			}
		};
		return {
			session: read,
			entry,
			constraint
		};
	};
	try {
		const prepared = facts.readCurrent(params.cfg);
		if (!incognito && prepared.sourcePath && prepared.sourceAgentId) source = {
			agentId: prepared.sourceAgentId,
			path: prepared.sourcePath,
			identity: readDatabasePathIdentitySync(prepared.sourcePath)
		};
		return {
			initialRead: await readCurrent(params.cfg),
			readCurrent,
			assertCurrent: (cfg) => {
				assertCurrent(cfg);
			},
			...incognito ? { assertNativeAcpCurrent(cfg, runtimeLocator) {
				const current = assertCurrent(cfg);
				const acp = readAcpSessionMetaForEntry({
					cfg,
					sessionKey: target.storeSessionKey,
					agentId: target.agentId,
					entry: current.target?.entry,
					env: captured.env,
					databasePath
				}, { current: true });
				assertCurrent(cfg);
				if (!acp || runtimeLocator && !matchesAcpSessionRuntimeLocator(acp, runtimeLocator)) throw new SessionMutationFactsUnavailableError();
			} } : {},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/acp/runtime/session-meta.ts
/** @deprecated Use readAcpSessionMetaAsync for runtime reads. Native maintenance retains this reader. */
function readAcpSessionMeta(params) {
	return readAcpSessionEntry({
		...params,
		sessionKey: params.sessionKey.trim(),
		clone: false
	})?.acp;
}
function readAcpSessionMetaBatch(params) {
	const result = /* @__PURE__ */ new Map();
	const entriesByKey = /* @__PURE__ */ new Map();
	for (const item of params.entries) {
		const rawSessionKey = item.sessionKey.trim();
		const sessionKey = buildAcpDatabaseSessionKey(rawSessionKey, item.agentId);
		if (item.entry?.acp) {
			result.set(item.entry, item.entry.acp);
			continue;
		}
		const legacyKeys = legacyAcpDatabaseSessionKeys(rawSessionKey, item.agentId, params.cfg);
		const entries = entriesByKey.get(sessionKey) ?? [];
		entries.push({
			entry: item.entry,
			rawSessionKey,
			legacyKeys
		});
		entriesByKey.set(sessionKey, entries);
	}
	if (entriesByKey.size === 0) return result;
	withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
		const db = getAcpSessionKysely(database);
		const requestedKeySet = /* @__PURE__ */ new Set();
		for (const [sessionKey, entries] of entriesByKey) {
			requestedKeySet.add(sessionKey);
			for (const item of entries) for (const legacyKey of item.legacyKeys) requestedKeySet.add(legacyKey);
		}
		const requestedKeys = [...requestedKeySet];
		const keyChunks = [];
		for (let index = 0; index < requestedKeys.length; index += 500) keyChunks.push(requestedKeys.slice(index, index + 500));
		const rows = keyChunks.flatMap((chunk) => executeSqliteQuerySync(database, db.selectFrom("acp_sessions").selectAll().where("session_key", "in", chunk)).rows);
		const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
		const unresolved = [];
		for (const [sessionKey, entries] of entriesByKey) for (const item of entries) {
			const row = [sessionKey, ...item.legacyKeys].map((key) => rowsByKey.get(key)).map((candidateRow) => resolveReadableAcpSessionRow({
				row: candidateRow,
				entry: item.entry
			})).find((candidateRow) => candidateRow !== void 0);
			result.set(item.entry, row ? rowToAcpSessionMeta(row) : void 0);
			const legacyKey = !row && resolveLegacyFreeAcpSessionKey(item.rawSessionKey);
			if (legacyKey) unresolved.push({
				entry: item.entry,
				key: legacyKey
			});
		}
		const legacyRows = selectLegacyFreeAcpSessionRows(database, unresolved.map(({ key }) => key));
		for (const { entry, key } of unresolved) {
			const row = legacyRows.get(key)?.find((candidate) => acpSessionRowMatchesEntry(candidate, entry));
			result.set(entry, row ? rowToAcpSessionMeta(row) : void 0);
		}
	}, {
		env: params.env,
		path: params.databasePath
	});
	return result;
}
function writeAcpSessionMetaForMigration(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = bindAcpSessionMeta({
		sessionKey,
		sessionId: params.sessionId,
		lifecycleRevision: params.lifecycleRevision,
		meta: params.meta,
		updatedAt: params.now?.() ?? Date.now()
	});
	runOpenClawStateWriteTransaction((database) => {
		upsertAcpSessionMetaRow(database.db, row);
		for (const identity of parseAcpDatabaseSessionKeyCandidates(sessionKey)) {
			const keys = /* @__PURE__ */ new Set([identity.storeSessionKey, resolveLegacyFreeAcpSessionKey(identity.storeSessionKey)]);
			for (const key of keys) if (key) sessionChanges.emit({
				sessionKey: key,
				agentId: identity.agentId
			}, database.db);
		}
	}, {
		database: params.database,
		env: params.env,
		path: params.databasePath
	});
}
/** @deprecated Use readAcpSessionEntryAsync; retained for the v2026.9.4 Plugin SDK contract. */
function readAcpSessionEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore(params);
	if (!storeEntry.storePath) return null;
	const acp = readAcpSessionMetaForEntry({
		sessionKey: storeEntry.storeSessionKey,
		agentId: storeEntry.agentId,
		cfg: storeEntry.cfg,
		entry: storeEntry.entry,
		env: params.env,
		databasePath: params.databasePath
	});
	return {
		cfg: storeEntry.cfg,
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKey,
		storeSessionKey: storeEntry.storeSessionKey,
		entry: storeEntry.entry,
		acp,
		storeReadFailed: storeEntry.storeReadFailed
	};
}
//#endregion
export { prepareAcpSessionControlRead as a, readAcpSessionEntryAsync as c, writeAcpSessionMetaForMigration as i, readAcpSessionMetaAsync as l, readAcpSessionMeta as n, upsertAcpSessionMeta as o, readAcpSessionMetaBatch as r, upsertAcpSessionMetaForControl as s, readAcpSessionEntry as t, listAcpSessionEntries as u };
