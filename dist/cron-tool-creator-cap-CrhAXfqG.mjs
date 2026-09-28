import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import { o as expandPolicyWithPluginGroups, r as buildPluginToolGroups } from "./tool-policy-YDdaK0oX.mjs";
import { i as readCronScheduledToolProjection } from "./exec-tool-target-pinning-s_GhmaTA.mjs";
//#region src/agents/tools/cron-tool-creator-cap.ts
/**
* Closed core-owned vocabulary a CLI backend may project its native tools into.
* Anything else is a backend contract bug and fails closed at capture time so a
* raw harness tool name can never become a persisted cron capability.
*/
const NATIVE_CRON_CREATOR_CAPABILITIES = /* @__PURE__ */ new Set([
	"read",
	"write",
	"edit",
	"apply_patch",
	"exec",
	"process",
	"web_search",
	"web_fetch"
]);
/** Fails closed on any backend-projected name outside the exact canonical vocabulary. */
function assertNativeCronCreatorCapabilities(names) {
	for (const name of names) if (!NATIVE_CRON_CREATOR_CAPABILITIES.has(name)) throw new Error(`cron creator authority rejected non-canonical native capability ${JSON.stringify(name)}`);
}
const CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE = "Retry from a fresh authenticated direct-local operator turn, or create/edit via the CLI or Gateway with an explicit finite toolsAllow list containing only currently visible tools; no automation changes were saved.";
const INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE = `Configured MCP authority is unavailable because this turn did not capture the complete model-callable tool surface. ${CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE}`;
/** No capture marker means this runtime has no deferred configured-MCP surface. */
function isCronCreatorToolCaptureComplete(captureRef) {
	return captureRef === void 0 || captureRef.value?.source === "final-executable-surface";
}
function assertInheritedCronToolCaptureReady(value, captureRef) {
	if ((isRecord(value) && isRecord(value.payload) ? value.payload : void 0)?.toolsAllowIsDefault !== true || isCronCreatorToolCaptureComplete(captureRef)) return;
	throw new Error(INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE);
}
function replaceWithEffectiveCronCreatorToolAllowlist(target, tools, toolMeta, options = {}) {
	target.length = 0;
	const captured = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		const projection = readCronScheduledToolProjection(tool);
		const name = normalizeToolPolicyName(projection ? projection.targetTool : tool.name);
		if (!name) continue;
		const aliasName = projection ? normalizeToolPolicyName(tool.name) : void 0;
		const existing = captured.get(name);
		if (existing !== void 0) {
			if (aliasName && !existing.aliasName) existing.aliasName = aliasName;
			if (existing.execTarget && !projection?.execTarget) delete existing.execTarget;
			else if (existing.execTarget?.ask === "always" && projection?.execTarget?.ask !== "always") delete existing.execTarget.ask;
			continue;
		}
		const meta = toolMeta?.(tool);
		const pluginId = typeof meta?.pluginId === "string" ? normalizeToolPolicyName(meta.pluginId) : void 0;
		captured.set(name, {
			name,
			...pluginId ? { pluginId } : {},
			...aliasName && aliasName !== name ? { aliasName } : {},
			...projection?.execTarget ? { execTarget: { ...projection.execTarget } } : {}
		});
	}
	assertNativeCronCreatorCapabilities(options.canonicalToolNames ?? []);
	for (const name of options.canonicalToolNames ?? []) {
		if (captured.has(name)) continue;
		captured.set(name, name === "exec" && options.nativeExecTarget ? {
			name,
			execTarget: { ...options.nativeExecTarget }
		} : { name });
	}
	target.push(...captured.values());
}
/** Records the creator cap only after every runtime policy and schema quarantine has run. */
function captureFinalEffectiveCronCreatorToolAllowlist(target, captureRef, tools, toolMeta, options = {}) {
	replaceWithEffectiveCronCreatorToolAllowlist(target, tools, toolMeta, options);
	captureRef.value = {
		version: 1,
		source: "final-executable-surface"
	};
}
function normalizeCronCreatorToolsAllow(values) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of values) {
		const tool = typeof entry === "string" ? { name: entry } : entry;
		const name = normalizeToolPolicyName(tool.name);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		const pluginId = typeof tool.pluginId === "string" ? normalizeToolPolicyName(tool.pluginId) : void 0;
		const aliasName = typeof tool.aliasName === "string" ? normalizeToolPolicyName(tool.aliasName) : void 0;
		const execTarget = tool.execTarget?.host === "gateway" ? {
			host: "gateway",
			...tool.execTarget.ask === "always" ? { ask: "always" } : {}
		} : void 0;
		normalized.push({
			name,
			...pluginId ? { pluginId } : {},
			...aliasName && aliasName !== name ? { aliasName } : {},
			...execTarget ? { execTarget } : {}
		});
	}
	return normalized;
}
/** Restrict-only exec target present only when the creator's exec grant is host-pinned. */
function resolveCronCreatorExecToolTarget(entries) {
	const execEntry = normalizeCronCreatorToolsAllow(entries ?? []).find((tool) => tool.name === "exec");
	return execEntry?.execTarget ? { ...execEntry.execTarget } : void 0;
}
function hasCronTriggerScript(value) {
	return isRecord(value) && typeof value.script === "string" && value.script.trim().length > 0;
}
function classifyExplicitToolsAllow(payload) {
	if (!payload || !Object.hasOwn(payload, "toolsAllow")) return "absent";
	if (!Array.isArray(payload.toolsAllow)) return "resolved";
	const values = payload.toolsAllow.filter((entry) => typeof entry === "string");
	if (values.length === 0) return "empty";
	return values.some((entry) => {
		const normalized = normalizeToolPolicyName(entry);
		return normalized === "*" || normalized.startsWith("group:");
	}) ? "resolved" : "finite";
}
function explicitFiniteToolsNeedResolution(payload, creatorToolAllowlist) {
	if (classifyExplicitToolsAllow(payload) !== "finite") return false;
	const toolsAllow = payload?.toolsAllow;
	if (!Array.isArray(toolsAllow)) return false;
	const creatorNames = new Set(normalizeCronCreatorToolsAllow(creatorToolAllowlist ?? []).flatMap((tool) => tool.aliasName ? [tool.name, tool.aliasName] : [tool.name]));
	return expandToolGroups(toolsAllow.filter((entry) => typeof entry === "string")).some((name) => !creatorNames.has(name));
}
/** Whether an add needs the creator's complete authority rather than an explicit empty cap. */
function cronCreateRequiresCreatorAuthority(value, creatorToolAllowlist) {
	if (!isRecord(value)) return false;
	const payload = isRecord(value.payload) ? value.payload : void 0;
	const explicitToolsAllow = classifyExplicitToolsAllow(payload);
	if (explicitToolsAllow === "empty") return false;
	if (explicitToolsAllow === "finite") return explicitFiniteToolsNeedResolution(payload, creatorToolAllowlist);
	return hasCronTriggerScript(value.trigger) || payload?.kind === "agentTurn" || payload?.kind === "script" || explicitToolsAllow === "resolved";
}
function capCronJobToolsAllow(params) {
	const writesToolsAllow = Object.hasOwn(params.payload, "toolsAllow");
	if (params.payload.kind !== "agentTurn" && params.payload.kind !== "script" && !hasCronTriggerScript(params.trigger) && !writesToolsAllow) return;
	const creatorToolsAllow = normalizeCronCreatorToolsAllow(params.creatorToolAllowlist);
	const creatorToolNames = creatorToolsAllow.map((tool) => tool.name);
	const requestedRaw = Object.hasOwn(params.payload, "toolsAllow") ? params.payload.toolsAllow : params.defaultToolsAllow;
	if (!Array.isArray(requestedRaw)) {
		params.payload.toolsAllow = creatorToolNames;
		params.payload.toolsAllowIsDefault = true;
		return;
	}
	const requestedToolsAllow = expandToolGroups(requestedRaw.filter((entry) => typeof entry === "string"));
	if (requestedToolsAllow.includes("*")) {
		params.payload.toolsAllow = creatorToolNames;
		params.payload.toolsAllowIsDefault = true;
		return;
	}
	if (requestedToolsAllow.length === 0 || creatorToolsAllow.length === 0) {
		params.payload.toolsAllow = [];
		delete params.payload.toolsAllowIsDefault;
		return;
	}
	const pluginGroups = buildPluginToolGroups({
		tools: creatorToolsAllow,
		toolMeta: (tool) => tool.pluginId ? { pluginId: tool.pluginId } : void 0
	});
	const requestedPolicy = expandPolicyWithPluginGroups({ allow: requestedToolsAllow }, pluginGroups);
	const matches = createToolPolicyMatcher(requestedPolicy);
	params.payload.toolsAllow = creatorToolsAllow.filter((tool) => matches(tool.name) || tool.aliasName !== void 0 && matches(tool.aliasName)).map((tool) => tool.name);
	delete params.payload.toolsAllowIsDefault;
}
function capCronJobToolsAllowOnCreate(value, creatorToolAllowlist) {
	if (!isRecord(value) || !isRecord(value.payload)) return;
	if (!creatorToolAllowlist) return;
	capCronJobToolsAllow({
		payload: value.payload,
		trigger: value.trigger,
		creatorToolAllowlist
	});
}
function readCronPayloadKind(value) {
	return isRecord(value) && typeof value.kind === "string" ? value.kind : void 0;
}
/** Purely derives the agent-tool patch; current job state is requested only when required. */
function planCronJobUpdatePatch(params) {
	const patch = structuredClone(params.patch);
	const payload = isRecord(patch.payload) ? patch.payload : void 0;
	const explicitPayloadKind = readCronPayloadKind(payload);
	const explicitToolsAllow = classifyExplicitToolsAllow(payload);
	if (payload === void 0 && !Object.hasOwn(patch, "trigger")) return {
		kind: "ready",
		patch
	};
	if (explicitPayloadKind !== void 0 && explicitToolsAllow === "absent" && params.creatorAuthorityComplete !== false && !params.creatorToolAllowlist && !Object.hasOwn(patch, "trigger")) return {
		kind: "ready",
		patch
	};
	if (params.creatorAuthorityComplete === false && explicitFiniteToolsNeedResolution(payload, params.creatorToolAllowlist)) return { kind: "needs-creator-authority" };
	if (params.creatorToolAllowlist && (explicitToolsAllow === "empty" || explicitToolsAllow === "finite") && explicitPayloadKind !== void 0) {
		capCronJobToolsAllow({
			payload,
			trigger: patch.trigger,
			creatorToolAllowlist: params.creatorToolAllowlist
		});
		return {
			kind: "ready",
			patch
		};
	}
	if (!params.currentJob) return { kind: "needs-current-job" };
	const existingPayload = params.currentJob.payload;
	const existingPayloadRecord = isRecord(existingPayload) ? existingPayload : void 0;
	const existingPayloadKind = readCronPayloadKind(existingPayload);
	const payloadKind = explicitPayloadKind ?? readCronPayloadKind(existingPayload);
	if (payload && payloadKind !== void 0) {
		payload.kind = payloadKind;
		patch.payload = payload;
	}
	const trigger = Object.hasOwn(patch, "trigger") ? patch.trigger : params.currentJob.trigger;
	const startsToolPayload = explicitPayloadKind !== void 0 && explicitPayloadKind !== existingPayloadKind && (payloadKind === "agentTurn" || payloadKind === "script");
	const startsToolTrigger = Object.hasOwn(patch, "trigger") && hasCronTriggerScript(trigger) && !hasCronTriggerScript(params.currentJob.trigger);
	const reusesDefaultAuthority = explicitToolsAllow === "absent" && (startsToolPayload || startsToolTrigger) && (existingPayloadRecord?.toolsAllowIsDefault === true || !Array.isArray(existingPayloadRecord?.toolsAllow));
	const needsResolvedAuthority = explicitToolsAllow === "resolved" || reusesDefaultAuthority || explicitFiniteToolsNeedResolution(payload, params.creatorToolAllowlist);
	if (needsResolvedAuthority && params.creatorAuthorityComplete === false) return { kind: "needs-creator-authority" };
	if (!needsResolvedAuthority && (explicitToolsAllow === "empty" || explicitToolsAllow === "finite") && params.creatorToolAllowlist) {
		capCronJobToolsAllow({
			payload,
			trigger,
			creatorToolAllowlist: params.creatorToolAllowlist
		});
		return {
			kind: "ready",
			patch
		};
	}
	if (!needsResolvedAuthority || !params.creatorToolAllowlist) return {
		kind: "ready",
		patch
	};
	const nextPayload = payload ?? {};
	if (payloadKind !== void 0) nextPayload.kind = payloadKind;
	patch.payload = nextPayload;
	capCronJobToolsAllow({
		payload: nextPayload,
		trigger,
		creatorToolAllowlist: params.creatorToolAllowlist,
		defaultToolsAllow: existingPayloadRecord && existingPayloadRecord.toolsAllowIsDefault !== true ? existingPayloadRecord.toolsAllow : void 0
	});
	return {
		kind: "ready",
		patch
	};
}
//#endregion
export { assertNativeCronCreatorCapabilities as a, cronCreateRequiresCreatorAuthority as c, replaceWithEffectiveCronCreatorToolAllowlist as d, resolveCronCreatorExecToolTarget as f, assertInheritedCronToolCaptureReady as i, isCronCreatorToolCaptureComplete as l, INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE as n, capCronJobToolsAllowOnCreate as o, NATIVE_CRON_CREATOR_CAPABILITIES as r, captureFinalEffectiveCronCreatorToolAllowlist as s, CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE as t, planCronJobUpdatePatch as u };
