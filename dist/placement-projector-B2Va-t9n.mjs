import "./device-provider-identity-v6nXqNq_.mjs";
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
		...machine && Object.keys(machine).length ? { machine } : {}
	};
}
function createWorkerPlacementRunnerAvailabilityReader(params) {
	let version = 0;
	const read = (record, preparedEnvironment) => {
		if (record.state !== "active") return;
		const environment = preparedEnvironment === void 0 ? params.environments.get(record.environmentId) : preparedEnvironment;
		if (environment?.providerId !== "device" || environment.state !== "attached" || environment.ownerEpoch !== record.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== record.sessionId || !environment.nodeDeviceId) return;
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
		...intent.lastError ? { error: intent.lastError } : {}
	};
}
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record, diskSpace, runner, identity, failedRecoveryAction, workspaceResultReconciling = false, retryOnSend = false, options = {}) {
	const timing = {
		generation: record.generation,
		createdAtMs: record.createdAtMs,
		updatedAtMs: record.updatedAtMs,
		stateChangedAtMs: record.stateChangedAtMs
	};
	const conflict = record.workspaceResultConflict ? { workspaceResultConflict: record.workspaceResultConflict } : {};
	const terminal = {
		...record.terminalReason ? { terminalReason: record.terminalReason } : {},
		...record.terminalAtMs !== null ? { terminalAtMs: record.terminalAtMs } : {}
	};
	switch (record.state) {
		case "local":
		case "requested": return {
			state: record.state,
			...timing
		};
		case "provisioning": return {
			state: "provisioning",
			...timing,
			...identity,
			...record.environmentId ? { environmentId: record.environmentId } : {},
			...options.workerRuntimeInstall ? { workerRuntimeInstall: options.workerRuntimeInstall } : {}
		};
		case "syncing": return {
			state: "syncing",
			...timing,
			...identity,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash
		};
		case "starting": return {
			state: "starting",
			...timing,
			...identity,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir
		};
		case "active":
		case "draining":
		case "reconciling": return {
			state: record.state,
			...timing,
			...identity,
			environmentId: record.environmentId,
			activeOwnerEpoch: record.activeOwnerEpoch,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir,
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...record.state === "active" && diskSpace ? { diskSpace } : {},
			...record.state === "active" && runner ? { runner } : {},
			...record.state === "active" && options.workerRuntimeInstall ? { workerRuntimeInstall: options.workerRuntimeInstall } : {},
			...workspaceResultReconciling && record.state !== "reconciling" ? { workspaceResultReconciling: true } : {},
			...conflict
		};
		case "reclaimed":
		case "failed": {
			const retained = {
				...timing,
				...identity,
				...record.environmentId ? { environmentId: record.environmentId } : {},
				...record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {},
				...record.workspaceBaseManifestRef ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef } : {},
				...record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {},
				...record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {},
				...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
				...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
				...conflict
			};
			return record.state === "failed" ? {
				state: "failed",
				...retained,
				recoveryError: record.recoveryError,
				...failedRecoveryAction ? { recoveryAction: failedRecoveryAction } : {},
				...retryOnSend ? { retryOnSend: true } : {},
				...terminal
			} : {
				state: "reclaimed",
				...retained,
				...terminal
			};
		}
	}
	return record;
}
//#endregion
export { readWorkerPlacementIdentity as a, projectWorkerSessionPlacement as i, createWorkerPlacementRuntimeInstallReader as n, projectWorkerPlacementMove as r, createWorkerPlacementRunnerAvailabilityReader as t };
