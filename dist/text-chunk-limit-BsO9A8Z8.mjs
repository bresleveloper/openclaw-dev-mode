import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { S as parseStrictInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { d as sleepWithAbort, n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { n as waitForAbortSignal } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import { a as isInsideCode } from "./code-regions-Cy_WAn7O.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as firstDefined } from "./allow-from-Fqs2UkzW.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import "./reply-payload-79LnOCyy.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as findGraphemeChunkEnd } from "./grapheme-CM-qgUZi.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { f as resolveToolsBySender, t as resolveChannelGroupPolicy } from "./group-policy-CBIUperA.mjs";
import { c as resolveTextChunkLimit } from "./chunk-qrwWkfC7.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { C as readTelegramRetryAfterMs, f as isRetryableTelegramApiError, x as isTelegramRateLimitError } from "./fetch-ZC4IpYLZ.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./routing-Dl7FngGa.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-CQ3hKgoh.mjs";
import { S as tokenizeHtmlTags, o as markdownToIR, s as markdownToIRWithMeta, u as sliceMarkdownIR } from "./ir-zdhOg5S3.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-6lmw1mh6.mjs";
import "./reply-chunking-CEuIv6kT.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import { a as FormatCapabilityProfile, i as renderMarkdownIRChunksWithinLimit, n as renderMarkdownWithMarkers, t as chunkTextForOutbound } from "./text-chunking-DlnZEKDK.mjs";
import { n as isAutoLinkedFileRef, t as FILE_REF_EXTENSIONS_WITH_TLD } from "./auto-linked-file-ref-Cj39EQ_j.mjs";
import "./markdown-table-runtime-B_qzxi6O.mjs";
import "./allow-from-0x-NWkHs.mjs";
import "./channel-policy-C81H0zj1.mjs";
import { r as resolveDefaultTelegramAccountId } from "./accounts-CHcpIFN8.mjs";
import { l as parseTelegramTarget, s as normalizeTelegramLookupTarget } from "./topic-conversation-S0gZB4iY.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { Bot as Bot$1, GrammyError } from "grammy";
import "@grammyjs/transformer-throttler";
import { Bottleneck } from "@grammyjs/transformer-throttler/dist/deps.node.js";
//#region extensions/telegram/src/chat-action-timing.ts
const TELEGRAM_CHAT_ACTION_INTERVAL_MS = 4e3;
//#endregion
//#region extensions/telegram/src/grammy-api-throttler.ts
function createOwnedGrammyApiThrottler() {
	const globalThrottler = new Bottleneck({
		reservoir: 30,
		reservoirRefreshAmount: 30,
		reservoirRefreshInterval: 1e3
	});
	const groupThrottler = new Bottleneck.Group({
		maxConcurrent: 1,
		minTime: 1e3,
		reservoir: 20,
		reservoirRefreshAmount: 20,
		reservoirRefreshInterval: 6e4
	});
	const outThrottler = new Bottleneck.Group({
		maxConcurrent: 1,
		minTime: 1e3
	});
	groupThrottler.on("created", (throttler) => throttler.chain(globalThrottler));
	outThrottler.on("created", (throttler) => throttler.chain(globalThrottler));
	let retired = false;
	const transformer = (prev, method, payload, signal) => {
		if (retired) return Promise.reject(/* @__PURE__ */ new Error("Telegram throttler for this token has been released"));
		if (!payload || !("chat_id" in payload)) return prev(method, payload, signal);
		const chatId = Number(payload.chat_id);
		return (chatId < 0 ? groupThrottler.key(`${chatId}`) : outThrottler.key(`${chatId}`)).schedule(() => {
			if (retired) throw new Error("Telegram throttler for this token has been released");
			return prev(method, payload, signal);
		});
	};
	let disposePromise;
	const dispose = () => disposePromise ??= (async () => {
		retired = true;
		const stopKeys = (group) => group.limiters().map(({ limiter }) => limiter.stop({ dropWaitingJobs: true }));
		await Promise.all([
			globalThrottler.stop({ dropWaitingJobs: true }),
			...stopKeys(groupThrottler),
			...stopKeys(outThrottler)
		]);
		const disconnectKeys = (group) => group.limiters().map(({ key }) => group.deleteKey(key));
		await Promise.all([
			globalThrottler.disconnect(),
			...disconnectKeys(groupThrottler),
			...disconnectKeys(outThrottler)
		]);
		for (const group of [groupThrottler, outThrottler]) {
			const interval = group.interval;
			if (interval !== void 0) clearInterval(interval);
		}
	})();
	return {
		transformer,
		dispose
	};
}
//#endregion
//#region extensions/telegram/src/sendchataction-401-backoff.ts
const BACKOFF_POLICY = {
	initialMs: 1e3,
	maxMs: 3e5,
	factor: 2,
	jitter: .1
};
function is401Error(error) {
	if (!error) return false;
	if (typeof error === "object" && "error_code" in error && typeof error.error_code === "number") return error.error_code === 401;
	const message = error instanceof Error ? error.message : JSON.stringify(error);
	return normalizeLowercaseStringOrEmpty(message).includes("unauthorized");
}
/**
* Creates a GLOBAL (per-account) handler for sendChatAction that tracks 401 and
* transient errors across all message contexts. This prevents the infinite loop
* that caused Telegram to delete bots (issue #27092).
*
* When a 401 occurs, exponential backoff is applied (1s → 2s → 4s → ... → 5min).
* After maxConsecutive401 failures (default 10), all sendChatAction calls are
* suspended until reset() is called.
*/
function createTelegramSendChatActionHandler({ logger, maxConsecutive401 = 10, minIntervalMs = 0, now = () => Date.now(), retirementSignal, retiredError }) {
	let consecutive401Failures = 0;
	let consecutiveTransientFailures = 0;
	let transientCooldownUntilMs = 0;
	const blockedUntilByKey = /* @__PURE__ */ new Map();
	const isSuspended = () => consecutive401Failures > 0 && consecutive401Failures >= maxConsecutive401;
	const clearTransientCooldown = () => {
		consecutiveTransientFailures = 0;
		transientCooldownUntilMs = 0;
	};
	const assertNotCoolingDown = () => {
		const remainingMs = transientCooldownUntilMs - now();
		if (remainingMs > 0) throw new Error(`sendChatAction transient cooldown active for ${Math.ceil(remainingMs)}ms`);
	};
	const assertCanSend = () => {
		if (isSuspended()) throw new Error("sendChatAction suspended");
		assertNotCoolingDown();
	};
	const sendChatAction = async (chatId, action, threadParams, send) => {
		if (isSuspended()) return;
		const attemptedAt = now();
		assertNotCoolingDown();
		const threadId = threadParams?.message_thread_id;
		const key = minIntervalMs > 0 ? `${String(chatId)}:${action}${threadId === void 0 ? "" : `:${threadId}`}` : void 0;
		if (key) {
			const blockedUntil = blockedUntilByKey.get(key);
			if (blockedUntil !== void 0 && attemptedAt < blockedUntil) return;
			blockedUntilByKey.set(key, Number.POSITIVE_INFINITY);
		}
		try {
			await send();
		} finally {
			if (key) blockedUntilByKey.set(key, attemptedAt + minIntervalMs);
		}
	};
	const sendWithBackoff = async (send, signal) => {
		signal.throwIfAborted();
		assertCanSend();
		try {
			if (consecutive401Failures > 0) {
				const backoffMs = computeBackoff(BACKOFF_POLICY, consecutive401Failures);
				logger(`sendChatAction backoff: waiting ${backoffMs}ms before retry (failure ${consecutive401Failures}/${maxConsecutive401})`);
				await sleepWithAbort(backoffMs, signal);
			}
			assertCanSend();
			const result = await send();
			if (consecutive401Failures > 0) {
				logger(`sendChatAction recovered after ${consecutive401Failures} consecutive 401 failures`);
				consecutive401Failures = 0;
			}
			clearTransientCooldown();
			return result;
		} catch (error) {
			if (retirementSignal?.aborted && error instanceof Error && error.name === "AbortError") throw retiredError instanceof Error ? retiredError : error;
			if (signal.aborted && error instanceof Error && error.name === "AbortError") throw error;
			if (is401Error(error)) {
				clearTransientCooldown();
				consecutive401Failures++;
				if (consecutive401Failures >= maxConsecutive401) logger(`CRITICAL: sendChatAction suspended after ${consecutive401Failures} consecutive 401 errors. Bot token is likely invalid. Telegram may DELETE the bot if requests continue. Replace the Telegram token in config/env, then restart the Gateway.`);
				else logger(`sendChatAction 401 error (${consecutive401Failures}/${maxConsecutive401}). Retrying with exponential backoff.`);
			} else if (isRetryableTelegramApiError(error, { context: "action" })) {
				consecutiveTransientFailures++;
				const retryAfterMs = readTelegramRetryAfterMs(error);
				const cooldownMs = retryAfterMs !== void 0 && retryAfterMs > 0 ? retryAfterMs : computeBackoff(BACKOFF_POLICY, consecutiveTransientFailures);
				const cooldownStartedAt = now();
				const coalescingUntilMs = cooldownStartedAt + minIntervalMs;
				transientCooldownUntilMs = Math.max(transientCooldownUntilMs, cooldownStartedAt + cooldownMs, coalescingUntilMs);
				const effectiveCooldownMs = Math.max(0, transientCooldownUntilMs - cooldownStartedAt);
				logger(`sendChatAction transient error (${consecutiveTransientFailures}). Cooling down ${effectiveCooldownMs}ms before retry.`);
			} else clearTransientCooldown();
			throw error;
		}
	};
	const apiTransformer = async (prev, method, payload, signal) => {
		if (method !== "sendChatAction") return prev(method, payload, signal);
		const controller = new AbortController();
		const abort = () => controller.abort();
		if (signal?.aborted) abort();
		else signal?.addEventListener("abort", abort, { once: true });
		const onRetired = () => controller.abort();
		if (retirementSignal?.aborted) onRetired();
		else retirementSignal?.addEventListener("abort", onRetired, { once: true });
		try {
			return await sendWithBackoff(async () => {
				const result = await prev(method, payload, signal);
				if (!result.ok) throw new GrammyError(`Call to '${method}' failed!`, result, method, payload);
				return result;
			}, controller.signal);
		} finally {
			signal?.removeEventListener("abort", abort);
			retirementSignal?.removeEventListener("abort", onRetired);
			controller.abort();
		}
	};
	return {
		apiTransformer,
		sendChatAction,
		isSuspended,
		reset: () => {
			consecutive401Failures = 0;
			clearTransientCooldown();
			blockedUntilByKey.clear();
		}
	};
}
//#endregion
//#region extensions/telegram/src/account-throttler.ts
const TELEGRAM_OUTBOUND_FLOOD_BUDGET_MS = 3e5;
const FLOOD_PAUSE_WITHOUT_RETRY_AFTER_MS = 1e3;
const floodLog = createSubsystemLogger("telegram/flood");
const telegramThrottlerReleasedError = /* @__PURE__ */ new Error("Telegram throttler for this token has been released");
const requestScopes = new AsyncLocalStorage();
/** Runs Telegram calls whose content the next update supersedes, such as stream previews. */
function runReplaceableTelegramRequest(run) {
	return requestScopes.run({
		...requestScopes.getStore(),
		replaceable: true
	}, run);
}
/**
* Runs Telegram calls whose caller checked send authority before entering the
* API. A flood wait happens inside that call, so the limiter re-runs the check
* after every wait and before the next attempt reaches Telegram.
*/
function runAuthorizedTelegramRequest(assertCurrent, run) {
	if (!assertCurrent) return run();
	const outer = requestScopes.getStore();
	const outerAssert = outer?.assertCurrent;
	return requestScopes.run({
		...outer,
		assertCurrent: outerAssert ? () => {
			outerAssert();
			assertCurrent();
		} : assertCurrent
	}, run);
}
const unsentFloodResponses = /* @__PURE__ */ new WeakSet();
function skippedFloodResponse(waitMs, reason) {
	const retryAfter = Math.max(1, Math.ceil(waitMs / 1e3));
	const response = {
		ok: false,
		error_code: 429,
		description: `Too Many Requests: retry after ${retryAfter} (${reason}; request not sent)`,
		parameters: { retry_after: retryAfter }
	};
	unsentFloodResponses.add(response);
	return response;
}
/**
* The single enforcement point, run where a request leaves for Telegram after
* every scheduler and throttler queue wait: a closed gate holds the request back
* and the caller's send authority is checked against the current writer.
*/
function admitAtNetwork(gate, scope, prev) {
	const runInContext = AsyncLocalStorage.snapshot();
	return (method, payload, signal) => runInContext(async () => {
		const waitMs = method === "getUpdates" ? 0 : gate.remainingMs();
		if (waitMs > 0) return skippedFloodResponse(waitMs, "flood wait active");
		scope?.assertCurrent?.();
		return prev(method, payload, signal);
	});
}
var TelegramFloodGate = class {
	#untilMs = 0;
	remainingMs() {
		return Math.max(0, this.#untilMs - Date.now());
	}
	close(retryAfterSeconds) {
		const waitMs = retryAfterSeconds !== void 0 && retryAfterSeconds > 0 ? retryAfterSeconds * 1e3 : FLOOD_PAUSE_WITHOUT_RETRY_AFTER_MS;
		this.#untilMs = Math.max(this.#untilMs, Date.now() + waitMs);
		return this.remainingMs();
	}
};
function bridgeTelegramAbortSignal(signal) {
	const controller = new AbortController();
	const abort = () => controller.abort();
	if (signal?.aborted) abort();
	else signal?.addEventListener("abort", abort, { once: true });
	return {
		controller,
		detach: () => signal?.removeEventListener("abort", abort)
	};
}
async function sleepForFloodGate(waitMs, signal, retirementSignal) {
	const { controller, detach } = bridgeTelegramAbortSignal(signal);
	const retire = () => controller.abort();
	retirementSignal.addEventListener("abort", retire, { once: true });
	if (retirementSignal.aborted) retire();
	try {
		await sleepWithAbort(waitMs, controller.signal);
	} catch (error) {
		if (retirementSignal.aborted) throw telegramThrottlerReleasedError;
		throw error;
	} finally {
		retirementSignal.removeEventListener("abort", retire);
		detach();
	}
}
function callThroughFloodGate(gate, replaceable, retirementSignal, prev) {
	return async (method, payload, signal) => {
		if (method === "getUpdates") return prev(method, payload, signal);
		let waitedMs = 0;
		let flooded;
		for (;;) {
			if (retirementSignal.aborted) throw telegramThrottlerReleasedError;
			const waitMs = gate.remainingMs();
			if (waitMs > 0) {
				if (replaceable) return flooded ?? skippedFloodResponse(waitMs, "flood wait active");
				if (waitedMs + waitMs > TELEGRAM_OUTBOUND_FLOOD_BUDGET_MS) return flooded ?? skippedFloodResponse(waitMs, "flood wait exceeds delivery budget");
				await sleepForFloodGate(waitMs, signal, retirementSignal);
				waitedMs += waitMs;
				continue;
			}
			const closeGate = (retryAfterSeconds) => {
				const closedMs = gate.close(retryAfterSeconds);
				floodLog.warn(`Telegram flood control on ${method}: all calls for this bot wait ${Math.ceil(closedMs / 1e3)}s` + (replaceable ? "; replaceable update skipped" : ""));
			};
			let result;
			try {
				result = await prev(method, payload, signal);
			} catch (error) {
				if (isTelegramRateLimitError(error)) {
					const retryAfterMs = readTelegramRetryAfterMs(error);
					closeGate(retryAfterMs === void 0 ? void 0 : retryAfterMs / 1e3);
				}
				throw error;
			}
			if (result.ok || result.error_code !== 429) return result;
			flooded = result;
			if (!unsentFloodResponses.has(result)) closeGate(result.parameters?.retry_after);
			if (replaceable) return result;
		}
	};
}
var GroupRequestScheduler = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.laneCursor = this.lanes.entries();
		this.pendingPriority = 0;
		this.running = false;
		this.actionTail = Promise.resolve();
		this.nextActionAtMs = 0;
		this.retiredReason = null;
		this.pendingActions = /* @__PURE__ */ new Set();
	}
	enqueueAction(run, signal) {
		const { controller, detach } = bridgeTelegramAbortSignal(signal);
		if (this.retiredReason) {
			detach();
			return Promise.reject(this.retiredReason);
		}
		let rejectPending;
		const pending = new Promise((_, reject) => {
			rejectPending = reject;
		});
		const entry = { reject: rejectPending };
		this.pendingActions.add(entry);
		const result = this.actionTail.then(async () => {
			controller.signal.throwIfAborted();
			this.assertNotRetired();
			const waitMs = this.nextActionAtMs - Date.now();
			if (waitMs > 0) await sleepWithAbort(waitMs, controller.signal);
			this.assertNotRetired();
			try {
				return await run(() => this.pendingActions.delete(entry));
			} finally {
				this.nextActionAtMs = Date.now() + 1e3;
			}
		});
		this.actionTail = result.then(() => void 0, () => void 0);
		return Promise.race([
			result,
			pending,
			waitForAbortSignal(controller.signal).then(() => {
				throw new DOMException("Chat action canceled", "AbortError");
			})
		]).finally(() => {
			this.pendingActions.delete(entry);
			detach();
			controller.abort();
		});
	}
	/** Rejects new, queued, and not-yet-dispatching work once the owning account is retired. */
	settleForRetirement(reason) {
		if (this.retiredReason) return;
		this.retiredReason = reason;
		for (const request of this.pendingActions) request.reject(reason);
		this.pendingActions.clear();
		for (const queue of this.lanes.values()) for (const request of queue) request.reject(reason);
		this.lanes.clear();
	}
	assertNotRetired() {
		if (this.retiredReason) throw this.retiredReason;
	}
	/** Holds priority for a reply until it settles, including its flood waits. */
	async withPriority(run) {
		this.pendingPriority += 1;
		try {
			return await run();
		} finally {
			this.pendingPriority -= 1;
		}
	}
	enqueue(laneKey, run, replaceable) {
		if (this.retiredReason) return Promise.reject(this.retiredReason);
		if (replaceable && this.pendingPriority > 0) return Promise.resolve(replaceable.skip());
		return new Promise((resolve, reject) => {
			const request = {
				run: replaceable ? async () => this.pendingPriority > 0 ? replaceable.skip() : await run() : run,
				resolve,
				reject
			};
			const existing = this.lanes.get(laneKey);
			if (existing) existing.push(request);
			else this.lanes.set(laneKey, [request]);
			this.start();
		});
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.drain();
	}
	async drain() {
		try {
			while (true) {
				const request = this.takeNext();
				if (!request) return;
				try {
					request.resolve(await request.run());
				} catch (err) {
					request.reject(err);
				}
			}
		} finally {
			this.running = false;
		}
	}
	takeNext() {
		while (this.lanes.size > 0) {
			const next = this.laneCursor.next();
			if (next.done) {
				this.laneCursor = this.lanes.entries();
				continue;
			}
			const [laneKey, queue] = next.value;
			const request = queue.shift();
			if (request) return request;
			this.lanes.delete(laneKey);
		}
	}
};
const TELEGRAM_ACCOUNT_THROTTLERS_KEY = Symbol.for("openclaw.telegram.accountThrottlers");
function readPayload(payload) {
	return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
	const chatId = parseStrictInteger(payload.chat_id);
	return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
	for (const [field, prefix] of [
		["message_thread_id", "topic"],
		["direct_messages_topic_id", "direct-topic"],
		["message_id", "message"]
	]) {
		const id = parseStrictInteger(payload[field]);
		if (id !== void 0) return `${prefix}:${id}`;
	}
	return "main";
}
function createTelegramAccountThrottler(createThrottler = createOwnedGrammyApiThrottler) {
	const created = createThrottler();
	const baseThrottler = typeof created === "function" ? created : created.transformer;
	const retireController = new AbortController();
	const chatActions = createTelegramSendChatActionHandler({
		logger: (message) => logVerbose(`telegram: ${message}`),
		minIntervalMs: TELEGRAM_CHAT_ACTION_INTERVAL_MS,
		retirementSignal: retireController.signal,
		retiredError: telegramThrottlerReleasedError
	});
	const schedulersByChat = /* @__PURE__ */ new Map();
	let retired = false;
	let disposePromise;
	const dispose = () => {
		if (disposePromise) return disposePromise;
		disposePromise = (async () => {
			retired = true;
			for (const scheduler of schedulersByChat.values()) scheduler.settleForRetirement(telegramThrottlerReleasedError);
			retireController.abort();
			if (typeof created !== "function") await created.dispose();
		})();
		return disposePromise;
	};
	const floodGate = new TelegramFloodGate();
	const finalDispatch = (networkPrev, onDispatch) => (queuedMethod, queuedPayload, queuedSignal) => {
		if (retired) throw telegramThrottlerReleasedError;
		onDispatch?.();
		return networkPrev(queuedMethod, queuedPayload, queuedSignal);
	};
	const getScheduler = (groupChatKey) => {
		let scheduler = schedulersByChat.get(groupChatKey);
		if (!scheduler) {
			scheduler = new GroupRequestScheduler();
			schedulersByChat.set(groupChatKey, scheduler);
		}
		return scheduler;
	};
	const scheduleRequest = (replaceable) => (prev, method, payload, signal) => {
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		if (!apiPayload || !groupChatKey) return baseThrottler((queuedMethod, queuedPayload, queuedSignal) => chatActions.apiTransformer(finalDispatch(prev), queuedMethod, queuedPayload, queuedSignal), method, payload, signal);
		const scheduler = getScheduler(groupChatKey);
		if (method === "sendChatAction") return scheduler.enqueueAction((markDispatched) => chatActions.apiTransformer(finalDispatch(prev, markDispatched), method, payload, signal), signal);
		const laneKey = resolveForumLaneKey(apiPayload);
		return scheduler.enqueue(laneKey, () => baseThrottler(finalDispatch(prev), method, payload, signal), replaceable ? { skip: () => skippedFloodResponse(1e3, "yielded to a pending reply") } : void 0);
	};
	const transformer = (prev, method, payload, signal) => {
		if (retired) return Promise.reject(telegramThrottlerReleasedError);
		const callerScope = requestScopes.getStore();
		const replaceable = method === "sendChatAction" || callerScope?.replaceable === true;
		const scope = replaceable ? {
			...callerScope,
			replaceable: true
		} : callerScope;
		const admitted = admitAtNetwork(floodGate, scope, prev);
		const send = callThroughFloodGate(floodGate, replaceable, retireController.signal, (queuedMethod, queuedPayload, queuedSignal) => scheduleRequest(replaceable)(admitted, queuedMethod, queuedPayload, queuedSignal));
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		return replaceable || !groupChatKey ? send(method, payload, signal) : getScheduler(groupChatKey).withPriority(() => send(method, payload, signal));
	};
	return {
		transformer,
		chatActions,
		dispose
	};
}
function getOrCreateAccountThrottler(token, createThrottler = createOwnedGrammyApiThrottler) {
	const throttlerByToken = resolveGlobalMap(TELEGRAM_ACCOUNT_THROTTLERS_KEY);
	let throttler = throttlerByToken.get(token);
	if (!throttler) {
		throttler = createTelegramAccountThrottler(createThrottler);
		throttlerByToken.set(token, throttler);
	}
	return throttler;
}
/**
* Releases the throttler of a retired bot token: drops the cache entry and
* disconnects its Bottleneck limiters, stopping their heartbeat timers. The
* caller must ensure no other configured account still uses the token.
* Returns false when the token has no cached throttler.
*/
async function releaseAccountThrottler(token) {
	const throttlerByToken = resolveGlobalMap(TELEGRAM_ACCOUNT_THROTTLERS_KEY);
	const throttler = throttlerByToken.get(token);
	if (!throttler) return false;
	throttlerByToken.delete(token);
	try {
		await throttler.dispose();
	} catch (error) {
		floodLog.warn(`failed to dispose Telegram account throttler: ${formatErrorMessage(error)}`);
	}
	return true;
}
//#endregion
//#region extensions/telegram/src/rich-messages-config.ts
/** Whether this Telegram account delivers text as Bot API rich messages. */
function resolveTelegramRichMessages(params) {
	if (params.htmlTextMode) return false;
	return (params.accountConfig ?? mergeTelegramAccountConfig(params.cfg, params.accountId ?? resolveDefaultTelegramAccountId(params.cfg))).richMessages === true;
}
/** Markdown table mode for this account; native block tables only render on rich messages. */
function resolveTelegramTableMode(params) {
	return resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId ?? resolveDefaultTelegramAccountId(params.cfg),
		supportsBlockTables: resolveTelegramRichMessages(params)
	});
}
//#endregion
//#region extensions/telegram/src/group-config-helpers.ts
function resolveTelegramScopedGroupConfig(telegramCfg, chatId, messageThreadId) {
	const chatIdStr = String(chatId);
	const scopedConfigs = chatIdStr.startsWith("-") ? telegramCfg.groups : telegramCfg.direct;
	const groupKey = [chatIdStr, "*"].find((key) => Object.hasOwn(scopedConfigs ?? {}, key));
	const groupConfig = groupKey ? scopedConfigs?.[groupKey] : void 0;
	const topics = messageThreadId == null ? void 0 : groupConfig?.topics;
	const defaultConfig = topics?.["*"];
	const exactConfig = topics?.[String(messageThreadId)];
	return {
		groupConfig,
		topicConfig: defaultConfig && exactConfig ? {
			...defaultConfig,
			...exactConfig
		} : exactConfig ?? defaultConfig
	};
}
function resolveTelegramGroupIngestEnabled(params) {
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy({
		cfg: params.cfg,
		channel: "telegram",
		groupId: String(params.chatId),
		accountId: params.accountId
	});
	return (params.topicConfig?.ingest ?? groupConfig?.ingest ?? defaultConfig?.ingest) === true;
}
function resolveTelegramGroupPromptSettings(params) {
	return {
		skillFilter: firstDefined(params.topicConfig?.skills, params.groupConfig?.skills),
		groupSystemPrompt: [params.groupConfig?.systemPrompt?.trim() || null, params.topicConfig?.systemPrompt?.trim() || null].filter((entry) => Boolean(entry)).join("\n\n") || void 0
	};
}
function resolveTelegramDirectToolPolicy(params) {
	return resolveToolsBySender({
		toolsBySender: params.directConfig?.toolsBySender,
		messageProvider: "telegram",
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername
	}) ?? params.directConfig?.tools;
}
//#endregion
//#region extensions/telegram/src/account-owner.ts
function resolveTelegramAccountOwnerAgentId(params) {
	const { cfg, accountId } = params;
	return resolveAgentRoute({
		cfg,
		channel: "telegram",
		accountId
	}).agentId;
}
//#endregion
//#region extensions/telegram/src/normalize.ts
const TELEGRAM_PREFIX_RE = /^(telegram|tg):/i;
function normalizeTelegramMessagingTarget(raw) {
	const trimmed = raw.trim();
	const prefixStripped = trimmed.replace(TELEGRAM_PREFIX_RE, "").trim();
	const identity = resolveTelegramTargetIdentity(trimmed);
	if (!identity) return;
	const keepLegacyGroupPrefix = /^group:/i.test(prefixStripped);
	const hasTopicSuffix = /:topic:\d+$/i.test(prefixStripped);
	const chatSegment = keepLegacyGroupPrefix ? `group:${identity.chatId}` : identity.chatId;
	const topicId = identity.directMessagesTopicId ?? identity.messageThreadId;
	const threadMarker = identity.directMessagesTopicId != null ? ":direct-topic:" : hasTopicSuffix ? ":topic:" : ":";
	return `telegram:${topicId == null ? chatSegment : `${chatSegment}${threadMarker}${topicId}`}`;
}
function resolveTelegramTargetIdentity(raw) {
	const parsed = parseTelegramTarget(raw);
	const chatId = normalizeTelegramLookupTarget(parsed.chatId);
	if (!chatId) return;
	return {
		chatId: chatId.toLowerCase(),
		messageThreadId: parsed.messageThreadId,
		directMessagesTopicId: parsed.directMessagesTopicId
	};
}
function looksLikeTelegramTargetId(raw) {
	return resolveTelegramTargetIdentity(raw) !== void 0;
}
function telegramMessagingTargetsMatch(target, currentTarget) {
	const targetIdentity = resolveTelegramTargetIdentity(target);
	const currentIdentity = resolveTelegramTargetIdentity(currentTarget);
	return targetIdentity !== void 0 && currentIdentity !== void 0 && targetIdentity.chatId === currentIdentity.chatId && targetIdentity.messageThreadId === currentIdentity.messageThreadId && targetIdentity.directMessagesTopicId === currentIdentity.directMessagesTopicId;
}
//#endregion
//#region extensions/telegram/src/format-html.ts
function escapeTelegramHtml(text) {
	if (!/[&<>]/.test(text)) return text;
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeTelegramHtmlAttr(text) {
	return escapeTelegramHtml(text).replace(/"/g, "&quot;");
}
const TELEGRAM_HTML_ENTITY_PATTERN = /&(#(?:[xX][0-9A-Fa-f]+|\d+)|[A-Za-z0-9]+);/g;
const TELEGRAM_HTML_ENTITY_AT = new RegExp(TELEGRAM_HTML_ENTITY_PATTERN.source, "y");
const TELEGRAM_NAMED_HTML_ENTITIES = /* @__PURE__ */ new Map([
	["amp", "&"],
	["lt", "<"],
	["gt", ">"],
	["quot", "\""],
	["apos", "'"]
]);
const TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS = /* @__PURE__ */ new Set([
	"aside",
	"audio",
	"blockquote",
	"caption",
	"col",
	"colgroup",
	"details",
	"figcaption",
	"figure",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tg-collage",
	"tg-map",
	"tg-math-block",
	"tg-slideshow",
	"tr",
	"ul",
	"video"
]);
function isTelegramRichLineBreakStructuralTag(rawTag, tagName) {
	return TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS.has(tagName) || tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function decodeTelegramHtmlEntity(entity, fallback) {
	if (entity.startsWith("#")) {
		const hex = entity[1] === "x" || entity[1] === "X";
		const radix = hex ? 16 : 10;
		const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), radix);
		return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 1114111 && !(codePoint >= 55296 && codePoint <= 57343) ? String.fromCodePoint(codePoint) : fallback;
	}
	return TELEGRAM_NAMED_HTML_ENTITIES.get(entity) ?? fallback;
}
function decodeTelegramHtmlEntities(text) {
	return text.replace(TELEGRAM_HTML_ENTITY_PATTERN, (match, entity) => decodeTelegramHtmlEntity(entity, match));
}
function findTelegramHtmlEntityEnd(text, start) {
	TELEGRAM_HTML_ENTITY_AT.lastIndex = start;
	return TELEGRAM_HTML_ENTITY_AT.exec(text)?.index === start ? TELEGRAM_HTML_ENTITY_AT.lastIndex - 1 : -1;
}
function mapTelegramHtmlTextOffset(entities, offset, to) {
	let low = 0;
	let high = entities.length;
	while (low < high) {
		const middle = low + high >>> 1;
		const candidate = expectDefined(entities[middle], "Telegram HTML entity binary-search midpoint");
		if ((to === "source" ? candidate.decodedStart : candidate.sourceStart) <= offset) low = middle + 1;
		else high = middle;
	}
	const entity = entities[low - 1];
	if (!entity) return offset;
	const fromEnd = to === "source" ? entity.decodedEnd : entity.sourceEnd;
	const toStart = to === "source" ? entity.sourceStart : entity.decodedStart;
	const toEnd = to === "source" ? entity.sourceEnd : entity.decodedEnd;
	return offset < fromEnd ? toStart : toEnd + offset - fromEnd;
}
function findTelegramHtmlWordSafeSplitIndex(text, start, end) {
	let lastNewline = start;
	let lastWhitespace = start;
	for (let index = start + 1; index < end; index += 1) {
		const char = text[index];
		if (char === "\n") lastNewline = index + 1;
		else if (char !== void 0 && /\s/.test(char)) lastWhitespace = index + 1;
	}
	return lastNewline > start ? lastNewline : lastWhitespace;
}
/** Prepares one text segment; returned cuts are offsets in its original HTML spelling. */
function prepareTelegramHtmlTextSplitter(source) {
	const entities = [];
	const parts = [];
	let sourceOffset = 0;
	let decodedLength = 0;
	for (const match of source.matchAll(TELEGRAM_HTML_ENTITY_PATTERN)) {
		const sourceEnd = match.index + match[0].length;
		const prefix = source.slice(sourceOffset, match.index);
		const decodedEntity = decodeTelegramHtmlEntity(match[0].slice(1, -1), "&");
		parts.push(prefix, decodedEntity);
		decodedLength += prefix.length;
		entities.push({
			sourceStart: match.index,
			sourceEnd,
			decodedStart: decodedLength,
			decodedEnd: decodedLength + decodedEntity.length
		});
		decodedLength += decodedEntity.length;
		sourceOffset = sourceEnd;
	}
	parts.push(source.slice(sourceOffset));
	const decoded = entities.length > 0 ? parts.join("") : source;
	return (start, maxLength, allowPartialGrapheme) => {
		const sourceEnd = start + maxLength;
		const preferredEnd = findTelegramHtmlWordSafeSplitIndex(source, start, sourceEnd);
		return mapTelegramHtmlTextOffset(entities, findGraphemeChunkEnd(decoded, mapTelegramHtmlTextOffset(entities, start, "decoded"), mapTelegramHtmlTextOffset(entities, sourceEnd, "decoded"), mapTelegramHtmlTextOffset(entities, preferredEnd, "decoded"), allowPartialGrapheme), "source");
	};
}
//#endregion
//#region extensions/telegram/src/format-assistant-transcript.ts
const TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX = "<code>Assistant:</code> ";
function telegramProjectionHasRoleHeader(projection) {
	if (!projection.text.includes("[") && !projection.text.includes("<") && !projection.text.includes("&")) return false;
	let masked = "";
	let cursor = 0;
	for (const range of projection.excludedRanges) {
		masked += projection.text.slice(cursor, range.start);
		masked += projection.text.slice(range.start, range.end).replace(/[^\n]+/g, (line) => line.trim() ? `x${" ".repeat(line.length - 1)}` : " ".repeat(line.length));
		cursor = range.end;
	}
	return Boolean(markdownToIR(masked + projection.text.slice(cursor), {
		assistantTranscriptRoleHeaders: true,
		autolink: false,
		blockquotePrefix: "",
		headingStyle: "none",
		linkify: false,
		tableMode: "off"
	}).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"));
}
function projectTelegramHtmlVisibleText(html) {
	const projection = {
		text: "",
		excludedRanges: []
	};
	const depths = {
		code: 0,
		pre: 0
	};
	const append = (value) => {
		if (!value) return;
		const start = projection.text.length;
		projection.text += value;
		if (depths.code === 0 && depths.pre === 0) return;
		const previous = projection.excludedRanges.at(-1);
		if (previous?.end === start) previous.end = projection.text.length;
		else projection.excludedRanges.push({
			start,
			end: projection.text.length
		});
	};
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		append(decodeTelegramHtmlEntities(html.slice(lastIndex, tag.start)));
		if (isTelegramRichLineBreakStructuralTag(tag.raw, tag.name) && projection.text && !projection.text.endsWith("\n")) append("\n");
		if (tag.name === "br" && !tag.closing) append("\n");
		if (!tag.selfClosing && (tag.name === "code" || tag.name === "pre")) depths[tag.name] = tag.closing ? Math.max(0, depths[tag.name] - 1) : depths[tag.name] + 1;
		lastIndex = tag.end;
	}
	append(decodeTelegramHtmlEntities(html.slice(lastIndex)));
	return projection;
}
function protectTelegramAssistantTranscriptRoleHeaders(html) {
	if (html.startsWith("<code>Assistant:</code> ")) return html;
	if (!telegramProjectionHasRoleHeader(projectTelegramHtmlVisibleText(html))) return html;
	return `${TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX}${html}`;
}
//#endregion
//#region extensions/telegram/src/format-html-text.ts
let fileReferencePatterns;
function transformUnprotectedTelegramHtmlText(html, protectedTags, transformText) {
	const depths = protectedTags.map((name) => ({
		name,
		depth: 0
	}));
	let result = "";
	let lastIndex = 0;
	const transform = (text) => depths.some(({ depth }) => depth > 0) ? text : transformText(text);
	for (const tag of tokenizeHtmlTags(html)) {
		result += transform(html.slice(lastIndex, tag.start));
		const tracked = depths.find(({ name }) => name === tag.name);
		if (tracked) tracked.depth = tag.closing ? Math.max(0, tracked.depth - 1) : tracked.depth + 1;
		result += html.slice(tag.start, tag.end);
		lastIndex = tag.end;
	}
	return result + transform(html.slice(lastIndex));
}
function wrapStandaloneFileRef(match, prefix, filename) {
	if (filename.startsWith("//") || /https?:\/\/$/i.test(prefix)) return match;
	return `${prefix}<code>${escapeTelegramHtml(filename)}</code>`;
}
function wrapSegmentFileRefs(text) {
	if (!text.includes(".")) return text;
	if (!fileReferencePatterns) {
		const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegExp).join("|");
		fileReferencePatterns = {
			standalone: new RegExp(`(^|[^a-zA-Z0-9_\\-/])([a-zA-Z0-9_.\\-./]+\\.(?:${fileExtensionsPattern}))(?=$|[^a-zA-Z0-9_\\-/])`, "gi"),
			orphanedTld: new RegExp(`([^a-zA-Z0-9]|^)([A-Za-z]\\.(?:${fileExtensionsPattern}))(?=[^a-zA-Z0-9/]|$)`, "g")
		};
	}
	const patterns = fileReferencePatterns;
	return text.replace(patterns.standalone, wrapStandaloneFileRef).replace(patterns.orphanedTld, (match, prefix, tld) => prefix === ">" ? match : `${prefix}<code>${escapeTelegramHtml(tld)}</code>`);
}
function wrapFileReferencesInHtml(html) {
	return transformUnprotectedTelegramHtmlText(html, [
		"code",
		"pre",
		"a"
	], wrapSegmentFileRefs);
}
//#endregion
//#region extensions/telegram/src/rich-block-model.ts
const TELEGRAM_USER_MENTION_HREF_RE = /^tg:\/\/user\?id=(\d+)$/i;
function richTextLink(text, url) {
	const id = Number(TELEGRAM_USER_MENTION_HREF_RE.exec(url)?.[1]);
	return Number.isSafeInteger(id) ? {
		type: "text_mention",
		text,
		user: {
			id,
			is_bot: false,
			first_name: ""
		}
	} : {
		type: "url",
		text,
		url
	};
}
function normalizeRichText(value, depth = 0) {
	if (depth >= 15) return richTextToPlainString(value);
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		const flattened = [];
		for (const item of value) {
			const normalized = normalizeRichText(item, depth + 1);
			if (Array.isArray(normalized)) flattened.push(...normalized);
			else if (normalized !== "") flattened.push(normalized);
		}
		return flattened.length <= 1 ? flattened[0] ?? "" : flattened;
	}
	if (value.type === "mathematical_expression" || value.type === "custom_emoji") return value;
	return {
		...value,
		text: normalizeRichText(value.text, depth + 1)
	};
}
function countRichTextChars(text) {
	const size = {
		chars: 0,
		blocks: 0,
		media: 0,
		nesting: 0
	};
	measureRichBlockText(text, size, 0);
	return size.chars;
}
function measureRichBlockText(text, size, depth) {
	const pending = [{
		text,
		depth
	}];
	while (pending.length > 0) {
		const frame = pending.pop();
		const value = frame.text;
		if (typeof value === "string") size.chars += value.length;
		else if (Array.isArray(value)) for (const part of value) pending.push({
			text: part,
			depth: frame.depth
		});
		else if (value.type === "mathematical_expression") size.chars += value.expression.length;
		else if (value.type === "custom_emoji") size.chars += value.alternative_text.length;
		else {
			size.nesting = Math.max(size.nesting, frame.depth + 1);
			pending.push({
				text: value.text,
				depth: frame.depth + 1
			});
		}
	}
}
function measureRichBlockCaption(caption, size, depth) {
	if (caption) {
		size.nesting = Math.max(size.nesting, depth);
		measureRichBlockText(caption.text, size, depth);
		if (caption.credit) measureRichBlockText(caption.credit, size, depth);
	}
}
/** Bot API budgets: UTF-16 text, nested blocks/items/rows, media, and formatting edges. */
function measureInputRichBlocks(blocks) {
	const size = {
		chars: 0,
		blocks: 0,
		media: 0,
		nesting: 0
	};
	const pending = [{
		children: blocks,
		depth: 0
	}];
	while (pending.length > 0) {
		const { children, depth } = pending.pop();
		size.nesting = Math.max(size.nesting, depth);
		for (const block of children) {
			size.blocks += 1;
			switch (block.type) {
				case "paragraph":
				case "heading":
				case "footer":
				case "pre":
					measureRichBlockText(block.text, size, depth);
					break;
				case "mathematical_expression":
					size.chars += block.expression.length;
					break;
				case "pullquote":
					measureRichBlockCaption(block, size, depth);
					break;
				case "blockquote":
					pending.push({
						children: block.blocks,
						depth: depth + 1
					});
					if (block.credit) measureRichBlockText(block.credit, size, depth + 1);
					break;
				case "details":
					pending.push({
						children: block.blocks,
						depth: depth + 1
					});
					measureRichBlockText(block.summary, size, depth + 1);
					break;
				case "collage":
				case "slideshow":
					pending.push({
						children: block.blocks,
						depth: depth + 1
					});
					measureRichBlockCaption(block.caption, size, depth + 1);
					break;
				case "list":
					size.blocks += block.items.length;
					size.nesting = Math.max(size.nesting, depth + 1);
					for (const item of block.items) pending.push({
						children: item.blocks,
						depth: depth + 1
					});
					break;
				case "table":
					size.blocks += block.cells.length;
					size.nesting = Math.max(size.nesting, depth + 1);
					if (block.caption) measureRichBlockText(block.caption, size, depth + 1);
					for (const row of block.cells) for (const cell of row) {
						const text = cell.text;
						if (text) measureRichBlockText(text, size, depth + 1);
					}
					break;
				case "photo":
				case "video":
				case "audio":
				case "animation":
				case "voice_note":
					size.media += 1;
					measureRichBlockCaption(block.caption, size, depth + 1);
					break;
				case "map": measureRichBlockCaption(block.caption, size, depth + 1);
			}
		}
	}
	return size;
}
function richTextToPlainString(text) {
	const parts = [];
	const pending = [text];
	while (pending.length > 0) {
		const node = pending.pop();
		if (typeof node === "string") parts.push(node);
		else if (Array.isArray(node)) for (let index = node.length - 1; index >= 0; index -= 1) pending.push(node[index]);
		else if (node.type === "mathematical_expression") parts.push(node.expression);
		else if (node.type === "custom_emoji") parts.push(node.alternative_text);
		else pending.push(node.text);
	}
	return parts.join("");
}
function richTextWithCreditToPlainText(caption) {
	const credit = caption.credit ? ` — ${richTextToPlainString(caption.credit)}` : "";
	return `${richTextToPlainString(caption.text)}${credit}`;
}
function captionToPlainText(caption) {
	return caption ? richTextWithCreditToPlainText(caption).trim() : "";
}
function inputRichBlocksToPlainText(blocks) {
	let result = "";
	const pending = [];
	const visit = (children, listDepth, finish) => {
		pending.push({
			blocks: children,
			index: 0,
			listDepth,
			parts: [],
			finish
		});
	};
	visit(blocks, 0, (text) => {
		result = text;
	});
	while (pending.length > 0) {
		const frame = pending[pending.length - 1];
		if (frame.index === frame.blocks.length) {
			pending.pop();
			frame.finish(frame.parts.join("\n"));
			continue;
		}
		const { listDepth } = frame;
		const push = (value) => {
			if (value) frame.parts.push(value);
		};
		const block = frame.blocks[frame.index++];
		switch (block.type) {
			case "paragraph":
			case "heading":
			case "footer":
			case "pre":
				push(richTextToPlainString(block.text));
				break;
			case "mathematical_expression":
				push(block.expression);
				break;
			case "pullquote":
				push(richTextWithCreditToPlainText(block));
				break;
			case "blockquote":
				visit(block.blocks, listDepth, (text) => {
					push(text);
					if (block.credit) push(`— ${richTextToPlainString(block.credit)}`);
				});
				break;
			case "collage":
			case "slideshow":
				visit(block.blocks, listDepth, (text) => {
					push(text);
					push(captionToPlainText(block.caption));
				});
				break;
			case "details":
				push(richTextToPlainString(block.summary));
				visit(block.blocks, listDepth, push);
				break;
			case "list":
				for (let index = block.items.length - 1; index >= 0; index -= 1) {
					const item = block.items[index];
					const markerText = item.has_checkbox ? item.is_checked ? "[x] " : "[ ] " : item.value !== void 0 ? `${item.value}. ` : "• ";
					const marker = `${"  ".repeat(listDepth)}${markerText}`;
					visit(item.blocks, listDepth + 1, (text) => push(`${marker}${text}`));
				}
				break;
			case "table":
				if (block.caption !== void 0) push(richTextToPlainString(block.caption));
				for (const row of block.cells) push(row.map((cell) => richTextToPlainString(cell.text ?? "")).join(" | "));
				break;
			case "photo":
				push(`${captionToPlainText(block.caption)} ${block.photo.media}`.trim());
				break;
			case "video":
				push(`${captionToPlainText(block.caption)} ${block.video.media}`.trim());
				break;
			case "audio":
				push(`${captionToPlainText(block.caption)} ${block.audio.media}`.trim());
				break;
			case "animation":
				push(`${captionToPlainText(block.caption)} ${block.animation.media}`.trim());
				break;
			case "voice_note":
				push(`${captionToPlainText(block.caption)} ${block.voice_note.media}`.trim());
				break;
			case "map": push(`${captionToPlainText(block.caption)} ${block.location.latitude},${block.location.longitude}`.trim());
		}
	}
	return result;
}
function normalizeRichCaption(caption, depth) {
	return {
		text: normalizeRichText(caption.text, depth),
		...caption.credit === void 0 ? {} : { credit: normalizeRichText(caption.credit, depth) }
	};
}
/** Bound caller-supplied blocks before recursive splitting or wire serialization. */
function normalizeInputRichBlocks(blocks, depth = 0) {
	if (depth >= 15) return [{
		type: "paragraph",
		text: inputRichBlocksToPlainText(blocks)
	}];
	return blocks.map((block) => {
		const textDepth = depth + 1;
		switch (block.type) {
			case "paragraph":
			case "heading":
			case "footer": return {
				...block,
				text: normalizeRichText(block.text, textDepth)
			};
			case "pullquote": return {
				...block,
				...normalizeRichCaption(block, textDepth)
			};
			case "blockquote": return {
				...block,
				blocks: normalizeInputRichBlocks(block.blocks, depth + 1),
				...block.credit === void 0 ? {} : { credit: normalizeRichText(block.credit, textDepth) }
			};
			case "details": return {
				...block,
				summary: normalizeRichText(block.summary, textDepth),
				blocks: normalizeInputRichBlocks(block.blocks, depth + 1)
			};
			case "list": return {
				...block,
				items: block.items.map((item) => ({
					...item,
					blocks: normalizeInputRichBlocks(item.blocks, depth + 1)
				}))
			};
			case "table": return {
				...block,
				...block.caption === void 0 ? {} : { caption: normalizeRichText(block.caption, textDepth) },
				cells: block.cells.map((row) => row.map((cell) => ({
					...cell,
					...cell.text === void 0 ? {} : { text: normalizeRichText(cell.text, textDepth) }
				})))
			};
			case "collage":
			case "slideshow":
			case "photo":
			case "video":
			case "audio":
			case "animation":
			case "voice_note":
			case "map": return {
				...block,
				..."blocks" in block ? { blocks: normalizeInputRichBlocks(block.blocks, depth + 1) } : {},
				...block.caption === void 0 ? {} : { caption: normalizeRichCaption(block.caption, textDepth) }
			};
			default: return block;
		}
	});
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html.ts
const VOID_TAGS = /* @__PURE__ */ new Set([
	"br",
	"hr",
	"img",
	"input",
	"tg-map"
]);
const INLINE_STYLE_TAGS = {
	b: "bold",
	strong: "bold",
	i: "italic",
	em: "italic",
	u: "underline",
	ins: "underline",
	s: "strikethrough",
	del: "strikethrough",
	strike: "strikethrough",
	code: "code",
	"tg-spoiler": "spoiler",
	mark: "marked",
	sub: "subscript",
	sup: "superscript"
};
const HTML_ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
function parseHtmlAttrs(raw) {
	const attrs = /* @__PURE__ */ new Map();
	const inner = raw.replace(/^<\/?[a-zA-Z][a-zA-Z0-9-]*/, "").replace(/\/?>$/, "");
	for (const match of inner.matchAll(HTML_ATTR_RE)) {
		const name = match[1]?.toLowerCase();
		if (name) attrs.set(name, decodeTelegramHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ""));
	}
	return attrs;
}
/** Parse an HTML fragment into a light node tree; unmatched tags stay text. */
function parseHtmlFragment(ir) {
	const text = ir.text;
	const literalRanges = [...ir.styles.filter((span) => span.style === "code" || span.style === "code_block"), ...ir.annotations ?? []];
	const root = [];
	const stack = [];
	const childrenOf = () => stack.at(-1)?.children ?? root;
	let cursor = 0;
	const pushText = (from, to) => {
		if (to > from) childrenOf().push({
			kind: "text",
			text: text.slice(from, to),
			start: from,
			end: to
		});
	};
	for (const tag of ir.htmlTags ?? []) {
		const parent = stack.at(-1);
		if (literalRanges.some((range) => tag.start >= range.start && tag.start < range.end) || (parent?.name === "code" || parent?.name === "pre") && !(tag.closing && tag.name === parent.name) && !(parent.name === "pre" && !tag.closing && tag.name === "code")) continue;
		pushText(cursor, tag.start);
		cursor = tag.end;
		if (tag.closing) {
			const openIndex = stack.findLastIndex((entry) => entry.name === tag.name);
			if (openIndex >= 0) {
				for (let depth = openIndex; depth < stack.length; depth += 1) {
					stack[depth].closed = depth === openIndex;
					stack[depth].end = depth === openIndex ? tag.end : tag.start;
				}
				stack.length = openIndex;
			} else childrenOf().push({
				kind: "text",
				text: tag.raw,
				start: tag.start,
				end: tag.end
			});
			continue;
		}
		const selfContained = tag.selfClosing || VOID_TAGS.has(tag.name);
		const element = {
			kind: "element",
			name: tag.name,
			raw: tag.raw,
			children: [],
			closed: selfContained,
			start: tag.start,
			end: selfContained ? tag.end : text.length
		};
		childrenOf().push(element);
		if (!selfContained) stack.push(element);
	}
	pushText(cursor, text.length);
	const pending = [{
		nodes: root,
		depth: 0
	}];
	while (pending.length > 0) {
		const frame = pending.pop();
		for (let index = 0; index < frame.nodes.length; index += 1) {
			const node = frame.nodes[index];
			if (node.kind !== "element") continue;
			if (frame.depth >= 60) frame.nodes[index] = {
				kind: "text",
				start: node.start,
				end: node.end,
				text: nodeText([node], true)
			};
			else pending.push({
				nodes: node.children,
				depth: frame.depth + 1
			});
		}
	}
	return root;
}
function nodeText(nodes, preserveMediaSources = false) {
	const parts = [];
	const pending = nodes.toReversed();
	while (pending.length > 0) {
		const node = pending.pop();
		if (node.kind === "text") parts.push(decodeTelegramHtmlEntities(node.text));
		else {
			if (!node.closed) parts.push(decodeTelegramHtmlEntities(node.raw));
			if (preserveMediaSources && node.closed && (node.name === "img" || node.name === "video" || node.name === "audio")) {
				const source = parseHtmlAttrs(node.raw).get("src");
				if (source) parts.push(`\n${source}\n`);
			}
			for (let index = node.children.length - 1; index >= 0; index -= 1) pending.push(node.children[index]);
		}
	}
	return parts.join("");
}
function serializeHtmlNodes(nodes) {
	return nodes.map((node) => {
		if (node.kind === "text") return node.text;
		return VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>") ? node.raw : `${node.raw}${serializeHtmlNodes(node.children)}${node.closed ? `</${node.name}>` : ""}`;
	}).join("");
}
const defaultHtmlRenderer = {
	text: (node) => decodeTelegramHtmlEntities(node.text.replace(/\s+/g, " ")),
	literal: (_range, serialize) => serialize(),
	wrap: (_range, wrap, children) => wrap(children()),
	atom: (_range, value) => value
};
/** The same tag mapping serves standalone HTML and Markdown source-range composition. */
function htmlNodesToRichText(nodes, renderer = defaultHtmlRenderer) {
	const renderNode = (node) => {
		if (node.kind === "text") return renderer.text(node) || void 0;
		const children = () => htmlNodesToRichText(node.children, renderer);
		const emit = (build) => node.closed ? build() : [renderer.atom({
			start: node.start,
			end: node.start + node.raw.length
		}, node.raw), children()];
		const wrap = (build) => emit(() => renderer.wrap(node, build, children));
		const atom = (value) => emit(() => renderer.atom(node, value));
		const style = Object.hasOwn(INLINE_STYLE_TAGS, node.name) && INLINE_STYLE_TAGS[node.name];
		if (style) return wrap((text) => ({
			type: style,
			text
		}));
		if (node.name === "a") {
			const href = parseHtmlAttrs(node.raw).get("href");
			if (href?.startsWith("#")) return wrap((text) => ({
				type: "anchor_link",
				text,
				anchor_name: href.slice(1)
			}));
			return href ? wrap((text) => richTextLink(text, href)) : emit(children);
		}
		if (node.name === "tg-math") return atom({
			type: "mathematical_expression",
			expression: nodeText(node.children)
		});
		if (node.name === "tg-emoji") {
			const emojiId = parseHtmlAttrs(node.raw).get("emoji-id");
			const alternative = nodeText(node.children).replace(/\s+/g, " ").trim();
			if (emojiId && /^\d+$/.test(emojiId) && alternative) return atom({
				type: "custom_emoji",
				custom_emoji_id: emojiId,
				alternative_text: alternative
			});
			return atom(alternative);
		}
		if (node.name === "br") return atom("\n");
		if (node.name === "p" || node.name === "span" || node.name === "div") return emit(children);
		return renderer.literal(node, () => serializeHtmlNodes([node]));
	};
	const parts = [];
	for (const node of nodes) {
		const value = renderNode(node);
		if (value !== void 0) parts.push(value);
	}
	return parts.length > 1 ? parts : parts[0] ?? "";
}
//#endregion
//#region extensions/telegram/src/text-width.ts
const TELEGRAM_GRAPHEME_SEGMENTER = new Intl.Segmenter(void 0, { granularity: "grapheme" });
const TELEGRAM_WIDE_CODE_POINT_PATTERN = /[\u1100-\u115F\u2E80-\u9FFF\uA000-\uA4FF\uAC00-\uD7AF\uF900-\uFAFF\uFE30-\uFE4F\uFF01-\uFF60\uFFE0-\uFFE6\u{20000}-\u{2FA1F}]/u;
const EMOJI_PRESENTATION_PATTERN = /\p{Emoji_Presentation}/u;
const EXTENDED_PICTOGRAPHIC_PATTERN = /\p{Extended_Pictographic}/u;
const NON_PRINTING_ONLY_PATTERN = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Mark}]+$/u;
const EMOJI_PRESENTATION_SELECTOR = "️";
const KEYCAP_COMBINING_MARK = "⃣";
function telegramMonospaceGraphemeWidth(grapheme) {
	if (grapheme.includes(KEYCAP_COMBINING_MARK) || EMOJI_PRESENTATION_PATTERN.test(grapheme) || grapheme.includes(EMOJI_PRESENTATION_SELECTOR) && EXTENDED_PICTOGRAPHIC_PATTERN.test(grapheme) || TELEGRAM_WIDE_CODE_POINT_PATTERN.test(grapheme)) return 2;
	return NON_PRINTING_ONLY_PATTERN.test(grapheme) ? 0 : 1;
}
function telegramMonospaceWidth(text) {
	let width = 0;
	for (const { segment } of TELEGRAM_GRAPHEME_SEGMENTER.segment(text)) width += telegramMonospaceGraphemeWidth(segment);
	return width;
}
function padTelegramMonospaceCell(text, width) {
	return `${text}${" ".repeat(Math.max(0, width - telegramMonospaceWidth(text)))}`;
}
function renderTelegramMonospaceGrid(rows, options = {}) {
	const widths = [];
	for (const row of rows) for (const [index, text] of row.entries()) widths[index] = Math.max(widths[index] ?? 3, telegramMonospaceWidth(text ?? ""));
	const renderRow = (row) => `| ${widths.map((width, index) => padTelegramMonospaceCell(row[index] ?? "", width)).join(" | ")} |`;
	const lines = rows.map(renderRow);
	if (options.headerSeparator && lines.length > 0) lines.splice(1, 0, `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`);
	return lines.join("\n");
}
//#endregion
//#region extensions/telegram/src/format.ts
function buildTelegramLink(link, text, context) {
	const href = link.href.trim();
	if (link.start === link.end || !/^(?:https?:\/\/|tg:\/\/|mailto:|tel:|#)/i.test(href)) return null;
	const label = text.slice(link.start, link.end);
	if (context.origin === "linkify" && isAutoLinkedFileRef(href, label)) return null;
	const safeHref = escapeTelegramHtmlAttr(href);
	return {
		start: link.start,
		end: link.end,
		open: `<a href="${safeHref}">`,
		close: "</a>"
	};
}
function buildTelegramCodeBlockOpen(span) {
	return `<pre><code${span.language ? ` class="language-${escapeTelegramHtmlAttr(span.language)}"` : ""}>`;
}
function renderTelegramHtml(ir, wrapFileRefs = true) {
	const telegramHtml = renderSupportedTelegramHtml(renderMarkdownWithMarkers(ir, {
		annotationMarkers: { assistant_transcript_role: {
			open: "<code>",
			close: "</code>",
			suppressNestedFormatting: true
		} },
		styleMarkers: {
			bold: {
				open: "<b>",
				close: "</b>"
			},
			italic: {
				open: "<i>",
				close: "</i>"
			},
			strikethrough: {
				open: "<s>",
				close: "</s>"
			},
			code: {
				open: "<code>",
				close: "</code>"
			},
			code_block: {
				open: buildTelegramCodeBlockOpen,
				close: "</code></pre>"
			},
			spoiler: {
				open: "<tg-spoiler>",
				close: "</tg-spoiler>"
			},
			blockquote: {
				open: "<blockquote>",
				close: "</blockquote>"
			}
		},
		escapeText: escapeTelegramHtml,
		buildLink: buildTelegramLink
	}));
	return wrapFileRefs ? wrapFileReferencesInHtml(telegramHtml) : telegramHtml;
}
function shouldPreserveTelegramListBoundarySpacing(previous, next) {
	const previousIndent = /^([ \t]*)[•*+-][ \t]+\S/.exec(previous)?.[1];
	const nextIndent = /^([ \t]*)(?:\d+[.)]|#{1,6})[ \t]+\S/.exec(next)?.[1];
	return previousIndent !== void 0 && nextIndent !== void 0 && nextIndent.length <= previousIndent.length;
}
function preserveTelegramListBoundarySpacing(markdown) {
	let codeRegions;
	let previousLine = "";
	let previousOffset = 0;
	let offset = 0;
	return markdown.split("\n").map((line) => {
		const normalizedLine = line.replace(/\r$/, "");
		const insertBoundary = shouldPreserveTelegramListBoundarySpacing(previousLine, normalizedLine) && !isInsideCode(previousOffset, codeRegions ??= findMarkdownCodeRegions(markdown)) && !isInsideCode(offset, codeRegions);
		previousLine = normalizedLine;
		previousOffset = offset;
		offset += line.length + 1;
		return insertBoundary ? `\n${line}` : line;
	}).join("\n");
}
function parseTelegramLegacyMarkdown(markdown, tableMode) {
	return markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
		assistantTranscriptRoleHeaders: true,
		linkify: true,
		enableSpoilers: true,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode: tableMode === "block" ? "code" : tableMode,
		allowAllLinkSchemes: true
	});
}
function markdownToTelegramHtml(markdown, options = {}) {
	return renderTelegramHtml(parseTelegramLegacyMarkdown(markdown, options.tableMode), options.wrapFileRefs !== false);
}
const HTML_MODE_TAG_PATTERN = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>$/;
const ESCAPED_HTML_TAG_PATTERN = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)&gt;/g;
const TELEGRAM_HTML_ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const TELEGRAM_HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const TELEGRAM_HTML_TAG_PATTERN = /<[^>]*>/g;
const TELEGRAM_RICH_HTML_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const TELEGRAM_HTML_CAPTION_PATTERN = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i;
const TELEGRAM_HTML_COLSPAN_PATTERN = /(?:^|\s)colspan\s*=\s*(['"]?)\s*(\d+)\s*\1(?=\s|$)/i;
const TELEGRAM_SIMPLE_HTML_TAGS = /* @__PURE__ */ new Set([
	"b",
	"strong",
	"i",
	"em",
	"u",
	"ins",
	"s",
	"strike",
	"del",
	"code",
	"pre",
	"tg-spoiler"
]);
const TELEGRAM_ATTR_HTML_TAG_PATTERNS = /* @__PURE__ */ new Map([
	["a", /^\s+href="[^"]+"\s*$/],
	["span", /^\s+class="tg-spoiler"\s*$/],
	["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
	["tg-time", /^\s+unix="[1-9]\d*"(?:\s+format="(?:r|w?[dD]?[tT]?)")?\s*$/],
	["blockquote", /^(\s+expandable)?\s*$/]
]);
const TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN = /^\s+class="language-[^"]+"\s*$/;
function popLastTagName(tags, name) {
	const index = tags.lastIndexOf(name);
	if (index < 0) return false;
	tags.splice(index, 1);
	return true;
}
function isSupportedTelegramHtmlTag(closing, name, attrs) {
	if (TELEGRAM_SIMPLE_HTML_TAGS.has(name)) return attrs.trim() === "";
	const pattern = TELEGRAM_ATTR_HTML_TAG_PATTERNS.get(name);
	return pattern !== void 0 && (closing ? attrs.trim() === "" : pattern.test(attrs));
}
function preserveTelegramHtmlTag(rawTag, openTags, escapeTag) {
	const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
	if (!match) return escapeTag(rawTag);
	const closing = match[1] === "/";
	const tagName = normalizeLowercaseStringOrEmpty(match[2]);
	const attrs = match[3] ?? "";
	if (!closing && tagName === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) {
		openTags.push(tagName);
		return openTags.includes("pre") ? rawTag : "<code>";
	}
	if (!isSupportedTelegramHtmlTag(closing, tagName, attrs)) return escapeTag(rawTag);
	if (closing) return popLastTagName(openTags, tagName) ? rawTag : escapeTag(rawTag);
	openTags.push(tagName);
	return rawTag;
}
function escapeUnsupportedTelegramHtml(text) {
	let result = "";
	const openTags = [];
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const end = char === "&" ? findTelegramHtmlEntityEnd(text, index) : char === "<" ? text.indexOf(">", index + 1) : -1;
		if (end === -1) {
			result += char === "&" || char === "<" || char === ">" ? escapeTelegramHtml(char) : char;
			continue;
		}
		const raw = text.slice(index, end + 1);
		result += char === "&" ? raw : preserveTelegramHtmlTag(raw, openTags, escapeTelegramHtml);
		index = end;
	}
	return result;
}
function resolveTelegramHtmlVisibleText(html) {
	return decodeTelegramHtmlEntities(html.replace(TELEGRAM_HTML_BREAK_PATTERN, "\n").replace(TELEGRAM_HTML_TAG_PATTERN, ""));
}
function countTelegramHtmlVisibleCharacters(html) {
	return resolveTelegramHtmlVisibleText(html).length;
}
function telegramHtmlToPlainTextFallback(html) {
	const withPlainTables = html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
		return parseTelegramRichHtmlTableRows(tableHtml).map((row) => row.join(" | ")).join("\n");
	});
	TELEGRAM_HTML_ANCHOR_PATTERN.lastIndex = 0;
	return resolveTelegramHtmlVisibleText(withPlainTables.replace(TELEGRAM_HTML_ANCHOR_PATTERN, (_match, doubleQuotedHref, singleQuotedHref, unquotedHref, labelHtml) => {
		const href = decodeTelegramHtmlEntities(doubleQuotedHref ?? singleQuotedHref ?? unquotedHref ?? "").trim();
		const label = resolveTelegramHtmlVisibleText(labelHtml).trim();
		if (!href) return escapeTelegramHtml(label);
		return escapeTelegramHtml(!label || label === href ? href : `${label} (${href})`);
	}));
}
function promoteEscapedSupportedTelegramTags(text, openTags) {
	ESCAPED_HTML_TAG_PATTERN.lastIndex = 0;
	return text.replace(ESCAPED_HTML_TAG_PATTERN, (match, closing, name, attrs) => preserveTelegramHtmlTag(`<${closing}${name}${attrs}>`, openTags, () => match));
}
function renderSupportedTelegramHtml(html) {
	const openEscapedTags = [];
	return protectTelegramAssistantTranscriptRoleHeaders(html.includes("&lt;") ? transformUnprotectedTelegramHtmlText(html, ["code", "pre"], (text) => promoteEscapedSupportedTelegramTags(text, openEscapedTags)) : html);
}
/** Project authored rich tags, leaving entity-escaped examples and code literal. */
function downgradeRichBlockTags(text, markdown) {
	if (!text.includes("<")) return text;
	const codeRegions = markdown ? findMarkdownCodeRegions(text) : [];
	const lists = [];
	const items = [];
	const parts = [];
	let codeDepth = 0;
	let cursor = 0;
	let lineStart = true;
	let trailingBoundary = -1;
	const append = (value) => {
		parts.push(value);
		if (value) {
			if (trailingBoundary >= 0 && value.startsWith("\n")) parts[trailingBoundary] = "";
			trailingBoundary = -1;
			lineStart = value.endsWith("\n");
		}
	};
	const boundary = () => {
		if (!lineStart) {
			append("\n");
			trailingBoundary = parts.length - 1;
		}
	};
	for (const tag of tokenizeHtmlTags(text)) {
		const raw = tag.raw;
		append(text.slice(cursor, tag.start));
		cursor = tag.end;
		let escapeStart = tag.start;
		if (markdown) while (escapeStart > 0 && text[escapeStart - 1] === "\\") escapeStart -= 1;
		if (isInsideCode(tag.start, codeRegions) || (tag.start - escapeStart) % 2 === 1) {
			append(raw);
			continue;
		}
		if (tag.name === "code" || tag.name === "pre") {
			codeDepth = tag.closing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
			append(raw);
			continue;
		}
		if (codeDepth > 0) {
			append(raw);
			continue;
		}
		switch (tag.name) {
			case "ul":
			case "ol":
				boundary();
				if (tag.closing) lists.pop();
				else {
					const listStart = tag.name === "ol" ? Number(parseHtmlAttrs(tag.raw).get("start") ?? 1) : 1;
					lists.push({
						name: tag.name,
						next: Number.isInteger(listStart) && listStart > 0 ? listStart : 1
					});
				}
				break;
			case "li":
				if (tag.closing) items.pop();
				else {
					boundary();
					const list = lists.at(-1);
					const indent = "  ".repeat(Math.max(0, lists.length - 1));
					append(markdown ? indent.replaceAll(" ", "&#32;") : indent);
					items.push(parts.length);
					const marker = list?.name === "ol" ? `${list.next++}. ` : "• ";
					append(markdown ? marker.replace(/^\d/, (digit) => `&#${digit.charCodeAt(0)};`) : marker);
				}
				break;
			case "input": {
				const attrs = parseHtmlAttrs(tag.raw);
				if (!tag.closing && attrs.get("type")?.toLowerCase() === "checkbox") {
					const marker = attrs.has("checked") ? "[x] " : "[ ] ";
					const item = items.at(-1);
					if (item !== void 0) parts[item] = marker;
					else append(marker);
				} else append(raw);
				break;
			}
			case "aside":
				append(tag.closing ? "</blockquote>" : "<blockquote>");
				break;
			case "hr": break;
			default: append(raw);
		}
	}
	append(text.slice(cursor));
	if (trailingBoundary >= 0) parts[trailingBoundary] = "";
	return parts.join("");
}
function renderTelegramHtmlText(text, options = {}) {
	const source = options.downgradeRichPromptTags === true ? downgradeRichBlockTags(text, options.textMode !== "html") : text;
	return options.textMode === "html" ? escapeUnsupportedTelegramHtml(normalizeTelegramLegacyHtmlTables(source)) : markdownToTelegramHtml(source, { tableMode: options.tableMode });
}
function normalizeTelegramLegacyHtmlTables(html) {
	const tags = tokenizeHtmlTags(html);
	const depth = {
		code: 0,
		pre: 0
	};
	let nextTag;
	TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
	return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml, offset) => {
		nextTag ??= tags.next();
		while (!nextTag.done && nextTag.value.start < offset) {
			const { name, closing } = nextTag.value;
			if (name === "code" || name === "pre") depth[name] = closing ? Math.max(0, depth[name] - 1) : depth[name] + 1;
			nextTag = tags.next();
		}
		if (depth.code > 0 || depth.pre > 0) return tableHtml;
		const rows = parseTelegramRichHtmlTableRows(tableHtml);
		return rows.length ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
	});
}
function parseTelegramHtmlColspan(attrs) {
	const raw = TELEGRAM_HTML_COLSPAN_PATTERN.exec(attrs)?.[2];
	const value = raw ? Number.parseInt(raw, 10) : 1;
	return Number.isFinite(value) && value > 1 ? Math.min(value, 21) : 1;
}
function parseTelegramRichHtmlTableRows(tableHtml) {
	const rows = [];
	TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
	let rowMatch;
	while ((rowMatch = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)) !== null) {
		const rowHtml = rowMatch[1] ?? "";
		const row = [];
		TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
		let cellMatch;
		while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(rowHtml)) !== null) {
			const attrs = cellMatch[2] ?? "";
			const text = telegramHtmlToPlainTextFallback(cellMatch[3] ?? "").replace(/\s+/g, " ").trim();
			row.push(text, ...Array.from({ length: parseTelegramHtmlColspan(attrs) - 1 }, () => ""));
		}
		if (row.length) rows.push(row);
	}
	return rows;
}
function renderTelegramRichHtmlRawTableFallback(tableHtml, rows) {
	return `<pre><code>${escapeTelegramHtml([telegramHtmlToPlainTextFallback(TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "").trim(), renderTelegramMonospaceGrid(rows)].filter(Boolean).join("\n"))}</code></pre>\n\n`;
}
function buildTelegramHtmlOpenPrefix(tags) {
	return tags.map((tag) => tag.raw).join("");
}
function buildTelegramHtmlCloseSuffix(tags) {
	return tags.toReversed().map((tag) => `</${tag.name}>`).join("");
}
function buildTelegramHtmlCloseSuffixLength(tags) {
	return tags.reduce((total, tag) => total + tag.name.length + 3, 0);
}
function splitTelegramHtmlChunksRaw(html, normalizedLimit) {
	if (!html) return [];
	if (html.length <= normalizedLimit) return [html];
	const chunks = [];
	const openTags = [];
	const suppressedTagNames = [];
	let current = "";
	let chunkHasPayload = false;
	const resetCurrent = () => {
		current = buildTelegramHtmlOpenPrefix(openTags);
		chunkHasPayload = false;
	};
	const flushCurrent = () => {
		if (!chunkHasPayload) return;
		chunks.push(`${current}${buildTelegramHtmlCloseSuffix(openTags)}`);
		resetCurrent();
	};
	const appendText = (segment) => {
		let findSplitIndex;
		let start = 0;
		while (start < segment.length) {
			const available = normalizedLimit - current.length - buildTelegramHtmlCloseSuffixLength(openTags);
			let splitAt = start;
			if (available > 0) {
				if (segment.length - start <= available) splitAt = segment.length;
				else {
					findSplitIndex ??= prepareTelegramHtmlTextSplitter(segment);
					splitAt = findSplitIndex(start, available, current.length === 0);
				}
			}
			if (chunkHasPayload && splitAt <= start) {
				flushCurrent();
				continue;
			}
			if (current.length > 0 && (splitAt <= start || splitAt - start > available)) {
				suppressedTagNames.push(...openTags.map((tag) => tag.name));
				openTags.length = 0;
				resetCurrent();
				continue;
			}
			if (splitAt <= start) throw new Error(`Telegram HTML chunk limit exceeded by leading entity (limit=${normalizedLimit})`);
			current += segment.slice(start, splitAt);
			chunkHasPayload = true;
			start = splitAt;
			if (start < segment.length) flushCurrent();
		}
	};
	resetCurrent();
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		appendText(html.slice(lastIndex, tagStart));
		const rawTag = tag.raw;
		const isClosing = tag.closing;
		const tagName = tag.name;
		const isSelfClosing = !isClosing && rawTag.trimEnd().endsWith("/>");
		if (!isClosing) {
			const nextCloseLength = isSelfClosing ? 0 : `</${tagName}>`.length;
			if (chunkHasPayload && current.length + rawTag.length + buildTelegramHtmlCloseSuffixLength(openTags) + nextCloseLength > normalizedLimit) flushCurrent();
		}
		const closingTagIndex = isClosing ? openTags.findLastIndex((openTag) => openTag.name === tagName) : -1;
		if (!(isClosing && closingTagIndex < 0 && popLastTagName(suppressedTagNames, tagName))) current += rawTag;
		if (isSelfClosing) chunkHasPayload = true;
		if (closingTagIndex >= 0) openTags.splice(closingTagIndex, 1);
		else if (!isClosing && !isSelfClosing) openTags.push(tag);
		lastIndex = tagEnd;
	}
	appendText(html.slice(lastIndex));
	flushCurrent();
	return chunks.length > 0 ? chunks : [html];
}
function splitTelegramHtmlChunks(html, limit) {
	const normalizedLimit = Math.max(1, Math.floor(limit));
	if (Number.isNaN(normalizedLimit)) throw new TypeError("Telegram HTML chunk limit must be numeric");
	const chunks = splitTelegramHtmlChunksRaw(html, normalizedLimit);
	if (chunks.every((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk) === chunk)) return chunks;
	const protectedContentLimit = normalizedLimit - 24;
	if (protectedContentLimit < 1) throw new Error(`Telegram HTML chunk limit cannot fit assistant transcript marker (limit=${normalizedLimit})`);
	return splitTelegramHtmlChunksRaw(html, protectedContentLimit).map((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk));
}
function markdownToTelegramChunks(markdown, limit, options = {}) {
	const ir = parseTelegramLegacyMarkdown(markdown, options.tableMode);
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit,
		renderChunk: renderTelegramHtml,
		measureRendered: (html) => html.length
	}).map(({ source, rendered }) => ({
		html: rendered,
		text: source.text
	}));
}
function markdownToTelegramHtmlChunks(markdown, limit, options = {}) {
	return markdownToTelegramChunks(markdown, limit, options).map((chunk) => chunk.html);
}
//#endregion
//#region extensions/telegram/src/caption.ts
const TELEGRAM_MAX_CAPTION_LENGTH = 1024;
const telegramCaptionDeliveryMetadata = /* @__PURE__ */ new WeakSet();
function splitTelegramCaption(text, renderedHtml) {
	const trimmed = text?.trim() ?? "";
	if (!trimmed) return {
		caption: void 0,
		followUpText: void 0
	};
	return (renderedHtml === void 0 ? trimmed.length : countTelegramHtmlVisibleCharacters(renderedHtml)) > 1024 ? {
		caption: void 0,
		followUpText: trimmed
	} : {
		caption: trimmed,
		followUpText: void 0
	};
}
function resolveTelegramPlainCaption(caption, renderedHtml) {
	if (caption === void 0 || caption.length <= 1024 || renderedHtml === void 0) return caption;
	return resolveTelegramHtmlVisibleText(renderedHtml);
}
//#endregion
//#region extensions/telegram/src/inline-keyboard.ts
function buildInlineKeyboard(buttons) {
	if (!buttons?.length) return;
	const rows = buttons.map((row) => row.map((button) => {
		if (!button?.text) return;
		const label = {
			text: button.text,
			...button.style ? { style: button.style } : {}
		};
		if (button.url) return {
			...label,
			url: button.url
		};
		if (button.callback_data) return {
			...label,
			callback_data: button.callback_data
		};
		if (button.web_app?.url) return {
			...label,
			web_app: { url: button.web_app.url }
		};
	}).filter((button) => Boolean(button))).filter((row) => row.length > 0);
	return rows.length > 0 ? { inline_keyboard: rows } : void 0;
}
//#endregion
//#region extensions/telegram/src/prompt-context-projection.ts
function parseTranscriptMessageId(value) {
	const id = isRecord(value) ? value.transcriptMessageId : void 0;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function isTelegramTextOnlyChannelData(channelData) {
	if (Object.keys(channelData).length !== 1 || !isRecord(channelData.telegram)) return false;
	const telegram = channelData.telegram;
	if (Object.keys(telegram).length !== 1 || !isRecord(telegram.promptContextSource)) return false;
	const source = telegram.promptContextSource;
	return Object.keys(source).length === 2 && typeof source.transcriptMessageId === "string" && typeof source.deliverySignature === "string";
}
function resolveTelegramPromptContextDeliverySignature(payload) {
	const parts = resolveSendableOutboundReplyParts(payload);
	const spokenText = payload.spokenText ?? "";
	return JSON.stringify([
		parts.text,
		parts.mediaUrls,
		payload.audioAsVoice === true,
		spokenText
	]);
}
function parseTelegramPromptContextProjection(value) {
	const transcriptMessageId = parseTranscriptMessageId(value);
	if (!transcriptMessageId || !isRecord(value)) return;
	const { partIndex, finalPart } = value;
	return typeof partIndex === "number" && Number.isSafeInteger(partIndex) && partIndex >= 0 && typeof finalPart === "boolean" ? {
		kind: "valid",
		projection: {
			transcriptMessageId,
			partIndex,
			finalPart
		}
	} : {
		kind: "invalid",
		transcriptMessageId
	};
}
function resolveTelegramPromptContextSource(payload) {
	const telegram = payload.channelData?.telegram;
	const taggedSource = isRecord(telegram) ? telegram.promptContextSource : void 0;
	const transcriptMessageId = parseTranscriptMessageId(taggedSource);
	const deliverySignature = isRecord(taggedSource) ? taggedSource.deliverySignature : void 0;
	return transcriptMessageId && deliverySignature === resolveTelegramPromptContextDeliverySignature(payload) ? { transcriptMessageId } : void 0;
}
function withTelegramPromptContextSource(payload, source) {
	if (!source) return payload;
	const telegram = payload.channelData?.telegram;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		channelData: {
			...payload.channelData,
			telegram: {
				...isRecord(telegram) ? telegram : {},
				promptContextSource: {
					...source,
					deliverySignature: resolveTelegramPromptContextDeliverySignature(payload)
				}
			}
		}
	});
}
function createTelegramPromptContextProjectionCursor(source) {
	return {
		source,
		nextPartIndex: 0,
		complete: true,
		invalidate() {
			this.complete = false;
		},
		take(finalPart) {
			return {
				...this.source,
				partIndex: this.nextPartIndex++,
				finalPart: this.complete && finalPart
			};
		}
	};
}
function createTelegramPromptContextProjectionSequence(params) {
	let cursor = params.source ? createTelegramPromptContextProjectionCursor(params.source) : void 0;
	let pending;
	let started = false;
	const invalidate = () => cursor?.invalidate();
	const flush = async (finalPart) => {
		if (!pending) return;
		const record = pending;
		pending = void 0;
		const projection = cursor?.take(finalPart);
		if (!await params.record({
			...record,
			...projection ? { projection } : {}
		})) invalidate();
	};
	return {
		get source() {
			return cursor?.source;
		},
		isFresh: () => !started && (cursor?.complete ?? true),
		async accept(record) {
			started = true;
			await flush(false);
			pending = record;
		},
		finish: () => flush(true),
		invalidate,
		detach() {
			invalidate();
			cursor = void 0;
		},
		async fail() {
			invalidate();
			await flush(false);
		}
	};
}
function resolveCompleteTelegramPromptContextProjectionIds(markers) {
	const grouped = /* @__PURE__ */ new Map();
	for (const marker of markers) {
		if (!marker) continue;
		const id = marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId;
		if (marker.kind === "invalid") grouped.set(id, void 0);
		else if (grouped.get(id) !== void 0 || !grouped.has(id)) grouped.set(id, [...grouped.get(id) ?? [], marker.projection]);
	}
	const complete = /* @__PURE__ */ new Set();
	for (const [id, parts] of grouped) {
		const ordered = parts?.toSorted((left, right) => left.partIndex - right.partIndex);
		if (ordered?.every((part, index) => part.partIndex === index && part.finalPart === (index === ordered.length - 1))) complete.add(id);
	}
	return complete;
}
//#endregion
//#region extensions/telegram/src/rich-plain-fallback.ts
const RICH_ENTITY_INVALID_RE = /RICH_MESSAGE_[A-Z_]+_INVALID/i;
const RICH_CONTENT_REQUIRED_RE = /RICH_MESSAGE_CONTENT_REQUIRED|rich message must be non-empty/i;
const EMPTY_TEXT_RE = /message text is empty|text must be non-empty/i;
const RICH_STRUCTURE_INVALID_RE = /RICH_MESSAGE_(?:BLOCKS_TOO_MANY|DEPTH_INVALID|TEXT_TOO_LONG|MEDIA_TOO_MANY|TABLE_COLS_TOO_MANY)/i;
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity|can't parse InputRichBlock/i;
const FALLBACK_TRIGGERS = {
	rich: [
		[RICH_ENTITY_INVALID_RE, "rich-entity-invalid"],
		[RICH_CONTENT_REQUIRED_RE, "rich-content-required"],
		[RICH_STRUCTURE_INVALID_RE, "rich-structure-invalid"],
		[PARSE_ERR_RE, "html-parse"]
	],
	html: [
		[PARSE_ERR_RE, "html-parse"],
		[EMPTY_TEXT_RE, "empty-content"],
		[RICH_CONTENT_REQUIRED_RE, "empty-content"]
	]
};
function isTelegramHtmlParseError(err) {
	return PARSE_ERR_RE.test(formatErrorMessage(err));
}
function isTelegramEmptyContentError(err) {
	const message = formatErrorMessage(err);
	return EMPTY_TEXT_RE.test(message) || RICH_CONTENT_REQUIRED_RE.test(message);
}
function splitTelegramPlainTextChunks(text, limit) {
	if (!text) return [];
	return chunkTextForOutbound(text, Math.max(1, Math.floor(limit)), { preserveWhitespace: true });
}
async function withTelegramPlainFallback(params) {
	try {
		return await params.sendFormatted();
	} catch (err) {
		const message = formatErrorMessage(err);
		const trigger = FALLBACK_TRIGGERS[params.kind].find(([pattern]) => pattern.test(message))?.[1];
		if (!trigger || !params.plainText.trim()) throw err;
		params.warn(`telegram ${params.context} degrade=plain-fallback:${trigger}: ${message}`);
		const limit = params.limit ?? 4e3;
		const chunks = splitTelegramPlainTextChunks(params.plainText, limit);
		return await params.sendPlain({
			plainText: params.plainText,
			chunks
		}, `${params.context}-plain`);
	}
}
function warnTelegramRichBlocksDegradations(params) {
	for (const reason of new Set(params.reasons)) params.warn(`telegram ${params.context} rich-degrade=${reason}`);
}
//#endregion
//#region extensions/telegram/src/rich-block-split.ts
const TELEGRAM_RICH_MEDIA_LIMIT = 50;
function addRichBlockBudget(left, right) {
	return {
		chars: left.chars + right.chars,
		blocks: left.blocks + right.blocks,
		media: left.media + right.media
	};
}
function exceedsRichBlockLimits(size, limits) {
	return size.chars > limits.textLimit || size.blocks > limits.blockLimit || size.media > TELEGRAM_RICH_MEDIA_LIMIT;
}
function groupRichBlockItems(items, limits, measure, containerBlocks = 0, firstChunkChars = 0) {
	const chunks = [];
	let current = [];
	let size = {
		chars: firstChunkChars,
		blocks: containerBlocks,
		media: 0
	};
	for (const item of items) {
		const itemSize = measure(item);
		if (current.length > 0 && exceedsRichBlockLimits(addRichBlockBudget(size, itemSize), limits)) {
			chunks.push(current);
			current = [];
			size = {
				chars: 0,
				blocks: containerBlocks,
				media: 0
			};
		}
		current.push(item);
		size = addRichBlockBudget(size, itemSize);
	}
	if (current.length > 0) chunks.push(current);
	return chunks;
}
function wrapRichTextFragment(fragment, wrappers) {
	let node = fragment;
	for (let index = wrappers.length - 1; index >= 0; index -= 1) node = {
		...wrappers[index],
		text: node
	};
	return node;
}
function splitRichTextByChars(text, limit) {
	const pieces = [];
	let current = [];
	let chars = 0;
	const flush = () => {
		if (current.length > 0) {
			pieces.push(normalizeRichText(current));
			current = [];
			chars = 0;
		}
	};
	const visit = (node, wrappers) => {
		if (typeof node === "string") {
			let offset = 0;
			while (offset < node.length) {
				if (chars >= limit) flush();
				const budget = limit - chars;
				const end = avoidTrailingHighSurrogateBreak(node, offset, Math.min(node.length, offset + budget));
				const fragment = node.slice(offset, end);
				current.push(wrapRichTextFragment(fragment, wrappers));
				chars += fragment.length;
				offset = end;
			}
			return;
		}
		if (Array.isArray(node)) {
			for (const child of node) visit(child, wrappers);
			return;
		}
		if (node.type === "mathematical_expression" || node.type === "custom_emoji") {
			const atomicChars = countRichTextChars(node);
			if (chars > 0 && chars + atomicChars > limit) flush();
			current.push(wrapRichTextFragment(node, wrappers));
			chars += atomicChars;
			return;
		}
		visit(node.text, [...wrappers, node]);
	};
	visit(text, []);
	flush();
	return pieces;
}
function splitOversizedRichBlock(block, limits) {
	const { textLimit, blockLimit } = limits;
	if (!exceedsRichBlockLimits(measureInputRichBlocks([block]), limits)) return [block];
	if (block.type === "pre") {
		const language = block.language;
		return splitTelegramPlainTextChunks(block.text, textLimit).map((piece) => language ? {
			type: "pre",
			text: piece,
			language
		} : {
			type: "pre",
			text: piece
		});
	}
	if (block.type === "paragraph" || block.type === "heading") return splitRichTextByChars(block.text, textLimit).map((piece) => block.type === "heading" ? {
		type: "heading",
		text: piece,
		size: block.size
	} : {
		type: "paragraph",
		text: piece
	});
	if (block.type === "blockquote" || block.type === "details" || block.type === "collage" || block.type === "slideshow") {
		const remainingText = textLimit - (block.type === "blockquote" ? countRichTextChars(block.credit ?? "") : block.type === "details" ? countRichTextChars(block.summary) : countRichTextChars(block.caption?.text ?? "") + countRichTextChars(block.caption?.credit ?? ""));
		if (block.blocks.length === 0 || remainingText < 0 || remainingText === 0 && measureInputRichBlocks(block.blocks).chars > 0) return [block];
		const pieces = splitTelegramRichBlocks(block.blocks, {
			textLimit: Math.max(1, remainingText),
			blockLimit: Math.max(1, blockLimit - 1)
		});
		if (block.type === "blockquote") return pieces.map((inner, index) => index === pieces.length - 1 && block.credit !== void 0 ? {
			type: "blockquote",
			blocks: inner,
			credit: block.credit
		} : {
			type: "blockquote",
			blocks: inner
		});
		if (block.type === "details") return pieces.map((inner) => ({
			...block,
			blocks: inner
		}));
		const { caption, ...album } = block;
		const albumPieces = [];
		for (const [index, inner] of pieces.entries()) albumPieces.push(index === 0 && caption !== void 0 ? {
			...album,
			blocks: inner,
			caption
		} : {
			...album,
			blocks: inner
		});
		return albumPieces;
	}
	if (block.type === "table") {
		if (block.cells.some((row) => row.some((cell) => (cell.rowspan ?? 1) > 1))) return [block];
		const { caption, ...tableRest } = block;
		const pieces = [];
		const groups = groupRichBlockItems(block.cells, limits, (row) => ({
			chars: row.reduce((total, cell) => total + countRichTextChars(cell.text ?? ""), 0),
			blocks: 1,
			media: 0
		}), 1, countRichTextChars(caption ?? ""));
		for (const cells of groups) pieces.push(pieces.length === 0 && caption !== void 0 ? {
			...tableRest,
			cells,
			caption
		} : {
			...tableRest,
			cells
		});
		return pieces;
	}
	if (block.type === "list") return groupRichBlockItems(block.items, limits, (item) => {
		const measured = measureInputRichBlocks(item.blocks);
		return {
			...measured,
			blocks: measured.blocks + 1
		};
	}, 1).map((items) => ({
		type: "list",
		items
	}));
	return [block];
}
function splitTelegramRichBlocks(blocks, options = {}) {
	const blockLimit = Math.max(1, Math.floor(options.blockLimit ?? 500));
	const textLimit = Math.max(1, Math.floor(options.textLimit ?? 32768));
	if (blocks.length === 0) return [];
	const limits = {
		textLimit,
		blockLimit
	};
	return groupRichBlockItems(normalizeInputRichBlocks(blocks).flatMap((block) => splitOversizedRichBlock(block, limits)), limits, (block) => measureInputRichBlocks([block]));
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html-map.ts
const BLOCK_ISLAND_TAGS = /* @__PURE__ */ new Set([
	"details",
	"p",
	"table",
	"ul",
	"ol",
	"figure",
	"img",
	"video",
	"audio",
	"blockquote",
	"aside",
	"footer",
	"hr",
	"pre",
	"tg-math-block",
	"tg-map",
	"tg-collage",
	"tg-slideshow",
	"a"
]);
const MEDIA_SRC_RE = /^https:\/\//i;
function hasStrayContent(nodes, allowed) {
	return nodes.some((node) => node.kind === "text" ? node.text.trim() !== "" : !node.closed || !allowed?.has(node.name));
}
function mediaBlockFromElement(node, caption) {
	const src = parseHtmlAttrs(node.raw).get("src") ?? "";
	if (!MEDIA_SRC_RE.test(src) || hasStrayContent(node.children)) return;
	const withCaption = caption ? { caption } : {};
	if (node.name === "img" || node.name === "video") {
		if (/\.gif(?:[?#]|$)/i.test(src)) return {
			type: "animation",
			animation: {
				type: "animation",
				media: src
			},
			...withCaption
		};
		return node.name === "img" ? {
			type: "photo",
			photo: {
				type: "photo",
				media: src
			},
			...withCaption
		} : {
			type: "video",
			video: {
				type: "video",
				media: src
			},
			...withCaption
		};
	}
	if (node.name === "audio") {
		if (/\.(?:ogg|opus|oga)(?:[?#]|$)/i.test(src)) return {
			type: "voice_note",
			voice_note: {
				type: "voice_note",
				media: src
			},
			...withCaption
		};
		return {
			type: "audio",
			audio: {
				type: "audio",
				media: src
			},
			...withCaption
		};
	}
}
function countChildren(nodes, name) {
	return nodes.filter((node) => node.kind === "element" && node.name === name).length;
}
function findClosedChild(nodes, name) {
	return nodes.find((node) => node.kind === "element" && node.closed && node.name === name);
}
function captionFromChildren(nodes, allowCreditOnly = false) {
	const cite = findClosedChild(nodes, "cite");
	const text = htmlNodesToRichText(nodes.filter((node) => node !== cite));
	if (text === "" && (!allowCreditOnly || !cite)) return;
	return {
		text,
		...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
	};
}
function captionFromFigcaption(nodes) {
	const figcaption = findClosedChild(nodes, "figcaption");
	return figcaption ? captionFromChildren(figcaption.children, true) : void 0;
}
const FIGURE_CHILDREN = /* @__PURE__ */ new Set([
	"img",
	"video",
	"audio",
	"tg-map",
	"figcaption"
]);
function figureToBlock(node) {
	if (hasStrayContent(node.children, FIGURE_CHILDREN)) return;
	const mediaChildren = node.children.filter((child) => child.kind === "element" && child.name !== "figcaption");
	if (mediaChildren.length !== 1 || countChildren(node.children, "figcaption") > 1) return;
	const media = mediaChildren[0];
	const caption = captionFromFigcaption(node.children);
	if (media.name === "tg-map") {
		const map = mapToBlock(media);
		if (map?.type === "map" && caption) return {
			...map,
			caption
		};
		return map;
	}
	return mediaBlockFromElement(media, caption);
}
const LIST_CHILDREN = /* @__PURE__ */ new Set(["li"]);
function listToBlock(node, renderContent) {
	if (hasStrayContent(node.children, LIST_CHILDREN)) return;
	const items = [];
	for (const child of node.children) {
		if (child.kind !== "element") continue;
		const checkbox = child.children.find((grandchild) => grandchild.kind === "element" && grandchild.name === "input" && parseHtmlAttrs(grandchild.raw).get("type") === "checkbox");
		const blocks = renderContent(child.children.filter((grandchild) => grandchild !== checkbox));
		const item = { blocks: blocks.length > 0 ? blocks : [{
			type: "paragraph",
			text: ""
		}] };
		if (checkbox) {
			item.has_checkbox = true;
			if (parseHtmlAttrs(checkbox.raw).has("checked")) item.is_checked = true;
		}
		items.push(node.name === "ol" ? {
			...item,
			value: items.length + 1
		} : item);
	}
	if (items.length === 0) return;
	return {
		type: "list",
		items
	};
}
function tableCellFromElement(node, inHeader) {
	const attrs = parseHtmlAttrs(node.raw);
	const text = htmlNodesToRichText(node.children);
	const colspan = strictNumber(attrs.get("colspan"), /^\d+$/u) ?? NaN;
	const rowspan = strictNumber(attrs.get("rowspan"), /^\d+$/u) ?? NaN;
	const align = attrs.get("align")?.toLowerCase();
	const valign = attrs.get("valign")?.toLowerCase();
	return {
		align: align === "center" || align === "right" ? align : "left",
		valign: valign === "top" || valign === "bottom" ? valign : "middle",
		...text !== "" ? { text } : {},
		...node.name === "th" || inHeader ? { is_header: true } : {},
		...Number.isSafeInteger(colspan) && colspan > 1 ? { colspan } : {},
		...Number.isSafeInteger(rowspan) && rowspan > 1 ? { rowspan } : {}
	};
}
const TABLE_COLUMN_LIMIT = 20;
function tableExceedsColumnLimit(cells) {
	let carryover = [];
	for (const row of cells) {
		if (carryover.reduce((total, cell) => total + cell.span, 0) + row.reduce((total, cell) => total + (cell.colspan ?? 1), 0) > TABLE_COLUMN_LIMIT) return true;
		carryover = [...carryover.map((cell) => ({
			span: cell.span,
			rows: cell.rows - 1
		})).filter((cell) => cell.rows > 0), ...row.filter((cell) => (cell.rowspan ?? 1) > 1).map((cell) => ({
			span: cell.colspan ?? 1,
			rows: (cell.rowspan ?? 1) - 1
		}))];
	}
	return false;
}
const TABLE_CHILDREN = /* @__PURE__ */ new Set([
	"caption",
	"thead",
	"tbody",
	"tfoot",
	"tr"
]);
const TABLE_ROW_CHILDREN = /* @__PURE__ */ new Set(["td", "th"]);
function tableToBlock(node) {
	if (hasStrayContent(node.children, TABLE_CHILDREN)) return;
	const cells = [];
	let caption;
	let stray = false;
	const visitRows = (parent, inHeader) => {
		for (const child of parent.children) {
			if (child.kind !== "element" || !child.closed) {
				stray ||= child.kind === "element" || child.text.trim() !== "";
				continue;
			}
			if (child.name === "caption") {
				const text = htmlNodesToRichText(child.children);
				if (text !== "") {
					stray ||= caption !== void 0;
					caption = text;
				}
				continue;
			}
			if (child.name === "thead" || child.name === "tbody" || child.name === "tfoot") {
				visitRows(child, child.name === "thead");
				continue;
			}
			if (child.name === "tr") {
				if (hasStrayContent(child.children, TABLE_ROW_CHILDREN)) {
					stray = true;
					continue;
				}
				const row = child.children.filter((cell) => cell.kind === "element").map((cell) => tableCellFromElement(cell, inHeader));
				if (row.length > 0) cells.push(row);
				continue;
			}
			stray = true;
		}
	};
	visitRows(node, false);
	if (stray || cells.length === 0) return;
	if (tableExceedsColumnLimit(cells)) {
		const grid = renderTelegramMonospaceGrid(cells.map((row) => row.flatMap((cell) => Array.from({ length: Math.min(cell.colspan ?? 1, 21) }, (_value, index) => index === 0 ? richTextToPlainString(cell.text ?? "") : ""))));
		return {
			type: "pre",
			text: caption !== void 0 ? `${richTextToPlainString(caption)}\n${grid}` : grid
		};
	}
	return {
		type: "table",
		cells,
		is_bordered: true,
		is_striped: true,
		...caption !== void 0 ? { caption } : {}
	};
}
function strictNumber(value, token = /^-?\d+(?:\.\d+)?$/) {
	if (value === void 0 || !token.test(value.trim())) return;
	return Number.parseFloat(value);
}
function mapToBlock(node) {
	const attrs = parseHtmlAttrs(node.raw);
	const latitude = strictNumber(attrs.get("lat"));
	const longitude = strictNumber(attrs.get("long"));
	if (!(latitude !== void 0 && longitude !== void 0 && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)) return;
	const zoom = strictNumber(attrs.get("zoom")) ?? NaN;
	return {
		type: "map",
		location: {
			latitude,
			longitude
		},
		zoom: Number.isFinite(zoom) ? Math.min(24, Math.max(0, Math.round(zoom))) : 14,
		width: 800,
		height: 450
	};
}
const COLLAGE_CHILDREN = /* @__PURE__ */ new Set([
	"figure",
	"img",
	"video",
	"audio",
	"figcaption"
]);
function collageToBlock(node) {
	if (hasStrayContent(node.children, COLLAGE_CHILDREN) || countChildren(node.children, "figcaption") > 1) return;
	const blocks = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name === "figcaption") continue;
		const media = child.name === "figure" ? figureToBlock(child) : mediaBlockFromElement(child);
		if (!media) return;
		blocks.push(media);
	}
	if (blocks.length === 0) return;
	const caption = captionFromFigcaption(node.children);
	return {
		type: node.name === "tg-slideshow" ? "slideshow" : "collage",
		blocks,
		...caption ? { caption } : {}
	};
}
const PRE_CHILDREN = /* @__PURE__ */ new Set(["code"]);
const CODE_LANGUAGE_CLASS_RE = /^language-(\S+)$/u;
function preToBlock(node) {
	const elements = node.children.filter((child) => child.kind === "element");
	const [code] = elements;
	if (code && (elements.length > 1 || hasStrayContent(node.children, PRE_CHILDREN))) return;
	const text = nodeText(node.children);
	if (text.trim() === "") return;
	const language = code ? CODE_LANGUAGE_CLASS_RE.exec(parseHtmlAttrs(code.raw).get("class") ?? "")?.[1] : void 0;
	return language ? {
		type: "pre",
		text,
		language
	} : {
		type: "pre",
		text
	};
}
function elementToBlock(node, renderContent) {
	if (!node.closed) return;
	switch (node.name) {
		case "hr": return { type: "divider" };
		case "pre": return preToBlock(node);
		case "details": {
			const summary = findClosedChild(node.children, "summary");
			const blocks = renderContent(node.children.filter((child) => child !== summary));
			return {
				type: "details",
				summary: summary ? htmlNodesToRichText(summary.children) : "Details",
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...parseHtmlAttrs(node.raw).has("open") ? { is_open: true } : {}
			};
		}
		case "ul":
		case "ol": return listToBlock(node, renderContent);
		case "table": return tableToBlock(node);
		case "figure": return figureToBlock(node);
		case "img":
		case "video":
		case "audio": return mediaBlockFromElement(node);
		case "blockquote": {
			const cite = findClosedChild(node.children, "cite");
			const blocks = renderContent(node.children.filter((child) => child !== cite));
			if (blocks.length === 0) return;
			const credit = cite ? htmlNodesToRichText(cite.children) : "";
			return credit !== "" ? {
				type: "blockquote",
				blocks,
				credit
			} : {
				type: "blockquote",
				blocks
			};
		}
		case "aside": {
			const caption = captionFromChildren(node.children);
			return caption ? {
				type: "pullquote",
				...caption
			} : void 0;
		}
		case "footer": {
			const text = htmlNodesToRichText(node.children);
			return text === "" ? void 0 : {
				type: "footer",
				text
			};
		}
		case "tg-math-block": {
			const expression = nodeText(node.children).trim();
			return expression ? {
				type: "mathematical_expression",
				expression
			} : void 0;
		}
		case "tg-map": return mapToBlock(node);
		case "tg-collage":
		case "tg-slideshow": return collageToBlock(node);
		case "a": {
			const attrs = parseHtmlAttrs(node.raw);
			const name = attrs.get("name");
			if (name && !attrs.get("href") && nodeText(node.children).trim() === "") return {
				type: "anchor",
				name
			};
			return;
		}
		default: return;
	}
}
function renderTelegramHtmlIsland(node, renderContent) {
	if (node.name === "p") return renderContent(node.children);
	const block = elementToBlock(node, renderContent);
	return block ? [block] : [{
		type: "paragraph",
		text: htmlNodesToRichText([node])
	}];
}
/** Select whole authored islands; unsupported and unmatched parents stay literal. */
function findTelegramHtmlIslands(nodes) {
	return nodes.filter((node) => {
		if (node.kind !== "element" || !node.closed || !BLOCK_ISLAND_TAGS.has(node.name)) return false;
		if (node.name !== "a") return true;
		const attrs = parseHtmlAttrs(node.raw);
		return attrs.has("name") && !attrs.has("href") && !hasStrayContent(node.children);
	});
}
//#endregion
//#region extensions/telegram/src/rich-blocks-list.ts
/** Groups exact parser-owned item spans by list identity without reparsing Markdown. */
function collectMarkdownRichListSources(ir) {
	const byListId = /* @__PURE__ */ new Map();
	for (const item of ir.listItems ?? []) {
		if (!item.listMarker || item.listId === void 0 || item.start === void 0 || item.end === void 0) continue;
		const markerText = ir.text.slice(item.listMarker.start, item.listMarker.end);
		const taskText = item.taskMarker ? ir.text.slice(item.taskMarker.start, item.taskMarker.end) : "";
		const value = item.kind === "ordered" ? Number.parseInt(markerText, 10) : void 0;
		const source = {
			start: item.start,
			end: item.end,
			contentStart: item.taskMarker?.end ?? item.listMarker.end,
			task: item.task === true,
			checked: /^\[[xX]\]/u.test(taskText),
			...value !== void 0 && Number.isFinite(value) ? { value } : {}
		};
		const list = byListId.get(item.listId) ?? [];
		list.push(source);
		byListId.set(item.listId, list);
	}
	return [...byListId.values()].map((items) => {
		items.sort((left, right) => left.start - right.start);
		return {
			start: Math.min(...items.map((item) => item.start)),
			end: Math.max(...items.map((item) => item.end)),
			items
		};
	});
}
/** Renders one parser list; nested containers arrive through renderRange. */
function renderMarkdownRichListSource(source, renderRange) {
	return {
		type: "list",
		items: source.items.map((item) => {
			const blocks = renderRange(item.contentStart, item.end);
			return {
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...item.task ? { has_checkbox: true } : {},
				...item.checked ? { is_checked: true } : {},
				...item.value !== void 0 ? { value: item.value } : {}
			};
		})
	};
}
//#endregion
//#region extensions/telegram/src/rich-blocks.ts
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const TELEGRAM_RICH_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "blocks",
	chunk: {
		limit: 32768,
		unit: "chars"
	}
});
const INLINE_STYLE_RANK = {
	spoiler: 0,
	bold: 1,
	italic: 2,
	strikethrough: 3,
	code: 4
};
const TELEGRAM_RICH_LINK_HREF_RE = /^(?:https?:\/\/|tg:\/\/|mailto:|tel:)/i;
const HEADING_SIZES = {
	heading_1: 1,
	heading_2: 2,
	heading_3: 3,
	heading_4: 4,
	heading_5: 5,
	heading_6: 6
};
function isInlineStyle(style) {
	return Object.hasOwn(INLINE_STYLE_RANK, style);
}
function resolveTelegramLinkAction(link, source, context) {
	const href = link.href.trim();
	if (!href || link.start === link.end) return null;
	const label = source.slice(link.start, link.end);
	if (context.origin === "linkify") {
		if (isAutoLinkedFileRef(href, label)) return context.skipEntityDetection ? null : { kind: "code" };
		if (context.skipEntityDetection && !href.includes("&") && TELEGRAM_RICH_LINK_HREF_RE.test(href)) return {
			kind: "url",
			href
		};
		return null;
	}
	if (href.startsWith("#")) return {
		kind: "anchor",
		name: href.slice(1)
	};
	if (!TELEGRAM_RICH_LINK_HREF_RE.test(href)) return null;
	return {
		kind: "url",
		href
	};
}
/**
* Build nested RichText from IR spans over [rangeStart, rangeEnd).
* Spans that partially overlap are split at shared boundaries (IR contract).
*/
function irRangeToRichText(ir, rangeStart, rangeEnd, skipEntityDetection = false) {
	const slice = sliceMarkdownIR(ir, rangeStart, rangeEnd);
	const text = slice.text;
	if (!text) return "";
	const spans = [];
	for (const span of slice.styles) if (isInlineStyle(span.style)) spans.push({
		start: span.start,
		end: span.end,
		kind: "style",
		style: span.style
	});
	for (const span of slice.annotations ?? []) spans.push({
		start: span.start,
		end: span.end,
		kind: "annotation"
	});
	if (slice.links.length > 0) renderMarkdownWithMarkers(slice, {
		styleMarkers: {},
		escapeText: (value) => value,
		buildLink: (link, source, context) => {
			const action = resolveTelegramLinkAction(link, source, {
				...context,
				skipEntityDetection
			});
			if (action) spans.push(action.kind === "code" ? {
				start: link.start,
				end: link.end,
				kind: "style",
				style: "code"
			} : {
				start: link.start,
				end: link.end,
				kind: "link",
				target: action
			});
			return null;
		}
	}, TELEGRAM_RICH_FORMAT_PROFILE);
	const leaves = [];
	const nodes = text.includes("<") ? parseHtmlFragment(slice) : [];
	const hasElement = (children) => children.some((node) => node.kind === "element" && (node.closed || hasElement(node.children)));
	if (hasElement(nodes)) {
		const recordText = ({ start, end }) => {
			leaves.push({
				kind: "text",
				start,
				end
			});
			return "";
		};
		htmlNodesToRichText(nodes, {
			text: recordText,
			literal: recordText,
			wrap: ({ start, end }, wrap, children) => {
				spans.push({
					kind: "html",
					start,
					end,
					wrap
				});
				return children();
			},
			atom: ({ start, end }, value) => {
				const annotated = slice.annotations?.some((span) => span.start < end && span.end > start);
				leaves.push(annotated ? {
					kind: "text",
					start,
					end
				} : {
					kind: "atom",
					start,
					end,
					value
				});
				return "";
			}
		});
	} else leaves.push({
		kind: "text",
		start: 0,
		end: text.length
	});
	const rank = (span) => span.kind === "style" ? INLINE_STYLE_RANK[span.style] : span.kind === "annotation" ? 0 : 50;
	spans.sort((left, right) => left.start - right.start || right.end - left.end || rank(left) - rank(right));
	const points = [...new Set([...spans, ...leaves].flatMap((span) => [span.start, span.end]))].toSorted((left, right) => left - right);
	const stack = [];
	const root = [];
	const currentText = () => stack.at(-1)?.text ?? root;
	let leafIndex = 0;
	let nextSpanIndex = 0;
	let pendingSpans = [];
	for (let i = 0; i < points.length - 1; i += 1) {
		const start = points[i] ?? 0;
		while (leafIndex < leaves.length && leaves[leafIndex].end <= start) leafIndex += 1;
		const leaf = leaves[leafIndex];
		if (!leaf || leaf.start > start || leaf.kind === "atom" && leaf.start !== start) continue;
		const end = leaf.kind === "atom" ? leaf.end : points[i + 1] ?? start;
		while (nextSpanIndex < spans.length && spans[nextSpanIndex].start <= start) pendingSpans.push(spans[nextSpanIndex++]);
		pendingSpans = pendingSpans.filter((span) => span.end > start);
		const covering = pendingSpans.filter((span) => span.end >= end);
		const annotation = covering.find((span) => span.kind === "annotation");
		const active = annotation ? [annotation] : covering;
		let shared = 0;
		while (shared < stack.length && stack[shared]?.span === active[shared]) shared += 1;
		stack.length = shared;
		for (const item of active.slice(shared)) {
			const container = [];
			const node = item.kind === "html" ? item.wrap(container) : item.kind === "link" ? item.target.kind === "url" ? richTextLink(container, item.target.href) : {
				type: "anchor_link",
				text: container,
				anchor_name: item.target.name
			} : {
				type: item.kind === "annotation" ? "code" : item.style,
				text: container
			};
			currentText().push(node);
			stack.push({
				span: item,
				text: container
			});
		}
		currentText().push(leaf.kind === "atom" ? leaf.value : text.slice(start, end));
	}
	return normalizeRichText(root);
}
function splitParagraphs(ir, start, end, skipEntityDetection = false) {
	if (end <= start) return [];
	const sourceText = ir.text.slice(start, end);
	const paragraphs = [];
	const pushParagraph = (rangeStart, rangeEnd) => {
		const raw = ir.text.slice(rangeStart, rangeEnd);
		const absStart = rangeStart + raw.length - raw.trimStart().length;
		const absEnd = rangeEnd - (raw.length - raw.trimEnd().length);
		if (absEnd <= absStart) return;
		const text = irRangeToRichText(ir, absStart, absEnd, skipEntityDetection);
		if (text !== "") paragraphs.push({
			type: "paragraph",
			text
		});
	};
	const blankLine = /\n[ \t]*\n+/g;
	let last = 0;
	let match;
	while ((match = blankLine.exec(sourceText)) !== null) {
		pushParagraph(start + last, start + match.index);
		last = match.index + match[0].length;
	}
	pushParagraph(start + last, end);
	return paragraphs;
}
function renderTableBlock(table, degradationReasons, skipEntityDetection = false) {
	const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
	if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT) {
		const text = renderTelegramMonospaceGrid([table.headers, ...table.rows], { headerSeparator: true });
		degradationReasons.add("table-ascii");
		return {
			type: "pre",
			text
		};
	}
	const renderCell = (cell, index, header = false) => {
		const text = cell?.text ? irRangeToRichText(cell, 0, cell.text.length, skipEntityDetection) : "";
		return {
			...header ? { is_header: true } : {},
			align: table.aligns?.[index] ?? "left",
			valign: "middle",
			...text !== "" ? { text } : {}
		};
	};
	const headerRow = table.headerCells.map((cell, index) => renderCell(cell, index, true));
	const bodyRows = table.rowCells.map((row) => Array.from({ length: columnCount }, (_value, index) => renderCell(row[index], index)));
	return {
		type: "table",
		cells: headerRow.length > 0 ? [headerRow, ...bodyRows] : bodyRows,
		is_bordered: true,
		is_striped: true
	};
}
function collectStructuralSegments(ir, tables, htmlNodes) {
	const segments = [];
	const htmlIslands = findTelegramHtmlIslands(htmlNodes);
	for (const span of ir.styles) {
		if (span.end <= span.start) continue;
		const headingSize = HEADING_SIZES[span.style];
		if (headingSize) {
			segments.push({
				kind: "heading",
				start: span.start,
				end: span.end,
				size: headingSize
			});
			continue;
		}
		if (span.style === "code_block") {
			segments.push({
				kind: "code_block",
				start: span.start,
				end: span.end,
				...span.language ? { language: span.language } : {}
			});
			continue;
		}
		if (span.style === "blockquote") segments.push({
			kind: "blockquote",
			start: span.start,
			end: span.end
		});
	}
	for (const table of tables) {
		const offset = Math.max(0, Math.min(table.placeholderOffset, ir.text.length));
		segments.push({
			kind: "table",
			start: offset,
			end: offset,
			table
		});
	}
	for (const source of collectMarkdownRichListSources(ir)) {
		if (htmlIslands.some((island) => source.start >= island.start && source.end <= island.end)) continue;
		segments.push({
			kind: "list",
			start: source.start,
			end: source.end,
			source
		});
	}
	return segments;
}
function preserveLiteralHtmlOwners(ir, segments, htmlNodes) {
	const islands = new Set(findTelegramHtmlIslands(htmlNodes));
	const owners = [];
	htmlNodesToRichText(htmlNodes.filter((node) => !islands.has(node)), {
		text: () => "",
		literal: (range) => {
			owners.push(range);
			return "";
		},
		wrap: (_range, _wrap, children) => children(),
		atom: () => ""
	});
	if (!owners.length) return;
	ir.htmlTags = ir.htmlTags?.filter((tag) => !owners.some((owner) => tag.start >= owner.start && tag.end <= owner.end));
	for (const segment of segments) {
		if (segment.kind !== "table" || !owners.some((owner) => segment.start > owner.start && segment.start < owner.end)) continue;
		for (const row of [segment.table.headerCells, ...segment.table.rowCells]) for (const cell of row) if (cell.htmlTags) cell.htmlTags = [];
	}
}
function emitSegments(ir, segments, rangeStart, rangeEnd, degradationReasons, htmlNodes = [], depth = 0, skipEntityDetection = false) {
	if (depth >= 30) {
		degradationReasons.add("nesting-limit");
		return [{
			type: "paragraph",
			text: htmlNodes.length ? nodeText(htmlNodes, true) : ir.text.slice(rangeStart, rangeEnd)
		}];
	}
	preserveLiteralHtmlOwners(ir, segments, htmlNodes);
	const renderChildren = (children, start, end, nodes = []) => emitSegments(ir, children, start, end, degradationReasons, nodes, depth + 1, skipEntityDetection);
	const containerRank = (segment) => segment.kind === "blockquote" ? 0 : segment.kind === "list" ? 1 : 2;
	const orderedSegments = [...segments, ...findTelegramHtmlIslands(htmlNodes).map((node) => ({
		kind: "html",
		start: node.start,
		end: node.end,
		node
	}))].toSorted((left, right) => {
		if (left.start !== right.start) return left.start - right.start;
		return right.end - left.end || containerRank(left) - containerRank(right);
	});
	const blocks = [];
	let cursor = rangeStart;
	let index = 0;
	while (index < orderedSegments.length) {
		const segment = orderedSegments[index];
		if (!segment) break;
		if (segment.start > cursor) blocks.push(...splitParagraphs(ir, cursor, segment.start, skipEntityDetection));
		let next = index + 1;
		while (next < orderedSegments.length && (orderedSegments[next]?.start ?? rangeEnd) < segment.end) next += 1;
		const children = orderedSegments.slice(index + 1, next);
		const renderChildRange = (start, end, nodes = []) => renderChildren(children.filter((child) => child.start >= start && child.end <= end), start, end, nodes);
		switch (segment.kind) {
			case "html":
				blocks.push(...renderTelegramHtmlIsland(segment.node, (nodes) => {
					const content = [];
					let first = 0;
					for (let last = 0; last < nodes.length; last += 1) {
						if (nodes[last + 1]?.start === nodes[last].end) continue;
						const start = nodes[first].start;
						const end = nodes[last].end;
						content.push(...renderChildRange(start, end, nodes.slice(first, last + 1)));
						first = last + 1;
					}
					return content;
				}));
				break;
			case "heading": {
				const text = irRangeToRichText(ir, segment.start, segment.end, skipEntityDetection);
				if (text !== "") blocks.push({
					type: "heading",
					text,
					size: segment.size
				});
				break;
			}
			case "code_block": {
				const text = ir.text.slice(segment.start, segment.end).replace(/\n$/, "");
				blocks.push({
					type: "pre",
					text,
					...segment.language ? { language: segment.language } : {}
				});
				break;
			}
			case "blockquote": {
				const inner = renderChildren(children, segment.start, segment.end);
				if (inner.length > 0) blocks.push({
					type: "blockquote",
					blocks: inner
				});
				break;
			}
			case "list":
				blocks.push(renderMarkdownRichListSource(segment.source, renderChildRange));
				break;
			case "table": blocks.push(renderTableBlock(segment.table, degradationReasons, skipEntityDetection));
		}
		cursor = Math.max(cursor, segment.end);
		index = next;
	}
	if (cursor < rangeEnd) blocks.push(...splitParagraphs(ir, cursor, rangeEnd, skipEntityDetection));
	return blocks;
}
function markdownToTelegramRichBlocks(markdown, options = {}) {
	const tableMode = options.tableMode ?? "block";
	const skipEntityDetection = options.skipEntityDetection === true;
	const { ir, tables } = markdownToIRWithMeta(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: true,
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		blockquotePrefix: "",
		tableMode,
		allowAllLinkSchemes: true
	});
	let degradationReasons = /* @__PURE__ */ new Set();
	const htmlNodes = parseHtmlFragment(ir);
	const segments = collectStructuralSegments(ir, tables, htmlNodes);
	const hasMarkdownLists = segments.some((segment) => segment.kind === "list");
	const flattenedSegments = segments.filter((segment) => segment.kind !== "list");
	let blocks = emitSegments(ir, segments, 0, ir.text.length, degradationReasons, htmlNodes, 0, skipEntityDetection);
	if (hasMarkdownLists && measureInputRichBlocks(blocks).nesting > 16) {
		degradationReasons = /* @__PURE__ */ new Set();
		degradationReasons.add("list-limit");
		blocks = emitSegments(ir, flattenedSegments, 0, ir.text.length, degradationReasons, htmlNodes, 0, skipEntityDetection);
	}
	if (measureInputRichBlocks(blocks).nesting > 15) {
		degradationReasons.add("nesting-limit");
		blocks = normalizeInputRichBlocks(blocks);
	}
	if (blocks.length === 0 && ir.text.trim()) blocks.push({
		type: "paragraph",
		text: ir.text
	});
	const plainBlocks = hasMarkdownLists ? emitSegments(ir, flattenedSegments, 0, ir.text.length, /* @__PURE__ */ new Set(), htmlNodes, 0, skipEntityDetection) : blocks;
	return {
		blocks,
		plainText: inputRichBlocksToPlainText(plainBlocks),
		degradationReasons: [...degradationReasons]
	};
}
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
const TELEGRAM_RICH_BLOCK_LIMIT = 500;
const TELEGRAM_RICH_EMAIL_TOKEN_RE = /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/iu;
function shouldSkipTelegramRichEntityDetection(text, options) {
	return options?.skipEntityDetection === true || TELEGRAM_RICH_EMAIL_TOKEN_RE.test(text);
}
function finiteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
	if (!value || typeof value !== "object") return false;
	return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
	const richParams = {};
	const directMessagesTopicId = finiteInteger(params?.direct_messages_topic_id);
	const topicField = directMessagesTopicId === void 0 ? "message_thread_id" : "direct_messages_topic_id";
	const topicId = directMessagesTopicId ?? finiteInteger(params?.message_thread_id);
	if (topicId !== void 0) richParams[topicField] = topicId;
	if (params?.disable_notification === true) richParams.disable_notification = true;
	if (isReplyParameters(params?.reply_parameters)) {
		richParams.reply_parameters = params.reply_parameters;
		return richParams;
	}
	const replyToMessageId = finiteInteger(params?.reply_to_message_id);
	if (replyToMessageId !== void 0) richParams.reply_parameters = {
		message_id: replyToMessageId,
		allow_sending_without_reply: true
	};
	return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
	const richParams = toTelegramRichMessageContextParams(params);
	if (!richParams.reply_parameters) return richParams;
	const { quote: _quote, quote_entities: _quoteEntities, quote_parse_mode: _quoteParseMode, quote_position: _quotePosition, ...replyParameters } = richParams.reply_parameters;
	return {
		...richParams,
		reply_parameters: replyParameters
	};
}
function buildRichMessagePlan(blocks, plainText, options, degradationReasons = []) {
	return {
		richMessage: shouldSkipTelegramRichEntityDetection(plainText, options) ? {
			blocks,
			skip_entity_detection: true
		} : { blocks },
		plainText,
		degradationReasons
	};
}
function buildTelegramRichMarkdownPlan(markdown, options) {
	const skipEntityDetection = shouldSkipTelegramRichEntityDetection(markdown, options);
	const rendered = markdownToTelegramRichBlocks(markdown, {
		tableMode: options?.tableMode,
		skipEntityDetection
	});
	return buildRichMessagePlan(rendered.blocks, rendered.plainText, { skipEntityDetection }, rendered.degradationReasons);
}
function buildTelegramRichBlocksPlan(blocks, options) {
	const normalized = normalizeInputRichBlocks(blocks);
	return buildRichMessagePlan(normalized, inputRichBlocksToPlainText(normalized), options);
}
function splitTelegramRichMessageTextChunks(params) {
	const { plan } = params;
	const chunkOptions = { skipEntityDetection: plan.richMessage.skip_entity_detection === true };
	return splitTelegramRichBlocks(plan.richMessage.blocks, {
		blockLimit: TELEGRAM_RICH_BLOCK_LIMIT,
		textLimit: params.textLimit
	}).map((blocks, index) => {
		const chunk = buildTelegramRichBlocksPlan(blocks, chunkOptions);
		if (index === 0) chunk.degradationReasons = plan.degradationReasons;
		return chunk;
	});
}
//#endregion
//#region extensions/telegram/src/text-chunk-limit.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
function resolveTelegramTextChunkLimit(params) {
	const platformLimit = resolveTelegramRichMessages({
		cfg: params.cfg,
		accountId: params.accountId,
		htmlTextMode: params.formatting?.parseMode === "HTML"
	}) ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	return Math.min(resolveTextChunkLimit(params.cfg, "telegram", params.accountId ?? void 0, { fallbackLimit: platformLimit }), platformLimit);
}
//#endregion
export { markdownToTelegramHtml as A, resolveTelegramDirectToolPolicy as B, withTelegramPromptContextSource as C, splitTelegramCaption as D, resolveTelegramPlainCaption as E, escapeTelegramHtml as F, resolveTelegramTableMode as G, resolveTelegramGroupPromptSettings as H, looksLikeTelegramTargetId as I, runAuthorizedTelegramRequest as J, getOrCreateAccountThrottler as K, normalizeTelegramMessagingTarget as L, renderTelegramHtmlText as M, splitTelegramHtmlChunks as N, telegramCaptionDeliveryMetadata as O, telegramHtmlToPlainTextFallback as P, telegramMessagingTargetsMatch as R, resolveTelegramPromptContextSource as S, TELEGRAM_MAX_CAPTION_LENGTH as T, resolveTelegramScopedGroupConfig as U, resolveTelegramGroupIngestEnabled as V, resolveTelegramRichMessages as W, TELEGRAM_CHAT_ACTION_INTERVAL_MS as X, runReplaceableTelegramRequest as Y, Bot$1 as Z, createTelegramPromptContextProjectionSequence as _, buildTelegramRichMarkdownPlan as a, resolveCompleteTelegramPromptContextProjectionIds as b, toTelegramRichMessageContextParams as c, isTelegramEmptyContentError as d, isTelegramHtmlParseError as f, createTelegramPromptContextProjectionCursor as g, withTelegramPlainFallback as h, buildTelegramRichBlocksPlan as i, markdownToTelegramHtmlChunks as j, markdownToTelegramChunks as k, markdownToTelegramRichBlocks as l, warnTelegramRichBlocksDegradations as m, resolveTelegramTextChunkLimit as n, removeTelegramRichNativeQuoteParam as o, splitTelegramPlainTextChunks as p, releaseAccountThrottler as q, TELEGRAM_RICH_TEXT_LIMIT as r, splitTelegramRichMessageTextChunks as s, TELEGRAM_TEXT_CHUNK_LIMIT as t, splitTelegramRichBlocks as u, isTelegramTextOnlyChannelData as v, buildInlineKeyboard as w, resolveTelegramPromptContextDeliverySignature as x, parseTelegramPromptContextProjection as y, resolveTelegramAccountOwnerAgentId as z };
