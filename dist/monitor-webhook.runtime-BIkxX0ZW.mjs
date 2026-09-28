import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-CVabF32H.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { o as sendHttpRequestRejection } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { o as readJsonBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import { r as formatDurationPrecise } from "./format-duration-CeDWULoS.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { d as logWebhookReceived, l as logWebhookError, u as logWebhookProcessed } from "./diagnostic-DMwhUN76.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { t as resolveTelegramAllowedUpdates } from "./allowed-updates-CAdSYdXv.mjs";
import { f as isRetryableTelegramApiError, m as isTelegramAuthenticationError, r as resolveTelegramTransport } from "./fetch-BZlDgFP3.mjs";
import "./number-runtime-CGwowceO.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-DO7ZNLRi.mjs";
import "./runtime-config-snapshot-Bc7N5SpK.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as channelReadyPatch } from "./channel-status-patches-BS8oeT90.mjs";
import "./gateway-runtime-BCC8MoQW.mjs";
import "./logging-core-CUJDGfv-.mjs";
import "./diagnostic-runtime-dzEIwnbc.mjs";
import { i as WEBHOOK_RATE_LIMIT_DEFAULTS, o as createFixedWindowRateLimiter } from "./webhook-ingress-CLBPfE22.mjs";
import { r as applyBasicWebhookRequestGuards } from "./webhook-request-guards-CccCHICi.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { i as resolveTelegramIngressSpoolDir } from "./bot-message-D3PTBgdd.mjs";
import { r as createTelegramBot, t as createTelegramTransportIngressMonitor } from "./telegram-ingress-drain-factory-BteJBliX.mjs";
import net from "node:net";
import { createServer as createServer$1 } from "node:http";
import { InputFile } from "grammy";
//#region extensions/telegram/src/webhook-status.ts
function createTelegramWebhookStatusPublisher(setStatus) {
	return {
		noteWebhookStart() {
			setStatus?.({
				mode: "webhook",
				connected: false,
				lastConnectedAt: null,
				lastEventAt: null,
				lastTransportActivityAt: null
			});
		},
		noteWebhookAdvertised(at = Date.now()) {
			setStatus?.(channelReadyPatch({
				lastConnectedAt: at,
				lastEventAt: at,
				mode: "webhook"
			}));
		},
		noteWebhookUpdateReceived(at = Date.now()) {
			setStatus?.(channelReadyPatch({
				lastConnectedAt: at,
				lastEventAt: at,
				mode: "webhook"
			}));
		},
		noteWebhookRecovery() {
			setStatus?.({ lifecycle: "recovering" });
		},
		noteWebhookRegistrationFailure(error, lifecycle) {
			setStatus?.({
				mode: "webhook",
				connected: false,
				...lifecycle ? { lifecycle } : {},
				...lifecycle === "blocked" ? { terminalDisconnect: true } : {},
				lastError: error
			});
		},
		noteWebhookStop() {
			setStatus?.({
				mode: "webhook",
				connected: false
			});
		}
	};
}
//#endregion
//#region extensions/telegram/src/webhook.ts
const TELEGRAM_WEBHOOK_MAX_BODY_BYTES = 1048576;
const TELEGRAM_WEBHOOK_BODY_TIMEOUT_MS = 3e4;
const TELEGRAM_WEBHOOK_TEXT_TYPE = "text/plain; charset=utf-8";
const TELEGRAM_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const TELEGRAM_WEBHOOK_ACCEPTED_VALUE = "durable";
const TELEGRAM_WEBHOOK_SPOOLED_DRAIN_INTERVAL_MS = 500;
const TELEGRAM_WEBHOOK_INGRESS_STOP_GRACE_MS = 15e3;
const TELEGRAM_WEBHOOK_REGISTRATION_RETRY_POLICY = {
	initialMs: 5e3,
	maxMs: 6e4,
	factor: 2,
	jitter: .2
};
async function listenHttpServer(params) {
	await new Promise((resolve, reject) => {
		const onError = (err) => {
			params.server.off("error", onError);
			reject(err);
		};
		params.server.once("error", onError);
		params.server.listen(params.port, params.host, () => {
			params.server.off("error", onError);
			resolve();
		});
	});
}
function formatWebhookStartupError(error) {
	const message = formatErrorMessage(error);
	const code = extractErrorCode(error);
	return code && !message.includes(code) ? `${message} (${code})` : message;
}
async function waitForWebhookIngressStop(task) {
	if (!task) return;
	let timer;
	try {
		await Promise.race([task, new Promise((resolve) => {
			timer = setTimeout(resolve, TELEGRAM_WEBHOOK_INGRESS_STOP_GRACE_MS);
			timer.unref?.();
		})]);
	} finally {
		clearTimeout(timer);
	}
}
function resolveWebhookPublicUrl(params) {
	if (params.configuredPublicUrl) return params.configuredPublicUrl;
	const address = params.server.address();
	if (address && typeof address !== "string") return `http://${params.host === "0.0.0.0" || address.address === "0.0.0.0" || address.address === "::" ? "localhost" : address.address}:${address.port}${params.path}`;
	return `http://${params.host === "0.0.0.0" ? "localhost" : params.host}:${params.port}${params.path}`;
}
async function initializeTelegramWebhookBotOnce(params) {
	const initSignal = params.abortSignal;
	await withTelegramApiErrorLogging({
		operation: "getMe",
		runtime: params.runtime,
		fn: () => params.bot.init(initSignal)
	});
}
async function initializeTelegramWebhookBot(params) {
	let attempt = 0;
	while (true) try {
		await initializeTelegramWebhookBotOnce({
			bot: params.bot,
			runtime: params.runtime,
			abortSignal: params.abortSignal
		});
		return;
	} catch (err) {
		if (!isRetryableTelegramApiError(err, { context: "webhook" }) || params.abortSignal?.aborted) throw err;
		attempt += 1;
		params.onRetry();
		const delayMs = computeBackoff(params.retryPolicy, attempt);
		params.runtime.log?.(`telegram getMe retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}`);
		await sleepWithAbort(delayMs, params.abortSignal);
	}
}
function resolveSingleHeaderValue(header) {
	if (typeof header === "string") return header;
	if (Array.isArray(header) && header.length === 1) return header[0];
}
function hasValidTelegramWebhookSecret(secretHeader, expectedSecret) {
	return safeEqualSecret(secretHeader, expectedSecret);
}
function parseIpLiteral(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (trimmed.startsWith("[")) {
		const end = trimmed.indexOf("]");
		if (end !== -1) {
			const candidate = trimmed.slice(1, end);
			return net.isIP(candidate) === 0 ? void 0 : candidate;
		}
	}
	if (net.isIP(trimmed) !== 0) return trimmed;
	const lastColon = trimmed.lastIndexOf(":");
	if (lastColon > -1 && trimmed.includes(".") && trimmed.indexOf(":") === lastColon) {
		const candidate = trimmed.slice(0, lastColon);
		return net.isIP(candidate) === 4 ? candidate : void 0;
	}
}
function isTrustedProxyAddress(ip, trustedProxies) {
	const candidate = parseIpLiteral(ip);
	if (!candidate || !trustedProxies?.length) return false;
	const blockList = new net.BlockList();
	for (const proxy of trustedProxies) {
		const trimmed = normalizeOptionalString(proxy) ?? "";
		if (!trimmed) continue;
		if (trimmed.includes("/")) {
			const [address, prefix] = trimmed.split("/", 2);
			if (address === void 0 || prefix === void 0) continue;
			const parsedPrefix = parseStrictNonNegativeInteger(prefix);
			const family = net.isIP(address);
			if (family === 4 && parsedPrefix !== void 0 && parsedPrefix >= 0 && parsedPrefix <= 32) blockList.addSubnet(address, parsedPrefix, "ipv4");
			if (family === 6 && parsedPrefix !== void 0 && parsedPrefix >= 0 && parsedPrefix <= 128) blockList.addSubnet(address, parsedPrefix, "ipv6");
			continue;
		}
		if (net.isIP(trimmed) === 4) {
			blockList.addAddress(trimmed, "ipv4");
			continue;
		}
		if (net.isIP(trimmed) === 6) blockList.addAddress(trimmed, "ipv6");
	}
	return blockList.check(candidate, net.isIP(candidate) === 6 ? "ipv6" : "ipv4");
}
function resolveForwardedClientIp(forwardedFor, trustedProxies) {
	if (!trustedProxies?.length) return;
	const forwardedChain = forwardedFor?.split(",").map((entry) => parseIpLiteral(entry)).filter((entry) => Boolean(entry));
	if (!forwardedChain?.length) return;
	for (let index = forwardedChain.length - 1; index >= 0; index -= 1) {
		const hop = forwardedChain[index];
		if (!isTrustedProxyAddress(hop, trustedProxies)) return hop;
	}
}
function resolveTelegramWebhookClientIp(req, config) {
	const remoteAddress = parseIpLiteral(req.socket.remoteAddress);
	const trustedProxies = config?.gateway?.trustedProxies;
	if (!remoteAddress) return "unknown";
	if (!isTrustedProxyAddress(remoteAddress, trustedProxies)) return remoteAddress;
	const forwardedClientIp = resolveForwardedClientIp(Array.isArray(req.headers["x-forwarded-for"]) ? req.headers["x-forwarded-for"][0] : req.headers["x-forwarded-for"], trustedProxies);
	if (forwardedClientIp) return forwardedClientIp;
	if (config?.gateway?.allowRealIpFallback === true) return parseIpLiteral(Array.isArray(req.headers["x-real-ip"]) ? req.headers["x-real-ip"][0] : req.headers["x-real-ip"]) ?? "unknown";
	return "unknown";
}
function resolveTelegramWebhookRateLimitKey(req, path, config) {
	return `${path}:${resolveTelegramWebhookClientIp(req, config)}`;
}
async function startTelegramWebhook(opts) {
	const readConfig = createRuntimeConfigReader(opts.config ?? {});
	const path = opts.path ?? "/telegram-webhook";
	const healthPath = opts.healthPath ?? "/healthz";
	if (path === healthPath) throw new Error(`Telegram webhook path "${path}" conflicts with the health path.`);
	const port = opts.port ?? 8787;
	const host = opts.host ?? "127.0.0.1";
	const secret = normalizeOptionalString(opts.secret) ?? "";
	if (!secret) throw new Error("Telegram webhook mode requires a non-empty secret token. Set channels.telegram.webhookSecret in your config.");
	const runtime = opts.runtime ?? defaultRuntime;
	const status = createTelegramWebhookStatusPublisher(opts.setStatus);
	status.noteWebhookStart();
	const webhookRegistrationRetryPolicy = opts.webhookRegistrationRetryPolicy ?? TELEGRAM_WEBHOOK_REGISTRATION_RETRY_POLICY;
	const spoolDir = opts.spoolDir ?? resolveTelegramIngressSpoolDir({ accountId: opts.accountId });
	let shutDown = false;
	let shutdownPromise;
	let ownedServer = void 0;
	let webhookIngressMonitor;
	const shutdownAbortController = new AbortController();
	const telegramAccountConfig = opts.config ? mergeTelegramAccountConfig(opts.config, opts.accountId ?? "default") : void 0;
	const telegramTransport = resolveTelegramTransport(opts.fetch, { network: telegramAccountConfig?.network });
	let closeTransportPromise;
	const closeTransportOnce = () => {
		closeTransportPromise ??= telegramTransport.close();
		return closeTransportPromise;
	};
	const botAbortController = new AbortController();
	const accountAbortSignal = opts.abortSignal ? AbortSignal.any([opts.abortSignal, shutdownAbortController.signal]) : shutdownAbortController.signal;
	const botFetchAbortSignal = opts.abortSignal ? AbortSignal.any([opts.abortSignal, botAbortController.signal]) : botAbortController.signal;
	const bot = createTelegramBot({
		token: opts.token,
		runtime,
		buildContext: opts.buildContext,
		dispatchReplyFromConfig: opts.dispatchReplyFromConfig,
		proxyFetch: opts.fetch,
		fetchAbortSignal: botFetchAbortSignal,
		accountAbortSignal,
		config: opts.config,
		accountId: opts.accountId,
		ownerAgentId: opts.ownerAgentId,
		telegramTransport
	});
	const runShutdownPhase = async (label, run) => {
		try {
			await run();
		} catch (err) {
			runtime.error?.(`telegram webhook ${label} failed: ${formatErrorMessage(err)}`);
		}
	};
	const shutdown = () => {
		if (shutdownPromise) return shutdownPromise;
		shutDown = true;
		const ingressMonitor = webhookIngressMonitor;
		webhookIngressMonitor = void 0;
		shutdownPromise = Promise.resolve().then(async () => {
			const ingressStopTask = ingressMonitor ? runShutdownPhase("ingress stop", () => ingressMonitor.stop()) : void 0;
			await runShutdownPhase("server close", () => {
				ownedServer?.close();
			});
			await runShutdownPhase("bot stop", () => bot.stop());
			await runShutdownPhase("transport close", closeTransportOnce);
			await runShutdownPhase("ingress drain", () => waitForWebhookIngressStop(ingressStopTask));
			await runShutdownPhase("ingress settlement", () => ingressMonitor?.waitForDeferredClaims());
			await runShutdownPhase("status update", () => status.noteWebhookStop());
		});
		botAbortController.abort();
		shutdownAbortController.abort();
		return shutdownPromise;
	};
	const runStartupPhase = async (run) => {
		try {
			return await run();
		} catch (err) {
			if (!opts.abortSignal?.aborted) status.noteWebhookRegistrationFailure(formatWebhookStartupError(err), isTelegramAuthenticationError(err) ? "blocked" : void 0);
			await shutdown();
			throw err;
		}
	};
	await runStartupPhase(() => initializeTelegramWebhookBot({
		bot,
		runtime,
		abortSignal: opts.abortSignal,
		onRetry: () => status.noteWebhookRecovery(),
		retryPolicy: webhookRegistrationRetryPolicy
	}));
	const botInfo = bot.botInfo;
	const telegramWebhookRateLimiter = createFixedWindowRateLimiter({
		windowMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
		maxRequests: WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests,
		maxTrackedKeys: WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys
	});
	const log = (line) => runtime.log?.(line);
	const startWebhookSpoolDrain = () => {
		if (webhookIngressMonitor) return;
		const webhookAbortSignal = opts.abortSignal ? AbortSignal.any([shutdownAbortController.signal, opts.abortSignal]) : shutdownAbortController.signal;
		webhookIngressMonitor = createTelegramTransportIngressMonitor({
			spoolDir,
			bot,
			botInfo,
			accountId: opts.accountId ?? "default",
			pollIntervalMs: TELEGRAM_WEBHOOK_SPOOLED_DRAIN_INTERVAL_MS,
			abortSignal: webhookAbortSignal,
			onLog: (message) => log(`webhook ${message}`),
			onError: (error) => log(`[telegram][diag] webhook spool drain failed: ${formatErrorMessage(error)}`)
		});
		webhookIngressMonitor.start();
	};
	const server = createServer$1((req, res) => {
		const respondText = (statusCode, text = "") => {
			if (res.headersSent || res.writableEnded) return;
			res.writeHead(statusCode, { "Content-Type": TELEGRAM_WEBHOOK_TEXT_TYPE });
			res.end(text);
		};
		if (req.url === healthPath) {
			res.writeHead(200);
			res.end("ok");
			return;
		}
		if (req.url !== path || req.method !== "POST") {
			res.writeHead(404);
			res.end();
			return;
		}
		const startTime = Date.now();
		if (isDiagnosticsEnabled(readConfig())) logWebhookReceived({
			channel: "telegram",
			updateType: "telegram-post"
		});
		if (!hasValidTelegramWebhookSecret(resolveSingleHeaderValue(req.headers["x-telegram-bot-api-secret-token"]), secret)) {
			if (!applyBasicWebhookRequestGuards({
				req,
				res,
				rateLimiter: telegramWebhookRateLimiter,
				rateLimitKey: resolveTelegramWebhookRateLimitKey(req, path, opts.config)
			})) return;
			res.shouldKeepAlive = false;
			res.setHeader("Connection", "close");
			respondText(401, "unauthorized");
			return;
		}
		(async () => {
			const body = await readJsonBodyWithLimit(req, {
				maxBytes: TELEGRAM_WEBHOOK_MAX_BODY_BYTES,
				timeoutMs: TELEGRAM_WEBHOOK_BODY_TIMEOUT_MS,
				emptyObjectOnEmpty: false,
				destroyOnLimit: false
			});
			if (!body.ok) {
				if (body.code === "PAYLOAD_TOO_LARGE") {
					await sendHttpRequestRejection(req, res, 413, body.error, TELEGRAM_WEBHOOK_TEXT_TYPE);
					return;
				}
				if (body.code === "REQUEST_BODY_TIMEOUT") {
					await sendHttpRequestRejection(req, res, 408, body.error, TELEGRAM_WEBHOOK_TEXT_TYPE);
					return;
				}
				if (body.code === "CONNECTION_CLOSED") {
					respondText(400, body.error);
					return;
				}
				respondText(400, body.error);
				return;
			}
			const ingressMonitor = webhookIngressMonitor;
			if (!ingressMonitor) throw new Error("Telegram webhook ingress is not ready.");
			await ingressMonitor.admit(body.value);
			res.setHeader(TELEGRAM_WEBHOOK_ACCEPTED_HEADER, TELEGRAM_WEBHOOK_ACCEPTED_VALUE);
			respondText(200);
			status.noteWebhookUpdateReceived();
			if (isDiagnosticsEnabled(readConfig())) logWebhookProcessed({
				channel: "telegram",
				updateType: "telegram-post",
				durationMs: Date.now() - startTime
			});
		})().catch((err) => {
			const errMsg = formatErrorMessage(err);
			if (isDiagnosticsEnabled(readConfig())) logWebhookError({
				channel: "telegram",
				updateType: "telegram-post",
				error: errMsg
			});
			runtime.log?.(`webhook request failed: ${errMsg}`);
			respondText(500);
		});
	});
	ownedServer = server;
	await runStartupPhase(() => listenHttpServer({
		server,
		port,
		host
	}));
	const boundAddress = server.address();
	const boundPort = boundAddress && typeof boundAddress !== "string" ? boundAddress.port : port;
	const publicUrl = resolveWebhookPublicUrl({
		configuredPublicUrl: opts.publicUrl,
		server,
		path,
		host,
		port
	});
	let webhookAdvertised = false;
	if (opts.abortSignal?.aborted) shutdown();
	else if (opts.abortSignal) opts.abortSignal.addEventListener("abort", () => void shutdown(), { once: true });
	const advertiseWebhook = async () => {
		if (shutDown || opts.abortSignal?.aborted) return;
		try {
			await withTelegramApiErrorLogging({
				operation: "setWebhook",
				runtime,
				fn: () => bot.api.setWebhook(publicUrl, {
					secret_token: secret,
					allowed_updates: resolveTelegramAllowedUpdates(),
					certificate: opts.webhookCertPath ? new InputFile(opts.webhookCertPath) : void 0
				})
			});
		} catch (err) {
			status.noteWebhookRegistrationFailure(formatErrorMessage(err), isTelegramAuthenticationError(err) ? "blocked" : isRetryableTelegramApiError(err, { context: "webhook" }) ? "recovering" : void 0);
			throw err;
		}
		if (shutDown) return;
		webhookAdvertised = true;
		status.noteWebhookAdvertised();
		runtime.log?.(`webhook advertised to telegram on ${publicUrl}`);
	};
	const shouldRetryWebhookRegistration = (err) => isRetryableTelegramApiError(err, { context: "webhook" });
	const retryWebhookRegistration = async (firstAttempt) => {
		let attempt = firstAttempt;
		while (true) {
			if (shutDown || opts.abortSignal?.aborted || webhookAdvertised) return;
			const delayMs = computeBackoff(webhookRegistrationRetryPolicy, attempt);
			runtime.log?.(`telegram setWebhook retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}`);
			try {
				await sleepWithAbort(delayMs, opts.abortSignal);
			} catch {
				return;
			}
			if (shutDown || opts.abortSignal?.aborted || webhookAdvertised) return;
			try {
				await advertiseWebhook();
				return;
			} catch (err) {
				if (!shouldRetryWebhookRegistration(err)) {
					runtime.error?.(`telegram setWebhook retry stopped after non-recoverable error: ${formatErrorMessage(err)}`);
					await shutdown();
					return;
				}
			}
			attempt += 1;
		}
	};
	runtime.log?.(`webhook local listener on http://${host}:${boundPort}${path}`);
	if (!shutDown) try {
		await advertiseWebhook();
	} catch (err) {
		if (!shouldRetryWebhookRegistration(err)) {
			await shutdown();
			throw err;
		}
		retryWebhookRegistration(1);
	}
	if (!shutDown) await runStartupPhase(startWebhookSpoolDrain);
	return {
		server,
		bot,
		stop: shutdown
	};
}
//#endregion
export { startTelegramWebhook };
