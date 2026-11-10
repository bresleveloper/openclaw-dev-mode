import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { n as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { r as IncognitoSessionSyncAccessError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { c as legacyAcpMigrationBindingMatches, d as recordLegacyAcpMigrationCompletion, r as readLegacyAcpMigrationContext } from "./session-accessor.sqlite-acp-provenance-Bl2TV_Gc.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { y as kickSessionEntryMaintenanceAfterWrite } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as kickSessionHistoryDiskBudgetMaintenance } from "./session-history-eviction-DcKJmUSb.mjs";
import { t as captureMaintenanceConfigAsyncReader } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { r as patchSessionEntryWithKey } from "./session-accessor.entry-BLpjjUTc.mjs";
import { a as parseAcpDatabaseSessionKey, f as upsertAcpSessionMetaRow, n as buildAcpDatabaseSessionKey, s as resolveReadableAcpSessionRow, u as selectAcpSessionRowForStoreEntry } from "./session-meta-keys-BWMCJN-1.mjs";
import { i as rowToAcpSessionMeta, n as readAcpSessionMetaForEntry, t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { n as resolveSessionStorePathForAcp, t as readSessionEntryFromStore } from "./session-meta-store-DksRcpO8.mjs";
import { n as matchesAcpSessionRuntimeLocator, r as resolveAcpSessionControlOwner } from "./session-control-owner-CbeH1iSF.mjs";
import { n as captureAcpSessionEntryBinding, t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-DisS3yfP.mjs";
import { r as bindAcpSessionMeta, t as applyAcpSessionMutation } from "./session-meta-write.kernel-Bl7f-Zcr.mjs";
import { a as acquireAcpMemorySession, c as prepareAcpSessionMutation, i as withAcpSessionEntryRead, l as captureAcpSessionReadContext, o as upsertMemoryAcpSessionMeta, s as commitAcpSessionMutation } from "./session-meta-read-C9RqVGp2.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
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
	for (const row of result.rows) {
		const identity = parseAcpDatabaseSessionKey(row.session_key);
		if (identity) {
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
			if (joined) entries.push(joined);
		}
	}
	assertCurrent();
	return entries;
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
			publication?.begin(receipt.changedKeys, receipt.membershipInvalidatedKeys, receipt.sharingUnchangedKeys, receipt.generationUnchangedKeys, void 0, new Map([...receipt.current].filter(([key]) => !receipt.unavailableParticipantKeys?.includes(key))));
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
//#region src/acp/runtime/session-meta-write.native.ts
function consumeLegacyAcpMigrationSources(params) {
	const current = readLegacyAcpMigrationContext(params);
	assertAcpSessionMutationEntry(current.entry, params.entry ?? null, params.expectedControlBinding, "legacy source consumption");
	for (const source of current.sources) if (legacyAcpMigrationBindingMatches(source, current.entry)) recordLegacyAcpMigrationCompletion(params.database, source, params.now);
}
/** Exclusive native maintenance only; runtime and memory mutations use the shared worker. */
async function upsertAcpSessionMetaForMaintenance(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env,
		clone: false
	});
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
		const currentRow = selectAcpSessionRowForStoreEntry(database.db, storageSessionKey, storeEntry.agentId, entry);
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
			const facts = applyAcpSessionMutation(database.db, {
				agentId: storeEntry.agentId,
				storageSessionKey,
				sessionKey: publishedSessionKey,
				entry: publishedEntry,
				currentRowKey,
				decision
			});
			sessionChanges.emit({
				agentId: storeEntry.agentId,
				sessionKey: publishedSessionKey,
				storePath,
				scope: "acp",
				facts
			}, database.db);
		}, {
			env: params.env,
			path: params.databasePath
		});
	};
	const metaToPersist = nextMeta;
	if (metaToPersist === void 0) return current ? mergeSessionEntry(entry, { acp: current }) : entry ?? null;
	const patchEntry = () => patchSessionEntryWithKey({
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKey: storageSessionKey
	}, (currentEntry, context) => {
		assertAcpSessionMutationEntry(context.existingEntry, entry ?? null, params.expectedControlBinding, "entry mutation");
		const next = metaToPersist === null ? { ...currentEntry } : mergeSessionEntry(currentEntry, { updatedAt });
		delete next.acp;
		return next;
	}, {
		...params.skipMaintenance === true ? { skipMaintenance: true } : {},
		...params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {},
		...metaToPersist === null ? {} : { fallbackEntry: preparedEntry },
		replaceEntry: true,
		assertCommitAllowed: params.assertCommitAllowed
	});
	const persisted = metaToPersist === null && !entry ? null : await patchEntry();
	if (metaToPersist === null) {
		publish(persisted?.sessionKey ?? storageSessionKey, persisted?.entry ?? entry, { kind: "clear" });
		return persisted?.entry ?? null;
	}
	if (!persisted) return null;
	publish(persisted.sessionKey, persisted.entry, {
		kind: "set",
		meta: metaToPersist
	});
	return mergeSessionEntry(persisted.entry, { acp: metaToPersist });
}
//#endregion
//#region src/acp/runtime/session-meta-write.ts
/** Entry changes follow the selected session owner; ACP metadata keeps its shared worker. */
async function upsertAcpSessionMeta(params) {
	return isIncognitoSessionKey(params.sessionKey.trim()) ? upsertMemoryAcpSessionMeta(params) : mutateAcpSessionMeta(params);
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
	return withSessionEntryReadOnlyInWorker({
		agentId: store.agentId,
		storePath: store.storePath,
		sessionKey: store.storeSessionKey,
		env: captured.env
	}, captured.assertCurrent, async (read, readOwner) => {
		if (!read.ok) throw read.error;
		const entry = read.value;
		const readerScope = readOwner.scope;
		if (!readerScope?.storePath) throw new Error("ACP mutation has no retained canonical source");
		const options = {
			agentId: readerScope.databaseAgentId ?? readerScope.agentId ?? store.agentId,
			path: readerScope.storePath,
			env: captured.env
		};
		if (!supportsOpenClawAgentDatabaseExecution(options)) {
			if (control) throw new Error("ACP controlled metadata mutation requires its durable worker source");
			return upsertAcpSessionMetaForMaintenance({
				...params,
				...captured,
				expectedControlBinding,
				assertCommitAllowed: readOwner.assertCurrent
			});
		}
		const identity = readDatabasePathIdentitySync(options.path);
		const context = captureOpenClawStateWorkerContext({
			path: captured.databasePath,
			env: captured.env
		});
		const prepareMaintenance = captureMaintenanceConfigAsyncReader(captured.assertCurrent);
		const key = store.storeSessionKey;
		const metadataRead = { keys: [buildAcpDatabaseSessionKey(key, store.agentId)] };
		if (control && (control.agentId !== store.agentId || control.sessionKey !== key || control.source.agentId !== options.agentId || !isDeepStrictEqual(control.source.identity, identity) || !isDeepStrictEqual(control.sharedSource.identity, context.admission.identity) || !isDeepStrictEqual(control.read.keys, metadataRead.keys))) throw new Error("ACP controlled metadata mutation does not match its prepared target");
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
		try {
			const { preparation, decision: selected } = await prepareAcpSessionMutation(context, {
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
			}, params.mutate, assertCurrent);
			assertCurrent();
			if (selected.kind === "keep") return preparation.current ? mergeSessionEntry(preparation.entry, { acp: preparation.current }) : preparation.entry ?? null;
			const scope = {
				agentId: store.agentId,
				databaseAgentId: options.agentId,
				path: options.path,
				env: captured.env,
				sessionKey: resolveSqliteSessionKey(key, store.agentId)
			};
			const update = (mutation) => updateAcpSessionStoreEntry({
				options,
				scope,
				storePath: store.storePath,
				execution,
				assertCurrent,
				readOwner,
				mutation,
				expectedEntry: preparation.entry ?? null,
				expectedControlBinding,
				prepareMaintenance,
				skipMaintenance: params.skipMaintenance
			});
			const changed = selected.kind === "clear" ? preparation.entry ? await update({ kind: "clear" }) : { entry: null } : await update({
				kind: "touch",
				updatedAt,
				fallbackEntry: preparation.preparedEntry
			});
			assertCurrent();
			if (selected.kind === "set" && !changed.entry) return null;
			const commitEntry = changed.entry ?? preparation.entry;
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
			if (selected.kind === "clear") return changed.entry;
			return mergeSessionEntry(changed.entry ?? void 0, { acp: selected.meta });
		} finally {
			await execution.release();
		}
	});
}
//#endregion
//#region src/acp/runtime/session-meta-memory-control.ts
/** Keep the shared owner's receipts only for this control operation, never in actor state. */
async function prepareMemoryAcpSessionControlRead(params) {
	const binding = await acquireAcpMemorySession(params);
	if (!binding) throw new Error("ACP session is unavailable");
	try {
		const prepared = await prepareBoundMemoryAcpSessionControlRead(params, binding);
		return {
			...prepared,
			release() {
				prepared.release();
				binding.actor.release();
			}
		};
	} catch (error) {
		await binding.actor.release();
		throw error;
	}
}
async function prepareBoundMemoryAcpSessionControlRead(params, binding) {
	const captured = await captureAcpSessionReadContext(params);
	const target = resolveSessionStorePathForAcp({
		...params,
		...captured
	});
	const shared = captureOpenClawStateReadContext(captured.databasePath ?? resolveOpenClawStateSqlitePath(captured.env));
	let active = true;
	let initialEntry;
	let initialOwner;
	let metadata;
	let selectedEntry;
	let reading = false;
	let published;
	const install = (fact, entry) => {
		metadata = fact && fact.sessionId === entry?.sessionId && fact.lifecycleRevision === (entry?.lifecycleRevision ?? null) && fact.sessionStartedAt === entry?.sessionStartedAt ? { acp: fact.acp ? structuredClone(fact.acp) : void 0 } : void 0;
	};
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if ("all" in change) {
			if (typeof change.scope === "string" && change.scope !== "acp" && change.scope !== "stores") return;
			metadata = void 0;
			if (reading) published = null;
			return;
		}
		if (change.scope !== "acp" || change.sessionKey !== target.storeSessionKey || change.agentId && change.agentId !== binding.agentId) return;
		const fact = change.facts?.kind === "acp" ? change.facts : null;
		if (reading) published = fact;
		if (!fact) metadata = void 0;
		else install(fact, selectedEntry);
	});
	const assertCurrent = (_cfg) => {
		if (!active) throw new Error("ACP control read was released");
		params.assertCurrent?.();
		shared.maintenanceScope?.assertAdmission();
		shared.admission.assertCurrent();
		const entry = binding.actor.snapshot(binding.authority)?.entry;
		if (initialEntry !== void 0) {
			assertAcpSessionMutationEntry(entry, initialEntry, void 0, "control read");
			if (resolveAcpSessionControlOwner(entry) !== initialOwner) throw new Error("Canonical ACP control owner changed");
		}
		return entry;
	};
	const readCurrent = async (cfg) => {
		const entry = assertCurrent(cfg);
		selectedEntry = entry && structuredClone(entry);
		reading = true;
		published = void 0;
		try {
			const [acp] = await readAcpSessionMetaForEntries({
				...captured,
				cfg,
				entries: [{
					agentId: binding.agentId,
					sessionKey: target.storeSessionKey,
					entry
				}]
			}, { current: true });
			metadata = { acp: acp ?? void 0 };
			if (published !== void 0) install(published, entry);
			if (!metadata) throw new Error("ACP metadata changed without a committed result; retry control");
			initialEntry ??= entry ? captureAcpSessionEntryBinding(entry) : null;
			initialOwner = resolveAcpSessionControlOwner(entry);
			return {
				session: {
					...target,
					storePath: binding.path,
					sessionKey: params.sessionKey.trim(),
					entry,
					acp: metadata.acp && structuredClone(metadata.acp)
				},
				entry
			};
		} finally {
			reading = false;
		}
	};
	const release = () => {
		active = false;
		unsubscribe();
	};
	try {
		return {
			initialRead: await readCurrent(captured.cfg),
			readCurrent,
			assertCurrent,
			assertAcpCurrent(cfg, runtimeLocator) {
				assertCurrent(cfg);
				if (!metadata?.acp || runtimeLocator && !matchesAcpSessionRuntimeLocator(metadata.acp, runtimeLocator)) throw new Error("Canonical ACP runtime locator changed before control");
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/acp/runtime/session-meta-control.ts
/** Retain source custody; each effect gets the session and shared metadata owners. */
function prepareAcpSessionControlRead(params) {
	return isIncognitoSessionKey(params.sessionKey.trim()) ? prepareMemoryAcpSessionControlRead(params) : prepareAcpSessionControlReadOwned(params);
}
async function prepareAcpSessionControlReadOwned(params) {
	const captured = await captureAcpSessionReadContext(params);
	const target = resolveSessionStorePathForAcp({
		...params,
		...captured
	});
	const databasePath = resolveOpenClawStateSqlitePath(captured.env);
	const shared = captureOpenClawStateReadContext(databasePath);
	const { prepareSessionMutationFacts, SessionMutationFactsUnavailableError } = await import("./session-sharing-preparation-Ri6sE-C2.mjs");
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
		if (source) constraint = {
			source,
			sharedSource: {
				path: databasePath,
				identity: { ...shared.admission.identity }
			},
			agentId: target.agentId,
			sessionKey: read.storeSessionKey,
			entry: entry ? captureAcpSessionEntryBinding(entry) : void 0,
			ownerKey,
			read: { keys: [buildAcpDatabaseSessionKey(read.storeSessionKey, target.agentId)] }
		};
		return {
			session: read,
			entry,
			constraint
		};
	};
	try {
		const prepared = facts.readCurrent(params.cfg);
		if (prepared.sourcePath && prepared.sourceAgentId) source = {
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
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/acp/runtime/session-meta.ts
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
		const identity = parseAcpDatabaseSessionKey(sessionKey);
		if (identity) sessionChanges.emit({
			sessionKey: identity.storeSessionKey,
			agentId: identity.agentId
		}, database.db);
	}, {
		database: params.database,
		env: params.env,
		path: params.databasePath
	});
}
/** @deprecated Use readAcpSessionEntryAsync; final compatibility day: 2026-12-31. */
function readAcpSessionEntry(params) {
	warnPluginSdkDeprecation({
		family: "acp-session",
		method: "readAcpSessionEntry",
		replacement: "readAcpSessionEntryAsync"
	});
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	if (isIncognitoSessionKey(sessionKey)) throw new IncognitoSessionSyncAccessError("readAcpSessionEntry", "readAcpSessionEntryAsync");
	const storeEntry = readSessionEntryFromStore(params);
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
export { upsertAcpSessionMetaForControl as a, upsertAcpSessionMeta as i, writeAcpSessionMetaForMigration as n, listAcpSessionEntries as o, prepareAcpSessionControlRead as r, readAcpSessionEntry as t };
