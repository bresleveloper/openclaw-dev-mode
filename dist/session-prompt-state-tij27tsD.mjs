import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { i as gateAgentToolExecution } from "./agent-tool-availability-DZN62JsD.mjs";
import { i as copyAgentToolMetadata } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { f as getOpenClawSystemUpdateKind } from "./messages-Cdi_z_94.mjs";
import "./internal-runtime-context-DLJtDQoI.mjs";
import { a as serializeCacheTtlToolResultProjections, r as prepareCacheTtlCheckpoint } from "./session-actor-bounded-history-BC9AvmFD.mjs";
import { o as buildSystemUpdateMessage } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { SYSTEM_PROMPT_CACHE_BOUNDARY, splitSystemPromptCacheBoundary, stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/agents/embedded-agent-runner/run/attempt-system-prompt.ts
const ATTEMPT_PROMPT_SECTION = /<!-- openclaw:attempt:(STABLE|DYNAMIC|PERMISSION) -->[\s\S]*?<!-- \/openclaw:attempt:\1 -->/g;
function renderAttemptPromptSection(section, text) {
	return `<!-- openclaw:attempt:${section} -->\n${text}\n<!-- /openclaw:attempt:${section} -->`;
}
function extractAttemptPermissionNotice(systemPrompt) {
	const permission = /\n*<!-- openclaw:attempt:PERMISSION -->\n([\s\S]*?)\n<!-- \/openclaw:attempt:PERMISSION -->/;
	return {
		permissionNotice: systemPrompt.match(permission)?.[1],
		systemPrompt: systemPrompt.replace(permission, "")
	};
}
/**
* Builds the embedded system prompt and applies provider-specific transforms
* unless this is a raw model run. Raw runs still keep `baseSystemPrompt` for
* diagnostics/cache boundaries, but submit an empty provider prompt.
*/
async function buildAttemptSystemPrompt(params) {
	const { buildConfiguredAgentSystemPrompt } = await import("./system-prompt-config-CIW2iq6V.mjs");
	let renderedSkillsPrompt = "";
	const baseSystemPrompt = buildConfiguredAgentSystemPrompt({
		...params.embeddedSystemPrompt,
		onRenderedSkillsPrompt: (skillsPrompt) => {
			renderedSkillsPrompt = skillsPrompt;
			params.embeddedSystemPrompt.onRenderedSkillsPrompt?.(skillsPrompt);
		}
	});
	const transformedSystemPrompt = params.isRawModelRun ? "" : params.transformSystemPrompt(baseSystemPrompt);
	const splitPrompt = splitSystemPromptCacheBoundary(transformedSystemPrompt);
	const stablePrompt = renderAttemptPromptSection("STABLE", splitPrompt?.stablePrefix ?? transformedSystemPrompt);
	const dynamicPrompt = splitPrompt ? renderAttemptPromptSection("DYNAMIC", splitPrompt.dynamicSuffix) : "";
	return {
		baseSystemPrompt,
		systemPrompt: params.isRawModelRun ? "" : splitPrompt ? `${stablePrompt}${SYSTEM_PROMPT_CACHE_BOUNDARY}${dynamicPrompt}` : stablePrompt,
		skillsPrompt: params.isRawModelRun ? "" : renderedSkillsPrompt,
		refreshSystemPrompt: (currentSystemPrompt, permissionNotice) => {
			if (params.isRawModelRun) return currentSystemPrompt;
			const nextNotice = permissionNotice ? renderAttemptPromptSection("PERMISSION", permissionNotice) : void 0;
			let replacedNotice = false;
			const refreshed = currentSystemPrompt.replace(ATTEMPT_PROMPT_SECTION, (_match, section) => {
				if (section === "PERMISSION") {
					replacedNotice = true;
					return nextNotice ?? _match;
				}
				return section === "STABLE" ? stablePrompt : dynamicPrompt;
			});
			return replacedNotice || !nextNotice ? refreshed : `${refreshed}\n\n${nextNotice}`;
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/session-prompt-state.ts
/** Transcript-backed prompt projection state cached by an embedded session lifecycle. */
function describeTool(tool) {
	return {
		name: tool.name,
		description: tool.description,
		parameters: tool.parameters
	};
}
function sameToolDefinition(left, right) {
	return right !== void 0 && left.description === right.description && stableStringify(left.parameters) === stableStringify(right.parameters);
}
/**
* The session pins every tool definition it has sent, so a turn that builds fewer
* tools keeps the provider prefix: retained definitions refuse their calls. New or
* changed definitions extend the pin once and are written with the next checkpoint.
*/
function prepareSessionToolSurface(params) {
	const historyId = params.entries.findLast((entry) => entry.type === "compaction" || entry.type === "reset")?.id ?? null;
	const restored = () => {
		const markerIndex = params.entries.findLastIndex((entry) => entry.type === "custom" && entry.customType === "openclaw.system-prompt");
		const entry = params.entries[markerIndex];
		const data = entry?.type === "custom" ? entry.data : void 0;
		return isRecord(data) && Array.isArray(data.tools) && data.routeKey === params.routeKey && data.historyId === historyId && data.toolPolicy === params.toolPolicy && !params.entries.slice(markerIndex + 1).some((later) => later.type === "model_change") ? {
			routeKey: params.routeKey,
			historyId,
			toolPolicy: params.toolPolicy,
			tools: data.tools
		} : void 0;
	};
	const candidate = params.state.pendingToolSurface ?? params.state.toolSurface ?? restored();
	const known = candidate?.routeKey === params.routeKey && candidate.historyId === historyId && candidate.toolPolicy === params.toolPolicy ? candidate : void 0;
	params.state.toolSurface = params.state.pendingToolSurface ? params.state.toolSurface : known;
	const pinned = new Map(known?.tools.map((tool) => [tool.name, tool]));
	const tools = params.tools.map((tool) => {
		const pin = pinned.get(tool.name);
		return pin && pin.description !== tool.description && stableStringify(pin.parameters) === stableStringify(tool.parameters) ? copyAgentToolMetadata(tool, {
			...tool,
			description: pin.description
		}) : tool;
	});
	const current = tools.map(describeTool);
	const built = new Set(current.map((tool) => tool.name));
	const retained = [...pinned.values()].filter((tool) => !built.has(tool.name));
	if (!known || current.some((tool) => !sameToolDefinition(tool, pinned.get(tool.name)))) params.state.pendingToolSurface = {
		routeKey: params.routeKey,
		historyId,
		toolPolicy: params.toolPolicy,
		tools: [...current, ...retained].toSorted((a, b) => a.name.localeCompare(b.name))
	};
	return [...tools, ...retained.map((tool) => gateAgentToolExecution({
		...tool,
		label: tool.name,
		execute: async () => ({
			content: [],
			details: {}
		})
	}, `${tool.name} is not available in this turn. Do not retry ${tool.name}.`))];
}
/** Unsent preparation belongs to its attempt; an incapable route rebuilds the full prompt. */
function beginSessionSystemPrompt(params) {
	params.state.pendingSystemPrompt = void 0;
	if (params.enabled) return false;
	params.state.systemPrompt = void 0;
	params.state.systemPromptRouteKey = params.routeKey;
	const previous = params.entries.findLast((entry) => entry.type === "custom" && entry.customType === "openclaw.system-prompt");
	return previous?.type === "custom" && isRecord(previous.data) && previous.data.routeKey !== params.routeKey;
}
function promptSections(text) {
	const sections = /* @__PURE__ */ new Map();
	for (const section of text.split(/(?=^## )/m)) {
		const lineEnd = section.indexOf("\n");
		const heading = section.startsWith("## ") ? section.slice(0, lineEnd < 0 ? section.length : lineEnd) : "";
		sections.set(heading, (sections.get(heading) ?? "") + section);
	}
	return sections;
}
function promptDelta(previous, current) {
	const before = promptSections(previous);
	const sections = [];
	for (const [heading, section] of promptSections(current)) {
		if (before.get(heading) !== section) sections.push(section);
		before.delete(heading);
	}
	for (const heading of before.keys()) sections.push(`${heading}\n(removed)`);
	return sections;
}
/** Restore the admitted series; refreshed instructions append after its conversation prefix. */
function prepareSessionSystemPrompt(params) {
	const { permissionNotice, systemPrompt: renderedPrefix } = extractAttemptPermissionNotice(params.systemPrompt);
	const historyId = params.entries.findLast((entry) => entry.type === "compaction" || entry.type === "reset")?.id ?? null;
	const markerIndex = params.entries.findLastIndex((entry) => entry.type === "custom" && entry.customType === "openclaw.system-prompt");
	const afterCheckpoint = params.entries.slice(markerIndex + 1);
	const orphanedUpdate = !params.state.pendingSystemPrompt && afterCheckpoint.some((entry) => getOpenClawSystemUpdateKind(entry) === "prompt-update");
	if (orphanedUpdate) params.state.systemPrompt = void 0;
	let series = params.state.pendingSystemPrompt ?? params.state.systemPrompt;
	if (!series && !orphanedUpdate && (!params.state.systemPromptRouteKey || params.state.systemPromptRouteKey === params.routeKey)) {
		const entry = params.entries[markerIndex];
		const data = entry?.type === "custom" ? entry.data : void 0;
		if (isRecord(data) && typeof data.prefix === "string" && data.hash === sha256Hex(data.prefix) && typeof data.renderedPrefix === "string" && data.routeKey === params.routeKey && data.historyId === historyId && !afterCheckpoint.some((later) => later.type === "model_change")) {
			series = {
				prefix: data.prefix,
				hash: data.hash,
				renderedPrefix: data.renderedPrefix,
				routeKey: params.routeKey,
				historyId,
				permissionNotice: typeof data.permissionNotice === "string" ? data.permissionNotice : void 0,
				restart: false
			};
			params.state.systemPrompt = series;
		}
	}
	const restart = !series || series.routeKey !== params.routeKey || series.historyId !== historyId;
	const sections = !restart && series && series.renderedPrefix !== renderedPrefix ? promptDelta(stripSystemPromptCacheBoundary(series.renderedPrefix), stripSystemPromptCacheBoundary(renderedPrefix)) : [];
	if (permissionNotice && (restart || permissionNotice !== series?.permissionNotice)) sections.push(permissionNotice);
	const next = restart ? {
		prefix: renderedPrefix,
		hash: sha256Hex(renderedPrefix),
		renderedPrefix,
		routeKey: params.routeKey,
		historyId,
		permissionNotice,
		restart: true
	} : {
		...series,
		renderedPrefix,
		permissionNotice,
		restart: false
	};
	let committed = false;
	return {
		systemPrompt: next.prefix,
		update: sections.length ? buildSystemUpdateMessage(restart ? sections.join("\n\n") : `System prompt update. The sections below replace their earlier versions; everything else in the system prompt is unchanged.\n\n${sections.join("\n\n")}`, "prompt-update", false) : void 0,
		restart,
		commit: (restartRecorded = false) => {
			if (committed) return;
			committed = true;
			params.state.pendingSystemPrompt = restartRecorded ? {
				...next,
				restart: false
			} : next;
			params.state.systemPromptRouteKey = params.routeKey;
		}
	};
}
/** Invalidate before the write so an interrupted retirement cannot revive cached overrides. */
async function retireSessionSystemPrompt(state, routeKey, appendEntry) {
	state.systemPrompt = void 0;
	state.pendingSystemPrompt = void 0;
	state.systemPromptRouteKey = routeKey;
	await appendEntry("openclaw.system-prompt", {
		restart: true,
		routeKey
	});
}
async function persistSessionSystemPrompt(state, appendEntry) {
	const snapshot = state.pendingSystemPrompt ?? state.systemPrompt;
	if (!snapshot) return;
	const previous = state.systemPrompt;
	const candidate = state.pendingToolSurface ?? state.toolSurface;
	const toolSurface = candidate?.routeKey === snapshot.routeKey && candidate.historyId === snapshot.historyId ? candidate : void 0;
	if (state.pendingToolSurface || snapshot.restart || !previous || snapshot.prefix !== previous.prefix || snapshot.renderedPrefix !== previous.renderedPrefix || snapshot.routeKey !== previous.routeKey || snapshot.historyId !== previous.historyId || snapshot.permissionNotice !== previous.permissionNotice) try {
		await appendEntry("openclaw.system-prompt", toolSurface ? {
			...snapshot,
			toolPolicy: toolSurface.toolPolicy,
			tools: toolSurface.tools
		} : snapshot);
	} catch (error) {
		state.systemPrompt = void 0;
		state.toolSurface = void 0;
		throw error;
	}
	state.systemPrompt = {
		...snapshot,
		restart: false
	};
	state.pendingSystemPrompt = void 0;
	state.toolSurface = toolSurface;
	state.pendingToolSurface = void 0;
}
/** Routes without the prompt series checkpoint the tool pin alone. */
async function persistSessionToolSurface(state, appendEntry) {
	const surface = state.pendingToolSurface;
	if (!surface) return;
	await appendEntry("openclaw.system-prompt", surface);
	state.toolSurface = surface;
	state.pendingToolSurface = void 0;
}
const MAX_SESSION_PROMPT_STATES = 64;
const MAX_ACTIVE_PROJECT_KEYS = 4;
const sessionPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionPromptStates"), () => /* @__PURE__ */ new Map());
const sessionActiveProjects = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionActiveProjects"), () => /* @__PURE__ */ new Map());
function createToolResultPromptProjectionState(source) {
	return {
		replacements: new Map(source?.replacements),
		frozen: new Set(source?.frozen),
		ambiguousBaseKeys: new Set(source?.ambiguousBaseKeys),
		sourceHashByKey: new Map(source?.sourceHashByKey),
		restoredCacheTtl: new Map(source?.restoredCacheTtl),
		...source ? { cacheTtlCheckpoint: source.cacheTtlCheckpoint } : {}
	};
}
function recordToolResultPromptProjection(state, key, message, cacheTtl = state.replacements.get(key)?.cacheTtl) {
	state.replacements.set(key, {
		cacheTtl,
		content: cacheTtl ? message.content : message.content.flatMap((block) => isRecord(block) && block.type === "text" && typeof block.text === "string" ? [{
			type: "text",
			text: block.text
		}] : [])
	});
}
function getEmbeddedSessionPromptState(sessionId) {
	const existing = sessionPromptStates.get(sessionId);
	const current = existing ?? {
		activeAttempts: 0,
		toolResults: createToolResultPromptProjectionState()
	};
	sessionPromptStates.delete(sessionId);
	sessionPromptStates.set(sessionId, current);
	if (existing) return current;
	for (const [key, state] of sessionPromptStates) {
		if (sessionPromptStates.size <= MAX_SESSION_PROMPT_STATES) break;
		if (key !== sessionId && state.activeAttempts === 0) sessionPromptStates.delete(key);
	}
	return current;
}
/** Overlapping cleanup keeps the next attempt's state until its own settlement. */
function retainEmbeddedSessionPromptState(sessionId) {
	const state = getEmbeddedSessionPromptState(sessionId);
	state.activeAttempts++;
	let active = true;
	return {
		state,
		[Symbol.dispose]() {
			if (!active) return;
			active = false;
			if (--state.activeAttempts === 0 && sessionPromptStates.get(sessionId) === state) sessionPromptStates.delete(sessionId);
		}
	};
}
function recordRuntimeContextProjection(sessionId, removed, converted) {
	const state = getEmbeddedSessionPromptState(sessionId);
	const keys = removed?.map((message, index) => `${index}:${message.timestamp}`);
	const positions = converted.flatMap((message, index) => message.role === "user" && message.runtimeContextCarrier ? [index] : []);
	const changed = keys?.some((key) => !state.removedRuntimeContextKeys?.has(key)) || state.runtimeContextCarrierPositions?.some((position, index) => positions[index] !== position);
	if (keys) state.removedRuntimeContextKeys = new Set(keys);
	state.runtimeContextCarrierPositions = positions;
	return Boolean(changed);
}
async function persistToolResultProjections(state, appendEntry, cacheTouch) {
	const snapshot = serializeCacheTtlToolResultProjections(state);
	const previous = state.cacheTtlCheckpoint;
	if (previous === void 0 && !cacheTouch && !snapshot.prunedToolResults.length && !snapshot.frozenToolResults.length && !snapshot.ambiguousToolResultBaseKeys.length) return;
	const { marker, checkpoint } = prepareCacheTtlCheckpoint(snapshot, previous ?? void 0);
	if (!marker && !cacheTouch) return;
	let committedCheckpoint = null;
	try {
		await appendEntry("openclaw.cache-ttl", {
			...cacheTouch,
			...marker
		});
		committedCheckpoint = checkpoint;
	} finally {
		state.cacheTtlCheckpoint = committedCheckpoint;
	}
}
/** Records the prepared repository identity and snapshots this session's LRU active set. */
function prepareEmbeddedSessionActiveProjectKeys(sessionId, projectKey) {
	const keys = sessionActiveProjects.get(sessionId) ?? [];
	sessionActiveProjects.delete(sessionId);
	sessionActiveProjects.set(sessionId, keys);
	pruneMapToMaxSize(sessionActiveProjects, MAX_SESSION_PROMPT_STATES);
	if (projectKey) {
		const existing = keys.indexOf(projectKey);
		if (existing >= 0) keys.splice(existing, 1);
		keys.unshift(projectKey);
		keys.length = Math.min(keys.length, MAX_ACTIVE_PROJECT_KEYS);
	}
	return [...keys];
}
function clearEmbeddedSessionPromptStates(sessionIds) {
	for (const sessionId of sessionIds) {
		const normalized = sessionId?.trim();
		if (normalized) {
			sessionPromptStates.delete(normalized);
			sessionActiveProjects.delete(normalized);
		}
	}
}
//#endregion
export { persistSessionToolSurface as a, prepareSessionSystemPrompt as c, recordToolResultPromptProjection as d, retainEmbeddedSessionPromptState as f, persistSessionSystemPrompt as i, prepareSessionToolSurface as l, buildAttemptSystemPrompt as m, clearEmbeddedSessionPromptStates as n, persistToolResultProjections as o, retireSessionSystemPrompt as p, createToolResultPromptProjectionState as r, prepareEmbeddedSessionActiveProjectKeys as s, beginSessionSystemPrompt as t, recordRuntimeContextProjection as u };
