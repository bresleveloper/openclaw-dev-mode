import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as DEFAULT_GATEWAY_PORT, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { i as resolveExecutable } from "./executable-path-BMRdcL7i.mjs";
import "./config-DryArA1l.mjs";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-C3zotBKl.mjs";
import { randomBytes } from "node:crypto";
//#region src/hooks/gmail.ts
const DEFAULT_GMAIL_LABEL = "INBOX";
const DEFAULT_GMAIL_TOPIC = "gog-gmail-watch";
const DEFAULT_GMAIL_SUBSCRIPTION = "gog-gmail-watch-push";
const DEFAULT_GMAIL_SERVE_BIND = "127.0.0.1";
const DEFAULT_GMAIL_SERVE_PORT = 8788;
const DEFAULT_GMAIL_SERVE_PATH = "/gmail-pubsub";
const DEFAULT_GMAIL_MAX_BYTES = 2e4;
const DEFAULT_HOOKS_PATH = "/hooks";
const GMAIL_WATCH_EXCLUDED_LABELS = "SPAM,TRASH,DRAFT,SENT";
const GMAIL_WATCH_SENSITIVE_FLAGS = /* @__PURE__ */ new Set([
	"--token",
	"--hook-url",
	"--hook-token"
]);
let gogBin;
function generateHookToken(bytes = 24) {
	return randomBytes(bytes).toString("hex");
}
/** Resolve the per-message body byte bound gog is provisioned with (`--max-bytes`). */
function resolveGmailHookMaxBytes(raw) {
	return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_GMAIL_MAX_BYTES;
}
function mergeHookPresets(existing, preset) {
	const next = new Set(normalizeUniqueStringEntries(existing));
	next.add(preset);
	return Array.from(next);
}
function normalizeHooksPath(raw) {
	const base = raw?.trim() || DEFAULT_HOOKS_PATH;
	if (base === "/") return DEFAULT_HOOKS_PATH;
	return (base.startsWith("/") ? base : `/${base}`).replace(/\/+$/, "");
}
function normalizeServePath(raw) {
	const base = raw?.trim() || "/gmail-pubsub";
	if (base === "/") return "/";
	return (base.startsWith("/") ? base : `/${base}`).replace(/\/+$/, "");
}
function buildDefaultHookUrl(hooksPath, port = DEFAULT_GATEWAY_PORT) {
	const basePath = normalizeHooksPath(hooksPath);
	return joinUrl(`http://127.0.0.1:${port}`, `${basePath}/gmail`);
}
function resolveGmailHookRuntimeConfig(cfg, overrides) {
	const hooks = cfg.hooks;
	const gmail = hooks?.gmail;
	const hookToken = overrides.hookToken ?? hooks?.token ?? "";
	if (!hookToken) return {
		ok: false,
		error: "hooks.token missing (needed for gmail hook)"
	};
	const account = overrides.account ?? gmail?.account ?? "";
	if (!account) return {
		ok: false,
		error: "gmail account required"
	};
	const topic = overrides.topic ?? gmail?.topic ?? "";
	if (!topic) return {
		ok: false,
		error: "gmail topic required"
	};
	const subscription = overrides.subscription ?? gmail?.subscription ?? "gog-gmail-watch-push";
	const pushToken = overrides.pushToken ?? gmail?.pushToken ?? "";
	if (!pushToken) return {
		ok: false,
		error: "gmail push token required"
	};
	const hookUrl = overrides.hookUrl ?? gmail?.hookUrl ?? buildDefaultHookUrl(hooks?.path, resolveGatewayPort(cfg));
	const includeBody = overrides.includeBody ?? gmail?.includeBody ?? true;
	const maxBytes = resolveGmailHookMaxBytes(overrides.maxBytes ?? gmail?.maxBytes);
	const renewEveryMinutesRaw = overrides.renewEveryMinutes ?? gmail?.renewEveryMinutes;
	const renewEveryMinutes = typeof renewEveryMinutesRaw === "number" && Number.isFinite(renewEveryMinutesRaw) && renewEveryMinutesRaw > 0 ? Math.floor(renewEveryMinutesRaw) : 720;
	const serveBind = overrides.serveBind ?? gmail?.serve?.bind ?? "127.0.0.1";
	const servePortRaw = overrides.servePort ?? gmail?.serve?.port;
	const servePort = typeof servePortRaw === "number" && Number.isFinite(servePortRaw) && servePortRaw > 0 ? Math.floor(servePortRaw) : DEFAULT_GMAIL_SERVE_PORT;
	const servePathRaw = overrides.servePath ?? gmail?.serve?.path;
	const normalizedServePathRaw = typeof servePathRaw === "string" && servePathRaw.trim().length > 0 ? normalizeServePath(servePathRaw) : DEFAULT_GMAIL_SERVE_PATH;
	const tailscaleTargetRaw = overrides.tailscaleTarget ?? gmail?.tailscale?.target;
	const tailscaleMode = overrides.tailscaleMode ?? gmail?.tailscale?.mode ?? "off";
	const tailscaleTarget = tailscaleMode !== "off" && typeof tailscaleTargetRaw === "string" && tailscaleTargetRaw.trim().length > 0 ? tailscaleTargetRaw.trim() : void 0;
	const servePath = normalizeServePath(tailscaleMode !== "off" && !tailscaleTarget ? "/" : normalizedServePathRaw);
	const tailscalePathRaw = overrides.tailscalePath ?? gmail?.tailscale?.path;
	const tailscalePath = normalizeServePath(tailscaleMode !== "off" ? tailscalePathRaw ?? normalizedServePathRaw : tailscalePathRaw ?? servePath);
	return {
		ok: true,
		value: {
			account,
			label: overrides.label ?? gmail?.label ?? "INBOX",
			topic,
			subscription,
			pushToken,
			hookToken,
			hookUrl,
			includeBody,
			maxBytes,
			renewEveryMinutes,
			serve: {
				bind: serveBind,
				port: servePort,
				path: servePath
			},
			tailscale: {
				mode: tailscaleMode,
				path: tailscalePath,
				target: tailscaleTarget
			}
		}
	};
}
function buildGogWatchStartArgs(cfg) {
	return [
		"gmail",
		"watch",
		"start",
		"--account",
		cfg.account,
		"--label",
		cfg.label,
		"--topic",
		cfg.topic
	];
}
function buildGogWatchServeArgs(cfg) {
	const args = [
		"gmail",
		"watch",
		"serve",
		"--account",
		cfg.account,
		"--bind",
		cfg.serve.bind,
		"--port",
		String(cfg.serve.port),
		"--path",
		cfg.serve.path,
		"--token",
		cfg.pushToken,
		"--hook-url",
		cfg.hookUrl,
		"--hook-token",
		cfg.hookToken
	];
	if (cfg.includeBody) args.push("--include-body");
	args.push("--exclude-labels", GMAIL_WATCH_EXCLUDED_LABELS);
	if (cfg.maxBytes > 0) args.push("--max-bytes", String(cfg.maxBytes));
	return args;
}
function buildGogWatchServeLogArgs(cfg) {
	return buildGogWatchServeArgs(cfg).filter((arg, index, args) => !GMAIL_WATCH_SENSITIVE_FLAGS.has(arg) && !GMAIL_WATCH_SENSITIVE_FLAGS.has(args[index - 1] ?? ""));
}
function resolveGogExecutable() {
	return gogBin ??= resolveExecutable("gog");
}
function resolveGogServeInvocation(args) {
	const command = resolveGogExecutable();
	if (!isWindowsBatchCommand(command)) return {
		command,
		args,
		windowsHide: process.platform === "win32" ? true : void 0
	};
	return {
		command: resolveTrustedWindowsCmdExe(),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(command, args)
		],
		windowsHide: true,
		windowsVerbatimArguments: true
	};
}
function buildTopicPath(projectId, topicName) {
	return `projects/${projectId}/topics/${topicName}`;
}
function parseTopicPath(topic) {
	const match = topic.trim().match(/^projects\/([^/]+)\/topics\/([^/]+)$/i);
	if (!match) return null;
	return {
		projectId: match[1] ?? "",
		topicName: match[2] ?? ""
	};
}
function joinUrl(base, pathLocal) {
	const url = new URL(base);
	url.pathname = `${url.pathname.replace(/\/+$/, "")}${pathLocal.startsWith("/") ? pathLocal : `/${pathLocal}`}`;
	return url.toString();
}
//#endregion
export { parseTopicPath as _, DEFAULT_GMAIL_SERVE_PORT as a, resolveGogExecutable as b, buildDefaultHookUrl as c, buildGogWatchStartArgs as d, buildTopicPath as f, normalizeServePath as g, normalizeHooksPath as h, DEFAULT_GMAIL_SERVE_PATH as i, buildGogWatchServeArgs as l, mergeHookPresets as m, DEFAULT_GMAIL_MAX_BYTES as n, DEFAULT_GMAIL_SUBSCRIPTION as o, generateHookToken as p, DEFAULT_GMAIL_SERVE_BIND as r, DEFAULT_GMAIL_TOPIC as s, DEFAULT_GMAIL_LABEL as t, buildGogWatchServeLogArgs as u, resolveGmailHookMaxBytes as v, resolveGogServeInvocation as x, resolveGmailHookRuntimeConfig as y };
