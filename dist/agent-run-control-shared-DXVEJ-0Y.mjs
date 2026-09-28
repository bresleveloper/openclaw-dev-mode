import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/talk/provider-types.ts
function realtimeVoiceAudioDurationMs(format, byteLength) {
	const bytesPerSample = format.encoding === "pcm16" ? 2 : 1;
	return byteLength * 1e3 / (format.sampleRateHz * format.channels * bytesPerSample);
}
function toOpenAICompatibleRealtimeAudioFormat(format) {
	return format.encoding === "pcm16" ? {
		type: "audio/pcm",
		rate: 24e3
	} : { type: "audio/pcmu" };
}
const REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ = {
	encoding: "g711_ulaw",
	sampleRateHz: 8e3,
	channels: 1
};
const REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ = {
	encoding: "pcm16",
	sampleRateHz: 24e3,
	channels: 1
};
/** Normalizes OpenAI-style realtime response status details into the shared Talk contract. */
function normalizeRealtimeVoiceResponseOutcome(params) {
	const response = isRecord(params.response) ? params.response : void 0;
	const details = isRecord(response?.status_details) ? response.status_details : void 0;
	const rawError = isRecord(details?.error) ? details.error : void 0;
	const code = normalizeOptionalString(rawError?.code);
	const errorMessage = normalizeOptionalString(rawError?.message);
	const errorType = normalizeOptionalString(rawError?.type);
	const error = code || errorMessage || errorType ? {
		...code ? { code } : {},
		...errorMessage ? { message: errorMessage } : {},
		...errorType ? { type: errorType } : {}
	} : void 0;
	const reason = normalizeOptionalString(details?.reason);
	const responseId = normalizeOptionalString(response?.id) ?? normalizeOptionalString(params.responseId);
	const base = responseId ? { responseId } : {};
	switch (response?.status) {
		case "completed": return {
			...base,
			status: "completed"
		};
		case "cancelled": return {
			...base,
			status: "cancelled",
			...reason ? { reason } : {}
		};
		case "failed":
		case "incomplete": {
			const status = response.status;
			const detail = [reason, errorMessage ?? code ?? errorType].filter(Boolean).join(": ");
			return {
				...base,
				status,
				...reason ? { reason } : {},
				...error ? { error } : {},
				message: `${params.providerLabel} response ${status}${detail ? `: ${detail}` : ""}`
			};
		}
		default: {
			const rawStatus = normalizeOptionalString(response?.status);
			const detail = rawStatus ? `invalid status ${rawStatus}` : "missing terminal status";
			return {
				...base,
				status: "failed",
				reason: "invalid_response_status",
				error: {
					type: "invalid_response_status",
					message: detail
				},
				message: `${params.providerLabel} response failed: ${detail}`
			};
		}
	}
}
//#endregion
//#region src/talk/agent-consult-tool.ts
/**
* Realtime voice tool definition and helpers for delegating work to OpenClaw.
*
* Voice providers call this function tool when a spoken request needs normal
* agent tools, memory, workspace context, or current information before reply.
*/
/** Stable provider-facing tool name for realtime voice agent delegation. */
const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Closed policy set controlling whether the consult tool is exposed. */
const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES = [
	"safe-read-only",
	"owner",
	"none"
];
/** Shared realtime voice function-tool descriptor projected to providers. */
const REALTIME_VOICE_AGENT_CONSULT_TOOL = {
	type: "function",
	name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
	description: "Delegate the caller's request to the configured OpenClaw agent for normal tool-backed work, actions, context, memory, or reasoning before speaking.",
	parameters: {
		type: "object",
		properties: {
			question: {
				type: "string",
				description: "The concrete question or task the user asked."
			},
			context: {
				type: "string",
				description: "Optional relevant context or transcript summary."
			},
			responseStyle: {
				type: "string",
				description: "Optional style hint for the spoken answer."
			},
			confirmationId: {
				type: "string",
				description: "Server-issued confirmation id from a prior VOICE_CONFIRMATION_REQUIRED result, supplied only after the user explicitly confirms aloud."
			}
		},
		required: ["question"]
	}
};
/** Build the interim spoken instruction while the delegated agent turn runs. */
function buildRealtimeVoiceAgentConsultWorkingResponse(audienceLabel = "person") {
	return {
		status: "working",
		tool: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
		message: `Tell the ${audienceLabel} briefly that you are checking, then wait for the final OpenClaw result before answering with the actual result.`
	};
}
/** Default safe tool allowlist for voice consults in read-only mode. */
const SAFE_READ_ONLY_TOOLS = [
	"read",
	"web_search",
	"web_fetch",
	"x_search",
	"memory_search",
	"memory_get"
];
/** Type guard for user/config supplied consult tool policies. */
function isRealtimeVoiceAgentConsultToolPolicy(value) {
	return typeof value === "string" && REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES.includes(value);
}
/** Normalize a configured consult tool policy with a caller-owned fallback. */
function resolveRealtimeVoiceAgentConsultToolPolicy(value, fallback) {
	const normalized = normalizeOptionalLowercaseString(value);
	return isRealtimeVoiceAgentConsultToolPolicy(normalized) ? normalized : fallback;
}
/** Merge the shared consult tool with provider/plugin custom realtime tools. */
function resolveRealtimeVoiceAgentConsultTools(policy, customTools = []) {
	const tools = /* @__PURE__ */ new Map();
	if (policy !== "none") tools.set(REALTIME_VOICE_AGENT_CONSULT_TOOL.name, REALTIME_VOICE_AGENT_CONSULT_TOOL);
	for (const tool of customTools) {
		const name = readRealtimeVoiceCustomToolName(tool);
		if (name !== void 0 && !tools.has(name)) tools.set(name, tool);
	}
	return [...tools.values()];
}
function readRealtimeVoiceCustomToolName(tool) {
	try {
		const name = tool.name;
		return typeof name === "string" ? name : void 0;
	} catch {
		return;
	}
}
/** Resolve the OpenClaw tool allowlist paired with the consult exposure policy. */
function resolveRealtimeVoiceAgentConsultToolsAllow(policy) {
	if (policy === "owner") return;
	if (policy === "safe-read-only") return [...SAFE_READ_ONLY_TOOLS];
	return [];
}
/** Build model instructions for when the voice agent should call the consult tool. */
function buildRealtimeVoiceAgentConsultPolicyInstructions(config) {
	if (config.toolPolicy === "none" || !config.consultPolicy || config.consultPolicy === "auto") return;
	if (config.consultPolicy === "always") return [
		"Consult behavior:",
		"- Call openclaw_agent_consult before every substantive answer.",
		"- You may answer directly only for greetings, acknowledgements, brief latency tests, or filler while waiting for the consult result.",
		"- After the consult result arrives, speak that result concisely."
	].join("\n");
	return [
		"Consult behavior:",
		"- Answer directly for greetings, acknowledgements, simple conversational glue, and brief latency tests.",
		"- Call openclaw_agent_consult before answering requests that need facts, memory, current information, tools, workspace state, or the user's OpenClaw-specific context.",
		"- Keep spoken replies concise and natural."
	].join("\n");
}
/** Build the shared instructions for a realtime voice agent session. */
function buildRealtimeVoiceSessionInstructions(params) {
	if (params.isAgentProxy) return [
		params.base,
		params.bootstrapContextInstructions?.trim(),
		"Mode: OpenClaw agent proxy.",
		"You are the realtime voice surface for the same OpenClaw agent the user can message directly.",
		"Do not mention a backend, supervisor, helper, or separate system. Present the result as your own work.",
		"Delegate substantive requests, actions, tool work, current facts, memory, workspace context, and user-specific context with openclaw_agent_consult.",
		"Do not block, refuse, or downscope at the voice layer. Delegate to OpenClaw and treat its result as authoritative.",
		"Answer directly only for greetings, acknowledgements, brief latency tests, or filler while waiting.",
		"While waiting for OpenClaw data or tool results, use at most one short natural backchannel such as \"yeah\", \"mm-hmm\", \"got it\", or \"one sec\"; vary it and do not treat it as the final answer.",
		"When OpenClaw sends an internal exact answer to speak, do not call tools. Say only that answer.",
		buildRealtimeVoiceAgentConsultPolicyInstructions({
			toolPolicy: params.toolPolicy,
			consultPolicy: params.consultPolicy
		})
	].join("\n\n");
	return [
		params.base,
		params.bootstrapContextInstructions?.trim(),
		"While waiting for OpenClaw data or tool results, use at most one short natural backchannel such as \"yeah\", \"mm-hmm\", \"got it\", or \"one sec\"; vary it and do not treat it as the final answer.",
		buildRealtimeVoiceAgentConsultPolicyInstructions({
			toolPolicy: params.toolPolicy,
			consultPolicy: params.consultPolicy
		})
	].filter(Boolean).join("\n\n");
}
/** Parse provider-owned consult tool arguments into the normalized contract. */
function parseRealtimeVoiceAgentConsultArgs(args) {
	const question = readConsultStringArg(args, "question") ?? readConsultStringArg(args, "prompt") ?? readConsultStringArg(args, "query") ?? readConsultStringArg(args, "task");
	if (!question) throw new Error("question required");
	const context = readConsultStringArg(args, "context");
	const responseStyle = readConsultStringArg(args, "responseStyle");
	const confirmationId = readConsultStringArg(args, "confirmationId");
	return {
		question,
		context,
		responseStyle,
		...confirmationId ? { confirmationId } : {}
	};
}
/** Build the plain chat message used by browser/chat forwarding paths. */
function buildRealtimeVoiceAgentConsultChatMessage(args) {
	const parsed = parseRealtimeVoiceAgentConsultArgs(args);
	return [
		parsed.question,
		parsed.context ? `Context:\n${parsed.context}` : void 0,
		parsed.responseStyle ? `Spoken style:\n${parsed.responseStyle}` : void 0
	].filter(Boolean).join("\n\n");
}
/** Build the delegated OpenClaw agent prompt for a live voice consult. */
function buildRealtimeVoiceAgentConsultPrompt(params) {
	const parsed = parseRealtimeVoiceAgentConsultArgs(params.args);
	const assistantLabel = params.assistantLabel ?? "Agent";
	const questionSourceLabel = params.questionSourceLabel ?? params.userLabel.toLowerCase();
	const transcript = params.transcript.slice(-12).map((entry) => `${entry.role === "assistant" ? assistantLabel : params.userLabel}: ${entry.text}`).join("\n");
	return [
		`Live voice request from the ${questionSourceLabel} during ${params.surface}.`,
		"Act as the configured OpenClaw agent on behalf of this user. Use available tools when the request asks you to do work.",
		"When finished, return only the concise result the realtime voice agent should speak back.",
		"Do not include markdown, tool logs, or private reasoning. Include citations only when the spoken answer needs them.",
		parsed.responseStyle ? `Spoken style: ${parsed.responseStyle}` : void 0,
		transcript ? `Recent voice transcript for context:\n${transcript}` : void 0,
		parsed.context ? `Additional realtime context:\n${parsed.context}` : void 0,
		`User request:\n${parsed.question}`
	].filter(Boolean).join("\n\n");
}
/** Collect only visible answer text from streamed delegated-agent payloads. */
function collectRealtimeVoiceAgentConsultVisibleText(payloads) {
	const chunks = [];
	for (const payload of payloads) {
		if (payload.isError || payload.isReasoning || payload.isCommentary) continue;
		const text = normalizeOptionalString(payload.text);
		if (text) chunks.push(text);
	}
	return chunks.length > 0 ? chunks.join("\n\n").trim() : null;
}
function readConsultStringArg(args, key) {
	if (!args || typeof args !== "object" || Array.isArray(args)) return;
	return normalizeOptionalString(args[key]);
}
//#endregion
//#region src/talk/agent-run-control-shared.ts
/**
* Shared realtime voice controls for active OpenClaw agent runs.
*
* This module owns the provider-facing control tool, conservative intent
* classifier, and user-visible status/queue/cancel messages used by Talk.
*/
/** Provider-facing control modes for status, steering, cancellation, and follow-up work. */
const REALTIME_VOICE_AGENT_CONTROL_MODES = [
	"status",
	"steer",
	"cancel",
	"followup"
];
/** Stable provider-facing tool name for active-run voice control. */
const REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME = "openclaw_agent_control";
/** Realtime function-tool descriptor projected to voice providers. */
const REALTIME_VOICE_AGENT_CONTROL_TOOL = {
	type: "function",
	name: REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME,
	description: "Control an active OpenClaw tool-backed voice run. Use this when the caller asks in any language for status/progress, cancellation, a redirect/change to the active work, or a follow-up after the current work. Do not use this for ordinary greetings or chatter unless the caller is asking about the active work.",
	parameters: {
		type: "object",
		properties: {
			text: {
				type: "string",
				description: "The caller's exact spoken request or a concise semantic equivalent."
			},
			mode: {
				type: "string",
				enum: REALTIME_VOICE_AGENT_CONTROL_MODES,
				description: "status for progress questions, cancel for stop/abort, steer for changing the current work, followup for work to do after the current result."
			}
		},
		required: ["text", "mode"]
	}
};
/** Normalize user/config/provider supplied control modes. */
function normalizeRealtimeVoiceAgentControlMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return REALTIME_VOICE_AGENT_CONTROL_MODES.includes(normalized) ? normalized : void 0;
}
const CANCEL_CONTROL_PATTERNS = [
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?(?:cancel|cancle|abort)(?:\s+(?:that|this|it|the\s+(?:check|run|task|work)))?(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?(?:never mind|nevermind|forget it|kill it|end that)(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?stop(?:\s+(?:that|this|it|the\s+(?:check|run|task|work)))?(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:can|could|would)\s+you\s+(?:please\s+)?(?:cancel|cancle|stop|abort)(?:\s+(?:that|this|it|the\s+(?:check|run|task|work)))?(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right|actually)[,\s]+)?(?:can|could|would)\s+(?:we|you)\s+(?:just\s+)?(?:cancel|cancle|stop|abort)(?:\s+(?:that|this|it|the\s+(?:check|run|task|work)))?(?:\s*[.!?])?$/,
	/\b(?:cancel|cancle|stop|abort)\s+(?:that|this|it|the\s+(?:check|run|task|work))\b/
];
const STATUS_CONTROL_PATTERNS = [
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:status|progress|update)(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:give me|what'?s|any)\s+(?:an?\s+)?update(?:\s*[.!?])?$/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(where are we|what'?s happening|what (?:are you|is it) doing|what'?s it doing|how (?:is|are) (?:it|you|that|this) going|how'?s it going|are you still working|is it done|did it finish)(\b|[.!?])/
];
const FOLLOWUP_CONTROL_PATTERNS = [/^(after that|when you'?re done|when it'?s done|next|then|also|one more thing|follow up)(\b|[,.!?])/];
const STEER_CONTROL_PATTERNS = [
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?update\s+\S/,
	/^(?:actually|instead|change|switch|focus|use|try|prefer|make|do|check|look at|go with|redirect|steer|tell it to)\b/,
	/^(?:can|could|would)\s+you\s+(?:actually\s+)?(?:change|switch|focus|use|try|prefer|make|do|check|look at|go with|redirect|steer)\b/,
	/\b(?:instead|not that|rather than|change that|switch to|focus on|use the|try the|go with|tell it to)\b/
];
const STOP_REDIRECT_CONTROL_PATTERNS = [
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?stop\s+(?:using|doing|checking|looking at|focusing on|trying)\b/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:can|could|would)\s+(?:you|we)\s+(?:please\s+)?stop\s+(?:using|doing|checking|looking at|focusing on|trying)\b/,
	/^(?:(?:ok|okay|alright|all right)[,\s]+)?(?:please\s+)?stop\s+(?:that|this|it|the\s+(?:check|run|task|work))\s+from\b/
];
function matchesAnyPattern(text, patterns) {
	return patterns.some((pattern) => pattern.test(text));
}
function hasNegatedCancelIntent(text) {
	return /\b(?:don'?t|do\s+not|not|never)\s+(?:please\s+)?(?:cancel|cancle|stop|abort|kill|end)\b/.test(text) || /\bstop\s+(?:it|that|this)\s+from\b/.test(text);
}
/** Classify raw spoken control text with conservative auto-control gating. */
function resolveRealtimeVoiceAgentControlIntent(params) {
	const explicitMode = normalizeRealtimeVoiceAgentControlMode(params.mode);
	if (explicitMode) return {
		mode: explicitMode,
		confidence: "high",
		reason: "explicit_mode",
		shouldAutoControl: true
	};
	const normalized = params.text.trim().toLowerCase();
	if (matchesAnyPattern(normalized, STOP_REDIRECT_CONTROL_PATTERNS)) return {
		mode: "steer",
		confidence: "medium",
		reason: "steer_command",
		shouldAutoControl: true
	};
	if (!hasNegatedCancelIntent(normalized) && matchesAnyPattern(normalized, CANCEL_CONTROL_PATTERNS)) return {
		mode: "cancel",
		confidence: "high",
		reason: "cancel_safety",
		shouldAutoControl: true
	};
	if (matchesAnyPattern(normalized, STATUS_CONTROL_PATTERNS)) return {
		mode: "status",
		confidence: "high",
		reason: "status_query",
		shouldAutoControl: true
	};
	if (matchesAnyPattern(normalized, FOLLOWUP_CONTROL_PATTERNS)) return {
		mode: "followup",
		confidence: "high",
		reason: "followup_marker",
		shouldAutoControl: true
	};
	if (matchesAnyPattern(normalized, STEER_CONTROL_PATTERNS)) return {
		mode: "steer",
		confidence: "medium",
		reason: "steer_command",
		shouldAutoControl: true
	};
	return {
		mode: "status",
		confidence: "low",
		reason: "safe_default",
		shouldAutoControl: false
	};
}
/** Return the best control mode for a spoken utterance, even if auto-routing is unsafe. */
function classifyRealtimeVoiceAgentControlText(text) {
	return resolveRealtimeVoiceAgentControlIntent({ text }).mode;
}
/** Whether a spoken utterance is safe to route automatically to the control tool. */
function shouldAutoControlRealtimeVoiceAgentText(text) {
	return resolveRealtimeVoiceAgentControlIntent({ text }).shouldAutoControl;
}
/** Parse provider-owned control tool args from JSON strings or object payloads. */
function parseRealtimeVoiceAgentControlToolArgs(args) {
	const parsed = parseRealtimeVoiceAgentControlToolArgsRecord(args);
	const record = asNonArrayRecord(parsed);
	const text = normalizeOptionalString(record.text) ?? normalizeOptionalString(record.message) ?? normalizeOptionalString(record.request) ?? normalizeOptionalString(record.query);
	if (!text) throw new Error("text required");
	return {
		text,
		mode: normalizeRealtimeVoiceAgentControlMode(record.mode) ?? resolveRealtimeVoiceAgentControlIntent({ text }).mode
	};
}
function parseRealtimeVoiceAgentControlToolArgsRecord(args) {
	if (typeof args !== "string") return args;
	const trimmed = args.trim();
	if (!trimmed) return {};
	try {
		return JSON.parse(trimmed);
	} catch {
		return { text: trimmed };
	}
}
/** Fixed user-visible failure; private execution/readiness errors stay in host diagnostics. */
const REALTIME_VOICE_AGENT_CONTROL_FAILURE_MESSAGE = "OpenClaw could not process that voice control. Please try again.";
/** Build the system-style instruction that forces exact spoken status output. */
function buildRealtimeVoiceAgentControlSpeechMessage(text) {
	return [
		"Internal OpenClaw voice control result.",
		"Do not delegate this message or call any tools.",
		"Speak this exact OpenClaw status to the voice call, without adding, removing, or rephrasing words.",
		`Status: ${JSON.stringify(text)}`
	].join("\n");
}
/** Provider result payload used when the control tool cancels active work. */
function buildRealtimeVoiceAgentCancelProviderResult(message = "Cancelled the active OpenClaw run.") {
	return {
		status: "cancelled",
		message
	};
}
/** Wrap follow-up text so an active run treats it as deferred context. */
function buildRealtimeVoiceAgentFollowupSteeringText(text) {
	return [
		"Spoken follow-up for the current voice call.",
		"If you are mid-task, incorporate this after the current step or result unless it directly changes the current task.",
		"",
		text
	].join("\n");
}
/** User-facing message for queue failures while steering or adding follow-up work. */
function formatRealtimeVoiceAgentQueueRejection(mode, reason) {
	if (reason === "guarded_injection_unsupported") return "This agent runtime cannot safely accept scoped voice steering. Check status, cancel the run, or start a new explicit request. Update the runtime when guarded injection is supported.";
	if (reason === "compacting") return "OpenClaw is compacting the active run and cannot accept voice steering yet.";
	if (reason === "not_streaming") return "OpenClaw has an active run, but it is not currently accepting steering.";
	return mode === "followup" ? "OpenClaw could not queue that follow-up." : "OpenClaw could not steer the active run.";
}
function isRealtimeVoiceAgentControlToolEvent(event) {
	if (!event.type.startsWith("tool.")) return false;
	const payload = event.payload && typeof event.payload === "object" ? event.payload : {};
	return normalizeOptionalString(payload.name) === REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME;
}
/** Format a concise spoken status for the active or most recent voice run. */
function formatRealtimeVoiceAgentStatus(params) {
	const recent = (params.recentEvents ?? []).toReversed();
	if (!params.active) return recent.find((event) => event.type === "turn.ended") ? "OpenClaw finished the last voice request." : "I'm not working on an active request right now.";
	const toolEvent = recent.find((event) => event.type.startsWith("tool.") && !isRealtimeVoiceAgentControlToolEvent(event));
	if (toolEvent) {
		const payload = toolEvent.payload && typeof toolEvent.payload === "object" ? toolEvent.payload : {};
		const name = normalizeOptionalString(payload.name);
		const phase = normalizeOptionalString(payload.phase);
		if (toolEvent.type === "tool.call") return name ? `OpenClaw is starting ${name}.` : "OpenClaw is starting a tool.";
		if (toolEvent.type === "tool.result") return name ? `OpenClaw finished ${name} and is continuing.` : "OpenClaw finished a tool and is continuing.";
		if (toolEvent.type === "tool.progress") return name ? `OpenClaw is working in ${name}${phase ? ` (${phase})` : ""}.` : "OpenClaw is still working.";
	}
	if (params.activity?.activeToolName) return `OpenClaw is running ${params.activity.activeToolName}.`;
	if (params.activity?.activeWorkKind === "model_call") return "OpenClaw is waiting on the model.";
	if (params.activity?.activeWorkKind === "embedded_run" || params.activity?.hasActiveEmbeddedRun) return "OpenClaw is working on the current voice request.";
	return "OpenClaw is working on the current voice request.";
}
//#endregion
export { REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ as A, collectRealtimeVoiceAgentConsultVisibleText as C, resolveRealtimeVoiceAgentConsultTools as D, resolveRealtimeVoiceAgentConsultToolPolicy as E, realtimeVoiceAudioDurationMs as M, toOpenAICompatibleRealtimeAudioFormat as N, resolveRealtimeVoiceAgentConsultToolsAllow as O, buildRealtimeVoiceSessionInstructions as S, parseRealtimeVoiceAgentConsultArgs as T, REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES as _, buildRealtimeVoiceAgentCancelProviderResult as a, buildRealtimeVoiceAgentConsultPrompt as b, classifyRealtimeVoiceAgentControlText as c, normalizeRealtimeVoiceAgentControlMode as d, parseRealtimeVoiceAgentControlToolArgs as f, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME as g, REALTIME_VOICE_AGENT_CONSULT_TOOL as h, REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME as i, normalizeRealtimeVoiceResponseOutcome as j, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ as k, formatRealtimeVoiceAgentQueueRejection as l, shouldAutoControlRealtimeVoiceAgentText as m, REALTIME_VOICE_AGENT_CONTROL_MODES as n, buildRealtimeVoiceAgentControlSpeechMessage as o, resolveRealtimeVoiceAgentControlIntent as p, REALTIME_VOICE_AGENT_CONTROL_TOOL as r, buildRealtimeVoiceAgentFollowupSteeringText as s, REALTIME_VOICE_AGENT_CONTROL_FAILURE_MESSAGE as t, formatRealtimeVoiceAgentStatus as u, buildRealtimeVoiceAgentConsultChatMessage as v, isRealtimeVoiceAgentConsultToolPolicy as w, buildRealtimeVoiceAgentConsultWorkingResponse as x, buildRealtimeVoiceAgentConsultPolicyInstructions as y };
