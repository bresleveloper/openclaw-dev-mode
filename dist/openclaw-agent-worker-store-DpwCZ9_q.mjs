import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { g as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CHHOdVvc.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-worker-store.ts
const log = createSubsystemLogger("state/agent-db");
function reportCompletedPublicationCleanupFailure(error) {
	try {
		log.warn(`Agent publication completed before cleanup failed: ${formatErrorMessage(error)}`);
	} catch {}
}
/** A publication client retains its host borrow; each operation borrows the canonical executor. */
async function openOpenClawAgentSqliteWorkerStore(inputOptions, expectedDatabase, worker) {
	const env = cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		...inputOptions,
		env,
		path: resolveOpenClawAgentSqlitePath({
			...inputOptions,
			env
		})
	};
	const prepared = readOpenClawAgentDatabaseIdentity({ db: expectedDatabase });
	if (typeof prepared.identity !== "string") throw new Error("Agent Worker requires its existing file owner");
	const identity = `file:${prepared.identity}`;
	const expectedIdentity = {
		kind: "file",
		physicalIdentity: prepared.identity,
		nativeLocation: prepared.filename
	};
	const moduleUrl = new URL(worker.moduleUrl).href;
	const input = structuredClone(worker.input);
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(options.env));
	let revoked = false;
	let closing;
	let releaseBorrow;
	let unregisterAgent;
	let unregisterState;
	const pending = /* @__PURE__ */ new Set();
	const assertHeld = (cleanup = false) => {
		if (revoked && !cleanup) throw new Error("Agent database Worker owner is closed");
		state.assertCurrent();
		const current = getOpenClawAgentDatabaseIfOpen(options);
		if (!current || current.db !== expectedDatabase || !expectedDatabase.isOpen || !isOpenClawAgentDatabasePathCurrent(current)) throw new Error("Borrowed agent database closed or changed before Worker admission");
		assertExistingDatabaseIdentity(options.path, identity);
	};
	assertHeld();
	const close = () => {
		revoked = true;
		closing ??= (async () => {
			await Promise.allSettled(pending);
			releaseBorrow?.();
			releaseBorrow = void 0;
			unregisterAgent?.();
			unregisterState?.();
		})().catch((error) => {
			closing = void 0;
			throw error;
		});
		return closing;
	};
	try {
		unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
			agentId: options.agentId,
			path: options.path,
			revoke: () => {
				revoked = true;
			},
			close
		});
		unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (closedIdentity) => {
			if (!closedIdentity || closedIdentity.key === state.identity.key) await close();
		} });
		releaseBorrow = retainAgentDatabase(expectedDatabase);
	} catch (error) {
		try {
			await close();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Agent publication setup and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
	return {
		run(operation, assertCurrent) {
			if (revoked) return Promise.reject(/* @__PURE__ */ new Error("Agent database Worker owner is closed"));
			const assert = () => {
				assertHeld();
				assertCurrent();
			};
			const execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
			const source = {
				assertCurrent: assert,
				createAdmission(binding) {
					return () => {
						let phase = "waiting";
						return {
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((request, grant) => {
								binding.authorize(request);
								assert();
								if (request.stage === "transaction" || request.stage === "commit") {
									if (!(phase === "waiting" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error("Agent publication authority requested out of order");
									phase = request.stage;
								}
								if (!grant()) throw new Error("Agent publication authority expired");
							})
						};
					};
				}
			};
			const cleanupSource = {
				assertCurrent: () => assertHeld(true),
				createAdmission(binding) {
					return () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							if (request.stage !== "prepare") throw new Error("Publication cleanup cannot open storage or admit a transaction");
							binding.authorize(request);
							assertHeld(true);
							if (!grant()) throw new Error("Agent publication cleanup authority expired");
						})
					});
				}
			};
			const result = (async () => {
				let completed;
				try {
					completed = {
						ok: true,
						value: await runOpenClawAgentWorkerWrite(options, async () => {
							const id = randomUUID();
							let bound = false;
							const failures = [];
							let outcome;
							try {
								const executed = await execution.runExisting(source, async (scope) => {
									await scope.execute({
										type: "database.domain.bind",
										input: {
											id,
											moduleUrl,
											input
										}
									});
									bound = true;
									let accepting = true;
									const commands = /* @__PURE__ */ new Set();
									const commandFailures = [];
									let callback;
									try {
										callback = {
											ok: true,
											value: await operation({ execute: (command, commandOptions) => {
												if (!accepting) return Promise.reject(/* @__PURE__ */ new Error("Agent publication operation is closed"));
												if (typeof command.type !== "string") return Promise.reject(/* @__PURE__ */ new Error("Agent publication commands require a string type"));
												const commandResult = scope.execute({
													type: "database.domain.execute",
													input: {
														id,
														command: {
															type: command.type,
															input: command.input
														}
													}
												}, commandOptions);
												commands.add(commandResult);
												commandResult.then(() => commands.delete(commandResult), (error) => {
													if (!commandFailures.includes(error)) commandFailures.push(error);
													commands.delete(commandResult);
												});
												return commandResult;
											} })
										};
									} catch (error) {
										callback = {
											ok: false,
											error
										};
									}
									accepting = false;
									await Promise.allSettled(commands);
									if (!callback.ok) failures.push(callback.error);
									for (const error of commandFailures) if (!failures.includes(error)) failures.push(error);
									if (!callback.ok) throw callback.error;
									return { value: callback.value };
								});
								outcome = executed ? {
									ok: true,
									value: executed.value
								} : {
									ok: false,
									error: /* @__PURE__ */ new Error("Agent database disappeared before publication")
								};
							} catch (error) {
								outcome = {
									ok: false,
									error
								};
							}
							if (!outcome.ok && !failures.includes(outcome.error)) failures.push(outcome.error);
							if (bound) try {
								await execution.runExisting(cleanupSource, (scope) => scope.execute({
									type: "database.domain.close",
									input: { id }
								}), { retireNativeOnFailure: true });
							} catch (error) {
								if (outcome.ok && failures.length === 0) reportCompletedPublicationCleanupFailure(error);
								else failures.push(error);
							}
							if (failures.length === 1) throw failures[0];
							if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Agent publication and cleanup failed", failures[0]);
							if (!outcome.ok) throw outcome.error;
							return outcome.value;
						})
					};
				} catch (error) {
					completed = {
						ok: false,
						error
					};
				}
				try {
					await execution.release();
				} catch (releaseError) {
					if (!completed.ok) throw createSqliteLifecycleAggregateError([completed.error, releaseError], "Agent publication and executor release failed", completed.error);
					reportCompletedPublicationCleanupFailure(releaseError);
				}
				if (!completed.ok) throw completed.error;
				return completed.value;
			})();
			pending.add(result);
			result.finally(() => pending.delete(result)).catch(() => {});
			return result;
		},
		close
	};
}
//#endregion
export { openOpenClawAgentSqliteWorkerStore as t };
