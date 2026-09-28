import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as readSecretFile } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as getApnsResponseBodyCaptureText, i as createApnsResponseBodyCapture, n as appendApnsResponseBodyCapture, r as connectApnsHttp2Session, t as APNS_HTTP2_CANCEL_CODE } from "./push-apns-http2-2m1j65g8.mjs";
import { _ as sendApnsRelayPush, a as isValidApnsTopic, d as normalizeApnsTopic, r as isLikelyApnsToken, u as normalizeApnsToken } from "./push-apns-store-9CGb-HCs.mjs";
import { createHash, createPrivateKey, sign } from "node:crypto";
//#region src/infra/push-apns-auth.ts
const APNS_JWT_TTL_MS = 3e6;
let cachedJwt = null;
function toBase64UrlBytes(value) {
	return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function toBase64UrlJson(value) {
	return toBase64UrlBytes(Buffer.from(JSON.stringify(value)));
}
function getJwtCacheKey(auth) {
	const keyHash = createHash("sha256").update(auth.privateKey).digest("hex");
	return `${auth.teamId}:${auth.keyId}:${keyHash}`;
}
function getApnsBearerToken(auth, nowMs = Date.now()) {
	const cacheKey = getJwtCacheKey(auth);
	if (cachedJwt && cachedJwt.cacheKey === cacheKey && nowMs < cachedJwt.expiresAtMs) return cachedJwt.token;
	const iat = Math.floor(nowMs / 1e3);
	const signingInput = `${toBase64UrlJson({
		alg: "ES256",
		kid: auth.keyId,
		typ: "JWT"
	})}.${toBase64UrlJson({
		iss: auth.teamId,
		iat
	})}`;
	const token = `${signingInput}.${toBase64UrlBytes(sign("sha256", Buffer.from(signingInput, "utf8"), {
		key: createPrivateKey(auth.privateKey),
		dsaEncoding: "ieee-p1363"
	}))}`;
	cachedJwt = {
		cacheKey,
		token,
		expiresAtMs: nowMs + APNS_JWT_TTL_MS
	};
	return token;
}
function normalizePrivateKey(value) {
	return value.trim().replace(/\\n/g, "\n");
}
function normalizeNonEmptyString(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	return trimmed.length > 0 ? trimmed : null;
}
/** Resolves direct APNs provider auth from env, accepting inline or file-backed keys. */
async function resolveApnsAuthConfigFromEnv(env = process.env) {
	const teamId = normalizeNonEmptyString(env.OPENCLAW_APNS_TEAM_ID);
	const keyId = normalizeNonEmptyString(env.OPENCLAW_APNS_KEY_ID);
	if (!teamId || !keyId) return {
		ok: false,
		error: "APNs auth missing: set OPENCLAW_APNS_TEAM_ID and OPENCLAW_APNS_KEY_ID"
	};
	const inlineKeyRaw = normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_P8) ?? normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY);
	if (inlineKeyRaw) return {
		ok: true,
		value: {
			teamId,
			keyId,
			privateKey: normalizePrivateKey(inlineKeyRaw)
		}
	};
	const keyPath = normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_PATH);
	if (!keyPath) return {
		ok: false,
		error: "APNs private key missing: set OPENCLAW_APNS_PRIVATE_KEY_P8 or OPENCLAW_APNS_PRIVATE_KEY_PATH"
	};
	try {
		return {
			ok: true,
			value: {
				teamId,
				keyId,
				privateKey: normalizePrivateKey(await readSecretFile(keyPath, "APNs private key"))
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: `failed reading OPENCLAW_APNS_PRIVATE_KEY_PATH (${keyPath}): ${formatErrorMessage(err)}`
		};
	}
}
//#endregion
//#region src/infra/push-apns-payloads.ts
const EXEC_APPROVAL_GENERIC_ALERT_BODY = "Open OpenClaw to review this request.";
const PLUGIN_APPROVAL_ALERT_BODY_MAX_LENGTH = 256;
function toPushMetadata(params) {
	return {
		kind: params.kind,
		nodeId: params.nodeId,
		ts: Date.now(),
		...params.reason ? { reason: params.reason } : {}
	};
}
function createApnsAlertPayload(params) {
	return {
		aps: {
			alert: {
				title: params.title,
				body: params.body
			},
			sound: "default"
		},
		openclaw: toPushMetadata({
			kind: "push.test",
			nodeId: params.nodeId
		})
	};
}
function createApnsBackgroundPayload(params) {
	return {
		aps: { "content-available": 1 },
		openclaw: toPushMetadata({
			kind: "node.wake",
			reason: params.wakeReason ?? "node.invoke",
			nodeId: params.nodeId
		})
	};
}
function resolveExecApprovalAlertBody() {
	return EXEC_APPROVAL_GENERIC_ALERT_BODY;
}
function createApnsApprovalAlertPayload(params) {
	return {
		aps: {
			alert: {
				title: params.title,
				body: params.body
			},
			sound: "default",
			category: params.category,
			"content-available": 1
		},
		openclaw: {
			kind: `${params.kind}.approval.requested`,
			approvalId: params.approvalId,
			gatewayDeviceId: params.gatewayDeviceId,
			ts: Date.now()
		}
	};
}
function resolvePluginApprovalAlertBody(description) {
	const body = normalizeOptionalString(description) ?? "";
	if (body.length <= PLUGIN_APPROVAL_ALERT_BODY_MAX_LENGTH) return body;
	return `${truncateUtf16Safe(body, 255).trimEnd()}…`;
}
function createApnsApprovalResolvedPayload(params) {
	return {
		aps: { "content-available": 1 },
		openclaw: {
			kind: `${params.kind}.approval.resolved`,
			approvalId: params.approvalId,
			gatewayDeviceId: params.gatewayDeviceId,
			ts: Date.now()
		}
	};
}
//#endregion
//#region src/infra/push-apns.ts
const EXEC_APPROVAL_NOTIFICATION_CATEGORY = "openclaw.exec-approval";
const PLUGIN_APPROVAL_NOTIFICATION_CATEGORY = "openclaw.plugin-approval";
const DEFAULT_APNS_TIMEOUT_MS = 1e4;
function throwIfApnsSendAborted(signal) {
	if (!signal?.aborted) return;
	throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("APNs send invalidated");
}
async function requireCurrentApnsSend(params) {
	throwIfApnsSendAborted(params.signal);
	if (params.isCurrent && !await params.isCurrent()) throw new Error("APNs send invalidated");
	throwIfApnsSendAborted(params.signal);
}
function parseReason(body) {
	const trimmed = body.trim();
	if (!trimmed) return;
	try {
		const parsed = JSON.parse(trimmed);
		return typeof parsed.reason === "string" && parsed.reason.trim().length > 0 ? parsed.reason.trim() : truncateUtf16Safe(trimmed, 200);
	} catch {
		return truncateUtf16Safe(trimmed, 200);
	}
}
/** Returns true for APNs responses that mean the direct device token is no longer usable. */
function shouldInvalidateApnsRegistration(result) {
	if (result.status === 410) return true;
	return result.status === 400 && result.reason?.trim() === "BadDeviceToken";
}
/** Decides whether a failed direct push should clear the persisted registration. */
function shouldClearStoredApnsRegistration(params) {
	if (params.registration.transport !== "direct") return false;
	if (params.overrideEnvironment && params.overrideEnvironment !== params.registration.environment) return false;
	return shouldInvalidateApnsRegistration(params.result);
}
async function sendApnsRequest(params) {
	const authority = params.environment === "production" ? "https://api.push.apple.com" : "https://api.sandbox.push.apple.com";
	const body = JSON.stringify(params.payload);
	const requestPath = `/3/device/${params.token}`;
	const client = await connectApnsHttp2Session({
		authority,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {}
	});
	const consumeSessionError = () => void 0;
	client.on("error", consumeSessionError);
	client.once("close", () => client.off("error", consumeSessionError));
	return await new Promise((resolve, reject) => {
		let settled = false;
		let activeRequest;
		const cleanup = () => {
			client.off("error", fail);
			params.signal?.removeEventListener("abort", onAbort);
		};
		const fail = (err, options) => {
			if (settled) return;
			settled = true;
			cleanup();
			if (options?.cancelRequest && activeRequest && !activeRequest.destroyed) {
				activeRequest.close(APNS_HTTP2_CANCEL_CODE);
				client.close();
			} else client.destroy();
			reject(toErrorObject(err, "Non-Error rejection"));
		};
		const onAbort = () => fail(params.signal?.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("APNs send invalidated"), { cancelRequest: true });
		const finish = (result) => {
			if (settled) return;
			settled = true;
			cleanup();
			client.close();
			resolve(result);
		};
		const startRequest = async () => {
			try {
				await requireCurrentApnsSend(params);
				if (settled) return;
				if (params.signal?.aborted) {
					onAbort();
					return;
				}
				const req = client.request({
					":method": "POST",
					":path": requestPath,
					authorization: `bearer ${params.bearerToken}`,
					"apns-topic": params.topic,
					"apns-push-type": params.pushType,
					"apns-priority": params.priority,
					"apns-expiration": "0",
					"content-type": "application/json",
					"content-length": Buffer.byteLength(body).toString()
				});
				activeRequest = req;
				let statusCode = 0;
				let apnsId;
				const responseBody = createApnsResponseBodyCapture();
				req.setTimeout(params.timeoutMs, () => {
					fail(/* @__PURE__ */ new Error(`APNs request timed out after ${params.timeoutMs}ms`), { cancelRequest: true });
				});
				req.on("response", (headers) => {
					statusCode = headers[":status"] ?? 0;
					const idHeader = headers["apns-id"];
					if (typeof idHeader === "string" && idHeader.trim().length > 0) apnsId = idHeader.trim();
				});
				req.on("data", (chunk) => {
					appendApnsResponseBodyCapture(responseBody, chunk);
				});
				req.on("end", () => {
					finish({
						status: statusCode,
						apnsId,
						body: getApnsResponseBodyCaptureText(responseBody)
					});
				});
				req.on("error", (err) => fail(err));
				if (params.signal?.aborted) {
					onAbort();
					return;
				}
				req.end(body);
			} catch (error) {
				fail(error);
			}
		};
		client.once("error", fail);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) {
			onAbort();
			return;
		}
		startRequest();
	});
}
function resolveApnsTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_APNS_TIMEOUT_MS, 1e3);
}
function resolveDirectSendContext(params) {
	const token = normalizeApnsToken(params.registration.token);
	if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
	const topic = normalizeApnsTopic(params.registration.topic);
	if (!isValidApnsTopic(topic)) throw new Error("topic required");
	return {
		token,
		topic,
		environment: params.registration.environment,
		bearerToken: getApnsBearerToken(params.auth)
	};
}
function resolveRegistrationDebugSuffix(registration, relayResult) {
	if (registration.transport === "direct") return registration.token.slice(-8);
	return relayResult?.tokenSuffix ?? registration.tokenDebugSuffix ?? registration.relayHandle.slice(-8);
}
function toPushResult(params) {
	const response = "body" in params.response ? {
		ok: params.response.status === 200,
		status: params.response.status,
		apnsId: params.response.apnsId,
		reason: parseReason(params.response.body),
		environment: params.registration.environment,
		tokenSuffix: params.tokenSuffix
	} : params.response;
	return {
		ok: response.ok,
		status: response.status,
		apnsId: response.apnsId,
		reason: response.reason,
		tokenSuffix: params.tokenSuffix ?? resolveRegistrationDebugSuffix(params.registration, "tokenSuffix" in response ? response : void 0),
		topic: params.registration.topic,
		environment: response.environment ?? params.registration.environment,
		transport: params.registration.transport
	};
}
async function sendDirectApnsPush(params) {
	const { token, topic, environment, bearerToken } = resolveDirectSendContext({
		auth: params.auth,
		registration: params.registration
	});
	await requireCurrentApnsSend(params);
	const response = await (params.requestSender ?? sendApnsRequest)({
		token,
		topic,
		environment,
		bearerToken,
		payload: params.payload,
		timeoutMs: resolveApnsTimeoutMs(params.timeoutMs),
		pushType: params.pushType,
		priority: params.priority,
		...params.signal ? { signal: params.signal } : {},
		...params.isCurrent ? { isCurrent: params.isCurrent } : {}
	});
	return toPushResult({
		registration: params.registration,
		response,
		tokenSuffix: token.slice(-8)
	});
}
async function sendRelayApnsPush(params) {
	const response = await sendApnsRelayPush({
		relayConfig: params.relayConfig,
		sendGrant: params.registration.sendGrant,
		relayHandle: params.registration.relayHandle,
		payload: params.payload,
		pushType: params.pushType,
		priority: params.priority,
		gatewayIdentity: params.gatewayIdentity,
		requestSender: params.requestSender,
		...params.signal ? { signal: params.signal } : {},
		...params.isCurrent ? { isCurrent: params.isCurrent } : {}
	});
	return toPushResult({
		registration: params.registration,
		response
	});
}
/** Sends a visible APNs alert via direct APNs token or relay registration. */
async function sendApnsAlert(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsAlertPayload({
			nodeId: params.nodeId,
			title: params.title,
			body: params.body
		}),
		pushType: "alert",
		priority: "10"
	}, params);
}
/** Sends a silent background wake via direct APNs token or relay registration. */
async function sendApnsBackgroundWake(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsBackgroundPayload({
			nodeId: params.nodeId,
			wakeReason: params.wakeReason
		}),
		pushType: "background",
		priority: "5"
	}, params);
}
async function sendApnsPush(params, controls) {
	const transport = params.transport;
	if (transport.registration.transport === "relay") {
		const relayParams = transport;
		return await sendRelayApnsPush({
			relayConfig: relayParams.relayConfig,
			registration: relayParams.registration,
			payload: params.payload,
			pushType: params.pushType,
			priority: params.priority,
			gatewayIdentity: relayParams.relayGatewayIdentity,
			requestSender: relayParams.relayRequestSender,
			...controls?.signal ? { signal: controls.signal } : {},
			...controls?.isCurrent ? { isCurrent: controls.isCurrent } : {}
		});
	}
	const directParams = transport;
	return await sendDirectApnsPush({
		auth: directParams.auth,
		registration: directParams.registration,
		payload: params.payload,
		timeoutMs: directParams.timeoutMs,
		requestSender: directParams.requestSender,
		pushType: params.pushType,
		priority: params.priority,
		...controls?.signal ? { signal: controls.signal } : {},
		...controls?.isCurrent ? { isCurrent: controls.isCurrent } : {}
	});
}
/** Sends an exec-approval alert notification via direct APNs or relay. */
async function sendApnsExecApprovalAlert(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsApprovalAlertPayload({
			kind: "exec",
			approvalId: params.approvalId,
			gatewayDeviceId: params.gatewayDeviceId,
			title: "Exec approval required",
			body: resolveExecApprovalAlertBody(),
			category: EXEC_APPROVAL_NOTIFICATION_CATEGORY
		}),
		pushType: "alert",
		priority: "10"
	});
}
/** Sends a plugin-approval alert notification via direct APNs or relay. */
async function sendApnsPluginApprovalAlert(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsApprovalAlertPayload({
			kind: "plugin",
			approvalId: params.approvalId,
			gatewayDeviceId: params.gatewayDeviceId,
			title: normalizeOptionalString(params.title) ?? "Approval required",
			body: resolvePluginApprovalAlertBody(params.description),
			category: PLUGIN_APPROVAL_NOTIFICATION_CATEGORY
		}),
		pushType: "alert",
		priority: "10"
	});
}
async function sendApnsApprovalResolvedWake(params) {
	return await sendApnsPush({
		transport: params.transport,
		payload: createApnsApprovalResolvedPayload({
			kind: params.kind,
			approvalId: params.transport.approvalId,
			gatewayDeviceId: params.transport.gatewayDeviceId
		}),
		pushType: "background",
		priority: "5"
	});
}
/** Sends a silent wake telling the app an exec approval changed state. */
async function sendApnsExecApprovalResolvedWake(params) {
	return await sendApnsApprovalResolvedWake({
		transport: params,
		kind: "exec"
	});
}
/** Sends a silent wake telling the app a plugin approval changed state. */
async function sendApnsPluginApprovalResolvedWake(params) {
	return await sendApnsApprovalResolvedWake({
		transport: params,
		kind: "plugin"
	});
}
//#endregion
export { sendApnsPluginApprovalAlert as a, resolveApnsAuthConfigFromEnv as c, sendApnsExecApprovalResolvedWake as i, sendApnsBackgroundWake as n, sendApnsPluginApprovalResolvedWake as o, sendApnsExecApprovalAlert as r, shouldClearStoredApnsRegistration as s, sendApnsAlert as t };
