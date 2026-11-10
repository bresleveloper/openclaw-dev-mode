import "./device-provider-identity-v6nXqNq_.mjs";
import { a as isWorkerEnvironmentAttachedTo } from "./placement-target-BGdJpPtJ.mjs";
//#region src/gateway/worker-environments/placement-projector.ts
function createWorkerPlacementRuntimeInstallReader(params) {
	return {
		read(record, preparedEnvironment) {
			if (record.state !== "provisioning" && record.state !== "active") return;
			const environment = preparedEnvironment === void 0 ? record.environmentId ? params.environments.get(record.environmentId) : void 0 : preparedEnvironment;
			const observation = record.state === "provisioning" ? record.environmentId ? params.installer.readInstallForEnvironment(record.environmentId) : void 0 : environment?.nodeDeviceId ? params.installer.readInstall(environment.nodeDeviceId) : void 0;
			if (!observation || observation.transferredBytes <= 0 || record.state === "active" && observation.bundleHash === record.workerBundleHash) return;
			const { phase, transferredBytes, totalBytes, startedAtMs, updatedAtMs } = observation;
			return {
				phase,
				transferredBytes,
				totalBytes,
				startedAtMs,
				updatedAtMs
			};
		},
		version: () => params.installer.version()
	};
}
function readWorkerPlacementIdentity(record, environments, preparedEnvironment) {
	const environment = preparedEnvironment === void 0 ? record.environmentId ? environments?.get(record.environmentId) : void 0 : preparedEnvironment;
	if (!environment) return;
	if (!(record.activeOwnerEpoch !== null ? environment.ownerEpoch === record.activeOwnerEpoch : record.state === "provisioning" || record.state === "syncing" || record.state === "starting")) return;
	const machine = environments?.readMachineShape(environment.environmentId, preparedEnvironment ?? void 0);
	return {
		providerId: environment.providerId,
		profileId: environment.profileId,
		...record.state === "active" && record.executionMode === "worker-turn" && environment.environmentId === record.environmentId && environment.state === "attached" && environment.providerId === "device" && environment.nodeDeviceId && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === record.sessionId && environment.inference === "worker" ? { inference: "worker" } : {},
		...machine && Object.keys(machine).length ? { machine } : {}
	};
}
function createWorkerPlacementRunnerAvailabilityReader(params) {
	let version = 0;
	const read = (record, preparedEnvironment) => {
		if (record.state !== "active") return;
		const environment = preparedEnvironment === void 0 ? params.environments.get(record.environmentId) : preparedEnvironment;
		if (environment?.providerId !== "device" || !isWorkerEnvironmentAttachedTo(environment, record) || !environment.nodeDeviceId) return;
		return {
			kind: "device",
			deviceId: environment.nodeDeviceId,
			status: params.hasCurrentDeviceRunner(environment.nodeDeviceId) ? "available" : "offline"
		};
	};
	return {
		read,
		markChanged: () => {
			version += 1;
		},
		version: () => version
	};
}
function projectWorkerPlacementMove(intent) {
	return {
		target: intent.target,
		updatedAtMs: intent.updatedAtMs,
		...intent.lastError ? {
			error: intent.lastError,
			retry: {
				expected: { ...intent.source },
				target: { ...intent.target },
				...intent.abandonSource ? { abandonSource: true } : {}
			}
		} : {}
	};
}
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record, diskSpace, runner, identity, failedRecoveryAction, workspaceResultReconciling = false, retryOnSend = false, options = {}) {
	const { inference, ...provenance } = identity ?? {};
	const timing = {
		generation: record.generation,
		createdAtMs: record.createdAtMs,
		updatedAtMs: record.updatedAtMs,
		stateChangedAtMs: record.stateChangedAtMs
	};
	if (record.state === "local" || record.state === "requested") return {
		state: record.state,
		...timing
	};
	const worker = {
		...timing,
		...provenance
	};
	const workerRuntimeInstall = options.workerRuntimeInstall ? { workerRuntimeInstall: options.workerRuntimeInstall } : {};
	if (record.state === "provisioning") return {
		state: record.state,
		...worker,
		...record.environmentId ? { environmentId: record.environmentId } : {},
		...workerRuntimeInstall,
		...options.startStatus ? { startStatus: options.startStatus } : {}
	};
	const progress = {
		...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
		...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {}
	};
	const conflict = record.workspaceResultConflict ? { workspaceResultConflict: record.workspaceResultConflict } : {};
	if (record.state === "reclaimed" || record.state === "failed") {
		const retained = {
			...worker,
			...record.environmentId ? { environmentId: record.environmentId } : {},
			...record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {},
			...record.workspaceBaseManifestRef ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef } : {},
			...record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {},
			...record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {},
			...progress,
			...conflict
		};
		const terminal = {
			...record.terminalReason ? { terminalReason: record.terminalReason } : {},
			...record.terminalAtMs !== null ? { terminalAtMs: record.terminalAtMs } : {}
		};
		return record.state === "failed" ? {
			state: record.state,
			...retained,
			recoveryError: record.recoveryError,
			...failedRecoveryAction ? { recoveryAction: failedRecoveryAction } : {},
			...retryOnSend ? { retryOnSend: true } : {},
			...terminal
		} : {
			state: record.state,
			...retained,
			...terminal
		};
	}
	const bundle = {
		...worker,
		environmentId: record.environmentId,
		workerBundleHash: record.workerBundleHash
	};
	if (record.state === "syncing") return {
		state: record.state,
		...bundle
	};
	const workspace = {
		...bundle,
		workspaceBaseManifestRef: record.workspaceBaseManifestRef,
		remoteWorkspaceDir: record.remoteWorkspaceDir
	};
	if (record.state === "starting") return {
		state: record.state,
		...workspace
	};
	return {
		state: record.state,
		...worker,
		environmentId: record.environmentId,
		activeOwnerEpoch: record.activeOwnerEpoch,
		workerBundleHash: record.workerBundleHash,
		workspaceBaseManifestRef: record.workspaceBaseManifestRef,
		remoteWorkspaceDir: record.remoteWorkspaceDir,
		...progress,
		...record.state === "active" && inference ? { inference } : {},
		...record.state === "active" && diskSpace ? { diskSpace } : {},
		...record.state === "active" && runner ? { runner } : {},
		...record.state === "active" ? workerRuntimeInstall : {},
		...workspaceResultReconciling && record.state !== "reconciling" ? { workspaceResultReconciling: true } : {},
		...conflict
	};
}
//#endregion
export { readWorkerPlacementIdentity as a, projectWorkerSessionPlacement as i, createWorkerPlacementRuntimeInstallReader as n, projectWorkerPlacementMove as r, createWorkerPlacementRunnerAvailabilityReader as t };
