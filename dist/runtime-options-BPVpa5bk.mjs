import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolveAcpSessionIdentifierLinesFromIdentity } from "./session-identifiers-2CkhpQUq.mjs";
import { n as getAcpSessionManager } from "./manager-Cge77N9B.mjs";
import { _ as validateRuntimeCwdInput, d as parseRuntimeTimeoutSecondsInput, g as validateRuntimeConfigOptionInput, v as validateRuntimeModeInput, x as validateRuntimePermissionProfileInput, y as validateRuntimeModelInput } from "./manager.turn-timeout-DqwO4sX9.mjs";
import { n as commandReply } from "./command-gates-Dcr0LjaJ.mjs";
import { t as sanitizeRunStatusText } from "./run-status-text-dSOTErxL.mjs";
import { t as resolveAcpTargetSessionKey } from "./targets-IvXrw_Bb.mjs";
import { a as ACP_PERMISSIONS_USAGE, c as ACP_SET_MODE_USAGE, g as parseSetCommandInput, h as parseOptionalSingleTarget, i as ACP_MODEL_USAGE, l as ACP_STATUS_USAGE, m as formatRuntimeOptionsText, o as ACP_RESET_OPTIONS_USAGE, p as formatAcpCapabilitiesText, t as ACP_CWD_USAGE, u as ACP_TIMEOUT_USAGE, x as withAcpCommandErrorBoundary } from "./shared-DV-dBFts.mjs";
//#region src/auto-reply/reply/commands-acp/runtime-options.ts
async function resolveOptionalSingleTarget(params) {
	const parsed = parseOptionalSingleTarget(params.restTokens, params.usage);
	if (!parsed.ok) return parsed;
	return resolveAcpTargetSessionKey({
		commandParams: params.commandParams,
		token: parsed.sessionToken
	});
}
const SINGLE_RUNTIME_OPTIONS = {
	"set-mode": {
		usage: ACP_SET_MODE_USAGE,
		label: "runtime mode",
		key: "runtimeMode",
		parseValue: validateRuntimeModeInput
	},
	cwd: {
		usage: ACP_CWD_USAGE,
		label: "cwd",
		key: "cwd",
		parseValue: validateRuntimeCwdInput
	},
	permissions: {
		usage: ACP_PERMISSIONS_USAGE,
		label: "permissions profile",
		key: "approval_policy",
		parseValue: validateRuntimePermissionProfileInput
	},
	timeout: {
		usage: ACP_TIMEOUT_USAGE,
		label: "timeout",
		key: "timeout",
		parseValue: parseRuntimeTimeoutSecondsInput
	},
	model: {
		usage: ACP_MODEL_USAGE,
		label: "model",
		key: "model",
		parseValue: validateRuntimeModelInput
	}
};
function defineRuntimeOptionAction(action) {
	return async (commandParams, restTokens) => {
		const single = action === "set" ? void 0 : SINGLE_RUNTIME_OPTIONS[action];
		const parsed = parseSetCommandInput(single ? [single.key, ...restTokens] : restTokens);
		if (!parsed.ok) return commandReply(`⚠️ ${single?.usage ?? parsed.error}`);
		const target = await resolveAcpTargetSessionKey({
			commandParams,
			token: parsed.value.sessionToken
		});
		if (!target.ok) return commandReply(`⚠️ ${target.error}`);
		return await withAcpCommandErrorBoundary({
			run: async () => {
				let label = single?.label ?? "config option";
				let key = parsed.value.key;
				let value = single ? String(single.parseValue(parsed.value.value)) : parsed.value.value;
				const input = {
					assertActive: commandParams.command.assertOwnerCurrent,
					cfg: commandParams.cfg,
					...target
				};
				let options;
				if (action === "set-mode") options = await getAcpSessionManager().setSessionRuntimeMode({
					...input,
					runtimeMode: value
				});
				else if (normalizeLowercaseStringOrEmpty(key) === "cwd") {
					value = single ? value : validateRuntimeCwdInput(value);
					label = "cwd";
					options = await getAcpSessionManager().updateSessionRuntimeOptions({
						...input,
						patch: { cwd: value }
					});
				} else {
					if (!single) ({key, value} = validateRuntimeConfigOptionInput(key, value));
					options = await getAcpSessionManager().setSessionConfigOption({
						...input,
						key,
						value
					});
				}
				const valueText = label === "config option" ? `${key}=${value}` : action === "timeout" ? `${value}s` : value;
				return commandReply(`✅ Updated ACP ${label} for ${target.sessionKey}: ${valueText}. Effective options: ${formatRuntimeOptionsText(options)}`);
			},
			fallbackMessage: `Could not update ACP ${single?.label ?? "config option"}.`
		});
	};
}
async function handleAcpStatusAction(params, restTokens) {
	const target = await resolveOptionalSingleTarget({
		commandParams: params,
		restTokens,
		usage: ACP_STATUS_USAGE
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	return await withAcpCommandErrorBoundary({
		run: async () => {
			const status = await getAcpSessionManager().getSessionStatus({
				assertActive: params.command.assertOwnerCurrent,
				cfg: params.cfg,
				...target
			});
			const sessionIdentifierLines = resolveAcpSessionIdentifierLinesFromIdentity({
				backend: status.backend,
				identity: status.identity
			});
			const lastError = sanitizeRunStatusText(status.lastError, { errorContext: true });
			const runtimeSummary = sanitizeRunStatusText(status.runtimeStatus?.summary, { errorContext: true });
			const runtimeDetails = sanitizeRunStatusText(status.runtimeStatus?.details, { errorContext: true });
			const lastActivityAt = timestampMsToIsoString(status.lastActivityAt) ?? "n/a";
			const lines = [
				"ACP status:",
				"-----",
				`session: ${status.sessionKey}`,
				`owner: ${target.agentId}`,
				`backend: ${status.backend}`,
				`agent: ${status.agent}`,
				...sessionIdentifierLines,
				`sessionMode: ${status.mode}`,
				`state: ${status.state}`,
				`runtimeOptions: ${formatRuntimeOptionsText(status.runtimeOptions)}`,
				`capabilities: ${formatAcpCapabilitiesText(status.capabilities.controls)}`,
				`lastActivityAt: ${lastActivityAt}`,
				...lastError ? [`lastError: ${lastError}`] : [],
				...runtimeSummary ? [`runtime: ${runtimeSummary}`] : [],
				...runtimeDetails ? [`runtimeDetails: ${runtimeDetails}`] : []
			];
			return commandReply(lines.join("\n"));
		},
		fallbackMessage: "Could not read ACP session status."
	});
}
const handleAcpSetModeAction = defineRuntimeOptionAction("set-mode");
const handleAcpSetAction = defineRuntimeOptionAction("set");
const handleAcpCwdAction = defineRuntimeOptionAction("cwd");
const handleAcpPermissionsAction = defineRuntimeOptionAction("permissions");
const handleAcpTimeoutAction = defineRuntimeOptionAction("timeout");
const handleAcpModelAction = defineRuntimeOptionAction("model");
async function handleAcpResetOptionsAction(params, restTokens) {
	const target = await resolveOptionalSingleTarget({
		commandParams: params,
		restTokens,
		usage: ACP_RESET_OPTIONS_USAGE
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	return await withAcpCommandErrorBoundary({
		run: async () => {
			await getAcpSessionManager().resetSessionRuntimeOptions({
				assertActive: params.command.assertOwnerCurrent,
				cfg: params.cfg,
				...target
			});
			return commandReply(`✅ Reset ACP runtime options for ${target.sessionKey}.`);
		},
		fallbackMessage: "Could not reset ACP runtime options."
	});
}
//#endregion
export { handleAcpCwdAction, handleAcpModelAction, handleAcpPermissionsAction, handleAcpResetOptionsAction, handleAcpSetAction, handleAcpSetModeAction, handleAcpStatusAction, handleAcpTimeoutAction };
