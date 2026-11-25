import { deniesCodexNativeDelegation } from "../native-tool-policy.js";
import { t as appendCodexGitConfigParameters } from "./config-utils-QUqoHnvX.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { b as readCodexConfigValue, v as CODEX_SESSION_OVERRIDABLE_LAYER_TYPES, x as readCodexEffectiveConfig, y as readCodexAuthoredConfigValue } from "./config-options-ZyoXdPOW.mjs";
import { a as normalizeCodexDynamicToolName, c as shouldDisableCodexToolSearchForModel, i as isSystemAgentOnlyCodexDynamicToolAllowlist, r as isMessageOnlyCodexSourceReply } from "./dynamic-tool-profile-Cl_HKG4m.mjs";
import { vt as resolveCodexThreadFingerprintConfig } from "./shared-client-DhJ31S_8.mjs";
import { a as isCodexResponsesOAuthRun } from "./responses-oauth-Cocl-M9v.mjs";
import { d as mergeCodexThreadConfigs, t as buildCodexProjectDocThreadConfig } from "./project-doc-thread-config-BVAa1EOm.mjs";
import { o as hashCodexAppServerBindingFingerprint } from "./session-binding-_y0fotvm.mjs";
import { n as resolveCodexAppServerModelProvider, r as resolveCodexAppServerRequestModelSelection, t as CODEX_NATIVE_PERSONALITY_NONE } from "./thread-model-selection-20muBXj9.mjs";
import { asOptionalRecord, normalizeOptionalString, normalizeUniqueStringEntries, normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto, * as crypto$1 from "node:crypto";
import path from "node:path";
import { isIncognitoSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { buildAgentHarnessBasePrompt, buildAgentRuntimePlan, buildCredentialSafetyPrompt, buildDelegationGuidanceSection, buildUiPresentationPrompt, isHostScopedAgentToolActive, listToolPromptGuidance, resolveMainSessionDelegationMode } from "openclaw/plugin-sdk/agent-harness-runtime";
import { listRegisteredPluginAgentPromptGuidance } from "openclaw/plugin-sdk/plugin-runtime";
import { buildHostnameAllowlistPolicyFromSuffixAllowlist } from "openclaw/plugin-sdk/ssrf-policy";
// extensions/codex/src/app-server/collaboration-policy.ts
function usesManagedCollaboration(params, options) {
	return !options.preserveNativeCollaboration && params.trigger !== "cron";
}
/** Managed turns select Default; native-supervised turns retain Codex's mode policy. */
function buildCodexDefaultCollaborationPolicy(config, nativeConfig) {
	const value = (key) => readCodexConfigValue(config, key) ?? (nativeConfig && (readCodexAuthoredConfigValue(nativeConfig, key) ?? readCodexConfigValue(nativeConfig.config, key)));
	return [
		"<collaboration_mode>",
		"Prefer making reasonable assumptions and executing the user's request rather than stopping to ask questions. Ask the user directly when required input prevents progress; silence is not an answer or approval.",
		...value("tools.experimental_request_user_input.enabled") !== false && value("features.default_mode_request_user_input") === true ? ["Use `request_user_input` only for optional questions where the answer would materially improve the work, and only when the tool is available to this root thread. If it returns no answers, continue with best judgment. Never use it for permission requests or required input."] : [],
		"</collaboration_mode>"
	].join("\n");
}
// extensions/codex/src/app-server/developer-instruction-sections.ts
function joinPresentSections(...sections) {
	return sections.filter((section) => Boolean(section?.trim())).join("\n\n");
}
/** Label the OpenClaw carrier, not the enclosing native developer message or inference relay. */
function renderCodexThreadPolicy(...sections) {
	return `<thread_policy>\n${joinPresentSections(...sections)}\n</thread_policy>`;
}
// extensions/codex/src/app-server/thread-binding-policy.ts
function shouldRotateCodexAppServerBindingForRuntime(params) {
	if (!params.current || params.binding === params.current) return false;
	return params.connectionClass === "remote" || Boolean(params.binding);
}
function resolveCodexGpt56MultiAgentVersion(modelRef) {
	let modelId = modelRef?.trim().toLowerCase();
	if (!modelId) return;
	const slashIndex = modelId.indexOf("/");
	if (slashIndex > 0) {
		const provider = modelId.slice(0, slashIndex);
		if (provider !== "openai" && provider !== "codex") return;
		modelId = modelId.slice(slashIndex + 1);
	}
	if (modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra") return "v2";
	return modelId === "gpt-5.6-luna" ? "v1" : void 0;
}
function shouldRotateCodexGpt56MultiAgentBinding(params) {
	const bindingVersion = resolveCodexGpt56MultiAgentVersion(params.bindingModel);
	const requestedVersion = resolveCodexGpt56MultiAgentVersion(params.requestedModel);
	return Boolean(bindingVersion && requestedVersion && bindingVersion !== requestedVersion);
}
function isTransientWebSearchRestriction(params) {
	if (params.nativeProviderWebSearchSupport === "unknown") return true;
	if (params.params.config?.tools?.web?.search?.enabled === false) return false;
	if (params.params.disableTools === true) return true;
	if (params.webSearchAllowed !== false) return false;
	if (params.persistentWebSearchAllowed !== void 0) return params.persistentWebSearchAllowed;
	if (params.params.toolsAllow === void 0) return false;
	return !params.params.toolsAllow.some((name) => {
		const normalized = normalizeCodexDynamicToolName(name);
		return normalized === "*" || normalized === "web_search";
	});
}
function shouldRecheckRecoverablePluginBinding(params) {
	if (!params.pluginThreadConfig?.enabled) return false;
	if (!params.binding.pluginAppsFingerprint || !params.binding.pluginAppsInputFingerprint || params.binding.pluginAppsInputFingerprint !== params.pluginThreadConfig.inputFingerprint) return false;
	const policyContext = params.binding.pluginAppPolicyContext;
	if (!policyContext) return false;
	const enabledPluginConfigKeys = params.pluginThreadConfig.enabledPluginConfigKeys ?? [];
	const recoverablePluginConfigKeys = params.pluginThreadConfig.recoverablePluginConfigKeys ?? enabledPluginConfigKeys;
	const recoverablePluginConfigKeySet = new Set(recoverablePluginConfigKeys);
	const bindingContainsSettledPlugin = enabledPluginConfigKeys.some((configKey) => !recoverablePluginConfigKeySet.has(configKey) && ((policyContext.pluginAppIds[configKey]?.length ?? 0) > 0 || Object.values(policyContext.apps).some((app) => app.source !== "account" && app.configKey === configKey)));
	const accountAppRecoveryEnabled = params.pluginThreadConfig.accountAppRecoveryEnabled ?? enabledPluginConfigKeys.length === 0;
	return bindingContainsSettledPlugin || accountAppRecoveryEnabled && Object.keys(policyContext.apps).length === 0 || recoverablePluginConfigKeys.length > 0;
}
// extensions/codex/src/app-server/thread-fingerprints.ts
function codexDynamicToolsFingerprint(dynamicTools) {
	return hashCodexAppServerBindingFingerprint(codexLegacyDynamicToolsFingerprint(dynamicTools));
}
function areCodexDynamicToolFingerprintsCompatible(params) {
	return !params.previous || params.previous === params.next || params.previous === params.nextLegacy;
}
function codexLegacyDynamicToolsFingerprint(dynamicTools) {
	return `[${dynamicTools.map((tool) => JSON.stringify(stabilizeJsonValue(tool))).toSorted((left, right) => left.localeCompare(right)).join(",")}]`;
}
function legacyFingerprintUserMcpServersConfigPatch(configPatch) {
	return configPatch ? JSON.stringify(stabilizeJsonValue(configPatch)) : void 0;
}
function fingerprintUserMcpServersConfigPatch(configPatch) {
	return configPatch ? hashCodexAppServerBindingFingerprint(JSON.stringify(stabilizeFingerprintValue(configPatch, true))) : void 0;
}
function fingerprintUserMcpServersAuthorizationHeader(value) {
	return typeof value === "string" && value.length > 0 ? `<redacted:sha256:${crypto$1.createHash("sha256").update(value).digest("hex")}>` : "<redacted>";
}
function fingerprintJsonObject(value) {
	return JSON.stringify(stabilizeJsonValue(value));
}
/** Hash thread-creation identity; settings already applied by turn/start must not restart Codex. */
function fingerprintCodexThreadConfig(initialRequest, authProfileId, dynamicToolsFingerprint, selection, inference) {
	let { model, requestedModel, modelProvider, requestedModelProvider } = initialRequest;
	if (selection) {
		const preserve = selection.preserveNativeModel;
		requestedModel = preserve ? null : model ?? null;
		model = preserve ? null : selection.model ?? model ?? null;
		requestedModelProvider = preserve ? null : modelProvider ?? selection.modelProvider ?? null;
		modelProvider = preserve ? null : selection.modelProvider === void 0 ? modelProvider ?? null : selection.modelProvider;
	}
	return hashCodexAppServerBindingFingerprint(fingerprintJsonObject({
		authProfileId: authProfileId ?? null,
		dynamicToolsFingerprint: dynamicToolsFingerprint ?? null,
		nativeMultiAgentVersion: resolveCodexGpt56MultiAgentVersion(typeof requestedModel === "string" ? requestedModel : typeof model === "string" ? model : void 0) ?? null,
		modelProvider: modelProvider ?? null,
		requestedModelProvider: requestedModelProvider === void 0 ? modelProvider ?? null : requestedModelProvider,
		permissions: initialRequest.permissions ?? null,
		baseInstructions: initialRequest.baseInstructions ?? null,
		developerInstructions: initialRequest.developerInstructions ?? null,
		config: resolveCodexThreadFingerprintConfig(isJsonObject(initialRequest.config) ? initialRequest.config : {}, inference)
	}));
}
/** Exact creation-time identity for a restricted native thread. Persist only its hash. */
function fingerprintRestrictedThreadConfig(request, authProfileId, dynamicToolsFingerprint, attempt, hostSystemAgentActive, selection, inference) {
	return hashCodexAppServerBindingFingerprint(fingerprintJsonObject({
		authProfileId: authProfileId ?? null,
		threadConfigFingerprint: fingerprintCodexThreadConfig(isIncognitoSessionKey(attempt.sessionKey) ? {
			...request,
			developerInstructions: null
		} : request, authProfileId, dynamicToolsFingerprint, selection, inference),
		hostSystemAgentActive,
		toolsAllow: attempt.pluginHarnessToolPolicyScope === "conversation" && attempt.toolsAllow?.some((entry) => entry.trim() === "*") ? null : attempt.toolsAllow ? [...attempt.toolsAllow] : null,
		disableTools: attempt.disableTools === true,
		delegationCapability: attempt.delegationCapability ?? null,
		pluginHarnessToolPolicyRestricted: attempt.pluginHarnessToolPolicyRestricted === true,
		pluginHarnessToolPolicySafeDeniedTools: [...attempt.pluginHarnessToolPolicySafeDeniedTools ?? []].toSorted()
	}));
}
function fingerprintEnvironmentSelection(environments) {
	return environments ? JSON.stringify(environments.map(stabilizeJsonValue)) : void 0;
}
function stabilizeJsonValue(value) {
	return stabilizeFingerprintValue(value, false);
}
function stabilizeFingerprintValue(value, redactMcpHeaders) {
	if (Array.isArray(value)) return value.map((child) => stabilizeFingerprintValue(child, redactMcpHeaders));
	if (!isJsonObject(value)) return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, child]) => {
		if (redactMcpHeaders && key === "http_headers" && isJsonObject(child)) return [key, stabilizeFingerprintValue(Object.fromEntries(Object.entries(child).map(([header, headerValue]) => [header, header.toLowerCase() === "authorization" ? fingerprintUserMcpServersAuthorizationHeader(headerValue) : headerValue])), false)];
		return [key, stabilizeFingerprintValue(child, redactMcpHeaders)];
	}));
}
function readActiveCodexTurnIdsFromResume(response) {
	return (response.initialTurnsPage?.data ?? response.thread.turns ?? []).filter((turn) => turn.status === "inProgress" && turn.id.trim().length > 0).map((turn) => turn.id);
}
const LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT = codexLegacyDynamicToolsFingerprint([]);
const EMPTY_DYNAMIC_TOOLS_FINGERPRINT = hashCodexAppServerBindingFingerprint(LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT);
function areUserMcpServersFingerprintsCompatible(params) {
	return params.previous === params.next || params.previous === params.nextLegacy || params.nextLegacy !== void 0 && params.previous === hashCodexAppServerBindingFingerprint(params.nextLegacy);
}
function shouldStartTransientNoToolThread(params) {
	return Boolean(params.previous && params.previous !== EMPTY_DYNAMIC_TOOLS_FINGERPRINT && params.previous !== LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT && !params.nextHasDynamicTools);
}
// extensions/codex/src/app-server/thread-prompt.ts
const CODEX_RUNTIME_GUIDANCE = [
	"## Codex Runtime",
	"Commentary is the progress channel. The final message ends your turn and must stand alone, including every answer the user is still waiting for.",
	"A user message that arrives during work steers the active task: apply corrections, answer briefly, and continue unless they cancel or replace it.",
	"Automatic compaction does not end a task: continue from the summary without restarting finished work or repeating delivered updates."
];
const CODEX_NATIVE_TOOL_GUIDANCE = [
	"Search with `rg` or `rg --files` when available. Batch independent reads in one `functions.exec` with `Promise.allSettled`; keep dependent, mutating, or approval-gated steps sequential.",
	"Shell command text is code: `JSON.stringify()` is not shell escaping, and backticks or `$()` in `cmd` still execute. Never repurpose `$HOME` or `$CODEX_HOME`.",
	"If automatic approval review rejects an action you cannot complete more safely, name the action and the stated reason.",
	"Connected app tools are exposed directly or load through `tool_search`; app mentions look like `[$app-name](app://connector_id)`. Plugins are not invoked directly: use their skills, apps, and `mcp__server__tool` tools."
];
/** Ring-zero threads pin empty base instructions, so their policy stays in the developer carrier. */
function isCodexRingZeroThread(params, hostSystemAgentActive) {
	return (hostSystemAgentActive ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow);
}
function listDynamicToolNames(dynamicTools) {
	return (dynamicTools ?? []).flatMap((spec) => spec.type === "namespace" ? spec.tools : [spec]).map((tool) => tool.name.trim()).filter(Boolean);
}
/**
* Replaces Codex's model prompt with the regular OpenClaw policy. Codex pins this text in
* the rollout, so it renders from thread-stable facts only: the thread fingerprint
* covers it, and a changed render reaches an existing thread on its next cold resume.
*/
function buildCodexBaseInstructions(params, options = {}) {
	const nativeToolsEnabled = options.nativeCodeModeEnabled !== false;
	const promptMode = params.promptMode ?? "full";
	const toolNames = [...listDynamicToolNames(options.dynamicTools), ...nativeToolsEnabled ? ["exec"] : []];
	const promptPlan = params.runtimePlan ?? (options.nativeModelProvider ? buildAgentRuntimePlan({
		config: params.config,
		workspaceDir: params.workspaceDir,
		provider: options.nativeModelProvider,
		modelId: params.modelId
	}) : void 0);
	return joinPresentSections(buildAgentHarnessBasePrompt({
		config: params.config,
		toolNames,
		promptMode,
		promptContribution: promptPlan?.prompt.resolveSystemPromptContribution({
			config: params.config,
			provider: promptPlan.prompt.provider,
			modelId: params.modelId,
			promptMode,
			agentId: params.agentId
		}),
		nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({
			surface: "codex_app_server",
			includeLegacyGlobalGuidance: false
		})
	}), promptMode === "none" ? void 0 : [...CODEX_RUNTIME_GUIDANCE, ...nativeToolsEnabled ? CODEX_NATIVE_TOOL_GUIDANCE : []].join("\n"));
}
function hasAuthoredCodexBaseInstructions(options) {
	return ["model_instructions_file", "instructions"].some((key) => [options.config, options.nativeConfig?.config].some((config) => config !== void 0 && typeof readCodexConfigValue(config, key) === "string"));
}
/**
* OpenClaw's rendered base, whichever carrier holds it. Ring-zero threads have none, and
* neither do threads whose before_prompt_build `systemPrompt` replaced OpenClaw's policy.
*/
function resolveCodexOpenClawBaseInstructions(params, options) {
	return options.systemPromptReplaced || isCodexRingZeroThread(params, options.hostSystemAgentActive) ? void 0 : buildCodexBaseInstructions(params, options);
}
/**
* A request base outranks `model_instructions_file` and `instructions`
* (codex-rs/core/src/config/mod.rs), so with either authored OpenClaw omits the base and
* carries its policy ahead of the developer instructions. Start and resume place it alike,
* keeping warm reuse and fork snapshots consistent with the creation request.
*
* A replaced system prompt replaces the base too: an explicit empty base outranks the
* rollout's saved one on a cold resume (codex-rs/core/src/session/mod.rs, base priority
* order), so an existing thread drops OpenClaw's base in place. A loaded thread ignores
* the override; the base is part of the configuration fingerprint, so the change takes the
* cold-resume path. An authored base stays the operator's.
*/
function placeCodexBaseInstructions(params, options, developerInstructions, ringZero) {
	if (isCodexRingZeroThread(params, options.hostSystemAgentActive)) return {
		...ringZero,
		developerInstructions: renderCodexThreadPolicy(developerInstructions)
	};
	const baseInstructions = resolveCodexOpenClawBaseInstructions(params, options);
	if (hasAuthoredCodexBaseInstructions(options)) return { developerInstructions: renderCodexThreadPolicy(baseInstructions, developerInstructions) };
	return {
		baseInstructions: baseInstructions ?? "",
		developerInstructions: renderCodexThreadPolicy(developerInstructions)
	};
}
/** Move only the exact section annotated by its producer; later policy additions survive. */
function splitCodexExtraSystemPrompt(params) {
	const prompt = params.extraSystemPrompt;
	const context = params.extraSystemPromptTurnContext;
	if (!prompt || !context?.text || !Number.isInteger(context.start) || context.start < 0) return {
		persistent: prompt,
		turn: void 0
	};
	const end = context.start + context.text.length;
	if (prompt.slice(context.start, end) !== context.text || context.start > 0 && prompt.slice(context.start - 2, context.start) !== "\n\n" || end < prompt.length && prompt.slice(end, end + 2) !== "\n\n") return {
		persistent: prompt,
		turn: void 0
	};
	return {
		persistent: context.start === 0 ? prompt.slice(end === prompt.length ? end : end + 2) : prompt.slice(0, context.start - 2) + prompt.slice(end),
		turn: context.text
	};
}
/** Complete current snapshot for the existing parent-local inference relay. */
function buildCodexConversationTurnInstructions(params, availableDynamicTools) {
	const availableNames = availableDynamicTools.flatMap((spec) => spec.type === "namespace" ? spec.tools.map((tool) => `${spec.name}.${tool.name}`) : [spec.name]);
	return [
		"## OpenClaw conversation instructions",
		"Instructions in the following conversation_instructions block supersede earlier versions of this block delivered as developer instructions.",
		"<conversation_instructions>",
		splitCodexExtraSystemPrompt(params).turn ?? "No additional conversation instructions for this turn.",
		"### Tool Bindings",
		`Current OpenClaw tool bindings for this turn (accepted declarations alone do not grant execution): ${availableNames.length ? availableNames.toSorted().join(", ") : "none"}.`,
		"</conversation_instructions>"
	].join("\n\n");
}
function buildDeveloperInstructions(params, options = {}) {
	const deferredToolNames = /* @__PURE__ */ new Set();
	const toolNames = /* @__PURE__ */ new Map();
	let messageTool;
	let sessionsSpawnTool;
	let hasSessionsYield = false;
	let hasSeenDirectNamespace = false;
	for (const spec of options.dynamicTools ?? []) {
		const isDirectNamespace = spec.type === "namespace" && !hasSeenDirectNamespace && spec.name.trim() === "openclaw_direct";
		if (isDirectNamespace) hasSeenDirectNamespace = true;
		for (const tool of spec.type === "namespace" ? spec.tools : [spec]) {
			const name = tool.name.trim();
			const qualifiedName = spec.type === "namespace" ? `${spec.name}.${name}` : name;
			if (tool.deferLoading === true && name) deferredToolNames.add(qualifiedName);
			if (!toolNames.has(name)) toolNames.set(name, qualifiedName);
			if (name === "message") messageTool ??= {
				name: qualifiedName,
				parameters: tool.inputSchema
			};
			if (name === "sessions_spawn") sessionsSpawnTool ??= {
				name: qualifiedName,
				parameters: tool.inputSchema
			};
			hasSessionsYield ||= isDirectNamespace && name === "sessions_yield";
		}
	}
	const hasSessionsSpawn = toolNames.has("sessions_spawn");
	const spawnProperties = asOptionalRecord(asOptionalRecord(sessionsSpawnTool?.parameters)?.properties);
	const spawnRuntime = asOptionalRecord(spawnProperties?.runtime);
	const managedDelegationTool = sessionsSpawnTool ? !spawnProperties || !Object.hasOwn(spawnProperties, "runtime") ? `\`${sessionsSpawnTool.name}\`` : Array.isArray(spawnRuntime?.enum) && spawnRuntime.enum.includes("subagent") ? `\`${sessionsSpawnTool.name}\` with \`runtime="subagent"\`` : void 0 : void 0;
	const policyInDeveloperCarrier = params.promptMode === "none" || isCodexRingZeroThread(params, options.hostSystemAgentActive);
	const delegationGuidanceAvailable = params.disableTools !== true && params.toolsAllow?.length !== 0 && params.delegationCapability !== "report_only" && !isMessageOnlyCodexSourceReply(params);
	const nativeDelegationAvailable = delegationGuidanceAvailable && options.nativeCodeModeEnabled !== false && params.delegationCapability !== "host_only" && params.pluginHarnessToolPolicyRestricted !== true && !deniesCodexNativeDelegation(params.pluginHarnessToolPolicySafeDeniedTools) && params.requireWorkspaceOnly !== true && !isCodexResponsesOAuthRun(params) && !isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow) && !shouldDisableCodexToolSearchForModel(params.modelId);
	const deferredToolDiscoveryGuidance = (options.nativeCodeModeEnabled === true ? deferredToolNames.size > 0 : toolNames.size > 0) || nativeDelegationAvailable ? options.nativeCodeModeEnabled === true ? options.nativeCodeModeOnlyEnabled === true ? "Deferred tools may be absent from the direct tool list. Use Codex's native JavaScript `exec` to filter `ALL_TOOLS` by name and description, then invoke the matching entry through `tools`. `ALL_TOOLS` and `tools` are JavaScript globals, not shell environment variables. OpenClaw shell command tools are separate from this JavaScript runner. Call directly listed tools by their exact qualified names." : "Call directly listed tools by their exact qualified names. Use `tool_search` for deferred tools when it is directly callable. Otherwise use Codex's native JavaScript `exec` to filter `ALL_TOOLS` and invoke the matching entry through `tools`. `ALL_TOOLS` and `tools` are JavaScript globals, not shell environment variables. OpenClaw shell command tools are separate from this JavaScript runner. Do not repeat a completed call to retrieve a result you already have." : "Call the supplied OpenClaw tools by their exact qualified names. Shell command tools execute operating-system commands, not JavaScript tool discovery." : void 0;
	return [
		policyInDeveloperCarrier ? "You are a personal agent running inside OpenClaw. OpenClaw has dynamic tools for OpenClaw-owned messaging, cron, sessions, media, gateway, and nodes." : "OpenClaw has dynamic tools for OpenClaw-owned messaging, cron, sessions, media, gateway, and nodes.",
		deferredToolNames.size > 0 ? `Deferred searchable OpenClaw dynamic tools available: ${[...deferredToolNames].toSorted((left, right) => left.localeCompare(right)).join(", ")}.` : void 0,
		deferredToolDiscoveryGuidance,
		policyInDeveloperCarrier ? listToolPromptGuidance(toolNames.keys()).join("\n\n") : void 0,
		nativeDelegationAvailable ? `Use Codex native \`spawn_agent\` for work that only needs Codex-native tools. \`spawn_agent\` and the other native collaboration tools may be deferred. Native children cannot execute OpenClaw-owned dynamic tools, even when they inherit their schemas.${managedDelegationTool ? ` For new delegated work that needs OpenClaw tools, use ${managedDelegationTool} from the start.` : " Keep work needing OpenClaw tools in this session when no managed worker route is available."} For follow-up work on an existing native child, use the native collaboration tool that starts or queues a new turn. Do not respawn existing work to switch tool routes.` : void 0,
		hasSessionsYield && nativeDelegationAvailable ? "When a native child's result belongs in a later turn, end the current turn with `openclaw_direct.sessions_yield`; the completion arrives as the next model-visible input. Use native `wait_agent` only for an intentional same-turn wait when the immediate next step is blocked on the child. Never loop-poll for native child completion." : void 0,
		delegationGuidanceAvailable ? buildDelegationGuidanceSection({
			mode: resolveMainSessionDelegationMode({
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			}),
			isMinimal: params.promptMode === "minimal" || params.promptMode === "none",
			hiddenDelegationTool: nativeDelegationAvailable ? `native \`spawn_agent\` for Codex-native work${managedDelegationTool ? `, or ${managedDelegationTool} for new work needing OpenClaw tools` : ""}` : sessionsSpawnTool ? managedDelegationTool ?? `\`${sessionsSpawnTool.name}\`` : "",
			hasVisibleSessionSpawn: hasSessionsSpawn,
			hasSessionsYield,
			hasSubagentsList: toolNames.has("subagents"),
			hasSessionsSend: toolNames.has("sessions_send"),
			sessionsCreateToolName: toolNames.get("sessions_create"),
			suggestTaskToolName: toolNames.get("suggest_task")
		}).join("\n") : void 0,
		params.disableTools !== true && params.promptMode !== "minimal" && params.promptMode !== "none" ? buildUiPresentationPrompt({
			screenToolName: toolNames.get("screen"),
			showWidgetToolName: toolNames.get("show_widget"),
			dashboardToolName: toolNames.get("dashboard"),
			portalToolName: toolNames.get("portal"),
			messageTool
		}) : void 0,
		policyInDeveloperCarrier ? buildCredentialSafetyPrompt({ controlToolsAvailable: params.disableTools !== true && (toolNames.has("openclaw") || toolNames.has("gateway")) }) : void 0,
		policyInDeveloperCarrier ? listRegisteredPluginAgentPromptGuidance({
			surface: "codex_app_server",
			includeLegacyGlobalGuidance: false
		}).join("\n") : void 0,
		params.gitCoauthorPrompt,
		options.omitConversationTurnContext ? splitCodexExtraSystemPrompt(params).persistent : params.extraSystemPrompt
	].filter((section) => section?.trim()).join("\n\n");
}
// extensions/codex/src/app-server/thread-shell-environment.ts
const GIT_CONFIG_PARAMETERS = "GIT_CONFIG_PARAMETERS";
function matchesGitConfigParameters(pattern) {
	const escaped = pattern.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
	return new RegExp(`^${escaped.replaceAll("*", ".*").replaceAll("?", ".")}$`, "iu").test(GIT_CONFIG_PARAMETERS);
}
/** Retain native policy beneath request overrides before applying host-owned values. */
function mergeCodexNativeShellEnvironment(config, nativePolicy) {
	return isJsonObject(nativePolicy) ? mergeCodexThreadConfigs({ shell_environment_policy: Object.fromEntries(Object.entries(nativePolicy).filter(([, value]) => value !== null)) }, config) : config;
}
/** Applies host-selected values and any required login-shell restriction last. */
function applyCodexManagedShellEnvironment(config, environment, disableLoginShell = false, pathPrepend, gitConfigParameters) {
	const hasEnvironment = environment !== void 0 && Object.keys(environment).length > 0;
	if (!hasEnvironment && !gitConfigParameters) return disableLoginShell ? {
		...config,
		allow_login_shell: false
	} : config;
	const current = isJsonObject(config.shell_environment_policy) ? config.shell_environment_policy : {};
	const currentSet = isJsonObject(current.set) ? current.set : {};
	const managedEnvironment = { ...environment };
	const includeOnly = Array.isArray(current.include_only) ? current.include_only.filter((entry) => typeof entry === "string") : [];
	const filters = isJsonObject(current.filters) ? current.filters : void 0;
	if (gitConfigParameters) {
		const include = filters ? Object.keys(filters).filter((pattern) => filters[pattern] === "include") : includeOnly;
		const exclude = filters ? Object.keys(filters).filter((pattern) => filters[pattern] === "exclude") : Array.isArray(current.exclude) ? current.exclude.filter((entry) => typeof entry === "string") : [];
		const aliases = Object.keys(currentSet).filter((key) => key === GIT_CONFIG_PARAMETERS || process.platform === "win32" && key.toUpperCase() === GIT_CONFIG_PARAMETERS);
		const authoredKey = aliases.includes(GIT_CONFIG_PARAMETERS) ? GIT_CONFIG_PARAMETERS : aliases[0];
		const includesParameters = include.length === 0 || include.some(matchesGitConfigParameters);
		const inheritsParameters = current.inherit !== "none" && current.inherit !== "core" && !exclude.some(matchesGitConfigParameters) && includesParameters;
		if (authoredKey !== void 0 || !inheritsParameters) {
			const base = authoredKey !== void 0 && includesParameters ? currentSet[authoredKey] : void 0;
			const composed = appendCodexGitConfigParameters(typeof base === "string" ? base : void 0, gitConfigParameters);
			for (const name of [GIT_CONFIG_PARAMETERS, ...aliases]) managedEnvironment[name] = composed;
		}
	}
	if (pathPrepend?.length) for (const key of Object.keys(environment ?? {})) {
		if (key.toUpperCase() !== "PATH") continue;
		const aliases = Object.keys(currentSet).filter((name) => name === key || process.platform === "win32" && name.toUpperCase() === "PATH");
		const authoredKey = aliases.includes(key) ? key : aliases[0];
		if (authoredKey !== void 0 && typeof currentSet[authoredKey] === "string") {
			const merged = normalizeUniqueStringEntries([...pathPrepend, ...currentSet[authoredKey].split(path.delimiter)]).join(path.delimiter);
			for (const name of [key, ...aliases]) managedEnvironment[name] = merged;
		}
	}
	const names = Object.keys(managedEnvironment).toSorted();
	const hasIncludeFilter = filters && Object.values(filters).includes("include");
	const managedFilterNames = new Set(names.map((name) => name.toLowerCase()));
	const managedConfig = {
		...config,
		shell_environment_policy: {
			...current,
			...hasEnvironment ? { experimental_use_profile: false } : {},
			set: {
				...currentSet,
				...managedEnvironment
			},
			...filters ? hasIncludeFilter ? { filters: {
				...Object.fromEntries(Object.entries(filters).filter(([name]) => !managedFilterNames.has(name.toLowerCase()))),
				...Object.fromEntries([...managedFilterNames].map((name) => [name, "include"]))
			} } : {} : includeOnly.length > 0 ? { include_only: [.../* @__PURE__ */ new Set([...includeOnly, ...names])] } : {}
		}
	};
	return disableLoginShell ? {
		...managedConfig,
		allow_login_shell: false
	} : managedConfig;
}
// extensions/codex/src/app-server/web-search.ts
const CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG = {
	"features.standalone_web_search": false,
	web_search: "disabled"
};
function buildCodexNativeWebSearchThreadConfig(config, standalone = false) {
	const nativeConfig = config?.tools?.web?.search?.openaiCodex;
	const threadConfig = {
		"features.standalone_web_search": standalone,
		web_search: nativeConfig?.mode === "live" ? "live" : "cached"
	};
	const allowedDomains = normalizeUniqueTrimmedStringList(nativeConfig?.allowedDomains);
	if (allowedDomains.length > 0) threadConfig["tools.web_search.allowed_domains"] = allowedDomains;
	if (nativeConfig?.contextSize) threadConfig["tools.web_search.context_size"] = nativeConfig.contextSize;
	for (const key of [
		"country",
		"region",
		"city",
		"timezone"
	]) {
		const value = normalizeOptionalString(nativeConfig?.userLocation?.[key]);
		if (value) threadConfig[`tools.web_search.location.${key}`] = value;
	}
	return threadConfig;
}
function resolveCodexWebSearchPlan(params) {
	const managedPlan = (suppressManagedWebSearch) => ({
		kind: suppressManagedWebSearch ? "disabled" : "managed",
		suppressManagedWebSearch,
		threadConfig: CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG
	});
	if (params.disableTools === true || params.webSearchAllowed === false || params.config?.tools?.web?.search?.enabled === false) return managedPlan(true);
	const nativeConfig = params.config?.tools?.web?.search?.openaiCodex;
	const managedSearchExplicit = normalizeOptionalString(params.config?.tools?.web?.search?.provider) !== void 0 || nativeConfig?.enabled === false;
	const nativeProviderSupportsSearch = params.nativeProviderWebSearchSupport === void 0 || params.nativeProviderWebSearchSupport === "supported" || params.nativeProviderWebSearchSupport === "standalone";
	if (!(params.nativeToolSurfaceEnabled !== false && nativeProviderSupportsSearch && !managedSearchExplicit)) return managedPlan(!managedSearchExplicit && normalizeUniqueTrimmedStringList(nativeConfig?.allowedDomains).length > 0);
	return {
		kind: "native-hosted",
		suppressManagedWebSearch: true,
		threadConfig: buildCodexNativeWebSearchThreadConfig(params.config, params.nativeProviderWebSearchSupport === "standalone"),
		webFetchHostnameAllowlist: buildHostnameAllowlistPolicyFromSuffixAllowlist(nativeConfig?.allowedDomains)?.hostnameAllowlist
	};
}
// extensions/codex/src/app-server/thread-mcp-attestation.ts
async function attestCodexRestrictedToolSurfaceMcpServersDisabled(client, threadId, threadConfig, signal, expectedActiveServerNames = []) {
	const configuredServers = threadConfig?.mcp_servers;
	if (configuredServers !== void 0 && !isJsonObject(configuredServers)) throw new Error("Codex restricted-tool-surface thread config has invalid mcp_servers");
	const expectedServers = /* @__PURE__ */ new Map();
	for (const [name, serverConfig] of Object.entries(configuredServers ?? {})) {
		if (!isJsonObject(serverConfig) || serverConfig.enabled !== false) throw new Error(`Codex restricted-tool-surface MCP server ${name} is not disabled`);
		expectedServers.set(name, "disabled");
	}
	for (const name of expectedActiveServerNames) {
		if (expectedServers.get(name) === "disabled") throw new Error(`Codex restricted-tool-surface MCP server ${name} has conflicting policy`);
		expectedServers.set(name, "active");
	}
	const response = await client.request("mcpServerStatus/list", {
		threadId,
		detail: "toolsAndAuthOnly"
	}, { signal });
	if (!isJsonObject(response) || !Array.isArray(response.data)) throw new Error("Codex mcpServerStatus/list returned an invalid restricted-tool-surface attestation");
	const observedServerNames = /* @__PURE__ */ new Set();
	for (const status of response.data) {
		if (!isJsonObject(status) || typeof status.name !== "string" || !isJsonObject(status.tools)) throw new Error("Codex mcpServerStatus/list returned an invalid restricted-tool-surface server");
		let failure;
		if (!expectedServers.has(status.name)) failure = "found unexpected";
		else if (observedServerNames.has(status.name)) failure = "returned duplicate";
		else if (!Object.hasOwn(status, "serverInfo")) failure = "returned malformed";
		else if (expectedServers.get(status.name) === "active") {
			if (status.serverInfo === null || Object.keys(status.tools).length === 0) failure = "found inactive admitted";
		} else if (status.serverInfo !== null) failure = "found active";
		else if (Object.keys(status.tools).length > 0) failure = "found tools for";
		if (failure) throw new Error(`Codex restricted-tool-surface MCP attestation ${failure} server ${status.name}`);
		observedServerNames.add(status.name);
	}
	for (const [expectedName, state] of expectedServers) if (!observedServerNames.has(expectedName)) throw new Error(`Codex restricted-tool-surface MCP attestation is missing ${state === "active" ? "admitted " : ""}server ${expectedName}`);
	if (response.nextCursor !== void 0 && response.nextCursor !== null) throw new Error("Codex mcpServerStatus/list returned an invalid empty-page cursor");
}
const CODEX_CODE_MODE_THREAD_CONFIG = {
	"features.code_mode": true,
	"features.code_mode_only": false,
	"features.shell_tool": true,
	"features.apply_patch_streaming_events": true,
	suppress_unstable_features_warning: true
};
const CODEX_NO_PROJECT_DOCS_CONFIG = { project_doc_max_bytes: 0 };
const CODEX_DELEGATION_DISABLED_THREAD_CONFIG = {
	"agents.enabled": false,
	"features.multi_agent": false,
	"features.multi_agent_v2": false
};
const CODEX_RING_ZERO_RESTRICTED_FEATURES = /* @__PURE__ */ new Set([
	"apps",
	"artifact",
	"browser_use",
	"browser_use_external",
	"browser_use_full_cdp_access",
	"chronicle",
	"code_mode",
	"code_mode_only",
	"computer_use",
	"context_management",
	"current_time_reminder",
	"default_mode_request_user_input",
	"deferred_executor",
	"goals",
	"hooks",
	"image_generation",
	"memories",
	"multi_agent",
	"multi_agent_v2",
	"plugins",
	"request_permissions_tool",
	"skill_search",
	"shell_tool",
	"standalone_web_search",
	"token_budget",
	"unified_exec",
	"view_image",
	"web_search_cached",
	"web_search_request",
	"workspace_dependencies"
]);
const CODEX_RING_ZERO_THREAD_CONFIG = {
	...CODEX_DELEGATION_DISABLED_THREAD_CONFIG,
	...Object.fromEntries([...CODEX_RING_ZERO_RESTRICTED_FEATURES].map((feature) => [`features.${feature}`, false])),
	"orchestrator.mcp.enabled": false,
	"orchestrator.skills.enabled": false,
	"skills.bundled.enabled": false,
	"skills.include_instructions": false,
	"tools.experimental_request_user_input.enabled": false,
	hooks: {
		PreToolUse: [],
		PermissionRequest: [],
		PostToolUse: [],
		PreCompact: [],
		PostCompact: [],
		SessionStart: [],
		UserPromptSubmit: [],
		SubagentStart: [],
		SubagentStop: [],
		Stop: []
	},
	notify: [],
	web_search: "disabled"
};
const CODEX_RING_ZERO_RESTRICTED_FEATURE_ALIASES = /* @__PURE__ */ new Map([
	["connectors", "apps"],
	["imagegenext", "image_generation"],
	["collab", "multi_agent"],
	["memory_tool", "memories"],
	["telepathy", "chronicle"],
	["codex_hooks", "hooks"]
]);
/** Common deterministic start/resume/fork fields; no run resources or unsupported setters. */
function buildCodexThreadConfiguration(params, options) {
	const runtimeConfig = buildCodexRuntimeThreadConfigForRun(params, options.config, {
		...options,
		directOnlyToolNamespaces: resolveDirectOnlyToolNamespaces(options.dynamicTools)
	});
	const config = usesManagedCollaboration(params, options) ? {
		...runtimeConfig,
		include_collaboration_mode_instructions: false
	} : runtimeConfig;
	const developerInstructions = joinPresentSections(buildCodexThreadGenericInstructions(params, {
		...options,
		config
	}), options.refreshableInstructions);
	options.onDeveloperInstructions?.(developerInstructions);
	return {
		...options.cwd !== void 0 ? { cwd: options.cwd } : {},
		...options.appServer.sessionRoot ? { runtimeWorkspaceRoots: [options.appServer.sessionRoot] } : {},
		approvalPolicy: options.appServer.approvalPolicy,
		approvalsReviewer: resolveCodexThreadApprovalsReviewer(options.appServer, options.config),
		...codexThreadSandboxOrPermissions(options.appServer),
		...options.appServer.serviceTier !== void 0 ? { serviceTier: options.appServer.serviceTier } : {},
		config,
		developerInstructions
	};
}
/** The same immutable policy must reach native context and the incognito drift guard. */
function buildCodexThreadGenericInstructions(params, options) {
	return joinPresentSections(options.developerInstructions ?? buildDeveloperInstructions(params, {
		dynamicTools: options.dynamicTools,
		nativeCodeModeEnabled: options.nativeCodeModeEnabled !== false,
		nativeCodeModeOnlyEnabled: options.config?.["features.code_mode_only"] === true,
		hostSystemAgentActive: options.hostSystemAgentActive
	}), usesManagedCollaboration(params, options) ? buildCodexDefaultCollaborationPolicy(options.config ?? {}, options.nativeConfig) : void 0);
}
async function buildThreadStartParams(params, options) {
	const resolvedModelProvider = await resolveCodexAppServerModelProvider({
		...params,
		homeScope: options.appServer.start.homeScope
	});
	const modelSelection = await resolveCodexAppServerRequestModelSelection({
		...params,
		homeScope: options.appServer.start.homeScope,
		model: options.model ?? params.modelId,
		modelProvider: options.modelProvider ?? resolvedModelProvider
	});
	const configuration = buildCodexThreadConfiguration(params, options);
	return {
		...modelSelection,
		...configuration,
		...placeCodexBaseInstructions(params, options, configuration.developerInstructions, { baseInstructions: "" }),
		personality: CODEX_NATIVE_PERSONALITY_NONE,
		serviceName: "OpenClaw",
		threadSource: "openclaw",
		...params.requireWorkspaceOnly === true || options.nativeCodeModeEnabled === false ? { environments: [] } : options.environmentSelection ? { environments: options.environmentSelection } : {},
		dynamicTools: [...options.dynamicTools],
		experimentalRawEvents: true,
		...isIncognitoSessionKey(params.sessionKey) ? { ephemeral: true } : {}
	};
}
async function buildThreadResumeParams(params, options) {
	const modelSelection = options.preserveNativeModel ? void 0 : await resolveCodexAppServerRequestModelSelection({
		...params,
		homeScope: options.appServer.start.homeScope,
		model: options.model ?? params.modelId,
		modelProvider: options.modelProvider ?? await resolveCodexAppServerModelProvider({
			...params,
			homeScope: options.appServer.start.homeScope,
			authProfileId: options.authProfileId ?? params.authProfileId
		}),
		authProfileId: options.authProfileId ?? params.authProfileId
	});
	const configuration = buildCodexThreadConfiguration(params, options);
	return {
		threadId: options.threadId,
		excludeTurns: true,
		initialTurnsPage: {
			limit: 1,
			sortDirection: "desc",
			itemsView: "notLoaded"
		},
		...modelSelection,
		...configuration,
		...placeCodexBaseInstructions(params, options, configuration.developerInstructions, {}),
		personality: CODEX_NATIVE_PERSONALITY_NONE
	};
}
function buildCodexRuntimeThreadConfig(config, options = {}) {
	const enabled = options.nativeCodeModeEnabled !== false;
	const codeModeOnly = options.nativeCodeModeOnlyEnabled === true;
	const merged = expectDefined(mergeCodexThreadConfigs({ "features.reasoning_effort_override": true }, enabled ? {
		...CODEX_CODE_MODE_THREAD_CONFIG,
		"features.code_mode_only": codeModeOnly
	} : void 0, buildCodexProjectDocThreadConfig(config), {
		"features.tool_suggest": false,
		"features.recommended_plugins": false,
		"features.goals": false,
		"tools.update_plan.enabled": false,
		...!enabled ? {
			"features.code_mode": false,
			"features.code_mode_only": false,
			"features.shell_tool": false,
			"features.unified_exec": false
		} : codeModeOnly ? { "features.code_mode_only": true } : {}
	}), !enabled ? "Codex disabled code mode config" : codeModeOnly ? "Codex code mode only config" : "Codex code mode config");
	if (!enabled) {
		delete merged["features.apply_patch_streaming_events"];
		return merged;
	}
	return ensureDirectOnlyToolNamespaces(merged, options.directOnlyToolNamespaces);
}
function hasNativeQuestionOptIn(config, nativeConfig) {
	return ["tools.experimental_request_user_input.enabled", "features.default_mode_request_user_input"].some((key) => {
		const authored = readCodexConfigValue(config, key);
		if (authored !== void 0) return authored === true;
		return nativeConfig !== void 0 && readCodexAuthoredConfigValue(nativeConfig, key) === true;
	});
}
function ensureDirectOnlyToolNamespaces(config, requiredNamespaces) {
	if (!requiredNamespaces?.length) return config;
	const feature = expectDefined(config["features.code_mode"], "Codex code mode config");
	const configured = isJsonObject(feature) ? feature : { enabled: feature };
	const namespaces = Array.isArray(configured.direct_only_tool_namespaces) ? configured.direct_only_tool_namespaces.filter((entry) => typeof entry === "string" && entry.length > 0) : [];
	return {
		...config,
		"features.code_mode": {
			...configured,
			direct_only_tool_namespaces: [.../* @__PURE__ */ new Set([...namespaces, ...requiredNamespaces])]
		}
	};
}
function resolveDirectOnlyToolNamespaces(dynamicTools) {
	return (dynamicTools ?? []).filter((tool) => tool.type === "namespace" && tool.name === "openclaw_direct").map((tool) => tool.name);
}
function isCodexNativeDelegationDisabledForRun(params, hostSystemAgentActive = isHostScopedAgentToolActive("openclaw")) {
	return isCodexResponsesOAuthRun(params) || params.delegationCapability === "report_only" || params.delegationCapability === "host_only" || params.requireWorkspaceOnly === true || params.pluginHarnessToolPolicyRestricted === true || deniesCodexNativeDelegation(params.pluginHarnessToolPolicySafeDeniedTools) || isMessageOnlyCodexSourceReply(params) || hostSystemAgentActive && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow);
}
function buildCodexRuntimeThreadConfigForRun(params, config, options = {}) {
	const ringZeroActive = (options.hostSystemAgentActive ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow);
	const messageOnlySourceReply = isMessageOnlyCodexSourceReply(params);
	const restrictedToolSurface = ringZeroActive || messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted === true || params.requireWorkspaceOnly === true;
	const restrictedTurnDisablesProjectDocs = ringZeroActive || messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted && params.disableTools;
	const configMcpServers = config?.mcp_servers;
	if (restrictedToolSurface && configMcpServers !== void 0 && !isJsonObject(configMcpServers)) throw new Error("Codex restricted tool surface received invalid thread mcp_servers config");
	const restrictedToolSurfaceMcpServerNames = [...options.restrictedToolSurfaceInheritedMcpServerNames ?? [], ...isJsonObject(configMcpServers) ? Object.keys(configMcpServers) : []];
	const webSearchConfig = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: isCodexResponsesOAuthRun(params) || options.nativeCodeModeEnabled,
		nativeProviderWebSearchSupport: options.nativeProviderWebSearchSupport,
		webSearchAllowed: options.webSearchAllowed
	}).threadConfig;
	const baseConfig = buildCodexRuntimeThreadConfig(mergeCodexThreadConfigs(config, webSearchConfig), options);
	return applyCodexManagedShellEnvironment({
		...mergeCodexThreadConfigs(baseConfig, options.appServer?.networkProxy?.configPatch, options.askUserAvailable && !hasNativeQuestionOptIn(baseConfig, options.nativeConfig) ? { "tools.experimental_request_user_input.enabled": false } : void 0, isCodexNativeDelegationDisabledForRun(params, options.hostSystemAgentActive) ? CODEX_DELEGATION_DISABLED_THREAD_CONFIG : void 0, isCodexResponsesOAuthRun(params) ? {
			"features.apps": false,
			"features.plugins": false,
			"features.image_generation": false,
			"features.memories": false,
			"features.skill_search": false,
			"orchestrator.skills.enabled": false,
			"orchestrator.mcp.enabled": false,
			"skills.bundled.enabled": false
		} : void 0, params.pluginHarnessToolPolicySafeDeniedTools?.includes("image_generate") ? { "features.image_generation": false } : void 0, shouldDisableCodexToolSearchForModel(params.modelId) ? { "features.multi_agent": false } : void 0, messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted === true || params.requireWorkspaceOnly === true ? buildRestrictedToolConfigPatch(restrictedToolSurfaceMcpServerNames, Boolean(params.scheduledRuntimeAuthority) && !isCodexResponsesOAuthRun(params) && params.requireWorkspaceOnly !== true) : buildCodexRingZeroThreadConfigPatch(params, options.hostSystemAgentActive, restrictedToolSurfaceMcpServerNames), restrictedTurnDisablesProjectDocs ? CODEX_NO_PROJECT_DOCS_CONFIG : void 0, params.authoredContextTokenCap === void 0 ? void 0 : { model_context_window: params.authoredContextTokenCap }) ?? baseConfig,
		...params.bootstrapContextMode === "lightweight" ? CODEX_NO_PROJECT_DOCS_CONFIG : {}
	}, options.shellEnvironment, options.disableLoginShell, options.shellPathPrepend, options.shellGitConfigParameters);
}
function buildCodexRingZeroThreadConfigPatch(params, hostSystemAgentActive = isHostScopedAgentToolActive("openclaw"), inheritedMcpServerNames = []) {
	if (!hostSystemAgentActive || !isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow)) return;
	return {
		...buildRestrictedToolConfigPatch(inheritedMcpServerNames),
		...CODEX_NO_PROJECT_DOCS_CONFIG
	};
}
function buildRestrictedToolConfigPatch(inheritedMcpServerNames, scheduledAppAuthorityActive = false) {
	const mcpServers = Object.fromEntries([...new Set(inheritedMcpServerNames)].toSorted().map((name) => [name, { enabled: false }]));
	return {
		...CODEX_RING_ZERO_THREAD_CONFIG,
		...scheduledAppAuthorityActive ? {
			"features.apps": true,
			"orchestrator.mcp.enabled": true
		} : {},
		...Object.keys(mcpServers).length > 0 ? { mcp_servers: mcpServers } : {}
	};
}
async function readCodexInheritedMcpServerNames(client, cwd, signal, effectiveConfig) {
	const response = effectiveConfig ?? await readCodexEffectiveConfig(client, cwd, { signal });
	if (!Array.isArray(response.layers)) throw new Error("Codex config/read omitted effective config layers");
	for (const layer of response.layers) {
		if (!isJsonObject(layer) || !isJsonObject(layer.name) || typeof layer.name.type !== "string") throw new Error("Codex config/read returned invalid effective config layers");
		if (layer.name.type === "legacyManagedConfigTomlFromFile" || layer.name.type === "legacyManagedConfigTomlFromMdm") {
			const migrationGuidance = layer.name.type === "legacyManagedConfigTomlFromFile" ? "migrate /etc/codex/managed_config.toml to /etc/codex/requirements.toml before running restricted or isolated turns. For ChatGPT-only authentication, use allowed_login_methods = [\"chatgpt\"] in /etc/codex/requirements.toml" : "replace the legacy MDM payload with base64-encoded TOML requirements in the com.openai.codex managed preference requirements_toml_base64 before running restricted or isolated turns. For ChatGPT-only authentication, include allowed_login_methods = [\"chatgpt\"] in that TOML payload";
			throw new Error(`Codex restricted tool surface cannot override config layer ${layer.name.type}; ${migrationGuidance}.`);
		}
		if (!CODEX_SESSION_OVERRIDABLE_LAYER_TYPES.has(layer.name.type)) throw new Error(`Codex restricted tool surface does not recognize config layer ${layer.name.type}`);
	}
	const configuredServers = response.config.mcp_servers;
	if (configuredServers === void 0) return [];
	if (!isJsonObject(configuredServers)) throw new Error("Codex config/read returned invalid mcp_servers");
	return Object.keys(configuredServers).toSorted();
}
async function assertCodexManagedRequirementsDoNotOverrideToolPolicy(client, options, signal) {
	const requirements = await readCodexManagedRequirements(client, signal);
	const managedRequirementsFingerprint = buildCodexManagedRequirementsFingerprint(requirements);
	const managedRequirementsMatch = options.allowedManagedRequirementsFingerprint !== void 0 && managedRequirementsFingerprint === options.allowedManagedRequirementsFingerprint;
	const managedHooksAllowed = managedRequirementsMatch || options.allowConfiguredManagedHooks === true;
	if (options.allowedManagedRequirementsFingerprint !== void 0 && !managedRequirementsMatch) throw new Error("Codex managed requirements changed since this automation was authorized; reauthorize the automation from a fresh owner turn");
	if (requirements === null) return { enableManagedHooks: managedHooksAllowed && options.privateManagedHooksPresent === true };
	let hasManagedHooks = false;
	let requiredHooksEnabled;
	if (options.restrictedToolSurface) for (const key of [
		"hooks",
		"managedHooks",
		"managed_hooks"
	]) {
		const hooks = requirements[key];
		if (hooks === void 0 || hooks === null) continue;
		if (!isJsonObject(hooks)) throw new Error("Codex configRequirements/read returned invalid managed hooks");
		hasManagedHooks ||= hasNonEmptyJsonValue(hooks);
		if (hasManagedHooks && !managedHooksAllowed) throw new Error("Codex restricted tool surface cannot override managed hooks");
	}
	const additionalDeniedFeatures = new Set(options.additionalDeniedFeatures);
	for (const key of ["featureRequirements", "feature_requirements"]) {
		const featureRequirements = requirements[key];
		if (featureRequirements === void 0 || featureRequirements === null) continue;
		if (!isJsonObject(featureRequirements)) throw new Error("Codex configRequirements/read returned invalid feature requirements");
		for (const [feature, enabled] of Object.entries(featureRequirements)) {
			if (typeof enabled !== "boolean") throw new Error("Codex configRequirements/read returned invalid feature requirements");
			const canonicalFeature = CODEX_RING_ZERO_RESTRICTED_FEATURE_ALIASES.get(feature) ?? feature;
			if (options.requiredNativeShell && canonicalFeature === "shell_tool" && !enabled) throw new Error("Codex native code mode requires shell_tool, but managed requirements disable it. Ask your administrator to allow the shell, or select a tool policy that disables native code mode; no automation authority was captured.");
			const deniedByToolPolicy = options.restrictedToolSurface && CODEX_RING_ZERO_RESTRICTED_FEATURES.has(canonicalFeature) || additionalDeniedFeatures.has(canonicalFeature);
			if (canonicalFeature === "hooks" && managedHooksAllowed) {
				requiredHooksEnabled = enabled;
				continue;
			}
			if (enabled && deniedByToolPolicy) throw new Error(`Codex tool policy cannot override required feature ${feature}`);
		}
	}
	return { enableManagedHooks: managedHooksAllowed && requiredHooksEnabled !== false && (hasManagedHooks || options.privateManagedHooksPresent === true || requiredHooksEnabled === true) };
}
/** Hashes the exact managed requirements without retaining their hook commands or policy details. */
function buildCodexManagedRequirementsFingerprint(requirements) {
	const fingerprint = fingerprintJsonObject({
		version: 1,
		requirements
	});
	return crypto.createHash("sha256").update(fingerprint).digest("hex");
}
/** Reads and fingerprints the exact managed requirements active on this app-server. */
async function readCodexManagedRequirementsFingerprint(client, signal) {
	return buildCodexManagedRequirementsFingerprint(await readCodexManagedRequirements(client, signal));
}
async function readCodexManagedRequirements(client, signal) {
	const response = await client.request("configRequirements/read", void 0, { signal });
	if (!isJsonObject(response) || !Object.hasOwn(response, "requirements")) throw new Error("Codex configRequirements/read returned an invalid response");
	if (response.requirements !== null && !isJsonObject(response.requirements)) throw new Error("Codex configRequirements/read returned invalid requirements");
	return response.requirements;
}
function hasNonEmptyJsonValue(value) {
	if (value === null || value === false || value === "") return false;
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === "object") return Object.values(value).some(hasNonEmptyJsonValue);
	return true;
}
function resolveCodexThreadApprovalsReviewer(appServer, config) {
	return config?.approvals_reviewer === "user" ? "user" : appServer.approvalsReviewer;
}
function codexThreadSandboxOrPermissions(appServer) {
	if (appServer.networkProxy) return {};
	return { sandbox: appServer.sandbox };
}
export { fingerprintRestrictedThreadConfig as A, joinPresentSections as B, areCodexDynamicToolFingerprintsCompatible as C, fingerprintCodexThreadConfig as D, codexLegacyDynamicToolsFingerprint as E, stabilizeJsonValue as F, isTransientWebSearchRestriction as I, shouldRecheckRecoverablePluginBinding as L, legacyFingerprintUserMcpServersConfigPatch as M, readActiveCodexTurnIdsFromResume as N, fingerprintEnvironmentSelection as O, shouldStartTransientNoToolThread as P, shouldRotateCodexAppServerBindingForRuntime as R, splitCodexExtraSystemPrompt as S, codexDynamicToolsFingerprint as T, renderCodexThreadPolicy as V, mergeCodexNativeShellEnvironment as _, buildCodexThreadConfiguration as a, hasAuthoredCodexBaseInstructions as b, buildThreadStartParams as c, readCodexInheritedMcpServerNames as d, readCodexManagedRequirementsFingerprint as f, resolveCodexWebSearchPlan as g, buildCodexNativeWebSearchThreadConfig as h, buildCodexRuntimeThreadConfigForRun as i, fingerprintUserMcpServersConfigPatch as j, fingerprintJsonObject as k, codexThreadSandboxOrPermissions as l, attestCodexRestrictedToolSurfaceMcpServersDisabled as m, buildCodexRingZeroThreadConfigPatch as n, buildCodexThreadGenericInstructions as o, resolveCodexThreadApprovalsReviewer as p, buildCodexRuntimeThreadConfig as r, buildThreadResumeParams as s, assertCodexManagedRequirementsDoNotOverrideToolPolicy as t, isCodexNativeDelegationDisabledForRun as u, buildCodexConversationTurnInstructions as v, areUserMcpServersFingerprintsCompatible as w, resolveCodexOpenClawBaseInstructions as x, buildDeveloperInstructions as y, shouldRotateCodexGpt56MultiAgentBinding as z };
