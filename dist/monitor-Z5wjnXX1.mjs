import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { F as bindIngressLifecycleToReplyOptions, P as createChannelIngressError } from "./channel-outbound-BbIm36V0.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./routing-Dl7FngGa.mjs";
import { n as createChannelIngressMonitor } from "./ingress-monitor-CExnLcCo.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { i as resolveXAccount } from "./accounts-n2C-ky3w.mjs";
import { i as openXAllowlist, t as XAllowlistChangedError } from "./allowlist-Bk-oAvxJ.mjs";
import { a as XBudgetExceededError, i as parseXPostEnvelope, n as getXTokenState, r as XApiError, s as xActivityCost, t as getXApi } from "./client-D9-Q5PGR.mjs";
import { t as getXRuntime } from "./runtime-B1HOiKKH.mjs";
import { n as resolveXGuestSettings, r as resolveXGuestToolPolicy, t as formatXSenderLine } from "./guest-policy-BDR2IA-u.mjs";
import { n as XGuestUsageUnavailableError, r as openXGuestUsage } from "./guest-usage-AjpeBr4l.mjs";
import { n as resolveXGuestContainmentError, t as getXGuestStatus } from "./guests-BkgYxxnV.mjs";
import { t as openXWorkOrigins } from "./work-origin-B7MxJjbF.mjs";
import { a as xMentionFacts, i as resolveXIngress, o as resolveXRecipient, r as createXPublicationPreparation, t as sendXDelivery } from "./send-BvXkx79r.mjs";
import { nextTick } from "node:process";
//#region extensions/x/src/events.ts
function laterId(a, b) {
	return !a || BigInt(b) > BigInt(a) ? b : a;
}
async function pollXMentions(options) {
	const cursor = await options.getCursor();
	const sinceId = cursor.sinceId;
	let backfill = cursor.backfill;
	if (backfill && backfill.sinceId !== sinceId) {
		backfill = void 0;
		await options.setCursor({ sinceId });
	}
	let newestId = backfill?.newestId ?? sinceId;
	let paginationToken = backfill?.paginationToken;
	let retriedContinuation = false;
	let continuationInvalid = false;
	let pageError;
	const posts = [];
	const seenTokens = new Set(paginationToken ? [paginationToken] : []);
	for (;;) {
		options.signal.throwIfAborted();
		let page;
		try {
			page = await options.api.getMentions({
				userId: options.userId,
				sinceId,
				paginationToken,
				signal: options.signal
			});
		} catch (error) {
			options.signal.throwIfAborted();
			if (paginationToken && error instanceof XApiError && error.status === 400 && !retriedContinuation) {
				await options.setCursor({ sinceId });
				backfill = void 0;
				paginationToken = void 0;
				seenTokens.clear();
				retriedContinuation = true;
				continue;
			}
			pageError = error instanceof Error ? error : new Error("X mentions request failed", { cause: error });
			continuationInvalid = Boolean(paginationToken) && error instanceof XApiError && error.status === 400;
			break;
		}
		posts.push(...page.data.map((post) => ({
			post,
			users: page.includes.users
		})));
		paginationToken = page.meta.next_token;
		if (paginationToken && seenTokens.has(paginationToken)) {
			pageError = /* @__PURE__ */ new Error("X mentions pagination repeated a token");
			continuationInvalid = true;
			break;
		}
		if (paginationToken) seenTokens.add(paginationToken);
		else break;
	}
	if (continuationInvalid) {
		await options.setCursor({ sinceId });
		paginationToken = void 0;
	}
	posts.sort((a, b) => BigInt(a.post.id) < BigInt(b.post.id) ? -1 : BigInt(a.post.id) > BigInt(b.post.id) ? 1 : 0);
	for (const envelope of posts) {
		options.signal.throwIfAborted();
		await options.onPost(envelope);
		newestId = laterId(newestId, envelope.post.id);
		options.onStatus?.({ lastEventAt: Date.now() });
	}
	if (pageError) {
		if (paginationToken) await options.setCursor({
			sinceId,
			backfill: {
				sinceId,
				paginationToken,
				newestId
			}
		});
		throw pageError;
	}
	if (backfill || newestId !== sinceId) {
		await options.setCursor({ sinceId: newestId });
		if (newestId) options.onStatus?.({ cursor: newestId });
	}
}
function wait(ms, signal) {
	return new Promise((resolve, reject) => {
		signal.throwIfAborted();
		const abort = () => {
			clearTimeout(timer);
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("X event source aborted"));
		};
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", abort);
			resolve();
		}, ms);
		signal.addEventListener("abort", abort, { once: true });
	});
}
async function waitForXBudgetReset(until, signal) {
	while (Date.now() < until) await wait(Math.min(until - Date.now(), 2147483647), signal);
	signal.throwIfAborted();
}
function eventEnvelope(value) {
	const event = asRecord(asRecord(value).data);
	if (event.event_type !== "post.mention.create") return;
	return parseXPostEnvelope({
		post: event.payload,
		users: asRecord(event.includes).users
	});
}
async function receiveStream(options, backfillMs) {
	const controller = new AbortController();
	const signal = AbortSignal.any([options.signal, controller.signal]);
	let budgetPaused = false;
	let drainRequested = false;
	let closed = false;
	let idleTimer;
	let reader;
	let backfill;
	let receiver;
	let receiveDone = false;
	let receiveError;
	let wakeReader;
	let wakeConsumer;
	let chargesSettled = Promise.resolve();
	const batches = [];
	const cancelOnAbort = () => {
		reader?.cancel().catch(() => {});
	};
	const requestDrain = () => {
		drainRequested = true;
		wakeReader?.();
	};
	const pause = (until) => {
		budgetPaused = true;
		options.onBudgetPause(until);
		requestDrain();
	};
	const deferFailure = (error) => {
		receiveError ??= error instanceof Error ? error : new Error("X activity stream failed", { cause: error });
		requestDrain();
	};
	const fail = (error) => {
		deferFailure(error);
		controller.abort(receiveError);
	};
	const checkBudget = async () => {
		const until = await options.api.spend.streamResumeAt();
		if (!closed && until !== void 0) pause(until);
	};
	const unsubscribe = options.api.spend.subscribe(() => {
		checkBudget().catch((error) => controller.abort(error));
	});
	const armIdleTimer = () => {
		clearTimeout(idleTimer);
		idleTimer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("X activity stream idle timeout")), 25e3);
	};
	const receiveBatches = async (source) => {
		const decoder = new TextDecoder();
		let pending = "";
		try {
			for (;;) {
				options.signal.throwIfAborted();
				const read = source.read();
				let ready = false;
				read.then(() => {
					ready = true;
				}, () => {
					ready = true;
				});
				if (!drainRequested) {
					armIdleTimer();
					try {
						await new Promise((resolve) => {
							wakeReader = resolve;
							read.then(() => resolve(), () => resolve());
						});
					} finally {
						wakeReader = void 0;
						clearTimeout(idleTimer);
					}
				}
				if (drainRequested && !ready) {
					await new Promise((resolve) => {
						nextTick(resolve);
					});
					if (!ready) {
						controller.abort();
						options.onStatus?.({ streamConnected: false });
					}
				}
				const result = await read;
				options.signal.throwIfAborted();
				if (result.done) {
					if (drainRequested) return;
					throw new Error("X activity stream disconnected");
				}
				pending += decoder.decode(result.value, { stream: true });
				if (pending.length > 1048576) throw new Error("X activity stream event exceeded 1 MiB");
				const events = [];
				let boundary;
				while ((boundary = pending.indexOf("\n")) !== -1) {
					const line = pending.slice(0, boundary).trim();
					pending = pending.slice(boundary + 1);
					if (!line) continue;
					try {
						events.push(JSON.parse(line));
					} catch {
						events.push(void 0);
					}
				}
				if (!events.length) continue;
				const cost = events.reduce((total, event) => total + xActivityCost(event), 0);
				const charged = cost ? options.api.spend.charge(cost) : Promise.resolve();
				if (cost) chargesSettled = charged.catch(fail);
				batches.push({
					events,
					charged
				});
				wakeConsumer?.();
			}
		} catch (error) {
			if (!(drainRequested && controller.signal.aborted && !options.signal.aborted)) fail(error);
		} finally {
			receiveDone = true;
			wakeConsumer?.();
			clearTimeout(idleTimer);
		}
	};
	try {
		await checkBudget();
		if (budgetPaused) return;
		armIdleTimer();
		const response = await options.api.openActivityStream(signal);
		if (!response.body) throw new Error("X activity stream has no response body");
		reader = response.body.getReader();
		signal.addEventListener("abort", cancelOnAbort, { once: true });
		if (signal.aborted) cancelOnAbort();
		clearTimeout(idleTimer);
		options.onStatus?.({
			eventMode: "stream",
			streamConnected: true,
			streamBackoffMs: 0,
			message: "activity stream connected"
		});
		receiver = receiveBatches(reader);
		let recipientChecksDeferred = false;
		try {
			await pollXMentions(options);
		} catch (error) {
			options.signal.throwIfAborted();
			if (error instanceof XBudgetExceededError) pause(error.exhaustedUntil);
			else deferFailure(error);
		}
		backfill = (async () => {
			while (!signal.aborted) {
				if (drainRequested) return;
				await wait(backfillMs, signal);
				if (signal.aborted || drainRequested) return;
				try {
					await pollXMentions(options);
				} catch (error) {
					options.signal.throwIfAborted();
					if (error instanceof XBudgetExceededError) {
						pause(error.exhaustedUntil);
						return;
					}
					if (!signal.aborted) options.onStatus?.({ message: "mentions backfill failed; retrying after the backfill interval" });
				}
			}
		})().catch((error) => {
			if (!signal.aborted) fail(error);
		});
		let unparsed = 0;
		for (;;) {
			options.signal.throwIfAborted();
			const batch = batches.shift();
			if (!batch) {
				if (receiveDone) break;
				await new Promise((resolve) => {
					wakeConsumer = resolve;
				});
				wakeConsumer = void 0;
				continue;
			}
			await batch.charged;
			for (const value of batch.events) {
				options.signal.throwIfAborted();
				const envelope = eventEnvelope(value);
				if (!envelope) {
					const event = asRecord(value);
					const type = asRecord(event.data).event_type;
					if (typeof type === "string" && type !== "post.mention.create") continue;
					if (++unparsed === 3) {
						const message = `X activity stream: 3 consecutive events could not be parsed; type=${JSON.stringify(typeof type === "string" ? type.slice(0, 96) : "unknown")} keys=${JSON.stringify(Object.keys(event).slice(0, 20).map((key) => key.slice(0, 64)))}`;
						options.onWarning?.(message);
						options.onStatus?.({ message });
					}
					continue;
				}
				if (unparsed >= 3 && !signal.aborted) options.onStatus?.({ message: "activity stream connected" });
				unparsed = 0;
				if (envelope.post.author_id === options.userId) continue;
				let addressed;
				if (recipientChecksDeferred) addressed = {
					...envelope,
					recipientPending: true
				};
				else try {
					addressed = await resolveXRecipient({
						api: options.api,
						post: envelope.post,
						users: envelope.users,
						userId: options.userId,
						signal: options.signal
					});
				} catch (error) {
					options.signal.throwIfAborted();
					if (!(error instanceof XBudgetExceededError)) {
						recipientChecksDeferred = true;
						deferFailure(error);
					}
					addressed = {
						...envelope,
						recipientPending: true
					};
				}
				if (!addressed) continue;
				await options.onPost(addressed);
				options.onStatus?.({ lastEventAt: Date.now() });
			}
		}
		if (receiveError) throw receiveError;
	} finally {
		closed = true;
		unsubscribe();
		clearTimeout(idleTimer);
		controller.abort();
		await backfill;
		signal.removeEventListener("abort", cancelOnAbort);
		await reader?.cancel().catch(() => {});
		await receiver;
		await chargesSettled;
		reader?.releaseLock();
		options.onStatus?.({
			streamConnected: false,
			...budgetPaused ? {} : { message: "activity stream disconnected" }
		});
	}
}
async function runXEvents(options) {
	let stream = options.mode !== "poll" && options.bearerConfigured;
	let streamPausedUntil = 0;
	const pauseStream = (until) => {
		streamPausedUntil = Math.max(streamPausedUntil, until);
	};
	let backoffMs = 1e3;
	let pollMessage = "mentions polling";
	const fallback = (error) => {
		stream = false;
		pollMessage = `${error instanceof Error ? error.message : "X Activity API request failed"}; polling`;
		options.onStatus?.({
			eventMode: "poll",
			streamConnected: false,
			streamBackoffMs: 0,
			message: pollMessage
		});
	};
	try {
		if (stream) try {
			await options.api.ensureActivitySubscriptions(options.userId, options.signal);
		} catch (error) {
			options.signal.throwIfAborted();
			if (options.mode !== "stream" || error instanceof XApiError && error.status === 403) fallback(error);
			else throw error;
		}
		while (!options.signal.aborted) {
			if (stream && Date.now() >= streamPausedUntil) streamPausedUntil = await options.api.spend.streamResumeAt() ?? 0;
			if (!stream || Date.now() < streamPausedUntil) {
				options.onStatus?.({
					eventMode: "poll",
					streamConnected: false,
					...streamPausedUntil > Date.now() ? { message: `activity stream paused below $0.50 budget headroom; polling until ${new Date(streamPausedUntil).toISOString()}` } : { message: pollMessage }
				});
				try {
					await pollXMentions(options);
				} catch (error) {
					options.signal.throwIfAborted();
					if (error instanceof XBudgetExceededError) {
						options.onStatus?.({
							message: error.message,
							spend: await options.api.spend.status()
						});
						await waitForXBudgetReset(error.exhaustedUntil, options.signal);
						continue;
					}
					options.onStatus?.({ message: "mentions poll failed; retrying after the poll interval" });
				}
				const pollWait = Math.max(15, options.pollSeconds ?? 60) * 1e3;
				await wait(streamPausedUntil > Date.now() ? Math.min(pollWait, streamPausedUntil - Date.now()) : pollWait, options.signal);
				continue;
			}
			try {
				await receiveStream({
					...options,
					onBudgetPause: pauseStream
				}, Math.max(60, (options.pollSeconds ?? 60) * 4) * 1e3);
			} catch (error) {
				options.signal.throwIfAborted();
				if (error instanceof XApiError && (error.status === 401 || error.status === 403)) {
					fallback(error);
					continue;
				}
				options.onStatus?.({
					streamConnected: false,
					streamBackoffMs: backoffMs,
					message: "activity stream reconnect backoff"
				});
				await wait(backoffMs, options.signal);
				backoffMs = Math.min(backoffMs * 2, 6e4);
			}
		}
	} catch (error) {
		if (!options.signal.aborted) throw error;
	}
}
//#endregion
//#region extensions/x/src/public-thread.ts
/** Never infer audience from a permalink, mention feed, or user-context API success. */
async function verifyPublicXThread(api, posts, signal, rootId) {
	if (!posts.some((post) => post.id === rootId)) return false;
	try {
		const page = await api.getPublicPosts(posts.map((post) => post.id), signal);
		signal.throwIfAborted();
		const publicPosts = new Map(page.data.map((post) => [post.id, post]));
		const authors = new Map(page.includes.users.map((user) => [user.id, user]));
		return posts.every((post) => {
			const publicPost = publicPosts.get(post.id);
			return publicPost !== void 0 && publicPost.text === post.text && publicPost.author_id === post.author_id && publicPost.conversation_id === post.conversation_id && !publicPost.withheld && !post.withheld && authors.get(post.author_id)?.protected === false;
		});
	} catch {
		signal.throwIfAborted();
		return false;
	}
}
//#endregion
//#region extensions/x/src/thread.ts
function comparePosts(a, b) {
	return BigInt(a.id) < BigInt(b.id) ? -1 : BigInt(a.id) > BigInt(b.id) ? 1 : 0;
}
async function assembleXThread(options) {
	const maxPosts = Math.max(2, Math.floor(options.maxPosts ?? 50));
	const posts = /* @__PURE__ */ new Map([[options.mention.id, options.mention]]);
	const users = new Map((options.users ?? []).map((user) => [user.id, user]));
	const fetched = /* @__PURE__ */ new Set();
	const quotedIds = () => [...posts.values()].flatMap((post) => post.referenced_tweets?.filter((reference) => reference.type === "quoted").map((reference) => reference.id) ?? []);
	const merge = (page) => {
		for (const post of [...page.includes.tweets, ...page.data]) posts.set(post.id, post);
		for (const user of page.includes.users) users.set(user.id, user);
	};
	async function fetchPosts(ids) {
		const pending = [...new Set(ids)].filter((id) => !fetched.has(id) && !posts.has(id));
		for (let offset = 0; offset < pending.length; offset += 100) {
			const batch = pending.slice(offset, offset + 100);
			batch.forEach((id) => fetched.add(id));
			merge(await options.api.getPosts(batch, options.signal));
		}
	}
	let budgetTruncated = false;
	try {
		let nextToken;
		const seenTokens = /* @__PURE__ */ new Set();
		do {
			const page = await options.api.searchConversation({
				conversationId: options.mention.conversation_id,
				maxPosts: maxPosts - posts.size,
				nextToken,
				signal: options.signal
			});
			merge(page);
			nextToken = page.meta.next_token;
			if (nextToken && seenTokens.has(nextToken)) throw new Error("X thread search pagination repeated a token");
			if (nextToken) seenTokens.add(nextToken);
		} while (nextToken && posts.size < maxPosts);
		if (!users.has(options.mention.author_id)) merge(await options.api.getPosts([options.mention.id], options.signal));
		await fetchPosts([options.mention.conversation_id]);
		let ancestor = options.mention;
		for (let depth = 0; ancestor && depth < maxPosts; depth++) {
			const parentId = ancestor.referenced_tweets?.find((reference) => reference.type === "replied_to")?.id;
			if (!parentId || parentId === ancestor.id) break;
			await fetchPosts([parentId]);
			ancestor = posts.get(parentId);
		}
		await fetchPosts(quotedIds());
	} catch (error) {
		if (!(error instanceof XBudgetExceededError)) throw error;
		budgetTruncated = true;
	}
	const root = posts.get(options.mention.conversation_id);
	const retained = /* @__PURE__ */ new Map();
	if (root) retained.set(root.id, root);
	retained.set(options.mention.id, options.mention);
	for (const post of [...posts.values()].toSorted(comparePosts).toReversed()) {
		if (retained.size >= maxPosts) break;
		retained.set(post.id, post);
	}
	const selected = [...retained.values()].toSorted(comparePosts);
	const handle = (post) => `@${users.get(post.author_id)?.username ?? post.author_id}`;
	const quotes = new Set(quotedIds());
	const lines = selected.map((post) => {
		const marker = post.id === options.mention.id ? " [triggering mention]" : quotes.has(post.id) ? " [quoted post]" : "";
		return `${handle(post)} (${post.created_at ?? "time unavailable"})${marker}: ${post.text}`;
	});
	const labelPost = root ?? selected[0] ?? options.mention;
	return {
		bodyForAgent: `X thread context (oldest to newest):\n${lines.map((line) => line.split(/\r\n|[\r\n\u2028\u2029]/).map((part) => `> ${part}`).join("\n")).join("\n")}${budgetTruncated ? "\n[thread context truncated by budget]" : ""}\n\nReply to the triggering mention.`,
		label: `${handle(labelPost)}: ${labelPost.text.replace(/\s+/g, " ").slice(0, 80)}`,
		posts: selected,
		users: [...users.values()]
	};
}
//#endregion
//#region extensions/x/src/monitor.ts
const InvalidXEvent = createChannelIngressError("InvalidXEvent");
async function startXAccount(ctx) {
	const core = getXRuntime();
	const account = ctx.account;
	const readConfig = createRuntimeConfigReader(ctx.cfg);
	const api = await getXApi(account.accountId, ctx.cfg);
	const log = core.logging.getChildLogger({
		channel: "x",
		accountId: account.accountId
	});
	const stats = { droppedMentions: 0 };
	const guestUsage = openXGuestUsage(core);
	const publish = (next = {}) => {
		if (next.message && next.message !== stats.message && !next.message.startsWith("X API ")) log.info(next.message);
		Object.assign(stats, next);
		ctx.setStatus({
			...ctx.getStatus(),
			...stats,
			...stats.guests ? { guests: {
				...stats.guests,
				enabled: resolveXGuestSettings(resolveXAccount(readConfig(), account.accountId)).enabled
			} } : {},
			accountId: account.accountId,
			mode: stats.eventMode,
			connected: stats.eventMode === "poll" || stats.streamConnected,
			tokenStatus: getXTokenState(account.accountId),
			lastInboundAt: stats.lastEventAt
		});
	};
	const cursor = core.state.openKeyedStore({
		namespace: "x.cursor",
		maxEntries: 1e3,
		overflowPolicy: "reject-new"
	});
	const queue = core.state.openChannelIngressQueue({ accountId: account.accountId });
	const previous = await cursor.lookup(account.accountId);
	if (previous && previous.userId !== account.userId) {
		if (!queue.purge) throw new Error("X bot identity changed; this host cannot reset its ingress queue.");
		await queue.purge({ signal: ctx.abortSignal });
	}
	const assertCurrent = () => {
		ctx.abortSignal.throwIfAborted();
		if (getXRuntime() !== core) throw new Error("X runtime was replaced");
	};
	if (!previous || previous.userId !== account.userId) await cursor.register(account.accountId, { userId: account.userId }, { assertCurrent });
	const ingress = createChannelIngressMonitor({
		queue,
		inspect: ({ post }) => ({
			eventId: post.id,
			laneKey: post.conversation_id
		}),
		payload: {
			storage: "raw-event",
			version: 1,
			serialize: (value) => JSON.stringify(value),
			deserialize: (value) => {
				const envelope = parseXPostEnvelope(JSON.parse(value));
				if (!envelope) throw new InvalidXEvent("Invalid stored X mention envelope");
				return envelope;
			},
			createClaimError: () => new InvalidXEvent("X mention identity changed after admission")
		},
		pollIntervalMs: 1e3,
		retention: {
			completedMaxEntries: 2e3,
			completedTtlMs: 2592e6,
			failedMaxEntries: 1e3
		},
		abortSignal: ctx.abortSignal,
		deliver: async (envelope, lifecycle) => {
			let { post, users } = envelope;
			const dropMention = () => {
				publish({
					droppedMentions: stats.droppedMentions + 1,
					lastDroppedAuthor: post.author_id
				});
				log.info(`mention post=${post.id} author=${post.author_id} dropped`);
			};
			let cfg = readConfig();
			let initialAuthorization = await resolveXIngress(account.accountId, post, cfg);
			const initial = initialAuthorization.ingress;
			if (post.author_id === account.userId || !initial.senderAccess.allowed) {
				dropMention();
				return;
			}
			if (envelope.recipientPending) for (;;) {
				cfg = readConfig();
				initialAuthorization = await resolveXIngress(account.accountId, post, cfg);
				if (post.author_id === account.userId || !initialAuthorization.ingress.senderAccess.allowed) {
					dropMention();
					return;
				}
				try {
					const addressed = await resolveXRecipient({
						api,
						post,
						users,
						userId: account.userId,
						signal: lifecycle.abortSignal
					});
					if (!addressed) return;
					({post, users} = addressed);
					break;
				} catch (error) {
					if (!(error instanceof XBudgetExceededError)) throw error;
					const heartbeat = setInterval(() => lifecycle.onDeferredHeartbeat?.(), lifecycle.deferredHeartbeatIntervalMs ?? 6e4);
					try {
						await waitForXBudgetReset(error.exhaustedUntil, lifecycle.abortSignal);
					} finally {
						clearInterval(heartbeat);
					}
				}
			}
			const admitGuest = async (authorization, currentCfg) => {
				const guestAccount = resolveXAccount(currentCfg, account.accountId);
				const guestRoute = resolveAgentRoute({
					cfg: currentCfg,
					channel: "x",
					accountId: account.accountId,
					peer: {
						kind: "group",
						id: post.conversation_id
					}
				});
				const blocked = resolveXGuestContainmentError(currentCfg, guestRoute.agentId);
				const assertGuestCurrent = () => {
					assertCurrent();
					lifecycle.abortSignal.throwIfAborted();
					authorization.assertCurrent();
					if (currentCfg !== readConfig()) throw new Error("X guest configuration changed during admission; retrying mention");
				};
				let admitted = false;
				let blockedReason = blocked;
				if (!blockedReason) try {
					admitted = await guestUsage.admit({
						accountId: account.accountId,
						authorId: post.author_id,
						postId: post.id,
						limit: resolveXGuestSettings(guestAccount).maxMentionsPerAuthorPerDay,
						assertCurrent: assertGuestCurrent
					});
				} catch (error) {
					if (!(error instanceof XGuestUsageUnavailableError)) throw error;
					blockedReason = error.message;
				}
				const guests = await getXGuestStatus(core, guestAccount, currentCfg, guestRoute.agentId);
				assertGuestCurrent();
				publish({
					guests,
					guestModeBlockedReason: blockedReason,
					...blockedReason ? { message: blockedReason } : {},
					...!admitted ? {
						droppedMentions: stats.droppedMentions + 1,
						lastDroppedAuthor: post.author_id
					} : {}
				});
				return admitted;
			};
			const initialSettings = resolveXGuestSettings(resolveXAccount(cfg, account.accountId));
			if (initialAuthorization.tier === "guest" && !await admitGuest(initialAuthorization, cfg)) return;
			const thread = await assembleXThread({
				api,
				mention: post,
				users,
				maxPosts: initialAuthorization.tier === "guest" ? initialSettings.threadContextMaxPosts : resolveXAccount(cfg, account.accountId).config.threadContext?.maxPosts ?? 50,
				signal: lifecycle.abortSignal
			});
			cfg = readConfig();
			const route = resolveAgentRoute({
				cfg,
				channel: "x",
				accountId: account.accountId,
				peer: {
					kind: "group",
					id: post.conversation_id
				}
			});
			const sessionKey = initialAuthorization.tier === "guest" ? `${route.sessionKey}:guest:${post.id}` : route.sessionKey;
			const publicationSnapshot = initialAuthorization.tier === "maintainer" && resolveXAccount(cfg, account.accountId).config.autoPublishWorkSessions === true ? await openXAllowlist(core).readSnapshot(account.accountId, resolveXAccount(cfg, account.accountId).config.verifiedFromGitHub) : void 0;
			const publicThread = publicationSnapshot && await verifyPublicXThread(api, thread.posts, lifecycle.abortSignal, post.conversation_id);
			const publication = publicationSnapshot && publicThread ? {
				audience: "public",
				prepare: createXPublicationPreparation({
					accountId: account.accountId,
					post,
					cfg,
					readConfig,
					route,
					assertActive: () => {
						lifecycle.abortSignal.throwIfAborted();
						assertCurrent();
					}
				}),
				assertCurrent: () => {
					lifecycle.abortSignal.throwIfAborted();
					assertCurrent();
					publicationSnapshot.assertCurrent();
					if (readConfig() !== cfg) throw new Error("X work-session publication policy changed; send a new mention.");
				}
			} : void 0;
			const authorization = await resolveXIngress(account.accountId, post, cfg, {
				agentId: route.agentId,
				sessionKey,
				messageId: post.id,
				inboundEventKind: "user_request"
			}, publication);
			const assertAdmissionCurrent = () => {
				assertCurrent();
				lifecycle.abortSignal.throwIfAborted();
				authorization.assertCurrent();
				if (cfg !== readConfig()) throw new Error("X routing configuration changed during admission; retrying mention");
			};
			const channelIngress = authorization.ingress;
			assertAdmissionCurrent();
			if (!channelIngress.senderAccess.allowed) {
				dropMention();
				return;
			}
			if (authorization.tier !== initialAuthorization.tier || authorization.tier === "guest" && initialSettings.threadContextMaxPosts !== resolveXGuestSettings(resolveXAccount(cfg, account.accountId)).threadContextMaxPosts) throw new XAllowlistChangedError();
			const guest = authorization.tier === "guest";
			if (guest && !await admitGuest(authorization, cfg)) return;
			const author = thread.users.find((user) => user.id === post.author_id);
			const handle = author?.username ?? post.author_id;
			const ctxPayload = core.channel.inbound.buildContext({
				channelIngress,
				access: {
					mentions: {
						...xMentionFacts,
						requireMention: true,
						explicitlyMentionedBot: true
					},
					...guest ? { toolPolicy: resolveXGuestToolPolicy(resolveXAccount(cfg, account.accountId)) } : {}
				},
				channel: "x",
				accountId: account.accountId,
				messageId: post.id,
				timestamp: post.created_at ? Date.parse(post.created_at) : void 0,
				from: `x:group:${post.conversation_id}`,
				sender: {
					id: post.author_id,
					name: `@${handle}`
				},
				conversation: {
					kind: "group",
					id: post.conversation_id,
					label: thread.label
				},
				route: {
					agentId: route.agentId,
					accountId: route.accountId,
					routeSessionKey: sessionKey
				},
				reply: {
					to: `x:${post.id}`,
					replyToId: post.id
				},
				message: {
					body: post.text,
					rawBody: post.text,
					commandBody: post.text,
					bodyForAgent: `${formatXSenderLine(authorization.tier, post.author_id, thread.users.find((user) => user.id === post.author_id), authorization.github)}\n${thread.bodyForAgent}`
				}
			});
			const sessions = [];
			log.info(`mention post=${post.id} author=${post.author_id} allowed`);
			assertAdmissionCurrent();
			await core.channel.inbound.dispatch({
				cfg,
				channel: "x",
				accountId: account.accountId,
				route: {
					agentId: route.agentId,
					sessionKey
				},
				ctxPayload,
				...bindIngressLifecycleToReplyOptions(lifecycle),
				replyOptions: { onVisibleWorkSessions: async (visible, creation) => {
					if (!guest) {
						if (!author?.username) throw new Error("X work-session origin requires the author's handle; retry the mention.");
						const childKeys = new Set(visible.map((session) => session.sessionKey));
						if (creation) childKeys.add(creation.createdSessionKey);
						for (const childKey of childKeys) await openXWorkOrigins(core).registerIfAbsent(childKey, {
							accountId: account.accountId,
							postId: post.id,
							postUrl: `https://x.com/${handle}/status/${post.id}`,
							authorHandle: handle,
							conversationId: post.conversation_id,
							senderTier: authorization.tier
						});
						for (const session of visible) if (!sessions.some((existing) => existing.sessionKey === session.sessionKey)) sessions.push(session);
					}
				} },
				delivery: {
					preparePayload: (payload, info) => info.kind === "final" ? payload : null,
					observeMessageSent: true,
					deliver: async (payload) => {
						if (!payload.text?.trim() && !payload.mediaUrl && !payload.mediaUrls?.length) return { visibleReplySent: false };
						const sent = await sendXDelivery({
							cfg: readConfig(),
							accountId: account.accountId,
							to: `x:${post.id}`,
							text: payload.text ?? "",
							mediaUrl: payload.mediaUrl,
							mediaUrls: payload.mediaUrls,
							mention: post,
							visibleWorkSessions: guest ? void 0 : sessions,
							senderTier: authorization.tier,
							signal: lifecycle.abortSignal
						});
						ctx.setStatus({
							...ctx.getStatus(),
							lastOutboundAt: Date.now()
						});
						return {
							visibleReplySent: true,
							content: sent.content,
							receipt: sent.receipt
						};
					}
				}
			});
		},
		onError: () => {
			log.warn("X ingress failed; pending mentions will retry");
		},
		drain: { resolveNonRetryableFailure: (error) => error instanceof InvalidXEvent ? {
			reason: "invalid-event",
			message: error.message
		} : null }
	});
	const startupConfig = readConfig();
	stats.guests = await getXGuestStatus(core, resolveXAccount(startupConfig, account.accountId), startupConfig);
	ingress.start();
	ctx.setStatus({
		...ctx.getStatus(),
		running: true,
		lifecycle: "ready"
	});
	publish();
	let stopped = false;
	const publishSpend = async () => {
		try {
			const spend = await api.spend.status();
			if (!stopped) publish({ spend });
		} catch {
			if (!stopped) publish({ message: "X spend accounting unavailable; paid requests paused" });
		}
	};
	const unsubscribeSpend = api.spend.subscribe(() => {
		publishSpend();
	});
	try {
		await publishSpend();
		await runXEvents({
			api,
			userId: account.userId,
			mode: account.config.events?.mode ?? "auto",
			pollSeconds: account.config.events?.pollSeconds ?? 60,
			bearerConfigured: Boolean(account.config.bearerToken),
			signal: ctx.abortSignal,
			onStatus: publish,
			onWarning: (message) => log.warn(message),
			getCursor: async () => await cursor.lookup(account.accountId) ?? {},
			setCursor: async (next) => {
				await cursor.register(account.accountId, {
					...next,
					userId: account.userId
				}, { assertCurrent });
			},
			onPost: async (post) => {
				await ingress.admit(post);
			}
		});
	} finally {
		stopped = true;
		unsubscribeSpend();
		await ingress.stop();
		ctx.setStatus({
			...ctx.getStatus(),
			running: false,
			connected: false,
			lifecycle: "stopped"
		});
	}
}
//#endregion
export { startXAccount };
