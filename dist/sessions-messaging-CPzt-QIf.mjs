import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { ma as validateSessionsSendParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { c as invalidSessionRequest, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import "./sessions-D_sxp1B4.mjs";
import { a as readGatewayRequestMutationAuthority, n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { a as terminateAcceptedCollectorRun } from "./subagent-spawn-cleanup-t0t2OBAm.mjs";
import { c as resolveDeletedAgentIdFromSessionKey, i as loadGatewaySessionEntryReadOnly, r as loadGatewaySessionEntry } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-C3PMeNMG.mjs";
import { o as gatewayClientUploadPolicyError } from "./upload-policy-B7cW3IFl.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as isAgentMainSessionKey, o as requireSessionKey } from "./sessions-shared-CRlp7L3V.mjs";
import { t as handleDirectExternalChatSend } from "./chat-send-external-entry-nZ-U_5HK.mjs";
import { n as isFreshChatSendStarted, t as sessionCreateHandlers } from "./sessions-create-B9JUbLv-.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-messaging.ts
async function createAgentMainSessionForSend(options, canonicalKey) {
	const agentId = parseAgentSessionKey(canonicalKey)?.agentId;
	if (!agentId) return invalidSessionRequest(`session not found: ${canonicalKey}`);
	let createResult;
	const createOptions = bindGatewayRequestHandlerMutationAuthority(options, {
		...options,
		params: {
			key: canonicalKey,
			agentId
		},
		respond: (ok, payload, error) => {
			createResult = {
				ok,
				payload: asOptionalObjectRecord(payload),
				error
			};
		}
	}, void 0);
	await expectDefined(sessionCreateHandlers["sessions.create"], "sessions.create handler")(createOptions);
	if (!createResult) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond")
	};
	if (!createResult.ok) return {
		ok: false,
		error: createResult.error ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create session")
	};
	const createdKey = normalizeOptionalString(createResult.payload?.key) ?? canonicalKey;
	const loaded = loadGatewaySessionEntryReadOnly(createdKey, { agentId });
	if (!loaded.entry?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `session not created: ${createdKey}`)
	};
	return {
		ok: true,
		entry: loaded.entry,
		canonicalKey: loaded.canonicalKey
	};
}
async function handleSessionSend(method, options) {
	const queueMode = method === "sessions.steer" ? "interrupt" : void 0;
	if (!assertValidParams(options.params, validateSessionsSendParams, method, options.respond)) return;
	const p = options.params;
	const key = requireSessionKey(p.key, options.respond);
	if (!key) return;
	const cfg = options.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		options.respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const loaded = loadGatewaySessionEntry(key, { agentId: requestedAgentId });
	const { legacyKey } = loaded;
	let { entry, canonicalKey } = loaded;
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, canonicalKey, entry, { acpMetadataSessionKey: legacyKey ?? canonicalKey });
	if (deletedAgentId !== null) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
		return;
	}
	const explicitIdempotencyKey = normalizeOptionalString(p.idempotencyKey);
	const idempotencyKey = explicitIdempotencyKey ?? randomUUID();
	const respond = options.respond;
	const requestAuthority = readGatewayRequestMutationAuthority(options);
	const sessionAuthorization = options.sessionMutationAuthorization;
	const dispatchChatSend = async (dispatchRespond) => {
		const forwarded = bindGatewayRequestHandlerMutationAuthority(options, {
			...options,
			params: {
				sessionKey: canonicalKey,
				...requestedAgentId ? { agentId: requestedAgentId } : {},
				message: p.message,
				...p.mentions ? { mentions: p.mentions } : {},
				thinking: p.thinking,
				attachments: p.attachments,
				timeoutMs: p.timeoutMs,
				idempotencyKey,
				...queueMode ? { queueMode } : {}
			},
			respond: dispatchRespond
		}, void 0);
		await handleDirectExternalChatSend(forwarded);
	};
	const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry, { allowPendingWorkspace: true });
	if (archivedSessionError) {
		if (explicitIdempotencyKey) {
			await dispatchChatSend(respond);
			return;
		}
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
		return;
	}
	if (!entry?.sessionId) {
		const uploadError = gatewayClientUploadPolicyError({
			method: "sessions.send",
			requestParams: options.params,
			client: options.client,
			context: options.context
		});
		if (uploadError) {
			options.respond(false, void 0, uploadError);
			return;
		}
	}
	if (!entry?.sessionId && queueMode !== "interrupt" && isAgentMainSessionKey(cfg, canonicalKey)) {
		const created = await createAgentMainSessionForSend(options, canonicalKey);
		if (!created.ok) {
			respond(false, void 0, created.error);
			return;
		}
		entry = created.entry;
		canonicalKey = created.canonicalKey;
	}
	if (!entry?.sessionId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
		return;
	}
	let sendAcked = false;
	let sendPayload;
	let sendCached = false;
	let startedRunId;
	let interruptedActiveRun = false;
	await dispatchChatSend((ok, payload, error, meta) => {
		sendAcked = ok;
		sendPayload = payload;
		sendCached = meta?.cached === true;
		const result = asOptionalObjectRecord(payload);
		startedRunId = readStringValue(result?.runId);
		interruptedActiveRun = ok && result?.interruptedActiveRun === true;
		respond(ok, payload, error, meta);
	});
	if (sendAcked) {
		if (isFreshChatSendStarted({
			payload: sendPayload,
			cached: sendCached
		})) try {
			await reactivateCompletedSubagentSession({
				sessionKey: canonicalKey,
				runId: startedRunId,
				task: p.message,
				gatewayContextResolver: options.context.resolveGatewayContext,
				assertCurrent: () => {
					if (sessionAuthorization?.assertAdmittedInputCurrent) sessionAuthorization.assertAdmittedInputCurrent();
					else {
						requestAuthority.assertCurrent();
						sessionAuthorization?.assertCurrent();
					}
				}
			});
		} catch (error) {
			if (startedRunId) await terminateAcceptedCollectorRun({
				childSessionKey: canonicalKey,
				gatewayRunId: startedRunId,
				sessionCleanup: "preserve"
			});
			throw error;
		}
		emitSessionsChanged(options.context, {
			sessionKey: canonicalKey,
			...requestedAgentId ? { agentId: requestedAgentId } : {},
			reason: interruptedActiveRun ? "steer" : "send"
		});
	}
}
const sessionMessagingHandlers = {
	"sessions.send": (options) => handleSessionSend("sessions.send", options),
	"sessions.steer": (options) => handleSessionSend("sessions.steer", options)
};
//#endregion
export { sessionMessagingHandlers };
