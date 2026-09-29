import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { f as normalizeStringifiedEntries, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { E as extractErrorHttpStatus } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { b as createAgentRunStaleLifecycleError, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { a as buildOAuthRefreshFailureLoginCommand, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure, s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { B as isProviderAuthError } from "./loader-runtime-load-XbrcYJWd.mjs";
import { T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata, x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { a as isFailoverError } from "./error-ON38hPhx.mjs";
import { i as isAgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { h as sessionMatchesExpectedTranscriptTurn, m as buildRestartRecoveryExpectedState } from "./session-accessor-l-4ZHvKn.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import { a as hasRestartRecoveryTerminalRun, i as hasRestartRecoverySourceClaim, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-CVOwSXMV.mjs";
import { C as resolveProviderRequestFailureCopy, _ as renderHeartbeatRunFailureCopy, b as renderRateLimitReplyCopy, f as renderAuthProfileFailoverCopy, g as renderFailoverCodeUserCopy, m as renderCliTimeoutReplyCopy, n as GENERIC_EXTERNAL_RUN_FAILURE_TEXT, p as renderBillingReplyCopy, r as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, v as renderMissingApiKeyReplyCopy, w as classifyProviderRequestFacets, y as renderRateLimitOrOverloadedCopy } from "./user-copy-DfLWtdTx.mjs";
import { a as renderFormatErrorCopy, i as renderAssistantRequestFailureCopy } from "./assistant-request-failure-copy-D0cfsUk2.mjs";
import { i as sanitizeUserFacingText, n as renderUserFacingText, t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-D8c_iKUB.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-ZnvZHNe3.mjs";
import { t as classifyFailoverReason } from "./classify-DO9EO_30.mjs";
import { a as findCliTerminalStopError, i as describeFailoverError, o as findCliTimeoutError } from "./failover-error-C3SnWYBJ.mjs";
import "./embedded-agent-helpers-DGdaNc6w.mjs";
import { n as classifyCompactionReason } from "./compact-reasons-DQwVyt53.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BWahCZqw.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-MlB9PuXu.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-BLRgDgSo.mjs";
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
function resolveReplyFailoverFacts(error, message) {
	const described = describeFailoverError(error);
	const rawError = described.rawError ?? message;
	const status = extractErrorHttpStatus(rawError)?.code ?? described.status;
	const reason = described.reason ?? classifyFailoverReason(rawError, { provider: described.provider });
	const classification = reason ? {
		kind: "reason",
		reason
	} : null;
	return {
		reason: classification?.kind === "reason" ? classification.reason : void 0,
		code: described.code,
		provider: described.provider,
		model: described.model,
		status,
		authMode: described.authMode,
		formatFailureText: reason === "format" ? renderFormatErrorCopy(rawError) : void 0,
		providerRequestError: resolveProviderRequestFailureCopy({
			classification,
			facet: classifyProviderRequestFacets({
				status,
				message: rawError
			}),
			status,
			technicalMessage: message
		})
	};
}
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
function buildCodexAppServerFailureText(message) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (CODEX_SESSION_GENERATION_NOT_CURRENT_RE.test(normalizedMessage)) return "⚠️ This Codex session changed before your message could run. Please send it again.";
	if (CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE.test(normalizedMessage)) return "⚠️ Codex app-server connection closed before this turn finished. OpenClaw retried once when the stdio turn was still replay-safe; please try again if this keeps happening.";
	if (CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE.test(normalizedMessage)) return "⚠️ Codex app-server stopped before confirming turn completion. OpenClaw did not replay the turn automatically because it may still be active; try again, or use /new if the session stays stuck.";
	return null;
}
/** Formats the reply shown when preflight compaction fails before a run. */
function buildPreflightCompactionFailureText(message, options) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (!normalizedMessage.startsWith(PREFLIGHT_COMPACTION_FAILURE_PREFIX)) return null;
	const reason = renderUserFacingText(normalizedMessage.slice(41), { errorContext: true }).trim().replace(/\s+/gu, " ");
	const isTimeout = classifyCompactionReason(reason) === "timeout";
	const reasonSuffix = options?.includeDetails && reason && !isTimeout ? ` Reason: ${reason}.` : "";
	return `${isTimeout ? "⚠️ Context is too large and auto-compaction timed out before it could finish." : "⚠️ Context is too large and auto-compaction could not recover this turn."}${reasonSuffix} Try again, use /compact, or use /new to start a fresh session.`;
}
function buildAuthProfileFailoverFailureText(error) {
	if (!isFailoverError(error) || !error.provider || !error.authProfileFailure) return null;
	return renderAuthProfileFailoverCopy({
		reason: error.reason,
		provider: error.provider,
		allInCooldown: error.authProfileFailure.allInCooldown,
		causeText: error.cause ? formatErrorMessage(error.cause).trim() : void 0,
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
function buildExternalRunFailureReply(input, options) {
	const message = typeof input === "string" ? input : input.message;
	const error = typeof input === "string" ? void 0 : input.error;
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (isAgentHarnessPreflightError(error)) {
		const userMessage = renderAgentHarnessPreflightUserMessage(error);
		if (userMessage !== void 0) return {
			text: userMessage,
			isGenericRunnerFailure: false
		};
		const sanitizedMessage = sanitizeUserFacingText(normalizedMessage, { errorContext: true });
		return {
			text: options?.isHeartbeat ? renderHeartbeatRunFailureCopy(resolveExternalRunFailureDetail(sanitizedMessage)) : options?.includeDetails ? formatForwardedExternalRunFailureText(sanitizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isGenericRunnerFailure: !options?.isHeartbeat
		};
	}
	const failoverFacts = options?.failoverFacts ?? resolveReplyFailoverFacts(error ?? normalizedMessage, normalizedMessage);
	const failoverCodeCopy = renderFailoverCodeUserCopy(failoverFacts.code);
	if (failoverCodeCopy) return {
		text: failoverCodeCopy,
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
		const detail = options.includeDetails ? resolveExternalRunFailureDetail(sanitizeUserFacingText(normalizedMessage, { errorContext: true })) : void 0;
		return {
			text: renderHeartbeatRunFailureCopy(detail),
			isGenericRunnerFailure: false
		};
	}
	const codexAppServerFailure = buildCodexAppServerFailureText(normalizedMessage);
	if (codexAppServerFailure) return {
		text: codexAppServerFailure,
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
	return markAgentRunFailureReplyPayload({ text: resolveAgentRunFailureText({
		...params,
		text: params.isHeartbeat ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
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
	let tracked = false;
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
		const entry = loadSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false,
			hydrateSkillPromptRefs: false
		}) ?? params.getEntry();
		if (!entry || entry.sessionId !== sessionId) throw new Error("session changed before durable user-turn admission");
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
			restartRecoveryRequesterAccountId: sourceTurnId ? normalizeOptionalString(params.requesterAccountId) : void 0,
			restartRecoveryRequesterSenderId: sourceTurnId ? normalizeOptionalString(params.requesterSenderId) : void 0,
			restartRecoverySameChannelThreadRequired: sourceTurnId && params.sameChannelThreadRequired === true ? true : void 0,
			restartRecoverySourceIngress: sourceTurnId ? "channel" : void 0,
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
		return "admitted";
	};
	const checkpointBeforeAgentReply = async ({ state, pendingFinalDelivery }) => {
		if (!tracked || !params.sessionKey || !params.storePath) return;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => current.sessionId === params.getSessionId() && current.restartRecoveryDeliveryRunId === recoveryRunId && current.restartRecoveryDeliverySourceRunId === recoverySourceRunId && current.restartRecoveryBeforeAgentReplyState === "pending" ? {
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
		if (!persisted) throw new Error("before_agent_reply checkpoint lost restart recovery ownership");
		params.setEntry(persisted);
	};
	const beginBeforeAgentReply = async () => {
		if (!tracked || !params.sessionKey || !params.storePath) return true;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (persistedCurrent) => persistedCurrent.sessionId === params.getSessionId() && persistedCurrent.restartRecoveryDeliveryRunId === recoveryRunId && persistedCurrent.restartRecoveryDeliverySourceRunId === recoverySourceRunId && persistedCurrent.restartRecoveryBeforeAgentReplyState === void 0 ? {
			restartRecoveryBeforeAgentReplyState: "pending",
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error("before_agent_reply start lost restart recovery ownership");
		params.setEntry(persisted);
		return true;
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
			if (current.restartRecoveryDeliveryReceiptState === "terminal-pending") {
				const endedAt = Date.now();
				return {
					...buildRestartRecoveryClaimCleanupPatch({
						entry: current,
						recordTerminalSource: true,
						terminalSourceRunId: recoverySourceRunId
					}),
					abortedLastRun: true,
					endedAt,
					lifecycleRunId: void 0,
					pendingFinalDelivery: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "failed",
					updatedAt: endedAt
				};
			}
			const preservesPendingFinal = current.pendingFinalDelivery !== void 0;
			const endedAt = current.restartRecoveryBeforeAgentReplyState === "handled-silent" && !preservesPendingFinal ? Date.now() : void 0;
			return {
				...buildRestartRecoveryClaimCleanupPatch({
					entry: current,
					recordTerminalSource: true,
					terminalSourceRunId: recoverySourceRunId
				}),
				...preservesPendingFinal ? {
					restartRecoveryBeforeAgentReplyState: current.restartRecoveryBeforeAgentReplyState,
					restartRecoverySourceIngress: current.restartRecoverySourceIngress,
					restartRecoveryForceSafeTools: current.restartRecoveryForceSafeTools
				} : {},
				...endedAt !== void 0 ? {
					abortedLastRun: false,
					endedAt,
					lifecycleRunId: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "done"
				} : {},
				updatedAt: endedAt ?? Date.now()
			};
		}, { assertCommitAllowed: () => {
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (params.isRestartAbort()) throw createAgentRunStaleLifecycleError();
		} });
		if (persisted) params.setEntry(persisted);
	};
	const isArmed = () => {
		if (!tracked || !params.sessionKey || !params.storePath) return false;
		return loadSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			clone: false,
			hydrateSkillPromptRefs: false
		})?.abortedLastRun === true || params.getEntry()?.abortedLastRun === true;
	};
	return {
		admitUserTurn,
		beginBeforeAgentReply,
		checkpointBeforeAgentReply,
		clear,
		isArmed
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
export { resolveReplyFailoverFacts as _, buildAuthProfileFailoverFailureText as a, reserveReplyAdmissionTicket as b, buildKnownAgentRunFailureReplyPayload as c, isNonDirectConversationContext as d, isVerboseFailureDetailEnabled as f, resolveAgentRunFailureText as g, renderPostCompactionModelFailurePayload as h, retireTerminalRestartRecoverySourceClaim as i, buildPreflightCompactionFailureText as l, markPostCompactionModelFailurePayload as m, createReplyRestartRecoveryClaimController as n, buildEmptyInteractiveReplyPayload as o, markAgentRunFailureReplyPayload as p, isDuplicateRestartRecoverySource as r, buildExternalRunFailureReply as s, resolveTurnCommentaryProgressOwner as t, buildTerminalAgentRunFailureReplyPayload as u, resolveReplyFailureSummary as v, REPLY_ADMISSION_TICKET as y };
