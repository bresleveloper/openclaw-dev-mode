import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, x as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { C as resolveOAuthDir, E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as listPluginDoctorStateMigrationEntries, t as PluginDoctorStateMigrationDeclarationError } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction, n as openExistingOpenClawStateDatabaseReadOnly, o as repairOpenClawStateDatabaseSchema, s as repairOpenClawStateDatabaseSchemaIfNeeded } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-CYjRlApN.mjs";
import { h as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as importPluginStateEntriesForDoctor, d as getPluginStateCapacity, f as pluginStateDeleteEntriesIfUnchanged, p as pluginStateDoctorEntriesInKeyRange, r as createPluginStateKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import { r as listChannelIngressQueueAccountIdsReadOnly, t as createChannelIngressQueue } from "./ingress-queue-D-wMlCUi.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { p as dedupeSessionStoreTargetsBySqliteTarget } from "./targets-Dmb8-YXN.mjs";
import "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { a as parseAcpDatabaseSessionKeyCandidates, c as selectAcpSessionRow, d as upsertAcpSessionMetaRow, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, r as getAcpSessionKysely, t as acpSessionRowMatchesEntry, u as selectLegacyFreeAcpSessionRows } from "./session-meta-keys-BA3YapJY.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as readSessionIdentityEvidenceBatch, t as loadExactSessionEntryReadOnlyResult } from "./session-accessor.sqlite-entry-availability-B64pRX3U.mjs";
import { a as resolveExistingAgentSessionStoreTargetsReadOnlyResult } from "./session-store-target-inventory-BnUpfTCG.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-C-jzXDgm.mjs";
import { n as rowToAcpSessionMeta } from "./session-meta-readonly-CY2eWmkz.mjs";
import { a as readSessionStoreJson5 } from "./state-migrations.fs-BCymriz5.mjs";
import { s as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-BIJY3F_m.mjs";
import { r as formatStartupMigrationFailure } from "./state-migrations.messages-Sd7IFIbe.mjs";
import { t as autoMigrateLegacyStateDir } from "./state-migrations.state-dir-MerZo4Hg.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import os from "node:os";
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
		const entry = stored.value.entry;
		const binding = {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision,
			sessionStartedAt: entry.sessionStartedAt
		};
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
				const currentBinding = currentEntry && {
					sessionId: currentEntry.sessionId,
					lifecycleRevision: currentEntry.lifecycleRevision,
					sessionStartedAt: currentEntry.sessionStartedAt
				};
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
	const { sessionId, lifecycleRevision, sessionStartedAt } = result.value.entry;
	return {
		sessionId,
		lifecycleRevision,
		sessionStartedAt
	};
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
			const binding = entry && {
				sessionId: entry.sessionId,
				lifecycleRevision: entry.lifecycleRevision,
				sessionStartedAt: entry.sessionStartedAt
			};
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
	const legacyRootStore = path.join(resolveStateDir(params.env), "sessions", "sessions.json");
	const sources = /* @__PURE__ */ new Map([
		[configuredStore, configuredStore],
		[defaultStore, defaultStore],
		[legacyRootStore, configuredStore]
	]);
	let importedIdentity = false;
	let unimportedIdentity = false;
	for (const [storePath, destination] of sources) {
		if (storePath.endsWith(".sqlite")) continue;
		const key = `${agentId}\0${storePath}\0${destination}`;
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
				const sqlitePath = resolveSqliteTargetFromSessionStorePath(destination, {
					agentId,
					env: params.env
				}).path;
				const receipt = readDeferredPluginSessionImport({
					cfg: params.config,
					target: {
						agentId,
						storePath,
						...storePath === legacyRootStore ? { sqlitePath } : {}
					},
					sqlitePath,
					env: params.env
				});
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
/** Re-assert the caller's authority before every write, so a queue handle retained
*  past the locked repair section fails instead of mutating durable rows. */
function guardIngressQueueMutations(queue, assertCurrent) {
	const guarded = {
		...queue,
		enqueue: (...args) => {
			assertCurrent();
			return queue.enqueue(...args);
		},
		claimNext: (...args) => {
			assertCurrent();
			return queue.claimNext(...args);
		},
		claim: (...args) => {
			assertCurrent();
			return queue.claim(...args);
		},
		complete: (...args) => {
			assertCurrent();
			return queue.complete(...args);
		},
		release: (...args) => {
			assertCurrent();
			return queue.release(...args);
		},
		fail: (...args) => {
			assertCurrent();
			return queue.fail(...args);
		},
		delete: (...args) => {
			assertCurrent();
			return queue.delete(...args);
		},
		recoverStaleClaims: (recoverOptions) => {
			assertCurrent();
			if (!recoverOptions) return queue.recoverStaleClaims();
			const { shouldRecover, shouldRecoverCorrupt, ...rest } = recoverOptions;
			const guardedRecovery = { ...rest };
			if (shouldRecover) guardedRecovery.shouldRecover = async (claim) => {
				const decision = await shouldRecover(claim);
				assertCurrent();
				return decision;
			};
			if (shouldRecoverCorrupt) guardedRecovery.shouldRecoverCorrupt = async (claim) => {
				const decision = await shouldRecoverCorrupt(claim);
				assertCurrent();
				return decision;
			};
			return queue.recoverStaleClaims(guardedRecovery);
		},
		prune: (...args) => {
			assertCurrent();
			return queue.prune(...args);
		}
	};
	const refreshClaim = queue.refreshClaim?.bind(queue);
	if (refreshClaim) guarded.refreshClaim = (...args) => {
		assertCurrent();
		return refreshClaim(...args);
	};
	const resubmit = queue.resubmit?.bind(queue);
	if (resubmit) guarded.resubmit = (...args) => {
		assertCurrent();
		return resubmit(...args);
	};
	return guarded;
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
		const open = (openOptions, access) => createChannelIngressQueue({
			channelId,
			...openOptions?.accountId === void 0 ? {} : { accountId: openOptions.accountId },
			stateDir,
			access
		});
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
			access.openChannelIngressQueue = (openOptions) => {
				assertCurrent();
				return guardIngressQueueMutations(open(openOptions, "read-write"), assertCurrent);
			};
		}
		return access;
	});
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
	if (params.repairAuthority) {
		const authority = params.repairAuthority;
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
		statelessPluginIds
	};
	const { config, env } = input;
	let entries;
	try {
		entries = listPluginDoctorStateMigrationEntries({
			config,
			env,
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
	for (const entry of entries) {
		let detected;
		try {
			detected = await entry.migration.detectLegacyState({
				...input,
				serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(config, env) ?? resolveDefaultAgentWorkspaceDir(env),
				context: createPluginDoctorStateMigrationContext({
					pluginId: entry.pluginId,
					env,
					config,
					repairAuthority: params.repairAuthority,
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
		plannedActions: params.plannedActions
	});
	const hasDetectorFailure = warnings.length > 0;
	const migrated = await migratePluginDoctorStatePlans(input, collected.plans);
	return {
		...migrated,
		completedPluginIds: void 0,
		...completedPluginInspection(collected, migrated),
		...pluginInspectionFacts(collected),
		warnings: [...warnings, ...migrated.warnings],
		...hasDetectorFailure ? { warningDisposition: void 0 } : {}
	};
}
async function migratePluginDoctorStatePlans(input, plans, repairAuthority) {
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
			const result = await plan.migration.migrateLegacyState({
				...input,
				serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(input.config, input.env) ?? resolveDefaultAgentWorkspaceDir(input.env),
				context: createPluginDoctorStateMigrationContext({
					pluginId: plan.pluginId,
					env: input.env,
					config: input.config,
					repairAuthority,
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
	const run = async (repairAuthority) => {
		const warnings = [];
		repairAuthority?.assertCurrent();
		const collected = await collectPluginDoctorStateMigrationPlans(input, {
			includeDoctorOnly: true,
			phase: "after-session-repair",
			repairAuthority,
			warnings,
			plannedActions: params.plannedActions
		});
		if (!repairAuthority) return {
			changes: [],
			warnings: [
				...warnings,
				...collected.plans.flatMap((plan) => plan.preview),
				...collected.plans.length ? ["Run \"openclaw doctor --fix\" to repair plugin session ownership."] : []
			]
		};
		const result = await migratePluginDoctorStatePlans(input, collected.plans, repairAuthority);
		const earlier = await collectPluginDoctorStateMigrationPlans(input, {
			includeDoctorOnly: true,
			repairAuthority,
			warnings
		});
		const unfinishedEarlierIds = /* @__PURE__ */ new Set([...earlier.plans.map((plan) => plan.pluginId), ...[...collected.inspectedPluginIds].filter((pluginId) => !earlier.inspectedPluginIds.has(pluginId))]);
		return {
			...result,
			completedPluginIds: void 0,
			...completedPluginInspection(collected, result, unfinishedEarlierIds),
			...pluginInspectionFacts(collected),
			warnings: [...warnings, ...result.warnings],
			...warnings.length > 0 ? { warningDisposition: void 0 } : {}
		};
	};
	const maintenance = params.maintenanceAuthority;
	if (!maintenance) return run();
	maintenance.assertCurrent();
	const { assertDeferredPluginMigrationsCurrent, readDeferredPluginMigrations, recordDeferredPluginMigrations } = await import("./deferred-plugin-migrations-D17Eoz3z.mjs");
	maintenance.assertCurrent();
	const expectedPending = readDeferredPluginMigrations({ env: params.env });
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
				completed = await run(authority);
				return completed;
			} finally {
				active = false;
			}
		}));
		if (result.completedPluginIds?.length) {
			assertCompletionCurrent();
			await params.beforeCompletion?.(result.completedPluginIds, assertCompletionCurrent);
			assertCompletionCurrent();
			recordDeferredPluginMigrations({
				env: params.env,
				pending: [],
				resolvedPluginIds: result.completedPluginIds,
				expectedPending
			});
		}
		return result;
	} catch (error) {
		return {
			...completed,
			completedPluginIds: void 0,
			warnings: [...completed.warnings, `Plugin session repair did not settle: ${String(error)}.`],
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
	const stateSchema = (params.doctorOnlyStateMigrations === true ? repairOpenClawStateDatabaseSchema : repairOpenClawStateDatabaseSchemaIfNeeded)({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} });
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
		statelessPluginIds: /* @__PURE__ */ new Set()
	} : await collectPluginDoctorStateMigrationPlans(input, {
		includeDoctorOnly: params.doctorOnlyStateMigrations === true,
		warnings
	});
	const migrated = await migratePluginDoctorStatePlans(input, collected.plans);
	changes.push(...migrated.changes);
	warnings.push(...migrated.warnings);
	notices.push(...migrated.notices ?? []);
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
