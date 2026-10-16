import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { q as buildPluginAgentTurnPrepareContext } from "./runtime-D4MkflNJ.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-sCRI4mq1.mjs";
import { n as resolvePromptInjectionAllowed } from "./hook-policy-decisions-DL3kOjGW.mjs";
import { a as resolveSessionEntryAccessTarget, s as updateResolvedSessionEntry } from "./session-accessor.entry-Di4jQk7u.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/host-hook-state.ts
const log = createSubsystemLogger("plugins/host-hook-state");
const MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH = 32768;
const MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH = 512;
const MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION = 32;
function isPluginNextTurnInjectionPlacement(value) {
	return value === "prepend_context" || value === "append_context";
}
function isPluginNextTurnInjectionRecord(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.pluginId === "string" && typeof candidate.text === "string" && typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt) && isPluginNextTurnInjectionPlacement(candidate.placement) && (candidate.ttlMs === void 0 || typeof candidate.ttlMs === "number" && Number.isFinite(candidate.ttlMs) && candidate.ttlMs >= 0) && (candidate.idempotencyKey === void 0 || typeof candidate.idempotencyKey === "string");
}
function isExpired(entry, now) {
	if (!isPluginNextTurnInjectionRecord(entry)) return true;
	return entry.ttlMs !== void 0 && now - entry.createdAt > entry.ttlMs;
}
function toPluginNextTurnInjectionRecord(params) {
	return {
		id: params.injection.idempotencyKey?.trim() || randomUUID(),
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		text: params.injection.text,
		idempotencyKey: params.injection.idempotencyKey?.trim() || void 0,
		placement: params.injection.placement ?? "prepend_context",
		ttlMs: params.injection.ttlMs,
		createdAt: params.now,
		metadata: params.injection.metadata
	};
}
async function enqueuePluginNextTurnInjection(params) {
	const sessionKey = normalizeOptionalString(params.injection.sessionKey) ?? "";
	if (!sessionKey) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const text = normalizeOptionalString(params.injection.text);
	if (!text || text.length > MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH || params.injection.metadata !== void 0 && !isPluginJsonValue(params.injection.metadata) || params.injection.idempotencyKey !== void 0 && (typeof params.injection.idempotencyKey !== "string" || params.injection.idempotencyKey.trim().length === 0 || params.injection.idempotencyKey.length > MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH) || params.injection.placement !== void 0 && !isPluginNextTurnInjectionPlacement(params.injection.placement) || params.injection.ttlMs !== void 0 && (!Number.isFinite(params.injection.ttlMs) || params.injection.ttlMs < 0)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const now = params.now ?? Date.now();
	const record = toPluginNextTurnInjectionRecord({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		injection: {
			...params.injection,
			sessionKey,
			text
		},
		now
	});
	const scope = {
		cfg: params.cfg,
		sessionKey,
		agentId: params.injection.agentId
	};
	const updated = await updateResolvedSessionEntry(scope, (entry) => {
		const injections = { ...entry.pluginNextTurnInjections };
		const rawExisting = injections[params.pluginId];
		const existing = (Array.isArray(rawExisting) ? rawExisting : []).filter((candidate) => !isExpired(candidate, now));
		const duplicate = record.idempotencyKey ? existing.find((candidate) => candidate.idempotencyKey === record.idempotencyKey) : void 0;
		const enqueued = !duplicate && existing.length < MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION;
		injections[params.pluginId] = enqueued ? [...existing, record] : existing;
		entry.pluginNextTurnInjections = injections;
		if (enqueued) entry.updatedAt = now;
		return {
			enqueued,
			id: duplicate?.id ?? record.id
		};
	});
	if (!updated.found) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	return {
		...updated.result,
		sessionKey: updated.canonicalKey
	};
}
async function drainPluginNextTurnInjections(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return [];
	const scope = {
		cfg: params.cfg,
		sessionKey,
		agentId: params.agentId
	};
	const { entry: selectedEntry } = resolveSessionEntryAccessTarget(scope);
	if (!selectedEntry?.pluginNextTurnInjections || Object.keys(selectedEntry.pluginNextTurnInjections).length === 0) return [];
	const target = resolveSessionEntryAccessTarget(scope, { keyFormat: "agent-qualified" });
	const now = params.now ?? Date.now();
	const updated = await updateResolvedSessionEntry(scope, (entry) => {
		if (!entry?.pluginNextTurnInjections) return [];
		const activePluginIds = new Set((getPluginRegistryForContext()?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id));
		const drained = [];
		for (const [pluginId, entries] of Object.entries(entry.pluginNextTurnInjections)) {
			if (!activePluginIds.has(pluginId) || !resolvePromptInjectionAllowed(params.cfg.plugins?.entries?.[pluginId]?.hooks)) continue;
			if (!Array.isArray(entries)) continue;
			const liveEntries = entries.filter((candidate) => !isExpired(candidate, now));
			drained.push(...liveEntries);
		}
		drained.sort((left, right) => left.createdAt - right.createdAt);
		delete entry.pluginNextTurnInjections;
		if (drained.length > 0) entry.updatedAt = now;
		return drained;
	}, { target });
	return updated.found ? updated.result : [];
}
async function drainPluginNextTurnInjectionContext(params) {
	const queuedInjections = await drainPluginNextTurnInjections(params);
	return {
		queuedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections })
	};
}
function getPluginSessionExtensionStateSync(params) {
	const pluginId = params.pluginId.trim();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!pluginId || !sessionKey) return;
	const value = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey,
		agentId: params.agentId
	}).entry?.pluginExtensions?.[pluginId];
	return value ? structuredClone(value) : void 0;
}
async function patchPluginSessionExtension(params) {
	const namespace = params.namespace.trim();
	const pluginId = params.pluginId.trim();
	if (!pluginId || !namespace) return {
		ok: false,
		error: "pluginId and namespace are required"
	};
	if (params.unset === true && params.value !== void 0) return {
		ok: false,
		error: "plugin session extension cannot specify both unset and value"
	};
	if (params.value !== void 0 && !isPluginJsonValue(params.value)) return {
		ok: false,
		error: "plugin session extension value must be JSON-compatible"
	};
	if (params.unset !== true && params.value === void 0) return {
		ok: false,
		error: "plugin session extension value is required unless unset is true"
	};
	const nextPluginValue = params.value;
	const registration = (getPluginRegistryForContext()?.sessionExtensions ?? []).find((entry) => entry.pluginId === pluginId && entry.extension.namespace === namespace);
	if (!registration) return {
		ok: false,
		error: `unknown plugin session extension: ${pluginId}/${namespace}`
	};
	const rawSlotKey = normalizeOptionalString(registration.extension.sessionEntrySlotKey);
	const normalizedSlotKey = rawSlotKey ? normalizeSessionEntrySlotKey(rawSlotKey) : void 0;
	if (normalizedSlotKey?.ok === false) log.warn(`plugin session extension slot promotion skipped for ${pluginId}/${namespace}: ${normalizedSlotKey.error}`);
	const slotKey = normalizedSlotKey?.ok === true ? normalizedSlotKey.key : void 0;
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, (entry, context) => {
		params.assertCurrent?.();
		const entryRecord = entry;
		const pluginExtensions = { ...entry.pluginExtensions };
		const pluginState = { ...pluginExtensions[pluginId] };
		if (params.unset === true) delete pluginState[namespace];
		else pluginState[namespace] = structuredClone(nextPluginValue);
		if (Object.keys(pluginState).length > 0) pluginExtensions[pluginId] = pluginState;
		else delete pluginExtensions[pluginId];
		if (Object.keys(pluginExtensions).length > 0) entry.pluginExtensions = pluginExtensions;
		else delete entry.pluginExtensions;
		const storedSlotKeys = { ...entry.pluginExtensionSlotKeys };
		const pluginSlotKeys = { ...storedSlotKeys[pluginId] };
		const previousSlotKey = normalizeSessionEntrySlotKey(pluginSlotKeys[namespace]);
		if (previousSlotKey.ok && previousSlotKey.key !== slotKey) delete entryRecord[previousSlotKey.key];
		if (slotKey && params.unset !== true) pluginSlotKeys[namespace] = slotKey;
		else delete pluginSlotKeys[namespace];
		if (Object.keys(pluginSlotKeys).length > 0) storedSlotKeys[pluginId] = pluginSlotKeys;
		else delete storedSlotKeys[pluginId];
		if (Object.keys(storedSlotKeys).length > 0) entry.pluginExtensionSlotKeys = storedSlotKeys;
		else delete entry.pluginExtensionSlotKeys;
		if (slotKey) {
			const projected = projectSessionExtensionValue({
				pluginId: registration.pluginId,
				namespace: registration.extension.namespace,
				project: registration.extension.project,
				sessionKey: context.canonicalKey,
				sessionId: entry.sessionId,
				state: params.unset === true ? void 0 : nextPluginValue
			});
			if (projected === void 0) delete entryRecord[slotKey];
			else entryRecord[slotKey] = projected;
		}
		entry.updatedAt = Date.now();
		return pluginState[namespace];
	});
	if (!updated.found) return {
		ok: false,
		error: `unknown session key: ${params.sessionKey}`
	};
	return {
		ok: true,
		key: updated.canonicalKey,
		value: updated.result
	};
}
function projectPluginSessionExtensionsSync(params) {
	const extensions = getPluginRegistryForContext()?.sessionExtensions ?? [];
	if (extensions.length === 0) return [];
	const projections = [];
	for (const registration of extensions) {
		const state = params.entry.pluginExtensions?.[registration.pluginId]?.[registration.extension.namespace];
		const projected = projectSessionExtensionValue({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			project: registration.extension.project,
			sessionKey: params.sessionKey,
			sessionId: params.entry.sessionId,
			state
		});
		if (projected !== void 0) projections.push({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			value: projected
		});
	}
	return projections;
}
function projectSessionExtensionValue(params) {
	if (params.state === void 0) return;
	let projected;
	try {
		projected = params.project ? params.project({
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			state: params.state
		}) : params.state;
	} catch (error) {
		log.warn(`plugin session extension projection failed: plugin=${params.pluginId} namespace=${params.namespace} error=${String(error)}`);
		return;
	}
	if (isPromiseLike(projected)) {
		Promise.resolve(projected).catch(() => void 0);
		return;
	}
	return isPluginJsonValue(projected) ? structuredClone(projected) : void 0;
}
//#endregion
export { projectPluginSessionExtensionsSync as a, patchPluginSessionExtension as i, enqueuePluginNextTurnInjection as n, getPluginSessionExtensionStateSync as r, drainPluginNextTurnInjectionContext as t };
