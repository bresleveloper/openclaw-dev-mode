import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./update-doctor-result-oZ38327j.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
//#region src/flows/doctor-update-budget.ts
const PUBLISHED_VALIDATION_WORK_MS = 298e3;
const COMMAND_VALIDATION_WORK_MS = 288e3;
const INSPECTION_WINDOW_MS = PUBLISHED_VALIDATION_WORK_MS / 2;
const AGENT_INSPECTION_ALLOWANCE_MS = 2e3;
const RUN_INSPECTION_ALLOWANCE_MS = 5e3;
/** A worker inherits its CLI's anchor; the CLI itself started this command. */
function resolveCommandStartedAt(inherited, validationStartedAt) {
	const started = inherited ?? Math.floor(performance.timeOrigin);
	return Math.min(Math.max(started, validationStartedAt), Date.now());
}
/** Read only the selected profile's existing ledger; these facts grant no write authority. */
async function resolveDoctorUpdateBudget(params) {
	const rehearsal = resolveUpdateRehearsalRoot(params.env);
	const recordedUpdateDoctor = isUpdateDoctorLintPass(params.env) && Boolean(params.env["OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH"]?.trim());
	if (!rehearsal && !recordedUpdateDoctor) return;
	const { listUpdateRunsAsync } = await import("./update-run-reader-qYXGmbxF.mjs");
	let validationStartedAt;
	let freshCommandBudget = false;
	try {
		const runs = await listUpdateRunsAsync({
			active: true,
			limit: 2
		}, { env: params.env });
		const run = runs.length === 1 ? runs[0] : void 0;
		validationStartedAt = run?.steps.find((step) => step.step === "validating" && step.startedAtMs !== void 0)?.startedAtMs;
		freshCommandBudget = Boolean(run?.steps.some((step) => step.step === "candidate-state-snapshot" && step.status === "in_progress"));
	} catch {}
	if (!rehearsal && validationStartedAt === void 0) return;
	const agentCount = Math.max(listAgentIds(params.cfg).length, params.preparedAgentCount ?? 0);
	const deferred = /* @__PURE__ */ new Map();
	if (!rehearsal) return {
		agentCount,
		phase: "activation",
		inspectionDeadlineMs: Date.now() + INSPECTION_WINDOW_MS,
		source: "activation-policy",
		deferred
	};
	if (validationStartedAt === void 0) return {
		agentCount,
		phase: "validation",
		inspectionDeadlineMs: Date.now(),
		source: "unavailable-validation-origin",
		deferred
	};
	if (freshCommandBudget) {
		const commandStartedAtMs = resolveCommandStartedAt(params.commandStartedAtMs, validationStartedAt);
		return {
			agentCount,
			phase: "validation",
			commandStartedAtMs,
			disposalDeadlineMs: commandStartedAtMs + COMMAND_VALIDATION_WORK_MS,
			inspectionDeadlineMs: commandStartedAtMs + COMMAND_VALIDATION_WORK_MS / 2,
			source: "validation-command",
			deferred
		};
	}
	return {
		agentCount,
		phase: "validation",
		disposalDeadlineMs: validationStartedAt + PUBLISHED_VALIDATION_WORK_MS,
		inspectionDeadlineMs: validationStartedAt + INSPECTION_WINDOW_MS,
		source: "validation-ledger",
		deferred
	};
}
function admitDoctorUpdateInspection(budget, scope, checks) {
	if (!budget) return true;
	const allowance = scope === "agent" ? Math.max(1, budget.agentCount) * AGENT_INSPECTION_ALLOWANCE_MS : RUN_INSPECTION_ALLOWANCE_MS;
	if (Date.now() + allowance <= budget.inspectionDeadlineMs && checks.every((check) => !budget.deferred.has(check.id))) return true;
	for (const check of checks) {
		if (budget.deferred.has(check.id)) continue;
		budget.deferred.set(check.id, {
			checkId: check.id,
			source: "doctor",
			severity: "warning",
			errorCode: "update-inspection-deferred",
			requirement: "update-validation-budget",
			message: `${check.label} deferred until after activation: ${budget.agentCount} agent scopes need a ${allowance}ms inspection allowance, with ${Math.max(0, budget.inspectionDeadlineMs - Date.now())}ms remaining in the ${budget.phase} inspection window (${budget.source}).`,
			fixHint: "Run `openclaw doctor --fix` after activation to complete deferred checks and repairs."
		});
	}
	return false;
}
//#endregion
export { resolveDoctorUpdateBudget as n, admitDoctorUpdateInspection as t };
