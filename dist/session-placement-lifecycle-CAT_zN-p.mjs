import { T as parseCronRunScopeSuffix } from "./session-key-CSDERtm3.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { i as isFailedWorkerPlacementEnvironmentGone, n as isCurrentActiveWorkerEnvironment, o as matchesWorkerPlacementTarget } from "./placement-target-BGdJpPtJ.mjs";
//#region src/gateway/worker-environments/session-placement-lifecycle.ts
var SessionWorkerPlacementMutationError = class extends Error {
	constructor(state, action, key) {
		super(`Session ${key} cannot ${action} while cloud worker placement is ${state}.`);
	}
};
var SessionWorkerPlacementStopError = class extends Error {
	constructor(state, action, key) {
		super(`Session ${key} cannot ${action} while cloud worker placement is ${state}. ${state === "failed" ? "Worker cleanup is still pending. Use Stop cloud worker to retry cleanup; if stopping fails, resolve the provider error before trying again." : "Wait for the cloud worker transition to finish before trying again."}`);
	}
};
function canRedispatchFailedWorkerPlacement(placement, environment) {
	return Boolean(placement.activeOwnerEpoch !== null && !placement.turnClaim && environment && environment.environmentId === placement.environmentId && (environment.providerId !== "device" || environment.nodeDeviceId) && isFailedWorkerPlacementEnvironmentGone({
		placement,
		environmentService: { get: () => environment }
	}));
}
function isWorkerPlacementSafeForMutation(context, placement) {
	if (placement.state === "failed") return isFailedWorkerPlacementEnvironmentGone({
		environmentService: context.workerEnvironmentService,
		placement
	});
	return placement.state === "local" || placement.state === "reclaimed";
}
function resolveWorkerPlacementArchiveRestoreError(params) {
	if (!params.placement || params.placement.state === "failed" && !params.placement.turnClaim || isWorkerPlacementSafeForMutation(params.context, params.placement)) return;
	return `Session ${params.key} cannot change archive state while cloud worker placement is ${params.placement.state}.`;
}
function resolveSessionWorkerPlacementMutationGuard(params, placement) {
	if (!placement) return { status: "allowed" };
	if (isWorkerPlacementSafeForMutation(params.context, placement)) {
		if (params.action === "reset") return {
			status: "retirement-required",
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		};
		if (placement.state === "local" || params.action === "fork") return { status: "allowed" };
	}
	return {
		status: "blocked",
		error: new SessionWorkerPlacementMutationError(placement.state, params.action, params.key)
	};
}
function selectPlacementRetirement(service) {
	if (service?.retireSessionPlacementAsync) return service.retireSessionPlacementAsync.bind(service);
	const legacyRetire = service?.retireSessionPlacement;
	return legacyRetire ? async (input, options) => {
		warnPluginSdkDeprecation({
			family: "worker-placement-sync-writers",
			method: "GatewayRequestContext.workerSessionPlacementService.retireSessionPlacement",
			replacement: "retireSessionPlacementAsync",
			compatibility: "Synchronous calls retain their return values and commit before returning."
		});
		options?.assertCurrent?.();
		legacyRetire.call(service, input);
	} : void 0;
}
async function retireSessionWorkerPlacementBeforeMutation(params) {
	const placement = await readSessionWorkerPlacementAsync(params);
	params.assertCurrent?.();
	const guard = resolveSessionWorkerPlacementMutationGuard(params, placement);
	if (guard.status !== "retirement-required") return guard.status === "blocked" ? guard.error : void 0;
	const retire = selectPlacementRetirement(params.context.workerSessionPlacementService);
	if (!retire) throw new Error("Worker session placement retirement service is unavailable");
	await retire(guard, { assertCurrent: params.assertCurrent });
	params.assertCurrent?.();
}
function resolveSessionWorkerPlacementMutationError(params) {
	const guard = resolveSessionWorkerPlacementMutationGuard(params, readSessionWorkerPlacement(params));
	return guard.status === "blocked" ? guard.error : void 0;
}
function readSessionWorkerPlacement(params) {
	return params.sessionId ? params.context.workerSessionPlacementService?.getMany([params.sessionId]).get(params.sessionId) : void 0;
}
async function readSessionWorkerPlacementAsync(params) {
	const service = params.context.workerSessionPlacementService;
	if (!params.sessionId || !service) return;
	return (service.getManyAsync ? await service.getManyAsync([params.sessionId]) : service.getMany([params.sessionId])).get(params.sessionId);
}
function samePlacementOwner(expected, current) {
	return current?.sessionId === expected?.sessionId && current?.sessionKey === expected?.sessionKey && current?.agentId === expected?.agentId && matchesWorkerPlacementTarget(current, expected) && current?.executionMode === expected?.executionMode;
}
/** Retain the exact stopped placement across fallible workspace or session mutations. */
function createSessionWorkerPlacementMutationCheck(params, expected, operation = "mutation") {
	const assertPlacement = (current) => {
		if (!samePlacementOwner(expected, current) || current?.turnClaim || current && !isWorkerPlacementSafeForMutation(params.context, current)) throw new Error(`Worker session placement ${params.sessionId} changed before ${operation}`);
	};
	assertPlacement(expected);
	return () => assertPlacement(readSessionWorkerPlacement(params));
}
function prepareSessionWorkerPlacementMutationCheck(params, operation = "mutation") {
	return createSessionWorkerPlacementMutationCheck(params, readSessionWorkerPlacement(params), operation);
}
async function prepareSessionWorkerPlacementMutationCheckAsync(params) {
	return createSessionWorkerPlacementMutationCheck(params, await readSessionWorkerPlacementAsync(params));
}
/** Archive visibility can change while a failed placement retains its physical cleanup. */
function createSessionWorkerPlacementArchiveCheck(params, expected) {
	if (expected?.state !== "failed") return {
		assertCurrent: createSessionWorkerPlacementMutationCheck(params, expected),
		cleanupPending: false
	};
	const assertPlacement = (current) => {
		if (!samePlacementOwner(expected, current) || current?.turnClaim) throw new Error(`Worker session placement ${params.sessionId} changed before archive`);
	};
	assertPlacement(expected);
	return {
		assertCurrent: () => assertPlacement(readSessionWorkerPlacement(params)),
		cleanupPending: !isFailedWorkerPlacementEnvironmentGone({
			environmentService: params.context.workerEnvironmentService,
			placement: expected
		})
	};
}
async function prepareSessionWorkerPlacementArchiveCheckAsync(params) {
	return createSessionWorkerPlacementArchiveCheck(params, await readSessionWorkerPlacementAsync(params));
}
/** Capture retirement without erasing cloud affinity before fallible session cleanup. */
async function prepareSessionWorkerPlacementRetirement(params) {
	const expected = await readSessionWorkerPlacementAsync(params);
	const assertCurrent = createSessionWorkerPlacementMutationCheck(params, expected, "retirement");
	const service = params.context.workerSessionPlacementService;
	const retire = selectPlacementRetirement(service);
	if (expected && !retire) throw new Error("Worker session placement retirement service is unavailable");
	return {
		assertCurrent,
		retire: async () => {
			if (!await readSessionWorkerPlacementAsync(params)) return;
			assertCurrent();
			if (expected && retire && isWorkerPlacementSafeForMutation(params.context, expected)) await retire({
				sessionId: expected.sessionId,
				expectedState: expected.state,
				expectedGeneration: expected.generation
			});
		}
	};
}
/** Validate before cancellation; the returned stop remains bound to this placement across drains. */
async function prepareSessionWorkerPlacementStop(params) {
	const { agentId, context, sessionId, sessionKey } = params;
	const expected = await readSessionWorkerPlacementAsync(params);
	const matches = (candidate) => candidate.sessionId === sessionId && [sessionKey, ...params.sessionKeys ?? []].some((key) => candidate.sessionKey === key || parseCronRunScopeSuffix(candidate.sessionKey).baseSessionKey === key) && candidate.agentId === agentId;
	if (expected && !matches(expected)) throw new Error(`Session ${sessionKey} cloud worker placement identity changed.`);
	if (expected && (expected.state === "reconciling" || params.action === "recover" && expected.state !== "active" && !isWorkerPlacementSafeForMutation(context, expected))) throw new SessionWorkerPlacementStopError(expected.state, params.action, sessionKey);
	const beforeDrain = (predecessor) => {
		params.authorize?.();
		const current = readSessionWorkerPlacement(params);
		if (!samePlacementOwner(expected && predecessor && predecessor.generation > expected.generation ? {
			...expected,
			...predecessor
		} : expected, current)) throw new Error(`Session ${sessionKey} cloud worker placement identity changed.`);
	};
	const stop = async () => {
		beforeDrain();
		if (!expected || params.action === "archive" && expected.state === "failed" || isWorkerPlacementSafeForMutation(context, expected) || !sessionId) return;
		if (!context.workerPlacementDispatchService?.reclaim) throw new Error(`Session ${sessionKey} cloud worker reclaim is unavailable.`);
		const reclaimed = await context.workerPlacementDispatchService.reclaim({
			agentId,
			sessionId,
			sessionKey: expected.sessionKey
		}, params.authorize, beforeDrain);
		params.authorize?.();
		const settled = readSessionWorkerPlacement(params);
		if (reclaimed.state !== "reclaimed" && reclaimed.state !== "local" || !matches(reclaimed) || !samePlacementOwner(reclaimed, settled)) throw new Error(`Session ${sessionKey} cloud worker reclaim identity changed.`);
	};
	return {
		stop,
		startBeforeDrain: expected?.state === "requested" || expected?.state === "provisioning" || expected?.state === "syncing" || expected?.state === "starting"
	};
}
/** Initial placement, readiness, and recovery consume the same recorded destination. */
async function ensureWorkerSessionPlacement(params) {
	const { request } = params;
	const prepared = await params.placements.prepareSessionPlacement(request.sessionId);
	let releaseRequestedHandoff;
	const release = () => {
		prepared.release();
		releaseRequestedHandoff?.();
	};
	try {
		const readPlacement = () => {
			params.signal?.throwIfAborted();
			params.assertCurrent();
			const placement = prepared.current();
			if (!placement || placement.state === "local") return placement;
			if (placement.agentId !== request.agentId || placement.sessionKey !== request.sessionKey || placement.executionMode !== request.executionMode) throw new Error("The existing placement conflicts with worker execution; repair its recorded owner before retrying.");
			return placement;
		};
		const read = () => {
			const placement = readPlacement();
			if (!placement || placement.state === "local") return placement;
			const environment = placement.environmentId ? params.environments.get(placement.environmentId) : void 0;
			if (!environment && placement.state === "failed" && placement.environmentId) throw new Error("The session's recorded worker profile is unavailable; repair its environment record before retrying. Its workspace will not be moved automatically.");
			if (environment && environment.profileId !== request.profileId) throw new Error("The session is bound to another worker profile; its workspace will not be moved automatically.");
			return placement;
		};
		const assertReady = () => {
			const placement = read();
			const environment = placement?.environmentId ? params.environments.get(placement.environmentId) : void 0;
			if (placement?.state !== "active" || !isCurrentActiveWorkerEnvironment(placement, environment)) throw new Error("Worker placement is not ready; inspect its setup error or Stop the failed worker before retrying.");
		};
		const canStartDispatch = (placement) => !placement || placement.state === "local" || placement.state === "failed" && placement.activeOwnerEpoch === null && isFailedWorkerPlacementEnvironmentGone({
			placement,
			environmentService: params.environments
		});
		const useRecorded = async () => {
			const pending = readPlacement();
			if (params.waitForReady !== false && pending && [
				"requested",
				"provisioning",
				"syncing",
				"starting"
			].includes(pending.state)) {
				await params.waitForInitialPlacement(pending, params.signal);
				assertReady();
				return true;
			}
			const placement = read();
			if (!placement || canStartDispatch(placement)) return false;
			if (placement.state === "reclaimed" || placement.state === "failed" && placement.activeOwnerEpoch !== null) {
				await params.redispatchPlacement(placement, {
					assertCurrent: params.assertCurrent,
					signal: params.signal
				});
				assertReady();
			} else if (params.waitForReady !== false) assertReady();
			return true;
		};
		const assertDestinationCurrent = () => {
			read();
		};
		if (await useRecorded()) return {
			assertCurrent: assertDestinationCurrent,
			release
		};
		await params.prepareWorkspace(() => {
			const placement = read();
			if (placement?.turnClaim) throw new Error("A local turn is still active; stop it before worker setup.");
			return canStartDispatch(placement);
		});
		if (await useRecorded()) return {
			assertCurrent: assertDestinationCurrent,
			release
		};
		const placement = read();
		const previousEnvironment = placement?.state === "failed" && placement.environmentId ? params.environments.get(placement.environmentId) : void 0;
		const dispatchRequest = {
			...request,
			...previousEnvironment ? { inheritedProfile: {
				providerId: previousEnvironment.providerId,
				profileSnapshot: previousEnvironment.profileSnapshot
			} } : {}
		};
		if (params.waitForReady === false) releaseRequestedHandoff = (await params.startDispatch(dispatchRequest, params.onTransition, params.authorizeDispatch, params.signal)).release;
		else await params.dispatch(dispatchRequest, params.onTransition, params.authorizeDispatch, params.signal);
		read();
		if (params.waitForReady !== false) assertReady();
		return {
			assertCurrent: assertDestinationCurrent,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { prepareSessionWorkerPlacementMutationCheck as a, prepareSessionWorkerPlacementStop as c, resolveWorkerPlacementArchiveRestoreError as d, retireSessionWorkerPlacementBeforeMutation as f, prepareSessionWorkerPlacementArchiveCheckAsync as i, readSessionWorkerPlacementAsync as l, canRedispatchFailedWorkerPlacement as n, prepareSessionWorkerPlacementMutationCheckAsync as o, ensureWorkerSessionPlacement as r, prepareSessionWorkerPlacementRetirement as s, SessionWorkerPlacementStopError as t, resolveSessionWorkerPlacementMutationError as u };
