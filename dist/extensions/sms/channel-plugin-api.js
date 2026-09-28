import { t as getSmsRuntime } from "./.setup/runtime-BBlPgBIF.mjs";
import { C as normalizeSmsAllowFrom, S as looksLikeSmsPhoneNumber, _ as isSmsAccountConfigured, a as listTwilioIncomingPhoneNumbers, b as resolveSmsAccount, c as resolveTwilioInboundSender, d as respondTwiml, f as retrieveTwilioMessagingService, g as inspectSmsAccount, h as assertSmsCredentialOwnerAvailable, i as buildTwilioInboundMessage, l as resolveTwilioMessageSid, m as verifyTwilioSignature, o as listTwilioMessages, p as sendSmsViaTwilio, r as TWIML_CONTENT_TYPE, s as readTwilioWebhookForm, t as TWILIO_MESSAGE_BODY_MAX_LENGTH, u as resolveTwilioWebhookSignatureUrl, v as listSmsAccountIds, w as normalizeSmsPhoneNumber, x as resolveTwilioStatusCallbackUrl, y as resolveDefaultSmsAccountId } from "./.setup/twilio-J4cwlx0M.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./.setup/secret-contract-Cp0f-YPc.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { createHybridChannelConfigAdapter, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { bindIngressLifecycleToReplyOptions, createAccountStatusSink, createChannelIngressMonitor, createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, waitUntilAbort } from "openclaw/plugin-sdk/channel-outbound";
import { createConditionalWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createEmptyChannelDirectoryAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { PlatformMessageNotDispatchedError, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { isRecord, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound, renderMarkdownIRChunksWithinLimit, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { AllowFromListSchema, DmPolicySchema, buildChannelConfigSchema, buildMultiAccountChannelSchema, requireOpenAllowFrom } from "openclaw/plugin-sdk/channel-config-schema";
import { requireChannelOpenAllowFrom } from "openclaw/plugin-sdk/extension-shared";
import { z } from "zod";
import { createHash } from "node:crypto";
import { channelBlockedPatch, channelReadyPatch, channelStoppedPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { createFixedWindowRateLimiter, isRequestBodyLimitError, registerPluginHttpRoute, resolveRequestClientIp } from "openclaw/plugin-sdk/webhook-ingress";
import { createWebhookInFlightLimiter, runDetachedWebhookWork, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/sms/src/config-schema.ts
const SecretInputSchema = buildSecretInputSchema();
const SmsAccountConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	mediaMaxMb: z.number().positive().optional(),
	accountSid: z.string().optional(),
	authToken: SecretInputSchema.optional(),
	fromNumber: z.string().optional(),
	messagingServiceSid: z.string().optional(),
	defaultTo: z.string().optional(),
	webhookPath: z.string().optional(),
	publicWebhookUrl: z.string().optional(),
	dangerouslyDisableSignatureValidation: z.boolean().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: AllowFromListSchema,
	textChunkLimit: z.number().int().positive().optional()
}).strict();
const SmsConfigSchema = buildMultiAccountChannelSchema(SmsAccountConfigSchema, {
	optionalAccount: true,
	refine: (value, ctx) => {
		requireChannelOpenAllowFrom({
			channel: "sms",
			policy: value.dmPolicy,
			allowFrom: value.allowFrom,
			ctx,
			requireOpenAllowFrom
		});
	}
});
const SmsChannelConfigSchema = buildChannelConfigSchema(SmsConfigSchema, { uiHints: {
	"": {
		label: "SMS",
		help: "Twilio SMS/MMS channel configuration for inbound webhooks and outbound replies."
	},
	accountSid: {
		label: "Twilio Account SID",
		help: "Twilio Account SID used for SMS outbound API calls."
	},
	authToken: {
		label: "Twilio Auth Token",
		help: "Twilio Auth Token used to sign webhook validation and SMS outbound API calls."
	},
	fromNumber: {
		label: "SMS From Number",
		help: "Twilio SMS-capable phone number in E.164 format; outbound attachments also require MMS capability.",
		presentation: "phone-number"
	},
	messagingServiceSid: {
		label: "Twilio Messaging Service SID",
		help: "Twilio Messaging Service SID to use instead of a dedicated fromNumber."
	},
	defaultTo: {
		label: "SMS Default To Number",
		help: "Optional default outbound phone number used when a send flow omits an explicit SMS target.",
		presentation: "phone-number"
	},
	publicWebhookUrl: {
		label: "SMS Public Webhook URL",
		help: "Public URL configured in Twilio for incoming messages. Must match Twilio's signed URL exactly; outbound MMS also requires this same path to be reachable over HTTPS."
	},
	webhookPath: {
		label: "SMS Webhook Path",
		help: "Gateway HTTP path that receives Twilio incoming-message webhooks. Use a distinct path per account."
	},
	dmPolicy: {
		label: "SMS DM Policy",
		help: "Direct SMS access control (\"pairing\" recommended). \"open\" requires channels.sms.allowFrom=[\"*\"]."
	},
	allowFrom: {
		label: "SMS Allow From",
		help: "Allowed sender phone numbers in E.164 format, or * when dmPolicy is open.",
		presentation: "phone-number"
	},
	"accounts.*.fromNumber": { presentation: "phone-number" },
	"accounts.*.defaultTo": { presentation: "phone-number" },
	"accounts.*.allowFrom.*": { presentation: "phone-number" },
	textChunkLimit: {
		label: "SMS Text Chunk Limit",
		help: "Maximum characters per outbound SMS chunk before OpenClaw splits long replies."
	}
} });
//#endregion
//#region extensions/sms/src/delivery-observations.ts
const DELIVERY_NAMESPACE = "twilio-delivery-observations-v1";
const DELIVERY_RETENTION_MS = 2592e6;
const DELIVERY_MAX_MESSAGES = 5e3;
const DELIVERY_STATUS_RANK = {
	accepted: 10,
	scheduled: 20,
	queued: 30,
	sending: 40,
	sent: 50
};
const TERMINAL_DELIVERY_STATUSES = /* @__PURE__ */ new Set([
	"delivered",
	"undelivered",
	"failed",
	"canceled"
]);
const INBOUND_MESSAGE_STATUSES = /* @__PURE__ */ new Set(["receiving", "received"]);
let deliveryStore;
let deliveryStoreRuntime;
function firstTrimmed(form, key) {
	return form[key]?.trim() ?? "";
}
function resolveMessageSid(form) {
	return firstTrimmed(form, "MessageSid") || firstTrimmed(form, "SmsSid") || firstTrimmed(form, "SmsMessageSid");
}
function normalizeDeliveryStatus(rawStatus) {
	const status = rawStatus.trim().toLowerCase();
	return INBOUND_MESSAGE_STATUSES.has(status) ? "" : status;
}
function resolveDeliveryStatus(form) {
	return normalizeDeliveryStatus(firstTrimmed(form, "MessageStatus") || firstTrimmed(form, "SmsStatus"));
}
function hashAccountSid(accountSid) {
	return createHash("sha256").update(accountSid).digest("hex");
}
function fingerprintObservation(params) {
	return createHash("sha256").update(JSON.stringify([
		params.source,
		params.messageSid,
		params.status,
		params.errorCode ?? "",
		params.rawDlrDoneDate ?? ""
	])).digest("hex");
}
function deliveryRecordKey(params) {
	return createHash("sha256").update(`${params.accountId}\n${params.accountSidHash}\n${params.messageSid}`).digest("hex");
}
function openDeliveryStore() {
	const runtime = getSmsRuntime();
	if (!deliveryStore || deliveryStoreRuntime !== runtime) {
		deliveryStoreRuntime = runtime;
		deliveryStore = runtime.state.openKeyedStore({
			namespace: DELIVERY_NAMESPACE,
			maxEntries: DELIVERY_MAX_MESSAGES,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: DELIVERY_RETENTION_MS
		});
	}
	return deliveryStore;
}
function isTwilioDeliveryStatusForm(form) {
	return Boolean(resolveDeliveryStatus(form));
}
function parseSmsDeliveryObservation(form, nowMs = Date.now()) {
	const messageSid = resolveMessageSid(form);
	const status = resolveDeliveryStatus(form);
	if (!messageSid || !status) return null;
	const errorCode = firstTrimmed(form, "ErrorCode");
	const rawDlrDoneDate = firstTrimmed(form, "RawDlrDoneDate");
	return {
		messageSid,
		observation: {
			source: "callback",
			fingerprint: fingerprintObservation({
				source: "callback",
				messageSid,
				status,
				...errorCode ? { errorCode } : {},
				...rawDlrDoneDate ? { rawDlrDoneDate } : {}
			}),
			status,
			observedAt: nowMs,
			...errorCode ? { errorCode } : {},
			...rawDlrDoneDate ? { rawDlrDoneDate } : {}
		}
	};
}
function reduceDeliveryStatus(current, observation) {
	if (!current) return {
		status: observation.status,
		...observation.errorCode ? { errorCode: observation.errorCode } : {}
	};
	if (current.status === "conflicted") return {
		status: current.status,
		...current.errorCode ? { errorCode: current.errorCode } : {},
		conflict: true
	};
	if (current.status === observation.status) {
		const errorCode = current.errorCode ?? observation.errorCode;
		return {
			status: current.status,
			...errorCode ? { errorCode } : {},
			...current.conflict ? { conflict: true } : {}
		};
	}
	const currentTerminal = TERMINAL_DELIVERY_STATUSES.has(current.status);
	const nextTerminal = TERMINAL_DELIVERY_STATUSES.has(observation.status);
	if (currentTerminal && nextTerminal && current.status !== observation.status) {
		const errorCode = observation.errorCode ?? current.errorCode;
		return {
			status: "conflicted",
			...errorCode ? { errorCode } : {},
			conflict: true
		};
	}
	if (currentTerminal) return {
		status: current.status,
		...current.errorCode ? { errorCode: current.errorCode } : {},
		...current.conflict ? { conflict: true } : {}
	};
	if (nextTerminal) return {
		status: observation.status,
		...observation.errorCode ? { errorCode: observation.errorCode } : {}
	};
	const currentRank = DELIVERY_STATUS_RANK[current.status] ?? -1;
	if ((DELIVERY_STATUS_RANK[observation.status] ?? -1) > currentRank) return {
		status: observation.status,
		...observation.errorCode ? { errorCode: observation.errorCode } : {}
	};
	return {
		status: current.status,
		...current.errorCode ? { errorCode: current.errorCode } : {},
		...current.conflict ? { conflict: true } : {}
	};
}
function mergeSmsDeliveryObservation(params) {
	if (params.current?.observations.some((existing) => existing.fingerprint === params.observation.fingerprint)) return;
	const reduced = reduceDeliveryStatus(params.current, params.observation);
	return {
		accountId: params.accountId,
		accountSidHash: params.accountSidHash,
		messageSid: params.messageSid,
		status: reduced.status,
		firstObservedAt: params.current?.firstObservedAt ?? params.observation.observedAt,
		lastObservedAt: params.observation.observedAt,
		...reduced.errorCode ? { errorCode: reduced.errorCode } : {},
		...reduced.conflict ? { conflict: true } : {},
		observations: [...params.current?.observations ?? [], params.observation].slice(-20)
	};
}
async function recordSmsDeliveryObservation(params) {
	if (!params.store.observe || !params.store.compareAndApply) throw new Error("SMS delivery observations require plugin state comparisons.");
	const accountId = params.account.accountId;
	const accountSidHash = hashAccountSid(params.account.accountSid);
	const key = deliveryRecordKey({
		accountId,
		accountSidHash,
		messageSid: params.messageSid
	});
	let observed = await params.store.observe(key);
	while (true) {
		const next = mergeSmsDeliveryObservation({
			accountId,
			accountSidHash,
			messageSid: params.messageSid,
			current: observed.value,
			observation: params.observation
		});
		const result = await params.store.compareAndApply(key, observed.comparison, next ? {
			operation: "update",
			action: "set",
			value: next
		} : {
			operation: "update",
			action: "keep"
		});
		if (result.status === "conflict") {
			observed = result.current;
			continue;
		}
		const record = next ?? observed.value;
		if (!record) throw new Error("SMS delivery observation was not persisted.");
		return {
			duplicate: !next,
			record
		};
	}
}
function createSmsDeliveryRecorder(store = openDeliveryStore()) {
	return { async record({ account, form }) {
		const parsed = parseSmsDeliveryObservation(form);
		if (!parsed) throw new Error("Invalid Twilio delivery status callback.");
		return await recordSmsDeliveryObservation({
			account,
			messageSid: parsed.messageSid,
			observation: parsed.observation,
			store
		});
	} };
}
async function recordInitialSmsDeliveryResult(params) {
	const messageSid = params.result.sid.trim();
	const status = normalizeDeliveryStatus(params.result.status ?? "");
	if (!messageSid || !status) return null;
	return await recordSmsDeliveryObservation({
		account: params.account,
		messageSid,
		observation: {
			source: "api-response",
			fingerprint: fingerprintObservation({
				source: "api-response",
				messageSid,
				status
			}),
			status,
			observedAt: params.nowMs ?? Date.now()
		},
		store: params.store ?? openDeliveryStore()
	});
}
async function listRecentSmsDeliveryRecords(account, limit = 1, store = openDeliveryStore()) {
	if (limit <= 0) return [];
	const accountSidHash = hashAccountSid(account.accountSid);
	return (await store.entries()).map((entry) => entry.value).filter((record) => record.accountId === account.accountId && record.accountSidHash === accountSidHash).toSorted((left, right) => right.lastObservedAt - left.lastObservedAt).slice(0, limit);
}
//#endregion
//#region extensions/sms/src/send.ts
const SMS_ASSISTANT_TRANSCRIPT_ROLE_PREFIX = "[assistant-authored transcript] ";
function createSmsMessageReceipt(params) {
	const receipt = createMessageReceiptFromOutboundResults({
		results: params.results.map((result) => ({
			channel: "sms",
			messageId: result.sid,
			chatId: result.to,
			toJid: result.to,
			conversationId: result.to,
			meta: {
				...result.from ? { from: result.from } : {},
				...result.status ? { status: result.status } : {}
			}
		})),
		threadId: params.results[0]?.to,
		kind: params.kind
	});
	if (params.kind === "media") receipt.parts = receipt.parts.map((part, index) => index === 0 ? part : {
		...part,
		kind: "text"
	});
	return receipt;
}
function createSmsDeliveryProgressResult(result, kind) {
	return {
		channel: "sms",
		messageId: result.sid,
		chatId: result.to,
		receipt: createSmsMessageReceipt({
			results: [result],
			kind
		})
	};
}
function throwSmsPartialDeliveryError(error, results, kind) {
	if (results.length === 0) throw error;
	throw createChannelPartialDeliveryError(error, {
		messageIds: results.map((result) => result.sid),
		receipt: createSmsMessageReceipt({
			results,
			kind
		}),
		visibleReplySent: true
	});
}
function toSmsPlainText(text) {
	const visibleText = sanitizeAssistantVisibleText(text);
	return stripMarkdown(visibleText, {
		assistantTranscriptRoleHeaders: true,
		assistantTranscriptRolePrefix: SMS_ASSISTANT_TRANSCRIPT_ROLE_PREFIX,
		linkStyle: "label-and-url"
	}).replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function chunkSmsPlainText(text, limit) {
	return renderMarkdownIRChunksWithinLimit({
		ir: {
			text,
			styles: [],
			links: []
		},
		limit,
		assistantTranscriptRoleMessageBoundaries: true,
		renderChunk: (chunk) => chunk.annotations?.some((annotation) => annotation.type === "assistant_transcript_role") ? `${SMS_ASSISTANT_TRANSCRIPT_ROLE_PREFIX}${chunk.text}` : chunk.text,
		measureRendered: (rendered) => rendered.length
	}).map(({ rendered }) => rendered).filter(Boolean);
}
function prepareSmsTextChunks(params) {
	const text = toSmsPlainText(params.text);
	if (!text) return [];
	return chunkSmsPlainText(text, Math.min(params.configuredLimit, TWILIO_MESSAGE_BODY_MAX_LENGTH));
}
async function sendSmsProviderMessage(params) {
	let platformDispatchStarted = false;
	let result;
	try {
		result = await sendSmsViaTwilio({
			account: params.account,
			to: params.to,
			...params.text !== void 0 ? { text: params.text } : {},
			...params.mediaUrls !== void 0 ? { mediaUrls: params.mediaUrls } : {},
			onPlatformSendDispatch: async () => {
				await params.onPlatformSendDispatch?.();
				platformDispatchStarted = true;
			}
		});
	} catch (error) {
		if (platformDispatchStarted || error instanceof PlatformMessageNotDispatchedError) throw error;
		throw new PlatformMessageNotDispatchedError(`SMS send failed before Twilio dispatch: ${formatErrorMessage(error)}`, { cause: error });
	}
	await recordInitialDeliveryBestEffort(params.account, result);
	return result;
}
function logInitialDeliveryPersistenceFailure(result, error) {
	try {
		getSmsRuntime().logging.getChildLogger({
			plugin: "sms",
			feature: "delivery-status"
		}).warn("SMS delivery initial state could not be persisted.", {
			messageSid: result.sid,
			errorType: error instanceof Error ? error.name : typeof error
		});
	} catch {}
}
async function recordInitialDeliveryBestEffort(account, result) {
	try {
		await recordInitialSmsDeliveryResult({
			account,
			result
		});
	} catch (error) {
		logInitialDeliveryPersistenceFailure(result, error);
	}
}
async function sendSmsTextChunks(params) {
	const chunks = prepareSmsTextChunks({
		text: params.text,
		configuredLimit: params.account.textChunkLimit
	});
	if (chunks.length === 0) throw new Error("SMS send requires non-empty text.");
	const results = [];
	try {
		for (const text of chunks) {
			const result = await sendSmsProviderMessage({
				account: params.account,
				to: params.to,
				text,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			results.push(result);
			await params.onDeliveryResult?.(createSmsDeliveryProgressResult(result, "text"));
		}
	} catch (error) {
		throwSmsPartialDeliveryError(error, results, "text");
	}
	return results;
}
async function prepareSmsMediaAttempt(params) {
	if (!params.mediaUrl) throw new Error("MMS send requires mediaUrl.");
	const [caption, ...remainingChunks] = prepareSmsTextChunks({
		text: params.text,
		configuredLimit: params.account.textChunkLimit
	});
	let hostedMedia;
	try {
		const { prepareHostedSmsMedia } = await import("./.setup/media-jI34WkPd.mjs");
		assertSmsCredentialOwnerAvailable(params.account);
		const prepared = await prepareHostedSmsMedia({
			account: params.account,
			mediaUrl: params.mediaUrl,
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: params.mediaLocalRoots,
			mediaReadFile: params.mediaReadFile,
			captionByteLength: Buffer.byteLength(caption ?? "", "utf8")
		});
		hostedMedia = {
			hostedMediaUrl: prepared.url,
			cleanupHostedMedia: prepared.cleanup
		};
	} catch (error) {
		if (error instanceof PlatformMessageNotDispatchedError) throw error;
		throw new PlatformMessageNotDispatchedError(`SMS media preparation failed before Twilio dispatch: ${formatErrorMessage(error)}`, { cause: error });
	}
	return {
		...hostedMedia,
		...caption ? { caption } : {},
		remainingChunks
	};
}
async function sendPreparedSmsMediaAttempt(params) {
	const results = [];
	try {
		const mediaResult = await sendSmsProviderMessage({
			account: params.account,
			to: params.to,
			...params.attempt.caption ? { text: params.attempt.caption } : {},
			mediaUrls: [params.attempt.hostedMediaUrl],
			onPlatformSendDispatch: params.onPlatformSendDispatch
		});
		results.push(mediaResult);
		await params.onDeliveryResult?.(createSmsDeliveryProgressResult(mediaResult, "media"));
		for (const text of params.attempt.remainingChunks) {
			const result = await sendSmsProviderMessage({
				account: params.account,
				to: params.to,
				text,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			results.push(result);
			await params.onDeliveryResult?.(createSmsDeliveryProgressResult(result, "text"));
		}
	} catch (error) {
		throwSmsPartialDeliveryError(error, results, "media");
	}
	return results;
}
//#endregion
//#region extensions/sms/src/inbound.ts
const CHANNEL_ID$2 = "sms";
async function authorizeSmsSender(params) {
	const commandRequested = params.channelRuntime.commands.shouldComputeCommandAuthorized(params.rawBody, params.cfg);
	return await params.channelRuntime.inbound.ingress.resolveStable({
		channelId: CHANNEL_ID$2,
		accountId: params.account.accountId,
		cfg: params.cfg,
		identity: {
			key: "phone",
			entryIdPrefix: "sms-entry"
		},
		readStoreAllowFrom: async () => await params.channelRuntime.pairing.readAllowFromStore({
			channel: CHANNEL_ID$2,
			accountId: params.account.accountId
		}),
		subject: { stableId: params.from },
		conversation: {
			kind: "direct",
			id: params.from
		},
		contextBinding: params.contextBinding,
		event: { mayPair: true },
		dmPolicy: params.account.dmPolicy,
		allowFrom: params.account.allowFrom,
		command: commandRequested ? {
			cfg: params.cfg,
			modeWhenAccessGroupsOff: "configured"
		} : void 0
	});
}
async function issueSmsPairingChallenge(params) {
	await createChannelPairingChallengeIssuer({
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		upsertPairingRequest: async (input) => await params.channelRuntime.pairing.upsertPairingRequest({
			channel: CHANNEL_ID$2,
			accountId: params.account.accountId,
			...input
		})
	})({
		senderId: params.from,
		senderIdLine: `Your SMS phone number: ${params.from}`,
		sendPairingReply: async (text) => {
			await sendSmsTextChunks({
				account: params.account,
				to: params.from,
				text
			});
		},
		onCreated: () => {
			params.log?.info?.(`SMS pairing request created for ${params.from}`);
		},
		onReplyError: (err) => {
			params.log?.warn?.(`SMS pairing reply failed for ${params.from}: ${String(err)}`);
		}
	});
}
async function dispatchSmsInboundEvent(params) {
	const from = normalizeSmsPhoneNumber(params.msg.from);
	let auth = await authorizeSmsSender({
		cfg: params.cfg,
		account: params.account,
		channelRuntime: params.channelRuntime,
		from,
		rawBody: params.msg.body
	});
	if (!auth.senderAccess.allowed) {
		if (auth.senderAccess.decision === "pairing") {
			await issueSmsPairingChallenge({
				account: params.account,
				channelRuntime: params.channelRuntime,
				from,
				log: params.log
			});
			return;
		}
		params.log?.warn?.(`SMS sender ${from} is not authorized`);
		return;
	}
	const materialized = params.msg.media.length > 0 || (params.msg.unavailableMediaCount ?? 0) > 0 ? await (await import("./.setup/media-jI34WkPd.mjs")).materializeSmsInboundMedia({
		account: params.account,
		msg: params.msg,
		mediaRuntime: params.channelRuntime,
		abortSignal: params.turnAdoptionLifecycle?.abortSignal,
		log: params.log
	}) : {
		body: params.msg.body,
		media: [],
		cleanup: async () => void 0
	};
	let adoptionState = "pending";
	try {
		const turnAdoptionLifecycle = materialized.media.length > 0 && params.turnAdoptionLifecycle ? {
			...params.turnAdoptionLifecycle,
			onAdopted: async () => {
				try {
					await params.turnAdoptionLifecycle?.onAdopted();
					adoptionState = "adopted";
				} catch (error) {
					await materialized.cleanup();
					throw error;
				}
			},
			onDeferred: () => {
				const deferred = params.turnAdoptionLifecycle?.onDeferred?.();
				if (deferred !== false) adoptionState = "deferred";
				return deferred;
			},
			onAbandoned: () => {
				adoptionState = "abandoned";
				materialized.cleanup().then(() => params.turnAdoptionLifecycle?.onAbandoned?.()).catch((error) => {
					params.log?.warn?.(`Failed to abandon Twilio MMS ingress ${params.msg.messageSid}: ${String(error)}`);
				});
			}
		} : params.turnAdoptionLifecycle;
		const route = params.channelRuntime.routing.resolveAgentRoute({
			cfg: params.cfg,
			channel: CHANNEL_ID$2,
			accountId: params.account.accountId,
			peer: {
				kind: "direct",
				id: from
			}
		});
		const sessionKey = route.sessionKey;
		auth = await authorizeSmsSender({
			cfg: params.cfg,
			account: params.account,
			channelRuntime: params.channelRuntime,
			from,
			rawBody: params.msg.body,
			contextBinding: {
				agentId: route.agentId,
				sessionKey,
				messageId: params.msg.messageSid,
				inboundEventKind: "user_request"
			}
		});
		if (!auth.senderAccess.allowed) {
			params.log?.warn?.(`SMS sender ${from} authorization changed before dispatch`);
			return;
		}
		const commandRequested = auth.commandAccess.requested;
		const commandAuthorized = auth.commandAccess.authorized;
		const isTextCommand = params.channelRuntime.commands.isControlCommandMessage(params.msg.body, params.cfg);
		await params.channelRuntime.inbound.run({
			channel: CHANNEL_ID$2,
			accountId: params.account.accountId,
			raw: params.msg,
			...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
			adapter: {
				ingest: (msg) => ({
					id: msg.messageSid,
					timestamp: params.receivedAt,
					rawText: msg.body,
					textForAgent: materialized.body,
					textForCommands: msg.body,
					raw: msg
				}),
				resolveTurn: async (input) => {
					const ctxPayload = params.channelRuntime.inbound.buildContext({
						channelIngress: auth,
						channel: CHANNEL_ID$2,
						accountId: params.account.accountId,
						messageId: input.id,
						timestamp: input.timestamp,
						from: `sms:${from}`,
						sender: {
							id: from,
							name: from
						},
						conversation: {
							kind: "direct",
							id: from,
							label: from
						},
						route: {
							agentId: route.agentId,
							accountId: params.account.accountId,
							routeSessionKey: sessionKey,
							dispatchSessionKey: sessionKey
						},
						reply: { to: `sms:${from}` },
						message: {
							rawBody: input.rawText,
							commandBody: input.textForCommands,
							bodyForAgent: input.textForAgent
						},
						media: materialized.media,
						access: commandRequested ? { commands: { authorized: commandAuthorized } } : void 0,
						command: isTextCommand ? {
							kind: "text-slash",
							body: input.textForCommands,
							authorized: commandAuthorized
						} : void 0,
						extra: {
							MessageSid: params.msg.messageSid,
							SenderE164: from,
							To: params.msg.to
						}
					});
					return {
						cfg: params.cfg,
						channel: CHANNEL_ID$2,
						accountId: params.account.accountId,
						route: {
							agentId: route.agentId,
							sessionKey
						},
						ctxPayload,
						delivery: {
							durable: () => ({ to: from }),
							deliver: async (payload) => {
								const text = payload.text;
								if (!text) return { visibleReplySent: false };
								await sendSmsTextChunks({
									account: params.account,
									to: from,
									text
								});
								return { visibleReplySent: true };
							}
						},
						dispatcherOptions: { onReplyStart: () => {
							params.log?.info?.(`SMS reply started for ${from}`);
						} }
					};
				}
			}
		});
		if (adoptionState === "pending" || adoptionState === "abandoned") await materialized.cleanup();
	} catch (error) {
		if (adoptionState === "pending" || adoptionState === "abandoned") await materialized.cleanup();
		throw error;
	}
}
//#endregion
//#region extensions/sms/src/ingress-spool.ts
const SMS_INGRESS_PAYLOAD_VERSION = 1;
const SMS_INGRESS_DRAIN_INTERVAL_MS = 500;
var SmsIngressPermanentError = class extends Error {};
function parseSmsIngressForm(form, account) {
	const message = buildTwilioInboundMessage(form);
	if (!message) throw new SmsIngressPermanentError("SMS ingress payload is invalid.");
	if (!message.accountSid || message.accountSid !== account.accountSid) throw new SmsIngressPermanentError("SMS ingress payload has an invalid Twilio account.");
	if (/^rcs:/iu.test(message.to)) {
		if (!message.body) throw new SmsIngressPermanentError("SMS ingress payload is invalid.");
		if (account.messagingServiceSid && message.messagingServiceSid !== account.messagingServiceSid) throw new SmsIngressPermanentError("SMS ingress payload has an invalid Twilio Messaging Service.");
		const { unavailableMediaCount: _unavailableMediaCount, ...textMessage } = message;
		return {
			...textMessage,
			media: []
		};
	}
	if (account.fromNumber) {
		const recipient = normalizeSmsPhoneNumber(message.to);
		if (!looksLikeSmsPhoneNumber(recipient) || recipient !== account.fromNumber) throw new SmsIngressPermanentError("SMS ingress payload has an invalid Twilio recipient.");
	} else if (!message.messagingServiceSid || message.messagingServiceSid !== account.messagingServiceSid) throw new SmsIngressPermanentError("SMS ingress payload has an invalid Twilio Messaging Service.");
	return message;
}
function createSmsIngressSpool(params) {
	const queue = params.queue ?? getSmsRuntime().state.openChannelIngressQueue({ accountId: params.account.accountId });
	const deliver = params.deliver ?? (async (message, lifecycle, receivedAt) => {
		await dispatchSmsInboundEvent({
			cfg: params.cfg,
			account: params.account,
			channelRuntime: params.channelRuntime,
			msg: message,
			receivedAt,
			turnAdoptionLifecycle: lifecycle,
			log: params.log
		});
	});
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: (form, context) => {
			const eventId = resolveTwilioMessageSid(form);
			if (!eventId) {
				if (context.phase === "claim") throw new SmsIngressPermanentError("SMS ingress payload is invalid.");
				throw new Error("SMS webhook is missing MessageSid.");
			}
			const sender = resolveTwilioInboundSender(form);
			return {
				eventId,
				laneKey: sender ? `sender:${sender}` : `event:${eventId}`
			};
		},
		payload: {
			version: SMS_INGRESS_PAYLOAD_VERSION,
			serialize: (form) => form,
			deserialize: (form) => form,
			encode: ({ body }) => ({
				version: SMS_INGRESS_PAYLOAD_VERSION,
				form: body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: payload.form
			}),
			createClaimError: (kind) => new SmsIngressPermanentError(kind === "invalid-version" ? "SMS ingress payload version is invalid." : "SMS ingress identity changed after durable admission.")
		},
		deliver: (_form, lifecycle, event) => deliver(parseSmsIngressForm(event.payload.form, params.account), bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle, event.receivedAt),
		pollIntervalMs: SMS_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedTtlMs: 864e5,
			failedMaxEntries: 1e3
		},
		appendRetryDelaysMs: [0],
		waitForDeliveryIdleBeforeRepump: false,
		waitForDeliveryIdleOnStop: false,
		runPumpTask: runDetachedWebhookWork,
		admissionMode: "durable-after-stop",
		drain: {
			onLog: (message) => params.log?.warn?.(message),
			resolveNonRetryableFailure: (error) => error instanceof SmsIngressPermanentError ? {
				reason: "invalid-payload",
				message: error.message
			} : null
		},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("SMS ingress stopped."),
		onError: (error) => params.log?.error?.(`SMS ingress drain failed: ${error instanceof Error ? error.message : String(error)}`)
	});
	return {
		enqueue: async (form) => {
			const admitted = await monitor.admit(form);
			if (admitted.kind === "ignored") throw new Error("SMS webhook admission was unexpectedly ignored.");
			return {
				kind: admitted.queueResult.kind,
				duplicate: admitted.queueResult.duplicate
			};
		},
		start: monitor.start,
		pause: monitor.pause,
		waitForIdle: monitor.waitForIdle,
		stop: monitor.stop
	};
}
//#endregion
//#region extensions/sms/src/webhook.ts
const INVALID_REQUEST_MAX_REQUESTS = 300;
const PRE_AUTH_MAX_IN_FLIGHT = 64;
const INBOUND_DISPATCH_MAX_REQUESTS = 30;
const DELIVERY_CALLBACK_MAX_REQUESTS = 3e3;
const DELIVERY_CALLBACK_WINDOW_MS = 6e4;
const SMS_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const SMS_WEBHOOK_ACCEPTED_VALUE = "durable";
const invalidRequestRateLimiter = createFixedWindowRateLimiter({
	maxRequests: INVALID_REQUEST_MAX_REQUESTS,
	windowMs: 6e4,
	maxTrackedKeys: 5e3
});
const inboundDispatchRateLimiter = createFixedWindowRateLimiter({
	maxRequests: INBOUND_DISPATCH_MAX_REQUESTS,
	windowMs: 6e4,
	maxTrackedKeys: 5e3
});
const validatedInboundAggregateRateLimiter = createFixedWindowRateLimiter({
	maxRequests: 300,
	windowMs: 6e4,
	maxTrackedKeys: 1e3
});
function headerValue(value) {
	if (Array.isArray(value)) return value[0];
	return value;
}
function resolvedClientAddress(params) {
	return resolveRequestClientIp(params.req, params.cfg.gateway?.trustedProxies, params.cfg.gateway?.allowRealIpFallback === true) ?? params.req.socket?.remoteAddress ?? "unknown";
}
function rateLimitKey(params) {
	return `${params.account.accountId}:${params.account.webhookPath}:${params.subject}`;
}
function accountRouteRateLimitKey(account) {
	return `${account.accountId}:${account.webhookPath}`;
}
function rejectInvalidRequestRateLimit(params) {
	params.log?.warn?.(`SMS webhook invalid-request rate limit exceeded for ${params.key}`);
	respondTwiml(params.res, 429, "Rate limit exceeded");
	return true;
}
function createSmsWebhookHandler(params) {
	let deliveryRecorder = params.delivery;
	const preAuthInFlightLimiter = createWebhookInFlightLimiter({
		maxInFlightPerKey: PRE_AUTH_MAX_IN_FLIGHT,
		maxTrackedKeys: 1
	});
	const preAuthInFlightKey = accountRouteRateLimitKey(params.account);
	const deliveryCallbackRateLimiter = createFixedWindowRateLimiter({
		maxRequests: DELIVERY_CALLBACK_MAX_REQUESTS,
		windowMs: DELIVERY_CALLBACK_WINDOW_MS,
		maxTrackedKeys: 1
	});
	const deliveryCallbackKey = accountRouteRateLimitKey(params.account);
	return async (req, res) => {
		if (req.method !== "POST") {
			respondTwiml(res, 405, "Method not allowed");
			return true;
		}
		const clientAddress = resolvedClientAddress({
			cfg: params.cfg,
			req
		});
		const clientAddressKey = rateLimitKey({
			account: params.account,
			subject: clientAddress
		});
		const invalidRequestRateLimited = invalidRequestRateLimiter.isRateLimited(clientAddressKey);
		if (!preAuthInFlightLimiter.tryAcquire(preAuthInFlightKey)) {
			params.log?.warn?.("SMS webhook pre-authentication concurrency limit exceeded");
			await sendHttpRequestRejection(req, res, 429, "Rate limit exceeded", TWIML_CONTENT_TYPE);
			return true;
		}
		let form;
		try {
			try {
				form = await readTwilioWebhookForm(req);
			} catch (error) {
				if (isRequestBodyLimitError(error, "PAYLOAD_TOO_LARGE")) {
					await sendHttpRequestRejection(req, res, 413, "Payload too large", TWIML_CONTENT_TYPE);
					return true;
				}
				if (isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) {
					res.setHeader("cache-control", "no-store");
					await sendHttpRequestRejection(req, res, 500, "Internal Server Error", "text/plain; charset=utf-8");
					return true;
				}
				throw error;
			}
			assertSmsCredentialOwnerAvailable(params.account);
			if (!params.account.dangerouslyDisableSignatureValidation) {
				if (!verifyTwilioSignature({
					signature: headerValue(req.headers["x-twilio-signature"]),
					url: resolveTwilioWebhookSignatureUrl({
						req,
						publicWebhookUrl: params.account.publicWebhookUrl
					}),
					authToken: params.account.authToken,
					form
				})) {
					if (invalidRequestRateLimited) return rejectInvalidRequestRateLimit({
						key: clientAddressKey,
						log: params.log,
						res
					});
					params.log?.warn?.("SMS webhook rejected invalid Twilio signature");
					respondTwiml(res, 403, "Invalid signature");
					return true;
				}
			}
			if (invalidRequestRateLimited && params.account.dangerouslyDisableSignatureValidation) return rejectInvalidRequestRateLimit({
				key: clientAddressKey,
				log: params.log,
				res
			});
		} finally {
			preAuthInFlightLimiter.release(preAuthInFlightKey);
		}
		if (isTwilioDeliveryStatusForm(form)) {
			if (params.account.dangerouslyDisableSignatureValidation && inboundDispatchRateLimiter.isRateLimited(clientAddressKey)) {
				params.log?.warn?.("SMS webhook callback rate limit exceeded");
				respondTwiml(res, 429, "Rate limit exceeded");
				return true;
			}
			const messageSid = resolveTwilioMessageSid(form);
			if (!messageSid) {
				respondTwiml(res, 400, "Missing MessageSid");
				return true;
			}
			const callbackAccountSid = form.AccountSid;
			if (!callbackAccountSid || callbackAccountSid !== params.account.accountSid) {
				params.log?.warn?.(`SMS delivery callback ignored missing or mismatched account for message ${messageSid}`);
				respondTwiml(res, 200);
				return true;
			}
			if (deliveryCallbackRateLimiter.isRateLimited(deliveryCallbackKey)) {
				params.log?.warn?.("SMS delivery callback rate limit exceeded");
				respondTwiml(res, 503, "Service unavailable");
				return true;
			}
			deliveryRecorder ??= createSmsDeliveryRecorder();
			const verdict = await deliveryRecorder.record({
				account: params.account,
				form
			});
			if (verdict.duplicate) params.log?.info?.(`SMS delivery callback ignored duplicate for message ${messageSid}`);
			else params.log?.info?.(`SMS delivery observation ${verdict.record.status} recorded for message ${messageSid}`);
			res.setHeader(SMS_WEBHOOK_ACCEPTED_HEADER, SMS_WEBHOOK_ACCEPTED_VALUE);
			respondTwiml(res, 200);
			return true;
		}
		const dispatchKey = params.account.dangerouslyDisableSignatureValidation ? clientAddressKey : rateLimitKey({
			account: params.account,
			subject: resolveTwilioInboundSender(form)
		});
		if (inboundDispatchRateLimiter.isRateLimited(dispatchKey)) {
			params.log?.warn?.("SMS webhook callback rate limit exceeded");
			respondTwiml(res, 429, "Rate limit exceeded");
			return true;
		}
		if (!params.account.dangerouslyDisableSignatureValidation) {
			const aggregateKey = accountRouteRateLimitKey(params.account);
			if (validatedInboundAggregateRateLimiter.isRateLimited(aggregateKey)) {
				params.log?.warn?.(`SMS webhook aggregate rate limit exceeded for ${aggregateKey}`);
				respondTwiml(res, 429, "Rate limit exceeded");
				return true;
			}
		}
		const messageSid = resolveTwilioMessageSid(form);
		if (!messageSid) {
			respondTwiml(res, 400, "Missing MessageSid");
			return true;
		}
		if ((await params.ingress.enqueue(form)).duplicate) params.log?.warn?.(`SMS webhook ignored replayed message ${messageSid}`);
		res.setHeader(SMS_WEBHOOK_ACCEPTED_HEADER, SMS_WEBHOOK_ACCEPTED_VALUE);
		respondTwiml(res, 200);
		return true;
	};
}
//#endregion
//#region extensions/sms/src/gateway.ts
const CHANNEL_ID$1 = "sms";
const activeRoutePaths = /* @__PURE__ */ new Map();
const pendingRouteStops = /* @__PURE__ */ new Map();
function normalizeWebhookPath(path) {
	const trimmed = path.trim();
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function stopSmsWebhookRoute(webhookPath, route) {
	if (route.stopTask) return route.stopTask;
	const pauseTask = route.ingress.pause();
	route.unregisterRoute();
	if (activeRoutePaths.get(webhookPath) === route) activeRoutePaths.delete(webhookPath);
	const previousStop = pendingRouteStops.get(webhookPath) ?? Promise.resolve();
	const stopTask = Promise.all([
		previousStop,
		route.ready,
		pauseTask
	]).then(() => route.ingress.stop(), async (error) => {
		await Promise.allSettled([route.ingress.stop()]);
		throw error;
	});
	route.stopTask = stopTask;
	pendingRouteStops.set(webhookPath, stopTask);
	const clear = () => {
		if (pendingRouteStops.get(webhookPath) === stopTask) pendingRouteStops.delete(webhookPath);
	};
	stopTask.then(clear, clear);
	return stopTask;
}
function collectSmsStartupWarnings(account) {
	const warnings = [];
	if (!account.accountSid || !account.authToken || !account.fromNumber && !account.messagingServiceSid) warnings.push("- SMS: accountSid, authToken, and fromNumber or messagingServiceSid are required.");
	if (!account.publicWebhookUrl && !account.dangerouslyDisableSignatureValidation) warnings.push("- SMS: publicWebhookUrl is required for Twilio signature validation. Set dangerouslyDisableSignatureValidation=true only for local testing.");
	else if (account.publicWebhookUrl && !resolveTwilioStatusCallbackUrl(account.publicWebhookUrl)) warnings.push("- SMS: publicWebhookUrl must be a properly encoded absolute HTTP(S) URL with a valid hostname, no embedded credentials, and remain within OpenClaw's 4,000-character callback safety limit; OpenClaw will omit the per-message delivery callback until fixed.");
	if (account.dmPolicy === "allowlist" && account.allowFrom.length === 0) warnings.push("- SMS: dmPolicy=allowlist with empty allowFrom rejects every sender.");
	if (account.dmPolicy === "open" && !account.allowFrom.includes("*")) warnings.push("- SMS: dmPolicy=open should set allowFrom=[\"*\"] or explicit sender numbers.");
	return warnings;
}
async function registerSmsWebhookRoute(params) {
	const webhookPath = normalizeWebhookPath(params.account.webhookPath);
	const currentRoute = activeRoutePaths.get(webhookPath);
	if (currentRoute && currentRoute.accountId !== params.account.accountId) throw new Error(`SMS webhook path ${webhookPath} is already registered by account ${currentRoute.accountId}; configure a distinct webhookPath for account ${params.account.accountId}.`);
	const predecessorStop = currentRoute ? stopSmsWebhookRoute(webhookPath, currentRoute) : pendingRouteStops.get(webhookPath) ?? Promise.resolve();
	const ingress = createSmsIngressSpool({
		cfg: params.cfg,
		account: params.account,
		channelRuntime: params.channelRuntime,
		...params.log ? { log: params.log } : {}
	});
	let unregisterRoute;
	try {
		const webhookHandler = createSmsWebhookHandler({
			...params,
			ingress
		});
		unregisterRoute = registerPluginHttpRoute({
			path: webhookPath,
			auth: "plugin",
			pluginId: CHANNEL_ID$1,
			accountId: params.account.accountId,
			throwOnFailure: true,
			log: (msg) => params.log?.info?.(msg),
			handler: async (req, res) => {
				const { tryHandleHostedSmsMediaRequest } = await import("./.setup/media-jI34WkPd.mjs");
				if (await tryHandleHostedSmsMediaRequest(req, res, params.account.accountId)) return true;
				return await webhookHandler(req, res);
			}
		});
	} catch (error) {
		await Promise.allSettled([predecessorStop, ingress.stop()]);
		throw error;
	}
	const route = {
		accountId: params.account.accountId,
		ingress,
		unregisterRoute,
		ready: Promise.resolve()
	};
	activeRoutePaths.set(webhookPath, route);
	route.ready = predecessorStop.then(() => {
		if (activeRoutePaths.get(webhookPath) === route && !route.stopTask) ingress.start();
	});
	const unregister = () => stopSmsWebhookRoute(webhookPath, route);
	const readinessAbort = new AbortController();
	const lifecycle = waitUntilAbort(AbortSignal.any([params.abortSignal, readinessAbort.signal]), unregister);
	try {
		await route.ready;
	} catch (error) {
		readinessAbort.abort();
		await Promise.allSettled([lifecycle]);
		throw error;
	}
	return {
		lifecycle,
		isActive: () => activeRoutePaths.get(webhookPath) === route
	};
}
async function startSmsGatewayAccount(params) {
	params.statusSink?.({ lifecycle: "starting" });
	if (!params.account.enabled) {
		params.log?.info?.(`SMS account ${params.account.accountId} is disabled`);
		params.statusSink?.(channelStoppedPatch());
		return waitUntilAbort(params.abortSignal);
	}
	const warnings = collectSmsStartupWarnings(params.account);
	if (warnings.some((warning) => warning.includes("required"))) {
		for (const warning of warnings) params.log?.warn?.(warning);
		params.statusSink?.(channelBlockedPatch(warnings.join("; "), {
			running: true,
			connected: false
		}));
		return waitUntilAbort(params.abortSignal);
	}
	for (const warning of warnings) params.log?.warn?.(warning);
	const registration = await registerSmsWebhookRoute(params);
	if (registration.isActive()) {
		params.log?.info?.(`Registered SMS webhook route ${params.account.webhookPath} for account ${params.account.accountId}`);
		params.statusSink?.(channelReadyPatch());
	}
	return registration.lifecycle.finally(() => {
		params.statusSink?.(channelStoppedPatch());
	});
}
//#endregion
//#region extensions/sms/src/status.ts
const TWILIO_ERROR_WEBHOOK_REACHABILITY = "11200";
function resolveRemoteProbeTimeoutMs(timeoutMs) {
	const normalized = Math.max(1, Math.floor(timeoutMs));
	const settleMarginMs = Math.min(100, Math.max(1, Math.floor(normalized / 10)));
	return Math.max(0, normalized - settleMarginMs);
}
async function runRemoteProbe(params) {
	try {
		return {
			kind: "value",
			value: await withTimeout(Promise.resolve().then(params.run), params.timeoutMs, { message: `timed out after ${params.timeoutMs}ms` })
		};
	} catch (error) {
		return {
			kind: "error",
			error: `${params.label} failed: ${formatErrorMessage(error)}`
		};
	}
}
function addTailscaleHint(account, hints) {
	let host;
	try {
		host = new URL(account.publicWebhookUrl).hostname;
	} catch {
		return;
	}
	if (!host.endsWith(".ts.net")) return;
	hints.push(`Tailscale Funnel must expose the exact SMS path: tailscale funnel --bg --set-path ${account.webhookPath} http://127.0.0.1:<gateway-port>${account.webhookPath}`);
}
function compareTwilioWebhook(account, phoneNumber) {
	if (!account.fromNumber) return {
		status: "skipped",
		reason: "Messaging Service senders do not have one phone-number SMS webhook to inspect."
	};
	if (!phoneNumber) return {
		status: "number-not-found",
		expectedNumber: account.fromNumber
	};
	const configuredMethod = phoneNumber.smsMethod.toUpperCase();
	if (!phoneNumber.smsUrl) return {
		status: "missing",
		phoneNumber: phoneNumber.phoneNumber || account.fromNumber,
		expectedUrl: account.publicWebhookUrl,
		configuredMethod
	};
	if (configuredMethod && configuredMethod !== "POST") return {
		status: "method-mismatch",
		phoneNumber: phoneNumber.phoneNumber || account.fromNumber,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: phoneNumber.smsUrl,
		configuredMethod
	};
	if (phoneNumber.smsUrl !== account.publicWebhookUrl) return {
		status: "url-mismatch",
		phoneNumber: phoneNumber.phoneNumber || account.fromNumber,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: phoneNumber.smsUrl,
		configuredMethod
	};
	return {
		status: "matches",
		phoneNumber: phoneNumber.phoneNumber || account.fromNumber,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: phoneNumber.smsUrl,
		configuredMethod,
		voiceUrl: phoneNumber.voiceUrl
	};
}
function compareTwilioMessagingService(account, service) {
	if (service.useInboundWebhookOnNumber) return {
		status: "unavailable",
		reason: "Twilio Messaging Service defers inbound webhooks to sender phone numbers; configure fromNumber or disable defer-to-sender before probing."
	};
	const configuredMethod = service.inboundMethod.toUpperCase();
	if (!service.inboundRequestUrl) return {
		status: "messaging-service-missing",
		serviceSid: service.sid || account.messagingServiceSid,
		expectedUrl: account.publicWebhookUrl,
		configuredMethod
	};
	if (configuredMethod && configuredMethod !== "POST") return {
		status: "messaging-service-method-mismatch",
		serviceSid: service.sid || account.messagingServiceSid,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: service.inboundRequestUrl,
		configuredMethod
	};
	if (service.inboundRequestUrl !== account.publicWebhookUrl) return {
		status: "messaging-service-url-mismatch",
		serviceSid: service.sid || account.messagingServiceSid,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: service.inboundRequestUrl,
		configuredMethod
	};
	return {
		status: "messaging-service-matches",
		serviceSid: service.sid || account.messagingServiceSid,
		expectedUrl: account.publicWebhookUrl,
		configuredUrl: service.inboundRequestUrl,
		configuredMethod
	};
}
function recentInboundSummary(messages) {
	const message = messages[0];
	if (!message) return;
	return {
		sid: message.sid,
		direction: message.direction,
		status: message.status,
		errorCode: message.errorCode,
		dateCreated: message.dateCreated,
		dateSent: message.dateSent
	};
}
function recentOutboundSummary(records) {
	const record = records[0];
	if (!record) return;
	return {
		messageSid: record.messageSid,
		status: record.status,
		lastObservedAt: record.lastObservedAt,
		...record.errorCode ? { errorCode: record.errorCode } : {},
		...record.conflict ? { conflict: true } : {}
	};
}
function webhookError(probe) {
	switch (probe.status) {
		case "matches":
		case "skipped": return;
		case "unavailable": return probe.reason;
		case "number-not-found": return `Twilio account does not list ${probe.expectedNumber} as an incoming phone number.`;
		case "missing": return `Twilio number ${probe.phoneNumber} has no SMS webhook URL configured.`;
		case "method-mismatch": return `Twilio number ${probe.phoneNumber} uses ${probe.configuredMethod || "an unknown method"} for SMS webhooks; use POST.`;
		case "url-mismatch": return `Twilio number ${probe.phoneNumber} points SMS webhooks at ${probe.configuredUrl}; expected ${probe.expectedUrl}.`;
		case "messaging-service-missing": return `Twilio Messaging Service ${probe.serviceSid} has no inbound request URL configured.`;
		case "messaging-service-method-mismatch": return `Twilio Messaging Service ${probe.serviceSid} uses ${probe.configuredMethod || "an unknown method"} for inbound webhooks; use POST.`;
		case "messaging-service-url-mismatch": return `Twilio Messaging Service ${probe.serviceSid} points inbound webhooks at ${probe.configuredUrl}; expected ${probe.expectedUrl}.`;
		case "messaging-service-matches": return;
	}
}
async function probeSmsAccount(params) {
	const hints = [];
	addTailscaleHint(params.account, hints);
	const recentOutbound = recentOutboundSummary(params.options?.deliveryRecords ?? []);
	const remoteTimeoutMs = resolveRemoteProbeTimeoutMs(params.timeoutMs);
	let webhook;
	let messageHistoryError;
	let messages = [];
	if (remoteTimeoutMs === 0) webhook = {
		status: "unavailable",
		reason: "Twilio webhook probe skipped because the probe timeout is too short."
	};
	else {
		const webhookTask = params.account.fromNumber ? runRemoteProbe({
			label: "Twilio webhook probe",
			timeoutMs: remoteTimeoutMs,
			run: async () => compareTwilioWebhook(params.account, (await listTwilioIncomingPhoneNumbers({
				account: params.account,
				phoneNumber: params.account.fromNumber,
				fetchImpl: params.options?.fetchImpl,
				timeoutMs: remoteTimeoutMs
			}))[0])
		}) : params.account.messagingServiceSid ? runRemoteProbe({
			label: "Twilio webhook probe",
			timeoutMs: remoteTimeoutMs,
			run: async () => compareTwilioMessagingService(params.account, await retrieveTwilioMessagingService({
				account: params.account,
				serviceSid: params.account.messagingServiceSid,
				fetchImpl: params.options?.fetchImpl,
				timeoutMs: remoteTimeoutMs
			}))
		}) : Promise.resolve({
			kind: "value",
			value: {
				status: "unavailable",
				reason: "Twilio SMS probe requires fromNumber or messagingServiceSid."
			}
		});
		const messageTask = params.account.fromNumber ? runRemoteProbe({
			label: "Twilio message history probe",
			timeoutMs: remoteTimeoutMs,
			run: async () => await listTwilioMessages({
				account: params.account,
				to: params.account.fromNumber,
				pageSize: 3,
				fetchImpl: params.options?.fetchImpl,
				timeoutMs: remoteTimeoutMs
			})
		}) : Promise.resolve({
			kind: "value",
			value: []
		});
		const [webhookOutcome, messageOutcome] = await Promise.all([webhookTask, messageTask]);
		webhook = webhookOutcome.kind === "value" ? webhookOutcome.value : {
			status: "unavailable",
			reason: webhookOutcome.error
		};
		if (messageOutcome.kind === "value") messages = messageOutcome.value;
		else messageHistoryError = messageOutcome.error;
	}
	const recentInbound = recentInboundSummary(messages);
	if (recentInbound?.errorCode === TWILIO_ERROR_WEBHOOK_REACHABILITY) hints.push("Twilio error 11200 means Twilio could not reach the SMS webhook. Check the public URL, tunnel/Funnel route, and Twilio Messaging webhook method.");
	const error = [
		webhookError(webhook),
		messageHistoryError,
		recentInbound?.errorCode === TWILIO_ERROR_WEBHOOK_REACHABILITY ? `Recent inbound SMS ${recentInbound.sid} has Twilio error 11200.` : void 0
	].filter((value) => Boolean(value)).join(" ");
	return {
		ok: !error,
		...error ? { error } : {},
		webhook,
		...recentInbound ? { recentInbound } : {},
		...recentOutbound ? { recentOutbound } : {},
		hints
	};
}
function formatSmsProbeLines(probe) {
	if (!probe || typeof probe !== "object") return [];
	const smsProbe = probe;
	const lines = [];
	if (smsProbe.ok === true) lines.push({
		text: "Probe: ok",
		tone: "success"
	});
	else if (smsProbe.ok === false) lines.push({
		text: `Probe: failed${smsProbe.error ? ` (${smsProbe.error})` : ""}`,
		tone: "error"
	});
	if (smsProbe.webhook?.status === "matches" || smsProbe.webhook?.status === "messaging-service-matches") lines.push({ text: `Twilio SMS webhook: ${smsProbe.webhook.configuredUrl}` });
	else if (smsProbe.webhook?.status && smsProbe.webhook.status !== "skipped") lines.push({
		text: `Twilio SMS webhook: ${smsProbe.webhook.status}`,
		tone: "warn"
	});
	if (smsProbe.recentInbound?.sid) {
		const error = smsProbe.recentInbound.errorCode ? ` error=${smsProbe.recentInbound.errorCode}` : "";
		lines.push({
			text: `Recent inbound: ${smsProbe.recentInbound.status || "unknown"}${error}`,
			tone: smsProbe.recentInbound.errorCode ? "warn" : "muted"
		});
	}
	if (smsProbe.recentOutbound?.messageSid) {
		const error = smsProbe.recentOutbound.errorCode ? ` error=${smsProbe.recentOutbound.errorCode}` : "";
		const status = smsProbe.recentOutbound.status || "unknown";
		const tone = status === "delivered" ? "success" : status === "failed" || status === "undelivered" || status === "canceled" || status === "conflicted" ? "error" : "muted";
		lines.push({
			text: `Recent outbound: ${status}${error}`,
			tone
		});
	}
	for (const hint of smsProbe.hints ?? []) lines.push({
		text: hint,
		tone: "warn"
	});
	return lines;
}
//#endregion
//#region extensions/sms/src/channel.ts
const CHANNEL_ID = "sms";
const smsConfigAdapter = createHybridChannelConfigAdapter({
	sectionKey: CHANNEL_ID,
	listAccountIds: listSmsAccountIds,
	resolveAccount: resolveSmsAccount,
	defaultAccountId: resolveDefaultSmsAccountId,
	clearBaseFields: [
		"accountSid",
		"authToken",
		"fromNumber",
		"messagingServiceSid",
		"defaultTo",
		"webhookPath",
		"publicWebhookUrl",
		"dangerouslyDisableSignatureValidation",
		"dmPolicy",
		"allowFrom",
		"textChunkLimit",
		"mediaMaxMb"
	],
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeStringEntries(allowFrom.map((entry) => normalizeSmsAllowFrom(String(entry)))),
	resolveDefaultTo: (account) => account.defaultTo
});
const resolveSmsDmPolicy = createScopedDmSecurityResolver({
	channelKey: CHANNEL_ID,
	resolvePolicy: (account) => account.dmPolicy,
	resolveAllowFrom: (account) => account.allowFrom,
	policyPathSuffix: "dmPolicy",
	defaultPolicy: "pairing",
	approveHint: "openclaw pairing approve sms <code>",
	normalizeEntry: normalizeSmsAllowFrom
});
const collectSmsSecurityWarnings = createConditionalWarningCollector((account) => account.dangerouslyDisableSignatureValidation && "- SMS: Twilio signature validation is disabled. Only use this for local testing.");
const collectSmsOpenDmFindings = createConditionalWarningCollector.findings({
	collectWarnings: createConditionalWarningCollector((account) => account.dmPolicy === "open" && account.allowFrom.includes("*") && "- SMS: dmPolicy=\"open\" allows any phone number to message the bot."),
	checkId: "channels.sms.dm.open",
	severity: "critical",
	title: "SMS security warning"
});
function smsSetupPatch(input) {
	const patch = {};
	for (const key of [
		"accountSid",
		"authToken",
		"fromNumber",
		"messagingServiceSid",
		"defaultTo",
		"webhookPath",
		"publicWebhookUrl",
		"dmPolicy",
		"allowFrom"
	]) if (input[key] !== void 0) patch[key] = input[key];
	return patch;
}
function applySmsAccountConfig(params) {
	const patch = smsSetupPatch(params.input);
	const channels = { ...params.cfg.channels };
	const current = { ...channels[CHANNEL_ID] };
	if (params.accountId === DEFAULT_ACCOUNT_ID) {
		channels[CHANNEL_ID] = {
			...current,
			...patch
		};
		return {
			...params.cfg,
			channels
		};
	}
	const accounts = { ...current.accounts };
	accounts[params.accountId] = {
		...accounts[params.accountId],
		...patch
	};
	channels[CHANNEL_ID] = {
		...current,
		accounts
	};
	return {
		...params.cfg,
		channels
	};
}
const smsSetupContract = defineChannelSetupContract({
	fields: {
		accountSid: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--account-sid <sid>",
				description: "Twilio account SID"
			}
		},
		authToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--auth-token <token>",
				description: "Twilio auth token"
			}
		},
		fromNumber: {
			kind: "string",
			cli: {
				flags: "--from-number <e164>",
				description: "Twilio sender phone number"
			}
		},
		messagingServiceSid: {
			kind: "string",
			cli: {
				flags: "--messaging-service-sid <sid>",
				description: "Twilio Messaging Service SID"
			}
		},
		defaultTo: {
			kind: "string",
			cli: {
				flags: "--default-to <e164>",
				description: "Default SMS recipient"
			}
		},
		webhookPath: {
			kind: "string",
			cli: {
				flags: "--webhook-path <path>",
				description: "SMS webhook path"
			}
		},
		publicWebhookUrl: {
			kind: "string",
			cli: {
				flags: "--public-webhook-url <url>",
				description: "Public SMS webhook URL"
			}
		},
		dmPolicy: {
			kind: "choice",
			choices: [
				"pairing",
				"allowlist",
				"open",
				"disabled"
			],
			cli: {
				flags: "--dm-policy <policy>",
				description: "SMS DM policy"
			}
		},
		allowFrom: {
			kind: "string-list",
			cli: {
				flags: "--allow-from <numbers>",
				description: "Allowed SMS senders"
			}
		}
	},
	adapter: { applyAccountConfig: applySmsAccountConfig }
});
function createSmsReceipt(params) {
	const first = params.results[0];
	if (!first) throw new Error("SMS send did not return a Twilio Message SID.");
	const receipt = createSmsMessageReceipt(params);
	return {
		channel: CHANNEL_ID,
		messageId: first.sid,
		chatId: first.to,
		receipt
	};
}
function resolveSmsTextChunkLimit(params) {
	return resolveSmsAccount(params.cfg, params.accountId).textChunkLimit || params.fallbackLimit || 1500;
}
async function sendSmsText(ctx) {
	const account = resolveSmsAccount(ctx.cfg, ctx.accountId);
	const to = normalizeSmsPhoneNumber(ctx.to) || account.defaultTo;
	if (!looksLikeSmsPhoneNumber(to)) throw new Error(`Invalid SMS target: ${ctx.to}`);
	return createSmsReceipt({
		results: await sendSmsTextChunks({
			account,
			to,
			text: ctx.text,
			onPlatformSendDispatch: ctx.onPlatformSendDispatch,
			onDeliveryResult: ctx.onDeliveryResult
		}),
		kind: "text"
	});
}
const preparedSmsAttachmentAttempts = /* @__PURE__ */ new WeakMap();
function resolveSmsAttachmentAttemptToken(attemptToken) {
	if (!isRecord(attemptToken) || typeof attemptToken.platformDispatchStarted !== "boolean" || !isRecord(attemptToken.attempt) || typeof attemptToken.attempt.cleanupHostedMedia !== "function") return;
	return attemptToken;
}
async function prepareSmsAttachmentAttempt(ctx) {
	const account = resolveSmsAccount(ctx.cfg, ctx.accountId);
	const to = normalizeSmsPhoneNumber(ctx.to) || account.defaultTo;
	if (!looksLikeSmsPhoneNumber(to)) throw new Error(`Invalid SMS target: ${ctx.to}`);
	return {
		account,
		to,
		attempt: await prepareSmsMediaAttempt({
			account,
			text: ctx.text,
			mediaUrl: ctx.mediaUrl,
			mediaAccess: ctx.mediaAccess,
			mediaLocalRoots: ctx.mediaLocalRoots,
			mediaReadFile: ctx.mediaReadFile
		}),
		platformDispatchStarted: false
	};
}
function getOrPrepareSmsAttachmentAttempt(ctx) {
	const existing = preparedSmsAttachmentAttempts.get(ctx);
	if (existing) return existing;
	const created = prepareSmsAttachmentAttempt(ctx);
	preparedSmsAttachmentAttempts.set(ctx, created);
	return created;
}
async function sendPreparedSmsAttachment(ctx) {
	const preparation = preparedSmsAttachmentAttempts.get(ctx);
	preparedSmsAttachmentAttempts.delete(ctx);
	if (!preparation) throw new Error("SMS message lifecycle did not prepare the MMS attachment.");
	const prepared = await preparation;
	return createSmsReceipt({
		results: await sendPreparedSmsMediaAttempt({
			...prepared,
			onPlatformSendDispatch: async () => {
				await ctx.onPlatformSendDispatch?.();
				prepared.platformDispatchStarted = true;
			},
			onDeliveryResult: ctx.onDeliveryResult
		}),
		kind: "media"
	});
}
const smsMessageAdapter = defineChannelMessageAdapter({
	id: CHANNEL_ID,
	durableFinal: { capabilities: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	send: {
		lifecycle: {
			beforeSendAttempt: async (ctx) => {
				if (ctx.kind !== "media") return;
				return await getOrPrepareSmsAttachmentAttempt(ctx);
			},
			afterSendFailure: async (ctx) => {
				if (ctx.kind !== "media") return;
				const attemptToken = resolveSmsAttachmentAttemptToken(ctx.attemptToken);
				if (!attemptToken || attemptToken.platformDispatchStarted && !(ctx.error instanceof PlatformMessageNotDispatchedError)) return;
				await attemptToken.attempt.cleanupHostedMedia();
			}
		},
		text: async (ctx) => await sendSmsText(ctx),
		media: async (ctx) => await sendPreparedSmsAttachment(ctx)
	}
});
function resolveSmsOutboundSessionRoute(params) {
	const to = normalizeSmsPhoneNumber(params.resolvedTarget?.to ?? params.target);
	if (!looksLikeSmsPhoneNumber(to)) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: CHANNEL_ID,
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: "direct",
			id: to
		},
		chatType: "direct",
		from: `sms:${to}`,
		to: `sms:${to}`
	});
}
const smsPlugin = createChatChannelPlugin({
	base: {
		id: CHANNEL_ID,
		meta: {
			id: CHANNEL_ID,
			label: "SMS",
			selectionLabel: "SMS (Twilio)",
			detailLabel: "Twilio SMS/MMS",
			docsPath: "/channels/sms",
			docsLabel: "sms",
			blurb: "Twilio-backed SMS/MMS with inbound webhooks and outbound replies.",
			order: 88
		},
		capabilities: {
			chatTypes: ["direct"],
			media: true,
			threads: false,
			reactions: false,
			edit: false,
			unsend: false,
			reply: false,
			effects: false,
			blockStreaming: false
		},
		reload: { configPrefixes: [`channels.${CHANNEL_ID}`] },
		configSchema: SmsChannelConfigSchema,
		setupContract: smsSetupContract,
		config: {
			...smsConfigAdapter,
			inspectAccount: inspectSmsAccount,
			isConfigured: isSmsAccountConfigured,
			unconfiguredReason: () => "SMS requires accountSid, authToken, and fromNumber or messagingServiceSid.",
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.fromNumber || account.messagingServiceSid || "SMS",
				configured: isSmsAccountConfigured(account),
				enabled: account.enabled
			})
		},
		messaging: {
			targetPrefixes: ["twilio-sms"],
			normalizeTarget: (target) => normalizeSmsPhoneNumber(target),
			inferTargetChatType: ({ to }) => looksLikeSmsPhoneNumber(normalizeSmsPhoneNumber(to)) ? "direct" : void 0,
			resolveOutboundSessionRoute: (params) => resolveSmsOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeSmsPhoneNumber,
				hint: "<+15551234567>"
			}
		},
		directory: createEmptyChannelDirectoryAdapter(),
		gateway: { startAccount: async (ctx) => {
			if (!ctx.channelRuntime) {
				ctx.log?.warn?.("SMS channel runtime is not available; webhook route not started");
				return;
			}
			const statusSink = createAccountStatusSink({
				accountId: ctx.account.accountId,
				setStatus: ctx.setStatus
			});
			return await startSmsGatewayAccount({
				cfg: ctx.cfg,
				account: ctx.account,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				log: ctx.log,
				statusSink
			});
		} },
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			resolveAccountSnapshot: ({ account }) => {
				const configured = isSmsAccountConfigured(account);
				return {
					accountId: account.accountId,
					name: account.fromNumber || account.messagingServiceSid || "SMS",
					enabled: account.enabled,
					configured,
					extra: { statusState: !account.enabled ? "disabled" : configured ? "configured" : "unconfigured" }
				};
			},
			probeAccount: async ({ account, timeoutMs }) => {
				const startedAt = Date.now();
				const deliveryRecords = await listRecentSmsDeliveryRecords(account);
				const elapsedMs = Math.max(0, Date.now() - startedAt);
				return await probeSmsAccount({
					account,
					timeoutMs: Math.max(1, timeoutMs - elapsedMs),
					options: { deliveryRecords }
				});
			},
			formatCapabilitiesProbe: ({ probe }) => formatSmsProbeLines(probe),
			buildCapabilitiesDiagnostics: async ({ account }) => ({ lines: collectSmsStartupWarnings(account).map((text) => ({
				text,
				tone: "warn"
			})) })
		}),
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		agentPrompt: { messageToolHints: () => [
			"",
			"### SMS Formatting",
			"SMS text is plain text. MMS attachments are supported; keep captions brief and avoid markdown tables."
		] },
		message: smsMessageAdapter
	},
	pairing: { text: {
		idLabel: "phoneNumber",
		message: "OpenClaw: your SMS access has been approved.",
		normalizeAllowEntry: normalizeSmsAllowFrom,
		notify: async ({ cfg, id, message, accountId }) => {
			await sendSmsTextChunks({
				account: resolveSmsAccount(cfg, accountId),
				to: normalizeSmsPhoneNumber(id),
				text: message
			});
		}
	} },
	security: {
		resolveDmPolicy: resolveSmsDmPolicy,
		collectWarnings: ({ account }) => [...collectSmsSecurityWarnings(account), ...collectSmsOpenDmFindings(account)]
	},
	outbound: {
		deliveryMode: "gateway",
		chunker: chunkTextForOutbound,
		chunkerMode: "text",
		textChunkLimit: 1500,
		resolveEffectiveTextChunkLimit: resolveSmsTextChunkLimit,
		resolveTarget: ({ cfg, to, accountId }) => {
			const explicit = normalizeSmsPhoneNumber(to ?? "");
			if (explicit) return {
				ok: true,
				to: explicit
			};
			if (cfg) {
				const account = resolveSmsAccount(cfg, accountId);
				if (account.defaultTo) return {
					ok: true,
					to: account.defaultTo
				};
			}
			return {
				ok: false,
				error: /* @__PURE__ */ new Error("SMS target must be an E.164 phone number.")
			};
		},
		sanitizeText: ({ text }) => toSmsPlainText(text),
		sendText: sendSmsText
	}
});
//#endregion
export { smsPlugin };
