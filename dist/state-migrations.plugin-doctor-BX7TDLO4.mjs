import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { T as resolveOAuthDir } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { i as prepareOpenClawStateDatabaseSchema, l as runOpenClawStateWriteTransaction, n as openExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as readLegacyMigrationReceiptFromDatabase, l as resolveLegacyMigrationSourceKey, n as markLegacyMigrationSourceRemovedInDatabase, o as recordLegacyMigrationReceipt } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-B6mKYs2x.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { u as getPluginStateKysely } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
import { a as prepareRegisterParams, l as validateNamespace } from "./plugin-state-store.validation-BnCg_tof.mjs";
import { t as runWriteTransaction } from "./plugin-state-store.database-VwspSyEa.mjs";
import { a as importPluginStateEntriesForDoctor, d as observedPluginStateRow, f as pluginStateDeleteEntriesIfUnchanged, p as pluginStateDoctorEntriesInKeyRange, r as createPluginStateKeyedStore, u as getPluginStateCapacity } from "./plugin-state-store-yKq-W0-T.mjs";
import { t as resolveChannelIngressStateEnv } from "./ingress-queue-client-BTyDwm0g.mjs";
import { n as listChannelIngressQueueAccountIdsReadOnly, t as createChannelIngressQueue } from "./ingress-queue-BliQMgG8.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { p as dedupeSessionStoreTargetsBySqliteTarget } from "./targets-BbcRkdUC.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { l as listPluginDoctorStateMigrationEntries, t as PluginDoctorStateMigrationDeclarationError } from "./doctor-contract-registry-BGRBWEIs.mjs";
import { o as resolveExistingAgentSessionStoreTargetsReadOnlyResult } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as readSessionIdentityEvidenceBatch, t as loadExactSessionEntryReadOnlyResult } from "./session-accessor.sqlite-entry-availability-GjNU-pZO.mjs";
import { a as parseAcpDatabaseSessionKeyCandidates, c as selectAcpSessionRow, d as selectLegacyFreeAcpSessionRows, f as upsertAcpSessionMetaRow, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, r as getAcpSessionKysely, t as acpSessionRowMatchesEntry } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-BuPPT7EU.mjs";
import { n as captureAcpSessionEntryBinding } from "./session-meta-entry.kernel-Cn1WSw9n.mjs";
import { r as rowToAcpSessionMeta } from "./session-meta-readonly-CvCR0QQG.mjs";
import { i as readSessionStoreJson5 } from "./state-migrations.fs-BsWaJ_dW.mjs";
import { n as preparePluginDoctorMigrationResources } from "./doctor-migration-resources-BMhBzn5C.mjs";
import { f as resolveVerifiedSessionSource, o as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-C_VL59cB.mjs";
import { r as formatStartupMigrationFailure } from "./state-migrations.messages-CXxBVY0a.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-Dvppzhox.mjs";
import { t as autoMigrateLegacyStateDir } from "./state-migrations.state-dir-SV4Ub-JZ.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
//#region src/acp/runtime/session-meta-doctor.ts
function sameAcpSessionPayload(left, right) {
	return isDeepStrictEqual({
		...left,
		session_key: right.session_key
	}, { ...right });
}
/** Rekey existing raw ACP metadata only under Doctor's offline maintenance owner. */
async function repairAcpSessionMetaKeysForDoctor(params) {
	const result = {
		found: 0,
		repaired: 0,
		scannedRows: 0,
		warnings: []
	};
	if (params.apply && !params.authority) throw new Error("ACP key repair requires Doctor SQLite maintenance authority.");
	params.authority?.assertCurrent();
	const database = await openExistingOpenClawStateDatabaseReadOnly({ env: params.env });
	if (!database) return result;
	let rows;
	try {
		params.authority?.assertCurrent();
		rows = executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).selectFrom("acp_sessions").selectAll()).rows;
	} finally {
		database.walMaintenance.close();
	}
	result.scannedRows = rows.length;
	const keys = new Set(rows.flatMap((row) => {
		const key = resolveLegacyFreeAcpSessionKey(row.session_key);
		return key ? [key] : [];
	}));
	for (const sessionKey of keys) try {
		const owner = resolveSessionStorePathForAcp({
			cfg: params.cfg,
			env: params.env,
			sessionKey
		});
		const scope = {
			agentId: owner.agentId,
			storePath: owner.storePath,
			sessionKey: owner.storeSessionKey,
			env: params.env
		};
		const resolved = resolveSqliteScope(scope);
		const stored = loadExactSessionEntryReadOnlyResult(scope);
		if (!stored.found || !stored.value) throw new Error(`ACP session binding is ${stored.found ? "absent" : stored.reason}`);
		const binding = captureAcpSessionEntryBinding(stored.value.entry);
		const aliases = rows.filter((row) => resolveLegacyFreeAcpSessionKey(row.session_key) === sessionKey).toSorted((a, b) => b.last_activity_at - a.last_activity_at || (a.session_key < b.session_key ? -1 : a.session_key > b.session_key ? 1 : 0));
		const matching = aliases.filter((row) => acpSessionRowMatchesEntry(row, binding));
		const source = matching.find((row) => row.session_key === sessionKey) ?? matching[0];
		if (!source) throw new Error("ACP metadata binding is stale");
		const destinationKey = buildAcpDatabaseSessionKey(owner.storeSessionKey, owner.agentId);
		const destination = rows.find((row) => row.session_key === destinationKey);
		if (destination && (!acpSessionRowMatchesEntry(destination, binding) || !sameAcpSessionPayload(destination, source))) throw new Error("canonical ACP metadata conflicts with its raw alias");
		const consumed = matching.filter((row) => sameAcpSessionPayload(row, source));
		result.found += consumed.length;
		if (matching.length !== aliases.length) result.warnings.push(`${sessionKey}: stale ACP aliases retained.`);
		if (consumed.length !== matching.length) result.warnings.push(`${sessionKey}: ACP aliases with conflicting payloads retained.`);
		if (!params.apply) continue;
		const authority = params.authority;
		authority.assertCurrent();
		const repaired = withOpenClawAgentDatabaseReadOnly((agentDatabase) => {
			runOpenClawStateWriteTransaction((shared) => {
				authority.assertCurrent();
				const currentOwner = resolveSessionStorePathForAcp({
					cfg: params.cfg,
					env: params.env,
					sessionKey
				});
				const currentEntry = readExactSessionEntryRowValidated(agentDatabase, resolved.sessionKey)?.entry;
				const currentBinding = currentEntry && captureAcpSessionEntryBinding(currentEntry);
				const currentAliases = selectLegacyFreeAcpSessionRows(shared.db, [sessionKey]).get(sessionKey) ?? [];
				if (!isDeepStrictEqual(currentOwner, owner) || !isDeepStrictEqual(currentBinding, binding) || !isDeepStrictEqual(currentAliases, aliases) || !isDeepStrictEqual(selectAcpSessionRow(shared.db, destinationKey), destination)) throw new Error("ACP ownership or metadata changed during Doctor repair; source retained");
				authority.assertCurrent();
				if (!destination) upsertAcpSessionMetaRow(shared.db, {
					...source,
					session_key: destinationKey
				});
				executeSqliteQuerySync(shared.db, getAcpSessionKysely(shared.db).deleteFrom("acp_sessions").where("session_key", "in", consumed.map((row) => row.session_key)));
				sessionChanges.emit({
					agentId: owner.agentId,
					sessionKey: owner.storeSessionKey
				}, shared.db);
			}, { env: params.env });
		}, toDatabaseOptions(resolved));
		if (!repaired.found) throw new Error(`ACP owner database became unavailable: ${repaired.reason}`);
		result.repaired += consumed.length;
	} catch (error) {
		params.authority?.assertCurrent();
		result.warnings.push(`${sessionKey}: ${String(error)}`);
	}
	return result;
}
function isRetiredClaimOwner(config, target) {
	const parsed = parseAgentSessionKey(target.sessionKey);
	const freeAcp = parsed?.rest.startsWith("acp:") && !parsed.rest.startsWith("acp:binding:");
	return !listAgentIds(config).includes(target.agentId) && !freeAcp;
}
function readClaimBinding(scope, target) {
	const owner = resolveSessionStorePathForAcp({
		cfg: scope.config,
		env: scope.env,
		...target
	});
	if (isRetiredClaimOwner(scope.config, target)) throw new Error(`retired ACP owner ${owner.agentId}`);
	const resolved = resolveSqliteScope({
		...target,
		env: scope.env,
		storePath: owner.storePath
	});
	const result = loadExactSessionEntryReadOnlyResult({
		...target,
		sessionKey: resolved.sessionKey,
		env: scope.env,
		storePath: owner.storePath
	});
	if (!result.found || !result.value) throw new Error(`ACP session binding is ${result.found ? "absent" : result.reason}`);
	return captureAcpSessionEntryBinding(result.value.entry);
}
async function inspectAcpSessionClaimsForDoctor(scope) {
	const claims = [];
	const incomplete = [];
	try {
		const database = await openExistingOpenClawStateDatabaseReadOnly({ env: scope.env });
		if (!database) return {
			claims,
			incomplete
		};
		try {
			const rows = executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).selectFrom("acp_sessions").selectAll().where("backend", "=", scope.pluginId)).rows;
			for (const row of rows) try {
				const target = parseAcpDatabaseSessionKeyCandidates(row.session_key)[0];
				if (!target?.agentId || buildAcpDatabaseSessionKey(target.storeSessionKey, target.agentId) !== row.session_key) throw new Error("ACP metadata key is not canonical");
				const claimTarget = {
					agentId: target.agentId,
					sessionKey: target.storeSessionKey
				};
				const binding = readClaimBinding(scope, claimTarget);
				if (row.session_id == null || !acpSessionRowMatchesEntry(row, binding)) throw new Error("ACP metadata binding is absent or stale");
				const meta = rowToAcpSessionMeta(row);
				if (row.identity_json && !meta.identity || row.runtime_options_json && !meta.runtimeOptions) throw new Error("ACP metadata JSON is unreadable");
				claims.push({
					...claimTarget,
					binding,
					meta
				});
			} catch (error) {
				incomplete.push(`${row.session_key}: ${String(error)}`);
			}
		} finally {
			database.walMaintenance.close();
		}
	} catch (error) {
		incomplete.push(String(error));
	}
	return {
		claims,
		incomplete
	};
}
function updateAcpSessionIdentityForDoctor(scope, authority, input) {
	authority.assertCurrent();
	const { claim } = input;
	if (claim.meta.backend !== scope.pluginId || !claim.meta.identity) throw new Error("ACP identity repair requires a matching backend claim and existing identity");
	const key = buildAcpDatabaseSessionKey(claim.sessionKey, claim.agentId);
	const owner = resolveSessionStorePathForAcp({
		cfg: scope.config,
		env: scope.env,
		...claim
	});
	const resolved = resolveSqliteScope({
		...claim,
		env: scope.env,
		storePath: owner.storePath
	});
	const options = toDatabaseOptions(resolved);
	const updated = withOpenClawAgentDatabaseReadOnly((agentDatabase) => {
		runOpenClawStateWriteTransaction((database) => {
			authority.assertOwnedInTransaction(database.db);
			const row = selectAcpSessionRow(database.db, key);
			const entry = readExactSessionEntryRowValidated(agentDatabase, resolved.sessionKey)?.entry;
			const binding = entry && captureAcpSessionEntryBinding(entry);
			if (isRetiredClaimOwner(scope.config, claim) || !row || !isDeepStrictEqual(rowToAcpSessionMeta(row), claim.meta) || !isDeepStrictEqual(binding, claim.binding) || !acpSessionRowMatchesEntry(row, claim.binding)) throw new Error("ACP ownership or metadata changed during Doctor repair; source retained");
			executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).updateTable("acp_sessions").set({
				runtime_session_name: input.runtimeSessionName,
				identity_json: JSON.stringify({
					...claim.meta.identity,
					acpxRecordId: input.acpxRecordId
				})
			}).where("session_key", "=", key));
			sessionChanges.emit({
				agentId: claim.agentId,
				sessionKey: claim.sessionKey
			}, database.db);
		}, { env: scope.env });
	}, options);
	if (!updated.found) throw new Error(`ACP owner database became unavailable: ${updated.reason}`);
}
//#endregion
//#region src/channels/message/ingress-queue.migration.ts
/** Offline Doctor import: failure tombstones must never pass through pending state. */
function importLegacyChannelIngressEntries(params) {
	params.assertCurrent();
	const { channelId, accountId } = params;
	if (!channelId || channelId !== channelId.trim() || !accountId || accountId !== accountId.trim()) throw new Error("Doctor ingress import requires canonical channel and account IDs");
	const queueName = JSON.stringify([params.channelId, accountId]);
	const seen = /* @__PURE__ */ new Set();
	const prepared = params.entries.map(({ entry, sources }) => {
		if (!entry.id || entry.id !== entry.id.trim() || seen.has(entry.id) || !Number.isSafeInteger(entry.receivedAt) || entry.receivedAt < 0 || entry.status === "failed" && (!Number.isSafeInteger(entry.failedAt) || entry.failedAt < 0 || !entry.reason)) throw new Error(`Invalid legacy ingress entry ${entry.id}`);
		seen.add(entry.id);
		const payloadJson = entry.status === "pending" ? JSON.stringify(entry.payload) : "null";
		if (payloadJson === void 0) throw new Error(`Legacy ingress entry ${entry.id} has no JSON payload`);
		if (!sources.length) throw new Error(`Legacy ingress entry ${entry.id} has no verified source`);
		return {
			entry,
			payloadJson,
			receipts: sources.map((source) => {
				if (!path.isAbsolute(source.sourcePath) || path.resolve(source.sourcePath) !== source.sourcePath || !/^[a-f0-9]{64}$/.test(source.sha256) || !Number.isSafeInteger(source.size) || source.size < 0) throw new Error(`Invalid legacy ingress source for ${entry.id}`);
				return {
					source: { ...source },
					sourceKey: resolveLegacyMigrationSourceKey("channel-ingress", source.sourcePath, JSON.stringify([
						queueName,
						entry.id,
						source.sha256,
						source.size
					]))
				};
			})
		};
	});
	const env = resolveChannelIngressStateEnv(params.stateDir);
	const committedSources = /* @__PURE__ */ new Map();
	const result = {
		imported: [],
		present: [],
		conflicts: [],
		markSourcesRemoved(sourcePaths) {
			params.assertCurrent();
			const keys = sourcePaths.map((sourcePath) => {
				const key = committedSources.get(sourcePath);
				if (!key) throw new Error(`Legacy ingress source was not committed: ${sourcePath}`);
				return key;
			});
			runOpenClawStateWriteTransaction(({ db }) => {
				params.assertCurrent();
				for (const key of keys) markLegacyMigrationSourceRemovedInDatabase(db, key);
				params.assertCurrent();
			}, { env });
		}
	};
	if (!prepared.length) return result;
	return runOpenClawStateWriteTransaction(({ db }) => {
		params.assertCurrent();
		const now = Date.now();
		const kysely = getNodeSqliteKysely(db);
		for (const { entry, payloadJson, receipts } of prepared) {
			const prior = receipts.filter(({ sourceKey, source }) => {
				const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
				if (!receipt) return false;
				const report = JSON.parse(receipt.reportJson);
				if (receipt.sourceSha256 !== source.sha256 || !isRecord(report) || report.queueName !== queueName || report.eventId !== entry.id || !isDeepStrictEqual(report.source, source) || typeof report.disposition !== "string" || ![
					"imported",
					"equivalent",
					"completed"
				].includes(report.disposition) || typeof report.status !== "string" || ![
					"pending",
					"claimed",
					"failed",
					"completed"
				].includes(report.status)) throw new Error(`Unverified legacy ingress receipt for ${source.sourcePath}`);
				return true;
			});
			if (prior.length) {
				if (prior.length !== receipts.length) {
					result.conflicts.push(entry.id);
					continue;
				}
				for (const { sourceKey, source } of receipts) committedSources.set(source.sourcePath, sourceKey);
				result.present.push(entry.id);
				continue;
			}
			const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("event_id", "=", entry.id));
			if (existing) {
				let matches = existing.status === "completed";
				if (existing.received_at === entry.receivedAt) {
					if (entry.status === "failed") matches ||= existing.status === "failed" && existing.payload_json === "null" && existing.failed_reason === entry.reason && existing.failed_at === entry.failedAt && existing.last_error === (entry.message ?? null);
					else if (existing.status === "pending" || existing.status === "claimed") try {
						matches = isDeepStrictEqual(JSON.parse(existing.payload_json), entry.payload);
					} catch {
						matches = false;
					}
				}
				if (!matches) {
					result.conflicts.push(entry.id);
					continue;
				}
				result.present.push(entry.id);
			} else {
				executeSqliteQuerySync(db, kysely.insertInto("channel_ingress_events").values({
					queue_name: queueName,
					event_id: entry.id,
					channel_id: params.channelId,
					account_id: accountId,
					status: entry.status,
					payload_json: payloadJson,
					metadata_json: null,
					received_at: entry.receivedAt,
					updated_at: now,
					attempts: 0,
					failed_at: entry.status === "failed" ? entry.failedAt : null,
					failed_reason: entry.status === "failed" ? entry.reason : null,
					last_error: entry.status === "failed" ? entry.message ?? null : null
				}));
				result.imported.push(entry.id);
			}
			for (const { sourceKey, source } of receipts) {
				recordLegacyMigrationReceipt(db, {
					sourceKey,
					migrationKind: "channel-ingress",
					sourcePath: source.sourcePath,
					targetTable: "channel_ingress_events",
					sourceSha256: source.sha256,
					sourceSizeBytes: source.size,
					sourceRecordCount: 1,
					runId: randomUUID(),
					now,
					reportJson: JSON.stringify({
						queueName,
						eventId: entry.id,
						source,
						status: existing?.status ?? entry.status,
						disposition: !existing ? "imported" : existing.status === "completed" ? "completed" : "equivalent"
					})
				});
				committedSources.set(source.sourcePath, sourceKey);
			}
		}
		params.assertCurrent();
		return result;
	}, { env }, { operationLabel: "doctor channel ingress import" });
}
//#endregion
//#region src/infra/state-migrations.plugin-doctor-context.ts
function hasUnimportedSessionIdentity(params) {
	const agentId = normalizeAgentId(params.agentId);
	const configuredStore = resolveSessionStorePathCore(params.config.session?.store, {
		agentId,
		env: params.env
	});
	const defaultStore = resolveSessionStorePathCore(void 0, {
		agentId,
		env: params.env
	});
	const sources = /* @__PURE__ */ new Set([configuredStore, defaultStore]);
	let importedIdentity = false;
	let unimportedIdentity = false;
	for (const storePath of sources) {
		if (storePath.endsWith(".sqlite")) continue;
		const key = `${agentId}\0${storePath}`;
		let sourceEvidence = params.cache.get(key);
		if (sourceEvidence === void 0) {
			const before = fs.statSync(storePath, {
				throwIfNoEntry: false,
				bigint: true
			});
			sourceEvidence = {
				imported: false,
				sessionIds: /* @__PURE__ */ new Set()
			};
			if (before) {
				const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath, {
					agentId,
					env: params.env
				}).path;
				const receipt = readDeferredPluginSessionImport({
					cfg: params.config,
					target: {
						agentId,
						storePath
					},
					sqlitePath,
					env: params.env,
					purpose: "canonical"
				});
				if (receipt) {
					const index = receipt.sources.find((source) => source.path === path.resolve(storePath));
					if (!index || !resolveVerifiedSessionSource(index, {
						agentId,
						storePath,
						sqlitePath
					}, params.env)) throw new Error(`Retained plugin session index requires Doctor repair: ${storePath}`);
				}
				const parsed = readSessionStoreJson5(storePath);
				const after = fs.statSync(storePath, {
					throwIfNoEntry: false,
					bigint: true
				});
				if (!parsed.ok || !after || [
					"dev",
					"ino",
					"mtimeNs",
					"ctimeNs",
					"size"
				].some((field) => before[field] !== after[field])) throw new Error(`Legacy session source could not be verified while reading identity evidence: ${storePath}`);
				sourceEvidence = {
					imported: receipt !== void 0,
					sessionIds: new Set(Object.values(parsed.store).flatMap((entry) => isRecord(entry) && typeof entry.sessionId === "string" ? [entry.sessionId.trim()] : []))
				};
			}
			params.cache.set(key, sourceEvidence);
		}
		if (sourceEvidence.sessionIds.has(params.sessionId)) {
			importedIdentity ||= sourceEvidence.imported;
			unimportedIdentity ||= !sourceEvidence.imported;
		}
	}
	return !importedIdentity && unimportedIdentity;
}
function resolveDoctorSessionIdentityEvidence(params) {
	if (params.requests.length > 512) throw new Error("Plugin doctor session evidence batch exceeds the maximum size.");
	const probes = [];
	for (const [index, request] of params.requests.entries()) {
		const agentId = normalizeAgentId(request.agentId);
		let targets = params.targetsByAgent.get(agentId);
		if (targets === void 0) {
			try {
				const resolved = resolveExistingAgentSessionStoreTargetsReadOnlyResult(params.config, agentId, {
					cache: params.cache,
					env: params.env
				});
				if (!resolved.available) targets = null;
				else {
					const candidates = resolved.targets.length ? resolved.targets : [{
						agentId,
						storePath: resolveSessionStorePathCore(params.config.session?.store, {
							agentId,
							env: params.env
						})
					}];
					targets = dedupeSessionStoreTargetsBySqliteTarget(candidates, {
						defaultAgentId: agentId,
						env: params.env
					});
				}
			} catch {
				targets = null;
			}
			params.targetsByAgent.set(agentId, targets);
		}
		for (const target of targets ?? []) probes.push({
			...target,
			env: params.env,
			index,
			sessionId: request.sessionId
		});
	}
	const evidence = readSessionIdentityEvidenceBatch(probes);
	const sourceImports = /* @__PURE__ */ new Map();
	const observedByRequest = params.requests.map(() => []);
	for (const [position, observed] of evidence.entries()) observedByRequest[probes[position].index].push(observed);
	return params.requests.map((request, index) => {
		const observed = observedByRequest[index];
		const current = observed.filter((entry) => entry.status === "current");
		if (!observed.length || observed.some((entry) => entry.status === "unknown") || current.length > 1) return {
			...request,
			state: "unknown"
		};
		const unimported = current.length === 0 && hasUnimportedSessionIdentity({
			agentId: request.agentId,
			sessionId: request.sessionId,
			config: params.config,
			env: params.env,
			cache: sourceImports
		});
		return current[0] ? {
			...request,
			state: "current",
			sessionKey: current[0].sessionKey
		} : {
			...request,
			state: unimported ? "unknown" : "absent"
		};
	});
}
/** Build a genuinely read-only object rather than a narrowed view of the queue.
*  A `Pick<...>` return type would still hand the caller every mutating method at
*  runtime, so the boundary has to exist in the value, not only in the type. */
function projectIngressQueueForInspection(queue) {
	const listFailed = queue.listFailed?.bind(queue);
	const projection = {
		listPending: (...args) => queue.listPending(...args),
		listClaims: () => queue.listClaims()
	};
	if (listFailed) projection.listFailed = (...args) => listFailed(...args);
	return projection;
}
function buildChannelIngressQueueAccess(options) {
	const { channelIds, stateDir, mutation } = options;
	return channelIds.map((channelId) => {
		const open = (openOptions, access, assertCurrent) => createChannelIngressQueue({
			channelId,
			...openOptions?.accountId === void 0 ? {} : { accountId: openOptions.accountId },
			stateDir,
			access
		}, assertCurrent);
		const access = {
			channelId,
			openChannelIngressQueueForInspection: (openOptions) => projectIngressQueueForInspection(open(openOptions, "read-only")),
			listChannelIngressQueueAccountIds: () => listChannelIngressQueueAccountIdsReadOnly({
				channelId,
				stateDir
			})
		};
		if (mutation) {
			const assertCurrent = () => mutation.assertCurrent();
			access.assertCurrent = assertCurrent;
			access.importLegacyEntries = (input) => importLegacyChannelIngressEntries({
				...input,
				channelId,
				stateDir,
				assertCurrent
			});
			access.openChannelIngressQueue = (openOptions) => open(openOptions, "read-write", assertCurrent);
		}
		return access;
	});
}
/** Backed-up same-schema repair; source observations and replacement values freeze before yielding. */
async function repairPluginStateEntriesForDoctor(params) {
	const { pluginId, authority } = params;
	const env = { ...params.env };
	const namespace = validateNamespace(params.namespace);
	const rows = structuredClone(params.replacements).map(({ entry, value }) => {
		const { key, valueJson } = prepareRegisterParams(entry.key, value);
		return {
			entry,
			key,
			valueJson
		};
	});
	if (rows.length > 512 || new Set(rows.map((row) => row.key)).size !== rows.length || rows.some(({ key, entry }) => key !== entry.key)) throw new Error("Plugin Doctor repair requires a bounded batch of distinct rows.");
	if (!rows.length) return {
		changes: [],
		warnings: []
	};
	authority.assertCurrent();
	const databasePath = resolveOpenClawStateSqlitePath(env);
	const identity = readDatabasePathIdentitySync(databasePath);
	const assertCurrent = () => {
		authority.assertCurrent();
		assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
	};
	const validate = (db) => {
		for (const { entry } of rows) {
			const query = getPluginStateKysely(db).selectFrom("plugin_state_entries").select("entry_key").where((eb) => observedPluginStateRow(eb, {
				pluginId,
				namespace
			}, entry));
			if (!executeSqliteQuerySync(db, query).rows.length) throw new Error("Plugin state changed during Doctor repair; inspect again before retrying.");
		}
	};
	const { backupDoctorSqliteDatabases } = await import("./doctor-migration-backup-C-CKdISb.mjs");
	assertCurrent();
	const backup = await backupDoctorSqliteDatabases({
		env,
		pendingDatabasePaths: [databasePath],
		databasePaths: [databasePath],
		authority: { assertCurrent },
		repair: {
			key: createHash("sha256").update(JSON.stringify([
				pluginId,
				namespace,
				rows
			])).digest("hex"),
			validate
		}
	});
	assertCurrent();
	runWriteTransaction("register", ({ db }) => {
		assertCurrent();
		authority.assertOwnedInTransaction(db);
		validate(db);
		for (const { key, valueJson } of rows) executeSqliteQuerySync(db, getPluginStateKysely(db).updateTable("plugin_state_entries").set({ value_json: valueJson }).where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key));
		authority.assertOwnedInTransaction(db);
	}, { env });
	return backup;
}
function createPluginDoctorStateMigrationContext(params) {
	const { pluginId, env } = params;
	const cache = /* @__PURE__ */ new Map();
	const targetsByAgent = /* @__PURE__ */ new Map();
	const context = {
		inspectAcpSessionClaims: async () => {
			params.repairAuthority?.assertCurrent();
			const evidence = await inspectAcpSessionClaimsForDoctor(params);
			params.repairAuthority?.assertCurrent();
			return evidence;
		},
		getPluginStateCapacity: () => getPluginStateCapacity(pluginId, env),
		importPluginStateEntries(options, entries) {
			importPluginStateEntriesForDoctor(pluginId, {
				...options,
				env: options.env ?? env
			}, entries);
		},
		openPluginStateKeyedStore(options) {
			return createPluginStateKeyedStore(pluginId, {
				...options,
				env: options.env ?? env
			});
		},
		readPluginStateEntriesInKeyRange(namespace, range) {
			params.repairAuthority?.assertCurrent();
			return pluginStateDoctorEntriesInKeyRange({
				pluginId,
				namespace,
				...range,
				env
			});
		},
		async readSessionIdentityEvidenceBatch(requests) {
			params.repairAuthority?.assertCurrent();
			const evidence = resolveDoctorSessionIdentityEvidence({
				cache,
				config: params.config,
				env,
				requests,
				targetsByAgent
			});
			params.repairAuthority?.assertCurrent();
			return evidence;
		}
	};
	if (params.channelIngress) context.channelIngressQueues = buildChannelIngressQueueAccess(params.channelIngress);
	if (params.trustedForDurableStores) {
		context.inspectCronJobs = async () => {
			params.repairAuthority?.assertCurrent();
			const { inspectCronJobsForDoctor } = await import("./store-repair-BnQcj5ne.mjs");
			params.repairAuthority?.assertCurrent();
			const inventory = await inspectCronJobsForDoctor(params);
			params.repairAuthority?.assertCurrent();
			return inventory;
		};
		if (params.repairAuthority) {
			const authority = params.repairAuthority;
			context.repairCronJobs = async (inventory, changes) => {
				authority.assertCurrent();
				const { repairCronJobsForDoctor } = await import("./store-repair-BnQcj5ne.mjs");
				authority.assertCurrent();
				return repairCronJobsForDoctor(params, authority, inventory, changes);
			};
		}
	}
	if (params.repairAuthority) {
		const authority = params.repairAuthority;
		context.repairPluginStateEntries = (namespace, replacements) => repairPluginStateEntriesForDoctor({
			pluginId,
			env,
			namespace,
			replacements,
			authority
		});
		context.updateAcpSessionIdentity = (input) => updateAcpSessionIdentityForDoctor(params, authority, input);
		context.deletePluginStateEntriesIfUnchanged = (namespace, entries) => {
			authority.assertCurrent();
			return pluginStateDeleteEntriesIfUnchanged({
				pluginId,
				namespace,
				entries,
				env,
				assertOwnedInTransaction: (database) => authority.assertOwnedInTransaction(database)
			});
		};
	}
	return context;
}
//#endregion
//#region src/infra/state-migrations.plugin-doctor.ts
const PLUGIN_DOCTOR_MIGRATION_LOCK_TIMEOUT_MS = 250;
const PLUGIN_DOCTOR_MIGRATION_LOCK_POLL_INTERVAL_MS = 25;
function pluginInspectionFacts(collection) {
	return {
		...collection.requiredPluginIds.size > 0 ? { requiredPluginIds: [...collection.requiredPluginIds] } : {},
		...collection.statelessPluginIds.size > 0 ? { statelessPluginIds: [...collection.statelessPluginIds] } : {}
	};
}
function completedPluginInspection(collection, migrated, excludedPluginIds = collection.otherPhasePluginIds) {
	const pendingIds = new Set(collection.plans.map((plan) => plan.pluginId));
	const migratedIds = new Set(migrated.completedPluginIds);
	const completedPluginIds = [...collection.inspectedPluginIds].filter((pluginId) => !excludedPluginIds.has(pluginId) && (!pendingIds.has(pluginId) || migratedIds.has(pluginId)));
	return completedPluginIds.length > 0 ? { completedPluginIds } : {};
}
function validatePluginDoctorPlanOrder(params) {
	if (new Set(params.actions.map((action) => JSON.stringify([action.pluginId, action.id]))).size !== params.actions.length || params.actions.length !== params.plannedActions.length || params.actions.some((action, index) => {
		const planned = params.plannedActions[index];
		return action.pluginId !== planned?.pluginId || action.id !== planned?.id;
	})) return `Refused plugin migrations that do not match the immutable action order: ${params.actions.map((action) => `${action.pluginId}:${action.id}`).join(", ")}.`;
}
async function collectPluginDoctorStateMigrationPlans(input, params) {
	const plans = [];
	const inspectedPluginIds = /* @__PURE__ */ new Set();
	const otherPhasePluginIds = /* @__PURE__ */ new Set();
	const requiredPluginIds = /* @__PURE__ */ new Set();
	const statelessPluginIds = /* @__PURE__ */ new Set();
	const collected = {
		plans,
		inspectedPluginIds,
		otherPhasePluginIds,
		requiredPluginIds,
		statelessPluginIds,
		notices: [],
		assertResourceScope() {}
	};
	const { config, env } = input;
	let entries;
	try {
		entries = listPluginDoctorStateMigrationEntries({
			config,
			env,
			inventory: params.inventory,
			validateDeclarations: params.validateDeclarations,
			onInspectedPlugin: (pluginId) => inspectedPluginIds.add(pluginId),
			onInspectedStatelessPlugin: (pluginId) => statelessPluginIds.add(pluginId)
		});
	} catch (error) {
		if (!(error instanceof PluginDoctorStateMigrationDeclarationError)) throw error;
		params.warnings?.push(error.message);
		inspectedPluginIds.clear();
		return collected;
	}
	for (const entry of entries) {
		requiredPluginIds.add(entry.pluginId);
		inspectedPluginIds.add(entry.pluginId);
		if (entry.migration.phase !== params.phase) otherPhasePluginIds.add(entry.pluginId);
	}
	for (const entry of entries) if (entry.migration.doctorOnly === true && params.includeDoctorOnly !== true) inspectedPluginIds.delete(entry.pluginId);
	const allEntries = entries;
	entries = entries.filter(({ migration }) => migration.phase === params.phase && (migration.doctorOnly !== true || params.includeDoctorOnly === true));
	if (params.plannedActions) {
		const refusal = validatePluginDoctorPlanOrder({
			actions: entries.map(({ pluginId, migration }) => ({
				pluginId,
				id: migration.id
			})),
			plannedActions: params.plannedActions
		});
		if (refusal) {
			params.warnings?.push(refusal);
			inspectedPluginIds.clear();
			return collected;
		}
	}
	if (resolveUpdateRehearsalRoot(env)) {
		const scope = await preparePluginDoctorMigrationResources(allEntries, {
			config,
			env,
			stateDir: input.stateDir,
			warnings: [],
			requireLocalResources: true
		});
		collected.notices.push(...scope.notices);
		collected.assertResourceScope = scope.assertCurrent;
		for (const pluginId of scope.deferredPluginIds) inspectedPluginIds.delete(pluginId);
		entries = entries.filter((entry) => !scope.deferredPluginIds.has(entry.pluginId));
	}
	for (const entry of entries) {
		let detected;
		try {
			params.repairAuthority?.assertCurrent();
			collected.assertResourceScope();
			detected = await entry.migration.detectLegacyState({
				...input,
				serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(config, env) ?? resolveDefaultAgentWorkspaceDir(env),
				context: createPluginDoctorStateMigrationContext({
					pluginId: entry.pluginId,
					env,
					config,
					repairAuthority: params.repairAuthority,
					trustedForDurableStores: entry.trustedForDurableStores ?? true,
					...entry.trustedForDurableStores ?? true ? { channelIngress: {
						channelIds: entry.channelIds ?? [],
						stateDir: input.stateDir
					} } : {}
				})
			});
		} catch (err) {
			inspectedPluginIds.delete(entry.pluginId);
			params.warnings?.push(`Failed detecting ${entry.migration.label}: ${String(err)}`);
			continue;
		}
		if (detected?.preview.length) plans.push({
			pluginId: entry.pluginId,
			channelIds: entry.channelIds,
			trustedForDurableStores: entry.trustedForDurableStores,
			migration: entry.migration,
			preview: detected.preview
		});
	}
	return collected;
}
async function runPluginDoctorStateMigrationPlans(params) {
	const input = {
		config: params.config,
		env: params.env,
		stateDir: params.detected.stateDir,
		oauthDir: params.detected.oauthDir
	};
	const warnings = [];
	const collected = await collectPluginDoctorStateMigrationPlans(input, {
		includeDoctorOnly: params.detected.doctorOnlyStateMigrations,
		warnings,
		plannedActions: params.plannedActions,
		inventory: params.inventory
	});
	const hasDetectorFailure = warnings.length > 0;
	const migrated = await migratePluginDoctorStatePlans(input, collected.plans, void 0, collected.assertResourceScope);
	return {
		...migrated,
		completedPluginIds: void 0,
		...completedPluginInspection(collected, migrated),
		...pluginInspectionFacts(collected),
		warnings: [...warnings, ...migrated.warnings],
		...collected.notices.length > 0 ? { notices: [...collected.notices, ...migrated.notices ?? []] } : {},
		...hasDetectorFailure ? { warningDisposition: void 0 } : {}
	};
}
async function migratePluginDoctorStatePlans(input, plans, repairAuthority, assertResourceScope) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const completedPluginIds = new Set(plans.map((plan) => plan.pluginId));
	let hasRefusal = false;
	if (plans.length === 0) return {
		changes,
		warnings
	};
	let ingressMutationActive = false;
	const assertIngressMutationCurrent = () => {
		if (!ingressMutationActive) throw new Error("Plugin Doctor ingress queue access has expired.");
		repairAuthority?.assertCurrent();
	};
	const migrate = async () => {
		ingressMutationActive = true;
		try {
			return await migrateWithIngressAuthority();
		} finally {
			ingressMutationActive = false;
		}
	};
	const migrateWithIngressAuthority = async () => {
		for (const plan of plans) try {
			repairAuthority?.assertCurrent();
			assertResourceScope?.();
			const result = await plan.migration.migrateLegacyState({
				...input,
				serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(input.config, input.env) ?? resolveDefaultAgentWorkspaceDir(input.env),
				context: createPluginDoctorStateMigrationContext({
					pluginId: plan.pluginId,
					env: input.env,
					config: input.config,
					repairAuthority,
					trustedForDurableStores: plan.trustedForDurableStores ?? true,
					...plan.trustedForDurableStores ?? true ? { channelIngress: {
						channelIds: plan.channelIds ?? [],
						stateDir: input.stateDir,
						mutation: { assertCurrent: assertIngressMutationCurrent }
					} } : {}
				})
			});
			repairAuthority?.assertCurrent();
			changes.push(...result.changes);
			warnings.push(...result.warnings);
			if (result.warnings.length > 0) completedPluginIds.delete(plan.pluginId);
			if (result.warnings.length > 0 && result.warningDisposition !== "recoverable") hasRefusal = true;
			notices.push(...result.notices ?? []);
		} catch (err) {
			completedPluginIds.delete(plan.pluginId);
			hasRefusal = true;
			warnings.push(`Failed migrating ${plan.migration.label}: ${String(err)}`);
		}
		return {
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {},
			...completedPluginIds.size > 0 ? { completedPluginIds: [...completedPluginIds] } : {},
			...warnings.length > 0 && !hasRefusal ? { warningDisposition: "recoverable" } : {}
		};
	};
	if (repairAuthority) return migrate();
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env: {
				...input.env,
				OPENCLAW_STATE_DIR: input.stateDir
			},
			pollIntervalMs: PLUGIN_DOCTOR_MIGRATION_LOCK_POLL_INTERVAL_MS,
			role: "sqlite-maintenance",
			timeoutMs: PLUGIN_DOCTOR_MIGRATION_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		return {
			changes,
			warnings: [`Skipped plugin doctor state migrations because exclusive state ownership is unavailable: ${String(error)}`]
		};
	}
	if (!lock) return {
		changes,
		warnings: ["Skipped plugin doctor state migrations because exclusive state ownership is unavailable"]
	};
	try {
		return await lock.run(migrate);
	} finally {
		await lock.release();
	}
}
/** Detect after canonical inspection; destructive repair also requires offline maintenance ownership. */
async function runPostSessionPluginDoctorStateRepairs(params) {
	const stateDir = resolveStateDir(params.env);
	const input = {
		config: params.config,
		env: params.env,
		stateDir,
		oauthDir: resolveOAuthDir(params.env, stateDir)
	};
	const run = async (repairAuthority, certifyCompletion = true) => {
		const warnings = [];
		repairAuthority?.assertCurrent();
		const collected = await collectPluginDoctorStateMigrationPlans(input, {
			includeDoctorOnly: true,
			phase: "after-session-repair",
			repairAuthority,
			warnings,
			plannedActions: params.plannedActions,
			inventory: params.inventory
		});
		if (!repairAuthority) return {
			changes: [],
			...collected.notices.length > 0 ? { notices: collected.notices } : {},
			warnings: [
				...warnings,
				...collected.plans.flatMap((plan) => plan.preview),
				...collected.plans.length ? ["Run \"openclaw doctor --fix\" to repair plugin session ownership."] : []
			]
		};
		const result = await migratePluginDoctorStatePlans(input, collected.plans, repairAuthority, collected.assertResourceScope);
		const earlier = certifyCompletion ? await collectPluginDoctorStateMigrationPlans(input, {
			includeDoctorOnly: true,
			inventory: params.inventory,
			repairAuthority,
			warnings
		}) : void 0;
		const notices = [...collected.notices, ...earlier?.notices ?? []];
		return {
			...result,
			completedPluginIds: void 0,
			...earlier ? completedPluginInspection(collected, result, /* @__PURE__ */ new Set([...earlier.plans.map((plan) => plan.pluginId), ...[...collected.inspectedPluginIds].filter((pluginId) => !earlier.inspectedPluginIds.has(pluginId))])) : {},
			...pluginInspectionFacts(collected),
			warnings: [...warnings, ...result.warnings],
			...notices.length > 0 ? { notices: [.../* @__PURE__ */ new Set([...notices, ...result.notices ?? []])] } : {},
			...warnings.length > 0 ? { warningDisposition: void 0 } : {}
		};
	};
	const maintenance = params.maintenanceAuthority;
	if (!maintenance) return run();
	maintenance.assertCurrent();
	const { assertDeferredPluginMigrationsCurrent, readDeferredPluginMigrations, recordDeferredPluginMigrations } = await import("./deferred-plugin-migrations-jxTacP3N.mjs");
	maintenance.assertCurrent();
	const expectedPending = readDeferredPluginMigrations({ env: params.env });
	const certifyCompletion = expectedPending.length > 0 || params.beforeCompletion !== void 0;
	const assertCompletionCurrent = () => {
		maintenance.assertCurrent();
		assertDeferredPluginMigrationsCurrent({
			env: params.env,
			expectedPending
		});
	};
	let completed = {
		changes: [],
		warnings: []
	};
	try {
		const result = await withAgentDatabaseMaintenanceLease({ env: params.env }, async (agentLease) => withPluginLifecycleLease({
			env: params.env,
			waitMs: 5e3
		}, async (pluginLease) => {
			let active = true;
			const assertCurrent = () => {
				if (!active) throw new Error("Plugin Doctor repair authority has expired.");
				maintenance.assertCurrent();
			};
			const authority = {
				assertCurrent() {
					assertCurrent();
					agentLease.assertOwned();
					pluginLease.assertOwned();
				},
				assertOwnedInTransaction(database) {
					assertCurrent();
					agentLease.assertOwnedInTransaction(database);
					pluginLease.assertOwnedInTransaction(database);
				}
			};
			try {
				completed = await run(authority, certifyCompletion);
				return completed;
			} finally {
				active = false;
			}
		}));
		if (result.completedPluginIds?.length) {
			assertCompletionCurrent();
			await params.beforeCompletion?.(result.completedPluginIds, assertCompletionCurrent);
			assertCompletionCurrent();
			await withPluginLifecycleLease({
				env: params.env,
				assertCurrent: () => maintenance.assertCurrent()
			}, async () => recordDeferredPluginMigrations({
				env: params.env,
				pending: [],
				resolvedPluginIds: result.completedPluginIds,
				expectedPending
			}));
		}
		return result;
	} catch (error) {
		return {
			...completed,
			completedPluginIds: void 0,
			warnings: [...completed.warnings, `Plugin session repair did not settle: ${formatErrorMessage(error)}.`],
			warningDisposition: void 0
		};
	}
}
async function autoMigrateLegacyPluginDoctorState(params) {
	const env = params.env ?? process.env;
	const stateDirResult = await autoMigrateLegacyStateDir({
		env,
		homedir: params.homedir,
		log: params.log
	});
	const stateDir = resolveStateDir(env, params.homedir ?? os.homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const stateSchema = await prepareOpenClawStateDatabaseSchema({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} }, params.doctorOnlyStateMigrations === true ? "doctor" : "automatic");
	const changes = [...stateDirResult.changes, ...stateSchema.changes];
	const warnings = [...stateDirResult.warnings, ...stateSchema.warnings];
	const notices = [...stateDirResult.notices ?? []];
	if (stateSchema.warnings.length > 0 && params.doctorOnlyStateMigrations !== true) throw new Error(formatStartupMigrationFailure(stateSchema.warnings));
	const input = {
		config: params.config,
		env,
		stateDir,
		oauthDir
	};
	const collected = stateSchema.warnings.length > 0 ? {
		plans: [],
		inspectedPluginIds: /* @__PURE__ */ new Set(),
		otherPhasePluginIds: /* @__PURE__ */ new Set(),
		requiredPluginIds: /* @__PURE__ */ new Set(),
		statelessPluginIds: /* @__PURE__ */ new Set(),
		notices: [],
		assertResourceScope() {}
	} : await collectPluginDoctorStateMigrationPlans(input, {
		includeDoctorOnly: params.doctorOnlyStateMigrations === true,
		warnings
	});
	const migrated = await migratePluginDoctorStatePlans(input, collected.plans, void 0, collected.assertResourceScope);
	changes.push(...migrated.changes);
	warnings.push(...migrated.warnings);
	notices.push(...collected.notices, ...migrated.notices ?? []);
	return {
		migrated: stateDirResult.migrated || stateSchema.changes.length > 0 || collected.plans.length > 0,
		skipped: false,
		changes,
		warnings,
		...completedPluginInspection(collected, migrated),
		...pluginInspectionFacts(collected),
		...notices.length > 0 ? { notices } : {}
	};
}
//#endregion
export { repairAcpSessionMetaKeysForDoctor as a, runPostSessionPluginDoctorStateRepairs as i, collectPluginDoctorStateMigrationPlans as n, runPluginDoctorStateMigrationPlans as r, autoMigrateLegacyPluginDoctorState as t };
