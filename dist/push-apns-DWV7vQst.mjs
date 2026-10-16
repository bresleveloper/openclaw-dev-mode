import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as requireCurrentApnsSend, t as apnsSendInvalidatedError } from "./push-apns-send-current-BxwtjJZs.mjs";
import { a as getApnsResponseBodyCaptureText, i as createApnsResponseBodyCapture, n as appendApnsResponseBodyCapture, r as connectApnsHttp2Session, t as APNS_HTTP2_CANCEL_CODE } from "./push-apns-http2-wDCXSE5n.mjs";
import { _ as sendApnsRelayPush, a as isValidApnsTopic, d as normalizeApnsTopic, r as isLikelyApnsToken, u as normalizeApnsToken } from "./push-apns-store-BNQPyh4x.mjs";
import { createHash, createPrivateKey, sign } from "node:crypto";
import { readSecretFile } from "@openclaw/fs-safe/secret";
//#region src/infra/push-apns-auth.ts
const APNS_JWT_TTL_MS = 3e6;
let cachedJwt = null;
function toBase64UrlJson(value) {
	return Buffer.from(JSON.stringify(value)).toString("base64url");
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
	const token = `${signingInput}.${sign("sha256", Buffer.from(signingInput, "utf8"), {
		key: createPrivateKey(auth.privateKey),
		dsaEncoding: "ieee-p1363"
	}).toString("base64url")}`;
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
/** Resolves direct APNs provider auth from env, accepting inline or file-backed keys. */
async function resolveApnsAuthConfigFromEnv(env = process.env) {
	const teamId = normalizeOptionalString(env.OPENCLAW_APNS_TEAM_ID);
	const keyId = normalizeOptionalString(env.OPENCLAW_APNS_KEY_ID);
	if (!teamId || !keyId) return {
		ok: false,
		error: "APNs auth missing: set OPENCLAW_APNS_TEAM_ID and OPENCLAW_APNS_KEY_ID"
	};
	const inlineKeyRaw = normalizeOptionalString(env.OPENCLAW_APNS_PRIVATE_KEY_P8) ?? normalizeOptionalString(env.OPENCLAW_APNS_PRIVATE_KEY);
	if (inlineKeyRaw) return {
		ok: true,
		value: {
			teamId,
			keyId,
			privateKey: normalizePrivateKey(inlineKeyRaw)
		}
	};
	const keyPath = normalizeOptionalString(env.OPENCLAW_APNS_PRIVATE_KEY_PATH);
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
const PLUGIN_APPROVAL_ALERT_BODY_MAX_LENGTH = 256;
function createApnsAlertPayload(params) {
	return {
		aps: {
			alert: {
				title: params.title,
				body: params.body
			},
			sound: "default"
		},
		openclaw: {
			kind: "push.test",
			nodeId: params.nodeId,
			ts: Date.now()
		}
	};
}
function createApnsBackgroundPayload(params) {
	const reason = params.wakeReason ?? "node.invoke";
	return {
		aps: { "content-available": 1 },
		openclaw: {
			kind: "node.wake",
			nodeId: params.nodeId,
			ts: Date.now(),
			...reason ? { reason } : {}
		}
	};
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
function shouldClearStoredApnsRegistration(params) {
	if (params.registration.transport !== "direct") return false;
	if (params.overrideEnvironment && params.overrideEnvironment !== params.registration.environment) return false;
	const { status, reason } = params.result;
	return status === 410 || status === 400 && reason?.trim() === "BadDeviceToken";
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
		const onAbort = () => fail(apnsSendInvalidatedError(params.signal), { cancelRequest: true });
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
function toPushResult(params) {
	const { registration, response } = params;
	const direct = "body" in response;
	return {
		ok: direct ? response.status === 200 : response.ok,
		status: response.status,
		apnsId: response.apnsId,
		reason: direct ? parseReason(response.body) : response.reason,
		tokenSuffix: params.tokenSuffix ?? (registration.transport === "direct" ? registration.token.slice(-8) : (!direct ? response.tokenSuffix : void 0) ?? registration.tokenDebugSuffix ?? registration.relayHandle.slice(-8)),
		topic: registration.topic,
		environment: direct ? registration.environment : response.environment ?? registration.environment,
		transport: registration.transport
	};
}
async function sendApnsAlert(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsAlertPayload({
			nodeId: params.nodeId,
			title: params.title,
			body: params.body
		}),
		pushType: "alert"
	}, params);
}
async function sendApnsBackgroundWake(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsBackgroundPayload({
			nodeId: params.nodeId,
			wakeReason: params.wakeReason
		}),
		pushType: "background"
	}, params);
}
async function sendApnsPush(params, controls) {
	const transport = params.transport;
	const priority = params.pushType === "alert" ? "10" : "5";
	const lifecycleControls = {
		...controls?.signal ? { signal: controls.signal } : {},
		...controls?.isCurrent ? { isCurrent: controls.isCurrent } : {}
	};
	if (transport.registration.transport === "relay") {
		const relayParams = transport;
		const registration = relayParams.registration;
		return toPushResult({
			registration,
			response: await sendApnsRelayPush({
				relayConfig: relayParams.relayConfig,
				sendGrant: registration.sendGrant,
				relayHandle: registration.relayHandle,
				payload: params.payload,
				pushType: params.pushType,
				priority,
				gatewayIdentity: relayParams.relayGatewayIdentity,
				requestSender: relayParams.relayRequestSender,
				...lifecycleControls
			})
		});
	}
	const { auth, registration, timeoutMs, requestSender } = transport;
	const token = normalizeApnsToken(registration.token);
	if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
	const topic = normalizeApnsTopic(registration.topic);
	if (!isValidApnsTopic(topic)) throw new Error("topic required");
	const environment = registration.environment;
	const bearerToken = getApnsBearerToken(auth);
	await requireCurrentApnsSend(lifecycleControls);
	return toPushResult({
		registration,
		response: await (requestSender ?? sendApnsRequest)({
			token,
			topic,
			environment,
			bearerToken,
			payload: params.payload,
			timeoutMs: resolveTimerTimeoutMs(timeoutMs, DEFAULT_APNS_TIMEOUT_MS, 1e3),
			pushType: params.pushType,
			priority,
			...lifecycleControls
		}),
		tokenSuffix: token.slice(-8)
	});
}
async function sendApnsExecApprovalAlert(params) {
	return await sendApnsPush({
		transport: params,
		payload: createApnsApprovalAlertPayload({
			kind: "exec",
			approvalId: params.approvalId,
			gatewayDeviceId: params.gatewayDeviceId,
			title: "Exec approval required",
			body: "Open OpenClaw to review this request.",
			category: EXEC_APPROVAL_NOTIFICATION_CATEGORY
		}),
		pushType: "alert"
	});
}
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
		pushType: "alert"
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
		pushType: "background"
	});
}
async function sendApnsExecApprovalResolvedWake(params) {
	return await sendApnsApprovalResolvedWake({
		transport: params,
		kind: "exec"
	});
}
async function sendApnsPluginApprovalResolvedWake(params) {
	return await sendApnsApprovalResolvedWake({
		transport: params,
		kind: "plugin"
	});
}
//#endregion
export { sendApnsPluginApprovalAlert as a, resolveApnsAuthConfigFromEnv as c, sendApnsExecApprovalResolvedWake as i, sendApnsBackgroundWake as n, sendApnsPluginApprovalResolvedWake as o, sendApnsExecApprovalAlert as r, shouldClearStoredApnsRegistration as s, sendApnsAlert as t };
