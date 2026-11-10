import { st as toStructuredErrorObject, t as createSubsystemLogger } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { V as confirmOpenClawStateDatabaseIntegrity, d as recordOpenClawAgentDatabaseOpenFailure, l as closeOpenClawAgentDatabaseByPathAsync, t as confirmOpenClawAgentDatabaseIntegrity } from "./sqlite-readonly-openclaw-agent-db-DnbjFHbu.mjs";
import { N as recordOpenClawDatabaseQuarantine, u as recordOpenClawStateDatabaseOpenFailure } from "./sqlite-readonly-openclaw-state-db-cache-CRy98JJU.mjs";
import { a as runtimeProcessEntrypoints } from "./sqlite-readonly-runtime-binary-aVOs5Y3K.mjs";
import { N as resolveRuntimeWorkerUrl } from "./sqlite-readonly-location.worker.js";
import { n as parseSqliteFileGeneration } from "./sqlite-readonly-sqlite-file-generation-B2tri0d6.mjs";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";
//#region src/state/openclaw-database-verify.impl.ts
const log = createSubsystemLogger("state/database-verify");
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
const workerLifecycles = /* @__PURE__ */ new WeakMap();
function ownDatabaseVerifyWorker(worker) {
	let terminationRequested = false;
	const lifecycle = {
		settled: new Promise((resolve) => {
			let exit;
			let disconnected = !worker.connected;
			const finish = () => {
				if (!exit || !disconnected) return;
				worker.off("exit", onExit);
				worker.off("disconnect", onDisconnect);
				worker.off("close", onClose);
				resolve(exit);
			};
			const onExit = (code, signal) => {
				exit = {
					code,
					signal
				};
				finish();
			};
			const onDisconnect = () => {
				disconnected = true;
				finish();
			};
			const onClose = (code, signal) => {
				if (worker.pid === void 0) {
					exit = {
						code,
						signal
					};
					disconnected = true;
					finish();
				}
			};
			worker.once("exit", onExit);
			worker.once("disconnect", onDisconnect);
			worker.once("close", onClose);
		}),
		requestTermination: () => {
			if (terminationRequested || worker.pid === void 0 || worker.exitCode !== null || worker.signalCode !== null) return;
			terminationRequested = true;
			let signalError;
			const onSignalError = (error) => {
				signalError = error;
			};
			worker.on("error", onSignalError);
			try {
				if (worker.kill()) return;
			} catch (error) {
				signalError = toStructuredErrorObject(error);
			} finally {
				worker.off("error", onSignalError);
			}
			log.error("database verification worker termination failed; waiting for native exit", {
				pid: worker.pid,
				error: signalError?.message ?? "signal was not delivered"
			});
		}
	};
	workerLifecycles.set(worker, lifecycle);
	return lifecycle;
}
function runDatabaseVerifyWorker(targets, options = {}) {
	options.assertCurrent?.();
	const workerUrl = options.workerUrl ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.databaseVerify);
	const execArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = fork(fileURLToPath(workerUrl), [DATABASE_VERIFY_CHILD_ARG], {
			execArgv,
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			]
		});
	} catch (error) {
		return Promise.reject(toStructuredErrorObject(error));
	}
	const lifecycle = ownDatabaseVerifyWorker(worker);
	let result;
	let failure;
	let settled = false;
	const fail = (error) => {
		if (settled) return;
		failure ??= toStructuredErrorObject(error);
		lifecycle.requestTermination();
	};
	const onMessage = (message) => {
		result = message;
	};
	worker.once("message", onMessage);
	worker.on("error", fail);
	const completion = lifecycle.settled.then((exit) => {
		settled = true;
		worker.off("message", onMessage);
		worker.off("error", fail);
		options.onWorker?.(void 0);
		if (failure) throw failure;
		if (exit.code !== 0) throw new Error(`database verification worker exited with ${exit.signal ? `signal ${exit.signal}` : `code ${exit.code}`}`);
		if (!result) throw new Error("database verification worker exited without results");
		return result;
	});
	options.onWorker?.(worker);
	if (worker.pid !== void 0) try {
		worker.send(targets, (error) => {
			if (error) fail(error);
		});
	} catch (error) {
		fail(error);
	}
	return completion;
}
async function terminateDatabaseVerifyWorker(worker) {
	const lifecycle = workerLifecycles.get(worker);
	if (!lifecycle) throw new Error("database verification worker is not owned by this verifier");
	lifecycle.requestTermination();
	await lifecycle.settled;
}
/** The caller drains its owners; the child binds full confirmation to file generations. */
async function confirmDatabaseVerifyWorker(target, lifetime = {}) {
	const [result] = await runDatabaseVerifyWorker([{
		...target,
		check: "full",
		confirm: true
	}], lifetime);
	lifetime.assertCurrent?.();
	if (!result || result.path !== target.path) throw new Error("database verification worker returned no confirmation");
	const generation = result.generation ? parseSqliteFileGeneration(result.generation) : void 0;
	if (result.ok && generation) return {
		status: "healthy",
		generation
	};
	const error = new Error(result.error ?? "database integrity confirmation was unbound");
	if (result.terminal && generation) {
		error.name = "SqliteIntegrityError";
		return {
			status: "failed",
			error,
			terminal: true,
			generation
		};
	}
	return {
		status: "failed",
		error,
		terminal: false
	};
}
/** Reconfirm worker failures on live owners before quarantine and latching. */
async function applyOpenClawDatabaseVerificationResults(options) {
	const targetByPath = new Map(options.targets.map((target) => [target.path, target]));
	for (const result of options.results.toSorted((left, right) => Number(left.ok) - Number(right.ok))) {
		options.workerLifetime?.assertCurrent?.();
		const target = targetByPath.get(result.path);
		if (!target) continue;
		const details = {
			kind: target.kind,
			label: target.label,
			path: result.path,
			check: target.check
		};
		if (result.ok) {
			let durableVerification;
			try {
				durableVerification = await options.onVerified?.(result.path);
			} catch (error) {
				options.workerLifetime?.assertCurrent?.();
				durableVerification = false;
				log.warn("database integrity verification proof was not retained", {
					...details,
					error: String(error)
				});
			}
			options.workerLifetime?.assertCurrent?.();
			log.info("database integrity verification passed", {
				...details,
				durableVerification
			});
			continue;
		}
		if (!result.terminal) {
			log.warn("database integrity verification was inconclusive", {
				...details,
				error: result.error
			});
			continue;
		}
		const confirmation = await (target.kind === "state" ? confirmOpenClawStateDatabaseIntegrity(result.path) : confirmOpenClawAgentDatabaseIntegrity(result.path, options.workerLifetime));
		options.workerLifetime?.assertCurrent?.();
		if (confirmation.status === "healthy") {
			log.info("discarding stale database integrity verification result", details);
			continue;
		}
		if (!confirmation.terminal) {
			log.warn("database integrity verification was inconclusive", {
				...details,
				error: confirmation.error.message
			});
			continue;
		}
		if (!(target.kind === "state" ? recordOpenClawStateDatabaseOpenFailure : recordOpenClawAgentDatabaseOpenFailure)(result.path, confirmation.error, confirmation.generation)) {
			log.info("discarding database integrity result after database generation changed", details);
			continue;
		}
		if (target.kind === "agent") await closeOpenClawAgentDatabaseByPathAsync(result.path);
		if (!recordOpenClawDatabaseQuarantine({
			env: options.env,
			generation: confirmation.generation,
			kind: target.kind,
			path: result.path,
			reason: confirmation.error.message
		})) log.error("failed to persist database quarantine; quarantine is process-local", {
			kind: target.kind,
			path: result.path
		});
		log.error("database integrity verification failed", {
			...details,
			error: confirmation.error.message
		});
	}
}
//#endregion
export { applyOpenClawDatabaseVerificationResults, confirmDatabaseVerifyWorker, runDatabaseVerifyWorker, terminateDatabaseVerifyWorker };
