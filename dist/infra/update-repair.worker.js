import { a as closeOpenClawStateDatabaseAsync } from "../openclaw-state-db-cache-BKCnj4of.mjs";
import "../openclaw-state-db-D1jWDzK3.mjs";
import { o as withCliProcessScope, r as retainCliProcessJobUntilExit } from "../runtime-cleanup-scope-BktLDe8P.mjs";
import { r as updateRepairParentMessageSchema } from "../update-repair-protocol-6YddvAVS.mjs";
//#region src/infra/update-repair.worker.ts
const deferredReason = "Inference repair is deferred until after the update has failed. Updates do not require inference.";
const controller = new AbortController();
const admissionEnv = { ...process.env };
let started = false;
let finished = false;
function handleSendFailure(error) {
	if (!started || finished) process.exit(1);
	controller.abort(error);
}
function send(message, complete) {
	if (!process.connected || !process.send || Buffer.byteLength(JSON.stringify(message)) > 65536) {
		handleSendFailure(/* @__PURE__ */ new Error("Repair orchestrator disconnected."));
		return;
	}
	process.send(message, (error) => {
		if (error) {
			handleSendFailure(error);
			return;
		}
		complete?.();
	});
}
async function finishTurn(result) {
	if (finished) return;
	finished = true;
	await closeOpenClawStateDatabaseAsync();
	send({
		type: "turn-result",
		result
	}, () => process.exit(0));
}
function finish(status, reason) {
	if (finished) return;
	finished = true;
	send({
		type: "event",
		event: {
			type: "stopped",
			status,
			reason
		}
	});
	send({
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
	}, () => process.exit(0));
}
process.once("disconnect", () => {
	if (!started || finished) process.exit(0);
	controller.abort(/* @__PURE__ */ new Error("Repair orchestrator disconnected."));
});
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => {
	const error = /* @__PURE__ */ new Error("Repair worker cancelled.");
	controller.abort(error);
	if (!started) finish("aborted", error.message);
});
process.on("message", (raw) => {
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
		import("../update-repair-turn-worker-B9O4BjNl.mjs").then(({ runDelegatedUpdateRepairTurn }) => runDelegatedUpdateRepairTurn(message, admissionEnv, controller.signal, (route) => send({
			type: "event",
			event: {
				type: "route-selected",
				...route
			}
		}))).then((result) => finishTurn(result)).catch(() => process.exit(1));
	} catch {
		process.exit(1);
	}
});
withCliProcessScope(retainCliProcessJobUntilExit).then(() => send({
	type: "ready",
	candidateRehearsal: true,
	repairTurns: true,
	executorDelegation: "pid-start-v1"
}), () => process.exit(1));
//#endregion
export {};
