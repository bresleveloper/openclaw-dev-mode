import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import "./model-catalog-vYmFg90_.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-LJfAZzNH.mjs";
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
				const { resolveModelAsync } = await import("./model-BwGE780O.mjs");
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
				const entry = findModelInCatalog(catalog, modelRef.provider, modelRef.model);
				const provider = modelRef.provider || "openai";
				const id = modelRef.model || "gpt-6-astra";
				const api = entry?.api ?? (provider === "openai" ? "openai-responses" : void 0);
				const baseUrl = entry?.baseUrl ?? (api === "openai-chatgpt-responses" ? "https://chatgpt.com/backend-api" : provider === "openai" ? "https://api.openai.com/v1" : void 0);
				model = {
					...entry,
					provider,
					id,
					name: entry?.name ?? id,
					...api ? { api } : {},
					...baseUrl ? { baseUrl } : {}
				};
			}
			if (!supportsModelTools(model)) return;
			const capabilityProfile = resolveConversationCapabilityProfile({
				config: cfg,
				agentId,
				workspaceDir,
				modelProvider: modelRef.provider,
				modelId: modelRef.model
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
