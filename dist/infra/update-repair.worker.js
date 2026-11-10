import { t as drainGlobalSingletonLifecycleState } from "../global-singleton-DrXvEBww.mjs";
import { a as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "../async-work-scope-BH2yUdBz.mjs";
import { t as truncateUtf8Prefix } from "../utf8-truncate-_hf7tp13.mjs";
import { o as withCliProcessScope, r as retainCliProcessJobUntilExit } from "../runtime-cleanup-scope-Dv2f28xK.mjs";
import { i as updateRepairParentMessageSchema, n as UPDATE_REPAIR_TEXT_MAX_CHARS } from "../update-repair-protocol-BZwLyTyP.mjs";
//#region src/infra/update-repair.worker.ts
const deferredReason = "Inference repair is deferred until after the update has failed. Updates do not require inference.";
const controller = new AbortController();
const work = new AsyncWorkScope();
const admissionEnv = { ...process.env };
const pendingSends = /* @__PURE__ */ new Set();
let started = false;
let closing = false;
let finalExitCode = 0;
let execution = Promise.resolve();
function send(message) {
	const sending = new Promise((resolve, reject) => {
		if (!process.connected || !process.send || Buffer.byteLength(JSON.stringify(message)) > 65536) {
			reject(/* @__PURE__ */ new Error("Repair orchestrator disconnected."));
			return;
		}
		process.send(message, (error) => error ? reject(error) : resolve());
	});
	pendingSends.add(sending);
	sending.then(() => pendingSends.delete(sending), (error) => {
		pendingSends.delete(sending);
		stop(1, error);
	});
	return sending;
}
function stop(code, reason, messages = []) {
	if (code !== 0) finalExitCode = code;
	if (closing) return;
	closing = true;
	controller.abort(reason ?? /* @__PURE__ */ new Error("Repair worker finished."));
	work.beginClose(controller.signal.reason);
	process.off("message", onMessage);
	runOutsideAsyncWorkScope(async () => {
		try {
			await startup.catch(() => void 0);
			await execution;
			await work.drain();
			await drainGlobalSingletonLifecycleState();
			for (const message of messages) await send(message);
		} catch {
			finalExitCode = 1;
			process.stderr.write("Update repair worker failed while settling execution or cleanup.\n");
		} finally {
			await Promise.allSettled(pendingSends);
			process.off("disconnect", onDisconnect);
			process.off("SIGINT", onSignal);
			process.off("SIGTERM", onSignal);
			process.stdin.destroy();
			if (process.connected) process.disconnect?.();
			process.exitCode = finalExitCode;
		}
	});
}
function finish(status, reason, exitCode = 0) {
	stop(exitCode, exitCode !== 0 ? new Error(reason) : void 0, [{
		type: "event",
		event: {
			type: "stopped",
			status,
			reason
		}
	}, {
		type: "result",
		result: {
			status,
			attempts: [],
			finalValidation: {
				ok: false,
				score: 0,
				summary: reason
			},
			reason
		}
	}]);
}
function fail(error) {
	const message = error instanceof Error ? error.message : String(error);
	finish("aborted", truncateUtf8Prefix(message, UPDATE_REPAIR_TEXT_MAX_CHARS), 1);
}
function onDisconnect() {
	stop(started ? 1 : 0, /* @__PURE__ */ new Error("Repair orchestrator disconnected."));
}
function onSignal() {
	const error = /* @__PURE__ */ new Error("Repair worker cancelled.");
	controller.abort(error);
	if (!started) finish("aborted", error.message);
}
function onMessage(raw) {
	if (closing) return;
	try {
		if (Buffer.byteLength(JSON.stringify(raw)) > 65536) throw new Error("Repair request exceeded its bounded diagnostic budget.");
		const message = updateRepairParentMessageSchema.parse(raw);
		if (message.type === "cancel") {
			controller.abort(new Error(message.reason));
			if (!started) finish("aborted", message.reason);
			return;
		}
		if (message.type === "validation-result" || message.type === "validation-error") throw new Error("Repair worker did not request validation.");
		if (started) throw new Error("Repair worker already owns an execution.");
		started = true;
		if (message.type === "start") {
			finish("unavailable", deferredReason);
			return;
		}
		execution = startup.then(() => work.track(async () => {
			controller.signal.throwIfAborted();
			const { runDelegatedUpdateRepairTurn } = await import("../update-repair-turn-worker-DnEHwU8f.mjs");
			controller.signal.throwIfAborted();
			const result = await runDelegatedUpdateRepairTurn(message, admissionEnv, controller.signal, (route) => {
				send({
					type: "event",
					event: {
						type: "route-selected",
						...route
					}
				}).catch(() => {});
			});
			if (!closing) stop(0, void 0, [{
				type: "turn-result",
				result
			}]);
		})).catch((error) => fail(error));
	} catch (error) {
		fail(error);
	}
}
process.once("disconnect", onDisconnect);
process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);
process.on("message", onMessage);
const startup = Promise.resolve().then(() => withCliProcessScope(retainCliProcessJobUntilExit));
startup.then(() => {
	if (!closing) send({
		type: "ready",
		candidateRehearsal: true,
		repairTurns: true,
		executorDelegation: "pid-start-v1"
	}).catch(() => {});
}, (error) => fail(error));
//#endregion
export {};
