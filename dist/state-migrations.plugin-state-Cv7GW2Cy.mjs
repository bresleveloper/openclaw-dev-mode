import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as resolveLegacyInstalledPluginIndexStorePath } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { c as inspectPersistedInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as writePersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-write-9YyZuTlI.mjs";
import { r as createPluginStateKeyedStore, s as registerMigratedPluginStateEntry } from "./plugin-state-store-CgyXRuSI.mjs";
import { r as migrationFileExists, t as ensureMigrationDir } from "./state-migrations.fs-BCymriz5.mjs";
import { a as archiveLegacyPluginStateSidecar, c as legacyInstalledPluginIndexMatches, g as resolveLegacyPluginStateSidecarPath, i as archiveLegacyInstalledPluginIndex, l as legacyPluginStateRowsMatch, m as readLegacyPluginStateSidecarRows, o as hasPendingSqliteSidecarArchive, p as readLegacyInstalledPluginIndex, r as archiveLegacyImportSource, s as isLegacyPluginStateRowExpired, t as PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES, u as mergeLegacyInstalledPluginIndexRecords, v as normalizeLegacySqliteInteger } from "./state-migrations.storage-DpFCNszC.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.plugin-state.ts
async function migrateLegacyPluginStateSidecar(params) {
	const sourcePath = resolveLegacyPluginStateSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacyPluginStateSidecar({
			sourcePath,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyPluginStateSidecarRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflictedKeys = [];
		const rowsToInsert = [];
		let imported = 0;
		let skippedExpired = 0;
		const now = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const row of rows) {
				executeSqliteQuerySync(db, stateDb.deleteFrom("plugin_state_entries").where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key).where("expires_at", "is not", null).where("expires_at", "<=", now));
				const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("plugin_state_entries").select([
					"value_json",
					"created_at",
					"expires_at"
				]).where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key));
				const legacyExpired = isLegacyPluginStateRowExpired(row, now);
				if (existing) {
					if (!legacyPluginStateRowsMatch(existing, row)) {
						if ((normalizeLegacySqliteInteger(existing.created_at) ?? 0) > (normalizeLegacySqliteInteger(row.created_at) ?? 0)) {} else if (legacyExpired) skippedExpired += 1;
						else conflictedKeys.push(`${row.plugin_id}/${row.namespace}/${row.entry_key}`);
					}
					continue;
				}
				if (legacyExpired) {
					skippedExpired += 1;
					continue;
				}
				rowsToInsert.push(row);
			}
			for (const row of rowsToInsert) {
				executeSqliteQuerySync(db, stateDb.insertInto("plugin_state_entries").values({
					plugin_id: row.plugin_id,
					namespace: row.namespace,
					entry_key: row.entry_key,
					value_json: row.value_json,
					created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
					expires_at: normalizeLegacySqliteInteger(row.expires_at)
				}).onConflict((conflict) => conflict.columns([
					"plugin_id",
					"namespace",
					"entry_key"
				]).doNothing()));
				imported += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} plugin-state sidecar ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (conflictedKeys.length > 0) return {
			changes,
			warningDisposition: "recoverable",
			warnings: [`Left plugin-state sidecar in place because ${conflictedKeys.length} ${conflictedKeys.length === 1 ? "row differs" : "rows differ"} from shared state without a newer canonical timestamp. First key: ${conflictedKeys[0]}`]
		};
		if (skippedExpired > 0) changes.push(`Dropped ${skippedExpired} expired plugin-state sidecar ${skippedExpired === 1 ? "entry" : "entries"}`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyPluginStateSidecar({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyInstalledPluginIndex(params) {
	const sourcePath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: params.stateDir });
	if (!migrationFileExists(sourcePath)) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	if (inspectPersistedInstalledPluginIndexInstallRecordsSync({ stateDir: params.stateDir }).status === "invalid") return {
		changes,
		warnings: [`Left plugin install index in place because persisted install records in ${params.stateDir} are invalid`]
	};
	const legacy = readLegacyInstalledPluginIndex(sourcePath);
	if (!legacy) return {
		changes,
		warnings: [`Left plugin install index in place because ${sourcePath} is invalid`]
	};
	const storeOptions = { stateDir: params.stateDir };
	const current = readPersistedInstalledPluginIndexSync(storeOptions);
	if (current && !legacyInstalledPluginIndexMatches(current, legacy)) {
		const merged = mergeLegacyInstalledPluginIndexRecords(current, legacy);
		if (merged.addedCount > 0) try {
			writePersistedInstalledPluginIndexSync(merged.merged, storeOptions);
			changes.push(`Merged ${merged.addedCount} legacy plugin install ${merged.addedCount === 1 ? "record" : "records"} → shared SQLite state`);
		} catch (err) {
			return {
				changes,
				warnings: [`Failed merging plugin install index ${sourcePath}: ${String(err)}`]
			};
		}
		if (merged.conflicts.length > 0) {
			archiveLegacyInstalledPluginIndex({
				sourcePath,
				changes,
				warnings
			});
			return {
				changes,
				warnings,
				notices: [`Kept canonical shared SQLite plugin install metadata despite differing legacy records for: ${merged.conflicts.join(", ")}`]
			};
		}
	}
	if (!current) try {
		writePersistedInstalledPluginIndexSync(legacy, storeOptions);
		const recordCount = Object.keys(legacy.installRecords).length;
		changes.push(`Migrated plugin install index ${recordCount} ${recordCount === 1 ? "record" : "records"} → shared SQLite state`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin install index ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyInstalledPluginIndex({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
function preflightLegacyInstalledPluginIndexMigration(params) {
	if (inspectPersistedInstalledPluginIndexInstallRecordsSync(params).status === "invalid") return `State dir migration skipped because persisted plugin install records in ${params.stateDir} are invalid`;
	const sourcePath = resolveLegacyInstalledPluginIndexStorePath(params);
	if (migrationFileExists(sourcePath) && !readLegacyInstalledPluginIndex(sourcePath)) return `State dir migration skipped because plugin install index ${sourcePath} is invalid`;
	return null;
}
function resolvePluginStateImportTargetKey(scopeKey, key) {
	return scopeKey ? `${scopeKey}:${key}` : key;
}
function findMissingKey(expected, actual) {
	for (const key of expected) if (!actual.has(key)) return key;
}
function compareImportEntriesNewestFirst(a, b) {
	if (a.timestamp !== void 0 && b.timestamp !== void 0) return b.timestamp - a.timestamp;
	if (a.ttlMs !== void 0 && b.ttlMs !== void 0) return b.ttlMs - a.ttlMs;
	return 0;
}
async function withPluginStateImportEnv(stateDir, run) {
	if (!stateDir) return await run();
	const previous = process.env.OPENCLAW_STATE_DIR;
	process.env.OPENCLAW_STATE_DIR = stateDir;
	try {
		return await run();
	} finally {
		if (previous === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previous;
	}
}
async function runLegacyMigrationPlans(plans) {
	const changes = [];
	const warnings = [];
	let hasRefusal = false;
	const lastConsumers = new Map(plans.map((plan, index) => [plan.sourcePath, index]));
	const cleanups = /* @__PURE__ */ new Map();
	const incompleteSources = /* @__PURE__ */ new Set();
	for (const [index, plan] of plans.entries()) {
		const recordIncomplete = (message) => {
			hasRefusal = true;
			incompleteSources.add(plan.sourcePath);
			warnings.push(message);
		};
		let operation = `migrating ${plan.label} (${plan.sourcePath})`;
		try {
			if (incompleteSources.has(plan.sourcePath)) {
				recordIncomplete(`Deferred ${plan.label}: another migration of ${plan.sourcePath} did not complete.`);
				continue;
			}
			if (plan.kind === "plugin-state-import") {
				const stateDir = plan.stateDir;
				await withPluginStateImportEnv(stateDir, async () => {
					const store = createPluginStateKeyedStore(plan.pluginId, {
						namespace: plan.namespace,
						maxEntries: plan.maxEntries,
						...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {}
					});
					operation = `reading ${plan.label} plugin state before migration`;
					const storeEntries = await store.entries();
					const existingEntriesByKey = new Map(storeEntries.map((entry) => [entry.key, entry]));
					const expectedKeys = new Set(existingEntriesByKey.keys());
					const namespaceRemainingCapacity = Math.max(0, plan.maxEntries - storeEntries.length);
					operation = `reading ${plan.label} legacy source`;
					const entries = await plan.readEntries();
					operation = `migrating ${plan.label} (${plan.sourcePath})`;
					const replacementEntries = [];
					let newEntries = [];
					for (const entry of entries) {
						const targetKey = resolvePluginStateImportTargetKey(plan.scopeKey, entry.key);
						const existing = existingEntriesByKey.get(targetKey);
						if (existing) {
							if (existing.value !== void 0 && await plan.shouldReplaceExistingEntry?.({
								key: entry.key,
								existingValue: existing.value,
								incomingValue: entry.value
							})) replacementEntries.push({
								...entry,
								targetKey
							});
							continue;
						}
						newEntries.push({
							...entry,
							targetKey
						});
					}
					const missingEntryCount = newEntries.length;
					if (missingEntryCount > namespaceRemainingCapacity) {
						newEntries = newEntries.toSorted(compareImportEntriesNewestFirst).slice(0, namespaceRemainingCapacity);
						const constraint = `plugin state namespace ${plan.namespace} has room for ${namespaceRemainingCapacity}`;
						recordIncomplete(newEntries.length > 0 ? `Partially migrating ${plan.label} because ${constraint} of ${missingEntryCount} missing entries; importing the newest ${newEntries.length} and deferring the rest in the legacy source` : `Deferring ${plan.label} migration because ${constraint} of ${missingEntryCount} missing entries; left legacy source in place to retry when capacity frees`);
					}
					const registerPreservingCreatedAt = async (params) => {
						if (params.createdAtMs === void 0 || !Number.isFinite(params.createdAtMs) || params.createdAtMs < 0) {
							await store.register(params.key, params.value, params.ttlMs != null ? { ttlMs: params.ttlMs } : void 0);
							return;
						}
						registerMigratedPluginStateEntry({
							pluginId: plan.pluginId,
							namespace: plan.namespace,
							maxEntries: plan.maxEntries,
							...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {},
							key: params.key,
							value: params.value,
							...params.ttlMs != null ? { ttlMs: params.ttlMs } : {},
							createdAtMs: params.createdAtMs
						});
					};
					const restoreExistingEntry = async (key) => {
						const existing = existingEntriesByKey.get(key);
						await registerPreservingCreatedAt({
							key,
							value: existing?.value,
							createdAtMs: existing?.createdAt
						});
					};
					let imported = 0;
					const changedKeys = /* @__PURE__ */ new Set();
					for (const entry of [...replacementEntries, ...newEntries]) try {
						await registerPreservingCreatedAt({
							key: entry.targetKey,
							value: entry.value,
							...entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {},
							...entry.timestamp !== void 0 ? { createdAtMs: entry.timestamp } : {}
						});
						const nextExpectedKeys = new Set(expectedKeys);
						nextExpectedKeys.add(entry.targetKey);
						const missingKey = findMissingKey(nextExpectedKeys, new Set((await store.entries()).map(({ key }) => key)));
						if (missingKey) {
							if (existingEntriesByKey.has(entry.targetKey)) await restoreExistingEntry(entry.targetKey);
							else await store.delete(entry.targetKey);
							if (changedKeys.has(missingKey)) {
								changedKeys.delete(missingKey);
								expectedKeys.delete(missingKey);
								imported = Math.max(0, imported - 1);
							} else if (existingEntriesByKey.has(missingKey)) try {
								await restoreExistingEntry(missingKey);
							} catch (restoreErr) {
								recordIncomplete(`Failed restoring ${plan.label} entry ${missingKey} after cap eviction: ${String(restoreErr)}`);
							}
							recordIncomplete(`Paused migrating ${plan.label} because plugin state cap evicted ${missingKey}; imported ${imported} of ${missingEntryCount} missing entries and deferred the rest in the legacy source`);
							break;
						}
						expectedKeys.add(entry.targetKey);
						changedKeys.add(entry.targetKey);
						imported++;
					} catch (err) {
						recordIncomplete(`Failed migrating ${plan.label} entry ${entry.key}: ${String(err)}`);
					}
					if (imported > 0) changes.push(`Migrated ${imported} ${plan.label} ${imported === 1 ? "entry" : "entries"} → plugin state`);
					if (!(entries.length === 0 && plan.cleanupWhenEmpty === true || entries.length > 0 && entries.every(({ key }) => expectedKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)))) || !plan.cleanupSource && !plan.removeSource) return;
					const pending = cleanups.get(plan.sourcePath) ?? [];
					pending.push(async () => {
						const cleanupWarnings = [];
						try {
							await withPluginStateImportEnv(stateDir, async () => {
								if (plan.cleanupSource === "rename" && migrationFileExists(plan.sourcePath)) archiveLegacyImportSource({
									sourcePath: plan.sourcePath,
									label: plan.label,
									changes,
									warnings: cleanupWarnings
								});
								if (plan.cleanupSource === "remove" && migrationFileExists(plan.sourcePath)) try {
									fs.unlinkSync(plan.sourcePath);
									changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
								} catch (err) {
									cleanupWarnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
								}
								if (plan.removeSource) {
									await plan.removeSource();
									changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
								}
							});
						} catch (err) {
							cleanupWarnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
						}
						if (plans.every((consumer) => consumer.sourcePath !== plan.sourcePath || consumer.kind === "plugin-state-import" && consumer.cleanupWarningDisposition === "recoverable") && cleanupWarnings.length > 0) {
							incompleteSources.add(plan.sourcePath);
							warnings.push(...cleanupWarnings.map((warning) => `Run openclaw doctor --fix to retry legacy cleanup. ${warning}`));
						} else cleanupWarnings.forEach(recordIncomplete);
					});
					cleanups.set(plan.sourcePath, pending);
				});
				continue;
			}
			if (migrationFileExists(plan.targetPath)) continue;
			ensureMigrationDir(path.dirname(plan.targetPath));
			if (plan.kind === "move") {
				fs.renameSync(plan.sourcePath, plan.targetPath);
				changes.push(`Moved ${plan.label} → ${plan.targetPath}`);
			} else {
				fs.copyFileSync(plan.sourcePath, plan.targetPath);
				changes.push(`Copied ${plan.label} → ${plan.targetPath}`);
			}
		} catch (err) {
			recordIncomplete(`Failed ${operation}: ${String(err)}`);
		} finally {
			if (lastConsumers.get(plan.sourcePath) === index) {
				const pending = cleanups.get(plan.sourcePath) ?? [];
				cleanups.delete(plan.sourcePath);
				for (const cleanup of pending) {
					if (incompleteSources.has(plan.sourcePath)) break;
					await cleanup();
				}
			}
		}
	}
	return {
		changes,
		warnings,
		...warnings.length > 0 && !hasRefusal ? { warningDisposition: "recoverable" } : {}
	};
}
//#endregion
export { runLegacyMigrationPlans as i, migrateLegacyPluginStateSidecar as n, preflightLegacyInstalledPluginIndexMigration as r, migrateLegacyInstalledPluginIndex as t };
