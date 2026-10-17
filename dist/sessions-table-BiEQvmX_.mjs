import { r as splitGraphemes } from "./ansi-BeFJ0Uu7.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./defaults-Jag53zwP.mjs";
import { c as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-DKlQ1p0S.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import { o as normalizeStoredOverrideModel, r as resolvePersistedSelectedModelRef } from "./model-selection-D3_rVb38.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { a as sessionEntryForkedFromParent } from "./session-entry-lineage-Dms9xZt1.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
//#region src/commands/sessions-display-model.ts
function resolveSessionDisplayDefaults(cfg, agentId) {
	const primary = (agentId ? resolveAgentModelPrimaryValue(resolveAgentConfig(cfg, agentId)?.model) : void 0) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-6-astra";
	return parseModelRef(primary, "openai", {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) ?? {
		provider: "openai",
		model: "gpt-6-astra"
	};
}
function normalizeCliRuntimeDisplayRef(cfg, agentId, ref, defaultRef, classifyCliProvider) {
	if (!classifyCliProvider(ref.provider)) return ref;
	const parsed = parseModelRef(ref.model, defaultRef.provider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
	if (ref.model.includes("/") && parsed) {
		if (!classifyCliProvider(parsed.provider)) return parsed;
	}
	const inferredProvider = inferUniqueProviderFromConfiguredModels({
		cfg,
		model: ref.model,
		agentId
	});
	if (inferredProvider && !classifyCliProvider(inferredProvider)) return {
		provider: inferredProvider,
		model: ref.model
	};
	if (parsed && !classifyCliProvider(parsed.provider)) return parsed;
	return {
		provider: defaultRef.provider || ref.provider,
		model: parsed?.model || ref.model
	};
}
/** Resolves provider/model display metadata for a session row. */
function resolveSessionDisplayModelRef(cfg, row, classifyCliProvider = (provider) => isCliProvider(provider, cfg), ownerAgentId) {
	const agentId = ownerAgentId ?? (row.key.startsWith("agent:") ? row.key.split(":")[1] : void 0);
	const defaultRef = resolveSessionDisplayDefaults(cfg, agentId);
	const normalizedOverride = normalizeStoredOverrideModel({
		providerOverride: row.providerOverride,
		modelOverride: row.modelOverride
	});
	const persistedRef = resolvePersistedSelectedModelRef({
		defaultProvider: defaultRef.provider,
		runtimeProvider: row.modelProvider,
		runtimeModel: row.model,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
	if (!persistedRef) return defaultRef;
	return normalizedOverride.modelOverride ? persistedRef : normalizeCliRuntimeDisplayRef(cfg, agentId, persistedRef, defaultRef, classifyCliProvider);
}
//#endregion
//#region src/commands/sessions-table.ts
/**
* Shared table formatting helpers for session commands.
*
* Cleanup and listing share display labels; terminal-core owns column layout.
*/
function toSessionDisplayRow(key, entry) {
	const updatedAt = entry?.updatedAt ?? null;
	return {
		key,
		updatedAt,
		ageMs: updatedAt ? Date.now() - updatedAt : null,
		sessionId: entry?.sessionId,
		spawnedBy: entry?.spawnedBy,
		spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
		spawnedCwd: entry?.spawnedCwd,
		parentSessionKey: entry?.parentSessionKey,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope,
		sessionStartedAt: entry?.sessionStartedAt,
		lastInteractionAt: entry?.lastInteractionAt,
		label: entry?.label,
		color: entry?.color,
		status: entry?.status,
		visibility: entry?.visibility ?? "shared",
		createdActor: entry?.createdActor,
		owner: entry?.owner,
		participants: entry?.participants,
		participantCount: entry?.participantCount,
		systemSent: entry?.systemSent,
		abortedLastRun: entry?.abortedLastRun,
		thinkingLevel: entry?.thinkingLevel,
		verboseLevel: entry?.verboseLevel,
		traceLevel: entry?.traceLevel,
		reasoningLevel: entry?.reasoningLevel,
		elevatedLevel: entry?.elevatedLevel,
		responseUsage: entry?.responseUsage,
		groupActivation: entry?.groupActivation,
		inputTokens: entry?.inputTokens,
		outputTokens: entry?.outputTokens,
		totalTokens: entry?.totalTokens,
		totalTokensFresh: entry?.totalTokensFresh,
		totalTokensVersion: entry?.totalTokensVersion,
		model: entry?.model,
		modelProvider: entry?.modelProvider,
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride,
		contextTokens: entry?.contextTokens
	};
}
function toSessionDisplayRows(store) {
	return Object.entries(store).map(([key, entry]) => toSessionDisplayRow(key, entry)).toSorted((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
function truncateSessionKey(key) {
	const graphemes = splitGraphemes(key);
	if (graphemes.length <= 26) return key;
	return `${graphemes.slice(0, 16).join("")}...${graphemes.slice(-6).join("")}`;
}
function formatSessionKeyCell(key, rich) {
	const label = truncateSessionKey(sanitizeTerminalText(key));
	return rich ? theme.accent(label) : label;
}
function formatSessionAgeCell(updatedAt, rich) {
	const ageLabel = updatedAt ? formatTimeAgo(Date.now() - updatedAt) : "unknown";
	return rich ? theme.muted(ageLabel) : ageLabel;
}
function formatSessionModelCell(model, rich) {
	const label = sanitizeTerminalText(model ?? "unknown");
	return rich ? theme.info(label) : label;
}
function formatSessionActor(actor) {
	return actor.label?.trim() || actor.id?.trim() || actor.type;
}
function formatSessionFlagsCell(row, rich) {
	const owner = row.owner?.actor ?? row.createdActor;
	const participants = (row.participants ?? []).slice(0, 4).map(({ identity, label }) => label?.trim() || `${identity.type}:${identity.id}`);
	const remainingParticipants = Math.max(0, (row.participantCount ?? participants.length) - participants.length);
	const participantSummary = participants.length > 0 ? `${participants.join(",")}${remainingParticipants > 0 ? `,+${remainingParticipants}` : ""}` : void 0;
	const flags = [
		row.thinkingLevel ? `think:${row.thinkingLevel}` : null,
		row.verboseLevel ? `verbose:${row.verboseLevel}` : null,
		row.traceLevel ? `trace:${row.traceLevel}` : null,
		row.reasoningLevel ? `reasoning:${row.reasoningLevel}` : null,
		row.elevatedLevel ? `elev:${row.elevatedLevel}` : null,
		row.responseUsage ? `usage:${row.responseUsage}` : null,
		row.groupActivation ? `activation:${row.groupActivation}` : null,
		row.systemSent ? "system" : null,
		row.abortedLastRun ? "aborted" : null,
		row.visibility ? `visibility:${row.visibility}` : null,
		owner ? `owner:${formatSessionActor(owner)}` : null,
		participantSummary ? `participants:${participantSummary}` : null,
		row.runtimePolicySessionKey ? `policy:${row.runtimePolicySessionKey}` : null,
		row.sessionId ? `id:${row.sessionId}` : null
	].filter(Boolean);
	const label = sanitizeTerminalText(flags.join(" "));
	return label.length === 0 ? "" : rich ? theme.muted(label) : label;
}
//#endregion
export { toSessionDisplayRow as a, resolveSessionDisplayModelRef as c, formatSessionModelCell as i, formatSessionFlagsCell as n, toSessionDisplayRows as o, formatSessionKeyCell as r, resolveSessionDisplayDefaults as s, formatSessionAgeCell as t };
