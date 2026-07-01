import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { a as isSubagentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-mDjiWzE5.js";
import "./config-A41fTHlt.js";
import { B as readGeminiCliCredentialsCached, R as readClaudeCliCredentialsCached, c as loadAuthProfileStoreForRuntime, z as readCodexCliCredentialsCached } from "./store-SfOB_T2S.js";
import { n as applyPluginTextReplacements } from "./text-transforms.runtime-CL4fWOoA.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { o as resolveContextEngine } from "./registry-BLZQzICr.js";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader-CTbRJu45.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { n as resolveApiKeyForProfile } from "./oauth-De-NOeYf.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DX_pyqms.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import { n as annotateInterSessionPromptText } from "./input-provenance-CQSqbDss.js";
import { o as resolveContextTokensForModel } from "./context-CDxACcUL.js";
import { i as resolveCliBackendConfig } from "./cli-backends-DgIbZRGR.js";
import { i as buildGenericCliContextEngineHostSupport, r as assertContextEngineHostSupport } from "./host-compat-BibWlia2.js";
import { n as ensureSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-ugCMMoT5.js";
import { c as resolveSkillsPromptForRun } from "./workspace-CD16JXyF.js";
import { n as resolveSandboxSkillRuntimeInputs, r as resolveEmbeddedRunSkillEntries, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-BtkGHoiR.js";
import { b as resolveBootstrapTotalMaxChars, v as resolveBootstrapMaxChars, y as resolveBootstrapPromptTruncationWarningMode } from "./embedded-agent-helpers-D_zioqUQ.js";
import { a as hashCliSessionText, o as resolveCliSessionReuse } from "./cli-session-Despdu3U.js";
import { t as ensureContextEnginesInitialized } from "./init-CDaZrR6K.js";
import { a as ensureSandboxWorkspaceForSession } from "./sandbox-yDmlXhAz.js";
import { i as buildBootstrapPromptWarning, o as buildBootstrapTruncationReportMeta, r as buildBootstrapInjectionStats, t as analyzeBootstrapBudget } from "./bootstrap-budget-DFC5I5_X.js";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn } from "./bootstrap-files-CAlSvEMW.js";
import { t as resolveHeartbeatPromptForSystemPrompt } from "./heartbeat-system-prompt-QFOE5bY3.js";
import { n as appendModelIdentitySystemPrompt, r as buildModelIdentityPromptLine } from "./system-prompt-config-B-qy6WRv.js";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-DCktltnb.js";
import { t as buildSystemPromptReport } from "./system-prompt-report-B8U8oIiA.js";
import { a as prependSystemPromptAddition, c as resolvePromptBuildHookResult, s as resolveAttemptMediaTaskSystemPromptAddition } from "./attempt.prompt-helpers-DDgt5pJ1.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-D9hRipzD.js";
import { n as composeSystemPromptWithHookContext } from "./attempt.thread-helpers-C6oRA5x8.js";
import { t as buildCurrentInboundPrompt } from "./runtime-context-prompt-DZBu1U-o.js";
import { n as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-D4VtuyKe.js";
import { r as cliBackendLog } from "./log-CRVu7uZX.js";
import { c as buildCliSessionHistoryPrompt, d as loadCliSessionHistoryMessages, f as loadCliSessionReseedMessages, l as hasCliSessionTranscript, n as claudeCliSessionTranscriptHasContent, p as resolveAutoCliSessionReseedHistoryChars, r as claudeCliSessionTranscriptHasOrphanedToolUse } from "./attempt-execution.helpers-D6D1aACa.js";
import { a as getActiveMcpLoopbackRuntime, f as resolveMcpLoopbackBearerToken, i as createMcpLoopbackServerConfig } from "./mcp-http.loopback-runtime-BpVNcmOc.js";
import { a as normalizeCliModel, g as prepareCliBundleMcpConfig, n as buildCliAgentSystemPrompt } from "./helpers-BzYZgY8B.js";
import { t as prepareClaudeCliSkillsPlugin } from "./claude-skills-plugin-CBS2t43u.js";
import { i as resolveMcpLoopbackScopedTools, n as ensureMcpLoopbackServer } from "./mcp-http-CQSztfdP.js";
import crypto from "node:crypto";
//#region src/plugin-sdk/anthropic-cli.ts
function loadFacadeModule() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "anthropic",
		artifactBasename: "api.js"
	});
}
loadFacadeModule()["CLAUDE_CLI_BACKEND_ID"];
/** Returns whether a provider id belongs to the Claude CLI backend family. */
const isClaudeCliProvider = ((...args) => loadFacadeModule()["isClaudeCliProvider"](...args));
const cliAuthEpochDeps = {
	readClaudeCliCredentialsCached,
	readCodexCliCredentialsCached,
	readGeminiCliCredentialsCached,
	loadAuthProfileStoreForRuntime
};
const GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
function hashCliAuthEpochPart(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
function encodeUnknown(value) {
	return JSON.stringify(value ?? null);
}
function encodeOAuthIdentity(credential) {
	return JSON.stringify([
		"oauth",
		credential.provider,
		credential.clientId ?? null,
		credential.email ?? null,
		credential.enterpriseUrl ?? null,
		credential.projectId ?? null,
		credential.accountId ?? null
	]);
}
function encodeClaudeCredential(credential) {
	return encodeOAuthIdentity({
		type: "oauth",
		provider: credential.provider
	});
}
function encodeCodexCredential(credential) {
	return encodeOAuthIdentity(credential);
}
function encodeGeminiCredential(credential) {
	return encodeOAuthIdentity(credential);
}
function encodeAuthProfileCredential(credential) {
	switch (credential.type) {
		case "api_key": return JSON.stringify([
			"api_key",
			credential.provider,
			credential.key ?? null,
			encodeUnknown(credential.keyRef),
			credential.email ?? null,
			credential.displayName ?? null,
			encodeUnknown(credential.metadata)
		]);
		case "token":
			if (credential.tokenRef !== void 0) return JSON.stringify([
				"token-identity",
				credential.provider,
				encodeUnknown(credential.tokenRef),
				credential.email ?? null,
				credential.displayName ?? null
			]);
			return JSON.stringify([
				"token",
				credential.provider,
				credential.token ?? null,
				encodeUnknown(credential.tokenRef),
				credential.email ?? null,
				credential.displayName ?? null
			]);
		case "oauth": return encodeOAuthIdentity(credential);
	}
	throw new Error("Unsupported auth profile credential type");
}
function hasOAuthAccountIdentity(credential) {
	return credential.type === "oauth" && (normalizeOptionalString(credential.accountId) !== void 0 || normalizeOptionalString(credential.email) !== void 0);
}
function encodeAuthProfileEpochPart(authProfileId, credential) {
	const credentialHash = hashCliAuthEpochPart(encodeAuthProfileCredential(credential));
	if (hasOAuthAccountIdentity(credential) && credential.provider !== GEMINI_CLI_PROVIDER_ID) return `profile:oauth-identity:${credentialHash}`;
	return `profile:${authProfileId}:${credentialHash}`;
}
function getLocalCliCredentialFingerprint(provider) {
	switch (provider) {
		case "claude-cli": {
			const credential = cliAuthEpochDeps.readClaudeCliCredentialsCached({
				ttlMs: 5e3,
				allowKeychainPrompt: false
			});
			return credential ? hashCliAuthEpochPart(encodeClaudeCredential(credential)) : void 0;
		}
		case "codex-cli": {
			const credential = cliAuthEpochDeps.readCodexCliCredentialsCached({
				ttlMs: 5e3,
				allowKeychainPrompt: false
			});
			return credential ? hashCliAuthEpochPart(encodeCodexCredential(credential)) : void 0;
		}
		case "google-gemini-cli": {
			const credential = cliAuthEpochDeps.readGeminiCliCredentialsCached({ ttlMs: 5e3 });
			return credential ? hashCliAuthEpochPart(encodeGeminiCredential(credential)) : void 0;
		}
		default: return;
	}
}
function getAuthProfileCredential(store, authProfileId) {
	if (!authProfileId) return;
	return store.profiles[authProfileId];
}
/** Resolves the stable auth epoch hash for a CLI runtime/provider session. */
async function resolveCliAuthEpoch(params) {
	const provider = params.provider.trim();
	const authProfileId = normalizeOptionalString(params.authProfileId);
	const parts = [];
	if (params.skipLocalCredential !== true) {
		const localFingerprint = getLocalCliCredentialFingerprint(provider);
		if (localFingerprint) parts.push(`local:${provider}:${localFingerprint}`);
	}
	if (authProfileId) {
		const credential = getAuthProfileCredential(cliAuthEpochDeps.loadAuthProfileStoreForRuntime(params.agentDir, {
			readOnly: true,
			allowKeychainPrompt: false
		}), authProfileId);
		if (credential) parts.push(encodeAuthProfileEpochPart(authProfileId, credential));
	}
	if (parts.length === 0) return;
	return hashCliAuthEpochPart(parts.join("\n"));
}
//#endregion
//#region src/agents/cli-runner/prepare.ts
/**
* Prepares CLI backend run context: backend config, prompts, bootstrap context,
* MCP, auth epoch, and reusable session metadata.
*/
const prepareDeps = {
	makeBootstrapWarn,
	resolveBootstrapContextForRun,
	getActiveMcpLoopbackRuntime,
	ensureMcpLoopbackServer,
	createMcpLoopbackServerConfig,
	resolveMcpLoopbackBearerToken,
	resolveMcpLoopbackScopedTools,
	resolveOpenClawReferencePaths: async (params) => (await import("./docs-path-DzOaLBHe.js")).resolveOpenClawReferencePaths(params),
	prepareClaudeCliSkillsPlugin,
	claudeCliSessionTranscriptHasContent,
	claudeCliSessionTranscriptHasOrphanedToolUse,
	resolveApiKeyForProfile
};
async function resolveCliSkillsPrompt(params) {
	const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
		config: params.config,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	if (!sandboxWorkspace) return resolveSkillsPromptForRun({
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId
	});
	const { skillsEligibility, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
		sandbox: {
			enabled: true,
			...sandboxWorkspace.containerWorkdir ? { containerWorkdir: sandboxWorkspace.containerWorkdir } : {},
			...sandboxWorkspace.skillsEligibility ? { skillsEligibility: sandboxWorkspace.skillsEligibility } : {},
			...sandboxWorkspace.skillsWorkspaceDir ? { skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir } : {},
			...sandboxWorkspace.workspaceAccess ? { workspaceAccess: sandboxWorkspace.workspaceAccess } : {}
		},
		effectiveWorkspace: sandboxWorkspace.workspaceDir,
		skillsSnapshot: params.skillsSnapshot
	});
	const { shouldLoadSkillEntries, skillEntries } = resolveEmbeddedRunSkillEntries({
		workspaceDir: skillsWorkspaceDir,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility,
		skillsSnapshot: skillsSnapshotForRun,
		workspaceOnly
	});
	return resolveSkillsPromptForRun({
		skillsSnapshot: skillsSnapshotForRun,
		entries: mapSandboxSkillEntriesForPrompt({
			entries: shouldLoadSkillEntries ? skillEntries : void 0,
			skillsWorkspaceDir,
			skillsPromptWorkspaceDir
		}),
		workspaceDir: skillsPromptWorkspaceDir,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility
	});
}
const CLAUDE_CLI_CONTEXT_MODEL_ALIASES = {
	opus: "claude-opus-4-8",
	"opus-4.8": "claude-opus-4-8",
	"opus-4-8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4-7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"opus-4-6": "claude-opus-4-6",
	sonnet: "claude-sonnet-4-6",
	"sonnet-4.6": "claude-sonnet-4-6",
	"sonnet-4-6": "claude-sonnet-4-6"
};
function resolveClaudeCliContextModelId(modelId) {
	const trimmed = modelId.trim();
	return CLAUDE_CLI_CONTEXT_MODEL_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}
/** Returns whether profile-owned prepared execution should skip local CLI epoch hashing. */
function shouldSkipLocalCliCredentialEpoch(params) {
	return Boolean(params.authEpochMode === "profile-only" && params.authProfileId && params.authCredential && params.preparedExecution);
}
function shouldRefreshAuthProfileForExecution(params) {
	return Boolean(params.backendId === "google-gemini-cli" && params.authProfileId && (params.authCredential?.type === "oauth" || params.authCredential?.type === "api_key" || params.authCredential?.type === "token"));
}
/** Builds the complete context required to execute a CLI-backed agent run. */
async function prepareCliRunContext(params) {
	const started = Date.now();
	const executionMode = params.executionMode ?? "agent";
	const isSideQuestion = executionMode === "side-question";
	const workspaceResolution = resolveRunWorkspaceDir({
		workspaceDir: params.workspaceDir,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	});
	const resolvedWorkspace = workspaceResolution.workspaceDir;
	const redactedSessionId = redactRunIdentifier(params.sessionId);
	const redactedSessionKey = redactRunIdentifier(params.sessionKey);
	const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
	if (workspaceResolution.usedFallback) cliBackendLog.warn(`[workspace-fallback] caller=runCliAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`);
	const workspaceDir = resolvedWorkspace;
	const cwd = params.cwd ? resolveUserPath(params.cwd) : workspaceDir;
	const cwdHash = hashCliSessionText(cwd);
	const backendResolved = resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId });
	if (!backendResolved) throw new Error(`Unknown CLI backend: ${params.provider}`);
	if (params.toolsAllow !== void 0) throw new Error(`CLI backend ${backendResolved.id} cannot enforce runtime toolsAllow; use an embedded runtime for restricted tool policy`);
	const sideQuestionDisablesNativeTools = isSideQuestion && backendResolved.sideQuestionToolMode === "disabled";
	if (params.disableTools === true && backendResolved.nativeToolMode === "always-on" && !sideQuestionDisablesNativeTools) throw new Error(`CLI backend ${backendResolved.id} cannot run with tools disabled because it exposes native tools`);
	const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = resolveAgentDir(params.config ?? {}, sessionAgentId);
	let effectiveAuthProfileId = (params.authProfileId?.trim() || void 0) ?? backendResolved.defaultAuthProfileId?.trim() ?? void 0;
	let authStore;
	let authCredential;
	const loadScopedAuthStore = (options = {}) => loadAuthProfileStoreForRuntime(agentDir, {
		readOnly: options.readOnly ?? true,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.config,
			provider: params.provider,
			...options.profileId ? { profileId: options.profileId } : {}
		})
	});
	if (effectiveAuthProfileId) {
		authStore = loadScopedAuthStore({ profileId: effectiveAuthProfileId });
		authCredential = authStore.profiles[effectiveAuthProfileId];
	} else if (backendResolved.prepareExecution || backendResolved.authEpochMode === "profile-only") {
		authStore = loadScopedAuthStore();
		effectiveAuthProfileId = resolveAuthProfileOrder({
			cfg: params.config,
			store: authStore,
			provider: params.provider
		})[0]?.trim() || void 0;
		if (effectiveAuthProfileId) authCredential = authStore.profiles[effectiveAuthProfileId];
	}
	if (effectiveAuthProfileId && shouldRefreshAuthProfileForExecution({
		backendId: backendResolved.id,
		authProfileId: effectiveAuthProfileId,
		authCredential
	})) {
		const authProfileId = effectiveAuthProfileId;
		const writableAuthStore = loadScopedAuthStore({
			profileId: authProfileId,
			readOnly: false
		});
		const resolvedAuth = await prepareDeps.resolveApiKeyForProfile({
			cfg: params.config,
			store: writableAuthStore,
			profileId: authProfileId,
			agentDir
		});
		const resolvedAuthProfileId = resolvedAuth?.profileId ?? authProfileId;
		const resolvedAuthCredential = resolvedAuth?.credential;
		authStore = loadScopedAuthStore({ profileId: resolvedAuthProfileId });
		authCredential = resolvedAuthCredential ?? authStore.profiles[resolvedAuthProfileId];
		if (resolvedAuth && authCredential) {
			effectiveAuthProfileId = resolvedAuthProfileId;
			if (authCredential.type === "api_key") authCredential = {
				...authCredential,
				key: resolvedAuth.apiKey
			};
			else if (authCredential.type === "token") authCredential = {
				...authCredential,
				token: resolvedAuth.apiKey
			};
		}
	}
	const extraSystemPrompt = params.extraSystemPrompt?.trim() ?? "";
	const extraSystemPromptHash = params.extraSystemPromptStatic !== void 0 ? hashCliSessionText(params.extraSystemPromptStatic.trim() || void 0) : hashCliSessionText(extraSystemPrompt);
	const requireExplicitMessageTarget = params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey);
	const messageToolPolicyHash = params.sourceReplyDeliveryMode !== void 0 || params.requireExplicitMessageTarget !== void 0 || requireExplicitMessageTarget ? hashCliSessionText(JSON.stringify({
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		requireExplicitMessageTarget
	})) : void 0;
	const modelId = (params.model ?? "default").trim() || "default";
	const normalizedModel = normalizeCliModel(modelId, backendResolved.config);
	const modelDisplay = `${params.provider}/${modelId}`;
	const isClaudeCli = isClaudeCliProvider(params.provider);
	const modelContextTokens = isClaudeCli ? resolveContextTokensForModel({
		cfg: params.config,
		provider: params.provider,
		model: resolveClaudeCliContextModelId(modelId),
		fallbackContextTokens: 2e5,
		allowAsyncLoad: false
	}) : void 0;
	const contextWindowInfo = resolveContextWindowInfo({
		cfg: params.config,
		provider: params.provider,
		modelId,
		modelContextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const autoReseedHistoryChars = isClaudeCli ? resolveAutoCliSessionReseedHistoryChars(contextWindowInfo.tokens) : void 0;
	const sessionLabel = params.sessionKey ?? params.sessionId;
	const { bootstrapFiles, contextFiles } = isSideQuestion ? {
		bootstrapFiles: [],
		contextFiles: []
	} : await prepareDeps.resolveBootstrapContextForRun({
		workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: sessionAgentId,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn: prepareDeps.makeBootstrapWarn({
			sessionLabel,
			workspaceDir,
			warn: (message) => cliBackendLog.warn(message)
		})
	});
	const bootstrapMaxChars = resolveBootstrapMaxChars(params.config, sessionAgentId);
	const bootstrapTotalMaxChars = resolveBootstrapTotalMaxChars(params.config, sessionAgentId);
	const bootstrapAnalysis = analyzeBootstrapBudget({
		files: buildBootstrapInjectionStats({
			bootstrapFiles,
			injectedFiles: contextFiles
		}),
		bootstrapMaxChars,
		bootstrapTotalMaxChars
	});
	const bootstrapPromptWarningMode = resolveBootstrapPromptTruncationWarningMode(params.config);
	const bootstrapPromptWarning = buildBootstrapPromptWarning({
		analysis: bootstrapAnalysis,
		mode: bootstrapPromptWarningMode,
		seenSignatures: params.bootstrapPromptWarningSignaturesSeen,
		previousSignature: params.bootstrapPromptWarningSignature
	});
	const bundleMcpEnabled = !isSideQuestion && backendResolved.bundleMcp && params.disableTools !== true;
	let mcpLoopbackRuntime = bundleMcpEnabled ? prepareDeps.getActiveMcpLoopbackRuntime() : void 0;
	if (bundleMcpEnabled && !mcpLoopbackRuntime) {
		try {
			await prepareDeps.ensureMcpLoopbackServer();
		} catch (error) {
			cliBackendLog.warn(`mcp loopback server failed to start: ${String(error)}`);
		}
		mcpLoopbackRuntime = prepareDeps.getActiveMcpLoopbackRuntime();
	}
	const mcpDeliveryCaptureEnabled = bundleMcpEnabled && Boolean(mcpLoopbackRuntime);
	const preparedBackend = await prepareCliBundleMcpConfig({
		enabled: bundleMcpEnabled,
		mode: backendResolved.bundleMcpMode,
		backend: backendResolved.config,
		workspaceDir,
		config: params.config,
		additionalConfig: mcpLoopbackRuntime ? prepareDeps.createMcpLoopbackServerConfig(mcpLoopbackRuntime.port) : void 0,
		env: mcpLoopbackRuntime ? {
			OPENCLAW_MCP_TOKEN: prepareDeps.resolveMcpLoopbackBearerToken(mcpLoopbackRuntime, params.senderIsOwner === true),
			OPENCLAW_MCP_AGENT_ID: sessionAgentId ?? "",
			OPENCLAW_MCP_ACCOUNT_ID: params.agentAccountId ?? "",
			OPENCLAW_MCP_SESSION_KEY: params.sessionKey ?? "",
			OPENCLAW_MCP_SESSION_ID: params.sessionId,
			OPENCLAW_MCP_MESSAGE_CHANNEL: params.messageChannel ?? params.messageProvider ?? "",
			OPENCLAW_MCP_CURRENT_CHANNEL_ID: params.currentChannelId ?? "",
			OPENCLAW_MCP_CURRENT_THREAD_TS: params.currentThreadTs ?? "",
			OPENCLAW_MCP_CURRENT_MESSAGE_ID: params.currentMessageId != null ? String(params.currentMessageId) : "",
			OPENCLAW_MCP_CURRENT_INBOUND_AUDIO: params.currentInboundAudio === true ? "true" : "",
			OPENCLAW_MCP_INBOUND_EVENT_KIND: params.currentInboundEventKind ?? "",
			OPENCLAW_MCP_SOURCE_REPLY_DELIVERY_MODE: params.sourceReplyDeliveryMode ?? "",
			OPENCLAW_MCP_REQUIRE_EXPLICIT_MESSAGE_TARGET: requireExplicitMessageTarget ? "true" : "",
			OPENCLAW_MCP_CLI_CAPTURE_KEY: ""
		} : void 0,
		warn: (message) => cliBackendLog.warn(message)
	});
	const prepareExecutionContext = {
		config: params.config,
		workspaceDir,
		agentDir,
		provider: params.provider,
		modelId,
		authProfileId: effectiveAuthProfileId,
		executionMode,
		env: preparedBackend.env
	};
	let preparedExecution = void 0;
	try {
		preparedExecution = await backendResolved.prepareExecution?.(backendResolved.id === "google-gemini-cli" ? {
			...prepareExecutionContext,
			authCredential
		} : prepareExecutionContext);
	} catch (err) {
		try {
			await preparedBackend.cleanup?.();
		} catch (cleanupErr) {
			cliBackendLog.warn(`cli backend cleanup after prepare failure failed: ${String(cleanupErr)}`);
		}
		throw err;
	}
	const skipLocalCredentialEpoch = shouldSkipLocalCliCredentialEpoch({
		authEpochMode: backendResolved.authEpochMode,
		authProfileId: effectiveAuthProfileId,
		authCredential,
		preparedExecution
	});
	const authEpoch = await resolveCliAuthEpoch({
		provider: params.provider,
		agentDir,
		authProfileId: effectiveAuthProfileId,
		skipLocalCredential: skipLocalCredentialEpoch
	});
	const preparedBackendEnv = preparedExecution?.env && Object.keys(preparedExecution.env).length > 0 ? {
		...preparedBackend.env,
		...preparedExecution.env
	} : preparedBackend.env;
	const preparedBackendCleanup = preparedBackend.cleanup || preparedExecution?.cleanup ? async () => {
		try {
			await preparedExecution?.cleanup?.();
		} finally {
			await preparedBackend.cleanup?.();
		}
	} : void 0;
	const claudeSkillsPlugin = isSideQuestion ? {
		args: [],
		cleanup: async () => {}
	} : await prepareDeps.prepareClaudeCliSkillsPlugin({
		backendId: backendResolved.id,
		skillsSnapshot: params.skillsSnapshot
	});
	const preparedCleanup = preparedBackendCleanup || claudeSkillsPlugin.args.length > 0 ? async () => {
		try {
			await claudeSkillsPlugin.cleanup();
		} finally {
			await preparedBackendCleanup?.();
		}
	} : void 0;
	const preparedBackendClearEnv = [...preparedBackend.backend.clearEnv ?? [], ...preparedExecution?.clearEnv ?? []];
	const sideQuestionBackend = (() => {
		const { liveSession: _liveSession, ...backend } = preparedBackend.backend;
		return {
			...backend,
			sessionMode: "none"
		};
	})();
	const preparedBackendFinal = {
		...preparedBackend,
		backend: {
			...isSideQuestion ? sideQuestionBackend : preparedBackend.backend,
			...preparedBackendClearEnv.length > 0 ? { clearEnv: uniqueStrings(preparedBackendClearEnv) } : {}
		},
		...preparedBackendEnv ? { env: preparedBackendEnv } : {},
		...preparedCleanup ? { cleanup: preparedCleanup } : {}
	};
	const promptTools = bundleMcpEnabled && mcpLoopbackRuntime ? prepareDeps.resolveMcpLoopbackScopedTools({
		cfg: params.config ?? getRuntimeConfig(),
		sessionKey: params.sessionKey ?? "",
		messageProvider: params.messageChannel ?? params.messageProvider,
		currentChannelId: params.currentChannelId,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		accountId: params.agentAccountId,
		inboundEventKind: params.currentInboundEventKind,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		requireExplicitMessageTarget,
		senderIsOwner: params.senderIsOwner
	}).tools : [];
	const promptToolNamesHash = bundleMcpEnabled && mcpLoopbackRuntime ? hashCliSessionText(JSON.stringify(promptTools.map((tool) => tool.name).toSorted())) : void 0;
	const reusableCliSessionCandidate = isSideQuestion ? {} : params.cliSessionBinding ? resolveCliSessionReuse({
		binding: params.cliSessionBinding,
		authProfileId: effectiveAuthProfileId,
		authEpoch,
		authEpochVersion: 6,
		extraSystemPromptHash,
		messageToolPolicyHash,
		promptToolNamesHash,
		cwdHash,
		mcpConfigHash: preparedBackendFinal.mcpConfigHash,
		mcpResumeHash: preparedBackendFinal.mcpResumeHash
	}) : params.cliSessionId ? { sessionId: params.cliSessionId } : {};
	const candidateClaudeCliSessionId = reusableCliSessionCandidate.sessionId?.trim() || void 0;
	const hasClaudeCliCandidate = candidateClaudeCliSessionId !== void 0 && isClaudeCliProvider(params.provider);
	const claudeCliTranscriptMissing = hasClaudeCliCandidate && !await prepareDeps.claudeCliSessionTranscriptHasContent({
		sessionId: candidateClaudeCliSessionId,
		workspaceDir: cwd
	});
	const claudeCliTranscriptOrphanedToolUse = hasClaudeCliCandidate && !claudeCliTranscriptMissing && await prepareDeps.claudeCliSessionTranscriptHasOrphanedToolUse({
		sessionId: candidateClaudeCliSessionId,
		workspaceDir: cwd
	});
	const claudeCliInvalidatedReason = claudeCliTranscriptMissing ? "missing-transcript" : claudeCliTranscriptOrphanedToolUse ? "orphaned-tool-use" : void 0;
	const reusableCliSession = claudeCliInvalidatedReason ? { invalidatedReason: claudeCliInvalidatedReason } : reusableCliSessionCandidate;
	if (reusableCliSession.invalidatedReason) cliBackendLog.info(`cli session reset: provider=${params.provider} reason=${reusableCliSession.invalidatedReason}`);
	let openClawHistoryMessages;
	const loadOpenClawHistoryMessages = async () => {
		openClawHistoryMessages ??= await loadCliSessionHistoryMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: params.config
		});
		return openClawHistoryMessages;
	};
	const heartbeatPrompt = isSideQuestion ? void 0 : resolveHeartbeatPromptForSystemPrompt({
		config: params.config,
		agentId: sessionAgentId,
		defaultAgentId
	});
	const openClawReferences = isSideQuestion ? {
		docsPath: null,
		sourcePath: null
	} : await prepareDeps.resolveOpenClawReferencePaths({
		workspaceDir,
		argv1: process.argv[1],
		cwd,
		moduleUrl: import.meta.url
	});
	const systemPromptSkillsPrompt = isSideQuestion || claudeSkillsPlugin.args.length > 0 ? "" : await resolveCliSkillsPrompt({
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir,
		config: params.config,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey?.trim() || params.sessionId
	});
	const runtimeChannel = isSideQuestion ? void 0 : normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
	const runtimeCapabilities = isSideQuestion ? void 0 : collectRuntimeChannelCapabilities({
		cfg: params.config,
		channel: runtimeChannel,
		accountId: params.agentAccountId
	});
	const builtSystemPrompt = isSideQuestion ? extraSystemPrompt : buildCliAgentSystemPrompt({
		workspaceDir,
		cwd,
		config: params.config,
		defaultThinkLevel: params.thinkLevel,
		extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		requireExplicitMessageTarget,
		silentReplyPromptMode: params.silentReplyPromptMode,
		runtimeChannel,
		runtimeChatType: params.sessionEntry?.chatType,
		runtimeCapabilities,
		ownerNumbers: params.ownerNumbers,
		heartbeatPrompt,
		docsPath: openClawReferences.docsPath ?? void 0,
		sourcePath: openClawReferences.sourcePath ?? void 0,
		skillsPrompt: systemPromptSkillsPrompt,
		tools: promptTools,
		contextFiles,
		modelDisplay,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	});
	let systemPrompt = !isSideQuestion ? backendResolved.transformSystemPrompt?.({
		config: params.config,
		workspaceDir,
		provider: params.provider,
		modelId,
		modelDisplay,
		agentId: sessionAgentId,
		systemPrompt: builtSystemPrompt
	}) ?? builtSystemPrompt : builtSystemPrompt;
	let preparedPrompt = params.prompt;
	if (!isSideQuestion) {
		const hookRunner = getGlobalHookRunner();
		try {
			const hookResult = await resolvePromptBuildHookResult({
				config: params.config ?? getRuntimeConfig(),
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages(),
				hookCtx: {
					runId: params.runId,
					agentId: sessionAgentId,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					workspaceDir,
					modelProviderId: params.provider,
					modelId,
					trigger: params.trigger,
					...buildAgentHookContextChannelFields(params)
				},
				hookRunner
			});
			if (hookResult.prependContext) preparedPrompt = `${hookResult.prependContext}\n\n${preparedPrompt}`;
			if (hookResult.appendContext) preparedPrompt = `${preparedPrompt}\n\n${hookResult.appendContext}`;
			const hookSystemPrompt = hookResult.systemPrompt?.trim();
			if (hookSystemPrompt) systemPrompt = hookSystemPrompt;
			systemPrompt = composeSystemPromptWithHookContext({
				baseSystemPrompt: systemPrompt,
				prependSystemContext: hookResult.prependSystemContext,
				appendSystemContext: hookResult.appendSystemContext
			}) ?? systemPrompt;
			const mediaTaskSystemPromptAddition = resolveAttemptMediaTaskSystemPromptAddition({
				sessionKey: params.sessionKey,
				trigger: params.trigger
			});
			if (mediaTaskSystemPromptAddition) systemPrompt = prependSystemPromptAddition({
				systemPrompt: ensureSystemPromptCacheBoundary(systemPrompt),
				systemPromptAddition: mediaTaskSystemPromptAddition
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
		}
	}
	let historyPromptCurrentTurn = preparedPrompt;
	if (!isSideQuestion) {
		const fullCurrentInboundPrompt = buildCurrentInboundPrompt({
			context: params.currentInboundContext,
			prompt: preparedPrompt
		});
		const runCurrentInboundPrompt = buildCurrentInboundPrompt({
			context: params.currentInboundContext,
			prompt: preparedPrompt,
			preferResumableText: params.currentInboundEventKind === "room_event" && Boolean(reusableCliSession.sessionId)
		});
		historyPromptCurrentTurn = annotateInterSessionPromptText(fullCurrentInboundPrompt, params.inputProvenance);
		preparedPrompt = annotateInterSessionPromptText(runCurrentInboundPrompt, params.inputProvenance);
	}
	const allowRawTranscriptReseed = backendResolved.config.reseedFromRawTranscriptWhenUncompacted === true;
	const rawTranscriptReseedReason = reusableCliSession.sessionId ? "session-expired" : reusableCliSession.invalidatedReason;
	const openClawHistoryPrompt = !isSideQuestion && (!reusableCliSession.sessionId || allowRawTranscriptReseed) ? buildCliSessionHistoryPrompt({
		messages: await loadCliSessionReseedMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: params.config,
			allowRawTranscriptReseed,
			rawTranscriptReseedReason
		}),
		prompt: historyPromptCurrentTurn,
		maxHistoryChars: autoReseedHistoryChars
	}) : void 0;
	const systemPromptWithReplacements = applyPluginTextReplacements(systemPrompt, backendResolved.textTransforms?.input);
	systemPrompt = isSideQuestion ? systemPromptWithReplacements : appendModelIdentitySystemPrompt({
		systemPrompt: buildModelIdentityPromptLine(modelDisplay) && systemPromptWithReplacements.trim().length > 0 ? ensureSystemPromptCacheBoundary(systemPromptWithReplacements) : systemPromptWithReplacements,
		model: modelDisplay
	});
	const systemPromptReport = buildSystemPromptReport({
		source: "run",
		generatedAt: Date.now(),
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		provider: params.provider,
		model: modelId,
		workspaceDir,
		bootstrapMaxChars,
		bootstrapTotalMaxChars,
		bootstrapTruncation: buildBootstrapTruncationReportMeta({
			analysis: bootstrapAnalysis,
			warningMode: bootstrapPromptWarningMode,
			warning: bootstrapPromptWarning
		}),
		sandbox: {
			mode: "off",
			sandboxed: false
		},
		systemPrompt,
		bootstrapFiles,
		injectedFiles: contextFiles,
		skillsPrompt: systemPromptSkillsPrompt,
		tools: promptTools,
		currentTurn: {
			...params.currentInboundEventKind ? { kind: params.currentInboundEventKind } : {},
			promptChars: preparedPrompt.length,
			runtimeContextChars: 0
		}
	});
	const contextEngineConfig = params.config ?? getRuntimeConfig();
	if (isSideQuestion) return {
		params: {
			...params,
			config: contextEngineConfig,
			prompt: preparedPrompt,
			...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
		},
		effectiveAuthProfileId,
		started,
		workspaceDir,
		cwd,
		backendResolved,
		preparedBackend: preparedBackendFinal,
		reusableCliSession,
		hadSessionFile: false,
		contextEngineConfig,
		modelId,
		normalizedModel,
		contextWindowInfo,
		systemPrompt,
		systemPromptReport,
		claudeSkillsPluginArgs: claudeSkillsPlugin.args,
		bootstrapPromptWarningLines: bootstrapPromptWarning.lines,
		authEpoch,
		authEpochVersion: 6,
		extraSystemPromptHash,
		messageToolPolicyHash,
		promptToolNamesHash,
		cwdHash,
		...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
	};
	try {
		ensureContextEnginesInitialized();
		const { sessionAgentId: contextEngineSessionAgentId } = resolveSessionAgentIds({
			sessionKey: params.sessionKey,
			config: contextEngineConfig,
			agentId: params.agentId
		});
		const resolvedContextEngine = await resolveContextEngine(contextEngineConfig, {
			agentDir: resolveAgentDir(contextEngineConfig, contextEngineSessionAgentId),
			workspaceDir
		});
		const contextEngine = resolvedContextEngine.info.id !== "legacy" ? resolvedContextEngine : void 0;
		if (contextEngine) assertContextEngineHostSupport({
			contextEngine,
			operation: "agent-run",
			host: buildGenericCliContextEngineHostSupport({
				backendId: backendResolved.id,
				capabilities: backendResolved.contextEngineHostCapabilities
			})
		});
		const hadSessionFile = await hasCliSessionTranscript({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: contextEngineConfig
		});
		const contextEngineTurnPrompt = params.transcriptPrompt ?? params.prompt;
		return {
			params: {
				...params,
				config: contextEngineConfig,
				prompt: preparedPrompt,
				...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
			},
			effectiveAuthProfileId,
			started,
			workspaceDir,
			cwd,
			backendResolved,
			preparedBackend: preparedBackendFinal,
			reusableCliSession,
			hadSessionFile,
			contextEngineConfig,
			contextEngine,
			contextEngineTurnPrompt,
			modelId,
			normalizedModel,
			contextWindowInfo,
			systemPrompt,
			systemPromptReport,
			claudeSkillsPluginArgs: claudeSkillsPlugin.args,
			bootstrapPromptWarningLines: bootstrapPromptWarning.lines,
			...openClawHistoryPrompt ? { openClawHistoryPrompt } : {},
			heartbeatPrompt,
			authEpoch,
			authEpochVersion: 6,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			cwdHash,
			...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
		};
	} catch (err) {
		try {
			await preparedBackendFinal.cleanup?.();
		} catch (cleanupErr) {
			cliBackendLog.warn(`cli backend cleanup after prepare failure failed: ${String(cleanupErr)}`);
		}
		throw err;
	}
}
//#endregion
export { prepareCliRunContext as t };
