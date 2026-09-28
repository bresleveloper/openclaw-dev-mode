import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, y as tryResolveAgentOperationAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { m as resolveConfigPathCandidate } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { c as requestBodyErrorToText, o as readJsonBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import { r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { v as resolveGmailHookMaxBytes } from "./gmail-CPxwVUoz.mjs";
import { n as resolveFunctionModuleExport, t as importFileModule } from "./module-loader-BF97Ap2W.mjs";
import { t as resolveAllowedAgentIds } from "./hooks-policy-mF0dVTnY.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
const GMAIL_HOOK_BATCH_MAX_MESSAGES = 100;
const GMAIL_HOOK_JSON_ESCAPING_FACTOR = 3;
const GMAIL_HOOK_PER_MESSAGE_OVERHEAD_BYTES = 8192;
const GMAIL_HOOK_MAX_BODY_BYTES_CEILING = 33554432;
function resolveGmailHookMaxBodyBytes(maxBytes) {
	return Math.min(GMAIL_HOOK_MAX_BODY_BYTES_CEILING, GMAIL_HOOK_BATCH_MAX_MESSAGES * (maxBytes * GMAIL_HOOK_JSON_ESCAPING_FACTOR + GMAIL_HOOK_PER_MESSAGE_OVERHEAD_BYTES));
}
const hookPresetMappings = { gmail: [{
	id: "gmail",
	match: { path: "gmail" },
	action: "agent",
	wakeMode: "now",
	name: "Gmail",
	forEach: "messages",
	sessionKey: "hook:gmail:{{messages[0].id}}",
	messageTemplate: "New email from {{messages[0].from}}\nSubject: {{messages[0].subject}}\n{{messages[0].snippet}}\n{{messages[0].body}}"
}] };
const transformCache = /* @__PURE__ */ new Map();
let transformCacheBustVersion = 0;
function commitHookTransformMappingReload() {
	transformCache.clear();
	transformCacheBustVersion += 1;
}
/** Resolve configured hook mappings plus preset mappings into normalized matcher entries. */
function resolveHookMappings(hooks, opts) {
	const presets = hooks?.presets ?? [];
	const gmailAllowUnsafe = hooks?.gmail?.allowUnsafeExternalContent;
	const mappings = [];
	if (hooks?.mappings) mappings.push(...hooks.mappings);
	for (const preset of presets) {
		const presetMappings = hookPresetMappings[preset];
		if (!presetMappings) continue;
		if (preset === "gmail" && typeof gmailAllowUnsafe === "boolean") {
			mappings.push(...presetMappings.map((mapping) => ({
				...mapping,
				allowUnsafeExternalContent: gmailAllowUnsafe
			})));
			continue;
		}
		mappings.push(...presetMappings);
	}
	if (mappings.length === 0) return [];
	const configDir = path.resolve(opts?.configDir ?? path.dirname(resolveConfigPathCandidate()));
	const transformsDir = resolveOptionalContainedPath(path.join(configDir, "hooks", "transforms"), hooks?.transformsDir, "Hook transformsDir");
	const gmailMaxBodyBytes = resolveGmailHookMaxBodyBytes(resolveGmailHookMaxBytes(hooks?.gmail?.maxBytes));
	return mappings.map((mapping, index) => {
		const normalized = normalizeHookMapping(mapping, index, transformsDir);
		if (normalized.matchPath === "gmail") normalized.maxBodyBytes = gmailMaxBodyBytes;
		return normalized;
	});
}
async function applyHookMappings(mappings, ctx) {
	if (mappings.length === 0) return null;
	for (const mapping of mappings) {
		if (!mappingMatches(mapping, ctx)) continue;
		if (mapping.forEach) return await applyFanOutMapping(mapping, mapping.forEach, ctx);
		const single = await applyMappingToContext(mapping, ctx);
		if (!single.ok) return single;
		return {
			ok: true,
			actions: single.action ? [single.action] : [],
			fanout: false,
			dropped: 0
		};
	}
	return null;
}
async function applyMappingToContext(mapping, ctx) {
	const base = buildActionFromMapping(mapping, ctx);
	if (!base.ok) return base;
	let override = null;
	if (mapping.transform) {
		override = await (await loadTransform(mapping.transform))(ctx);
		if (override === null) return {
			ok: true,
			action: null
		};
	}
	if (!base.action) return {
		ok: true,
		action: null
	};
	return mergeAction(base.action, override, mapping.action);
}
async function applyFanOutMapping(mapping, forEachKey, ctx) {
	const raw = ctx.payload[forEachKey];
	const allItems = Array.isArray(raw) ? raw : [];
	const items = allItems.slice(0, 200);
	const actions = [];
	for (const item of items) {
		const result = await applyMappingToContext(mapping, {
			...ctx,
			payload: {
				...ctx.payload,
				[forEachKey]: [item]
			}
		});
		if (!result.ok) return result;
		if (result.action) actions.push(result.action);
	}
	return {
		ok: true,
		actions,
		fanout: true,
		dropped: allItems.length - items.length
	};
}
function normalizeHookMapping(mapping, index, transformsDir) {
	const id = normalizeOptionalString(mapping.id) || `mapping-${index + 1}`;
	const matchPath = normalizeHookMatchPath(mapping.match?.path);
	const matchSource = mapping.match?.source?.trim();
	const action = mapping.action ?? "agent";
	const wakeMode = mapping.wakeMode ?? "now";
	const forEach = normalizeForEachKey(mapping.forEach);
	const transform = mapping.transform ? {
		modulePath: resolveContainedPath(transformsDir, mapping.transform.module, "Hook transform"),
		exportName: normalizeOptionalString(mapping.transform.export)
	} : void 0;
	return {
		id,
		matchPath,
		matchSource,
		action,
		wakeMode,
		forEach,
		name: mapping.name,
		agentId: normalizeOptionalString(mapping.agentId),
		sessionKey: mapping.sessionKey,
		sessionMode: mapping.sessionMode,
		messageTemplate: mapping.messageTemplate,
		textTemplate: mapping.textTemplate,
		deliver: mapping.deliver,
		allowUnsafeExternalContent: mapping.allowUnsafeExternalContent,
		channel: mapping.channel,
		to: mapping.to,
		model: mapping.model,
		thinking: mapping.thinking,
		timeoutSeconds: mapping.timeoutSeconds,
		transform
	};
}
function normalizeForEachKey(raw) {
	const key = normalizeOptionalString(raw);
	if (!key) return;
	if (/[.[\]]/.test(key) || BLOCKED_PATH_KEYS.has(key)) throw new Error(`Hook mapping forEach must be a top-level payload key: ${raw}`);
	return key;
}
function mappingMatches(mapping, ctx) {
	if (mapping.matchPath) {
		if (mapping.matchPath !== normalizeHookMatchPath(ctx.path)) return false;
	}
	if (mapping.matchSource) {
		const source = readStringValue(ctx.payload.source);
		if (!source || source !== mapping.matchSource) return false;
	}
	return true;
}
function buildActionFromMapping(mapping, ctx) {
	if (mapping.action === "wake") {
		const text = renderTemplate(mapping.textTemplate ?? "", ctx);
		return {
			ok: true,
			action: {
				kind: "wake",
				mappingId: mapping.id,
				text,
				mode: mapping.wakeMode ?? "now",
				agentId: mapping.agentId,
				sessionKey: renderOptional(mapping.sessionKey, ctx),
				sessionKeySource: getSessionKeyTemplateSource(mapping.sessionKey)
			}
		};
	}
	const message = renderTemplate(mapping.messageTemplate ?? "", ctx);
	return {
		ok: true,
		action: {
			kind: "agent",
			mappingId: mapping.id,
			message,
			name: renderOptional(mapping.name, ctx),
			agentId: mapping.agentId,
			wakeMode: mapping.wakeMode ?? "now",
			sessionKey: renderOptional(mapping.sessionKey, ctx),
			sessionKeySource: getSessionKeyTemplateSource(mapping.sessionKey),
			sessionMode: mapping.sessionMode ?? "isolated",
			deliver: mapping.deliver,
			allowUnsafeExternalContent: mapping.allowUnsafeExternalContent,
			channel: mapping.channel,
			to: renderOptional(mapping.to, ctx),
			model: renderOptional(mapping.model, ctx),
			thinking: renderOptional(mapping.thinking, ctx),
			timeoutSeconds: mapping.timeoutSeconds
		}
	};
}
function mergeAction(base, override, defaultAction) {
	if (!override) return validateAction(base);
	if ((override.kind ?? base.kind ?? defaultAction) === "wake") {
		const baseWake = base.kind === "wake" ? base : void 0;
		const text = typeof override.text === "string" ? override.text : baseWake?.text ?? "";
		const mode = override.mode === "next-heartbeat" ? "next-heartbeat" : baseWake?.mode ?? "now";
		return validateAction({
			kind: "wake",
			mappingId: base.mappingId,
			text,
			mode,
			agentId: override.agentId ?? baseWake?.agentId,
			sessionKey: override.sessionKey ?? baseWake?.sessionKey,
			sessionKeySource: resolveMergedSessionKeySource(baseWake, override)
		});
	}
	const baseAgent = base.kind === "agent" ? base : void 0;
	const message = typeof override.message === "string" ? override.message : baseAgent?.message ?? "";
	const wakeMode = override.wakeMode === "next-heartbeat" ? "next-heartbeat" : baseAgent?.wakeMode ?? "now";
	return validateAction({
		kind: "agent",
		mappingId: base.mappingId,
		message,
		wakeMode,
		name: override.name ?? baseAgent?.name,
		agentId: override.agentId ?? baseAgent?.agentId,
		sessionKey: override.sessionKey ?? baseAgent?.sessionKey,
		sessionKeySource: resolveMergedSessionKeySource(baseAgent, override),
		sessionMode: override.sessionMode ?? baseAgent?.sessionMode ?? "isolated",
		deliver: typeof override.deliver === "boolean" ? override.deliver : baseAgent?.deliver,
		allowUnsafeExternalContent: typeof override.allowUnsafeExternalContent === "boolean" ? override.allowUnsafeExternalContent : baseAgent?.allowUnsafeExternalContent,
		channel: override.channel ?? baseAgent?.channel,
		to: override.to ?? baseAgent?.to,
		model: override.model ?? baseAgent?.model,
		thinking: override.thinking ?? baseAgent?.thinking,
		timeoutSeconds: override.timeoutSeconds ?? baseAgent?.timeoutSeconds
	});
}
function validateAction(action) {
	if (action.sessionKeySource === "templated" && !action.sessionKey?.trim()) return {
		ok: false,
		error: "hook mapping sessionKey template rendered empty"
	};
	if (action.kind === "wake") {
		if (!action.text?.trim()) return {
			ok: false,
			error: "hook mapping requires text"
		};
		if (action.mode === "next-heartbeat" && action.sessionKey) return {
			ok: false,
			error: "hook mapping sessionKey requires wakeMode=now"
		};
		return {
			ok: true,
			action
		};
	}
	if (!action.message?.trim()) return {
		ok: false,
		error: "hook mapping requires message"
	};
	if (action.sessionMode !== "isolated" && action.sessionMode !== "persistent") return {
		ok: false,
		error: "hook mapping sessionMode must be isolated or persistent"
	};
	return {
		ok: true,
		action
	};
}
function getSessionKeyTemplateSource(sessionKeyTemplate) {
	const normalizedTemplate = normalizeOptionalString(sessionKeyTemplate);
	if (!normalizedTemplate) return;
	return hasHookTemplateExpressions(normalizedTemplate) ? "templated" : "static";
}
function resolveMergedSessionKeySource(baseAction, override) {
	if (typeof override.sessionKey === "string") {
		if (!normalizeOptionalString(override.sessionKey)) return;
		return override.sessionKeySource === "static" ? "static" : "templated";
	}
	return baseAction?.sessionKeySource;
}
function hasHookTemplateExpressions(template) {
	return /\{\{\s*[^}]+\s*\}\}/.test(template);
}
async function loadTransform(transform) {
	const cacheKey = `${transform.modulePath}::${transform.exportName ?? "default"}`;
	const cached = transformCache.get(cacheKey);
	if (cached) return cached;
	const generation = transformCacheBustVersion;
	const fn = resolveTransformFn(await importFileModule({
		modulePath: transform.modulePath,
		cacheBust: true,
		nowMs: generation
	}), transform.exportName);
	if (generation === transformCacheBustVersion) transformCache.set(cacheKey, fn);
	return fn;
}
function resolveTransformFn(mod, exportName) {
	const candidate = resolveFunctionModuleExport({
		mod,
		exportName,
		fallbackExportNames: ["default", "transform"]
	});
	if (!candidate) throw new Error("hook transform module must export a function");
	return candidate;
}
function resolvePath(baseDir, target) {
	if (!target) return path.resolve(baseDir);
	return path.isAbsolute(target) ? path.resolve(target) : path.resolve(baseDir, target);
}
function safeRealpathSync(candidate) {
	try {
		const nativeRealpath = fs.realpathSync.native;
		return nativeRealpath ? nativeRealpath(candidate) : fs.realpathSync(candidate);
	} catch {
		return null;
	}
}
function resolveExistingAncestor(candidate) {
	let current = path.resolve(candidate);
	while (true) {
		if (fs.existsSync(current)) return current;
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
function resolveContainedPath(baseDir, target, label) {
	const base = path.resolve(baseDir);
	const trimmed = target?.trim();
	if (!trimmed) throw new Error(`${label} module path is required`);
	const resolved = resolvePath(base, trimmed);
	if (!isPathInside(base, resolved)) throw new Error(`${label} module path must be within ${base}: ${target}`);
	const baseRealpath = safeRealpathSync(base);
	const existingAncestor = resolveExistingAncestor(resolved);
	const existingAncestorRealpath = existingAncestor ? safeRealpathSync(existingAncestor) : null;
	if (baseRealpath && existingAncestorRealpath && !isPathInside(baseRealpath, existingAncestorRealpath)) throw new Error(`${label} module path must be within ${base}: ${target}`);
	return resolved;
}
function resolveOptionalContainedPath(baseDir, target, label) {
	const trimmed = target?.trim();
	if (!trimmed) return path.resolve(baseDir);
	return resolveContainedPath(baseDir, trimmed, label);
}
function normalizeHookMatchPath(raw) {
	if (!raw) return;
	const trimmed = raw.trim();
	if (!trimmed) return;
	return trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
}
function renderOptional(value, ctx) {
	if (!value) return;
	const rendered = renderTemplate(value, ctx).trim();
	return rendered ? rendered : void 0;
}
function renderTemplate(template, ctx) {
	if (!template) return "";
	return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, expr) => {
		const value = resolveTemplateExpr(expr.trim(), ctx);
		if (value === void 0 || value === null) return "";
		if (typeof value === "string") return value;
		if (typeof value === "number" || typeof value === "boolean") return String(value);
		return JSON.stringify(value);
	});
}
function resolveTemplateExpr(expr, ctx) {
	if (expr === "path") return ctx.path;
	if (expr === "now") return (/* @__PURE__ */ new Date()).toISOString();
	if (expr.startsWith("headers.")) return getByPath(ctx.headers, expr.slice(8));
	if (expr.startsWith("query.")) return getByPath(Object.fromEntries(ctx.url.searchParams.entries()), expr.slice(6));
	if (expr.startsWith("payload.")) return getByPath(ctx.payload, expr.slice(8));
	return getByPath(ctx.payload, expr);
}
const BLOCKED_PATH_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
function getByPath(input, pathExpr) {
	if (!pathExpr) return;
	const parts = [];
	const re = /([^.[\]]+)|(\[(\d+)\])/g;
	let match = re.exec(pathExpr);
	while (match) {
		if (match[1]) parts.push(match[1]);
		else if (match[3]) parts.push(Number(match[3]));
		match = re.exec(pathExpr);
	}
	let current = input;
	for (const part of parts) {
		if (current === null || current === void 0) return;
		if (typeof part === "number") {
			if (!Array.isArray(current)) return;
			current = current[part];
			continue;
		}
		if (BLOCKED_PATH_KEYS.has(part)) return;
		if (typeof current !== "object") return;
		current = current[part];
	}
	return current;
}
//#endregion
//#region src/gateway/hooks.ts
const DEFAULT_HOOKS_PATH = "/hooks";
const DEFAULT_HOOKS_MAX_BODY_BYTES = 262144;
const MAX_HOOK_IDEMPOTENCY_KEY_LENGTH = 256;
/** Resolve and validate hook config, returning null when hooks are disabled. */
function resolveHooksConfig(cfg) {
	if (cfg.hooks?.enabled !== true) return null;
	const token = normalizeOptionalString(cfg.hooks?.token);
	if (!token) throw new Error("hooks.enabled requires hooks.token");
	const rawPath = normalizeOptionalString(cfg.hooks?.path) || DEFAULT_HOOKS_PATH;
	const withSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
	const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
	if (trimmed === "/") throw new Error("hooks.path may not be '/'");
	const mappings = resolveHookMappings(cfg.hooks);
	const defaultAgentId = tryResolveAgentOperationAgentId(cfg);
	const globalSessionStoreOwner = cfg.session?.scope === "global" ? resolvePersistedSessionStoreOwnerForKey(cfg, "global") : { kind: "none" };
	const knownAgentIds = resolveKnownAgentIds(cfg, defaultAgentId);
	const allowedAgentIds = resolveAllowedAgentIds(cfg.hooks?.allowedAgentIds);
	const defaultSessionKey = resolveSessionKey(cfg.hooks?.defaultSessionKey);
	const allowedSessionKeyPrefixes = resolveAllowedSessionKeyPrefixes(cfg.hooks?.allowedSessionKeyPrefixes);
	if (defaultSessionKey && allowedSessionKeyPrefixes && !isSessionKeyAllowedByPrefix(defaultSessionKey, allowedSessionKeyPrefixes)) throw new Error("hooks.defaultSessionKey must match hooks.allowedSessionKeyPrefixes");
	if (!defaultSessionKey && allowedSessionKeyPrefixes && !isSessionKeyAllowedByPrefix("hook:example", allowedSessionKeyPrefixes)) throw new Error("hooks.allowedSessionKeyPrefixes must include 'hook:' when hooks.defaultSessionKey is unset");
	if (hasEffectiveTemplatedHookSessionKeyMapping(mappings) && !allowedSessionKeyPrefixes) throw new Error("hooks.allowedSessionKeyPrefixes is required when a hook mapping sessionKey uses templates, even if hooks.allowRequestSessionKey=true");
	return {
		basePath: trimmed,
		token,
		maxBodyBytes: DEFAULT_HOOKS_MAX_BODY_BYTES,
		maxBodyBytesByPath: resolveHookBodyLimitsByPath(mappings),
		mappings,
		agentPolicy: {
			defaultAgentId,
			globalSessionStoreOwner,
			knownAgentIds,
			allowedAgentIds
		},
		sessionPolicy: {
			defaultSessionKey,
			allowRequestSessionKey: cfg.hooks?.allowRequestSessionKey === true,
			allowedSessionKeyPrefixes
		}
	};
}
function commitHooksConfigReload() {
	commitHookTransformMappingReload();
}
function resolveHookBodyLimitsByPath(mappings) {
	const byPath = /* @__PURE__ */ new Map();
	for (const mapping of mappings) {
		if (!mapping.matchPath || !mapping.maxBodyBytes) continue;
		const current = byPath.get(mapping.matchPath) ?? DEFAULT_HOOKS_MAX_BODY_BYTES;
		byPath.set(mapping.matchPath, Math.max(current, mapping.maxBodyBytes));
	}
	return byPath;
}
/** Resolve the body byte bound for one hook sub-path (mapping-derived, floored at the default). */
function resolveHookPathBodyLimit(hooksConfig, subPath) {
	const normalized = normalizeHookMatchPath(subPath);
	if (!normalized) return hooksConfig.maxBodyBytes;
	return hooksConfig.maxBodyBytesByPath.get(normalized) ?? hooksConfig.maxBodyBytes;
}
function resolveKnownAgentIds(cfg, defaultAgentId) {
	const known = new Set(listAgentIds(cfg));
	if (defaultAgentId) known.add(defaultAgentId);
	return known;
}
function resolveSessionKey(raw) {
	return normalizeOptionalString(raw);
}
function normalizeSessionKeyPrefix(raw) {
	const value = normalizeLowercaseStringOrEmpty(raw);
	return value ? value : void 0;
}
function resolveAllowedSessionKeyPrefixes(raw) {
	if (!Array.isArray(raw)) return;
	const set = /* @__PURE__ */ new Set();
	for (const prefix of raw) {
		const normalized = normalizeSessionKeyPrefix(prefix);
		if (!normalized) continue;
		set.add(normalized);
	}
	return set.size > 0 ? Array.from(set) : void 0;
}
/** Check whether a hook session key satisfies the configured prefix allowlist. */
function isSessionKeyAllowedByPrefix(sessionKey, prefixes) {
	const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!normalized) return false;
	return prefixes.some((prefix) => normalized.startsWith(prefix));
}
/** Extract the hook bearer token from Authorization or x-openclaw-token headers. */
function extractHookToken(req) {
	const auth = normalizeOptionalString(req.headers.authorization) ?? "";
	if (normalizeLowercaseStringOrEmpty(auth).startsWith("bearer ")) {
		const token = auth.slice(7).trim();
		if (token) return token;
	}
	const headerToken = normalizeOptionalString(req.headers["x-openclaw-token"]) ?? "";
	if (headerToken) return headerToken;
}
/** Read and normalize a hook JSON request body with gateway-friendly error text. */
async function readJsonBody(req, maxBytes) {
	const result = await readJsonBodyWithLimit(req, {
		maxBytes,
		emptyObjectOnEmpty: true,
		destroyOnLimit: false
	});
	if (result.ok) return result;
	if (result.code === "PAYLOAD_TOO_LARGE") return {
		ok: false,
		error: "payload too large"
	};
	if (result.code === "REQUEST_BODY_TIMEOUT") return {
		ok: false,
		error: "request body timeout"
	};
	if (result.code === "CONNECTION_CLOSED") return {
		ok: false,
		error: requestBodyErrorToText("CONNECTION_CLOSED")
	};
	return {
		ok: false,
		error: result.error
	};
}
/** Normalize request headers into lowercase string values for hook template matching. */
function normalizeHookHeaders(req) {
	const headers = {};
	for (const [key, value] of Object.entries(req.headers)) {
		const normalizedKey = normalizeLowercaseStringOrEmpty(key);
		if (typeof value === "string") headers[normalizedKey] = value;
		else if (Array.isArray(value) && value.length > 0) headers[normalizedKey] = value.join(", ");
	}
	return headers;
}
function normalizeHookPayloadAgentId(raw) {
	if (raw === void 0) return {
		ok: true,
		value: void 0
	};
	const agentId = typeof raw === "string" ? normalizeOptionalString(raw) : void 0;
	return agentId ? {
		ok: true,
		value: agentId
	} : {
		ok: false,
		error: "agentId must be a non-empty string"
	};
}
/** Validate a hook wake payload. */
function normalizeWakePayload(payload) {
	const normalizedText = normalizeOptionalString(payload.text) ?? "";
	if (!normalizedText) return {
		ok: false,
		error: "text required"
	};
	const mode = payload.mode === "next-heartbeat" ? "next-heartbeat" : "now";
	const agentId = normalizeHookPayloadAgentId(payload.agentId);
	if (!agentId.ok) return agentId;
	const sessionKey = normalizeOptionalString(payload.sessionKey);
	if (payload.sessionKey !== void 0 && !sessionKey) return {
		ok: false,
		error: "sessionKey must be a non-empty string"
	};
	if (mode === "next-heartbeat" && sessionKey) return {
		ok: false,
		error: "sessionKey requires mode=now"
	};
	return {
		ok: true,
		value: {
			text: normalizedText,
			mode,
			...agentId.value ? { agentId: agentId.value } : {},
			...sessionKey ? { sessionKey } : {}
		}
	};
}
const listHookChannelValues = () => ["last", ...listChannelPlugins().map((plugin) => plugin.id)];
/** Channel values accepted by hook agent dispatch. */
const getHookChannelSet = () => new Set(listHookChannelValues());
/** Render the current hook channel validation error from registered channel plugins. */
const getHookChannelError = () => `channel must be ${listHookChannelValues().join("|")}`;
/** Resolve a raw hook channel value, defaulting omitted values to `last`. */
function resolveHookChannel(raw) {
	if (raw === void 0) return "last";
	if (typeof raw !== "string") return null;
	const normalized = normalizeMessageChannel(raw);
	if (!normalized || !getHookChannelSet().has(normalized)) return null;
	return normalized;
}
/** Resolve hook delivery opt-out; any value except false means deliver. */
function resolveHookDeliver(raw) {
	return raw !== false;
}
/** Normalize webhook delivery intent before any isolated cron work is scheduled. */
function normalizeHookAgentDelivery(params) {
	const deliver = resolveHookDeliver(params.deliver);
	if (!deliver) return {
		ok: true,
		value: {
			deliver,
			channel: "last",
			to: void 0,
			accountId: void 0,
			delivery: { mode: "none" }
		}
	};
	const to = normalizeOptionalString(params.to);
	const accountId = normalizeOptionalString(params.accountId);
	const channel = resolveHookChannel(params.channel);
	if (!channel) return {
		ok: false,
		error: getHookChannelError()
	};
	const hasChannel = params.channel !== void 0;
	const hasTo = params.to !== void 0;
	const hasAccountId = params.accountId !== void 0;
	if (!hasChannel && !hasTo && !hasAccountId) return {
		ok: true,
		value: {
			deliver,
			channel,
			to,
			accountId,
			delivery: { mode: "none" }
		}
	};
	if (hasTo && !to) return {
		ok: false,
		error: "to must be a non-empty string for hook delivery"
	};
	if (hasAccountId && !accountId) return {
		ok: false,
		error: "accountId must be a non-empty string for hook delivery"
	};
	if (hasAccountId && (!hasChannel || !to)) return {
		ok: false,
		error: "accountId requires channel and to for hook delivery"
	};
	if (!hasChannel || !to) return {
		ok: false,
		error: "channel and to must be set together for hook delivery"
	};
	if (channel === "last") return {
		ok: false,
		error: "channel must name a concrete channel for hook delivery"
	};
	return {
		ok: true,
		value: {
			deliver,
			channel,
			to,
			accountId,
			delivery: {
				mode: "announce",
				channel,
				to,
				...accountId ? { accountId } : {}
			}
		}
	};
}
function resolveOptionalHookIdempotencyKey(raw) {
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.length > MAX_HOOK_IDEMPOTENCY_KEY_LENGTH) return;
	return trimmed;
}
/** Resolve the hook idempotency key from headers or payload within length limits. */
function resolveHookIdempotencyKey(params) {
	return resolveOptionalHookIdempotencyKey(params.headers?.["idempotency-key"]) || resolveOptionalHookIdempotencyKey(params.headers?.["x-openclaw-idempotency-key"]) || resolveOptionalHookIdempotencyKey(params.payload.idempotencyKey);
}
/** Resolve an optional config-mapped target to a known agent or the configured default. */
function resolveHookTargetAgentId(hooksConfig, agentId) {
	const raw = normalizeOptionalString(agentId);
	if (!raw) return;
	const normalized = normalizeAgentId(raw);
	return hooksConfig.agentPolicy.knownAgentIds.has(normalized) ? normalized : hooksConfig.agentPolicy.defaultAgentId;
}
/** Resolve request or config-mapped agent selection against durable session ownership. */
function resolveEffectiveHookTargetAgentId(hooksConfig, agentId, source) {
	const raw = normalizeOptionalString(agentId);
	let selectedAgentId = source === "mapping" ? resolveHookTargetAgentId(hooksConfig, agentId) : void 0;
	if (source === "request" && raw) {
		const normalized = normalizeAgentIdStrict(raw);
		if (!normalized.ok) return {
			ok: false,
			code: "unknown-agent",
			agentId: raw,
			error: `unknown agentId "${raw}"`
		};
		if (hooksConfig.agentPolicy.knownAgentIds.has(normalized.value)) selectedAgentId = normalized.value;
		else return {
			ok: false,
			code: "unknown-agent",
			agentId: normalized.value,
			error: `unknown agentId "${normalized.value}"`
		};
	}
	const resolvedAgentId = selectedAgentId ?? hooksConfig.agentPolicy.defaultAgentId;
	const persistedOwner = hooksConfig.agentPolicy.globalSessionStoreOwner;
	if (persistedOwner.kind === "retired") return {
		ok: false,
		code: "owner-retired",
		ownerAgentId: persistedOwner.agentId,
		error: `global session-store owner "${persistedOwner.agentId}" is no longer configured; restore that agent or update agents.defaults.sessionStore.agentId`
	};
	if (persistedOwner.kind === "configured" && selectedAgentId && selectedAgentId !== persistedOwner.agentId) return {
		ok: false,
		code: "owner-conflict",
		agentId: selectedAgentId,
		ownerAgentId: persistedOwner.agentId,
		error: `agentId "${selectedAgentId}" conflicts with global session-store owner "${persistedOwner.agentId}"; use agentId "${persistedOwner.agentId}" or update agents.defaults.sessionStore.agentId`
	};
	const effectiveAgentId = persistedOwner.kind === "configured" ? persistedOwner.agentId : resolvedAgentId;
	if (!effectiveAgentId) return {
		ok: false,
		code: "agent-required",
		error: getHookAgentSelectionError()
	};
	return {
		ok: true,
		...selectedAgentId ? { selectedAgentId } : {},
		effectiveAgentId
	};
}
/** Check the hook agent allowlist against the effective target agent. */
function isHookAgentAllowed(hooksConfig, effectiveAgentId) {
	const allowed = hooksConfig.agentPolicy.allowedAgentIds;
	if (allowed === void 0) return true;
	return allowed.has(effectiveAgentId);
}
/** Error message for hook agent allowlist failures. */
const getHookAgentPolicyError = () => "agentId is not allowed by hooks.allowedAgentIds";
const getHookAgentSelectionError = () => "agentId is required when multiple agents are configured";
const getHookSessionKeyRequestPolicyError = () => "sessionKey is disabled for externally supplied hook payload values; set hooks.allowRequestSessionKey=true to enable";
/** Error message for hook session-key prefix allowlist failures. */
const getHookSessionKeyPrefixError = (prefixes) => `sessionKey must start with one of: ${prefixes.join(", ")}`;
/** Resolve the hook dispatch session key from request, mapping, default, or generated id. */
function resolveHookSessionKey(params) {
	const requested = resolveSessionKey(params.sessionKey);
	if (requested) {
		if ((params.source === "request" || params.source === "mapping-templated") && !params.hooksConfig.sessionPolicy.allowRequestSessionKey) return {
			ok: false,
			error: getHookSessionKeyRequestPolicyError()
		};
		const allowedPrefixes = params.hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
		if (allowedPrefixes && !isSessionKeyAllowedByPrefix(requested, allowedPrefixes)) return {
			ok: false,
			error: getHookSessionKeyPrefixError(allowedPrefixes)
		};
		return {
			ok: true,
			value: requested
		};
	}
	const defaultSessionKey = params.hooksConfig.sessionPolicy.defaultSessionKey;
	if (defaultSessionKey) return {
		ok: true,
		value: defaultSessionKey
	};
	const generated = `hook:${(params.idFactory ?? randomUUID)()}`;
	const allowedPrefixes = params.hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
	if (allowedPrefixes && !isSessionKeyAllowedByPrefix(generated, allowedPrefixes)) return {
		ok: false,
		error: getHookSessionKeyPrefixError(allowedPrefixes)
	};
	return {
		ok: true,
		value: generated
	};
}
function hasTemplatedHookSessionKey(sessionKey) {
	return typeof sessionKey === "string" && hasHookTemplateExpressions(sessionKey);
}
function hasEffectiveTemplatedHookSessionKeyMapping(mappings) {
	const effectiveMappings = [];
	for (const mapping of mappings) {
		if (isHookMappingShadowed(mapping, effectiveMappings)) continue;
		effectiveMappings.push(mapping);
		if (hasTemplatedHookSessionKey(mapping.sessionKey)) return true;
	}
	return false;
}
function isHookMappingShadowed(mapping, earlierMappings) {
	return earlierMappings.some((earlier) => {
		if (earlier.matchPath && earlier.matchPath !== mapping.matchPath) return false;
		return !earlier.matchSource || earlier.matchSource === mapping.matchSource;
	});
}
/** Re-scope agent-prefixed hook session keys to the selected target agent. */
function normalizeHookDispatchSessionKey(params) {
	const trimmed = normalizeOptionalString(params.sessionKey) ?? "";
	if (!trimmed || !params.targetAgentId) return trimmed;
	const parsed = parseAgentSessionKey(trimmed);
	if (!parsed) return trimmed;
	return `agent:${normalizeAgentId(params.targetAgentId)}:${parsed.rest}`;
}
/** Validate and normalize a hook agent payload before policy/session resolution. */
function normalizeAgentPayload(payload) {
	const message = normalizeOptionalString(payload.message) ?? "";
	if (!message) return {
		ok: false,
		error: "message required"
	};
	const nameRaw = payload.name;
	const name = normalizeOptionalString(nameRaw) ?? "Hook";
	const agentId = normalizeHookPayloadAgentId(payload.agentId);
	if (!agentId.ok) return agentId;
	const idempotencyKey = resolveOptionalHookIdempotencyKey(payload.idempotencyKey);
	const wakeMode = payload.wakeMode === "next-heartbeat" ? "next-heartbeat" : "now";
	const sessionKeyRaw = payload.sessionKey;
	const sessionKey = normalizeOptionalString(sessionKeyRaw);
	const sessionModeRaw = payload.sessionMode;
	if (sessionModeRaw !== void 0 && sessionModeRaw !== "isolated" && sessionModeRaw !== "persistent") return {
		ok: false,
		error: "sessionMode must be isolated or persistent"
	};
	const sessionMode = sessionModeRaw ?? "isolated";
	const delivery = normalizeHookAgentDelivery({
		deliver: payload.deliver,
		channel: payload.channel,
		to: payload.to,
		accountId: payload.accountId
	});
	if (!delivery.ok) return delivery;
	const modelRaw = payload.model;
	const model = normalizeOptionalString(modelRaw);
	if (modelRaw !== void 0 && !model) return {
		ok: false,
		error: "model required"
	};
	const thinkingRaw = payload.thinking;
	const thinking = normalizeOptionalString(thinkingRaw);
	const timeoutRaw = payload.timeoutSeconds;
	const timeoutSeconds = typeof timeoutRaw === "number" && Number.isFinite(timeoutRaw) && timeoutRaw > 0 ? Math.floor(timeoutRaw) : void 0;
	return {
		ok: true,
		value: {
			message,
			name,
			agentId: agentId.value,
			idempotencyKey,
			wakeMode,
			sessionKey,
			sessionMode,
			...delivery.value,
			model,
			thinking,
			timeoutSeconds
		}
	};
}
//#endregion
export { resolveHookPathBodyLimit as _, getHookSessionKeyPrefixError as a, applyHookMappings as b, normalizeAgentPayload as c, normalizeWakePayload as d, readJsonBody as f, resolveHookIdempotencyKey as g, resolveHookDeliver as h, getHookChannelError as i, normalizeHookDispatchSessionKey as l, resolveHookChannel as m, extractHookToken as n, isHookAgentAllowed as o, resolveEffectiveHookTargetAgentId as p, getHookAgentPolicyError as r, isSessionKeyAllowedByPrefix as s, commitHooksConfigReload as t, normalizeHookHeaders as u, resolveHookSessionKey as v, resolveHooksConfig as y };
