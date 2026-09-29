import { E as resolveDateTimestampMs, I as resolveTimestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { _ as toAgentStoreSessionKey, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { x as resolveRequestClientIpFromHeaders } from "./net-DU4aWKLv.mjs";
import { a as AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH, h as normalizeRateLimitClientIp, p as createAuthRateLimiter } from "./auth-rate-limit-DuWYneOU.mjs";
import { o as readPreparedGatewayIngressAttribution } from "./ingress-attribution-C5e071om.mjs";
import { o as sendHttpRequestRejection } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { r as resolveHookExternalContentSource } from "./external-content-source-CwcbBHGE.mjs";
import "./external-content-CLufk6dK.mjs";
import { t as DEDUPE_MAX } from "./server-constants-Dx_kHnY5.mjs";
import "./sessions-DE4llkPV.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-CsLQpkZM.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-Cl5l5Sfo.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-DKo1WWcf.mjs";
import { n as fenceScheduledGatewayContextResolver, t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-CudRX7U4.mjs";
import { c as sendJson } from "./http-common-Ckbyca3h.mjs";
import { _ as resolveHookPathBodyLimit, a as getHookSessionKeyPrefixError, b as applyHookMappings, c as normalizeAgentPayload, d as normalizeWakePayload, f as readJsonBody, g as resolveHookIdempotencyKey, h as resolveHookDeliver, i as getHookChannelError, l as normalizeHookDispatchSessionKey, m as resolveHookChannel, n as extractHookToken, o as isHookAgentAllowed, p as resolveEffectiveHookTargetAgentId, r as getHookAgentPolicyError, s as isSessionKeyAllowedByPrefix, u as normalizeHookHeaders, v as resolveHookSessionKey } from "./hooks-BXb-LCk7.mjs";
import { createHash, randomUUID } from "node:crypto";
const FAN_OUT_PENDING = Symbol("hook-fanout-pending");
async function settleFanOutDispatches(dispatches, deadlineMs) {
	const guarded = dispatches.map((dispatch) => dispatch.catch((err) => ({
		ok: false,
		statusCode: 502,
		error: String(err)
	})));
	let deadlineTimer;
	const deadline = new Promise((resolve) => {
		deadlineTimer = setTimeout(() => resolve(FAN_OUT_PENDING), deadlineMs);
		deadlineTimer.unref?.();
	});
	try {
		return await Promise.all(guarded.map((dispatch) => Promise.race([dispatch, deadline])));
	} finally {
		if (deadlineTimer) clearTimeout(deadlineTimer);
	}
}
function sendAgentResult(res, result, extra, waitForCompletion = false) {
	if (!result.ok) {
		const { statusCode, ...body } = result;
		sendJson(res, statusCode, {
			...body,
			...extra
		});
		return;
	}
	const send = (completion) => sendJson(res, 200, {
		ok: true,
		runId: result.runId,
		...extra,
		...completion ? { completion } : {}
	});
	return waitForCompletion ? result.completion.then(send) : send();
}
function sendFanOutResult(res, settled, wake) {
	const first = settled[0];
	if (settled.length === 1 && first !== void 0 && first !== FAN_OUT_PENDING) {
		sendAgentResult(res, first, wake);
		return;
	}
	const runIds = [];
	const failures = [];
	let pending = 0;
	for (const result of settled) if (result === FAN_OUT_PENDING) pending += 1;
	else if (result.ok) runIds.push(result.runId);
	else failures.push(result);
	if (failures.length === 0 && pending === 0) {
		const result = {
			ok: true,
			runId: runIds[0],
			runIds,
			dispatched: runIds.length
		};
		sendJson(res, 200, {
			...result,
			...wake
		});
		return;
	}
	const failure = failures[0];
	sendJson(res, failure ? failure.statusCode : 503, {
		ok: false,
		error: `hook fan-out incomplete: ${runIds.length}/${settled.length} dispatched, ${failures.length} failed, ${pending} pending`,
		runIds,
		...failures.length > 0 ? { errors: failures.slice(0, 5).map((entry) => entry.error) } : {},
		...wake
	});
}
//#endregion
//#region src/gateway/server/hooks-request-handler.ts
const HOOK_AUTH_FAILURE_LIMIT = 20;
const HOOK_AUTH_FAILURE_WINDOW_MS = 6e4;
const HOOK_FAN_OUT_DERIVED_IDEMPOTENCY = "hook-fanout-item";
const HOOK_CONFIG_CHANGED_ERROR = "hook configuration changed; retry request";
const hashReplay = (value) => createHash("sha256").update(value, "utf8").digest("hex");
function resolveMappedHookExternalContentSource(params) {
	if (params.subPath === "gmail") return "gmail";
	return resolveHookExternalContentSource(params.sessionKey) ?? "webhook";
}
function createHooksRequestHandler(opts) {
	const { getHooksConfig, logHooks, dispatchAgentHook, dispatchWakeHook, getClientIpConfig } = opts;
	const fanoutResponseDeadlineMs = opts.fanoutResponseDeadlineMs ?? 8e3;
	const hookReplayCache = /* @__PURE__ */ new Map();
	const hookAuthLimiter = createAuthRateLimiter({
		maxAttempts: HOOK_AUTH_FAILURE_LIMIT,
		windowMs: HOOK_AUTH_FAILURE_WINDOW_MS,
		lockoutMs: HOOK_AUTH_FAILURE_WINDOW_MS,
		exemptLoopback: false,
		pruneIntervalMs: 0
	});
	const resolveHookClientKey = (req) => {
		const attribution = readPreparedGatewayIngressAttribution(req);
		if (attribution && attribution.kind !== "unattributable-proxy") return normalizeRateLimitClientIp(attribution.rateLimit.subject.key);
		const clientIpConfig = getClientIpConfig?.();
		const clientIp = resolveRequestClientIpFromHeaders(req, clientIpConfig?.trustedProxies, clientIpConfig?.allowRealIpFallback === true) ?? req.socket?.remoteAddress;
		return normalizeRateLimitClientIp(clientIp);
	};
	const pruneHookReplayCache = (now) => {
		for (const [key, entry] of hookReplayCache) if (entry.state === "terminal" && entry.ts < now - 3e5) hookReplayCache.delete(key);
		const terminal = [...hookReplayCache].filter(([, entry]) => entry.state === "terminal");
		for (const [key] of terminal.slice(0, Math.max(0, terminal.length - DEDUPE_MAX))) hookReplayCache.delete(key);
	};
	const buildHookReplayCacheKey = (params) => {
		const idem = params.idempotencyKey?.trim();
		if (!idem) return;
		const scope = JSON.stringify({
			pathKey: params.pathKey,
			dispatchScope: params.dispatchScope
		});
		return `${hashReplay(params.token ?? "")}:${hashReplay(scope)}:${hashReplay(idem)}`;
	};
	const resolveHookReplay = (key) => {
		if (!key) return;
		pruneHookReplayCache(Date.now());
		const cached = hookReplayCache.get(key);
		if (!cached) return;
		if (cached.state === "terminal") {
			hookReplayCache.delete(key);
			hookReplayCache.set(key, cached);
		}
		return cached.dispatch;
	};
	const dispatchAgentHookWithReplay = (key, dispatch) => {
		if (!key) return dispatch();
		const existing = resolveHookReplay(key);
		if (existing) return existing;
		const pending = Promise.resolve().then(dispatch).then((result) => {
			const current = hookReplayCache.get(key);
			if (current?.state === "pending" && current.dispatch === pending) {
				if (result.ok) {
					const active = {
						state: "active",
						dispatch: result
					};
					hookReplayCache.set(key, active);
					const settle = () => {
						if (hookReplayCache.get(key) !== active) return;
						const terminal = {
							state: "terminal",
							ts: Date.now(),
							dispatch: result
						};
						hookReplayCache.delete(key);
						hookReplayCache.set(key, terminal);
						pruneHookReplayCache(terminal.ts);
					};
					result.completion.then(settle, settle);
				} else hookReplayCache.delete(key);
			}
			return result;
		}).catch((err) => {
			const current = hookReplayCache.get(key);
			if (current?.state === "pending" && current.dispatch === pending) hookReplayCache.delete(key);
			throw err;
		});
		hookReplayCache.set(key, {
			state: "pending",
			dispatch: pending
		});
		return pending;
	};
	return async (req, res) => {
		const hooksConfig = getHooksConfig();
		if (!hooksConfig) return false;
		const url = new URL(req.url ?? "/", "http://localhost");
		const basePath = hooksConfig.basePath;
		if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
		if (url.searchParams.has("token")) {
			res.statusCode = 400;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Hook token must be provided via Authorization: Bearer <token> or X-OpenClaw-Token header (query parameters are not allowed).");
			return true;
		}
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "POST");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Method Not Allowed");
			return true;
		}
		const token = extractHookToken(req);
		const clientKey = resolveHookClientKey(req);
		if (!safeEqualSecret(token, hooksConfig.token)) {
			const throttle = hookAuthLimiter.check(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
			if (!throttle.allowed) {
				const retryAfter = throttle.retryAfterMs > 0 ? Math.ceil(throttle.retryAfterMs / 1e3) : 1;
				res.statusCode = 429;
				res.setHeader("Retry-After", String(retryAfter));
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("Too Many Requests");
				logHooks.warn(`hook auth throttled for ${clientKey}; retry-after=${retryAfter}s`);
				return true;
			}
			hookAuthLimiter.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
			res.statusCode = 401;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Unauthorized");
			return true;
		}
		hookAuthLimiter.reset(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
		const isHooksConfigCurrent = () => getHooksConfig() === hooksConfig;
		const rejectChangedHooksConfig = () => {
			if (isHooksConfigCurrent()) return false;
			sendJson(res, 409, {
				ok: false,
				error: HOOK_CONFIG_CHANGED_ERROR
			});
			return true;
		};
		const changedHooksConfigDispatchResult = () => ({
			ok: false,
			statusCode: 409,
			error: HOOK_CONFIG_CHANGED_ERROR
		});
		const subPath = url.pathname.slice(basePath.length).replace(/^\/+/, "");
		if (!subPath) {
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Not Found");
			return true;
		}
		const body = await readJsonBody(req, resolveHookPathBodyLimit(hooksConfig, subPath));
		if (!body.ok) {
			const error = {
				ok: false,
				error: body.error
			};
			if (body.error === "payload too large" || body.error === "request body timeout") await sendHttpRequestRejection(req, res, body.error === "payload too large" ? 413 : 408, JSON.stringify(error), "application/json; charset=utf-8");
			else sendJson(res, 400, error);
			return true;
		}
		if (rejectChangedHooksConfig()) return true;
		const payload = asRecord(body.value);
		const headers = normalizeHookHeaders(req);
		const idempotencyKey = resolveHookIdempotencyKey({
			payload,
			headers
		});
		let wakeResult;
		const sendHookError = (error) => sendJson(res, 400, {
			ok: false,
			error,
			...wakeResult
		});
		const resolveDispatchSessionKeyOrRespond = (sessionKeyValue, targetAgentId) => {
			const dispatchSessionKey = normalizeHookDispatchSessionKey({
				sessionKey: sessionKeyValue,
				targetAgentId
			});
			const allowedPrefixes = hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
			if (allowedPrefixes && !isSessionKeyAllowedByPrefix(dispatchSessionKey, allowedPrefixes)) {
				sendHookError(getHookSessionKeyPrefixError(allowedPrefixes));
				return null;
			}
			return dispatchSessionKey;
		};
		const resolveTargetAgentOrRespond = (agentId, source) => {
			const resolution = resolveEffectiveHookTargetAgentId(hooksConfig, agentId, source);
			if (!resolution.ok) {
				sendHookError(resolution.error);
				return null;
			}
			if (!isHookAgentAllowed(hooksConfig, resolution.effectiveAgentId)) {
				sendHookError(getHookAgentPolicyError());
				return null;
			}
			return resolution;
		};
		const dispatchWake = (value, targetAgentId, source) => {
			let dispatchSessionKey;
			if (value.sessionKey) {
				const sessionKey = resolveHookSessionKey({
					hooksConfig,
					source,
					sessionKey: value.sessionKey
				});
				if (!sessionKey.ok) {
					sendHookError(sessionKey.error);
					return null;
				}
				const resolvedSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, targetAgentId);
				if (resolvedSessionKey === null) return null;
				dispatchSessionKey = resolvedSessionKey;
			}
			const dispatchValue = {
				...value,
				sessionKey: dispatchSessionKey
			};
			if (rejectChangedHooksConfig()) return null;
			return dispatchWakeHook(dispatchValue, targetAgentId);
		};
		if (subPath === "wake") {
			const normalized = normalizeWakePayload(payload);
			if (!normalized.ok) {
				sendJson(res, 400, {
					ok: false,
					error: normalized.error
				});
				return true;
			}
			const target = resolveTargetAgentOrRespond(normalized.value.agentId, "request");
			if (!target) return true;
			const directWakeResult = dispatchWake(normalized.value, target.effectiveAgentId, "request");
			if (!directWakeResult) return true;
			sendJson(res, 200, {
				ok: true,
				mode: normalized.value.mode,
				...directWakeResult
			});
			return true;
		}
		if (subPath === "agent") {
			const waitForCompletion = payload.waitForCompletion;
			if (waitForCompletion !== void 0 && typeof waitForCompletion !== "boolean") {
				sendJson(res, 400, {
					ok: false,
					error: "waitForCompletion must be boolean"
				});
				return true;
			}
			const normalized = normalizeAgentPayload(payload);
			if (!normalized.ok) {
				sendJson(res, 400, {
					ok: false,
					error: normalized.error
				});
				return true;
			}
			const target = resolveTargetAgentOrRespond(normalized.value.agentId, "request");
			if (!target) return true;
			if (normalized.value.sessionMode === "persistent" && !normalized.value.sessionKey) {
				sendJson(res, 400, {
					ok: false,
					error: "sessionKey is required when sessionMode is persistent"
				});
				return true;
			}
			const sessionKey = resolveHookSessionKey({
				hooksConfig,
				source: "request",
				sessionKey: normalized.value.sessionKey
			});
			if (!sessionKey.ok) {
				sendJson(res, 400, {
					ok: false,
					error: sessionKey.error
				});
				return true;
			}
			if (normalized.value.sessionMode === "persistent" && !hooksConfig.sessionPolicy.allowedSessionKeyPrefixes?.length) {
				sendJson(res, 400, {
					ok: false,
					error: "hooks.allowedSessionKeyPrefixes is required when direct hook sessionMode is persistent"
				});
				return true;
			}
			const replayKey = buildHookReplayCacheKey({
				pathKey: "agent",
				token,
				idempotencyKey,
				dispatchScope: {
					agentId: target.effectiveAgentId,
					sessionKey: normalized.value.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
					message: normalized.value.message,
					name: normalized.value.name,
					wakeMode: normalized.value.wakeMode,
					sessionMode: normalized.value.sessionMode,
					deliver: normalized.value.deliver,
					channel: normalized.value.channel,
					to: normalized.value.to ?? null,
					accountId: normalized.value.accountId ?? null,
					model: normalized.value.model ?? null,
					thinking: normalized.value.thinking ?? null,
					timeoutSeconds: normalized.value.timeoutSeconds ?? null
				}
			});
			const replay = resolveHookReplay(replayKey);
			if (replay) {
				await sendAgentResult(res, await replay, void 0, waitForCompletion === true);
				return true;
			}
			const dispatchSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, target.effectiveAgentId);
			if (dispatchSessionKey === null) return true;
			await sendAgentResult(res, await dispatchAgentHookWithReplay(replayKey, () => {
				if (!isHooksConfigCurrent()) return changedHooksConfigDispatchResult();
				return dispatchAgentHook({
					...normalized.value,
					effectiveAgentId: target.effectiveAgentId,
					idempotencyKey,
					sessionKey: dispatchSessionKey,
					sourcePath: `${basePath}/agent`,
					agentId: target.selectedAgentId,
					externalContentSource: "webhook"
				});
			}), void 0, waitForCompletion === true);
			return true;
		}
		if (hooksConfig.mappings.length > 0) try {
			const mapped = await applyHookMappings(hooksConfig.mappings, {
				payload,
				headers,
				url,
				path: subPath
			});
			if (rejectChangedHooksConfig()) return true;
			if (mapped) {
				if (!mapped.ok) {
					sendJson(res, 400, {
						ok: false,
						error: mapped.error
					});
					return true;
				}
				if (mapped.dropped > 0) logHooks.warn(`hook mapping ${subPath} fan-out dropped ${mapped.dropped} items beyond the 200-item cap`);
				if (mapped.actions.length === 0) {
					if (mapped.fanout) logHooks.info(`hook mapping ${subPath} matched with no items to dispatch`);
					res.statusCode = 204;
					res.end();
					return true;
				}
				const fanOutScopeOccurrences = /* @__PURE__ */ new Map();
				const prepareMappedAgentDispatchOrRespond = (action) => {
					const channel = resolveHookChannel(action.channel);
					if (!channel) {
						sendHookError(getHookChannelError());
						return null;
					}
					const deliver = resolveHookDeliver(action.deliver);
					const delivery = deliver ? {
						mode: "announce",
						channel,
						to: action.to
					} : { mode: "none" };
					const target = resolveTargetAgentOrRespond(action.agentId, "mapping");
					if (!target) return null;
					if (action.sessionMode === "persistent" && !action.sessionKey && !hooksConfig.sessionPolicy.defaultSessionKey) {
						sendHookError("sessionKey or hooks.defaultSessionKey is required when mapped hook sessionMode is persistent");
						return null;
					}
					const sessionKey = resolveHookSessionKey({
						hooksConfig,
						source: action.sessionKeySource === "static" ? "mapping-static" : "mapping-templated",
						sessionKey: action.sessionKey
					});
					if (!sessionKey.ok) {
						sendHookError(sessionKey.error);
						return null;
					}
					const dispatchSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, target.effectiveAgentId);
					if (dispatchSessionKey === null) return null;
					const dispatchScope = {
						agentId: target.effectiveAgentId,
						sessionKey: action.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
						message: action.message,
						name: action.name ?? "Hook",
						wakeMode: action.wakeMode,
						sessionMode: action.sessionMode,
						deliver,
						channel,
						to: action.to ?? null,
						model: action.model ?? null,
						thinking: action.thinking ?? null,
						timeoutSeconds: action.timeoutSeconds ?? null
					};
					if (mapped.fanout) {
						const fingerprint = JSON.stringify(dispatchScope);
						const occurrence = fanOutScopeOccurrences.get(fingerprint) ?? 0;
						fanOutScopeOccurrences.set(fingerprint, occurrence + 1);
						dispatchScope.occurrence = occurrence;
					}
					const replayKey = buildHookReplayCacheKey({
						pathKey: subPath || "mapping",
						token,
						idempotencyKey: mapped.fanout ? idempotencyKey ?? HOOK_FAN_OUT_DERIVED_IDEMPOTENCY : idempotencyKey,
						dispatchScope
					});
					return () => dispatchAgentHookWithReplay(replayKey, () => {
						if (!isHooksConfigCurrent()) return changedHooksConfigDispatchResult();
						return dispatchAgentHook({
							message: action.message,
							name: action.name ?? "Hook",
							idempotencyKey,
							agentId: target.selectedAgentId,
							effectiveAgentId: target.effectiveAgentId,
							wakeMode: action.wakeMode,
							sessionKey: dispatchSessionKey,
							sessionMode: action.sessionMode,
							sourcePath: `${basePath}/${subPath}`,
							deliver,
							channel,
							to: action.to,
							delivery,
							model: action.model,
							thinking: action.thinking,
							timeoutSeconds: action.timeoutSeconds,
							mappingId: action.mappingId,
							allowUnsafeExternalContent: action.allowUnsafeExternalContent,
							...mapped.fanout ? { admissionMode: "background" } : {},
							externalContentSource: resolveMappedHookExternalContentSource({
								subPath,
								sessionKey: sessionKey.value
							})
						});
					});
				};
				const dispatches = [];
				let wakeMode;
				for (const action of mapped.actions) {
					if (action.kind === "wake") {
						const target = resolveTargetAgentOrRespond(action.agentId, "mapping");
						if (!target) return true;
						const dispatched = dispatchWake({
							text: action.text,
							mode: action.mode,
							sessionKey: action.sessionKey
						}, target.effectiveAgentId, action.sessionKeySource === "static" ? "mapping-static" : "mapping-templated");
						if (!dispatched) return true;
						if (!wakeResult || dispatched.eventOutcome === "queued") wakeResult = dispatched;
						wakeMode = action.mode;
						continue;
					}
					const prepared = prepareMappedAgentDispatchOrRespond(action);
					if (!prepared) return true;
					dispatches.push(prepared);
				}
				if (dispatches.length === 0) {
					sendJson(res, 200, {
						ok: true,
						mode: wakeMode ?? "now",
						...wakeResult
					});
					return true;
				}
				if (!mapped.fanout) {
					sendAgentResult(res, await dispatches[0](), wakeResult);
					return true;
				}
				sendFanOutResult(res, await settleFanOutDispatches(dispatches.map((dispatch) => Promise.resolve(dispatch())), fanoutResponseDeadlineMs), wakeResult);
				return true;
			}
		} catch (err) {
			logHooks.warn(`hook mapping failed: ${String(err)}`);
			sendJson(res, 500, {
				ok: false,
				error: "hook mapping failed"
			});
			return true;
		}
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Not Found");
		return true;
	};
}
//#endregion
//#region src/gateway/server/hooks.ts
const HOOK_AGENT_START_ADMISSION_TIMEOUT_MS = 15e3;
const HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR = "hook agent run did not start before admission timeout";
const HOOK_AGENT_SESSION_CONFLICT_ERROR = "hook agent run was rejected because the target session changed";
const HOOK_AGENT_PREPARATION_ERROR = "hook agent run failed before entering the agent runner";
function resolveHookEventTarget(params) {
	if (params.cfg.session?.scope === "global") return {
		eventSessionKey: "global",
		heartbeatTarget: { agentId: params.resolvedAgentId }
	};
	const eventSessionKey = params.sessionKey ? canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.resolvedAgentId,
		sessionKey: toAgentStoreSessionKey({
			agentId: params.resolvedAgentId,
			requestKey: params.sessionKey,
			mainKey: params.cfg.session?.mainKey
		})
	}) : resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.resolvedAgentId
	});
	return {
		eventSessionKey,
		heartbeatTarget: {
			agentId: params.resolvedAgentId,
			sessionKey: eventSessionKey
		}
	};
}
function shouldAnnounceHookRunResult(params) {
	if (params.result.status !== "ok") return true;
	return params.deliver && params.result.delivered !== true && params.result.deliveryAttempted !== true;
}
function resolveHookRunSummary(result) {
	return (result.status !== "ok" ? normalizeOptionalString(result.diagnostics?.summary) : void 0) || normalizeOptionalString(result.summary) || normalizeOptionalString(result.error) || result.status;
}
function sanitizeHookConsoleValue(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const withoutControlChars = Array.from(normalized, (char) => {
		const code = char.charCodeAt(0);
		return code < 32 || code === 127 ? " " : char;
	}).join("");
	return truncateUtf16Safe(withoutControlChars.replace(/\s+/gu, " ").trim(), 500);
}
function sanitizeHookLogMetadata(meta) {
	return Object.fromEntries(Object.entries(meta).filter(([, value]) => value !== void 0).map(([key, value]) => [key, typeof value === "string" ? sanitizeHookConsoleValue(redactToolPayloadText(value).replace(/\p{Cc}/gu, " ")) : value]));
}
function createHookAdmissionFailure(params) {
	const statusCode = params.statusCode ?? (params.disposition === "session-conflict" ? 409 : 502);
	return {
		ok: false,
		statusCode,
		error: statusCode === 409 ? HOOK_AGENT_SESSION_CONFLICT_ERROR : statusCode === 503 ? HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR : HOOK_AGENT_PREPARATION_ERROR,
		runId: params.runId
	};
}
function createSessionKeyedHookDispatchQueue() {
	const hookAgentDispatchTails = /* @__PURE__ */ new Map();
	return (sessionKey, operation) => {
		const previousTail = hookAgentDispatchTails.get(sessionKey);
		const run = previousTail ? previousTail.catch(() => void 0).then(operation) : operation();
		const tail = run.then(() => void 0, () => void 0);
		hookAgentDispatchTails.set(sessionKey, tail);
		tail.finally(() => {
			if (hookAgentDispatchTails.get(sessionKey) === tail) hookAgentDispatchTails.delete(sessionKey);
		});
		return run;
	};
}
function validateHookAgentDeliveryAccount(params) {
	if (params.value.delivery.mode !== "announce" || params.value.delivery.channel === "last" || !params.value.delivery.to) return params.value;
	const accountId = params.value.delivery.accountId ? validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		channel: params.value.delivery.channel,
		accountId: params.value.delivery.accountId
	}) : (() => {
		const plugin = resolveOutboundChannelPlugin({
			channel: params.value.delivery.channel,
			cfg: params.cfg
		});
		if (!plugin) throw new Error(`Channel ${params.value.delivery.channel} is unavailable.`);
		return resolveChannelDefaultAccountId({
			plugin,
			cfg: params.cfg
		});
	})();
	if (!accountId) throw new Error(`Channel ${params.value.delivery.channel} did not resolve an account.`);
	return {
		...params.value,
		accountId,
		delivery: {
			...params.value.delivery,
			accountId
		}
	};
}
/** Creates one lifecycle-owned dispatcher shared by HTTP hooks and trusted plugins. */
function createGatewayHookDispatcher(params) {
	const { deps, logHooks, resolveGatewayContext, agentStartAdmissionTimeoutMs = HOOK_AGENT_START_ADMISSION_TIMEOUT_MS } = params;
	const scheduledGatewayContextResolver = fenceScheduledGatewayContextResolver(resolveGatewayContext);
	const runScheduledHook = createScheduledGatewayRunner(scheduledGatewayContextResolver);
	const enqueueHookAgentDispatch = createSessionKeyedHookDispatchQueue();
	let isolatedAgentModulePromise;
	const loadIsolatedAgentModule = () => isolatedAgentModulePromise ??= import("./isolated-agent-BMJVre8W.mjs");
	const dispatchWakeHook = (value, agentId) => {
		const target = resolveHookEventTarget({
			cfg: getRuntimeConfig(),
			resolvedAgentId: agentId,
			sessionKey: value.sessionKey
		});
		const sessionKey = target.eventSessionKey;
		const eventOptions = { sessionKey };
		const queued = enqueueSystemEvent(value.text, isUnscopedSessionKeySentinel(sessionKey) ? withSystemEventOwner(eventOptions, agentId) : eventOptions);
		if (value.mode === "now") requestSessionEventWake({
			source: "hook",
			intent: "immediate",
			reason: "hook:wake",
			...target.heartbeatTarget
		});
		return { eventOutcome: queued ? "queued" : "coalesced" };
	};
	const dispatchAgentHook = async (value, pluginId) => {
		const sessionKey = value.sessionKey;
		const safeName = sanitizeHookConsoleValue(value.name) ?? "Hook";
		const jobId = randomUUID();
		const runId = randomUUID();
		const completion = createDeferredCore();
		const logContext = sanitizeHookLogMetadata({
			runId,
			jobId,
			sourcePath: value.sourcePath,
			name: value.name,
			agentId: value.effectiveAgentId,
			logicalSessionKey: sessionKey
		});
		const logHookRunTerminal = (result) => {
			const meta = {
				...logContext,
				...sanitizeHookLogMetadata({
					status: result.status,
					sessionId: result.sessionId,
					sessionKey: result.sessionKey,
					deliver: value.deliver,
					delivered: result.delivered,
					deliveryAttempted: result.deliveryAttempted,
					deliveryError: result.deliveryError,
					deliverySuppressionReason: result.deliverySuppressionReason,
					model: result.model ?? value.model,
					summary: result.status !== "ok" ? resolveHookRunSummary(result) : void 0
				})
			};
			const details = [
				"runId",
				"status",
				"deliveryError",
				"summary",
				"model"
			].flatMap((key) => meta[key] === void 0 ? [] : [`${key}=${String(meta[key])}`]);
			const message = truncateUtf16Safe(["hook agent run completed", ...details].join(" "), 500);
			const level = result.status !== "ok" || result.deliveryError ? "warn" : "info";
			logHooks[level](message, meta);
			return {
				status: result.status,
				replyDisposition: result.replyDisposition ?? "empty",
				...result.delivered !== void 0 ? { delivered: result.delivered } : {},
				...result.deliveryAttempted !== void 0 ? { deliveryAttempted: result.deliveryAttempted } : {},
				...result.deliveryError ? { deliveryError: "delivery-failed" } : {},
				...result.deliverySuppressionReason ? { deliverySuppressionReason: result.deliverySuppressionReason } : {}
			};
		};
		const nowMs = resolveDateTimestampMs(Date.now());
		const job = {
			id: jobId,
			agentId: value.effectiveAgentId,
			name: safeName,
			enabled: true,
			createdAtMs: nowMs,
			updatedAtMs: nowMs,
			schedule: {
				kind: "at",
				at: resolveTimestampMsToIsoString(nowMs)
			},
			sessionTarget: value.sessionMode === "persistent" ? `session:${sessionKey}` : "isolated",
			wakeMode: value.wakeMode,
			payload: {
				kind: "agentTurn",
				message: value.message,
				model: value.model,
				thinking: value.thinking,
				timeoutSeconds: value.timeoutSeconds,
				allowUnsafeExternalContent: value.allowUnsafeExternalContent,
				externalContentSource: value.externalContentSource
			},
			delivery: value.delivery,
			state: { nextRunAtMs: nowMs }
		};
		let hookEventTarget;
		const resolveGlobalTerminalAgentId = (status) => {
			const acceptedAgentId = hookEventTarget?.heartbeatTarget.agentId;
			if (acceptedAgentId && listAgentIds(getRuntimeConfig()).includes(acceptedAgentId)) return acceptedAgentId;
			logHooks.warn("hook agent terminal event suppressed", {
				...logContext,
				...sanitizeHookLogMetadata({
					acceptedAgentId,
					status
				}),
				reason: "accepted-agent-removed"
			});
		};
		const reportHookFailure = (err) => {
			completion.resolve(logHookRunTerminal({
				status: "error",
				error: String(err)
			}));
			const eventTarget = hookEventTarget ?? resolveHookEventTarget({
				cfg: getRuntimeConfig(),
				resolvedAgentId: value.effectiveAgentId
			});
			const eventSessionKey = eventTarget.eventSessionKey;
			const isGlobalEvent = isUnscopedSessionKeySentinel(eventSessionKey);
			let heartbeatTarget;
			if (isGlobalEvent && hookEventTarget) {
				const globalTerminalAgentId = resolveGlobalTerminalAgentId("error");
				if (!globalTerminalAgentId) return;
				heartbeatTarget = { agentId: globalTerminalAgentId };
			} else heartbeatTarget = eventTarget.heartbeatTarget;
			const failureEventOptions = { sessionKey: eventSessionKey };
			enqueueSystemEvent(`Hook ${safeName} (error): ${String(err)}`, isGlobalEvent && heartbeatTarget.agentId ? withSystemEventOwner(failureEventOptions, heartbeatTarget.agentId) : failureEventOptions);
			if (value.wakeMode === "now") requestSessionEventWake({
				source: "hook",
				intent: "immediate",
				reason: `hook:${jobId}:error`,
				...heartbeatTarget
			});
		};
		let dispatchCfg;
		try {
			dispatchCfg = getRuntimeConfig();
		} catch (err) {
			runWithGatewayIndependentRootWorkContinuation(async () => reportHookFailure(err), "hooks:failure-report");
			return createHookAdmissionFailure({ runId });
		}
		let acceptedValue;
		try {
			acceptedValue = validateHookAgentDeliveryAccount({
				cfg: dispatchCfg,
				value
			});
			job.delivery = acceptedValue.delivery;
		} catch (err) {
			return {
				ok: false,
				statusCode: 400,
				error: formatErrorMessage(err),
				runId
			};
		}
		const agentId = acceptedValue.effectiveAgentId;
		const queueKey = resolveCronAgentSessionKey({
			sessionKey,
			agentId,
			mainKey: dispatchCfg.session?.mainKey,
			cfg: dispatchCfg
		});
		let settleAdmission;
		let admissionSettled = false;
		let admissionTimedOut = false;
		let admissionTimer;
		const admission = new Promise((resolve) => {
			settleAdmission = (result) => {
				if (admissionSettled) return;
				admissionSettled = true;
				if (admissionTimer) {
					clearTimeout(admissionTimer);
					admissionTimer = void 0;
				}
				resolve(result);
			};
		});
		const admissionTimeoutError = /* @__PURE__ */ new Error(HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR);
		const startupAbortController = new AbortController();
		const settleSuccessfulAdmission = () => {
			startupAbortController.signal.throwIfAborted();
			settleAdmission({
				ok: true,
				runId,
				completion: completion.promise
			});
		};
		if (value.admissionMode !== "background") {
			admissionTimer = setTimeout(() => {
				admissionTimedOut = true;
				startupAbortController.abort(admissionTimeoutError);
				settleAdmission(createHookAdmissionFailure({
					runId,
					statusCode: 503
				}));
			}, agentStartAdmissionTimeoutMs);
			admissionTimer.unref?.();
		}
		runWithGatewayIndependentRootWorkContinuation(() => enqueueHookAgentDispatch(queueKey, async () => {
			if (startupAbortController.signal.aborted) return;
			try {
				const cfg = getRuntimeConfig();
				try {
					validateHookAgentDeliveryAccount({
						cfg,
						value: acceptedValue
					});
				} catch (err) {
					settleAdmission({
						ok: false,
						statusCode: 400,
						error: formatErrorMessage(err),
						runId
					});
					return;
				}
				const eventTarget = resolveHookEventTarget({
					cfg,
					resolvedAgentId: agentId
				});
				hookEventTarget = eventTarget;
				const { runCronIsolatedAgentTurn } = await loadIsolatedAgentModule();
				if (startupAbortController.signal.aborted) return;
				const runHookIsolatedTurn = async () => await runCronIsolatedAgentTurn({
					cfg,
					deps,
					job,
					message: acceptedValue.message,
					sessionKey,
					agentId,
					lane: pluginId ? "cron-nested" : "hook-dispatch",
					executionIdentity: { ingress: pluginId ? {
						kind: "webhook",
						boundary: "gateway.hooks.plugin",
						state: "present",
						rawSourceRef: `${pluginId}:${safeName}`
					} : {
						kind: "webhook",
						boundary: "gateway.hooks.agent",
						state: "present",
						...acceptedValue.mappingId ? { rawSourceRef: acceptedValue.mappingId } : {}
					} },
					abortSignal: startupAbortController.signal,
					onLaneWait: (info) => {
						if (info?.waiting === false) settleSuccessfulAdmission();
					},
					onExecutionStarted: settleSuccessfulAdmission
				});
				const result = await runScheduledHook(runHookIsolatedTurn);
				if (admissionTimedOut) return;
				const summary = resolveHookRunSummary(result);
				if (!admissionSettled) settleAdmission(result.status === "ok" || result.executionStarted === true ? {
					ok: true,
					runId,
					completion: completion.promise
				} : createHookAdmissionFailure({
					runId,
					disposition: result.admissionDisposition
				}));
				const prefix = result.status === "ok" ? `Hook ${safeName}` : `Hook ${safeName} (${result.status})`;
				const shouldAnnounce = shouldAnnounceHookRunResult({
					deliver: value.deliver,
					result
				});
				completion.resolve(logHookRunTerminal(result));
				if (shouldAnnounce) {
					const eventSessionKey = eventTarget.eventSessionKey;
					const isGlobalEvent = isUnscopedSessionKeySentinel(eventSessionKey);
					let announceEventOptions = { sessionKey: eventSessionKey };
					let heartbeatTarget;
					if (isGlobalEvent) {
						const globalTerminalAgentId = resolveGlobalTerminalAgentId(result.status);
						if (!globalTerminalAgentId) return;
						announceEventOptions = withSystemEventOwner(announceEventOptions, globalTerminalAgentId);
						heartbeatTarget = { agentId: globalTerminalAgentId };
					} else heartbeatTarget = eventTarget.heartbeatTarget;
					enqueueSystemEvent(`${prefix}: ${summary}`.trim(), announceEventOptions);
					if (value.wakeMode === "now") requestSessionEventWake({
						source: "hook",
						intent: "immediate",
						reason: `hook:${jobId}`,
						...heartbeatTarget
					});
				}
			} catch (err) {
				if (admissionTimedOut) return;
				settleAdmission(createHookAdmissionFailure({ runId }));
				reportHookFailure(err);
			}
		}), "hooks:agent-dispatch").catch((err) => {
			if (admissionTimedOut) return;
			settleAdmission(createHookAdmissionFailure({ runId }));
			reportHookFailure(err);
		});
		return await admission;
	};
	const pluginHookReplays = /* @__PURE__ */ new Map();
	const dispatchHookAgentTurn = async (value, pluginId) => {
		const agentId = normalizeOptionalString(value.agentId);
		if (!agentId) return {
			ok: false,
			reason: "agentId is required"
		};
		const sessionKey = normalizeHookDispatchSessionKey({
			sessionKey: value.sessionKey,
			targetAgentId: agentId
		});
		if (sessionKey !== value.sessionKey || !sessionKey.startsWith("hook:") || sessionKey.length <= 5 || /[\s\p{Cc}]/u.test(sessionKey)) return {
			ok: false,
			reason: "sessionKey must start with hook: and contain no whitespace or control characters"
		};
		if (value.externalContentSource !== "email") return {
			ok: false,
			reason: "externalContentSource must be email"
		};
		const run = async () => {
			const result = await dispatchAgentHook({
				name: value.name,
				agentId,
				effectiveAgentId: agentId,
				sessionKey,
				message: value.message,
				deliver: value.deliver,
				model: value.model,
				thinking: value.thinking,
				timeoutSeconds: value.timeoutSeconds,
				idempotencyKey: value.idempotencyKey,
				sessionMode: "isolated",
				sourcePath: `plugin:${pluginId}`,
				wakeMode: "now",
				channel: "last",
				delivery: value.deliver ? {
					mode: "announce",
					channel: "last"
				} : { mode: "none" },
				externalContentSource: "email"
			}, pluginId);
			return result.ok ? {
				ok: true,
				runId: result.runId
			} : {
				ok: false,
				reason: result.error
			};
		};
		const idempotencyKey = normalizeOptionalString(value.idempotencyKey);
		if (!idempotencyKey) return await run();
		const now = Date.now();
		for (const [key, entry] of pluginHookReplays) if (entry.createdAt < now - 3e5) pluginHookReplays.delete(key);
		const replayKey = JSON.stringify({
			pluginId,
			idempotencyKey,
			name: value.name,
			agentId,
			sessionKey,
			message: value.message,
			externalContentSource: value.externalContentSource,
			deliver: value.deliver,
			model: value.model,
			thinking: value.thinking,
			timeoutSeconds: value.timeoutSeconds
		});
		const replay = pluginHookReplays.get(replayKey);
		if (replay) return await replay.result;
		const result = run().then((outcome) => {
			if (!outcome.ok) pluginHookReplays.delete(replayKey);
			return outcome;
		}, (error) => {
			pluginHookReplays.delete(replayKey);
			throw error;
		});
		pluginHookReplays.set(replayKey, {
			createdAt: now,
			result
		});
		pruneMapToMaxSize(pluginHookReplays, DEDUPE_MAX);
		return await result;
	};
	return {
		dispatchWakeHook,
		dispatchAgentHook,
		dispatchHookAgentTurn
	};
}
/** Creates the HTTP handler used by gateway hook endpoints. */
function createGatewayHooksRequestHandler(params) {
	const { getHooksConfig, bindHost, port, logHooks, getClientIpConfig } = params;
	const { dispatchAgentHook, dispatchWakeHook } = params.dispatcher ?? createGatewayHookDispatcher(params);
	return createHooksRequestHandler({
		getHooksConfig,
		bindHost,
		port,
		logHooks,
		getClientIpConfig,
		dispatchAgentHook,
		dispatchWakeHook
	});
}
//#endregion
export { createGatewayHookDispatcher, createGatewayHooksRequestHandler };
