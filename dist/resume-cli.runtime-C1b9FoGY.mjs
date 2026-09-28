import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as sanitizeTerminalText, t as hasTerminalControl } from "./safe-text-CBmKtmbt.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { r as SessionsResolveResultSchema } from "./sessions-resolve-BANDk8-_.mjs";
import { t as selectStyled } from "./prompt-select-styled-Bv34-Wgx.mjs";
import { n as loadRecentSessions, r as resolveResumeSession, t as buildSessionChoices } from "./tui-session-picker-BZRj-9P-.mjs";
import { Guard } from "typebox/guard";
import { cancel } from "@clack/prompts";
//#region src/shared/resume-handoff.ts
const RESUME_HANDOFF_MAX_ENCODED_LENGTH = 4096;
const RESUME_HANDOFF_MAX_GATEWAY_URL_LENGTH = 2048;
const RESUME_HANDOFF_KEYS = [
	"version",
	"sessionKey",
	"gatewayUrl"
];
const RESUME_HANDOFF_ERROR = "Invalid --handoff payload. Copy a fresh command from the Control UI.";
function invalidResumeHandoff() {
	throw new Error(RESUME_HANDOFF_ERROR);
}
function validateGatewayUrl(gatewayUrl) {
	if (gatewayUrl.length === 0 || gatewayUrl.length > RESUME_HANDOFF_MAX_GATEWAY_URL_LENGTH || hasTerminalControl(gatewayUrl)) invalidResumeHandoff();
	let parsed;
	try {
		parsed = new URL(gatewayUrl);
	} catch {
		invalidResumeHandoff();
	}
	const authority = gatewayUrl.slice(gatewayUrl.indexOf("://") + 3).split("/", 1)[0] ?? "";
	if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:" || gatewayUrl.includes("?") || gatewayUrl.includes("#") || authority.includes("@") || parsed.username.length > 0 || parsed.password.length > 0) invalidResumeHandoff();
}
function validateResumeHandoffFields(sessionKey, gatewayUrl) {
	if (sessionKey.length === 0 || !Guard.IsMaxLength(sessionKey, 512) || hasTerminalControl(sessionKey) || parseAgentSessionKey(sessionKey) === null) invalidResumeHandoff();
	validateGatewayUrl(gatewayUrl);
}
function encodeBase64Url(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}
function decodeBase64Url(encoded) {
	const standard = encoded.replaceAll("-", "+").replaceAll("_", "/");
	const paddingLength = (4 - standard.length % 4) % 4;
	const binary = atob(`${standard}${"=".repeat(paddingLength)}`);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function decodeResumeHandoff(encoded) {
	try {
		if (encoded.length === 0 || encoded.length > RESUME_HANDOFF_MAX_ENCODED_LENGTH || !/^[A-Za-z0-9_-]+$/u.test(encoded)) invalidResumeHandoff();
		const bytes = decodeBase64Url(encoded);
		if (encodeBase64Url(bytes) !== encoded) invalidResumeHandoff();
		const json = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(bytes);
		const payload = JSON.parse(json);
		if (!isRecord(payload)) invalidResumeHandoff();
		if (Object.keys(payload).length !== RESUME_HANDOFF_KEYS.length || !RESUME_HANDOFF_KEYS.every((key) => Object.hasOwn(payload, key)) || payload.version !== 1 || typeof payload.sessionKey !== "string" || typeof payload.gatewayUrl !== "string") invalidResumeHandoff();
		validateResumeHandoffFields(payload.sessionKey, payload.gatewayUrl);
		return {
			version: 1,
			sessionKey: payload.sessionKey,
			gatewayUrl: payload.gatewayUrl
		};
	} catch {
		return invalidResumeHandoff();
	}
}
//#endregion
//#region src/cli/resume-cli.runtime.ts
const RESUME_INTERACTIVE_TERMINAL_GUIDANCE = "Attaching to a session requires an interactive terminal. Re-run `openclaw resume [query]` from an interactive terminal.";
const RESUME_HANDOFF_UNRESOLVED = "Could not resolve the session handoff. Copy a fresh command from the Control UI.";
const validateHandoffSessionResolveResult = /* @__PURE__ */ lazyCompile(SessionsResolveResultSchema);
function requireInteractiveResumeTerminal() {
	if (!isTerminalInteractive()) throw new Error(RESUME_INTERACTIVE_TERMINAL_GUIDANCE);
}
async function formatResumeConnectionError(error) {
	const [{ formatTuiErrorMessage }, { resolveGatewayDisconnectState }] = await Promise.all([import("./tui-formatters-D2JXhiD1.mjs"), import("./tui-DLSRIP9m.mjs")]);
	const details = error && typeof error === "object" && "details" in error ? error.details : void 0;
	const state = resolveGatewayDisconnectState({
		reason: formatTuiErrorMessage(error),
		details
	});
	return new Error([state.connectionStatus, state.remediation ?? "Ensure the Gateway is running and your --url/--token/--password are correct."].join("\n"), { cause: error });
}
async function connectResumeGateway(opts, handoffTarget) {
	const { GatewayChatClient } = await import("./gateway-chat-Bfoz8yI8.mjs");
	const client = await GatewayChatClient.connect({
		...opts,
		...handoffTarget ? {
			allowConfiguredAuthForExactTarget: true,
			suppressEnvAuthFallback: true
		} : {}
	});
	try {
		await new Promise((resolve, reject) => {
			let settled = false;
			const finish = (complete) => {
				if (settled) return;
				settled = true;
				complete();
			};
			client.onConnected = () => finish(resolve);
			client.onConnectError = (error) => finish(() => reject(error));
			client.onDisconnected = (reason) => finish(() => reject(new Error(reason || "Gateway connection closed")));
			client.start();
		});
		return client;
	} catch (error) {
		await client.stop();
		throw await formatResumeConnectionError(error);
	}
}
async function resolveHandoffConnection(opts, handoff) {
	const client = await connectResumeGateway(opts, true);
	try {
		let result;
		try {
			result = await client.resolveSession({
				key: handoff.sessionKey,
				agentId: handoff.agentId,
				includeGlobal: true,
				allowMissing: true
			});
		} catch {
			throw new Error(RESUME_HANDOFF_UNRESOLVED);
		}
		if (!validateHandoffSessionResolveResult(result) || !result.ok) throw new Error(RESUME_HANDOFF_UNRESOLVED);
		const canonicalKeyOwner = parseAgentSessionKey(result.key)?.agentId;
		if (result.agentId !== handoff.agentId || canonicalKeyOwner !== result.agentId) throw new Error(RESUME_HANDOFF_UNRESOLVED);
		return {
			connection: client.connection,
			sessionKey: result.key
		};
	} finally {
		await client.stop();
	}
}
async function fetchResumeSessions(opts, options = {}) {
	const client = await connectResumeGateway(opts, false);
	try {
		return {
			connection: client.connection,
			sessions: await loadRecentSessions(client, options)
		};
	} catch (error) {
		throw await formatResumeConnectionError(error);
	} finally {
		await client.stop();
	}
}
async function promptResumeSession(sessions) {
	const choices = buildSessionChoices(sessions);
	if (choices.length === 0) throw new Error("No recent sessions found. Run `openclaw sessions` to inspect sessions or `openclaw tui` to start one.");
	const selected = await selectStyled({
		message: "Resume a session",
		options: choices.map((choice) => ({
			value: choice.value,
			label: formatResumeCandidate(choice),
			hint: choice.description ? sanitizeTerminalText(choice.description) : void 0
		}))
	});
	if (typeof selected === "symbol") {
		cancel("Cancelled.");
		return null;
	}
	return selected;
}
function reportResumeFailure(query, resolution) {
	if (resolution.kind === "ambiguous") {
		defaultRuntime.error(`Session query ${JSON.stringify(query)} is ambiguous. Candidates:`);
		for (const candidate of resolution.candidates) defaultRuntime.error(`  ${formatResumeCandidate(candidate)}`);
		defaultRuntime.error("Use a longer name or the exact session key.");
		return;
	}
	defaultRuntime.error(`No recent session matched ${JSON.stringify(query)}.`);
	defaultRuntime.error("Run `openclaw resume` to choose from recent sessions or `openclaw sessions` to inspect all sessions.");
}
function formatResumeCandidate(candidate) {
	const label = sanitizeTerminalText(candidate.label);
	const key = sanitizeTerminalText(candidate.value);
	return label === key ? key : `${label} [${key}]`;
}
function resolveExplicitGlobalSessionKey(query) {
	const parsed = parseAgentSessionKey(query);
	return parsed?.rest === "global" ? {
		agentId: parsed.agentId,
		key: `agent:${parsed.agentId}:global`
	} : void 0;
}
/** Resolve or select one session and run the existing Gateway-backed TUI. */
async function runResumeCommand(query, opts) {
	const { handoff: encodedHandoff, ...connectionOptions } = opts;
	if (encodedHandoff !== void 0 && (query !== void 0 || opts.url !== void 0)) throw new Error("--handoff cannot be combined with a positional query or --url.");
	const handoff = encodedHandoff === void 0 ? void 0 : decodeResumeHandoff(encodedHandoff);
	requireInteractiveResumeTerminal();
	const resolvedQuery = query?.trim();
	const explicitGlobalSession = resolveExplicitGlobalSessionKey(resolvedQuery);
	let connection;
	let sessionKey;
	if (handoff) {
		const parsed = parseAgentSessionKey(handoff.sessionKey);
		const resolved = await resolveHandoffConnection({
			...connectionOptions,
			url: handoff.gatewayUrl
		}, {
			sessionKey: handoff.sessionKey,
			agentId: parsed.agentId
		});
		connection = resolved.connection;
		sessionKey = resolved.sessionKey;
	} else {
		const discovery = await fetchResumeSessions(connectionOptions, explicitGlobalSession ? {
			agentId: explicitGlobalSession.agentId,
			includeGlobal: true
		} : void 0);
		connection = discovery.connection;
		if (explicitGlobalSession) sessionKey = explicitGlobalSession.key;
		else if (resolvedQuery) {
			const resolution = resolveResumeSession(discovery.sessions, resolvedQuery);
			if (resolution.kind !== "match") {
				reportResumeFailure(resolvedQuery, resolution);
				defaultRuntime.exit(1);
				return;
			}
			sessionKey = resolution.session.value;
		} else sessionKey = await promptResumeSession(discovery.sessions);
	}
	if (!sessionKey) return;
	const { runTui } = await import("./tui-DLSRIP9m.mjs");
	await runTui({
		boundGateway: {
			url: handoff?.gatewayUrl ?? connection.url,
			...connection.token ? { token: connection.token } : {},
			...connection.password ? { password: connection.password } : {},
			...connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {}
		},
		session: sessionKey,
		forceProcessExitOnReturn: true
	});
}
//#endregion
export { runResumeCommand };
