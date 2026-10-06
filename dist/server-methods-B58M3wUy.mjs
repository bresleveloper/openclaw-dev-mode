import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getPluginRuntimeGatewayRequestScope, l as withPluginRuntimeRegistryScope, r as getPluginRuntimeGatewayNodeAuthorities, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.mjs";
import { bd as GATEWAY_RESTART_UNAVAILABLE_REASON, xd as GATEWAY_SUSPEND_UNAVAILABLE_REASON } from "./src-BRUl7oDv.mjs";
import { _ as resolveSessionMethodScope, c as resolveLeastPrivilegeOperatorScopesForMethod, d as createCoreGatewayMethodDescriptors, f as isCoreGatewayMethodClassified, m as listCoreGatewayHandlerMethodNames, n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { a as sessionMutationTargetFields } from "./session-method-policy-DfouRHm3.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { D as tryBeginGatewayPreparedRestartRootWorkAdmission, c as getGatewaySuspendAdmissionPhase, k as tryBeginGatewayRootWorkAdmission, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining } from "./gateway-work-admission-CHv_0noy.mjs";
import { l as getActivePluginRegistry } from "./runtime-BpkslxNJ.mjs";
import { m as withCanonicalSessionValidationDeferral } from "./session-canonical-key-BBylVEaq.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as withSessionMutationCommitGuard, i as readGatewayRequestMutationAuthority, n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-0UAXtQaz.mjs";
import { Q as authorizeAuthenticatedProfileForMethod, V as isGatewayAdmin, o as resolveDirectIncognitoTargets, s as resolveDirectSessionTargets, t as resolveSessionMutationAuthorization } from "./session-sharing-BN4IrU72.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { n as createExpectedProfileBinding } from "./expected-profile-CX3834Uq.mjs";
import { r as classifyGatewayStaleInstall } from "./stale-install-BTpQ40eq.mjs";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-MtFtvM4m.mjs";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-mnXyzTxO.mjs";
import { n as createGatewayMethodRegistry, r as createPluginGatewayMethodDescriptors, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-Cb2RFYbY.mjs";
import { t as canSelectQuestion } from "./question-access-Zri0o4CD.mjs";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-qz1zEEvg.mjs";
import { t as isTargetedNonSafeGatewayRestartRequest } from "./restart-request-CTr9_H5j.mjs";
import { r as retainSessionListForegroundWork } from "./session-projection-work-BJ52HUIn.mjs";
//#region src/gateway/server-methods/lazy-core-handlers.ts
const preparations = /* @__PURE__ */ new WeakMap();
/** Resolve forwarding wrappers without mistaking them for actual handler entry. */
async function prepareGatewayRequestHandler(handler, entry) {
	let preparedHandler = handler;
	let prepare = preparations.get(preparedHandler);
	while (prepare) {
		entry?.assertOpen();
		preparedHandler = await prepare();
		prepare = preparations.get(preparedHandler);
	}
	return preparedHandler;
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => {
		const forwarding = async (opts) => {
			const entry = opts.context.requestEntryLifetime?.enter(opts);
			try {
				const handler = await prepareGatewayRequestHandler(forwarding, entry);
				entry?.assertOpen();
				entry?.release();
				await handler(opts);
			} finally {
				entry?.release();
			}
		};
		preparations.set(forwarding, async () => {
			const handler = (await params.loadHandlers())[method];
			if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
			return handler;
		});
		return [method, forwarding];
	}));
}
//#endregion
//#region src/gateway/server-methods/core-handlers.ts
const CORE_GATEWAY_HANDLER_MODULES = {
	agent: () => import("./agent-DJXrbJvV.mjs").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-aKb3kFiJ.mjs").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-BqW6q5qV.mjs").then((module) => module.agentsHandlers),
	"claws-monitors": () => import("./claws-monitors-Djv5OGTt.mjs").then((module) => module.clawsMonitorHandlers),
	"claws-packages": () => import("./claws-packages-Chea15HI.mjs").then((module) => module.clawsPackageHandlers),
	"agents-workspace": () => import("./agents-workspace-B_B_JfWv.mjs").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-BOqza1oh.mjs").then((module) => module.artifactsHandlers),
	board: () => import("./board-8XdahWue.mjs").then((module) => module.boardHandlers),
	audit: () => import("./audit-BxKnEMHY.mjs").then((module) => module.auditHandlers),
	users: () => import("./users-CD8PIDkP.mjs").then((module) => module.usersHandlers),
	"users-mentionable": () => import("./users-mentionable-CDRlv8KO.mjs").then((module) => module.usersMentionableHandlers),
	attach: () => import("./attach-BdccYclL.mjs").then((module) => module.attachHandlers),
	channels: () => import("./channels-CU6IpNWu.mjs").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-Chq2N-mO.mjs").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-DD-Tjpnb.mjs").then((module) => module.chatHandlers),
	"chat-send": () => import("./chat-send-external-entry-DyGaco1z.mjs").then((module) => ({ "chat.send": module.handleDirectExternalChatSend })),
	"chat-abort": () => import("./chat-abort-handler-Claw-Wps.mjs").then((module) => ({ "chat.abort": module.handleChatAbortRequest })),
	commands: () => import("./commands-BegpbATg.mjs").then((module) => module.commandsHandlers),
	computer: () => import("./computer-DyyVBFBM.mjs").then((module) => module.computerHandlers),
	config: () => import("./config-qmBOrpOo.mjs").then((module) => module.configHandlers),
	conversations: () => import("./conversations-xam-lupX.mjs").then((module) => module.conversationHandlers),
	connect: () => import("./connect-6B0fCusQ.mjs").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-DYCDk9-2.mjs").then((module) => module.controlUiHandlers),
	"plugins-control-ui": () => import("./plugins-control-ui-BNqxm9by.mjs").then((module) => module.pluginsControlUiHandlers),
	cron: () => import("./cron-Cxe4iyxA.mjs").then((module) => module.cronHandlers),
	devices: () => import("./devices-BsZK1_tL.mjs").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-CsXXRE_T.mjs").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-BKvM5WWD.mjs").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-AWe5i88a.mjs").then((module) => module.createDoctorHandlers()),
	environments: () => import("./environments-DSwqSXd0.mjs").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-BeksToXB.mjs").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-DuZATwAo.mjs").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-T0hgmAfB.mjs").then((module) => module.fsHandlers),
	health: () => import("./health-B8zAVDZQ.mjs").then((module) => module.healthHandlers),
	logs: () => import("./logs-D66c1OC-.mjs").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-ryIcHaCz.mjs").then((module) => module.memorySearchHandlers),
	mentions: () => import("./mentions-HM_fs9Tj.mjs").then((module) => module.mentionHandlers),
	terminal: () => import("./terminal-D6yXjeh6.mjs").then((module) => module.terminalHandlers),
	transcripts: () => import("./transcripts-DgiY-XRu.mjs").then((module) => module.transcriptsHandlers),
	"ui-command": () => import("./ui-command-EWHb9J5b.mjs").then((module) => module.uiCommandHandlers),
	themes: () => import("./themes-DagmdccV.mjs").then((module) => module.themeHandlers),
	"models-auth-status": () => import("./models-auth-status-Cx-L-oFR.mjs").then((module) => module.modelsAuthStatusHandlers),
	"models-auth-login": () => import("./models-auth-login-DWJgnDLI.mjs").then((module) => module.modelsAuthLoginHandlers),
	"mcp-auth-login": () => import("./mcp-auth-login-DHrCTPxw.mjs").then((module) => module.mcpAuthLoginHandlers),
	"models-auth-order": () => import("./models-auth-order-BlB_A6LN.mjs").then((module) => module.modelsAuthOrderHandlers),
	models: () => import("./models-B_ZkM4eP.mjs").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-OT2cTLGQ.mjs").then((module) => module.modelsProbeHandlers),
	"web-search": () => import("./web-search-DqAWRqHF.mjs").then((module) => module.webSearchHandlers),
	"native-hook-relay": () => import("./native-hook-relay-Cs5-kNfv.mjs").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-CcnKKwgL.mjs").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-BPysGndh.mjs").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-gbJeeaey.mjs").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-5T0i34ow.mjs").then((module) => module.pluginsHandlers),
	"plugins-mutations": () => import("./plugins-mutations-DYV2Y5Zt.mjs").then((module) => module.pluginMutationHandlers),
	projects: () => import("./projects-DLvIJwOw.mjs").then((module) => module.projectsHandlers),
	portals: () => import("./portals-XBHXPcI1.mjs").then((module) => module.portalHandlers),
	"progress-card": () => import("./progress-card-BB2fREOU.mjs").then((module) => module.progressCardHandlers),
	migrations: () => import("./migrations-1vwJHs0h.mjs").then((module) => module.migrationsHandlers),
	push: () => import("./push-DbDYNlj6.mjs").then((module) => module.pushHandlers),
	restart: () => import("./restart-BoRZ5hme.mjs").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-kcUlxP65.mjs").then((module) => module.suspendHandlers),
	send: () => import("./send-Dd7oXbNy.mjs").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-BwRIXzkg.mjs").then((module) => module.sessionsFilesHandlers),
	"sessions-github": () => import("./sessions-github-CmGIebFT.mjs").then((module) => module.sessionsGitHubHandlers),
	"sessions-diff": () => import("./sessions-diff-C7VtNfAv.mjs").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-CvqA8Tsy.mjs").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-Cv9qUOVo.mjs").then((module) => module.sessionCompactHandlers),
	"sessions-create": () => import("./sessions-create-DIEkRmrm.mjs").then((module) => module.sessionCreateHandlers),
	"sessions-title": () => import("./sessions-title-DMoaVA5_.mjs").then((module) => module.sessionTitleHandlers),
	"sessions-recover": () => import("./sessions-recover-C3KUscjQ.mjs").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-ZXWAB303.mjs").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-CO-54x-u.mjs").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-B2MrkXrN.mjs").then((module) => module.sessionGroupHandlers),
	"sessions-goal": () => import("./sessions-goal-DMjhfIVS.mjs").then((module) => module.sessionGoalHandlers),
	"sessions-provider-review": () => import("./sessions-provider-review-BN4wuGNr.mjs").then((module) => module.sessionProviderReviewHandlers),
	"sessions-messaging": () => import("./sessions-messaging-FRY2sKNS.mjs").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-CawEuGgL.mjs").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-tnX9K6Ic.mjs").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-D6XEP0Cl.mjs").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-rwBQOFPm.mjs").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions-Bv1Ao_SJ.mjs").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-DPpCVpUR.mjs").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-DPqZEY0C.mjs").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-BQQv_Bed.mjs").then((module) => module.sessionDiscussionHandlers),
	"session-activity-summary": () => import("./session-activity-summary-DM9vnwwq.mjs").then((module) => module.sessionActivitySummaryHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-kNPkZXHq.mjs").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-2dMBHhwB.mjs").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-B2SYILVk.mjs").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-DnLLJJp8.mjs").then((module) => module.skillsHandlers),
	system: () => import("./system-CLaNEoSB.mjs").then((module) => module.systemHandlers),
	talk: () => import("./handlers-B8A70uq4.mjs").then((module) => module.talkHandlers),
	"talk-mode": () => import("./mode-BWtTL1PD.mjs").then((module) => module.talkModeHandlers),
	tasks: () => import("./tasks-BZmeMtkL.mjs").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-DI2Gfg7r.mjs").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-B0Cl9EuY.mjs").then((module) => module.toolsCatalogHandlers),
	"tools-github": () => import("./tools-github-7h80WYVK.mjs").then((module) => module.toolsGitHubHandlers),
	"tools-effective": () => import("./tools-effective-CBPkgQTS.mjs").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-tGq89BYw.mjs").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-ZgLwt1m-.mjs").then((module) => module.mcpAppHandlers),
	canvas: () => import("./canvas-BJYfpv9Z.mjs").then((module) => module.canvasHandlers),
	tts: () => import("./tts-BSWV53fg.mjs").then((module) => module.ttsHandlers),
	update: () => import("./update-DHeYSZI3.mjs").then((module) => module.updateHandlers),
	usage: () => import("./usage-B2e_3aOs.mjs").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-iW6vLjVa.mjs").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-B6TCKC7b.mjs").then((module) => module.voicewakeHandlers),
	web: () => import("./web-DHFfUn_y.mjs").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-ByUX4OeL.mjs").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-DzCrtWof.mjs").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-BNmoD1-L.mjs").then((module) => module.wizardHandlers)
};
const coreGatewayHandlers = Object.fromEntries(Array.from(listCoreGatewayHandlerMethodNames()).flatMap(([family, methods]) => Object.entries(createLazyCoreHandlers({
	methods,
	loadHandlers: createLazyPromise(CORE_GATEWAY_HANDLER_MODULES[family], { cacheRejections: true })
}))));
//#endregion
//#region src/gateway/server-methods.ts
function authorizeGatewayMethod(method, client, params, methodRegistry) {
	if (!client?.connect || method === "health") return { error: null };
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`) };
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`) };
	if (role === "node") return { error: null };
	if (method === "device.scopes.requestUpgrade" || method === "device.scopes.waitUpgrade") return { error: null };
	if (scopes.includes("operator.admin")) return { error: null };
	const registeredScope = methodRegistry.getScope(method);
	const scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes, resolveSessionMethodScope(method, params), method) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed) {
		const resolvedRequiredScopes = isOperatorScope(registeredScope) ? [registeredScope] : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
		return { error: missingScopeErrorShape({
			missingScope: scopeAuth.missingScope,
			requiredScopes: resolvedRequiredScopes.length > 0 ? resolvedRequiredScopes : [scopeAuth.missingScope]
		}) };
	}
	return {
		error: null,
		sessionScope: scopeAuth.sessionScope
	};
}
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
	"gateway.suspend.prepare",
	"gateway.suspend.status",
	"gateway.suspend.resume",
	"gateway.suspend.handoff"
]);
function runGatewayPendingWorkContinuation(params) {
	if (!isRecord(params.requestParams)) return null;
	const request = params.requestParams;
	if (params.client?.connect.role === "node") {
		if (params.admission !== "continuation" && getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining()) return null;
		const invokeId = params.method === "node.invoke.progress" ? request.invokeId : params.method === "node.invoke.result" ? request.id : void 0;
		if (typeof invokeId !== "string" || typeof request.nodeId !== "string") return null;
		return params.context.nodeRegistry.runPendingInvokeContinuation({
			invokeId,
			nodeId: request.nodeId,
			connId: params.client.connId,
			run: params.run
		});
	}
	if (params.admission === "continuation" || getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining() || params.client?.connect.role !== "operator" || typeof request.id !== "string") return null;
	if (params.method === "question.resolve" || params.method === "question.get") {
		const questionManager = params.context.questionManager;
		return questionManager && canSelectQuestion(questionManager, request.id, params.client) ? questionManager.runPendingContinuation(request.id, params.run) : null;
	}
	return (params.method === "exec.approval.resolve" ? params.context.execApprovalManager : params.method === "plugin.approval.resolve" ? params.context.pluginApprovalManager : params.method === "approval.resolve" ? request.kind === "exec" ? params.context.execApprovalManager : request.kind === "plugin" ? params.context.pluginApprovalManager : request.kind === "system-agent" ? params.context.systemAgentApprovalManager : void 0 : void 0)?.runPendingContinuation(request.id, params.run) ?? null;
}
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
	const gatewayPluginRegistry = getActivePluginRegistry();
	const gatewayPluginHandlers = gatewayPluginRegistry?.gatewayHandlers ?? {};
	const extraHandlerEntries = Object.entries(extraHandlers ?? {});
	const pluginMethodNames = new Set(Object.keys(gatewayPluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	for (const [method, extraHandler] of extraHandlerEntries) if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
	const auxHandlers = Object.fromEntries(extraHandlerEntries.filter(([method]) => !pluginMethodNames.has(method) && !isCoreGatewayMethodClassified(method)));
	return createGatewayMethodRegistry([
		...createCoreGatewayMethodDescriptors(coreDescriptorHandlers),
		...gatewayPluginRegistry ? createPluginGatewayMethodDescriptors(gatewayPluginRegistry) : [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: auxHandlers,
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	], gatewayPluginRegistry ?? void 0);
}
/** Applies the router-owned authorization fence before any transport or typed dispatch. */
async function authorizeGatewayRequestPreDispatch(params) {
	if (params.context.ensureSessionRowProjection) await params.context.ensureSessionRowProjection();
	while (true) {
		const scopeAuthorization = withPluginRuntimeRegistryScope(params.methodRegistry.pluginRegistry, () => authorizeGatewayMethod(params.method, params.client, params.requestParams, params.methodRegistry));
		if (scopeAuthorization.error) return { error: scopeAuthorization.error };
		const profileError = await authorizeAuthenticatedProfileForMethod({
			client: params.client,
			sessionScope: scopeAuthorization.sessionScope,
			requiresProfile: () => params.expectedProfileBinding !== void 0 || params.methodRegistry.requiresAuthenticatedProfile(params.method) || resolveDirectIncognitoTargets(params.method, params.requestParams).length > 0 || sessionMutationTargetFields(params.method).length > 0 && params.context.getRuntimeConfig().gateway?.roles !== void 0
		});
		if (profileError) return { error: profileError };
		try {
			params.expectedProfileBinding?.assertCurrent();
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		if (params.context.unavailableGatewayMethods?.has(params.method)) return { error: errorShape(ErrorCodes.UNAVAILABLE, `${params.method} unavailable during gateway startup`, {
			retryable: true,
			retryAfterMs: 500,
			details: {
				...gatewayStartupUnavailableDetails(),
				method: params.method
			}
		}) };
		if (params.method.startsWith("sessions.groups.")) {
			const { ensureSessionGroupCatalog } = await import("./session-group-catalog-N-axuPSV.mjs");
			await ensureSessionGroupCatalog();
			const groupProjection = getSessionRowProjection(params.context);
			if (groupProjection) do
				await groupProjection.prepareMembership();
			while (groupProjection.needsMembershipPreparation());
			params.expectedProfileBinding?.assertCurrent();
		}
		const projection = params.method === "sessions.describe" && !isGatewayAdmin(params.client) ? getSessionRowProjection(params.context) : void 0;
		const authorizeSession = (sessionRowRead) => resolveSessionMutationAuthorization({
			client: params.client ?? null,
			method: params.method,
			requestParams: params.requestParams,
			context: params.context,
			sessionRowRead,
			sessionScope: scopeAuthorization.sessionScope
		});
		const preparedSessionMutation = projection ? await projection.withPreparedExactRows((cfg) => resolveDirectSessionTargets(params.method, params.requestParams).flatMap((target) => {
			const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
			return agent.ok ? [{
				key: target.sessionKey,
				agentId: agent.agentId
			}] : [];
		}), authorizeSession) : withCanonicalSessionValidationDeferral(() => authorizeSession());
		if (preparedSessionMutation.kind === "pending") {
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DvYAlpmU.mjs");
			await certifySessionCanonicalValidationPending(preparedSessionMutation.database);
			continue;
		}
		const sessionMutation = preparedSessionMutation.value;
		if (sessionMutation.error) return { error: sessionMutation.error };
		if (params.client?.connect.role === "node" && (!params.client.connId || !await params.context.nodeRegistry.isConnectionCurrentPairingState(params.client.connId))) return { error: errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed before request dispatch", {
			retryable: true,
			details: { code: "PAIRING_CHANGED" }
		}) };
		return {
			error: null,
			sessionScope: scopeAuthorization.sessionScope,
			...sessionMutation.authorization ? { sessionMutationAuthorization: sessionMutation.authorization } : {}
		};
	}
}
/** Runs admitted Gateway work inside the shared root and plugin request scopes. */
async function runWithGatewayRequestEnvelope(method, client, fn, options) {
	const rejectRateLimitedControlPlaneWrite = () => {
		if (!options.methodRegistry.isControlPlaneWrite(method)) return;
		const budget = consumeControlPlaneWriteBudget({
			client,
			method
		});
		if (budget.allowed) return;
		const actor = resolveControlPlaneActor(client);
		options.context.logGateway.warn(`control-plane write rate-limited method=${method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
		return errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
			retryable: true,
			retryAfterMs: budget.retryAfterMs,
			details: {
				method,
				limit: `30 per ${CONTROL_PLANE_RATE_LIMIT_WINDOW_MS / 1e3}s`
			}
		});
	};
	const isSuspendPrepare = method === "gateway.suspend.prepare";
	const preAdmissionRateLimitError = isSuspendPrepare ? rejectRateLimitedControlPlaneWrite() : void 0;
	if (preAdmissionRateLimitError) return await options.reject(preAdmissionRateLimitError);
	const rootWorkAdmission = options.admission === "continuation" ? null : tryBeginGatewayRootWorkAdmission(`ws:${method}`) ?? (method === "gateway.restart.request" && isTargetedNonSafeGatewayRestartRequest(options.requestParams) ? tryBeginGatewayPreparedRestartRootWorkAdmission() : null);
	if (!rootWorkAdmission) {
		const continuation = runGatewayPendingWorkContinuation({
			method,
			client,
			requestParams: options.requestParams,
			context: options.context,
			admission: options.admission,
			run: invokeWithRequestScope
		});
		if (continuation) return await continuation;
		if (options.admission === "continuation") return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway shutdown`));
	}
	if (isSuspendPrepare && rootWorkAdmission && !rootWorkAdmission.ownsRoot) return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
		retryable: true,
		retryAfterMs: 1e3,
		details: {
			method,
			reason: "nested-gateway-request"
		}
	}));
	const restartProgressRead = method === "update.runs.get" && getGatewayRestartDrainSignal().aborted && getGatewaySuspendAdmissionPhase() === "accepting";
	if (!rootWorkAdmission && !SUSPEND_CONTROL_METHODS.has(method) && !restartProgressRead) {
		const restartDraining = isGatewayRestartDraining();
		return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`, {
			retryable: true,
			retryAfterMs: 1e3,
			details: {
				method,
				reason: restartDraining ? GATEWAY_RESTART_UNAVAILABLE_REASON : GATEWAY_SUSPEND_UNAVAILABLE_REASON,
				phase: getGatewaySuspendAdmissionPhase()
			}
		}));
	}
	async function invokeWithRequestScope() {
		const postAdmissionRateLimitError = isSuspendPrepare ? void 0 : rejectRateLimitedControlPlaneWrite();
		if (postAdmissionRateLimitError) return await options.reject(postAdmissionRateLimitError);
		const releaseForegroundWork = retainSessionListForegroundWork();
		try {
			const pluginRegistry = options.methodRegistry.pluginRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
			return await withPluginRuntimeGatewayRequestScope({
				context: options.context,
				resolveGatewayContext: options.context.resolveGatewayContext,
				client,
				signal: options.signal,
				hasCurrentClientAuthority: options.hasCurrentClientAuthority,
				isWebchatConnect: options.isWebchatConnect,
				...client?.internal?.nodeInvokeStream ? getPluginRuntimeGatewayNodeAuthorities() : {},
				...pluginRegistry ? { pluginRegistry } : {}
			}, fn);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return await options.reject(error.error);
			const staleInstall = classifyGatewayStaleInstall(error);
			if (staleInstall) return await options.reject(staleInstall.error);
			throw error;
		} finally {
			releaseForegroundWork();
		}
	}
	if (!rootWorkAdmission) return await invokeWithRequestScope();
	try {
		return await rootWorkAdmission.run(invokeWithRequestScope);
	} finally {
		rootWorkAdmission.release();
	}
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts, diagnostics) {
	const { req, client, isWebchatConnect, context, signal, hasCurrentClientAuthority } = opts;
	const profileBinding = opts.expectedProfileBinding ?? (req.expectedProfileId === void 0 ? void 0 : await createExpectedProfileBinding(req.expectedProfileId, client, readGatewayRequestMutationAuthority(opts).assertLifetimeCurrent));
	const respond = profileBinding && !opts.expectedProfileBinding ? profileBinding.guardResponse(opts.respond) : opts.respond;
	const sessionMutationCommitGuard = profileBinding ? () => {
		profileBinding.assertCurrent();
		opts.sessionMutationCommitGuard?.();
	} : opts.sessionMutationCommitGuard;
	const entry = opts.requestEntry ?? context.requestEntryLifetime?.enter(opts);
	const releaseForegroundWork = retainSessionListForegroundWork();
	try {
		entry?.assertOpen();
		const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
		const authorization = await authorizeGatewayRequestPreDispatch({
			method: req.method,
			requestParams: req.params,
			client,
			context,
			methodRegistry,
			expectedProfileBinding: profileBinding
		});
		entry?.assertOpen();
		if (authorization.error) {
			respond(false, void 0, authorization.error);
			return;
		}
		const handler = methodRegistry.getHandler(req.method);
		if (!handler) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
			return;
		}
		const requestMutationAuthority = readGatewayRequestMutationAuthority(opts);
		const sessionMutationAuthorization = withSessionMutationCommitGuard(authorization.sessionMutationAuthorization, requestMutationAuthority.assertCurrent, profileBinding?.assertCurrent, requestMutationAuthority.assertAdmittedInputCurrent);
		const invokeHandler = async () => {
			const preparedHandler = await prepareGatewayRequestHandler(handler, entry);
			const handlerOptions = bindGatewayRequestHandlerMutationAuthority(opts, {
				req,
				params: req.params ?? {},
				client,
				isWebchatConnect,
				respond,
				context,
				signal,
				...hasCurrentClientAuthority ? { hasCurrentClientAuthority } : {},
				sessionMutationCommitGuard,
				sessionMutationAuthorization
			}, profileBinding, authorization.sessionScope);
			sessionMutationCommitGuard?.();
			entry?.assertOpen();
			if (signal?.aborted) return;
			entry?.release();
			profileBinding?.markInvoked();
			return diagnostics ? diagnostics.runHandler(() => preparedHandler(handlerOptions)) : preparedHandler(handlerOptions);
		};
		if (req.method === "question.get" || req.method === "question.resolve") {
			requestMutationAuthority.assertCurrent();
			profileBinding?.assertCurrent();
		}
		await runWithGatewayRequestEnvelope(req.method, client, invokeHandler, {
			context,
			isWebchatConnect,
			signal,
			hasCurrentClientAuthority,
			methodRegistry,
			requestParams: req.params,
			admission: opts.admission,
			reject: (error) => respond(false, void 0, error)
		});
	} finally {
		releaseForegroundWork();
		if (!opts.requestEntry) entry?.release();
	}
}
//#endregion
export { coreGatewayHandlers as a, runWithGatewayRequestEnvelope as i, createRequestGatewayMethodRegistry as n, handleGatewayRequest as r, authorizeGatewayRequestPreDispatch as t };
