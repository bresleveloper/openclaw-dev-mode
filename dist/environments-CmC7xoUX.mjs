import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { c as prepareSessionSourceAuthority } from "./session-source-authority-fdILH-PW.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { Ht as validateDesktopObserveParams, Ic as validateWorkerDesktopLaunchParams, Ng as errorShape, Rc as validateWorkerDesktopObserveParams, Vt as validateDesktopLaunchParams, Wt as validateDesktopReleaseParams, an as validateEnvironmentsPrepareParams, dn as validateEnvironmentsStatusParams, in as validateEnvironmentsListParams, ln as validateEnvironmentsSessionExecParams, nn as validateEnvironmentsCreateParams, rn as validateEnvironmentsDestroyParams, tn as validateEnvironmentsAdoptSuggestedProfileParams } from "./src-pLJQA6J5.mjs";
import { i as preparePluginModule } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { r as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-Bz94WyMt.mjs";
import { p as resolveConfigSnapshotHash } from "./io.read-helpers-KYk5dB53.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-B4MiOXOl.mjs";
import { c as loadManifestMetadataSnapshot, i as listAvailableManifestContractPlugins } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS } from "./exec-approvals-core-7oJu_fRe.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as captureSessionEntrySourceAssertion } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { t as resolveWorkerPlacementCapabilities } from "./placement-capabilities-B7Dg_n0B.mjs";
import { o as prepareExecApprovalsCurrentRead } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { t as prepareExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { r as sanitizeExecApprovalDisplayTextWithStatus } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
import { t as readKnownNodeCatalog } from "./node-catalog-read-DY-LeCva.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { n as defineValidatedGatewayHandler, r as defineValidatedGatewayMethod, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as createAgentRuntimeIdentity } from "./agent-runtime-identity-token-XE9aO4SS.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { d as resolveRequiredNodeCommandAuthority, l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CCKsZy54.mjs";
import { t as workerInferenceMetadata } from "./inference-placement-C1SOuYae.mjs";
import { n as readNodeSessionWithheldCommands } from "./node-registry-DEW2P2-e.mjs";
import { t as lookupCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { t as DesktopCredentialsRequiredError } from "./host-source-errors-MaOVAU6G.mjs";
import { t as bindApprovalRequesterMetadata } from "./approval-shared-QJKmB54s.mjs";
import { t as handlePendingApprovalRequestWithDelivery } from "./approval-request-delivery-BMVg4TA2.mjs";
import { i as summarizeWorkerEnvironment, n as resolveSessionEnvironmentCaller, r as captureSessionEnvironmentToolPolicy, t as environmentsSessionHandlers } from "./environments.session-FdMlzGDh.mjs";
import { n as getNodeDesktopService } from "./node-source-context-Csxf7qYw.mjs";
//#region src/gateway/desktop/observe-requester.ts
function resolveDesktopObserveRequester(options) {
	const { client, hasCurrentClientAuthority } = options;
	if (!client) return;
	return {
		connId: client.connId,
		operatorName: client.authenticatedUserProfile?.displayName?.trim() || client.authenticatedUserId?.trim() || void 0,
		signal: client.connectionSignal,
		remoteIngressPrincipal: client.internal?.remoteIngressPrincipal,
		isCurrent: () => client.invalidated !== true && !client.connectionSignal?.aborted && hasCurrentClientAuthority?.() !== false
	};
}
//#endregion
//#region src/gateway/server-methods/environments.desktop.ts
function respondDesktopObserveFailure(respond, error, fallback) {
	if (error instanceof DesktopCredentialsRequiredError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
			code: error.detailCode,
			auth: error.auth
		} }));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : fallback));
}
async function respondDesktopObserve(params) {
	const { request, context, respond } = params;
	if (request.source.kind !== "environment") {
		const host = request.source.kind === "host";
		if (host && context.getRuntimeConfig().desktop?.host?.enabled !== true) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway host desktop is disabled; enable the Desktop lab (config: desktop.host.enabled=true)"));
			return;
		}
		const options = {
			control: request.control ?? false,
			requester: params.requester,
			..."credentials" in request && request.credentials ? { credentials: request.credentials } : {}
		};
		const hostService = host ? context.hostDesktopService : void 0;
		const nodeService = host ? void 0 : getNodeDesktopService(context);
		const observe = request.source.kind === "host" ? hostService?.observe.bind(hostService, options) : nodeService?.observe.bind(nodeService, {
			...options,
			nodeId: request.source.nodeId
		});
		if (!observe) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, host ? "gateway host desktop is unavailable in this Gateway runtime" : "node desktop service is unavailable; reconnect to the Gateway and retry"));
			return;
		}
		try {
			respond(true, await observe(), void 0);
		} catch (error) {
			respondDesktopObserveFailure(respond, error, host ? "gateway host desktop observe unavailable; verify the VNC server and retry" : "node desktop observe unavailable");
		}
		return;
	}
	const { environmentId } = request.source;
	await respondWorkerDesktop(params, "observe", (service) => service.observeDesktop({
		environmentId,
		control: params.request.control ?? false,
		requester: params.requester
	}));
}
async function respondDesktopLaunch(params) {
	await respondWorkerDesktop(params, "launch", (service) => service.launchDesktopApp({
		environmentId: params.environmentId,
		app: params.app
	}));
}
async function respondWorkerDesktop(params, operation, run) {
	const service = params.context.workerEnvironmentService;
	if (!service) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		return;
	}
	try {
		params.respond(true, await run(service), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = code === "environment_not_found" || code === "invalid_state" || operation === "launch" && (code === "desktop_app_not_found" || code === "unsupported_platform");
		const actionable = invalid || operation === "launch" && code === "launcher_failure";
		params.respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, actionable && error instanceof Error ? error.message : operation === "launch" ? "worker desktop app launch unavailable; try again" : "worker desktop observe unavailable"));
	}
}
//#endregion
//#region src/gateway/server-methods/environments.profiles.ts
function listWorkerProfiles(context) {
	if (!context.workerEnvironmentService || !context.workerPlacementDispatchService) return [];
	const profiles = context.getRuntimeConfig().cloudWorkers?.profiles ?? {};
	return Object.entries(profiles).flatMap(([id, profile]) => {
		const providerId = typeof profile.provider === "string" ? profile.provider.trim() : "";
		return id.trim() && providerId ? [{
			id: id.trim(),
			providerId,
			...workerInferenceMetadata({
				providerId,
				profileSnapshot: profile
			})
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
	await handlePendingApprovalRequestWithDelivery({
		approvalKind: "exec",
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
	const caller = await resolveSessionEnvironmentCaller(options, params);
	let policyAuthority;
	try {
		const scope = {
			...caller.identity,
			storePath: resolveSessionStorePathForScope(caller.identity, context.getRuntimeConfig())
		};
		const policyEntry = await readSessionEntryReadOnlyInWorker(scope, caller.assertCurrent);
		policyAuthority = await prepareSessionSourceAuthority(captureSessionEntrySourceAssertion({
			scope,
			expected: policyEntry,
			fields: [
				"sessionId",
				"lifecycleRevision",
				"execHost",
				"execNode",
				"permissionMode",
				"sandbox",
				"sandboxMode",
				"createdActor"
			],
			assertCurrent: caller.assertCurrent,
			assertHostCurrent: caller.assertCurrent,
			refuse() {
				throw new Error("The selected session changed before its operation committed.");
			}
		}));
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
		const readApprovals = await prepareExecApprovalsCurrentRead(captureOpenClawStateWorkerContext());
		let approved = false;
		const resolvePolicy = () => {
			const cfg = context.getRuntimeConfig();
			policyAuthority.assertCurrent();
			const preparation = prepareExecDefaults({
				cfg,
				...caller.identity,
				sessionEntry: policyEntry
			}, resolveSandboxRuntimeStatus({
				cfg,
				...caller.identity,
				preparedSessionEntry: policyEntry ?? null
			}));
			return preparation.kind === "resolved" ? preparation.defaults : preparation.resolve(readApprovals());
		};
		const requiresApproval = (policy) => policy.security !== "full" || policy.ask === "always" || toolPolicy.cronExecAskAlways;
		const assertCurrent = () => {
			toolPolicy.assertAllowed();
			service.assertSessionAttachment(binding);
			const defaults = resolvePolicy();
			if (defaults.security === "deny") throw new Error("Conversation policy denies environment command execution");
			if (action === "run" || action === "start") {
				if (defaults.security === "allowlist" && defaults.ask === "off") throw new Error("Attached environment commands cannot inherit this host's executable allowlist");
				if (defaults.effectiveHost !== "gateway") throw new Error("The conversation's exec policy binds commands to a different host");
			}
			return defaults;
		};
		const initialPolicy = assertCurrent();
		if ((action === "run" || action === "start") && requiresApproval(initialPolicy)) {
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
		const assertDispatch = () => {
			const policy = assertCurrent();
			if (action === "run" || action === "start") {
				if (!approved && requiresApproval(policy)) throw new Error("Environment execution policy now requires approval; retry the command");
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
	} finally {
		try {
			await policyAuthority?.release?.();
		} finally {
			caller.release();
		}
	}
}, (error) => errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Environment execution failed")) };
//#endregion
//#region src/plugins/worker-profile-suggestions.ts
const log = createSubsystemLogger("plugins");
/** Reads only declared setup surfaces; configured profiles remain the sole placement authority. */
async function resolveSuggestedWorkerProfile(params) {
	if (Object.keys(params.config.cloudWorkers?.profiles ?? {}).length > 0) return;
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const snapshot = loadManifestMetadataSnapshot({ config: params.config });
	const owners = listAvailableManifestContractPlugins({
		snapshot,
		config: params.config,
		contract: "workerProfileSuggestions"
	}).filter((plugin) => passesManifestOwnerBasePolicy({
		plugin,
		normalizedConfig
	}));
	for (const owner of owners) try {
		const modulePath = resolvePluginRootPublicSurfacePath({
			pluginRoot: owner.rootDir,
			pluginId: owner.id,
			entrySource: owner.source,
			artifactBasename: "worker-profile-api.js"
		});
		if (!modulePath) throw new Error("missing worker-profile-api discovery artifact");
		const source = preparePluginModule({
			modulePath,
			boundaryRoot: owner.rootDir,
			boundaryLabel: "plugin root",
			surfaceLabel: "worker profile discovery",
			origin: owner.origin,
			pluginId: owner.id,
			rejectHardlinks: shouldRejectHardlinkedPluginFiles(owner)
		}).modulePath;
		const loader = getPluginSetupModuleLoader(owner, source, owner.rootDir);
		const suggestion = await loader.initialize(() => {
			const module = loader(source);
			if (!module || typeof module !== "object" || !("discoverWorkerProfile" in module) || typeof module.discoverWorkerProfile !== "function") throw new Error("worker-profile-api must export discoverWorkerProfile");
			return module.discoverWorkerProfile;
		})({ refresh: params.refresh });
		if (suggestion) {
			if (!owner.contracts?.workerProfileSuggestions?.includes(suggestion.profile.provider)) throw new Error("suggested profile uses an undeclared worker provider");
			return suggestion;
		}
	} catch (error) {
		log.warn(`Worker profile discovery unavailable for ${owner.id}: ${String(error)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/environments.suggested-profile.ts
async function listSuggestedWorkerProfile(context) {
	const config = context.getRuntimeConfig();
	if (Object.keys(config.cloudWorkers?.profiles ?? {}).length > 0) return;
	const suggestion = await resolveSuggestedWorkerProfile({ config });
	if (!suggestion || context.getRuntimeConfig() !== config) return;
	return {
		id: suggestion.id,
		providerId: suggestion.profile.provider,
		...suggestion.providerDisplayId ? { providerDisplayId: suggestion.providerDisplayId } : {}
	};
}
async function requireActiveCloudProfile(context) {
	const profile = (await listWorkerProfilesWithMachines(context)).find((summary) => summary.id === "cloud");
	if (!profile) throw new Error("The cloud worker profile is saved but is not active on this Gateway. Wait for the Gateway to restart, then retry; if it does not restart, restart it manually.");
	return profile;
}
const adoptSuggestedWorkerProfile = defineValidatedGatewayHandler("environments.adoptSuggestedProfile", validateEnvironmentsAdoptSuggestedProfileParams, async (options) => {
	const { context, respond } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	await respondUnavailableOnThrow(respond, async () => {
		const { snapshot } = await readConfigFileSnapshotForWrite();
		authority.assertCurrent();
		if (snapshot.sourceConfig.cloudWorkers?.profiles?.cloud) {
			const profile = await requireActiveCloudProfile(context);
			authority.assertCurrent();
			respond(true, { profile }, void 0);
			return;
		}
		const suggestion = await resolveSuggestedWorkerProfile({
			config: snapshot.config,
			refresh: true
		});
		authority.assertCurrent();
		if (!suggestion || suggestion.id !== "cloud") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "No cloud worker profile is available to configure"));
			return;
		}
		const hash = resolveConfigSnapshotHash(snapshot);
		const { configHandlers } = await import("./config-C9v2iut-.mjs");
		authority.assertCurrent();
		let saved = false;
		await configHandlers["config.patch"]({
			...options,
			req: {
				...options.req,
				method: "config.patch"
			},
			params: {
				raw: JSON.stringify({ cloudWorkers: { profiles: { cloud: suggestion.profile } } }),
				...hash ? { baseHash: context.configRevisionProjector.projectRawHash(hash) } : {},
				response: "summary"
			},
			sessionMutationCommitGuard: authority.assertCurrent,
			respond: (ok, payload, error, meta) => {
				if (ok) saved = true;
				else respond(false, payload, error, meta);
			}
		});
		if (!saved) return;
		const profile = await requireActiveCloudProfile(context);
		authority.assertCurrent();
		respond(true, { profile }, void 0);
	});
});
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
		nodeId: node.nodeId,
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
		...node.connected && node.workerHost?.deviceFolders === true ? { workerHost: { deviceFolders: true } } : {},
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
async function listGatewayEnvironments(context, workers = readWorkerInventory(context, false).workers, runtimeId, includeDesktopSetup = false) {
	const placement = runtimeId ? resolveWorkerPlacementCapabilities(runtimeId) : void 0;
	const { nodes, connectedNodes } = await readKnownNodeCatalog(context.nodeRegistry, placement?.executionMode === "worker-turn" ? "worker-environments" : "environments");
	const managedCloudNodeIds = new Set(workers.flatMap((environment) => environment.providerId !== "device" && environment.nodeDeviceId && environment.state !== "destroyed" ? [environment.nodeDeviceId] : []));
	const connectedNodesById = new Map(connectedNodes.map((node) => [node.nodeId, node]));
	const requiredCommands = placement?.devicePlacement?.requiredNodeCommands ?? [];
	const config = context.getRuntimeConfig();
	let gateway = config.desktop?.host?.enabled === true ? {
		...GATEWAY_ENVIRONMENT,
		desktop: true
	} : GATEWAY_ENVIRONMENT;
	if (includeDesktopSetup && config.desktop?.host?.enabled !== true) {
		const { inspectHostDesktopSetup } = await import("./host-source-DI2h8iZL.mjs");
		gateway = {
			...gateway,
			desktopSetup: await inspectHostDesktopSetup({ config: config.desktop?.host })
		};
	}
	return [gateway, ...nodes.filter((node) => !managedCloudNodeIds.has(node.nodeId)).map((node) => summarizeNodeEnvironment(node, config, requiredCommands, connectedNodesById.get(node.nodeId)))];
}
function readWorkerInventory(context, includePreparedDetails) {
	try {
		return {
			workers: context.workerEnvironmentService?.list() ?? [],
			preparedPool: includePreparedDetails ? context.workerEnvironmentService?.readPreparedPoolSummary() : void 0
		};
	} catch {
		throw new Error("environment inventory unavailable");
	}
}
function defineEnvironmentMutation(method, validate, run) {
	return defineValidatedGatewayHandler(`environments.${method}`, validate, async (options) => {
		const { respond, context } = options;
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, method === "destroy" ? "unknown environmentId" : "cloud worker environments are not configured"));
			return;
		}
		try {
			respond(true, await run(options, service), void 0);
		} catch (error) {
			const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
			const invalid = method === "destroy" ? code === "environment_not_found" || code === "invalid_state" : code === "profile_not_found" || code === "invalid_profile" || method === "prepare" && code === "invalid_project";
			const known = invalid || method === "prepare" && code === "capacity";
			const operation = {
				create: "creation",
				prepare: "preparation",
				destroy: "destruction"
			}[method];
			respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, known && error instanceof Error ? error.message : `worker environment ${operation} failed`, method === "prepare" && known ? { details: { code } } : void 0));
		}
	});
}
const environmentsHandlers = {
	...environmentsSessionHandlers,
	"environments.adoptSuggestedProfile": adoptSuggestedWorkerProfile,
	...environmentsSessionExecHandlers,
	"environments.list": async (options) => {
		const { params, respond, client, context } = options;
		if (!assertValidParams(params, validateEnvironmentsListParams, "environments.list", respond)) return;
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		const includePreparedDetails = params.includePreparedDetails === true && authorizeOperatorScopesForRequiredScope("operator.admin", scopes).allowed;
		const authority = readGatewayRequestMutationAuthority(options);
		if (params.runtimeId) {
			const access = authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, scopes);
			if (!access.allowed) {
				respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${access.missingScope}`));
				return;
			}
		}
		await respondUnavailableOnThrow(respond, async () => {
			let environments = [];
			let workers = [];
			let preparedPool;
			if (params.projection !== "profiles") {
				const inventory = readWorkerInventory(context, includePreparedDetails);
				workers = inventory.workers;
				preparedPool = inventory.preparedPool;
				environments = await listGatewayEnvironments(context, workers, params.runtimeId, params.includeDesktopSetup);
			}
			const profiles = await listWorkerProfilesWithMachines(context);
			const suggestedProfile = await listSuggestedWorkerProfile(context);
			authority.assertCurrent();
			const includeCurrentPreparedDetails = includePreparedDetails && authorizeOperatorScopesForRequiredScope("operator.admin", Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed;
			const summarizedAtMs = Date.now();
			environments.push(...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs, { includePreparedDetails: includeCurrentPreparedDetails })));
			respond(true, {
				environments,
				...suggestedProfile ? { suggestedProfile } : {},
				...context.getRuntimeConfig().cloudWorkers?.requiredProfile ? { requiredProfile: context.getRuntimeConfig().cloudWorkers?.requiredProfile } : {},
				...profiles.length > 0 ? { profiles: includeCurrentPreparedDetails ? profiles.map((profile) => ({
					...profile,
					readyWorkers: context.workerEnvironmentService?.readReadyWorkerTarget(profile.id)
				})) : profiles } : {},
				...includeCurrentPreparedDetails && preparedPool ? { preparedPool } : {}
			}, void 0);
		});
	},
	"environments.status": async (options) => {
		const { params, respond, client, context } = options;
		if (!assertValidParams(params, validateEnvironmentsStatusParams, "environments.status", respond)) return;
		const authority = readGatewayRequestMutationAuthority(options);
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listGatewayEnvironments(context)).find((entry) => entry.id === params.environmentId);
			authority.assertCurrent();
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
			respond(Boolean(worker), worker ? summarizeWorkerEnvironment(worker, Date.now(), { includePreparedDetails: params.includePreparedDetails === true && authorizeOperatorScopesForRequiredScope("operator.admin", Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed }) : void 0, worker ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		});
	},
	"environments.create": defineEnvironmentMutation("create", validateEnvironmentsCreateParams, async ({ params }, service) => summarizeWorkerEnvironment(await service.create(params.profileId, params.idempotencyKey))),
	"environments.prepare": defineEnvironmentMutation("prepare", validateEnvironmentsPrepareParams, (options, service) => service.prepare(options.params, readGatewayRequestMutationAuthority(options).assertCurrent)),
	"environments.destroy": defineEnvironmentMutation("destroy", validateEnvironmentsDestroyParams, async ({ params, context }, service) => {
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
		return summarizeWorkerEnvironment(destroyed);
	}),
	"worker.desktop.observe": defineValidatedGatewayHandler("worker.desktop.observe", validateWorkerDesktopObserveParams, ({ params, respond, context, client, hasCurrentClientAuthority }) => respondDesktopObserve({
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
	})),
	"worker.desktop.launch": defineValidatedGatewayHandler("worker.desktop.launch", validateWorkerDesktopLaunchParams, ({ params, respond, context }) => respondDesktopLaunch({
		environmentId: params.environmentId,
		app: params.app,
		respond,
		context
	})),
	"desktop.observe": defineValidatedGatewayHandler("desktop.observe", validateDesktopObserveParams, ({ params, respond, context, client, hasCurrentClientAuthority }) => respondDesktopObserve({
		request: params,
		respond,
		context,
		requester: resolveDesktopObserveRequester({
			client,
			hasCurrentClientAuthority
		})
	})),
	"desktop.launch": defineValidatedGatewayHandler("desktop.launch", validateDesktopLaunchParams, ({ params, respond, context }) => respondDesktopLaunch({
		environmentId: params.source.environmentId,
		app: params.app,
		respond,
		context
	})),
	"desktop.release": defineValidatedGatewayHandler("desktop.release", validateDesktopReleaseParams, async ({ params, respond, client, hasCurrentClientAuthority }) => {
		const { releaseDesktopObserverToken } = await import("./observe-bridge-DwYpVqhW.mjs");
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { released: await releaseDesktopObserverToken(params.wsPath, resolveDesktopObserveRequester({
				client,
				hasCurrentClientAuthority
			})) }, void 0);
		});
	})
};
//#endregion
export { listGatewayEnvironments as n, listWorkerProfiles as r, environmentsHandlers as t };
