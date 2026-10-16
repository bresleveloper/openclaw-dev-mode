import { f as toStructuredErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { g as recordOpenClawStateDatabaseOpenFailure, l as confirmOpenClawStateDatabaseIntegrity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { c as recordOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { c as recordOpenClawAgentDatabaseOpenFailure, i as confirmOpenClawAgentDatabaseIntegrity } from "./openclaw-agent-db-DBug3LUA.mjs";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";
//#region src/state/openclaw-database-verify.impl.ts
const log = createSubsystemLogger("state/database-verify");
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function isVerifyResult(result) {
	return isRecord(result) && typeof result.path === "string" && typeof result.ok === "boolean" && (result.error === void 0 || typeof result.error === "string") && (result.terminal === void 0 || typeof result.terminal === "boolean");
}
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
		if (!Array.isArray(message) || !message.every(isVerifyResult)) {
			fail(/* @__PURE__ */ new Error("database verification worker returned invalid results"));
			return;
		}
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
/** Reconfirm worker failures on live owners before quarantine and latching. */
async function applyOpenClawDatabaseVerificationResults(options) {
	const targetByPath = new Map(options.targets.map((target) => [target.path, target]));
	for (const result of options.results) {
		const target = targetByPath.get(result.path);
		if (!target) continue;
		const details = {
			kind: target.kind,
			label: target.label,
			path: result.path
		};
		if (result.ok) {
			log.info("database integrity verification passed", details);
			continue;
		}
		if (!result.terminal) {
			log.warn("database integrity verification was inconclusive", {
				...details,
				error: result.error
			});
			continue;
		}
		const confirmation = await (target.kind === "state" ? confirmOpenClawStateDatabaseIntegrity : confirmOpenClawAgentDatabaseIntegrity)(result.path);
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
export { applyOpenClawDatabaseVerificationResults, runDatabaseVerifyWorker, terminateDatabaseVerifyWorker };
