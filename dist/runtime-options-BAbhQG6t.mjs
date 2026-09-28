import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAcpSessionIdentifierLinesFromIdentity } from "./session-identifiers-dXNk5MtW.mjs";
import { t as getAcpSessionManager } from "./manager-BSwH2tZB.mjs";
import { c as sanitizeTaskStatusText } from "./task-status-D1-umRs5.mjs";
import { _ as validateRuntimeCwdInput, d as parseRuntimeTimeoutSecondsInput, g as validateRuntimeConfigOptionInput, v as validateRuntimeModeInput, x as validateRuntimePermissionProfileInput, y as validateRuntimeModelInput } from "./manager.turn-timeout-DthYDbbm.mjs";
import { i as findLatestTaskForRelatedSessionKeyForOwner } from "./task-owner-access-LVQrPhRu.mjs";
import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import { C as withAcpCommandErrorBoundary, _ as parseSingleValueCommandInput, a as ACP_PERMISSIONS_USAGE, c as ACP_SET_MODE_USAGE, g as parseSetCommandInput, h as parseOptionalSingleTarget, i as ACP_MODEL_USAGE, l as ACP_STATUS_USAGE, m as formatRuntimeOptionsText, o as ACP_RESET_OPTIONS_USAGE, p as formatAcpCapabilitiesText, t as ACP_CWD_USAGE, u as ACP_TIMEOUT_USAGE } from "./shared-3Js5NUn4.mjs";
import { t as resolveAcpTargetSessionKey } from "./targets-CTBR6TAg.mjs";
//#region src/auto-reply/reply/commands-acp/runtime-options.ts
async function resolveTargetSessionKeyOrStop(params) {
	const target = await resolveAcpTargetSessionKey({
		commandParams: params.commandParams,
		token: params.token
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	return target;
}
async function resolveOptionalSingleTargetOrStop(params) {
	const parsed = parseOptionalSingleTarget(params.restTokens, params.usage);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	return await resolveTargetSessionKeyOrStop({
		commandParams: params.commandParams,
		token: parsed.sessionToken
	});
}
async function resolveSingleTargetValueOrStop(params) {
	const parsed = parseSingleValueCommandInput(params.restTokens, params.usage);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	const target = await resolveTargetSessionKeyOrStop({
		commandParams: params.commandParams,
		token: parsed.value.sessionToken
	});
	if (!("sessionKey" in target)) return target;
	return {
		target,
		value: parsed.value.value
	};
}
async function withSingleTargetValue(params) {
	const resolved = await resolveSingleTargetValueOrStop({
		commandParams: params.commandParams,
		restTokens: params.restTokens,
		usage: params.usage
	});
	if (!("target" in resolved)) return resolved;
	return await params.run(resolved);
}
async function handleSingleRuntimeOptionAction(commandParams, restTokens, action) {
	return await withSingleTargetValue({
		commandParams,
		restTokens,
		usage: action.usage,
		run: async ({ target, value }) => await withAcpCommandErrorBoundary({
			run: async () => {
				const parsedValue = action.parseValue(value);
				return {
					parsedValue,
					options: await action.update(target, parsedValue)
				};
			},
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: `Could not update ACP ${action.optionLabel}.`,
			onSuccess: ({ parsedValue, options }) => {
				const valueText = action.formatValue?.(parsedValue) ?? String(parsedValue);
				return commandReply(`✅ Updated ACP ${action.optionLabel} for ${target.sessionKey}: ${valueText}. Effective options: ${formatRuntimeOptionsText(options)}`);
			}
		})
	});
}
async function handleAcpStatusAction(params, restTokens) {
	const target = await resolveOptionalSingleTargetOrStop({
		commandParams: params,
		restTokens,
		usage: ACP_STATUS_USAGE
	});
	if (!("sessionKey" in target)) return target;
	return await withAcpCommandErrorBoundary({
		run: async () => await getAcpSessionManager().getSessionStatus({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target
		}),
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not read ACP session status.",
		onSuccess: (status) => {
			const linkedTask = findLatestTaskForRelatedSessionKeyForOwner({
				relatedSessionKey: status.sessionKey,
				callerOwnerKey: params.sessionKey,
				callerAgentId: params.agentId,
				config: params.cfg
			});
			const sessionIdentifierLines = resolveAcpSessionIdentifierLinesFromIdentity({
				backend: status.backend,
				identity: status.identity
			});
			const taskProgress = sanitizeTaskStatusText(linkedTask?.progressSummary);
			const taskSummary = sanitizeTaskStatusText(linkedTask?.terminalSummary, { errorContext: true });
			const taskError = sanitizeTaskStatusText(linkedTask?.error, { errorContext: true });
			const lastError = sanitizeTaskStatusText(status.lastError, { errorContext: true });
			const runtimeSummary = sanitizeTaskStatusText(status.runtimeStatus?.summary, { errorContext: true });
			const runtimeDetails = sanitizeTaskStatusText(status.runtimeStatus?.details, { errorContext: true });
			const taskUpdatedAt = typeof linkedTask?.lastEventAt === "number" ? timestampMsToIsoString(linkedTask.lastEventAt) : void 0;
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
				...linkedTask ? [
					`taskId: ${linkedTask.taskId}`,
					`taskStatus: ${linkedTask.status}`,
					`delivery: ${linkedTask.deliveryStatus}`,
					...taskProgress ? [`taskProgress: ${taskProgress}`] : [],
					...taskSummary ? [`taskSummary: ${taskSummary}`] : [],
					...taskError ? [`taskError: ${taskError}`] : [],
					...taskUpdatedAt ? [`taskUpdatedAt: ${taskUpdatedAt}`] : []
				] : [],
				`runtimeOptions: ${formatRuntimeOptionsText(status.runtimeOptions)}`,
				`capabilities: ${formatAcpCapabilitiesText(status.capabilities.controls)}`,
				`lastActivityAt: ${lastActivityAt}`,
				...lastError ? [`lastError: ${lastError}`] : [],
				...runtimeSummary ? [`runtime: ${runtimeSummary}`] : [],
				...runtimeDetails ? [`runtimeDetails: ${runtimeDetails}`] : []
			];
			return commandReply(lines.join("\n"));
		}
	});
}
async function handleAcpSetModeAction(params, restTokens) {
	return await handleSingleRuntimeOptionAction(params, restTokens, {
		usage: ACP_SET_MODE_USAGE,
		optionLabel: "runtime mode",
		parseValue: validateRuntimeModeInput,
		update: async (target, value) => await getAcpSessionManager().setSessionRuntimeMode({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target,
			runtimeMode: value
		})
	});
}
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
				return { text: `✅ Updated ACP cwd for ${target.sessionKey}: ${cwd}. Effective options: ${formatRuntimeOptionsText(options)}` };
			}
			const validated = validateRuntimeConfigOptionInput(key, value);
			const options = await getAcpSessionManager().setSessionConfigOption({
				assertActive: params.command.assertOwnerCurrent,
				cfg: params.cfg,
				...target,
				key: validated.key,
				value: validated.value
			});
			return { text: `✅ Updated ACP config option for ${target.sessionKey}: ${validated.key}=${validated.value}. Effective options: ${formatRuntimeOptionsText(options)}` };
		},
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not update ACP config option.",
		onSuccess: ({ text }) => commandReply(text)
	});
}
async function handleAcpCwdAction(params, restTokens) {
	return await handleSingleRuntimeOptionAction(params, restTokens, {
		usage: ACP_CWD_USAGE,
		optionLabel: "cwd",
		parseValue: validateRuntimeCwdInput,
		update: async (target, value) => await getAcpSessionManager().updateSessionRuntimeOptions({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target,
			patch: { cwd: value }
		})
	});
}
async function handleAcpPermissionsAction(params, restTokens) {
	return await handleSingleRuntimeOptionAction(params, restTokens, {
		usage: ACP_PERMISSIONS_USAGE,
		optionLabel: "permissions profile",
		parseValue: validateRuntimePermissionProfileInput,
		update: async (target, value) => await getAcpSessionManager().setSessionConfigOption({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target,
			key: "approval_policy",
			value
		})
	});
}
async function handleAcpTimeoutAction(params, restTokens) {
	return await handleSingleRuntimeOptionAction(params, restTokens, {
		usage: ACP_TIMEOUT_USAGE,
		optionLabel: "timeout",
		parseValue: parseRuntimeTimeoutSecondsInput,
		formatValue: (value) => `${value}s`,
		update: async (target, value) => await getAcpSessionManager().setSessionConfigOption({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target,
			key: "timeout",
			value: String(value)
		})
	});
}
async function handleAcpModelAction(params, restTokens) {
	return await handleSingleRuntimeOptionAction(params, restTokens, {
		usage: ACP_MODEL_USAGE,
		optionLabel: "model",
		parseValue: validateRuntimeModelInput,
		update: async (target, value) => await getAcpSessionManager().setSessionConfigOption({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target,
			key: "model",
			value
		})
	});
}
async function handleAcpResetOptionsAction(params, restTokens) {
	const target = await resolveOptionalSingleTargetOrStop({
		commandParams: params,
		restTokens,
		usage: ACP_RESET_OPTIONS_USAGE
	});
	if (!("sessionKey" in target)) return target;
	return await withAcpCommandErrorBoundary({
		run: async () => await getAcpSessionManager().resetSessionRuntimeOptions({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			...target
		}),
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not reset ACP runtime options.",
		onSuccess: () => commandReply(`✅ Reset ACP runtime options for ${target.sessionKey}.`)
	});
}
//#endregion
export { handleAcpCwdAction, handleAcpModelAction, handleAcpPermissionsAction, handleAcpResetOptionsAction, handleAcpSetAction, handleAcpSetModeAction, handleAcpStatusAction, handleAcpTimeoutAction };
