import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { Ng as errorShape, ka as validateSessionsReclaimParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { n as validateSessionsMoveParams, t as validateSessionsDispatchParams } from "./session-placement-validators-BtlMHDJe.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as resolveWorkerPlacementCapabilities } from "./placement-capabilities-B7Dg_n0B.mjs";
import { s as resolveWorkerPlacementSessionRuntimeAsync } from "./placement-session-runtime-CaRixRbi.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { i as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-BGdJpPtJ.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { a as assertRequiredWorkerSelection } from "./required-worker-profile-B0DIhkdC.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { n as resolveWorkerPlacementDestination, t as resolveProjectProfileDestination } from "./placement-destination-r3SrB0gE.mjs";
import { a as isForceAbandonedWorkerPlacement } from "./placement-record-CBaaHws5.mjs";
import { i as loadWorkerPlacementSessionRuntimeModule, o as resolveWorkerPlacementSessionTarget } from "./server-worker-placement-session-target-CLJyKcFG.mjs";
import { a as readWorkerPlacementIdentity, i as projectWorkerSessionPlacement } from "./placement-projector-DKN6sMLO.mjs";
import { a as requireSessionKey, r as isWorkerDispatchInputError } from "./sessions-shared-DECO-QN2.mjs";
import { i as deviceUnavailableText } from "./device-provider-3Bp59FhL.mjs";
import { n as listGatewayEnvironments } from "./environments-CmC7xoUX.mjs";
import { s as resolveDevicePlacementEligibility, t as canRetryDeviceDispatch } from "./placement-dispatch-failure-CV1534pY.mjs";
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
			availableSlots: eligibility.ok ? Math.max(0, eligibility.availableSlots - (params.getPendingDispatchCount?.(deviceId) ?? 0)) : 0,
			eligibility
		};
	}));
	const admittedSessions = requirement.consumesWorkerSlot ? await params.getAdmittedSessionCounts?.() : void 0;
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
	const failed = attempts.find(({ eligibility }) => !eligibility.ok);
	if (failed && !failed.eligibility.ok) return {
		ok: false,
		error: failed.eligibility.error
	};
	return {
		ok: false,
		error: `all paired session-host nodes are at capacity; ${deviceUnavailableText(attempts[0].deviceId, {
			available: false,
			unavailableReason: "at-capacity"
		})}`
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-dispatch.ts
function respondInvalidWorkerSession(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
const MAX_AUTO_DEVICE_PLACEMENT_ATTEMPTS = 3;
async function withWorkerPlacementAuthorization(authorization, operation) {
	const assertCurrent = authorization?.assertCurrent;
	const prepared = await authorization?.prepareWorkerGrant?.();
	try {
		return await operation(prepared ? Object.assign(() => prepared.assertCurrent(), {
			assertWorkerGrant: prepared.assertCurrent,
			assertWorkerLifetime: prepared.assertLifetimeCurrent
		}) : assertCurrent);
	} finally {
		await prepared?.release();
	}
}
async function withWorkerSessionTarget(method, params, context, respond, consume) {
	const key = requireSessionKey(params.key, respond);
	if (!key) return;
	const service = context.workerPlacementDispatchService;
	const reader = context.workerSessionPlacementService;
	if (!service || !reader || method !== "dispatch" && !service[method]) {
		const operation = {
			dispatch: "cloud worker dispatch",
			move: "session placement move",
			reclaim: "cloud worker stop"
		}[method];
		respondInvalidWorkerSession(respond, `${operation} is not configured`);
		return;
	}
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const destination = method === "dispatch" ? resolveWorkerPlacementDestination({
		cfg,
		profileId: params.profileId,
		deviceId: params.deviceId,
		machineClass: params.machineClass,
		os: params.os
	}) : {
		ok: true,
		value: void 0
	};
	if (!destination.ok) {
		respondInvalidWorkerSession(respond, destination.error);
		return;
	}
	return withGatewaySessionEntryReadOnly({
		key,
		cfg,
		agentId: requestedAgent.agentId,
		excludeInternalEffects: true
	}, async (target) => {
		const entry = target.entry;
		const sessionId = normalizeOptionalString(entry?.sessionId);
		if (!entry || !sessionId) {
			respondInvalidWorkerSession(respond, `session not found: ${key}`);
			return;
		}
		await consume({
			cfg,
			entry,
			session: {
				sessionId,
				sessionKey: target.canonicalKey,
				agentId: target.agentId
			},
			dispatchTarget: destination.value,
			service,
			reader
		});
	});
}
async function resolveSessionWorkspace(params) {
	const article = params.method === "sessions.dispatch" ? "a" : "the";
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const resolved = _usingCtx$1.u(await resolveWorkerPlacementSessionTarget({
				sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
				config: params.config,
				sessionId: params.entry.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedEntry: params.entry,
				errorMessage: `${params.method} requires ${article} session-owned worktree, repository workspace, or device folder`
			}));
			params.assertCurrent?.();
			return resolved.workspace;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		respondInvalidWorkerSession(params.respond, formatErrorMessage(error));
		return;
	}
}
function respondWorkerPlacement(params) {
	params.respond(true, {
		ok: true,
		key: params.key,
		sessionId: params.sessionId,
		placement: projectWorkerSessionPlacement(params.placement, params.context.workerPlacementDiskSpaceReader?.read(params.placement), params.context.workerPlacementRunnerAvailabilityReader?.read(params.placement), readWorkerPlacementIdentity(params.placement, params.context.workerEnvironmentService))
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
		try {
			assertRequiredWorkerSelection(context.getRuntimeConfig(), params);
		} catch (error) {
			respondWorkerDispatchError(error, respond);
			return;
		}
		return withWorkerSessionTarget("dispatch", params, context, respond, async (resolved) => {
			const { cfg, entry, session, service: dispatchService } = resolved;
			const { sessionId, sessionKey, agentId } = session;
			let { dispatchTarget } = resolved;
			if (entry.deviceFolder && (params.autoDevice === true || params.profileId !== void 0 || params.deviceId !== entry.deviceFolder.deviceId)) {
				respondInvalidWorkerSession(respond, `This session uses a folder on device ${entry.deviceFolder.deviceId}; dispatch explicitly to that device. Auto and cloud profiles are unavailable.`);
				return;
			}
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
			const sessionRuntime = await resolveWorkerPlacementSessionRuntimeAsync({
				cfg,
				entry,
				agentId,
				sessionKey,
				assertCurrent: sessionMutationAuthorization?.assertCurrent
			});
			const { executionMode, devicePlacement } = resolveWorkerPlacementCapabilities(sessionRuntime);
			if (entry.deviceFolder && executionMode !== "worker-turn") {
				respondInvalidWorkerSession(respond, "Existing device folders currently require the OpenClaw harness; choose an OpenClaw model instead of remote execution.");
				return;
			}
			if (!executionMode) {
				respondInvalidWorkerSession(respond, `runtime ${sessionRuntime} lacks cloud placement support`);
				return;
			}
			const validateExecutionMode = async (target) => {
				if (target.deviceId !== void 0) {
					const eligibility = await resolveDevicePlacementEligibility({
						environmentService: context.workerEnvironmentService,
						deviceId: target.deviceId,
						runtimeId: sessionRuntime,
						executionMode,
						requirement: devicePlacement,
						config: context.getRuntimeConfig(),
						currentNode: context.nodeRegistry?.get?.(target.deviceId)
					});
					if (eligibility.ok) return true;
					respondInvalidWorkerSession(respond, eligibility.error);
					return false;
				}
				if (context.workerEnvironmentService?.supportsExecutionMode(target.profileId, executionMode)) return true;
				respondInvalidWorkerSession(respond, `runtime ${sessionRuntime} requires a cloud worker provider that supports ${executionMode}; choose a compatible provider, or select an agent/model route with agentRuntime.id "openclaw"`);
				return false;
			};
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
					getAdmittedSessionCounts: () => dispatchService.getAdmittedDeviceSessionCountsAsync ? dispatchService.getAdmittedDeviceSessionCountsAsync(sessionId) : dispatchService.getAdmittedDeviceSessionCounts?.(sessionId)
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
			if (!autoDevice && dispatchTarget && !await validateExecutionMode(dispatchTarget)) return;
			const existingPlacement = await readSessionWorkerPlacementAsync({
				context,
				sessionId
			});
			sessionMutationAuthorization?.assertCurrent();
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
			const workspace = await resolveSessionWorkspace({
				config: context.getRuntimeConfig(),
				entry,
				...session,
				method: "sessions.dispatch",
				respond,
				assertCurrent: sessionMutationAuthorization?.assertCurrent
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
			if (canUseProjectProfile && !await validateExecutionMode(dispatchTarget)) return;
			const initialDispatchTarget = dispatchTarget;
			try {
				const result = await withWorkerPlacementAuthorization(sessionMutationAuthorization, async (authorize) => {
					let candidateTarget = initialDispatchTarget;
					let lastEligibilityError;
					const candidates = autoDevice ? automaticDeviceIds : [candidateTarget.deviceId];
					for (let attempt = 0; attempt < candidates.length; attempt += 1) {
						if (attempt > 0) {
							const destination = resolveWorkerPlacementDestination({
								cfg,
								deviceId: candidates[attempt]
							});
							if (!destination.ok || !destination.value) return { invalid: destination.ok ? "automatic device placement did not select a node" : destination.error };
							candidateTarget = destination.value;
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
							const request = {
								...session,
								executionMode,
								runSetupScript: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
								...candidateTarget,
								...devicePlacement ? { devicePlacement } : {}
							};
							return { placement: await dispatchService.dispatch(request, (observed) => {
								attemptedPlacement = { ...observed };
								emitSessionsChanged(context, {
									reason: "dispatch",
									sessionKey
								});
							}, authorize, signal) };
						} catch (error) {
							if (error instanceof SessionMutationAuthorizationChangedError) throw error;
							if (!autoDevice || !candidateTarget.deviceId || !canRetryDeviceDispatch({
								error,
								deviceId: candidateTarget.deviceId,
								...session,
								attempted: attemptedPlacement,
								current: await readSessionWorkerPlacementAsync({
									context,
									sessionId
								}),
								environments: context.workerEnvironmentService
							})) throw error;
							lastEligibilityError = formatErrorMessage(error);
						}
					}
					throw new Error(`automatic device placement failed after ${candidates.length} attempts; ${lastEligibilityError ?? "no eligible host remains; reconnect a paired session-host node and retry"}`);
				});
				if ("invalid" in result) respondInvalidWorkerSession(respond, result.invalid);
				else respondWorkerPlacement({
					respond,
					key: sessionKey,
					sessionId,
					context,
					placement: result.placement
				});
			} catch (error) {
				respondWorkerDispatchError(error, respond);
			}
		});
	},
	"sessions.move": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsMoveParams, "sessions.move", respond)) return;
		return withWorkerSessionTarget("move", params, context, respond, async (resolved) => {
			const { entry, session, service: placementService } = resolved;
			const { sessionId, sessionKey } = session;
			if (entry.deviceFolder) {
				respondInvalidWorkerSession(respond, "This folder lives only on its paired device and cannot move or Continue on Gateway. Reconnect that device, or create a new session in another workspace.");
				return;
			}
			if (entry.archivedAt !== void 0) {
				respondInvalidWorkerSession(respond, "cannot move an archived session");
				return;
			}
			const existingPlacement = await readSessionWorkerPlacementAsync({
				context,
				sessionId
			});
			sessionMutationAuthorization?.assertCurrent();
			const retryAbandonment = "abandonSource" in params && isForceAbandonedWorkerPlacement(existingPlacement);
			if (existingPlacement?.state !== "active" && existingPlacement?.state !== "draining" && !retryAbandonment) {
				respondInvalidWorkerSession(respond, `session cannot move from placement ${existingPlacement?.state ?? "local"}`);
				return;
			}
			if (!await resolveSessionWorkspace({
				config: context.getRuntimeConfig(),
				entry,
				...session,
				method: "sessions.move",
				respond,
				assertCurrent: sessionMutationAuthorization?.assertCurrent
			})) return;
			try {
				const placement = await withWorkerPlacementAuthorization(sessionMutationAuthorization, (authorize) => placementService.move({
					...session,
					source: params.expected,
					target: params.target,
					..."abandonSource" in params ? { abandonSource: true } : {}
				}, () => emitSessionsChanged(context, {
					reason: "move",
					sessionKey
				}), authorize));
				respond(true, {
					ok: true,
					key: sessionKey,
					sessionId,
					placement: {
						state: placement.state,
						generation: placement.generation
					}
				}, void 0);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				try {
					emitSessionsChanged(context, {
						reason: "move",
						sessionKey
					});
				} catch {}
				respondWorkerDispatchError(error, respond);
			}
		});
	},
	"sessions.reclaim": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsReclaimParams, "sessions.reclaim", respond)) return;
		return withWorkerSessionTarget("reclaim", params, context, respond, async (resolved) => {
			const { entry, session, service: placementService } = resolved;
			const { sessionId, sessionKey } = session;
			if (entry.deviceFolder && params.recoverToGateway) {
				respondInvalidWorkerSession(respond, "This folder lives only on its paired device. Reconnect it to continue; recovery to Gateway is unavailable.");
				return;
			}
			const existingPlacement = await readSessionWorkerPlacementAsync({
				context,
				sessionId
			});
			sessionMutationAuthorization?.assertCurrent();
			const reportPlacementChange = (placement) => {
				if (!placement || existingPlacement && placement.state === existingPlacement.state && placement.generation === existingPlacement.generation && placement.updatedAtMs === existingPlacement.updatedAtMs) return;
				try {
					emitSessionsChanged(context, {
						reason: "reclaim",
						sessionKey
					});
				} catch {}
			};
			if (existingPlacement?.state !== "failed" && !await resolveSessionWorkspace({
				config: context.getRuntimeConfig(),
				entry,
				...session,
				method: "sessions.reclaim",
				respond,
				assertCurrent: sessionMutationAuthorization?.assertCurrent
			})) return;
			let placement;
			try {
				placement = await placementService.reclaim({
					...session,
					...params.recoverToGateway ? { recoverToGateway: params.recoverToGateway } : {}
				}, sessionMutationAuthorization?.assertCurrent);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				reportPlacementChange(await readSessionWorkerPlacementAsync({
					context,
					sessionId
				}));
				respondWorkerDispatchError(error, respond);
				return;
			}
			reportPlacementChange(placement);
			respondWorkerPlacement({
				respond,
				key: sessionKey,
				sessionId,
				context,
				placement
			});
		});
	}
};
//#endregion
export { sessionDispatchHandlers as t };
