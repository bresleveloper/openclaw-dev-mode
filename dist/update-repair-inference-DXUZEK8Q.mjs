import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, d as resolveAmbientOwnerAgentId, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { n as loadManifestModelCatalog } from "./model-catalog-Dt2JkTIv.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-BSynTdAu.mjs";
import { a as hasAvailableAuthForProvider } from "./model-auth-D3hh0-wa.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-NQwHPvez.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { i as resolveSystemAgentConfiguredRouteFromConfig } from "./inference-route-BGQ51WRL.mjs";
import { o as runSetupInferenceTurn } from "./setup-inference-turn-Dwchx-pp.mjs";
import { t as verifySystemAgentInferenceWithFallback } from "./inference-fallback-D7br4f10.mjs";
//#region src/infra/update-repair-inference.ts
async function selectUpdateRepairInference(params) {
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	const deadline = Date.now() + params.timeoutMs;
	const timeout = setTimeout(() => controller.abort(), params.timeoutMs);
	const chains = /* @__PURE__ */ new Map();
	const eligibility = /* @__PURE__ */ new Map();
	try {
		signal.throwIfAborted();
		const owner = resolveAmbientOwnerAgentId(params.config);
		const configuredEntries = listAgentEntries(params.config);
		const catalog = loadManifestModelCatalog({ config: params.config });
		const accept = async (route) => {
			signal.throwIfAborted();
			const cached = eligibility.get(route);
			if (cached !== void 0) return cached;
			const model = findModelInCatalog(catalog, route.provider, route.model);
			const configuredModel = params.config.models?.providers?.[route.provider]?.models.find((entry) => entry.id === route.model);
			if (route.runner !== "embedded" || !supportsModelTools(model ?? {}) || !supportsModelTools(configuredModel ?? {})) {
				eligibility.set(route, false);
				return false;
			}
			const auth = {
				provider: route.provider,
				cfg: route.runConfig,
				agentDir: route.agentDir,
				modelId: route.model,
				modelApi: configuredModel?.api ?? model?.api
			};
			let accepted;
			try {
				accepted = route.authProfileId ? Boolean(await resolveApiKeyForProviderCore({
					...auth,
					profileId: route.authProfileId,
					lockedProfile: true,
					allowAuthProfileFallback: false,
					modelBaseUrl: params.config.models?.providers?.[route.provider]?.baseUrl ?? model?.baseUrl
				})) : await hasAvailableAuthForProvider(auth);
			} catch {
				accepted = false;
			}
			signal.throwIfAborted();
			eligibility.set(route, accepted);
			return accepted;
		};
		const selected = await verifySystemAgentInferenceWithFallback({
			requestingAgentId: owner,
			runtime: params.runtime,
			deps: { readConfig: async () => params.config },
			routePolicy: {
				expand: async (base) => {
					const primaryProvider = base.modelLabel.slice(0, base.modelLabel.indexOf("/"));
					const candidates = resolveModelCandidateChain({
						cfg: params.config,
						agentId: base.agentId,
						provider: primaryProvider,
						model: base.model,
						requestedRouteResolution: "resolved"
					});
					const routes = [];
					for (const candidate of candidates) {
						signal.throwIfAborted();
						const primaryProfile = candidate.provider === primaryProvider && candidate.model === base.model ? base.authProfileId : void 0;
						const modelKey = `${candidate.provider}/${candidate.model}`;
						const modelRef = `${modelKey}${primaryProfile ? `@${primaryProfile}` : ""}`;
						const entries = (configuredEntries.length ? configuredEntries : [{ id: base.agentId }]).map((entry) => normalizeAgentId(entry.id) === base.agentId ? Object.assign({}, entry, {
							model: {
								primary: modelRef,
								fallbacks: []
							},
							models: {
								...entry.models,
								[modelKey]: {
									...entry.models?.[modelKey],
									agentRuntime: { id: "openclaw" }
								}
							}
						}) : entry);
						const runConfig = {
							...params.config,
							agents: {
								...params.config.agents,
								defaults: {
									...params.config.agents?.defaults,
									model: {
										primary: modelRef,
										fallbacks: []
									}
								},
								entries: toAgentEntriesRecord(entries)
							}
						};
						const route = await resolveSystemAgentConfiguredRouteFromConfig(runConfig, base.agentId);
						if (route) routes.push(route);
					}
					chains.set(base.agentId, routes);
					return routes;
				},
				accept,
				verify: async (route) => {
					signal.throwIfAborted();
					const result = await runSetupInferenceTurn({
						route,
						deps: { timeoutMs: Math.max(1, deadline - Date.now()) },
						requireExecutionOwner: false,
						signal,
						runtime: params.runtime
					});
					signal.throwIfAborted();
					return result.ok ? {
						ok: true,
						modelRef: route.modelLabel,
						latencyMs: result.latencyMs
					} : result;
				}
			}
		});
		if (!selected.ok || selected.route.runner !== "embedded") return {
			ok: false,
			reason: selected.ok ? "No local, tool-capable inference route is available." : selected.error
		};
		const chain = chains.get(selected.route.agentId) ?? [];
		const modelFallbacks = [];
		for (const route of chain.slice(chain.indexOf(selected.route) + 1)) if (await accept(route)) modelFallbacks.push(route.modelLabel);
		return {
			ok: true,
			route: selected.route,
			modelFallbacks
		};
	} catch {
		return {
			ok: false,
			reason: signal.aborted ? "Inference selection was aborted or exhausted the repair wall-clock budget." : "No usable, authenticated, tool-capable inference route could be verified. Check model setup."
		};
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
export { selectUpdateRepairInference };
