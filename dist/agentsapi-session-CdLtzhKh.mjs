import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { n as isAgentsApiTerminalTurn } from "./agentsapi-client-DzhjNWzN.mjs";
import { n as isAgentsApiOptionalHistoryReadFailure, r as isAgentsApiTransportDisconnect, t as AgentsApiError } from "./agentsapi-errors-C5phEUd2.mjs";
import { n as waitForAgentsApiEventOrRecovery, t as createAgentsApiSessionHistory } from "./agentsapi-session-history-DSdyVpJv.mjs";
import { setTimeout } from "node:timers/promises";
import { APIUserAbortError } from "openai";
//#region extensions/agentsapi/agentsapi-session.ts
/** Native input receipts and session idle, together, establish Agents API completion. */
function createAgentsApiSession(options) {
	const { client, cleanupClient, sessionId, signal, assertCurrent } = options;
	const waitForRecovery = options.waitForRecovery ?? ((ms, recoverySignal) => setTimeout(ms, void 0, { signal: recoverySignal }));
	let streamController = new AbortController();
	let submitted = options.initialInputSubmitted ?? false;
	let inputAdmissionClosed = false;
	let stopped = false;
	let closed = false;
	let settled = false;
	let rootTurn;
	let turnFailure;
	let cancelled = false;
	let submission = Promise.resolve();
	let admittedSubmission = Promise.resolve();
	let cancellation;
	let admittedMessageCount = submitted ? 1 : 0;
	let baselineTurnId;
	let baselineCaptured = submitted;
	const priorInputItemIds = /* @__PURE__ */ new Set();
	let observedInputItems = /* @__PURE__ */ new Set();
	const coordinatorTurnIds = /* @__PURE__ */ new Set();
	const excludedTurnIds = /* @__PURE__ */ new Set();
	const itemTurnIds = /* @__PURE__ */ new Map();
	const excludedItemIds = /* @__PURE__ */ new Set();
	let latestInputTurnId;
	let usageTurns;
	let terminatedByTool = false;
	let reconciliationPending = options.initialInputSubmitted ?? false;
	const isAvailable = () => submitted && !inputAdmissionClosed && !stopped && !settled && !rootTurn && !signal.aborted;
	const submit = (text, persistInput) => {
		assertCurrent();
		signal.throwIfAborted();
		if (inputAdmissionClosed || stopped || settled || rootTurn) throw new Error("Agents API turn is stopped");
		submission = submission.then(async () => {
			assertCurrent();
			if (stopped || settled || rootTurn || signal.aborted) throw new Error("Agents API turn settled before input was submitted");
			await persistInput?.();
			assertCurrent();
			signal.throwIfAborted();
			if (stopped || settled || rootTurn) throw new Error("Agents API turn settled before input was submitted");
			admittedMessageCount++;
			submitted = true;
			admittedSubmission = client.message(sessionId, text, AbortSignal.timeout(6e4));
			return admittedSubmission;
		});
		submission.catch(() => {});
		return submission;
	};
	const cancel = () => {
		stopped = true;
		streamController.abort();
		if (!submitted || settled) return Promise.resolve();
		cancellation ??= (async () => {
			let submissionError;
			try {
				await admittedSubmission;
			} catch (error) {
				submissionError = error;
			}
			await cleanupClient.cancel(sessionId, AbortSignal.timeout(3e4));
			settled = true;
			if (submissionError !== void 0) throw submissionError instanceof Error ? submissionError : new Error(formatErrorMessage(submissionError), { cause: submissionError });
		})();
		cancellation.catch(() => {});
		return cancellation;
	};
	const onAbort = () => {
		cancel();
	};
	signal.addEventListener("abort", onAbort, { once: true });
	const readAdmittedTurns = async (readClient, readSignal) => {
		const turns = await readClient.turns(sessionId, readSignal, baselineTurnId);
		readSignal.throwIfAborted();
		for (const turn of turns) {
			coordinatorTurnIds.add(turn.id);
			excludedTurnIds.delete(turn.id);
		}
		const latest = turns.at(-1);
		latestInputTurnId = latest?.id;
		rootTurn = latest && isAgentsApiTerminalTurn(latest.status) ? latest : void 0;
		turnFailure = latest?.status === "failed" ? new AgentsApiError(latest.error?.message ?? "Agents API turn failed", latest.error ?? {}) : void 0;
		cancelled = !terminatedByTool && latest?.status === "cancelled";
		return turns;
	};
	const rememberItemTurn = (itemId, turnId) => {
		const previous = itemTurnIds.get(itemId);
		if (previous && previous !== turnId) throw new Error("Agents API item belongs to different admitted turns");
		itemTurnIds.set(itemId, turnId);
		excludedItemIds.delete(itemId);
	};
	const history = createAgentsApiSessionHistory({
		sessionId,
		cleanupClient,
		getBaselineTurnId: () => baselineTurnId,
		coordinatorTurnIds,
		priorInputItemIds,
		readAdmittedTurns,
		rememberItemTurn,
		observeInputItems: (items) => {
			observedInputItems = items;
		},
		callbacks: options
	});
	return {
		isAvailable,
		wasSubmitted: () => submitted,
		isSettled: () => settled,
		queueMessage: submit,
		readUsageTurns() {
			if (!submitted || !settled) return Promise.resolve([]);
			return usageTurns ??= history.readUsageTurns();
		},
		async run(prompt, persistInput, onSubmitted) {
			signal.throwIfAborted();
			if (!options.initialInputSubmitted) {
				const latest = (await client.turns(sessionId, signal, void 0, true))[0];
				assertCurrent();
				baselineTurnId = latest?.id;
				if (latest && !isAgentsApiTerminalTurn(latest.status)) {
					const turns = await client.turns(sessionId, signal);
					assertCurrent();
					const latestIndex = turns.findIndex((turn) => turn.id === latest.id);
					if (latestIndex < 0) throw new Error("Agents API continuation lost its active root turn");
					baselineTurnId = turns[latestIndex - 1]?.id;
					const items = await client.items(sessionId, latest.id, signal);
					assertCurrent();
					for (const item of items) if (item.type === "message" && item.role === "user") priorInputItemIds.add(item.id);
				}
				baselineCaptured = true;
				if (baselineTurnId) excludedTurnIds.add(baselineTurnId);
			}
			const callAdmissions = /* @__PURE__ */ new Map();
			const relayFunctions = async () => {
				assertCurrent();
				signal.throwIfAborted();
				let submissionFence = submission;
				await awaitReceipt(submissionFence);
				assertCurrent();
				const inputCount = admittedMessageCount;
				const calls = await client.pendingFunctionCalls(sessionId, signal, options.connectEnvironment);
				if (!calls.length) return;
				if (!options.executeFunction) throw new Error("Agents API MVP cannot continue: agent.session.requires_action");
				for (const call of calls) {
					const identity = `${sessionId}:${call.turn_id}:${call.call_id}`;
					if (!callAdmissions.has(identity)) callAdmissions.set(identity, {
						inputCount,
						relayed: false
					});
				}
				const turns = await readAdmittedTurns(client, signal);
				assertCurrent();
				if (submissionFence !== submission) return relayFunctions();
				const latestTurn = turns.at(-1);
				if (!latestTurn) throw new Error("Agents API function request has no current attempt root turn");
				latestInputTurnId = latestTurn.id;
				const admittedCount = admittedMessageCount;
				let itemsByTurn;
				const prefixSignal = AbortSignal.any([signal, AbortSignal.timeout(5e3)]);
				try {
					itemsByTurn = await history.readItemsByTurn(client, prefixSignal);
					assertCurrent();
				} catch (error) {
					signal.throwIfAborted();
					assertCurrent();
					if (!(prefixSignal.aborted && (error === prefixSignal.reason || error instanceof APIUserAbortError)) && !isAgentsApiOptionalHistoryReadFailure(error)) throw error;
					options.onTranscriptOrderingGap?.();
					assertCurrent();
				}
				for (const call of calls) {
					if (call.turn_id !== latestTurn.id || !["in_progress", "waiting"].includes(latestTurn.status)) throw new Error("Agents API function request belongs to a different or settled root turn");
					const identity = `${sessionId}:${call.turn_id}:${call.call_id}`;
					const admission = callAdmissions.get(identity);
					if (admission.relayed) continue;
					const items = itemsByTurn?.get(call.turn_id);
					const callIndex = items?.findIndex((item) => item.type === "function_call" && item.call_id === call.call_id) ?? -1;
					if (items) {
						const prefix = callIndex >= 0 ? items.slice(0, callIndex) : items;
						const transcriptReady = await history.projectSavedState(turns.map((turn) => ({
							turn,
							items: turn.id === call.turn_id ? prefix : itemsByTurn.get(turn.id) ?? []
						})), signal);
						assertCurrent();
						if (!transcriptReady || callIndex < 0) {
							options.onTranscriptOrderingGap?.();
							assertCurrent();
						}
					} else {
						options.onTranscriptOrderingGap?.();
						assertCurrent();
					}
					if (submissionFence !== submission || admittedCount !== admittedMessageCount) return relayFunctions();
					admission.relayed = true;
					const result = await options.executeFunction(call);
					assertCurrent();
					signal.throwIfAborted();
					const terminate = result.terminate;
					if (terminate) inputAdmissionClosed = true;
					submission = submission.then(() => {
						assertCurrent();
						signal.throwIfAborted();
						admittedSubmission = client.toolResult(sessionId, call, result, AbortSignal.timeout(6e4));
						return admittedSubmission;
					});
					submission.catch(() => {});
					const acknowledgementFence = submission;
					await awaitReceipt(acknowledgementFence);
					submissionFence = acknowledgementFence;
					await options.onFunctionResult?.(call, result);
					assertCurrent();
					if (terminate) {
						if (admittedMessageCount !== admission.inputCount) {
							inputAdmissionClosed = false;
							return relayFunctions();
						}
						await cleanupClient.cancel(sessionId, AbortSignal.timeout(3e4));
						terminatedByTool = true;
						await settleFromSavedState();
						if (!settled || !rootTurn || !["completed", "cancelled"].includes(rootTurn.status ?? "")) throw new Error("Agents API tool termination did not settle its native root turn and inputs");
						streamController.abort();
						return;
					}
				}
			};
			let events = await client.subscribe(sessionId, AbortSignal.any([signal, streamController.signal]));
			let nextEvent = events.next();
			nextEvent.catch(() => {});
			const bufferedEvents = [];
			const reconnectEvents = async () => {
				reconciliationPending = true;
				streamController.abort();
				await events.return(void 0).catch((error) => {
					if (!isAgentsApiTransportDisconnect(error)) throw error;
				});
				while (true) {
					await waitForRecovery(500, signal);
					assertCurrent();
					streamController = new AbortController();
					try {
						events = await client.subscribe(sessionId, AbortSignal.any([signal, streamController.signal]));
						break;
					} catch (error) {
						streamController.abort();
						signal.throwIfAborted();
						assertCurrent();
						if (!isAgentsApiTransportDisconnect(error)) throw error;
					}
				}
				nextEvent = events.next();
				nextEvent.catch(() => {});
				if (options.connectEnvironment) {
					await client.pendingFunctionCalls(sessionId, signal, options.connectEnvironment);
					assertCurrent();
				}
			};
			let initialConnectionReconciled = false;
			const awaitReceipt = async (receipt) => {
				if (!initialConnectionReconciled && options.connectEnvironment) {
					initialConnectionReconciled = true;
					await client.pendingFunctionCalls(sessionId, signal, options.connectEnvironment);
					assertCurrent();
				}
				const acknowledged = receipt.then(() => ({ kind: "acknowledged" }), (error) => ({
					kind: "failed",
					error
				}));
				while (true) {
					signal.throwIfAborted();
					let chunk;
					try {
						chunk = await Promise.race([acknowledged, nextEvent]);
					} catch (error) {
						signal.throwIfAborted();
						assertCurrent();
						if (!isAgentsApiTransportDisconnect(error)) throw error;
						chunk = {
							done: true,
							value: void 0
						};
					}
					if ("kind" in chunk) {
						if (chunk.kind === "failed") throw chunk.error;
						return;
					}
					if (chunk.done) {
						await reconnectEvents();
						continue;
					}
					bufferedEvents.push(chunk.value);
					nextEvent = events.next();
					nextEvent.catch(() => {});
					if (chunk.value.type === "agent.session.requires_action" && options.connectEnvironment) {
						await client.pendingFunctionCalls(sessionId, signal, options.connectEnvironment);
						assertCurrent();
					}
				}
			};
			const settleFromSavedState = async (recover = false) => {
				const submissionFence = submission;
				await awaitReceipt(submissionFence);
				assertCurrent();
				const admittedCount = admittedMessageCount;
				const snapshot = await history.readSavedState(client, signal);
				assertCurrent();
				const session = await client.session(sessionId, signal);
				assertCurrent();
				if (session.status === "failed") {
					await options.onSessionFailed?.();
					throw new Error(session.error ?? "Agents API session failed");
				}
				if (session.status === "requires_action") {
					await relayFunctions();
					if (settled) return;
				}
				settled = Boolean(rootTurn && rootTurn.id === snapshot.turns.at(-1)?.id && session.status === "idle" && submissionFence === submission && admittedCount === admittedMessageCount && observedInputItems.size === admittedCount);
				if (settled) options.onSettled?.();
				if (settled || recover) {
					if (settled) {
						await history.reconcilePriorHistory(client, signal, snapshot.itemsByTurn);
						assertCurrent();
					}
					await history.projectSavedState(snapshot.entries, signal);
					assertCurrent();
				}
			};
			const belongsToAttempt = async (event) => {
				if (event.item && event.item_id && event.item.id !== event.item_id) throw new Error("Agents API event contains different item identities");
				const itemId = event.item?.id ?? event.item_id;
				const turnIds = new Set([
					event.turn?.id,
					event.turn_id,
					event.item?.turn_id,
					itemId ? itemTurnIds.get(itemId) : void 0
				].filter((id) => typeof id === "string" && id.length > 0));
				if (turnIds.size > 1) throw new Error("Agents API event contains different turn identities");
				const turnId = turnIds.values().next().value;
				if (!turnId) {
					if (itemId) {
						if (excludedItemIds.has(itemId)) return false;
						const snapshot = await history.readSavedState(client, signal);
						assertCurrent();
						if (!itemTurnIds.has(itemId)) {
							excludedItemIds.add(itemId);
							return false;
						}
						await history.projectSavedState(snapshot.entries, signal);
						assertCurrent();
						return true;
					}
					if (event.item || event.type === "agent.output.command_execution_output.delta") throw new Error("Agents API output event is missing its turn ID");
					return true;
				}
				if (excludedTurnIds.has(turnId)) {
					if (itemId) excludedItemIds.add(itemId);
					return false;
				}
				if (!coordinatorTurnIds.has(turnId)) {
					await readAdmittedTurns(client, signal);
					assertCurrent();
					if (!coordinatorTurnIds.has(turnId)) {
						excludedTurnIds.add(turnId);
						if (itemId) excludedItemIds.add(itemId);
						return false;
					}
				}
				if (event.item) rememberItemTurn(event.item.id, turnId);
				return true;
			};
			try {
				await persistInput();
				assertCurrent();
				signal.throwIfAborted();
				if (!options.initialInputSubmitted) await awaitReceipt(submit(prompt));
				onSubmitted();
				if (options.initialInputSubmitted) await settleFromSavedState(true);
				while (true) {
					if (settled) break;
					let chunk;
					let consumedBufferedEvent = false;
					try {
						const buffered = bufferedEvents.shift();
						if (buffered) {
							consumedBufferedEvent = true;
							chunk = {
								done: false,
								value: buffered
							};
						} else if (reconciliationPending) chunk = await waitForAgentsApiEventOrRecovery(nextEvent, signal, waitForRecovery);
						else chunk = await nextEvent;
					} catch (error) {
						signal.throwIfAborted();
						assertCurrent();
						if (!isAgentsApiTransportDisconnect(error)) throw error;
						chunk = {
							done: true,
							value: void 0
						};
					}
					if (!chunk) {
						await settleFromSavedState(true);
						continue;
					}
					if (chunk.done) {
						await reconnectEvents();
						await settleFromSavedState(true);
						continue;
					}
					const event = chunk.value;
					if (!consumedBufferedEvent) {
						nextEvent = events.next();
						nextEvent.catch(() => {});
					}
					assertCurrent();
					if (!await belongsToAttempt(event)) continue;
					assertCurrent();
					await options.onEvent(event);
					assertCurrent();
					if (event.type === "agent.session.idle") {
						reconciliationPending = true;
						await settleFromSavedState();
						continue;
					}
					if ((event.type === "agent.session.turn.item.added" || event.type === "agent.session.turn.item.done") && event.item?.type === "message" && event.item.role === "user" && event.item.id && !priorInputItemIds.has(event.item.id) && !observedInputItems.has(event.item.id)) {
						observedInputItems.add(event.item.id);
						if (!(event.item.turn_id ?? event.turn_id ?? itemTurnIds.get(event.item.id))) throw new Error("Agents API input item is missing its turn ID");
						await settleFromSavedState();
					}
					if (event.type === "error") throw new AgentsApiError(event.error?.message ?? "Agents API stream error", event.error);
					if (event.type === "agent.session.requires_action") {
						await relayFunctions();
						continue;
					}
					if (event.type === "agent.session.failed") {
						const session = await client.session(sessionId, signal);
						assertCurrent();
						if (session.status !== "failed") continue;
						await options.onSessionFailed?.();
						throw new AgentsApiError(session.error ?? "Agents API session failed", event.error);
					}
					if (event.type === "agent.session.environment.failed") {
						const nativeError = event.environment?.error ?? event.error;
						throw new AgentsApiError(nativeError?.message ?? event.session?.error ?? `Agents API cannot continue: ${event.type}`, nativeError ?? {});
					}
					if ((event.type === "agent.session.turn.completed" || event.type === "agent.session.turn.failed" || event.type === "agent.session.turn.cancelled") && event.turn?.subagent_id === null && event.turn.id === latestInputTurnId) {
						reconciliationPending = true;
						rootTurn = event.turn;
						turnFailure = event.type.endsWith(".failed") ? new AgentsApiError(event.turn.error?.message ?? "Agents API turn failed", event.turn.error ?? {}) : void 0;
						cancelled = event.type.endsWith(".cancelled");
						await settleFromSavedState();
					}
				}
			} finally {
				streamController.abort();
				await events.return(void 0);
			}
			if (!rootTurn || !settled) throw new Error("Agents API stream closed before the root turn settled; reset or inspect the session before retrying");
			if (turnFailure) throw turnFailure;
			return {
				turn: rootTurn,
				cancelled,
				terminatedByTool
			};
		},
		async reconcileAfterClose(cleanupSignal) {
			if (!closed) throw new Error("Agents API session cleanup requires a closed session attempt");
			if (!submitted || !baselineCaptured) return;
			cleanupSignal.throwIfAborted();
			const session = await cleanupClient.session(sessionId, cleanupSignal);
			cleanupSignal.throwIfAborted();
			if (session.status === "failed") await options.onSessionFailed?.();
			if (session.status !== "idle" && session.status !== "failed") throw new Error("Agents API session cleanup requires native work to be retired");
			const snapshot = await history.readSavedState(cleanupClient, cleanupSignal);
			await history.reconcilePriorHistory(cleanupClient, cleanupSignal, snapshot.itemsByTurn);
			await history.projectSavedState(snapshot.entries, cleanupSignal);
			return snapshot.turns.at(-1);
		},
		async close() {
			signal.removeEventListener("abort", onAbort);
			streamController.abort();
			if (submitted && !settled) await cancel();
			await cancellation;
			stopped = true;
			closed = true;
		}
	};
}
//#endregion
export { createAgentsApiSession as t };
