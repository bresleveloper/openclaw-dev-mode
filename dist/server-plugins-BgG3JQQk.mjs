import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as getGatewayContextLifetime, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DehQwyE0.mjs";
import { n as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { f as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { r as loadOpenClawPlugins } from "./loader-runtime-load-XbrcYJWd.mjs";
import { i as resolvePluginSubagentCompletionRequester } from "./hooks-DuXrq03h.mjs";
import { a as setPluginRuntimeLoadContext, n as createPluginRuntimeLoaderLogger, t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import "./loader-Vq3hhSQk.mjs";
import { a as prepareInProcessAgentExecution, i as getInProcessGatewayRequestContext, n as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-kZUX_Us7.mjs";
import { r as resolvePluginSubagentToolsAlsoAllow } from "./server-plugin-runtime-client-BJsmC-p-.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-BlIQrQjk.mjs";
import { t as compileModelAllowlist } from "./model-allowlist-ByzHidkj.mjs";
import { t as createBackgroundWorkOwner } from "./background-work-DnTXrmXN.mjs";
import { a as projectGatewayRuntimeNodes, n as hasInProcessGatewayContext, r as openGatewayNodeDuplex, t as createGatewayHooksRuntime } from "./server-plugins-node-runtime-Bzh3XTmW.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-plugin-subagent-runtime.ts
function normalizePluginSubagentRunRuntime(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const harness = typeof record.harness === "string" ? record.harness.trim() : "";
	const provider = typeof record.provider === "string" ? record.provider.trim() : "";
	const model = typeof record.model === "string" ? record.model.trim() : "";
	return harness && provider && model ? {
		harness,
		provider,
		model
	} : void 0;
}
function resolvePluginSubagentOverridePolicies(cfg) {
	const normalized = normalizePluginsConfig(cfg.plugins);
	const policies = {};
	for (const [pluginId, entry] of Object.entries(normalized.entries)) {
		const allowModelOverride = entry.subagent?.allowModelOverride === true;
		const allowlist = compileModelAllowlist({
			configured: entry.subagent?.hasAllowedModelsConfig === true,
			values: entry.subagent?.allowedModels,
			formatKey: (provider, model) => `${provider}/${model}`
		});
		if (!allowModelOverride && !allowlist.configured && !allowlist.models.size && !allowlist.allowAny) continue;
		policies[pluginId] = {
			allowModelOverride,
			...allowlist
		};
	}
	return policies;
}
function resolveFallbackModelOverridePolicy(params) {
	const pluginId = params.pluginId?.trim();
	if (!pluginId) throw new Error("provider/model override requires plugin identity in fallback subagent runs.");
	const policy = params.policies[pluginId];
	if (!policy?.allowModelOverride) throw new Error(`plugin "${pluginId}" is not trusted for fallback provider/model override requests. See https://docs.openclaw.ai/plugins/sdk-runtime#api-runtime-subagent and search for: plugins.entries.<id>.subagent.allowModelOverride`);
	if (policy.allowAny) return;
	if (policy.configured && policy.models.size === 0) throw new Error(`plugin "${pluginId}" configured subagent.allowedModels, but none of the entries normalized to a valid provider/model target.`);
	if (policy.models.size === 0) return;
	if (!params.model?.trim() || !params.provider && !params.model.includes("/")) throw new Error("fallback provider/model overrides that use an allowlist must resolve to a canonical provider/model target.");
	return policy;
}
function assertPluginSubagentModelAllowed(policy, selection, pluginId, authProfileId) {
	const modelRef = `${selection.provider}/${selection.model}${authProfileId ? `@${authProfileId}` : ""}`;
	if (policy && !policy.models.has(modelRef)) throw new Error(`model override "${modelRef}" is not allowlisted for plugin "${pluginId}".`);
}
function hasAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function canClientUseModelOverride(client) {
	return hasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function canTrustedOfficialPluginRequestScopes(params) {
	if (!params.pluginId) return false;
	if (params.pluginOrigin === "bundled" || params.pluginTrustedOfficialInstall === true) return true;
	const record = getActivePluginRegistry()?.plugins.find((entry) => entry.id === params.pluginId);
	return record?.origin === "bundled" || record?.trustedOfficialInstall === true;
}
const PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT = 1e3;
function createGatewaySubagentRuntime(resolveGatewayContext, overridePolicies = {}, runtimeLifetime) {
	const authorizeModelOverride = (params) => {
		const scope = getPluginRuntimeGatewayRequestScope();
		const overrideRequested = Boolean(params.provider || params.model);
		const hasRequestScopeClient = Boolean(scope?.client);
		let allowOverride = hasRequestScopeClient && canClientUseModelOverride(scope?.client ?? null);
		let allowSyntheticModelOverride = false;
		let policy;
		if (overrideRequested && !allowOverride && !hasRequestScopeClient) {
			policy = resolveFallbackModelOverridePolicy({
				policies: overridePolicies,
				pluginId: scope?.pluginId,
				provider: params.provider,
				model: params.model
			});
			allowOverride = true;
			allowSyntheticModelOverride = true;
		}
		if (overrideRequested && !allowOverride) throw new Error("provider/model override is not authorized for this plugin subagent run.");
		return {
			allowOverride,
			allowSyntheticModelOverride,
			policy
		};
	};
	const getSessionMessages = async (params) => {
		const scope = getPluginRuntimeGatewayRequestScope();
		const limit = params.limit == null || !Number.isFinite(params.limit) ? void 0 : Math.min(PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT, Math.max(1, Math.floor(params.limit)));
		const payload = await dispatchGatewayMethodInProcess("sessions.get", {
			key: params.sessionKey,
			...limit != null && { limit }
		}, {
			resolveGatewayContext,
			...!scope?.client && canTrustedOfficialPluginRequestScopes(scope ?? {}) ? { operatorRoleActor: { kind: "system" } } : {}
		});
		return { messages: Array.isArray(payload?.messages) ? payload.messages : [] };
	};
	const subagentRuntime = {
		async complete(request) {
			const params = { ...request };
			const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId?.trim();
			if (!pluginId) throw new Error("Plugin background completion requires a plugin identity and Gateway binding.");
			const execution = prepareInProcessAgentExecution({
				agentId: params.agentId,
				pluginRuntimeOwnerId: pluginId,
				resolveGatewayContext
			});
			const assertCurrent = () => {
				runtimeLifetime?.throwIfAborted();
				execution.assertCurrent();
			};
			runtimeLifetime?.throwIfAborted();
			await execution.authorize();
			assertCurrent();
			authorizeModelOverride(params);
			const signals = [
				params.signal,
				runtimeLifetime,
				execution.signal
			].filter((signal) => signal !== void 0);
			return await createBackgroundWorkOwner({
				owner: `plugin:${pluginId}`,
				maxConcurrent: 3
			}).enqueue(async (signal) => {
				assertCurrent();
				const [{ resolveConfiguredAgentId }, { resolveSimpleCompletionSelectionForAgent }, { runIsolatedCompletion }, { finalizePluginLlmCompletion }] = await Promise.all([
					import("./agent-scope-C4CYkKyC.mjs"),
					import("./simple-completion-runtime-0hj5YXMA.mjs"),
					import("./isolated-completion-BA7_b168.mjs"),
					import("./runtime-llm.runtime.js")
				]);
				await execution.authorize();
				assertCurrent();
				signal.throwIfAborted();
				const { policy } = authorizeModelOverride(params);
				const cfg = execution.context.getRuntimeConfig();
				const agentId = resolveConfiguredAgentId(cfg, params.agentId);
				const selection = resolveSimpleCompletionSelectionForAgent({
					cfg,
					agentId,
					modelRef: params.model
				});
				if (!selection) throw new Error(`No model configured for agent ${agentId}.`);
				assertPluginSubagentModelAllowed(policy, {
					provider: selection.provider,
					model: selection.modelId
				}, pluginId, selection.profileId);
				const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4);
				const runSignal = AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]);
				const result = await execution.run(() => runIsolatedCompletion({
					config: cfg,
					agentId,
					provider: selection.provider,
					model: selection.modelId,
					authProfileId: selection.profileId,
					systemPrompt: params.extraSystemPrompt ?? "",
					prompt: params.message,
					timeoutMs,
					abortSignal: runSignal,
					assertCurrent
				}));
				runSignal.throwIfAborted();
				assertCurrent();
				signal.throwIfAborted();
				finalizePluginLlmCompletion({
					cfg,
					hostPluginId: pluginId,
					rawUsage: result.usage,
					result: {
						text: result.text,
						provider: result.provider,
						model: result.model,
						agentId,
						execution: {
							mode: "isolated-agent-runtime",
							owner: result.owner
						},
						audit: { caller: {
							kind: "plugin",
							id: pluginId
						} }
					}
				});
				return { text: result.text };
			}, { abortSignal: signals.length ? AbortSignal.any(signals) : void 0 });
		},
		async run(request) {
			const params = { ...request };
			const assertCurrent = params.assertCurrent;
			assertCurrent?.();
			if (params.disableTools === true && (params.toolsAlsoAllow?.length ?? 0) > 0) throw new Error("Tool-free plugin subagent runs cannot request additive tools.");
			const pluginSubagentRequester = resolvePluginSubagentCompletionRequester(params.completionDelivery);
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = typeof scope?.pluginId === "string" && scope.pluginId.trim() ? scope.pluginId.trim() : void 0;
			const runtimePluginToolGrant = resolvePluginSubagentToolsAlsoAllow({
				pluginId,
				toolsAlsoAllow: params.toolsAlsoAllow
			});
			const { allowOverride, allowSyntheticModelOverride, policy } = authorizeModelOverride(params);
			let sessionMutationCommitGuard = assertCurrent;
			if (policy) {
				const context = getInProcessGatewayRequestContext(resolveGatewayContext);
				if (!context) throw new Error("Plugin model override requires a live Gateway binding.");
				const cfg = context.getRuntimeConfig();
				sessionMutationCommitGuard = () => {
					assertCurrent?.();
					runtimeLifetime?.throwIfAborted();
					if (getInProcessGatewayRequestContext(resolveGatewayContext) !== context || context.getRuntimeConfig() !== cfg) throw new Error("Plugin model override configuration changed before admission. Retry the run.");
				};
				const [modelRefs, agentScope, metadata] = await Promise.all([
					import("./model-ref-BdVhVRAK.mjs"),
					import("./agent-scope-C4CYkKyC.mjs"),
					import("./plugin-metadata-snapshot-AIcOW-fO.mjs")
				]);
				sessionMutationCommitGuard();
				const model = expectDefined(params.model, "authorized model override");
				const agentId = agentScope.resolveSessionAgentId({
					config: cfg,
					sessionKey: params.sessionKey
				});
				const manifestPlugins = cfg.plugins?.enabled === false ? [] : metadata.resolvePluginMetadataSnapshot({
					config: cfg,
					env: process.env,
					workspaceDir: agentScope.resolveAgentWorkspaceDir(cfg, agentId)
				});
				const selection = params.provider ? modelRefs.normalizeAgentCommandModelRef(cfg, params.provider, model, { manifestPlugins }) : modelRefs.parseAgentCommandModelRef(cfg, agentId, model, "", { manifestPlugins });
				if (!selection) throw new Error("Invalid model override.");
				assertPluginSubagentModelAllowed(policy, selection, pluginId, params.provider ? void 0 : splitTrailingAuthProfile(model).profile);
			}
			const payload = await dispatchGatewayMethodInProcess("agent", {
				sessionKey: params.sessionKey,
				message: params.message,
				deliver: params.deliver ?? false,
				...allowOverride && params.provider && { provider: params.provider },
				...allowOverride && params.model && { model: params.model },
				...params.extraSystemPrompt && { extraSystemPrompt: params.extraSystemPrompt },
				...params.promptMode === "minimal" && { promptMode: params.promptMode },
				...params.lane && { lane: params.lane },
				...params.cwd && { cwd: params.cwd },
				...params.lightContext === true && { bootstrapContextMode: "lightweight" },
				idempotencyKey: params.idempotencyKey || randomUUID()
			}, {
				allowSyntheticModelOverride,
				sessionMutationCommitGuard,
				agentRunTracking: "plugin_subagent",
				...!scope?.client ? { operatorRoleActor: { kind: "system" } } : {},
				...pluginId ? { pluginRuntimeOwnerId: pluginId } : {},
				...pluginSubagentRequester ? { pluginSubagentRequester } : {},
				...runtimePluginToolGrant ? { runtimePluginToolGrant } : {},
				...params.disableTools === true ? { pluginSubagentToolsAllow: [] } : {},
				resolveGatewayContext
			});
			const runId = payload?.runId;
			if (typeof runId !== "string" || !runId) throw new Error("Gateway agent method returned an invalid runId.");
			const sessionKey = payload?.sessionKey?.trim() || params.sessionKey;
			const runtime = normalizePluginSubagentRunRuntime(payload?.runtime);
			return {
				runId,
				sessionKey,
				...runtime ? { runtime } : {}
			};
		},
		async waitForRun(params) {
			const { status: rawStatus, error, ...metadata } = await dispatchGatewayMethodInProcess("agent.wait", {
				runId: params.runId,
				...params.timeoutMs != null && { timeoutMs: params.timeoutMs }
			}, { resolveGatewayContext });
			let status = rawStatus;
			if (status === "completed" || status === "succeeded") status = "ok";
			else if (status === "error" && error?.trim().toLowerCase() === "completed") status = "ok";
			if (status !== "ok" && status !== "error" && status !== "timeout" && status !== "pending") throw new Error(`Gateway agent.wait returned unexpected status: ${rawStatus}`);
			return {
				...metadata,
				status,
				...status !== "ok" && error ? { error } : {}
			};
		},
		getSessionMessages,
		async deleteSession(params) {
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = typeof scope?.pluginId === "string" && scope.pluginId.trim() ? scope.pluginId.trim() : void 0;
			const pluginOwnedCleanupOptions = pluginId ? {
				pluginRuntimeOwnerId: pluginId,
				...!hasAdminScope(scope?.client) ? {
					forceSyntheticClient: true,
					syntheticScopes: [ADMIN_SCOPE]
				} : {}
			} : void 0;
			await dispatchGatewayMethodInProcess("sessions.delete", {
				key: params.sessionKey,
				deleteTranscript: params.deleteTranscript ?? true
			}, {
				...pluginOwnedCleanupOptions,
				resolveGatewayContext,
				...!scope?.client && canTrustedOfficialPluginRequestScopes(scope ?? {}) ? { operatorRoleActor: { kind: "system" } } : {}
			});
		}
	};
	if (resolveGatewayContext) bindGatewayContextResolver(subagentRuntime, resolveGatewayContext);
	return subagentRuntime;
}
//#endregion
//#region src/gateway/server-plugins.ts
function resolveRuntimeNodeInvokeSyntheticScopes(params) {
	return canTrustedOfficialPluginRequestScopes(params) ? params.requestedScopes : void 0;
}
async function dispatchTrustedPluginGatewayMethod(method, params = {}, options, resolveGatewayContext) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const pluginId = scope?.pluginId?.trim();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error(`Gateway requests are only available to bundled or trusted official plugins. ${pluginId ? `Plugin "${pluginId}" is neither.` : "This call carries no plugin identity."} See https://docs.openclaw.ai/plugins/sdk-runtime#api-runtime-gateway`);
	const syntheticScopes = normalizeOperatorScopeList(options?.scopes);
	return await dispatchGatewayMethodInProcess(method, params, {
		forceSyntheticClient: true,
		pluginRuntimeOwnerId: pluginId,
		resolveGatewayContext,
		...!scope?.client ? { operatorRoleActor: { kind: "system" } } : {},
		...syntheticScopes ? { syntheticScopes } : {},
		...options?.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
	});
}
function createGatewayNodesRuntime(resolveGatewayContext, runtimeLifetime) {
	const invokeNode = async (params, stream, signal = params.signal) => {
		const scope = getPluginRuntimeGatewayRequestScope();
		const pluginId = scope?.pluginId?.trim() || void 0;
		const requestedScopes = resolveRuntimeNodeInvokeSyntheticScopes({
			pluginId,
			pluginOrigin: scope?.pluginOrigin,
			pluginTrustedOfficialInstall: scope?.pluginTrustedOfficialInstall,
			requestedScopes: normalizeOperatorScopeList(params.scopes)
		});
		const callerScopes = stream && scope?.client ? normalizeOperatorScopeList(scope.client.connect.scopes) ?? [] : void 0;
		if (callerScopes && requestedScopes?.some((requestedScope) => !authorizeOperatorScopesForRequiredScope(requestedScope, callerScopes).allowed)) throw new Error("Requested node scopes exceed the authenticated Gateway caller's authority.");
		const syntheticScopes = requestedScopes ?? callerScopes;
		return dispatchGatewayMethodInProcess("node.invoke", {
			nodeId: params.nodeId,
			command: params.command,
			...params.params !== void 0 && { params: params.params },
			timeoutMs: params.timeoutMs,
			idempotencyKey: params.idempotencyKey || randomUUID(),
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		}, {
			...pluginId ? { pluginRuntimeOwnerId: pluginId } : {},
			nodeInvokeApprovalSessionKey: params.sessionKey,
			...syntheticScopes ? { syntheticScopes } : {},
			...stream || syntheticScopes ? { forceSyntheticClient: true } : {},
			...stream ? { nodeInvokeStream: stream } : {},
			...signal ? { signal } : {},
			resolveGatewayContext
		});
	};
	return {
		async list(params) {
			const context = getInProcessGatewayRequestContext(resolveGatewayContext);
			const payload = await dispatchGatewayMethodInProcess("node.list", {}, { resolveGatewayContext: () => context });
			const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
			const filteredNodes = params?.connected === true ? nodes.filter((node) => typeof node === "object" && node?.connected === true) : nodes;
			return { nodes: projectGatewayRuntimeNodes(filteredNodes, context) };
		},
		invoke: invokeNode,
		openDuplex: (params) => openGatewayNodeDuplex({
			params,
			invokeNode,
			resolveGatewayContext,
			runtimeLifetime
		})
	};
}
function createGatewayPluginRuntimeBindings(resolveGatewayContext, overridePolicies) {
	const lifetime = new AbortController();
	const signal = resolveGatewayContext ? AbortSignal.any([lifetime.signal, getGatewayContextLifetime(resolveGatewayContext).signal]) : lifetime.signal;
	const resolveBoundGatewayContext = resolveGatewayContext ? () => signal.aborted ? void 0 : resolveGatewayContext() : void 0;
	if (resolveBoundGatewayContext) bindGatewayContextResolver(resolveBoundGatewayContext, resolveGatewayContext);
	return {
		retire: () => {
			lifetime.abort(/* @__PURE__ */ new Error("Plugin Gateway runtime retired; duplex invocation cancelled."));
		},
		runtime: {
			dispatchReplyFromConfig: async (params) => {
				const { dispatchLowLevelChannelReplyFromConfig } = await import("./dispatch-from-config-B7Q7CVke.mjs");
				const sessionWorkerPlacementContext = getInProcessGatewayRequestContext(resolveBoundGatewayContext);
				const run = async () => await dispatchLowLevelChannelReplyFromConfig({
					...params,
					...sessionWorkerPlacementContext ? { sessionWorkerPlacementContext } : {}
				});
				return resolveBoundGatewayContext ? await withPluginRuntimeGatewayContextResolver(resolveBoundGatewayContext, run) : await run();
			},
			gateway: {
				isAvailable: async () => hasInProcessGatewayContext(resolveBoundGatewayContext),
				request: (method, params, options) => dispatchTrustedPluginGatewayMethod(method, params, options, resolveBoundGatewayContext)
			},
			hooks: createGatewayHooksRuntime(resolveBoundGatewayContext),
			nodes: createGatewayNodesRuntime(resolveBoundGatewayContext, signal),
			subagent: createGatewaySubagentRuntime(resolveBoundGatewayContext, overridePolicies, signal)
		}
	};
}
function loadGatewayPlugins(params) {
	const started = performance.now();
	const allowProcessHomeSessionCatalogs = allowsProcessHomeSessionScan();
	const resolvedConfig = params.cfg;
	const pluginIds = params.pluginIds ?? [...(params.pluginLookUpTable ?? loadPluginLookUpTable({
		config: resolvedConfig,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		ambientEnvTriggers: params.ambientEnvTriggers
	})).startup.pluginIds];
	const pluginIdsMs = performance.now() - started;
	const metadataSnapshot = params.pluginMetadataSnapshot ?? getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const loaderMetadata = metadataSnapshot ?? params.pluginLookUpTable;
	const logger = {
		...createPluginRuntimeLoaderLogger(),
		...params.suppressPluginInfoLogs ? { info: () => void 0 } : {}
	};
	const loadContext = {
		rawConfig: params.cfg,
		config: resolvedConfig,
		activationSourceConfig: params.activationSourceConfig ?? params.cfg,
		autoEnabledReasons: params.autoEnabledReasons,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		logger,
		preferBuiltPluginArtifacts: true,
		expectedSourceDigests: params.expectedSourceDigests,
		metadataSnapshot,
		...loaderMetadata ? {
			manifestRegistry: loaderMetadata.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(loaderMetadata.index)
		} : {}
	};
	const beforeLoad = performance.now();
	const loaderStatsBefore = getPluginModuleLoaderStats();
	const gatewayRuntimeBindings = pluginIds.length ? createGatewayPluginRuntimeBindings(params.resolveGatewayContext, resolvePluginSubagentOverridePolicies(resolvedConfig)) : void 0;
	let pluginRegistry;
	try {
		pluginRegistry = gatewayRuntimeBindings ? loadOpenClawPlugins({
			...buildPluginRuntimeLoadOptions(loadContext),
			activate: false,
			runtimeSideEffects: true,
			cache: false,
			throwOnLoadError: params.loadIntent === "replacement",
			previousRegistry: params.previousRegistry,
			replacePluginIds: params.replacePluginIds ? [...params.replacePluginIds] : void 0,
			loadModules: params.loadModules,
			moduleRecoveries: params.moduleRecoveries,
			prepareRegistrationFailureCleanup: params.prepareRegistrationFailureCleanup,
			manifestRegistry: params.pluginLookUpTable?.manifestRegistry ?? loadContext.manifestRegistry,
			allowProcessHomeSessionCatalogs,
			onlyPluginIds: pluginIds,
			coreGatewayHandlers: params.coreGatewayHandlers,
			coreGatewayMethodNames: params.coreGatewayMethodNames,
			hostServices: params.hostServices,
			runtimeOptions: {
				allowGatewaySubagentBinding: true,
				...gatewayRuntimeBindings.runtime
			},
			channelPluginLoadIntent: params.channelPluginLoadIntent,
			startupTrace: params.startupTrace
		}) : createEmptyPluginRegistry();
		setPluginRuntimeLoadContext(pluginRegistry, loadContext);
	} catch (error) {
		gatewayRuntimeBindings?.retire();
		throw error;
	}
	const loadMs = performance.now() - beforeLoad;
	const loaderStatsAfter = getPluginModuleLoaderStats();
	const pluginMethods = Object.keys(pluginRegistry.gatewayHandlers);
	const gatewayMethods = uniqueStrings([...params.baseMethods, ...pluginMethods]);
	params.startupTrace?.detail("plugins.gateway-load", [
		["pluginIdsMs", pluginIdsMs],
		["loadMs", loadMs],
		["pluginIds", String(pluginIds.length)],
		["pluginCount", pluginIds.length],
		["gatewayHandlers", String(pluginMethods.length)],
		["gatewayHandlerCount", pluginMethods.length],
		["loaderCallsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
		["loaderNativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
		["loaderNativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
		["loaderSourceTransformForcedCount", loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced],
		["loaderSourceTransformFallbacksCount", loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks],
		["loaderTopSourceTransformTargets", loaderStatsAfter.topSourceTransformTargets.slice(0, 3).map((entry) => `${entry.count}:${entry.target}`).join(",")]
	]);
	return {
		pluginRegistry,
		gatewayMethods,
		retireGatewayRuntimeBindings: gatewayRuntimeBindings?.retire ?? (() => {})
	};
}
//#endregion
export { createGatewaySubagentRuntime as i, dispatchTrustedPluginGatewayMethod as n, loadGatewayPlugins as r, createGatewayNodesRuntime as t };
