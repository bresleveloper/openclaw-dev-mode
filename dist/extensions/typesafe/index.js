import { i as ConfigSchema, n as decisionFailure, o as runtimeConfig } from "./.setup/errors-BZeWj5nc.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { getPreparedPluginSecretInput } from "openclaw/plugin-sdk/secret-input-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/typesafe/src/credentials.ts
/** Only host-prepared capability snapshots may supply a credential. Never resolve or cache refs. */
function resolveRuntimeConfig(snapshot) {
	const configured = snapshot.plugins?.entries?.typesafe?.config;
	const validated = runtimeConfig(configured);
	if (validated.baseUrl) return validated;
	const prepared = getPreparedPluginSecretInput("typesafe", "apiKey");
	return {
		...validated,
		apiKey: prepared.value
	};
}
//#endregion
//#region extensions/typesafe/src/decisions.ts
const loadClient = createLazyRuntimeModule(() => import("./.setup/client-vvIolGjJ.mjs"));
/** Translate the host-selected decision contract through the TypeSafe transport. */
function createDecisionProvider(getConfig) {
	return {
		id: "typesafe",
		contractVersion: 1,
		isReady: () => {
			const config = getConfig();
			return Boolean(config.baseUrl || config.apiKey);
		},
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			const { evaluate: evaluateTypeSafe } = await loadClient();
			context.signal.throwIfAborted();
			const config = getConfig();
			if (!config.baseUrl && !config.apiKey) return {
				status: "unavailable",
				reason: "credentials-unavailable"
			};
			const remaining = context.deadlineMonotonicMs - performance.now();
			if (remaining <= 0) return {
				status: "unavailable",
				reason: "transport"
			};
			const questions = Object.fromEntries(Object.entries(batch.questions).map(([id, q]) => [id, q.type === "boolean" ? {
				...q,
				type: "noul"
			} : q]));
			try {
				const { evaluation } = await evaluateTypeSafe({
					state: batch.state,
					questions,
					model: context.model
				}, {
					...config,
					timeoutMs: Math.min(config.timeoutMs, remaining)
				}, context.signal, context.deadlineMonotonicMs, context.isAdmissible);
				context.signal.throwIfAborted();
				const answers = {};
				for (const [id, answer] of Object.entries(evaluation.answers)) if (answer.type === "noul") answers[id] = {
					type: "boolean",
					probabilityTrue: answer.noul
				};
				else if (answer.type === "choice") answers[id] = answer;
				else {
					const question = batch.questions[id];
					if (!question || question.type !== "score") return {
						status: "unavailable",
						reason: "invalid-response"
					};
					answers[id] = {
						type: "score",
						score: answer.score,
						confidence: answer.confidence,
						probabilities: question.criteria.map((_level, i) => answer.probabilities[String(i)])
					};
				}
				return {
					status: "ok",
					result: {
						model: evaluation.model,
						answers,
						usage: {
							inputTokens: evaluation.usage.input_tokens,
							outputTokens: evaluation.usage.output_tokens
						}
					}
				};
			} catch (error) {
				context.signal.throwIfAborted();
				return decisionFailure(error);
			}
		}
	};
}
//#endregion
//#region extensions/typesafe/index.ts
var typesafe_default = definePluginEntry({
	id: "typesafe",
	name: "TypeSafe AI",
	description: "Typed decision provider for hosted Jev and local System One models.",
	configSchema: { jsonSchema: { ...ConfigSchema } },
	register(api) {
		api.registerDecisionProvider(createDecisionProvider(() => resolveRuntimeConfig(api.runtime.config.current())));
	}
});
//#endregion
export { typesafe_default as default };
