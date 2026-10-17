import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DGIwWbpu.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { n as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { i as getGatewayContextLifetime, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { a as getPluginRuntimeGatewayRequestScope, n as getInProcessGatewayRequestContext, s as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CnhlPo20.mjs";
import { l as getActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-D0pq-oeY.mjs";
import { d as hasGatewayAdminScope, p as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { n as buildPluginRuntimeLoadOptions, o as setPluginRuntimeLoadContext, r as createPluginRuntimeLoaderLogger } from "./load-context-Bf_u2yr8.mjs";
import { i as loadOpenClawPlugins } from "./loader-runtime-load-BQO3MsEg.mjs";
import { o as resolvePluginSubagentCompletionRequester } from "./hooks-ADSXph0M.mjs";
import { n as assertOperatorModelAllowed } from "./admitted-run-context-QJnFIxUZ.mjs";
import { o as prepareUserProfileIdentity } from "./user-profile-list-CtETKur7.mjs";
import "./loader-D4eOiGg6.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as subscribeRuntimeSessionChanges } from "./session-changes-DMNZsoj3.mjs";
import { a as withInProcessGatewayRead, r as prepareInProcessAgentExecution, t as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-CakmmEh-.mjs";
import { i as resolvePluginSubagentToolsAlsoAllow } from "./server-plugin-runtime-client-0NHGAu9Q.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-CV21FS-d.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { v as resolveSessionVisibility } from "./session-sharing-policy-BVt5saXn.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { i as resolveProjectedControlUiSessionPrTarget } from "./control-ui-session-pr-read-FCVdRRgl.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-D34IlGk3.mjs";
import { t as compileModelAllowlist } from "./model-allowlist-B-pOfwbj.mjs";
import { t as createBackgroundWorkOwner } from "./background-work-53N6rVrD.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-BYWh0eAO.mjs";
import { i as projectGatewayRuntimeNodes, n as openGatewayNodeDuplex, t as hasInProcessGatewayContext } from "./server-plugins-node-runtime-5rCeuEUA.mjs";
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
	if (!params.model?.trim() || !params.provider && !params.model.includes("/")) throw new Error("fallback provider/model overrides that use an allowlist must resolve to a canonical provider/model target.");
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
					const [{ resolveConfiguredAgentId }, { resolveSimpleCompletionSelectionForAgent }, { runIsolatedCompletion }, { runWithModelFallback }, { finalizePluginLlmCompletion }] = await Promise.all([
						import("./agent-scope-BbGZA7Yc.mjs"),
						import("./simple-completion-runtime-qMH57vEd.mjs"),
						import("./isolated-completion-BohnM3M_.mjs"),
						import("./model-fallback-runner-SUMjZ3Fu.mjs"),
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
							signal.throwIfAborted();
							runSignal.throwIfAborted();
							const isSelectedPrimary = provider === selection.provider && model === selection.modelId;
							const result = await runIsolatedCompletion({
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
							signal.throwIfAborted();
							assertOperatorModelAllowed(execution.operatorAuthority, result);
							return result;
						}
					}));
					runSignal.throwIfAborted();
					assertCurrent();
					signal.throwIfAborted();
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
				}, { abortSignal: signals.length ? AbortSignal.any(signals) : void 0 });
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
					import("./model-ref--qWksVUR.mjs"),
					import("./agent-scope-BbGZA7Yc.mjs"),
					import("./plugin-metadata-snapshot-DcoK08YM.mjs")
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
//#region src/gateway/server-plugin-session-facts.ts
const SESSION_FACTS_LIMIT = 40;
function safeText(value, limit) {
	return value ? truncateUtf16Safe(redactToolPayloadText(value), limit) : void 0;
}
/** Reads the Gateway's prepared rows and PR snapshots; optional enrichment stays with its owner. */
async function readTrustedPluginSessionFacts(params, resolveGatewayContext) {
	if (!Array.isArray(params.sessionKeys) || params.sessionKeys.length > SESSION_FACTS_LIMIT || params.sessionKeys.some((key) => typeof key !== "string" || !key.trim() || key.length > 512)) throw new Error(`Session facts require at most 40 nonempty session keys of at most 512 characters`);
	const keys = [...new Set(params.sessionKeys.map((key) => key.trim()))].filter((key) => !isIncognitoSessionKey(key));
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error("Session facts are only available to bundled or trusted official plugins");
	return await withInProcessGatewayRead({
		method: "sessions.list",
		scope,
		resolveGatewayContext,
		callerAuthorityError: "Session facts caller authority is no longer active"
	}, async (resolved, assertCurrent) => {
		const projection = requireSessionRowProjection(resolved.context);
		return await withReadySessionRows(projection, (cfg) => keys.flatMap((key) => {
			const requested = resolveRequestedSessionAgentId(cfg, key);
			return requested.ok ? [{
				key,
				agentId: requested.agentId
			}] : [];
		}), (read) => {
			assertCurrent();
			const presentation = prepareProjectedSessionPresentation(read, resolved.client, Date.now(), createVisibleActiveSessionRunProjector(resolved.context, read.state.rowContext.projectedAgentRuns));
			const sessions = [];
			let unavailable = false;
			for (const key of keys) {
				const requested = resolveRequestedSessionAgentId(read.state.cfg, key);
				if (!requested.ok) continue;
				const query = {
					key,
					agentId: requested.agentId
				};
				if (presentation.authorizeDescription(query)) continue;
				const record = read.describe(query);
				if (!record || record.entry.incognito || resolveSessionVisibility(record.entry) === "draft" || presentation.sharing.entryFilter?.(record.key, record.entry) === false) continue;
				const row = presentation.present(record, {
					includeDerivedTitles: true,
					includeLastMessage: true
				});
				if (!row) continue;
				const target = resolveProjectedControlUiSessionPrTarget(read.state.cfg, record);
				const pullRequests = target ? resolved.context.controlUiSessionPullRequests?.readPrepared(target) : void 0;
				const prUnavailable = !pullRequests || pullRequests.status !== "ready" || pullRequests.rateLimited;
				unavailable ||= prUnavailable;
				const digest = row.observerDigest ? record.entry.observerDigest : void 0;
				sessions.push({
					key: record.key,
					sessionId: record.entry.sessionId,
					...record.entry.lifecycleRevision ? { lifecycleRevision: record.entry.lifecycleRevision } : {},
					agentId: record.agentId,
					label: safeText(row.label ?? row.displayName, 240),
					derivedTitle: safeText(row.derivedTitle, 240),
					lastMessagePreview: safeText(row.lastMessagePreview, 400),
					run: row.hasActiveRun || row.status === "running" || row.status === "queued" ? "active" : row.status === "failed" || row.status === "killed" || row.status === "timeout" || row.lastRunError ? "failed" : "idle",
					...digest ? { observerDigest: {
						health: digest.health,
						headline: safeText(digest.headline, 120) ?? "",
						assessment: safeText(digest.assessment, 320),
						revision: digest.revision
					} } : {},
					pullRequests: pullRequests?.pullRequests.map(({ number, state }) => ({
						number,
						state
					})) ?? [],
					...prUnavailable ? { pullRequestsUnavailable: true } : {},
					archived: row.archived === true,
					lastActivityAt: row.lastActivityAt ?? row.updatedAt ?? 0
				});
			}
			return {
				sessions,
				...unavailable ? { warnings: ["Pull-request state is unavailable for some sessions."] } : {}
			};
		});
	});
}
//#endregion
//#region src/gateway/server-plugin-user-profile.ts
async function withTrustedPluginUserProfileIdentity(params, run, resolveGatewayContext) {
	if (typeof params.profileId !== "string" || !params.profileId || params.profileId.length > 128 || !Array.isArray(params.emails) || params.emails.length > 500 || params.emails.some((email) => typeof email !== "string" || !email || email.length > 254) || params.githubAccountIds !== void 0 && (!Array.isArray(params.githubAccountIds) || params.githubAccountIds.length > 500 || params.githubAccountIds.some((accountId) => !Number.isSafeInteger(accountId) || accountId <= 0))) throw new Error("Profile identity requires a profileId and at most 500 canonical emails or verified GitHub account IDs");
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
	return await dispatchGatewayMethodInProcess(method, params, {
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
				const { dispatchLowLevelChannelReplyFromConfig } = await import("./dispatch-from-config-COuPV_rD.mjs");
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
				subscribeSessionChanges: subscribeRuntimeSessionChanges,
				withUserProfileIdentity: (params, run) => withTrustedPluginUserProfileIdentity(params, run, resolveBoundGatewayContext)
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
export { withTrustedPluginUserProfileIdentity as a, openPluginPanelForRequester as i, dispatchTrustedPluginGatewayMethod as n, readTrustedPluginSessionFacts as o, loadGatewayPlugins as r, createGatewaySubagentRuntime as s, createGatewayNodesRuntime as t };
