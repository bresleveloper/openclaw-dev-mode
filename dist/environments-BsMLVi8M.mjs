import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ft as validateEnvironmentsCreateParams, Ht as validateEnvironmentsSessionExecParams, It as validateEnvironmentsDestroyParams, Lt as validateEnvironmentsListParams, Rt as validateEnvironmentsPrepareParams, St as validateDesktopObserveParams, Wt as validateEnvironmentsStatusParams, ac as validateWorkerDesktopObserveParams, rc as validateWorkerDesktopLaunchParams, wt as validateDesktopReleaseParams, xt as validateDesktopLaunchParams } from "./src-BRUl7oDv.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { r as sanitizeExecApprovalDisplayTextWithStatus } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
import { n as createAgentRuntimeIdentity } from "./agent-runtime-identity-token-C6L1CTtM.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-DivkApLb.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
import { d as resolveRequiredNodeCommandAuthority, l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { n as resolveExecDefaults } from "./exec-defaults-25hFSBa3.mjs";
import { o as resolveWorkerPlacementCapabilities } from "./placement-session-runtime-SEjvmv7N.mjs";
import { i as listDevicePairing } from "./device-pairing-DbLfxuuq.mjs";
import { n as projectNodePairing } from "./device-pairing-node.records-6nbBdP9Q.mjs";
import "./device-pairing-node-DvH1kI0G.mjs";
import { n as readNodeSessionWithheldCommands } from "./node-registry-zajLqj5_.mjs";
import { t as collectNodeCatalogRuntimeState } from "./node-registry-private-DQxtvo06.mjs";
import { t as lookupCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { r as isDesktopCredentialsRequiredError } from "./host-source-errors-46uOYNUn.mjs";
import { n as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as bindApprovalRequesterMetadata } from "./approval-shared-Dq8WeEIr.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-DFVq928u.mjs";
import { o as projectPairedDeviceNodeBindings } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-D9Vv55WG.mjs";
import { i as summarizeWorkerEnvironment, n as resolveSessionEnvironmentCaller, r as captureSessionEnvironmentToolPolicy, t as environmentsSessionHandlers } from "./environments.session-eL8Yy6sv.mjs";
import { n as getNodeDesktopService } from "./node-source-context-Csxf7qYw.mjs";
import { t as handlePendingExecApprovalRequest } from "./exec-approval-request-delivery-Cm3udzhs.mjs";
//#region src/gateway/desktop/observe-requester.ts
function resolveDesktopObserveRequester(options) {
	const { client, hasCurrentClientAuthority } = options;
	if (!client) return;
	return {
		connId: client.connId,
		operatorName: client.authenticatedUserProfile?.displayName?.trim() || client.authenticatedUserId?.trim() || void 0,
		signal: client.connectionSignal,
		isCurrent: () => client.invalidated !== true && !client.connectionSignal?.aborted && hasCurrentClientAuthority?.() !== false
	};
}
//#endregion
//#region src/gateway/server-methods/environments.desktop.ts
async function respondDesktopObserve(params) {
	if (params.request.source.kind === "host") {
		if (params.context.getRuntimeConfig().desktop?.host?.enabled !== true) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway host desktop is disabled; enable the Desktop lab (config: desktop.host.enabled=true)"));
			return;
		}
		if (!params.context.hostDesktopService) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway host desktop is unavailable in this Gateway runtime"));
			return;
		}
		try {
			params.respond(true, await params.context.hostDesktopService.observe({
				control: params.request.control ?? false,
				requester: params.requester,
				..."credentials" in params.request && params.request.credentials ? { credentials: params.request.credentials } : {}
			}), void 0);
		} catch (error) {
			if (isDesktopCredentialsRequiredError(error)) {
				params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
					code: error.detailCode,
					auth: error.auth
				} }));
				return;
			}
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "gateway host desktop observe unavailable; verify the VNC server and retry"));
		}
		return;
	}
	if (params.request.source.kind === "node") {
		const service = getNodeDesktopService(params.context);
		if (!service) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node desktop service is unavailable; reconnect to the Gateway and retry"));
			return;
		}
		try {
			params.respond(true, await service.observe({
				nodeId: params.request.source.nodeId,
				control: params.request.control ?? false,
				requester: params.requester,
				..."credentials" in params.request && params.request.credentials ? { credentials: params.request.credentials } : {}
			}), void 0);
		} catch (error) {
			if (isDesktopCredentialsRequiredError(error)) {
				params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
					code: error.detailCode,
					auth: error.auth
				} }));
				return;
			}
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "node desktop observe unavailable"));
		}
		return;
	}
	const service = params.context.workerEnvironmentService;
	if (!service) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		return;
	}
	try {
		const result = await service.observeDesktop({
			environmentId: params.request.source.environmentId,
			control: params.request.control ?? false,
			requester: params.requester
		});
		params.respond(true, result, void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = code === "environment_not_found" || code === "invalid_state";
		params.respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, invalid && error instanceof Error ? error.message : "worker desktop observe unavailable"));
	}
}
async function respondDesktopLaunch(params) {
	const service = params.context.workerEnvironmentService;
	if (!service) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		return;
	}
	try {
		params.respond(true, await service.launchDesktopApp({
			environmentId: params.environmentId,
			app: params.app
		}), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = code === "environment_not_found" || code === "invalid_state" || code === "desktop_app_not_found" || code === "unsupported_platform";
		const actionable = invalid || code === "launcher_failure";
		params.respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, actionable && error instanceof Error ? error.message : "worker desktop app launch unavailable; try again"));
	}
}
//#endregion
//#region src/gateway/server-methods/environments.session-exec-approval.ts
/** Reuses operator approval custody; a decision authorizes this exact admitted invocation only. */
async function approveSessionEnvironmentCommand(params) {
	const { options, binding, assertCurrent } = params;
	const manager = options.context.execApprovalManager;
	if (!manager) throw new Error("Execution approval service is unavailable");
	assertCurrent();
	const ambient = options.client?.internal?.syntheticClient ? getGatewayToolCallerIdentity() : void 0;
	const runtime = options.client?.internal?.agentRuntimeIdentity ?? (ambient?.operationalRunInstance ? await createAgentRuntimeIdentity({
		...ambient,
		operationalRunInstance: ambient.operationalRunInstance
	}) : void 0);
	assertCurrent();
	if (ambient && !runtime) throw new Error("Environment command approval requires the current admitted run");
	const command = sanitizeExecApprovalDisplayTextWithStatus(JSON.stringify({
		argv: params.argv,
		...params.input === void 0 ? {} : { stdin: params.input }
	}));
	if (command.truncated || command.oversized) throw new Error("Environment command is too large to review completely; split it into smaller commands");
	const record = manager.create({
		command: command.text,
		host: "worker",
		...binding,
		runId: runtime?.operationalRunInstance.runId,
		allowedDecisions: ["allow-once", "deny"],
		warningText: `${params.background ? "Start a background process" : "Run a command"} in attached environment ${binding.environmentId}.${params.input === void 0 ? "" : ` The command receives ${Buffer.byteLength(params.input)} bytes on stdin.`} Approval is limited to this environment and invocation.`,
		turnSourceChannel: runtime?.turnSourceChannel,
		turnSourceTo: runtime?.turnSourceTo,
		turnSourceAccountId: runtime?.turnSourceAccountId,
		turnSourceThreadId: runtime?.turnSourceThreadId
	}, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS);
	bindApprovalRequesterMetadata({
		record,
		client: options.client
	});
	record.approvalAuthority = assertCurrent;
	record.approvalSignals = params.signal ? [params.signal] : [];
	if (runtime) record.agentRuntimeDelegatedAuthority = runtime.delegatedAuthority;
	if (runtime?.executionIdentity) record.executionIdentityToken = runtime.executionIdentity;
	const { decision } = await manager.register(record, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS);
	decision.catch(() => void 0);
	let approved = false;
	await handlePendingExecApprovalRequest({
		manager,
		record,
		context: options.context,
		clientConnId: options.client?.connId,
		twoPhase: false,
		deliverToApprovalClientsOnly: lookupCronRunExecSource(runtime?.operationalRunInstance.runId)?.agentId === binding.agentId,
		forwardRequest: options.context.forwardExecApprovalRequest,
		getIosPushDelivery: () => options.context.execApprovalIosPushDelivery,
		respond: (ok, _payload, error) => {
			if (!ok) throw new Error(error?.message ?? "Execution approval failed");
		},
		afterDecision: async (resolved) => {
			assertCurrent();
			approved = resolved === "allow-once" && await manager.consumeAllowOnce(record.id);
			assertCurrent();
		},
		afterDecisionErrorLabel: "environment exec approvals: approval follow-up failed"
	});
	assertCurrent();
	if (!approved) throw new Error("Environment command was not approved");
}
//#endregion
//#region src/gateway/server-methods/environments.session-exec.ts
const environmentsSessionExecHandlers = { "environments.session.exec": defineValidatedGatewayMethod("environments.session.exec", validateEnvironmentsSessionExecParams, async (options) => {
	const { params, respond, context } = options;
	try {
		const caller = resolveSessionEnvironmentCaller(options, params);
		const service = context.workerEnvironmentService;
		const binding = service?.getSessionAttachment(caller.identity.sessionId);
		if (!service || !binding || params.environmentId !== void 0 && params.environmentId !== binding.environmentId) throw new Error("No matching environment is attached to this conversation");
		const action = params.action ?? "run";
		const command = {
			argv: params.argv ? [...params.argv] : ["openclaw-internal-workspace-process"],
			input: params.input,
			timeoutMs: params.timeoutMs,
			processId: params.processId
		};
		const toolPolicy = captureSessionEnvironmentToolPolicy(options, caller, action === "run" || action === "start" ? "exec" : "process");
		let approved = false;
		const assertCurrent = () => {
			toolPolicy.assertAllowed();
			service.assertSessionAttachment(binding);
			const cfg = context.getRuntimeConfig();
			const target = loadAccessorSessionEntryForGatewayTarget({
				cfg,
				key: caller.identity.sessionKey,
				agentId: caller.identity.agentId
			});
			const defaults = resolveExecDefaults({
				cfg,
				...caller.identity,
				sessionEntry: target.entry
			});
			if (defaults.security === "deny") throw new Error("Conversation policy denies environment command execution");
			if (action === "run" || action === "start") {
				if (defaults.security === "allowlist" && defaults.ask === "off") throw new Error("Attached environment commands cannot inherit this host's executable allowlist");
				if (defaults.effectiveHost !== "gateway") throw new Error("The conversation's exec policy binds commands to a different host");
			}
		};
		assertCurrent();
		if (action === "run" || action === "start") {
			const cfg = context.getRuntimeConfig();
			const target = loadAccessorSessionEntryForGatewayTarget({
				cfg,
				key: caller.identity.sessionKey,
				agentId: caller.identity.agentId
			});
			const policy = resolveExecDefaults({
				cfg,
				...caller.identity,
				sessionEntry: target.entry
			});
			if (policy.security !== "full" || policy.ask === "always" || toolPolicy.cronExecAskAlways) {
				await approveSessionEnvironmentCommand({
					options,
					binding,
					argv: command.argv,
					input: command.input,
					background: action === "start",
					assertCurrent,
					signal: caller.signal
				});
				approved = true;
			}
		}
		const assertDispatch = () => {
			assertCurrent();
			if (action === "run" || action === "start") {
				const cfg = context.getRuntimeConfig();
				const target = loadAccessorSessionEntryForGatewayTarget({
					cfg,
					key: caller.identity.sessionKey,
					agentId: caller.identity.agentId
				});
				const policy = resolveExecDefaults({
					cfg,
					...caller.identity,
					sessionEntry: target.entry
				});
				if (!approved && (policy.security !== "full" || policy.ask === "always" || toolPolicy.cronExecAskAlways)) throw new Error("Environment execution policy now requires approval; retry the command");
			}
		};
		assertDispatch();
		const result = await service.execSessionAttachment(binding, {
			argv: command.argv,
			...command.input === void 0 ? {} : { input: command.input },
			...command.timeoutMs === void 0 ? {} : { timeoutMs: command.timeoutMs },
			...action === "run" ? {} : { process: {
				action,
				processId: command.processId
			} },
			transportRetry: "never",
			signal: caller.signal,
			assertCurrent: assertDispatch
		});
		assertCurrent();
		respond(true, {
			environmentId: binding.environmentId,
			...result
		});
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Environment execution failed"));
	}
}) };
//#endregion
//#region src/gateway/server-methods/environments.ts
const GATEWAY_ENVIRONMENT = {
	id: "gateway",
	type: "local",
	label: "Gateway local",
	status: "available",
	platform: process.platform,
	sessionHost: true,
	trust: "persistent",
	capabilities: [
		"agent.run",
		"sessions",
		"tools",
		"workspace"
	]
};
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function summarizeNodeEnvironment(node, config, requiredCommands, liveNode) {
	const capabilities = uniqueSortedStrings(node.caps, node.commands);
	const platform = node.platform?.trim();
	const allowlist = node.connected === true ? resolveNodeCommandAllowlist(config, {
		platform: node.platform,
		deviceFamily: node.deviceFamily,
		commands: node.commands,
		approvedCommands: node.commands
	}) : void 0;
	const invocableCommands = allowlist ? uniqueSortedStrings(node.commands).filter((command) => command.length <= 128 && isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	}).ok).slice(0, 128) : [];
	const desktop = invocableCommands.includes(NODE_DESKTOP_STREAM_COMMAND);
	const requiredNodeCommand = allowlist && liveNode ? resolveRequiredNodeCommandAuthority({
		requiredCommands,
		declaredCommands: liveNode.declaredCommands,
		effectiveCommands: liveNode.commands,
		withheldCommands: readNodeSessionWithheldCommands(liveNode),
		allowlist
	}) : void 0;
	return {
		id: `node:${node.nodeId}`,
		type: "node",
		label: node.displayName ?? node.nodeId,
		status: node.connected ? "available" : "unavailable",
		...platform ? { platform } : {},
		sessionHost: node.sessionHost === true,
		...node.workerSlots ? { workerSlots: { ...node.workerSlots } } : {},
		...node.workerBundle ? { workerBundle: structuredClone(node.workerBundle) } : {},
		...node.lastConnectedAtMs !== void 0 ? { lastConnectedAtMs: node.lastConnectedAtMs } : {},
		...node.lastDisconnectedAtMs !== void 0 ? { lastDisconnectedAtMs: node.lastDisconnectedAtMs } : {},
		...node.lastSeenAtMs !== void 0 ? { lastSeenAtMs: node.lastSeenAtMs } : {},
		...node.lastSeenReason ? { lastSeenReason: node.lastSeenReason } : {},
		trust: "persistent",
		...desktop ? { desktop: true } : {},
		...liveNode?.desktopAvailability ? { desktopAvailability: { ...liveNode.desktopAvailability } } : {},
		...capabilities.length > 0 ? { capabilities } : {},
		...invocableCommands.length > 0 ? { invocableCommands } : {},
		...requiredNodeCommand ? { requiredNodeCommand } : {},
		...node.issues?.length ? { issues: [...node.issues] } : {}
	};
}
async function listGatewayEnvironments(context, workers = listWorkerEnvironments(context), runtimeId, includeDesktopSetup = false) {
	const devices = await listDevicePairing();
	const nodes = projectNodePairing(devices.paired);
	const managedCloudNodeIds = new Set(workers.flatMap((environment) => environment.providerId !== "device" && environment.nodeDeviceId && environment.state !== "destroyed" ? [environment.nodeDeviceId] : []));
	const visibleDevices = devices.paired.filter((device) => !managedCloudNodeIds.has(device.deviceId));
	const connectedNodes = context.nodeRegistry.listConnectedForPairingStates(projectPairedDeviceNodeBindings(visibleDevices));
	const placement = runtimeId ? resolveWorkerPlacementCapabilities(runtimeId) : void 0;
	const runtimeState = collectNodeCatalogRuntimeState(context.nodeRegistry, connectedNodes, placement?.executionMode === "worker-turn");
	const connectedNodesById = new Map(connectedNodes.map((node) => [node.nodeId, node]));
	const requiredCommands = placement?.devicePlacement?.requiredNodeCommands ?? [];
	const catalog = createKnownNodeCatalog({
		pairedDevices: visibleDevices,
		pairedNodes: nodes.paired.filter((node) => !managedCloudNodeIds.has(node.nodeId)),
		connectedNodes: connectedNodes.filter((node) => !managedCloudNodeIds.has(node.nodeId)),
		...runtimeState
	});
	const config = context.getRuntimeConfig();
	let gateway = config.desktop?.host?.enabled === true ? {
		...GATEWAY_ENVIRONMENT,
		desktop: true
	} : GATEWAY_ENVIRONMENT;
	if (includeDesktopSetup && config.desktop?.host?.enabled !== true) {
		const { inspectHostDesktopSetup } = await import("./host-source-DQb1Z5IW.mjs");
		gateway = {
			...gateway,
			desktopSetup: await inspectHostDesktopSetup({ config: config.desktop?.host })
		};
	}
	return [gateway, ...listKnownNodes(catalog).map((node) => summarizeNodeEnvironment(node, config, requiredCommands, connectedNodesById.get(node.nodeId)))];
}
function listWorkerEnvironments(context) {
	try {
		return context.workerEnvironmentService?.list() ?? [];
	} catch {
		throw new Error("environment inventory unavailable");
	}
}
function listWorkerProfiles(context) {
	if (!context.workerEnvironmentService || !context.workerPlacementDispatchService) return [];
	const profiles = context.getRuntimeConfig().cloudWorkers?.profiles ?? {};
	return Object.entries(profiles).flatMap(([id, profile]) => {
		const providerId = typeof profile.provider === "string" ? profile.provider.trim() : "";
		return id.trim() && providerId ? [{
			id: id.trim(),
			providerId
		}] : [];
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
async function listWorkerProfilesWithMachines(context) {
	const summaries = listWorkerProfiles(context);
	return await Promise.all(summaries.map(async (summary) => {
		const executionModes = ["worker-turn", "remote-exec"].filter((mode) => context.workerEnvironmentService?.supportsExecutionMode(summary.id, mode) === true);
		const executionMode = executionModes[0];
		const providerDisplayId = context.workerEnvironmentService?.readProviderDisplayId(summary.id);
		const resolvedSummary = Object.assign(summary, executionMode ? {
			executionMode,
			executionModes
		} : {}, providerDisplayId ? { providerDisplayId } : {});
		try {
			const [options, operatingSystems] = await Promise.all([context.workerEnvironmentService?.listMachineOptions?.(summary.id), context.workerEnvironmentService?.listOperatingSystems?.(summary.id)]);
			const machines = options ?? [];
			return Object.assign(resolvedSummary, machines.length > 0 ? { machines } : {}, operatingSystems && operatingSystems.length > 1 ? { operatingSystems } : {});
		} catch (error) {
			context.logGateway.warn(`worker machine catalog unavailable (${summary.id}): ${formatForLog(error)}`);
			return resolvedSummary;
		}
	}));
}
async function respondWorkerMutation(respond, run, invalidCodes, unavailableMessage) {
	try {
		respond(true, summarizeWorkerEnvironment(await run()), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = typeof code === "string" && invalidCodes.includes(code);
		const message = invalid && error instanceof Error ? error.message : unavailableMessage;
		respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, message));
	}
}
const environmentsHandlers = {
	...environmentsSessionHandlers,
	...environmentsSessionExecHandlers,
	"environments.list": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateEnvironmentsListParams, "environments.list", respond)) return;
		if (params.runtimeId) {
			const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
			const access = authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, scopes);
			if (!access.allowed) {
				respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${access.missingScope}`));
				return;
			}
		}
		await respondUnavailableOnThrow(respond, async () => {
			let environments = [];
			if (params.projection !== "profiles") {
				const workers = listWorkerEnvironments(context);
				environments = await listGatewayEnvironments(context, workers, params.runtimeId, params.includeDesktopSetup);
				const summarizedAtMs = Date.now();
				environments.push(...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs)));
			}
			const profiles = await listWorkerProfilesWithMachines(context);
			respond(true, {
				environments,
				...profiles.length > 0 ? { profiles } : {}
			}, void 0);
		});
	},
	"environments.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateEnvironmentsStatusParams, "environments.status", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listGatewayEnvironments(context)).find((entry) => entry.id === params.environmentId);
			if (environment) {
				respond(true, environment, void 0);
				return;
			}
			let worker;
			try {
				worker = context.workerEnvironmentService?.get(params.environmentId);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "environment status unavailable"));
				return;
			}
			respond(Boolean(worker), worker ? summarizeWorkerEnvironment(worker) : void 0, worker ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		});
	},
	"environments.create": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateEnvironmentsCreateParams, "environments.create", respond)) return;
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker environments are not configured"));
			return;
		}
		await respondWorkerMutation(respond, () => service.create(params.profileId, params.idempotencyKey), ["profile_not_found", "invalid_profile"], "worker environment creation failed");
	},
	"environments.prepare": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateEnvironmentsPrepareParams, "environments.prepare", respond)) return;
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker environments are not configured"));
			return;
		}
		try {
			const authority = readGatewayRequestMutationAuthority(options);
			respond(true, await service.prepare(params, authority.assertCurrent), void 0);
		} catch (error) {
			const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
			const invalid = code === "profile_not_found" || code === "invalid_profile" || code === "invalid_project";
			const known = invalid || code === "capacity";
			respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, known && error instanceof Error ? error.message : "worker environment preparation failed", known ? { details: { code } } : void 0));
		}
	},
	"environments.destroy": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateEnvironmentsDestroyParams, "environments.destroy", respond)) return;
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
			return;
		}
		await respondWorkerMutation(respond, async () => {
			const placementService = context.workerPlacementDispatchService;
			if (params.force && !placementService?.forceDestroyEnvironment) throw new Error("cloud worker placement control is unavailable");
			const destroyed = params.force ? await placementService.forceDestroyEnvironment(params.environmentId, (error) => {
				context.logGateway.warn(`worker environment forced teardown cleanup failed: ${formatForLog(error)}`);
			}) : await service.destroyUnattached(params.environmentId);
			try {
				await context.workerPlacementDispatchService?.reconcileActive?.(params.environmentId);
			} catch (error) {
				context.logGateway.warn(`worker placement reconciliation after destroy failed: ${formatForLog(error)}`);
			}
			return destroyed;
		}, ["environment_not_found", "invalid_state"], "worker environment destruction failed");
	},
	"worker.desktop.observe": async ({ params, respond, context, client, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validateWorkerDesktopObserveParams, "worker.desktop.observe", respond)) return;
		await respondDesktopObserve({
			request: {
				source: {
					kind: "environment",
					environmentId: params.environmentId
				},
				...params.control === void 0 ? {} : { control: params.control }
			},
			respond,
			context,
			requester: resolveDesktopObserveRequester({
				client,
				hasCurrentClientAuthority
			})
		});
	},
	"worker.desktop.launch": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWorkerDesktopLaunchParams, "worker.desktop.launch", respond)) return;
		await respondDesktopLaunch({
			environmentId: params.environmentId,
			app: params.app,
			respond,
			context
		});
	},
	"desktop.observe": async ({ params, respond, context, client, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validateDesktopObserveParams, "desktop.observe", respond)) return;
		await respondDesktopObserve({
			request: params,
			respond,
			context,
			requester: resolveDesktopObserveRequester({
				client,
				hasCurrentClientAuthority
			})
		});
	},
	"desktop.launch": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateDesktopLaunchParams, "desktop.launch", respond)) return;
		await respondDesktopLaunch({
			environmentId: params.source.environmentId,
			app: params.app,
			respond,
			context
		});
	},
	"desktop.release": async ({ params, respond, client, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validateDesktopReleaseParams, "desktop.release", respond)) return;
		const { releaseDesktopObserverToken } = await import("./observe-bridge-CSkgehV0.mjs");
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { released: await releaseDesktopObserverToken(params.wsPath, resolveDesktopObserveRequester({
				client,
				hasCurrentClientAuthority
			})) }, void 0);
		});
	}
};
//#endregion
export { listGatewayEnvironments as n, listWorkerProfiles as r, environmentsHandlers as t };
