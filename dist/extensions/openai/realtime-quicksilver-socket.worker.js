import { t as OpenAIQuicksilverSocketRuntime } from "../../realtime-quicksilver-socket.runtime-aVzAbWtf.mjs";
import { parentPort, workerData } from "node:worker_threads";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-socket.worker.ts
const port = parentPort;
if (!port) throw new Error("GPT-Live socket runtime requires a worker thread");
const data = workerData;
function post(message) {
	port.postMessage(message, []);
}
try {
	const socket = new WebSocket$1(data.url, {
		headers: data.options.headers,
		maxPayload: data.options.maxPayload
	});
	let closeTimer;
	const runtime = new OpenAIQuicksilverSocketRuntime(socket, data, post, () => {
		if (closeTimer) clearTimeout(closeTimer);
		port.close();
	}, () => socket.bufferedAmount);
	port.on("message", (command) => {
		if (command.type === "close" && !closeTimer) {
			closeTimer = setTimeout(() => socket.terminate(), 1e3);
			closeTimer.unref();
		}
		runtime.command(command);
	});
} catch {
	post({ type: "error" });
	post({
		type: "close",
		code: 1006,
		reason: "media startup failed"
	});
	port.close();
}
//#endregion
export {};
