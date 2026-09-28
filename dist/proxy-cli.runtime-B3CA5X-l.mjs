import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { r as resolveDebugProxySettings, t as applyDebugProxyEnv } from "./env-BOt5Nx-y.mjs";
import { a as finalizeDebugProxyCapture, d as getDebugProxyCaptureStore, p as redactedCaptureHeaders, r as initializeDebugProxyCapture, u as closeDebugProxyCaptureStore } from "./runtime-Cr-8v8fa.mjs";
import { n as runProxyValidation } from "./proxy-validation-UaMcyagY.mjs";
import { t as ensureDebugProxyCa } from "./ca-C84Szl1v.mjs";
import { t as buildDebugProxyCoverageReport } from "./coverage-C8ecRrr3.mjs";
import process$1 from "node:process";
import { URL as URL$1 } from "node:url";
import { spawn } from "node:child_process";
import net from "node:net";
import { StringDecoder } from "node:string_decoder";
import { randomUUID } from "node:crypto";
import { createServer as createServer$1, request } from "node:http";
import { request as request$1 } from "node:https";
//#region src/proxy-capture/proxy-server.ts
const DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE = "OPENCLAW_DEBUG_PROXY_ALLOW_DIRECT_CONNECT_WITH_MANAGED_PROXY";
const CAPTURE_BODY_PREVIEW_BYTES = 8192;
const BAD_GATEWAY_BODY = "Bad Gateway\n";
const DEBUG_PROXY_CONNECT_TIMEOUT_MS = 3e4;
const GATEWAY_TIMEOUT_BODY = "Gateway Timeout\n";
function isManagedProxyActive(env = process.env) {
	return isTruthyEnvValue(env["OPENCLAW_PROXY_ACTIVE"]);
}
function allowsDirectConnectWithManagedProxy(env = process.env) {
	return isTruthyEnvValue(env[DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE]);
}
function assertDebugProxyDirectUpstreamAllowed(env = process.env) {
	if (!isManagedProxyActive(env) || allowsDirectConnectWithManagedProxy(env)) return;
	throw new Error(`Debug proxy direct upstream forwarding is disabled while managed proxy mode is active. Set ${DEBUG_PROXY_DIRECT_CONNECT_OVERRIDE}=1 only for approved local diagnostics.`);
}
function createProxyCaptureRecorder(params) {
	return (event) => {
		params.store.recordEvent({
			sessionId: params.settings.sessionId,
			ts: Date.now(),
			sourceScope: "openclaw",
			sourceProcess: params.settings.sourceProcess,
			...event
		});
	};
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
		totalBytes: 0,
		truncated: false
	};
}
function appendBodyPreviewCapture(capture, chunk) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	capture.totalBytes += buffer.byteLength;
	const remaining = CAPTURE_BODY_PREVIEW_BYTES - capture.previewBytes;
	if (remaining <= 0) {
		capture.truncated = capture.truncated || buffer.byteLength > 0;
		return;
	}
	const slice = buffer.byteLength > remaining ? buffer.subarray(0, remaining) : buffer;
	capture.chunks.push(slice);
	capture.previewBytes += slice.byteLength;
	if (slice.byteLength < buffer.byteLength) capture.truncated = true;
}
function finishBodyPreviewCapture(capture) {
	return {
		dataText: new StringDecoder("utf8").write(Buffer.concat(capture.chunks, capture.previewBytes)),
		metaJson: capture.truncated ? JSON.stringify({
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
	res.writeHead(502, {
		Connection: "close",
		"Content-Type": "text/plain; charset=utf-8",
		"Content-Length": Buffer.byteLength(BAD_GATEWAY_BODY)
	});
	res.end(BAD_GATEWAY_BODY);
}
async function startDebugProxyServer(params) {
	await ensureDebugProxyCa(params.settings.certDir);
	const recordProxyEvent = createProxyCaptureRecorder({
		store: getDebugProxyCaptureStore(),
		settings: params.settings
	});
	const host = params.host?.trim() || "127.0.0.1";
	const server = createServer$1((req, res) => {
		(async () => {
			const flowId = randomUUID();
			let target;
			try {
				target = normalizeTargetUrl(req);
			} catch (error) {
				const message = "Invalid proxy target URL";
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
				const responseBody = `${message}\n`;
				res.writeHead(400, {
					Connection: "close",
					"Content-Type": "text/plain; charset=utf-8",
					"Content-Length": Buffer.byteLength(responseBody)
				});
				res.end(responseBody);
				return;
			}
			const targetProtocol = target.protocol === "https:" ? "https" : "http";
			const targetPath = `${target.pathname}${target.search}`;
			const recordTargetEvent = (event) => recordProxyEvent({
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
				const responseBody = `${message}\n`;
				res.writeHead(403, {
					Connection: "close",
					"Content-Type": "text/plain; charset=utf-8",
					"Content-Length": Buffer.byteLength(responseBody)
				});
				res.end(responseBody);
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
		let port;
		try {
			const parsed = parseConnectTarget(req.url);
			hostname = parsed.hostname;
			port = parsed.port;
		} catch (error) {
			recordProxyEvent({
				protocol: "connect",
				direction: "local",
				kind: "error",
				flowId,
				host: hostname,
				path: req.url ?? "",
				errorText: error instanceof Error ? error.message : String(error)
			});
			clientSocket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
			return;
		}
		recordProxyEvent({
			protocol: "connect",
			direction: "local",
			kind: "connect",
			flowId,
			host: hostname,
			path: req.url ?? "",
			headersJson: JSON.stringify(redactedCaptureHeaders(req.headers))
		});
		try {
			assertDebugProxyDirectUpstreamAllowed();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			recordProxyEvent({
				protocol: "connect",
				direction: "local",
				kind: "error",
				flowId,
				host: hostname,
				path: req.url ?? "",
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
			const message = `CONNECT upstream opening timed out after ${DEBUG_PROXY_CONNECT_TIMEOUT_MS}ms of inactivity`;
			recordProxyEvent({
				protocol: "connect",
				direction: "local",
				kind: "error",
				flowId,
				host: hostname,
				path: req.url ?? "",
				errorText: message
			});
			upstreamSocket.destroy();
			clientSocket.end(`HTTP/1.1 504 Gateway Timeout\r\nConnection: close\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: ${Buffer.byteLength(GATEWAY_TIMEOUT_BODY)}\r\n\r\n${GATEWAY_TIMEOUT_BODY}`, () => clientSocket.destroy());
		}
		upstreamSocket.setTimeout(DEBUG_PROXY_CONNECT_TIMEOUT_MS, onUpstreamConnectTimeout);
		clientSocket.on("error", (error) => {
			recordProxyEvent({
				protocol: "connect",
				direction: "local",
				kind: "error",
				flowId,
				host: hostname,
				path: req.url ?? "",
				errorText: error.message
			});
			upstreamSocket.destroy();
		});
		upstreamSocket.on("error", (error) => {
			recordProxyEvent({
				protocol: "connect",
				direction: "local",
				kind: "error",
				flowId,
				host: hostname,
				path: req.url ?? "",
				errorText: error.message
			});
			clientSocket.destroy();
		});
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(params.port ?? 0, host, () => {
			server.off("error", reject);
			resolve();
		});
	});
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("Failed to resolve debug proxy server address");
	return {
		proxyUrl: `http://${host}:${address.port}`,
		stop: async () => await new Promise((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		})
	};
}
//#endregion
//#region src/cli/proxy-cli.runtime.ts
async function runDebugProxyStartCommand(opts) {
	const settings = resolveDebugProxySettings();
	const store = getDebugProxyCaptureStore();
	store.upsertSession({
		id: settings.sessionId,
		startedAt: Date.now(),
		mode: "proxy-start",
		sourceScope: "openclaw",
		sourceProcess: "openclaw",
		proxyUrl: settings.proxyUrl
	});
	initializeDebugProxyCapture("proxy-start", settings);
	const ca = await ensureDebugProxyCa(settings.certDir);
	const server = await startDebugProxyServer({
		host: opts.host,
		port: opts.port,
		settings
	});
	process$1.stdout.write(`Debug proxy: ${server.proxyUrl}\n`);
	process$1.stdout.write(`CA cert: ${ca.certPath}\n`);
	process$1.stdout.write(`Capture DB: ${store.dbPath}\n`);
	process$1.stdout.write("Press Ctrl+C to stop.\n");
	const shutdown = async () => {
		process$1.off("SIGINT", onSignal);
		process$1.off("SIGTERM", onSignal);
		await server.stop();
		if (settings.enabled) finalizeDebugProxyCapture(settings);
		else {
			store.endSession(settings.sessionId);
			closeDebugProxyCaptureStore();
		}
		process$1.exit(0);
	};
	const onSignal = () => {
		shutdown();
	};
	process$1.on("SIGINT", onSignal);
	process$1.on("SIGTERM", onSignal);
	await new Promise(() => {});
}
async function runDebugProxyRunCommand(opts) {
	if (opts.commandArgs.length === 0) throw new Error("proxy run requires a command after --");
	const sessionId = randomUUID();
	const settings = {
		...resolveDebugProxySettings(),
		sessionId
	};
	getDebugProxyCaptureStore().upsertSession({
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
		settings
	});
	const [command, ...args] = opts.commandArgs;
	const childEnv = applyDebugProxyEnv(process$1.env, {
		proxyUrl: server.proxyUrl,
		sessionId,
		certDir: settings.certDir
	});
	try {
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
	} finally {
		await server.stop();
		getDebugProxyCaptureStore().endSession(sessionId);
	}
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
function redactProxyValidationResult(result) {
	return {
		...result,
		config: {
			...result.config,
			proxyUrl: redactProxyUrl(result.config.proxyUrl)
		}
	};
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
function formatProxyValidationNextSteps(result) {
	if (result.ok) return [];
	if (result.config.errors.some((error) => error.includes("proxy CA file could not be read"))) return ["Confirm proxy.tls.caFile or --proxy-ca-file points to a readable PEM CA file for the HTTPS proxy endpoint."];
	if (result.config.errors.length > 0) return ["Fix proxy.proxyUrl, OPENCLAW_PROXY_URL, or --proxy-url so it uses a reachable http:// or https:// proxy."];
	if (result.checks.some((check) => !check.ok && check.kind === "allowed")) return ["Confirm the proxy is reachable from this deployment context and permits the allowed destinations."];
	if (result.checks.some((check) => !check.ok && check.kind === "denied")) return ["Update the proxy ACL so denied destinations are blocked, or pass the expected --denied-url values."];
	return ["Review the failed checks above and update proxy configuration or validation destinations."];
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
	const nextSteps = formatProxyValidationNextSteps(result);
	if (nextSteps.length > 0) {
		lines.push("", colors.heading("Next steps"));
		for (const nextStep of nextSteps) lines.push(`  ${colors.warn(nextStep)}`);
	}
	return `${lines.join("\n")}\n`;
}
async function runProxyValidateCommand(opts) {
	const config = getRuntimeConfig();
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
	const outputResult = redactProxyValidationResult(result);
	process$1.stdout.write(opts.json === true ? `${JSON.stringify(outputResult, null, 2)}\n` : formatProxyValidationText(outputResult));
	if (!result.ok) process$1.exitCode = 1;
}
async function runDebugProxySessionsCommand(opts) {
	const sessions = getDebugProxyCaptureStore().listSessions(opts.limit ?? 20);
	writeRuntimeJson(defaultRuntime, opts.json ? { sessions } : sessions);
	closeDebugProxyCaptureStore();
}
async function runDebugProxyQueryCommand(opts) {
	const rows = getDebugProxyCaptureStore().queryPreset(opts.preset, opts.sessionId);
	writeRuntimeJson(defaultRuntime, opts.json ? { rows } : rows);
	closeDebugProxyCaptureStore();
}
async function runDebugProxyCoverageCommand() {
	const report = buildDebugProxyCoverageReport();
	writeRuntimeJson(defaultRuntime, report);
	closeDebugProxyCaptureStore();
}
async function runDebugProxyPurgeCommand() {
	const result = getDebugProxyCaptureStore().purgeAll();
	process$1.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
	closeDebugProxyCaptureStore();
}
async function readDebugProxyBlobCommand(opts) {
	const content = getDebugProxyCaptureStore().readBlob(opts.blobId);
	if (content == null) {
		closeDebugProxyCaptureStore();
		throw new Error(`Unknown blob: ${opts.blobId}`);
	}
	process$1.stdout.write(content);
	closeDebugProxyCaptureStore();
}
//#endregion
export { readDebugProxyBlobCommand, runDebugProxyCoverageCommand, runDebugProxyPurgeCommand, runDebugProxyQueryCommand, runDebugProxyRunCommand, runDebugProxySessionsCommand, runDebugProxyStartCommand, runProxyValidateCommand };
