import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as toAcpRuntimeErrorText } from "./error-text-BII6md-i.mjs";
import "./errors-DDGkdHjR.mjs";
import { O as supportsThreadBindingSpawn } from "./session-binding-service-DzGpg6K8.mjs";
import { o as resolveConversationBindingThreadIdFromMessage, r as resolveConversationBindingChannelFromMessage } from "./acp-reset-target-BoR9NsWR.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import "./thread-bindings-policy-DE7-D4c0.mjs";
import { randomUUID } from "node:crypto";
//#region src/auto-reply/reply/commands-acp/shared.ts
const COMMAND = "/acp";
const ACP_SPAWN_USAGE = "Usage: /acp spawn [harness-id] [--mode persistent|oneshot] [--thread auto|here|off] [--bind here|off] [--cwd <path>] [--label <label>].";
const ACP_STEER_USAGE = "Usage: /acp steer [--session <session-key|session-id|session-label>] <instruction>";
const ACP_SET_MODE_USAGE = "Usage: /acp set-mode <mode> [session-key|session-id|session-label]";
const ACP_SET_USAGE = "Usage: /acp set <key> <value> [session-key|session-id|session-label]";
const ACP_CWD_USAGE = "Usage: /acp cwd <path> [session-key|session-id|session-label]";
const ACP_PERMISSIONS_USAGE = "Usage: /acp permissions <profile> [session-key|session-id|session-label]";
const ACP_TIMEOUT_USAGE = "Usage: /acp timeout <seconds> [session-key|session-id|session-label]";
const ACP_MODEL_USAGE = "Usage: /acp model <model-id> [session-key|session-id|session-label]";
const ACP_RESET_OPTIONS_USAGE = "Usage: /acp reset-options [session-key|session-id|session-label]";
const ACP_STATUS_USAGE = "Usage: /acp status [session-key|session-id|session-label]";
const ACP_INSTALL_USAGE = "Usage: /acp install";
const ACP_DOCTOR_USAGE = "Usage: /acp doctor";
const ACP_SESSIONS_USAGE = "Usage: /acp sessions";
const ACP_UNICODE_DASH_PREFIX_RE = /^[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]+/;
function readOptionValue(params) {
	const token = params.tokens[params.index] ?? "";
	const flag = params.flags.find((candidate) => token === candidate || token.startsWith(`${candidate}=`));
	if (!flag) return { matched: false };
	let value;
	let nextIndex = params.index + 1;
	if (token === flag) {
		const nextValue = params.tokens[params.index + 1] ?? "";
		value = nextValue.startsWith("--") ? "" : nextValue;
		if (value) nextIndex += 1;
	} else value = token.slice(flag.length + 1).trim();
	if (!value) return {
		matched: true,
		flag,
		nextIndex,
		error: `${flag} requires a value`
	};
	return {
		matched: true,
		flag,
		value,
		nextIndex
	};
}
function normalizeAcpOptionToken(raw) {
	const token = raw.trim();
	if (!token || token.startsWith("--")) return token;
	const dashPrefix = token.match(ACP_UNICODE_DASH_PREFIX_RE)?.[0];
	if (!dashPrefix) return token;
	return `--${token.slice(dashPrefix.length)}`;
}
function resolveDefaultSpawnThreadMode(params) {
	const channel = resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel);
	if (!supportsThreadBindingSpawn(channel)) return "off";
	return resolveConversationBindingThreadIdFromMessage(params.ctx) ? "here" : "auto";
}
function parseSpawnInput(params, tokens) {
	const normalizedTokens = tokens.map(normalizeAcpOptionToken);
	let mode = "persistent";
	let thread = resolveDefaultSpawnThreadMode(params);
	let sawThreadOption = false;
	let bind = "off";
	let cwd;
	let label;
	let rawAgentId;
	for (let i = 0; i < normalizedTokens.length;) {
		const token = normalizedTokens[i] ?? "";
		const option = readOptionValue({
			tokens: normalizedTokens,
			index: i,
			flags: [
				"--mode",
				"--bind",
				"--thread",
				"--cwd",
				"--label"
			]
		});
		if (option.matched) {
			if (option.error) return {
				ok: false,
				error: `${option.error}. ${ACP_SPAWN_USAGE}`
			};
			const raw = normalizeOptionalLowercaseString(option.value);
			switch (option.flag) {
				case "--mode":
					if (raw !== "persistent" && raw !== "oneshot") return {
						ok: false,
						error: `Invalid --mode value "${option.value}". Use persistent or oneshot.`
					};
					mode = raw;
					break;
				case "--bind":
					if (raw !== "here" && raw !== "off") return {
						ok: false,
						error: `Invalid --bind value "${option.value}". Use here or off.`
					};
					bind = raw;
					break;
				case "--thread":
					if (raw !== "auto" && raw !== "here" && raw !== "off") return {
						ok: false,
						error: `Invalid --thread value "${option.value}". Use auto, here, or off.`
					};
					thread = raw;
					sawThreadOption = true;
					break;
				case "--cwd":
					cwd = normalizeOptionalString(option.value);
					break;
				case "--label": label = normalizeOptionalString(option.value);
			}
			i = option.nextIndex;
			continue;
		}
		if (token.startsWith("--")) return {
			ok: false,
			error: `Unknown option: ${token}. ${ACP_SPAWN_USAGE}`
		};
		if (!rawAgentId) {
			rawAgentId = normalizeOptionalString(token);
			i += 1;
			continue;
		}
		return {
			ok: false,
			error: `Unexpected argument: ${token}. ${ACP_SPAWN_USAGE}`
		};
	}
	const fallbackAgent = normalizeOptionalString(params.cfg.acp?.defaultAgent) ?? "";
	const selectedAgent = rawAgentId ?? fallbackAgent;
	if (!selectedAgent) return {
		ok: false,
		error: `ACP target harness id is required. Pass an ACP harness id (for example codex) or configure acp.defaultAgent. ${ACP_SPAWN_USAGE}`
	};
	const normalizedAgentId = normalizeAgentId(selectedAgent);
	if (bind !== "off" && !sawThreadOption) thread = "off";
	if (thread !== "off" && bind !== "off") return {
		ok: false,
		error: `Use either --thread or --bind for /acp spawn, not both. ${ACP_SPAWN_USAGE}`
	};
	return {
		ok: true,
		value: {
			agentId: normalizedAgentId,
			mode,
			thread,
			bind,
			cwd,
			label
		}
	};
}
function parseSteerInput(tokens) {
	const normalizedTokens = tokens.map(normalizeAcpOptionToken);
	let sessionToken;
	const instructionTokens = [];
	for (let i = 0; i < normalizedTokens.length;) {
		const sessionOption = readOptionValue({
			tokens: normalizedTokens,
			index: i,
			flags: ["--session"]
		});
		if (sessionOption.matched) {
			if (sessionOption.error) return {
				ok: false,
				error: `${sessionOption.error}. ${ACP_STEER_USAGE}`
			};
			sessionToken = normalizeOptionalString(sessionOption.value);
			i = sessionOption.nextIndex;
			continue;
		}
		instructionTokens.push(tokens[i] ?? "");
		i += 1;
	}
	const instruction = instructionTokens.join(" ").trim();
	if (!instruction) return {
		ok: false,
		error: ACP_STEER_USAGE
	};
	return {
		ok: true,
		value: {
			sessionToken,
			instruction
		}
	};
}
function parseSingleValueCommandInput(tokens, usage) {
	const value = normalizeOptionalString(tokens[0]) ?? "";
	if (!value || tokens.length > 2) return {
		ok: false,
		error: usage
	};
	return {
		ok: true,
		value: {
			value,
			sessionToken: normalizeOptionalString(tokens[1])
		}
	};
}
function parseSetCommandInput(tokens) {
	const key = normalizeOptionalString(tokens[0]) ?? "";
	const value = normalizeOptionalString(tokens[1]) ?? "";
	if (!key || !value || tokens.length > 3) return {
		ok: false,
		error: ACP_SET_USAGE
	};
	return {
		ok: true,
		value: {
			key,
			value,
			sessionToken: normalizeOptionalString(tokens[2])
		}
	};
}
function parseOptionalSingleTarget(tokens, usage) {
	if (tokens.length > 1) return {
		ok: false,
		error: usage
	};
	const token = normalizeOptionalString(tokens[0]) ?? "";
	return {
		ok: true,
		...token ? { sessionToken: token } : {}
	};
}
function resolveAcpHelpText() {
	return [
		"ACP commands:",
		"-----",
		"/acp spawn [harness-id] [--mode persistent|oneshot] [--thread auto|here|off] [--bind here|off] [--cwd <path>] [--label <label>]",
		"/acp cancel [session-key|session-id|session-label]",
		"/acp steer [--session <session-key|session-id|session-label>] <instruction>",
		"/acp close [session-key|session-id|session-label]",
		"/acp status [session-key|session-id|session-label]",
		"/acp set-mode <mode> [session-key|session-id|session-label]",
		"/acp set <key> <value> [session-key|session-id|session-label]",
		"/acp cwd <path> [session-key|session-id|session-label]",
		"/acp permissions <profile> [session-key|session-id|session-label]",
		"/acp timeout <seconds> [session-key|session-id|session-label]",
		"/acp model <model-id> [session-key|session-id|session-label]",
		"/acp reset-options [session-key|session-id|session-label]",
		"/acp doctor",
		"/acp install",
		"/acp sessions",
		"",
		"Notes:",
		"- /acp spawn harness-id is an ACP runtime harness alias (for example codex), not an OpenClaw agents.entries id.",
		"- Use --bind here to pin the current conversation to the ACP session without creating a child thread.",
		"- /session unbind detaches this conversation without closing its ACP session.",
		"- ACP dispatch of normal thread messages is controlled by acp.dispatch.enabled."
	].join("\n");
}
function formatRuntimeOptionsText(options) {
	const extras = options.backendExtras ? Object.entries(options.backendExtras).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join(", ") : "";
	const parts = [
		options.runtimeMode ? `runtimeMode=${options.runtimeMode}` : null,
		options.model ? `model=${options.model}` : null,
		options.thinking ? `thinking=${options.thinking}` : null,
		options.cwd ? `cwd=${options.cwd}` : null,
		options.permissionProfile ? `permissionProfile=${options.permissionProfile}` : null,
		typeof options.timeoutSeconds === "number" ? `timeoutSeconds=${options.timeoutSeconds}` : null,
		extras ? `extras={${extras}}` : null
	].filter(Boolean);
	if (parts.length === 0) return "(none)";
	return parts.join(", ");
}
function formatAcpCapabilitiesText(controls) {
	if (controls.length === 0) return "(none)";
	return controls.toSorted().join(", ");
}
function resolveCommandRequestId(params) {
	const value = params.ctx.MessageSidFull ?? params.ctx.MessageSid ?? params.ctx.MessageSidFirst ?? params.ctx.MessageSidLast;
	if (typeof value === "string") {
		const normalizedValue = normalizeOptionalString(value);
		if (normalizedValue) return normalizedValue;
	}
	if (typeof value === "number" || typeof value === "bigint") return String(value);
	return randomUUID();
}
async function withAcpCommandErrorBoundary(params) {
	try {
		return await params.run();
	} catch (error) {
		return commandReply(toAcpRuntimeErrorText({
			error,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: params.fallbackMessage
		}));
	}
}
//#endregion
export { parseSpawnInput as _, ACP_PERMISSIONS_USAGE as a, resolveCommandRequestId as b, ACP_SET_MODE_USAGE as c, COMMAND as d, formatAcpCapabilitiesText as f, parseSingleValueCommandInput as g, parseSetCommandInput as h, ACP_MODEL_USAGE as i, ACP_STATUS_USAGE as l, parseOptionalSingleTarget as m, ACP_DOCTOR_USAGE as n, ACP_RESET_OPTIONS_USAGE as o, formatRuntimeOptionsText as p, ACP_INSTALL_USAGE as r, ACP_SESSIONS_USAGE as s, ACP_CWD_USAGE as t, ACP_TIMEOUT_USAGE as u, parseSteerInput as v, withAcpCommandErrorBoundary as x, resolveAcpHelpText as y };
