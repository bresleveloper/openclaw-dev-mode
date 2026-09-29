import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./update-doctor-result-C3mikR6I.mjs";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { l as isUpdateDoctorLintPass } from "./update-phase-DiVB4MDN.mjs";
//#region src/flows/doctor-update-budget.ts
const PUBLISHED_VALIDATION_WORK_MS = 298e3;
const INSPECTION_WINDOW_MS = PUBLISHED_VALIDATION_WORK_MS / 2;
const AGENT_INSPECTION_ALLOWANCE_MS = 2e3;
const RUN_INSPECTION_ALLOWANCE_MS = 5e3;
/** Read only the selected profile's existing ledger; these facts grant no write authority. */
async function resolveDoctorUpdateBudget(params) {
	const rehearsal = resolveUpdateRehearsalRoot(params.env);
	const recordedUpdateDoctor = isUpdateDoctorLintPass(params.env) && Boolean(params.env["OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH"]?.trim());
	if (!rehearsal && !recordedUpdateDoctor) return;
	const { listUpdateRunsAsync } = await import("./update-run-reader-L6zLrVuS.mjs");
	let validationStartedAt;
	try {
		const runs = await listUpdateRunsAsync({
			active: true,
			limit: 2
		}, { env: params.env });
		validationStartedAt = (runs.length === 1 ? runs[0] : void 0)?.steps.find((step) => step.step === "validating" && step.startedAtMs !== void 0)?.startedAtMs;
	} catch {}
	if (!rehearsal && validationStartedAt === void 0) return;
	return {
		agentCount: Math.max(listAgentIds(params.cfg).length, params.preparedAgentCount ?? 0),
		phase: rehearsal ? "validation" : "activation",
		...rehearsal && validationStartedAt !== void 0 ? { disposalDeadlineMs: validationStartedAt + PUBLISHED_VALIDATION_WORK_MS } : {},
		inspectionDeadlineMs: rehearsal ? validationStartedAt === void 0 ? Date.now() : validationStartedAt + INSPECTION_WINDOW_MS : Date.now() + INSPECTION_WINDOW_MS,
		source: !rehearsal ? "activation-policy" : validationStartedAt === void 0 ? "unavailable-validation-origin" : "validation-ledger",
		deferred: /* @__PURE__ */ new Map()
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
