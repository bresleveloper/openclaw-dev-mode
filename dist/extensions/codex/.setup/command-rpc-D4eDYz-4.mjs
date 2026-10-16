import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { o as isCodexAppServerOverloadError, r as CodexAppServerRpcError } from "./rpc-error-hmWM21RB.mjs";
import { n as describeControlFailure, t as CODEX_CONTROL_METHODS } from "./capabilities-kQntafj_.mjs";
import { a as withCodexAppServerJsonClient, r as requestCodexAppServerJson } from "./request-CB7T766a.mjs";
import "./config-0Gxk3_eq.mjs";
import { n as resolveCodexAppServerRuntimeOptions, r as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-runtime-cUYrqu_a.mjs";
import { a as resolveCodexAppServerAuthProfileStore, r as resolveCodexAppServerAuthProfileId } from "./auth-profile-CgHQ8Vot.mjs";
import { nt as resolveCodexAppServerPreparedAuthHandoff } from "./shared-client-r9NcV_GJ.mjs";
import { a as isCodexAppServerIndeterminateRequestCancellationError, o as isCodexAppServerIndeterminateTransportError } from "./client-BM1XpAkE.mjs";
import { o as closeCodexStartupClientBestEffort } from "./attempt-client-cleanup-DNfVb5SC.mjs";
import { r as prepareCodexAppServerAuthBinding } from "./auth-binding-BoMwpuPN.mjs";
import { r as listCodexAppServerModels } from "./models-CQwYMFV4.mjs";
import { o as createCodexSessionGenerationSupersededError } from "./session-binding-Ce7BqiPN.mjs";
import { t as resumeCodexAppServerThread } from "./thread-resume-D27gNXZE.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { resolveAgentDir, resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { prepareAgentRuntimeAuth } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveSessionModelRef } from "openclaw/plugin-sdk/model-session-runtime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
//#region extensions/codex/src/command-rpc.ts
var command_rpc_exports = /* @__PURE__ */ __exportAll({
	codexControlRequest: () => codexControlRequest,
	prepareCodexControlSessionAuth: () => prepareCodexControlSessionAuth,
	readCodexStatusProbes: () => readCodexStatusProbes,
	requestOptions: () => requestOptions,
	safeCodexControlRequest: () => safeCodexControlRequest
});
/** Selects the same prepared auth partition as an admitted session turn. */
async function prepareCodexControlSessionAuth(options, startOptions) {
	if (!options.config || !options.sessionKey || !options.sessionId) {
		if (options.onResponse) throw new Error("Codex control subscription requires admitted session authority.");
		return {
			authProfileId: options.authProfileId ?? void 0,
			clientOptions: { authProfileId: options.authProfileId }
		};
	}
	const config = options.config;
	const { sessionAgentId } = resolveSessionAgentIdsStrict({
		config,
		sessionKey: options.sessionKey,
		agentId: options.agentId
	});
	const agentDir = options.agentDir ?? resolveAgentDir(config, sessionAgentId);
	const workspaceDir = resolveAgentWorkspaceDir(config, sessionAgentId);
	const entry = getSessionEntry({
		agentId: sessionAgentId,
		storePath: options.storePath?.trim() || resolveStorePath(config.session?.store, { agentId: sessionAgentId }),
		sessionKey: options.sessionKey,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	});
	if (entry?.sessionId !== options.sessionId) throw createCodexSessionGenerationSupersededError(options.sessionId);
	if (options.authProfileId === null || startOptions.homeScope === "user") return {
		authProfileId: options.authProfileId ?? void 0,
		clientOptions: { authProfileId: options.authProfileId }
	};
	const model = resolveSessionModelRef(config, entry, sessionAgentId);
	const authProfileId = entry?.authProfileOverride ?? options.authProfileId;
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		config,
		authProfileId
	});
	const { plan, attempts } = prepareAgentRuntimeAuth({
		provider: model.provider,
		modelId: model.model,
		config,
		agentDir,
		workspaceDir,
		authProfileStore: store,
		sessionAuthProfileId: authProfileId,
		sessionAuthProfileSource: entry?.authProfileOverrideSource,
		harnessId: "codex",
		harnessAuthBootstrap: "harness"
	});
	const route = plan.modelRoute;
	const resolvedAuth = route ? await resolveApiKeyForProvider({
		provider: route.provider,
		modelId: route.modelId,
		modelApi: route.api,
		cfg: config,
		agentDir,
		workspaceDir,
		store,
		profileId: attempts[0]?.profileId,
		lockedProfile: plan.forwardedAuthProfileSource === "user",
		allowAuthProfileFallback: attempts[0]?.allowAuthProfileFallback,
		skipSetupProviderFallback: true
	}) : void 0;
	const handoff = await resolveCodexAppServerPreparedAuthHandoff({
		authRequirement: route?.authRequirement,
		resolvedApiKey: resolvedAuth?.apiKey,
		authProfileId: route ? plan.forwardedAuthProfileId : resolveCodexAppServerAuthProfileId({
			authProfileId: plan.forwardedAuthProfileId,
			store,
			config
		}),
		authProfileStore: store,
		agentDir,
		homeScope: startOptions.homeScope ?? "agent",
		config,
		subscriptionProfileRequiredError: "Prepared Codex subscription route requires a forwarded OpenAI OAuth or token profile.",
		subscriptionProfileUnusableError: "Prepared Codex subscription auth profile is unusable."
	});
	const binding = handoff.authProfileId ? await prepareCodexAppServerAuthBinding({
		authProfileId: handoff.authProfileId,
		authProfileStore: store,
		agentDir,
		config
	}) : void 0;
	return {
		authProfileId: handoff.authProfileId,
		clientOptions: {
			...handoff.preparedAuth ? { preparedAuth: handoff.preparedAuth } : { authProfileId: handoff.authProfileId },
			authRequirement: route?.authRequirement,
			authProfileStore: binding?.authProfileStore ?? store,
			authBindingFingerprint: binding?.fingerprint,
			agentDir
		}
	};
}
function requestOptions(pluginConfig, limit, config, agentDir) {
	const runtime = resolveCodexAppServerRuntimeOptions({ pluginConfig });
	return {
		limit,
		timeoutMs: runtime.requestTimeoutMs,
		startOptions: runtime.start,
		config,
		agentDir
	};
}
async function codexControlRequest(pluginConfig, method, requestParams, inputOptions = {}) {
	const options = { ...inputOptions };
	try {
		options.controlObservation?.phase("prepare");
	} catch {}
	const runtime = options.startOptions ? resolveCodexSupervisionAppServerRuntimeOptions({ pluginConfig }) : resolveCodexAppServerRuntimeOptions({ pluginConfig });
	const startOptions = options.startOptions ?? runtime.start;
	const nativeAuthFork = method === "thread/fork" && options.startOptions !== void 0 && options.authProfileId === null;
	const auth = options.onResponse && !nativeAuthFork ? await prepareCodexControlSessionAuth(options, startOptions) : {
		authProfileId: options.authProfileId ?? void 0,
		clientOptions: { authProfileId: options.authProfileId }
	};
	const controlRequestOptions = {
		timeoutMs: options.timeoutMs ?? runtime.requestTimeoutMs,
		assertCurrent: options.assertCurrent,
		startOptions,
		config: options.config,
		sessionKey: options.sessionKey,
		sessionId: options.sessionId,
		agentDir: options.agentDir,
		isolated: options.isolated,
		...options.catalogPreview ? {
			catalogPreview: true,
			catalogPreviewCache: options.catalogPreviewCache,
			catalogRows: options.catalogRows
		} : {},
		...options.controlObservation ? { controlObservation: options.controlObservation } : {},
		...auth.clientOptions
	};
	if (options.onResponse || options.beforeRequest) return await withCodexAppServerJsonClient(controlRequestOptions, async (request, client, scope) => {
		await options.beforeRequest?.(request, client, scope);
		scope.assertCurrent();
		let response;
		if (method === "thread/resume") {
			if (!isJsonObject(requestParams) || typeof requestParams.threadId !== "string") throw new Error("Codex thread/resume requires a thread id.");
			response = await resumeCodexAppServerThread({
				client,
				request: {
					...requestParams,
					threadId: requestParams.threadId
				},
				requestResume: () => request({
					method,
					requestParams,
					assertCurrent: options.assertOwnerCurrent
				}),
				abandonClient: () => closeCodexStartupClientBestEffort(client)
			});
		} else try {
			response = await request({
				method,
				requestParams,
				assertCurrent: options.assertOwnerCurrent
			});
		} catch (error) {
			if (nativeAuthFork && (isCodexAppServerIndeterminateRequestCancellationError(error) || isCodexAppServerIndeterminateTransportError(error) || error instanceof CodexAppServerRpcError && !isCodexAppServerOverloadError(error))) await closeCodexStartupClientBestEffort(client);
			throw error;
		}
		if (options.onResponse) await options.onResponse(response, client, {
			authProfileId: auth.authProfileId,
			assertCurrent: scope.assertCurrent
		});
		else scope.assertCurrent();
		return response;
	});
	return await requestCodexAppServerJson({
		method,
		requestParams,
		...controlRequestOptions,
		...options.assertOwnerCurrent ? { assertCurrent: () => {
			options.assertOwnerCurrent?.();
			options.assertCurrent?.();
		} } : {}
	});
}
async function safeCodexControlRequest(pluginConfig, method, requestParams, options = {}) {
	return await safeValue(async () => await codexControlRequest(pluginConfig, method, requestParams, options));
}
async function readCodexStatusProbes(pluginConfig, config, agentDir) {
	const options = {
		config,
		agentDir
	};
	const [models, account, limits, mcps, skills] = await Promise.all([
		safeValue(() => listCodexAppServerModels(requestOptions(pluginConfig, 20, config, agentDir))),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.account, { refreshToken: false }, options),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.rateLimits, void 0, options),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listMcpServers, { limit: 100 }, options),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listSkills, {}, options)
	]);
	return {
		models,
		account,
		limits,
		mcps,
		skills
	};
}
async function safeValue(read) {
	try {
		return {
			ok: true,
			value: await read()
		};
	} catch (error) {
		return {
			ok: false,
			error: describeControlFailure(error)
		};
	}
}
//#endregion
export { requestOptions as a, readCodexStatusProbes as i, command_rpc_exports as n, safeCodexControlRequest as o, prepareCodexControlSessionAuth as r, codexControlRequest as t };
