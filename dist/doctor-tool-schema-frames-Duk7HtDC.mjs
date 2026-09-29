import { O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./defaults-BbU4k6fu.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-catalog-Bg5BjnVl.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-C3E7Txvc.mjs";
import { l as isUpdateDoctorLintPass } from "./update-phase-DiVB4MDN.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-CrvH3Equ.mjs";
//#region src/flows/doctor-tool-schema-frames.ts
function modelContextFinding(agentId, reason, deferred = false) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "warning",
		message: deferred ? `Agent ${agentId} model-specific tool schema inspection was deferred because its provider needs live model discovery.` : `Agent ${agentId} runtime tool schema inspection could not prepare its selected model context.`,
		errorCode: deferred ? "provider-dynamic-model-deferred" : "model-context-unavailable",
		path: `agents.${agentId}.model`,
		requirement: reason,
		fixHint: deferred ? "Use the model in an authenticated agent run to validate its tool schemas." : "Resolve the provider/model loading problem, then rerun doctor to validate model-specific tool schemas."
	};
}
function buildDoctorRuntimeModel(params) {
	const provider = params.provider || "openai";
	const id = params.modelId || "gpt-6-astra";
	const api = params.entry?.api ?? (provider === "openai" ? "openai-responses" : void 0);
	const baseUrl = params.entry?.baseUrl ?? (api === "openai-chatgpt-responses" ? "https://chatgpt.com/backend-api" : provider === "openai" ? "https://api.openai.com/v1" : void 0);
	return {
		...params.entry,
		provider,
		id,
		name: params.entry?.name ?? id,
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {}
	};
}
/** Prepare each agent's local facts before acquiring the operation's tool registrations. */
async function prepareDoctorToolSchemaFrames(cfg, options = {}) {
	const env = options.env ?? process.env;
	const standalone = options.mode !== void 0 && options.mode !== "lint" && !isUpdateDoctorLintPass(env);
	const frames = [];
	const findings = [];
	for (const agentId of listAgentIds(cfg)) {
		const agent = resolveAgentConfig(cfg, agentId);
		if (agent?.runtime?.type === "acp") continue;
		const agentDir = resolveAgentDir(cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId, env);
		const prepare = async () => {
			const modelRef = standalone ? resolveDoctorPrimaryModelRef(cfg, agent?.model) : resolveDefaultModelForAgent({
				cfg,
				agentId,
				allowPluginNormalization: true
			});
			let model;
			if (standalone) {
				const { resolveModelAsync } = await import("./model-BgdDNECx.mjs");
				const resolution = await resolveModelAsync(modelRef.provider, modelRef.model, agentDir, cfg, {
					modelIdSource: "selected",
					agentId,
					workspaceDir,
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					deferProviderDynamicModelPreparation: true
				});
				if (!resolution.model) {
					findings.push(modelContextFinding(agentId, resolution.error, Boolean(resolution.deferred)));
					return;
				}
				model = resolution.model;
			} else {
				const catalog = await readPreparedModelCatalog({
					config: cfg,
					agentId,
					agentDir,
					readOnly: true,
					providerDiscoveryProviderIds: []
				});
				model = buildDoctorRuntimeModel({
					entry: findModelInCatalog(catalog, modelRef.provider, modelRef.model),
					provider: modelRef.provider,
					modelId: modelRef.model
				});
			}
			if (!supportsModelTools(model)) return;
			const capabilityProfile = resolveConversationCapabilityProfile({
				config: cfg,
				agentId,
				agentDir,
				workspaceDir,
				modelProvider: modelRef.provider,
				modelId: modelRef.model,
				modelApi: model.api,
				modelContextWindowTokens: model.contextWindow
			});
			frames.push({
				agentId,
				agentDir,
				workspaceDir,
				modelRef,
				model,
				capabilityProfile
			});
		};
		try {
			if (options.runWithPluginMetadataSnapshot) await options.runWithPluginMetadataSnapshot({
				config: cfg,
				workspaceDir
			}, prepare);
			else await prepare();
		} catch (error) {
			findings.push(modelContextFinding(agentId, formatErrorMessage(error)));
		}
	}
	return {
		frames,
		findings
	};
}
//#endregion
export { prepareDoctorToolSchemaFrames };
