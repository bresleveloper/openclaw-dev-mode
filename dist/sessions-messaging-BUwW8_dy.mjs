import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ia as validateSessionsSendParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { o as prepareDeletedAgentSessionCheck } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority, t as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { i as terminateAcceptedCollectorRun } from "./subagent-spawn-cleanup-Csz52Q2U.mjs";
import { u as isFreshChatSendStarted } from "./session-create-root-lHgGqSce.mjs";
import "./session-utils-CGx9I2of.mjs";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-tsWjcE7F.mjs";
import { o as gatewayClientUploadPolicyError } from "./upload-policy-Bd2Za3Ho.mjs";
import { a as requireSessionKey, n as isAgentMainSessionKey } from "./sessions-shared-DECO-QN2.mjs";
import { t as handleDirectExternalChatSend } from "./chat-send-external-entry-DKQCcI5Y.mjs";
import { t as sessionCreateHandlers } from "./sessions-create-vLlj1J3V.mjs";
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
	if (!createResult?.ok) return {
		ok: false,
		error: createResult?.error ?? errorShape(ErrorCodes.UNAVAILABLE, createResult ? "failed to create session" : "sessions.create did not respond")
	};
	const createdKey = normalizeOptionalString(createResult.payload?.key) ?? canonicalKey;
	const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: options.context.getRuntimeConfig(),
		key: createdKey,
		agentId,
		assertActive: readGatewayRequestMutationAuthority(options).assertPreparationCurrent
	});
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
	const requestAuthority = readGatewayRequestMutationAuthority(options);
	const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg,
		key,
		agentId: requestedAgentId,
		excludeInternalEffects: true,
		assertActive: requestAuthority.assertPreparationCurrent
	});
	const { legacyKey } = loaded;
	let { entry, canonicalKey } = loaded;
	const sessionAuthorization = options.sessionMutationAuthorization;
	const deletedAgent = prepareDeletedAgentSessionCheck({
		cfg,
		sessionKey: canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey ?? canonicalKey,
		assertCurrent: requestAuthority.assertPreparationCurrent
	});
	const deletedAgentId = deletedAgent instanceof Promise ? await deletedAgent : deletedAgent;
	if (deletedAgent instanceof Promise) requestAuthority.assertPreparationCurrent();
	if (deletedAgentId !== null) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
		return;
	}
	const explicitIdempotencyKey = normalizeOptionalString(p.idempotencyKey);
	const idempotencyKey = explicitIdempotencyKey ?? randomUUID();
	const respond = options.respond;
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
