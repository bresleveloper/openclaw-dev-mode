import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import path from "node:path";
//#region src/state/local-onboarding-state.ts
function stateKey(configPath) {
	return `onboarding.local.${sha256Hex(path.resolve(configPath))}`;
}
function normalizeState(value, configPath) {
	if (!isRecord(value) || value.version !== 1 || value.status !== "pending" && value.status !== "completed" || typeof value.runId !== "string" || !value.runId || value.configPath !== path.resolve(configPath) || typeof value.workspace !== "string" || !value.workspace || typeof value.securityAcknowledgedAt !== "string" || !value.securityAcknowledgedAt.trim() || typeof value.startedAtMs !== "number" || !Number.isFinite(value.startedAtMs) || value.status === "completed" && (typeof value.completedAtMs !== "number" || !Number.isFinite(value.completedAtMs))) return;
	const coordinator = typeof value.teamCoordinatorId === "string" ? normalizeAgentIdStrict(value.teamCoordinatorId) : void 0;
	if (value.teamCoordinatorId !== void 0 && !coordinator?.ok) return;
	return {
		...value,
		...coordinator?.ok ? { teamCoordinatorId: coordinator.value } : {}
	};
}
function readLocalOnboardingState(configPath, database = {}) {
	return normalizeState(readConfigMachineState(stateKey(configPath), database), configPath);
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
	return updateConfigMachineState(stateKey(params.configPath), (value) => {
		const current = normalizeState(value, params.configPath);
		if (current && (!params.replace || current.runId !== params.expectedRunId)) return current;
		return pending;
	}, params.database);
}
/** Complete only the owning run; a stale operation cannot close its replacement. */
function completeLocalOnboarding(params) {
	const current = readLocalOnboardingState(params.configPath, params.database);
	if (current?.runId !== params.runId) return false;
	if (current.status === "completed") return true;
	let completed = false;
	updateConfigMachineState(stateKey(params.configPath), (value) => {
		const latest = normalizeState(value, params.configPath);
		if (!latest) throw new Error("Local onboarding state became invalid before completion.");
		if (latest.runId !== params.runId) return latest;
		completed = true;
		return latest.status === "completed" ? latest : {
			...latest,
			status: "completed",
			completedAtMs: params.nowMs ?? Date.now()
		};
	}, params.database);
	return completed;
}
//#endregion
export { readLocalOnboardingStateForConfig as i, completeLocalOnboarding as n, readLocalOnboardingState as r, beginLocalOnboarding as t };
