import { t as buildCodexRuntimeModelParams } from "./model-runtime-BdqzOMkU.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { D as retireSharedCodexAppServerClientIfCurrent } from "./auth-cache-key-aTVcxfbh.mjs";
import { a as withCodexAppServerJsonClient } from "./request-i8njrYRU.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { a as resolveCodexAppServerAuthProfileStore, r as resolveCodexAppServerAuthProfileId } from "./auth-profile-auwzSwwy.mjs";
import { n as captureSharedCodexAppServerCatalogLifetime } from "./shared-client-BEHXwqz5.mjs";
import { i as isCodexResponsesOAuthCredential } from "./responses-oauth-CCV7aVYF.mjs";
import { i as isCodexAppServerIndeterminateRequestCancellationError } from "./client-CKexde4_.mjs";
import { n as listAllCodexAppServerModels } from "./models-DnBclhxY.mjs";
import { probeCodexNativeAuth } from "./native-auth-llyxY8vN.mjs";
//#region extensions/codex/src/app-server/model-catalog.ts
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
			const discovery = readCodexPluginConfig(pluginConfig).discovery;
			if (discovery?.enabled === false) return { entries: [] };
			const options = resolveCodexAppServerRuntimeOptions({ pluginConfig });
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
			const native = usesNativeHome ? await probeCodexNativeAuth({ pluginConfig }) : void 0;
			if (usesNativeHome && !native || disposed || observations.get(key) !== observation) return { entries: [] };
			const { start } = options;
			const timeoutMs = discovery?.timeoutMs ?? 1e4;
			const result = await withCodexAppServerJsonClient({
				startOptions: start,
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
					status: observation.accountType ? "ready" : "unavailable"
				}]
			};
		}
	};
}
//#endregion
export { createCodexAppServerModelCatalog };
