import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as waitForAgentDatabasePreparation } from "./agent-database-preparation-context-DK375nya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as normalizeDatabasePath, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { b as AgentDatabaseExecutionAdmissionClosedError, o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./session-key-CSDERtm3.mjs";
import { l as getGatewayRestartDrainSignal, u as getGatewayShutdownCleanupSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { l as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { _ as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { i as captureOpenClawAgentDatabasePreparationExecution, r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { randomUUID } from "node:crypto";
import { deserialize, serialize } from "node:v8";
import { addAbortListener } from "node:events";
//#region src/state/openclaw-agent-worker-store.ts
const log = createSubsystemLogger("state/agent-db");
function reportCompletedPublicationCleanupFailure(error) {
	try {
		log.warn(`Agent publication completed before cleanup failed: ${formatErrorMessage(error)}`);
	} catch {}
}
/** Send a paired module's command through the caller's already-admitted executor. */
function executeOpenClawAgentWorkerPublication(scope, publication, options) {
	const { command } = publication;
	if (typeof command.type !== "string") throw new Error("Agent publication commands require a string type");
	return scope.execute({
		type: "database.domain.publish",
		input: {
			...publication,
			command: {
				type: command.type,
				input: command.input
			}
		}
	}, options);
}
/** Retains a native borrow or checks a caller-held executor; each operation borrows the canonical executor. */
async function openOpenClawAgentSqliteWorkerStore(inputOptions, publicationSource, worker) {
	if (!("execution" in publicationSource)) warnPluginSdkDeprecation({
		family: "sqlite-runtime-native-access",
		method: "openOpenClawAgentSqliteWorkerStore(nativeDatabase)",
		replacement: "openOpenClawAgentSqliteWorkerStoreV2"
	});
	return createOpenClawAgentSqliteWorkerStore(inputOptions, publicationSource, worker);
}
/** A retained worker capability; no writable native handle leaves the storage owner. */
async function openOpenClawAgentSqliteWorkerStoreV2(inputOptions, authority, worker) {
	if (authority.version !== 2 || typeof authority.assertCurrent !== "function") throw new Error("Agent worker storage requires V2 live authority");
	return createOpenClawAgentSqliteWorkerStore(inputOptions, { authority }, worker);
}
async function createOpenClawAgentSqliteWorkerStore(inputOptions, publicationSource, worker) {
	const env = cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		...inputOptions,
		agentId: normalizeAgentId(inputOptions.agentId),
		env,
		path: resolveOpenClawAgentSqlitePath({
			...inputOptions,
			env
		})
	};
	const ownedAuthority = "authority" in publicationSource ? publicationSource.authority : void 0;
	ownedAuthority?.assertCurrent();
	if (ownedAuthority) {
		const preparation = waitForAgentDatabasePreparation(options.agentId, { env });
		if (preparation) {
			await preparation;
			ownedAuthority.assertCurrent();
		}
	}
	const expectedDatabase = "execution" in publicationSource || "authority" in publicationSource ? void 0 : publicationSource;
	const prepared = expectedDatabase ? readOpenClawAgentDatabaseIdentity({ db: expectedDatabase }) : void 0;
	const expectedIdentity = prepared ? {
		kind: "file",
		physicalIdentity: prepared.identity,
		nativeLocation: prepared.filename,
		birthtime: prepared.birthtime
	} : void 0;
	const moduleUrl = new URL(worker.moduleUrl).href;
	const input = structuredClone(worker.input);
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(options.env));
	const terminalExecution = ownedAuthority ? captureOpenClawAgentDatabaseExecution(options) : void 0;
	const capturedExecution = terminalExecution ?? ("execution" in publicationSource ? publicationSource.execution : void 0);
	let revoked = false;
	const terminal = new AbortController();
	let terminalReason;
	let closing;
	let drainExecution;
	let releaseBorrow;
	let unregisterAgent;
	let unregisterState;
	const pending = /* @__PURE__ */ new Set();
	const cleanupSignal = getGatewayShutdownCleanupSignal();
	const reportTerminal = (error) => {
		if (terminalReason) return;
		const reason = error instanceof Error ? error : new Error(formatErrorMessage(error));
		terminalReason = reason;
		revoked = true;
		Promise.resolve().then(async () => {
			await Promise.allSettled(pending);
			terminal.abort(reason);
		});
	};
	const stopObservingExecution = terminalExecution?.onTerminal(reportTerminal);
	const releaseDrainExecution = async () => {
		await drainExecution?.release();
		drainExecution = void 0;
	};
	const assertHeld = (cleanup = false) => {
		if (revoked && !cleanup) throw terminalReason ?? new AgentDatabaseExecutionAdmissionClosedError("Agent database Worker owner is closed");
		try {
			state.assertCurrent();
			if (!cleanup) ownedAuthority?.assertCurrent();
			if (capturedExecution) {
				capturedExecution.assertCurrent();
				return;
			}
		} catch (error) {
			if (!cleanup) reportTerminal(error);
			throw error;
		}
		const current = getOpenClawAgentDatabaseIfOpen(options);
		if (!expectedDatabase || !current || current.db !== expectedDatabase || !expectedDatabase.isOpen || normalizeDatabasePath(expectedDatabase.location() ?? "") !== prepared?.filename) throw new Error("Borrowed agent database closed or changed before Worker admission");
	};
	const close = () => {
		revoked = true;
		cleanupListener[Symbol.dispose]();
		closing ??= (async () => {
			await Promise.allSettled(pending);
			stopObservingExecution?.();
			await releaseDrainExecution();
			if (ownedAuthority) await capturedExecution?.release();
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
	const cleanupListener = addAbortListener(cleanupSignal, () => {
		const release = releaseDrainExecution();
		pending.add(release);
		release.finally(() => pending.delete(release)).catch(reportCompletedPublicationCleanupFailure);
	});
	try {
		if (capturedExecution && (capturedExecution.agentId !== options.agentId || capturedExecution.path !== options.path)) throw new Error("Agent publication source differs from its captured executor");
		assertHeld();
		if (expectedIdentity) assertExistingDatabaseIdentity(options.path, `file:${expectedIdentity.physicalIdentity}`, expectedIdentity.birthtime);
		unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
			agentId: options.agentId,
			path: options.path,
			revoke: () => {
				reportTerminal(new AgentDatabaseExecutionAdmissionClosedError("Agent database Worker owner is closed: admission revoked"));
			},
			close
		});
		unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (closedIdentity) => {
			if (!closedIdentity || closedIdentity.key === state.identity.key) {
				reportTerminal(new AgentDatabaseExecutionAdmissionClosedError("Agent database Worker state admission closed"));
				await close();
			}
		} });
		if (expectedDatabase) releaseBorrow = retainAgentDatabase(expectedDatabase);
	} catch (error) {
		try {
			await close();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Agent publication setup and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
	const runPublication = (assertCurrent, operation, signal, prepare = false) => {
		if (revoked) return Promise.reject(terminalReason ?? new AgentDatabaseExecutionAdmissionClosedError("Agent database Worker owner is closed"));
		const assert = () => {
			assertHeld();
			assertCurrent();
			assertHeld();
		};
		const execution = prepare ? captureOpenClawAgentDatabasePreparationExecution(options, expectedIdentity) : captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
		const source = {
			assertCurrent: assert,
			createAdmission(binding) {
				return (retained) => {
					const admission = createSqliteWorkerOperationAdmission((request, grant) => {
						binding.authorize(worker.assertAdmission?.(request) ?? request);
						if (!grant(() => worker.onAdmitted?.(request))) throw new Error("Agent publication authority expired");
					}, binding.attachment);
					try {
						worker.observeAdmission?.(admission, retained);
					} catch (error) {
						admission.finish();
						throw error;
					}
					return {
						nativeLocations: binding.nativeLocations,
						admission
					};
				};
			}
		};
		const result = (async () => {
			let completed;
			try {
				completed = {
					ok: true,
					value: await runOpenClawAgentWorkerWrite(options, () => operation(execution, source), void 0, signal)
				};
			} catch (error) {
				completed = {
					ok: false,
					error
				};
			}
			let releasing = execution;
			if (completed.ok && !revoked && getGatewayRestartDrainSignal().aborted && !cleanupSignal.aborted) {
				const previous = drainExecution;
				drainExecution = execution;
				releasing = previous;
			}
			try {
				await releasing?.release();
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
	};
	const executeCommand = async (command, assertCurrent, select, commandOptions) => {
		commandOptions?.signal?.throwIfAborted();
		if (typeof command.type !== "string") throw new Error("Agent publication commands require a string type");
		const publication = {
			id: randomUUID(),
			moduleUrl,
			input,
			command: {
				type: command.type,
				input: command.input
			}
		};
		const captured = serialize(publication);
		const preparation = reserveSqliteWorkerInputPreparation(captured.byteLength, "snapshot");
		try {
			return await runPublication(assertCurrent, async (execution, source) => {
				return select(await execution.runExisting(source, async (scope) => ({ value: await preparation.handoff(() => executeOpenClawAgentWorkerPublication(scope, deserialize(captured), commandOptions)) })));
			}, commandOptions?.signal);
		} finally {
			preparation.release();
		}
	};
	return {
		terminalSignal: terminal.signal,
		async prepare(prepareOptions) {
			prepareOptions?.signal?.throwIfAborted();
			return runPublication(() => {}, (execution, source) => execution.prepare(source, prepareOptions?.signal), prepareOptions?.signal, true);
		},
		execute(command, assertCurrent, commandOptions) {
			return executeCommand(command, assertCurrent, (receipt) => {
				if (!receipt) throw new Error("Agent database disappeared before publication");
				return receipt.value;
			}, commandOptions);
		},
		executeExisting(command, assertCurrent, commandOptions) {
			return executeCommand(command, assertCurrent, (receipt) => receipt, commandOptions);
		},
		run(operation, assertCurrent) {
			return runPublication(assertCurrent, async (execution, source) => {
				const cleanupSource = {
					assertCurrent: () => assertHeld(true),
					createAdmission(binding) {
						return () => ({
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((request, grant) => {
								if (request.stage !== "prepare") throw new Error("Publication cleanup cannot open storage or admit a transaction");
								binding.authorize(request);
								if (!grant()) throw new Error("Agent publication cleanup authority expired");
							}, binding.attachment)
						});
					}
				};
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
					if (error instanceof AgentDatabaseExecutionAdmissionClosedError) {} else if (outcome.ok && failures.length === 0) reportCompletedPublicationCleanupFailure(error);
					else failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "Agent publication and cleanup failed");
				if (!outcome.ok) throw outcome.error;
				return outcome.value;
			});
		},
		close
	};
}
//#endregion
export { openOpenClawAgentSqliteWorkerStore as n, openOpenClawAgentSqliteWorkerStoreV2 as r, executeOpenClawAgentWorkerPublication as t };
