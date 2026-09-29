import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { A as tryResolveDefaultAgentId, O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as defaultSlotIdForKey } from "./slots-D4OMSTbt.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as listProviderPolicyOwners } from "./provider-policy-owners-CS5yTO36.mjs";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import "./legacy-config-migrations.runtime.models-BvDaSkAf.mjs";
import { u as resolveRememberAcrossConversations } from "./legacy-2ovrASa7.mjs";
import { t as loadProviderPolicyArtifacts } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { n as hasAuthProfileStoreSourceForProvider, t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { M as resolveUsableCustomProviderApiKey } from "./loader-runtime-load-XbrcYJWd.mjs";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import { t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-BQhYF772.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-Atb7OdLd.mjs";
import "./model-auth-CCIBdEPk.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as resolveMemorySearchConfig } from "./memory-search-Dqa3SQYk.mjs";
import { a as getActiveMemorySearchManagerCore, s as resolveActiveMemoryBackendConfig } from "./memory-runtime-CtPYkvwg.mjs";
import { t as hasConfiguredMemorySecretInput } from "./secret-input-BnUd_lfW.mjs";
import "./secret-4LRdvu7i.mjs";
import { i as getMissingLocalMemoryEmbeddingProviderMessage, n as auditShortTermPromotionArtifacts, o as repairDreamingArtifacts, s as repairShortTermPromotionArtifacts, t as auditDreamingArtifacts } from "./memory-core-bundled-runtime-DyDEJ3bQ.mjs";
import { i as maybeRepairWorkspaceMemoryHealth, o as noteWorkspaceMemoryHealth } from "./doctor-workspace-CgPlo3YE.mjs";
import fs from "node:fs";
//#region src/commands/doctor-memory-search-local.ts
function formatLocalRuntimeDoctorNote(facts) {
	const backend = facts.backend ?? "unknown";
	const build = facts.buildInfo ? `, ${facts.buildInfo}` : "";
	const model = facts.model?.id ? `\nModel: ${facts.model.id}${facts.model.path ? ` (${facts.model.path})` : ""}` : "";
	const capabilities = facts.capabilities ? `\nCapabilities: ${[facts.capabilities.vision ? "vision" : null, facts.capabilities.draft ? "draft" : null].filter(Boolean).join(", ") || "text only"}` : "";
	const endpoints = facts.endpoints ? `\nEndpoints: ${Object.entries(facts.endpoints).map(([name, status]) => `${name}=${status}`).join(" ")}` : "";
	const loadError = facts.loadError ? `\nLoad error: ${facts.loadError}` : "";
	return `llama.cpp server: ${backend}${build}${facts.state === "ready" ? "" : ` (${facts.state})`}${model}${capabilities}${endpoints}${loadError}`;
}
function resolveLocalProviderPolicyBlockGuidance(reason, pluginId) {
	switch (reason) {
		case "plugins-disabled": return {
			message: "Plugin loading is disabled for this config.",
			fix: `Fix: ${formatCliCommand("openclaw config set plugins.enabled true --strict-json")}, or select another memory provider.`
		};
		case "blocked-by-denylist": return {
			message: `Installed plugin "${pluginId}" is blocked by plugins.deny.`,
			fix: `Fix: Remove "${pluginId}" from plugins.deny, or select another memory provider.`
		};
		case "plugin-disabled": return {
			message: `Installed plugin "${pluginId}" is disabled for this config.`,
			fix: `Fix: Enable it: ${formatCliCommand(`openclaw plugins enable ${pluginId} --accept-capabilities`)}, or select another memory provider.`
		};
		case "not-in-allowlist": return {
			message: `Installed plugin "${pluginId}" is omitted from plugins.allow.`,
			fix: `Fix: Include "${pluginId}" in plugins.allow, or select another memory provider.`
		};
	}
	return reason;
}
//#endregion
//#region src/commands/doctor-memory-search.ts
function resolveMemoryDoctorAgentScopes(cfg) {
	return listAgentIds(cfg).map((agentId) => ({
		agentId,
		agentDir: resolveAgentDir(cfg, agentId),
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
}
function formatAgentMessage(agentId, labelAgent, message) {
	return `${labelAgent ? `Agent "${agentId}": ` : ""}${message}`;
}
const MEMORY_EMBEDDING_PROVIDER_AUTH_IDS = /* @__PURE__ */ new Map([
	["github-copilot", "github-copilot"],
	["openai", "openai"],
	["gemini", "google"],
	["voyage", "voyage"],
	["mistral", "mistral"],
	["bedrock", "amazon-bedrock"]
]);
const OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
function hasConfiguredAwsSdkAuthForProvider(provider, cfg) {
	if (findNormalizedProviderValue(cfg.models?.providers, provider)?.auth === "aws-sdk") return true;
	return (findNormalizedProviderValue(cfg.auth?.order, provider) ?? (cfg.auth?.profiles ? Object.keys(cfg.auth.profiles) : [])).some((profileId) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg,
		provider,
		profileId
	}));
}
function isOpenAICompatibleMemoryProvider(providerId, cfg) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (normalizedProviderId === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER) return true;
	if (MEMORY_EMBEDDING_PROVIDER_AUTH_IDS.has(normalizedProviderId)) return false;
	const providerConfig = findNormalizedProviderValue(cfg.models?.providers, providerId);
	if (!providerConfig) return false;
	const api = normalizeProviderId(providerConfig.api ?? "");
	if (api === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER || OPENAI_COMPATIBLE_MODEL_APIS.has(api)) return true;
	return !api && Boolean(normalizeOptionalString(providerConfig.baseUrl));
}
function resolveOpenAICompatibleMemoryBaseUrl(providerId, cfg, remoteBaseUrl) {
	return normalizeOptionalString(remoteBaseUrl) ?? normalizeOptionalString(findNormalizedProviderValue(cfg.models?.providers, providerId)?.baseUrl);
}
function isKeyOptionalMemoryProvider(providerId, cfg) {
	return providerId === "local" || providerId === "ollama" || providerId === "lmstudio" || isOpenAICompatibleMemoryProvider(providerId, cfg);
}
async function resolveRuntimeMemoryAuditContext(cfg, agentId) {
	const manager = (await getActiveMemorySearchManagerCore({
		cfg,
		agentId,
		purpose: "status"
	})).manager;
	if (!manager) return null;
	try {
		return { workspaceDir: manager.status().workspaceDir?.trim() };
	} finally {
		await manager.close?.().catch(() => void 0);
	}
}
function buildMemoryRecallIssueNote(audit) {
	if (audit.issues.length === 0) return null;
	const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
	const guidance = audit.issues.some((issue) => issue.fixable) ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}` : `Verify: ${formatCliCommand("openclaw memory status --deep")}`;
	return [
		"Memory recall artifacts need attention:",
		...issueLines,
		`Recall store: ${audit.storePath}`,
		guidance
	].join("\n");
}
function buildDreamingArtifactIssueNote(audit) {
	if (audit.issues.length === 0) return null;
	const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
	const hasFixableIssue = audit.issues.some((issue) => issue.fixable);
	return [
		"Dreaming artifacts need attention:",
		...issueLines,
		`Dream corpus: ${audit.sessionCorpusDir}`,
		hasFixableIssue ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}` : `Verify: ${formatCliCommand("openclaw memory status --deep")}`
	].join("\n");
}
async function noteMemoryRecallHealth(cfg) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const labelAgents = scopes.length > 1;
	const dreaming = resolveMemoryDreamingConfig({
		cfg,
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg)
	});
	for (const scope of scopes) try {
		const workspaceDir = (await resolveRuntimeMemoryAuditContext(cfg, scope.agentId))?.workspaceDir?.trim();
		if (!workspaceDir) continue;
		const message = buildMemoryRecallIssueNote(await auditShortTermPromotionArtifacts({ workspaceDir }));
		if (message) note(formatAgentMessage(scope.agentId, labelAgents, message), "Memory search");
		const dreamingMessage = buildDreamingArtifactIssueNote(await auditDreamingArtifacts({ workspaceDir }));
		if (dreamingMessage) note(formatAgentMessage(scope.agentId, labelAgents, dreamingMessage), "Memory search");
	} catch (err) {
		note(formatAgentMessage(scope.agentId, labelAgents, `Memory recall audit could not be completed: ${formatErrorMessage(err)}`), "Memory search");
	} finally {
		note(formatAgentMessage(scope.agentId, labelAgents, `Dreaming: ${dreaming.enabled ? "enabled" : "disabled"} (cadence ${dreaming.frequency}).`), "Memory search");
	}
}
async function maybeRepairMemoryRecallHealth(params) {
	const scopes = resolveMemoryDoctorAgentScopes(params.cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		await maybeRepairWorkspaceMemoryHealth({
			...params,
			scope: {
				agentId: scope.agentId,
				workspaceDir: scope.workspaceDir,
				labelAgent: labelAgents
			}
		});
		try {
			const workspaceDir = (await resolveRuntimeMemoryAuditContext(params.cfg, scope.agentId))?.workspaceDir?.trim();
			if (!workspaceDir) continue;
			if ((await auditShortTermPromotionArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) {
				if (await params.prompter.confirmRuntimeRepair({
					message: formatAgentMessage(scope.agentId, labelAgents, "Remove dangling memory recalls, normalize recall artifacts, and remove stale promotion locks?"),
					initialValue: true
				})) {
					const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
					if (repair.changed) {
						const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
						const details = [
							repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid entries` : null,
							(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling entries` : null,
							removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow entries` : null
						].filter(Boolean).join(", ");
						const lines = [
							"Memory recall artifacts repaired:",
							repair.rewroteStore ? `- rewrote recall store${details ? ` (${details})` : ""}` : null,
							repair.removedStaleLock ? "- removed stale promotion lock" : null,
							`Verify: ${formatCliCommand("openclaw memory status --deep")}`
						].filter(Boolean);
						note(formatAgentMessage(scope.agentId, labelAgents, lines.join("\n")), "Doctor changes");
					}
				}
			}
			if (!(await auditDreamingArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) continue;
			if (!await params.prompter.confirmRuntimeRepair({
				message: formatAgentMessage(scope.agentId, labelAgents, "Archive contaminated dreaming artifacts and reset derived dream corpus state?"),
				initialValue: true
			})) continue;
			const dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
			if (!dreamingRepair.changed) continue;
			const lines = [
				"Dreaming artifacts repaired:",
				dreamingRepair.archivedSessionCorpus ? "- archived session corpus" : null,
				dreamingRepair.archivedSessionIngestion ? "- archived session-ingestion state" : null,
				dreamingRepair.archivedDreamsDiary ? "- archived dream diary" : null,
				dreamingRepair.archiveDir ? `- archive dir: ${dreamingRepair.archiveDir}` : null,
				...dreamingRepair.warnings.map((warning) => `- warning: ${warning}`),
				`Verify: ${formatCliCommand("openclaw memory status --deep")}`
			].filter(Boolean);
			note(formatAgentMessage(scope.agentId, labelAgents, lines.join("\n")), "Doctor changes");
		} catch (err) {
			note(formatAgentMessage(scope.agentId, labelAgents, `Memory artifact repair could not be completed: ${formatErrorMessage(err)}`), "Memory search");
		}
	}
}
function hasActiveAlternateMemoryPluginSlot(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled) return false;
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || memorySlot.length === 0) return false;
	if (memorySlot === defaultSlotIdForKey("memory")) return false;
	if (plugins.deny.includes(memorySlot)) return false;
	if (!Object.hasOwn(plugins.entries, memorySlot)) return false;
	const entry = plugins.entries[memorySlot];
	if (!entry || entry.enabled === false) return false;
	return entry.enabled === true || entry.config !== void 0;
}
function isActiveMemoryPluginAvailable(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled || plugins.deny.includes("active-memory")) return false;
	if (plugins.allow.length > 0 && !plugins.allow.includes("active-memory")) return false;
	const entry = plugins.entries["active-memory"];
	if (entry?.enabled === false) return false;
	return (isRecord(entry?.config) ? entry.config : void 0)?.enabled !== false;
}
function resolveActiveMemoryConversationRecallSupport(cfg) {
	const providerSupported = normalizePluginsConfig(cfg.plugins).slots.memory === defaultSlotIdForKey("memory");
	const entry = cfg.plugins?.entries?.["active-memory"];
	const config = isRecord(entry?.config) ? entry.config : void 0;
	if (!Array.isArray(config?.toolsAllow)) return {
		providerSupported,
		memorySearchAllowed: true
	};
	return {
		providerSupported,
		memorySearchAllowed: config.toolsAllow.some((toolName) => typeof toolName === "string" && toolName.trim().toLowerCase() === "memory_search")
	};
}
function noteRememberAcrossConversationsHealth(params) {
	if (!resolveRememberAcrossConversations(params.cfg, params.agentId)) return { enabled: false };
	const activeMemoryAvailable = isActiveMemoryPluginAvailable(params.cfg);
	const conversationRecallSupport = resolveActiveMemoryConversationRecallSupport(params.cfg);
	if (!activeMemoryAvailable) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the Active Memory plugin is disabled. Enable the plugin or set memory.search.rememberAcrossConversations to false.`, "Memory search");
	if (activeMemoryAvailable && !conversationRecallSupport.providerSupported) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the current memory provider does not support protected private transcript recall. Set memory.search.rememberAcrossConversations to false or use that provider's own recall path; advanced Active Memory can still use its recall tools.`, "Memory search");
	else if (activeMemoryAvailable && !conversationRecallSupport.memorySearchAllowed) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but Active Memory does not allow memory_search. Add memory_search to the plugin toolsAllow list or set memory.search.rememberAcrossConversations to false.`, "Memory search");
	return { enabled: true };
}
async function noteMemorySearchHealth(cfg, opts) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		if (opts?.includeWorkspaceMemoryHealth !== false) await noteWorkspaceMemoryHealth(cfg, {
			agentId: scope.agentId,
			workspaceDir: scope.workspaceDir,
			labelAgent: labelAgents
		});
		const outputNote = opts?.noteFn ?? note;
		const noteFn = (message, title) => outputNote(formatAgentMessage(scope.agentId, labelAgents, String(message)), title);
		await noteMemorySearchHealthForAgent(cfg, scope, {
			...opts,
			noteFn,
			includeWorkspaceMemoryHealth: false,
			gatewayMemoryProbe: scope.agentId === defaultAgentId || opts?.gatewayMemoryProbe?.skipped ? opts?.gatewayMemoryProbe : void 0
		});
	}
}
async function noteMemorySearchHealthForAgent(cfg, scope, opts) {
	const { agentId, agentDir } = scope;
	const noteFn = opts.noteFn ?? note;
	const resolved = resolveMemorySearchConfig(cfg, agentId);
	if (!resolved) {
		noteFn(noteRememberAcrossConversationsHealth({
			cfg,
			agentId,
			noteFn
		}).enabled ? `Remember across conversations is effectively enabled for agent "${agentId}", but memory search is disabled. Enable memory search or set memory.search.rememberAcrossConversations to false.` : "Memory search is explicitly disabled (enabled: false).", "Memory search");
		return;
	}
	const provider = resolved.provider;
	const normalizedPlugins = normalizePluginsConfig(cfg.plugins);
	if (provider === "local" && !normalizedPlugins.enabled) {
		const policyBlock = resolveLocalProviderPolicyBlockGuidance("plugins-disabled", provider);
		noteFn([
			policyBlock.message,
			"",
			policyBlock.fix,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	noteRememberAcrossConversationsHealth({
		cfg,
		agentId,
		noteFn
	});
	const hasRemoteApiKey = hasConfiguredMemorySecretInput(resolved.remote?.apiKey);
	if (!resolveActiveMemoryBackendConfig({
		cfg,
		agentId
	})) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (hasActiveAlternateMemoryPluginSlot(cfg)) return;
		noteFn("No active memory plugin is registered for the current config.", "Memory search");
		return;
	}
	if (provider === "none") return;
	if (provider === "local") {
		const runtimeFacts = opts?.gatewayMemoryProbe?.runtimeFacts;
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
			if (runtimeFacts) noteFn(formatLocalRuntimeDoctorNote(runtimeFacts), "Memory search");
			return;
		}
		const hasExplicitLocalModel = hasLocalEmbeddings(resolved.local);
		const hasUnavailableConfiguredLocalModel = Boolean(normalizeOptionalString(resolved.local.modelPath)) && !hasExplicitLocalModel;
		const detail = opts?.gatewayMemoryProbe?.error?.trim();
		const gatewayDetail = detail && detail !== runtimeFacts?.loadError ? detail : null;
		const env = opts.env ?? process.env;
		const manifestRegistry = loadPluginManifestRegistryForPluginRegistry({
			config: cfg,
			env,
			includeDisabled: true
		});
		const installedOwners = listProviderPolicyOwners(provider, manifestRegistry);
		if (installedOwners.length === 0) {
			noteFn(getMissingLocalMemoryEmbeddingProviderMessage(), "Memory search");
			return;
		}
		const ownerPolicies = installedOwners.map((owner) => ({
			owner,
			policyBlock: resolveManifestOwnerBasePolicyBlock({
				plugin: owner,
				normalizedConfig: normalizedPlugins
			})
		}));
		const eligibleOwners = ownerPolicies.filter(({ policyBlock }) => !policyBlock).map(({ owner }) => owner);
		const policyArtifacts = eligibleOwners.length > 0 ? loadProviderPolicyArtifacts(eligibleOwners) : null;
		let installedOwner;
		let ownerPolicyBlock;
		if (policyArtifacts) {
			installedOwner = policyArtifacts.owner;
			ownerPolicyBlock = null;
		} else {
			const blockedOwner = ownerPolicies.find(({ policyBlock }) => policyBlock);
			if (!blockedOwner) throw new Error(`Unable to resolve the installed provider owner for "${provider}".`);
			installedOwner = blockedOwner.owner;
			ownerPolicyBlock = blockedOwner.policyBlock;
		}
		const providerPolicy = policyArtifacts?.surface;
		const inspectSetup = ownerPolicyBlock ? void 0 : providerPolicy?.inspectEmbeddingProviderSetup;
		const setup = inspectSetup ? await inspectSetup({
			config: cfg,
			env,
			agentId,
			provider
		}) : null;
		const setupReason = setup?.reason.trim();
		const setupFix = setup?.fixHint?.trim();
		const updateFix = !ownerPolicyBlock && !inspectSetup ? `Fix: Update the installed plugin: ${formatCliCommand(`openclaw plugins update ${installedOwner.id}`)}` : null;
		const policyBlock = ownerPolicyBlock ? resolveLocalProviderPolicyBlockGuidance(ownerPolicyBlock, installedOwner.id) : null;
		if (opts?.gatewayMemoryProbe?.skipped && !hasUnavailableConfiguredLocalModel && !setup && !policyBlock && !updateFix) return;
		const hasRuntimeFailureDetail = Boolean(gatewayDetail || runtimeFacts?.loadError);
		noteFn([
			runtimeFacts ? formatLocalRuntimeDoctorNote(runtimeFacts) : null,
			runtimeFacts ? "" : null,
			hasExplicitLocalModel ? "Memory search provider is set to \"local\" and a local model path is configured, but local embeddings are not confirmed ready." : "Memory search provider is set to \"local\", but local embeddings are not confirmed ready.",
			setupReason ? `Setup: ${setupReason}` : null,
			policyBlock?.message,
			updateFix ? `Installed plugin "${installedOwner.id}" does not provide current local-memory setup diagnostics.` : null,
			gatewayDetail && gatewayDetail !== setupReason ? `Gateway probe: ${gatewayDetail}` : null,
			"",
			policyBlock?.fix ?? updateFix ?? (setupFix ? `Fix: ${setupFix}` : hasUnavailableConfiguredLocalModel ? "Fix: Set memory.search.local.modelPath to an existing GGUF file, or remove it to use the managed default." : hasRuntimeFailureDetail ? "Fix: Repair the llama.cpp server problem reported by the Gateway." : null),
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"), "Memory search");
		return;
	}
	if (isOpenAICompatibleMemoryProvider(provider, cfg) && !resolveOpenAICompatibleMemoryBaseUrl(provider, cfg, resolved.remote?.baseUrl)) {
		noteFn([
			`Memory search provider is set to "${provider}" but no OpenAI-compatible embeddings endpoint was configured.`,
			"Set memory.search.remote.baseUrl to the /v1 endpoint for your embeddings server.",
			"",
			"Fix:",
			`- ${formatCliCommand("openclaw config set memory.search.remote.baseUrl http://127.0.0.1:1234/v1")}`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	if (isOpenAICompatibleMemoryProvider(provider, cfg) && !normalizeOptionalString(resolved.model)) {
		noteFn([
			`Memory search provider is set to "${provider}" but no OpenAI-compatible embedding model was configured.`,
			"Set memory.search.model to the embedding model id your server expects.",
			"",
			"Fix:",
			`- ${formatCliCommand("openclaw config set memory.search.model text-embedding-bge-m3")}`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	if (isKeyOptionalMemoryProvider(provider, cfg)) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (opts?.gatewayMemoryProbe?.skipped) return;
		const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
		noteFn([
			gatewayProbeWarning ? `Memory search provider "${provider}" is configured, but the gateway reports embeddings are not ready.` : `Memory search provider "${provider}" is configured, but the gateway could not confirm embeddings are ready.`,
			gatewayProbeWarning,
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"), "Memory search");
		return;
	}
	if (hasRemoteApiKey || await hasApiKeyForProvider(provider, cfg, agentDir, { skipProfileResolution: opts?.skipAuthProfileResolution === true })) return;
	if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
		noteFn([
			`Memory search provider is set to "${provider}" but the API key was not found in the CLI environment.`,
			"The running gateway reports memory embeddings are ready for the default agent.",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
	const envVar = resolvePrimaryMemoryProviderEnvVar(provider);
	noteFn([
		`Memory search provider is set to "${provider}" but no API key was found.`,
		`Semantic recall will not work without a valid API key.`,
		gatewayProbeWarning ? gatewayProbeWarning : null,
		"",
		"Fix (pick one):",
		`- Set ${envVar} in your environment`,
		`- Configure credentials: ${formatCliCommand("openclaw configure --section model")}`,
		`- To disable: ${formatCliCommand("openclaw config set memory.search.enabled false")}`,
		"",
		`Verify: ${formatCliCommand("openclaw memory status --deep")}`
	].join("\n"), "Memory search");
}
/**
* Check whether local embeddings are available.
*
*/
function hasLocalEmbeddings(local) {
	const modelPath = normalizeOptionalString(local.modelPath);
	if (!modelPath) return false;
	if (/^(hf:|https?:)/i.test(modelPath)) return true;
	const resolved = resolveUserPath(modelPath);
	try {
		return fs.statSync(resolved).isFile();
	} catch {
		return false;
	}
}
async function hasApiKeyForProvider(provider, cfg, agentDir, opts) {
	const authProviderId = MEMORY_EMBEDDING_PROVIDER_AUTH_IDS.get(provider) ?? provider;
	if (isSecretRef(findNormalizedProviderValue(cfg.models?.providers, authProviderId)?.apiKey) || resolveEnvApiKey(authProviderId) || resolveUsableCustomProviderApiKey({
		cfg,
		provider: authProviderId
	})) return true;
	if (opts?.skipProfileResolution === true) {
		if (authProviderId === "amazon-bedrock") return hasConfiguredAwsSdkAuthForProvider(authProviderId, cfg);
		const orderedProfileIds = findNormalizedProviderValue(cfg.auth?.order, authProviderId);
		return orderedProfileIds === void 0 ? hasAuthProfileStoreSourceForProvider(authProviderId, agentDir) : hasAuthProfileStoreSourceForProvider(authProviderId, agentDir, { profileIds: orderedProfileIds });
	}
	if (authProviderId !== "amazon-bedrock" && !hasAnyAuthProfileStoreSource(agentDir)) return false;
	try {
		await resolveApiKeyForProviderCore({
			provider: authProviderId,
			cfg,
			agentDir
		});
		return true;
	} catch {
		return false;
	}
}
function resolvePrimaryMemoryProviderEnvVar(provider) {
	if (provider === "openai") return "OPENAI_API_KEY";
	const authProviderId = MEMORY_EMBEDDING_PROVIDER_AUTH_IDS.get(provider);
	return (authProviderId ? getProviderEnvVarsCore(authProviderId)[0] : void 0) ?? `${provider.toUpperCase()}_API_KEY`;
}
function buildGatewayProbeWarning(probe) {
	if (!probe?.checked || probe.ready) return null;
	const detail = probe.error?.trim();
	return detail ? `Gateway memory probe for default agent is not ready: ${detail}` : "Gateway memory probe for default agent is not ready.";
}
//#endregion
export { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth };
