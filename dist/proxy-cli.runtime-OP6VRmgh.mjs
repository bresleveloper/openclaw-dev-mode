import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { p as loadPinnedRuntimeConfigAsync } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as resolveDebugProxySettings, t as applyDebugProxyEnv } from "./env-BULAE3Xo.mjs";
import { _ as acquireDebugProxyCaptureStoreAsync, d as reportCapturePersistenceFailure, l as finalizeDebugProxyCaptureAsync, o as initializeDebugProxyCaptureAsync, v as redactedCaptureHeaders } from "./runtime-tVgBJytW.mjs";
import { t as ensureDebugProxyCa } from "./ca-pm1O6E5G.mjs";
import { n as runProxyValidation } from "./proxy-validation-Caxrwwsw.mjs";
import { t as buildDebugProxyCoverageReport } from "./coverage-Xg3ZhsIk.mjs";
import process$1 from "node:process";
import { URL as URL$1 } from "node:url";
import { spawn } from "node:child_process";
import net from "node:net";
import { randomUUID } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
import { createServer as createServer$1, request } from "node:http";
import { request as request$1 } from "node:https";
//#region src/proxy-capture/proxy-server.ts
const DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE = "OPENCLAW_DEBUG_PROXY_ALLOW_DIRECT_CONNECT_WITH_MANAGED_PROXY";
const CAPTURE_BODY_PREVIEW_BYTES = 8192;
const BAD_GATEWAY_BODY = "Bad Gateway\n";
const DEBUG_PROXY_CONNECT_TIMEOUT_MS = 3e4;
const GATEWAY_TIMEOUT_BODY = "Gateway Timeout\n";
function assertDebugProxyDirectUpstreamAllowed(env = process.env) {
	if (!isTruthyEnvValue(env["OPENCLAW_PROXY_ACTIVE"]) || isTruthyEnvValue(env[DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE])) return;
	throw new Error(`Debug proxy direct upstream forwarding is disabled while managed proxy mode is active. Set ${DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE}=1 only for approved local diagnostics.`);
}
function parseConnectTarget(rawTarget) {
	const trimmed = rawTarget?.trim() ?? "";
	if (!trimmed) return {
		hostname: "127.0.0.1",
		port: 443
	};
	const bracketedMatch = trimmed.match(/^\[([^\]]+)\](?::(\d+))?$/);
	if (bracketedMatch) {
		const hostname = bracketedMatch[1]?.trim() || "127.0.0.1";
		const port = Number(bracketedMatch[2] || 443);
		if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid CONNECT target port");
		return {
			hostname,
			port
		};
	}
	const lastColon = trimmed.lastIndexOf(":");
	if (lastColon <= 0 || lastColon === trimmed.length - 1) return {
		hostname: trimmed,
		port: 443
	};
	const hostname = trimmed.slice(0, lastColon).trim() || "127.0.0.1";
	const portText = trimmed.slice(lastColon + 1).trim();
	if (!/^\d+$/.test(portText)) throw new Error("Invalid CONNECT target port");
	const port = Number(portText);
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid CONNECT target port");
	return {
		hostname,
		port
	};
}
function normalizeTargetUrl(req) {
	if (req.url?.startsWith("http://") || req.url?.startsWith("https://")) return new URL$1(req.url);
	const host = req.headers.host ?? "127.0.0.1";
	return new URL$1(`http://${host}${req.url ?? "/"}`);
}
function createBodyPreviewCapture() {
	return {
		chunks: [],
		previewBytes: 0,
		totalBytes: 0
	};
}
function appendBodyPreviewCapture(capture, chunk) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	capture.totalBytes += buffer.byteLength;
	const remaining = CAPTURE_BODY_PREVIEW_BYTES - capture.previewBytes;
	if (remaining <= 0) return;
	const slice = buffer.byteLength > remaining ? buffer.subarray(0, remaining) : buffer;
	capture.chunks.push(slice);
	capture.previewBytes += slice.byteLength;
}
function finishBodyPreviewCapture(capture) {
	return {
		dataText: new StringDecoder("utf8").write(Buffer.concat(capture.chunks, capture.previewBytes)),
		metaJson: capture.totalBytes > capture.previewBytes ? JSON.stringify({
			bodyBytes: capture.totalBytes,
			capturePreviewBytes: CAPTURE_BODY_PREVIEW_BYTES,
			captureTruncated: true
		}) : void 0
	};
}
function finishProxyResponseAfterUpstreamError(res) {
	if (res.destroyed || res.writableEnded) return;
	if (res.headersSent) {
		res.destroy();
		return;
	}
	endProxyErrorResponse(res, 502, BAD_GATEWAY_BODY);
}
function endProxyErrorResponse(res, status, body) {
	res.writeHead(status, {
		Connection: "close",
		"Content-Type": "text/plain; charset=utf-8",
		"Content-Length": Buffer.byteLength(body)
	});
	res.end(body);
}
async function startDebugProxyServer(params) {
	const settings = { ...params.settings };
	const env = { ...params.env ?? process.env };
	await ensureDebugProxyCa(settings.certDir);
	const lease = await acquireDebugProxyCaptureStoreAsync({ env });
	const pending = /* @__PURE__ */ new Set();
	const errors = [];
	const recordProxyEvent = (event) => {
		const operation = lease.store.recordEvent({
			sessionId: settings.sessionId,
			ts: Date.now(),
			sourceScope: "openclaw",
			sourceProcess: settings.sourceProcess,
			...event
		});
		pending.add(operation);
		operation.then(() => pending.delete(operation), (error) => {
			pending.delete(operation);
			reportCapturePersistenceFailure({ errors }, error);
		});
		return operation;
	};
	const host = params.host?.trim() || "127.0.0.1";
	const server = createServer$1((req, res) => {
		(async () => {
			const flowId = randomUUID();
			let target;
			try {
				target = normalizeTargetUrl(req);
			} catch (error) {
				recordProxyEvent({
					protocol: "http",
					direction: "local",
					kind: "error",
					flowId,
					method: req.method,
					host: req.headers.host,
					path: req.url ?? "",
					errorText: error instanceof Error ? error.message : String(error)
				});
				endProxyErrorResponse(res, 400, "Invalid proxy target URL\n");
				return;
			}
			const targetProtocol = target.protocol === "https:" ? "https" : "http";
			const targetPath = `${target.pathname}${target.search}`;
			const recordTargetEvent = (event) => void recordProxyEvent({
				protocol: targetProtocol,
				flowId,
				method: req.method,
				host: target.host,
				path: targetPath,
				...event
			});
			try {
				assertDebugProxyDirectUpstreamAllowed();
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				recordTargetEvent({
					direction: "local",
					kind: "error",
					errorText: message
				});
				endProxyErrorResponse(res, 403, `${message}\n`);
				return;
			}
			const requestCapture = createBodyPreviewCapture();
			const upstream = (target.protocol === "https:" ? request$1 : request)(target, {
				method: req.method,
				headers: req.headers
			}, (upstreamRes) => {
				const responseCapture = createBodyPreviewCapture();
				let upstreamFinished = false;
				let upstreamFailed = false;
				let responseFinished = false;
				let downstreamFailed = false;
				let pausedForDownstream = false;
				const resumeUpstreamResponse = () => {
					pausedForDownstream = false;
					if (!res.destroyed && !res.writableEnded && !upstreamRes.destroyed) upstreamRes.resume();
				};
				const handleDownstreamFailure = (error) => {
					if (downstreamFailed || responseFinished || upstreamFailed) return;
					downstreamFailed = true;
					res.off("drain", resumeUpstreamResponse);
					recordTargetEvent({
						direction: "local",
						kind: "error",
						errorText: error?.message ?? "Downstream response closed before completion"
					});
					upstream.destroy();
					upstreamRes.destroy();
				};
				res.on("finish", () => {
					if (!upstreamFinished || downstreamFailed || upstreamFailed) return;
					responseFinished = true;
					res.off("drain", resumeUpstreamResponse);
					recordTargetEvent({
						direction: "inbound",
						kind: "response",
						status: upstreamRes.statusCode ?? void 0,
						headersJson: JSON.stringify(redactedCaptureHeaders(upstreamRes.headers)),
						...finishBodyPreviewCapture(responseCapture)
					});
				});
				res.on("error", handleDownstreamFailure);
				res.on("close", () => handleDownstreamFailure());
				upstreamRes.on("data", (chunk) => {
					const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
					appendBodyPreviewCapture(responseCapture, buffer);
					if (res.destroyed || res.writableEnded) {
						handleDownstreamFailure();
						return;
					}
					try {
						if (!res.write(buffer) && !pausedForDownstream) {
							pausedForDownstream = true;
							upstreamRes.pause();
							res.once("drain", resumeUpstreamResponse);
						}
					} catch (error) {
						handleDownstreamFailure(error instanceof Error ? error : new Error(String(error)));
					}
				});
				upstreamRes.on("end", () => {
					upstreamFinished = true;
					res.off("drain", resumeUpstreamResponse);
					if (!res.destroyed && !res.writableEnded) res.end();
					else if (!res.writableFinished) handleDownstreamFailure();
				});
				upstreamRes.on("error", (error) => {
					if (downstreamFailed || responseFinished || upstreamFailed) return;
					upstreamFailed = true;
					res.off("drain", resumeUpstreamResponse);
					recordTargetEvent({
						direction: "inbound",
						kind: "error",
						errorText: error.message
					});
					finishProxyResponseAfterUpstreamError(res);
				});
				res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
			});
			req.on("data", (chunk) => {
				appendBodyPreviewCapture(requestCapture, chunk);
			});
			req.on("end", () => {
				recordTargetEvent({
					direction: "outbound",
					kind: "request",
					headersJson: JSON.stringify(redactedCaptureHeaders(req.headers)),
					...finishBodyPreviewCapture(requestCapture)
				});
			});
			req.on("error", (error) => {
				recordTargetEvent({
					direction: "local",
					kind: "error",
					errorText: error.message
				});
				upstream.destroy(error);
			});
			upstream.on("error", (error) => {
				recordTargetEvent({
					direction: "local",
					kind: "error",
					errorText: error.message
				});
				finishProxyResponseAfterUpstreamError(res);
			});
			req.pipe(upstream);
		})();
	});
	server.on("connect", (req, clientSocket, head) => {
		const flowId = randomUUID();
		let hostname = "127.0.0.1";
		const recordConnectEvent = (event) => void recordProxyEvent({
			protocol: "connect",
			direction: "local",
			flowId,
			host: hostname,
			path: req.url ?? "",
			...event
		});
		let port;
		try {
			const parsed = parseConnectTarget(req.url);
			hostname = parsed.hostname;
			port = parsed.port;
		} catch (error) {
			recordConnectEvent({
				kind: "error",
				errorText: error instanceof Error ? error.message : String(error)
			});
			clientSocket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
			return;
		}
		recordConnectEvent({
			kind: "connect",
			headersJson: JSON.stringify(redactedCaptureHeaders(req.headers))
		});
		try {
			assertDebugProxyDirectUpstreamAllowed();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			recordConnectEvent({
				kind: "error",
				errorText: message
			});
			const responseBody = `${message}\n`;
			clientSocket.end(`HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: ${Buffer.byteLength(responseBody)}\r\n\r\n${responseBody}`);
			return;
		}
		const upstreamSocket = net.connect(port, hostname, () => {
			upstreamSocket.setTimeout(0);
			upstreamSocket.off("timeout", onUpstreamConnectTimeout);
			clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
			if (head.length > 0) upstreamSocket.write(head);
			clientSocket.pipe(upstreamSocket);
			upstreamSocket.pipe(clientSocket);
		});
		function onUpstreamConnectTimeout() {
			recordConnectEvent({
				kind: "error",
				errorText: `CONNECT upstream opening timed out after ${DEBUG_PROXY_CONNECT_TIMEOUT_MS}ms of inactivity`
			});
			upstreamSocket.destroy();
			clientSocket.end(`HTTP/1.1 504 Gateway Timeout\r\nConnection: close\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: ${Buffer.byteLength(GATEWAY_TIMEOUT_BODY)}\r\n\r\n${GATEWAY_TIMEOUT_BODY}`, () => clientSocket.destroy());
		}
		upstreamSocket.setTimeout(DEBUG_PROXY_CONNECT_TIMEOUT_MS, onUpstreamConnectTimeout);
		clientSocket.on("error", (error) => {
			recordConnectEvent({
				kind: "error",
				errorText: error.message
			});
			upstreamSocket.destroy();
		});
		upstreamSocket.on("error", (error) => {
			recordConnectEvent({
				kind: "error",
				errorText: error.message
			});
			clientSocket.destroy();
		});
	});
	try {
		await new Promise((resolve, reject) => {
			server.once("error", reject);
			server.listen(params.port ?? 0, host, () => {
				server.off("error", reject);
				resolve();
			});
		});
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("Failed to resolve debug proxy server address");
		let stopping;
		return {
			proxyUrl: `http://${host}:${address.port}`,
			stop: () => {
				stopping ??= (async () => {
					try {
						await new Promise((resolve, reject) => {
							server.close((error) => {
								if (error) {
									reject(error);
									return;
								}
								resolve();
							});
						});
					} catch (error) {
						errors.push(error);
					}
					await Promise.allSettled(pending);
					try {
						await lease.release();
					} catch (error) {
						errors.push(error);
					}
					if (errors.length) throw new AggregateError(errors, "Debug proxy capture shutdown failed.");
				})();
				return stopping;
			}
		};
	} catch (error) {
		try {
			await lease.release();
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Debug proxy capture startup failed.", { cause: closeError });
		}
		throw error;
	}
}
//#endregion
//#region src/cli/proxy-cli.runtime.ts
async function finalizeProxyCommand(errors, finalizers) {
	for (const finalize of finalizers) try {
		await finalize();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Debug proxy command and capture cleanup failed.");
}
async function runDebugProxyStartCommand(opts) {
	const settings = resolveDebugProxySettings();
	const { environment: env } = captureOpenClawStateWorkerContext();
	const errors = [];
	const finalizers = [];
	try {
		if (settings.enabled) {
			finalizers.push(() => finalizeDebugProxyCaptureAsync(settings));
			await initializeDebugProxyCaptureAsync("proxy-start", settings);
		}
		const lease = await acquireDebugProxyCaptureStoreAsync({ env });
		const { store } = lease;
		finalizers.push(lease.release);
		if (!settings.enabled) {
			finalizers.unshift(() => store.endSession(settings.sessionId));
			await store.upsertSession({
				id: settings.sessionId,
				startedAt: Date.now(),
				mode: "proxy-start",
				sourceScope: "openclaw",
				sourceProcess: "openclaw",
				proxyUrl: settings.proxyUrl
			});
		}
		const ca = await ensureDebugProxyCa(settings.certDir);
		const server = await startDebugProxyServer({
			host: opts.host,
			port: opts.port,
			settings,
			env
		});
		finalizers.unshift(() => server.stop());
		process$1.stdout.write(`Debug proxy: ${server.proxyUrl}\n`);
		process$1.stdout.write(`CA cert: ${ca.certPath}\n`);
		process$1.stdout.write(`Capture DB: ${store.dbPath}\n`);
		process$1.stdout.write("Press Ctrl+C to stop.\n");
		await new Promise((resolve) => {
			const onSignal = () => {
				process$1.off("SIGINT", onSignal);
				process$1.off("SIGTERM", onSignal);
				resolve();
			};
			process$1.on("SIGINT", onSignal);
			process$1.on("SIGTERM", onSignal);
		});
	} catch (error) {
		errors.push(error);
	}
	await finalizeProxyCommand(errors, finalizers);
	process$1.exit(0);
}
async function runDebugProxyRunCommand(opts) {
	if (opts.commandArgs.length === 0) throw new Error("proxy run requires a command after --");
	const sessionId = randomUUID();
	const settings = {
		...resolveDebugProxySettings(),
		sessionId
	};
	const { environment: env } = captureOpenClawStateWorkerContext();
	const lease = await acquireDebugProxyCaptureStoreAsync({ env });
	const { store } = lease;
	const errors = [];
	const finalizers = [() => store.endSession(sessionId), lease.release];
	try {
		await store.upsertSession({
			id: sessionId,
			startedAt: Date.now(),
			mode: "proxy-run",
			sourceScope: "openclaw",
			sourceProcess: "openclaw",
			proxyUrl: void 0
		});
		const server = await startDebugProxyServer({
			host: opts.host,
			port: opts.port,
			settings,
			env
		});
		finalizers.unshift(() => server.stop());
		const [command, ...args] = opts.commandArgs;
		const childEnv = applyDebugProxyEnv(process$1.env, {
			proxyUrl: server.proxyUrl,
			sessionId,
			certDir: settings.certDir
		});
		await new Promise((resolve, reject) => {
			const child = spawn(expectDefined(command, "proxy cli.runtime command"), args, {
				stdio: "inherit",
				env: childEnv,
				cwd: process$1.cwd()
			});
			child.once("error", reject);
			child.once("exit", (code, signal) => {
				process$1.exitCode = resolveSubprocessExitCode(code, signal);
				resolve();
			});
		});
	} catch (error) {
		errors.push(error);
	}
	await finalizeProxyCommand(errors, finalizers);
}
function redactProxyUrl(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		if (url.username || url.password) {
			url.username = "redacted";
			url.password = "redacted";
		}
		url.search = "";
		url.hash = "";
		return url.toString();
	} catch {
		return "<invalid proxy URL>";
	}
}
function getProxyValidationTextColors() {
	const rich = isRich();
	const apply = (color) => (value) => colorize(rich, color, value);
	return {
		heading: apply(theme.heading),
		success: apply(theme.success),
		error: apply(theme.error),
		muted: apply(theme.muted),
		warn: apply(theme.warn)
	};
}
function formatProxyCheckLine(check, colors) {
	const icon = check.ok ? colors.success("✓") : colors.error("✗");
	const paddedKind = colors.muted(check.kind.padEnd(7, " "));
	const status = check.status === void 0 ? "" : ` ${check.ok ? colors.success(`HTTP ${check.status}`) : colors.error(`HTTP ${check.status}`)}`;
	const detail = check.error ? ` — ${check.ok ? colors.muted(check.error) : colors.error(check.error)}` : "";
	return `  ${icon} ${paddedKind} ${check.url}${status}${detail}`;
}
function formatProxyValidationNextStep(result) {
	if (result.ok) return;
	if (result.config.errors.some((error) => error.includes("proxy CA file could not be read"))) return "Confirm proxy.tls.caFile or --proxy-ca-file points to a readable PEM CA file for the HTTPS proxy endpoint.";
	if (result.config.errors.length > 0) return "Fix proxy.proxyUrl, OPENCLAW_PROXY_URL, or --proxy-url so it uses a reachable http:// or https:// proxy.";
	if (result.checks.some((check) => !check.ok && check.kind === "allowed")) return "Confirm the proxy is reachable from this deployment context and permits the allowed destinations.";
	if (result.checks.some((check) => !check.ok && check.kind === "denied")) return "Update the proxy ACL so denied destinations are blocked, or pass the expected --denied-url values.";
	return "Review the failed checks above and update proxy configuration or validation destinations.";
}
function formatProxyValidationText(result) {
	const colors = getProxyValidationTextColors();
	const redactedProxyUrl = redactProxyUrl(result.config.proxyUrl);
	const lines = [
		result.ok ? colors.success("Proxy validation passed") : colors.error("Proxy validation failed"),
		"",
		colors.heading("Proxy"),
		`  Source: ${colors.muted(result.config.source)}`,
		`  URL:    ${redactedProxyUrl ?? colors.muted("not configured")}`
	];
	if (result.config.errors.length > 0) {
		lines.push("", colors.heading("Problems"));
		for (const error of result.config.errors) lines.push(`  - ${colors.error(error)}`);
	}
	if (result.checks.length > 0) {
		lines.push("", colors.heading("Checks"));
		for (const check of result.checks) lines.push(formatProxyCheckLine(check, colors));
	}
	const nextStep = formatProxyValidationNextStep(result);
	if (nextStep) lines.push("", colors.heading("Next steps"), `  ${colors.warn(nextStep)}`);
	return `${lines.join("\n")}\n`;
}
async function runProxyValidateCommand(opts) {
	const config = await loadPinnedRuntimeConfigAsync(async (assertCurrent) => {
		const { getRuntimeConfig } = await import("./config/config.js");
		assertCurrent();
		return { config: getRuntimeConfig() };
	});
	const result = await runProxyValidation({
		config: config?.proxy,
		env: process$1.env,
		proxyUrlOverride: opts.proxyUrl,
		proxyCaFileOverride: opts.proxyCaFile,
		allowedUrls: opts.allowedUrls,
		deniedUrls: opts.deniedUrls,
		apnsReachability: opts.apnsReachability,
		apnsAuthority: opts.apnsAuthority,
		timeoutMs: opts.timeoutMs
	});
	const outputResult = {
		...result,
		config: {
			...result.config,
			proxyUrl: redactProxyUrl(result.config.proxyUrl)
		}
	};
	process$1.stdout.write(opts.json === true ? `${JSON.stringify(outputResult, null, 2)}\n` : formatProxyValidationText(outputResult));
	if (!result.ok) process$1.exitCode = 1;
}
async function withCaptureStore(action) {
	const lease = await acquireDebugProxyCaptureStoreAsync();
	try {
		await action(lease.store);
	} finally {
		await lease.release();
	}
}
async function runDebugProxySessionsCommand(opts) {
	await withCaptureStore(async (store) => {
		const sessions = await store.listSessions(opts.limit ?? 20);
		writeRuntimeJson(defaultRuntime, opts.json ? { sessions } : sessions);
	});
}
async function runDebugProxyQueryCommand(opts) {
	await withCaptureStore(async (store) => {
		const rows = await store.queryPreset(opts.preset, opts.sessionId);
		writeRuntimeJson(defaultRuntime, opts.json ? { rows } : rows);
	});
}
async function runDebugProxyCoverageCommand() {
	const report = buildDebugProxyCoverageReport();
	writeRuntimeJson(defaultRuntime, report);
}
async function runDebugProxyPurgeCommand() {
	await withCaptureStore(async (store) => {
		const result = await store.purgeAll();
		process$1.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
	});
}
async function readDebugProxyBlobCommand(opts) {
	await withCaptureStore(async (store) => {
		const content = await store.readBlob(opts.blobId);
		if (content == null) throw new Error(`Unknown blob: ${opts.blobId}`);
		process$1.stdout.write(content);
	});
}
//#endregion
export { readDebugProxyBlobCommand, runDebugProxyCoverageCommand, runDebugProxyPurgeCommand, runDebugProxyQueryCommand, runDebugProxyRunCommand, runDebugProxySessionsCommand, runDebugProxyStartCommand, runProxyValidateCommand };
