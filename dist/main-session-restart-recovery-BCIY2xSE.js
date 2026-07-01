import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as isSubagentSessionKey, i as isCronSessionKey, n as isAcpSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import { c as callGateway } from "./call-Du-jF5Kg.js";
import { f as listAgentRunsForSession, u as getAgentEventLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { b as loadSessionStore } from "./store-DJ7wx5_V.js";
import { n as deliveryContextFromSession, o as normalizeDeliveryContext } from "./delivery-context.shared-D36KNc_D.js";
import { a as resolveSessionFilePath, c as resolveSessionTranscriptPathInDir } from "./paths-CHZBIGhF.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { t as resolveAgentSessionDirs } from "./session-dirs-D4v_ujH0.js";
import { r as resolveAllAgentSessionStoreTargetsSync } from "./targets-7kfDzi_O.js";
import { r as applyRestartRecoveryLifecycle } from "./session-accessor-Dx6KDG0K.js";
import { d as listActiveEmbeddedRunSessionKeys, u as listActiveEmbeddedRunSessionIds } from "./run-state-rO_N-hh3.js";
import { t as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-DHLlIudm.js";
import "./sessions-gBZPP61K.js";
import { o as readSessionMessagesAsync } from "./session-transcript-readers-B1Z-s_uS.js";
import { g as resolveGatewaySessionStoreTarget } from "./session-utils-CWlrm3MP.js";
import { n as resolveSendPolicy } from "./send-policy-D_O9N501.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/agents/main-session-restart-recovery.ts
/**
* Post-restart recovery for main sessions interrupted while holding a transcript lock.
*/
const log = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
const MAX_RECOVERY_RETRIES = 3;
const RETRY_BACKOFF_MULTIPLIER = 2;
const UNRESUMABLE_SESSION_NOTICE = "I was interrupted by a gateway restart and couldn't safely resume the previous turn. Please send that last request again and I'll pick it up cleanly.";
function shouldSkipMainRecovery(entry, sessionKey) {
	if (typeof entry.spawnDepth === "number" && entry.spawnDepth > 0) return true;
	if (entry.subagentRole != null) return true;
	return isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
function normalizeStringSet(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const trimmed = value.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return normalized;
}
function normalizeFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function hasCurrentProcessOwner(params) {
	if (params.activeSessionIds.has(params.entry.sessionId)) return true;
	return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}
function normalizeTranscriptLockPath(lockPath) {
	const trimmed = lockPath.trim();
	if (!path.basename(trimmed).endsWith(".jsonl.lock")) return;
	const resolved = path.resolve(trimmed);
	try {
		return path.join(fs.realpathSync(path.dirname(resolved)), path.basename(resolved));
	} catch {
		return resolved;
	}
}
function resolveEntryTranscriptLockPaths(params) {
	const paths = /* @__PURE__ */ new Set();
	const push = (resolvePath) => {
		try {
			paths.add(path.resolve(`${resolvePath()}.lock`));
		} catch {}
	};
	push(() => resolveSessionFilePath(params.entry.sessionId, params.entry, { sessionsDir: params.sessionsDir }));
	push(() => resolveSessionTranscriptPathInDir(params.entry.sessionId, params.sessionsDir));
	return [...paths];
}
async function markRestartAbortedMainSessions(params) {
	const sessionKeys = normalizeStringSet(params.sessionKeys);
	const sessionIds = normalizeStringSet(params.sessionIds);
	const preferSessionIdMatch = sessionIds.size > 0;
	const activeRuns = [...params.activeRuns ?? []].map((run) => ({
		runId: run.runId.trim(),
		lifecycleGeneration: run.lifecycleGeneration.trim(),
		sessionKey: run.sessionKey.trim(),
		sessionId: run.sessionId.trim(),
		observedAt: normalizeFiniteTimestamp(run.observedAt)
	})).filter((run) => run.runId && run.lifecycleGeneration && (run.sessionKey || run.sessionId));
	const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
	const result = {
		marked: 0,
		skipped: 0
	};
	if (sessionKeys.size === 0 && sessionIds.size === 0) return result;
	const storePaths = /* @__PURE__ */ new Set();
	const env = params.stateDir === void 0 ? process.env : {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const stateDir = resolveStateDir(env);
	const configs = [params.cfg, ...params.additionalCfgs ?? []].filter((cfg) => Boolean(cfg));
	for (const cfg of configs) {
		try {
			for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) storePaths.add(path.resolve(target.storePath));
		} catch (err) {
			log.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
		}
		for (const sessionKey of sessionKeys) try {
			const target = resolveGatewaySessionStoreTarget({
				cfg,
				key: sessionKey
			});
			storePaths.add(path.resolve(target.storePath));
			for (const storeKey of target.storeKeys) {
				const trimmed = storeKey.trim();
				if (trimmed) sessionKeys.add(trimmed);
			}
		} catch (err) {
			log.warn(`failed to resolve session store for restart marker ${sessionKey}: ${String(err)}`);
		}
	}
	for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	for (const storePath of storePaths) {
		const storeResult = await applyRestartRecoveryLifecycle({
			storePath,
			requireWriteSuccess: true,
			update: (entries) => {
				const replacements = [];
				const counts = {
					marked: 0,
					skipped: 0
				};
				for (const { sessionKey, entry } of entries) {
					const registeredActiveRuns = listAgentRunsForSession({
						sessionKey,
						sessionId: entry.sessionId
					});
					const matchingActiveRuns = activeRuns.filter((run) => (run.sessionId ? run.sessionId === entry.sessionId : run.sessionKey === sessionKey) && (entry.status === "running" || run.observedAt === void 0 || normalizeFiniteTimestamp(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
					if (entry.status !== "running" && matchingActiveRuns.length === 0 && registeredActiveRuns.length === 0) continue;
					if (!(typeof entry.sessionId === "string" && sessionIds.has(entry.sessionId) ? true : !preferSessionIdMatch && sessionKeys.has(sessionKey))) continue;
					if (shouldSkipMainRecovery(entry, sessionKey)) {
						counts.skipped++;
						continue;
					}
					const wasRunning = entry.status === "running";
					entry.status = "running";
					entry.abortedLastRun = true;
					if (!wasRunning) {
						entry.startedAt = void 0;
						entry.endedAt = void 0;
						entry.runtimeMs = void 0;
					}
					const recoveryRuns = /* @__PURE__ */ new Map();
					for (const run of entry.restartRecoveryRuns ?? []) if (run.lifecycleGeneration === currentLifecycleGeneration) recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
					const replaceActiveRunMarker = (run) => {
						for (const [key, existingRun] of recoveryRuns) if (existingRun.runId === run.runId) recoveryRuns.delete(key);
						recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
					};
					for (const run of registeredActiveRuns) replaceActiveRunMarker(run);
					for (const run of matchingActiveRuns) replaceActiveRunMarker({
						runId: run.runId,
						lifecycleGeneration: run.lifecycleGeneration
					});
					entry.restartRecoveryRuns = [...recoveryRuns.values()].toSorted((a, b) => a.runId === b.runId ? a.lifecycleGeneration.localeCompare(b.lifecycleGeneration) : a.runId.localeCompare(b.runId));
					entry.updatedAt = Date.now();
					replacements.push({
						sessionKey,
						entry
					});
					counts.marked++;
				}
				return {
					result: counts,
					replacements
				};
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	if (result.marked > 0) log.warn(`marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`);
	return result;
}
async function markStartupOrphanedMainSessionsForRecovery(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const updatedBeforeMs = normalizeFiniteTimestamp(params.updatedBeforeMs);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
		const storeResult = await applyRestartRecoveryLifecycle({
			storePath,
			update: (entries) => {
				const replacements = [];
				const counts = {
					marked: 0,
					skipped: 0
				};
				for (const { sessionKey, entry } of entries) {
					if (entry.status !== "running" || entry.abortedLastRun === true) continue;
					if (shouldSkipMainRecovery(entry, sessionKey)) {
						counts.skipped++;
						continue;
					}
					const updatedAt = normalizeFiniteTimestamp(entry.updatedAt);
					if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs) continue;
					if (hasCurrentProcessOwner({
						activeSessionIds: resolveActiveSessionIds(),
						activeSessionKeys: resolveActiveSessionKeys(),
						entry,
						sessionKey
					})) continue;
					entry.abortedLastRun = true;
					entry.updatedAt = Date.now();
					replacements.push({
						sessionKey,
						entry
					});
					counts.marked++;
				}
				return {
					result: counts,
					replacements
				};
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	if (result.marked > 0) log.warn(`marked ${result.marked} startup-orphaned main session(s) for restart recovery`);
	return result;
}
function getMessageRole(message) {
	if (!message || typeof message !== "object") return;
	const role = message.role;
	return typeof role === "string" ? role : void 0;
}
function isMeaningfulTailMessage(message) {
	const role = getMessageRole(message);
	if (!role || role === "system") return false;
	return true;
}
function isResumableTailMessage(message) {
	const role = getMessageRole(message);
	return role === "user" || role === "tool" || role === "toolResult";
}
function isApprovalPendingToolResult(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "toolResult") return false;
	const details = message.details;
	if (!details || typeof details !== "object") return false;
	return details.status === "approval-pending";
}
function resolveMainSessionResumeBlockReason(messages) {
	const lastMeaningful = messages.toReversed().find(isMeaningfulTailMessage);
	if (!lastMeaningful || !isResumableTailMessage(lastMeaningful)) return "transcript tail is not resumable";
	if (isApprovalPendingToolResult(lastMeaningful)) return "transcript tail is a stale approval-pending tool result";
	return null;
}
function buildResumeMessage(pendingFinalDeliveryText) {
	const base = "[System] Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. Continue from the existing transcript and finish the interrupted response.";
	const sanitizedPendingText = typeof pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(pendingFinalDeliveryText) : "";
	if (sanitizedPendingText) return `${base}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"`;
	return base;
}
async function markSessionFailed(params) {
	await applyRestartRecoveryLifecycle({
		storePath: params.storePath,
		update: (entries) => {
			const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
			if (!entry || entry.status !== "running") return { result: void 0 };
			entry.status = "failed";
			entry.abortedLastRun = true;
			entry.endedAt = Date.now();
			entry.updatedAt = entry.endedAt;
			entry.pendingFinalDelivery = void 0;
			entry.pendingFinalDeliveryText = void 0;
			entry.pendingFinalDeliveryCreatedAt = void 0;
			entry.pendingFinalDeliveryLastAttemptAt = void 0;
			entry.pendingFinalDeliveryAttemptCount = void 0;
			entry.pendingFinalDeliveryLastError = void 0;
			entry.pendingFinalDeliveryContext = void 0;
			entry.restartRecoveryDeliveryContext = void 0;
			entry.restartRecoveryDeliveryRunId = void 0;
			return {
				result: void 0,
				replacements: [{
					sessionKey: params.sessionKey,
					entry
				}]
			};
		}
	});
	log.warn(`marked interrupted main session failed: ${params.sessionKey} (${params.reason})`);
}
async function sendUnresumableSessionNotice(params) {
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	if (!deliveryContext) return false;
	const messageParams = {
		to: deliveryContext.to,
		message: UNRESUMABLE_SESSION_NOTICE,
		bestEffort: true
	};
	if (deliveryContext?.threadId != null) messageParams.threadId = deliveryContext.threadId;
	const actionParams = {
		channel: deliveryContext.channel,
		action: "send",
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		idempotencyKey: `main-session-restart-recovery:${params.entry.sessionId}:failed-notice`,
		params: messageParams
	};
	const accountId = normalizeOptionalString(deliveryContext?.accountId);
	if (accountId) actionParams.accountId = accountId;
	try {
		await callGateway({
			method: "message.action",
			params: actionParams,
			timeoutMs: 1e4
		});
		log.info(`sent interrupted main session recovery notice: ${params.sessionKey} (${params.reason})`);
		return true;
	} catch (err) {
		log.warn(`failed to send interrupted main session recovery notice ${params.sessionKey}: ${String(err)}`);
		return false;
	}
}
function resolveRestartRecoveryDeliveryContext(params) {
	const deliveryContext = normalizeDeliveryContext(params.entry.pendingFinalDeliveryContext) ?? normalizeDeliveryContext(params.entry.restartRecoveryDeliveryContext) ?? (params.includeSessionDeliveryFallback ? deliveryContextFromSession(params.entry) : void 0);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
	if (params.cfg && resolveSendPolicy({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey,
		channel,
		chatType: params.entry.chatType
	}) === "deny") return;
	return {
		...deliveryContext,
		channel,
		to
	};
}
async function resumeMainSession(params) {
	const sanitizedPendingText = typeof params.pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(params.pendingFinalDeliveryText) : "";
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey
	});
	try {
		const agentParams = {
			message: buildResumeMessage(sanitizedPendingText),
			sessionKey: params.sessionKey,
			idempotencyKey: crypto.randomUUID(),
			deliver: Boolean(deliveryContext),
			lane: "main"
		};
		if (deliveryContext) {
			agentParams.channel = deliveryContext.channel;
			agentParams.to = deliveryContext.to;
			agentParams.bestEffortDeliver = true;
			if (deliveryContext.accountId) agentParams.accountId = deliveryContext.accountId;
			if (deliveryContext.threadId != null) agentParams.threadId = String(deliveryContext.threadId);
		}
		await callGateway({
			method: "agent",
			params: agentParams,
			timeoutMs: 1e4
		});
		await applyRestartRecoveryLifecycle({
			storePath: params.storePath,
			update: (entries) => {
				const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
				if (!entry) return { result: void 0 };
				const now = Date.now();
				entry.abortedLastRun = false;
				entry.updatedAt = now;
				if (entry.pendingFinalDelivery || entry.pendingFinalDeliveryText) if (sanitizedPendingText) {
					entry.pendingFinalDeliveryLastAttemptAt = now;
					entry.pendingFinalDeliveryAttemptCount = (entry.pendingFinalDeliveryAttemptCount ?? 0) + 1;
					entry.pendingFinalDeliveryLastError = null;
					entry.pendingFinalDeliveryText = sanitizedPendingText;
				} else {
					entry.pendingFinalDelivery = void 0;
					entry.pendingFinalDeliveryText = void 0;
					entry.pendingFinalDeliveryCreatedAt = void 0;
					entry.pendingFinalDeliveryLastAttemptAt = void 0;
					entry.pendingFinalDeliveryAttemptCount = void 0;
					entry.pendingFinalDeliveryLastError = void 0;
					entry.pendingFinalDeliveryContext = void 0;
				}
				return {
					result: void 0,
					replacements: [{
						sessionKey: params.sessionKey,
						entry
					}]
				};
			}
		});
		log.info(`resumed interrupted main session: ${params.sessionKey}${sanitizedPendingText ? " (with pending payload)" : ""}`);
		return true;
	} catch (err) {
		log.warn(`failed to resume interrupted main session ${params.sessionKey}: ${String(err)}`);
		return false;
	}
}
async function markRestartAbortedMainSessionsFromLocks(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const sessionsDir = path.resolve(params.sessionsDir);
	const interruptedLockPaths = new Set(params.cleanedLocks.map((lock) => normalizeTranscriptLockPath(lock.lockPath)).filter((lockPath) => Boolean(lockPath)));
	if (interruptedLockPaths.size === 0) return result;
	const storeResult = await applyRestartRecoveryLifecycle({
		storePath: path.join(sessionsDir, "sessions.json"),
		update: (entries) => {
			const replacements = [];
			const counts = {
				marked: 0,
				skipped: 0
			};
			for (const { sessionKey, entry } of entries) {
				if (entry.status !== "running") continue;
				if (shouldSkipMainRecovery(entry, sessionKey)) {
					counts.skipped++;
					continue;
				}
				if (!resolveEntryTranscriptLockPaths({
					entry,
					sessionsDir
				}).some((lockPath) => interruptedLockPaths.has(lockPath))) continue;
				entry.abortedLastRun = true;
				replacements.push({
					sessionKey,
					entry
				});
				counts.marked++;
			}
			return {
				result: counts,
				replacements
			};
		}
	});
	result.marked += storeResult.marked;
	result.skipped += storeResult.skipped;
	if (result.marked > 0) log.warn(`marked ${result.marked} interrupted main session(s) from stale transcript locks`);
	return result;
}
function isRoutableRecoveryStore(params) {
	if (!params.cfg) return true;
	if (!params.cfg.session?.store) return true;
	try {
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: params.sessionKey
		});
		return path.resolve(target.storePath) === path.resolve(params.storePath);
	} catch (err) {
		log.warn(`failed to resolve recovery store for ${params.sessionKey}: ${String(err)}`);
		return false;
	}
}
async function recoverStore(params) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	let store;
	try {
		store = loadSessionStore(params.storePath);
	} catch (err) {
		log.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
		result.failed++;
		return result;
	}
	for (const [sessionKey, entry] of Object.entries(store).toSorted(([a], [b]) => a.localeCompare(b))) {
		if (!entry || entry.status !== "running" || entry.abortedLastRun !== true) continue;
		if (shouldSkipMainRecovery(entry, sessionKey)) {
			result.skipped++;
			continue;
		}
		if (!isRoutableRecoveryStore({
			cfg: params.cfg,
			sessionKey,
			storePath: params.storePath
		})) {
			result.skipped++;
			continue;
		}
		if (hasCurrentProcessOwner({
			activeSessionIds: resolveActiveSessionIds(),
			activeSessionKeys: resolveActiveSessionKeys(),
			entry,
			sessionKey
		})) {
			result.skipped++;
			continue;
		}
		const resumeDedupeKey = sessionKey;
		if (params.resumedSessionKeys.has(resumeDedupeKey)) {
			result.skipped++;
			continue;
		}
		if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText) {
			if (await resumeMainSession({
				cfg: params.cfg,
				entry,
				storePath: params.storePath,
				sessionKey,
				pendingFinalDeliveryText: entry.pendingFinalDeliveryText
			})) {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else result.failed++;
			continue;
		}
		let messages;
		try {
			messages = await readSessionMessagesAsync({
				agentId: resolveAgentIdFromSessionKey(sessionKey),
				sessionEntry: entry,
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			}, {
				mode: "recent",
				maxMessages: 20,
				maxBytes: 256 * 1024
			});
		} catch (err) {
			log.warn(`failed to read transcript for ${sessionKey}: ${String(err)}`);
			result.failed++;
			continue;
		}
		const resumeBlockReason = resolveMainSessionResumeBlockReason(messages);
		if (resumeBlockReason) {
			await sendUnresumableSessionNotice({
				cfg: params.cfg,
				entry,
				sessionKey,
				reason: resumeBlockReason
			});
			await markSessionFailed({
				storePath: params.storePath,
				sessionKey,
				reason: resumeBlockReason
			});
			result.failed++;
			continue;
		}
		if (await resumeMainSession({
			cfg: params.cfg,
			entry,
			storePath: params.storePath,
			sessionKey,
			pendingFinalDeliveryText: entry.pendingFinalDeliveryText
		})) {
			params.resumedSessionKeys.add(resumeDedupeKey);
			result.recovered++;
		} else result.failed++;
	}
	return result;
}
async function resolveRestartRecoveryStorePaths(params) {
	const storePaths = /* @__PURE__ */ new Set();
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	if (params.cfg) {
		const env = {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		};
		for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env })) storePaths.add(path.resolve(target.storePath));
	}
	return [...storePaths].toSorted((a, b) => a.localeCompare(b));
}
async function recoverRestartAbortedMainSessions(params = {}) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const resumedSessionKeys = params.resumedSessionKeys ?? /* @__PURE__ */ new Set();
	for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
		const storeResult = await recoverStore({
			cfg: params.cfg,
			storePath,
			resumedSessionKeys,
			activeSessionIds: params.activeSessionIds,
			activeSessionKeys: params.activeSessionKeys
		});
		result.recovered += storeResult.recovered;
		result.failed += storeResult.failed;
		result.skipped += storeResult.skipped;
	}
	if (result.recovered > 0 || result.failed > 0) log.info(`main-session restart recovery complete: recovered=${result.recovered} failed=${result.failed} skipped=${result.skipped}`);
	return result;
}
async function recoverStartupOrphanedMainSessions(params = {}) {
	const startupRecoveryCutoffMs = params.updatedBeforeMs ?? Date.now();
	const marked = await markStartupOrphanedMainSessionsForRecovery({
		cfg: params.cfg,
		stateDir: params.stateDir,
		activeSessionIds: params.activeSessionIds,
		activeSessionKeys: params.activeSessionKeys,
		updatedBeforeMs: startupRecoveryCutoffMs
	});
	const recovered = await recoverRestartAbortedMainSessions({
		cfg: params.cfg,
		stateDir: params.stateDir,
		resumedSessionKeys: params.resumedSessionKeys,
		activeSessionIds: params.activeSessionIds,
		activeSessionKeys: params.activeSessionKeys
	});
	return {
		marked: marked.marked,
		recovered: recovered.recovered,
		failed: recovered.failed,
		skipped: marked.skipped + recovered.skipped
	};
}
function scheduleRestartAbortedMainSessionRecovery(params = {}) {
	const initialDelay = params.delayMs ?? DEFAULT_RECOVERY_DELAY_MS;
	const maxRetries = params.maxRetries ?? MAX_RECOVERY_RETRIES;
	const resumedSessionKeys = /* @__PURE__ */ new Set();
	const startupRecoveryCutoffMs = Date.now();
	const runRecoveryAttempt = (attempt, delay) => {
		recoverStartupOrphanedMainSessions({
			cfg: params.cfg,
			stateDir: params.stateDir,
			resumedSessionKeys,
			updatedBeforeMs: startupRecoveryCutoffMs
		}).then((result) => {
			if (result.failed > 0 && attempt < maxRetries) scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
		}).catch((err) => {
			if (attempt < maxRetries) {
				log.warn(`main-session restart recovery failed: ${String(err)}`);
				scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
			} else log.warn(`main-session restart recovery gave up: ${String(err)}`);
		});
	};
	const scheduleAttempt = (attempt, delay) => {
		if (delay <= 0) {
			runRecoveryAttempt(attempt, delay);
			return;
		}
		setTimeout(() => {
			runRecoveryAttempt(attempt, delay);
		}, delay).unref?.();
	};
	scheduleAttempt(1, initialDelay);
}
//#endregion
export { recoverStartupOrphanedMainSessions as a, recoverRestartAbortedMainSessions as i, markRestartAbortedMainSessionsFromLocks as n, scheduleRestartAbortedMainSessionRecovery as o, markStartupOrphanedMainSessionsForRecovery as r, markRestartAbortedMainSessions as t };
