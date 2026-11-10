import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { d as sleepWithAbort, n as computeBackoff, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { p as isDiagnosticsEnabled } from "./diagnostic-events-C91J-XX8.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as registerPluginHttpRoute } from "./http-registry-eGHR5upq.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { a as readJsonBodyWithLimit, f as sendHttpRequestRejection } from "./http-body-DZQjJc2J.mjs";
import { c as logWebhookError, l as logWebhookProcessed, u as logWebhookReceived } from "./diagnostic-Dz-YV3uh.mjs";
import { t as getWebhookLegacyListener } from "./http-legacy-listener-CLzHXHtG.mjs";
import { r as formatDurationPrecise } from "./format-duration-CyyGVUjR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { t as resolveTelegramAllowedUpdates } from "./allowed-updates-BAG6Daxx.mjs";
import { f as isRetryableTelegramApiError, m as isTelegramAuthenticationError, n as resolveTelegramTransport } from "./fetch-ZC4IpYLZ.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import { a as mergeTelegramAccountConfig, s as resolveTelegramLegacyWebhookListener } from "./account-selection-CQ3hKgoh.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import "./gateway-config-runtime-Dj7lt9bl.mjs";
import "./logging-core-CsXmxYo2.mjs";
import "./diagnostic-runtime-CMknAYR3.mjs";
import { t as createPluginRuntimeStore } from "./runtime-store-pFaG-6b2.mjs";
import { a as WEBHOOK_RATE_LIMIT_DEFAULTS, n as resolveRequestClientIp, s as createFixedWindowRateLimiter } from "./webhook-ingress-DFEVgBho.mjs";
import { r as applyBasicWebhookRequestGuards } from "./webhook-request-guards-BYZUECo_.mjs";
import { n as normalizeWebhookPath, o as resolveSingleWebhookTarget, r as registerWebhookTarget } from "./webhook-targets-CESSvdn5.mjs";
import { n as resolveTelegramGatewayWebhookUrl, r as resolveTelegramWebhookPathConflict } from "./webhook-route-teEzfKTK.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { i as createTelegramBot, n as createTelegramTransportIngressMonitor, t as createTelegramStatusPublisher } from "./transport-status-C_i-59Go.mjs";
import net from "node:net";
import { InputFile } from "grammy";
//#region extensions/telegram/src/webhook-legacy.ts
function parseIpLiteral(value) {
	const trimmed = value?.trim();
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
function createTelegramLegacyWebhookAuthLimiter(config) {
	const rateLimiter = createFixedWindowRateLimiter(WEBHOOK_RATE_LIMIT_DEFAULTS);
	const trusted = new net.BlockList();
	for (const proxy of config?.gateway?.trustedProxies ?? []) {
		const value = proxy.trim();
		const [address = "", prefix] = value.split("/", 2);
		const family = net.isIP(address);
		if (!family) continue;
		const ipType = family === 6 ? "ipv6" : "ipv4";
		if (prefix !== void 0) {
			const bits = parseStrictNonNegativeInteger(prefix);
			if (bits !== void 0 && bits <= (family === 6 ? 128 : 32)) trusted.addSubnet(address, bits, ipType);
		} else trusted.addAddress(value, ipType);
	}
	const isTrusted = (ip) => trusted.check(ip, net.isIP(ip) === 6 ? "ipv6" : "ipv4");
	const headerValue = (header) => Array.isArray(header) ? header[0] : header;
	const clientIp = (req) => {
		const remote = parseIpLiteral(req.socket.remoteAddress);
		if (!remote) return "unknown";
		if (!isTrusted(remote)) return remote;
		const forwarded = headerValue(req.headers["x-forwarded-for"])?.split(",").map(parseIpLiteral).filter((ip) => ip !== void 0);
		for (const hop of forwarded?.toReversed() ?? []) if (!isTrusted(hop)) return hop;
		return config?.gateway?.allowRealIpFallback === true ? parseIpLiteral(headerValue(req.headers["x-real-ip"])) ?? "unknown" : "unknown";
	};
	return (req, res) => applyBasicWebhookRequestGuards({
		req,
		res,
		rateLimiter,
		rateLimitKey: `${req.url}:${clientIp(req)}`
	});
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
function formatWebhookStartupError(error) {
	const message = formatErrorMessage(error);
	const code = extractErrorCode(error);
	return code && !message.includes(code) ? `${message} (${code})` : message;
}
function resolveSingleHeaderValue(header) {
	if (typeof header === "string") return header;
	if (Array.isArray(header) && header.length === 1) return header[0];
}
const webhookState = createPluginRuntimeStore({
	key: "telegram:webhook",
	errorMessage: "Telegram webhook routes are not registered"
});
async function handleTelegramWebhook(webhookTargets, rateLimiter, req, res) {
	const legacyListener = getWebhookLegacyListener(req);
	const targets = webhookTargets.get(normalizeWebhookPath(req.url ?? ""))?.filter((target) => target.isActive() && target.requestPath === req.url && (!legacyListener || target.legacyListener?.port === legacyListener.port && target.legacyListener?.host === legacyListener.host));
	if (!targets?.length || req.method !== "POST") {
		res.writeHead(404);
		res.end();
		return true;
	}
	if (targets.some((target) => target.diagnosticsEnabled())) logWebhookReceived({
		channel: "telegram",
		updateType: "telegram-post"
	});
	const secret = resolveSingleHeaderValue(req.headers["x-telegram-bot-api-secret-token"]);
	const match = resolveSingleWebhookTarget(targets, (target) => safeEqualSecret(secret, target.secret));
	if (match.kind !== "single") {
		const legacyAuthGuard = legacyListener ? targets[0]?.legacyAuthGuard : void 0;
		if (!(legacyAuthGuard ? legacyAuthGuard(req, res) : applyBasicWebhookRequestGuards({
			req,
			res,
			rateLimiter,
			rateLimitKey: `${req.url}:${resolveRequestClientIp(req) ?? "unknown"}`
		}))) return true;
		res.shouldKeepAlive = false;
		res.writeHead(401, {
			Connection: "close",
			"Content-Type": TELEGRAM_WEBHOOK_TEXT_TYPE
		});
		res.end(match.kind === "ambiguous" ? "ambiguous webhook target" : "unauthorized");
		return true;
	}
	await match.target.handle(req, res);
	return true;
}
async function startTelegramWebhook(opts) {
	let state = webhookState.tryGetRuntime();
	if (!state) {
		state = {
			targets: /* @__PURE__ */ new Map(),
			rateLimiter: createFixedWindowRateLimiter(WEBHOOK_RATE_LIMIT_DEFAULTS)
		};
		webhookState.setRuntime(state);
	}
	const { targets: webhookTargets, rateLimiter } = state;
	const readConfig = createRuntimeConfigReader(opts.config ?? {});
	const legacyListener = resolveTelegramLegacyWebhookListener(opts.legacyWebhook);
	const path = opts.path ?? "/telegram-webhook";
	const pathConflict = resolveTelegramWebhookPathConflict(path);
	if (pathConflict?.kind === "health") throw new Error(`Telegram webhook path "${path}" conflicts with the health path.`);
	if (pathConflict && !legacyListener) throw new Error(`Telegram webhook path "${path}" ${pathConflict.message}. Set webhookPath to /telegram-webhook and update webhookUrl or its reverse-proxy mapping before restarting.`);
	const secret = normalizeOptionalString(opts.secret) ?? "";
	if (!secret) throw new Error("Telegram webhook mode requires a non-empty secret token. Set channels.telegram.webhookSecret in your config.");
	const publicUrl = normalizeOptionalString(opts.publicUrl) ?? (opts.legacyWebhook === void 0 ? resolveTelegramGatewayWebhookUrl(opts.config, path) : void 0);
	if (!publicUrl) throw new Error("Telegram webhook mode requires webhookUrl pointing to the Gateway webhook route.");
	const runtime = opts.runtime ?? defaultRuntime;
	if (pathConflict) runtime.log?.(`Telegram webhook path "${path}" ${pathConflict.message} on the Gateway port; its legacy listener remains available. Set webhookPath to /telegram-webhook and update webhookUrl or its reverse-proxy mapping before setting legacyWebhook: false.`);
	const status = createTelegramStatusPublisher("webhook", opts.setStatus);
	status.noteStart();
	const webhookRegistrationRetryPolicy = opts.webhookRegistrationRetryPolicy ?? TELEGRAM_WEBHOOK_REGISTRATION_RETRY_POLICY;
	const retryDelay = (operation, attempt) => {
		const delayMs = computeBackoff(webhookRegistrationRetryPolicy, attempt);
		runtime.log?.(`telegram ${operation} retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}`);
		return delayMs;
	};
	let shutdownPromise;
	let unregisterRoute;
	let unregisterTarget;
	let ownedBot = void 0;
	let webhookIngressMonitor;
	const shutdownAbortController = new AbortController();
	const telegramAccountConfig = opts.config ? mergeTelegramAccountConfig(opts.config, opts.accountId ?? "default") : void 0;
	const telegramTransport = resolveTelegramTransport(opts.fetch, { network: telegramAccountConfig?.network });
	const botAbortController = new AbortController();
	const accountAbortSignal = opts.abortSignal ? AbortSignal.any([opts.abortSignal, shutdownAbortController.signal]) : shutdownAbortController.signal;
	const botFetchAbortSignal = opts.abortSignal ? AbortSignal.any([opts.abortSignal, botAbortController.signal]) : botAbortController.signal;
	const runShutdownPhase = async (label, run) => {
		try {
			await run();
		} catch (err) {
			runtime.error?.(`telegram webhook ${label} failed: ${formatErrorMessage(err)}`);
		}
	};
	const shutdown = () => {
		if (shutdownPromise) return shutdownPromise;
		const ingressMonitor = webhookIngressMonitor;
		webhookIngressMonitor = void 0;
		shutdownPromise = Promise.resolve().then(async () => {
			const ingressStopTask = ingressMonitor ? runShutdownPhase("ingress stop", () => ingressMonitor.stop()) : void 0;
			await runShutdownPhase("route release", () => {
				unregisterRoute?.();
				unregisterTarget?.();
			});
			await runShutdownPhase("bot stop", () => ownedBot?.stop());
			await runShutdownPhase("transport close", () => telegramTransport.close());
			await runShutdownPhase("ingress drain", () => {
				if (ingressStopTask) return raceWithTimeout(ingressStopTask, TELEGRAM_WEBHOOK_INGRESS_STOP_GRACE_MS, () => void 0, { ref: false });
			});
			await runShutdownPhase("ingress settlement", () => ingressMonitor?.waitForDeferredClaims());
			await runShutdownPhase("status update", () => status.noteStop());
		});
		botAbortController.abort();
		shutdownAbortController.abort();
		return shutdownPromise;
	};
	const runStartupPhase = async (run) => {
		try {
			return await run();
		} catch (err) {
			if (!opts.abortSignal?.aborted) status.noteError(formatWebhookStartupError(err), isTelegramAuthenticationError(err) ? "blocked" : void 0);
			await shutdown();
			throw err;
		}
	};
	const bot = await runStartupPhase(() => createTelegramBot({
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
	}));
	ownedBot = bot;
	const initializationAbortSignal = opts.abortSignal;
	await runStartupPhase(async () => {
		let attempt = 0;
		while (true) try {
			await withTelegramApiErrorLogging({
				operation: "getMe",
				runtime,
				fn: () => bot.init(initializationAbortSignal)
			});
			return;
		} catch (err) {
			if (!isRetryableTelegramApiError(err, { context: "webhook" }) || initializationAbortSignal?.aborted) throw err;
			attempt += 1;
			status.noteRecovery();
			await sleepWithAbort(retryDelay("getMe", attempt), initializationAbortSignal);
		}
	});
	const botInfo = bot.botInfo;
	const log = (line) => runtime.log?.(line);
	const handle = async (req, res) => {
		const respondText = (statusCode, text = "") => {
			if (res.headersSent || res.writableEnded) return;
			res.writeHead(statusCode, { "Content-Type": TELEGRAM_WEBHOOK_TEXT_TYPE });
			res.end(text);
		};
		const startTime = Date.now();
		try {
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
				respondText(400, body.error);
				return;
			}
			const ingressMonitor = webhookIngressMonitor;
			if (!ingressMonitor) throw new Error("Telegram webhook ingress is not ready.");
			await ingressMonitor.admit(body.value);
			res.setHeader(TELEGRAM_WEBHOOK_ACCEPTED_HEADER, TELEGRAM_WEBHOOK_ACCEPTED_VALUE);
			respondText(200);
			status.noteActivity();
			if (isDiagnosticsEnabled(readConfig())) logWebhookProcessed({
				channel: "telegram",
				updateType: "telegram-post",
				durationMs: Date.now() - startTime
			});
		} catch (err) {
			const errMsg = formatErrorMessage(err);
			if (isDiagnosticsEnabled(readConfig())) logWebhookError({
				channel: "telegram",
				updateType: "telegram-post",
				error: errMsg
			});
			runtime.log?.(`webhook request failed: ${errMsg}`);
			respondText(500);
		}
	};
	await runStartupPhase(() => {
		const target = {
			path,
			requestPath: path,
			secret,
			legacyListener,
			legacyAuthGuard: legacyListener ? createTelegramLegacyWebhookAuthLimiter(opts.config) : void 0,
			handle,
			diagnosticsEnabled: () => isDiagnosticsEnabled(readConfig()),
			isActive: () => !shutdownPromise && !opts.abortSignal?.aborted
		};
		unregisterTarget = registerWebhookTarget(webhookTargets, target, { onLastPathTargetRemoved: () => {
			if (webhookTargets.size === 0) rateLimiter.clear();
		} }).unregister;
		unregisterRoute = registerPluginHttpRoute({
			path,
			auth: "plugin",
			pluginId: "telegram",
			source: "webhook",
			accountId: opts.accountId,
			reuseExistingSameOwner: true,
			throwOnFailure: true,
			legacyListener: legacyListener ? {
				...legacyListener,
				health: { path: "/healthz" }
			} : void 0,
			handler: (req, res) => handleTelegramWebhook(webhookTargets, rateLimiter, req, res),
			log
		});
	});
	if (opts.abortSignal?.aborted) shutdown();
	else if (opts.abortSignal) opts.abortSignal.addEventListener("abort", () => void shutdown(), { once: true });
	const advertiseWebhook = async () => {
		if (shutdownPromise || opts.abortSignal?.aborted) return;
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
			status.noteError(formatErrorMessage(err), isTelegramAuthenticationError(err) ? "blocked" : isRetryableTelegramApiError(err, { context: "webhook" }) ? "recovering" : void 0);
			throw err;
		}
		if (shutdownPromise) return;
		status.noteReady();
		runtime.log?.(`webhook advertised to telegram on ${publicUrl}`);
	};
	const retryWebhookRegistration = async () => {
		let attempt = 1;
		while (true) {
			if (shutdownPromise || opts.abortSignal?.aborted) return;
			const delayMs = retryDelay("setWebhook", attempt);
			try {
				await sleepWithAbort(delayMs, opts.abortSignal);
			} catch {
				return;
			}
			if (shutdownPromise || opts.abortSignal?.aborted) return;
			try {
				await advertiseWebhook();
				return;
			} catch (err) {
				if (!isRetryableTelegramApiError(err, { context: "webhook" })) {
					runtime.error?.(`telegram setWebhook retry stopped after non-recoverable error: ${formatErrorMessage(err)}`);
					await shutdown();
					return;
				}
			}
			attempt += 1;
		}
	};
	if ((webhookTargets.get(normalizeWebhookPath(path)) ?? []).filter((target) => target.requestPath === path && safeEqualSecret(target.secret, secret)).length > 1) runtime.error?.(`Telegram accounts on Gateway route ${path} share a webhook secret. Give each account a distinct webhookSecret or webhookPath. Separate legacy endpoints retain account routing while you update the Gateway routes.`);
	const gatewayPort = resolveGatewayPort(opts.config);
	runtime.log?.(`telegram webhook Gateway route ${path} (port ${gatewayPort})`);
	runtime.log?.(legacyListener ? `Telegram legacy webhook listener ${legacyListener.host}:${legacyListener.port} forwards to the Gateway route. Point the reverse proxy for ${publicUrl} at Gateway port ${gatewayPort}${path}, verify delivery, then set legacyWebhook: false to disable legacy forwarding for this account.` : `Telegram uses only the Gateway webhook route. Route ${publicUrl} to Gateway port ${gatewayPort}${path}.`);
	if (!shutdownPromise) try {
		await advertiseWebhook();
	} catch (err) {
		if (!isRetryableTelegramApiError(err, { context: "webhook" })) {
			await shutdown();
			throw err;
		}
		retryWebhookRegistration();
	}
	if (!shutdownPromise) await runStartupPhase(() => {
		webhookIngressMonitor = createTelegramTransportIngressMonitor({
			stateDir: opts.stateDir,
			bot,
			botInfo,
			accountId: opts.accountId ?? "default",
			pollIntervalMs: TELEGRAM_WEBHOOK_SPOOLED_DRAIN_INTERVAL_MS,
			abortSignal: accountAbortSignal,
			onLog: (message) => log(`webhook ${message}`),
			onError: (error) => log(`[telegram][diag] webhook spool drain failed: ${formatErrorMessage(error)}`)
		});
		webhookIngressMonitor.start();
	});
	return {
		bot,
		stop: shutdown
	};
}
//#endregion
export { startTelegramWebhook };
