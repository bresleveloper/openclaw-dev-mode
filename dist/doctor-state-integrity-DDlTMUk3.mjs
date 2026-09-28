import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord, n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { f as normalizeStringEntriesLower, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { A as tryResolveDefaultAgentId, O as listAgentIds, k as readAgentRosterProperty, p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { C as resolveOAuthDir, E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as findGitRoot } from "./git-root-DLNHL8nb.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { o as listPluginDoctorSessionRouteStateOwners } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { n as formatSessionArchiveTimestamp } from "./artifacts-C9weQ_MG.mjs";
import { c as resolveSessionFilePathOptions, f as resolveSessionTranscriptsDirForAgent, l as resolveSessionStorePathCore, s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-DKxKaZGG.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { n as parseModelRef } from "./model-selection-normalize-Dij_chYC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { o as listConfiguredChannelIdsForReadOnlyScope } from "./channel-presence-policy-C83ks5im.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { d as readAgentDatabaseAdmissionRefusal, g as isReservedSystemAgentId } from "./agent-database-admission-BFwcs62N.mjs";
import { i as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-BE52ybIt.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import "./channel-plugin-ids-5hZDJEQZ.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { c as isValidAgentHarnessSessionStoreEntry } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { l as resolveSessionStoreTargets, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { t as discoverAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-CvP9Kmvc.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { B as scanDoctorSessionEntriesStrict, I as iterateDoctorSessionKeyBatches } from "./session-accessor-C05KQ5A3.mjs";
import { v as applySessionEntryLifecycleMutation, y as applySessionEntryReplacements } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { n as formatSubagentRecoveryWedgedReason, r as isSubagentRecoveryWedgedEntry, t as clearWedgedSubagentRecoveryAbort } from "./subagent-recovery-state-owKRDgQi.mjs";
import { c as transitionMainSessionRecovery } from "./main-session-recovery-state-uW-wldbD.mjs";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-DxPIMf2l.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import { n as resolveHeartbeatDeliveryTarget } from "./targets-xfpX_XXd.mjs";
import { i as isSharedAuthStoreOwner } from "./agent-delete-safety-Ci4iwiZS.mjs";
import { i as updateLegacySessionStore, t as loadLegacySessionStore } from "./state-migrations.legacy-session-store-8RtPEokS.mjs";
import { n as clearTuiLastSessionPointers } from "./tui-last-session-DTl9PiQ2.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { StringDecoder } from "node:string_decoder";
//#region src/commands/doctor-state-integrity-format.ts
function countLabel(count, singular, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}
//#endregion
//#region src/commands/doctor-heartbeat-main-session-repair.ts
/** Doctor repair for main sessions accidentally occupied by synthetic heartbeat transcripts. */
/** Chunk size for sync transcript scans. */
const TRANSCRIPT_SCAN_CHUNK_BYTES = 65536;
const TRANSCRIPT_RECORD_MAX_CHARS = 262144;
function sessionEntryHasSyntheticHeartbeatOwnership(entry) {
	return typeof entry.heartbeatIsolatedBaseSessionKey === "string" && entry.heartbeatIsolatedBaseSessionKey.trim().length > 0;
}
function parseTranscriptMessageLine(line) {
	let parsed;
	try {
		parsed = JSON.parse(line);
	} catch {
		return null;
	}
	const record = asNullableObjectRecord(parsed);
	if (!record) return null;
	const message = asNullableObjectRecord(record.message) ?? record;
	const role = message.role;
	if (typeof role !== "string") return null;
	return {
		role,
		content: message.content
	};
}
function accumulateTranscriptHeartbeatMessage(summary, line) {
	const trimmed = line.trim();
	if (!trimmed) return;
	const message = parseTranscriptMessageLine(trimmed);
	if (!message) return;
	summary.inspectedMessages += 1;
	if (message.role === "user") {
		summary.userMessages += 1;
		if (isHeartbeatUserMessage(message)) summary.heartbeatUserMessages += 1;
		else summary.nonHeartbeatUserMessages += 1;
		return;
	}
	if (message.role === "assistant") {
		summary.assistantMessages += 1;
		if (isHeartbeatOkResponse(message)) summary.heartbeatOkAssistantMessages += 1;
	}
}
/**
* Scans a transcript JSONL file in fixed-size chunks so doctor repair never loads
* the whole file into a single string (large poisoned heartbeat transcripts).
*
* Incomplete lines are retained only up to TRANSCRIPT_RECORD_MAX_CHARS; larger
* records decline classification so repair stays fail-closed.
*/
function scanTranscriptHeartbeatMessages(transcriptPath) {
	let fd;
	try {
		fd = fs.openSync(transcriptPath, "r");
	} catch {
		return null;
	}
	const summary = {
		inspectedMessages: 0,
		userMessages: 0,
		heartbeatUserMessages: 0,
		nonHeartbeatUserMessages: 0,
		assistantMessages: 0,
		heartbeatOkAssistantMessages: 0
	};
	try {
		const decoder = new StringDecoder("utf8");
		const chunk = Buffer.alloc(TRANSCRIPT_SCAN_CHUNK_BYTES);
		let carry = "";
		for (;;) {
			const bytesRead = fs.readSync(fd, chunk, 0, chunk.length, null);
			if (bytesRead <= 0) break;
			carry += decoder.write(chunk.subarray(0, bytesRead));
			let newline = carry.indexOf("\n");
			while (newline >= 0) {
				if (newline > TRANSCRIPT_RECORD_MAX_CHARS) return "record-too-large";
				const line = carry.slice(0, newline).replace(/\r$/, "");
				carry = carry.slice(newline + 1);
				accumulateTranscriptHeartbeatMessage(summary, line);
				newline = carry.indexOf("\n");
			}
			if (carry.length > TRANSCRIPT_RECORD_MAX_CHARS) return "record-too-large";
		}
		carry += decoder.end();
		if (carry.length > TRANSCRIPT_RECORD_MAX_CHARS) return "record-too-large";
		if (carry) accumulateTranscriptHeartbeatMessage(summary, carry.replace(/\r$/, ""));
	} finally {
		fs.closeSync(fd);
	}
	return summary.inspectedMessages > 0 ? summary : null;
}
/**
* Detects main-session entries that are safe to archive because they only contain heartbeat turns.
*
* Metadata ownership is preferred, but transcript inspection catches older stores that lack the
* heartbeat isolation marker while still containing no human user messages.
*/
function resolveHeartbeatMainSessionRepairCandidate(params) {
	const { entry, transcriptPath } = params;
	if (!entry) return null;
	if (!(entry.lastInteractionAt === void 0)) return null;
	const hasSyntheticHeartbeatOwnership = sessionEntryHasSyntheticHeartbeatOwnership(entry);
	if (hasSyntheticHeartbeatOwnership && !transcriptPath) return { reason: "metadata" };
	if (!transcriptPath) return null;
	const summary = scanTranscriptHeartbeatMessages(transcriptPath);
	if (summary === "record-too-large") return { declineReason: "record-too-large" };
	if (!summary) return null;
	if (summary.heartbeatUserMessages > 0 && summary.userMessages === summary.heartbeatUserMessages && summary.nonHeartbeatUserMessages === 0) return {
		reason: hasSyntheticHeartbeatOwnership ? "metadata" : "transcript",
		summary
	};
	return null;
}
function resolveHeartbeatMainRecoveryKey(params) {
	const parsed = parseAgentSessionKey(params.mainKey);
	if (!parsed) return null;
	const stamp = formatSessionArchiveTimestamp(params.nowMs).toLowerCase();
	const base = `agent:${parsed.agentId}:heartbeat-recovered-${stamp}`;
	if (!params.isSessionKeyOccupied(base)) return base;
	for (let index = 2; index <= 100; index += 1) {
		const candidate = `${base}-${index}`;
		if (!params.isSessionKeyOccupied(candidate)) return candidate;
	}
	return null;
}
/** Moves a poisoned main-session entry to a recovery key without overwriting existing entries. */
function moveHeartbeatMainSessionEntry(params) {
	const entry = params.store[params.mainKey];
	if (!entry || params.store[params.recoveredKey]) return false;
	params.store[params.recoveredKey] = entry;
	delete params.store[params.mainKey];
	return true;
}
/**
* Prompts to archive a heartbeat-owned main session and clears stale TUI restore state.
*
* The session store is rechecked inside the update transaction so concurrent session activity
* prevents moving a newly-human main session.
*/
async function repairHeartbeatPoisonedMainSession(params) {
	const mainKey = params.mainKey;
	const mainEntry = params.mainEntry;
	if (!mainEntry?.sessionId) return false;
	let transcriptPath;
	try {
		transcriptPath = resolveSessionFilePathCore(mainEntry.sessionId, mainEntry, params.sessionPathOpts);
	} catch {
		transcriptPath = void 0;
	}
	if (transcriptPath && !fs.existsSync(transcriptPath)) transcriptPath = void 0;
	const candidate = resolveHeartbeatMainSessionRepairCandidate({
		entry: mainEntry,
		transcriptPath
	});
	if (!candidate) return false;
	if ("declineReason" in candidate) {
		params.warnings.push(`- Skipped heartbeat main-session recovery for ${mainKey}: the transcript contains a JSONL record larger than ${TRANSCRIPT_RECORD_MAX_CHARS} characters, so doctor left it unchanged.`);
		return false;
	}
	const recoveredKey = resolveHeartbeatMainRecoveryKey({
		mainKey,
		isSessionKeyOccupied: params.isSessionKeyOccupied
	});
	if (!recoveredKey) {
		params.warnings.push(`- Main session ${mainKey} appears heartbeat-owned, but doctor could not choose a safe recovery key.`);
		return false;
	}
	const reason = candidate.reason === "metadata" ? "heartbeat metadata" : `${candidate.summary?.heartbeatUserMessages ?? 0} heartbeat-only user message(s)`;
	params.warnings.push([`- Main session ${mainKey} appears to be a heartbeat-owned session (${reason}).`, `  Doctor can move it to ${recoveredKey} and let the next interactive launch create a fresh main session.`].join("\n"));
	if (!await params.prompter.confirmRuntimeRepair({
		message: `Move heartbeat-owned main session ${mainKey} to ${recoveredKey} and clear stale TUI restore pointers?`,
		initialValue: true
	})) return false;
	let movedEntry;
	if (params.store.kind === "sqlite") {
		if ((await applySessionEntryLifecycleMutation({
			agentId: params.store.agentId,
			removals: [{
				archiveRemovedTranscript: false,
				expectedEntry: mainEntry,
				sessionKey: mainKey
			}],
			skipMaintenance: true,
			storePath: params.store.path,
			upserts: [{
				entry: mainEntry,
				requiresRemovalSessionKey: mainKey,
				sessionKey: recoveredKey
			}]
		})).removedSessionKeys.includes(mainKey)) movedEntry = mainEntry;
	} else await updateLegacySessionStore(params.store.path, (currentStore) => {
		const currentEntry = currentStore[mainKey];
		const currentCandidate = resolveHeartbeatMainSessionRepairCandidate({
			entry: currentEntry,
			transcriptPath
		});
		if (!currentCandidate || "declineReason" in currentCandidate) return;
		if (moveHeartbeatMainSessionEntry({
			store: currentStore,
			mainKey,
			recoveredKey
		})) movedEntry = currentEntry;
	});
	if (!movedEntry) {
		params.warnings.push(`- Main session ${mainKey} changed before repair could move it.`);
		return false;
	}
	let clearedPointers = 0;
	try {
		clearedPointers = clearTuiLastSessionPointers({
			stateDir: params.stateDir,
			sessionKeys: /* @__PURE__ */ new Set([mainKey])
		});
	} catch (error) {
		params.warnings.push(`- Moved heartbeat-owned main session ${mainKey}, but could not clear its TUI restore pointers: ${String(error)}`);
	}
	params.changes.push(`- Moved heartbeat-owned main session ${mainKey} to ${recoveredKey}.`);
	if (clearedPointers > 0) params.changes.push(`- Cleared ${countLabel(clearedPointers, "stale TUI last-session pointer")} for ${mainKey}.`);
	return true;
}
//#endregion
//#region src/commands/doctor-heartbeat-session-target.ts
/** Doctor warnings for heartbeat.session values that resolve to missing delivery sessions. */
/**
* Detect heartbeat configs that pin a non-existent session. The runtime
* resolves `heartbeat.session` to a sessionKey via `resolveHeartbeatSession`;
* a missing last route skips before the model, while a missing explicit target
* runs and drops its reply. Common cause: the configured Slack
* channel ID does not match any channel the agent has ever joined (e.g.,
* heartbeat pins channel `c0b2eddpw95` but the agent only has sessions in
* `c0ag7jag35g`, or the agent has no Slack bot at all).
*
* Warning only — repair would mean rewriting the config, which is the
* operator's intent to express.
*/
function describeHeartbeatSessionTargetIssues(cfg) {
	const warnings = [];
	const sessionScope = cfg.session?.scope ?? "per-sender";
	for (const { agentId, heartbeat: heartbeatConfig } of resolveHeartbeatAgents(cfg)) {
		if (!heartbeatConfig) continue;
		if (!resolveHeartbeatIntervalMs(cfg, void 0, heartbeatConfig)) continue;
		const configuredSession = normalizeOptionalString(heartbeatConfig.session);
		if (!configuredSession) continue;
		const normalizedSession = configuredSession.toLowerCase();
		if (normalizedSession === "main" || normalizedSession === "global") continue;
		if (isSubagentSessionKey(configuredSession)) continue;
		if (sessionScope === "global") continue;
		const target = normalizeOptionalString(heartbeatConfig.target);
		if (target === "none") continue;
		const deliveryWithoutSession = resolveHeartbeatDeliveryTarget({
			cfg,
			agentId,
			heartbeat: heartbeatConfig
		});
		if (deliveryWithoutSession.channel !== "none" && deliveryWithoutSession.to) continue;
		const candidateSession = toAgentStoreSessionKey({
			agentId,
			requestKey: configuredSession,
			mainKey: cfg.session?.mainKey
		});
		if (isSubagentSessionKey(candidateSession)) continue;
		const canonicalSession = canonicalizeMainSessionAlias({
			cfg,
			agentId,
			sessionKey: candidateSession
		});
		if (canonicalSession === "global" || isSubagentSessionKey(canonicalSession) || resolveAgentIdFromSessionKey(canonicalSession) !== agentId) continue;
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		if (loadSessionEntryReadOnly({
			agentId,
			sessionKey: canonicalSession,
			storePath
		}) ?? (!storePath.endsWith(".sqlite") && fs.existsSync(storePath) ? loadLegacySessionStore(storePath)[canonicalSession] : void 0)) continue;
		const databasePath = resolveSqliteTargetFromSessionStorePath(storePath, { agentId }).path;
		const ownerTarget = target === void 0 || target === "owner";
		const missingRouteOutcome = ownerTarget ? `  Heartbeats will skip with reason="no-route" until a configured owner resolves to a direct message.` : deliveryWithoutSession.reason === "no-route" ? `  Heartbeats will skip with reason="no-route" until that session has a delivery route.` : `  Heartbeats will run but resolve delivery to channel="none"/reason="no-target", so replies are dropped.`;
		const fix = ownerTarget ? `  Fix: set commands.ownerAllowFrom=["telegram:123456789"] or a channel allowFrom to a direct-message owner; for explicit delivery, set heartbeat.target="telegram" with heartbeat.to="123456789"; use heartbeat.target="none" to suppress delivery.` : `  Fix: point heartbeat.session at a session the agent actually owns, set heartbeat.target="none" to suppress delivery, or remove the heartbeat.session field to fall back to the agent main session.`;
		warnings.push([
			`- Agent ${agentId} heartbeat.session pins ${configuredSession} (resolved to ${canonicalSession}) but that session has no entry in ${databasePath}.`,
			missingRouteOutcome,
			fix
		].join("\n"));
	}
	return warnings;
}
//#endregion
//#region src/commands/doctor-main-session-recovery.ts
function inspectMainSessionRecoveryEntry(key, entry) {
	const internalEntry = entry;
	const tombstone = internalEntry.mainRestartRecovery?.tombstone;
	return tombstone ? {
		clearStaleAbort: internalEntry.abortedLastRun === true,
		key,
		reason: tombstone.reason.trim() || "main-session restart recovery is tombstoned for this session"
	} : void 0;
}
async function noteMainSessionRecoveryIntegrity(params) {
	const { wedged } = params;
	if (wedged.length === 0) return;
	const wedgedCount = params.countLabel(wedged.length, "wedged main session");
	params.warnings.push([
		`- Found ${wedgedCount} with automatic restart recovery tombstoned.`,
		"  OpenClaw will not auto-resume these sessions again; inspect the failed turn, then use /new or reset to replace the session.",
		`  Examples: ${wedged.slice(0, 3).map(({ key }) => key).join(", ")}`
	].join("\n"));
	const visibleReasons = uniqueStrings(wedged.map(({ reason }) => reason)).slice(0, 2);
	if (visibleReasons.length > 0) params.warnings.push(visibleReasons.map((reason) => `  Reason: ${reason}`).join("\n"));
	const staleAborted = wedged.filter(({ clearStaleAbort }) => clearStaleAbort);
	if (staleAborted.length === 0) return;
	const staleCount = params.countLabel(staleAborted.length, "wedged main session");
	if (!await params.confirmRepair({
		message: `Clear stale aborted recovery flags for ${staleCount}?`,
		initialValue: true
	})) return;
	const repairedAt = Date.now();
	let repaired = 0;
	for (const sessionKeys of iterateDoctorSessionKeyBatches(staleAborted.map(({ key }) => key))) repaired += await applySessionEntryReplacements({
		consumePendingReset: true,
		sessionKeys,
		storePath: params.storePath,
		update: (currentEntries) => {
			const replacements = currentEntries.flatMap(({ sessionKey, entry }) => {
				return transitionMainSessionRecovery(entry, {
					kind: "doctor_repair",
					now: repairedAt
				}).kind === "doctor_repaired" ? [{
					sessionKey,
					entry
				}] : [];
			});
			return {
				replacements,
				result: replacements.length
			};
		}
	});
	if (repaired > 0) params.changes.push(`- Cleared aborted restart-recovery flags for ${params.countLabel(repaired, "wedged main session")}.`);
}
//#endregion
//#region src/commands/doctor-session-state-providers.ts
/** Doctor repair for stale plugin-owned routing state persisted in session entries. */
function normalizeIdSet(values) {
	return new Set((values ?? []).map((value) => normalizeProviderId(value)));
}
function normalizePrefixList(values) {
	return normalizeStringEntriesLower(values);
}
function ownsPrefixedValue(prefixes, value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized !== void 0 && prefixes.some((prefix) => normalized.startsWith(prefix));
}
function countSessionLabel(count) {
	return countLabel(count, "session");
}
function repairExample(repair) {
	return `${repair.key} (${repair.reasons.join(", ")})`;
}
function resolveSessionAgentId(cfg, sessionKey, storeAgentId) {
	return parseAgentSessionKey(sessionKey)?.agentId ?? storeAgentId ?? tryResolveDefaultAgentId(cfg);
}
/** Resolves the currently configured provider/model/runtime route for a session key. */
function resolveConfiguredDoctorSessionStateRoute(params) {
	const agentId = resolveSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!agentId) return;
	const primary = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId
	});
	const configuredModelRefs = /* @__PURE__ */ new Set();
	const addRef = (provider, model) => {
		configuredModelRefs.add(modelKey(provider, model));
	};
	addRef(primary.provider, primary.model);
	const fallbacks = resolveAgentModelFallbacksOverride(params.cfg, agentId) ?? resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
	for (const fallback of fallbacks) {
		const parsed = parseModelRef(fallback, primary.provider, {
			allowManifestNormalization: false,
			allowPluginNormalization: false
		});
		if (parsed) addRef(parsed.provider, parsed.model);
	}
	const runtime = resolveAgentHarnessPolicy({
		provider: primary.provider,
		modelId: primary.model,
		config: params.cfg,
		agentId,
		sessionKey: params.sessionKey
	}).runtime;
	return {
		defaultProvider: primary.provider,
		configuredModelRefs: [...configuredModelRefs],
		runtime
	};
}
function resolvePluginDoctorSessionRouteStateOwners(params) {
	return listPluginDoctorSessionRouteStateOwners({
		config: params.cfg,
		env: params.env
	});
}
function entryMayContainPluginSessionRouteState(sessionKey, entry) {
	if (isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) return false;
	if (!isRecord(entry)) return false;
	const record = entry;
	return normalizeOptionalString(record.providerOverride) !== void 0 || normalizeOptionalString(record.modelOverride) !== void 0 || normalizeOptionalString(record.modelOverrideSource) !== void 0 || record.liveModelSwitchPending !== void 0 || normalizeOptionalString(record.modelProvider) !== void 0 || normalizeOptionalString(record.model) !== void 0 || normalizeOptionalString(record.agentHarnessId) !== void 0 || normalizeOptionalString(record.agentRuntimeOverride) !== void 0 || record.cliSessionBindings !== void 0 || record.cliSessionIds !== void 0 || normalizeOptionalString(record.claudeCliSessionId) !== void 0 || normalizeOptionalString(record.authProfileOverride) !== void 0 || normalizeOptionalString(record.authProfileOverrideSource) !== void 0;
}
function resolvePersistedOverrideModelRef(params) {
	const overrideModel = normalizeOptionalString(params.overrideModel);
	if (!overrideModel) return null;
	const overrideProvider = normalizeOptionalString(params.overrideProvider);
	return parseModelRef(overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel, params.defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
}
function addReason(reasons, reason) {
	if (!reasons.includes(reason)) reasons.push(reason);
}
function routeAllowsOwnerState(params) {
	const providerIds = normalizeIdSet(params.owner.providerIds);
	const runtimeIds = normalizeIdSet(params.owner.runtimeIds);
	const routeRuntime = normalizeOptionalString(params.route?.runtime);
	if (routeRuntime && runtimeIds.has(normalizeProviderId(routeRuntime))) return true;
	return params.route?.configuredModelRefs.some((ref) => {
		const slash = ref.indexOf("/");
		return slash > 0 && providerIds.has(normalizeProviderId(ref.slice(0, slash)));
	}) ?? false;
}
function hasOwnedCliSession(params) {
	const bindings = params.entry.cliSessionBindings;
	const ids = params.entry.cliSessionIds;
	return params.cliSessionKeys.some((key) => {
		const normalized = normalizeProviderId(key);
		return normalized === "claude-cli" && normalizeOptionalString(params.entry.claudeCliSessionId) !== void 0 || bindings !== null && typeof bindings === "object" && normalized in bindings && bindings[normalized] !== void 0 || ids !== null && typeof ids === "object" && normalized in ids && ids[normalized] !== void 0;
	});
}
function modelRefKey(provider, model) {
	return modelKey(provider, model).toLowerCase();
}
function scanEntryForOwner(params) {
	const providerIds = normalizeIdSet(params.owner.providerIds);
	const runtimeIds = normalizeIdSet(params.owner.runtimeIds);
	const cliSessionKeys = [...normalizeIdSet(params.owner.cliSessionKeys)];
	const authProfilePrefixes = normalizePrefixList(params.owner.authProfilePrefixes);
	const routeAllowsOwner = routeAllowsOwnerState({
		owner: params.owner,
		route: params.route
	});
	const routeRuntime = normalizeOptionalString(params.route?.runtime);
	const routeAllowsOwnerRuntime = routeRuntime !== void 0 && runtimeIds.has(normalizeProviderId(routeRuntime));
	const reasons = [];
	const pinnedRuntimeKeys = [];
	const directOverride = resolvePersistedOverrideModelRef({
		defaultProvider: params.route?.defaultProvider ?? "",
		overrideProvider: params.entry.providerOverride,
		overrideModel: params.entry.modelOverride
	});
	const directOverrideKey = directOverride ? modelRefKey(directOverride.provider, directOverride.model) : void 0;
	const directOverrideIsOwned = directOverride !== null && providerIds.has(normalizeProviderId(directOverride.provider));
	const directOverrideIsConfigured = directOverrideKey !== void 0 && (params.route?.configuredModelRefs.some((ref) => ref.toLowerCase() === directOverrideKey) ?? false);
	const directOverrideSource = params.entry.modelOverrideSource === "user" ? "user" : params.entry.modelOverrideSource === "auto" ? "auto" : params.entry.modelOverride ? "legacy" : void 0;
	if (directOverrideIsOwned && !directOverrideIsConfigured) {
		if (directOverrideSource === "auto") addReason(reasons, "auto model override");
		else if (!routeAllowsOwner && directOverride) return { manualReview: {
			key: params.key,
			ownerLabel: params.owner.label,
			message: `${params.key} (${modelRefKey(directOverride.provider, directOverride.model)}, ${directOverrideSource === "user" ? "user" : "legacy"})`
		} };
	}
	const explicitOwnedOverride = directOverrideIsOwned && directOverrideSource !== void 0 && directOverrideSource !== "auto";
	if (!routeAllowsOwnerRuntime && !explicitOwnedOverride) {
		const harnessId = normalizeOptionalString(params.entry.agentHarnessId);
		if (harnessId && runtimeIds.has(normalizeProviderId(harnessId))) {
			addReason(reasons, "pinned runtime");
			pinnedRuntimeKeys.push("agentHarnessId");
		}
		const runtimeOverride = normalizeOptionalString(params.entry.agentRuntimeOverride);
		if (runtimeOverride && runtimeIds.has(normalizeProviderId(runtimeOverride))) {
			addReason(reasons, "pinned runtime");
			pinnedRuntimeKeys.push("agentRuntimeOverride");
		}
	}
	if (!routeAllowsOwner && !explicitOwnedOverride) {
		const runtimeRef = resolvePersistedOverrideModelRef({
			defaultProvider: "",
			overrideProvider: params.entry.modelProvider,
			overrideModel: params.entry.model
		});
		if (runtimeRef && providerIds.has(normalizeProviderId(runtimeRef.provider))) addReason(reasons, "runtime model state");
		if (hasOwnedCliSession({
			entry: params.entry,
			cliSessionKeys
		})) addReason(reasons, "CLI session binding");
		if (params.entry.authProfileOverrideSource === "auto" && ownsPrefixedValue(authProfilePrefixes, params.entry.authProfileOverride)) addReason(reasons, "auto auth profile override");
	}
	if (reasons.length === 0) return {};
	return { repair: {
		key: params.key,
		ownerId: params.owner.id,
		ownerLabel: params.owner.label,
		reasons,
		pinnedRuntimeKeys,
		cliSessionKeys
	} };
}
/** Streams session entries into compact plugin-owned route-state findings. */
function createPluginSessionStateDoctorScanner(params) {
	const repairs = [];
	const manualReview = [];
	let owners;
	const routeByAgentId = /* @__PURE__ */ new Map();
	return {
		scanEntry(key, entry) {
			if (!entryMayContainPluginSessionRouteState(key, entry)) return;
			if (!isRecord(entry)) return;
			owners ??= resolvePluginDoctorSessionRouteStateOwners(params);
			if (owners.length === 0) return;
			const agentId = resolveSessionAgentId(params.cfg, key, params.agentId);
			if (!agentId) return;
			let route = routeByAgentId.get(agentId);
			if (!route) {
				route = resolveConfiguredDoctorSessionStateRoute({
					agentId,
					cfg: params.cfg,
					sessionKey: key,
					env: params.env
				});
				if (!route) return;
				routeByAgentId.set(agentId, route);
			}
			for (const owner of owners) {
				const scan = scanEntryForOwner({
					key,
					entry,
					owner,
					route
				});
				if (scan.repair) repairs.push(scan.repair);
				if (scan.manualReview) manualReview.push(scan.manualReview);
			}
		},
		result() {
			return {
				repairs,
				manualReview
			};
		}
	};
}
function clearEntryKey(entry, key) {
	if (entry[key] !== void 0) {
		delete entry[key];
		return true;
	}
	return false;
}
function clearRecordKeys(entry, recordKey, ownedKeys) {
	const value = entry[recordKey];
	if (value === null || typeof value !== "object") return false;
	const record = value;
	let changed = false;
	const next = { ...record };
	for (const key of ownedKeys) {
		const normalized = normalizeProviderId(key);
		if (next[normalized] !== void 0) {
			delete next[normalized];
			changed = true;
		}
	}
	if (!changed) return false;
	entry[recordKey] = Object.keys(next).length > 0 ? next : void 0;
	return true;
}
/** Clears stale plugin-owned routing fields from a session entry and refreshes updatedAt. */
function applySessionRouteStateRepair(params) {
	if (isValidAgentHarnessSessionStoreEntry(params.sessionKey, params.entry)) return false;
	let changed = false;
	const clear = (key) => {
		changed = clearEntryKey(params.entry, key) || changed;
	};
	if (params.repair.reasons.includes("auto model override")) {
		clear("providerOverride");
		clear("modelOverride");
		clear("modelOverrideSource");
		clear("modelOverrideFallbackOriginProvider");
		clear("modelOverrideFallbackOriginModel");
		clear("modelOverrideRouteResolution");
		clear("liveModelSwitchPending");
	}
	if (params.repair.reasons.includes("runtime model state")) {
		clear("model");
		clear("modelProvider");
		clear("contextTokens");
		clear("systemPromptReport");
		clear("fallbackNotice");
	}
	if (params.repair.reasons.includes("pinned runtime")) for (const key of params.repair.pinnedRuntimeKeys) clear(key);
	if (params.repair.reasons.includes("CLI session binding")) {
		changed = clearRecordKeys(params.entry, "cliSessionBindings", params.repair.cliSessionKeys) || changed;
		changed = clearRecordKeys(params.entry, "cliSessionIds", params.repair.cliSessionKeys) || changed;
		if (params.repair.cliSessionKeys.includes("claude-cli")) clear("claudeCliSessionId");
	}
	if (params.repair.reasons.includes("auto auth profile override")) {
		clear("authProfileOverride");
		clear("authProfileOverrideSource");
		clear("authProfileOverrideCompactionCount");
	}
	if (changed) params.entry.updatedAt = params.now;
	return changed;
}
function groupRepairsByOwner(repairs) {
	const grouped = /* @__PURE__ */ new Map();
	for (const repair of repairs) {
		const key = repair.ownerLabel;
		grouped.set(key, [...grouped.get(key) ?? [], repair]);
	}
	return grouped;
}
/** Prompts for and applies plugin-owned session route state repairs to the session store. */
async function runPluginSessionStateDoctorRepairs(params) {
	const { scan } = params;
	if (scan.repairs.length > 0) for (const [ownerLabel, repairs] of groupRepairsByOwner(scan.repairs)) {
		const staleCount = countSessionLabel(repairs.length);
		params.warnings.push([
			`- Found stale ${ownerLabel} session routing state in ${staleCount} outside the current configured model/runtime route.`,
			"  This can keep later message-channel runs pinned to an old runtime/provider after defaults move elsewhere.",
			`  Examples: ${repairs.slice(0, 3).map(repairExample).join(", ")}`
		].join("\n"));
		if (await params.prompter.confirmRuntimeRepair({
			message: `Clear stale ${ownerLabel} session routing state for ${staleCount}?`,
			initialValue: true
		})) {
			let repaired = 0;
			const repairedAt = Date.now();
			const repairsByKey = new Map(repairs.map((repair) => [repair.key, repair]));
			if (params.store.kind === "sqlite") repaired = await applySessionEntryReplacements({
				agentId: params.store.agentId,
				sessionKeys: [...repairsByKey.keys()],
				storePath: params.store.path,
				update: (currentEntries) => {
					const replacements = currentEntries.flatMap(({ entry, sessionKey }) => {
						const repair = repairsByKey.get(sessionKey);
						return repair && isRecord(entry) && applySessionRouteStateRepair({
							sessionKey,
							entry,
							repair,
							now: repairedAt
						}) ? [{
							entry,
							sessionKey
						}] : [];
					});
					return {
						replacements,
						result: replacements.length
					};
				}
			});
			else await updateLegacySessionStore(params.store.path, (currentStore) => {
				for (const [key, repair] of repairsByKey) {
					const current = currentStore[key];
					if (isRecord(current) && applySessionRouteStateRepair({
						sessionKey: key,
						entry: current,
						repair,
						now: repairedAt
					})) repaired += 1;
				}
			});
			if (repaired > 0) params.changes.push(`- Cleared stale ${ownerLabel} session routing state for ${countSessionLabel(repaired)}.`);
		}
	}
	if (scan.manualReview.length > 0) {
		const grouped = /* @__PURE__ */ new Map();
		for (const hit of scan.manualReview) grouped.set(hit.ownerLabel, [...grouped.get(hit.ownerLabel) ?? [], hit]);
		for (const [ownerLabel, hits] of grouped) params.warnings.push([
			`- Found explicit ${ownerLabel} model overrides in ${countSessionLabel(hits.length)} outside the current configured route.`,
			"  Doctor leaves explicit or legacy user selections untouched; switch them with /model or reset the session if that provider is no longer intended.",
			`  Examples: ${hits.slice(0, 3).map((hit) => hit.message).join(", ")}`
		].join("\n"));
	}
}
//#endregion
//#region src/commands/doctor-unconfigured-agent-databases.ts
function isDefaultAgentDatabasePath(pathname, stateDir) {
	const segments = path.relative(stateDir, pathname).split(path.sep);
	return segments.length === 4 && segments[0] === "agents" && segments[2] === "agent" && segments[3] === "openclaw-agent.sqlite";
}
/** Report retained stores without turning roster absence into deletion authority. */
function collectRetainedUnconfiguredAgentDatabaseWarnings(params) {
	const env = params.env ?? process.env;
	try {
		const stateDir = fs.realpathSync.native(resolveStateDir(env));
		const registeredAgentDatabases = listOpenClawRegisteredAgentDatabases({
			env,
			includeIncompatibleSchemaVersions: true
		});
		const configuredAgentDatabaseTargets = resolveConfiguredAgentDatabaseTargets(params.cfg, {
			env,
			registeredDatabases: registeredAgentDatabases
		});
		const discovery = discoverAgentDatabaseMigrationTargets({
			configuredAgentDatabaseTargets,
			registeredAgentDatabases,
			env
		});
		return [...discovery.targets.flatMap((target) => {
			if (target.source === "configured" || isDefaultAgentDatabasePath(target.realPath, stateDir)) return [];
			return [`- Retained unconfigured agent database "${sanitizeForLog(target.agentId)}" at ${sanitizeForLog(target.path)}. Doctor will not remove it automatically because it may contain retired or manually managed agent state.`];
		}), ...discovery.externalWarnings];
	} catch (error) {
		return [`- Could not inspect retained unconfigured agent databases: ${sanitizeForLog(formatErrorMessage(error))}`];
	}
}
//#endregion
//#region src/commands/doctor-state-integrity.ts
/** Doctor checks and repairs for state dir durability, sessions, transcripts, and credentials. */
const STATE_INTEGRITY_CHECK_ID = "core/doctor/state-integrity";
function existsDir(dir) {
	try {
		return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
	} catch {
		return false;
	}
}
function existsFile(filePath) {
	try {
		return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function tryResolveNativeRealPath(targetPath) {
	try {
		return fs.realpathSync.native(targetPath);
	} catch {
		return null;
	}
}
function areComparablePathsEqual(leftPath, rightPath) {
	const leftRealPath = tryResolveNativeRealPath(leftPath);
	const rightRealPath = tryResolveNativeRealPath(rightPath);
	return leftRealPath !== null && leftRealPath === rightRealPath;
}
function isReachableConfiguredAgentDir(params) {
	if (params.dirName === params.agentId) return true;
	return areComparablePathsEqual(path.join(params.agentsRoot, params.dirName, "agent"), path.join(params.agentsRoot, params.agentId, "agent"));
}
function listOrphanAgentDirs(cfg, stateDir) {
	const configuredIds = new Set(listAgentIds(cfg));
	const sharedAuthOwnership = resolveSharedAuthStoreOwnership();
	const sharedAuthDbPath = resolveSharedAuthStorePath();
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const agentsRoot = path.join(stateDir, "agents");
	const liveDefaultAgentDir = defaultAgentId ? resolveDefaultAgentDir(cfg) : void 0;
	try {
		return fs.readdirSync(agentsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => ({
			dirName: entry.name,
			agentId: normalizeAgentId(entry.name)
		})).filter(({ dirName, agentId }) => {
			const nestedAgentDir = path.join(agentsRoot, dirName, "agent");
			if (!existsDir(nestedAgentDir)) return false;
			if (isReservedSystemAgentId(agentId)) return false;
			if (isSharedAuthStoreOwner({
				ownership: sharedAuthOwnership,
				agentAuthDbPath: resolveAuthProfileDatabasePath(nestedAgentDir),
				sharedAuthDbPath
			})) return false;
			if (liveDefaultAgentDir && areComparablePathsEqual(nestedAgentDir, liveDefaultAgentDir)) return false;
			if (!configuredIds.has(agentId)) return true;
			return !isReachableConfiguredAgentDir({
				agentsRoot,
				dirName,
				agentId
			});
		}).toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.dirName.localeCompare(right.dirName));
	} catch {
		return [];
	}
}
function canWriteDir(dir) {
	try {
		fs.accessSync(dir, fs.constants.W_OK);
		return true;
	} catch {
		return false;
	}
}
function ensureDir(dir) {
	try {
		fs.mkdirSync(dir, { recursive: true });
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
function dirPermissionHint(dir) {
	const uid = typeof process.getuid === "function" ? process.getuid() : null;
	const gid = typeof process.getgid === "function" ? process.getgid() : null;
	try {
		const stat = fs.statSync(dir);
		if (uid !== null && stat.uid !== uid) return `Owner mismatch (uid ${stat.uid}). Run: sudo chown -R $USER "${dir}"`;
		if (gid !== null && stat.gid !== gid) return `Group mismatch (gid ${stat.gid}). If access fails, run: sudo chown -R $USER "${dir}"`;
	} catch {
		return null;
	}
	return null;
}
function addUserRwx(mode) {
	return mode & 511 | 448;
}
function countJsonlLines(filePath) {
	let fd;
	try {
		fd = fs.openSync(filePath, "r");
	} catch {
		return 0;
	}
	try {
		const chunk = Buffer.alloc(65536);
		let count = 0;
		let hasBytes = false;
		let endsWithNewline = false;
		for (;;) {
			const bytesRead = fs.readSync(fd, chunk, 0, chunk.length, null);
			if (bytesRead <= 0) break;
			hasBytes = true;
			endsWithNewline = chunk[bytesRead - 1] === 10;
			for (let index = 0; index < bytesRead; index += 1) if (chunk[index] === 10) count += 1;
		}
		if (hasBytes && !endsWithNewline) count += 1;
		return count;
	} catch {
		return 0;
	} finally {
		fs.closeSync(fd);
	}
}
function isPathUnderRoot(targetPath, rootPath) {
	return isPathUnderRootWithPathOps(targetPath, rootPath, path);
}
function resolvePathThroughExistingAncestor(targetPath, resolveRealPath, pathOps) {
	const missingSegments = [];
	let candidate = pathOps.resolve(targetPath);
	while (true) {
		const resolved = resolveRealPath(candidate);
		if (resolved) return pathOps.resolve(resolved, ...missingSegments);
		const parent = pathOps.dirname(candidate);
		if (parent === candidate) return null;
		missingSegments.unshift(pathOps.basename(candidate));
		candidate = parent;
	}
}
function escapeControlCharsForTerminal(value) {
	let escaped = "";
	for (const char of value) {
		if (char === "\x1B") {
			escaped += "\\x1b";
			continue;
		}
		if (char === "\r") {
			escaped += "\\r";
			continue;
		}
		if (char === "\n") {
			escaped += "\\n";
			continue;
		}
		if (char === "	") {
			escaped += "\\t";
			continue;
		}
		const code = char.charCodeAt(0);
		if (code >= 0 && code <= 8 || code === 11 || code === 12 || code >= 14 && code <= 31) {
			escaped += `\\x${code.toString(16).padStart(2, "0")}`;
			continue;
		}
		if (code === 127) {
			escaped += "\\x7f";
			continue;
		}
		escaped += char;
	}
	return escaped;
}
function parseLinuxMountInfo(rawMountInfo) {
	const entries = [];
	for (const line of rawMountInfo.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const separatorIndex = trimmed.indexOf(" - ");
		if (separatorIndex === -1) continue;
		const left = trimmed.slice(0, separatorIndex);
		const right = trimmed.slice(separatorIndex + 3);
		const leftFields = left.split(" ");
		const rightFields = right.split(" ");
		if (leftFields.length < 5 || rightFields.length < 2) continue;
		entries.push({
			mountPoint: decodeMountInfoPath(expectDefined(leftFields[4], "left fields entry at 4")),
			fsType: expectDefined(rightFields[0], "right fields entry at 0"),
			source: decodeMountInfoPath(expectDefined(rightFields[1], "right fields entry at 1"))
		});
	}
	return entries;
}
function isPathUnderRootWithPathOps(targetPath, rootPath, pathOps) {
	const normalizedTarget = pathOps.resolve(targetPath);
	const normalizedRoot = pathOps.resolve(rootPath);
	const rootToken = pathOps.parse(normalizedRoot).root;
	if (normalizedRoot === rootToken) return normalizedTarget.startsWith(rootToken);
	return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}${pathOps.sep}`);
}
function findLinuxMountInfoEntryForPath(targetPath, entries, pathOps) {
	const normalizedTarget = pathOps.resolve(targetPath);
	let bestMatch = null;
	for (const entry of entries) {
		if (!isPathUnderRootWithPathOps(normalizedTarget, entry.mountPoint, pathOps)) continue;
		if (!bestMatch || pathOps.resolve(entry.mountPoint).length > pathOps.resolve(bestMatch.mountPoint).length) bestMatch = entry;
	}
	return bestMatch;
}
function isMmcDevicePath(devicePath, pathOps) {
	const name = pathOps.basename(devicePath);
	return /^mmcblk\d+(?:p\d+)?$/.test(name);
}
function tryReadLinuxMountInfo() {
	try {
		return fs.readFileSync("/proc/self/mountinfo", "utf8");
	} catch {
		return null;
	}
}
function resolveLinuxStateMount(stateDir, deps) {
	const linuxPath = path.posix;
	const resolvedStatePath = resolvePathThroughExistingAncestor(stateDir, deps?.resolveRealPath ?? safeRealpathSync, linuxPath) ?? linuxPath.resolve(stateDir);
	const mountInfo = deps?.mountInfo ?? tryReadLinuxMountInfo();
	const mountEntry = mountInfo ? findLinuxMountInfoEntryForPath(resolvedStatePath, parseLinuxMountInfo(mountInfo), linuxPath) : null;
	return mountEntry ? {
		path: linuxPath.resolve(resolvedStatePath),
		mountPoint: linuxPath.resolve(mountEntry.mountPoint),
		fsType: mountEntry.fsType,
		source: mountEntry.source
	} : null;
}
/** Detects Linux state directories mounted from SD/eMMC-style block devices. */
function detectLinuxSdBackedStateDir(stateDir, deps) {
	if ((deps?.platform ?? process.platform) !== "linux") return null;
	const linuxPath = path.posix;
	const stateMount = resolveLinuxStateMount(stateDir, deps);
	if (!stateMount) return null;
	const sourceCandidates = [stateMount.source];
	if (stateMount.source.startsWith("/dev/")) {
		const resolvedDevicePath = (deps?.resolveDeviceRealPath ?? safeRealpathSync)(stateMount.source);
		if (resolvedDevicePath) sourceCandidates.push(linuxPath.resolve(resolvedDevicePath));
	}
	if (!sourceCandidates.some((candidate) => isMmcDevicePath(candidate, linuxPath))) return null;
	return stateMount;
}
/** Formats the warning for state stored on SD/eMMC media. */
function formatLinuxSdBackedStateDirWarning(displayStateDir, linuxSdBackedStateDir) {
	const displayMountPoint = linuxSdBackedStateDir.mountPoint === "/" ? "/" : shortenHomePath(linuxSdBackedStateDir.mountPoint);
	return [
		`- State directory appears to be on SD/eMMC storage (${displayStateDir}; device ${escapeControlCharsForTerminal(linuxSdBackedStateDir.source)}, fs ${escapeControlCharsForTerminal(linuxSdBackedStateDir.fsType)}, mount ${escapeControlCharsForTerminal(displayMountPoint)}).`,
		"- SD/eMMC media can be slower for random I/O and wear faster under session/log churn.",
		"- For better startup and state durability, prefer SSD/NVMe (or USB SSD on Raspberry Pi) for OPENCLAW_STATE_DIR."
	].join("\n");
}
/** Filesystems whose state disappears on reboot. Docker overlayfs is intentionally excluded. */
const VOLATILE_FS_TYPES = /* @__PURE__ */ new Set(["tmpfs", "ramfs"]);
/** Detects Linux state directories mounted on filesystems that do not survive a reboot. */
function detectLinuxVolatileStateDir(stateDir, deps) {
	if ((deps?.platform ?? process.platform) !== "linux") return null;
	const stateMount = resolveLinuxStateMount(stateDir, deps);
	if (!stateMount || !VOLATILE_FS_TYPES.has(stateMount.fsType)) return null;
	const { source: _source, ...volatileStateMount } = stateMount;
	return volatileStateMount;
}
/** Formats the warning for state stored on a volatile Linux filesystem. */
function formatLinuxVolatileStateDirWarning(displayStateDir, volatileDir) {
	return [
		`- State directory is on a volatile filesystem (${displayStateDir}; fs ${escapeControlCharsForTerminal(volatileDir.fsType)}, mount ${volatileDir.mountPoint === "/" ? "/" : escapeControlCharsForTerminal(shortenHomePath(volatileDir.mountPoint))}).`,
		"- Sessions, credentials, config, and SQLite state (including WAL/journal sidecars) will be lost on reboot.",
		"- Move OPENCLAW_STATE_DIR to a persistent filesystem to avoid data loss."
	].join("\n");
}
/** Detects macOS state directories under iCloud Drive or CloudStorage providers. */
function detectMacCloudSyncedStateDir(stateDir, deps) {
	if ((deps?.platform ?? process.platform) !== "darwin") return null;
	const homedir = deps?.homedir ?? os.homedir();
	const roots = [{
		storage: "iCloud Drive",
		root: path.join(homedir, "Library", "Mobile Documents", "com~apple~CloudDocs")
	}, {
		storage: "CloudStorage provider",
		root: path.join(homedir, "Library", "CloudStorage")
	}];
	const resolvedStatePath = resolvePathThroughExistingAncestor(stateDir, deps?.resolveRealPath ?? safeRealpathSync, path) ?? path.resolve(stateDir);
	for (const { storage, root } of roots) if (isPathUnderRoot(resolvedStatePath, root)) return {
		path: resolvedStatePath,
		storage
	};
	return null;
}
/** Detects Windows state directories under OneDrive sync roots. */
function detectWindowsCloudSyncedStateDir(stateDir, deps) {
	const platform = deps?.platform ?? process.platform;
	if (platform !== "win32") return null;
	const env = deps?.env ?? process.env;
	const roots = [];
	const addRoot = (storage, root) => {
		if (root && root.trim() !== "") roots.push({
			storage,
			root
		});
	};
	addRoot("OneDrive", resolveEnvironmentValue(env, "OneDrive", platform));
	addRoot("OneDrive", resolveEnvironmentValue(env, "OneDriveConsumer", platform));
	addRoot("OneDrive for Business", resolveEnvironmentValue(env, "OneDriveCommercial", platform));
	if (roots.length === 0) return null;
	const resolvedStatePath = resolvePathThroughExistingAncestor(stateDir, deps?.resolveRealPath ?? safeRealpathSync, path) ?? path.resolve(stateDir);
	for (const { storage, root } of roots) if (isPathUnderRoot(resolvedStatePath.toLowerCase(), root.toLowerCase())) return {
		path: resolvedStatePath,
		storage
	};
	return null;
}
/** Formats the warning for state stored under a OneDrive sync root. */
function formatWindowsCloudSyncedStateDirWarning(displayStateDir, windowsCloudSyncedStateDir) {
	return [
		`- State directory is under Windows cloud-synced storage (${displayStateDir}; ${windowsCloudSyncedStateDir.storage}).`,
		"- This can cause slow I/O, sync/lock races, and Files On-Demand dehydration for sessions and credentials.",
		"- Prefer a local non-synced state dir (for example: %USERPROFILE%\\.openclaw).",
		"- To relocate: stop the Gateway, move the whole state directory, set",
		"  OPENCLAW_STATE_DIR to the new path for the Gateway service (not just",
		"  one shell), then restart it and re-run doctor to verify."
	].join("\n");
}
function isPairingPolicy(value) {
	return normalizeOptionalLowercaseString(value) === "pairing";
}
function hasPairingPolicy(value) {
	const record = asNullableObjectRecord(value);
	if (!record) return false;
	if (isPairingPolicy(record.dmPolicy)) return true;
	const dm = asNullableObjectRecord(record.dm);
	if (dm && isPairingPolicy(dm.policy)) return true;
	const accounts = asNullableObjectRecord(record.accounts);
	if (!accounts) return false;
	for (const accountCfg of Object.values(accounts)) if (hasPairingPolicy(accountCfg)) return true;
	return false;
}
function shouldRequireOAuthDir(cfg, env) {
	if (env.OPENCLAW_OAUTH_DIR?.trim()) return true;
	const channels = asNullableObjectRecord(cfg.channels);
	if (!channels) return false;
	const withPersistedAuth = new Set(listConfiguredChannelIdsForReadOnlyScope({
		config: cfg,
		env
	}));
	const withoutPersistedAuth = new Set(listConfiguredChannelIdsForReadOnlyScope({
		config: cfg,
		env,
		includePersistedAuthState: false
	}));
	if ([...withPersistedAuth].some((channelId) => !withoutPersistedAuth.has(channelId))) return true;
	for (const [channelId, channelCfg] of Object.entries(channels)) {
		const scopedChannelId = normalizeOptionalLowercaseString(channelId);
		if (!scopedChannelId || !withPersistedAuth.has(scopedChannelId)) continue;
		if (hasPairingPolicy(channelCfg)) return true;
	}
	return false;
}
function detectStateIntegrityHealthIssues(cfg, params) {
	const issues = [];
	const env = params?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, params?.homedir ?? os.homedir);
	const stateDir = resolveStateDir(env, homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const agentId = tryResolveDefaultAgentId(cfg);
	const sessionsDir = agentId ? resolveSessionTranscriptsDirForAgent(agentId, env, homedir) : void 0;
	const storePath = agentId ? resolveSessionStorePathCore(cfg.session?.store, {
		agentId,
		env
	}) : void 0;
	const storeDir = storePath ? path.dirname(storePath) : void 0;
	const requireOAuthDir = shouldRequireOAuthDir(cfg, env);
	const cloudSyncedStateDir = detectMacCloudSyncedStateDir(stateDir);
	if (cloudSyncedStateDir) issues.push({
		kind: "mac-cloud-state-dir",
		path: cloudSyncedStateDir.path,
		storage: cloudSyncedStateDir.storage
	});
	const windowsCloudSyncedStateDir = detectWindowsCloudSyncedStateDir(stateDir, { env });
	if (windowsCloudSyncedStateDir) issues.push({
		kind: "windows-cloud-state-dir",
		path: windowsCloudSyncedStateDir.path,
		storage: windowsCloudSyncedStateDir.storage
	});
	const linuxSdBackedStateDir = detectLinuxSdBackedStateDir(stateDir);
	if (linuxSdBackedStateDir) issues.push({
		kind: "linux-sd-state-dir",
		path: linuxSdBackedStateDir.path,
		mountPoint: linuxSdBackedStateDir.mountPoint,
		fsType: linuxSdBackedStateDir.fsType,
		source: linuxSdBackedStateDir.source
	});
	const linuxVolatileStateDir = detectLinuxVolatileStateDir(stateDir);
	if (linuxVolatileStateDir) issues.push({
		kind: "linux-volatile-state-dir",
		path: linuxVolatileStateDir.path,
		mountPoint: linuxVolatileStateDir.mountPoint,
		fsType: linuxVolatileStateDir.fsType
	});
	const stateDirExists = existsDir(stateDir);
	if (!stateDirExists) issues.push({
		kind: "missing-state-dir",
		path: stateDir
	});
	if (stateDirExists && !canWriteDir(stateDir)) {
		const hint = dirPermissionHint(stateDir);
		issues.push({
			kind: "state-dir-not-writable",
			path: stateDir,
			...hint ? { hint } : {}
		});
	}
	if (stateDirExists && process.platform !== "win32") try {
		const dirLstat = fs.lstatSync(stateDir);
		const isDirSymlink = dirLstat.isSymbolicLink();
		const stat = isDirSymlink ? fs.statSync(stateDir) : dirLstat;
		if (!(isDirSymlink ? fs.realpathSync(stateDir) : stateDir).startsWith("/nix/store/") && (stat.mode & 63) !== 0) issues.push({
			kind: "state-dir-too-open",
			path: stateDir,
			mode: stat.mode
		});
	} catch {}
	if (params?.configPath && existsFile(params.configPath) && process.platform !== "win32") try {
		const configLstat = fs.lstatSync(params.configPath);
		const isSymlink = configLstat.isSymbolicLink();
		const stat = isSymlink ? fs.statSync(params.configPath) : configLstat;
		if (!(isSymlink ? fs.realpathSync(params.configPath) : params.configPath).startsWith("/nix/store/") && (stat.mode & 63) !== 0) issues.push({
			kind: "config-file-too-open",
			path: params.configPath,
			mode: stat.mode
		});
	} catch {}
	if (stateDirExists) {
		const dirCandidates = /* @__PURE__ */ new Map();
		if (sessionsDir) dirCandidates.set(sessionsDir, "Sessions dir");
		if (storeDir) dirCandidates.set(storeDir, "Session store dir");
		if (requireOAuthDir) dirCandidates.set(oauthDir, "OAuth dir");
		for (const [dir, label] of dirCandidates) {
			if (!existsDir(dir)) {
				if (label === "OAuth dir") {
					issues.push({
						kind: "missing-runtime-dir",
						label,
						path: dir
					});
					continue;
				}
				continue;
			}
			if (!canWriteDir(dir)) {
				const hint = dirPermissionHint(dir);
				issues.push({
					kind: "runtime-dir-not-writable",
					label,
					path: dir,
					...hint ? { hint } : {}
				});
			}
		}
	}
	return issues;
}
function stateIntegrityIssueToHealthFinding(issue) {
	switch (issue.kind) {
		case "mac-cloud-state-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: `State directory is under macOS cloud-synced storage (${issue.storage}), which can cause slow I/O and sync races.`,
			path: issue.path,
			fixHint: "Move OPENCLAW_STATE_DIR to local non-synced storage such as ~/.openclaw."
		};
		case "windows-cloud-state-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: `State directory is under Windows cloud-synced storage (${issue.storage}), which can cause slow I/O, sync races, and Files On-Demand dehydration.`,
			path: issue.path,
			fixHint: "Move OPENCLAW_STATE_DIR to local non-synced storage such as %USERPROFILE%\\.openclaw."
		};
		case "linux-sd-state-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: `State directory appears to be on SD/eMMC storage (${issue.source}, ${issue.fsType}), which can hurt startup and durability.`,
			path: issue.path,
			target: issue.mountPoint,
			fixHint: "Move OPENCLAW_STATE_DIR to SSD/NVMe-backed storage."
		};
		case "linux-volatile-state-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: `State directory is on volatile ${issue.fsType} storage and may disappear on reboot.`,
			path: issue.path,
			target: issue.mountPoint,
			fixHint: "Move OPENCLAW_STATE_DIR to persistent local storage."
		};
		case "missing-state-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "error",
			message: "State directory is missing. Sessions, credentials, logs, and config are stored there.",
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to create the state directory."
		};
		case "state-dir-not-writable": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "error",
			message: issue.hint ? `State directory is not writable. ${issue.hint}` : "State directory is not writable.",
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to repair state directory permissions."
		};
		case "state-dir-too-open": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: "State directory permissions are too open. Recommend chmod 700.",
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to tighten state directory permissions."
		};
		case "config-file-too-open": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "warning",
			message: "Config file is group/world readable. Recommend chmod 600.",
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to tighten config file permissions."
		};
		case "missing-runtime-dir": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "error",
			message: `${issue.label} is missing.`,
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to create missing runtime state directories."
		};
		case "runtime-dir-not-writable": return {
			checkId: STATE_INTEGRITY_CHECK_ID,
			severity: "error",
			message: issue.hint ? `${issue.label} is not writable. ${issue.hint}` : `${issue.label} is not writable.`,
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to repair runtime state directory permissions."
		};
	}
	return assertNeverStateIntegrityIssue(issue);
}
function stateIntegrityIssueToRepairEffect(issue) {
	switch (issue.kind) {
		case "mac-cloud-state-dir":
		case "windows-cloud-state-dir":
		case "linux-sd-state-dir":
		case "linux-volatile-state-dir": return {
			kind: "state",
			action: "would-recommend-moving-state-dir",
			target: issue.path,
			dryRunSafe: true
		};
		case "missing-state-dir": return {
			kind: "state",
			action: "would-create-state-dir",
			target: issue.path,
			dryRunSafe: false
		};
		case "state-dir-not-writable":
		case "state-dir-too-open": return {
			kind: "state",
			action: "would-repair-state-dir-permissions",
			target: issue.path,
			dryRunSafe: false
		};
		case "config-file-too-open": return {
			kind: "file",
			action: "would-tighten-config-file-permissions",
			target: issue.path,
			dryRunSafe: false
		};
		case "missing-runtime-dir": return {
			kind: "state",
			action: "would-create-runtime-state-dir",
			target: issue.path,
			dryRunSafe: false
		};
		case "runtime-dir-not-writable": return {
			kind: "state",
			action: "would-repair-runtime-state-dir-permissions",
			target: issue.path,
			dryRunSafe: false
		};
	}
	return assertNeverStateIntegrityIssue(issue);
}
function assertNeverStateIntegrityIssue(issue) {
	throw new Error(`Unhandled state integrity issue kind: ${String(issue.kind)}`);
}
/** Emits state integrity warnings and applies selected runtime repairs. */
async function noteStateIntegrity(cfg, prompter, configPath, options) {
	const warnings = [];
	const changes = [];
	const noteFn = prompter.note ?? note;
	const env = process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	const stateDir = resolveStateDir(env, homedir);
	const defaultStateDir = path.join(homedir(), ".openclaw");
	const oauthDir = resolveOAuthDir(env, stateDir);
	const runtimeAgentId = tryResolveDefaultAgentId(cfg);
	const runtimeSessionsDir = runtimeAgentId ? resolveSessionTranscriptsDirForAgent(runtimeAgentId, env, homedir) : void 0;
	const runtimeStorePath = runtimeAgentId ? resolveSessionStorePathCore(cfg.session?.store, { agentId: runtimeAgentId }) : void 0;
	const runtimeStoreDir = runtimeStorePath ? path.dirname(runtimeStorePath) : void 0;
	const displayStateDir = shortenHomePath(stateDir);
	const displayOauthDir = shortenHomePath(oauthDir);
	const displayConfigPath = configPath ? shortenHomePath(configPath) : void 0;
	const requireOAuthDir = shouldRequireOAuthDir(cfg, env);
	const cloudSyncedStateDir = detectMacCloudSyncedStateDir(stateDir);
	const windowsCloudSyncedStateDir = detectWindowsCloudSyncedStateDir(stateDir);
	const linuxSdBackedStateDir = detectLinuxSdBackedStateDir(stateDir);
	const linuxVolatileStateDir = detectLinuxVolatileStateDir(stateDir);
	if (cloudSyncedStateDir) warnings.push([
		`- State directory is under macOS cloud-synced storage (${displayStateDir}; ${cloudSyncedStateDir.storage}).`,
		"- This can cause slow I/O and sync/lock races for sessions and credentials.",
		"- Prefer a local non-synced state dir (for example: ~/.openclaw).",
		`  Set locally: OPENCLAW_STATE_DIR=~/.openclaw ${formatCliCommand("openclaw doctor")}`
	].join("\n"));
	if (windowsCloudSyncedStateDir) warnings.push(formatWindowsCloudSyncedStateDirWarning(displayStateDir, windowsCloudSyncedStateDir));
	if (linuxSdBackedStateDir) warnings.push(formatLinuxSdBackedStateDirWarning(displayStateDir, linuxSdBackedStateDir));
	if (linuxVolatileStateDir) warnings.push(formatLinuxVolatileStateDirWarning(displayStateDir, linuxVolatileStateDir));
	let stateDirExists = existsDir(stateDir);
	if (stateDirExists && options?.stateDirExistedAtStart === false) warnings.push(`- State directory was missing at doctor start and was initialized during startup checks (${displayStateDir}).`);
	if (!stateDirExists) {
		warnings.push(`- CRITICAL: state directory missing (${displayStateDir}). Sessions, credentials, logs, and config are stored there.`);
		if (cfg.gateway?.mode === "remote") warnings.push("- Gateway is in remote mode; run doctor on the remote host where the gateway runs.");
		if (await prompter.confirmRuntimeRepair({
			message: `Create ${displayStateDir} now?`,
			initialValue: false
		})) {
			const created = ensureDir(stateDir);
			if (created.ok) {
				changes.push(`- Created ${displayStateDir}`);
				stateDirExists = true;
			} else warnings.push(`- Failed to create ${displayStateDir}: ${created.error}`);
		}
	}
	if (stateDirExists && !canWriteDir(stateDir)) {
		warnings.push(`- State directory not writable (${displayStateDir}).`);
		const hint = dirPermissionHint(stateDir);
		if (hint) warnings.push(`  ${hint}`);
		if (await prompter.confirmRuntimeRepair({
			message: `Repair permissions on ${displayStateDir}?`,
			initialValue: true
		})) try {
			const target = addUserRwx(fs.statSync(stateDir).mode);
			fs.chmodSync(stateDir, target);
			changes.push(`- Repaired permissions on ${displayStateDir}`);
		} catch (err) {
			warnings.push(`- Failed to repair ${displayStateDir}: ${String(err)}`);
		}
	}
	if (stateDirExists && process.platform !== "win32") try {
		const dirLstat = fs.lstatSync(stateDir);
		const isDirSymlink = dirLstat.isSymbolicLink();
		const stat = isDirSymlink ? fs.statSync(stateDir) : dirLstat;
		if (!(isDirSymlink ? fs.realpathSync(stateDir) : stateDir).startsWith("/nix/store/") && (stat.mode & 63) !== 0) {
			warnings.push(`- State directory permissions are too open (${displayStateDir}). Recommend chmod 700.`);
			if (await prompter.confirmRuntimeRepair({
				message: `Tighten permissions on ${displayStateDir} to 700?`,
				initialValue: true
			})) {
				fs.chmodSync(stateDir, 448);
				changes.push(`- Tightened permissions on ${displayStateDir} to 700`);
			}
		}
	} catch (err) {
		warnings.push(`- Failed to read ${displayStateDir} permissions: ${String(err)}`);
	}
	if (configPath && existsFile(configPath) && process.platform !== "win32") try {
		const configLstat = fs.lstatSync(configPath);
		const isSymlink = configLstat.isSymbolicLink();
		const stat = isSymlink ? fs.statSync(configPath) : configLstat;
		if (!(isSymlink ? fs.realpathSync(configPath) : configPath).startsWith("/nix/store/") && (stat.mode & 63) !== 0) {
			warnings.push(`- Config file is group/world readable (${displayConfigPath ?? configPath}). Recommend chmod 600.`);
			if (await prompter.confirmRuntimeRepair({
				message: `Tighten permissions on ${displayConfigPath ?? configPath} to 600?`,
				initialValue: true
			})) {
				fs.chmodSync(configPath, 384);
				changes.push(`- Tightened permissions on ${displayConfigPath ?? configPath} to 600`);
			}
		}
	} catch (err) {
		warnings.push(`- Failed to read config permissions (${displayConfigPath ?? configPath}): ${String(err)}`);
	}
	if (stateDirExists) {
		const dirCandidates = /* @__PURE__ */ new Map();
		if (runtimeSessionsDir) dirCandidates.set(runtimeSessionsDir, "Sessions dir");
		if (runtimeStoreDir) dirCandidates.set(runtimeStoreDir, "Session store dir");
		if (requireOAuthDir) dirCandidates.set(oauthDir, "OAuth dir");
		else if (!existsDir(oauthDir)) warnings.push(`- OAuth dir not present (${displayOauthDir}). Skipping create because no WhatsApp/pairing channel config is active.`);
		for (const [dir, label] of dirCandidates) {
			const displayDir = shortenHomePath(dir);
			if (!existsDir(dir)) {
				if (label !== "OAuth dir") continue;
				warnings.push(`- CRITICAL: ${label} missing (${displayDir}).`);
				if (await prompter.confirmRuntimeRepair({
					message: `Create ${label} at ${displayDir}?`,
					initialValue: true
				})) {
					const created = ensureDir(dir);
					if (created.ok) changes.push(`- Created ${label}: ${displayDir}`);
					else warnings.push(`- Failed to create ${displayDir}: ${created.error}`);
				}
				continue;
			}
			if (!canWriteDir(dir)) {
				warnings.push(`- ${label} not writable (${displayDir}).`);
				const hint = dirPermissionHint(dir);
				if (hint) warnings.push(`  ${hint}`);
				if (await prompter.confirmRuntimeRepair({
					message: `Repair permissions on ${label}?`,
					initialValue: true
				})) try {
					const target = addUserRwx(fs.statSync(dir).mode);
					fs.chmodSync(dir, target);
					changes.push(`- Repaired permissions on ${label}: ${displayDir}`);
				} catch (err) {
					warnings.push(`- Failed to repair ${displayDir}: ${String(err)}`);
				}
			}
		}
	}
	if (path.resolve(stateDir) !== path.resolve(defaultStateDir) && existsDir(defaultStateDir)) warnings.push([
		"- Multiple state directories detected. This can split session history.",
		`  - ${shortenHomePath(defaultStateDir)}`,
		`  Active state dir: ${displayStateDir}`
	].join("\n"));
	const orphanAgentDirs = listOrphanAgentDirs(cfg, stateDir);
	if (orphanAgentDirs.length > 0) {
		const labels = orphanAgentDirs.slice(0, 3).map(({ dirName, agentId }) => dirName === agentId ? agentId : `${dirName} (id ${agentId})`);
		const remaining = orphanAgentDirs.length - labels.length;
		const authoredAgentRosterPath = readAgentRosterProperty(cfg)?.kind === "list" ? "agents.list" : "agents.entries";
		warnings.push([
			`- Found ${countLabel(orphanAgentDirs.length, "agent directory", "agent directories")} on disk without a matching ${authoredAgentRosterPath} entry.`,
			"  These agents can still have sessions/auth state on disk, but config-driven routing, identity, and model selection will ignore them.",
			`  Examples: ${labels.join(", ")}${remaining > 0 ? `, and ${remaining} more` : ""}`,
			`  Restore the missing ${authoredAgentRosterPath} entries or remove stale dirs after confirming they are no longer needed: ${shortenHomePath(path.join(stateDir, "agents"))}`
		].join("\n"));
	}
	if (stateDirExists) warnings.push(...collectRetainedUnconfiguredAgentDatabaseWarnings({
		cfg,
		env
	}));
	const compatibilityAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => resolveConfiguredAgentDatabaseTargets(cfg, { env }));
	const sessionTargets = resolveSessionStoreTargets(cfg, { allAgents: true }, { env }).toSorted((left, right) => left.agentId === compatibilityAgentId ? -1 : right.agentId === compatibilityAgentId ? 1 : 0);
	const inspectAgentSessionIntegrity = async (target, inspectLegacyStore) => {
		const { agentId, storePath } = target;
		const absoluteStorePath = path.resolve(storePath);
		const sqliteStorePath = resolveSqliteTargetFromSessionStorePath(absoluteStorePath, {
			agentId,
			defaultAgentId: compatibilityAgentId,
			env
		}).path;
		if (isRetained(sqliteStorePath, agentId)) return;
		const legacyStore = inspectLegacyStore && existsFile(absoluteStorePath) ? loadLegacySessionStore(absoluteStorePath) : {};
		const legacyEntries = Object.entries(legacyStore).filter((candidate) => candidate[1] != null && typeof candidate[1] === "object");
		const legacySessionKeys = new Set(legacyEntries.map(([sessionKey]) => sessionKey));
		const sqliteSessionKeys = /* @__PURE__ */ new Set();
		const isSessionKeyOccupied = (sessionKey) => sqliteSessionKeys.has(sessionKey) || legacySessionKeys.has(sessionKey);
		const mainKey = resolveCanonicalMainSessionKey({
			agentId,
			mainKey: cfg.session?.mainKey,
			sessionScope: cfg.session?.scope
		});
		const mainRecoveryWedged = [];
		const wedgedSubagentSessions = [];
		const sqlitePluginStateScanner = createPluginSessionStateDoctorScanner({
			agentId,
			cfg,
			env
		});
		const legacyPluginStateScanner = createPluginSessionStateDoctorScanner({
			agentId,
			cfg,
			env
		});
		let mainEntry;
		const inspectMergedEntry = (sessionKey, entry) => {
			if (sessionKey === mainKey) mainEntry = entry;
			if (isSubagentRecoveryWedgedEntry(entry)) wedgedSubagentSessions.push({
				key: sessionKey,
				reason: formatSubagentRecoveryWedgedReason(entry)
			});
		};
		const sqliteEntryCount = scanDoctorSessionEntriesStrict({
			agentId,
			storePath: sqliteStorePath
		}, ({ entry, sessionKey }) => {
			sqliteSessionKeys.add(sessionKey);
			sqlitePluginStateScanner.scanEntry(sessionKey, entry);
			inspectMergedEntry(sessionKey, entry);
			const recovery = inspectMainSessionRecoveryEntry(sessionKey, entry);
			if (recovery) mainRecoveryWedged.push(recovery);
		});
		for (const [sessionKey, entry] of legacyEntries) {
			if (sqliteSessionKeys.has(sessionKey)) continue;
			legacyPluginStateScanner.scanEntry(sessionKey, entry);
			inspectMergedEntry(sessionKey, entry);
		}
		const sessionPathOpts = resolveSessionFilePathOptions({
			agentId,
			storePath
		});
		await noteMainSessionRecoveryIntegrity({
			storePath: sqliteStorePath,
			wedged: mainRecoveryWedged,
			warnings,
			changes,
			confirmRepair: (params) => prompter.confirmRuntimeRepair(params),
			countLabel
		});
		if (sqliteEntryCount > 0 || legacyEntries.length > 0) {
			if (wedgedSubagentSessions.length > 0) {
				const wedgedCount = countLabel(wedgedSubagentSessions.length, "wedged subagent session");
				warnings.push([
					`- Found ${wedgedCount} with automatic restart recovery tombstoned.`,
					"  OpenClaw will not auto-resume these child sessions on restart; reconcile their task records instead.",
					`  Examples: ${wedgedSubagentSessions.slice(0, 3).map(({ key }) => key).join(", ")}`,
					`  Fix: ${formatCliCommand("openclaw tasks maintenance --apply")}`
				].join("\n"));
				if (await prompter.confirmRuntimeRepair({
					message: `Clear stale aborted recovery flags for ${wedgedCount}?`,
					initialValue: true
				})) {
					let repaired = 0;
					const repairedAt = Date.now();
					const sqliteKeys = wedgedSubagentSessions.map(({ key }) => key).filter((key) => sqliteSessionKeys.has(key));
					for (const sessionKeys of iterateDoctorSessionKeyBatches(sqliteKeys)) repaired += await applySessionEntryReplacements({
						agentId,
						sessionKeys,
						storePath: sqliteStorePath,
						update: (currentEntries) => {
							const replacements = currentEntries.flatMap(({ entry, sessionKey }) => clearWedgedSubagentRecoveryAbort(entry, repairedAt) ? [{
								entry,
								sessionKey
							}] : []);
							return {
								replacements,
								result: replacements.length
							};
						}
					});
					const legacyKeys = wedgedSubagentSessions.map(({ key }) => key).filter((key) => !sqliteSessionKeys.has(key));
					if (legacyKeys.length > 0 && existsFile(absoluteStorePath)) await updateLegacySessionStore(absoluteStorePath, (currentStore) => {
						for (const key of legacyKeys) {
							const current = currentStore[key];
							if (current && clearWedgedSubagentRecoveryAbort(current, repairedAt)) {
								repaired += 1;
								currentStore[key] = current;
							}
						}
					});
					if (repaired > 0) changes.push(`- Cleared aborted restart-recovery flags for ${countLabel(repaired, "wedged subagent session")}.`);
				}
				const wedgedReasons = wedgedSubagentSessions.map(({ reason }) => reason);
				const visibleWedgedReasons = uniqueStrings(wedgedReasons).slice(0, 2);
				if (visibleWedgedReasons.length > 0) warnings.push(visibleWedgedReasons.map((reason) => `  Reason: ${reason}`).join("\n"));
			}
			await runPluginSessionStateDoctorRepairs({
				scan: sqlitePluginStateScanner.result(),
				store: {
					kind: "sqlite",
					agentId,
					path: sqliteStorePath
				},
				prompter,
				warnings,
				changes
			});
			await runPluginSessionStateDoctorRepairs({
				scan: legacyPluginStateScanner.result(),
				store: {
					kind: "legacy",
					path: absoluteStorePath
				},
				prompter,
				warnings,
				changes
			});
			if (sqliteSessionKeys.has(mainKey)) mainEntry = loadExactSessionEntryReadOnly({
				agentId,
				sessionKey: mainKey,
				storePath: sqliteStorePath
			})?.entry;
			if (!await repairHeartbeatPoisonedMainSession({
				mainKey,
				mainEntry,
				isSessionKeyOccupied,
				store: sqliteSessionKeys.has(mainKey) ? {
					kind: "sqlite",
					agentId,
					path: sqliteStorePath
				} : {
					kind: "legacy",
					path: absoluteStorePath
				},
				stateDir,
				sessionPathOpts,
				prompter,
				warnings,
				changes
			}) && mainEntry?.sessionId && !sqliteSessionKeys.has(mainKey)) {
				const transcriptPath = resolveSessionFilePathCore(mainEntry.sessionId, mainEntry, sessionPathOpts);
				if (!existsFile(transcriptPath)) warnings.push(`- Main session transcript missing (${shortenHomePath(transcriptPath)}). History will appear to reset.`);
				else {
					const lineCount = countJsonlLines(transcriptPath);
					if (lineCount <= 1) warnings.push(`- Main session transcript has only ${lineCount} line. Session history may not be appending.`);
				}
			}
		}
	};
	const inspectedLegacyStores = /* @__PURE__ */ new Set();
	for (const target of sessionTargets) {
		if (isRetained(target.storePath, target.agentId) || readAgentDatabaseAdmissionRefusal(target.agentId, { env })) continue;
		const legacyStorePath = path.resolve(target.storePath);
		await inspectAgentSessionIntegrity(target, !legacyStorePath.endsWith(".sqlite") && !inspectedLegacyStores.has(legacyStorePath));
		inspectedLegacyStores.add(legacyStorePath);
	}
	for (const warning of describeHeartbeatSessionTargetIssues(cfg)) warnings.push(warning);
	if (warnings.length > 0) noteFn(warnings.join("\n"), "State integrity");
	if (changes.length > 0) noteFn(changes.join("\n"), "Doctor changes");
}
/** Returns the workspace git-backup tip when the workspace exists but is not a git repo. */
function collectWorkspaceBackupTip(workspaceDir) {
	if (!existsDir(workspaceDir)) return null;
	const resolvedWorkspaceDir = safeRealpathSync(workspaceDir);
	if (!resolvedWorkspaceDir || findGitRoot(resolvedWorkspaceDir)) return null;
	return "- Tip: back up the agent workspace in a private git repo; keep ~/.openclaw out of git (credentials, sessions). Details: /concepts/agent-workspace#git-backup-recommended-private";
}
/** Emits the workspace backup tip when applicable. */
function noteWorkspaceBackupTip(workspaceDir) {
	const tip = collectWorkspaceBackupTip(workspaceDir);
	if (tip) note(tip, "Workspace");
}
//#endregion
export { collectWorkspaceBackupTip, detectLinuxSdBackedStateDir, detectLinuxVolatileStateDir, detectMacCloudSyncedStateDir, detectStateIntegrityHealthIssues, detectWindowsCloudSyncedStateDir, formatLinuxSdBackedStateDirWarning, formatLinuxVolatileStateDirWarning, formatWindowsCloudSyncedStateDirWarning, noteStateIntegrity, noteWorkspaceBackupTip, stateIntegrityIssueToHealthFinding, stateIntegrityIssueToRepairEffect };
