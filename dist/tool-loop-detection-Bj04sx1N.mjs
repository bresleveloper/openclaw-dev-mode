import { l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-BeWrbIx3.mjs";
import { t as getComputerToolOutcome } from "./computer-tool-outcome-8o2rLZXB.mjs";
//#region src/agents/tool-loop-outcome-hash.ts
function digestToolOutcome(value) {
	const canonicalMarkerId = "0000000000000000";
	const serialized = stableStringify(value, (text) => text.replace(/(<<<EXTERNAL_UNTRUSTED_CONTENT id=(\\*)")([a-f0-9]{16})(\2">>>(?:(?!<<<(?:END_)?EXTERNAL_UNTRUSTED_CONTENT)[\s\S])*<<<END_EXTERNAL_UNTRUSTED_CONTENT id=\2")\3(\2">>>)/g, (match, start, escapes, _id, middle, end) => (escapes.length & escapes.length + 1) !== 0 || [...middle.matchAll(/(?<!\\)\\*"/g)].some((quote) => quote[0].length % (escapes.length + 1) !== 0) ? match : start + canonicalMarkerId + middle + canonicalMarkerId + end));
	return sha256Hex(serialized);
}
//#endregion
//#region src/agents/code-mode-tool-outcome.ts
const outcomes$1 = /* @__PURE__ */ new WeakMap();
function recordCodeModeToolOutcome(result, payload, pending) {
	const retained = outcomes$1.get(payload);
	if (retained !== void 0) {
		outcomes$1.set(result, retained);
		return result;
	}
	const { telemetry: _telemetry, runId: _runId, pendingToolCalls, ...outcome } = payload;
	outcomes$1.set(result, digestToolOutcome({
		...outcome,
		pending: pending ? pending.filter((entry) => !entry.settled).map(({ method, args }) => ({
			method,
			args
		})) : pendingToolCalls
	}));
	return result;
}
function getCodeModeToolOutcome(result) {
	return outcomes$1.get(result);
}
//#endregion
//#region src/agents/tool-loop-argument-churn.ts
const MIN_STABLE_CALLS_PER_VARIANT = 3;
function getArgumentChurnNoProgressStreak(history, toolName, currentArgsHash) {
	const outcomes = /* @__PURE__ */ new Map();
	for (let i = history.length - 1; i >= 0; i -= 1) {
		const record = history[i];
		if (!record || record.toolName !== toolName) break;
		if (!record.resultHash) continue;
		if (record.noProgress !== true) break;
		const previous = outcomes.get(record.argsHash);
		if (previous && previous.resultHash !== record.resultHash) break;
		outcomes.set(record.argsHash, {
			resultHash: record.resultHash,
			count: (previous?.count ?? 0) + 1
		});
	}
	const allOutcomes = Array.from(outcomes.values());
	const count = allOutcomes.reduce((sum, outcome) => sum + outcome.count, 0);
	const stableOutcomes = allOutcomes.filter((outcome) => outcome.count >= MIN_STABLE_CALLS_PER_VARIANT);
	const hasSharedStableOutcome = new Set(stableOutcomes.map((outcome) => outcome.resultHash)).size === 1;
	const currentOutcome = outcomes.get(currentArgsHash);
	const hasOnlyStableVariants = stableOutcomes.reduce((sum, outcome) => sum + outcome.count, 0) === count;
	return stableOutcomes.length > 1 && hasOnlyStableVariants && hasSharedStableOutcome && (currentOutcome?.count ?? 0) >= MIN_STABLE_CALLS_PER_VARIANT ? {
		count,
		variantCount: stableOutcomes.length
	} : {
		count: 0,
		variantCount: 0
	};
}
function buildArgumentChurnWarning(toolName, churn) {
	return {
		stuck: true,
		level: "warning",
		detector: "argument_churn",
		count: churn.count,
		message: `WARNING: ${toolName} has cycled through ${churn.variantCount} repeated argument patterns with the same stable outcome ${churn.count} times. Continued churn is treated as stalled run activity, but this tool call remains allowed.`,
		warningKey: `argument-churn:${toolName}`,
		livenessSignal: "argument_churn"
	};
}
//#endregion
//#region src/agents/tool-loop-call-kind.ts
function isKnownPollToolCall(toolName, params) {
	if (toolName === "command_status" || toolName === "wait") return true;
	if (toolName !== "process" || !isPlainObject(params)) return false;
	const action = params.action;
	return action === "poll" || action === "log";
}
//#endregion
//#region src/agents/tool-loop-no-progress.ts
function getNoProgressStreak(history, toolName, argsHash) {
	const repeatedArguments = countNoProgressStreak(history, toolName, argsHash, false);
	if (toolName !== "exec") return repeatedArguments;
	const terminalFailures = countNoProgressStreak(history, toolName, argsHash, true);
	return terminalFailures.count > repeatedArguments.count ? terminalFailures : repeatedArguments;
}
function countNoProgressStreak(history, toolName, argsHash, terminalExecFailuresOnly) {
	let streak = 0;
	let latestOutcome;
	let crossedArgumentBoundary = false;
	let pendingLoopVetoes = 0;
	for (let i = history.length - 1; i >= 0; i -= 1) {
		const record = history[i];
		if (!record) continue;
		if (terminalExecFailuresOnly && record.outcomeKind === "argument-validation") continue;
		if (record.toolName !== toolName) {
			if (terminalExecFailuresOnly) break;
			continue;
		}
		if (!terminalExecFailuresOnly && record.argsHash !== argsHash) continue;
		if (record.outcomeKind === "tool-loop-veto") {
			pendingLoopVetoes += 1;
			continue;
		}
		if (typeof record.resultHash !== "string" || !record.resultHash) continue;
		if (terminalExecFailuresOnly && record.outcomeKind !== "terminal-exec-failure") break;
		if (!latestOutcome) {
			latestOutcome = record;
			crossedArgumentBoundary = record.argsHash !== argsHash;
			streak = pendingLoopVetoes + 1;
			pendingLoopVetoes = 0;
			continue;
		}
		if (terminalExecFailuresOnly) {
			if (crossedArgumentBoundary && record.argsHash === argsHash) break;
			if (record.argsHash !== argsHash) crossedArgumentBoundary = true;
		}
		const repeatsSameFailure = terminalExecFailuresOnly && record.failureIdentityHash !== void 0 && record.failureIdentityHash === latestOutcome.failureIdentityHash;
		if (record.resultHash !== latestOutcome.resultHash && !repeatsSameFailure) break;
		streak += pendingLoopVetoes + 1;
		pendingLoopVetoes = 0;
	}
	return {
		count: latestOutcome ? streak : terminalExecFailuresOnly ? 0 : pendingLoopVetoes,
		latestResultHash: latestOutcome?.resultHash
	};
}
function resolveToolLoopWarningThreshold() {
	return 10;
}
//#endregion
//#region src/agents/tool-loop-write-outcome.ts
function isWriteNoProgressOutcome(details) {
	return details.changed === false;
}
//#endregion
//#region src/agents/tools/progress-card-tool-outcome.ts
const outcomes = /* @__PURE__ */ new WeakMap();
function recordProgressCardToolOutcome(result, card) {
	outcomes.set(result, stableStringify({
		markdown: card?.markdown ?? null,
		steps: card?.steps ?? null
	}));
	return result;
}
function getProgressCardToolOutcome(result) {
	return outcomes.get(result);
}
//#endregion
//#region src/agents/tool-loop-detection.ts
/**
* Tool-call loop detection.
*
* Watches recent tool history for repeated no-progress patterns and circuit-breaker thresholds.
*/
const log = createSubsystemLogger("agents/loop-detection");
const TOOL_CALL_HISTORY_SIZE = 30;
const CRITICAL_THRESHOLD = 20;
const GLOBAL_CIRCUIT_BREAKER_THRESHOLD = 30;
function selectHistoryForScope(history, scope) {
	const runId = normalizeOptionalString(scope?.runId);
	return history.filter((record) => normalizeOptionalString(record.runId) === runId);
}
function hashToolCall(toolName, params) {
	if (toolName === "exec" && isPlainObject(params)) {
		const { title: _title, ...execution } = params;
		return `${toolName}:${sha256Hex(stableStringify(execution))}`;
	}
	return `${toolName}:${sha256Hex(stableStringify(params))}`;
}
function extractTextContent(result) {
	if (!isPlainObject(result) || !Array.isArray(result.content)) return "";
	return result.content.filter((entry) => isPlainObject(entry) && typeof entry.type === "string" && typeof entry.text === "string").map((entry) => entry.text).join("\n").trim();
}
function formatErrorForHash(error) {
	if (error instanceof Error) return error.message || error.name;
	if (typeof error === "string") return error;
	if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") return `${error}`;
	return stableStringify(error);
}
function extractUnknownToolName(error) {
	const raw = formatErrorForHash(error).trim();
	if (!raw) return;
	const toolName = (raw.match(/unknown tool[:\s]+["']?([a-z0-9_.-]+)["']?/i) ?? raw.match(/tool\s+["']?([a-z0-9_.-]+)["']?\s+(?:not found|is not available)/i))?.[1]?.trim();
	return toolName ? toolName.toLowerCase() : void 0;
}
function stringField(value) {
	return typeof value === "string" ? value : null;
}
function hashExecToolOutcome(details, text) {
	const status = stringField(details.status);
	if (!status) return;
	if (status === "running") return digestToolOutcome({
		status,
		tail: stringField(details.tail) ?? ""
	});
	if (status === "completed" || status === "failed") return digestToolOutcome({
		status,
		exitCode: typeof details.exitCode === "number" ? details.exitCode : null,
		timedOut: details.timedOut === true,
		output: normalizeNullableString(details.aggregated) ?? text
	});
	if (status === "approval-pending" || status === "approval-unavailable") return digestToolOutcome({
		status,
		reason: stringField(details.reason),
		host: stringField(details.host),
		command: stringField(details.command) ?? "",
		warningText: stringField(details.warningText) ?? ""
	});
}
const VOLATILE_EXEC_FAILURE_PATTERNS = [
	/\d{4}-\d{2}-\d{2}[t ]\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:z|[+-]\d{2}:\d{2})?/giu,
	/\d{1,2}:\d{2}:\d{2}(?:\.\d{1,6})?/gu,
	/\b(?:attempt|retry)\b[\s#:=]*\d+/giu,
	/\b\d+(?:\.\d+)?\s?(?:ns|us|ms|seconds?|minutes?|hours?|s)\b/giu,
	/\b(?:pid|ppid)\b[\s#:=]*\d+/giu
];
function hashExecFailureIdentity(details, exitCode, output) {
	let outputShape = output;
	for (const pattern of VOLATILE_EXEC_FAILURE_PATTERNS) outputShape = outputShape.replace(pattern, "#");
	return digestToolOutcome({
		status: details.status,
		exitCode,
		timedOut: details.timedOut === true,
		output: outputShape
	});
}
const SEND_LIKE_MESSAGE_ACTIONS = /* @__PURE__ */ new Set([
	"send",
	"broadcast",
	"reply",
	"thread-reply",
	"sendWithEffect",
	"sendAttachment",
	"upload-file",
	"sticker",
	"poll"
]);
const VOLATILE_SEND_RESULT_KEYS = /* @__PURE__ */ new Set([
	"messageId",
	"message_id",
	"messageIds",
	"platformMessageId",
	"platformMessageIds",
	"fileId",
	"file_id",
	"fileKey",
	"pollId",
	"poll_id",
	"receipt",
	"runId",
	"idempotencyKey",
	"ts",
	"timestamp",
	"sentAt",
	"deliveredAt",
	"createdAt"
]);
function isMessageDeliveryObject(value) {
	return typeof value.id === "string" && typeof value.text === "string" && (typeof value.direction === "string" || typeof value.senderId === "string" || typeof value.accountId === "string" || isPlainObject(value.conversation));
}
function stripVolatileSendIds(value) {
	if (Array.isArray(value)) return value.map(stripVolatileSendIds);
	if (!isPlainObject(value)) return value;
	const dropMessageObjectId = isMessageDeliveryObject(value);
	const stripped = {};
	for (const [key, nested] of Object.entries(value)) {
		if (VOLATILE_SEND_RESULT_KEYS.has(key) || key === "id" && dropMessageObjectId) continue;
		stripped[key] = stripVolatileSendIds(nested);
	}
	return stripped;
}
function isVolatileSendResult(toolName, params) {
	if (toolName === "sessions_send") return true;
	const args = isPlainObject(params) ? params : {};
	if (toolName === "message") return typeof args.action === "string" && SEND_LIKE_MESSAGE_ACTIONS.has(args.action);
	return isMessagingToolSendAction(toolName, args);
}
function hashToolOutcome(toolName, params, result, error) {
	if (error !== void 0) {
		const unknownToolName = extractUnknownToolName(error);
		return {
			resultHash: `error:${digestToolOutcome(formatErrorForHash(error))}`,
			noProgress: true,
			unknownToolName
		};
	}
	if (!isPlainObject(result)) return { resultHash: result === void 0 ? void 0 : digestToolOutcome(result) };
	const details = isPlainObject(result.details) ? result.details : {};
	const text = extractTextContent(result);
	if (details.status === "blocked" && details.deniedReason === "tool-loop") return { outcomeKind: "tool-loop-veto" };
	if (toolName === "computer" && result.isError !== true) {
		const outcome = getComputerToolOutcome(result);
		if (outcome !== void 0) return { resultHash: digestToolOutcome(outcome) };
	}
	if (toolName === "progress_card" && result.isError !== true) {
		const outcome = getProgressCardToolOutcome(result);
		if (outcome !== void 0) return { resultHash: digestToolOutcome(outcome) };
	}
	if (toolName === "exec" || toolName === "wait") {
		const resultHash = getCodeModeToolOutcome(result);
		if (resultHash !== void 0) return { resultHash };
	}
	if (toolName === "exec") {
		const execHash = hashExecToolOutcome(details, text);
		if (execHash) {
			const exitCode = details.exitCode;
			const output = normalizeNullableString(details.aggregated) ?? text;
			return (details.status === "completed" || details.status === "failed") && typeof exitCode === "number" && Number.isFinite(exitCode) && exitCode !== 0 && details.timedOut !== true && output !== "" && output !== `(Command exited with code ${exitCode})` ? {
				resultHash: execHash,
				outcomeKind: "terminal-exec-failure",
				failureIdentityHash: hashExecFailureIdentity(details, exitCode, output)
			} : { resultHash: execHash };
		}
	}
	if (toolName === "write" && isWriteNoProgressOutcome(details)) return {
		resultHash: digestToolOutcome({ status: "unchanged" }),
		noProgress: true
	};
	if (isKnownPollToolCall(toolName, params) && toolName === "process" && isPlainObject(params)) {
		const action = params.action;
		if (action === "poll") return { resultHash: digestToolOutcome({
			action,
			status: details.status,
			exitCode: details.exitCode ?? null,
			exitSignal: details.exitSignal ?? null,
			aggregated: details.aggregated ?? null,
			text
		}) };
		if (action === "log") return { resultHash: digestToolOutcome({
			action,
			status: details.status,
			totalLines: details.totalLines ?? null,
			totalChars: details.totalChars ?? null,
			truncated: details.truncated ?? null,
			exitCode: details.exitCode ?? null,
			exitSignal: details.exitSignal ?? null,
			text
		}) };
	}
	if (isVolatileSendResult(toolName, params)) return { resultHash: digestToolOutcome(stripVolatileSendIds(details)) };
	return { resultHash: digestToolOutcome({
		details,
		text
	}) };
}
function getUnknownToolRepeatStreak(history, toolName) {
	let streak = 0;
	let repeatedUnknownToolName;
	for (let i = history.length - 1; i >= 0; i -= 1) {
		const record = history[i];
		if (!record || record.toolName !== toolName || !record.unknownToolName) break;
		if (!repeatedUnknownToolName) {
			repeatedUnknownToolName = record.unknownToolName;
			streak = 1;
			continue;
		}
		if (record.unknownToolName !== repeatedUnknownToolName) break;
		streak += 1;
	}
	return {
		count: streak,
		unknownToolName: repeatedUnknownToolName
	};
}
function getPingPongStreak(history, currentSignature) {
	const last = history.at(-1);
	if (!last) return {
		count: 0,
		noProgressEvidence: false
	};
	const other = history.findLast((call) => call.argsHash !== last.argsHash);
	if (!other?.argsHash || !other.toolName || currentSignature !== other.argsHash) return {
		count: 0,
		noProgressEvidence: false
	};
	let alternatingTailCount = 0;
	for (const call of history.toReversed()) {
		const expected = alternatingTailCount % 2 === 0 ? last.argsHash : other.argsHash;
		if (call.argsHash !== expected) break;
		alternatingTailCount += 1;
	}
	if (alternatingTailCount < 2) return {
		count: 0,
		noProgressEvidence: false
	};
	const resultHashes = /* @__PURE__ */ new Map();
	const stableOutcomes = history.slice(-alternatingTailCount).every((call) => {
		const previousHash = resultHashes.get(call.argsHash);
		if (!call.resultHash || previousHash && previousHash !== call.resultHash) return false;
		resultHashes.set(call.argsHash, call.resultHash);
		return true;
	});
	return {
		count: alternatingTailCount + 1,
		pairedToolName: last.toolName,
		pairedSignature: last.argsHash,
		noProgressEvidence: stableOutcomes && resultHashes.size === 2
	};
}
function canonicalPairKey(signatureA, signatureB) {
	return [signatureA, signatureB].toSorted().join("|");
}
function detectToolCallLoop(state, toolName, params, config, scope) {
	if (!config?.enabled) return { stuck: false };
	const history = selectHistoryForScope(state.toolCallHistory ?? [], scope);
	const currentHash = hashToolCall(toolName, params);
	const unknownToolStreak = getUnknownToolRepeatStreak(history, toolName);
	const noProgress = getNoProgressStreak(history, toolName, currentHash);
	const noProgressStreak = noProgress.count;
	const argumentChurn = getArgumentChurnNoProgressStreak(history, toolName, currentHash);
	const knownPollTool = isKnownPollToolCall(toolName, params);
	const pingPong = getPingPongStreak(history, currentHash);
	const argumentChurnLivenessSignal = argumentChurn.count >= 10 ? "argument_churn" : void 0;
	if (unknownToolStreak.count >= 10) return {
		stuck: true,
		level: "critical",
		detector: "unknown_tool_repeat",
		count: unknownToolStreak.count,
		message: `CRITICAL: attempted unavailable tool ${unknownToolStreak.unknownToolName ?? toolName} ${unknownToolStreak.count} times. Stop retrying that missing tool and answer without it.`,
		warningKey: `unknown-tool:${toolName}:${unknownToolStreak.unknownToolName ?? "unknown"}`
	};
	if (noProgressStreak >= GLOBAL_CIRCUIT_BREAKER_THRESHOLD) {
		log.error(`Global circuit breaker triggered: ${toolName} repeated ${noProgressStreak} times with no progress`);
		return {
			stuck: true,
			level: "critical",
			detector: "global_circuit_breaker",
			count: noProgressStreak,
			message: `CRITICAL: ${toolName} repeated identical no-progress outcomes ${noProgressStreak} times. Session execution blocked by global circuit breaker to prevent runaway loops.`,
			warningKey: `global:${toolName}:${currentHash}:${noProgress.latestResultHash ?? "none"}`
		};
	}
	if (knownPollTool && noProgressStreak >= (toolName === "wait" ? 10 : CRITICAL_THRESHOLD)) {
		log.error(`Critical polling loop detected: ${toolName} repeated ${noProgressStreak} times`);
		return {
			stuck: true,
			level: "critical",
			detector: "known_poll_no_progress",
			count: noProgressStreak,
			message: `CRITICAL: Called ${toolName} with identical arguments and no progress ${noProgressStreak} times. This appears to be a stuck polling loop. Session execution blocked to prevent resource waste.`,
			warningKey: `poll:${toolName}:${currentHash}:${noProgress.latestResultHash ?? "none"}`
		};
	}
	if (knownPollTool && noProgressStreak >= 10) {
		log.warn(`Polling loop warning: ${toolName} repeated ${noProgressStreak} times`);
		return {
			stuck: true,
			level: "warning",
			detector: "known_poll_no_progress",
			count: noProgressStreak,
			message: `WARNING: You have called ${toolName} ${noProgressStreak} times with identical arguments and no progress. Stop polling and either (1) increase wait time between checks, or (2) report the task as failed if the process is stuck.`,
			warningKey: `poll:${toolName}:${currentHash}:${noProgress.latestResultHash ?? "none"}`,
			...argumentChurnLivenessSignal ? { livenessSignal: argumentChurnLivenessSignal } : {}
		};
	}
	const pingPongWarningKey = pingPong.pairedSignature ? `pingpong:${canonicalPairKey(currentHash, pingPong.pairedSignature)}` : `pingpong:${toolName}:${currentHash}`;
	if (pingPong.count >= CRITICAL_THRESHOLD && pingPong.noProgressEvidence) {
		log.error(`Critical ping-pong loop detected: alternating calls count=${pingPong.count} currentTool=${toolName}`);
		return {
			stuck: true,
			level: "critical",
			detector: "ping_pong",
			count: pingPong.count,
			message: `CRITICAL: You are alternating between repeated tool-call patterns (${pingPong.count} consecutive calls) with no progress. This appears to be a stuck ping-pong loop. Session execution blocked to prevent resource waste.`,
			pairedToolName: pingPong.pairedToolName,
			warningKey: pingPongWarningKey
		};
	}
	if (pingPong.count >= 10) {
		log.warn(`Ping-pong loop warning: alternating calls count=${pingPong.count} currentTool=${toolName}`);
		return {
			stuck: true,
			level: "warning",
			detector: "ping_pong",
			count: pingPong.count,
			message: `WARNING: You are alternating between repeated tool-call patterns (${pingPong.count} consecutive calls). This looks like a ping-pong loop; stop retrying and report the task as failed.`,
			pairedToolName: pingPong.pairedToolName,
			warningKey: pingPongWarningKey,
			...argumentChurnLivenessSignal ? { livenessSignal: argumentChurnLivenessSignal } : {}
		};
	}
	const recentCount = history.filter((h) => h.toolName === toolName && h.argsHash === currentHash).length;
	if (!knownPollTool && noProgressStreak >= CRITICAL_THRESHOLD) {
		log.error(`Critical generic loop detected: ${toolName} repeated ${noProgressStreak} times`);
		return {
			stuck: true,
			level: "critical",
			detector: "generic_repeat",
			count: noProgressStreak,
			message: `CRITICAL: Called ${toolName} with identical outcomes ${noProgressStreak} times. Session execution blocked to prevent runaway loops.`,
			warningKey: `generic:${toolName}:${currentHash}:${noProgress.latestResultHash ?? "none"}`
		};
	}
	if (argumentChurn.count >= 10) {
		log.warn(`Argument churn warning: ${toolName} cycled through stable argument patterns`);
		return buildArgumentChurnWarning(toolName, argumentChurn);
	}
	if (!knownPollTool && recentCount >= 10) {
		log.warn(`Loop warning: ${toolName} called ${recentCount} times with identical arguments`);
		return {
			stuck: true,
			level: "warning",
			detector: "generic_repeat",
			count: recentCount,
			message: `WARNING: You have called ${toolName} ${recentCount} times with identical arguments. If this is not making progress, stop retrying and report the task as failed.`,
			warningKey: `generic:${toolName}:${currentHash}`
		};
	}
	return { stuck: false };
}
function recordToolCall(state, toolName, params, toolCallId, _config, scope) {
	const runId = normalizeOptionalString(scope?.runId);
	if (!state.toolCallHistory) state.toolCallHistory = [];
	state.toolCallHistory.push({
		toolName,
		argsHash: hashToolCall(toolName, params),
		toolCallId,
		...runId && { runId },
		timestamp: Date.now()
	});
	if (state.toolCallHistory.length > TOOL_CALL_HISTORY_SIZE) state.toolCallHistory.splice(0, state.toolCallHistory.length - TOOL_CALL_HISTORY_SIZE);
}
function recordToolCallOutcome(state, params) {
	const runId = normalizeOptionalString(params.runId);
	const outcome = hashToolOutcome(params.toolName, params.toolParams, params.result, params.error);
	if (!outcome.resultHash && !outcome.outcomeKind) return;
	if (!state.toolCallHistory) state.toolCallHistory = [];
	const argsHash = hashToolCall(params.toolName, params.toolParams);
	let recordedOutcome = state.toolCallHistory.findLast((call) => call && normalizeOptionalString(call.runId) === runId && (!params.toolCallId || call.toolCallId === params.toolCallId) && call.toolName === params.toolName && call.argsHash === argsHash && call.resultHash === void 0 && call.outcomeKind === void 0);
	if (!recordedOutcome) {
		recordedOutcome = {
			toolName: params.toolName,
			argsHash,
			toolCallId: params.toolCallId,
			...runId && { runId },
			timestamp: Date.now()
		};
		state.toolCallHistory.push(recordedOutcome);
	}
	recordedOutcome.outcomeKind = outcome.outcomeKind;
	recordedOutcome.resultHash = outcome.resultHash;
	recordedOutcome.failureIdentityHash = outcome.failureIdentityHash;
	recordedOutcome.unknownToolName = outcome.unknownToolName;
	if (outcome.noProgress) recordedOutcome.noProgress = true;
	else delete recordedOutcome.noProgress;
	if (state.toolCallHistory.length > TOOL_CALL_HISTORY_SIZE) state.toolCallHistory.splice(0, state.toolCallHistory.length - TOOL_CALL_HISTORY_SIZE);
	return recordedOutcome;
}
//#endregion
export { recordProgressCardToolOutcome as a, recordCodeModeToolOutcome as c, recordToolCallOutcome as i, hashToolCall as n, resolveToolLoopWarningThreshold as o, recordToolCall as r, getArgumentChurnNoProgressStreak as s, detectToolCallLoop as t };
