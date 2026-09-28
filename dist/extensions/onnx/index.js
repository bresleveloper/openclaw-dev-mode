import { n as findModel } from "./.setup/catalog-Bgbx4LHv.mjs";
import { n as createOnnxProvider, t as InferenceWorkerClient } from "./.setup/worker-client-BfBezMH8.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { Type } from "typebox";
//#region extensions/onnx/src/config.ts
const ConfigSchema = Type.Object({
	modelDir: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 4096
	})),
	threads: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 8,
		default: 2
	})),
	maxLoadedModels: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5,
		default: 2
	}))
}, { additionalProperties: false });
function resolveOnnxConfig(config, resolvePath) {
	const modelDir = config?.modelDir ?? path.join(resolveStateDir(), "models", "onnx");
	const threads = config?.threads ?? 2;
	const maxLoadedModels = config?.maxLoadedModels ?? 2;
	if (typeof modelDir !== "string" || !modelDir.trim() || typeof threads !== "number" || !Number.isInteger(threads) || threads < 1 || threads > 8 || typeof maxLoadedModels !== "number" || !Number.isInteger(maxLoadedModels) || maxLoadedModels < 1 || maxLoadedModels > 5) throw new Error("Invalid ONNX configuration; check modelDir, threads, and maxLoadedModels.");
	return {
		modelDir: path.resolve(resolvePath(modelDir)),
		threads,
		maxLoadedModels
	};
}
//#endregion
//#region extensions/onnx/index.ts
function selectedModels(config) {
	const selectors = [config.agents?.defaults?.decisionModel, ...Object.values(config.agents?.entries ?? {}).map((agent) => agent.decisionModel)];
	return [...new Set(selectors.flatMap((selector) => {
		if (typeof selector !== "string" || !selector.startsWith("onnx/")) return [];
		const id = selector.slice(5);
		return findModel(id) ? [id] : [];
	}))];
}
var onnx_default = definePluginEntry({
	id: "onnx",
	name: "ONNX",
	description: "Local typed decisions using ONNX classifiers",
	configSchema: { jsonSchema: { ...ConfigSchema } },
	register(api) {
		if (!api.runtimeSource) throw new Error("ONNX requires runtime entrypoint metadata from its OpenClaw host.");
		const workerUrl = new URL(`./src/inference.worker${path.extname(api.runtimeSource)}`, pathToFileURL(api.runtimeSource));
		const config = resolveOnnxConfig(api.pluginConfig, api.resolvePath);
		const client = new InferenceWorkerClient({
			workerUrl,
			config
		});
		api.registerDecisionProvider(createOnnxProvider(client, (message) => api.logger.warn(message)));
		api.registerService({
			id: "onnx-worker",
			async start(context) {
				const models = selectedModels(context.config).slice(0, config.maxLoadedModels);
				if (models.length === 0) return;
				try {
					await client.warm(models, AbortSignal.any([AbortSignal.timeout(12e4), ...api.lifecycle?.signal ? [api.lifecycle.signal] : []]));
				} catch {
					context.logger.warn("ONNX models are not ready. Run openclaw onnx models and verify/download the selected artifacts.");
				}
			},
			stop: () => client.stop()
		});
		api.lifecycle?.onDispose?.(() => client.stop());
		api.registerCli(async (context) => {
			const { registerOnnxCli } = await import("./.setup/cli-Ch_OkcD5.mjs");
			registerOnnxCli(context, config, workerUrl, api.resolvePath);
		}, { descriptors: [{
			name: "onnx",
			description: "Manage local ONNX decision models",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { onnx_default as default };
