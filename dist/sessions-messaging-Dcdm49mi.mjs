import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { na as validateSessionsSendParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import { n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-DivkApLb.mjs";
import { a as terminateAcceptedCollectorRun } from "./subagent-spawn-cleanup-_oHFrRkj.mjs";
import { i as loadGatewaySessionEntryReadOnly, l as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-BxbD49SF.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as isAgentMainSessionKey, s as requireSessionKey } from "./sessions-shared-DFVq928u.mjs";
import { t as handleDirectExternalChatSend } from "./chat-send-external-entry-A-MWvbgo.mjs";
import { n as isFreshChatSendStarted, t as sessionCreateHandlers } from "./sessions-create-PWhsPLmI.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-messaging.ts
async function createAgentMainSessionForSend(options, canonicalKey) {
	const agentId = parseAgentSessionKey(canonicalKey)?.agentId;
	if (!agentId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${canonicalKey}`)
	};
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
				payload: payload && typeof payload === "object" ? payload : void 0,
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
	const rawIdempotencyKey = p.idempotencyKey;
	const explicitIdempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : void 0;
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
		startedRunId = payload && typeof payload === "object" && typeof payload.runId === "string" ? payload.runId : void 0;
		interruptedActiveRun = ok && payload !== null && typeof payload === "object" && "interruptedActiveRun" in payload && payload.interruptedActiveRun === true;
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
				gatewayContextResolver: options.context.resolveGatewayContext
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
	"sessions.send": async (options) => {
		await handleSessionSend("sessions.send", options);
	},
	"sessions.steer": async (options) => {
		await handleSessionSend("sessions.steer", options);
	}
};
//#endregion
export { sessionMessagingHandlers };
