import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-orClZ-2Z.mjs";
import { c as withPluginRuntimeGatewayContextResolver, f as bindGatewayContextResolver, h as getGatewayContextLifetime, o as getPluginRuntimeGatewayRequestScope, r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { O as withAgentRosterFactsBatch, a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { n as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { g as readUserProfileVersion } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { v as resolveSessionAgentIdsStrict } from "./agent-scope-DXrnO3F4.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { d as hasGatewayAdminScope, p as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { n as assertOperatorModelAllowed } from "./admitted-run-context-h1ULFETN.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { u as operatorReadShareKey } from "./core-method-policy-BdmwLcmW.mjs";
import { l as prepareUserProfileIdentity } from "./user-profile-list-BdNJnrJe.mjs";
import { _ as readGatewayAccessRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as gitHubPublicApi, r as githubApiToken } from "./github-public-api-Dk3IZSKx.mjs";
import { _ as resolveSessionVisibility } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import "./lanes-D7a4ntDu.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { n as buildPluginRuntimeLoadOptions, o as setPluginRuntimeLoadContext, r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { a as loadOpenClawPluginsAsync } from "./loader-runtime-load-DzFljQbT.mjs";
import { o as resolvePluginSubagentCompletionRequester } from "./hooks-CU2qx9-T.mjs";
import { t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.mjs";
import { H as sessionClassificationForRow, i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { n as projectGatewaySessionRunState } from "./session-utils-display-DdkO-Qt-.mjs";
import { i as listActiveEmbeddedRunSessionKeys, r as listActiveEmbeddedRunSessionIds } from "./active-run-projections-Crpg2l0z.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-CAoWtmWT.mjs";
import { i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
import { i as resolveProjectedControlUiSessionPrTarget } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import "./loader-B8PRFJEU.mjs";
import { t as subscribeRuntimeSessionChanges } from "./session-changes-BjVcRkOM.mjs";
import { t as bindInProcessSessionDeliveryGeneration } from "./in-process-session-delivery-CzpdttLQ.mjs";
import { i as resolvePluginSubagentToolsAlsoAllow } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { a as withInProcessGatewayRead, r as prepareInProcessAgentExecution, t as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-tLBMDcKE.mjs";
import { n as resolveGitHubUserIdentityByLogin } from "./github-user-identity-PqDuRpmc.mjs";
import { t as compileModelAllowlist } from "./model-allowlist-DvD-pjEc.mjs";
import { t as stripMarkdown } from "./strip-markdown-Cim7EamG.mjs";
import { o as selectSessionEntries, r as prepareProjectedSessionList } from "./session-utils-list-cYIWEFPs.mjs";
import { i as projectGatewayRuntimeNodes, n as openGatewayNodeDuplex, t as hasInProcessGatewayContext } from "./server-plugins-node-runtime-80gnd6PW.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-plugin-subagent-runtime.ts
function normalizePluginSubagentRunRuntime(value) {
	const record = asOptionalRecord(value);
	const harness = normalizeOptionalString(record?.harness);
	const provider = normalizeOptionalString(record?.provider);
	const model = normalizeOptionalString(record?.model);
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
	if (!params.model?.trim() || !params.provider && !params.model.includes("/")) throw new Error("fallback provider/model overrides that use an allowlist must resolve to a full provider/model target.");
	return policy;
}
function assertPluginSubagentModelAllowed(policy, selection, pluginId, authProfileId) {
	const modelRef = `${selection.provider}/${selection.model}${authProfileId ? `@${authProfileId}` : ""}`;
	if (policy && !policy.models.has(modelRef)) throw new Error(`model override "${modelRef}" is not allowlisted for plugin "${pluginId}".`);
}
function canClientUseModelOverride(client) {
	return hasGatewayAdminScope(client) || client?.internal?.allowModelOverride === true;
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
		async forkSession(request) {
			const params = { ...request };
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = scope?.pluginId?.trim();
			if (!pluginId) throw new Error("Plugin session fork requires a plugin identity and Gateway binding.");
			const context = getInProcessGatewayRequestContext(resolveGatewayContext);
			if (!context) throw new Error("Plugin session fork requires an active Gateway binding.");
			const assertConversationAccess = (cfg) => {
				const origin = scope?.pluginOrigin ?? getActivePluginRegistry()?.plugins.find((plugin) => plugin.id === pluginId)?.origin ?? "config";
				if (!resolveConversationAccessAllowed(origin, cfg.plugins?.entries?.[pluginId]?.hooks)) throw new Error(`Plugin session fork requires plugins.entries.${pluginId}.hooks.allowConversationAccess.`);
			};
			assertConversationAccess(context.getRuntimeConfig());
			runtimeLifetime?.throwIfAborted();
			const { sessionAgentId: agentId } = resolveSessionAgentIdsStrict({
				sessionKey: params.sessionKey,
				config: context.getRuntimeConfig()
			});
			const execution = await prepareInProcessAgentExecution({
				agentId,
				pluginRuntimeOwnerId: pluginId,
				resolveGatewayContext
			});
			try {
				const assertExecutionCurrent = () => {
					runtimeLifetime?.throwIfAborted();
					execution.assertCurrent();
					assertConversationAccess(execution.context.getRuntimeConfig());
				};
				await execution.authorize();
				assertExecutionCurrent();
				return await withInProcessGatewayRead({
					method: "sessions.get",
					requestParams: { key: params.sessionKey },
					scope,
					resolveGatewayContext,
					callerAuthorityError: "Plugin session fork caller authority expired."
				}, async (_resolved, assertReadCurrent) => {
					const assertCurrent = () => {
						assertExecutionCurrent();
						assertReadCurrent();
					};
					assertCurrent();
					const signal = AbortSignal.any([
						getGatewayRestartDrainSignal(),
						params.signal,
						runtimeLifetime,
						execution.signal
					].filter((candidate) => candidate !== void 0));
					return await enqueueCommandInLane("subagent", async () => {
						await execution.authorize();
						assertCurrent();
						signal.throwIfAborted();
						const cfg = execution.context.getRuntimeConfig();
						const target = await loadGatewaySessionEntryReadOnlyInWorker({
							cfg,
							key: params.sessionKey,
							agentId,
							assertActive: assertCurrent
						});
						assertCurrent();
						signal.throwIfAborted();
						if (!target.entry?.sessionId) throw new Error(`No active session context for "${params.sessionKey}".`);
						const model = resolveSessionModelRef(cfg, target.entry, agentId);
						assertOperatorModelAllowed(execution.operatorAuthority, model);
						const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4);
						const runSignal = AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]);
						const sessionEntry = target.entry;
						const { runBtwSideQuestion } = await import("./btw-CzBfU0_U.mjs");
						assertCurrent();
						signal.throwIfAborted();
						let usage;
						const result = await execution.run(() => runBtwSideQuestion({
							cfg,
							agentId,
							agentDir: resolveAgentDir(cfg, agentId),
							...model,
							question: params.message,
							sessionEntry,
							sessionKey: target.canonicalKey,
							storePath: target.storePath,
							isNewSession: false,
							resolvedReasoningLevel: "off",
							resolvedThinkLevel: normalizeThinkLevel(sessionEntry.thinkingLevel),
							allowGatewaySubagentBinding: true,
							assertCurrent,
							operatorAuthority: execution.operatorAuthority,
							toolCalls: "deny",
							opts: {
								abortSignal: runSignal,
								timeoutOverrideMs: timeoutMs
							},
							onUsage: (value) => {
								usage = value ? {
									inputTokens: value.input,
									outputTokens: value.output,
									cacheReadTokens: value.cacheRead,
									cacheWriteTokens: value.cacheWrite,
									totalTokens: value.total,
									costUsd: value.cost?.total
								} : void 0;
							}
						}));
						assertCurrent();
						runSignal.throwIfAborted();
						if (!result?.text) throw new Error("Session fork produced no answer.");
						return {
							text: result.text,
							...usage ? { usage } : {}
						};
					}, {
						priority: "background",
						abortSignal: signal
					});
				});
			} finally {
				execution.release();
			}
		},
		async complete(request) {
			const params = { ...request };
			const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId?.trim();
			if (!pluginId) throw new Error("Plugin background completion requires a plugin identity and Gateway binding.");
			const execution = await prepareInProcessAgentExecution({
				agentId: params.agentId,
				pluginRuntimeOwnerId: pluginId,
				resolveGatewayContext
			});
			try {
				const assertCurrent = () => {
					runtimeLifetime?.throwIfAborted();
					execution.assertCurrent();
				};
				runtimeLifetime?.throwIfAborted();
				await execution.authorize();
				assertCurrent();
				authorizeModelOverride(params);
				const signal = AbortSignal.any([
					getGatewayRestartDrainSignal(),
					params.signal,
					runtimeLifetime,
					execution.signal
				].filter((candidate) => candidate !== void 0));
				return await enqueueCommandInLane("subagent", async () => {
					signal.throwIfAborted();
					assertCurrent();
					const [{ resolveConfiguredAgentId }, { resolveSimpleCompletionSelectionForAgent }, { runIsolatedCompletion }, { runWithModelFallback }, { finalizePluginLlmCompletion }] = await Promise.all([
						import("./agent-scope-B7r8PTbp.mjs"),
						import("./simple-completion-runtime-C1vIxH8v.mjs"),
						import("./isolated-completion-CfKBV3c2.mjs"),
						import("./model-fallback-runner-BLAAnNeB.mjs"),
						import("./runtime-llm.runtime.js")
					]);
					await execution.authorize();
					assertCurrent();
					signal.throwIfAborted();
					const { policy } = authorizeModelOverride(params);
					const cfg = execution.context.getRuntimeConfig();
					const agentId = resolveConfiguredAgentId(cfg, params.agentId);
					const explicitOverride = Boolean(params.model?.trim());
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
					const fallbackResult = await execution.run(() => runWithModelFallback({
						cfg,
						agentId,
						provider: selection.provider,
						model: selection.modelId,
						operatorAuthority: execution.operatorAuthority,
						abortSignal: runSignal,
						skipAuthProfileRuntime: true,
						requestedRouteResolution: "resolved",
						...explicitOverride ? { fallbacksOverride: [] } : {},
						run: async (provider, model) => {
							assertCurrent();
							runSignal.throwIfAborted();
							const isSelectedPrimary = provider === selection.provider && model === selection.modelId;
							const result = await runIsolatedCompletion({
								purpose: "plugin-completion",
								config: cfg,
								agentId,
								provider,
								model,
								authProfileId: isSelectedPrimary ? selection.profileId : void 0,
								operatorAuthority: execution.operatorAuthority,
								systemPrompt: params.extraSystemPrompt ?? "",
								prompt: params.message,
								timeoutMs,
								abortSignal: runSignal,
								assertCurrent
							});
							runSignal.throwIfAborted();
							assertCurrent();
							assertOperatorModelAllowed(execution.operatorAuthority, result);
							return result;
						}
					}));
					runSignal.throwIfAborted();
					assertCurrent();
					const result = fallbackResult.result;
					assertOperatorModelAllowed(execution.operatorAuthority, result);
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
				}, {
					priority: "background",
					abortSignal: signal
				});
			} finally {
				execution.release();
			}
		},
		async run(request) {
			const params = { ...request };
			const assertCurrent = params.assertCurrent;
			assertCurrent?.();
			if (params.disableTools === true && (params.toolsAlsoAllow?.length ?? 0) > 0) throw new Error("Tool-free plugin subagent runs cannot request additive tools.");
			const pluginSubagentRequester = resolvePluginSubagentCompletionRequester(params.completionDelivery);
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = normalizeOptionalString(scope?.pluginId);
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
					import("./model-ref-CgMA1Wr1.mjs"),
					import("./agent-scope-B7r8PTbp.mjs"),
					import("./plugin-metadata-snapshot-COIVr8hb.mjs")
				]);
				sessionMutationCommitGuard();
				const model = expectDefined(params.model, "authorized model override");
				const agentId = agentScope.resolveSessionAgentId({
					config: cfg,
					sessionKey: params.sessionKey
				});
				const manifestPlugins = cfg.plugins?.enabled === false ? [] : await metadata.resolvePluginMetadataSnapshotAsync({
					config: cfg,
					env: process.env,
					workspaceDir: agentScope.resolveAgentWorkspaceDir(cfg, agentId)
				});
				sessionMutationCommitGuard();
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
			const { status: waitStatus, error, ...metadata } = await dispatchGatewayMethodInProcess("agent.wait", {
				runId: params.runId,
				...params.timeoutMs != null && { timeoutMs: params.timeoutMs }
			}, { resolveGatewayContext });
			const status = waitStatus === "error" && error?.trim().toLowerCase() === "completed" ? "ok" : waitStatus;
			return {
				...metadata,
				status,
				...status !== "ok" && error ? { error } : {}
			};
		},
		getSessionMessages,
		async deleteSession(params) {
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = normalizeOptionalString(scope?.pluginId);
			const pluginOwnedCleanupOptions = pluginId ? {
				pluginRuntimeOwnerId: pluginId,
				...!hasGatewayAdminScope(scope?.client) ? {
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
//#region src/gateway/server-plugin-github-account.ts
async function resolveTrustedPluginGitHubAccount({ login, signal }, resolveGatewayContext) {
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error("GitHub account lookup is only available to bundled or trusted official plugins");
	return await withInProcessGatewayRead({
		method: "users.list",
		scope,
		resolveGatewayContext,
		callerAuthorityError: "GitHub account lookup caller authority is no longer active"
	}, async (_resolved, assertCurrent) => {
		const signals = [signal, scope?.signal].filter((value) => value !== void 0);
		const requestSignal = signals.length ? AbortSignal.any(signals) : void 0;
		const assertActive = () => {
			assertCurrent();
			requestSignal?.throwIfAborted();
		};
		assertActive();
		let credentialConfigured = false;
		try {
			credentialConfigured = Boolean(githubApiToken(process.env, void 0, "github.com"));
			const { accountId, login: canonicalLogin } = await resolveGitHubUserIdentityByLogin(login, {
				signal: requestSignal,
				allowAnonymousRetry: false
			});
			assertActive();
			return {
				accountId,
				login: canonicalLogin
			};
		} catch (error) {
			assertActive();
			if (error instanceof gitHubPublicApi.ControlUiGitHubError) return { error: {
				statusCode: error.statusCode,
				message: error.message,
				retryAtMs: error.retryAtMs,
				credentialConfigured
			} };
			return { error: {
				statusCode: error instanceof TypeError ? 400 : 502,
				message: error instanceof TypeError ? "invalid GitHub login" : "request failed",
				credentialConfigured
			} };
		}
	});
}
//#endregion
//#region src/gateway/session-facts-read.ts
const SESSION_FACTS_PR_LOAD_LIMIT = 8;
const PR_RETRY_MS = 6e4;
const PR_RETRY_MAX_MS = 9e5;
const rowFacts = /* @__PURE__ */ new WeakMap();
function safeText(value, limit) {
	return value ? truncateUtf16Safe(value, limit) : void 0;
}
function projectPullRequests(pullRequests) {
	return pullRequests.map(({ number, state, url, title }) => ({
		number,
		state,
		...url ? { url } : {},
		...title ? { title: safeText(title, 120) } : {}
	}));
}
/** Project only facts consumed by classifiers; full Gateway row presentation belongs to list/describe. */
function prepareFactsRead(resolved, read, authority, prFacts) {
	const now = Date.now();
	const { cfg, policyConfig, rowContext } = read.state;
	const sharing = prepareProjectedSessionSharing({
		cfg: policyConfig,
		client: resolved.client,
		isMember: (target, identityId) => read.readMembership({
			agentId: target.agentId,
			key: target.storeKey,
			storePath: target.storePath
		})?.has(identityId) ?? false
	});
	const active = createVisibleActiveSessionRunProjector(resolved.context, rowContext.projectedAgentRuns);
	const currentRows = {
		...rowContext,
		subagentRuns: rowContext.subagentRuns.atTime(now)
	};
	const prOwner = resolved.context.controlUiSessionPullRequests;
	let prLoads = 0;
	const admitPrLoad = () => prLoads++ < SESSION_FACTS_PR_LOAD_LIMIT;
	const prRetries = [];
	return {
		read(record) {
			if (record.entry.incognito || resolveSessionVisibility(record.entry) === "draft" || isIncognitoSessionKey(record.key)) return;
			let visible = authority?.visibility.get(record.entry);
			if (visible === void 0) {
				visible = sharing.entryFilter?.(record.key, record.entry) !== false;
				authority?.visibility.set(record.entry, visible);
			}
			if (!visible) return;
			const row = record.materialized.row;
			const live = active({
				requestedKey: record.key,
				canonicalKey: record.key,
				sessionId: record.entry.sessionId,
				agentId: record.agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, record.key)
			});
			const temporal = projectGatewaySessionRunState({
				key: record.key,
				entry: record.entry,
				now,
				rowContext: currentRows
			}).fields;
			const status = live.active ? live.status ?? "running" : temporal.status;
			const run = live.active || status === "queued" ? "active" : status === "failed" || status === "killed" || status === "timeout" || temporal.lastRunError ? "failed" : "idle";
			const prEligible = Boolean(row.worktree?.id || row.repositoryWorkspaceId);
			if (!prEligible) prFacts?.delete(record.key);
			const target = prEligible ? resolveProjectedControlUiSessionPrTarget(read.state.cfg, record) : void 0;
			const cachedPrs = target ? prOwner?.readPrepared(target, () => false) : void 0;
			const retained = prFacts?.get(record.key);
			const previous = retained && retained.owner === prOwner && retained.generation === record.generation && retained.facts.sessionId === record.entry.sessionId && retained.facts.lifecycleRevision === record.entry.lifecycleRevision ? retained : void 0;
			const retryDue = !previous?.retry || previous.retry.at <= now || previous.databaseFactsRevision !== record.databaseFactsRevision || previous.facts.run !== run;
			const admitSelectedLoad = () => retryDue && admitPrLoad();
			const prs = cachedPrs ?? (target ? prOwner?.readPrepared(target, prFacts ? admitSelectedLoad : admitPrLoad) : void 0);
			const prUnavailable = prEligible && (!prs || prs.status !== "ready" || prs.rateLimited);
			if (target && cachedPrs && prUnavailable && (!prFacts || retryDue)) prRetries.push(target);
			const previousFacts = rowFacts.get(row);
			const cached = previousFacts && previousFacts.preview === row.lastMessagePreview && previousFacts.run === run && previousFacts.owner === prOwner && previousFacts.prs === prs ? previousFacts : void 0;
			if (cached && (!prFacts || !prEligible)) return cached;
			const digest = row.observerDigest ? record.entry.observerDigest : void 0;
			const facts = cached?.facts ?? freezeJsonSnapshot({
				key: record.key,
				sessionId: record.entry.sessionId,
				...record.entry.lifecycleRevision ? { lifecycleRevision: record.entry.lifecycleRevision } : {},
				agentId: record.agentId,
				label: safeText(row.label ?? row.displayName, 240),
				derivedTitle: safeText(row.derivedTitle, 240),
				lastMessagePreview: safeText(row.lastMessagePreview ? stripMarkdown(row.lastMessagePreview, {
					linkStyle: "label",
					stripHtml: true
				}).replace(/\s+/gu, " ").trim() : void 0, 400),
				run,
				...digest ? { observerDigest: {
					health: digest.health,
					headline: safeText(digest.headline, 120) ?? "",
					assessment: safeText(digest.assessment, 320),
					revision: digest.revision
				} } : {},
				pullRequests: projectPullRequests(prs?.pullRequests ?? []),
				...prUnavailable ? { pullRequestsUnavailable: true } : {},
				...prs?.rateLimited || prs?.status === "rate-limited" ? { pullRequestsRateLimited: true } : {},
				archived: row.archived === true,
				lastActivityAt: row.lastActivityAt ?? row.updatedAt ?? 0
			});
			const result = cached ?? {
				owner: prOwner,
				prs,
				facts,
				selected: Object.freeze({
					...facts,
					isMain: row.isMain
				}),
				preview: row.lastMessagePreview,
				run
			};
			if (!cached) rowFacts.set(row, result);
			if (prFacts && prEligible) {
				const stale = prUnavailable && previous && (previous.selected.pullRequestsStale || !previous.facts.pullRequestsUnavailable && !previous.facts.pullRequestsRateLimited);
				const delayMs = previous?.retry ? Math.min(previous.retry.delayMs * 2, PR_RETRY_MAX_MS) : PR_RETRY_MS;
				const retry = prUnavailable ? previous?.retry && previous.retry.at > now ? previous.retry : {
					at: now + delayMs,
					delayMs
				} : void 0;
				const selected = !stale ? result.selected : previous.facts === facts && previous.selected.pullRequestsStale ? previous.selected : Object.freeze({
					...facts,
					isMain: row.isMain,
					pullRequests: previous.selected.pullRequests,
					pullRequestsStale: true
				});
				prFacts.set(record.key, {
					generation: record.generation,
					databaseFactsRevision: record.databaseFactsRevision,
					owner: prOwner,
					facts,
					selected,
					retry
				});
				return {
					...result,
					selected
				};
			}
			return result;
		},
		finish() {
			for (const target of prRetries) prOwner?.readPrepared(target, admitPrLoad);
		}
	};
}
//#endregion
//#region src/gateway/session-facts-transient.ts
const temporalKeys = /* @__PURE__ */ new WeakMap();
function transientSessionKeys(context, rows, roster) {
	const keys = new Set(listActiveEmbeddedRunSessionKeys());
	const ids = new Set(listActiveEmbeddedRunSessionIds());
	for (const run of context.chatAbortControllers.values()) {
		if (run.sessionKey) keys.add(run.sessionKey);
		if (run.sessionId) ids.add(run.sessionId);
	}
	const projected = rows.projectedAgentRuns;
	if (projected) {
		for (const [source, target] of [[projected.sessionKeys, keys], [projected.sessionIds, ids]]) for (const identity of source.keys()) target.add(identity.slice(identity.indexOf("\0") + 1));
		for (const key of projected.ownerlessSessionKeys.keys()) keys.add(key);
		for (const id of projected.ownerlessSessionIds.keys()) ids.add(id);
	}
	const subagents = rows.subagentRuns;
	let temporal = temporalKeys.get(subagents.revision);
	if (!temporal) {
		temporal = new Set([...subagents.runsByChildSessionKey].flatMap(([key, runs]) => runs.some((run) => typeof run.execution.endedAt !== "number") ? [key] : []));
		temporalKeys.set(subagents.revision, temporal);
	}
	for (const key of temporal) keys.add(key);
	for (const run of subagentRuns.values()) if (typeof run.execution.endedAt !== "number") keys.add(run.childSessionKey);
	for (const id of ids) for (const key of roster.bySessionId.get(id) ?? []) keys.add(key);
	return new Set([...keys].filter((key) => roster.targets.has(key)));
}
//#endregion
//#region src/gateway/server-plugin-session-facts.ts
const SESSION_FACTS_LIMIT = 40;
const selectedPrFacts = /* @__PURE__ */ new WeakMap();
function createReadScope(token) {
	return {
		token,
		visibility: /* @__PURE__ */ new WeakMap(),
		facts: /* @__PURE__ */ new Map(),
		dirty: /* @__PURE__ */ new Map(),
		transient: /* @__PURE__ */ new Set()
	};
}
const readScopes = /* @__PURE__ */ new WeakMap();
function trustedScope() {
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error("Session facts are only available to bundled or trusted official plugins");
	return scope;
}
/** The published exact-key API retains its bounded acquisition and response contract. */
async function readTrustedPluginSessionFacts(params, resolveGatewayContext) {
	if (!Array.isArray(params.sessionKeys) || params.sessionKeys.length > SESSION_FACTS_LIMIT || params.sessionKeys.some((key) => typeof key !== "string" || !key.trim() || key.length > 512)) throw new Error(`Session facts require at most 40 nonempty session keys of at most 512 characters`);
	const keys = [...new Set(params.sessionKeys.map((key) => key.trim()))].filter((key) => !isIncognitoSessionKey(key));
	return withInProcessGatewayRead({
		method: "sessions.list",
		scope: trustedScope(),
		resolveGatewayContext,
		callerAuthorityError: "Session facts caller authority is no longer active"
	}, async (resolved, assertCurrent) => {
		const projection = requireSessionRowProjection(resolved.context);
		return withReadySessionRows(projection, (cfg) => keys.flatMap((key) => {
			const requested = resolveRequestedSessionAgentId(cfg, key);
			return requested.ok ? [{
				key,
				agentId: requested.agentId
			}] : [];
		}), (read) => withAgentRosterFactsBatch(read.state.cfg, () => {
			assertCurrent();
			const facts = prepareFactsRead(resolved, read);
			const sessions = keys.flatMap((key) => {
				const requested = resolveRequestedSessionAgentId(read.state.cfg, key);
				const record = requested.ok ? read.describe({
					key,
					agentId: requested.agentId
				}) : void 0;
				return (record && facts.read(record)?.facts) ?? [];
			});
			facts.finish();
			return {
				sessions,
				...sessions.some((row) => row.pullRequestsUnavailable) ? { warnings: ["Pull-request state is unavailable for some sessions."] } : {}
			};
		}));
	});
}
/** Select once through the list owner, then retain caller authority through the plugin consumer. */
async function withTrustedPluginSessionFacts(select, run, resolveGatewayContext) {
	const requestScope = trustedScope();
	return withInProcessGatewayRead({
		method: "sessions.list",
		scope: requestScope,
		resolveGatewayContext,
		callerAuthorityError: "Session facts caller authority is no longer active"
	}, async (resolved, assertCurrent) => {
		const { context } = resolved;
		const projection = requireSessionRowProjection(context);
		const callerKey = () => operatorReadShareKey({ client: requestScope?.client ?? null }, {});
		const authorityKey = callerKey();
		const scopeKey = JSON.stringify([authorityKey, select]);
		const config = context.getRuntimeConfig();
		const configRevision = getRuntimeConfigSnapshotMetadata()?.revision;
		const policy = context.getCommittedRuntimeConfig?.();
		const access = readGatewayAccessRevision();
		const profiles = readUserProfileVersion();
		const assertAuthority = () => {
			assertCurrent();
			if (callerKey() !== authorityKey || getSessionRowProjection(context) !== projection || context.getRuntimeConfig() !== config || getRuntimeConfigSnapshotMetadata()?.revision !== configRevision || context.getCommittedRuntimeConfig?.() !== policy || readGatewayAccessRevision() !== access || readUserProfileVersion() !== profiles) throw new Error("Session read authority changed; retry the request");
		};
		let authority;
		if (authorityKey !== null) {
			let entry = readScopes.get(projection);
			if (!entry) projection.onFactsChange((change) => {
				for (const scope of readScopes.get(projection)?.scopes.values() ?? []) if (change.kind === "reset" || !scope.roster) {
					scope.snapshot = void 0;
					scope.dirty.clear();
				} else if (scope.roster.targets.has(change.key)) scope.dirty.set(change.key, {});
			});
			if (!entry || entry.config !== config || entry.configRevision !== configRevision || entry.policy !== policy || entry.access !== access || entry.profiles !== profiles) {
				entry = {
					config,
					configRevision,
					policy,
					access,
					profiles,
					scopes: /* @__PURE__ */ new Map()
				};
				readScopes.set(projection, entry);
			}
			authority = entry.scopes.get(scopeKey);
			if (!authority) {
				if (entry.scopes.size >= 64) entry.scopes.delete(entry.scopes.keys().next().value);
				authority = createReadScope(randomUUID());
				entry.scopes.set(scopeKey, authority);
			}
		}
		let prFacts = selectedPrFacts.get(projection);
		if (!prFacts) {
			prFacts = /* @__PURE__ */ new Map();
			selectedPrFacts.set(projection, prFacts);
			const current = prFacts;
			projection.onSelectionChange((change) => {
				if (change.kind === "row" && !change.row) current.delete(change.key);
			});
		}
		const currentPrFacts = prFacts;
		const cache = authority ?? createReadScope("");
		const result = await run(await projection.withSelectionPreparation(async () => {
			do {
				await projection.prepareSelection({ yieldForCatalog: true });
				await projection.prepareMembership();
				assertAuthority();
			} while (projection.needsSelectionPreparation());
			const previous = cache.snapshot;
			const previousRoster = cache.roster;
			const previousFacts = cache.facts;
			const previousTransient = cache.transient;
			const at = Date.now();
			const projectionState = projection.state;
			const full = !previous;
			let roster = previousRoster;
			if (full || !roster || roster.revision !== projectionState.revision || at > (roster.selected.activityExpiresAt ?? Infinity)) {
				const opts = {
					...select,
					limit: Number.MAX_SAFE_INTEGER
				};
				const { prepared, filters, presentation } = prepareProjectedSessionList({
					projection,
					opts,
					context,
					client: resolved.client,
					now: at,
					metadataPrepared: true,
					visibility: authority?.visibility
				});
				const selected = presentation.select(opts, () => withAgentRosterFactsBatch(prepared.cfg, () => runSynchronousWork(selectSessionEntries(filters))));
				const targets = /* @__PURE__ */ new Map();
				const bySessionId = /* @__PURE__ */ new Map();
				for (const [key] of selected.entries) {
					const target = prepared.getTarget(key);
					if (!target) continue;
					targets.set(key, target);
					const aliases = bySessionId.get(target.entry.sessionId) ?? /* @__PURE__ */ new Set();
					aliases.add(key);
					bySessionId.set(target.entry.sessionId, aliases);
				}
				roster = {
					revision: projectionState.revision,
					selected,
					targets,
					bySessionId
				};
			}
			const currentRoster = roster;
			const transient = transientSessionKeys(context, projectionState.rowContext, currentRoster);
			const wanted = /* @__PURE__ */ new Set([
				...cache.dirty.keys(),
				...previousTransient,
				...transient
			]);
			for (const [key, retained] of currentPrFacts) if (currentRoster.targets.has(key) && retained.retry && retained.retry.at <= at) wanted.add(key);
			if (full || currentRoster !== previousRoster) {
				for (const [key, target] of currentRoster.targets) if (full || previousRoster?.targets.get(key)?.entry !== target.entry) wanted.add(key);
			}
			if (!wanted.size && currentRoster === previousRoster && previous) return previous;
			const observed = new Map(cache.dirty);
			const updates = /* @__PURE__ */ new Map();
			const missingSessionKeys = [];
			let complete = true;
			const work = [...wanted].flatMap((key) => {
				const target = currentRoster.targets.get(key);
				return target ? [{
					key,
					target
				}] : [];
			});
			for (let offset = 0; offset < work.length; offset += SESSION_FACTS_LIMIT) {
				const batch = work.slice(offset, offset + SESSION_FACTS_LIMIT);
				try {
					const batchRows = await withReadySessionRows(projection, () => batch.map(({ target }) => ({
						key: target.key,
						agentId: target.agentId,
						storePath: target.storeTarget.storePath
					})), (read) => withAgentRosterFactsBatch(read.state.cfg, () => {
						assertAuthority();
						const facts = prepareFactsRead(resolved, read, authority, currentPrFacts);
						const rows = batch.map(({ key, target }) => {
							const record = read.describe({
								key: target.key,
								agentId: target.agentId,
								storePath: target.storeTarget.storePath
							});
							const current = record?.entry.sessionId === target.entry.sessionId ? facts.read(record)?.selected : void 0;
							if (current?.run === "active") transient.add(key);
							observed.set(key, cache.dirty.get(key));
							return {
								key,
								target,
								current
							};
						});
						facts.finish();
						return rows;
					}));
					for (const { key, target, current } of batchRows) {
						updates.set(key, current);
						if (!current && !target.entry.incognito && resolveSessionVisibility(target.entry) !== "draft" && !isIncognitoSessionKey(key)) {
							missingSessionKeys.push(key);
							complete = false;
						}
					}
				} catch (error) {
					assertAuthority();
					complete = false;
					const unavailable = String(error).replace(/\s+/g, " ").slice(0, 300);
					for (const { key, target } of batch) {
						const { entry } = target;
						if (entry.incognito || resolveSessionVisibility(entry) === "draft" || isIncognitoSessionKey(key)) continue;
						const fallback = {
							key,
							sessionId: entry.sessionId,
							agentId: target.agentId,
							label: safeText(entry.label, 240),
							derivedTitle: safeText(entry.autoLabel, 240),
							run: "idle",
							pullRequests: [],
							pullRequestsUnavailable: true,
							archived: entry.archivedAt !== void 0,
							lastActivityAt: entry.lastActivityAt ?? entry.updatedAt ?? 0,
							isMain: sessionClassificationForRow(config, key, target.agentId, entry).isMain,
							unavailable
						};
						updates.set(key, freezeJsonSnapshot(fallback));
					}
				}
			}
			assertAuthority();
			let retryAt = Infinity;
			for (const [key, retained] of currentPrFacts) if (currentRoster.targets.has(key)) retryAt = Math.min(retryAt, retained.retry?.at ?? Infinity);
			const sameRows = previous && currentRoster === previousRoster && [...updates].every(([key, row]) => row === previousFacts.get(key));
			let result = previous;
			let nextFacts = previousFacts;
			if (!complete || !sameRows || previous?.retryAt !== (Number.isFinite(retryAt) ? retryAt : void 0)) {
				nextFacts = /* @__PURE__ */ new Map();
				const sessions = [];
				for (const [key] of currentRoster.targets) {
					const facts = updates.has(key) ? updates.get(key) : previousFacts.get(key);
					if (!facts) continue;
					nextFacts.set(key, facts);
					sessions.push(facts);
				}
				Object.freeze(sessions);
				Object.freeze(missingSessionKeys);
				result = Object.freeze({
					scope: authority?.token,
					revision: randomUUID(),
					sessions,
					...currentRoster.selected.people !== void 0 ? { people: currentRoster.selected.people } : {},
					...currentRoster.selected.activityExpiresAt !== void 0 ? { activityExpiresAt: currentRoster.selected.activityExpiresAt } : {},
					...Number.isFinite(retryAt) ? { retryAt } : {},
					...missingSessionKeys.length ? { missingSessionKeys } : {}
				});
			}
			if (complete && authority && cache.snapshot === previous && currentRoster.revision === projection.state.revision) {
				cache.snapshot = result;
				cache.roster = currentRoster;
				cache.facts = nextFacts;
				cache.transient = transient;
				for (const [key, token] of observed) if (cache.dirty.get(key) === token) cache.dirty.delete(key);
			}
			return result;
		}));
		assertAuthority();
		return result;
	});
}
//#endregion
//#region src/gateway/server-plugin-user-profile.ts
async function withTrustedPluginUserProfileIdentity(params, run, resolveGatewayContext) {
	if (typeof params.profileId !== "string" || !params.profileId || params.profileId.length > 128 || !Array.isArray(params.emails) || params.emails.length > 500 || params.emails.some((email) => typeof email !== "string" || !email || email.length > 254) || params.githubAccountIds !== void 0 && (!Array.isArray(params.githubAccountIds) || params.githubAccountIds.length > 500 || params.githubAccountIds.some((accountId) => !Number.isSafeInteger(accountId) || accountId <= 0))) throw new Error("Profile identity requires a profileId and at most 500 normalized email addresses or verified GitHub account IDs");
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error("Profile identity is only available to bundled or trusted official plugins");
	const profileId = params.profileId;
	const emails = [...new Set(params.emails)];
	const githubAccountIds = params.githubAccountIds && [...new Set(params.githubAccountIds)];
	return await withInProcessGatewayRead({
		method: "users.list",
		scope,
		resolveGatewayContext,
		callerAuthorityError: "Profile identity caller authority is no longer active"
	}, async (_resolved, assertCaller) => {
		const profile = await prepareUserProfileIdentity(profileId, {}, emails);
		try {
			assertCaller();
			const bindings = profile.emailBindingIds;
			const assertCurrent = () => {
				assertCaller();
				profile.readCurrentProfile(bindings, githubAccountIds);
			};
			assertCurrent();
			return await run(assertCurrent);
		} finally {
			profile.release();
		}
	});
}
//#endregion
//#region src/gateway/server-plugins.ts
async function dispatchTrustedPluginGatewayMethod(method, params = {}, options, resolveGatewayContext) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const pluginId = scope?.pluginId?.trim();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error(`Gateway requests are only available to bundled or trusted official plugins. ${pluginId ? `Plugin "${pluginId}" is neither.` : "This call carries no plugin identity."} See https://docs.openclaw.ai/plugins/sdk-runtime#api-runtime-gateway`);
	const syntheticScopes = normalizeOperatorScopeList(options?.scopes);
	let requestParams = params;
	const expectedSession = options?.sessionDeliveryGeneration;
	if (expectedSession) {
		if (method !== "send") throw new Error("Session delivery generation is only valid for Gateway send requests");
		const context = getInProcessGatewayRequestContext(resolveGatewayContext);
		if (!context) throw new Error("Session delivery generation requires an active Gateway");
		const projection = requireSessionRowProjection(context);
		const generation = await withReadySessionRows(projection, (cfg) => {
			const requested = resolveRequestedSessionAgentId(cfg, expectedSession.sessionKey);
			return requested.ok ? [{
				key: expectedSession.sessionKey,
				agentId: requested.agentId
			}] : [];
		}, (read) => {
			const requested = resolveRequestedSessionAgentId(read.state.cfg, expectedSession.sessionKey);
			const record = requested.ok ? read.describe({
				key: expectedSession.sessionKey,
				agentId: requested.agentId
			}) : void 0;
			if (!record?.entry.sessionId || record.entry.sessionId !== expectedSession.sessionId || (record.entry.lifecycleRevision ?? void 0) !== expectedSession.lifecycleRevision) throw new Error("Requester session changed during delivery");
			return {
				agentId: record.agentId,
				storePath: record.storeTarget.storePath,
				sessionKey: record.key,
				sessionId: record.entry.sessionId,
				lifecycleRevision: record.entry.lifecycleRevision ?? null
			};
		});
		requestParams = bindInProcessSessionDeliveryGeneration(params, generation);
	}
	return await dispatchGatewayMethodInProcess(method, requestParams, {
		forceSyntheticClient: true,
		pluginRuntimeOwnerId: pluginId,
		resolveGatewayContext,
		...!scope?.client ? { operatorRoleActor: { kind: "system" } } : {},
		...syntheticScopes ? { syntheticScopes } : {},
		...options?.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
	});
}
/** Narrow requester-only presentation capability; unlike arbitrary RPC it grants no plugin scopes. */
async function openPluginPanelForRequester(params, resolveGatewayContext) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const registry = scope?.pluginRegistry;
	const record = registry?.plugins.find((candidate) => candidate.id === scope?.pluginId);
	if (!registry || !record) throw new Error("Opening a plugin panel requires a current plugin runtime.");
	const live = capturePluginLifecycleAuthority(registry, record, { admittedRuntime: true });
	const assertCurrent = () => {
		scope?.signal?.throwIfAborted();
		if (!live?.()) throw new Error("Opening a plugin panel requires a current plugin runtime.");
	};
	assertCurrent();
	return await dispatchGatewayMethodInProcess("ui.command", {
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		command: {
			kind: "panel",
			panel: "plugin",
			pluginId: record.id,
			panelId: params.panelId,
			open: true
		}
	}, {
		pluginRuntimeOwnerId: record.id,
		resolveGatewayContext,
		syntheticScopeMode: "minimum",
		sessionMutationCommitGuard: assertCurrent
	});
}
function createGatewayNodesRuntime(resolveGatewayContext, runtimeLifetime) {
	const invokeNode = async (params, stream, signal = params.signal) => {
		const scope = getPluginRuntimeGatewayRequestScope();
		const pluginId = scope?.pluginId?.trim() || void 0;
		const normalizedScopes = normalizeOperatorScopeList(params.scopes);
		const requestedScopes = canTrustedOfficialPluginRequestScopes({
			...scope,
			pluginId
		}) ? normalizedScopes : void 0;
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
				const { dispatchLowLevelChannelReplyFromConfig } = await import("./dispatch-from-config-7Fo2eVoy.mjs");
				const sessionWorkerPlacementContext = getInProcessGatewayRequestContext(resolveBoundGatewayContext);
				const run = async () => await dispatchLowLevelChannelReplyFromConfig({
					...params,
					...sessionWorkerPlacementContext ? { sessionWorkerPlacementContext } : {}
				});
				return resolveBoundGatewayContext ? await withPluginRuntimeGatewayContextResolver(resolveBoundGatewayContext, run) : await run();
			},
			gateway: {
				isAvailable: async () => hasInProcessGatewayContext(resolveBoundGatewayContext),
				request: (method, params, options) => dispatchTrustedPluginGatewayMethod(method, params, options, resolveBoundGatewayContext),
				openPluginPanel: (params) => openPluginPanelForRequester(params, resolveBoundGatewayContext),
				readSessionFacts: (params) => readTrustedPluginSessionFacts(params, resolveBoundGatewayContext),
				withSessionFacts: (select, run) => withTrustedPluginSessionFacts(select, run, resolveBoundGatewayContext),
				subscribeSessionChanges: subscribeRuntimeSessionChanges,
				withUserProfileIdentity: (params, run) => withTrustedPluginUserProfileIdentity(params, run, resolveBoundGatewayContext),
				resolveGitHubAccount: (params) => resolveTrustedPluginGitHubAccount({
					...params,
					signal: params.signal ? AbortSignal.any([params.signal, signal]) : signal
				}, resolveBoundGatewayContext)
			},
			hooks: { dispatchHookAgentTurn: async (params) => {
				const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
				const gatewayContext = resolveBoundGatewayContext?.();
				if (!pluginId || !gatewayContext?.dispatchHookAgentTurn) throw new Error("Plugin hook runtime requires an active Gateway and plugin identity.");
				return await gatewayContext.dispatchHookAgentTurn(pluginId, params);
			} },
			nodes: createGatewayNodesRuntime(resolveBoundGatewayContext, signal),
			subagent: createGatewaySubagentRuntime(resolveBoundGatewayContext, overridePolicies, signal)
		}
	};
}
async function loadGatewayPlugins(params) {
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
		pluginRegistry = gatewayRuntimeBindings ? await loadOpenClawPluginsAsync({
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
export { withTrustedPluginUserProfileIdentity as a, resolveTrustedPluginGitHubAccount as c, openPluginPanelForRequester as i, createGatewaySubagentRuntime as l, dispatchTrustedPluginGatewayMethod as n, readTrustedPluginSessionFacts as o, loadGatewayPlugins as r, withTrustedPluginSessionFacts as s, createGatewayNodesRuntime as t };
