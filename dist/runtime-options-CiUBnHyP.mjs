import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { r as resolveAcpSessionIdentifierLinesFromIdentity } from "./session-identifiers-Bm1zQpah.mjs";
import { n as getAcpSessionManager } from "./manager-daMVnzH0.mjs";
import { _ as validateRuntimeCwdInput, d as parseRuntimeTimeoutSecondsInput, g as validateRuntimeConfigOptionInput, v as validateRuntimeModeInput, x as validateRuntimePermissionProfileInput, y as validateRuntimeModelInput } from "./manager.turn-timeout-xP50hYUL.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { r as sanitizeRunStatusText } from "./subagents-utils-DtuM-aOJ.mjs";
import { t as resolveAcpTargetSessionKey } from "./targets-DlcxH53h.mjs";
import { a as ACP_PERMISSIONS_USAGE, c as ACP_SET_MODE_USAGE, f as formatAcpCapabilitiesText, g as parseSingleValueCommandInput, h as parseSetCommandInput, i as ACP_MODEL_USAGE, l as ACP_STATUS_USAGE, m as parseOptionalSingleTarget, o as ACP_RESET_OPTIONS_USAGE, p as formatRuntimeOptionsText, t as ACP_CWD_USAGE, u as ACP_TIMEOUT_USAGE, x as withAcpCommandErrorBoundary } from "./shared-2sVFmUvF.mjs";
//#region src/auto-reply/reply/commands-acp/runtime-options.ts
async function resolveOptionalSingleTarget(params) {
	const parsed = parseOptionalSingleTarget(params.restTokens, params.usage);
	if (!parsed.ok) return parsed;
	return resolveAcpTargetSessionKey({
		commandParams: params.commandParams,
		token: parsed.sessionToken
	});
}
function defineSingleRuntimeOptionAction(action) {
	return async (commandParams, restTokens) => {
		const parsed = parseSingleValueCommandInput(restTokens, action.usage);
		if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
		const target = await resolveAcpTargetSessionKey({
			commandParams,
			token: parsed.value.sessionToken
		});
		if (!target.ok) return commandReply(`⚠️ ${target.error}`);
		return await withAcpCommandErrorBoundary({
			run: async () => {
				const parsedValue = action.parseValue(parsed.value.value);
				const options = await action.update(commandParams, target, parsedValue);
				const valueText = action.formatValue?.(parsedValue) ?? String(parsedValue);
				return commandReply(`✅ Updated ACP ${action.optionLabel} for ${target.sessionKey}: ${valueText}. Effective options: ${formatRuntimeOptionsText(options)}`);
			},
			fallbackMessage: `Could not update ACP ${action.optionLabel}.`
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
const handleAcpSetModeAction = defineSingleRuntimeOptionAction({
	usage: ACP_SET_MODE_USAGE,
	optionLabel: "runtime mode",
	parseValue: validateRuntimeModeInput,
	update: async (params, target, value) => await getAcpSessionManager().setSessionRuntimeMode({
		assertActive: params.command.assertOwnerCurrent,
		cfg: params.cfg,
		...target,
		runtimeMode: value
	})
});
async function handleAcpSetAction(params, restTokens) {
	const parsed = parseSetCommandInput(restTokens);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	const target = await resolveAcpTargetSessionKey({
		commandParams: params,
		token: parsed.value.sessionToken
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	const key = parsed.value.key.trim();
	const value = parsed.value.value.trim();
	return await withAcpCommandErrorBoundary({
		run: async () => {
			if (normalizeLowercaseStringOrEmpty(key) === "cwd") {
				const cwd = validateRuntimeCwdInput(value);
				const options = await getAcpSessionManager().updateSessionRuntimeOptions({
					assertActive: params.command.assertOwnerCurrent,
					cfg: params.cfg,
					...target,
					patch: { cwd }
				});
				return commandReply(`✅ Updated ACP cwd for ${target.sessionKey}: ${cwd}. Effective options: ${formatRuntimeOptionsText(options)}`);
			}
			const validated = validateRuntimeConfigOptionInput(key, value);
			const options = await getAcpSessionManager().setSessionConfigOption({
				assertActive: params.command.assertOwnerCurrent,
				cfg: params.cfg,
				...target,
				key: validated.key,
				value: validated.value
			});
			return commandReply(`✅ Updated ACP config option for ${target.sessionKey}: ${validated.key}=${validated.value}. Effective options: ${formatRuntimeOptionsText(options)}`);
		},
		fallbackMessage: "Could not update ACP config option."
	});
}
const handleAcpCwdAction = defineSingleRuntimeOptionAction({
	usage: ACP_CWD_USAGE,
	optionLabel: "cwd",
	parseValue: validateRuntimeCwdInput,
	update: async (params, target, value) => await getAcpSessionManager().updateSessionRuntimeOptions({
		assertActive: params.command.assertOwnerCurrent,
		cfg: params.cfg,
		...target,
		patch: { cwd: value }
	})
});
const handleAcpPermissionsAction = defineSingleRuntimeOptionAction({
	usage: ACP_PERMISSIONS_USAGE,
	optionLabel: "permissions profile",
	parseValue: validateRuntimePermissionProfileInput,
	update: async (params, target, value) => await getAcpSessionManager().setSessionConfigOption({
		assertActive: params.command.assertOwnerCurrent,
		cfg: params.cfg,
		...target,
		key: "approval_policy",
		value
	})
});
const handleAcpTimeoutAction = defineSingleRuntimeOptionAction({
	usage: ACP_TIMEOUT_USAGE,
	optionLabel: "timeout",
	parseValue: parseRuntimeTimeoutSecondsInput,
	formatValue: (value) => `${value}s`,
	update: async (params, target, value) => await getAcpSessionManager().setSessionConfigOption({
		assertActive: params.command.assertOwnerCurrent,
		cfg: params.cfg,
		...target,
		key: "timeout",
		value: String(value)
	})
});
const handleAcpModelAction = defineSingleRuntimeOptionAction({
	usage: ACP_MODEL_USAGE,
	optionLabel: "model",
	parseValue: validateRuntimeModelInput,
	update: async (params, target, value) => await getAcpSessionManager().setSessionConfigOption({
		assertActive: params.command.assertOwnerCurrent,
		cfg: params.cfg,
		...target,
		key: "model",
		value
	})
});
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
