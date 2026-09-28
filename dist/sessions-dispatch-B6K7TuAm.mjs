import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Yi as validateSessionsReclaimParams } from "./src-BRUl7oDv.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { n as validateSessionsMoveParams, t as validateSessionsDispatchParams } from "./session-placement-validators-C2Fz-CfU.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { n as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { a as isForceAbandonedWorkerPlacement } from "./placement-record-CB6gcJKw.mjs";
import { i as resolveWorkerPlacementSessionRuntime, o as resolveWorkerPlacementCapabilities } from "./placement-session-runtime-PDZExznz.mjs";
import { A as readWorkerPlacementIdentity, k as projectWorkerSessionPlacement } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { n as resolveWorkerPlacementDestination, t as resolveProjectProfileDestination } from "./placement-destination-CngAq5ZE.mjs";
import { a as managedWorktrees } from "./service-BPmV9ykg.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget, r as isWorkerDispatchInputError, s as requireSessionKey } from "./sessions-shared-DPyHwOCR.mjs";
import { i as deviceUnavailableText } from "./device-provider-meDSQEul.mjs";
import { n as listGatewayEnvironments } from "./environments-5CT6nqoL.mjs";
import { l as resolveDevicePlacementEligibility, t as canRetryDeviceDispatch } from "./placement-dispatch-failure-XZ0DYtfH.mjs";
//#region src/gateway/worker-environments/device-placement-selector.ts
async function selectDevicePlacementCandidates(params) {
	const { requirement } = params;
	if (!requirement) return {
		ok: false,
		error: `runtime ${params.runtimeId} does not support paired-device placement; select a compatible runtime or cloud worker provider`
	};
	const nodes = params.environments.filter((environment) => environment.type === "node").toSorted((left, right) => left.id.localeCompare(right.id));
	const outdated = nodes.find((node) => node.issues?.some((issue) => issue.code === "update-required"));
	const outdatedError = outdated && deviceUnavailableText(outdated.id.slice(5), {
		available: false,
		issue: outdated.issues?.[0]
	});
	const hosts = nodes.filter((node) => node.sessionHost === true);
	if (hosts.length === 0) return {
		ok: false,
		error: outdatedError ?? "no paired session-host nodes are available; pair a node, enable session hosting, then retry"
	};
	const connected = hosts.filter((node) => node.status === "available");
	if (connected.length === 0) {
		const deviceId = hosts[0].id.slice(5);
		return {
			ok: false,
			error: `all paired session-host nodes are disconnected; ${deviceUnavailableText(deviceId, {
				available: false,
				unavailableReason: "disconnected"
			})}`
		};
	}
	const attempts = await Promise.all(connected.filter((node) => !node.issues?.some((issue) => issue.code === "update-required")).map(async (node) => {
		const deviceId = node.id.slice(5);
		const eligibility = await resolveDevicePlacementEligibility({
			environmentService: params.environmentService,
			deviceId,
			runtimeId: params.runtimeId,
			executionMode: params.executionMode,
			requirement,
			config: params.config,
			currentNode: params.nodeRegistry.get(deviceId)
		});
		return {
			deviceId,
			totalSlots: eligibility.ok ? eligibility.node.workerHost.capacity.total : 0,
			availableSlots: eligibility.ok ? Math.max(0, eligibility.availableSlots - (params.getPendingDispatchCount?.(deviceId) ?? 0)) : node.workerSlots?.available ?? 0,
			eligibility
		};
	}));
	const admittedSessions = requirement.consumesWorkerSlot ? params.getAdmittedSessionCounts?.() : void 0;
	const candidates = attempts.filter((attempt) => attempt.eligibility.ok && (!requirement.consumesWorkerSlot || attempt.availableSlots > 0)).toSorted((left, right) => (requirement.consumesWorkerSlot ? (admittedSessions?.get(left.deviceId) ?? 0) * right.totalSlots - (admittedSessions?.get(right.deviceId) ?? 0) * left.totalSlots : 0) || (requirement.consumesWorkerSlot ? right.availableSlots - left.availableSlots : 0) || left.deviceId.localeCompare(right.deviceId)).map(({ deviceId, availableSlots }) => ({
		deviceId,
		availableSlots
	}));
	if (candidates.length > 0) return {
		ok: true,
		candidates
	};
	if (attempts.length === 0 && outdatedError) return {
		ok: false,
		error: outdatedError
	};
	const updateRequired = attempts.find(({ eligibility }) => !eligibility.ok && eligibility.issue);
	if (updateRequired && !updateRequired.eligibility.ok) return {
		ok: false,
		error: updateRequired.eligibility.error
	};
	if (requirement.consumesWorkerSlot && attempts.every(({ availableSlots }) => availableSlots === 0)) return {
		ok: false,
		error: `all paired session-host nodes are at capacity; ${deviceUnavailableText(attempts[0].deviceId, {
			available: false,
			unavailableReason: "at-capacity"
		})}`
	};
	const failed = attempts.find(({ eligibility }) => !eligibility.ok);
	return {
		ok: false,
		error: failed && !failed.eligibility.ok ? failed.eligibility.error : "no paired session-host node supports this runtime; check node commands and reconnect an eligible host"
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-dispatch.ts
function respondInvalidWorkerSession(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
const MAX_AUTO_DEVICE_PLACEMENT_ATTEMPTS = 3;
function resolveWorkerSessionTarget(params) {
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.key, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	const destination = resolveWorkerPlacementDestination({
		cfg,
		profileId: params.profileId,
		deviceId: params.deviceId,
		machineClass: params.machineClass,
		os: params.os
	});
	if (!destination.ok) {
		respondInvalidWorkerSession(params.respond, destination.error);
		return;
	}
	const target = loadAccessorSessionEntryForGatewayTarget({
		key: params.key,
		cfg,
		agentId: requestedAgent.agentId
	});
	const entry = target.entry;
	const sessionId = normalizeOptionalString(entry?.sessionId);
	if (!entry || !sessionId) {
		respondInvalidWorkerSession(params.respond, `session not found: ${params.key}`);
		return;
	}
	return {
		cfg,
		target,
		entry,
		sessionId,
		dispatchTarget: destination.value
	};
}
function resolveSessionWorkspace(params) {
	if (params.entry.repositoryWorkspaceId) {
		const repository = getSessionRepositoryWorkspaceStore().get(params.entry.repositoryWorkspaceId);
		if (repository && repository.agentId === params.agentId && repository.sessionKey === params.sessionKey && !params.entry.worktree) return {
			kind: "repository",
			repository
		};
		respondInvalidWorkerSession(params.respond, "The session repository workspace owner changed.");
		return;
	}
	const worktree = managedWorktrees.findLiveByOwner("session", params.sessionKey);
	if (params.entry.worktree?.id && worktree && worktree.id === params.entry.worktree.id && worktree.ownerId === params.sessionKey) return {
		kind: "local",
		path: worktree.path
	};
	const article = params.method === "sessions.dispatch" ? "a" : "the";
	respondInvalidWorkerSession(params.respond, `${params.method} requires ${article} session-owned worktree or repository workspace`);
}
async function validateDispatchExecutionMode(params) {
	if (params.target.deviceId !== void 0) {
		const eligibility = await resolveDevicePlacementEligibility({
			environmentService: params.context.workerEnvironmentService,
			deviceId: params.target.deviceId,
			runtimeId: params.sessionRuntime,
			executionMode: params.executionMode,
			requirement: params.devicePlacement,
			config: params.context.getRuntimeConfig(),
			currentNode: params.context.nodeRegistry?.get?.(params.target.deviceId)
		});
		if (eligibility.ok) return true;
		respondInvalidWorkerSession(params.respond, eligibility.error);
		return false;
	}
	if (params.context.workerEnvironmentService?.supportsExecutionMode(params.target.profileId, params.executionMode)) return true;
	respondInvalidWorkerSession(params.respond, `runtime ${params.sessionRuntime} requires a cloud worker provider that supports ${params.executionMode}; choose a compatible provider, or select an agent/model route with agentRuntime.id "openclaw"`);
	return false;
}
function respondWorkerPlacement(params) {
	params.respond(true, {
		ok: true,
		key: params.key,
		sessionId: params.sessionId,
		placement: projectWorkerSessionPlacement(params.placement, params.context.workerPlacementDiskSpaceReader?.read(params.placement), params.context.workerPlacementRunnerAvailabilityReader?.read(params.placement), readWorkerPlacementIdentity(params.placement, params.context.workerEnvironmentService))
	}, void 0);
}
function respondWorkerMove(params) {
	params.respond(true, {
		ok: true,
		key: params.key,
		sessionId: params.sessionId,
		placement: {
			state: params.placement.state,
			generation: params.placement.generation
		}
	}, void 0);
}
function respondWorkerDispatchError(error, respond) {
	if (error instanceof SessionMutationAuthorizationChangedError) throw error;
	respond(false, void 0, errorShape(isWorkerDispatchInputError(error) ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
}
const sessionDispatchHandlers = {
	"sessions.dispatch": async ({ params, respond, context, client, signal, sessionMutationAuthorization }) => {
		if (params.autoDevice === true && (params.profileId !== void 0 || params.deviceId !== void 0)) {
			respondInvalidWorkerSession(respond, "choose exactly one dispatch target: autoDevice, deviceId, or profileId");
			return;
		}
		if (!assertValidParams(params, validateSessionsDispatchParams, "sessions.dispatch", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const dispatchService = context.workerPlacementDispatchService;
		const placementReader = context.workerSessionPlacementService;
		if (!dispatchService || !placementReader) {
			respondInvalidWorkerSession(respond, "cloud worker dispatch is not configured");
			return;
		}
		const resolved = resolveWorkerSessionTarget({
			key,
			agentId: params.agentId,
			profileId: params.profileId,
			deviceId: params.deviceId,
			machineClass: params.machineClass,
			os: params.os,
			context,
			respond
		});
		if (!resolved) return;
		const { cfg, target, entry, sessionId } = resolved;
		let { dispatchTarget } = resolved;
		const autoDevice = params.autoDevice === true;
		const canUseProjectProfile = !autoDevice && params.profileId === void 0 && params.deviceId === void 0;
		if (!dispatchTarget && !canUseProjectProfile && !autoDevice) {
			respondInvalidWorkerSession(respond, "worker dispatch target is missing");
			return;
		}
		if (entry.archivedAt !== void 0) {
			respondInvalidWorkerSession(respond, "cannot dispatch an archived session");
			return;
		}
		const sessionRuntime = resolveWorkerPlacementSessionRuntime({
			cfg,
			entry,
			agentId: target.target.agentId,
			sessionKey: target.canonicalKey
		});
		const { executionMode, devicePlacement } = resolveWorkerPlacementCapabilities(sessionRuntime);
		if (!executionMode) {
			respondInvalidWorkerSession(respond, `runtime ${sessionRuntime} lacks cloud placement support`);
			return;
		}
		let automaticDeviceIds = [];
		if (autoDevice) {
			const selection = await selectDevicePlacementCandidates({
				environments: await listGatewayEnvironments(context),
				nodeRegistry: context.nodeRegistry,
				environmentService: context.workerEnvironmentService,
				requirement: devicePlacement,
				runtimeId: sessionRuntime,
				executionMode,
				config: cfg,
				getPendingDispatchCount: (deviceId) => dispatchService.getPendingDeviceDispatchCount?.(deviceId, sessionId) ?? 0,
				getAdmittedSessionCounts: () => dispatchService.getAdmittedDeviceSessionCounts?.(sessionId)
			});
			if (!selection.ok) {
				respondInvalidWorkerSession(respond, selection.error);
				return;
			}
			automaticDeviceIds = selection.candidates.slice(0, MAX_AUTO_DEVICE_PLACEMENT_ATTEMPTS).map(({ deviceId }) => deviceId);
			const destination = resolveWorkerPlacementDestination({
				cfg,
				deviceId: automaticDeviceIds[0]
			});
			if (!destination.ok || !destination.value) {
				respondInvalidWorkerSession(respond, destination.ok ? "automatic device placement did not select a node" : destination.error);
				return;
			}
			dispatchTarget = destination.value;
		}
		if (!autoDevice && dispatchTarget && !await validateDispatchExecutionMode({
			context,
			executionMode,
			sessionRuntime,
			devicePlacement,
			target: dispatchTarget,
			respond
		})) return;
		const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
		if (existingPlacement?.state === "failed" && !isFailedWorkerPlacementEnvironmentGone({
			environmentService: context.workerEnvironmentService,
			placement: existingPlacement
		})) {
			let providerId;
			try {
				providerId = readWorkerPlacementIdentity(existingPlacement, context.workerEnvironmentService)?.providerId;
			} catch {}
			respondInvalidWorkerSession(respond, providerId === "device" ? "device worker placement must be abandoned before redispatch; use Continue on Gateway" : "cloud worker environment must be stopped before redispatch; use Stop cloud worker");
			return;
		}
		if (existingPlacement && (existingPlacement.state === "active" || existingPlacement.state === "draining" || existingPlacement.state === "reconciling")) {
			respondInvalidWorkerSession(respond, `session cannot dispatch from placement ${existingPlacement.state}`);
			return;
		}
		const workspace = resolveSessionWorkspace({
			entry,
			sessionKey: target.canonicalKey,
			agentId: target.target.agentId,
			method: "sessions.dispatch",
			respond
		});
		if (!workspace) return;
		if (!dispatchTarget && canUseProjectProfile) try {
			dispatchTarget = await resolveProjectProfileDestination({
				cfg,
				workspace
			});
		} catch (error) {
			respondWorkerDispatchError(error, respond);
			return;
		}
		if (!dispatchTarget) {
			respondInvalidWorkerSession(respond, "worker dispatch target is missing");
			return;
		}
		if (canUseProjectProfile && !await validateDispatchExecutionMode({
			context,
			executionMode,
			sessionRuntime,
			devicePlacement,
			target: dispatchTarget,
			respond
		})) return;
		let lastEligibilityError;
		const candidates = autoDevice ? automaticDeviceIds : [dispatchTarget.deviceId];
		for (let attempt = 0; attempt < candidates.length; attempt += 1) {
			if (attempt > 0) {
				const destination = resolveWorkerPlacementDestination({
					cfg,
					deviceId: candidates[attempt]
				});
				if (!destination.ok || !destination.value) {
					respondInvalidWorkerSession(respond, destination.ok ? "automatic device placement did not select a node" : destination.error);
					return;
				}
				dispatchTarget = destination.value;
			}
			if (autoDevice) {
				const eligibility = await resolveDevicePlacementEligibility({
					environmentService: context.workerEnvironmentService,
					deviceId: candidates[attempt],
					runtimeId: sessionRuntime,
					executionMode,
					requirement: devicePlacement,
					config: cfg,
					currentNode: context.nodeRegistry.get(candidates[attempt])
				});
				if (!eligibility.ok) {
					lastEligibilityError = eligibility.error;
					continue;
				}
				if (devicePlacement?.consumesWorkerSlot && eligibility.availableSlots <= (dispatchService.getPendingDeviceDispatchCount?.(candidates[attempt], sessionId) ?? 0)) {
					lastEligibilityError = deviceUnavailableText(candidates[attempt], {
						available: false,
						unavailableReason: "at-capacity"
					});
					continue;
				}
			}
			let attemptedPlacement;
			try {
				const placement = await dispatchService.dispatch({
					sessionId,
					sessionKey: target.canonicalKey,
					agentId: target.target.agentId,
					executionMode,
					runSetupScript: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
					...dispatchTarget,
					...devicePlacement ? { devicePlacement } : {}
				}, (observed) => {
					attemptedPlacement = { ...observed };
					emitSessionsChanged(context, {
						reason: "dispatch",
						sessionKey: target.canonicalKey
					});
				}, sessionMutationAuthorization?.assertCurrent, signal);
				respondWorkerPlacement({
					respond,
					key: target.canonicalKey,
					sessionId,
					context,
					placement
				});
				return;
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				if (!autoDevice || !dispatchTarget.deviceId) {
					respondWorkerDispatchError(error, respond);
					return;
				}
				const failedPlacement = placementReader.getMany([sessionId]).get(sessionId);
				if (!canRetryDeviceDispatch({
					error,
					deviceId: dispatchTarget.deviceId,
					sessionId,
					sessionKey: target.canonicalKey,
					agentId: target.target.agentId,
					attempted: attemptedPlacement,
					current: failedPlacement,
					environments: context.workerEnvironmentService
				})) {
					respondWorkerDispatchError(error, respond);
					return;
				}
				lastEligibilityError = formatErrorMessage(error);
			}
		}
		respondWorkerDispatchError(/* @__PURE__ */ new Error(`automatic device placement failed after ${candidates.length} attempts; ${lastEligibilityError ?? "no eligible host remains; reconnect a paired session-host node and retry"}`), respond);
	},
	"sessions.move": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsMoveParams, "sessions.move", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const placementService = context.workerPlacementDispatchService;
		const placementReader = context.workerSessionPlacementService;
		if (!placementService?.move || !placementReader) {
			respondInvalidWorkerSession(respond, "session placement move is not configured");
			return;
		}
		const resolved = resolveWorkerSessionTarget({
			key,
			agentId: params.agentId,
			context,
			respond
		});
		if (!resolved) return;
		const { target, entry, sessionId } = resolved;
		if (entry.archivedAt !== void 0) {
			respondInvalidWorkerSession(respond, "cannot move an archived session");
			return;
		}
		const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
		const retryAbandonment = "abandonSource" in params && isForceAbandonedWorkerPlacement(existingPlacement);
		if (existingPlacement?.state !== "active" && existingPlacement?.state !== "draining" && !retryAbandonment) {
			respondInvalidWorkerSession(respond, `session cannot move from placement ${existingPlacement?.state ?? "local"}`);
			return;
		}
		if (!resolveSessionWorkspace({
			entry,
			sessionKey: target.canonicalKey,
			agentId: target.target.agentId,
			method: "sessions.move",
			respond
		})) return;
		try {
			const placement = await placementService.move({
				sessionId,
				sessionKey: target.canonicalKey,
				agentId: target.target.agentId,
				source: params.expected,
				target: params.target,
				..."abandonSource" in params ? { abandonSource: true } : {}
			}, () => emitSessionsChanged(context, {
				reason: "move",
				sessionKey: target.canonicalKey
			}), sessionMutationAuthorization?.assertCurrent);
			respondWorkerMove({
				respond,
				key: target.canonicalKey,
				sessionId,
				placement
			});
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			try {
				emitSessionsChanged(context, {
					reason: "move",
					sessionKey: target.canonicalKey
				});
			} catch {}
			respondWorkerDispatchError(error, respond);
		}
	},
	"sessions.reclaim": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsReclaimParams, "sessions.reclaim", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const placementService = context.workerPlacementDispatchService;
		const placementReader = context.workerSessionPlacementService;
		if (!placementService?.reclaim || !placementReader) {
			respondInvalidWorkerSession(respond, "cloud worker stop is not configured");
			return;
		}
		const resolved = resolveWorkerSessionTarget({
			key,
			agentId: params.agentId,
			context,
			respond
		});
		if (!resolved) return;
		const { target, entry, sessionId } = resolved;
		const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
		const reportPlacementChange = (placement) => {
			if (!placement || existingPlacement && placement.state === existingPlacement.state && placement.generation === existingPlacement.generation && placement.updatedAtMs === existingPlacement.updatedAtMs) return;
			try {
				emitSessionsChanged(context, {
					reason: "reclaim",
					sessionKey: target.canonicalKey
				});
			} catch {}
		};
		if (existingPlacement?.state !== "failed" && !resolveSessionWorkspace({
			entry,
			sessionKey: target.canonicalKey,
			agentId: target.target.agentId,
			method: "sessions.reclaim",
			respond
		})) return;
		let placement;
		try {
			placement = await placementService.reclaim({
				sessionId,
				sessionKey: target.canonicalKey,
				agentId: target.target.agentId,
				...params.recoverToGateway ? { recoverToGateway: params.recoverToGateway } : {}
			}, sessionMutationAuthorization?.assertCurrent);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			reportPlacementChange(placementReader.getMany([sessionId]).get(sessionId));
			respondWorkerDispatchError(error, respond);
			return;
		}
		reportPlacementChange(placement);
		respondWorkerPlacement({
			respond,
			key: target.canonicalKey,
			sessionId,
			context,
			placement
		});
	}
};
//#endregion
export { sessionDispatchHandlers as t };
