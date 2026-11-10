import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { T as resolveOAuthDir } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath, c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { T as tryResolveConfiguredAgentWorkspaceDir, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import "./workspace-default-BjEaT57h.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { a as prepareOpenClawStateDatabaseSchema, r as openExistingOpenClawStateDatabaseReadOnly, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as recordLegacyMigrationReceipt, c as resolveLegacyMigrationSourceKey, i as readLegacyMigrationReceiptFromDatabase, n as markLegacyMigrationSourceRemovedInDatabase } from "./state-migrations.receipts-CikBNdPu.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-iJNKNMuJ.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { f as dedupeSessionStoreTargetsBySqliteTarget } from "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { s as resolveExistingAgentSessionStoreTargetsReadOnlyResult } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { _ as scanDoctorSessionEntriesTolerant } from "./session-accessor-Czw4l8kI.mjs";
import { s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { d as recordLegacyAcpMigrationCompletion, s as hasLegacyAcpMigrationCompletion, u as prepareLegacyAcpMigrationSource } from "./session-accessor.sqlite-acp-provenance-Bl2TV_Gc.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as readSessionIdentityEvidenceBatch, t as loadExactSessionEntryReadOnlyResult } from "./session-accessor.sqlite-entry-availability-U0xmd5-G.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { d as getPluginStateKysely } from "./plugin-state-store.types-CLUTlkgE.mjs";
import { a as prepareRegisterParams, l as validateNamespace } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { n as runWriteTransaction } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { _ as pluginStateDoctorEntriesInKeyRange, f as importPluginStateEntriesForDoctor, g as pluginStateDeleteEntriesIfUnchanged, h as observedPluginStateRow, i as createPluginStateKeyedStore, m as getPluginStateCapacity } from "./plugin-state-store-DY4rDlss.mjs";
import { r as resolveChannelIngressStateEnv } from "./ingress-queue-health-cache-CyEdhKLC.mjs";
import { n as listChannelIngressQueueAccountIdsReadOnly, t as createChannelIngressQueue } from "./ingress-queue-C6bpPhkY.mjs";
import { a as parseAcpDatabaseSessionKey, c as selectAcpSessionRow, d as selectAcpSessionRows, f as upsertAcpSessionMetaRow, i as getAcpSessionKysely, n as buildAcpDatabaseSessionKey, r as deleteAcpSessionMetaRows, t as acpSessionRowMatchesEntry } from "./session-meta-keys-BWMCJN-1.mjs";
import { i as rowToAcpSessionMeta } from "./session-meta-readonly-CHaonIQO.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DksRcpO8.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { l as listPluginDoctorStateMigrationEntries, t as PluginDoctorStateMigrationDeclarationError } from "./doctor-contract-registry-CPMSf5LC.mjs";
import { r as formatStartupMigrationFailure } from "./state-migrations.messages-CB0bXmSE.mjs";
import { r as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-u13JUemz.mjs";
import { n as captureAcpSessionEntryBinding } from "./session-meta-entry.kernel-DisS3yfP.mjs";
import { n as bindAcpSessionIdentity, r as bindAcpSessionMeta } from "./session-meta-write.kernel-Bl7f-Zcr.mjs";
import { n as selectAcpMigrationRowForStoreEntry, t as legacyAcpSessionKeyCandidates } from "./session-meta-migration-keys-tz5TAmfV.mjs";
import { n as sanitizeOpenClawStateLeaseRows } from "./openclaw-state-snapshot-sanitizer-rntdA4KE.mjs";
import { i as readSessionStoreJson5 } from "./state-migrations.fs-CIv9i5nQ.mjs";
import { t as autoMigrateLegacyStateDir } from "./state-migrations.state-dir-ClPpou0a.mjs";
import { r as listExistingAgentDatabaseTargets } from "./session-sqlite-migration-readers-CrMHjx1c.mjs";
import { n as preparePluginDoctorMigrationResources } from "./doctor-migration-resources-DJ5GVzyR.mjs";
import { f as resolveVerifiedSessionSource, o as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-Bck_1DwX.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-BnxXacoQ.mjs";
import { r as rewriteDoctorSessionEntries } from "./session-entry-rewrite-BDkjlbP2.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/acp/runtime/session-meta-migration-embedded.ts
function sameEmbeddedAcpSource(current, expected) {
	return current !== void 0 && current.sessionId === expected.sessionId && current.lifecycleRevision === expected.lifecycleRevision && current.sessionStartedAt === expected.sessionStartedAt && current.updatedAt === expected.updatedAt && isDeepStrictEqual(current.acp, expected.acp);
}
/** Import embedded SQLite metadata before retiring the source field. Receipts prevent replay after closure. */
async function repairEmbeddedAcpSessionMetaForDoctor(params) {
	const report = {
		found: 0,
		repaired: 0,
		backups: [],
		warnings: []
	};
	for (const target of params.targets) {
		params.authority?.assertCurrent();
		const scope = {
			agentId: target.agentId,
			storePath: target.storePath,
			env: params.env
		};
		const entries = /* @__PURE__ */ new Map();
		try {
			const identity = readDatabasePathIdentitySync(target.sqlitePath);
			scanDoctorSessionEntriesTolerant(scope, ({ entry, sessionKey, recoveredFromProjections }) => {
				if (!recoveredFromProjections && entry.acp != null) entries.set(sessionKey, entry);
			});
			report.found += entries.size;
			if (!params.apply || !entries.size) continue;
			const authority = params.authority;
			if (!authority) throw new Error("Embedded ACP repair requires Doctor maintenance authority.");
			const assertSourceCurrent = () => {
				authority.assertCurrent();
				assertExistingDatabaseIdentity(target.sqlitePath, identity.key, identity.birthtime);
			};
			assertSourceCurrent();
			const backup = await createVerifiedSqliteSnapshot({
				sourcePath: target.sqlitePath,
				targetPath: `${target.sqlitePath}.pre-acp-metadata-migration-${randomUUID()}.bak`,
				preserveRowIds: true,
				transform: sanitizeOpenClawStateLeaseRows,
				validate: (snapshot) => {
					for (const [sessionKey, entry] of entries) {
						const row = executeSqliteQueryTakeFirstSync(snapshot, getSessionKysely(snapshot).selectFrom("session_nodes").select([
							"session_key",
							"entry_json",
							"current_session_id",
							"updated_at"
						]).where("session_key", "=", sessionKey));
						if (!sameEmbeddedAcpSource(row ? parseSqliteSessionEntryRecord(row) ?? void 0 : void 0, entry)) throw new Error("Embedded ACP backup does not match the planned source; source retained.");
					}
				},
				beforePublish: assertSourceCurrent
			});
			report.backups.push(backup.path);
			assertSourceCurrent();
			for (const [sessionKey, entry] of entries) try {
				const meta = entry.acp;
				if (meta == null) continue;
				const owner = resolveSessionStorePathForAcp({
					cfg: params.cfg,
					env: params.env,
					sessionKey,
					agentId: parseAgentSessionKey(sessionKey)?.agentId ?? (isPerAgentSessionStoreConfig(params.cfg.session?.store) ? target.agentId : void 0)
				});
				const ownerScope = resolveSqliteScope({
					agentId: owner.agentId,
					storePath: owner.storePath,
					sessionKey: owner.storeSessionKey,
					env: params.env
				});
				if (owner.storeSessionKey !== sessionKey || !isSameOpenClawAgentDatabasePath(resolveOpenClawAgentSqlitePath(toDatabaseOptions(ownerScope)), target.sqlitePath)) throw new Error("Embedded ACP session owner does not match its source store; source retained.");
				const resolved = resolveSqliteScope({
					...scope,
					sessionKey
				});
				const source = prepareLegacyAcpMigrationSource({
					sourcePath: target.sqlitePath,
					sourceSessionKey: sessionKey,
					sessionId: entry.sessionId,
					lifecycleRevision: entry.lifecycleRevision,
					meta,
					sourceEntry: {
						sessionId: entry.sessionId,
						sessionStartedAt: entry.sessionStartedAt,
						updatedAt: entry.updatedAt
					}
				});
				const canonicalKey = buildAcpDatabaseSessionKey(sessionKey, owner.agentId);
				const normalized = bindAcpSessionMeta({
					sessionKey: canonicalKey,
					sessionId: entry.sessionId,
					lifecycleRevision: entry.lifecycleRevision,
					meta,
					updatedAt: entry.updatedAt
				});
				const imported = withOpenClawAgentDatabaseReadOnly((agentDatabase) => {
					runOpenClawStateWriteTransaction((shared) => {
						assertSourceCurrent();
						const current = readExactSessionEntryRowValidated(agentDatabase, resolved.sessionKey)?.entry;
						if (!sameEmbeddedAcpSource(current, entry)) throw new Error("Embedded ACP source changed during Doctor repair; source retained.");
						if (hasLegacyAcpMigrationCompletion(shared.db, source)) return;
						const canonical = selectAcpSessionRow(shared.db, canonicalKey);
						if (!canonical && selectAcpMigrationRowForStoreEntry(shared.db, sessionKey, owner.agentId, params.cfg, entry)) throw new Error("Unresolved legacy ACP aliases remain; embedded metadata retained.");
						if (canonical && (canonical.session_id !== (entry.lifecycleRevision ?? entry.sessionId) || canonical.updated_at !== normalized.updated_at || !isDeepStrictEqual(rowToAcpSessionMeta(canonical), rowToAcpSessionMeta(normalized)))) throw new Error("Stored ACP metadata conflicts with embedded metadata; both sources retained.");
						assertSourceCurrent();
						if (!canonical) upsertAcpSessionMetaRow(shared.db, normalized);
						recordLegacyAcpMigrationCompletion(shared.db, source, Date.now());
					}, { env: params.env });
				}, toDatabaseOptions(resolved));
				if (!imported.found) throw new Error(`Embedded ACP owner became unavailable: ${imported.reason}`);
				assertSourceCurrent();
				report.repaired += rewriteDoctorSessionEntries({
					scope,
					sessionKeys: [sessionKey],
					updateDeliveryProjection: false,
					transform(current) {
						assertSourceCurrent();
						if (!sameEmbeddedAcpSource(current, entry)) throw new Error("Embedded ACP source changed after import; source retained.");
						const { acp: _acp, ...next } = current;
						return next;
					}
				});
			} catch (error) {
				authority.assertCurrent();
				report.warnings.push(`${sessionKey}: ${String(error)}`);
			}
		} catch (error) {
			params.authority?.assertCurrent();
			report.warnings.push(`${target.sqlitePath}: ${String(error)}`);
		}
	}
	return report;
}
//#endregion
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
	const targets = params.targets ?? listExistingAgentDatabaseTargets(params.cfg, params.env);
	const sourcePath = resolveOpenClawStateSqlitePath(params.env);
	const sourceIdentity = readDatabasePathIdentitySync(sourcePath);
	const assertSourceCurrent = () => {
		params.authority?.assertCurrent();
		assertExistingDatabaseIdentity(sourcePath, sourceIdentity.key, sourceIdentity.birthtime);
	};
	const database = await openExistingOpenClawStateDatabaseReadOnly({ env: params.env });
	let rows = [];
	if (database) {
		try {
			assertSourceCurrent();
			rows = selectAcpSessionRows(database.db);
		} finally {
			database.walMaintenance.close();
		}
		result.scannedRows = rows.length;
		const candidateAgentIds = [.../* @__PURE__ */ new Set([...listAgentIds(params.cfg), ...targets.map((target) => target.agentId)])];
		const groups = /* @__PURE__ */ new Map();
		for (const row of rows) {
			const destinations = /* @__PURE__ */ new Map();
			let problem;
			let inspectionFailed = false;
			for (const identity of legacyAcpSessionKeyCandidates(row.session_key, candidateAgentIds)) try {
				const owner = resolveSessionStorePathForAcp({
					cfg: params.cfg,
					env: params.env,
					sessionKey: identity.storeSessionKey,
					agentId: identity.agentId
				});
				const stored = loadExactSessionEntryReadOnlyResult({
					agentId: owner.agentId,
					storePath: owner.storePath,
					sessionKey: owner.storeSessionKey,
					env: params.env
				});
				if (!stored.found) {
					inspectionFailed ||= stored.reason !== "database-missing";
					problem = /* @__PURE__ */ new Error(`ACP session binding is ${stored.reason}`);
					continue;
				}
				if (!stored.value) {
					problem = /* @__PURE__ */ new Error("ACP session binding is absent");
					continue;
				}
				if (!acpSessionRowMatchesEntry(row, stored.value.entry)) {
					problem = /* @__PURE__ */ new Error("ACP metadata binding is stale");
					continue;
				}
				const destinationKey = buildAcpDatabaseSessionKey(owner.storeSessionKey, owner.agentId);
				destinations.set(destinationKey, {
					sessionKey: owner.storeSessionKey,
					agentId: owner.agentId
				});
			} catch (error) {
				inspectionFailed ||= !(error instanceof AgentSelectionRequiredError);
				problem = error;
			}
			if (inspectionFailed) {
				result.warnings.push(`${row.session_key}: could not inspect every candidate session owner: ${formatErrorMessage(problem)}; source retained. Repair the named store before rerunning Doctor.`);
				continue;
			}
			if (destinations.size > 1) {
				result.warnings.push(`${row.session_key}: multiple session owners match this legacy key; source retained.`);
				continue;
			}
			const destination = destinations.entries().next().value;
			if (!destination) {
				result.warnings.push(`${row.session_key}: ${formatErrorMessage(problem ?? "No matching live session binding was found")}. Restore its owning session/config or resolve its ownership, then rerun Doctor; source retained.`);
				continue;
			}
			const [destinationKey, owner] = destination;
			if (destinationKey !== row.session_key) {
				const group = groups.get(destinationKey) ?? {
					...owner,
					aliases: []
				};
				group.aliases.push(row);
				groups.set(destinationKey, group);
			}
		}
		for (const [destinationKey, group] of groups) {
			const { sessionKey, agentId } = group;
			try {
				const owner = resolveSessionStorePathForAcp({
					cfg: params.cfg,
					env: params.env,
					sessionKey,
					agentId
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
				const aliases = group.aliases.toSorted((a, b) => b.last_activity_at - a.last_activity_at || (a.session_key < b.session_key ? -1 : a.session_key > b.session_key ? 1 : 0));
				const matching = aliases.filter((row) => acpSessionRowMatchesEntry(row, binding));
				const source = matching.find((row) => row.session_key === `@agent:${agentId}:${sessionKey}`) ?? matching.find((row) => row.session_key === sessionKey) ?? matching[0];
				if (!source) throw new Error("ACP metadata binding is stale");
				const destination = rows.find((row) => row.session_key === destinationKey);
				if (destination && (!acpSessionRowMatchesEntry(destination, binding) || !sameAcpSessionPayload(destination, source))) throw new Error("stored ACP metadata conflicts with its raw alias");
				const consumed = matching.filter((row) => sameAcpSessionPayload(row, source));
				result.found += consumed.length;
				if (matching.length !== aliases.length) result.warnings.push(`${sessionKey}: stale ACP aliases retained.`);
				if (consumed.length !== matching.length) result.warnings.push(`${sessionKey}: ACP aliases with conflicting payloads retained.`);
				if (!params.apply) continue;
				assertSourceCurrent();
				if (!result.backups?.length) {
					result.backups = [(await createVerifiedSqliteSnapshot({
						sourcePath: database.path,
						targetPath: `${database.path}.pre-acp-key-migration-${randomUUID()}.bak`,
						preserveRowIds: true,
						transform: sanitizeOpenClawStateLeaseRows,
						validate: (snapshot) => {
							if (!isDeepStrictEqual(selectAcpSessionRows(snapshot), rows)) throw new Error("ACP backup does not match the planned metadata; source retained.");
						},
						beforePublish: assertSourceCurrent
					})).path];
					assertSourceCurrent();
				}
				const repaired = withOpenClawAgentDatabaseReadOnly((agentDatabase) => {
					runOpenClawStateWriteTransaction((shared) => {
						assertSourceCurrent();
						const currentOwner = resolveSessionStorePathForAcp({
							cfg: params.cfg,
							env: params.env,
							sessionKey,
							agentId
						});
						const currentEntry = readExactSessionEntryRowValidated(agentDatabase, resolved.sessionKey)?.entry;
						const currentBinding = currentEntry && captureAcpSessionEntryBinding(currentEntry);
						const currentAliases = aliases.map((alias) => selectAcpSessionRow(shared.db, alias.session_key));
						if (!isDeepStrictEqual(currentOwner, owner) || !isDeepStrictEqual(currentBinding, binding) || !isDeepStrictEqual(currentAliases, aliases) || !isDeepStrictEqual(selectAcpSessionRow(shared.db, destinationKey), destination)) throw new Error("ACP ownership or metadata changed during Doctor repair; source retained");
						assertSourceCurrent();
						if (!destination) upsertAcpSessionMetaRow(shared.db, {
							...source,
							session_key: destinationKey
						});
						deleteAcpSessionMetaRows(shared.db, consumed.map((row) => row.session_key));
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
		}
	}
	const embedded = await repairEmbeddedAcpSessionMetaForDoctor({
		...params,
		targets
	});
	result.found += embedded.found;
	result.repaired += embedded.repaired;
	result.warnings.push(...embedded.warnings);
	if (embedded.backups.length) result.backups = [...result.backups ?? [], ...embedded.backups];
	return result;
}
function isRetiredClaimOwner(config, target) {
	const storeOwner = resolvePersistedSessionStoreOwner(config);
	if (storeOwner.kind === "retired" && storeOwner.agentId === target.agentId) return true;
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
				const target = parseAcpDatabaseSessionKey(row.session_key);
				if (!target?.agentId || buildAcpDatabaseSessionKey(target.storeSessionKey, target.agentId) !== row.session_key) throw new Error("ACP metadata key is not in the expected format");
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
	const identity = claim.meta.identity;
	if (claim.meta.backend !== scope.pluginId || !identity) throw new Error("ACP identity repair requires a matching backend claim and existing identity");
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
			upsertAcpSessionMetaRow(database.db, {
				...row,
				runtime_session_name: input.runtimeSessionName,
				...bindAcpSessionIdentity({
					...identity,
					acpxRecordId: input.acpxRecordId
				})
			});
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
	if (!channelId || channelId !== channelId.trim() || !accountId || accountId !== accountId.trim()) throw new Error("Doctor ingress import requires normalized channel and account IDs");
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
					}, params.env, /* @__PURE__ */ new Map())) throw new Error(`Retained plugin session index requires Doctor repair: ${storePath}`);
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
	const { backupDoctorSqliteDatabases } = await import("./doctor-migration-backup-Dec9hf3f.mjs");
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
			const { inspectCronJobsForDoctor } = await import("./store-repair-qCD6WWUK.mjs");
			params.repairAuthority?.assertCurrent();
			const inventory = await inspectCronJobsForDoctor(params);
			params.repairAuthority?.assertCurrent();
			return inventory;
		};
		if (params.repairAuthority) {
			const authority = params.repairAuthority;
			context.repairCronJobs = async (inventory, changes) => {
				authority.assertCurrent();
				const { repairCronJobsForDoctor } = await import("./store-repair-qCD6WWUK.mjs");
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
function createMigrationInput(input, owner, repairAuthority, assertIngressMutationCurrent, scope = input) {
	return {
		...input,
		serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(scope.config, scope.env) ?? resolveDefaultAgentWorkspaceDir(scope.env),
		context: createPluginDoctorStateMigrationContext({
			pluginId: owner.pluginId,
			env: scope.env,
			config: scope.config,
			repairAuthority,
			trustedForDurableStores: owner.trustedForDurableStores ?? true,
			...owner.trustedForDurableStores ?? true ? { channelIngress: {
				channelIds: owner.channelIds ?? [],
				stateDir: input.stateDir,
				...assertIngressMutationCurrent ? { mutation: { assertCurrent: assertIngressMutationCurrent } } : {}
			} } : {}
		})
	};
}
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
	const unavailablePluginIds = /* @__PURE__ */ new Set();
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
			onInspectedStatelessPlugin: (pluginId) => statelessPluginIds.add(pluginId),
			onUnavailablePlugin: (pluginId, error) => {
				unavailablePluginIds.add(pluginId);
				requiredPluginIds.add(pluginId);
				params.warnings?.push(`Plugin ${pluginId} is not prepared: ${error.message}`);
			}
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
			plannedActions: params.plannedActions.filter((action) => !unavailablePluginIds.has(action.pluginId))
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
			detected = await entry.migration.detectLegacyState(createMigrationInput(input, entry, params.repairAuthority, void 0, {
				config,
				env
			}));
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
			const result = await plan.migration.migrateLegacyState(createMigrationInput(input, plan, repairAuthority, assertIngressMutationCurrent));
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
	const { assertDeferredPluginMigrationsCurrent, readDeferredPluginMigrations, recordDeferredPluginMigrations } = await import("./deferred-plugin-migrations-qYowxTGV.mjs");
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
		homedir: params.homedir
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
