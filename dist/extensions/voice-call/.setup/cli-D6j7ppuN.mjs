import { sleep } from "../runtime-api.js";
import "../api.js";
import { l as resolveVoiceCallStreamExposurePaths, u as validateProviderConfig } from "./config-72FnMWHb.mjs";
import { d as cleanupTailscaleExposureRoute, f as getTailscaleSelfInfo, p as setupTailscaleExposureRoutes, u as resolveWebhookExposureStatus, v as resolveVoiceCallAgentId, y as resolveUserPath } from "./runtime-entry-dDRm6RgA.mjs";
import { b as setVoiceCallStateRuntime, d as getCallHistoryFromStore, f as loadActiveCallsFromStore, o as MAX_CALL_RECORD_EVENTS, t as resolveDefaultVoiceCallStoreDir, u as findCallInStore } from "./store-path-B1j1up4_.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { callGatewayFromCli, isGatewayClientRequestError, isGatewayTransportError, redactSensitiveUrlLikeString } from "openclaw/plugin-sdk/gateway-runtime";
import { isRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { MAX_TCP_PORT, MAX_TIMER_TIMEOUT_MS, addTimerTimeoutGraceMs, clampTimerTimeoutMs, parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import fs from "node:fs";
import path from "node:path";
import { once } from "node:events";
import { format } from "node:util";
//#region extensions/voice-call/src/cli-command-io.ts
function writeCliLine(...values) {
	process.stdout.write(`${format(...values)}\n`);
}
function writeCliJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function parseCliInteger(raw, optionName, opts) {
	const min = opts?.min ?? 0;
	const parsed = parseStrictNonNegativeInteger(raw?.trim() ?? "");
	if (parsed === void 0 || parsed < min || opts?.max !== void 0 && parsed > opts.max) throw new Error(`Invalid numeric value for ${optionName}: ${raw ?? ""}`);
	return parsed;
}
//#endregion
//#region extensions/voice-call/src/cli-call-log.ts
const READ_BYTES = 65536;
async function writeLogChunk(chunk) {
	if (!process.stdout.write(chunk)) await once(process.stdout, "drain");
}
function* readLogLine({ fd, start, end }) {
	for (let offset = start; offset < end;) {
		const chunk = Buffer.alloc(Math.min(READ_BYTES, end - offset));
		const bytesRead = fs.readSync(fd, chunk, 0, chunk.length, offset);
		if (!bytesRead) throw new Error("Voice-call log was truncated while reading a record");
		offset += bytesRead;
		yield chunk.subarray(0, bytesRead);
	}
}
async function* readLogLines(file, last, pollMs) {
	let initial = true;
	let offset = 0;
	let lineStart = 0;
	let previous;
	const buffer = Buffer.alloc(READ_BYTES);
	for (;;) {
		let fd;
		try {
			fd = fs.openSync(file, "r");
		} catch (error) {
			if (initial || pollMs === void 0 || !isRecord(error) || error.code !== "ENOENT") throw error;
			await sleep(pollMs);
			continue;
		}
		try {
			const stat = fs.fstatSync(fd);
			if (previous && (stat.ino !== previous.ino || stat.dev !== previous.dev || stat.size < previous.size)) offset = lineStart = 0;
			previous = stat;
			const selected = [];
			let count = 0;
			while (offset < stat.size) {
				const length = Math.min(buffer.length, stat.size - offset);
				const bytesRead = fs.readSync(fd, buffer, 0, length, offset);
				if (!bytesRead) break;
				const start = offset;
				offset += bytesRead;
				for (let index = buffer.indexOf(10); index >= 0 && index < bytesRead; index = buffer.indexOf(10, index + 1)) {
					const line = {
						fd,
						start: lineStart,
						end: start + index
					};
					lineStart = line.end + 1;
					if (line.end > line.start) {
						if (!initial) yield line;
						else if (last > 0) selected[count++ % last] = line;
					}
				}
				if (!initial && bytesRead < length) break;
			}
			if (pollMs === void 0 && lineStart < offset) selected[count++ % last] = {
				fd,
				start: lineStart,
				end: offset
			};
			yield* selected.splice(last === 0 ? 0 : count % last);
			yield* selected;
		} finally {
			fs.closeSync(fd);
		}
		initial = false;
		if (pollMs === void 0) return;
		await sleep(pollMs);
	}
}
function percentile(values, p) {
	if (values.length === 0) return 0;
	const sorted = [...values].toSorted((a, b) => a - b);
	return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p / 100 * sorted.length) - 1))] ?? 0;
}
function summarizeSeries(values) {
	if (values.length === 0) return {
		count: 0,
		minMs: 0,
		maxMs: 0,
		avgMs: 0,
		p50Ms: 0,
		p95Ms: 0
	};
	const minMs = values.reduce((min, value) => value < min ? value : min);
	const maxMs = values.reduce((max, value) => value > max ? value : max);
	const avgMs = values.reduce((sum, value) => sum + value, 0) / values.length;
	return {
		count: values.length,
		minMs,
		maxMs,
		avgMs,
		p50Ms: percentile(values, 50),
		p95Ms: percentile(values, 95)
	};
}
async function writeVoiceCallLatencySummary(calls) {
	let recordsScanned = 0;
	const turnLatencyMs = [];
	const listenWaitMs = [];
	for await (const call of calls) {
		recordsScanned++;
		const metadata = isRecord(call) && isRecord(call.metadata) ? call.metadata : void 0;
		const latency = metadata?.lastTurnLatencyMs;
		const listenWait = metadata?.lastTurnListenWaitMs;
		if (typeof latency === "number" && Number.isFinite(latency)) turnLatencyMs.push(latency);
		if (typeof listenWait === "number" && Number.isFinite(listenWait)) listenWaitMs.push(listenWait);
	}
	writeCliJson({
		recordsScanned,
		turnLatency: summarizeSeries(turnLatencyMs),
		listenWait: summarizeSeries(listenWaitMs)
	});
}
function registerVoiceCallLogs(params) {
	params.root.command("tail").description("Tail persisted voice-call records or a custom JSONL log").option("--file <path>", "Path to calls.jsonl", params.defaultFile).option("--since <n>", "Print last N lines first", "25").option("--poll <ms>", "Poll interval in ms", "250").action(async (options) => {
		const file = options.file;
		const since = parseCliInteger(options.since, "--since", { min: 0 });
		const pollMs = parseCliInteger(options.poll, "--poll", { min: 50 });
		if (fs.existsSync(file) && path.basename(file) !== "calls.jsonl") for await (const line of readLogLines(file, since, pollMs)) {
			for (const chunk of readLogLine(line)) await writeLogChunk(chunk);
			await writeLogChunk("\n");
		}
		else {
			params.ensureHistoryStateRuntime();
			let initial = true;
			let seen = /* @__PURE__ */ new Set();
			for (;;) {
				const lines = (await getCallHistoryFromStore(path.dirname(file), MAX_CALL_RECORD_EVENTS)).map((call) => JSON.stringify(call));
				for (const line of initial ? lines.slice(Math.max(0, lines.length - since)) : lines) if (!seen.has(line)) {
					await writeLogChunk(`${line}\n`);
					seen.add(line);
				}
				seen = new Set(lines);
				initial = false;
				await sleep(pollMs);
			}
		}
	});
	params.root.command("latency").description("Summarize turn latency metrics from voice-call history or a custom JSONL log").option("--file <path>", "Path to calls.jsonl", params.defaultFile).option("--last <n>", "Analyze last N records", "200").action(async (options) => {
		const file = options.file;
		const last = parseCliInteger(options.last, "--last", { min: 1 });
		if (fs.existsSync(file) && path.basename(file) !== "calls.jsonl") {
			async function* readCalls() {
				for await (const line of readLogLines(file, last)) try {
					const parsed = JSON.parse(Buffer.concat([...readLogLine(line)]).toString("utf8"));
					const call = (isRecord(parsed) ? parsed.call : void 0) ?? parsed;
					if (call !== null) yield call;
				} catch (error) {
					if (!(error instanceof SyntaxError)) throw error;
				}
			}
			await writeVoiceCallLatencySummary(readCalls());
		} else {
			params.ensureHistoryStateRuntime();
			await writeVoiceCallLatencySummary(await getCallHistoryFromStore(path.dirname(file), last));
		}
	});
}
//#endregion
//#region extensions/voice-call/src/cli-gateway-call.ts
const VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS = 5e3;
const VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS = 3e4;
const VOICE_CALL_GATEWAY_TRANSCRIPT_BUFFER_MS = 1e4;
const VOICE_CALL_GATEWAY_POLL_INTERVAL_MS = 1e3;
function isGatewayUnavailableForLocalFallback(err) {
	return isGatewayTransportError(err) && err.kind === "closed" && (err.code === void 0 || err.code === 1006);
}
function isGatewayCredentialFailure(err) {
	return err instanceof Error && (err.name === "GatewayCredentialsRequiredError" || err.name === "GatewayExplicitAuthRequiredError" || err.name === "GatewaySecretRefUnavailableError");
}
function gatewayOperationalError(err) {
	const message = formatErrorMessage(err);
	const detail = (() => {
		if (isGatewayClientRequestError(err)) return `Gateway responded but voicecall failed: ${message}\nThe running Gateway owns the voice-call runtime; check \`openclaw gateway status\` or restart it.`;
		if (isGatewayCredentialFailure(err)) return `Gateway requires credentials: ${message}\nConfigure gateway.auth or pair this device with \`openclaw devices approve --latest\`.`;
		if (isGatewayTransportError(err)) {
			const url = err.connectionDetails.url;
			if (err.kind === "timeout") return `Gateway at ${url} did not answer within ${err.timeoutMs === void 0 ? "the configured timeout" : `${err.timeoutMs}ms`}: ${message}\nIt may be starting or wedged; check \`openclaw gateway status\`.`;
			return `Gateway connection at ${url} failed: ${message}\nCheck gateway.auth and \`openclaw gateway status\`, then retry.`;
		}
		return `Gateway voicecall request failed: ${message}\nCheck \`openclaw gateway status\`, then retry.`;
	})();
	return new Error(redactSensitiveUrlLikeString(detail));
}
function isUnknownMethod(err, method) {
	return formatErrorMessage(err).includes(`unknown method: ${method}`);
}
async function callVoiceCallGateway(method, params, opts) {
	try {
		const timeoutMs = typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.ceil(opts.timeoutMs)) : VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS;
		return {
			ok: true,
			payload: await callGatewayFromCli(method, {
				json: true,
				timeout: String(timeoutMs)
			}, params, { progress: false })
		};
	} catch (err) {
		if (isGatewayUnavailableForLocalFallback(err)) return {
			ok: false,
			error: err
		};
		throw gatewayOperationalError(err);
	}
}
function resolveOperationTimeout(config) {
	return Math.max(VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS, addTimerTimeoutGraceMs(config.ringTimeoutMs) ?? 1);
}
function resolveContinueTimeout(config) {
	return clampTimerTimeoutMs(config.transcriptTimeoutMs + VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS + VOICE_CALL_GATEWAY_TRANSCRIPT_BUFFER_MS) ?? 1;
}
function resolveVoiceCallDeadlineMs(timeoutMs, nowMs = Date.now()) {
	return nowMs + (clampTimerTimeoutMs(timeoutMs) ?? MAX_TIMER_TIMEOUT_MS);
}
function readGatewayOperationId(payload) {
	if (isRecord(payload) && typeof payload.operationId === "string" && payload.operationId) return payload.operationId;
	throw new Error("voicecall gateway response missing operationId");
}
function readGatewayPollTimeoutMs(payload, fallbackTimeoutMs) {
	if (isRecord(payload) && typeof payload.pollTimeoutMs === "number") return clampTimerTimeoutMs(payload.pollTimeoutMs) ?? fallbackTimeoutMs;
	return fallbackTimeoutMs;
}
function readCompletedContinueResult(payload) {
	if (!isRecord(payload)) throw new Error("voicecall gateway response missing operation status");
	if (payload.status === "pending") return { status: "pending" };
	if (payload.status === "failed") return {
		status: "failed",
		error: typeof payload.error === "string" ? payload.error : "continue failed"
	};
	if (payload.status === "completed") return {
		status: "completed",
		result: payload.result
	};
	throw new Error("voicecall gateway response has unknown operation status");
}
async function pollContinueGateway(payload, fallbackTimeoutMs) {
	if (!isRecord(payload) || typeof payload.operationId !== "string") return payload;
	const params = {
		operationId: readGatewayOperationId(payload),
		timeoutMs: readGatewayPollTimeoutMs(payload, fallbackTimeoutMs)
	};
	const deadlineMs = resolveVoiceCallDeadlineMs(params.timeoutMs);
	for (;;) {
		const remainingMs = deadlineMs - Date.now();
		if (remainingMs <= 0) break;
		const gateway = await callVoiceCallGateway("voicecall.continue.result", { operationId: params.operationId }, { timeoutMs: Math.min(VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS, remainingMs) });
		if (!gateway.ok) throw new Error(`gateway unavailable while waiting for voicecall continue result: ${formatErrorMessage(gateway.error)}`);
		const result = readCompletedContinueResult(gateway.payload);
		if (result.status === "completed") return result.result;
		if (result.status === "failed") throw new Error(result.error);
		const sleepMs = Math.min(VOICE_CALL_GATEWAY_POLL_INTERVAL_MS, deadlineMs - Date.now());
		if (sleepMs <= 0) break;
		await sleep(sleepMs);
	}
	throw new Error("voicecall continue timed out waiting for gateway operation");
}
async function ensureStandaloneRuntime(params) {
	try {
		return await params.ensureRuntime();
	} catch (err) {
		if (err instanceof Error && "code" in err && err.code === "EADDRINUSE") throw new Error(`Voice-call webhook port ${params.config.serve.port} is already in use. A running Gateway probably already serves it; operational commands route through that Gateway. Check \`openclaw gateway status\` and retry.`, { cause: err });
		throw err;
	}
}
async function runGatewayManagerCommand(params) {
	const gateway = await params.gatewayCall();
	if (gateway.ok) {
		writeCliJson(params.resolveGatewayPayload ? await params.resolveGatewayPayload(gateway.payload) : gateway.payload);
		return;
	}
	const runtime = await ensureStandaloneRuntime(params);
	const result = await params.managerFallback(runtime.manager);
	if (!result.success) throw new Error(result.error || `${params.failureLabel} failed`);
	writeCliJson(result);
}
function readGatewayCallId(payload, invalidCallIdMessage) {
	if (isRecord(payload) && typeof payload.callId === "string") {
		if (!invalidCallIdMessage || payload.callId) return payload.callId;
	}
	if (invalidCallIdMessage) throw new Error(invalidCallIdMessage);
	if (isRecord(payload) && typeof payload.error === "string") throw new Error(payload.error);
	throw new Error("voicecall gateway response missing callId");
}
async function initiateVoiceCall(params) {
	const mode = params.mode === "notify" || params.mode === "conversation" ? params.mode : params.defaultMode;
	const gateway = await callVoiceCallGateway(params.method, {
		...params.to ? { to: params.to } : {},
		...params.message ? { message: params.message } : {},
		...mode ? { mode } : {}
	}, { timeoutMs: resolveOperationTimeout(params.config) });
	if (gateway.ok) return readGatewayCallId(gateway.payload, params.failureMessage);
	const runtime = await ensureStandaloneRuntime(params);
	const to = params.to ?? runtime.config.toNumber;
	if (!to) throw new Error("Missing --to and no toNumber configured");
	const result = await runtime.manager.initiateCall(to, void 0, {
		message: params.message,
		mode
	});
	if (!result.success) throw new Error(result.error || params.failureMessage || "initiate failed");
	if (params.failureMessage && !result.callId) throw new Error(params.failureMessage);
	return result.callId;
}
//#endregion
//#region extensions/voice-call/src/cli.ts
function resolveMode(input) {
	const raw = normalizeOptionalLowercaseString(input) ?? "";
	if (raw === "serve" || raw === "off") return raw;
	return "funnel";
}
function resolveDefaultStorePath(config) {
	const base = config.store?.trim() ? resolveUserPath(config.store) : resolveDefaultVoiceCallStoreDir();
	return path.join(base, "calls.jsonl");
}
function buildSetupStatus(config, coreConfig) {
	const validation = validateProviderConfig(config);
	const webhookExposure = resolveWebhookExposureStatus(config);
	const checks = [
		{
			id: "plugin-enabled",
			ok: config.enabled,
			message: config.enabled ? "Voice Call plugin is enabled" : "Enable plugins.entries.voice-call.enabled"
		},
		{
			id: "provider",
			ok: Boolean(config.provider),
			message: config.provider ? `Provider configured: ${config.provider}` : "Set plugins.entries.voice-call.config.provider"
		},
		{
			id: "provider-config",
			ok: validation.valid,
			message: validation.valid ? "Provider credentials/config look complete" : validation.errors.join("; ")
		},
		{
			id: "webhook-exposure",
			ok: webhookExposure.ok,
			message: webhookExposure.message
		},
		{
			id: "mode",
			ok: !(config.streaming.enabled && config.realtime.enabled),
			message: config.streaming.enabled && config.realtime.enabled ? "streaming.enabled and realtime.enabled cannot both be true" : config.realtime.enabled ? `Realtime voice enabled (${config.realtime.provider ?? "first registered provider"})` : config.streaming.enabled ? `Streaming transcription enabled (${config.streaming.provider ?? "first registered provider"})` : "Notify/conversation calls use normal TTS/STT flow"
		}
	];
	try {
		const agentId = resolveVoiceCallAgentId(config, coreConfig);
		checks.push({
			id: "agent-owner",
			ok: true,
			message: `Response agent: ${agentId}`
		});
	} catch (error) {
		checks.push({
			id: "agent-owner",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	return {
		ok: checks.every((check) => check.ok),
		checks
	};
}
function writeSetupStatus(status) {
	writeCliLine("Voice Call setup: %s", status.ok ? "OK" : "needs attention");
	for (const check of status.checks) writeCliLine("%s %s: %s", check.ok ? "OK" : "FAIL", check.id, check.message);
}
function registerVoiceCallCli(params) {
	const { program, config, coreConfig, ensureRuntime, stateRuntime } = params;
	const ensureHistoryStateRuntime = () => {
		if (stateRuntime) setVoiceCallStateRuntime({ state: stateRuntime });
	};
	const root = program.command("voicecall").description("Voice call utilities").addHelpText("after", () => `\nDocs: https://docs.openclaw.ai/cli/voicecall\n`);
	root.command("setup").description("Show Voice Call provider and webhook setup status").option("--json", "Print machine-readable JSON").action((options) => {
		const status = buildSetupStatus(config, coreConfig);
		if (options.json) {
			writeCliJson(status);
			return;
		}
		writeSetupStatus(status);
	});
	root.command("smoke").description("Check Voice Call readiness and optionally place a short outbound test call").option("-t, --to <phone>", "Phone number to call for a live smoke").option("--message <text>", "Message to speak during the smoke call", "OpenClaw voice call smoke test.").option("--mode <mode>", "Call mode: notify or conversation", "notify").option("--yes", "Actually place the live outbound call").option("--json", "Print machine-readable JSON").action(async (options) => {
		const setup = buildSetupStatus(config, coreConfig);
		if (!setup.ok) {
			if (options.json) writeCliJson({
				ok: false,
				setup
			});
			else writeSetupStatus(setup);
			process.exitCode = 1;
			return;
		}
		if (!options.to) {
			if (options.json) writeCliJson({
				ok: true,
				setup,
				liveCall: false
			});
			else {
				writeSetupStatus(setup);
				writeCliLine("live-call: skipped (pass --to and --yes to place one)");
			}
			return;
		}
		if (!options.yes) {
			if (options.json) writeCliJson({
				ok: true,
				setup,
				liveCall: false,
				wouldCall: options.to
			});
			else {
				writeSetupStatus(setup);
				writeCliLine("live-call: dry run for %s (add --yes to place it)", options.to);
			}
			return;
		}
		const callId = await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.start",
			to: options.to,
			message: options.message,
			mode: options.mode,
			defaultMode: "notify",
			failureMessage: "smoke call failed"
		});
		if (options.json) {
			writeCliJson({
				ok: true,
				setup,
				liveCall: true,
				callId
			});
			return;
		}
		writeSetupStatus(setup);
		writeCliLine("live-call: started %s", callId);
	});
	root.command("call").description("Initiate an outbound voice call").requiredOption("-m, --message <text>", "Message to speak when call connects").option("-t, --to <phone>", "Phone number to call (E.164 format, uses config toNumber if not set)").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		writeCliJson({ callId: await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.initiate",
			to: options.to,
			message: options.message,
			mode: options.mode
		}) });
	});
	root.command("start").description("Alias for voicecall call").requiredOption("--to <phone>", "Phone number to call").option("--message <text>", "Message to speak when call connects").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		writeCliJson({ callId: await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.start",
			to: options.to,
			message: options.message,
			mode: options.mode
		}) });
	});
	root.command("continue").description("Speak a message and wait for a response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		const gatewayParams = {
			callId: options.callId,
			message: options.message
		};
		const continueTimeoutMs = resolveContinueTimeout(config);
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: async () => {
				try {
					return await callVoiceCallGateway("voicecall.continue.start", gatewayParams, { timeoutMs: resolveOperationTimeout(config) });
				} catch (err) {
					if (!isUnknownMethod(err, "voicecall.continue.start")) throw err;
					return callVoiceCallGateway("voicecall.continue", gatewayParams, { timeoutMs: continueTimeoutMs });
				}
			},
			resolveGatewayPayload: (payload) => pollContinueGateway(payload, continueTimeoutMs),
			managerFallback: (manager) => manager.continueCall(options.callId, options.message),
			failureLabel: "continue"
		});
	});
	root.command("speak").description("Speak a message without waiting for response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.speak", {
				callId: options.callId,
				message: options.message
			}),
			managerFallback: (manager) => manager.speak(options.callId, options.message),
			failureLabel: "speak"
		});
	});
	root.command("dtmf").description("Send DTMF digits to an active call").requiredOption("--call-id <id>", "Call ID").requiredOption("--digits <digits>", "DTMF digits").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.dtmf", {
				callId: options.callId,
				digits: options.digits
			}),
			managerFallback: (manager) => manager.sendDtmf(options.callId, options.digits),
			failureLabel: "dtmf"
		});
	});
	root.command("end").description("Hang up an active call").requiredOption("--call-id <id>", "Call ID").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.end", { callId: options.callId }),
			managerFallback: (manager) => manager.endCall(options.callId),
			failureLabel: "end"
		});
	});
	root.command("status").description("Show call status").option("--call-id <id>", "Call ID").option("--json", "Print machine-readable JSON").action(async (options) => {
		const gateway = await callVoiceCallGateway("voicecall.status", options.callId ? { callId: options.callId } : void 0);
		if (gateway.ok) {
			if (options.callId && isRecord(gateway.payload)) {
				if (gateway.payload.found === true && "call" in gateway.payload) {
					writeCliJson(gateway.payload.call);
					return;
				}
				if (gateway.payload.found === false) {
					writeCliJson({ found: false });
					return;
				}
			}
			writeCliJson(gateway.payload);
			return;
		}
		ensureHistoryStateRuntime();
		const storePath = path.dirname(resolveDefaultStorePath(config));
		if (options.callId) {
			writeCliJson(await findCallInStore(storePath, options.callId) ?? { found: false });
			return;
		}
		writeCliJson({
			found: true,
			calls: Array.from((await loadActiveCallsFromStore(storePath)).activeCalls.values())
		});
	});
	registerVoiceCallLogs({
		root,
		defaultFile: resolveDefaultStorePath(config),
		ensureHistoryStateRuntime
	});
	root.command("expose").description("Enable/disable Tailscale serve/funnel for the webhook").option("--mode <mode>", "off | serve (tailnet) | funnel (public)", "funnel").option("--path <path>", "Tailscale path to expose (recommend matching serve.path)").option("--port <port>", "Local webhook port").option("--serve-path <path>", "Local webhook path").action(async (options) => {
		const mode = resolveMode(options.mode ?? "funnel");
		const servePort = parseCliInteger(options.port ?? String(config.serve.port ?? 3334), "--port", {
			min: 1,
			max: MAX_TCP_PORT
		});
		const servePath = options.servePath ?? config.serve.path ?? "/voice/webhook";
		const tsPath = options.path ?? config.tailscale?.path ?? servePath;
		const streamExposurePaths = resolveVoiceCallStreamExposurePaths(config, {
			publicWebhookPath: tsPath,
			localWebhookPath: servePath
		});
		const streamPaths = streamExposurePaths.map(({ publicPath }) => publicPath);
		const localUrl = `http://127.0.0.1:${servePort}${servePath}`;
		if (mode === "off") {
			for (const exposurePath of [tsPath, ...streamPaths]) for (const tailscaleMode of ["serve", "funnel"]) await cleanupTailscaleExposureRoute({
				mode: tailscaleMode,
				port: config.tailscale.port,
				path: exposurePath
			});
			writeCliJson({
				ok: true,
				mode: "off",
				path: tsPath,
				streamPaths
			});
			return;
		}
		const publicUrl = await setupTailscaleExposureRoutes({
			mode,
			port: config.tailscale.port,
			routes: [{
				path: tsPath,
				localUrl
			}, ...streamExposurePaths.map(({ publicPath, localPath }) => ({
				path: publicPath,
				localUrl: `http://127.0.0.1:${servePort}${localPath}`
			}))]
		});
		const tsInfo = publicUrl ? null : await getTailscaleSelfInfo();
		const enableUrl = tsInfo?.nodeId ? `https://login.tailscale.com/f/${mode}?node=${tsInfo.nodeId}` : null;
		writeCliJson({
			ok: Boolean(publicUrl),
			mode,
			path: tsPath,
			streamPaths,
			localUrl,
			publicUrl,
			hint: publicUrl ? void 0 : {
				note: "Tailscale serve/funnel may be disabled on this tailnet (or require admin enable).",
				enableUrl
			}
		});
	});
}
//#endregion
export { registerVoiceCallCli };
