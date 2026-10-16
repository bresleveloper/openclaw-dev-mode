import { f as normalizeStringifiedEntries, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { b as createAgentRunStaleLifecycleError, t as assertAgentRunLifecycleGenerationCurrent, u as isAgentEventLifecycleGenerationCurrent, x as isAgentRunStaleLifecycleError } from "./agent-events-GvNTkbe3.mjs";
import { a as buildOAuthRefreshFailureLoginCommand, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure, s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { r as SILENT_REPLY_TOKEN, s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { E as setReplyPayloadMetadata, S as markReplyPayloadForSourceSuppressionDelivery, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, v as isReplyPayloadTerminalContent } from "./reply-payload-NzglYOOT.mjs";
import { k as isProviderAuthError } from "./model-auth-provider-config-U8dA4bob.mjs";
import { g as resolveExecutionApprovalFailureMessage } from "./message-patterns-Oyttjfxg.mjs";
import { a as isFailoverError } from "./error-B1Zb0HrJ.mjs";
import { i as isAgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { A as sanitizeUserFacingText, S as renderRateLimitReplyCopy, a as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, b as renderMissingApiKeyReplyCopy, g as renderCliTimeoutReplyCopy, h as renderBillingReplyCopy, i as GENERIC_EXTERNAL_RUN_FAILURE_TEXT, m as renderAuthProfileFailoverCopy, n as renderUserFacingText, t as renderAgentHarnessPreflightUserMessage, v as renderFailoverCodeUserCopy, x as renderRateLimitOrOverloadedCopy, y as renderHeartbeatRunFailureCopy } from "./user-facing-text-DC1sCo4O.mjs";
import { a as renderAssistantRequestFailureCopy, c as renderRuntimeCoordinationFailureCopy } from "./assistant-request-failure-copy-vZEGdJcT.mjs";
import { a as readSessionEntryInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-DWr6djSD.mjs";
import { a as hasRestartRecoveryTerminalRun, i as hasRestartRecoverySourceClaim, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-IiHiWzPq.mjs";
import { a as sessionMatchesExpectedTranscriptTurn, i as buildRestartRecoveryExpectedState } from "./session-turn.kernel-BgyMSLiQ.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-PQSbpEtY.mjs";
import { a as findCliTerminalStopError, d as isNonProviderRuntimeCoordinationError, o as findCliTimeoutError } from "./failover-error-BQyc9xYu.mjs";
import { r as classifyCompactionReason, t as resolveReplyFailoverFacts } from "./request-error-facts-_2vWT9or.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BB6wFir2.mjs";
import { t as SkillResourceDeliveryLimitError } from "./resource-delivery-error-CFKvWByr.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-gHCWblhB.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-98j7PlVT.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
import { randomUUID } from "node:crypto";
//#region src/auto-reply/reply/reply-admission-ticket.ts
const REPLY_ADMISSION_TICKET = Symbol("openclaw.replyAdmissionTicket");
const replyAdmissionTickets = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.replyAdmissionTickets"));
/** Briefly orders queue publication across a command's source and target sessions. */
function reserveReplyAdmissionTicket(sessionKeys) {
	return replyAdmissionTickets.reserve(normalizeStringifiedEntries(sessionKeys));
}
//#endregion
//#region src/auto-reply/reply/agent-runner-failure-reply.ts
function readFallbackAttempts(error) {
	return isFailoverError(error) && Array.isArray(error.attempts) ? error.attempts : [];
}
function resolveReplyFailureSummary(params) {
	const attempts = params.attempts;
	let kind = params.reason;
	if (attempts?.length) {
		if (attempts.some((attempt) => attempt.reason === "billing")) kind = "billing";
		else if (attempts.every((attempt) => attempt.reason === "overloaded")) kind = "overloaded";
		else kind = attempts.every((attempt) => attempt.reason === "rate_limit" || attempt.reason === "overloaded") ? "rate_limit" : void 0;
	}
	if (kind !== "billing" && kind !== "rate_limit" && kind !== "overloaded") return;
	const failoverError = isFailoverError(params.error) ? params.error : void 0;
	const text = kind === "billing" ? renderBillingReplyCopy({
		attempts,
		provider: failoverError?.provider,
		model: failoverError?.model,
		authMode: failoverError?.authMode
	}) : kind === "overloaded" ? renderRateLimitOrOverloadedCopy({
		reason: kind,
		raw: params.message
	}) : renderRateLimitReplyCopy({
		message: params.message,
		reason: params.reason,
		attempts,
		provider: failoverError?.provider,
		cooldownExpiry: failoverError?.soonestCooldownExpiry,
		sanitizeText: (rawText) => sanitizeUserFacingText(rawText, { errorContext: true })
	});
	return {
		kind,
		text
	};
}
function collapseRepeatedFailureDetail(message) {
	const parts = message.split(/\s+\|\s+/u).map((part) => part.trim()).filter(Boolean);
	if (parts.length >= 2 && parts.every((part) => part === parts[0])) return expectDefined(parts[0], "parts entry at 0");
	return message.trim();
}
const EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS = 900;
const PREFLIGHT_COMPACTION_FAILURE_PREFIX = "Preflight compaction required but failed:";
function isNonDirectConversationContext(ctx) {
	const chatType = normalizeLowercaseStringOrEmpty(ctx.ChatType);
	return chatType === "group" || chatType === "channel";
}
function isVerboseFailureDetailEnabled(level) {
	return level === "on" || level === "full";
}
const CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE = /\bcodex app-server client closed before turn completed\b/iu;
const CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE = /\bcodex app-server turn idle timed out waiting for turn\/completed\b/iu;
const CODEX_SESSION_GENERATION_NOT_CURRENT_RE = /\bcodex session generation is no longer current\b/iu;
const CODEX_EXECUTION_NODE_DISCONNECTED_RE = /^Codex execution node disconnected; start a fresh attempt\. \((?:execution node (?:failed|disconnected)|execution socket (?:closed|failed))(?:: [^\r\n]{1,240})?\)(?:\r?\n|$)/u;
function buildCodexAppServerFailureText(message) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (CODEX_SESSION_GENERATION_NOT_CURRENT_RE.test(normalizedMessage)) return "⚠️ This Codex session changed before your message could run. Please send it again.";
	if (CODEX_EXECUTION_NODE_DISCONNECTED_RE.test(normalizedMessage)) return "⚠️ Codex execution node disconnected. Start a fresh attempt.";
	if (CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE.test(normalizedMessage)) return "⚠️ Lost the connection to Codex before it confirmed the task was finished. It may still be running. Check the conversation in the Control UI before trying again.";
	if (CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE.test(normalizedMessage)) return "⚠️ Codex hasn't confirmed whether the task finished. It may still be running. Check the conversation in the Control UI before trying again.";
	return null;
}
/** Formats the reply shown when preflight compaction fails before a run. */
function buildPreflightCompactionFailureText(message, options) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (!normalizedMessage.startsWith(PREFLIGHT_COMPACTION_FAILURE_PREFIX)) return null;
	const reason = renderUserFacingText(normalizedMessage.slice(41), { errorContext: true }).trim().replace(/\s+/gu, " ");
	const isTimeout = classifyCompactionReason(reason) === "timeout";
	const reasonSuffix = options?.includeDetails && reason && !isTimeout ? ` Reason: ${reason}.` : "";
	return `${isTimeout ? "⚠️ This conversation is too long, and shortening it took too long." : "⚠️ This conversation is too long, and OpenClaw couldn't shorten it."}${reasonSuffix} Try again, use /compact, or use /new to start a fresh session.`;
}
function buildAuthProfileFailoverFailureText(error) {
	if (!isFailoverError(error) || !error.provider || !error.authProfileFailure) return null;
	return renderAuthProfileFailoverCopy({
		reason: error.reason,
		provider: error.provider,
		allInCooldown: error.authProfileFailure.allInCooldown,
		recoveryHint: buildProviderAuthRecoveryHint({ provider: error.provider })
	});
}
function resolveExternalRunFailureDetail(message) {
	const sanitized = message.trim().replace(/^⚠️\s*/u, "").replace(/\s+/gu, " ");
	return sanitized.length > EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS ? `${truncateUtf16Safe(sanitized, 899).trimEnd()}…` : sanitized || void 0;
}
function formatForwardedExternalRunFailureText(message) {
	const detail = resolveExternalRunFailureDetail(message);
	return detail ? `⚠️ Agent failed before reply: ${detail}${/[.!?]$/u.test(detail) ? "" : "."} Please try again, or use /new to start a fresh session.` : GENERIC_EXTERNAL_RUN_FAILURE_TEXT;
}
function hasLocalWorkerTimeoutCause(error) {
	let localTimeout = false;
	for (const candidate of collectErrorGraphCandidates(error, readErrorCauses)) {
		if (isFailoverError(candidate)) continue;
		const original = asOptionalObjectRecord(candidate);
		if (original?.status !== void 0 || original?.statusCode !== void 0) return false;
		localTimeout ||= readErrorName(candidate) === "WorkerTaskError" && extractErrorCode(candidate) === "timeout";
	}
	return localTimeout;
}
function buildExternalRunFailureReply(input, options) {
	const message = typeof input === "string" ? input : input.message;
	const error = typeof input === "string" ? void 0 : input.error;
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	const useHeartbeatFailureCopy = options?.useHeartbeatFailureCopy ?? options?.isHeartbeat === true;
	const approvalMessage = resolveExecutionApprovalFailureMessage(normalizedMessage);
	if (approvalMessage) return {
		text: `⚠️ ${approvalMessage}`,
		isGenericRunnerFailure: false
	};
	if (collectErrorGraphCandidates(error, readErrorCauses).some((candidate) => candidate instanceof SkillResourceDeliveryLimitError)) return {
		text: "⚠️ Selected skill resources exceed the 8 MiB delivery limit. Select fewer skills, then try again.",
		isGenericRunnerFailure: false
	};
	if (isAgentHarnessPreflightError(error)) {
		const userMessage = renderAgentHarnessPreflightUserMessage(error);
		if (userMessage !== void 0) return {
			text: userMessage,
			isGenericRunnerFailure: false
		};
		const sanitizedMessage = sanitizeUserFacingText(normalizedMessage, { errorContext: true });
		return {
			text: useHeartbeatFailureCopy ? renderHeartbeatRunFailureCopy(resolveExternalRunFailureDetail(sanitizedMessage)) : options?.includeDetails ? formatForwardedExternalRunFailureText(sanitizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isGenericRunnerFailure: !options?.isHeartbeat
		};
	}
	const failoverFacts = options?.failoverFacts ?? resolveReplyFailoverFacts(error ?? normalizedMessage, normalizedMessage);
	const failoverCodeCopy = renderFailoverCodeUserCopy(failoverFacts.code);
	if (failoverCodeCopy) return {
		text: failoverCodeCopy,
		isGenericRunnerFailure: false
	};
	const runtimeCoordinationFailure = failoverFacts.code && isNonProviderRuntimeCoordinationError(error) ? renderRuntimeCoordinationFailureCopy(failoverFacts.code) : void 0;
	if (runtimeCoordinationFailure) return {
		text: runtimeCoordinationFailure,
		isGenericRunnerFailure: false
	};
	const oauthRefreshFailure = classifyOAuthRefreshFailureError(error) ?? classifyOAuthRefreshFailure(normalizedMessage);
	const providerLoginRecovery = buildProviderLoginRecovery({
		provider: oauthRefreshFailure ? oauthRefreshFailure.provider ?? void 0 : failoverFacts.provider,
		oauthReason: oauthRefreshFailure?.reason,
		failoverReason: failoverFacts.reason,
		authMode: failoverFacts.authMode
	});
	if (oauthRefreshFailure) {
		const loginCommand = buildOAuthRefreshFailureLoginCommand(oauthRefreshFailure.provider, { profileId: options?.includeAuthProfileId ? oauthRefreshFailure.profileId : void 0 });
		const loginCommandMarkdown = formatOAuthRefreshFailureLoginCommandMarkdown(loginCommand);
		const providerText = oauthRefreshFailure.provider ? ` for ${oauthRefreshFailure.provider}` : "";
		const retryLoginHint = providerLoginRecovery ? "send `/login` from a private chat or Control UI session to choose a provider, or re-auth" : "re-auth";
		if (oauthRefreshFailure.reason) return {
			text: providerLoginRecovery ? `⚠️ ${providerLoginRecovery.hint} You can also re-auth with ${loginCommandMarkdown} on the gateway.` : `⚠️ Model login expired on the gateway${providerText}. Re-auth with ${loginCommandMarkdown} in a terminal, then try again.`,
			...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
			isGenericRunnerFailure: false
		};
		return {
			text: `⚠️ Model login failed on the gateway${providerText}. Please try again. If this keeps happening, ${retryLoginHint} with ${loginCommandMarkdown} in a terminal.`,
			isGenericRunnerFailure: false
		};
	}
	const authProfileFailoverFailure = buildAuthProfileFailoverFailureText(error);
	if (authProfileFailoverFailure) return {
		text: providerLoginRecovery ? `${providerLoginRecovery.hint}\n\n${authProfileFailoverFailure}` : authProfileFailoverFailure,
		...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
		isGenericRunnerFailure: false
	};
	const cliTerminalStopError = findCliTerminalStopError(error);
	if (cliTerminalStopError) return {
		text: renderUserFacingText(cliTerminalStopError.message, { errorContext: true }),
		isGenericRunnerFailure: false
	};
	const cliTimeoutError = findCliTimeoutError(error);
	const cliBackendTimeoutFailure = renderCliTimeoutReplyCopy({
		message: normalizedMessage,
		cliTimeout: cliTimeoutError?.cliTimeout,
		provider: cliTimeoutError?.provider,
		replayPrevented: options?.replayPrevented
	});
	if (cliBackendTimeoutFailure) return {
		text: cliBackendTimeoutFailure,
		isGenericRunnerFailure: false
	};
	const providerRequestError = failoverFacts.providerRequestError;
	if (providerRequestError) return {
		text: providerRequestError.userMessage,
		isGenericRunnerFailure: false
	};
	const authError = isProviderAuthError(error) ? error : void 0;
	const missingApiKeyFailure = renderMissingApiKeyReplyCopy(authError ? {
		provider: authError.provider,
		providerGuidance: authError.providerGuidance
	} : void 0);
	if (missingApiKeyFailure) return {
		text: missingApiKeyFailure,
		isGenericRunnerFailure: false
	};
	if (options?.isHeartbeat) {
		const sanitizedMessage = sanitizeUserFacingText(normalizedMessage, { errorContext: true });
		const detail = options.includeDetails ? resolveExternalRunFailureDetail(sanitizedMessage) : void 0;
		return {
			text: useHeartbeatFailureCopy ? renderHeartbeatRunFailureCopy(detail) : options.includeDetails ? formatForwardedExternalRunFailureText(sanitizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isGenericRunnerFailure: false
		};
	}
	const codexAppServerFailure = buildCodexAppServerFailureText(normalizedMessage);
	if (codexAppServerFailure) return {
		text: codexAppServerFailure,
		isGenericRunnerFailure: false
	};
	if (failoverFacts.reason === "timeout" && hasLocalWorkerTimeoutCause(error)) return {
		text: "A local worker task timed out. Please try again.",
		isGenericRunnerFailure: false
	};
	const classifiedFailure = failoverFacts.formatFailureText ?? renderAssistantRequestFailureCopy(failoverFacts);
	if (classifiedFailure) return {
		text: classifiedFailure,
		isGenericRunnerFailure: false
	};
	return {
		text: options?.includeDetails ? formatForwardedExternalRunFailureText(renderUserFacingText(normalizedMessage, { errorContext: true })) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: true
	};
}
function markAgentRunFailureReplyPayload(payload) {
	const marked = markReplyPayloadForSourceSuppressionDelivery(payload);
	if (!isSilentReplyText(marked.text, "NO_REPLY")) marked.isError = true;
	return marked;
}
function markPostCompactionModelFailurePayload(postCompactionModelFailure, payload) {
	return postCompactionModelFailure === true && payload.isError === true && isReplyPayloadTerminalContent(payload) && typeof payload.text === "string" ? setReplyPayloadMetadata(payload, { postCompactionModelFailure: true }) : payload;
}
function renderPostCompactionModelFailurePayload(payload) {
	return getReplyPayloadMetadata(payload)?.postCompactionModelFailure === true && typeof payload.text === "string" ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: `⚠️ Context compaction succeeded, but the later model request still failed. ${payload.text.replace(/^⚠️\s*/u, "")}`
	}) : payload;
}
/** Optional silence hides generic boilerplate, not guidance or the outcome of visible work. */
function resolveAgentRunFailureText(params) {
	return params.replyExpectation === "optional" && params.isGenericRunnerFailure && !params.visibleReplyDelivered ? SILENT_REPLY_TOKEN : params.text;
}
function buildTerminalAgentRunFailureReplyPayload(params) {
	const useHeartbeatFailureCopy = params.useHeartbeatFailureCopy ?? params.isHeartbeat === true;
	return markAgentRunFailureReplyPayload({ text: resolveAgentRunFailureText({
		...params,
		text: useHeartbeatFailureCopy ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: !params.isHeartbeat
	}) });
}
function buildEmptyInteractiveReplyPayload(params) {
	if (params.completion.outcome !== "missing") return;
	return markAgentRunFailureReplyPayload({ text: "I finished the turn, but it did not produce a visible reply. Please try again, or start a new session if this keeps happening." });
}
/** Converts known agent-run failures into user-facing reply payloads. */
function buildKnownAgentRunFailureReplyPayload(params) {
	if (isAgentHarnessPreflightError(params.err)) {
		const reply = buildExternalRunFailureReply({
			message: params.err.message,
			error: params.err
		});
		return reply.isGenericRunnerFailure ? void 0 : markAgentRunFailureReplyPayload({ text: reply.text });
	}
	const message = formatErrorMessage(params.err);
	const failoverFacts = resolveReplyFailoverFacts(params.err, message);
	const failureSummary = resolveReplyFailureSummary({
		error: params.err,
		message,
		reason: failoverFacts.reason,
		attempts: readFallbackAttempts(params.err)
	});
	const knownFailureText = failureSummary?.kind === "billing" ? failureSummary.text : buildPreflightCompactionFailureText(message, { includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) }) ?? failureSummary?.text;
	const externalRunFailureReply = knownFailureText ? {
		text: knownFailureText,
		isGenericRunnerFailure: false
	} : buildExternalRunFailureReply({
		message,
		error: params.err
	}, {
		includeAuthProfileId: !isNonDirectConversationContext(params.sessionCtx),
		includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel),
		failoverFacts
	});
	if (externalRunFailureReply.isGenericRunnerFailure) return;
	return markAgentRunFailureReplyPayload({
		text: externalRunFailureReply.text,
		...externalRunFailureReply.presentation ? { presentation: externalRunFailureReply.presentation } : {}
	});
}
//#endregion
//#region src/auto-reply/reply/restart-recovery-claim.ts
/** Provider redelivery guard shared by ingress and the agent admission boundary. */
function isDuplicateRestartRecoverySource(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return Boolean(normalizedSourceTurnId && (hasRestartRecoveryTerminalRun(entry ?? void 0, normalizedSourceTurnId) || hasRestartRecoverySourceClaim(entry ?? void 0, normalizedSourceTurnId)));
}
async function retireTerminalRestartRecoverySourceClaim(params) {
	let didRetire = false;
	const retired = await updateSessionEntry({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (current) => {
		if (current.sessionId !== params.sessionId || current.status === "running" || current.restartRecoveryDeliveryReceiptState === "terminal-pending" || !hasRestartRecoverySourceClaim(current, params.sourceTurnId)) return null;
		didRetire = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true,
				terminalSourceRunId: params.sourceTurnId
			}),
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return didRetire ? retired ?? void 0 : void 0;
}
function createReplyRestartRecoveryClaimController(params) {
	let recoveryRunId = randomUUID();
	let recoverySourceRunId;
	let trackedSessionId;
	let tracked = false;
	let confirmedArmed = false;
	const assertReadCurrent = () => {
		if (params.lifecycleGeneration) assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	};
	const persistAdmissionPatch = async (options) => {
		const expectedSessionState = buildRestartRecoveryExpectedState(options.entry);
		if (options.recorder && !options.recorder.hasPersisted()) {
			const result = await options.recorder.persistApproved({
				target: params.resolveUserTurnTarget?.({
					entry: options.entry,
					sessionId: options.sessionId,
					sessionKey: options.sessionKey,
					storePath: options.storePath
				}),
				expectedSessionId: options.sessionId,
				expectedSessionState,
				sessionLifecyclePatch: options.patch
			});
			if (!result?.sessionEntry) throw new Error("session changed before durable user-turn admission");
			return result.sessionEntry;
		}
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: options.storePath,
			sessionKey: options.sessionKey
		}, (current) => sessionMatchesExpectedTranscriptTurn({ entry: current }, {
			expectedSessionId: options.sessionId,
			expectedSessionState
		}) ? options.patch : null);
		if (!persisted) throw new Error("restart recovery claim changed before agent adoption");
		return persisted;
	};
	const persistUserTurnOnly = async (recorder, sessionId) => {
		if (!recorder || recorder.hasPersisted()) return;
		const entry = params.getEntry();
		const target = entry && params.sessionKey && params.storePath ? params.resolveUserTurnTarget?.({
			entry,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) : void 0;
		const result = await recorder.persistApproved({
			target,
			expectedSessionId: sessionId
		});
		if (!result) throw new Error("session changed before durable user-turn admission");
		if (result.sessionEntry) params.setEntry(result.sessionEntry);
	};
	const admitUserTurn = async (recorder) => {
		if (!params.sessionKey || !params.storePath) {
			await recorder?.persistApproved();
			return "admitted";
		}
		const sessionId = params.getSessionId();
		const entry = await readSessionEntryInWorker({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, assertReadCurrent) ?? params.getEntry();
		assertReadCurrent();
		if (!entry || entry.sessionId !== sessionId || params.getSessionId() !== sessionId) throw new Error("session changed before durable user-turn admission");
		const admissionRunId = normalizeOptionalString(params.admissionRunId);
		const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
		const activeClaimRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
		const isExactRecoveryClaim = admissionRunId && activeClaimRunId === admissionRunId;
		if (sourceTurnId) {
			if (hasRestartRecoveryTerminalRun(entry, sourceTurnId)) return "duplicate-source";
			if (!isExactRecoveryClaim && hasRestartRecoverySourceClaim(entry, sourceTurnId)) {
				if (entry.status !== "running") {
					const retired = await retireTerminalRestartRecoverySourceClaim({
						agentId: params.agentId,
						sessionId,
						sessionKey: params.sessionKey,
						sourceTurnId,
						storePath: params.storePath
					});
					if (retired) params.setEntry(retired);
				}
				return "duplicate-source";
			}
		}
		if (recorder?.getPendingInputMessage?.() && !recorder.hasPersisted()) {
			const placement = resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([sessionId]).get(sessionId);
			if (placement && placement.state !== "local") return "admitted";
		}
		if (isExactRecoveryClaim) {
			if (entry.status !== "running" || entry.abortedLastRun === true) throw new Error("restart recovery claim changed before agent adoption");
			const preservesTerminalReceipt = entry.restartRecoveryDeliveryReceiptState === "terminal-pending";
			const adopted = await persistAdmissionPatch({
				entry,
				patch: {
					restartRecoveryBeforeAgentReplyState: void 0,
					...preservesTerminalReceipt ? {} : {
						restartRecoveryDeliveryReceiptState: void 0,
						restartRecoveryDeliveryToolCallId: void 0,
						restartRecoveryDeliveryRequestFingerprint: void 0
					},
					restartRecoverySourceIngress: entry.restartRecoverySourceIngress ?? "control-ui",
					updatedAt: Date.now()
				},
				recorder,
				sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
			params.setEntry(adopted);
			recoveryRunId = admissionRunId;
			recoverySourceRunId = normalizeOptionalString(adopted.restartRecoveryDeliverySourceRunId);
			trackedSessionId = adopted.sessionId;
			tracked = true;
			return "admitted";
		}
		const deliveryContext = params.resolveDeliveryContext(entry);
		const recoverableDeliveryContext = deliveryContext && sourceTurnId ? deliveryContext : void 0;
		if (recoverableDeliveryContext) {
			const sourceMessage = recorder?.getPersistedMessage?.() ?? await recorder?.resolveMessage();
			const persistedSourceTurnId = normalizeOptionalString(sourceMessage?.idempotencyKey);
			if (!recorder || persistedSourceTurnId !== sourceTurnId) throw new Error("channel restart recovery requires source-keyed user-turn admission");
		}
		if (!recoverableDeliveryContext && !activeClaimRunId) {
			await persistUserTurnOnly(recorder, sessionId);
			return "admitted";
		}
		const updatedAt = Date.now();
		if (activeClaimRunId && (entry.abortedLastRun === true || entry.status === "running" || entry.restartRecoveryDeliveryReceiptState === "terminal-pending")) throw new Error("restart recovery claim changed before agent adoption");
		const retiredClaim = activeClaimRunId ? buildRestartRecoveryClaimCleanupPatch({
			entry,
			recordTerminalSource: true,
			terminalSourceRunId: normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId)
		}) : {};
		const patch = recoverableDeliveryContext ? {
			...retiredClaim,
			abortedLastRun: false,
			endedAt: void 0,
			restartRecoveryBeforeAgentReplyState: void 0,
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			restartRecoveryDeliveryContext: recoverableDeliveryContext,
			restartRecoveryDeliveryRequestFingerprint: void 0,
			restartRecoveryDeliveryRunId: recoveryRunId,
			restartRecoveryDeliverySourceRunId: sourceTurnId,
			restartRecoveryRequesterAccountId: normalizeOptionalString(params.requesterAccountId),
			restartRecoveryRequesterSenderId: normalizeOptionalString(params.requesterSenderId),
			restartRecoverySameChannelThreadRequired: params.sameChannelThreadRequired === true ? true : void 0,
			restartRecoverySourceIngress: "channel",
			restartRecoverySourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			runtimeMs: void 0,
			startedAt: updatedAt,
			status: "running",
			updatedAt
		} : {
			...retiredClaim,
			updatedAt
		};
		const persisted = await persistAdmissionPatch({
			entry,
			patch,
			recorder,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		params.setEntry(persisted);
		recoverySourceRunId = normalizeOptionalString(persisted.restartRecoveryDeliverySourceRunId);
		tracked = persisted.restartRecoveryDeliveryRunId === recoveryRunId;
		trackedSessionId = tracked ? persisted.sessionId : void 0;
		return "admitted";
	};
	const updateBeforeAgentReply = async (expectedState, { state, pendingFinalDelivery }) => {
		if (!tracked || !params.sessionKey || !params.storePath) return;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => current.sessionId === params.getSessionId() && current.restartRecoveryDeliveryRunId === recoveryRunId && current.restartRecoveryDeliverySourceRunId === recoverySourceRunId && current.restartRecoveryBeforeAgentReplyState === expectedState ? {
			restartRecoveryBeforeAgentReplyState: state,
			...pendingFinalDelivery ? {
				pendingFinalDelivery: {
					...pendingFinalDelivery.text ? {
						kind: "replayable",
						text: pendingFinalDelivery.text
					} : { kind: "transport-only" },
					createdAt: updatedAt,
					...pendingFinalDelivery.intentId ? { intentId: pendingFinalDelivery.intentId } : {},
					deliveries: pendingFinalDelivery.deliveries,
					...pendingFinalDelivery.context ? { context: pendingFinalDelivery.context } : {}
				},
				restartRecoveryForceSafeTools: true
			} : {},
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error(`before_agent_reply ${expectedState === "pending" ? "checkpoint" : "start"} lost restart recovery ownership`);
		params.setEntry(persisted);
	};
	const clear = async () => {
		const lifecycleGeneration = params.lifecycleGeneration;
		if (!tracked || !params.sessionKey || !params.storePath || !lifecycleGeneration || params.isRestartAbort()) return;
		const persisted = await patchSessionEntryCore({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => {
			if (current.abortedLastRun === true && current.mainRestartRecovery !== void 0 || current.sessionId !== params.getSessionId() || current.restartRecoveryDeliveryRunId !== recoveryRunId) return null;
			const terminalPending = current.restartRecoveryDeliveryReceiptState === "terminal-pending";
			const preservesPendingFinal = !terminalPending && current.pendingFinalDelivery !== void 0;
			const completesHandledSilent = current.restartRecoveryBeforeAgentReplyState === "handled-silent" && !preservesPendingFinal;
			const endedAt = terminalPending || completesHandledSilent ? Date.now() : void 0;
			return {
				...buildRestartRecoveryClaimCleanupPatch({
					entry: current,
					recordTerminalSource: true,
					terminalSourceRunId: recoverySourceRunId
				}),
				...terminalPending ? { pendingFinalDelivery: void 0 } : {},
				...preservesPendingFinal ? {
					restartRecoveryBeforeAgentReplyState: current.restartRecoveryBeforeAgentReplyState,
					restartRecoverySourceIngress: current.restartRecoverySourceIngress,
					restartRecoveryForceSafeTools: current.restartRecoveryForceSafeTools
				} : {},
				...endedAt !== void 0 ? {
					abortedLastRun: terminalPending,
					endedAt,
					lifecycleRunId: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: terminalPending ? "failed" : "done"
				} : {},
				updatedAt: endedAt ?? Date.now()
			};
		}, { workerGuard: { assertCurrent: () => {
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (params.isRestartAbort()) throw createAgentRunStaleLifecycleError();
		} } });
		if (persisted) params.setEntry(persisted);
	};
	const isArmed = async () => {
		if (!tracked || !params.sessionKey || !params.storePath) return false;
		const isRetiredRestart = () => params.lifecycleGeneration ? params.isRestartAbort() && !isAgentEventLifecycleGenerationCurrent(params.lifecycleGeneration) : false;
		if (isRetiredRestart()) return confirmedArmed;
		try {
			const persisted = await readSessionEntryInWorker({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, assertReadCurrent);
			assertReadCurrent();
			const isTrackedClaim = (entry) => Boolean(entry && entry.sessionId === trackedSessionId && entry.restartRecoveryDeliveryRunId === recoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === recoverySourceRunId);
			if (!confirmedArmed) {
				const current = params.getEntry();
				confirmedArmed = isTrackedClaim(persisted) && persisted?.abortedLastRun === true || isTrackedClaim(current) && current?.abortedLastRun === true;
			}
			return confirmedArmed;
		} catch (error) {
			if (isAgentRunStaleLifecycleError(error) && isRetiredRestart()) return confirmedArmed;
			throw error;
		}
	};
	return {
		admitUserTurn,
		async beginBeforeAgentReply() {
			await updateBeforeAgentReply(void 0, { state: "pending" });
			return true;
		},
		checkpointBeforeAgentReply: (checkpoint) => updateBeforeAgentReply("pending", checkpoint),
		clear,
		isArmed
	};
}
//#endregion
//#region src/auto-reply/reply/stalled-turn-recovery.ts
/** Last-resort feedback once no continuation can answer a stalled turn. */
const STALLED_TURN_NOTICE_TEXT = "⚠️ This turn was interrupted because it stopped making progress. Please try again.";
const STALLED_TURN_GUIDANCE = "Your previous turn stopped making progress and was stopped before you replied, so the user's request from that turn is still unanswered. Answer it now, together with any newer message, from what the transcript already contains. Keep further tool use to a minimum, do not repeat actions that already ran, and briefly say what you could not verify.";
/** A stale watchdog expired this operation before it delivered output: the user saw nothing. */
function isReplyOperationStalledBeforeOutput(operation) {
	return operation?.result?.kind === "failed" && !operation.sourceReplyDelivered && operation.result.code === "run_stalled" && (operation.staleExpiryReason === "no_activity" || operation.staleExpiryReason === "stuck_recovery");
}
/** Builds the one recovery run that answers a stalled turn over its persisted transcript. */
function buildStalledTurnRecoveryRun(base) {
	const source = base.queuedFollowupReplyDisposition;
	return {
		...base,
		prompt: formatSystemTurnPrompt(STALLED_TURN_GUIDANCE),
		summaryLine: "stalled-turn-recovery",
		stalledTurnRecovery: true,
		disableCollectBatching: true,
		enqueuedAt: Date.now(),
		transcriptPrompt: void 0,
		userTurnTranscriptRecorder: void 0,
		currentInboundContext: void 0,
		images: void 0,
		imageOrder: void 0,
		media: void 0,
		abortSignal: void 0,
		turnAdoptionLifecycle: void 0,
		replyOperationRunStates: void 0,
		onQueueDisposition: void 0,
		queuedFollowupReplyDisposition: source?.kind === "deliver" ? {
			kind: "deliver",
			deliver: source.deliver.createSourceRetry?.() ?? source.deliver
		} : source,
		run: {
			...base.run,
			suppressNextUserMessagePersistence: true,
			skillLibraryAuthoring: base.run.skillLibraryAuthoring && {
				target: "personal",
				defaultTarget: "personal",
				multipleProfiles: base.run.skillLibraryAuthoring.multipleProfiles,
				bind: () => {},
				invoke: async () => {
					throw new SkillLibraryError("AUTHORITY_EXPIRED", "Skill authoring is unavailable while recovering an interrupted turn. Send a fresh message requesting the change.");
				}
			}
		}
	};
}
//#endregion
//#region src/auto-reply/reply/commentary-progress-owner.ts
/** Freezes and registers one commentary owner for the current agent turn. */
function resolveTurnCommentaryProgressOwner(params) {
	const shouldDeliverCommentaryPayloads = params.commentaryPayloadsEnabled ? params.options?.shouldDeliverCommentaryPayloads : void 0;
	const frozenVerboseProgressVisibility = shouldDeliverCommentaryPayloads ? params.resolveVerboseProgressVisibility() : void 0;
	params.options?.onVerboseProgressVisibility?.(frozenVerboseProgressVisibility === void 0 ? params.resolveVerboseProgressVisibility : () => frozenVerboseProgressVisibility);
	const commentaryPayloadsEnabled = params.commentaryPayloadsEnabled && (shouldDeliverCommentaryPayloads?.() ?? true);
	return {
		commentaryPayloadsEnabled,
		draftOwnsCommentaryProgress: params.commentaryPayloadsEnabled && shouldDeliverCommentaryPayloads !== void 0 && !commentaryPayloadsEnabled
	};
}
//#endregion
export { reserveReplyAdmissionTicket as C, REPLY_ADMISSION_TICKET as S, markAgentRunFailureReplyPayload as _, isReplyOperationStalledBeforeOutput as a, resolveAgentRunFailureText as b, retireTerminalRestartRecoverySourceClaim as c, buildExternalRunFailureReply as d, buildKnownAgentRunFailureReplyPayload as f, isVerboseFailureDetailEnabled as g, isNonDirectConversationContext as h, buildStalledTurnRecoveryRun as i, buildAuthProfileFailoverFailureText as l, buildTerminalAgentRunFailureReplyPayload as m, STALLED_TURN_GUIDANCE as n, createReplyRestartRecoveryClaimController as o, buildPreflightCompactionFailureText as p, STALLED_TURN_NOTICE_TEXT as r, isDuplicateRestartRecoverySource as s, resolveTurnCommentaryProgressOwner as t, buildEmptyInteractiveReplyPayload as u, markPostCompactionModelFailurePayload as v, resolveReplyFailureSummary as x, renderPostCompactionModelFailurePayload as y };
