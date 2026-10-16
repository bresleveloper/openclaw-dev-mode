import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { f as getOpenClawSystemUpdateKind } from "./messages-CeqAykcC.mjs";
import "./internal-runtime-context-CAWYwg4i.mjs";
import { a as buildSystemUpdateMessage } from "./runtime-context-prompt-CKrto4c6.mjs";
import { SYSTEM_PROMPT_CACHE_BOUNDARY, splitSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
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
	const { buildEmbeddedSystemPrompt } = await import("./system-prompt-Bv6sWng3.mjs");
	let renderedSkillsPrompt = "";
	const baseSystemPrompt = buildEmbeddedSystemPrompt({
		...params.embeddedSystemPrompt,
		onRenderedSkillsPrompt: (skillsPrompt) => {
			renderedSkillsPrompt = skillsPrompt;
			params.embeddedSystemPrompt.onRenderedSkillsPrompt?.(skillsPrompt);
		}
	});
	const transformedSystemPrompt = params.isRawModelRun ? "" : params.transformProviderSystemPrompt({
		provider: params.providerTransform.provider,
		config: params.providerTransform.config,
		workspaceDir: params.providerTransform.workspaceDir,
		context: {
			...params.providerTransform.context,
			systemPrompt: baseSystemPrompt
		}
	});
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
	const after = promptSections(current);
	return [...[...after].flatMap(([heading, section]) => before.get(heading) === section ? [] : [section]), ...[...before.keys()].flatMap((heading) => after.has(heading) ? [] : [`${heading}\n(removed)`])];
}
/** Restore only a matching effective prompt; a changed restart input begins a fresh series. */
function prepareSessionSystemPrompt(params) {
	const { permissionNotice, systemPrompt: prompt } = extractAttemptPermissionNotice(params.systemPrompt);
	const split = splitSystemPromptCacheBoundary(prompt);
	const renderedPrefix = split?.stablePrefix ?? prompt;
	const historyId = params.entries.findLast((entry) => entry.type === "compaction" || entry.type === "reset")?.id ?? null;
	const markerIndex = params.entries.findLastIndex((entry) => entry.type === "custom" && entry.customType === "openclaw.system-prompt");
	const afterCheckpoint = params.entries.slice(markerIndex + 1);
	const orphanedUpdate = !params.state.pendingSystemPrompt && afterCheckpoint.some((entry) => getOpenClawSystemUpdateKind(entry) === "prompt-update");
	if (orphanedUpdate) {
		params.state.systemPrompt = void 0;
		params.state.persistedSystemPrompt = void 0;
	}
	let series = params.state.pendingSystemPrompt ?? params.state.systemPrompt;
	if (!series && !orphanedUpdate && (!params.state.systemPromptRouteKey || params.state.systemPromptRouteKey === params.routeKey)) {
		const entry = params.entries[markerIndex];
		const data = entry?.type === "custom" ? entry.data : void 0;
		if (isRecord(data) && typeof data.prefix === "string" && data.hash === sha256Hex(data.prefix) && data.renderedPrefix === renderedPrefix && data.routeKey === params.routeKey && data.historyId === historyId && !afterCheckpoint.some((later) => later.type === "model_change")) {
			series = {
				prefix: data.prefix,
				hash: data.hash,
				renderedPrefix,
				routeKey: params.routeKey,
				historyId,
				permissionNotice: typeof data.permissionNotice === "string" ? data.permissionNotice : void 0,
				restart: false
			};
			params.state.persistedSystemPrompt = JSON.stringify(series);
		}
	}
	const restart = !series || series.routeKey !== params.routeKey || series.historyId !== historyId;
	const sections = !restart && series ? promptDelta(series.renderedPrefix, renderedPrefix) : [];
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
		systemPrompt: split ? `${next.prefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${split.dynamicSuffix}` : next.prefix,
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
	state.persistedSystemPrompt = void 0;
	state.systemPromptRouteKey = routeKey;
	await appendEntry("openclaw.system-prompt", {
		restart: true,
		routeKey
	});
}
async function persistSessionSystemPrompt(state, appendEntry) {
	const snapshot = state.pendingSystemPrompt ?? state.systemPrompt;
	if (!snapshot) return;
	const fingerprint = JSON.stringify({
		...snapshot,
		restart: false
	});
	if (snapshot.restart || state.persistedSystemPrompt !== fingerprint) try {
		await appendEntry("openclaw.system-prompt", snapshot);
	} catch (error) {
		state.systemPrompt = void 0;
		state.persistedSystemPrompt = void 0;
		throw error;
	}
	state.persistedSystemPrompt = fingerprint;
	state.systemPrompt = {
		...snapshot,
		restart: false
	};
	state.pendingSystemPrompt = void 0;
}
const MAX_SESSION_PROMPT_STATES = 64;
const MAX_ACTIVE_PROJECT_KEYS = 4;
const sessionPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionPromptStates"), () => /* @__PURE__ */ new Map());
const sessionActiveProjects = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionActiveProjects"), () => /* @__PURE__ */ new Map());
function createToolResultPromptProjectionState() {
	return {
		replacements: /* @__PURE__ */ new Map(),
		frozen: /* @__PURE__ */ new Set(),
		ambiguousBaseKeys: /* @__PURE__ */ new Set(),
		sourceHashByKey: /* @__PURE__ */ new Map(),
		restoredCacheTtl: /* @__PURE__ */ new Map()
	};
}
function cloneToolResultPromptProjectionState(state) {
	return {
		replacements: new Map(state.replacements),
		frozen: new Set(state.frozen),
		ambiguousBaseKeys: new Set(state.ambiguousBaseKeys),
		sourceHashByKey: new Map(state.sourceHashByKey),
		restoredCacheTtl: new Map(state.restoredCacheTtl),
		lastWrittenSnapshotHash: state.lastWrittenSnapshotHash
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
/** TTL trims are re-derived; ordinary trims retain only text, never images or tool metadata. */
function serializeCacheTtlToolResultProjections(state) {
	const marks = new Map(state.restoredCacheTtl);
	for (const [key, projection] of state.replacements) if (projection.cacheTtl === "soft") marks.set(key, { mode: "soft" });
	else if (projection.cacheTtl === "hard") {
		const placeholder = projection.content.flatMap((block) => block.type === "text" ? [block.text] : []).join("\n");
		marks.set(key, {
			mode: "hard",
			placeholder
		});
	}
	return {
		prunedToolResults: [...marks].map(([key, mark]) => Object.assign({ key }, mark)),
		ambiguousToolResultBaseKeys: [...state.ambiguousBaseKeys],
		frozenToolResults: [...state.sourceHashByKey].flatMap(([key, sourceHash]) => {
			if (!state.frozen.has(key)) return [];
			const projection = state.replacements.get(key);
			return [{
				key,
				sourceHash,
				...!projection?.cacheTtl && projection ? { texts: projection.content.flatMap((block) => block.type === "text" ? [block.text] : []) } : {}
			}];
		})
	};
}
function getEmbeddedSessionPromptState(sessionId) {
	const existing = sessionPromptStates.get(sessionId);
	if (existing) {
		sessionPromptStates.delete(sessionId);
		sessionPromptStates.set(sessionId, existing);
		return existing;
	}
	const created = {
		activeAttempts: 0,
		toolResults: createToolResultPromptProjectionState()
	};
	sessionPromptStates.set(sessionId, created);
	for (const [key, state] of sessionPromptStates) {
		if (sessionPromptStates.size <= MAX_SESSION_PROMPT_STATES) break;
		if (key !== sessionId && state.activeAttempts === 0) sessionPromptStates.delete(key);
	}
	return created;
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
function hashToolResultProjectionSnapshot(snapshot) {
	return sha256Hex(JSON.stringify(snapshot));
}
async function persistToolResultProjections(state, appendEntry) {
	if (state.frozen.size === 0) return;
	const snapshot = serializeCacheTtlToolResultProjections(state);
	const hash = hashToolResultProjectionSnapshot(snapshot);
	if (hash === state.lastWrittenSnapshotHash) return;
	await appendEntry("openclaw.cache-ttl", snapshot);
	state.lastWrittenSnapshotHash = hash;
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
export { getEmbeddedSessionPromptState as a, persistToolResultProjections as c, recordRuntimeContextProjection as d, recordToolResultPromptProjection as f, buildAttemptSystemPrompt as g, serializeCacheTtlToolResultProjections as h, createToolResultPromptProjectionState as i, prepareEmbeddedSessionActiveProjectKeys as l, retireSessionSystemPrompt as m, clearEmbeddedSessionPromptStates as n, hashToolResultProjectionSnapshot as o, retainEmbeddedSessionPromptState as p, cloneToolResultPromptProjectionState as r, persistSessionSystemPrompt as s, beginSessionSystemPrompt as t, prepareSessionSystemPrompt as u };
