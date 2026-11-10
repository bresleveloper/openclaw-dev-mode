import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as normalizeStringArray, g as resolveSystemRunCommandRequest } from "./system-run-approval-binding-DJ0HBEkx.mjs";
import { t as normalizeSystemRunApprovalPlan } from "./system-run-approval-plan-cPisImJ2.mjs";
//#region src/infra/system-run-approval-context.ts
function normalizePreparedRunExecPolicy(raw) {
	if (!isRecord(raw)) return;
	const { security, ask } = raw;
	if ((security === "deny" || security === "allowlist" || security === "full") && (ask === "off" || ask === "on-miss" || ask === "always")) return {
		security,
		ask
	};
}
function normalizeAllowAlwaysCoverage(raw) {
	if (!isRecord(raw) || !Array.isArray(raw.patterns)) return;
	const patterns = raw.patterns.flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const pattern = normalizeNullableString(entry.pattern);
		if (!pattern) return [];
		const argPattern = normalizeNullableString(entry.argPattern);
		return [{
			pattern,
			...argPattern ? { argPattern } : {}
		}];
	});
	return {
		complete: raw.complete === true,
		patterns
	};
}
function parsePreparedSystemRunPayload(raw) {
	if (!isRecord(raw)) return null;
	const execPolicy = normalizePreparedRunExecPolicy(raw.execPolicy);
	const allowAlwaysCoverage = normalizeAllowAlwaysCoverage(raw.allowAlwaysCoverage);
	const plan = normalizeSystemRunApprovalPlan(raw.plan);
	if (!plan) return null;
	return {
		plan,
		...execPolicy ? { execPolicy } : {},
		...allowAlwaysCoverage ? { allowAlwaysCoverage } : {}
	};
}
function resolveSystemRunApprovalRequestContext(params) {
	const normalizedPlan = (normalizeNullableString(params.host) ?? "") === "node" ? normalizeSystemRunApprovalPlan(params.systemRunPlan) : null;
	const fallbackArgv = normalizeStringArray(params.commandArgv);
	const fallbackCommand = typeof params.command === "string" ? params.command : "";
	const commandText = normalizedPlan?.commandText ?? fallbackCommand;
	const preview = normalizedPlan ? normalizedPlan.commandPreview ?? normalizeNullableString(fallbackCommand) : null;
	const commandPreview = preview && preview !== commandText ? preview : null;
	const cwd = normalizedPlan?.cwd ?? normalizeNullableString(params.cwd);
	const agentId = normalizedPlan?.agentId ?? normalizeNullableString(params.agentId);
	const sessionKey = normalizedPlan?.sessionKey ?? normalizeNullableString(params.sessionKey);
	const plan = normalizedPlan ? {
		...normalizedPlan,
		commandPreview,
		cwd,
		agentId,
		sessionKey
	} : null;
	return {
		plan,
		commandArgv: plan?.argv ?? (fallbackArgv.length > 0 ? fallbackArgv : void 0),
		commandText,
		commandPreview,
		cwd,
		agentId,
		sessionKey
	};
}
/** Build the runtime approval context from already-normalized command inputs. */
function resolveSystemRunApprovalRuntimeContext(params) {
	const normalizedPlan = normalizeSystemRunApprovalPlan(params.plan ?? null);
	if (normalizedPlan) return {
		ok: true,
		plan: normalizedPlan,
		argv: [...normalizedPlan.argv],
		cwd: normalizedPlan.cwd,
		agentId: normalizedPlan.agentId,
		sessionKey: normalizedPlan.sessionKey,
		commandText: normalizedPlan.commandText
	};
	const command = resolveSystemRunCommandRequest({
		command: params.command,
		rawCommand: params.rawCommand
	});
	if (!command.ok) return {
		ok: false,
		message: command.message,
		details: command.details
	};
	return {
		ok: true,
		plan: null,
		argv: command.argv,
		cwd: normalizeNullableString(params.cwd),
		agentId: normalizeNullableString(params.agentId),
		sessionKey: normalizeNullableString(params.sessionKey),
		commandText: command.commandText
	};
}
//#endregion
export { resolveSystemRunApprovalRequestContext as n, resolveSystemRunApprovalRuntimeContext as r, parsePreparedSystemRunPayload as t };
