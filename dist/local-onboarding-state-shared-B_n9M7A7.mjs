import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import path from "node:path";
//#region src/state/local-onboarding-state-shared.ts
function localOnboardingStateKey(configPath) {
	return `onboarding.local.${sha256Hex(path.resolve(configPath))}`;
}
function normalizeLocalOnboardingState(value, configPath) {
	if (!isRecord(value) || value.version !== 1 || value.status !== "pending" && value.status !== "completed" || typeof value.runId !== "string" || !value.runId || value.configPath !== path.resolve(configPath) || typeof value.workspace !== "string" || !value.workspace || typeof value.securityAcknowledgedAt !== "string" || !value.securityAcknowledgedAt.trim() || typeof value.startedAtMs !== "number" || !Number.isFinite(value.startedAtMs) || value.status === "completed" && (typeof value.completedAtMs !== "number" || !Number.isFinite(value.completedAtMs))) return;
	const coordinator = typeof value.teamCoordinatorId === "string" ? normalizeAgentIdStrict(value.teamCoordinatorId) : void 0;
	if (value.teamCoordinatorId !== void 0 && !coordinator?.ok) return;
	return {
		...value,
		version: value.version,
		status: value.status,
		runId: value.runId,
		configPath: value.configPath,
		workspace: value.workspace,
		securityAcknowledgedAt: value.securityAcknowledgedAt,
		startedAtMs: value.startedAtMs,
		...coordinator?.ok ? { teamCoordinatorId: coordinator.value } : {}
	};
}
//#endregion
export { normalizeLocalOnboardingState as n, localOnboardingStateKey as t };
