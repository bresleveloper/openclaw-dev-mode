import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { o as buildHistoryContext } from "./history-BQl9FdG2.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-gv15pQgO.mjs";
import { i as describeFailoverError, p as resolveFailoverStatus } from "./failover-error-BwAkMLuL.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-evzAFJT4.mjs";
import { t as captureGatewayOperatorRunAuthority } from "./operator-run-authority-siPNmoXo.mjs";
import { t as createDefaultDeps } from "./deps-BhgnghrK.mjs";
import { n as agentCommandFromGatewayIngress } from "./agent-command-BEkQrFbw.mjs";
import "./agent-LCPqJ83U.mjs";
import { STREAM_ERROR_FALLBACK_TEXT } from "@openclaw/ai/internal/shared";
//#region src/gateway/agent-prompt.ts
function renderConversationToolCall(call) {
	return `tool_call id=${call.id ?? ""} name=${call.name} arguments=${call.arguments}`;
}
const IMAGE_ONLY_USER_MESSAGE = "User sent image(s) with no text.";
/** Normalize content-array bodies and omit provenance-marked stream-error placeholders. */
function toPromptBody(entry) {
	const raw = entry.entry.body;
	const body = typeof raw === "string" ? raw : extractTextFromChatContent(raw) ?? "";
	return entry.role === "assistant" && entry.internalStreamError === true && body.trim() === STREAM_ERROR_FALLBACK_TEXT ? null : body;
}
/** Build the prompt text sent to an agent from ordered conversation entries. */
function buildAgentMessageFromConversationEntries(entries) {
	if (entries.length === 0) return "";
	let currentIndex = -1;
	for (let i = entries.length - 1; i >= 0; i -= 1) {
		const role = entries[i]?.role;
		if (role === "user" || role === "tool") {
			currentIndex = i;
			break;
		}
	}
	if (currentIndex < 0) currentIndex = entries.length - 1;
	const currentConversationEntry = entries[currentIndex];
	const currentEntry = currentConversationEntry?.entry;
	if (!currentConversationEntry || !currentEntry) return "";
	const historyLines = [];
	for (let index = 0; index < currentIndex; index += 1) {
		const entry = entries[index];
		const body = toPromptBody(entry);
		if (body !== null) historyLines.push(`${entry.entry.sender}: ${body}`);
	}
	const currentBody = toPromptBody(currentConversationEntry);
	if (currentBody === null) return "";
	if (historyLines.length === 0 && currentConversationEntry.role !== "tool") return currentBody;
	return buildHistoryContext({
		historyText: historyLines.join("\n"),
		currentMessage: `${currentEntry.sender}: ${currentBody}`
	});
}
//#endregion
//#region src/gateway/input-allowlist.ts
/**
* Normalize optional gateway URL-input hostname allowlists.
*
* Semantics are intentionally:
* - missing / empty / whitespace-only list => no hostname allowlist restriction
* - deny-all URL fetching => use the corresponding `allowUrl: false` switch
*/
function normalizeInputHostnameAllowlist(values) {
	if (!values || values.length === 0) return;
	const normalized = normalizeTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
//#endregion
//#region src/gateway/openai-agent-run-usage.ts
/** Shared agent-run usage selection for OpenAI-compatible Gateway endpoints. */
/** Prefer a nonzero aggregate snapshot, then the latest model-call snapshot. */
function resolveAgentRunUsage(result) {
	const agentMeta = result?.meta?.agentMeta;
	const aggregate = normalizeUsage(agentMeta?.usage);
	if (hasNonzeroUsage(aggregate)) return aggregate;
	const lastCall = normalizeUsage(agentMeta?.lastCallUsage);
	if (hasNonzeroUsage(lastCall)) return lastCall;
	return aggregate ?? lastCall;
}
//#endregion
//#region src/gateway/openai-compat-errors.ts
const ERROR_TYPE_BY_REASON = {
	auth: "authentication_error",
	auth_permanent: "permission_error",
	format: "invalid_request_error",
	rate_limit: "rate_limit_error",
	overloaded: "api_error",
	billing: "insufficient_quota",
	server_error: "api_error",
	timeout: "api_error",
	tls_certificate: "api_error",
	context_overflow: "invalid_request_error",
	model_not_found: "invalid_request_error",
	session_expired: "invalid_request_error",
	empty_response: void 0,
	no_error_details: void 0,
	unclassified: void 0,
	unknown: void 0
};
function statusForReason(reason, status) {
	if (reason === "server_error") return status && status >= 400 && status < 500 ? status : 502;
	if (reason === "timeout") return status && status >= 400 && status < 500 ? status : 504;
	return status ?? resolveFailoverStatus(reason) ?? 500;
}
function messageForReason(params) {
	if (params.reason === "server_error") return "upstream provider error";
	if (params.reason === "timeout") return "upstream provider timeout";
	if (params.reason === "overloaded") return "upstream provider overloaded";
	return params.rawError?.trim() || params.message.trim() || "request failed";
}
/** Converts a provider failover error into an OpenAI-compatible error envelope. */
function resolveOpenAiCompatError(err) {
	if (err instanceof ToolAuthorizationError) return {
		status: 403,
		error: {
			message: err.message,
			type: "permission_error"
		}
	};
	const described = describeFailoverError(err);
	const reason = described.reason;
	if (!reason) return;
	const type = ERROR_TYPE_BY_REASON[reason];
	if (!type) return;
	return {
		status: statusForReason(reason, described.status),
		error: {
			message: messageForReason({
				reason,
				message: described.message,
				rawError: described.rawError
			}),
			type,
			...described.code ? { code: described.code } : {}
		}
	};
}
/** Validates OpenAI-compatible sampling parameters before provider dispatch. */
function validateOpenAiSamplingParams(params) {
	if (params.temperature != null) {
		if (typeof params.temperature !== "number" || !Number.isFinite(params.temperature)) return "`temperature` must be a finite number.";
		if (params.temperature < 0 || params.temperature > 2) return "`temperature` must be between 0 and 2.";
	}
	if (params.topP != null) {
		if (typeof params.topP !== "number" || !Number.isFinite(params.topP)) return "`top_p` must be a finite number.";
		if (params.topP < 0 || params.topP > 1) return "`top_p` must be between 0 and 1.";
	}
	if (params.frequencyPenalty != null) {
		if (typeof params.frequencyPenalty !== "number" || !Number.isFinite(params.frequencyPenalty)) return "`frequency_penalty` must be a finite number.";
		if (params.frequencyPenalty < -2 || params.frequencyPenalty > 2) return "`frequency_penalty` must be between -2.0 and 2.0.";
	}
	if (params.presencePenalty != null) {
		if (typeof params.presencePenalty !== "number" || !Number.isFinite(params.presencePenalty)) return "`presence_penalty` must be a finite number.";
		if (params.presencePenalty < -2 || params.presencePenalty > 2) return "`presence_penalty` must be between -2.0 and 2.0.";
	}
	if (params.seed != null) {
		if (typeof params.seed !== "number" || !Number.isFinite(params.seed)) return "`seed` must be a finite number.";
		if (!Number.isInteger(params.seed)) return "`seed` must be an integer.";
	}
}
//#endregion
//#region src/gateway/openai-compatible-agent-run.ts
function readOpenAiHttpRunTerminal(result) {
	const meta = isRecord(result) ? result.meta : void 0;
	if (!isRecord(meta)) return {
		runFailed: readAgentRunTerminalOutcome(result) === "failed",
		stopReason: void 0,
		pendingToolCalls: void 0
	};
	const stopReasonRaw = meta.stopReason;
	const stopReason = typeof stopReasonRaw === "string" ? stopReasonRaw : void 0;
	const pendingRaw = meta.pendingToolCalls;
	if (!Array.isArray(pendingRaw)) return {
		runFailed: readAgentRunTerminalOutcome(result) === "failed",
		stopReason,
		pendingToolCalls: void 0
	};
	const pendingToolCalls = [];
	for (const call of pendingRaw) {
		const record = isRecord(call) ? call : void 0;
		const id = typeof record?.id === "string" ? record.id.trim() : "";
		const name = typeof record?.name === "string" ? record.name.trim() : "";
		const argsValue = record?.arguments;
		const argumentsValue = typeof argsValue === "string" ? argsValue : argsValue == null ? "" : JSON.stringify(argsValue);
		if (id && name) pendingToolCalls.push({
			id,
			name,
			arguments: argumentsValue
		});
	}
	return {
		runFailed: readAgentRunTerminalOutcome(result) === "failed",
		stopReason,
		pendingToolCalls
	};
}
async function runOpenAiCompatibleAgentCommand(params) {
	params.abortSignal?.throwIfAborted();
	let admitted = false;
	const assertSourceCurrent = () => {
		if (!admitted && params.hasCurrentClientAuthority?.() === false) throw new ToolAuthorizationError("Gateway requester authority changed");
	};
	assertSourceCurrent();
	const client = createSyntheticPluginRuntimeClient({
		authenticatedUserProfile: params.requestAuth.authenticatedUserProfile,
		operatorRoleActor: params.requestAuth.operatorRoleActor,
		scopes: [...params.operatorScopes]
	});
	const operator = resolveGatewayOperatorRoleActor(client)?.kind === "operator";
	const gatewayContext = operator ? params.resolveGatewayContext?.() : void 0;
	if (operator && !gatewayContext) throw new Error("OpenAI-compatible operator execution requires a current Gateway context.");
	const captured = gatewayContext ? captureGatewayOperatorRunAuthority({
		client,
		context: {
			getRuntimeConfig: gatewayContext.getRuntimeConfig,
			getCommittedRuntimeConfig: gatewayContext.getCommittedRuntimeConfig,
			resolveGatewayContext: params.resolveGatewayContext
		},
		sourceAuthority: params.requestAuth.operatorAccessAuthority
	}) : void 0;
	try {
		const sourceSignal = captured?.authority.signal;
		const abortSignal = params.abortSignal && sourceSignal ? AbortSignal.any([params.abortSignal, sourceSignal]) : params.abortSignal ?? sourceSignal;
		abortSignal?.throwIfAborted();
		const result = await agentCommandFromGatewayIngress({
			message: params.message,
			images: params.images?.length ? params.images : void 0,
			clientTools: params.clientTools?.length ? params.clientTools : void 0,
			extraSystemPrompt: params.extraSystemPrompt || void 0,
			model: params.modelOverride,
			streamParams: params.streamParams,
			sessionKey: params.sessionKey,
			runId: params.runId,
			deliver: false,
			messageChannel: params.messageChannel,
			senderIsOwner: params.senderIsOwner,
			bestEffortDeliver: false,
			allowModelOverride: params.modelOverride !== void 0,
			abortSignal,
			operatorAuthority: captured?.authority,
			assertSourceCurrent,
			onAdmittedRunContext: (context) => {
				assertSourceCurrent();
				bindGatewayContextResolver(context, params.resolveGatewayContext);
				admitted = true;
			}
		}, defaultRuntime, createDefaultDeps(), {});
		captured?.authority.assertCurrent();
		return result;
	} finally {
		captured?.release();
	}
}
//#endregion
//#region src/gateway/openai-tool-choice.ts
function resolveChatToolChoice(toolChoice) {
	if (toolChoice == null || toolChoice === "auto") return;
	if (toolChoice === "none") return "none";
	if (toolChoice === "required") return { type: "required" };
	const choice = asOptionalRecord(toolChoice);
	if (!choice) throw new Error("tool_choice must be a string or object");
	const choiceType = choice.type;
	if (choiceType === "function") {
		const targetName = normalizeOptionalString(asOptionalRecord(choice.function)?.name);
		if (!targetName) throw new Error("tool_choice.function.name is required");
		return {
			type: "function",
			name: targetName
		};
	}
	if (typeof choiceType !== "string") throw new Error("unsupported tool_choice type");
	throw new Error(`tool_choice ${choiceType} is not supported`);
}
function resolveResponsesToolChoice(toolChoice) {
	if (!toolChoice) return;
	if (toolChoice === "none") return "none";
	if (toolChoice === "required") return { type: "required" };
	if (typeof toolChoice === "object" && toolChoice.type === "function") {
		const targetName = ("name" in toolChoice ? toolChoice.name : toolChoice.function.name).trim();
		if (!targetName) throw new Error("tool_choice.name is required");
		return {
			type: "function",
			name: targetName
		};
	}
}
function applyToolChoice(tools, choice) {
	if (!choice) return { tools };
	if (choice === "none") return { tools: [] };
	const selectedTools = choice.type === "function" ? tools.filter((tool) => tool.function.name === choice.name) : tools;
	if (selectedTools.length === 0) throw new Error(choice.type === "function" ? `tool_choice requested unknown tool: ${choice.name}` : "tool_choice=required but no tools were provided");
	return {
		tools: selectedTools,
		extraSystemPrompt: choice.type === "function" ? `You must call the ${choice.name} tool before responding.` : "You must call one of the available tools before responding.",
		constraint: choice
	};
}
function isToolChoiceConstraintSatisfied(params) {
	const { constraint, pendingToolCalls } = params;
	if (!constraint) return true;
	if (!pendingToolCalls || pendingToolCalls.length === 0) return false;
	if (constraint.type === "required") return true;
	return pendingToolCalls.some((call) => call.name === constraint.name);
}
function resolveUnsatisfiedToolChoiceMessage(constraint) {
	return constraint.type === "function" ? `tool_choice required a ${constraint.name} tool call, but the agent did not produce one` : "tool_choice=required was not satisfied by the agent response";
}
//#endregion
export { resolveUnsatisfiedToolChoiceMessage as a, resolveOpenAiCompatError as c, normalizeInputHostnameAllowlist as d, IMAGE_ONLY_USER_MESSAGE as f, resolveResponsesToolChoice as i, validateOpenAiSamplingParams as l, renderConversationToolCall as m, isToolChoiceConstraintSatisfied as n, readOpenAiHttpRunTerminal as o, buildAgentMessageFromConversationEntries as p, resolveChatToolChoice as r, runOpenAiCompatibleAgentCommand as s, applyToolChoice as t, resolveAgentRunUsage as u };
