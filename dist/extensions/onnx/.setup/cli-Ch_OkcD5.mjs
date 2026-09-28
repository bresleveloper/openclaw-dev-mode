import { n as findModel, t as MODELS } from "./catalog-Bgbx4LHv.mjs";
import { n as createOnnxProvider, t as InferenceWorkerClient } from "./worker-client-BfBezMH8.mjs";
import { i as verifyModel, t as downloadModel } from "./artifacts-Du35Uk5d.mjs";
import path from "node:path";
//#region extensions/onnx/src/cli.ts
function registerOnnxCli({ program }, settings, workerUrl, resolvePath) {
	const root = program.command("onnx").description("Download, verify, and probe local ONNX decision models");
	const config = (options) => ({
		...settings,
		...options.modelDir === void 0 ? {} : { modelDir: path.resolve(resolvePath(options.modelDir)) }
	});
	const model = (id) => {
		const found = findModel(id);
		if (!found) throw new Error(`Unknown ONNX model '${id}'. Run openclaw onnx models.`);
		return found;
	};
	root.command("models").description("List supported classifiers and artifact sources").action(() => {
		console.log(JSON.stringify(MODELS.map((entry) => ({
			id: entry.id,
			name: entry.name,
			source: entry.source.kind,
			repository: entry.source.repository,
			revision: entry.source.revision,
			maxTokens: entry.maxTokens,
			downloadBytes: entry.source.kind === "hub" ? entry.source.files.reduce((sum, file) => sum + file.bytes, 0) : void 0
		})), null, 2));
	});
	root.command("download").argument("<model>").option("--model-dir <path>", "Override the model artifact directory").description("Download revision-pinned artifacts and verify their SHA256 hashes").action(async (id, options) => {
		const selected = model(id);
		const modelSettings = config(options);
		await downloadModel(modelSettings.modelDir, selected, AbortSignal.timeout(18e5));
		console.log(`Verified ${selected.id} in ${path.join(modelSettings.modelDir, selected.id)}`);
	});
	root.command("verify").argument("<model>").option("--model-dir <path>", "Override the model artifact directory").description("Verify model artifacts without loading native inference").action(async (id, options) => {
		await verifyModel(config(options).modelDir, model(id));
		console.log(`Verified ${id}`);
	});
	root.command("probe").argument("<model>").option("--model-dir <path>", "Override the model artifact directory").description("Run a fixed local Choice, Score, and Boolean smoke evaluation").action(async (id, options) => {
		model(id);
		const client = new InferenceWorkerClient({
			workerUrl,
			config: config(options)
		});
		try {
			const start = performance.now();
			await client.warm([id], AbortSignal.timeout(12e4));
			const warmed = performance.now();
			const timeoutMs = 3e4;
			const signal = AbortSignal.timeout(timeoutMs);
			const outcome = await createOnnxProvider(client, (message) => console.error(message)).evaluate({
				state: "I loved the quiet beach holiday and would happily go back.",
				questions: {
					topic: {
						type: "choice",
						criteria: {
							travel: "travel and holidays",
							finance: "finance and banking",
							science: "scientific research"
						}
					},
					sentiment: {
						type: "score",
						criteria: [
							"negative sentiment",
							"neutral sentiment",
							"positive sentiment"
						]
					},
					holiday: {
						type: "boolean",
						criteria: {
							true: "The text describes a holiday",
							false: "The text is unrelated to holidays"
						}
					}
				}
			}, {
				model: id,
				signal,
				deadlineMonotonicMs: warmed + timeoutMs
			});
			console.log(JSON.stringify({
				model: id,
				warmupMs: warmed - start,
				inferenceMs: performance.now() - warmed,
				outcome
			}, null, 2));
			if (outcome.status !== "ok") throw new Error(`ONNX probe failed: ${outcome.reason}`);
		} finally {
			await client.stop();
		}
	});
}
//#endregion
export { registerOnnxCli };
