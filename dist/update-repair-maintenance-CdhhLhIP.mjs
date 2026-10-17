import { Et as _enum, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-BdJj3P99.mjs";
//#region src/infra/update-repair-maintenance.ts
const UPDATE_REPAIR_MAINTENANCE_TOOL = "request_update_maintenance";
const requestSchema = strictObject({ operation: _enum(["doctor-fix", "update-repair"]) });
/** A terminal client tool requests work; it never runs maintenance inside the agent. */
const updateRepairMaintenanceTool = {
	type: "function",
	function: {
		name: UPDATE_REPAIR_MAINTENANCE_TOOL,
		description: "End this repair turn and ask the update owner to run Doctor repair or finish an interrupted update after all agent database and process resources settle. Do not run these maintenance commands through exec. The owner preserves all lease, service, and capability refusals.",
		parameters: {
			type: "object",
			properties: { operation: {
				type: "string",
				enum: ["doctor-fix", "update-repair"]
			} },
			required: ["operation"],
			additionalProperties: false
		},
		strict: true
	}
};
function readUpdateRepairMaintenanceRequest(meta) {
	if (!meta.pendingToolCalls?.length) return;
	const [call] = meta.pendingToolCalls;
	if (meta.stopReason !== "tool_calls" || meta.pendingToolCalls.length !== 1 || call?.name !== UPDATE_REPAIR_MAINTENANCE_TOOL) throw new Error("Repair returned an invalid maintenance handoff.");
	return requestSchema.parse(JSON.parse(call.arguments));
}
/** Called only after inference, the agent turn, and their resource scopes have closed. */
async function runUpdateRepairMaintenance(params) {
	const [{ resolveGatewayInstallEntrypoint }, { runUtf8CommandWithTimeout }] = await Promise.all([import("./gateway-entrypoint-ByuBsr2t.mjs"), import("./exec-C89-C-hl.mjs")]);
	const entrypoint = await resolveGatewayInstallEntrypoint(params.target.installRoot);
	params.signal.throwIfAborted();
	params.assertCurrent();
	if (!entrypoint) throw new Error("The installed OpenClaw entrypoint is unavailable.");
	const args = params.request.operation === "update-repair" ? [
		"update",
		"repair",
		"--yes",
		"--json",
		...params.allowGatewayActivation ? [] : ["--no-restart"]
	] : [
		"doctor",
		"--fix",
		"--non-interactive"
	];
	try {
		const result = await runUtf8CommandWithTimeout([
			resolveNodeRunner(),
			entrypoint,
			...args
		], {
			cwd: params.target.installRoot,
			baseEnv: {},
			env: {
				...params.env,
				...!params.allowGatewayActivation ? buildUpdateDoctorEnv({
					allowGatewayServiceRepair: false,
					allowGatewayActivation: false,
					serviceRepairPolicy: "external"
				}) : {},
				OPENCLAW_SHELL: "exec"
			},
			input: "",
			signal: params.signal,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			outputCapture: "tail",
			maxOutputBytes: 32768
		});
		if (result.cleanup === "uncertain" || result.cleanup === "forced") {
			recordAgentCleanupFailure();
			throw new Error("Maintenance subprocess cleanup is unconfirmed.");
		}
		return result;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) recordAgentCleanupFailure();
		throw error;
	}
}
//#endregion
export { runUpdateRepairMaintenance as n, updateRepairMaintenanceTool as r, readUpdateRepairMaintenanceRequest as t };
