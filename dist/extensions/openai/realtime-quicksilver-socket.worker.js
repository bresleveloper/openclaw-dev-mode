import { t as WebSocket } from "../../websocket-runtime-jKgLhX3s.mjs";
import { t as OpenAIQuicksilverSocketRuntime } from "../../realtime-quicksilver-socket.runtime-C3v1gV2_.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region extensions/openai/realtime-quicksilver-socket.worker.ts
const port = parentPort;
if (!port) throw new Error("GPT-Live socket runtime requires a worker thread");
const data = workerData;
function post(message) {
	port.postMessage(message, []);
}
try {
	const agent = Object.keys(process.env).some((key) => /^(?:https?|all)_proxy$/i.test(key) && process.env[key]) ? (await import("../../plugin-sdk/fetch-runtime.js")).createNodeProxyAgent({
		mode: "env",
		targetUrl: data.url
	}) : void 0;
	const socket = new WebSocket(data.url, {
		headers: data.options.headers,
		maxPayload: data.options.maxPayload,
		...agent ? { agent } : {}
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
