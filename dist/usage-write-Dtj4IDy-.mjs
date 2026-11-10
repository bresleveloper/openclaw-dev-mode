import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { r as resolveProviderAuthAliasMap } from "./provider-auth-aliases-DCRcDae6.mjs";
import { U as reportCommittedInlineAuthFailure, f as assertPersonalAuthProfileRuntime, p as authProfileRuntimeMode } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as mergeAuthProfileStores } from "./persisted-DbIYEoQ3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { L as resolveLegacyAuthProfileSourceCandidates, _ as resolveAuthProfileDatabaseOwnerId, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { f as resolveSharedMainAuthAgentDir, l as resolveSharedAuthStoreOwnership, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { n as getRuntimeAuthProfileStoreCredentialMutationToken } from "./runtime-persisted-rows-B3SUt7CF.mjs";
import { $ as shouldUseMainOwnerForLocalOAuthCredential, t as clearRuntimeAuthProfileStoreSnapshotAtDatabasePath, y as listRuntimeAuthProfileStoreSnapshotsForSharedOwner } from "./runtime-snapshots-HRosak4u.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { S as publishInlineAuthFailure, f as resolveRuntimeAuthProfileAgentDir, s as getScopedAuthProfileEnv, y as reserveAuthProfileUsagePreparation } from "./store-BPXZsh12.mjs";
import { a as readUserModelAuthProfileAsync, i as readSharedAuthProfileRows, n as prepareAgentAuthProfileRowsRead, t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-BnaiPHv1.mjs";
import { a as withAuthProfileCleanup } from "./source-check--zMBJ43Q.mjs";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.mjs";
import { t as createAuthProfileUsageReceipt } from "./store.worker-contract-B0bVcqdW.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/personal-usage.ts
/** Bind the physical owner before probing or yielding to its writer queue. */
function preparePersonalAuthProfileUsage(store, profileId) {
	assertPersonalAuthProfileRuntime();
	const context = captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
		assertPersonalAuthProfileRuntime();
	};
	return {
		read: () => readUserModelAuthProfileAsync(profileId, context),
		record(reduction) {
			const captured = structuredClone(reduction);
			return runOpenClawStateWorkerOperation(context, async (scope) => {
				const result = await scope.execute({
					type: "authProfiles.personalUsage",
					input: {
						profileId,
						reduction: captured
					}
				});
				if (result && isDeepStrictEqual(store.profiles[profileId], captured.expectedProfile)) store.usageStats = {
					...store.usageStats,
					[profileId]: result.next
				};
				return result;
			}, {
				assertCurrent,
				createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
			}).catch((error) => {
				if (isSqliteLockError(error)) return null;
				throw error;
			});
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/state-observation.ts
const observationLog = createSubsystemLogger("agent/embedded");
function logDroppedAuthProfileBookkeeping(kind, profileId) {
	observationLog.warn("dropped auth profile bookkeeping after locked store update failed", {
		event: "auth_profile_bookkeeping_dropped",
		kind,
		profileId,
		tags: ["auth_profiles", "persistence"]
	});
}
function logAuthProfileFailureStateChange(params) {
	const windowType = params.reason === "billing" || params.reason === "auth_permanent" ? "disabled" : "cooldown";
	const previousCooldownUntil = params.previous?.cooldownUntil;
	const previousDisabledUntil = params.previous?.disabledUntil;
	const windowKey = windowType === "disabled" ? "disabledUntil" : "cooldownUntil";
	const previousUntil = params.previous?.[windowKey];
	const windowReused = typeof previousUntil === "number" && Number.isFinite(previousUntil) && previousUntil > params.now && previousUntil === params.next[windowKey];
	const safeProfileId = redactIdentifier(params.profileId, { len: 12 });
	const safeRunId = sanitizeForConsole(params.runId) ?? "-";
	const safeProvider = sanitizeForConsole(params.provider) ?? "-";
	observationLog.warn("auth profile failure state updated", {
		event: "auth_profile_failure_state_updated",
		tags: [
			"error_handling",
			"auth_profiles",
			windowType
		],
		runId: params.runId,
		profileId: safeProfileId,
		provider: params.provider,
		reason: params.reason,
		windowType,
		windowReused,
		previousErrorCount: params.previous?.errorCount,
		errorCount: params.next.errorCount,
		previousCooldownUntil,
		cooldownUntil: params.next.cooldownUntil,
		previousDisabledUntil,
		disabledUntil: params.next.disabledUntil,
		previousDisabledReason: params.previous?.disabledReason,
		disabledReason: params.next.disabledReason,
		failureCounts: params.next.failureCounts,
		consoleMessage: `auth profile failure state updated: runId=${safeRunId} profile=${safeProfileId} provider=${safeProvider} reason=${params.reason} window=${windowType} reused=${String(windowReused)}`
	});
}
//#endregion
//#region src/agents/auth-profiles/usage-write.ts
/** Capture every possible physical owner before choosing inherited ownership asynchronously. */
async function withAuthProfileUsage(store, profileId, agentDir, consume) {
	const mode = authProfileRuntimeMode.getStore();
	if (mode?.kind === "env-only") {
		const observed = {
			version: 1,
			profiles: {}
		};
		return consume({
			observed,
			record: async () => createAuthProfileUsageReceipt(observed)
		});
	}
	const scopedSharedStore = mode && structuredClone(mode.sharedStore);
	const env = cloneEnvWithPlatformSemantics(getScopedAuthProfileEnv() ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const selectedDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const context = captureOpenClawStateWorkerContext({ env });
	const localPath = selectedDir ? resolveAuthProfileDatabasePath(selectedDir) : void 0;
	const legacyPath = resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir(env));
	const readers = /* @__PURE__ */ new Map();
	const executions = /* @__PURE__ */ new Map();
	const credentialToken = (databasePath) => getRuntimeAuthProfileStoreCredentialMutationToken(void 0, profileId, { owner: {
		kind: "resolved",
		databasePath,
		sharedDatabasePath: databasePath
	} });
	const credentialTokens = new Map([.../* @__PURE__ */ new Set([
		context.admission.databasePath,
		legacyPath,
		...localPath ? [localPath] : []
	])].map((databasePath) => [databasePath, credentialToken(databasePath)]));
	let preparation;
	let committed;
	const executeUsage = async () => {
		for (const databasePath of /* @__PURE__ */ new Set([...mode ? [] : [legacyPath], ...localPath ? [localPath] : []])) {
			const target = {
				path: databasePath,
				agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
				env
			};
			readers.set(databasePath, prepareAgentAuthProfileRowsRead({
				databasePath,
				agentId: target.agentId,
				env
			}));
			try {
				executions.set(databasePath, {
					ok: true,
					value: captureOpenClawAgentDatabaseExecution(target)
				});
			} catch (error) {
				executions.set(databasePath, {
					ok: false,
					error
				});
			}
		}
		preparation = reserveAuthProfileUsagePreparation([context.admission.identity, ...[...readers.keys()].map((pathname) => readDatabasePathIdentitySync(pathname))].flatMap((identity) => [identity.key, `path:${identity.canonicalPath}`]));
		const capturedOwnership = resolveSharedAuthStoreOwnershipAsync(context).then((value) => ({
			ok: true,
			value
		}), (error) => ({
			ok: false,
			error
		}));
		await preparation.ready;
		const ownershipResult = await capturedOwnership;
		if (!ownershipResult.ok) throw ownershipResult.error;
		const ownership = ownershipResult.value;
		const sharedPath = ownership.location === "state-db" ? context.admission.databasePath : legacyPath;
		const main = Boolean(mode) || !selectedDir || localPath === sharedPath;
		const read = (databasePath) => databasePath === context.admission.databasePath ? readSharedAuthProfileRows(context) : readers.get(databasePath).read();
		const localRows = localPath ? await read(localPath) : void 0;
		const sharedRows = mode ? void 0 : localPath === sharedPath ? localRows : await read(sharedPath);
		const local = localRows ? loadPersistedAuthProfileStoreFromRows(localRows, localPath) : null;
		const shared = sharedRows ? loadPersistedAuthProfileStoreFromRows(sharedRows, sharedPath) : null;
		const localProfile = local?.profiles[profileId];
		const sharedProfile = shared?.profiles[profileId];
		const useShared = !mode && (main || !selectedDir || (localProfile ? shouldUseMainOwnerForLocalOAuthCredential({
			profileId,
			local: localProfile,
			main: sharedProfile
		}) : Boolean(sharedProfile)));
		const databasePath = useShared ? sharedPath : localPath;
		const selected = (useShared ? shared : local) ?? {
			version: 1,
			profiles: {}
		};
		const observed = scopedSharedStore ? mergeAuthProfileStores(scopedSharedStore, selected) : selected;
		const inherited = useShared && !main;
		const owner = {
			databasePath,
			sharedDatabasePath: sharedPath,
			location: ownership.location,
			env
		};
		const candidates = resolveLegacyAuthProfileSourceCandidates({
			agentDir: useShared ? void 0 : selectedDir,
			env
		});
		const sourcePaths = [.../* @__PURE__ */ new Set([...mode ? [] : [sharedPath], ...localPath ? [localPath] : []])];
		const credentialOwnerChanged = () => sourcePaths.some((sourcePath) => {
			const previous = credentialTokens.get(sourcePath);
			const current = credentialToken(sourcePath);
			return current.revision !== previous.revision || current.known !== previous.known;
		});
		const assertOwnerCurrent = () => {
			context.admission.assertCurrent();
			context.maintenanceScope?.assertAdmission();
			for (const sourcePath of sourcePaths) readers.get(sourcePath)?.assertCurrent();
			const execution = executions.get(databasePath);
			if (execution) {
				if (!execution.ok) throw execution.error;
				execution.value.assertCurrent();
			}
			if (resolveSharedAuthStoreOwnership(env) !== ownership) throw new Error("Auth profile shared owner changed before write admission");
			assertAuthProfileMigrationStateAtDatabasePath(databasePath);
			assertAuthProfileMigrationCandidates({
				databasePath,
				candidates,
				hasCredentials: () => Object.keys(selected.profiles).length > 0
			});
		};
		const assertCurrent = () => {
			assertOwnerCurrent();
			if (credentialOwnerChanged()) throw new Error("Auth profile credential owner changed during usage preparation");
		};
		assertOwnerCurrent();
		const providerAliases = resolveProviderAuthAliasMap({ env });
		let recordingStarted = false;
		const operation = consume({
			observed,
			async record(reduction, providerKey) {
				recordingStarted = true;
				const reconcileRemovedProfile = async () => {
					assertOwnerCurrent();
					if (!credentialOwnerChanged()) return;
					const currentRows = await read(databasePath);
					assertOwnerCurrent();
					const current = loadPersistedAuthProfileStoreFromRows(currentRows, databasePath) ?? {
						version: 1,
						profiles: {}
					};
					const fresh = scopedSharedStore ? mergeAuthProfileStores(scopedSharedStore, current) : current;
					if (fresh.profiles[profileId]) throw new Error("Auth profile credential owner changed during usage preparation");
					return createAuthProfileUsageReceipt(fresh);
				};
				const input = structuredClone({
					profileId,
					reduction,
					inherited,
					providerKey,
					providerAliases,
					scopedSharedStore,
					expectedCredential: selected.profiles[profileId]
				});
				let receipt;
				const publish = async (result, readTarget) => {
					if (!result.ok) {
						const error = /* @__PURE__ */ new Error("Auth usage transaction failed");
						retainOpenClawStateWorkerErrorPayload(error, result.error);
						throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
					}
					receipt = result.receipt;
					committed = receipt;
					if (receipt.result) {
						await publishInlineAuthFailure(owner, receipt, readTarget, assertCurrent);
						store.usageStats = {
							...store.usageStats,
							[profileId]: receipt.result.next
						};
						if (reduction.kind === "success" && !inherited) store.lastGood = {
							...Object.fromEntries(Object.entries(store.lastGood ?? {}).filter(([key]) => {
								const normalized = normalizeProviderId(key);
								return (providerAliases[normalized] ?? normalized) !== providerKey;
							})),
							...providerKey ? { [providerKey]: profileId } : {}
						};
					}
					return receipt;
				};
				try {
					if (databasePath === context.admission.databasePath) {
						const removed = await reconcileRemovedProfile();
						if (removed) return removed;
						return await runOpenClawStateWorkerOperation(context, async (scope) => publish(await scope.execute({
							type: "authProfiles.usage",
							input
						}), () => readSharedAuthProfileRows(context, false)), {
							assertCurrent,
							createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [databasePath])
						});
					}
					const target = {
						path: databasePath,
						agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
						env
					};
					const captured = executions.get(databasePath);
					if (!captured.ok) throw captured.error;
					const execution = captured.value;
					return await runOpenClawAgentWriteAdmission(target, async () => {
						const removed = await reconcileRemovedProfile();
						if (removed) return removed;
						const client = await openOpenClawAgentSqliteWorkerStore(target, { execution }, {
							moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.authProfileInlineUsage),
							input: {}
						});
						return withAuthProfileCleanup(() => client.run(async (scope) => publish(await scope.execute({
							type: "authProfiles.usage",
							input
						}), () => scope.execute({
							type: "authProfiles.inlineSnapshot",
							input: void 0
						})), assertCurrent), async (outcome) => {
							try {
								await client.close();
							} catch (error) {
								throw !outcome.ok ? new AggregateError([outcome.error, error], "Auth usage and client cleanup failed", { cause: outcome.error }) : error;
							}
						});
					}, true);
				} catch (error) {
					const outcomeUnknown = hasSqliteWorkerOutcomeUnknown(error);
					if (receipt || outcomeUnknown) try {
						context.admission.assertCurrent();
						readers.get(databasePath)?.assertCurrent();
						const derived = useShared ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : [];
						clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath, useShared ? void 0 : selectedDir);
						for (const entry of derived) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath, entry.agentDir);
					} catch (invalidationError) {
						reportCommittedInlineAuthFailure("auth usage snapshot invalidation failed", invalidationError);
					}
					if (receipt) {
						reportCommittedInlineAuthFailure("auth usage committed before publication or cleanup failed", error);
						return receipt;
					}
					if (outcomeUnknown) throw error;
					if (isSqliteLockError(error)) return null;
					throw error;
				}
			}
		});
		if (!recordingStarted) preparation.release();
		return await operation;
	};
	return withAuthProfileCleanup(executeUsage, async (outcome) => {
		try {
			const failures = (await Promise.allSettled([...[...readers.values()].map((reader) => reader.dispose()), ...[...executions.values()].flatMap((execution) => execution.ok ? [execution.value.release()] : [])])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) {
				if (committed) reportCommittedInlineAuthFailure("auth usage committed before owner cleanup failed", failures);
				else throw new AggregateError([...!outcome.ok ? [outcome.error] : [], ...failures], "Auth usage read owner cleanup failed", { cause: (!outcome.ok ? outcome.error : void 0) ?? failures[0] });
			}
		} finally {
			preparation?.release();
		}
	});
}
//#endregion
export { preparePersonalAuthProfileUsage as i, logAuthProfileFailureStateChange as n, logDroppedAuthProfileBookkeeping as r, withAuthProfileUsage as t };
