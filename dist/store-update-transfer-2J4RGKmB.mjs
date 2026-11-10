import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { c as createJsonFieldReceiver, l as jsonFieldBatches } from "./sqlite-readonly-worker-session-Bq0RBm36.mjs";
import { y as cloneAuthProfileJsonValue } from "./oauth-shared-CiaJlx_D.mjs";
import { receiveMessageOnPort } from "node:worker_threads";
//#region src/agents/auth-profiles/store-update-transfer.ts
function sendAuthProfileUpdateValue(port, value) {
	for (const batch of jsonFieldBatches(cloneAuthProfileJsonValue(value))) {
		port.postMessage(batch);
		recordWorkerMessage("authority", "to_worker");
	}
}
/** The producer queues a complete value before requesting its host admission. */
function receiveAuthProfileUpdateValue(port) {
	const receiver = createJsonFieldReceiver();
	for (let message = receiveMessageOnPort(port); message; message = receiveMessageOnPort(port)) {
		recordWorkerMessage("authority", "from_worker");
		if (!Array.isArray(message.message)) throw new Error("Invalid auth profile field batch");
		for (const field of message.message) receiver.accept(field);
	}
	return receiver.finish();
}
//#endregion
export { sendAuthProfileUpdateValue as n, receiveAuthProfileUpdateValue as t };
