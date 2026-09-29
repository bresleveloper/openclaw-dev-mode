import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-DKSXLQhb.mjs";
import { n as createSqliteLifecycleAggregateError } from "../sqlite-coordinator-z2lO0ops.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-CR_ZuhW6.mjs";
import { b as retainOpenClawStateDatabase, y as requireOpenClawStateDatabaseIdentity } from "../openclaw-state-db-cache-Ci98mtX8.mjs";
import { r as openOpenClawStateDatabase } from "../openclaw-state-db-BFK9cMiV.mjs";
import { r as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-DgNznZvn.mjs";
import { i as requestSqliteWorkerOperationAdmission, t as SqliteWorkerOpenRefusedError } from "../sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "../openclaw-agent-db-identity-DLTnzTd_.mjs";
import { m as ensureOpenClawAgentDatabasePermissions } from "../openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { d as prepareOpenClawAgentDatabaseWorkerLease } from "../openclaw-agent-db-lease-DexIwF6s.mjs";
import { a as closeOpenClawAgentDatabaseByPath, g as retainAgentDatabase } from "../openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { l as openOpenClawAgentDatabase, s as getOpenClawAgentDatabaseIfOpen } from "../openclaw-agent-db-CaQAStOA.mjs";
import { i as getOpenClawAgentDatabaseValidation } from "../openclaw-agent-db-validation-cache-BQ1Mko2o.mjs";
import { isPromise } from "node:util/types";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/state/openclaw-agent-execution-domain.ts
/** One admitted publication scope borrows the canonical connection; it never owns its close. */
function createAgentDatabaseDomainOwner(context) {
	let binding;
	let prepared;
	let failedBinding = false;
	const requireBinding = (id) => {
		if (!binding || binding.id !== id || binding.closing) throw new Error("Agent database operation lost its bound publication scope");
		return binding;
	};
	return {
		async prepare(command) {
			if (command.type === "database.domain.bind") {
				if (binding || prepared) throw new Error("Agent database already has an admitted publication scope");
				const url = new URL(command.input.moduleUrl);
				if (url.protocol !== "file:" || url.search || url.hash) throw new Error("Agent publication requires a static local module URL");
				const module = await import(url.href);
				if (!isRecord(module) || typeof module.bindSqliteWorkerBackend !== "function") throw new Error("Agent publication module must export bindSqliteWorkerBackend");
				const factory = module.bindSqliteWorkerBackend;
				prepared = {
					id: command.input.id,
					factory: (input, bindingContext) => factory(input, bindingContext)
				};
			} else if (command.type === "database.domain.execute") {
				const current = requireBinding(command.input.id);
				const loading = current.backend[SQLITE_WORKER_PREPARE_COMMAND]?.(command.input.command.type);
				if (loading) await loading;
				await current.backend.prepare?.(command.input.command);
				if (requireBinding(command.input.id) !== current) throw new Error("Agent publication changed during command preparation");
			}
		},
		execute(command) {
			const database = context.assertCurrent();
			if (command.type === "database.domain.bind") {
				if (!prepared || prepared.id !== command.input.id || binding) throw new Error("Agent publication module was not prepared for this scope");
				const factory = prepared.factory;
				prepared = void 0;
				failedBinding = true;
				const backend = factory(command.input.input, {
					databasePath: context.databasePath,
					database,
					admit: (stage) => context.admit(stage)
				});
				if (isPromise(backend)) {
					backend.catch(() => {});
					throw new Error("Connection-bound publication factories must remain synchronous");
				}
				if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || typeof backend.assertSettled !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("Agent publication module returned an invalid connection-bound backend");
				binding = {
					id: command.input.id,
					backend,
					closing: false
				};
				failedBinding = false;
				return;
			}
			const current = requireBinding(command.input.id);
			if (command.type === "database.domain.close") {
				current.closing = true;
				const closed = current.backend.close();
				if (closed !== void 0) {
					closed.catch(() => {});
					throw new Error("Connection-bound publication cleanup must remain synchronous");
				}
				binding = void 0;
				return;
			}
			return current.backend.execute(command.input.command);
		},
		assertSettled() {
			prepared = void 0;
			if (failedBinding) throw new Error("Agent publication binding did not settle");
			if (binding?.closing) throw new Error("Agent publication cleanup did not settle");
			binding?.backend.assertSettled?.();
		},
		close() {
			if (binding) {
				binding.closing = true;
				const closed = binding.backend.close();
				if (closed !== void 0) {
					closed.catch(() => {});
					throw new Error("Connection-bound publication cleanup must remain synchronous");
				}
				binding = void 0;
			}
			prepared = void 0;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution.worker.ts
/** The broker supplies a private admission channel before invoking this native factory. */
function openExistingSqliteWorkerBackend(input, opening) {
	if (opening.databasePath !== input.databasePath) throw new Error("Agent database open does not match its captured execution owner");
	const admitOpen = () => {
		try {
			requestSqliteWorkerOperationAdmission({
				stage: "open",
				facts: input
			});
		} catch (error) {
			throw new SqliteWorkerOpenRefusedError(error);
		}
	};
	admitOpen();
	const options = {
		agentId: input.agentId,
		path: input.databasePath,
		env: input.environment
	};
	let admittedFileIdentity = opening.existingIdentity ?? readDatabasePathIdentitySync(input.databasePath).key;
	const assertFileIdentity = () => {
		if (input.expectedIdentity) assertExistingDatabaseIdentity(input.databasePath, `file:${input.expectedIdentity.physicalIdentity}`);
		if (admittedFileIdentity) assertExistingDatabaseIdentity(input.databasePath, admittedFileIdentity);
	};
	let database;
	let shared;
	let sharedBorrow;
	let releaseBorrow;
	let identity;
	let openingFailure;
	const openWriter = () => {
		let validation;
		if (!database) {
			admitOpen();
			assertFileIdentity();
			if (!shared) {
				shared = openOpenClawStateDatabase({
					path: input.stateDatabasePath,
					env: input.environment
				});
				sharedBorrow = retainOpenClawStateDatabase(shared);
			}
			const lease = prepareOpenClawAgentDatabaseWorkerLease(options, shared, input.leaseId);
			const { port1, port2 } = new MessageChannel();
			try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "shared-owner",
						identity: requireOpenClawStateDatabaseIdentity(shared),
						lease: lease.receipt,
						validationPort: port2
					}
				}, [port2]);
				lease.validation = receiveMessageOnPort(port1)?.message;
			} catch (error) {
				throw new SqliteWorkerOpenRefusedError(error);
			} finally {
				port1.close();
				port2.close();
			}
			assertFileIdentity();
			let registration;
			let openingResult;
			try {
				const opened = openOpenClawAgentDatabase(options, lease, (receipt) => {
					registration = receipt;
				});
				database = opened;
				releaseBorrow = retainAgentDatabase(opened.db);
				openingResult = {
					ok: true,
					value: opened
				};
			} catch (error) {
				openingFailure = { error };
				openingResult = {
					ok: false,
					error
				};
			}
			if (registration) try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-registration-committed",
						registration
					}
				});
			} catch (error) {
				if (!openingResult.ok) throw createSqliteLifecycleAggregateError([openingResult.error, error], `${String(openingResult.error)}; committed registration reporting failed: ${String(error)}`, openingResult.error);
				throw error;
			}
			if (!openingResult.ok) throw openingResult.error;
			const opened = openingResult.value;
			const nativeIdentity = readOpenClawAgentDatabaseIdentity(opened);
			if (typeof nativeIdentity.identity !== "string") throw new Error("Disk agent execution requires its canonical file identity");
			const openedFileIdentity = `file:${nativeIdentity.identity}`;
			if (admittedFileIdentity && openedFileIdentity !== admittedFileIdentity) throw new Error("Agent writer differs from its admitted physical file");
			if (input.expectedIdentity && nativeIdentity.identity !== input.expectedIdentity.physicalIdentity) throw new Error("Agent writer differs from its expected physical file");
			admittedFileIdentity = openedFileIdentity;
			identity = {
				kind: "file",
				physicalIdentity: nativeIdentity.identity,
				incarnation: nativeIdentity.incarnation,
				nativeLocation: nativeIdentity.filename
			};
			validation = getOpenClawAgentDatabaseValidation(opened);
		}
		if (!database || !database.db.isOpen || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Agent execution lost its retained native database");
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				identity,
				validation
			}
		});
		return database;
	};
	const admit = (stage) => {
		assertFileIdentity();
		requestSqliteWorkerOperationAdmission({
			stage,
			facts: { identity }
		});
		if (stage === "commit") ensureOpenClawAgentDatabasePermissions(input.databasePath, options);
	};
	let providerReview;
	const domain = createAgentDatabaseDomainOwner({
		databasePath: input.databasePath,
		assertCurrent() {
			assertOpen();
			const current = openWriter();
			assertFileIdentity();
			return current.db;
		},
		admit
	});
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Agent database execution owner is closed");
	};
	return {
		prepare(command) {
			if (command.type === "session.providerReview.compare") return import("../provider-review-store.worker-CZ8XVLUt.mjs").then((module) => {
				providerReview = module;
			});
			if (command.type === "database.domain.bind" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.prepare(command);
		},
		assertSettled() {
			if (openingFailure) throw openingFailure.error;
			domain.assertSettled();
			if (database) {
				assertTransactionUsable(database.db);
				if (!identity || !database.db.isOpen || database.db.isTransaction) throw new Error("Agent database command left an unsettled native connection");
			}
		},
		execute(command) {
			assertOpen();
			if (command.type === "database.domain.bind" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.execute(command);
			if (command.type === "database.prepareWrite") {
				openWriter();
				return;
			}
			if (command.type === "session.providerReview.compare" && providerReview) return providerReview.compareSessionProviderReviewInWorker(openWriter(), options, command.input, admit);
			throw new Error("Unknown agent database operation");
		},
		close() {
			closed = true;
			const errors = [];
			for (const cleanup of [
				() => domain.close(),
				() => database && closeOpenClawAgentDatabaseByPath(database.path, database.agentId),
				() => releaseBorrow?.(),
				() => sharedBorrow?.release()
			]) try {
				cleanup();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Agent database cleanup failed", errors[0]);
		}
	};
}
//#endregion
export { openExistingSqliteWorkerBackend };
