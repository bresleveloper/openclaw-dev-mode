import { n as isAgentsApiTerminalTurn } from "./agentsapi-client-DzhjNWzN.mjs";
import { setTimeout } from "node:timers/promises";
//#region extensions/agentsapi/agentsapi-session-history.ts
function createAgentsApiSessionHistory(options) {
	const { sessionId, cleanupClient, coordinatorTurnIds, priorInputItemIds, readAdmittedTurns, rememberItemTurn } = options;
	const readItemsByTurn = async (readClient, readSignal) => {
		const savedItems = await readClient.items(sessionId, void 0, readSignal);
		readSignal.throwIfAborted();
		const itemsByTurn = /* @__PURE__ */ new Map();
		for (const item of savedItems) {
			if (!item.turn_id) continue;
			const items = itemsByTurn.get(item.turn_id) ?? [];
			items.push(item);
			itemsByTurn.set(item.turn_id, items);
		}
		return itemsByTurn;
	};
	const readSavedState = async (readClient, readSignal) => {
		const turns = await readAdmittedTurns(readClient, readSignal);
		const entries = [];
		const inputItems = /* @__PURE__ */ new Set();
		const itemsByTurn = turns.length || options.getBaselineTurnId() ? await readItemsByTurn(readClient, readSignal) : /* @__PURE__ */ new Map();
		for (const turn of turns) {
			const items = itemsByTurn.get(turn.id) ?? [];
			for (const item of items) {
				rememberItemTurn(item.id, turn.id);
				if (item.type === "message" && item.role === "user" && !priorInputItemIds.has(item.id)) inputItems.add(item.id);
			}
			entries.push({
				turn,
				items
			});
		}
		options.observeInputItems(inputItems);
		return {
			turns,
			entries,
			itemsByTurn
		};
	};
	const projectSavedState = async (entries, readSignal) => {
		let transcriptReady = true;
		for (const { turn, items } of entries) {
			readSignal.throwIfAborted();
			transcriptReady = await options.callbacks.onReconcile?.(turn, items) !== false && transcriptReady;
			readSignal.throwIfAborted();
		}
		return transcriptReady;
	};
	const reconcilePriorHistory = async (readClient, readSignal, itemsByTurn) => {
		if (!options.getBaselineTurnId() || !options.callbacks.onReconcileHistory) return;
		const turns = await readClient.turns(sessionId, readSignal);
		readSignal.throwIfAborted();
		const baselineIndex = turns.findIndex((turn) => turn.id === options.getBaselineTurnId());
		if (baselineIndex < 0) throw new Error("Agents API historical reconciliation lost its baseline turn");
		const priorTurns = turns.slice(0, baselineIndex + 1).filter((turn) => isAgentsApiTerminalTurn(turn.status));
		if (!priorTurns.length) return;
		await options.callbacks.onReconcileHistory(priorTurns.map((turn) => ({
			turn,
			items: itemsByTurn.get(turn.id) ?? []
		})));
		readSignal.throwIfAborted();
	};
	const readUsageTurns = async () => {
		const usageSignal = AbortSignal.timeout(5e3);
		let turns = [];
		try {
			while (true) {
				turns = await cleanupClient.turns(sessionId, usageSignal, options.getBaselineTurnId());
				const recordedIds = new Set(turns.map((turn) => turn.id));
				if (turns.length > 0 && [...coordinatorTurnIds].every((id) => recordedIds.has(id)) && turns.every((turn) => turn.usage !== null)) return turns;
				await setTimeout(500, void 0, { signal: usageSignal });
			}
		} catch (error) {
			if (!usageSignal.aborted) options.callbacks.onUsageError?.(error);
			return turns;
		}
	};
	return {
		readItemsByTurn,
		readSavedState,
		projectSavedState,
		reconcilePriorHistory,
		readUsageTurns
	};
}
/** Retain the live reader while bounding reconciliation of late saved records. */
async function waitForAgentsApiEventOrRecovery(nextEvent, signal, wait) {
	const refresh = new AbortController();
	try {
		return await Promise.race([nextEvent, wait(1e3, AbortSignal.any([signal, refresh.signal])).then(() => void 0)]);
	} finally {
		refresh.abort();
	}
}
//#endregion
export { waitForAgentsApiEventOrRecovery as n, createAgentsApiSessionHistory as t };
