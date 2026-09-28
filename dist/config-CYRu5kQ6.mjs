import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/skills/workshop/config.ts
const DEFAULT_CONFIG = {
	autonomous: { mode: "auto" },
	approvalPolicy: "auto",
	maxPending: 50,
	maxSkillBytes: 4e4
};
function readInteger(value, fallback, min, max) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(Math.trunc(value), min), max) : fallback;
}
function readAutonomousMode(value, fallback) {
	return value === "off" || value === "propose" || value === "auto" ? value : fallback;
}
function readApprovalPolicy(value, fallback) {
	return value === "pending" || value === "auto" ? value : fallback;
}
function resolveSkillWorkshopConfig(config) {
	const raw = asNullableRecord(config?.skills?.workshop) ?? {};
	return {
		autonomous: { mode: readAutonomousMode((asNullableRecord(raw.autonomous) ?? {}).mode, DEFAULT_CONFIG.autonomous.mode) },
		approvalPolicy: readApprovalPolicy(raw.approvalPolicy, DEFAULT_CONFIG.approvalPolicy),
		maxPending: readInteger(raw.maxPending, DEFAULT_CONFIG.maxPending, 1, 200),
		maxSkillBytes: readInteger(raw.maxSkillBytes, DEFAULT_CONFIG.maxSkillBytes, 1024, 2e5)
	};
}
//#endregion
export { resolveSkillWorkshopConfig as t };
