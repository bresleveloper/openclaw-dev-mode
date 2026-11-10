import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as noteAuthProfileFileWrite } from "./file-state-CTXmtyL_.mjs";
import { H as authProfilesLog, W as isUserModelAuthProfileId, a as capturePersonalCredentialAuthority, f as assertPersonalAuthProfileRuntime } from "./user-model-account-authority-DFFjC5J5.mjs";
import { s as readAuthProfileAuthorizationLifetime } from "./authorization-lifetime-CLdd1God.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { H as retainAuthProfileAuthorizationObservation, L as resolveLegacyAuthProfileSourceCandidates, V as fenceAuthProfileAuthorizationWrite, _ as resolveAuthProfileDatabaseOwnerId, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { H as mergeLocalAuthProfileStoreWithInheritedStore } from "./runtime-snapshots-HRosak4u.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { c as getScopedSharedAuthStore, f as resolveRuntimeAuthProfileAgentDir, l as isEnvOnlyAuthProfileRuntime, s as getScopedAuthProfileEnv } from "./store-BPXZsh12.mjs";
import { i as readSharedAuthProfileRows, n as prepareAgentAuthProfileRowsRead, t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-BnaiPHv1.mjs";
import { r as enrollPersonalAuthProfileAuthorizationAsync } from "./user-model-account-operations-DIqTwy80.mjs";
import { t as enrollAuthProfileAuthorizationInDatabase } from "./authorization-enrollment-qxIdf8dG.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/agents/auth-profiles/authorization-enrollment-runtime.ts
/** Uses the existing agent executor/shared actor, including native transaction/commit guards. */
async function enrollOwnedAuthProfileAuthorization(params) {
	const { databasePath, assertCurrent } = params;
	let settle;
	let receipt;
	let settled;
	try {
		if (params.agentId === void 0) {
			const factory = createSqliteWorkerWriteAdmission((request) => {
				assertCurrent();
				if (request.stage === "commit") settle ??= fenceAuthProfileAuthorizationWrite(databasePath);
			}, [databasePath]);
			receipt = await runOpenClawStateWorkerOperation(params.context, (scope) => scope.execute({
				type: "authProfiles.enrollAuthorization",
				input: params.input
			}), {
				assertCurrent,
				createAdmission(retained) {
					const binding = factory(retained);
					settled = retained.settled.then((outcome) => {
						settle?.(outcome.kind !== "unknown");
					});
					return binding;
				}
			});
		} else if (params.context.maintenanceScope?.ownsSchemaMaintenance) {
			receipt = runOpenClawAgentWriteTransaction(({ db }) => {
				assertCurrent();
				const result = enrollAuthProfileAuthorizationInDatabase(db, "agent", params.input);
				stageSqliteTransactionState(db, {
					stage() {},
					prepareCommit() {
						assertCurrent();
						settle ??= fenceAuthProfileAuthorizationWrite(databasePath);
					},
					commit: () => settle?.(true, result.raw),
					rollback: () => settle?.(true),
					invalidate() {
						settle ??= fenceAuthProfileAuthorizationWrite(databasePath);
						settle(false);
					}
				});
				return result;
			}, {
				agentId: params.agentId,
				path: databasePath,
				env: params.env
			}, {
				operationLabel: "auth-profiles.doctor-enroll-authorization",
				repairAdmission: { assertCurrent }
			});
			noteAuthProfileFileWrite(databasePath);
		} else {
			const options = {
				agentId: params.agentId,
				path: databasePath,
				env: params.env
			};
			const execution = captureOpenClawAgentDatabaseExecution(options);
			try {
				await execution.prepare({
					assertCurrent,
					createAdmission(binding) {
						return () => ({
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((request, grant) => {
								assertCurrent();
								binding.authorize(request);
								if (!grant()) throw new Error("Auth profile enrollment lost admission");
							}, binding.attachment)
						});
					}
				});
				assertCurrent();
				const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.authProfileInlineUsage),
					input: {},
					assertAdmission(request) {
						assertCurrent();
						if (request.stage === "commit") settle ??= fenceAuthProfileAuthorizationWrite(databasePath);
						return request;
					}
				});
				try {
					receipt = await worker.execute({
						type: "authProfiles.enrollAuthorization",
						input: params.input
					}, assertCurrent);
					noteAuthProfileFileWrite(databasePath);
					settle?.(true, receipt.raw);
				} finally {
					await worker.close();
				}
			} finally {
				await execution.release();
			}
		}
	} finally {
		await settled;
		settle?.(receipt !== void 0, receipt?.raw);
	}
}
//#endregion
//#region src/agents/auth-profiles/personal-authorization.ts
/** Capture the private account owner's lifetime without exposing or copying bearer material. */
async function capturePersonalAuthProfileAuthorization(params, options = {}) {
	const sanitize = (error) => error instanceof AuthProfileAuthorizationError ? error : new AuthProfileAuthorizationError("unavailable");
	let disposed = false;
	let retired = false;
	const assertSource = () => {
		if (disposed || retired) throw new AuthProfileAuthorizationError("retired");
		try {
			params.assertCurrent();
			assertPersonalAuthProfileRuntime();
		} catch {
			retired = true;
			throw new AuthProfileAuthorizationError("retired");
		}
	};
	try {
		assertPersonalAuthProfileRuntime();
		assertSource();
		const context = options.context ?? captureOpenClawStateWorkerContext();
		const assertOwner = () => {
			assertSource();
			try {
				context.admission.assertCurrent();
				context.maintenanceScope?.assertAdmission();
			} catch {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
		};
		const authority = await capturePersonalCredentialAuthority(context, params.profileId);
		const readCanonical = async () => {
			assertOwner();
			const reply = await executeExistingOpenClawStateRead({
				path: context.admission.databasePath,
				env: context.environment
			}, {
				type: "userModelAccounts.authorization",
				authProfileId: params.profileId
			}, {
				context,
				current: true,
				preferIndependentWarmRead: true
			});
			assertOwner();
			return reply?.authorization;
		};
		let initial = await readCanonical();
		if (initial && !initial.authorizationId) {
			initial = await enrollPersonalAuthProfileAuthorizationAsync({
				profileId: params.profileId,
				assertCurrent: assertOwner
			}, { context });
			assertOwner();
		}
		if (!initial?.authorizationId) throw new AuthProfileAuthorizationError("retired");
		const { authorizationId: lifetime, ownerProfileId } = initial;
		authority.observeAuthorizationId(lifetime);
		let observation = "ready";
		const assertFacts = () => {
			assertOwner();
			authority.assertAuthorizationCurrent(lifetime);
		};
		assertFacts();
		return {
			authorizationId: createHash("sha256").update(JSON.stringify([
				"personal-auth-profile-v1",
				params.profileId,
				ownerProfileId,
				lifetime
			])).digest("hex"),
			assertCurrent() {
				assertFacts();
				if (observation !== "ready") throw new AuthProfileAuthorizationError("unavailable");
			},
			async revalidate() {
				assertFacts();
				if (observation === "pending") throw new AuthProfileAuthorizationError("unavailable");
				observation = "pending";
				try {
					const current = await readCanonical();
					if (current?.authorizationId !== lifetime || current.ownerProfileId !== ownerProfileId) {
						retired = true;
						throw new AuthProfileAuthorizationError("retired");
					}
					assertFacts();
					observation = "ready";
				} catch (error) {
					observation = "unavailable";
					throw sanitize(error);
				}
			},
			dispose() {
				disposed = true;
			}
		};
	} catch (error) {
		throw sanitize(error);
	}
}
//#endregion
//#region src/agents/auth-profiles/authorization.ts
/**
* Capture a persisted credential lifetime through its canonical owner, without bearer material.
* Personal accounts keep their own owner; env-only and bounded shared-store scopes never
* substitute an ambient admin credential.
*/
async function captureAuthProfileAuthorization(params) {
	if (isUserModelAuthProfileId(params.profileId)) return capturePersonalAuthProfileAuthorization(params);
	let cleanup;
	const sanitize = (error) => error instanceof AuthProfileAuthorizationError ? error : new AuthProfileAuthorizationError("unavailable");
	try {
		const { profileId, assertCurrent: assertCaller, cfg } = params;
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		const env = { ...getScopedAuthProfileEnv() ?? process.env };
		let disposed = false;
		let retired = false;
		const assertSource = () => {
			if (disposed || retired) throw new AuthProfileAuthorizationError("retired");
			try {
				assertCaller();
			} catch {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
		};
		assertSource();
		if (isEnvOnlyAuthProfileRuntime() || getScopedSharedAuthStore()) throw new AuthProfileAuthorizationError("unavailable");
		const context = captureOpenClawStateWorkerContext({ env });
		const assertRoot = () => {
			assertSource();
			try {
				context.admission.assertCurrent();
				context.maintenanceScope?.assertAdmission();
			} catch {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
		};
		const ownership = await resolveSharedAuthStoreOwnershipAsync(context);
		assertRoot();
		const sharedPath = resolvePathViaExistingAncestorSync(resolveSharedAuthStorePath(env));
		const requestedPath = agentDir ? resolvePathViaExistingAncestorSync(resolveAuthProfileDatabasePath(agentDir)) : sharedPath;
		const paths = [.../* @__PURE__ */ new Set([requestedPath, sharedPath])];
		const targets = paths.map((databasePath) => ({
			databasePath,
			agentId: databasePath === sharedPath && ownership.location === "state-db" ? void 0 : resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
			agentDir: databasePath === sharedPath ? void 0 : agentDir,
			observation: retainAuthProfileAuthorizationObservation(databasePath, profileId)
		}));
		const closeReaders = async () => {
			await Promise.all(targets.map(async (target) => {
				const reader = target.reader;
				target.reader = void 0;
				await reader?.dispose();
			}));
		};
		const release = () => {
			disposed = true;
			for (const target of targets) target.observation.dispose();
		};
		cleanup = async () => {
			release();
			await closeReaders();
		};
		const assertOwners = () => {
			assertRoot();
			if (resolvePathViaExistingAncestorSync(resolveSharedAuthStorePath(env)) !== sharedPath) {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
			try {
				for (const target of targets) target.reader?.assertCurrent();
			} catch {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
		};
		const readCanonical = async () => {
			assertOwners();
			const publishers = targets.map((target) => target.observation.prepareRead());
			const rows = await Promise.all(targets.map(async (target) => {
				if (target.agentId === void 0) return readSharedAuthProfileRows(context, void 0, "canonical");
				target.reader ??= prepareAgentAuthProfileRowsRead({
					databasePath: target.databasePath,
					agentId: target.agentId,
					env,
					source: "canonical"
				});
				return target.reader.read();
			}));
			assertOwners();
			const stores = rows.map((row, index) => {
				const target = targets[index];
				const store = loadPersistedAuthProfileStoreFromRows(row, target.databasePath) ?? {
					version: 1,
					profiles: {}
				};
				assertAuthProfileMigrationCandidates({
					databasePath: target.databasePath,
					candidates: resolveLegacyAuthProfileSourceCandidates({
						agentDir: target.agentDir,
						env
					}),
					hasCredentials: () => Object.keys(store.profiles).length > 0,
					provider: store.profiles[profileId]?.provider,
					config: cfg
				});
				publishers[index](row.store.status === "readable" ? row.store.raw : void 0);
				return store;
			});
			const local = stores[0];
			const shared = stores[paths.indexOf(sharedPath)];
			const effective = mergeLocalAuthProfileStoreWithInheritedStore(local, requestedPath === sharedPath ? void 0 : shared);
			const selected = effective.profiles[profileId];
			if (!Object.hasOwn(effective.profiles, profileId) || !selected) {
				retired = true;
				throw new AuthProfileAuthorizationError("retired");
			}
			const selectedPath = selected === local.profiles[profileId] && effective.runtimeLocalProfileIds?.includes(profileId) ? requestedPath : sharedPath;
			return {
				rows,
				selectedPath,
				lineagePaths: selectedPath === requestedPath && selected.type !== "oauth" ? [requestedPath] : paths
			};
		};
		const assertFacts = (allowPending = false) => {
			assertOwners();
			for (const target of targets) {
				if (!target.incarnation) continue;
				const fact = target.observation.readFact();
				if (!fact || fact.incarnation !== target.incarnation) {
					retired = true;
					throw new AuthProfileAuthorizationError("retired");
				}
				if (target.databasePath === selectedPath) {
					if (fact.status === "retired" || fact.status === "absent" || fact.expires !== void 0 && fact.expires <= Date.now()) {
						retired = true;
						throw new AuthProfileAuthorizationError("retired");
					}
					if (fact.status === "pending" && !allowPending) throw new AuthProfileAuthorizationError("unavailable");
				}
			}
		};
		let initial = await readCanonical();
		const enrollment = initial.rows.flatMap(({ store }, index) => initial.lineagePaths.includes(targets[index].databasePath) && !readAuthProfileAuthorizationLifetime(store.status === "readable" ? store.raw : void 0, profileId) ? [{
			target: targets[index],
			store
		}] : []);
		if (enrollment.length) {
			await closeReaders();
			for (const { target, store } of enrollment) {
				await enrollOwnedAuthProfileAuthorization({
					databasePath: target.databasePath,
					agentId: target.agentId,
					env,
					context,
					input: {
						profileId,
						expected: store
					},
					assertCurrent: assertRoot
				});
				assertRoot();
			}
			initial = await readCanonical();
		}
		const selectedPath = initial.selectedPath;
		const lineage = targets.filter((target) => initial.lineagePaths.includes(target.databasePath));
		for (const target of lineage) {
			target.incarnation = target.observation.readFact()?.incarnation;
			if (!target.incarnation) throw new AuthProfileAuthorizationError("unavailable");
		}
		assertFacts();
		const authorizationId = createHash("sha256").update(JSON.stringify([
			"mcp-auth-profile-v1",
			profileId,
			selectedPath,
			...lineage.map((target) => [target.databasePath, target.incarnation])
		])).digest("hex");
		let observation = "ready";
		return {
			authorizationId,
			assertCurrent() {
				assertFacts();
				if (observation !== "ready") throw new AuthProfileAuthorizationError("unavailable");
			},
			async revalidate() {
				assertFacts(true);
				if (observation === "pending") throw new AuthProfileAuthorizationError("unavailable");
				observation = "pending";
				try {
					const current = await readCanonical();
					assertFacts();
					if (current.selectedPath !== selectedPath) {
						retired = true;
						throw new AuthProfileAuthorizationError("retired");
					}
					observation = "ready";
				} catch (error) {
					observation = "unavailable";
					assertRoot();
					throw sanitize(error);
				}
			},
			dispose() {
				if (disposed) return;
				release();
				trackAsyncWork(closeReaders).catch(() => {
					authProfilesLog.warn("Auth-profile reader cleanup failed");
				});
			}
		};
	} catch (error) {
		try {
			await cleanup?.();
		} catch (cleanupError) {
			throw sanitize(cleanupError);
		}
		throw sanitize(error);
	}
}
//#endregion
export { captureAuthProfileAuthorization as t };
