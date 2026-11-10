import { s as __toESM } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as resolveSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as LinkifyIt } from "./build-CSGemSDQ.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./secret-input-CHX7JVid.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { t as require_tlds } from "./tlds-Cq_6F5yw.mjs";
import { i as resolveXAccount } from "./accounts-n2C-ky3w.mjs";
import { t as getXRuntime } from "./runtime-B1HOiKKH.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region extensions/x/src/fetch.ts
async function fetchXService(host, path, init, fetchImpl, assertActive, onDispatch) {
	const url = `https://${host}${path}`;
	const authorize = (dispatch) => async (input, prepared) => {
		const assertCurrent = await assertActive?.();
		prepared?.signal?.throwIfAborted();
		assertCurrent?.();
		onDispatch?.();
		return dispatch(input, prepared);
	};
	if (fetchImpl) return authorize((_input, prepared) => fetchImpl(url, prepared))(url, init);
	const [{ fetchWithSsrFGuard }, { responseWithRelease }, { fetchWithRuntimeDispatcher }] = await Promise.all([
		import("./plugin-sdk/ssrf-runtime.js"),
		import("./plugin-sdk/fetch-runtime.js"),
		import("./plugin-sdk/runtime-fetch.js")
	]);
	const guarded = await fetchWithSsrFGuard({
		url,
		init,
		capture: false,
		requireHttps: true,
		policy: { hostnameAllowlist: [host] },
		maxRedirects: 0,
		fetchImpl: authorize(fetchWithRuntimeDispatcher)
	});
	return responseWithRelease(guarded.response, guarded.release);
}
//#endregion
//#region extensions/x/src/urls.ts
var import_tlds = /* @__PURE__ */ __toESM(require_tlds(), 1);
const links = new LinkifyIt({
	fuzzyLink: true,
	tlds: import_tlds.default
});
function findXUrls(text) {
	return (links.match(text) ?? []).filter((match) => !match.schema || [
		"http:",
		"https:",
		"//"
	].includes(match.schema));
}
//#endregion
//#region extensions/x/src/pricing.ts
const X_POST_READ_MICRO_USD = 5e3;
const X_USER_READ_MICRO_USD = 1e4;
const X_POST_EVENT_MICRO_USD = 5e3;
const X_REPLY_MICRO_USD = 15e3;
const X_LINK_REPLY_MICRO_USD = 2e5;
function xReplyCost(text) {
	return findXUrls(text).length ? X_LINK_REPLY_MICRO_USD : X_REPLY_MICRO_USD;
}
function xReadCost(value, kind) {
	const row = asOptionalRecord(value);
	const includes = asOptionalRecord(row?.includes);
	const count = (data) => Array.isArray(data) ? data.length : asOptionalRecord(data) ? 1 : 0;
	return count(row?.data) * (kind === "posts" ? X_POST_READ_MICRO_USD : X_USER_READ_MICRO_USD) + count(includes?.tweets) * X_POST_READ_MICRO_USD + count(includes?.users) * X_USER_READ_MICRO_USD;
}
function xActivityCost(value) {
	const event = asOptionalRecord(asOptionalRecord(value)?.data);
	return (typeof event?.event_type === "string" && event.event_type.startsWith("post.") ? X_POST_EVENT_MICRO_USD : 0) + xReadCost({ includes: event?.includes }, "posts");
}
//#endregion
//#region extensions/x/src/spend.ts
const X_STREAM_HEADROOM_MICRO_USD = 5e5;
const MICRO_USD = 1e6;
const RETENTION_MS = 6048e6;
const XBudgetExceededError = resolveGlobalSingleton(Symbol.for("openclaw.x.budget-exceeded-error"), () => class extends Error {
	constructor(message, exhaustedUntil) {
		super(message);
		this.exhaustedUntil = exhaustedUntil;
		this.name = "XBudgetExceededError";
	}
});
const owners = resolveGlobalMap(Symbol.for("openclaw.x.spend"), async (active) => {
	await Promise.all([...active.values()].map((owner) => owner.close()));
	active.clear();
}, "close-and-restart");
function periodAt(now, cycleStartDay) {
	const date = new Date(now);
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const cycleMonth = date.getUTCDate() < cycleStartDay ? month - 1 : month;
	return {
		day: date.toISOString().slice(0, 10),
		cycle: new Date(Date.UTC(year, cycleMonth, cycleStartDay)).toISOString().slice(0, 10),
		dayEnd: Date.UTC(year, month, date.getUTCDate() + 1),
		cycleEnd: Date.UTC(year, cycleMonth + 1, cycleStartDay)
	};
}
function checkedAmount(value) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error("X spend must be a nonnegative safe integer in micro-dollars");
	return value;
}
function createSpendOwner(runtime, accountId, getLimits) {
	const prefix = `${encodeURIComponent(accountId)}:`;
	const openStore = (current) => current.state.openKeyedStore({
		namespace: "x.spend",
		maxEntries: 2e5,
		overflowPolicy: "reject-new",
		defaultTtlMs: RETENTION_MS
	});
	let store = openStore(runtime);
	let state = runtime.state;
	let logger = runtime.logging?.getChildLogger({
		channel: "x",
		accountId
	});
	let limits = getLimits;
	let tail = Promise.resolve();
	let initialized = false;
	let failure;
	let refusedAmount = 0;
	let warnedUntil;
	let reconciledCycle;
	const pending = /* @__PURE__ */ new Map();
	const listeners = /* @__PURE__ */ new Set();
	const notify = () => {
		for (const listener of listeners) listener();
	};
	const serialized = (work) => {
		const result = tail.then(async () => {
			if (failure) throw failure;
			try {
				return await work();
			} catch (error) {
				if (!(error instanceof XBudgetExceededError)) {
					failure = new Error("X spend accounting unavailable; paid requests paused", { cause: error });
					notify();
				}
				throw error;
			}
		});
		tail = result.catch(() => void 0);
		return result;
	};
	const bucketKey = (kind, date) => `${prefix}${kind}:${date}`;
	const read = async (kind, date) => checkedAmount(await store.lookup(bucketKey(kind, date)) ?? 0);
	const add = async (kind, date, amount) => {
		if (amount) await store.register(bucketKey(kind, date), checkedAmount(await read(kind, date) + amount));
	};
	const finish = async (reservation, actual) => {
		const current = periodAt(Date.now(), limits().cycleStartDay);
		for (const day of /* @__PURE__ */ new Set([reservation.day, current.day])) await add("day", day, actual);
		for (const cycle of /* @__PURE__ */ new Set([reservation.cycle, current.cycle])) await add("cycle", cycle, actual);
		if (reservation.day !== current.day && actual) {
			const key = `${prefix}overlap:${reservation.day}:${current.day}`;
			await store.register(key, checkedAmount(checkedAmount(await store.lookup(key) ?? 0) + actual));
		}
		await store.delete(reservation.key);
		pending.delete(reservation.key);
	};
	const initialize = async () => {
		if (initialized) return;
		const pendingPrefix = `${prefix}pending:`;
		for (const entry of await store.entries()) {
			if (!entry.key.startsWith(pendingPrefix)) continue;
			const [day, cycle] = entry.key.slice(pendingPrefix.length).split(":");
			if (!day || !cycle || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{4}-\d{2}-\d{2}$/.test(cycle)) throw new Error("Invalid persisted X spend reservation");
			const reservation = {
				key: entry.key,
				amount: checkedAmount(entry.value),
				day,
				cycle
			};
			await finish(reservation, reservation.amount);
		}
		initialized = true;
	};
	const snapshot = async () => {
		await initialize();
		const config = limits();
		const period = periodAt(Date.now(), config.cycleStartDay);
		if (reconciledCycle !== period.cycle) {
			const dayPrefix = `${prefix}day:`;
			const overlapPrefix = `${prefix}overlap:`;
			const inCycle = (day) => day >= period.cycle && day <= period.day;
			let dayTotal = 0;
			let overlaps = 0;
			for (const entry of await store.entries()) if (entry.key.startsWith(dayPrefix)) {
				if (inCycle(entry.key.slice(dayPrefix.length))) dayTotal = checkedAmount(dayTotal + checkedAmount(entry.value));
			} else if (entry.key.startsWith(overlapPrefix)) {
				const [startDay, completionDay] = entry.key.slice(overlapPrefix.length).split(":");
				if (startDay && completionDay && inCycle(startDay) && inCycle(completionDay)) overlaps = checkedAmount(overlaps + checkedAmount(entry.value));
			}
			const cycleFromDays = checkedAmount(dayTotal - overlaps);
			if (cycleFromDays > await read("cycle", period.cycle)) await store.register(bucketKey("cycle", period.cycle), cycleFromDays);
			reconciledCycle = period.cycle;
		}
		const held = [...pending.values()].reduce((total, item) => checkedAmount(total + item.amount), 0);
		return {
			config,
			period,
			held,
			day: checkedAmount(await read("day", period.day) + held),
			cycle: checkedAmount(await read("cycle", period.cycle) + held),
			dailyLimit: Math.floor(config.dailyUsd * MICRO_USD),
			monthlyLimit: Math.floor(config.monthlyUsd * MICRO_USD)
		};
	};
	const refusal = (view, amount, inclusive = false) => {
		const dayExceeded = inclusive ? view.day + amount > view.dailyLimit : view.day + amount >= view.dailyLimit;
		const cycleExceeded = inclusive ? view.cycle + amount > view.monthlyLimit : view.cycle + amount >= view.monthlyLimit;
		if (!dayExceeded && !cycleExceeded) return;
		const until = Math.max(dayExceeded ? view.period.dayEnd : 0, cycleExceeded ? view.period.cycleEnd : 0);
		const reason = cycleExceeded ? `billing-cycle budget of $${view.config.monthlyUsd}` : `daily budget of $${view.config.dailyUsd}`;
		return new XBudgetExceededError(`X API ${reason} reached; resumes at ${new Date(until).toISOString().replace(":00.000Z", "Z")}`, until);
	};
	const updateNotice = (view) => {
		const error = refusal(view, refusedAmount, refusedAmount > 0);
		const notice = refusedAmount ? error : refusal({
			...view,
			day: view.day - view.held,
			cycle: view.cycle - view.held
		}, 0);
		if (warnedUntil !== void 0 && (Date.now() >= warnedUntil || !notice)) {
			logger?.info("X API budget reset; paid requests may resume");
			warnedUntil = void 0;
		}
		if (!error) refusedAmount = 0;
		else if (notice && logger && warnedUntil === void 0) {
			warnedUntil = notice.exhaustedUntil;
			logger?.warn(notice.message);
		}
		return error;
	};
	const reserve = async (amount, enforce, receivedAt) => {
		checkedAmount(amount);
		const view = await snapshot();
		updateNotice(view);
		const error = amount ? refusal(view, amount, true) : void 0;
		if (enforce && error) {
			refusedAmount = Math.max(refusedAmount, amount);
			updateNotice(view);
			throw error;
		}
		const period = receivedAt === void 0 ? view.period : periodAt(receivedAt, view.config.cycleStartDay);
		const reservation = {
			key: `${prefix}pending:${period.day}:${period.cycle}:${randomUUID()}`,
			amount,
			day: period.day,
			cycle: period.cycle
		};
		await store.register(reservation.key, amount);
		pending.set(reservation.key, reservation);
		notify();
		return reservation;
	};
	return {
		api: {
			async reserve(microUsd) {
				const reservation = await serialized(() => reserve(microUsd, true));
				let settled = false;
				return { settle: (actualMicroUsd) => serialized(async () => {
					if (settled) return;
					checkedAmount(actualMicroUsd);
					settled = true;
					await finish(reservation, actualMicroUsd);
					updateNotice(await snapshot());
					notify();
				}) };
			},
			charge: (microUsd) => {
				const receivedAt = Date.now();
				return serialized(async () => {
					const reservation = await reserve(microUsd, false, receivedAt);
					await finish(reservation, microUsd);
					updateNotice(await snapshot());
					notify();
				});
			},
			status: () => serialized(async () => {
				const view = await snapshot();
				const exhausted = updateNotice(view);
				const dollars = (amount) => Math.round(amount / 1e4) / 100;
				return {
					dayUsd: dollars(view.day),
					cycleUsd: dollars(view.cycle),
					dailyLimitUsd: dollars(view.dailyLimit),
					monthlyLimitUsd: dollars(view.monthlyLimit),
					cycleStart: view.period.cycle,
					...exhausted ? { exhaustedUntil: new Date(exhausted.exhaustedUntil).toISOString() } : {}
				};
			}),
			streamResumeAt: () => serialized(async () => {
				const view = await snapshot();
				updateNotice(view);
				return refusal(view, X_STREAM_HEADROOM_MICRO_USD, true)?.exhaustedUntil;
			}),
			subscribe(listener) {
				listeners.add(listener);
				return () => {
					listeners.delete(listener);
				};
			}
		},
		update(nextRuntime, nextLimits) {
			limits = nextLimits;
			logger = nextRuntime.logging?.getChildLogger({
				channel: "x",
				accountId
			}) ?? logger;
			if (state !== nextRuntime.state) {
				store = openStore(nextRuntime);
				state = nextRuntime.state;
			}
		},
		async close() {
			failure = /* @__PURE__ */ new Error("X spend owner closed; pending reservations retained for recovery");
			await tail;
		}
	};
}
function openXSpend(runtime, accountId, getLimits) {
	const key = JSON.stringify([runtime.state.resolveStateDir(), accountId]);
	let owner = owners.get(key);
	if (!owner) {
		owner = createSpendOwner(runtime, accountId, getLimits);
		owners.set(key, owner);
	} else owner.update(runtime, getLimits);
	return owner.api;
}
//#endregion
//#region extensions/x/src/api.ts
const POST_FIELDS = "author_id,conversation_id,created_at,in_reply_to_user_id,referenced_tweets,entities,withheld";
var XApiError = class extends Error {
	constructor(status, operation, detail) {
		super(`X API ${operation} failed (HTTP ${status})${detail ? `: ${detail}` : ""}`);
		this.status = status;
		this.operation = operation;
		this.name = "XApiError";
	}
};
async function readActivityErrorDetail(response, signal, secrets) {
	try {
		const { readResponseWithLimit } = await import("./plugin-sdk/response-limit-runtime.js");
		const body = asOptionalRecord(JSON.parse((await readResponseWithLimit(response, 16384, {
			signal,
			timeoutMs: 3e4
		})).toString()));
		const first = asOptionalRecord(Array.isArray(body?.errors) ? body.errors[0] : void 0);
		let detail = [
			first?.message,
			first?.detail,
			first?.title,
			body?.detail,
			body?.message,
			body?.title
		].find((value) => typeof value === "string" && Boolean(value.trim()));
		if (!detail) return;
		for (const secret of secrets.filter((value) => Boolean(value)).toSorted((a, b) => b.length - a.length)) detail = detail.replaceAll(secret, "[redacted]");
		return detail.replace(/\s+/g, " ").trim().slice(0, 512);
	} catch {
		return;
	}
}
async function readJson(response) {
	try {
		return await response.json();
	} catch {
		throw new Error("X API returned an unreadable JSON response");
	}
}
function parseXPost(input) {
	const row = asOptionalRecord(input);
	if (!row || typeof row.id !== "string" || !/^\d+$/.test(row.id) || typeof row.text !== "string" || typeof row.author_id !== "string" || !/^\d+$/.test(row.author_id) || typeof row.conversation_id !== "string" || !/^\d+$/.test(row.conversation_id)) return;
	const references = [];
	for (const value of Array.isArray(row.referenced_tweets) ? row.referenced_tweets : []) {
		const reference = asOptionalRecord(value);
		if (reference && typeof reference.id === "string" && /^\d+$/.test(reference.id) && (reference.type === "replied_to" || reference.type === "quoted" || reference.type === "retweeted")) references.push({
			id: reference.id,
			type: reference.type
		});
	}
	const entities = asOptionalRecord(row.entities);
	const mentions = [];
	for (const value of Array.isArray(entities?.mentions) ? entities.mentions : []) {
		const mention = asOptionalRecord(value);
		if (mention && typeof mention.username === "string") mentions.push({
			username: mention.username,
			...typeof mention.id === "string" ? { id: mention.id } : {}
		});
	}
	return {
		id: row.id,
		text: row.text,
		author_id: row.author_id,
		conversation_id: row.conversation_id,
		...row.withheld !== void 0 ? { withheld: true } : {},
		...typeof row.created_at === "string" ? { created_at: row.created_at } : {},
		...typeof row.in_reply_to_user_id === "string" ? { in_reply_to_user_id: row.in_reply_to_user_id } : {},
		...references.length ? { referenced_tweets: references } : {},
		...entities ? { entities: Array.isArray(entities.mentions) ? { mentions } : {} } : {}
	};
}
function parseUser(value) {
	const row = asOptionalRecord(value);
	return row && typeof row.id === "string" && /^\d+$/.test(row.id) && typeof row.username === "string" ? {
		id: row.id,
		username: row.username,
		...typeof row.protected === "boolean" ? { protected: row.protected } : {},
		...typeof row.name === "string" ? { name: row.name } : {}
	} : void 0;
}
function parseXPostEnvelope(input) {
	const row = asOptionalRecord(input);
	const post = parseXPost(row?.post);
	return post ? {
		post,
		users: (Array.isArray(row?.users) ? row.users : []).flatMap((value) => parseUser(value) ?? []),
		...row?.recipientPending === true ? { recipientPending: true } : {}
	} : void 0;
}
function parsePage(input) {
	const row = asOptionalRecord(input);
	if (!row || row.data !== void 0 && !Array.isArray(row.data)) throw new Error("X API returned an invalid post page");
	const data = (row.data ?? []).map((value) => {
		const post = parseXPost(value);
		if (!post) throw new Error("X API returned an invalid post");
		return post;
	});
	const includes = asOptionalRecord(row.includes);
	const meta = asOptionalRecord(row.meta);
	return {
		data,
		includes: {
			users: (Array.isArray(includes?.users) ? includes.users : []).flatMap((value) => parseUser(value) ?? []),
			tweets: (Array.isArray(includes?.tweets) ? includes.tweets : []).flatMap((value) => parseXPost(value) ?? [])
		},
		meta: {
			...typeof meta?.newest_id === "string" ? { newest_id: meta.newest_id } : {},
			...typeof meta?.next_token === "string" ? { next_token: meta.next_token } : {}
		}
	};
}
function createXApiClient(options) {
	let accessToken;
	let expiresAt = 0;
	let refreshToken = options.refreshToken;
	let loadedRefreshToken = false;
	let pendingRefreshToken;
	let refreshTask;
	function requestSignal(signal) {
		return AbortSignal.any([...[options.signal, signal].filter((value) => Boolean(value)), AbortSignal.timeout(3e4)]);
	}
	async function refresh() {
		options.onTokenState?.("refreshing");
		try {
			if (!loadedRefreshToken) {
				refreshToken = await options.loadRefreshToken?.() ?? refreshToken;
				loadedRefreshToken = true;
			}
			if (pendingRefreshToken) {
				await options.saveRefreshToken(pendingRefreshToken);
				pendingRefreshToken = void 0;
			}
			const response = await fetchXService("api.x.com", "/2/oauth2/token", {
				method: "POST",
				redirect: "error",
				headers: {
					Authorization: `Basic ${Buffer.from(`${encodeURIComponent(options.clientId)}:${encodeURIComponent(options.clientSecret)}`).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					refresh_token: refreshToken
				}).toString(),
				signal: requestSignal()
			}, options.fetch);
			if (!response.ok) {
				await response.body?.cancel();
				throw new XApiError(response.status, "token refresh");
			}
			const token = asOptionalRecord(await readJson(response));
			if (!token || typeof token.access_token !== "string" || !token.access_token) throw new Error("X API returned an invalid token response");
			if (typeof token.refresh_token === "string" && token.refresh_token) {
				refreshToken = token.refresh_token;
				pendingRefreshToken = refreshToken;
				await options.saveRefreshToken(refreshToken);
				pendingRefreshToken = void 0;
			}
			accessToken = token.access_token;
			expiresAt = Date.now() + (typeof token.expires_in === "number" ? Math.max(0, token.expires_in - 30) : 7170) * 1e3;
			options.onTokenState?.("ready");
		} catch {
			accessToken = void 0;
			options.onTokenState?.("error");
			throw new Error("X token refresh failed; check the account credentials and token storage");
		}
	}
	async function ensureAccessToken() {
		if (accessToken && Date.now() < expiresAt) return;
		refreshTask ??= refresh().finally(() => {
			refreshTask = void 0;
		});
		await refreshTask;
	}
	async function request(path, params = {}) {
		for (let attempt = 0; attempt < 2; attempt++) {
			const reservation = params.billing ? await options.spend.reserve(params.billing.maximum) : void 0;
			let cost = 0;
			try {
				if (!params.appOnly) await ensureAccessToken();
				const token = params.appOnly ? options.bearerToken : accessToken;
				if (!token) throw new Error("X Activity API requires a bearer token");
				const signal = params.stream ? AbortSignal.any([options.signal, params.signal].filter((value) => Boolean(value))) : requestSignal(params.signal);
				signal.throwIfAborted();
				let response;
				let authorityRejected = false;
				let authorityError;
				try {
					response = await fetchXService("api.x.com", path, {
						method: params.method ?? "GET",
						redirect: "error",
						headers: {
							Authorization: `Bearer ${token}`,
							...params.body ? { "Content-Type": "application/json" } : {}
						},
						...params.body ? { body: JSON.stringify(params.body) } : {},
						signal
					}, options.fetch, params.assertActive ? async () => {
						try {
							const assertCurrent = await params.assertActive?.();
							return () => {
								try {
									assertCurrent?.();
								} catch (error) {
									authorityRejected = true;
									authorityError = error;
									throw error;
								}
							};
						} catch (error) {
							authorityRejected = true;
							authorityError = error;
							throw error;
						}
					} : void 0, () => {
						cost = params.billing?.maximum ?? 0;
						params.onDispatch?.();
					});
				} catch {
					if (authorityRejected) throw authorityError;
					signal.throwIfAborted();
					throw new Error("X API network request failed");
				}
				if (response.status >= 400 && response.status < 500) {
					cost = 0;
					if (params.billing) {
						const value = await readJson(response).catch(() => void 0);
						cost = params.billing.actual(value);
					}
				}
				if (response.status === 401) {
					params.onAuthenticationRejected?.();
					if (!params.appOnly && attempt === 0) {
						await response.body?.cancel().catch(() => {});
						if (accessToken === token) accessToken = void 0;
						continue;
					}
				}
				if (!response.ok) {
					let detail;
					if (path.startsWith("/2/activity/")) detail = await readActivityErrorDetail(response, signal, [
						token,
						accessToken,
						options.bearerToken,
						refreshToken,
						options.refreshToken,
						options.clientSecret
					]);
					else await response.body?.cancel().catch(() => {});
					throw new XApiError(response.status, path.split("?")[0] ?? path, detail);
				}
				if (!params.billing) return response;
				const value = await readJson(response);
				const parsed = params.billing.parse(value);
				cost = params.billing.actual(value);
				return parsed;
			} finally {
				await reservation?.settle(cost);
			}
		}
		throw new Error("X user token was rejected after refresh");
	}
	async function page(path, query, maximumPosts, signal, appOnly = false) {
		const params = new URLSearchParams({
			"tweet.fields": POST_FIELDS,
			expansions: "author_id",
			"user.fields": "username,name,protected"
		});
		for (const [key, value] of Object.entries(query)) if (value !== void 0) params.set(key, value);
		return request(`${path}?${params}`, {
			signal,
			appOnly,
			billing: {
				maximum: maximumPosts * 15e3,
				actual: (value) => xReadCost(value, "posts"),
				parse: parsePage
			}
		});
	}
	return {
		spend: options.spend,
		getMentions: (params) => page(`/2/users/${encodeURIComponent(params.userId)}/mentions`, {
			since_id: params.sinceId,
			pagination_token: params.paginationToken,
			max_results: "10"
		}, 10, params.signal),
		getPosts: (ids, signal) => {
			if (!ids.length || ids.length > 100) throw new Error("X post lookup requires 1–100 post ids");
			return page("/2/tweets", { ids: ids.join(",") }, ids.length, signal);
		},
		getPublicPosts: (ids, signal) => {
			if (!options.bearerToken || !ids.length || ids.length > 100) throw new Error("Public X lookup requires an app-only bearer token and 1–100 post ids");
			return page("/2/tweets", { ids: ids.join(",") }, ids.length, signal, true);
		},
		searchConversation: (params) => page("/2/tweets/search/recent", {
			query: `conversation_id:${params.conversationId}`,
			next_token: params.nextToken,
			max_results: String(Math.max(10, Math.min(Math.floor(params.maxPosts), 100))),
			sort_order: "recency"
		}, Math.max(10, Math.min(Math.floor(params.maxPosts), 100)), params.signal),
		async getUsersByUsernames(usernames, signal, assertActive) {
			const handles = usernames.map((username) => username.replace(/^@/, ""));
			if (!handles.length || handles.length > 100 || handles.some((handle) => !/^[A-Za-z0-9_]{1,15}$/.test(handle))) throw new Error("X user lookup requires 1–100 valid usernames");
			return request(`/2/users/by?${new URLSearchParams({
				usernames: handles.join(","),
				"user.fields": "id,username,name"
			})}`, {
				signal,
				assertActive,
				billing: {
					maximum: handles.length * X_USER_READ_MICRO_USD,
					actual: (value) => xReadCost(value, "users"),
					parse: (value) => {
						const row = asOptionalRecord(value);
						if (!row || row.data !== void 0 && !Array.isArray(row.data)) throw new Error("X API returned an invalid users response");
						return (row.data ?? []).map((entry) => {
							const user = parseUser(entry);
							if (!user || !/^[A-Za-z0-9_]{1,15}$/.test(user.username)) throw new Error("X API returned an invalid user");
							return user;
						});
					}
				}
			});
		},
		async getUserByUsername(username, signal) {
			const user = await request(`/2/users/by/username/${encodeURIComponent(username.replace(/^@/, ""))}?user.fields=id,username,name`, {
				signal,
				billing: {
					maximum: X_USER_READ_MICRO_USD,
					actual: (value) => xReadCost(value, "users"),
					parse: (value) => {
						const row = asOptionalRecord(value);
						if (!row) throw new Error("X API returned an invalid user response");
						if (row.data === void 0) return;
						const resolved = parseUser(row.data);
						if (!resolved) throw new Error("X API returned no matching user");
						return resolved;
					}
				}
			});
			if (!user) throw new Error("X API returned no matching user");
			return user;
		},
		async reply(params) {
			let dispatched = false;
			try {
				params.signal?.throwIfAborted();
				return await request("/2/tweets", {
					billing: {
						maximum: xReplyCost(params.text),
						actual: (value) => asOptionalRecord(asOptionalRecord(value)?.data)?.id ? xReplyCost(params.text) : 0,
						parse: (value) => {
							const id = asOptionalRecord(asOptionalRecord(value)?.data)?.id;
							if (typeof id !== "string" || !/^\d+$/.test(id)) throw new Error("X API returned no reply id; delivery outcome is unknown");
							return id;
						}
					},
					method: "POST",
					body: {
						text: params.text,
						reply: { in_reply_to_tweet_id: params.inReplyToId }
					},
					signal: params.signal,
					assertActive: params.assertActive,
					onDispatch: () => {
						dispatched = true;
					},
					onAuthenticationRejected: () => {
						dispatched = false;
					}
				});
			} catch (cause) {
				if (cause instanceof PlatformMessageNotDispatchedError) throw cause;
				if (cause instanceof XBudgetExceededError) throw new PlatformMessageNotDispatchedError(cause.message, {
					cause,
					retryable: false
				});
				if (cause instanceof XApiError && cause.status < 500) throw new PlatformMessageNotDispatchedError(cause.message, {
					cause,
					retryable: cause.status === 429
				});
				if (dispatched) throw cause;
				throw new PlatformMessageNotDispatchedError(cause instanceof Error ? cause.message : "X reply failed before dispatch", {
					cause,
					retryable: !params.signal?.aborted && !options.signal?.aborted
				});
			}
		},
		async ensureActivitySubscriptions(userId, signal) {
			const response = await request("/2/activity/subscriptions", {
				appOnly: true,
				signal
			});
			const data = asOptionalRecord(await readJson(response))?.data;
			if ((Array.isArray(data) ? data : []).some((value) => {
				const subscription = asOptionalRecord(value);
				return subscription?.event_type === "post.mention.create" && asOptionalRecord(subscription.filter)?.user_id === userId;
			})) return;
			await (await request("/2/activity/subscriptions", {
				method: "POST",
				body: {
					event_type: "post.mention.create",
					filter: { user_id: userId }
				},
				appOnly: false,
				signal
			})).body?.cancel();
		},
		openActivityStream: (signal) => request("/2/activity/stream", {
			appOnly: true,
			stream: true,
			signal
		})
	};
}
//#endregion
//#region extensions/x/src/client.ts
const clients = /* @__PURE__ */ new WeakMap();
function getXTokenState(accountId) {
	return clients.get(getXRuntime())?.get(accountId)?.tokenState ?? "idle";
}
async function getXApi(accountId, cfg) {
	const runtime = getXRuntime();
	const account = resolveXAccount(cfg, accountId);
	if (!account.enabled || !account.configured) throw new Error("X account is disabled or incomplete; configure userId, username, clientId, clientSecret and refreshToken.");
	const secret = (field) => resolveSecretInputString({
		value: account.config[field],
		defaults: cfg.secrets?.defaults,
		path: `channels.x.accounts.${accountId}.${field}`,
		mode: "strict"
	}).value;
	const clientSecret = secret("clientSecret");
	const refreshToken = secret("refreshToken");
	const bearerToken = secret("bearerToken");
	const lineageFingerprint = createHash("sha256").update(JSON.stringify([
		account.userId,
		account.config.clientId,
		refreshToken
	])).digest("hex");
	let accounts = clients.get(runtime);
	if (!accounts) {
		accounts = /* @__PURE__ */ new Map();
		clients.set(runtime, accounts);
	}
	const readConfig = createRuntimeConfigReader(cfg);
	const spend = openXSpend(runtime, accountId, () => resolveXAccount(readConfig(), accountId).costLimits);
	const existing = accounts.get(accountId);
	if (existing?.lineageFingerprint === lineageFingerprint) {
		existing.options.clientSecret = clientSecret;
		existing.options.bearerToken = bearerToken;
		return existing.api;
	}
	const accountClients = accounts;
	const tokens = runtime.state.openKeyedStore({
		namespace: "x.oauth",
		maxEntries: 1e3,
		overflowPolicy: "reject-new"
	});
	const options = {
		spend,
		clientId: account.config.clientId,
		clientSecret,
		refreshToken,
		bearerToken,
		loadRefreshToken: async () => {
			const stored = await tokens.lookup(accountId);
			return stored?.lineageFingerprint === lineageFingerprint ? stored.refreshToken : void 0;
		},
		saveRefreshToken: async (next) => {
			await tokens.register(accountId, {
				lineageFingerprint,
				refreshToken: next
			}, { assertCurrent: () => {
				if (getXRuntime() !== runtime || accountClients.get(accountId) !== entry) throw new Error("X account was replaced during token refresh");
			} });
		},
		onTokenState: (state) => {
			entry.tokenState = state;
		}
	};
	const entry = {
		lineageFingerprint,
		options,
		tokenState: "idle",
		api: createXApiClient(options)
	};
	accounts.set(accountId, entry);
	return entry.api;
}
//#endregion
export { XBudgetExceededError as a, findXUrls as c, parseXPostEnvelope as i, fetchXService as l, getXTokenState as n, openXSpend as o, XApiError as r, xActivityCost as s, getXApi as t };
