import { n as UnsupportedInputError, t as OnnxWorkerError } from "../.setup/protocol-CG1ILdRP.mjs";
// extensions/onnx/src/inference.worker.ts
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
function onMessage(request) {
	if (stopping) return;
	if (request.kind === "init") {
		config = request.config;
		return;
	}
	activeTask = handle(request);
	activeTask.catch(() => stop(1)).finally(() => {
		activeTask = void 0;
	});
}
process.on("disconnect", () => stop(0));
process.on("message", onMessage);
async function handle(request) {
	try {
		if (!cache) {
			let implementation;
			try {
				implementation = await import("../.setup/model-loader-DDsav9p5.mjs");
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
			send({ kind: "warmed" });
		} else {
			const model = await cache.get(request.model);
			const results = [];
			for (const input of request.inputs) {
				if (stopping) return;
				results.push(await model.classify(input));
			}
			send({
				kind: "results",
				results
			});
		}
	} catch (error) {
		send({
			kind: "error",
			code: error instanceof UnsupportedInputError ? "unsupported-input" : error instanceof OnnxWorkerError ? error.code : "runtime"
		});
	}
}
export {};
