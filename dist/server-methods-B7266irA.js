import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-CRTM-3cy.js";
import { r as getPluginRegistryState } from "./runtime-state-CDEoJIrS.js";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified } from "./core-descriptors-DRUtdasO.js";
import { s as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-CwW_Szsp.js";
import { i as createPluginGatewayMethodDescriptors, n as createGatewayMethodRegistry, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-D61Kc28k.js";
import { n as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { t as consumeControlPlaneWriteBudget } from "./control-plane-rate-limit-P6m6mOcJ.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-BQfpZQ2J.js";
//#region src/gateway/server-methods.ts
function lazyHandlerModule(loadModule, selectHandlers) {
	let handlersPromise = null;
	return () => handlersPromise ??= loadModule().then(selectHandlers);
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => [method, async (opts) => {
		const handler = (await params.loadHandlers())[method];
		if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
		await handler(opts);
	}]));
}
const loadAgentHandlers = lazyHandlerModule(() => import("./agent-D0PrqG1B.js"), (module) => module.agentHandlers);
const loadAgentsHandlers = lazyHandlerModule(() => import("./agents-LSUAXTLk.js"), (module) => module.agentsHandlers);
const loadAgentsWorkspaceHandlers = lazyHandlerModule(() => import("./agents-workspace-CNrJ9PVa.js"), (module) => module.agentsWorkspaceHandlers);
const loadArtifactsHandlers = lazyHandlerModule(() => import("./artifacts-BGeWKGNX.js"), (module) => module.artifactsHandlers);
const loadAuditHandlers = lazyHandlerModule(() => import("./audit-CqE8An_t.js"), (module) => module.auditHandlers);
const loadAttachHandlers = lazyHandlerModule(() => import("./attach-Cec8ymWJ.js"), (module) => module.attachHandlers);
const loadChannelsHandlers = lazyHandlerModule(() => import("./channels-CpH1ZrG5.js"), (module) => module.channelsHandlers);
const loadChatHandlers = lazyHandlerModule(() => import("./chat-BuDBN7Kz.js"), (module) => module.chatHandlers);
const loadCommandsHandlers = lazyHandlerModule(() => import("./commands-Bi88oPg7.js"), (module) => module.commandsHandlers);
const loadConfigHandlers = lazyHandlerModule(() => import("./config-DLAvfOQv.js"), (module) => module.configHandlers);
const loadConnectHandlers = lazyHandlerModule(() => import("./connect-BDnUXWPx.js"), (module) => module.connectHandlers);
const loadControlUiHandlers = lazyHandlerModule(() => import("./control-ui-CofmEM-F.js"), (module) => module.controlUiHandlers);
const loadCronHandlers = lazyHandlerModule(() => import("./cron-BtBZWiD1.js"), (module) => module.cronHandlers);
const loadDeviceHandlers = lazyHandlerModule(() => import("./devices-BR0MA7nj.js"), (module) => module.deviceHandlers);
const loadDevicePairSetupHandlers = lazyHandlerModule(() => import("./device-pair-setup-366WEMqT.js"), (module) => module.devicePairSetupHandlers);
const loadDiagnosticsHandlers = lazyHandlerModule(() => import("./diagnostics-Bc2uEarv.js"), (module) => module.diagnosticsHandlers);
const loadDoctorHandlers = lazyHandlerModule(() => import("./doctor-BHVXqSZK.js"), (module) => module.doctorHandlers);
const loadEnvironmentsHandlers = lazyHandlerModule(() => import("./environments-Dv1eZ18N.js"), (module) => module.environmentsHandlers);
const loadWorktreesHandlers = lazyHandlerModule(() => import("./worktrees-oCJA7nvH.js"), (module) => module.worktreesHandlers);
const loadExecApprovalsHandlers = lazyHandlerModule(() => import("./exec-approvals-BvnB4HMA.js"), (module) => module.execApprovalsHandlers);
const loadHealthHandlers = lazyHandlerModule(() => import("./health-Jps-AhKj.js"), (module) => module.healthHandlers);
const loadLogsHandlers = lazyHandlerModule(() => import("./logs-BRCf-PEL.js"), (module) => module.logsHandlers);
const loadTerminalHandlers = lazyHandlerModule(() => import("./terminal-BVqQk2aA.js"), (module) => module.terminalHandlers);
const loadModelsAuthStatusHandlers = lazyHandlerModule(() => import("./models-auth-status-Dfy8oPJZ.js"), (module) => module.modelsAuthStatusHandlers);
const loadModelsHandlers = lazyHandlerModule(() => import("./models-ChBhiuHb.js"), (module) => module.modelsHandlers);
const loadNativeHookRelayHandlers = lazyHandlerModule(() => import("./native-hook-relay-DPh-3pmX.js"), (module) => module.nativeHookRelayHandlers);
const loadNodePendingHandlers = lazyHandlerModule(() => import("./nodes-pending-CfjbBoWl.js"), (module) => module.nodePendingHandlers);
const loadNodeHandlers = lazyHandlerModule(() => import("./nodes-CbZZQwsI.js"), (module) => module.nodeHandlers);
const loadPluginHostHookHandlers = lazyHandlerModule(() => import("./plugin-host-hooks-Cddf_gjR.js"), (module) => module.pluginHostHookHandlers);
const loadPushHandlers = lazyHandlerModule(() => import("./push-HmPaJixP.js"), (module) => module.pushHandlers);
const loadRestartHandlers = lazyHandlerModule(() => import("./restart-TqsexkHX.js"), (module) => module.restartHandlers);
const loadSendHandlers = lazyHandlerModule(() => import("./send-DiAWXVP4.js"), (module) => module.sendHandlers);
const loadSessionsFilesHandlers = lazyHandlerModule(() => import("./sessions-files-fwIwdggc.js"), (module) => module.sessionsFilesHandlers);
const loadSessionsHandlers = lazyHandlerModule(() => import("./sessions-IvSHg9p3.js"), (module) => module.sessionsHandlers);
const loadSkillsHandlers = lazyHandlerModule(() => import("./skills-aDNUGEHJ.js"), (module) => module.skillsHandlers);
const loadSystemHandlers = lazyHandlerModule(() => import("./system-9UA0P_BK.js"), (module) => module.systemHandlers);
const loadTalkHandlers = lazyHandlerModule(() => import("./talk-B96GCWMr.js"), (module) => module.talkHandlers);
const loadTasksHandlers = lazyHandlerModule(() => import("./tasks-Dryv3Tqx.js"), (module) => module.tasksHandlers);
const loadToolsCatalogHandlers = lazyHandlerModule(() => import("./tools-catalog-gG3Oq4wh.js"), (module) => module.toolsCatalogHandlers);
const loadToolsEffectiveHandlers = lazyHandlerModule(() => import("./tools-effective-C0XVLL2w.js"), (module) => module.toolsEffectiveHandlers);
const loadToolsInvokeHandlers = lazyHandlerModule(() => import("./tools-invoke-CpurUTwU.js"), (module) => module.toolsInvokeHandlers);
const loadTtsHandlers = lazyHandlerModule(() => import("./tts-DiAQxdAt.js"), (module) => module.ttsHandlers);
const loadUpdateHandlers = lazyHandlerModule(() => import("./update-DJGLEQrr.js"), (module) => module.updateHandlers);
const loadUsageHandlers = lazyHandlerModule(() => import("./usage-DWX-Nrdh.js"), (module) => module.usageHandlers);
const loadVoicewakeRoutingHandlers = lazyHandlerModule(() => import("./voicewake-routing-BEwm6Acf.js"), (module) => module.voicewakeRoutingHandlers);
const loadVoicewakeHandlers = lazyHandlerModule(() => import("./voicewake-C8FUd-PF.js"), (module) => module.voicewakeHandlers);
const loadWebHandlers = lazyHandlerModule(() => import("./web-BXvad2sE.js"), (module) => module.webHandlers);
const loadCrestodianHandlers = lazyHandlerModule(() => import("./crestodian-h1qn4xxE.js"), (module) => module.crestodianHandlers);
const loadWizardHandlers = lazyHandlerModule(() => import("./wizard-D-n_MMyD.js"), (module) => module.wizardHandlers);
function authorizeGatewayMethod(method, client, params, methodRegistry) {
	if (!client?.connect) return null;
	if (method === "health") return null;
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`);
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`);
	if (role === "node") return null;
	if (scopes.includes("operator.admin")) return null;
	const registeredScope = methodRegistry.getScope(method);
	const scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed) return errorShape(ErrorCodes.INVALID_REQUEST, `missing scope: ${scopeAuth.missingScope}`);
	return null;
}
const coreGatewayHandlers = {
	...createLazyCoreHandlers({
		methods: ["connect"],
		loadHandlers: loadConnectHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["attach.grant", "attach.revoke"],
		loadHandlers: loadAttachHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["logs.tail"],
		loadHandlers: loadLogsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"terminal.open",
			"terminal.input",
			"terminal.resize",
			"terminal.close",
			"terminal.attach",
			"terminal.list",
			"terminal.text"
		],
		loadHandlers: loadTerminalHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["voicewake.get", "voicewake.set"],
		loadHandlers: loadVoicewakeHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["voicewake.routing.get", "voicewake.routing.set"],
		loadHandlers: loadVoicewakeRoutingHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["health", "status"],
		loadHandlers: loadHealthHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"channels.status",
			"channels.start",
			"channels.stop",
			"channels.logout"
		],
		loadHandlers: loadChannelsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"chat.history",
			"chat.startup",
			"chat.metadata",
			"chat.message.get",
			"chat.abort",
			"chat.send",
			"chat.inject"
		],
		loadHandlers: loadChatHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["commands.list"],
		loadHandlers: loadCommandsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"wake",
			"cron.list",
			"cron.status",
			"cron.get",
			"cron.add",
			"cron.update",
			"cron.remove",
			"cron.run",
			"cron.runs"
		],
		loadHandlers: loadCronHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"device.pair.list",
			"device.pair.approve",
			"device.pair.reject",
			"device.pair.remove",
			"device.token.rotate",
			"device.token.revoke"
		],
		loadHandlers: loadDeviceHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["device.pair.setupCode"],
		loadHandlers: loadDevicePairSetupHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["diagnostics.stability"],
		loadHandlers: loadDiagnosticsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["controlUi.githubPreview"],
		loadHandlers: loadControlUiHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"doctor.memory.status",
			"doctor.memory.dreamDiary",
			"doctor.memory.backfillDreamDiary",
			"doctor.memory.resetDreamDiary",
			"doctor.memory.resetGroundedShortTerm",
			"doctor.memory.repairDreamingArtifacts",
			"doctor.memory.dedupeDreamDiary",
			"doctor.memory.remHarness"
		],
		loadHandlers: loadDoctorHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["environments.list", "environments.status"],
		loadHandlers: loadEnvironmentsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"worktrees.list",
			"worktrees.create",
			"worktrees.remove",
			"worktrees.restore",
			"worktrees.gc"
		],
		loadHandlers: loadWorktreesHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"exec.approvals.get",
			"exec.approvals.set",
			"exec.approvals.node.get",
			"exec.approvals.node.set"
		],
		loadHandlers: loadExecApprovalsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["web.login.start", "web.login.wait"],
		loadHandlers: loadWebHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["models.list"],
		loadHandlers: loadModelsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["models.authLogout", "models.authStatus"],
		loadHandlers: loadModelsAuthStatusHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["nativeHook.invoke"],
		loadHandlers: loadNativeHookRelayHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["plugins.uiDescriptors", "plugins.sessionAction"],
		loadHandlers: loadPluginHostHookHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"config.get",
			"config.schema",
			"config.schema.lookup",
			"config.set",
			"config.patch",
			"config.apply",
			"config.openFile"
		],
		loadHandlers: loadConfigHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"wizard.start",
			"wizard.next",
			"wizard.cancel",
			"wizard.status"
		],
		loadHandlers: loadWizardHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"crestodian.chat",
			"crestodian.setup.detect",
			"crestodian.setup.activate"
		],
		loadHandlers: loadCrestodianHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"talk.session.create",
			"talk.session.join",
			"talk.session.appendAudio",
			"talk.session.startTurn",
			"talk.session.endTurn",
			"talk.session.cancelTurn",
			"talk.session.cancelOutput",
			"talk.session.submitToolResult",
			"talk.session.steer",
			"talk.session.close",
			"talk.client.create",
			"talk.client.toolCall",
			"talk.client.steer",
			"talk.catalog",
			"talk.config",
			"talk.speak",
			"talk.mode"
		],
		loadHandlers: loadTalkHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["audit.list"],
		loadHandlers: loadAuditHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"tasks.list",
			"tasks.get",
			"tasks.cancel"
		],
		loadHandlers: loadTasksHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.catalog"],
		loadHandlers: loadToolsCatalogHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.effective"],
		loadHandlers: loadToolsEffectiveHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["tools.invoke"],
		loadHandlers: loadToolsInvokeHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"tts.status",
			"tts.enable",
			"tts.disable",
			"tts.convert",
			"tts.speak",
			"tts.setProvider",
			"tts.personas",
			"tts.setPersona",
			"tts.providers"
		],
		loadHandlers: loadTtsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"skills.upload.begin",
			"skills.upload.chunk",
			"skills.upload.commit",
			"skills.status",
			"skills.bins",
			"skills.search",
			"skills.detail",
			"skills.securityVerdicts",
			"skills.skillCard",
			"skills.install",
			"skills.update",
			"skills.curator.status",
			"skills.curator.pin",
			"skills.curator.unpin",
			"skills.curator.restore",
			"skills.proposals.list",
			"skills.proposals.inspect",
			"skills.proposals.create",
			"skills.proposals.update",
			"skills.proposals.revise",
			"skills.proposals.requestRevision",
			"skills.proposals.apply",
			"skills.proposals.reject",
			"skills.proposals.quarantine"
		],
		loadHandlers: loadSkillsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"sessions.list",
			"sessions.cleanup",
			"sessions.subscribe",
			"sessions.unsubscribe",
			"sessions.messages.subscribe",
			"sessions.messages.unsubscribe",
			"sessions.preview",
			"sessions.describe",
			"sessions.resolve",
			"sessions.compaction.list",
			"sessions.compaction.get",
			"sessions.create",
			"sessions.compaction.branch",
			"sessions.compaction.restore",
			"sessions.send",
			"sessions.steer",
			"sessions.abort",
			"sessions.patch",
			"sessions.pluginPatch",
			"sessions.reset",
			"sessions.delete",
			"sessions.get",
			"sessions.compact"
		],
		loadHandlers: loadSessionsHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"gateway.identity.get",
			"last-heartbeat",
			"set-heartbeats",
			"system-presence",
			"system.info",
			"system-event"
		],
		loadHandlers: loadSystemHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["update.status", "update.run"],
		loadHandlers: loadUpdateHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"node.pair.request",
			"node.pair.list",
			"node.pair.approve",
			"node.pair.reject",
			"node.pair.remove",
			"node.pair.verify",
			"node.rename",
			"node.list",
			"node.describe",
			"node.pluginSurface.refresh",
			"node.pending.pull",
			"node.pending.ack",
			"node.invoke",
			"node.invoke.result",
			"node.event"
		],
		loadHandlers: loadNodeHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["node.pending.drain", "node.pending.enqueue"],
		loadHandlers: loadNodePendingHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"push.test",
			"push.web.vapidPublicKey",
			"push.web.subscribe",
			"push.web.unsubscribe",
			"push.web.test"
		],
		loadHandlers: loadPushHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["gateway.restart.request", "gateway.restart.preflight"],
		loadHandlers: loadRestartHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"message.action",
			"send",
			"poll"
		],
		loadHandlers: loadSendHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"usage.status",
			"usage.cost",
			"sessions.usage",
			"sessions.usage.timeseries",
			"sessions.usage.logs"
		],
		loadHandlers: loadUsageHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"agent",
			"agent.identity.get",
			"agent.wait"
		],
		loadHandlers: loadAgentHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"agents.list",
			"agents.create",
			"agents.update",
			"agents.delete",
			"agents.files.list",
			"agents.files.get",
			"agents.files.set"
		],
		loadHandlers: loadAgentsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["agents.workspace.list", "agents.workspace.get"],
		loadHandlers: loadAgentsWorkspaceHandlers
	}),
	...createLazyCoreHandlers({
		methods: [
			"artifacts.list",
			"artifacts.get",
			"artifacts.download"
		],
		loadHandlers: loadArtifactsHandlers
	}),
	...createLazyCoreHandlers({
		methods: ["sessions.files.list", "sessions.files.get"],
		loadHandlers: loadSessionsFilesHandlers
	})
};
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
	const activePluginRegistry = getPluginRegistryState()?.activeRegistry;
	const activePluginHandlers = activePluginRegistry?.gatewayHandlers ?? {};
	const extraHandlerEntries = Object.entries(extraHandlers ?? {});
	const pluginMethodNames = new Set(Object.keys(activePluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	for (const [method, extraHandler] of extraHandlerEntries) if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
	const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers);
	for (const descriptor of coreDescriptors) {
		const extraHandler = extraHandlers?.[descriptor.name];
		if (extraHandler && !pluginMethodNames.has(descriptor.name)) descriptor.handler = extraHandler;
	}
	const coreMethodNames = new Set(coreDescriptors.map((descriptor) => descriptor.name));
	const auxHandlers = Object.fromEntries(extraHandlerEntries.filter(([method]) => !pluginMethodNames.has(method) && !coreMethodNames.has(method)));
	return createGatewayMethodRegistry([
		...coreDescriptors,
		...activePluginRegistry ? createPluginGatewayMethodDescriptors(activePluginRegistry) : [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: auxHandlers,
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	]);
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts) {
	const { req, respond, client, isWebchatConnect, context } = opts;
	const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
	const authError = authorizeGatewayMethod(req.method, client, req.params, methodRegistry);
	if (authError) {
		respond(false, void 0, authError);
		return;
	}
	if (context.unavailableGatewayMethods?.has(req.method)) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `${req.method} unavailable during gateway startup`, {
			retryable: true,
			retryAfterMs: 500,
			details: {
				...gatewayStartupUnavailableDetails(),
				method: req.method
			}
		}));
		return;
	}
	if (methodRegistry.isControlPlaneWrite(req.method)) {
		const budget = consumeControlPlaneWriteBudget({ client });
		if (!budget.allowed) {
			const actor = resolveControlPlaneActor(client);
			context.logGateway.warn(`control-plane write rate-limited method=${req.method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${req.method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
				retryable: true,
				retryAfterMs: budget.retryAfterMs,
				details: {
					method: req.method,
					limit: "3 per 60s"
				}
			}));
			return;
		}
	}
	const handler = methodRegistry.getHandler(req.method);
	if (!handler) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
		return;
	}
	const invokeHandler = () => handler({
		req,
		params: req.params ?? {},
		client,
		isWebchatConnect,
		respond,
		context
	});
	await withPluginRuntimeGatewayRequestScope({
		context,
		client,
		isWebchatConnect
	}, invokeHandler);
}
//#endregion
export { coreGatewayHandlers, handleGatewayRequest };
