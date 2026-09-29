import { r as updateRepairParentMessageSchema } from "../update-repair-protocol-BewIuWe8.mjs";
//#region src/infra/update-repair.worker.ts
const deferredReason = "Inference repair is deferred until after the update has failed. Updates do not require inference.";
let finished = false;
function send(message, complete) {
	if (!process.connected || !process.send || Buffer.byteLength(JSON.stringify(message)) > 65536) process.exit(1);
	process.send(message, (error) => {
		if (error) process.exit(1);
		complete?.();
	});
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
process.once("disconnect", () => process.exit(0));
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => finish("aborted", "Repair worker cancelled."));
process.on("message", (raw) => {
	try {
		if (Buffer.byteLength(JSON.stringify(raw)) > 65536) throw new Error("Repair request exceeded its bounded diagnostic budget.");
		const message = updateRepairParentMessageSchema.parse(raw);
		if (message.type === "cancel") finish("aborted", message.reason);
		else if (message.type === "start") finish("unavailable", deferredReason);
		else throw new Error("Repair worker did not request validation.");
	} catch {
		process.exit(1);
	}
});
send({
	type: "ready",
	candidateRehearsal: true
});
//#endregion
export {};
