import { a as ConfigSchema, c as providerBaseUrl, i as translateTypeSafeDecisionBatch, l as runtimeConfig, s as hasCredentials } from "./.setup/decision-codec-BJkpuJSs.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { findNormalizedProviderValue } from "openclaw/plugin-sdk/model-ref-parse";
import { resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { getPreparedPluginSecretInput } from "openclaw/plugin-sdk/secret-input-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import { omitNullRequestHeaders } from "openclaw/plugin-sdk/provider-request-headers";
// extensions/typesafe/src/credentials.ts
/** Read the active host snapshot only; never resolve refs or discover fallback credentials. */
function resolveRuntimeConfig(snapshot) {
	const configured = snapshot.plugins?.entries?.typesafe?.config;
	const provider = findNormalizedProviderValue(snapshot.models?.providers, "typesafe");
	if (provider) {
		const { timeoutMs } = runtimeConfig({ timeoutMs: configured?.timeoutMs });
		const credential = resolveSecretInputString({
			value: provider.apiKey,
			defaults: snapshot.secrets?.defaults,
			path: "models.providers.typesafe.apiKey",
			mode: "inspect"
		});
		return {
			baseUrl: providerBaseUrl(provider.baseUrl),
			providerConfig: provider,
			apiKey: credential.value,
			credentialsUnavailable: credential.status === "configured_unavailable",
			timeoutMs: provider.timeoutSeconds === void 0 ? timeoutMs : provider.timeoutSeconds * 1e3
		};
	}
	const validated = runtimeConfig(configured);
	if (validated.baseUrl) return validated;
	const prepared = getPreparedPluginSecretInput("typesafe", "apiKey");
	return {
		...validated,
		apiKey: prepared.value
	};
}
// extensions/typesafe/openclaw.plugin.json
var modelCatalog = { "providers": { "typesafe": {
	"models": [
		{
			"id": "jev-latest",
			"name": "Jev",
			"baseUrl": "https://api.typesafe.ai/v1",
			"inference": {
				"chat": false,
				"decision": {
					"protocol": "typesafe-systemone",
					"input": ["text", "image"],
					"questions": {
						"boolean": {
							"probabilities": "boolean",
							"abstention": false
						},
						"choice": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 255
						},
						"score": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 10
						}
					},
					"reasoning": { "modes": ["auto"] },
					"confidence": "provider-specific",
					"limits": { "image": {
						"maxBytes": 4194304,
						"mimeTypes": ["image/png", "image/jpeg"],
						"remoteUrls": false
					} }
				}
			}
		},
		{
			"id": "jev-preview",
			"name": "Jev Preview",
			"baseUrl": "https://api.typesafe.ai/v1",
			"status": "preview",
			"inference": {
				"chat": false,
				"decision": {
					"protocol": "typesafe-systemone",
					"input": ["text", "image"],
					"questions": {
						"boolean": {
							"probabilities": "boolean",
							"abstention": false
						},
						"choice": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 255
						},
						"score": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 10
						}
					},
					"reasoning": { "modes": ["auto"] },
					"confidence": "provider-specific",
					"limits": { "image": {
						"maxBytes": 4194304,
						"mimeTypes": ["image/png", "image/jpeg"],
						"remoteUrls": false
					} }
				}
			}
		},
		{
			"id": "jev-1.13.0",
			"name": "Jev 1.13.0",
			"baseUrl": "https://api.typesafe.ai/v1",
			"inference": {
				"chat": false,
				"decision": {
					"protocol": "typesafe-systemone",
					"input": ["text", "image"],
					"questions": {
						"boolean": {
							"probabilities": "boolean",
							"abstention": false
						},
						"choice": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 255
						},
						"score": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 10
						}
					},
					"reasoning": { "modes": ["auto"] },
					"confidence": "provider-specific",
					"limits": {
						"image": {
							"maxBytes": 4194304,
							"mimeTypes": ["image/png", "image/jpeg"],
							"remoteUrls": false
						},
						"maxRequestTokens": 64e3,
						"maxStateAndQuestionTokens": 32e3
					},
					"billing": {
						"unit": "tokens",
						"source": "provider-docs",
						"usdPerMillion": {
							"input": .042,
							"output": 0
						}
					}
				}
			}
		},
		{
			"id": "kev-latest",
			"name": "Kev (local server)",
			"inference": {
				"chat": false,
				"decision": {
					"protocol": "typesafe-systemone",
					"input": ["text"],
					"questions": {
						"boolean": {
							"probabilities": "boolean",
							"abstention": false
						},
						"choice": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 255
						},
						"score": {
							"probabilities": "provider-defined",
							"abstention": false,
							"minOptions": 2,
							"maxOptions": 10
						}
					},
					"reasoning": { "modes": ["auto"] },
					"confidence": "provider-specific"
				}
			}
		}
	],
	"authScope": "plugin"
} } };
// extensions/typesafe/src/decisions.ts
const loadClient = createLazyRuntimeModule(() => import("./.setup/client-S5DvfIJa.mjs"));
const models = modelCatalog.providers.typesafe.models;
const hostedBaseUrl = providerBaseUrl(models[0].baseUrl);
function effectiveBaseUrl(config) {
	return config.providerConfig ? providerBaseUrl(config.providerConfig.baseUrl) : config.baseUrl ? `${config.baseUrl}/v1` : hostedBaseUrl;
}
function bindHostedFacts(inference, id, config) {
	if (!models.find((model) => model.id === id)?.inference.decision || !inference.decision) return inference;
	const configured = config.providerConfig;
	const configuredModel = configured?.models.find((model) => model.id === id);
	const headers = (values) => Object.fromEntries(Object.entries(values ?? {}).flatMap(([name, value]) => {
		if (name.trim().toLowerCase() !== "typesafe-danger-zone-long-context") return [];
		const resolved = resolveSecretInputString({
			value,
			path: `models.providers.typesafe.headers.${name}`,
			mode: "inspect"
		});
		const header = resolved.status === "configured_unavailable" ? "unavailable" : resolved.value;
		return header === void 0 ? [] : [[name, header]];
	}));
	const mergedHeaders = resolveProviderRequestHeaders({
		provider: "typesafe",
		baseUrl: effectiveBaseUrl(config),
		defaultHeaders: headers(configured?.headers),
		callerHeaders: headers(configuredModel?.headers),
		precedence: "caller-wins"
	});
	const effectiveHeaders = resolveProviderRequestHeaders({
		provider: "typesafe",
		baseUrl: effectiveBaseUrl(config),
		defaultHeaders: mergedHeaders,
		request: {
			headers: headers(configured?.request?.headers),
			...configured?.request?.auth?.mode === "header" && configured.request.auth.headerName.trim().toLowerCase() === "typesafe-danger-zone-long-context" ? { auth: {
				...configured.request.auth,
				value: resolveSecretInputString({
					value: configured.request.auth.value,
					path: "models.providers.typesafe.request.auth.value",
					mode: "inspect"
				}).value ?? "unavailable"
			} } : {}
		}
	});
	const hosted = effectiveBaseUrl(config) === hostedBaseUrl;
	const contextHeader = new Headers(omitNullRequestHeaders(effectiveHeaders)).get("TypeSafe-Danger-Zone-Long-Context");
	if (hosted && contextHeader !== "true" && contextHeader !== "unavailable") return inference;
	const { billing, limits, ...decision } = inference.decision;
	const { maxRequestTokens: _maxRequestTokens, maxStateAndQuestionTokens: _maxStateAndQuestionTokens, image, ...otherLimits } = limits ?? {};
	return {
		...inference,
		decision: {
			...decision,
			...!hosted ? { input: decision.input.filter((kind) => kind !== "image") } : {},
			...billing && (hosted || billing.source !== "provider-docs") ? { billing } : {},
			...Object.keys(otherLimits).length || hosted && image ? { limits: {
				...otherLimits,
				...hosted && image ? { image } : {}
			} } : {}
		}
	};
}
/** The shared provider owns the same credential and full configured route as V1. */
function createPreparedDecisionProvider(getConfig) {
	const common = models[0].inference.decision;
	const inference = {
		chat: false,
		decision: {
			protocol: "typesafe-systemone",
			input: ["text"],
			questions: {
				boolean: {
					probabilities: "boolean",
					abstention: false
				},
				choice: {
					probabilities: "provider-defined",
					abstention: false,
					minOptions: common.questions.choice.minOptions,
					maxOptions: common.questions.choice.maxOptions
				},
				score: {
					probabilities: "provider-defined",
					abstention: false,
					minOptions: common.questions.score.minOptions,
					maxOptions: common.questions.score.maxOptions
				}
			},
			confidence: "provider-specific",
			reasoning: { modes: ["auto"] }
		}
	};
	return {
		id: "typesafe",
		contractVersion: 2,
		provider: {
			label: "TypeSafe AI",
			auth: [],
			authScope: "plugin",
			resolveSyntheticAuth: () => {
				const config = getConfig();
				if (!hasCredentials(config)) return;
				return {
					apiKey: config.apiKey || "typesafe-local",
					source: "typesafe plugin",
					mode: "api-key"
				};
			},
			normalizeTransport: ({ provider }) => {
				if (provider !== "typesafe") return;
				return { baseUrl: effectiveBaseUrl(getConfig()) };
			},
			augmentModelCatalog: ({ entries }) => entries.filter((entry) => entry.provider === "typesafe").map((entry) => Object.assign({}, entry, { inference: bindHostedFacts(entry.inference?.decision && entry.inference.decision.protocol !== "decision-v1" ? entry.inference : inference, entry.id, getConfig()) }))
		},
		async evaluate(batch, context) {
			const request = translateTypeSafeDecisionBatch(batch);
			if (!request || context.reasoning !== void 0 && context.reasoning !== "auto") return {
				status: "unavailable",
				reason: "unsupported-input"
			};
			if (request.assets && !models.some((model) => model.id === context.model.id && model.inference.decision.input.includes("image"))) return {
				status: "unavailable",
				reason: "unsupported-input"
			};
			context.signal.throwIfAborted();
			const { evaluateTypeSafeDecision } = await loadClient();
			context.signal.throwIfAborted();
			const config = getConfig();
			if (!hasCredentials(config)) return {
				status: "unavailable",
				reason: "credentials-unavailable"
			};
			return evaluateTypeSafeDecision(request.batch, request.assets, context, config);
		}
	};
}
// extensions/typesafe/index.ts
var typesafe_default = definePluginEntry({
	id: "typesafe",
	name: "TypeSafe AI",
	description: "Typed decision provider for hosted Jev and local System One models.",
	configSchema: { jsonSchema: { ...ConfigSchema } },
	register(api) {
		api.registerDecisionProvider(createPreparedDecisionProvider(() => resolveRuntimeConfig(api.runtime.config.current())));
	}
});
export { typesafe_default as default };
