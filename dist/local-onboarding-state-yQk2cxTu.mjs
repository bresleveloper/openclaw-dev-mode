import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { t as readConfigMachineStateAsync } from "./config-machine-state-async-Ck1ARyFy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import { n as normalizeLocalOnboardingState, t as localOnboardingStateKey } from "./local-onboarding-state-shared-B_n9M7A7.mjs";
import path from "node:path";
//#region src/state/local-onboarding-state.ts
/** Synchronous CLI onboarding inspection; runtime recovery uses the async reader below. */
function readLocalOnboardingState(configPath, database = {}) {
	return normalizeLocalOnboardingState(readConfigMachineState(localOnboardingStateKey(configPath), database), configPath);
}
/** A replaced config at the same path must never inherit another installation's receipt. */
function readLocalOnboardingStateForConfig(configPath, config, database = {}) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt?.trim();
	if (!securityAcknowledgedAt) return;
	const state = readLocalOnboardingState(configPath, database);
	return state?.securityAcknowledgedAt === securityAcknowledgedAt ? state : void 0;
}
/** Claim approved setup before provisioning; failed provider probes do not claim a run. */
function beginLocalOnboarding(params) {
	const securityAcknowledgedAt = params.securityAcknowledgedAt.trim();
	if (!securityAcknowledgedAt) throw new Error("Local onboarding requires its persisted security acknowledgement.");
	const coordinator = params.teamCoordinatorId === void 0 ? void 0 : normalizeAgentIdStrict(params.teamCoordinatorId);
	if (coordinator && !coordinator.ok) throw new Error("Local onboarding requires a valid team coordinator id.");
	const pending = {
		version: 1,
		status: "pending",
		runId: params.runId,
		configPath: path.resolve(params.configPath),
		workspace: path.resolve(params.workspace),
		...coordinator?.ok ? { teamCoordinatorId: coordinator.value } : {},
		securityAcknowledgedAt,
		startedAtMs: params.nowMs ?? Date.now()
	};
	return updateConfigMachineState(localOnboardingStateKey(params.configPath), (value) => {
		const current = normalizeLocalOnboardingState(value, params.configPath);
		if (current && (!params.replace || current.runId !== params.expectedRunId)) return current;
		return pending;
	}, params.database);
}
/** Read onboarding through the shared-state worker for runtime recovery. */
async function readLocalOnboardingStateForConfigAsync(configPath, config, database = {}) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt?.trim();
	if (!securityAcknowledgedAt) return;
	const state = normalizeLocalOnboardingState(await readConfigMachineStateAsync(localOnboardingStateKey(configPath), database), configPath);
	return state?.securityAcknowledgedAt === securityAcknowledgedAt ? state : void 0;
}
/** Complete only the owning run in the worker's serialized write transaction. */
async function completeLocalOnboarding(params) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const { database: _database, ...input } = params;
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "localOnboarding.complete",
		input
	}), { existingOnly: true }) ?? false;
}
//#endregion
export { readLocalOnboardingStateForConfigAsync as a, readLocalOnboardingStateForConfig as i, completeLocalOnboarding as n, readLocalOnboardingState as r, beginLocalOnboarding as t };
