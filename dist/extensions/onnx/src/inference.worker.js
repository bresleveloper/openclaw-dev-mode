import { i as UnsupportedInputError, r as parseWorkerRequest, t as OnnxWorkerError } from "../.setup/protocol-lN8zQ8J3.mjs";
//#region extensions/onnx/src/inference.worker.ts
let config;
let cache;
let stopping = false;
let finalExitCode = 0;
let activeTask;
function stop(code) {
	if (code !== 0) finalExitCode = code;
	if (stopping) return;
	stopping = true;
	process.off("message", onMessage);
	Promise.resolve(activeTask).catch(() => void 0).then(() => cache?.close()).catch(() => {
		finalExitCode = 1;
	}).finally(() => {
		if (process.connected && typeof process.disconnect === "function") process.disconnect();
		process.exitCode = finalExitCode;
	});
}
function send(reply) {
	if (stopping) return;
	if (!process.connected || !process.send) {
		stop(1);
		return;
	}
	process.send(reply, (error) => {
		if (error) stop(1);
	});
}
function onMessage(value) {
	if (stopping) return;
	if (activeTask) {
		stop(1);
		return;
	}
	activeTask = handle(value);
	activeTask.catch(() => stop(1)).finally(() => {
		activeTask = void 0;
	});
}
process.on("disconnect", () => stop(0));
process.on("message", onMessage);
async function handle(value) {
	const request = parseWorkerRequest(value);
	if (request.kind === "init") {
		if (config) throw new Error("Already initialized");
		config = request.config;
		send({ kind: "ready" });
		return;
	}
	if (!config) throw new Error("Invalid worker admission");
	try {
		if (!cache) {
			let implementation;
			try {
				implementation = await import("../.setup/model-loader-C6GHyZWy.mjs");
			} catch {
				throw new OnnxWorkerError("dependency-unavailable");
			}
			cache = new implementation.ModelCache(config);
		}
		if (request.kind === "warm") {
			for (const model of request.models) {
				if (stopping) return;
				await cache.get(model);
			}
			send({
				kind: "warmed",
				id: request.id
			});
		} else {
			const model = await cache.get(request.model);
			const results = [];
			for (const input of request.inputs) {
				if (stopping) return;
				results.push(await model.classify(input));
			}
			send({
				kind: "results",
				id: request.id,
				results
			});
		}
	} catch (error) {
		send({
			kind: "error",
			id: request.id,
			code: error instanceof UnsupportedInputError ? "unsupported-input" : error instanceof OnnxWorkerError ? error.code : "runtime"
		});
	}
}
//#endregion
export {};
