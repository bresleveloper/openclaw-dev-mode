import { p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { r as buildCodexRuntimeModelParams } from "./harness-ChTbw0jP.mjs";
import { i as isCodexAppServerIndeterminateRequestCancellationError } from "./client-C7W0Bk1P.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DWBRnfHh.mjs";
import { j as retireSharedCodexAppServerClientIfCurrent } from "./auth-cache-key-DS0mnvrR.mjs";
import { a as withCodexAppServerJsonClient } from "./request-DaqFEDj8.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { r as captureSharedCodexAppServerCatalogLifetime } from "./shared-client-DhJ31S_8.mjs";
import { a as resolveCodexAppServerAuthProfileStore, r as resolveCodexAppServerAuthProfileId } from "./auth-profile-TZnVUd6M.mjs";
import { i as isCodexResponsesOAuthCredential } from "./responses-oauth-Cocl-M9v.mjs";
import { n as listAllCodexAppServerModels } from "./models-DDduIUKI.mjs";
import { probeCodexNativeAuth } from "./native-auth-Ci6Lt0Wf.mjs";
// extensions/codex/src/app-server/model-catalog.ts
const INPUT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document"
]);
function isModelInputType(value) {
	return INPUT_TYPES.has(value);
}
function codexAppServerModelsToCatalogEntries(models, runtime) {
	return models.map((model, providerOrder) => {
		const input = model.inputModalities.filter(isModelInputType);
		const runtimeParams = buildCodexRuntimeModelParams(model.id, model.model);
		return {
			provider: "openai",
			id: model.id,
			name: model.displayName ?? model.id,
			providerOrder,
			nativeRuntime: runtime,
			reasoning: model.supportedReasoningEfforts.length > 0,
			...input.length > 0 ? { input } : {},
			...runtimeParams ? { params: runtimeParams } : {},
			compat: {
				supportsReasoningEffort: model.supportedReasoningEfforts.length > 0,
				supportedReasoningEfforts: model.supportedReasoningEfforts
			}
		};
	});
}
/** One harness registration owns its observations; none travel with worker snapshots. */
function createCodexAppServerModelCatalog(runtime) {
	const scopes = /* @__PURE__ */ new WeakMap();
	const scopeKey = (params) => JSON.stringify([
		params.agentId,
		params.agentDir,
		params.workspaceDir
	]);
	let disposed = false;
	return {
		dispose() {
			disposed = true;
		},
		read(params, pluginConfig) {
			const observation = scopes.get(params.config)?.get(scopeKey(params));
			return !disposed && params.provider === "openai" && observation !== void 0 && observation.pluginConfig === pluginConfig && observation.models?.has(params.modelId) && observation.accountType && observation.isCurrent?.() ? {
				accountType: observation.accountType,
				...observation.authMode ? { authMode: observation.authMode } : {}
			} : void 0;
		},
		async load(params, pluginConfig) {
			if (disposed) return { entries: [] };
			let observations = scopes.get(params.config);
			if (!observations) {
				observations = /* @__PURE__ */ new Map();
				scopes.set(params.config, observations);
			}
			const key = scopeKey(params);
			const observation = { pluginConfig };
			observations.set(key, observation);
			const configured = readCodexPluginConfig(pluginConfig);
			const discovery = configured.discovery;
			if (discovery?.enabled === false) return { entries: [] };
			const options = resolveCodexAppServerRuntimeOptions({ pluginConfig: configured });
			const ownsLocalProcess = options.start.transport === "stdio" && !isCodexAppServerProxyLaunch(options.start.args);
			const authProfileStore = ownsLocalProcess && options.start.homeScope === "agent" ? await resolveCodexAppServerAuthProfileStore({
				agentDir: params.agentDir,
				config: params.config
			}) : void 0;
			const authProfileId = authProfileStore ? resolveCodexAppServerAuthProfileId({
				store: authProfileStore,
				config: params.config
			}) : void 0;
			if (isCodexResponsesOAuthCredential(authProfileStore?.profiles[authProfileId ?? ""])) return { entries: [] };
			const usesNativeHome = ownsLocalProcess && options.start.homeScope === "user";
			const native = usesNativeHome ? await probeCodexNativeAuth({ pluginConfig: configured }) : void 0;
			if (usesNativeHome && !native || disposed || observations.get(key) !== observation) return { entries: [] };
			const { start } = options;
			const timeoutMs = discovery?.timeoutMs ?? 1e4;
			const result = await withCodexAppServerJsonClient({
				startOptions: start,
				pluginConfig: configured,
				config: params.config,
				agentDir: params.agentDir,
				timeoutMs,
				...authProfileStore ? {
					authProfileStore,
					authProfileId
				} : {},
				...ownsLocalProcess && start.homeScope === "agent" && !authProfileId ? { authRequirement: "environment-api-key" } : {}
			}, async (request, client) => {
				try {
					await request({
						method: "account/read",
						requestParams: { refreshToken: false }
					});
					const isCurrent = captureSharedCodexAppServerCatalogLifetime(client);
					const models = (await listAllCodexAppServerModels({
						request,
						limit: 100,
						includeHidden: true
					})).models.filter((model) => !model.hidden || params.configuredModelRefs?.some((ref) => ref.provider === "openai" && ref.model === model.id));
					const account = await request({
						method: "account/read",
						requestParams: { refreshToken: false }
					});
					const observedType = account.account?.type;
					return {
						models,
						isCurrent,
						accountType: account.requiresOpenaiAuth ? observedType === "apiKey" || observedType === "chatgpt" ? observedType : void 0 : void 0
					};
				} catch (error) {
					if (isCodexAppServerIndeterminateRequestCancellationError(error)) retireSharedCodexAppServerClientIfCurrent(client);
					throw error;
				}
			});
			if (disposed || observations.get(key) !== observation || !result.isCurrent()) return { entries: [] };
			observation.models = new Set(result.models.map((model) => model.id));
			observation.accountType = !usesNativeHome || native?.mode === "api-key" && result.accountType === "apiKey" || (native?.mode === "oauth" || native?.mode === "token") && result.accountType === "chatgpt" ? result.accountType : void 0;
			observation.isCurrent = result.isCurrent;
			observation.authMode = observation.accountType === "apiKey" ? "api_key" : observation.accountType === "chatgpt" && (native?.mode === "oauth" || native?.mode === "token") ? native.mode : void 0;
			return {
				entries: codexAppServerModelsToCatalogEntries(result.models, runtime),
				outcomes: [{
					provider: "openai",
					status: observation.accountType ? "ready" : "unavailable",
					...observation.accountType ? { modelAccessPrograms: result.models.flatMap((model) => model.availableAccessPrograms ? [{
						modelId: model.id,
						runtimeId: runtime,
						cyber: model.availableAccessPrograms.cyber
					}] : []) } : {}
				}]
			};
		}
	};
}
export { createCodexAppServerModelCatalog };
