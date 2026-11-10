import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { h as getGatewayContextLifetime, l as withPluginRuntimeGatewayRequestScope, m as getCanonicalGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope, r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { a as READ_SCOPE, f as isOperatorScope, s as SESSION_WRITE_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { o as projectOperatorScopesForMethod, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { l as resolveGatewayToolOperatorSelection, m as withoutGatewayToolCallerIdentity, o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { n as runOutsideOperatorToolGatewayAuthority, r as runWithOperatorToolGatewayAuthority, t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { a as bindInProcessSubagentResume, n as mergePluginRuntimeClientInternal, o as readInProcessSubagentResume, r as projectPluginRuntimeClientExecution, t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { n as isInProcessSessionRun } from "./in-process-session-run-1xLeAqeJ.mjs";
import { t as resolveRuntimeSessionParticipant } from "./session-tool-participant-BFO6ds0j.mjs";
import { r as registerSubagentCompletionToolHandoff, t as cancelSubagentCompletionToolHandoff } from "./subagent-completion-tool-handoff-D0AAXR3P.mjs";
//#region src/gateway/in-process-agent-runtime-identity.ts
const inProcessAgentRuntimeIdentities = /* @__PURE__ */ new WeakMap();
/** Carry authenticated runtime identity without widening plugin dispatch options. */
function withInProcessAgentRuntimeIdentity(options, identity) {
	if (!identity) return options;
	const carried = { ...options };
	inProcessAgentRuntimeIdentities.set(carried, identity);
	return carried;
}
function readInProcessAgentRuntimeIdentity(options) {
	return options ? inProcessAgentRuntimeIdentities.get(options) : void 0;
}
//#endregion
//#region src/gateway/server-plugin-in-process-scopes.ts
function resolveInProcessGatewaySyntheticScopes(params) {
	const { operatorScopes, syntheticScopeMode } = params;
	const requestedSyntheticScopes = (params.syntheticScopes ?? (syntheticScopeMode === "exact" ? operatorScopes ?? params.scopedClientScopes : void 0) ?? ["operator.write"]).map((requested) => {
		const broad = requested === "operator.sessions.read" ? READ_SCOPE : requested === "operator.sessions.write" ? WRITE_SCOPE : void 0;
		return syntheticScopeMode === "minimum" && broad && operatorScopes && roleScopesAllow({
			role: "operator",
			requestedScopes: [broad],
			allowedScopes: operatorScopes
		}) ? broad : requested;
	});
	const syntheticScopes = operatorScopes ? syntheticScopeMode === "exact" ? requestedSyntheticScopes.filter((requestedScope) => roleScopesAllow({
		role: "operator",
		requestedScopes: [requestedScope],
		allowedScopes: operatorScopes
	})) : projectOperatorScopesForMethod({
		method: params.method,
		requestParams: params.requestParams,
		requestedScopes: requestedSyntheticScopes,
		allowedScopes: operatorScopes,
		...params.allowOwnSessionScope || isInProcessSessionRun(params.method, params.requestParams) ? { sessionScope: SESSION_WRITE_SCOPE } : {},
		...isOperatorScope(params.registeredScope) ? { requiredScope: params.registeredScope } : {}
	}) : syntheticScopeMode === "exact" ? requestedSyntheticScopes : params.syntheticScopes;
	if (syntheticScopeMode !== "exact" && operatorScopes?.includes("operator.admin") && !syntheticScopes?.includes("operator.admin")) syntheticScopes?.push(ADMIN_SCOPE);
	return syntheticScopes;
}
//#endregion
//#region src/gateway/server-plugin-in-process-authority.ts
/** Retains operator attribution and authority only for the awaited tool invocation. */
async function withOperatorToolGatewayAuthority(authority, run) {
	const lifetime = new AbortController();
	const scope = getPluginRuntimeGatewayRequestScope();
	const context = scope?.resolveGatewayContext ? scope.resolveGatewayContext() : scope?.context;
	const captured = context && (authority.operatorRunAuthority || authority.operatorRoleActor?.kind !== "system") ? await captureGatewayOperatorRunAuthority({
		client: scope?.client && !authority.operatorRunAuthority ? scope.client : createSyntheticPluginRuntimeClient({
			authenticatedUserProfile: authority.authenticatedUserProfile,
			operatorRoleActor: authority.operatorRoleActor,
			operatorRunAuthority: authority.operatorRunAuthority,
			scopes: [...authority.scopes]
		}),
		context,
		hasCurrentClientAuthority: scope?.hasCurrentClientAuthority
	}) : void 0;
	try {
		authority.assertCurrent?.();
		captured?.authority.assertCurrent();
		return await runWithOperatorToolGatewayAuthority({
			...authority,
			operatorRunAuthority: captured?.authority ?? authority.operatorRunAuthority,
			signal: lifetime.signal
		}, () => captured && scope?.client ? withPluginRuntimeGatewayRequestScope({
			...scope,
			client: mergePluginRuntimeClientInternal(scope.client, { operatorRunAuthority: captured.authority })
		}, run) : run());
	} finally {
		lifetime.abort(/* @__PURE__ */ new Error("operator tool invocation authority expired"));
		captured?.release();
	}
}
/** Transfer bounded cleanup without retaining the finished operator invocation. */
function runWithOperatorToolGatewayCleanupContext(run) {
	const authority = readOperatorToolGatewayAuthority();
	if (!authority) return run();
	authority.signal.throwIfAborted();
	const scope = getPluginRuntimeGatewayRequestScope();
	const client = createSyntheticPluginRuntimeClient({
		authenticatedUserProfile: authority.authenticatedUserProfile,
		scopes: [...authority.scopes],
		operatorRoleActor: authority.operatorRoleActor ?? scope?.client?.internal?.operatorRoleActor ?? (authority.authenticatedUserProfile ? {
			kind: "operator",
			profileId: authority.authenticatedUserProfile.profileId
		} : void 0)
	});
	return runOutsideOperatorToolGatewayAuthority(() => withPluginRuntimeGatewayRequestScope({
		...scope,
		client,
		isWebchatConnect: scope?.isWebchatConnect ?? (() => false)
	}, run));
}
function captureOperatorToolGatewayContinuationContextInternal(target, options) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const resolveGatewayContext = getGatewayToolCallerIdentity()?.gatewayContextResolver ?? scope?.resolveGatewayContext;
	if (!getInProcessGatewayRequestContext(resolveGatewayContext)) return;
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const method = options?.request?.method ?? "agent";
	if (options?.request && method !== "plugins.reload") throw new Error("Request-bound continuation only supports plugin reload");
	const requestParams = options?.request?.params ?? target;
	const resolved = resolveInProcessGatewayDispatch(method, requestParams, {
		forceSyntheticClient: true,
		operatorRoleActor: { kind: "system" },
		resolveGatewayContext,
		...options?.request ? {
			syntheticScopes: resolveLeastPrivilegeOperatorScopesForMethod(method, requestParams),
			syntheticScopeMode: "minimum"
		} : { syntheticScopeMode: "exact" }
	});
	return captureGatewayOperatorRunAuthority({
		client: resolved.operatorSourceClient,
		context: resolved.context,
		hasCurrentClientAuthority: resolved.hasCurrentClientAuthority,
		independentContinuation: true
	}).then((captured) => {
		try {
			captured?.authority.assertCurrent();
			resolved.assertContextCurrent();
			resolved.assertInvocationCurrent();
			assertCallerCurrent?.(method);
			const continuationScope = runWithOperatorToolGatewayCleanupContext(() => ({
				...getPluginRuntimeGatewayRequestScope(),
				client: captured ? mergePluginRuntimeClientInternal(resolved.client, { operatorRunAuthority: captured.authority }) : resolved.client,
				context: resolved.context,
				resolveGatewayContext,
				isWebchatConnect: resolved.isWebchatConnect,
				hasCurrentClientAuthority: captured ? void 0 : resolved.hasCurrentClientAuthority
			}));
			const ownerResolver = resolved.context.resolveGatewayContext ?? resolveGatewayContext;
			const gatewayOwner = ownerResolver && getCanonicalGatewayContextResolver(ownerResolver);
			const signals = [captured?.authority.signal, gatewayOwner && getGatewayContextLifetime(gatewayOwner).signal].filter((signal) => Boolean(signal));
			const lifetime = new AbortController();
			const release = () => {
				if (lifetime.signal.aborted) return;
				lifetime.abort(/* @__PURE__ */ new Error("Gateway continuation authority is no longer active"));
				for (const signal of signals) signal.removeEventListener("abort", release);
				captured?.release();
			};
			for (const signal of signals) signal.addEventListener("abort", release, { once: true });
			if (signals.some((signal) => signal.aborted)) release();
			const assertCurrent = () => {
				lifetime.signal.throwIfAborted();
				captured?.authority.assertCurrent();
				if (captured) {
					if ((resolveGatewayContext ? resolveGatewayContext() : scope?.context) !== resolved.context) throw new Error("Gateway continuation instance binding is no longer active");
				} else resolved.assertSourceCurrent();
				lifetime.signal.throwIfAborted();
			};
			return {
				assertCurrent,
				operatorAuthority: captured?.authority,
				signal: lifetime.signal,
				release,
				run(run) {
					assertCurrent();
					return withoutGatewayToolCallerIdentity(() => runOutsideOperatorToolGatewayAuthority(() => withPluginRuntimeGatewayRequestScope(continuationScope, run)));
				}
			};
		} catch (error) {
			captured?.release();
			throw error;
		}
	});
}
/** Captured while live; its accepting owner, not the original invocation, releases it. */
function captureOperatorToolGatewayContinuationContext(target) {
	return captureOperatorToolGatewayContinuationContextInternal(target);
}
/** Holds the original operator source until an accepted asynchronous follow-up settles. */
async function runWithOperatorToolGatewayContinuationContext(run) {
	const preparation = captureOperatorToolGatewayContinuationContext();
	if (!preparation) return await runWithOperatorToolGatewayCleanupContext(run);
	const captured = await preparation;
	try {
		return await captured.run(run);
	} finally {
		captured.release();
	}
}
function resolveInProcessGatewayDispatch(method, params, options) {
	const inheritedOperatorAuthority = readOperatorToolGatewayAuthority();
	const scope = getPluginRuntimeGatewayRequestScope();
	const caller = getGatewayToolCallerIdentity();
	const selection = caller?.personalToolIdentityScoped ? resolveGatewayToolOperatorSelection() : void 0;
	const resolveGatewayContext = options?.resolveGatewayContext ?? scope?.resolveGatewayContext;
	const context = getInProcessGatewayRequestContext(resolveGatewayContext);
	if (!context) throw new Error(`In-process gateway dispatch requires a gateway request scope or instance binding (method: ${method}).`);
	const runtimeParticipant = resolveRuntimeSessionParticipant({
		method,
		requestParams: params,
		runtimeIdentity: readInProcessAgentRuntimeIdentity(options) ?? scope?.client?.internal?.agentRuntimeIdentity,
		context,
		connId: scope?.client?.connId
	});
	const operatorRunAuthority = selection?.operatorAuthority ?? caller?.operatorAuthority ?? inheritedOperatorAuthority?.operatorRunAuthority ?? scope?.client?.internal?.operatorRunAuthority;
	const assertSettleWakeCurrent = method === "agent" ? options?.settleWakeReplay?.assertCurrent : void 0;
	const isHostOwnedAgentRun = method === "agent" && Boolean(options?.agentRunTracking || assertSettleWakeCurrent);
	const assertCallerCurrent = captureGatewayToolCallerAssertion(method);
	const transfersCreatedInput = method === "sessions.create" && options?.sessionCreation?.via === "spawn" && caller?.operationalRunInstance !== void 0 && assertCallerCurrent !== void 0 && options.agentToolCaller?.agentId === caller.agentId && options.agentToolCaller.sessionKey === caller.sessionKey;
	const assertInvocationCurrent = composeSessionSourceAssertion([
		selection?.assertCurrent,
		runtimeParticipant?.assertCurrent,
		assertSettleWakeCurrent,
		!isHostOwnedAgentRun || !operatorRunAuthority ? composeSessionSourceAssertion([inheritedOperatorAuthority?.assertCurrent], (assertSource) => {
			inheritedOperatorAuthority?.signal.throwIfAborted();
			assertSource();
		}) : void 0,
		operatorRunAuthority?.assertCurrent
	]);
	assertInvocationCurrent();
	if (!isHostOwnedAgentRun) assertCallerCurrent?.(method);
	const scopedOperatorProfile = scope?.client?.authenticatedUserProfile;
	const scopedRoleActor = scope?.client?.internal?.operatorRoleActor;
	const scopedActor = resolveGatewayOperatorRoleActor(scope?.client);
	const matchesOperatorSource = !operatorRunAuthority || scopedActor?.kind === "operator" && scopedActor.profileId === operatorRunAuthority.profileId;
	const matchesSelectingSource = selection !== void 0 && scopedActor?.kind === "operator" && scopedActor.profileId === caller?.operatorAuthority?.profileId;
	const explicitSystemActor = !scope?.client && !inheritedOperatorAuthority ? options?.operatorRoleActor : void 0;
	const verifiedOperatorAuthority = inheritedOperatorAuthority ?? (scopedOperatorProfile?.profileId ? {
		authenticatedUserProfile: scopedOperatorProfile,
		scopes: scope?.client?.connect.scopes ?? []
	} : void 0);
	const operatorAuthority = !isHostOwnedAgentRun && (!operatorRunAuthority || verifiedOperatorAuthority?.authenticatedUserProfile?.profileId === operatorRunAuthority.profileId) ? verifiedOperatorAuthority : void 0;
	const operatorRoleActor = (operatorRunAuthority ? {
		kind: "operator",
		profileId: operatorRunAuthority.profileId
	} : void 0) ?? inheritedOperatorAuthority?.operatorRoleActor ?? (isHostOwnedAgentRun ? inheritedOperatorAuthority?.authenticatedUserProfile ? {
		kind: "operator",
		profileId: inheritedOperatorAuthority.authenticatedUserProfile.profileId
	} : scopedRoleActor ?? (scopedOperatorProfile?.profileId ? {
		kind: "operator",
		profileId: scopedOperatorProfile.profileId
	} : scope?.client ? void 0 : explicitSystemActor ?? { kind: "system" }) : scopedRoleActor ?? explicitSystemActor);
	const isWebchatConnect = scope?.isWebchatConnect ?? (() => false);
	if (options?.requireScopedClient === true && !scope?.client) throw new Error(`In-process gateway dispatch requires an authenticated plugin request scope (method: ${method}).`);
	const pluginRuntimeOwnerId = normalizeOptionalString(options?.pluginRuntimeOwnerId);
	const pluginRecord = pluginRuntimeOwnerId ? getActivePluginRegistry()?.plugins.find((entry) => entry.id === pluginRuntimeOwnerId) : void 0;
	const nodeInvokeApprovalSessionKey = method === "node.invoke" && scope?.pluginId?.trim() === pluginRuntimeOwnerId && (scope?.pluginOrigin === "bundled" || scope?.pluginTrustedOfficialInstall === true || pluginRecord?.origin === "bundled" || pluginRecord?.trustedOfficialInstall === true) ? options?.nodeInvokeApprovalSessionKey : void 0;
	if (options?.nodeInvokeStream && (method !== "node.invoke" || !pluginRuntimeOwnerId || options.forceSyntheticClient !== true)) throw new Error("Node invoke streaming requires an owner-bound trusted synthetic client.");
	const delegatedToolPolicyHandoffId = options?.delegatedToolPolicyHandoff ? registerSubagentCompletionToolHandoff(options.delegatedToolPolicyHandoff) : void 0;
	const scopedSystemScopes = options?.syntheticScopeMode !== void 0 && scopedActor?.kind === "system" ? scope?.client?.connect.scopes ?? [] : void 0;
	const selectedScopes = selection && operatorRunAuthority && caller?.operatorAuthority ? intersectOperatorScopes(operatorRunAuthority.scopes, caller.operatorAuthority.scopes) : operatorRunAuthority?.scopes;
	const sourceScopes = selectedScopes && scope?.client && (matchesOperatorSource || matchesSelectingSource) ? intersectOperatorScopes(selectedScopes, scope.client.connect.scopes ?? []) : selectedScopes ?? operatorAuthority?.scopes ?? (options?.syntheticScopeMode !== void 0 ? inheritedOperatorAuthority?.scopes : void 0) ?? (operatorRoleActor?.kind === "operator" ? verifiedOperatorAuthority?.scopes ?? scope?.client?.connect.scopes ?? [] : void 0);
	const operatorScopes = scopedSystemScopes && sourceScopes ? intersectOperatorScopes(sourceScopes, scopedSystemScopes) : scopedSystemScopes ?? sourceScopes;
	const syntheticScopes = resolveInProcessGatewaySyntheticScopes({
		method,
		requestParams: params,
		syntheticScopes: options?.syntheticScopes,
		syntheticScopeMode: options?.syntheticScopeMode,
		operatorScopes,
		scopedClientScopes: scope?.client?.connect.scopes,
		registeredScope: context.getGatewayMethodRegistry?.().getScope(method),
		allowOwnSessionScope: context.getGatewayMethodRegistry?.().getSessionAccess?.(method)?.allowOwnSessionScope
	});
	const baseSyntheticClient = createSyntheticPluginRuntimeClient({
		...operatorAuthority ? { authenticatedUserProfile: operatorAuthority.authenticatedUserProfile } : {},
		allowModelOverride: options?.allowSyntheticModelOverride === true,
		agentToolCaller: options?.agentToolCaller,
		agentRunTracking: options?.agentRunTracking,
		...operatorRoleActor ? { operatorRoleActor } : {},
		...operatorRunAuthority ? { operatorRunAuthority } : {},
		...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
		...nodeInvokeApprovalSessionKey ? { nodeInvokeApprovalSessionKey } : {},
		pluginSubagentRequester: options?.pluginSubagentRequester,
		runtimePluginToolGrant: options?.runtimePluginToolGrant,
		pluginSubagentToolsAllow: options?.pluginSubagentToolsAllow,
		delegatedToolPolicyHandoffId,
		...options?.sessionCreation ? { sessionCreation: options.sessionCreation } : {},
		scopes: syntheticScopes
	});
	const scopedStreamClient = options?.nodeInvokeStream ? scope?.client : void 0;
	const syntheticClient = projectPluginRuntimeClientExecution({
		client: baseSyntheticClient,
		streamClient: scopedStreamClient,
		identity: readInProcessAgentRuntimeIdentity(options),
		nodeInvokeStream: options?.nodeInvokeStream
	});
	const scopedClient = mergePluginRuntimeClientInternal(scope?.client, pluginRuntimeOwnerId || options?.agentRunTracking || options?.pluginSubagentRequester || options?.runtimePluginToolGrant || options?.pluginSubagentToolsAllow || options?.delegatedToolPolicyHandoff || scope?.client?.internal?.delegatedToolPolicyHandoffId ? {
		...options?.agentRunTracking ? { agentRunTracking: options.agentRunTracking } : {},
		...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
		...options?.pluginSubagentRequester ? { pluginSubagentRequester: options.pluginSubagentRequester } : {},
		runtimePluginToolGrant: options?.runtimePluginToolGrant,
		pluginSubagentToolsAllow: options?.pluginSubagentToolsAllow,
		delegatedToolPolicyHandoffId
	} : void 0);
	if (options?.disableSyntheticClient === true && (!scopedClient || !matchesOperatorSource)) {
		cancelSubagentCompletionToolHandoff(delegatedToolPolicyHandoffId);
		throw new Error(`In-process gateway dispatch requires a scoped client (method: ${method}).`);
	}
	const useScopedClient = options?.forceSyntheticClient !== true && scopedClient && matchesOperatorSource;
	const client = useScopedClient ? operatorRunAuthority ? mergePluginRuntimeClientInternal(scopedClient, void 0, intersectOperatorScopes(scopedClient.connect.scopes ?? [], operatorRunAuthority.scopes)) : scopedClient : syntheticClient;
	const resume = readInProcessSubagentResume(options);
	if (resume) {
		if (method !== "agent" || options?.forceSyntheticClient !== true || !client.internal) throw new Error("Task resume requires a synthetic agent admission.");
		bindInProcessSubagentResume(client.internal, resume);
	}
	const assertSourceCurrent = composeSessionSourceAssertion([operatorRunAuthority?.assertCurrent], (assertSource) => {
		assertSource();
		if ((resolveGatewayContext ? resolveGatewayContext() : scope?.context) !== context) throw new Error(`In-process gateway dispatch requires a current gateway instance binding (method: ${method}).`);
	});
	return {
		assertSourceCurrent,
		assertInvocationCurrent,
		assertContextCurrent: composeSessionSourceAssertion([
			selection?.assertCurrent,
			runtimeParticipant?.assertCurrent,
			assertSourceCurrent,
			method !== "agent" ? assertCallerCurrent : void 0
		]),
		...transfersCreatedInput ? { assertCreatedInputSourceCurrent: assertSourceCurrent } : {},
		client,
		context,
		delegatedToolPolicyHandoffId,
		isWebchatConnect,
		operatorSourceClient: operatorRunAuthority ? {
			...client,
			internal: {
				...client.internal,
				operatorRunAuthority
			}
		} : inheritedOperatorAuthority ? createSyntheticPluginRuntimeClient({
			authenticatedUserProfile: inheritedOperatorAuthority.authenticatedUserProfile,
			operatorRoleActor: inheritedOperatorAuthority.operatorRoleActor,
			scopes: [...inheritedOperatorAuthority.scopes]
		}) : scope?.client ?? client,
		hasCurrentClientAuthority: options?.hasCurrentClientAuthority ?? (operatorRunAuthority && !useScopedClient ? void 0 : scope?.hasCurrentClientAuthority)
	};
}
//#endregion
export { runWithOperatorToolGatewayContinuationContext as a, runWithOperatorToolGatewayCleanupContext as i, captureOperatorToolGatewayContinuationContextInternal as n, withOperatorToolGatewayAuthority as o, resolveInProcessGatewayDispatch as r, withInProcessAgentRuntimeIdentity as s, captureOperatorToolGatewayContinuationContext as t };
