import { r as consumeRootOptionToken } from "./cli-root-options-vGuJ5JgW.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as isSensitiveUrlQueryParamName } from "./redact-sensitive-url-DspuXlEe.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as normalizeWebSocketProtocol } from "./websocket-protocol-MDxbNIbL.mjs";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-Dr91v3w1.mjs";
import { t as parseControlUiSessionPath } from "./parse-CUeSqfGE.mjs";
//#region src/cli/session-ref.ts
const SESSION_TARGET_HELP = "Accepted session targets: https://host[/base]/{chat|dashboard}/<agent>[/<ref>], <host>/<agent>/<ref>, or a bare <slug>-<shortid>, <shortid>, or agent:... key.";
var SessionTargetParseError = class extends Error {
	constructor() {
		super(SESSION_TARGET_HELP);
		this.name = "SessionTargetParseError";
	}
};
const BARE_SESSION_TUI_VALUE_OPTIONS = {
	"--token": "token",
	"--password": "password",
	"--tls-fingerprint": "tlsFingerprint",
	"--thinking": "thinking",
	"--message": "message",
	"--timeout-ms": "timeoutMs",
	"--history-limit": "historyLimit"
};
function refFromPathTarget(target) {
	if (target.kind === "main") return { kind: "main" };
	if (target.kind === "short") return {
		kind: "short",
		shortId: target.shortId,
		...target.slugHint ? { slugHint: target.slugHint } : {}
	};
	return {
		kind: "literal",
		sessionKey: target.sessionKey
	};
}
function parseControlPath(pathname) {
	const direct = parseControlUiSessionPath(pathname);
	if (direct) return {
		basePath: "",
		target: direct
	};
	const segments = pathname.split("/");
	for (let index = segments.length - 1; index > 0; index -= 1) {
		if (segments[index] !== "chat" && segments[index] !== "dashboard") continue;
		const basePath = segments.slice(0, index).join("/");
		const target = parseControlUiSessionPath(pathname, basePath);
		if (target) return {
			basePath,
			target
		};
	}
	throw new SessionTargetParseError();
}
function rejectUrlCredentials(url) {
	const fragmentParams = new URLSearchParams(url.hash.replace(/^#/u, ""));
	const sensitiveParam = [...url.searchParams.keys(), ...fragmentParams.keys()].some(isSensitiveUrlQueryParamName);
	if (url.username || url.password || sensitiveParam) throw new Error("Session URLs must not contain credentials. Pass --token or --password instead.");
}
function parseSessionUrl(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		throw new SessionTargetParseError();
	}
	rejectUrlCredentials(url);
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(url.protocol)) throw new SessionTargetParseError();
	url.protocol = normalizeWebSocketProtocol(url.protocol);
	const parsed = parseControlPath(url.pathname);
	const gatewayUrl = `${url.origin}${parsed.basePath}`;
	buildGatewayConnectionDetailsWithResolvers({
		config: {},
		url: gatewayUrl
	});
	return {
		kind: "url",
		origin: url.origin,
		basePath: parsed.basePath,
		agentId: parsed.target.agentId,
		ref: refFromPathTarget(parsed.target)
	};
}
function parseHostShorthand(raw) {
	const parts = (raw.endsWith("/") ? raw.slice(0, -1) : raw).split("/");
	if (parts.length !== 3 || parts.some((part) => !part)) return null;
	let host;
	try {
		host = new URL(`wss://${parts[0]}`);
	} catch {
		throw new SessionTargetParseError();
	}
	rejectUrlCredentials(host);
	if (host.pathname !== "/" || host.search || host.hash) throw new SessionTargetParseError();
	const target = parseControlUiSessionPath(`/dashboard/${parts[1]}/${parts[2]}`);
	if (!target) throw new SessionTargetParseError();
	return {
		kind: "url",
		origin: host.origin,
		basePath: "",
		agentId: target.agentId,
		ref: refFromPathTarget(target)
	};
}
function parseSessionTargetInput(raw) {
	const value = raw.trim();
	if (!value) throw new SessionTargetParseError();
	if (/^[a-z][a-z0-9+.-]*:\/\//iu.test(value)) return parseSessionUrl(value);
	const agentKey = parseAgentSessionKey(value);
	if (agentKey) return {
		kind: "ref",
		ref: {
			kind: "literal",
			sessionKey: `agent:${agentKey.agentId}:${agentKey.rest}`
		}
	};
	const shorthand = parseHostShorthand(value);
	if (shorthand) return shorthand;
	const short = parseControlUiSessionPath(`/dashboard/main/${value}`);
	if (short?.kind === "short") return {
		kind: "ref",
		ref: {
			kind: "short",
			shortId: short.shortId,
			...short.slugHint ? { slugHint: short.slugHint } : {}
		}
	};
	throw new SessionTargetParseError();
}
function isSessionUrlInputCandidate(raw) {
	return /^(?:https?|wss?):\/\//iu.test(raw.trim());
}
function bareSessionOptionError(flag) {
	return /* @__PURE__ */ new Error(`Unsupported bare session URL option: ${sanitizeTerminalText(flag)}. Use \`openclaw tui <url> --help\` for the full option list.`);
}
/** Parse the complete bare-root URL invocation before generic command discovery can see secrets. */
function parseBareSessionInvocation(argv) {
	if (!argv.slice(2).some(isSessionUrlInputCandidate)) return null;
	const options = {};
	let target;
	let consumedUrlFlag;
	for (let index = 2; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg) continue;
		if (arg === "--") throw bareSessionOptionError("--");
		const rootConsumed = consumeRootOptionToken(argv, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		if (arg === "--deliver") {
			options.deliver = true;
			continue;
		}
		if (!arg.startsWith("-")) {
			if (!target) {
				if (!isSessionUrlInputCandidate(arg)) break;
				target = arg;
				continue;
			}
			throw new Error("Unexpected extra argument for bare session URL. Use `openclaw tui <url> --help` for the full option list.");
		}
		const equalsIndex = arg.indexOf("=");
		const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
		const optionKey = BARE_SESSION_TUI_VALUE_OPTIONS[flag];
		if (!optionKey) throw bareSessionOptionError(flag);
		const value = equalsIndex === -1 ? argv[index + 1] : arg.slice(equalsIndex + 1);
		if (!value || value === "--" || equalsIndex === -1 && value.startsWith("-")) throw new Error(`${flag} requires a value.`);
		options[optionKey] = value;
		if (equalsIndex === -1) {
			if (!target && isSessionUrlInputCandidate(value)) consumedUrlFlag ??= flag;
			index += 1;
		}
	}
	if (!target && consumedUrlFlag) throw new Error(`${consumedUrlFlag} requires a value.`);
	return target ? {
		target,
		options
	} : null;
}
//#endregion
export { parseBareSessionInvocation as n, parseSessionTargetInput as r, SessionTargetParseError as t };
