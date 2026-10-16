import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as assertExistingDatabaseIdentity, o as normalizeDatabasePath } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { u as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { deserialize, serialize } from "node:v8";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-worker-store.ts
const log = createSubsystemLogger("state/agent-db");
function reportCompletedPublicationCleanupFailure(error) {
	try {
		log.warn(`Agent publication completed before cleanup failed: ${formatErrorMessage(error)}`);
	} catch {}
}
/** Retains a native borrow or checks a caller-held executor; each operation borrows the canonical executor. */
async function openOpenClawAgentSqliteWorkerStore(inputOptions, publicationSource, worker) {
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
	const capturedExecution = "execution" in publicationSource ? publicationSource.execution : void 0;
	const expectedDatabase = "execution" in publicationSource ? void 0 : publicationSource;
	if (capturedExecution && (capturedExecution.agentId !== options.agentId || capturedExecution.path !== options.path)) throw new Error("Agent publication source differs from its captured executor");
	const prepared = expectedDatabase ? readOpenClawAgentDatabaseIdentity({ db: expectedDatabase }) : void 0;
	if (prepared && typeof prepared.identity !== "string") throw new Error("Agent Worker requires its existing file owner");
	const expectedIdentity = prepared && typeof prepared.identity === "string" ? {
		kind: "file",
		physicalIdentity: prepared.identity,
		nativeLocation: prepared.filename,
		birthtime: prepared.birthtime
	} : void 0;
	const moduleUrl = new URL(worker.moduleUrl).href;
	const input = structuredClone(worker.input);
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(options.env));
	let revoked = false;
	let closing;
	let drainExecution;
	let releaseBorrow;
	let unregisterAgent;
	let unregisterState;
	const pending = /* @__PURE__ */ new Set();
	const assertHeld = (cleanup = false) => {
		if (revoked && !cleanup) throw new Error("Agent database Worker owner is closed");
		state.assertCurrent();
		if (capturedExecution) {
			capturedExecution.assertCurrent();
			return;
		}
		const current = getOpenClawAgentDatabaseIfOpen(options);
		if (!expectedDatabase || !current || current.db !== expectedDatabase || !expectedDatabase.isOpen || normalizeDatabasePath(expectedDatabase.location() ?? "") !== prepared?.filename) throw new Error("Borrowed agent database closed or changed before Worker admission");
	};
	assertHeld();
	if (expectedIdentity) assertExistingDatabaseIdentity(options.path, `file:${expectedIdentity.physicalIdentity}`, expectedIdentity.birthtime);
	const close = () => {
		revoked = true;
		closing ??= (async () => {
			await Promise.allSettled(pending);
			if (drainExecution) {
				await drainExecution.release();
				drainExecution = void 0;
			}
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
		if (expectedDatabase) releaseBorrow = retainAgentDatabase(expectedDatabase);
	} catch (error) {
		try {
			await close();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Agent publication setup and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
	const runPublication = (assertCurrent, operation, signal) => {
		if (revoked) return Promise.reject(/* @__PURE__ */ new Error("Agent database Worker owner is closed"));
		const assert = () => {
			assertHeld();
			assertCurrent();
			assertHeld();
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
							binding.authorize(worker.assertAdmission?.(request) ?? request);
							if (request.stage === "transaction" || request.stage === "commit") {
								if (!(phase === "waiting" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error("Agent publication authority requested out of order");
								phase = request.stage;
							}
							if (!grant()) throw new Error("Agent publication authority expired");
						}, binding.attachment)
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
			if (completed.ok && !revoked && getGatewayRestartDrainSignal().aborted) {
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
	return {
		async execute(command, assertCurrent, commandOptions) {
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
					const receipt = await execution.runExisting(source, async (scope) => ({ value: await preparation.handoff(() => scope.execute({
						type: "database.domain.publish",
						input: deserialize(captured)
					}, commandOptions)) }));
					if (!receipt) throw new Error("Agent database disappeared before publication");
					return receipt.value;
				}, commandOptions?.signal);
			} finally {
				preparation.release();
			}
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
					if (outcome.ok && failures.length === 0) reportCompletedPublicationCleanupFailure(error);
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
export { openOpenClawAgentSqliteWorkerStore as t };
