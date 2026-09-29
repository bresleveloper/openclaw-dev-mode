import { i as resolveGlobalSingleton } from "../../global-singleton-Dc_stLtU.mjs";
import { c as isRecord, t as asNonArrayRecord } from "../../record-coerce-DItp3I4t.mjs";
import { x as isCronSessionKey } from "../../session-key-CBvmC8zz.mjs";
import { t as safeEqualSecret } from "../../secret-equal-DRsL8lKD.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { h as readToolStringParam } from "../../common-XfKigJno.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../routing-JKvWkBDR.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../core-B7a2jbpy.mjs";
import "../../security-runtime-HdPo6iAV.mjs";
import "../../global-singleton-D_6N_QHn.mjs";
import "../../api-CR-OE8tb.mjs";
import { d as WORKBOARD_STATUSES, m as redactClaimToken } from "../../src-CMxcJXXp.mjs";
import { _ as resolveWorkboardAgentWorkspace, a as workboardCardMatchesLifecycleLink, c as cardRunId, d as isWorkboardWorktreeCleanupCandidate, f as WORKBOARD_TOOL_NAMES, g as resolveCommandWorkboardWorkspaceAccess, h as resolveAgentWorkboardWorkspaceRuntime, i as WorkboardStore, l as cardSessionKey, m as guardWorkboardToolsForWorkspaceAccess, n as registerWorkboardStoreLifecycle, o as workboardCardSessionLookupKey, p as canonicalizeWorkboardWorkspaceAccess, r as dispatchAndStartWorkboardCards, s as cardBoardId, t as registerWorkboardGatewayMethods, u as cleanupWorkboardCardWorktree } from "../../runtime-api-HgIRLeL2.mjs";
import "../../store-constants-DPYot7MP.mjs";
import { n as resolveWorkboardSqliteWorkerModuleUrl } from "../../sqlite-store-paths-DMRV7j8G.mjs";
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
		state.logger = void 0;
		clearPendingBoardNudges(state);
	});
}
function isCronOriginSession(sessionKey) {
	const normalized = sessionKey?.trim();
	return normalized?.startsWith("cron:") === true || isCronSessionKey(normalized);
}
function createWorkboardAutomationNudgeService(params) {
	const serviceOwner = {};
	const nudgeBoard = async (boardId, jobId, owner) => {
		const state = getWorkboardAutomationNudgeState();
		if (state.owner !== owner || !state.logger || state.pendingByBoard.has(boardId)) return;
		if (state.pendingByBoard.size >= 2e3) {
			state.logger.warn(`workboard automation nudge skipped for board ${boardId}: debounce map full`);
			return;
		}
		const pending = {};
		const expiresAt = Date.now() + WORKBOARD_AUTOMATION_NUDGE_DEBOUNCE_MS;
		state.pendingByBoard.set(boardId, pending);
		try {
			const result = await params.gateway.request("cron.run", {
				id: jobId,
				mode: "if-enabled"
			}, { scopes: ["operator.admin"] });
			if (isRecord(result) && result.ran === false) {
				const reason = typeof result.reason === "string" ? result.reason : "not-run";
				state.logger.warn(`workboard automation nudge skipped for board ${boardId}: job ${jobId} ${reason}`);
				return;
			}
			const runId = isRecord(result) && typeof result.runId === "string" ? result.runId : void 0;
			state.logger.info(`workboard automation nudge requested for board ${boardId}: job ${jobId}${runId ? ` run ${runId}` : ""}`);
		} catch (error) {
			if (state.owner === owner) state.logger?.warn(`workboard automation nudge failed for board ${boardId}: ${String(error)}`);
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
			state.owner = serviceOwner;
			state.logger = ctx.logger;
		},
		stop() {
			const state = getWorkboardAutomationNudgeState();
			if (state.owner !== serviceOwner) return;
			state.owner = void 0;
			state.logger = void 0;
			clearPendingBoardNudges(state);
		},
		async nudge(input) {
			const state = getWorkboardAutomationNudgeState();
			const owner = state.owner;
			if (!owner || !state.logger || isCronOriginSession(input.sessionKey) || input.cards.length === 0) return;
			try {
				const automationByBoard = new Map((await params.store.listBoards()).boards.flatMap((board) => board.automationJobId ? [[board.id, board.automationJobId]] : []));
				const boardIds = new Set(input.cards.map((card) => cardBoardId(card)));
				await Promise.all([...boardIds].flatMap((boardId) => {
					const jobId = automationByBoard.get(boardId);
					return jobId ? [nudgeBoard(boardId, jobId, owner)] : [];
				}));
			} catch (error) {
				if (state.owner === owner) state.logger?.warn(`workboard automation nudge failed: ${String(error)}`);
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
function splitArgs(input) {
	return (input ?? "").trim().split(/\s+/).filter(Boolean);
}
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
function normalizeTitle(tokens) {
	return tokens.join(" ").trim();
}
function isWorkboardStatus(value) {
	return WORKBOARD_STATUSES.includes(value);
}
function canMutateWorkboard(params) {
	const scopes = params.gatewayClientScopes;
	if (scopes) return scopes.includes(ADMIN_SCOPE) || scopes.includes(WRITE_SCOPE);
	return params.senderIsOwner === true;
}
function requireWriteAccess(params) {
	if (canMutateWorkboard(params)) return;
	return {
		text: `This command requires gateway scope: ${WRITE_SCOPE}.`,
		isError: true
	};
}
async function handleWorkboardCommand(params) {
	const [action = "list", ...rest] = splitArgs(params.args);
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
	if (action === "create") {
		const accessError = requireWriteAccess(params);
		if (accessError) return accessError;
		const title = normalizeTitle(rest);
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
		const accessError = requireWriteAccess(params);
		if (accessError) return accessError;
		const id = rest[0];
		const statusIndex = rest.indexOf("--status");
		const status = statusIndex >= 0 ? rest[statusIndex + 1] : void 0;
		if (!id || !status) return {
			text: "Usage: /workboard move <card-id> --status <status>",
			isError: true
		};
		if (!isWorkboardStatus(status)) return {
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
		const accessError = requireWriteAccess(params);
		if (accessError) return accessError;
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
//#region extensions/workboard/src/tools-card-mutations.ts
const ClaimTokenFieldName = "token";
function cardIdField() {
	return Type.String({ description: "Workboard card id." });
}
function claimTokenField(description = "Claim token returned by workboard_claim.") {
	return Type.Optional(Type.String({ description }));
}
function strictObject(properties) {
	return Type.Object(properties, { additionalProperties: false });
}
function createWorkboardMoveTool(params) {
	return {
		name: "workboard_move",
		label: "Workboard Move",
		description: "Move a Workboard card to another status. Claimed cards require matching claim scope.",
		parameters: strictObject({
			id: cardIdField(),
			status: Type.Union(WORKBOARD_STATUSES.map((status) => Type.Literal(status)), { description: "Target Workboard status." }),
			[ClaimTokenFieldName]: claimTokenField("Claim token for claimed cards.")
		}),
		execute: async (_toolCallId, rawParams) => {
			const { record, id, scope } = await params.readScopedCardToolParams(rawParams);
			return params.redactedCardResult(await params.store.move(id, record.status, void 0, scope));
		}
	};
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
	const { store, ownerId, requireScopedCard, readScopedCardToolParams, readClaimedCardToolParams, runScopedCardMutation, redactedCardResult } = params;
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
			description: "Create or update a Workboard board namespace with persisted SQLite metadata.",
			parameters: strictObject({
				id: Type.String({ description: "Board id." }),
				name: Type.Optional(Type.String({ description: "Display name." })),
				description: Type.Optional(Type.String({ description: "Board description." })),
				icon: Type.Optional(Type.String({ description: "Short icon or label." })),
				color: Type.Optional(Type.String({ description: "Display color token." })),
				automationJobId: Type.Optional(Type.String({
					description: "Owning automation job id.",
					minLength: 1,
					maxLength: 128
				})),
				defaultWorkspace: Type.Optional(strictObject({
					kind: Type.String({ description: "scratch, dir, or worktree." }),
					path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
					branch: Type.Optional(Type.String({ description: "Suggested branch." }))
				})),
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
				workspace: Type.Optional(strictObject({
					kind: Type.String({ description: "scratch, dir, or worktree." }),
					path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
					branch: Type.Optional(Type.String({ description: "Suggested branch." }))
				})),
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
					workspace: Type.Optional(strictObject({
						kind: Type.String({ description: "scratch, dir, or worktree." }),
						path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
						branch: Type.Optional(Type.String({ description: "Suggested branch." }))
					})),
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
			execute: async (_toolCallId, rawParams) => {
				return runScopedCardMutation(rawParams, (id, record, scope) => store.promote(id, record, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				return runScopedCardMutation(rawParams, (id, record, scope) => store.reassign(id, record, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				return runScopedCardMutation(rawParams, (id, record, scope) => store.reclaim(id, record, scope));
			}
		},
		{
			name: "workboard_dispatch",
			label: "Workboard Dispatch",
			description: "Advance persisted board state without launching workers: promote unblocked cards, reclaim expired claims, and block timed-out runs.",
			parameters: strictObject({ boardId: Type.Optional(Type.String({ description: "Optional board id filter." })) }),
			execute: async (_toolCallId, rawParams) => {
				const record = asNonArrayRecord(rawParams);
				const result = await store.dispatch({ boardId: record.boardId });
				return jsonResult({
					...result,
					promoted: result.promoted.map(redactClaimToken),
					reclaimed: result.reclaimed.map(redactClaimToken),
					blocked: result.blocked.map(redactClaimToken),
					orchestrated: result.orchestrated.map(redactClaimToken)
				});
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.addWorkerLog(id, record, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readClaimedCardToolParams(rawParams);
				return redactedCardResult(await store.recordProtocolViolation(id, record, scope));
			}
		}
	];
}
//#endregion
//#region extensions/workboard/src/tools.ts
function contextOwner(ctx) {
	const record = ctx ?? {};
	return typeof record.agentId === "string" && record.agentId || typeof record.sessionKey === "string" && record.sessionKey || typeof record.sessionId === "string" && record.sessionId || "agent";
}
function canMutateCard(card, ownerId, token) {
	const claim = card.metadata?.claim;
	return !claim || claim.ownerId === ownerId || safeEqualSecret(token, claim.token);
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
async function requireScopedCard(store, cardId, ownerId, token) {
	const card = await store.get(cardId);
	if (!card) throw new Error(`card not found: ${cardId}`);
	if (!canMutateCard(card, ownerId, token)) throw new Error(`card is claimed by ${card.metadata?.claim?.ownerId ?? "another agent"}.`);
	return card;
}
async function requireClaimedCard(store, cardId, ownerId, token) {
	const card = await requireScopedCard(store, cardId, ownerId, token);
	if (!card.metadata?.claim) throw new Error("card must be claimed before lifecycle completion.");
	return card;
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
const ScopedClaimTokenField = claimTokenField("Claim token for claimed cards.");
function readCardToolParams(rawParams, ownerId) {
	const record = rawParams;
	const id = readToolStringParam(record, "id", { required: true });
	const token = record.token;
	return {
		record,
		id,
		token,
		scope: {
			ownerId,
			token
		}
	};
}
function redactedCardResult(card) {
	return jsonResult({ card: redactClaimToken(card) });
}
function redactedProofResult(card) {
	const proofId = card.metadata?.proof?.at(-1)?.id;
	if (!proofId) throw new Error("proof was not retained in card metadata.");
	return jsonResult({
		card: redactClaimToken(card),
		proofId
	});
}
const CardIdSchema = strictObject({
	id: cardIdField(),
	token: claimTokenField()
});
function createWorkboardTools(params) {
	const { store } = params;
	const ownerId = contextOwner(params.context);
	const readScopedCardToolParams = async (rawParams) => {
		const input = readCardToolParams(rawParams, ownerId);
		await requireScopedCard(store, input.id, ownerId, input.token);
		return input;
	};
	const readClaimedCardToolParams = async (rawParams) => {
		const input = readCardToolParams(rawParams, ownerId);
		await requireClaimedCard(store, input.id, ownerId, input.token);
		return input;
	};
	const runCardMutation = async (rawParams, readParams, mutate) => {
		const { record, id, scope } = await readParams(rawParams);
		return redactedCardResult(await mutate(id, record, scope));
	};
	const runScopedCardMutation = (rawParams, mutate) => runCardMutation(rawParams, readScopedCardToolParams, mutate);
	const runClaimedCardMutation = (rawParams, mutate) => runCardMutation(rawParams, readClaimedCardToolParams, mutate);
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
				const limit = typeof record.limit === "number" && Number.isFinite(record.limit) ? Math.max(1, Math.min(200, Math.trunc(record.limit))) : 50;
				const cards = (await store.list({ boardId })).filter((card) => record.includeArchived === true || !card.metadata?.archivedAt).filter((card) => !status || card.status === status).filter((card) => !agentId || card.agentId === agentId).filter((card) => !tenant || card.metadata?.automation?.tenant === tenant).slice(0, limit).map(summarizeCard);
				return jsonResult({ cards });
			}
		},
		{
			name: "workboard_create",
			label: "Workboard Create",
			description: "Create a Workboard card, optionally with parent dependencies, tenant, skills, workspace, and idempotency key.",
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
				workspace: Type.Optional(strictObject({
					kind: Type.String({ description: "scratch, dir, or worktree." }),
					path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
					branch: Type.Optional(Type.String({ description: "Suggested branch." }))
				})),
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.heartbeat(id, {
					...scope,
					note: record.note
				}));
			}
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.releaseClaim(id, {
					...scope,
					status: record.status
				}));
			}
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.addComment(id, { body: record.body }, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				return runClaimedCardMutation(rawParams, (id, record, scope) => store.complete(id, record, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.addAttachment(id, record, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				const { record, id, scope } = await readScopedCardToolParams(rawParams);
				const attachmentId = readToolStringParam(record, "attachmentId", { required: true });
				return redactedCardResult(await store.deleteAttachment(id, attachmentId, scope));
			}
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
			execute: async (_toolCallId, rawParams) => {
				return runClaimedCardMutation(rawParams, (id, record, scope) => store.block(id, record, scope));
			}
		},
		{
			name: "workboard_unblock",
			label: "Workboard Unblock",
			description: "Move a blocked Workboard card back to todo after adding enough context.",
			parameters: CardIdSchema,
			execute: async (_toolCallId, rawParams) => {
				const { id, scope } = await readScopedCardToolParams(rawParams);
				return redactedCardResult(await store.unblock(id, scope));
			}
		},
		createWorkboardMoveTool({
			store,
			readScopedCardToolParams,
			redactedCardResult
		}),
		...createWorkboardOrchestrationTools({
			store,
			ownerId,
			requireScopedCard,
			readScopedCardToolParams,
			readClaimedCardToolParams,
			runScopedCardMutation,
			redactedCardResult
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
		const automationNudge = createWorkboardAutomationNudgeService({
			store,
			gateway: api.runtime.gateway
		});
		resourceServices.push(automationNudge);
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
			store
		});
		registerWorkboardCommand({
			api,
			store
		});
		api.registerService(changeEvents);
		api.registerService(automationNudge);
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
			const { registerWorkboardCli } = await import("../../cli-CS9eCBRb.mjs");
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
			names: [...WORKBOARD_TOOL_NAMES],
			optional: true
		});
	}
});
//#endregion
export { workboard_default as default };
