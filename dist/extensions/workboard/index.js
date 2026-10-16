import { g as readStringValue } from "../../string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "../../number-coercion-CuVhdCBs.mjs";
import { a as resolveGlobalSingleton } from "../../global-singleton-0m-JziJW.mjs";
import { c as isRecord, o as asRecord, t as asNonArrayRecord } from "../../record-coerce-TIsquoVR.mjs";
import { b as redactToolPayloadText } from "../../redact-DJ8j6ADa.mjs";
import { r as isIncognitoSessionKey } from "../../session-key-CmZ4o9-l.mjs";
import { S as isCronSessionKey, l as resolveAgentIdFromSessionKey } from "../../session-key-C09ow4h0.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../security-runtime-CpTHQYW2.mjs";
import { t as safeEqualSecret } from "../../secret-equal-DRsL8lKD.mjs";
import "../../session-key-runtime-CgEY8jLa.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam } from "../../common-Dyxcwsy8.mjs";
import "../../number-runtime-CgyXj1A5.mjs";
import "../../routing-CEr1aXk1.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import "../../core-xGEFuUaI.mjs";
import "../../logging-core-LMmGpAHM.mjs";
import "../../global-singleton-yHEs_vfD.mjs";
import "../../api-Dw-2Dcz5.mjs";
import { d as WORKBOARD_STATUSES, h as redactDispatchResult, m as redactClaimToken } from "../../src-C_j7E0TD.mjs";
import { _ as resolveAgentWorkboardWorkspaceRuntime, a as WorkboardStore, c as cardBoardId, d as cleanupWorkboardCardWorktree, f as isWorkboardWorktreeCleanupCandidate, g as guardWorkboardToolsForWorkspaceAccess, h as canonicalizeWorkboardWorkspaceAccess, i as dispatchAndStartWorkboardCards, l as cardRunId, m as WORKBOARD_SESSIONS_BOARD_TOOL_NAMES, n as registerWorkboardStoreLifecycle, o as workboardCardMatchesLifecycleLink, p as WORKBOARD_CARD_TOOL_NAMES, r as resolveWorkboardSqliteWorkerModuleUrl, s as workboardCardSessionLookupKey, t as registerWorkboardGatewayMethods, u as cardSessionKey, v as resolveCommandWorkboardWorkspaceAccess, y as resolveWorkboardAgentWorkspace } from "../../runtime-api-B44EJAFL.mjs";
import "../../sqlite-store-errors-ClY8dC8v.mjs";
import { t as resolveWorkboardCardByIdOrPrefix } from "../../card-lookup-BoXKYGHH.mjs";
import { Type } from "typebox";
//#region extensions/workboard/src/automation-nudge.ts
const WORKBOARD_AUTOMATION_NUDGE_DEBOUNCE_MS = 6e4;
const WORKBOARD_AUTOMATION_NUDGE_STATE_KEY = Symbol.for("openclaw.workboard.automationNudgeState");
function clearPendingBoardNudges(state) {
	for (const pending of state.pendingByBoard.values()) if (pending.timer) clearTimeout(pending.timer);
	state.pendingByBoard.clear();
}
function getWorkboardAutomationNudgeState() {
	return resolveGlobalSingleton(WORKBOARD_AUTOMATION_NUDGE_STATE_KEY, () => ({ pendingByBoard: /* @__PURE__ */ new Map() }), (state) => {
		state.owner = void 0;
		clearPendingBoardNudges(state);
	});
}
function isCronOriginSession(sessionKey) {
	const normalized = sessionKey?.trim();
	return normalized?.startsWith("cron:") === true || isCronSessionKey(normalized);
}
function createWorkboardAutomationNudgeService(params) {
	let serviceOwner;
	const nudgeBoard = async (boardId, jobId, owner) => {
		const state = getWorkboardAutomationNudgeState();
		if (state.owner !== owner || state.pendingByBoard.has(boardId)) return;
		if (state.pendingByBoard.size >= 2e3) {
			owner.logger.warn(`workboard automation nudge skipped for board ${boardId}: debounce map full`);
			return;
		}
		const pending = {};
		const expiresAt = Date.now() + WORKBOARD_AUTOMATION_NUDGE_DEBOUNCE_MS;
		state.pendingByBoard.set(boardId, pending);
		try {
			const enqueueRun = owner.getCron?.()?.enqueueRun;
			if (!enqueueRun) throw new Error("Workboard automation scheduler is unavailable");
			const result = await enqueueRun(jobId, "if-enabled");
			if (!result.ok || "ran" in result && !result.ran) {
				const reason = "reason" in result ? result.reason : "not-run";
				owner.logger.warn(`workboard automation nudge skipped for board ${boardId}: job ${jobId} ${reason}`);
				return;
			}
			const runId = "runId" in result ? result.runId : void 0;
			owner.logger.info(`workboard automation nudge requested for board ${boardId}: job ${jobId}${runId ? ` run ${runId}` : ""}`);
		} catch (error) {
			if (state.owner === owner) owner.logger.warn(`workboard automation nudge failed for board ${boardId}: ${String(error)}`);
		} finally {
			if (state.owner === owner && state.pendingByBoard.get(boardId) === pending) {
				pending.timer = setTimeout(() => {
					if (state.pendingByBoard.get(boardId) === pending) state.pendingByBoard.delete(boardId);
				}, Math.max(0, expiresAt - Date.now()));
				pending.timer.unref?.();
			}
		}
	};
	return {
		id: "workboard-automation-nudge",
		start(ctx) {
			const state = getWorkboardAutomationNudgeState();
			clearPendingBoardNudges(state);
			state.owner = serviceOwner = {
				logger: ctx.logger,
				getCron: ctx.getCron
			};
		},
		stop() {
			const state = getWorkboardAutomationNudgeState();
			if (state.owner !== serviceOwner) return;
			state.owner = serviceOwner = void 0;
			clearPendingBoardNudges(state);
		},
		async nudge(input) {
			const state = getWorkboardAutomationNudgeState();
			const owner = state.owner;
			if (!owner || isCronOriginSession(input.sessionKey) || input.cards.length === 0) return;
			try {
				const automationByBoard = new Map((await params.store.listBoards()).boards.flatMap((board) => board.automationJobId ? [[board.id, board.automationJobId]] : []));
				const boardIds = new Set(input.cards.map((card) => cardBoardId(card)));
				await Promise.all([...boardIds].flatMap((boardId) => {
					const jobId = automationByBoard.get(boardId);
					return jobId ? [nudgeBoard(boardId, jobId, owner)] : [];
				}));
			} catch (error) {
				if (state.owner === owner) owner.logger.warn(`workboard automation nudge failed: ${String(error)}`);
			}
		}
	};
}
//#endregion
//#region extensions/workboard/src/change-events.ts
const WORKBOARD_EXTERNAL_CHANGE_CHECK_MS = 1e3;
function createWorkboardChangeEventService(store) {
	let unsubscribe;
	let timer;
	let generation = 0;
	let starting;
	let polling;
	return {
		id: "workboard-change-events",
		start(ctx) {
			const gatewayEvents = ctx.gatewayEvents;
			if (!gatewayEvents || unsubscribe) return Promise.resolve();
			if (starting?.generation === generation) return starting.promise;
			const currentGeneration = generation;
			const previous = starting?.promise;
			const pending = (async () => {
				await previous?.catch(() => void 0);
				await store.ready();
				if (currentGeneration !== generation) return;
				const emit = (change) => {
					gatewayEvents.emit("changed", change, { scope: "operator.read" });
				};
				unsubscribe = store.subscribeChanges(emit);
				store.announceChangeEpoch();
				timer = setInterval(() => {
					if (polling) return;
					polling = store.reconcileExternalChanges().then(() => void 0, (error) => {
						ctx.logger.warn(`workboard external change check failed: ${String(error)}`);
					}).finally(() => {
						polling = void 0;
					});
				}, WORKBOARD_EXTERNAL_CHANGE_CHECK_MS);
				timer.unref?.();
			})().finally(() => {
				if (starting?.promise === pending) starting = void 0;
			});
			starting = {
				generation: currentGeneration,
				promise: pending
			};
			return pending;
		},
		stop() {
			generation += 1;
			unsubscribe?.();
			unsubscribe = void 0;
			if (timer) {
				clearInterval(timer);
				timer = void 0;
			}
			return Promise.allSettled([starting?.promise, polling]).then(() => void 0);
		}
	};
}
//#endregion
//#region extensions/workboard/src/command.ts
const ADMIN_SCOPE = "operator.admin";
const WRITE_SCOPE = "operator.write";
function formatCardLine(card) {
	const boardId = card.metadata?.automation?.boardId ?? "default";
	const agent = card.agentId ? ` @${card.agentId}` : "";
	return `${card.id.slice(0, 8)} ${card.status.padEnd(8)} ${card.priority.padEnd(6)} [${boardId}]${agent} ${card.title}`;
}
function formatCardDetails(card) {
	const lines = [
		card.title,
		`id: ${card.id}`,
		`status: ${card.status}`,
		`priority: ${card.priority}`,
		`board: ${card.metadata?.automation?.boardId ?? "default"}`
	];
	if (card.agentId) lines.push(`agent: ${card.agentId}`);
	if (card.sessionKey) lines.push(`session: ${card.sessionKey}`);
	if (card.runId) lines.push(`run: ${card.runId}`);
	if (card.metadata?.archivedAt) lines.push("archived: yes (excluded from dispatch)");
	if (card.notes) lines.push("", card.notes);
	return lines.join("\n");
}
function requireWriteAccess(params) {
	const scopes = params.gatewayClientScopes;
	if (scopes ? scopes.includes(ADMIN_SCOPE) || scopes.includes(WRITE_SCOPE) : params.senderIsOwner === true) return;
	return {
		text: `This command requires gateway scope: ${WRITE_SCOPE}.`,
		isError: true
	};
}
async function handleWorkboardCommand(params) {
	const [action = "list", ...rest] = (params.args ?? "").trim().split(/\s+/).filter(Boolean);
	if (action === "help") return { text: [
		"/workboard list",
		"/workboard show <card-id>",
		"/workboard create <title>",
		"/workboard move <card-id> --status <status>",
		"/workboard dispatch"
	].join("\n") };
	if (action === "list") {
		const rows = (await params.store.list()).filter((card) => !card.metadata?.archivedAt).slice(0, 12).map(formatCardLine);
		return { text: rows.length ? rows.join("\n") : "No Workboard cards." };
	}
	if (action === "show" || action === "read") {
		const id = rest[0];
		if (!id) return {
			text: "Usage: /workboard show <card-id>",
			isError: true
		};
		const cards = await params.store.list();
		const { card, error } = resolveWorkboardCardByIdOrPrefix(cards, id);
		return card ? { text: formatCardDetails(card) } : {
			text: error,
			isError: true
		};
	}
	if (action === "create" || action === "move" || action === "dispatch") {
		const accessError = requireWriteAccess(params);
		if (accessError) return accessError;
	}
	if (action === "create") {
		const title = rest.join(" ").trim();
		if (!title) return {
			text: "Usage: /workboard create <title>",
			isError: true
		};
		const workspaceAccess = await canonicalizeWorkboardWorkspaceAccess(params.workspaceAccess ?? { unrestricted: true });
		const card = await params.store.create({
			title,
			workspaceAccess
		}, void 0, params.assertOwnerCurrent);
		return { text: `Created ${card.id.slice(0, 8)} ${card.title}` };
	}
	if (action === "move") {
		const id = rest[0];
		const statusIndex = rest.indexOf("--status");
		const status = statusIndex >= 0 ? rest[statusIndex + 1] : void 0;
		if (!id || !status) return {
			text: "Usage: /workboard move <card-id> --status <status>",
			isError: true
		};
		if (!WORKBOARD_STATUSES.includes(status)) return {
			text: `status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`,
			isError: true
		};
		const cards = await params.store.list();
		const { card, error } = resolveWorkboardCardByIdOrPrefix(cards, id);
		if (!card) return {
			text: error,
			isError: true
		};
		return { text: formatCardLine(await params.store.move(card.id, status, void 0, void 0, { assertOwnerCurrent: params.assertOwnerCurrent })) };
	}
	if (action === "dispatch") {
		const workspaceAccess = params.workspaceAccess ?? { unrestricted: true };
		const result = await dispatchAndStartWorkboardCards({
			store: params.store,
			subagent: params.api.runtime.subagent,
			worktrees: params.api.runtime.worktrees,
			options: {
				materializeWorktree: true,
				resolveAgentWorkspace: params.resolveAgentWorkspace,
				resolveAgentWorkspaceRuntime: params.resolveAgentWorkspaceRuntime,
				workspaceAccess,
				assertOwnerCurrent: params.assertOwnerCurrent
			}
		});
		return { text: [
			`dispatch: started=${result.started.length} failures=${result.startFailures.length} promoted=${result.promoted.length} blocked=${result.blocked.length}`,
			...result.started.map((run) => `started ${run.cardId.slice(0, 8)} run=${run.runId}`),
			...result.startFailures.map((failure) => `failed ${failure.cardId.slice(0, 8)} ${failure.error}`)
		].join("\n") };
	}
	return {
		text: `Unknown Workboard action: ${action}`,
		isError: true
	};
}
function registerWorkboardCommand(params) {
	params.api.registerCommand({
		name: "workboard",
		description: "List, create, inspect, and dispatch Workboard cards.",
		acceptsArgs: true,
		exposeSenderIsOwner: true,
		handler: async (ctx) => await handleWorkboardCommand({
			api: params.api,
			store: params.store,
			args: ctx.args,
			senderIsOwner: ctx.senderIsOwner,
			assertOwnerCurrent: ctx.gatewayClientScopes ? void 0 : ctx.assertOwnerCurrent,
			gatewayClientScopes: ctx.gatewayClientScopes,
			resolveAgentWorkspace: (agentId) => resolveWorkboardAgentWorkspace(ctx.config, agentId),
			resolveAgentWorkspaceRuntime: (agentId, sessionKey, workspaceDir, modelProvider, modelId) => resolveAgentWorkboardWorkspaceRuntime({
				config: ctx.config,
				agentId,
				sessionKey,
				workspaceDir,
				modelProvider,
				modelId,
				prepareSandboxWorkspaceAuthority: params.api.runtime.sandbox.prepareWorkspaceAuthority
			}),
			workspaceAccess: resolveCommandWorkboardWorkspaceAccess({
				config: ctx.config,
				agentId: ctx.agentId,
				sessionKey: ctx.sessionKey,
				gatewayClientScopes: ctx.gatewayClientScopes,
				resolveSandboxWorkspaceAuthority: params.api.runtime.sandbox.resolveWorkspaceAuthority
			})
		})
	});
}
//#endregion
//#region extensions/workboard/src/lifecycle-sync.ts
const WORKBOARD_LIFECYCLE_SWEEP_MS = 6e4;
const WORKBOARD_STALE_SESSION_MS = 18e5;
const WORKBOARD_SESSION_SWEEP_LIMIT = 1e4;
const WORKBOARD_WORKTREE_CLEANUP_SWEEP_LIMIT = 32;
const workboardLifecycleGatewayState = resolveGlobalSingleton(Symbol.for("openclaw.workboard.lifecycleGatewayState"), () => ({ ready: false }), (state) => {
	state.ready = false;
	state.abortSignal = void 0;
});
function sessionProvesPreparedAcceptance(session) {
	return session.hasActiveRun === true || session.status === "done" || session.status === "failed" || session.status === "killed" || session.status === "timeout";
}
function needsWorkboardLifecycleReconciliation(card) {
	if (card.metadata?.archivedAt) return false;
	return Boolean(card.sessionKey || card.runId || card.execution || card.status === "running" || card.metadata?.claim || card.metadata?.stale);
}
const LIFECYCLE_TARGETS = {
	running: {
		card: "running",
		execution: "running"
	},
	succeeded: {
		card: "review",
		execution: "review"
	},
	failed: {
		card: "blocked",
		execution: "blocked"
	},
	idle: { execution: "idle" },
	stale: {
		card: "running",
		execution: "running"
	}
};
async function syncWorkboardCardLifecycle(params) {
	const target = LIFECYCLE_TARGETS[params.observation.state];
	return await params.store.syncLifecycle(params.cardId, {
		targetStatus: "card" in target ? target.card : void 0,
		executionStatus: "execution" in target ? target.execution : void 0,
		sourceUpdatedAt: params.observation.sourceUpdatedAt,
		stale: params.observation.stale,
		now: params.now,
		...params.association ? { association: params.association } : {}
	});
}
async function syncWorkboardLifecycleEvent(params) {
	const cards = (await params.store.list()).filter((card) => !card.metadata?.archivedAt && workboardCardMatchesLifecycleLink(card, params.source));
	const updates = Promise.all(cards.map(async (card) => await syncWorkboardCardLifecycle({
		...params,
		cardId: card.id,
		...params.source.sessionKey ? { association: {
			...cardSessionKey(card) ? { expectedSessionKey: cardSessionKey(card) } : {},
			...cardRunId(card) ? { expectedRunId: cardRunId(card) } : {},
			sessionKey: params.source.sessionKey,
			...params.source.runId ? { runId: params.source.runId } : {},
			acceptedAt: params.observation.sourceUpdatedAt ?? params.now
		} } : {}
	})));
	await Promise.all([updates, params.onMatched?.({
		cards,
		...params.source.sessionKey ? { sessionKey: params.source.sessionKey } : {}
	})]);
	return {
		cards,
		count: (await updates).filter(Boolean).length
	};
}
async function syncWorkboardSubagentEnded(params) {
	const now = params.now ?? Date.now();
	const synced = await syncWorkboardLifecycleEvent({
		store: params.store,
		source: {
			sessionKey: params.event.targetSessionKey,
			runId: params.event.runId
		},
		observation: {
			state: params.event.outcome === "ok" ? "succeeded" : "failed",
			sourceUpdatedAt: params.event.endedAt ?? now
		},
		now,
		...params.onMatched ? { onMatched: params.onMatched } : {}
	});
	if (params.worktrees) for (const matched of synced.cards) {
		const card = await params.store.get(matched.id);
		if (card) await cleanupWorkboardCardWorktree({
			store: params.store,
			worktrees: params.worktrees,
			card
		});
	}
	return synced.count;
}
async function syncWorkboardAgentEnded(params) {
	const now = params.now ?? Date.now();
	return (await syncWorkboardLifecycleEvent({
		store: params.store,
		source: {
			sessionKey: params.context.sessionKey,
			runId: params.event.runId ?? params.context.runId
		},
		observation: {
			state: params.event.success ? "succeeded" : "failed",
			sourceUpdatedAt: now
		},
		now,
		...params.onMatched ? { onMatched: params.onMatched } : {}
	})).count;
}
function lifecycleFromSession(session, now) {
	const sourceUpdatedAt = session.updatedAt;
	if (session.status === "running" && session.hasActiveRun === false && sourceUpdatedAt !== void 0 && now - sourceUpdatedAt >= WORKBOARD_STALE_SESSION_MS) return {
		state: "stale",
		sourceUpdatedAt,
		stale: {
			detectedAt: now,
			lastSessionUpdatedAt: sourceUpdatedAt,
			reason: "Linked session has not reported recent activity."
		}
	};
	if (session.hasActiveRun === true || session.status === "running") return {
		state: "running",
		sourceUpdatedAt
	};
	if (session.abortedLastRun || session.status === "failed" || session.status === "killed" || session.status === "timeout") return {
		state: "failed",
		sourceUpdatedAt
	};
	if (session.status === "done") return {
		state: "succeeded",
		sourceUpdatedAt
	};
	return {
		state: "idle",
		sourceUpdatedAt
	};
}
async function syncWorkboardLifecycleSessions(params) {
	const now = params.now ?? Date.now();
	const sessionsByKey = /* @__PURE__ */ new Map();
	const sessionsByWorkboardSuffix = /* @__PURE__ */ new Map();
	const ambiguousWorkboardSuffixes = /* @__PURE__ */ new Set();
	for (const session of params.sessions) {
		sessionsByKey.set(session.key, session);
		const suffixIndex = session.key.lastIndexOf(":subagent:workboard-");
		if (suffixIndex >= 0) {
			const suffix = session.key.slice(suffixIndex + 1);
			const existing = sessionsByWorkboardSuffix.get(suffix);
			if (existing && existing.key !== session.key) {
				sessionsByWorkboardSuffix.delete(suffix);
				ambiguousWorkboardSuffixes.add(suffix);
			} else if (!ambiguousWorkboardSuffixes.has(suffix)) sessionsByWorkboardSuffix.set(suffix, session);
		}
	}
	let count = 0;
	for (const card of params.cards ?? await params.store.list()) {
		if (card.metadata?.archivedAt) continue;
		const lookupKey = workboardCardSessionLookupKey(card);
		const suffixIndex = lookupKey.lastIndexOf("subagent:workboard-");
		const linkedSessionKey = cardSessionKey(card);
		const canUseAgentlessFallback = linkedSessionKey?.startsWith("subagent:workboard-") === true || !linkedSessionKey && (!card.agentId || card.agentId === "workboard-dispatcher" && card.metadata?.claim?.ownerId === "workboard-dispatcher");
		const session = sessionsByKey.get(lookupKey) ?? (canUseAgentlessFallback && suffixIndex >= 0 ? sessionsByWorkboardSuffix.get(lookupKey.slice(suffixIndex)) : void 0);
		const launch = card.metadata?.automation?.launch;
		const preparedAcceptanceAt = launch?.phase === "prepared" && session && sessionProvesPreparedAcceptance(session) ? session.hasActiveRun === true ? Math.max(now, launch.preparedAt) : session.updatedAt : void 0;
		if (launch?.phase === "prepared" && (preparedAcceptanceAt === void 0 || preparedAcceptanceAt < launch.preparedAt)) {
			if (params.complete && await params.store.failPreparedLaunch(card.id, {
				expectedLaunch: launch,
				reason: "Gateway did not accept the prepared Workboard session before restart.",
				failedAt: now
			})) count += 1;
			continue;
		}
		if (!session) continue;
		const observation = lifecycleFromSession(session, now);
		if (await syncWorkboardCardLifecycle({
			store: params.store,
			cardId: card.id,
			observation,
			now,
			association: {
				...cardSessionKey(card) ? { expectedSessionKey: cardSessionKey(card) } : {},
				...cardRunId(card) ? { expectedRunId: cardRunId(card) } : {},
				sessionKey: session.key,
				...preparedAcceptanceAt === void 0 ? {} : { acceptedAt: preparedAcceptanceAt }
			}
		})) count += 1;
	}
	return count;
}
function normalizeSession(value) {
	if (!isRecord(value) || typeof value.key !== "string" || !value.key) return;
	const status = value.status === "running" || value.status === "done" || value.status === "failed" || value.status === "killed" || value.status === "timeout" ? value.status : void 0;
	return {
		key: value.key,
		...typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt) ? { updatedAt: value.updatedAt } : {},
		...status ? { status } : {},
		...typeof value.hasActiveRun === "boolean" ? { hasActiveRun: value.hasActiveRun } : {},
		...value.abortedLastRun === true ? { abortedLastRun: true } : {}
	};
}
async function readWorkboardLifecycleSessions(gateway, options = { includeUnknown: false }) {
	if (!await gateway.isAvailable()) return {
		sessions: [],
		complete: false
	};
	let includeUnknown = false;
	if (options.includeUnknown) {
		const agentsPayload = await gateway.request("agents.list", {}, { scopes: ["operator.read"] });
		if (!isRecord(agentsPayload) || typeof agentsPayload.selectionRequired !== "boolean") throw new Error("agents.list returned an invalid ownership snapshot");
		includeUnknown = !agentsPayload.selectionRequired;
	}
	const payload = await gateway.request("sessions.list", {
		limit: WORKBOARD_SESSION_SWEEP_LIMIT,
		configuredAgentsOnly: true,
		includeGlobal: false,
		includeUnknown
	}, { scopes: ["operator.read"] });
	if (!isRecord(payload) || !Array.isArray(payload.sessions)) throw new Error("sessions.list returned an invalid lifecycle snapshot");
	return {
		sessions: payload.sessions.flatMap((value) => {
			const session = normalizeSession(value);
			return session ? [session] : [];
		}),
		complete: payload.sessions.length < WORKBOARD_SESSION_SWEEP_LIMIT
	};
}
function createWorkboardLifecycleService(params) {
	let generation = 0;
	let timer;
	let begin;
	let removeDrainListener;
	let cleanupCursor = 0;
	const cleanupWorktrees = async (cards, warn) => {
		if (!params.worktrees) return;
		const candidates = cards.filter(isWorkboardWorktreeCleanupCandidate);
		const start = cleanupCursor % Math.max(candidates.length, 1);
		const batch = [...candidates.slice(start), ...candidates.slice(0, start)].slice(0, WORKBOARD_WORKTREE_CLEANUP_SWEEP_LIMIT);
		cleanupCursor = candidates.length === 0 ? 0 : (start + batch.length) % candidates.length;
		for (const card of batch) try {
			await cleanupWorkboardCardWorktree({
				store: params.store,
				worktrees: params.worktrees,
				card
			});
		} catch (error) {
			warn(`workboard worktree cleanup failed for card ${card.id}: ${String(error)}`);
		}
	};
	const stop = () => {
		removeDrainListener?.();
		removeDrainListener = void 0;
		generation += 1;
		begin = void 0;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const onGatewayStop = () => {
		workboardLifecycleGatewayState.ready = false;
		workboardLifecycleGatewayState.abortSignal = void 0;
		stop();
	};
	const beginWhenGatewayReady = () => {
		if (!workboardLifecycleGatewayState.ready) return;
		removeDrainListener?.();
		const signal = workboardLifecycleGatewayState.abortSignal;
		if (signal?.aborted) {
			onGatewayStop();
			return;
		}
		signal?.addEventListener("abort", onGatewayStop, { once: true });
		removeDrainListener = () => signal?.removeEventListener("abort", onGatewayStop);
		begin?.();
	};
	return {
		id: "workboard-lifecycle-sync",
		start(ctx) {
			const owner = ++generation;
			let begun = false;
			const reconcile = async () => {
				try {
					await params.store.runOperation(async () => {
						let cards = await params.store.list();
						if (generation !== owner) return;
						if (cards.some((card) => needsWorkboardLifecycleReconciliation(card))) try {
							const snapshot = await params.readSessions({ includeUnknown: cards.some((card) => !card.metadata?.archivedAt && cardSessionKey(card) === "unknown") });
							if (generation !== owner) return;
							await syncWorkboardLifecycleSessions({
								store: params.store,
								cards,
								...snapshot,
								now: params.now?.() ?? Date.now()
							});
							if (generation !== owner) return;
							cards = await params.store.list();
						} catch (error) {
							if (generation === owner) ctx.logger.warn(`workboard lifecycle sync failed: ${String(error)}`);
						}
						if (generation === owner) await cleanupWorktrees(cards, (message) => ctx.logger.warn(message));
					});
				} catch (error) {
					if (generation === owner) ctx.logger.warn(`workboard lifecycle recovery failed: ${String(error)}`);
				} finally {
					if (generation === owner) {
						timer = setTimeout(() => void reconcile(), WORKBOARD_LIFECYCLE_SWEEP_MS);
						timer.unref?.();
					}
				}
			};
			begin = () => {
				if (generation !== owner || begun) return;
				begun = true;
				reconcile();
			};
			beginWhenGatewayReady();
		},
		stop,
		onGatewayStart(abortSignal) {
			workboardLifecycleGatewayState.ready = true;
			workboardLifecycleGatewayState.abortSignal = abortSignal;
			beginWhenGatewayReady();
		},
		onGatewayStop
	};
}
//#endregion
//#region extensions/workboard/src/sessions-board-rules.ts
function sessionMatchesColumn(facts, column) {
	if (!column.match) return false;
	return (Array.isArray(column.match) ? column.match : [column.match]).some((match) => (match.health === void 0 || facts.observerDigest !== void 0 && match.health.includes(facts.observerDigest.health)) && (match.run === void 0 || match.run.includes(facts.run)) && (match.archived === void 0 || match.archived === facts.archived) && (match.pullRequest === void 0 || !facts.pullRequestsUnavailable && (facts.pullRequests.length === 0 ? match.pullRequest.includes("none") : facts.pullRequests.some((pr) => match.pullRequest?.includes(pr.state)))));
}
function sessionsBoardFallback(board) {
	const column = board.sessions.columns.find((entry) => entry.fallback);
	if (!column) throw new Error("Sessions board requires a fallback column.");
	return column;
}
//#endregion
//#region extensions/workboard/src/sessions-board.ts
const FACTS_BATCH_SIZE = 40;
function activeState() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workboard.sessionsBoardService"), () => ({}), (state) => {
		state.owner?.cancel();
		state.owner = void 0;
	});
}
/** Uses the existing Gateway session-list owner in the invoking caller's scope. */
async function listSessions(gateway, board, view) {
	const sessions = /* @__PURE__ */ new Map();
	let people;
	let offset = 0;
	for (;;) {
		const payload = await gateway.request("sessions.list", {
			limit: 1e3,
			offset,
			configuredAgentsOnly: true,
			includeGlobal: false,
			includeUnknown: false,
			archived: board.sessions.scope?.includeArchived ? "all" : false,
			sortBy: "activity",
			activeMinutes: Math.max(1, Math.ceil((board.sessions.scope?.maxAgeHours ?? 72) * 60)),
			...board.sessions.scope?.agentIds?.length === 1 ? { agentId: board.sessions.scope.agentIds[0] } : {},
			...view
		}, { scopes: ["operator.read"] });
		if (!isRecord(payload) || !Array.isArray(payload.sessions)) throw new Error("sessions.list returned an invalid Sessions board roster.");
		if (offset === 0 && view?.includePeople) people = payload.people;
		for (const session of payload.sessions) if (isRecord(session) && typeof session.key === "string" && typeof session.sessionId === "string" && session.visibility !== "draft" && session.incognito !== true && !isIncognitoSessionKey(session.key)) sessions.set(session.key, {
			key: session.key,
			sessionId: session.sessionId,
			agentId: resolveAgentIdFromSessionKey(session.key),
			label: typeof session.label === "string" ? session.label : void 0,
			derivedTitle: typeof session.derivedTitle === "string" ? session.derivedTitle : void 0,
			run: "idle",
			pullRequests: [],
			pullRequestsUnavailable: true,
			archived: session.archived === true,
			lastActivityAt: typeof session.lastActivityAt === "number" ? session.lastActivityAt : typeof session.updatedAt === "number" ? session.updatedAt : Date.now()
		});
		if (payload.hasMore !== true) return {
			sessions,
			people
		};
		const next = payload.nextOffset;
		if (typeof next !== "number" || !Number.isSafeInteger(next) || next <= offset) throw new Error("sessions.list returned an invalid Sessions board page cursor.");
		offset = next;
	}
}
function inScope(facts, board, now) {
	const scope = board.sessions.scope;
	return facts.key !== board.sessions.agentSessionKey && (!scope?.agentIds?.length || scope.agentIds.includes(facts.agentId)) && (scope?.includeArchived === true || !facts.archived) && facts.lastActivityAt >= now - (scope?.maxAgeHours ?? 72) * 36e5;
}
function createOwner(params, context, isCurrent) {
	const cache = /* @__PURE__ */ new Map();
	const refreshes = /* @__PURE__ */ new Map();
	const reads = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	let stopped = false;
	let hasRead = false;
	let factsFailureLogged = false;
	let timer;
	const assertCurrent = () => {
		if (stopped || !isCurrent()) throw new Error("Sessions board service is no longer active.");
	};
	const interactiveAuthority = (caller) => () => {
		assertCurrent();
		caller?.assertCurrent();
	};
	const unsubscribe = params.gateway.subscribeSessionChanges(({ sessionKey }) => {
		const previous = cache.get(sessionKey);
		if (stopped || !hasRead) return;
		if (previous) cache.set(sessionKey, {
			...previous,
			dirty: true
		});
		if (timer) return;
		timer = setTimeout(() => {
			timer = void 0;
			if (!stopped && isCurrent()) params.store.announceChangeEpoch();
		}, 5e3);
		timer.unref?.();
	});
	const read = async (id, view, caller) => {
		const assertReadCurrent = interactiveAuthority(caller);
		assertReadCurrent();
		const board = await params.store.getSessionsBoard(id);
		hasRead = true;
		const { sessions: roster, people } = await listSessions(params.gateway, board, view);
		assertReadCurrent();
		const unavailable = /* @__PURE__ */ new Set();
		const reasons = /* @__PURE__ */ new Set();
		const omitted = /* @__PURE__ */ new Set();
		while (refreshes.has(id)) {
			await refreshes.get(id)?.catch(() => {});
			assertReadCurrent();
		}
		const missing = [...roster.values()].filter((row) => {
			const cached = cache.get(row.key);
			return row.key !== board.sessions.agentSessionKey && (!cached || cached.sessionId !== row.sessionId || cached.dirty);
		});
		const refresh = async () => {
			for (let offset = 0; offset < missing.length; offset += FACTS_BATCH_SIZE) {
				const batch = missing.slice(offset, offset + FACTS_BATCH_SIZE);
				for (const row of batch) if (cache.get(row.key)?.sessionId !== row.sessionId) cache.set(row.key, {
					sessionId: row.sessionId,
					dirty: true
				});
				const before = new Map(batch.map((row) => [row.key, cache.get(row.key)]));
				try {
					const result = await params.gateway.readSessionFacts({ sessionKeys: batch.map((row) => row.key) });
					assertReadCurrent();
					const returned = new Map(result.sessions.map((facts) => [facts.key, facts]));
					for (const row of batch) {
						const facts = returned.get(row.key);
						if (!facts || facts.sessionId !== row.sessionId) {
							omitted.add(row.key);
							if (cache.get(row.key) === before.get(row.key)) cache.delete(row.key);
						} else if (cache.get(row.key) === before.get(row.key)) cache.set(row.key, {
							sessionId: facts.sessionId,
							facts,
							dirty: false
						});
					}
				} catch (error) {
					assertReadCurrent();
					for (const row of batch) unavailable.add(row.key);
					reasons.add(redactToolPayloadText(String(error)).replace(/\s+/g, " ").slice(0, 300));
				}
			}
		};
		if (missing.length) {
			const computation = refresh();
			refreshes.set(id, computation);
			try {
				await computation;
			} finally {
				if (refreshes.get(id) === computation) refreshes.delete(id);
			}
		}
		const placements = new Map((await params.store.listSessionPlacements(id)).map((entry) => [entry.sessionKey, entry]));
		assertReadCurrent();
		const fallback = sessionsBoardFallback(board);
		const sessions = [];
		for (const row of roster.values()) {
			if (omitted.has(row.key)) continue;
			const cached = cache.get(row.key);
			const known = cached?.sessionId === row.sessionId ? cached.facts : void 0;
			const facts = known ?? row;
			if (!inScope(facts, board, now())) continue;
			const pin = placements.get(row.key);
			const pinned = pin?.source === "operator" && board.sessions.columns.some((column) => column.id === pin.columnId);
			const match = known ? board.sessions.columns.find((column) => sessionMatchesColumn(facts, column)) : void 0;
			sessions.push({
				...facts,
				columnId: pinned ? pin.columnId : (match ?? fallback).id,
				source: pinned ? "operator" : "state",
				reason: pinned ? pin.reason : !known || !match && facts.pullRequestsUnavailable ? "facts-unavailable" : match ? "Matched column rules" : "fallback"
			});
		}
		const warnings = [];
		if (unavailable.size) {
			const warning = `Session facts are unavailable for ${unavailable.size} sessions: ${[...reasons].join("; ")}. Showing the last known placement.`;
			warnings.push(warning);
			if (!factsFailureLogged) context.logger.warn(warning);
			factsFailureLogged = true;
		} else factsFailureLogged = false;
		if (sessions.some((session) => session.pullRequestsUnavailable)) warnings.push("Some pull-request information is unavailable. The board updates when background facts are ready.");
		return {
			board,
			columns: board.sessions.columns,
			sessions,
			...people !== void 0 ? { people } : {},
			...warnings.length ? { warning: warnings.join(" ") } : {}
		};
	};
	const cancel = () => {
		stopped = true;
		unsubscribe();
		if (timer) clearTimeout(timer);
		timer = void 0;
		cache.clear();
	};
	return {
		read(id, view, caller) {
			if (caller) return read(id, view, caller);
			const key = JSON.stringify([id, view]);
			const pending = reads.get(key);
			if (pending) return pending;
			const computation = read(id, view).finally(() => {
				if (reads.get(key) === computation) reads.delete(key);
			});
			reads.set(key, computation);
			return computation;
		},
		cancel,
		async stop() {
			cancel();
		},
		async update(id, patch, caller) {
			const assertWriteCurrent = interactiveAuthority(caller);
			assertWriteCurrent();
			return await params.store.updateSessionsBoard(id, patch, assertWriteCurrent);
		},
		async move(id, sessionKey, columnId, caller) {
			const assertWriteCurrent = interactiveAuthority(caller);
			assertWriteCurrent();
			const board = await params.store.getSessionsBoard(id);
			if (!board.sessions.columns.some((column) => column.id === columnId)) throw new Error("Unknown Sessions board column.");
			const { sessions: visible } = await listSessions(params.gateway, board);
			if (!visible.has(sessionKey)) throw new Error("Session is not available in this board's scope.");
			if (!(await params.gateway.readSessionFacts({ sessionKeys: [sessionKey] })).sessions.find((entry) => entry.key === sessionKey && entry.sessionId === visible.get(sessionKey)?.sessionId && inScope(entry, board, now()))) throw new Error("Session is not available in this board's scope.");
			const previous = (await params.store.listSessionPlacements(id)).find((entry) => entry.sessionKey === sessionKey);
			if (!await params.store.writeSessionPlacement(id, {
				sessionKey,
				columnId,
				source: "operator",
				reason: "Moved by operator",
				factsHash: "",
				updatedAt: now(),
				expectedUpdatedAt: previous?.updatedAt
			}, {
				expectedSpec: board.sessions,
				assertCurrent: assertWriteCurrent
			})) throw new Error("Sessions board changed. Refresh and retry the move.");
			return await read(id, void 0, caller);
		}
	};
}
/** Prepared tool registries delegate to the one running plugin service. */
function createWorkboardSessionsBoardService(params) {
	let owned;
	const current = () => {
		const owner = activeState().owner;
		if (!owner) throw new Error("Sessions board service is unavailable.");
		return owner;
	};
	return {
		id: "workboard-sessions-board",
		async start(context) {
			const state = activeState();
			await state.owner?.stop();
			state.owner = void 0;
			const repaired = await params.store.repairSessionPlacements();
			if (repaired.placements) context.logger.info(`Sessions board removed ${repaired.placements} non-operator placements.`);
			if (repaired.boards) context.logger.info(`Sessions board updated default rules on ${repaired.boards} boards.`);
			const owner = createOwner(params, context, () => activeState().owner === owner);
			owned = state.owner = owner;
		},
		async stop() {
			if (!owned) return;
			const owner = owned;
			owned = void 0;
			if (activeState().owner === owner) activeState().owner = void 0;
			await owner.stop();
		},
		read: (id, view, caller) => current().read(id, view, caller),
		update: (id, patch, caller) => current().update(id, patch, caller),
		move: (id, key, column, caller) => current().move(id, key, column, caller)
	};
}
//#endregion
//#region extensions/workboard/src/tools-card-mutations.ts
function canMutateCard(card, ownerId, token) {
	const claim = card.metadata?.claim;
	return !claim || claim.ownerId === ownerId || safeEqualSecret(token, claim.token);
}
async function requireScopedCard(store, cardId, ownerId, token) {
	const card = await store.get(cardId);
	if (!card) throw new Error(`card not found: ${cardId}`);
	if (!canMutateCard(card, ownerId, token)) throw new Error(`card is claimed by ${card.metadata?.claim?.ownerId ?? "another agent"}.`);
	return card;
}
function redactedCardResult(card) {
	return jsonResult({ card: redactClaimToken(card) });
}
function createWorkboardCardMutations(store, ownerId) {
	const readParams = async (rawParams, requireClaim = false) => {
		const record = asRecord(rawParams);
		const id = readToolStringParam(record, "id", { required: true });
		const token = readStringValue(record.token);
		const card = await requireScopedCard(store, id, ownerId, token);
		if (requireClaim && !card.metadata?.claim) throw new Error("card must be claimed before lifecycle completion.");
		return {
			record,
			id,
			scope: {
				ownerId,
				token
			}
		};
	};
	const cardMutation = (mutate, requireClaim = false) => async (_toolCallId, rawParams) => {
		const { record, id, scope } = await readParams(rawParams, requireClaim);
		return redactedCardResult(await mutate(id, record, scope));
	};
	return {
		readScopedCardToolParams: (rawParams) => readParams(rawParams),
		scopedCardMutation: (mutate) => cardMutation(mutate),
		claimedCardMutation: (mutate) => cardMutation(mutate, true)
	};
}
function cardIdField() {
	return Type.String({ description: "Workboard card id." });
}
function claimTokenField(description = "Claim token returned by workboard_claim.") {
	return Type.Optional(Type.String({ description }));
}
function strictObject(properties) {
	return Type.Object(properties, { additionalProperties: false });
}
function workspaceField() {
	return Type.Optional(strictObject({
		kind: Type.String({ description: "scratch, dir, or worktree." }),
		path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
		branch: Type.Optional(Type.String({ description: "Suggested branch." }))
	}));
}
//#endregion
//#region extensions/workboard/src/tools-sessions-board.ts
const boardIdField = Type.Optional(Type.String({ description: "Board id. May be omitted only when exactly one Sessions board exists." }));
const matchRuleSchema = strictObject({
	health: Type.Optional(Type.Array(Type.Union([
		Type.Literal("on-track"),
		Type.Literal("grinding"),
		Type.Literal("stuck"),
		Type.Literal("waiting-on-user"),
		Type.Literal("wrapping-up"),
		Type.Literal("done"),
		Type.Literal("failed")
	]))),
	run: Type.Optional(Type.Array(Type.Union([
		Type.Literal("active"),
		Type.Literal("idle"),
		Type.Literal("failed")
	]))),
	pullRequest: Type.Optional(Type.Array(Type.Union([
		Type.Literal("none"),
		Type.Literal("open"),
		Type.Literal("draft"),
		Type.Literal("merged"),
		Type.Literal("closed")
	]))),
	archived: Type.Optional(Type.Boolean())
});
const columnSchema = strictObject({
	id: Type.String({
		minLength: 1,
		maxLength: 48,
		pattern: "^[a-z0-9][a-z0-9-]{0,47}$",
		description: "Stable column id. Keep this id when renaming the label."
	}),
	label: Type.String({
		minLength: 1,
		maxLength: 60
	}),
	color: Type.Optional(Type.String({ description: "red, blue, green, yellow, purple, orange, pink, or cyan." })),
	description: Type.String({
		minLength: 1,
		maxLength: 400,
		description: "Description shown in the column tooltip."
	}),
	match: Type.Optional(Type.Union([matchRuleSchema, Type.Array(matchRuleSchema, { minItems: 1 })])),
	fallback: Type.Optional(Type.Boolean({ description: "Exactly one column must be the unresolved-session fallback." }))
});
function createWorkboardSessionsBoardTools(params) {
	const service = () => {
		if (!params.sessionsBoard) throw new Error("Sessions board service is unavailable.");
		return params.sessionsBoard;
	};
	const resolveBoardId = async (record) => {
		if (record.boardId !== void 0) return readToolStringParam(record, "boardId", { required: true });
		const boards = (await params.store.listBoards()).boards.filter((board) => board.kind === "sessions");
		const board = boards[0];
		if (boards.length === 1 && board) return board.id;
		throw new Error(boards.length === 0 ? "No Sessions board exists. Create one with workboard_board_create and kind: \"sessions\"." : "boardId is required when more than one Sessions board exists. Use workboard_boards to choose one.");
	};
	const tools = [
		{
			name: "workboard_sessions_board_read",
			label: "Sessions Board Read",
			description: "Read a Sessions board and its session placements. Columns match Gateway-owned session status, observer health, and pull-request facts in order; operator pins take precedence. Card tools do not apply to Sessions boards.",
			parameters: strictObject({ boardId: boardIdField }),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				return jsonResult(await service().read(await resolveBoardId(record), void 0, params.caller));
			}
		},
		{
			name: "workboard_sessions_board_update",
			label: "Sessions Board Update",
			description: "Edit a Sessions board's columns, match rules, or scope. columns replaces the full ordered list; preserve ids when renaming labels. All fields in each rule must match; a match array accepts any rule, and the first matching column wins. Exactly one fallback is required. Card tools do not apply to Sessions boards.",
			parameters: strictObject({
				boardId: boardIdField,
				columns: Type.Optional(Type.Array(columnSchema, {
					minItems: 2,
					maxItems: 12
				})),
				scope: Type.Optional(strictObject({
					agentIds: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
					includeArchived: Type.Optional(Type.Boolean()),
					maxAgeHours: Type.Optional(Type.Number({ exclusiveMinimum: 0 }))
				}))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				const boardId = await resolveBoardId(record);
				const { boardId: _boardId, ...patch } = record;
				return jsonResult({ board: await service().update(boardId, patch, params.caller) });
			}
		},
		{
			name: "workboard_sessions_board_move",
			label: "Sessions Board Move",
			description: "Pin a session in a Sessions board column. The pin overrides match rules while the column exists. Card tools do not apply to Sessions boards.",
			parameters: strictObject({
				boardId: boardIdField,
				sessionKey: Type.String({ description: "Exact session key from the board read." }),
				columnId: Type.String({ description: "Destination column id from the board read." })
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				return jsonResult(await service().move(await resolveBoardId(record), readToolStringParam(record, "sessionKey", { required: true }), readToolStringParam(record, "columnId", { required: true }), params.caller));
			}
		}
	];
	for (const tool of tools) {
		const execute = tool.execute;
		tool.execute = (...args) => params.store.runOperation(() => execute(...args));
	}
	return tools;
}
//#endregion
//#region extensions/workboard/src/tools-orchestration.ts
const CardIdSchema$1 = strictObject({
	id: cardIdField(),
	token: claimTokenField()
});
const ScopedClaimTokenField$1 = claimTokenField("Claim token for claimed cards.");
const OptionalNextStatusField = Type.Optional(Type.String({ description: "Optional next status." }));
const OptionalOperatorNoteField = Type.Optional(Type.String({ description: "Optional operator note." }));
function createWorkboardOrchestrationTools(params) {
	const { store, ownerId } = params;
	const { scopedCardMutation, claimedCardMutation } = createWorkboardCardMutations(store, ownerId);
	return [
		{
			name: "workboard_boards",
			label: "Workboard Boards",
			description: "List Workboard board namespaces with active, archived, and status counts.",
			parameters: strictObject({}),
			execute: async () => jsonResult(await store.listBoards())
		},
		{
			name: "workboard_board_create",
			label: "Workboard Board Create",
			description: "Create or update a Workboard board with persisted SQLite metadata. Choose kind sessions on creation for columns with rules over Gateway-owned session facts; card tools do not apply to Sessions boards. Board kind cannot change after creation.",
			parameters: strictObject({
				id: Type.String({ description: "Board id." }),
				kind: Type.Optional(Type.Union([Type.Literal("cards"), Type.Literal("sessions")], { description: "Board kind, set only at creation. Default cards." })),
				name: Type.Optional(Type.String({ description: "Display name." })),
				description: Type.Optional(Type.String({ description: "Board description." })),
				icon: Type.Optional(Type.String({ description: "Short icon or label." })),
				color: Type.Optional(Type.String({ description: "Display color token." })),
				automationJobId: Type.Optional(Type.String({
					description: "Owning automation job id.",
					minLength: 1,
					maxLength: 128
				})),
				defaultWorkspace: workspaceField(),
				orchestration: Type.Optional(strictObject({
					autoDecompose: Type.Optional(Type.Boolean({ description: "Mark ready triage cards for decomposition." })),
					autoDecomposePerDispatch: Type.Optional(Type.Number({ description: "Maximum orchestration candidates per dispatch." })),
					defaultAssignee: Type.Optional(Type.String({ description: "Default assignee." })),
					orchestratorProfile: Type.Optional(Type.String({ description: "Orchestrator profile id." }))
				}))
			}),
			execute: async (_toolCallId, rawParams) => jsonResult({ board: await store.upsertBoard(asNonArrayRecord(rawParams)) })
		},
		{
			name: "workboard_board_archive",
			label: "Workboard Board Archive",
			description: "Archive or restore persisted Workboard board metadata.",
			parameters: strictObject({
				id: Type.String({ description: "Board id." }),
				archived: Type.Optional(Type.Boolean({ description: "Archive when true." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				return jsonResult({ board: await store.archiveBoard(record.id, record.archived) });
			}
		},
		{
			name: "workboard_board_delete",
			label: "Workboard Board Delete",
			description: "Delete an empty non-default Workboard board metadata record.",
			parameters: strictObject({ id: Type.String({ description: "Board id." }) }),
			execute: async (_toolCallId, rawParams) => jsonResult(await store.deleteBoard(asNonArrayRecord(rawParams).id))
		},
		{
			name: "workboard_stats",
			label: "Workboard Stats",
			description: "Summarize Workboard counts by status and assignee for one board or all boards.",
			parameters: strictObject({ boardId: Type.Optional(Type.String({ description: "Optional board id filter." })) }),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				return jsonResult(await store.stats({ boardId: record.boardId }));
			}
		},
		{
			name: "workboard_runs",
			label: "Workboard Runs",
			description: "List persisted Workboard run attempts for one card.",
			parameters: CardIdSchema$1,
			execute: async (_toolCallId, rawParams) => {
				const id = readToolStringParam(asNonArrayRecord(rawParams), "id", { required: true });
				const result = await store.runs(id);
				return jsonResult({
					...result,
					card: redactClaimToken(result.card)
				});
			}
		},
		{
			name: "workboard_specify",
			label: "Workboard Specify",
			description: "Turn a rough triage/backlog Workboard card into a specified todo card after reasoning through the requirements.",
			parameters: strictObject({
				id: Type.String({ description: "Workboard card id." }),
				title: Type.Optional(Type.String({ description: "Clarified title." })),
				notes: Type.Optional(Type.String({ description: "Clarified notes or acceptance criteria." })),
				agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
				priority: Type.Optional(Type.String({ description: "low, normal, high, or urgent." })),
				labels: Type.Optional(Type.Array(Type.String(), { description: "Card labels." })),
				boardId: Type.Optional(Type.String({ description: "Board id." })),
				tenant: Type.Optional(Type.String({ description: "Tenant or routing namespace." })),
				skills: Type.Optional(Type.Array(Type.String(), { description: "Suggested skills." })),
				workspace: workspaceField(),
				maxRuntimeSeconds: Type.Optional(Type.Number({ description: "Runtime budget." })),
				maxRetries: Type.Optional(Type.Number({ description: "Retry budget." })),
				summary: Type.Optional(Type.String({ description: "Specification summary comment." })),
				token: Type.Optional(Type.String({ description: "Claim token for claimed cards." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				const id = readToolStringParam(record, "id", { required: true });
				const token = typeof record.token === "string" ? record.token : void 0;
				await requireScopedCard(store, id, ownerId, token);
				return jsonResult({ card: redactClaimToken(await store.specify(id, record, {
					ownerId,
					token: record.token
				})) });
			}
		},
		{
			name: "workboard_decompose",
			label: "Workboard Decompose",
			description: "Fan out a Workboard card into linked child cards and optionally complete the parent orchestration card.",
			parameters: strictObject({
				id: Type.String({ description: "Parent Workboard card id." }),
				token: Type.Optional(Type.String({ description: "Claim token for claimed cards." })),
				summary: Type.Optional(Type.String({ description: "Decomposition summary." })),
				completeParent: Type.Optional(Type.Boolean({ description: "Complete the parent after child creation. Default true." })),
				children: Type.Array(strictObject({
					title: Type.String({ description: "Child title." }),
					notes: Type.Optional(Type.String({ description: "Child notes." })),
					agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
					priority: Type.Optional(Type.String({ description: "low, normal, high, or urgent." })),
					labels: Type.Optional(Type.Array(Type.String())),
					boardId: Type.Optional(Type.String()),
					tenant: Type.Optional(Type.String()),
					skills: Type.Optional(Type.Array(Type.String())),
					workspace: workspaceField(),
					maxRuntimeSeconds: Type.Optional(Type.Number()),
					maxRetries: Type.Optional(Type.Number()),
					idempotencyKey: Type.Optional(Type.String())
				}))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				const id = readToolStringParam(record, "id", { required: true });
				const token = typeof record.token === "string" ? record.token : void 0;
				await requireScopedCard(store, id, ownerId, token);
				const result = await store.decompose(id, record, {
					ownerId,
					token: record.token
				});
				return jsonResult({
					parent: redactClaimToken(result.parent),
					children: result.children.map(redactClaimToken)
				});
			}
		},
		{
			name: "workboard_notify_subscribe",
			label: "Workboard Notify Subscribe",
			description: "Persist a Workboard notification subscription in the plugin SQLite store.",
			parameters: strictObject({
				boardId: Type.Optional(Type.String({ description: "Board id. Default default." })),
				cardId: Type.Optional(Type.String({ description: "Card id." })),
				sessionKey: Type.Optional(Type.String({ description: "Session key." })),
				runId: Type.Optional(Type.String({ description: "Run id." })),
				target: Type.Optional(Type.String({ description: "Human-readable target." })),
				eventKinds: Type.Optional(Type.Array(Type.String(), { description: "completed, failed, stale." }))
			}),
			execute: async (_toolCallId, rawParams) => jsonResult({ subscription: await store.subscribeNotifications(asNonArrayRecord(rawParams)) })
		},
		{
			name: "workboard_notify_list",
			label: "Workboard Notify List",
			description: "List persisted Workboard notification subscriptions.",
			parameters: strictObject({
				boardId: Type.Optional(Type.String({ description: "Board id." })),
				cardId: Type.Optional(Type.String({ description: "Card id." }))
			}),
			execute: async (_toolCallId, rawParams) => jsonResult(await store.listNotificationSubscriptions(asNonArrayRecord(rawParams)))
		},
		{
			name: "workboard_notify_events",
			label: "Workboard Notify Events",
			description: "Read replay-safe Workboard notification events without advancing cursors.",
			parameters: strictObject({
				subscriptionId: Type.Optional(Type.String({ description: "Subscription id." })),
				boardId: Type.Optional(Type.String({ description: "Board id." })),
				cardId: Type.Optional(Type.String({ description: "Card id." })),
				limit: Type.Optional(Type.Number({ description: "Maximum events. Default 50." }))
			}),
			execute: async (_toolCallId, rawParams) => jsonResult(await store.notificationEvents(asNonArrayRecord(rawParams)))
		},
		{
			name: "workboard_notify_advance",
			label: "Workboard Notify Advance",
			description: "Read Workboard notification events and advance the subscription cursor.",
			parameters: strictObject({
				subscriptionId: Type.String({ description: "Subscription id." }),
				limit: Type.Optional(Type.Number({ description: "Maximum events. Default 50." }))
			}),
			execute: async (_toolCallId, rawParams) => jsonResult(await store.advanceNotificationEvents(asNonArrayRecord(rawParams)))
		},
		{
			name: "workboard_notify_unsubscribe",
			label: "Workboard Notify Unsubscribe",
			description: "Delete a persisted Workboard notification subscription.",
			parameters: strictObject({ id: Type.String({ description: "Subscription id." }) }),
			execute: async (_toolCallId, rawParams) => {
				const id = readToolStringParam(asNonArrayRecord(rawParams), "id", { required: true });
				return jsonResult(await store.deleteNotificationSubscription(id));
			}
		},
		{
			name: "workboard_promote",
			label: "Workboard Promote",
			description: "Promote a dependency-ready card into ready, optionally forcing past holds for operator recovery.",
			parameters: strictObject({
				id: cardIdField(),
				token: ScopedClaimTokenField$1,
				force: Type.Optional(Type.Boolean({ description: "Bypass dependency or schedule holds." })),
				reason: OptionalOperatorNoteField
			}),
			execute: scopedCardMutation((id, record, scope) => store.promote(id, record, scope))
		},
		{
			name: "workboard_reassign",
			label: "Workboard Reassign",
			description: "Change a card assignee and optionally reset failure state during recovery.",
			parameters: strictObject({
				id: cardIdField(),
				token: ScopedClaimTokenField$1,
				agentId: Type.Optional(Type.String({ description: "New assignee id." })),
				status: OptionalNextStatusField,
				resetFailures: Type.Optional(Type.Boolean({ description: "Reset failure count." })),
				reason: OptionalOperatorNoteField
			}),
			execute: scopedCardMutation((id, record, scope) => store.reassign(id, record, scope))
		},
		{
			name: "workboard_reclaim",
			label: "Workboard Reclaim",
			description: "Release a stale claim and stop running attempts so another agent can pick it up.",
			parameters: strictObject({
				id: cardIdField(),
				token: ScopedClaimTokenField$1,
				status: OptionalNextStatusField,
				reason: OptionalOperatorNoteField
			}),
			execute: scopedCardMutation((id, record, scope) => store.reclaim(id, record, scope))
		},
		{
			name: "workboard_dispatch",
			label: "Workboard Dispatch",
			description: "Advance persisted board state without launching workers: promote unblocked cards, reclaim expired claims, and block timed-out runs.",
			parameters: strictObject({ boardId: Type.Optional(Type.String({ description: "Optional board id filter." })) }),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				const result = await store.dispatch({ boardId: record.boardId });
				return jsonResult(redactDispatchResult(result));
			}
		},
		{
			name: "workboard_worker_log",
			label: "Workboard Worker Log",
			description: "Append a persisted worker log entry to a Workboard card.",
			parameters: strictObject({
				id: cardIdField(),
				level: Type.Optional(Type.String({ description: "info, warning, or error." })),
				message: Type.String({ description: "Worker log message." }),
				sessionKey: Type.Optional(Type.String({ description: "Linked session key." })),
				runId: Type.Optional(Type.String({ description: "Linked run id." })),
				token: ScopedClaimTokenField$1
			}),
			execute: scopedCardMutation((id, record, scope) => store.addWorkerLog(id, record, scope))
		},
		{
			name: "workboard_protocol_violation",
			label: "Workboard Protocol Violation",
			description: "Block a card and record a worker protocol violation when work stops without complete/block.",
			parameters: strictObject({
				id: cardIdField(),
				detail: Type.Optional(Type.String({ description: "Violation detail." })),
				sessionKey: Type.Optional(Type.String({ description: "Linked session key." })),
				runId: Type.Optional(Type.String({ description: "Linked run id." })),
				token: ScopedClaimTokenField$1
			}),
			execute: claimedCardMutation((id, record, scope) => store.recordProtocolViolation(id, record, scope))
		}
	];
}
//#endregion
//#region extensions/workboard/src/tools.ts
function contextOwner(ctx) {
	return ctx?.agentId || ctx?.sessionKey || ctx?.sessionId || "agent";
}
function readParentIds(value) {
	if (value == null) return [];
	const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
	if (!entries) throw new Error("parents must be an array or comma-separated string.");
	const parents = [];
	for (const entry of entries) {
		if (typeof entry !== "string") throw new Error("parents must contain only strings.");
		const parent = entry.trim();
		if (!parent || parents.includes(parent)) continue;
		if (parent.length > 120) throw new Error("parents must be 120 characters or fewer.");
		parents.push(parent);
		if (parents.length >= 20) break;
	}
	return parents;
}
function summarizeCard(card) {
	return {
		id: card.id,
		title: card.title,
		status: card.status,
		priority: card.priority,
		agentId: card.agentId,
		tenant: card.metadata?.automation?.tenant,
		boardId: card.metadata?.automation?.boardId ?? "default",
		parents: card.metadata?.links?.filter((link) => link.type === "parent" && link.targetCardId).map((link) => link.targetCardId),
		children: card.metadata?.links?.filter((link) => link.type === "child" && link.targetCardId).map((link) => link.targetCardId),
		claim: card.metadata?.claim ? {
			ownerId: card.metadata.claim.ownerId,
			claimedAt: card.metadata.claim.claimedAt,
			lastHeartbeatAt: card.metadata.claim.lastHeartbeatAt,
			expiresAt: card.metadata.claim.expiresAt
		} : void 0,
		diagnostics: card.metadata?.diagnostics,
		archivedAt: card.metadata?.archivedAt,
		updatedAt: card.updatedAt
	};
}
function redactedProofResult(card) {
	const proofId = card.metadata?.proof?.at(-1)?.id;
	if (!proofId) throw new Error("proof was not retained in card metadata.");
	return jsonResult({
		card: redactClaimToken(card),
		proofId
	});
}
const ScopedClaimTokenField = claimTokenField("Claim token for claimed cards.");
const CardIdSchema = strictObject({
	id: cardIdField(),
	token: claimTokenField()
});
function createWorkboardTools(params) {
	const { store } = params;
	const ownerId = contextOwner(params.context);
	const { readScopedCardToolParams, scopedCardMutation, claimedCardMutation } = createWorkboardCardMutations(store, ownerId);
	const tools = [
		{
			name: "workboard_list",
			label: "Workboard List",
			description: "List Workboard cards with compact claim and diagnostic state. Use before choosing or routing board work.",
			parameters: strictObject({
				status: Type.Optional(Type.String({ description: "Optional card status filter." })),
				agentId: Type.Optional(Type.String({ description: "Optional agent id filter." })),
				tenant: Type.Optional(Type.String({ description: "Optional tenant filter." })),
				boardId: Type.Optional(Type.String({ description: "Optional board id filter." })),
				limit: Type.Optional(Type.Number({ description: "Maximum cards to return. Default 50." })),
				refreshDiagnostics: Type.Optional(Type.Boolean({ description: "Refresh stored diagnostics before listing." })),
				includeArchived: Type.Optional(Type.Boolean({ description: "Include archived cards. Default false." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = rawParams;
				if (record.refreshDiagnostics === true) await store.refreshDiagnostics();
				const status = typeof record.status === "string" ? record.status : void 0;
				const agentId = typeof record.agentId === "string" ? record.agentId : void 0;
				const tenant = typeof record.tenant === "string" ? record.tenant : void 0;
				const boardId = typeof record.boardId === "string" ? record.boardId : void 0;
				const limit = resolveIntegerOption(record.limit, 50, {
					min: 1,
					max: 200
				});
				const cards = (await store.list({ boardId })).filter((card) => record.includeArchived === true || !card.metadata?.archivedAt).filter((card) => !status || card.status === status).filter((card) => !agentId || card.agentId === agentId).filter((card) => !tenant || card.metadata?.automation?.tenant === tenant).slice(0, limit).map(summarizeCard);
				return jsonResult({ cards });
			}
		},
		{
			name: "workboard_create",
			label: "Workboard Create",
			description: "Create a Workboard card, optionally with parent dependencies, tenant, skills, workspace, and idempotency key. Sessions boards do not hold cards; use workboard_sessions_board_read/update/move for them.",
			parameters: strictObject({
				title: Type.String({ description: "Card title." }),
				notes: Type.Optional(Type.String({ description: "Card notes or acceptance criteria." })),
				status: Type.Optional(Type.String({ description: "Initial status." })),
				priority: Type.Optional(Type.String({ description: "low, normal, high, or urgent." })),
				labels: Type.Optional(Type.Array(Type.String(), { description: "Card labels." })),
				agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
				parents: Type.Optional(Type.Array(Type.String(), { description: "Parent card ids." })),
				token: Type.Optional(Type.String({ description: "Claim token for claimed parent cards." })),
				tenant: Type.Optional(Type.String({ description: "Soft tenant namespace." })),
				boardId: Type.Optional(Type.String({ description: "Soft board namespace." })),
				createdByCardId: Type.Optional(Type.String({ description: "Parent card that created this card." })),
				idempotencyKey: Type.Optional(Type.String({ description: "Idempotent create key." })),
				skills: Type.Optional(Type.Array(Type.String(), { description: "Suggested skills." })),
				workspace: workspaceField(),
				maxRuntimeSeconds: Type.Optional(Type.Number({ description: "Run timeout seconds." })),
				maxRetries: Type.Optional(Type.Number({ description: "Retry budget." })),
				scheduledAt: Type.Optional(Type.Number({ description: "Unix epoch milliseconds." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = rawParams;
				readParentIds(record.parents);
				return jsonResult({ card: redactClaimToken(await store.create(record, {
					ownerId,
					token: record.token
				})) });
			}
		},
		{
			name: "workboard_link",
			label: "Workboard Link",
			description: "Link a parent card to a child card so the child becomes ready only after parents are done.",
			parameters: strictObject({
				parentId: Type.String({ description: "Parent card id." }),
				childId: Type.String({ description: "Child card id." }),
				token: Type.Optional(Type.String({ description: "Claim token for claimed parent or child cards." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = rawParams;
				const parentId = readToolStringParam(record, "parentId", { required: true });
				const childId = readToolStringParam(record, "childId", { required: true });
				const token = record.token;
				return jsonResult({ card: redactClaimToken(await store.linkCards(parentId, childId, {
					ownerId,
					token
				})) });
			}
		},
		{
			name: "workboard_read",
			label: "Workboard Read",
			description: "Read one Workboard card and return bounded worker context with notes, attempts, comments, proof, links, and diagnostics.",
			parameters: CardIdSchema,
			execute: async (_toolCallId, rawParams) => {
				const id = readToolStringParam(rawParams, "id", { required: true });
				const card = await store.get(id);
				if (!card) throw new Error(`card not found: ${id}`);
				return jsonResult({
					card: redactClaimToken(card),
					workerContext: await store.buildWorkerContext(id)
				});
			}
		},
		{
			name: "workboard_claim",
			label: "Workboard Claim",
			description: "Claim a Workboard card for this agent and move backlog/todo cards into running. Returns a claim token for heartbeats and release.",
			parameters: strictObject({
				id: cardIdField(),
				ttlSeconds: Type.Optional(Type.Number({ description: "Claim TTL in seconds." }))
			}),
			execute: async (_toolCallId, rawParams) => {
				const record = rawParams;
				const id = readToolStringParam(record, "id", { required: true });
				const claimed = await store.claim(id, {
					ownerId,
					ttlSeconds: record.ttlSeconds
				});
				return jsonResult({
					...claimed,
					card: redactClaimToken(claimed.card)
				});
			}
		},
		{
			name: "workboard_heartbeat",
			label: "Workboard Heartbeat",
			description: "Refresh this agent's Workboard claim heartbeat. Use during long-running card work so diagnostics do not mark it stale.",
			parameters: strictObject({
				id: cardIdField(),
				token: claimTokenField(),
				note: Type.Optional(Type.String({ description: "Optional compact progress note." }))
			}),
			execute: scopedCardMutation((id, record, scope) => store.heartbeat(id, {
				...scope,
				note: record.note
			}))
		},
		{
			name: "workboard_release",
			label: "Workboard Release",
			description: "Release this agent's Workboard claim after finishing, pausing, or handing off card work.",
			parameters: strictObject({
				id: cardIdField(),
				token: claimTokenField(),
				status: Type.Optional(Type.String({ description: "Optional next card status after release." }))
			}),
			execute: scopedCardMutation((id, record, scope) => store.releaseClaim(id, {
				...scope,
				status: record.status
			}))
		},
		{
			name: "workboard_comment",
			label: "Workboard Comment",
			description: "Append a compact comment to a Workboard card.",
			parameters: strictObject({
				id: cardIdField(),
				body: Type.String({ description: "Comment body." }),
				token: ScopedClaimTokenField
			}),
			execute: scopedCardMutation((id, record, scope) => store.addComment(id, { body: record.body }, scope))
		},
		{
			name: "workboard_proof",
			label: "Workboard Proof",
			description: "Attach proof or artifact metadata to a Workboard card after running tests, checks, or producing screenshots/logs. Returns proofId; pass it to workboard_complete when that call reports the terminal status for this proof.",
			parameters: strictObject({
				id: cardIdField(),
				status: Type.Optional(Type.String({ description: "passed, failed, skipped, or unknown." })),
				label: Type.Optional(Type.String({ description: "Proof label." })),
				command: Type.Optional(Type.String({ description: "Command or exact step run." })),
				url: Type.Optional(Type.String({ description: "Proof or artifact URL." })),
				note: Type.Optional(Type.String({ description: "Short proof note." })),
				artifactPath: Type.Optional(Type.String({ description: "Optional local artifact path." })),
				token: ScopedClaimTokenField
			}),
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedProofResult(typeof record.artifactPath === "string" && record.artifactPath.trim() !== "" || typeof record.url === "string" && record.url.trim() !== "" ? await store.addProofWithArtifact(id, record, {
					label: record.label,
					path: record.artifactPath,
					url: record.url
				}, scope) : await store.addProof(id, record, scope));
			}
		},
		{
			name: "workboard_complete",
			label: "Workboard Complete",
			description: "Complete a claimed Workboard card with a structured summary, proof, artifacts, and created-card manifest.",
			parameters: strictObject({
				id: cardIdField(),
				token: claimTokenField(),
				summary: Type.Optional(Type.String({ description: "Completion summary." })),
				proofId: Type.Optional(Type.String({ description: "Proof id returned by workboard_proof when resolving that pending proof." })),
				proof: Type.Optional(strictObject({
					status: Type.Optional(Type.String({ description: "passed, failed, skipped, or unknown." })),
					label: Type.Optional(Type.String({ description: "Proof label." })),
					command: Type.Optional(Type.String({ description: "Command or step run." })),
					url: Type.Optional(Type.String({ description: "Proof URL." })),
					note: Type.Optional(Type.String({ description: "Proof note." }))
				})),
				artifacts: Type.Optional(Type.Array(strictObject({
					label: Type.Optional(Type.String()),
					url: Type.Optional(Type.String()),
					path: Type.Optional(Type.String()),
					mimeType: Type.Optional(Type.String())
				}))),
				createdCardIds: Type.Optional(Type.Array(Type.String(), { description: "Cards created during this run." }))
			}),
			execute: claimedCardMutation((id, record, scope) => store.complete(id, record, scope))
		},
		{
			name: "workboard_attachment_add",
			label: "Workboard Attachment Add",
			description: "Store a small Workboard attachment in plugin SQLite KV and link it to the card.",
			parameters: strictObject({
				id: cardIdField(),
				fileName: Type.String({ description: "Attachment file name." }),
				contentBase64: Type.String({ description: "Base64 attachment content." }),
				mimeType: Type.Optional(Type.String({ description: "Attachment MIME type." })),
				note: Type.Optional(Type.String({ description: "Optional attachment note." })),
				token: ScopedClaimTokenField
			}),
			execute: scopedCardMutation((id, record, scope) => store.addAttachment(id, record, scope, params.context?.assertInputCommitAllowed))
		},
		{
			name: "workboard_attachment_read",
			label: "Workboard Attachment Read",
			description: "Read one Workboard attachment from plugin SQLite KV.",
			parameters: strictObject({ id: Type.String({ description: "Attachment id." }) }),
			execute: async (_toolCallId, rawParams) => {
				const id = readToolStringParam(rawParams, "id", { required: true });
				const attachment = await store.getAttachment(id);
				if (!attachment) throw new Error(`attachment not found: ${id}`);
				return jsonResult(attachment);
			}
		},
		{
			name: "workboard_attachment_delete",
			label: "Workboard Attachment Delete",
			description: "Delete one Workboard attachment from plugin SQLite KV and the card index.",
			parameters: strictObject({
				id: cardIdField(),
				attachmentId: Type.String({ description: "Attachment id." }),
				token: ScopedClaimTokenField
			}),
			execute: scopedCardMutation((id, record, scope) => {
				const attachmentId = readToolStringParam(record, "attachmentId", { required: true });
				return store.deleteAttachment(id, attachmentId, scope);
			})
		},
		{
			name: "workboard_block",
			label: "Workboard Block",
			description: "Block a claimed Workboard card with a durable reason and release the claim.",
			parameters: strictObject({
				id: cardIdField(),
				token: claimTokenField(),
				reason: Type.Optional(Type.String({ description: "Blocker summary." }))
			}),
			execute: claimedCardMutation((id, record, scope) => store.block(id, record, scope))
		},
		{
			name: "workboard_unblock",
			label: "Workboard Unblock",
			description: "Move a blocked Workboard card back to todo after adding enough context.",
			parameters: CardIdSchema,
			execute: scopedCardMutation((id, _record, scope) => store.unblock(id, scope))
		},
		{
			name: "workboard_move",
			label: "Workboard Move",
			description: "Move a Workboard card to another status. Claimed cards require matching claim scope.",
			parameters: strictObject({
				id: cardIdField(),
				status: Type.Union(WORKBOARD_STATUSES.map((status) => Type.Literal(status)), { description: "Target Workboard status." }),
				token: claimTokenField("Claim token for claimed cards.")
			}),
			execute: scopedCardMutation((id, record, scope) => store.move(id, record.status, void 0, scope))
		},
		...createWorkboardOrchestrationTools({
			store,
			ownerId
		})
	];
	for (const tool of tools) {
		const execute = tool.execute;
		tool.execute = (...args) => store.runOperation(() => execute(...args));
	}
	return tools;
}
//#endregion
//#region extensions/workboard/index.ts
var workboard_default = definePluginEntry({
	id: "workboard",
	name: "Workboard",
	description: "Dashboard workboard for agent-owned issues and sessions.",
	register(api) {
		const store = WorkboardStore.openSqlite(resolveWorkboardSqliteWorkerModuleUrl(api.runtimeSource));
		const resourceServices = [];
		registerWorkboardStoreLifecycle(api, store, async () => {
			await Promise.all(resourceServices.map(async (service) => await service.stop()));
		});
		const changeEvents = createWorkboardChangeEventService(store);
		resourceServices.push(changeEvents);
		const automationNudge = createWorkboardAutomationNudgeService({ store });
		resourceServices.push(automationNudge);
		const sessionsBoard = createWorkboardSessionsBoardService({
			store,
			gateway: api.runtime.gateway
		});
		resourceServices.push(sessionsBoard);
		const lifecycleSync = createWorkboardLifecycleService({
			store,
			worktrees: api.runtime.worktrees,
			readSessions: async (options) => await readWorkboardLifecycleSessions(api.runtime.gateway, options)
		});
		resourceServices.push(lifecycleSync);
		api.session.controls.registerControlUiDescriptor({
			surface: "tab",
			id: "workboard",
			label: "Workboard",
			placement: "route:workboard",
			icon: "kanban",
			group: "control",
			requiredScopes: ["operator.read"]
		});
		api.session.controls.registerControlUiDescriptor({
			surface: "widget",
			id: "board",
			label: "Workboard board",
			requiredScopes: ["operator.read"]
		});
		api.session.controls.registerControlUiDescriptor({
			surface: "widget",
			id: "card",
			label: "Workboard card",
			requiredScopes: ["operator.write"]
		});
		api.session.controls.registerControlUiDescriptor({
			surface: "widget",
			id: "mini",
			label: "Workboard summary",
			requiredScopes: ["operator.read"]
		});
		registerWorkboardGatewayMethods({
			api,
			store,
			sessionsBoard
		});
		registerWorkboardCommand({
			api,
			store
		});
		api.registerService(changeEvents);
		api.registerService(automationNudge);
		api.registerService(sessionsBoard);
		api.registerService(lifecycleSync);
		api.on("gateway_start", (_event, context) => lifecycleSync.onGatewayStart(context.abortSignal));
		api.on("gateway_stop", () => lifecycleSync.onGatewayStop());
		api.on("subagent_ended", (event) => store.runOperation(async () => {
			await syncWorkboardSubagentEnded({
				store,
				worktrees: api.runtime.worktrees,
				event,
				onMatched: automationNudge.nudge
			});
		}));
		api.on("agent_end", (event, context) => store.runOperation(async () => {
			await syncWorkboardAgentEnded({
				store,
				event,
				context,
				onMatched: automationNudge.nudge
			});
		}));
		api.registerCli(async ({ program }) => {
			const { registerWorkboardCli } = await import("../../cli-DbhB-iPY.mjs");
			registerWorkboardCli({
				program,
				store
			});
		}, { descriptors: [{
			name: "workboard",
			description: "Manage Workboard cards and worker dispatch",
			hasSubcommands: true
		}] });
		api.registerTool((context) => guardWorkboardToolsForWorkspaceAccess(createWorkboardTools({
			context,
			store
		}), context, api.runtime.sandbox.resolveWorkspaceAuthority), {
			names: [...WORKBOARD_CARD_TOOL_NAMES],
			optional: true
		});
		api.registerTool({
			contextVersion: 2,
			create: (ctx) => createWorkboardSessionsBoardTools({
				store,
				sessionsBoard,
				caller: { assertCurrent: ctx.assertInvocationCurrent }
			})
		}, { names: [...WORKBOARD_SESSIONS_BOARD_TOOL_NAMES] });
	}
});
//#endregion
export { workboard_default as default };
