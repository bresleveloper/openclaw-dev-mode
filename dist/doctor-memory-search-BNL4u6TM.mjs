import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as isSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { C as defaultSlotIdForKey, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { h as listProviderPolicyOwners } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BDlJJbko.mjs";
import "./legacy-B7HUu-GS.mjs";
import "./legacy-config-record-shared-CG6CyklH.mjs";
import { t as loadProviderPolicyArtifacts } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { o as resolveRememberAcrossConversations } from "./config-utils-DvW0vXFD.mjs";
import { t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-CElLtwMu.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { r as hasAuthProfileStoreSourceForProvider, t as hasAnyAuthProfileStoreSource } from "./source-check--zMBJ43Q.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { b as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-C_EL9CxV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-Dci0IxqM.mjs";
import "./model-auth-CMoPmop7.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DV-G0hQT.mjs";
import { s as getMemoryEmbeddingCommandSecretTargetIds } from "./command-secret-targets-C_0e9XHi.mjs";
import { a as getActiveMemoryProviderCore, l as resolveActiveMemoryBackendConfig } from "./memory-runtime-CXcwwGi2.mjs";
import { n as resolveMemorySearchConfig } from "./memory-search-Fa28vl7G.mjs";
import { t as hasConfiguredMemorySecretInput } from "./secret-input-c4CL7oqZ.mjs";
import "./secret-Bsv8HbfV.mjs";
import { a as getMissingLocalMemoryEmbeddingProviderMessage } from "./memory-core-bundled-runtime-B9N5CKgx.mjs";
import { n as resolveMemoryDoctorAgentScopes, t as formatMemoryDoctorAgentMessage } from "./doctor-memory-scope-Cmm9UB91.mjs";
import { i as noteWorkspaceMemoryHealth } from "./doctor-workspace-BVsI5d1z.mjs";
import { safeStatSync } from "@openclaw/fs-safe/path";
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
function hasActiveAlternateMemoryPluginSlot(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	const memorySlot = plugins.slots.memory;
	if (!plugins.enabled || !memorySlot || memorySlot === defaultSlotIdForKey("memory") || plugins.deny.includes(memorySlot) || !Object.hasOwn(plugins.entries, memorySlot)) return false;
	const entry = plugins.entries[memorySlot];
	if (!entry || entry.enabled === false) return false;
	return entry.enabled === true || entry.config !== void 0;
}
function resolveActiveMemoryConversationRecallSupport(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	const entry = plugins.entries["active-memory"];
	const pluginConfig = isRecord(entry?.config) ? entry.config : void 0;
	const rawConfig = cfg.plugins?.entries?.["active-memory"]?.config;
	const config = isRecord(rawConfig) ? rawConfig : void 0;
	return {
		available: plugins.enabled && !plugins.deny.includes("active-memory") && (plugins.allow.length === 0 || plugins.allow.includes("active-memory")) && entry?.enabled !== false && pluginConfig?.enabled !== false,
		providerSupported: plugins.slots.memory === defaultSlotIdForKey("memory"),
		memorySearchAllowed: !Array.isArray(config?.toolsAllow) || config.toolsAllow.some((toolName) => typeof toolName === "string" && toolName.trim().toLowerCase() === "memory_search")
	};
}
function inspectRememberAcrossConversationsHealth(params) {
	if (!resolveRememberAcrossConversations(params.cfg, params.agentId)) return false;
	const conversationRecallSupport = resolveActiveMemoryConversationRecallSupport(params.cfg);
	if (!conversationRecallSupport.available) params.report(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the Active Memory plugin is disabled. Enable the plugin or set memory.search.rememberAcrossConversations to false.`);
	else if (!conversationRecallSupport.providerSupported) params.report(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the current memory provider does not support protected private transcript recall. Set memory.search.rememberAcrossConversations to false or use that provider's own recall path; advanced Active Memory can still use its recall tools.`);
	else if (!conversationRecallSupport.memorySearchAllowed) params.report(`Remember across conversations is effectively enabled for agent "${params.agentId}", but Active Memory does not allow memory_search. Add memory_search to the plugin toolsAllow list or set memory.search.rememberAcrossConversations to false.`);
	return true;
}
async function noteMemorySearchHealth(cfg, opts) {
	await inspectMemorySearchHealth(cfg, opts ?? {}, ({ text }) => note(text, "Memory search"));
}
async function collectMemorySearchHealthFindings(ctx) {
	const findings = [];
	await inspectMemorySearchHealth(ctx.cfg, {
		env: ctx.env,
		includeWorkspaceMemoryHealth: false,
		skipAuthProfileResolution: true,
		allowExecSecretRefs: ctx.allowExecSecretRefs === true,
		gatewayMemoryProbe: {
			checked: false,
			ready: false,
			skipped: true
		}
	}, ({ finding }) => {
		if (finding) findings.push(finding);
	});
	return findings;
}
async function inspectMemorySearchHealth(cfg, opts, emit) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		if (opts.includeWorkspaceMemoryHealth !== false) await noteWorkspaceMemoryHealth({
			agentId: scope.agentId,
			workspaceDir: scope.workspaceDir,
			labelAgent: labelAgents
		});
		const report = (message, path = "memory.search.provider", disabled = false, informational = false) => {
			const text = formatMemoryDoctorAgentMessage(scope.agentId, labelAgents, message);
			const [firstLine, ...details] = text.split("\n");
			const fixHint = details.map((line) => line.trimEnd()).join("\n").trim();
			emit({
				text,
				finding: informational || disabled && !labelAgents ? null : {
					checkId: "core/doctor/memory-search",
					severity: "warning",
					message: (firstLine ?? text).trim(),
					path,
					...fixHint ? { fixHint } : {}
				}
			});
		};
		await inspectMemorySearchHealthForAgent(cfg, scope, {
			...opts,
			gatewayMemoryProbe: scope.agentId === defaultAgentId || opts.gatewayMemoryProbe?.skipped ? opts.gatewayMemoryProbe : void 0
		}, report);
	}
}
async function inspectMemorySearchHealthForAgent(cfg, scope, opts, report) {
	const { agentId, agentDir } = scope;
	const resolved = resolveMemorySearchConfig(cfg, agentId);
	if (!resolved) {
		const recallEnabled = inspectRememberAcrossConversationsHealth({
			cfg,
			agentId,
			report
		});
		report(recallEnabled ? `Remember across conversations is effectively enabled for agent "${agentId}", but memory search is disabled. Enable memory search or set memory.search.rememberAcrossConversations to false.` : "Memory search is explicitly disabled (enabled: false).", "memory.search.provider", !recallEnabled);
		return;
	}
	const provider = resolved.provider;
	const normalizedPlugins = normalizePluginsConfig(cfg.plugins);
	if (provider === "local" && !normalizedPlugins.enabled) {
		const policyBlock = resolveLocalProviderPolicyBlockGuidance("plugins-disabled", provider);
		report([
			policyBlock.message,
			"",
			policyBlock.fix,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"));
		return;
	}
	const backendConfig = resolveActiveMemoryBackendConfig({
		cfg,
		agentId
	});
	if (backendConfig?.backend === "provider-runtime") {
		let memoryProvider = null;
		let status = "unavailable";
		let detail = "provider unavailable";
		try {
			const { resolvedConfig, diagnostics, hadUnresolvedTargets } = await resolveCommandSecretRefsViaGateway({
				config: cfg,
				commandName: "doctor",
				targetIds: getMemoryEmbeddingCommandSecretTargetIds(cfg),
				mode: "read_only_status",
				allowLocalExecSecretRefs: opts.allowExecSecretRefs === true
			});
			if (hadUnresolvedTargets) throw new Error(diagnostics.join("\n"));
			const acquired = await getActiveMemoryProviderCore({
				cfg: resolvedConfig,
				agentId,
				purpose: "status",
				context: {
					authority: {
						kind: "host",
						operation: "status"
					},
					assertCurrent() {}
				}
			});
			memoryProvider = acquired.provider;
			if (memoryProvider) {
				const health = await memoryProvider.health();
				status = health.status;
				detail = health.message ?? "no provider message";
			} else detail = acquired.error ?? detail;
		} catch (error) {
			detail = formatErrorMessage(error);
		} finally {
			await memoryProvider?.close().catch(() => {});
		}
		report(status === "ready" ? `Not applicable: ${backendConfig.providerId} uses the provider runtime; see its health.\nProvider health: ${status}${detail ? ` (${detail})` : ""}.` : `Memory provider "${backendConfig.providerId}" is ${status}${detail ? `: ${detail}` : ""}.\nCheck the provider's configuration and service availability.`, "plugins.slots.memory", false, status === "ready");
		return;
	}
	inspectRememberAcrossConversationsHealth({
		cfg,
		agentId,
		report
	});
	const hasRemoteApiKey = hasConfiguredMemorySecretInput(resolved.remote?.apiKey);
	if (!backendConfig) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (hasActiveAlternateMemoryPluginSlot(cfg)) return;
		report("No active memory plugin is registered for the current config.", "plugins.slots.memory");
		return;
	}
	if (resolved.sessionSourceExcluded) report(`Memory search for agent "${agentId}" requests the "sessions" source, but session indexing is disabled. Set memory.search.experimental.sessionMemory to true for this agent, or enable memory.search.rememberAcrossConversations for private cross-conversation recall.`, "memory.search.sources", false, true);
	if (provider === "none") return;
	if (provider === "local") {
		const runtimeFacts = opts?.gatewayMemoryProbe?.runtimeFacts;
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
			if (runtimeFacts) report(formatLocalRuntimeDoctorNote(runtimeFacts));
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
			report(getMissingLocalMemoryEmbeddingProviderMessage());
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
		const selectedPolicy = policyArtifacts ? {
			owner: policyArtifacts.owner,
			policyBlock: null
		} : ownerPolicies.find(({ policyBlock }) => policyBlock);
		if (!selectedPolicy) throw new Error(`Unable to resolve the installed provider owner for "${provider}".`);
		const { owner: installedOwner, policyBlock: ownerPolicyBlock } = selectedPolicy;
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
		report([
			runtimeFacts ? formatLocalRuntimeDoctorNote(runtimeFacts) : null,
			runtimeFacts ? "" : null,
			hasExplicitLocalModel ? "Memory search provider is set to \"local\" and a local model path is configured, but local embeddings are not confirmed ready." : "Memory search provider is set to \"local\", but local embeddings are not confirmed ready.",
			setupReason ? `Setup: ${setupReason}` : null,
			policyBlock?.message,
			updateFix ? `Installed plugin "${installedOwner.id}" does not provide current local-memory setup diagnostics.` : null,
			gatewayDetail && gatewayDetail !== setupReason ? `Gateway check: ${gatewayDetail}` : null,
			"",
			policyBlock?.fix ?? updateFix ?? (setupFix ? `Fix: ${setupFix}` : hasUnavailableConfiguredLocalModel ? "Fix: Set memory.search.local.modelPath to an existing GGUF file, or remove it to use the managed default." : hasRuntimeFailureDetail ? "Fix: Repair the llama.cpp server problem reported by the Gateway." : null),
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"));
		return;
	}
	const openAICompatible = isOpenAICompatibleMemoryProvider(provider, cfg);
	const missingBaseUrl = openAICompatible && !(normalizeOptionalString(resolved.remote?.baseUrl) ?? normalizeOptionalString(findNormalizedProviderValue(cfg.models?.providers, provider)?.baseUrl));
	if (openAICompatible && (missingBaseUrl || !normalizeOptionalString(resolved.model))) {
		const configPath = missingBaseUrl ? "memory.search.remote.baseUrl" : "memory.search.model";
		const description = missingBaseUrl ? "embeddings endpoint" : "embedding model";
		const guidance = missingBaseUrl ? "the /v1 endpoint for your embeddings server" : "the embedding model id your server expects";
		const example = missingBaseUrl ? "http://127.0.0.1:1234/v1" : "text-embedding-bge-m3";
		report([
			`Memory search provider is set to "${provider}" but no OpenAI-compatible ${description} was configured.`,
			`Set ${configPath} to ${guidance}.`,
			"",
			"Fix:",
			`- ${formatCliCommand(`openclaw config set ${configPath} ${example}`)}`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), configPath);
		return;
	}
	if (provider === "ollama" || provider === "lmstudio" || openAICompatible) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (opts?.gatewayMemoryProbe?.skipped) return;
		const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
		report([
			gatewayProbeWarning ? `Memory search provider "${provider}" is configured, but the gateway reports embeddings are not ready.` : `Memory search provider "${provider}" is configured, but the gateway could not confirm embeddings are ready.`,
			gatewayProbeWarning,
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"));
		return;
	}
	if (hasRemoteApiKey || await hasApiKeyForProvider(provider, cfg, agentDir, { skipProfileResolution: opts?.skipAuthProfileResolution === true })) return;
	if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
		report([
			`Memory search provider is set to "${provider}" but the API key was not found in the CLI environment.`,
			"The running gateway reports memory embeddings are ready for the default agent.",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"));
		return;
	}
	const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
	const envVar = resolvePrimaryMemoryProviderEnvVar(provider);
	report([
		`Memory search provider is set to "${provider}" but no API key was found.`,
		"Without working primary or fallback embeddings, memory sync stops for explicitly configured providers or existing vector indexes; new and changed memory files are not indexed.",
		gatewayProbeWarning ? gatewayProbeWarning : null,
		"",
		"Fix (pick one):",
		`- Set ${envVar} in your environment`,
		`- Configure credentials: ${formatCliCommand("openclaw configure --section model")}`,
		`- For keyword-only recall without a key, set memory.search.provider to "none" for this agent (including any agent override), then run ${formatCliCommand(`openclaw memory index --force --agent ${agentId}`)}`,
		"",
		`Then rerun: ${formatCliCommand("openclaw doctor")}`
	].join("\n"));
}
function hasLocalEmbeddings(local) {
	const modelPath = normalizeOptionalString(local.modelPath);
	if (!modelPath) return false;
	if (/^(hf:|https?:)/i.test(modelPath)) return true;
	const resolved = resolveUserPath(modelPath);
	return safeStatSync(resolved)?.isFile() ?? false;
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
	return detail ? `Gateway memory check for default agent is not ready: ${detail}` : "Gateway memory check for default agent is not ready.";
}
//#endregion
export { collectMemorySearchHealthFindings, noteMemorySearchHealth };
