import { i as generateSecureToken } from "../../secure-random-DxCgeORs.mjs";
import { n as validateJsonSchemaValue } from "../../schema-validator-B9g4ZpIt.mjs";
import { f as sendHttpRequestRejection, i as isRequestBodyLimitError, o as readRequestBodyWithLimit } from "../../http-body-DZQjJc2J.mjs";
import { p as resolvePinnedHostnameWithPolicy } from "../../ssrf-K50Tjeok.mjs";
import "../../channel-outbound-BbIm36V0.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import "../../json-schema-runtime-DwjLDY1j.mjs";
import { t as CHANNEL_INGRESS_RETENTION_DEFAULTS } from "../../ingress-monitor-CExnLcCo.mjs";
import "../../secure-random-runtime-Bakpn5OF.mjs";
import "../../ssrf-runtime-z2wN0VZP.mjs";
import { a as createWebhookInFlightLimiter } from "../../webhook-request-guards-BYZUECo_.mjs";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
//#region extensions/mcp-events/src/protocol.ts
/** OpenAI's webhook profile, not the experimental polling/streaming extensions. */
const MCP_EVENTS_PROFILE = "openai-webhook-2026-07-28";
const MAX_EVENT_BYTES = 262144;
const CALLBACK_PREFIX = "/plugins/mcp-events/callback/";
const MAX_CLOCK_SKEW_MS = 3e5;
var CallbackError = class extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
function record(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function boundedString(value, maxBytes = 1024) {
	return typeof value === "string" && value.length > 0 && Buffer.byteLength(value) <= maxBytes;
}
function isoTimestamp(value) {
	return typeof value === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/u.test(value) && Number.isFinite(Date.parse(value));
}
/** Canonical JSON gives subscribe and unsubscribe the same filter identity. */
function canonicalArguments(value) {
	const visit = (input, depth) => {
		if (depth > 64) throw new Error("MCP event arguments exceed the nesting limit");
		if (input === null || typeof input === "string" || typeof input === "boolean" || typeof input === "number" && Number.isFinite(input)) return JSON.stringify(input);
		if (Array.isArray(input)) return "[" + input.map((entry) => visit(entry, depth + 1)).join(",") + "]";
		const object = record(input);
		if (!object) throw new Error("MCP event arguments must be JSON");
		return "{" + Object.keys(object).toSorted().map((key) => JSON.stringify(key) + ":" + visit(object[key], depth + 1)).join(",") + "}";
	};
	const result = visit(value, 0);
	if (Buffer.byteLength(result) > 32768) throw new Error("MCP event arguments exceed 32 KiB");
	return result;
}
function identityHash(parts) {
	return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}
function createSigningSecret() {
	return generateSecureToken({
		bytes: 32,
		redact: true,
		encoding: "base64",
		prefix: "whsec_"
	});
}
function decodeBase64(value) {
	if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) return;
	return Buffer.from(value, "base64");
}
/** Authenticate bytes before parsing; the subscription-id header is deliberately unused. */
function verifyWebhook(params) {
	const id = params.headers["webhook-id"];
	const timestamp = params.headers["webhook-timestamp"];
	const signatures = params.headers["webhook-signature"];
	if (!boundedString(id) || typeof timestamp !== "string" || !/^\d{1,12}$/u.test(timestamp) || typeof signatures !== "string" || signatures.length > 4096 || Math.abs(params.now - Number(timestamp) * 1e3) > MAX_CLOCK_SKEW_MS) throw new CallbackError(401, "Invalid webhook authentication");
	const candidates = signatures.split(/\s+/u).flatMap((signature) => {
		if (!signature.startsWith("v1,")) return [];
		const decoded = decodeBase64(signature.slice(3));
		return decoded?.length === 32 ? [decoded] : [];
	});
	let matched = false;
	for (const secret of params.secrets) {
		const key = secret.startsWith("whsec_") ? decodeBase64(secret.slice(6)) : void 0;
		if (!key || key.length < 24 || key.length > 64) continue;
		const expected = createHmac("sha256", key).update(id + "." + timestamp + ".").update(params.body).digest();
		for (const candidate of candidates) matched = timingSafeEqual(expected, candidate) || matched;
	}
	if (!matched) throw new CallbackError(401, "Invalid webhook authentication");
	return id;
}
function parseCallback(body, webhookId, definition) {
	if (body.length > 262144) throw new CallbackError(413, "Event exceeds 256 KiB");
	let value;
	try {
		value = record(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)));
	} catch {
		throw new CallbackError(400, "Invalid event JSON");
	}
	if (!value) throw new CallbackError(400, "Expected one event object");
	if (Object.hasOwn(value, "type")) {
		if (value.type !== "verification" || !boundedString(value.challenge, 4096)) throw new CallbackError(400, "Unsupported control notification");
		return {
			kind: "verification",
			challenge: value.challenge
		};
	}
	const data = record(value.data);
	if (!boundedString(value.eventId) || value.eventId !== webhookId || value.name !== definition.name || !isoTimestamp(value.timestamp) || !data || !(value.cursor === null || boundedString(value.cursor, 16384))) throw new CallbackError(400, "Invalid event envelope");
	if (!validateJsonSchemaValue({
		schema: definition.payloadSchema,
		value: data
	}).ok) throw new CallbackError(400, "Event data does not match payloadSchema");
	return {
		kind: "event",
		event: {
			eventId: value.eventId,
			name: definition.name,
			timestamp: value.timestamp,
			data,
			cursor: value.cursor
		}
	};
}
function parseSubscriptionResult(value, now) {
	const result = record(value);
	if (!result || !boundedString(result.id) || !isoTimestamp(result.refreshBefore) || Date.parse(result.refreshBefore) <= now || !(result.cursor === null || boundedString(result.cursor, 16384)) || typeof result.truncated !== "boolean") throw new Error("Invalid MCP subscription response (a finite future refreshBefore is required)");
	return {
		id: result.id,
		refreshBefore: Date.parse(result.refreshBefore),
		cursor: result.cursor,
		truncated: result.truncated
	};
}
function parseEventCatalog(value) {
	const result = record(value);
	if (!result || !Array.isArray(result.events) || result.events.length > 1e3 || result.nextCursor !== void 0 && !boundedString(result.nextCursor, 16384)) throw new Error("Invalid MCP event catalog");
	const events = [];
	for (const input of result.events) {
		const event = record(input);
		if (!event || !boundedString(event.name, 256) || !Array.isArray(event.delivery) || !(typeof event.inputSchema === "boolean" || record(event.inputSchema)) || !(typeof event.payloadSchema === "boolean" || record(event.payloadSchema))) throw new Error("Invalid MCP event definition");
		if (!event.delivery.includes("webhook")) continue;
		const inputSchema = typeof event.inputSchema === "boolean" ? event.inputSchema : record(event.inputSchema);
		const payloadSchema = typeof event.payloadSchema === "boolean" ? event.payloadSchema : record(event.payloadSchema);
		validateJsonSchemaValue({
			schema: inputSchema,
			value: {}
		});
		validateJsonSchemaValue({
			schema: payloadSchema,
			value: {}
		});
		events.push({
			name: event.name,
			inputSchema,
			payloadSchema,
			...typeof event.description === "string" ? { description: event.description.slice(0, 4096) } : {}
		});
	}
	return {
		events,
		...typeof result.nextCursor === "string" ? { nextCursor: result.nextCursor } : {}
	};
}
//#endregion
//#region extensions/mcp-events/src/config.ts
function resolveMcpEventsConfig(value) {
	const config = record(value);
	if (!config || typeof config.callbackOrigin !== "string") throw new Error("Configure mcp-events.callbackOrigin with a public HTTPS origin; expose only the callback route through your reverse proxy");
	let url;
	try {
		url = new URL(config.callbackOrigin);
	} catch {
		throw new Error("MCP Events callbackOrigin must be a public HTTPS origin");
	}
	if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("MCP Events callbackOrigin must be a public HTTPS origin without credentials, path, query, or fragment");
	const maxPendingEvents = config.maxPendingEvents ?? 1e4;
	if (typeof maxPendingEvents !== "number" || !Number.isSafeInteger(maxPendingEvents) || maxPendingEvents < 1 || maxPendingEvents > 1e5) throw new Error("MCP Events maxPendingEvents must be an integer from 1 to 100000");
	return {
		callbackOrigin: url.origin,
		maxPendingEvents
	};
}
/** DNS/public-address preflight is not a reachability claim or permission to expose the Gateway. */
async function preflightCallbackOrigin(origin, signal) {
	const url = new URL(origin);
	if (url.protocol !== "https:" || url.username || url.password) throw new Error("MCP Events requires a public HTTPS callback");
	await resolvePinnedHostnameWithPolicy(url.hostname, { signal });
}
function resolveMcpEventSourceOptions(options) {
	const { server: serverName, name, arguments: input = {} } = options;
	const args = record(input);
	if (typeof serverName !== "string" || !serverName.trim() || serverName.length > 256 || typeof name !== "string" || !name.trim() || name.length > 256 || !args) throw new Error("MCP event source options require server, name, and object arguments");
	const canonical = record(JSON.parse(canonicalArguments(args)));
	if (!canonical) throw new Error("MCP event arguments must remain a JSON object");
	return {
		serverName,
		name,
		arguments: canonical
	};
}
//#endregion
//#region extensions/mcp-events/src/http.ts
function createCallbackHandler(getService) {
	const limiter = createWebhookInFlightLimiter({
		maxInFlightPerKey: 32,
		maxTrackedKeys: 1
	});
	return async (req, res) => {
		const pathname = new URL(req.url ?? "/", "http://callback.invalid").pathname;
		if (!pathname.startsWith("/plugins/mcp-events/callback/")) return false;
		const id = pathname.slice(29);
		if (!/^[a-f0-9-]{36}$/u.test(id)) {
			await sendHttpRequestRejection(req, res, 404, "Unknown callback");
			return true;
		}
		if (req.method !== "POST") {
			res.setHeader("Allow", "POST");
			await sendHttpRequestRejection(req, res, 405, "POST required");
			return true;
		}
		if (!/^application\/json(?:\s*;|$)/iu.test(req.headers["content-type"] ?? "") || req.headers["content-encoding"] && req.headers["content-encoding"] !== "identity") {
			await sendHttpRequestRejection(req, res, 415, "Uncompressed application/json required");
			return true;
		}
		const service = getService();
		if (!service || !limiter.tryAcquire("callbacks")) {
			res.setHeader("Retry-After", "5");
			await sendHttpRequestRejection(req, res, 503, "Callback unavailable; retry later");
			return true;
		}
		try {
			const raw = await readRequestBodyWithLimit(req, {
				maxBytes: MAX_EVENT_BYTES,
				timeoutMs: 5e3,
				encoding: "base64",
				destroyOnLimit: false
			});
			const result = await service.receive(id, req.headers, Buffer.from(raw, "base64"));
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.setHeader("Cache-Control", "no-store");
			res.end(JSON.stringify(result));
		} catch (error) {
			const status = error instanceof CallbackError ? error.status : isRequestBodyLimitError(error) ? error.statusCode : 503;
			if (status === 503) res.setHeader("Retry-After", "5");
			await sendHttpRequestRejection(req, res, status, error instanceof CallbackError ? error.message : status === 413 ? "Event exceeds 256 KiB" : "Callback unavailable; retry later");
		} finally {
			limiter.release("callbacks");
		}
		return true;
	};
}
//#endregion
//#region extensions/mcp-events/src/source-authority.ts
var SourceRevokedError = class extends Error {};
function isAuthorityUnavailable(error) {
	return record(error)?.code === "MCP_AUTHORIZATION_UNAVAILABLE";
}
function isAuthorityRetired(error) {
	return record(error)?.code === "MCP_AUTHORIZATION_RETIRED";
}
/** Holds no credential state: observations and lifetime identity belong to native credential owners. */
var McpEventsSourceAuthority = class {
	constructor(prepareSource, assertService) {
		this.prepareSource = prepareSource;
		this.assertService = assertService;
	}
	guard(binding) {
		const source = binding.source;
		return () => {
			this.assertService();
			if (!binding.live || binding.facts.status === "revoked" || !source) throw new SourceRevokedError("MCP event source revoked");
			try {
				source.assertCurrent();
			} catch (error) {
				if (isAuthorityRetired(error)) throw new SourceRevokedError("MCP authorization retired", { cause: error });
				throw error;
			}
		};
	}
	async refresh(binding) {
		this.assertService();
		if (!binding.live) throw new SourceRevokedError("MCP event source revoked");
		let prepared;
		try {
			if (!binding.source) {
				prepared = await this.prepareSource(binding.facts);
				if (prepared.accountId !== binding.facts.accountId || prepared.principalId !== binding.facts.principalId) throw new SourceRevokedError("MCP event authorization changed");
				this.assertService();
				if (!binding.live) throw new SourceRevokedError("MCP event source revoked");
				prepared.assertCurrent();
				binding.source ??= prepared;
			}
			await binding.source.revalidate();
			this.guard(binding)();
		} catch (error) {
			if (isAuthorityUnavailable(error)) throw error;
			throw new SourceRevokedError("MCP event source is no longer authorized", { cause: error });
		} finally {
			if (prepared !== binding.source) prepared?.dispose();
		}
	}
};
//#endregion
//#region extensions/mcp-events/src/ingress.ts
const DRAIN_RETRY_MS = 1e3;
/** Adapts authenticated callbacks to the existing account queue and Cron admission owners. */
var McpEventsIngress = class {
	constructor(deps, openQueue, owner) {
		this.deps = deps;
		this.openQueue = openQueue;
		this.owner = owner;
		this.accounts = /* @__PURE__ */ new Map();
		this.drainRetryMs = DRAIN_RETRY_MS;
	}
	get now() {
		return this.deps.scheduler.now();
	}
	async stop() {
		for (const account of this.accounts.values()) {
			await account.admission;
			await account.drain.waitForIdle();
			account.drain.dispose();
		}
	}
	account(accountId) {
		const existing = this.accounts.get(accountId);
		if (existing) return existing;
		const queue = this.openQueue(accountId);
		if (!queue.listUnsettled || !queue.enqueueAuthorized) throw new Error("MCP Events requires coherent durable ingress inspection; update OpenClaw");
		const account = {
			queue,
			drain: this.deps.runtime.state.openChannelIngressDrain({
				queue,
				abortSignal: this.owner.signal,
				now: () => this.now,
				deriveLaneKey: (event) => event.payload.jobId,
				startLimit: 8,
				formatError: () => "MCP event admission failed; inspect source and automation diagnostics",
				onLog: (message) => this.deps.logger.warn(message),
				resolveNonRetryableFailure: (error) => error instanceof SourceRevokedError ? {
					reason: "source_revoked",
					message: "The authored event source was removed, paused, or replaced"
				} : null,
				dispatchClaimedEvent: async (claim) => {
					const binding = this.owner.binding(claim.payload.payload.bindingId);
					if (!binding?.live) throw new SourceRevokedError("MCP event source revoked");
					try {
						await this.owner.refreshAuthority(binding);
						const assertCurrent = this.owner.guard(binding);
						assertCurrent();
						const { jobId, ...input } = claim.payload;
						const result = await this.deps.cron.runEvent(jobId, {
							...input,
							claim: {
								queueName: claim.queueName,
								id: claim.id,
								token: claim.claim.token
							},
							assertCurrent
						});
						if (result.kind === "invalidated") throw new SourceRevokedError("MCP event source changed");
						if (result.kind === "pending") return { kind: "pending" };
						return { kind: "transferred" };
					} catch (error) {
						if (isAuthorityUnavailable(error)) return { kind: "pending" };
						if (error instanceof SourceRevokedError) await this.owner.revoke(binding);
						throw error;
					}
				}
			}),
			admission: Promise.resolve()
		};
		this.accounts.set(accountId, account);
		return account;
	}
	/** Hooks and durable enqueue wake the existing host scheduler; empty queues have no timer. */
	requestDrain(jobId) {
		if (this.owner.isStopped() || jobId && !this.owner.hasJob(jobId)) return;
		this.drainRetryMs = DRAIN_RETRY_MS;
		this.owner.schedule("drain", this.now, () => this.drain(), true);
	}
	drain() {
		if (this.drainWork) return this.drainWork;
		const operation = (async () => {
			let backlog = false;
			try {
				for (const account of this.accounts.values()) {
					this.owner.assertService();
					await account.drain.recoverStaleClaims();
					await account.drain.drainOnce();
					await account.drain.waitForIdle();
					if (account.lastPrunedAt === void 0 || this.now - account.lastPrunedAt >= CHANNEL_INGRESS_RETENTION_DEFAULTS.pruneIntervalMs) {
						const { pruneIntervalMs: _interval, ...retention } = CHANNEL_INGRESS_RETENTION_DEFAULTS;
						await account.queue.prune({
							...retention,
							now: this.now
						});
						account.lastPrunedAt = this.now;
					}
					const unsettled = await account.queue.listUnsettled();
					backlog ||= unsettled.pending.length > 0 || unsettled.claims.length > 0;
				}
			} catch {
				backlog = true;
				this.deps.logger.warn("mcp-events: ingress inspection/admission unavailable; retained work will retry");
			} finally {
				if (backlog && !this.owner.isStopped()) {
					this.owner.schedule("drain", this.now + this.drainRetryMs, () => this.drain(), true);
					this.drainRetryMs = Math.min(3e4, this.drainRetryMs * 2);
				}
			}
		})();
		this.drainWork = operation;
		operation.finally(() => {
			this.drainWork = void 0;
		}).catch(() => {});
		return this.owner.track(operation);
	}
	/** Called only after bounded raw-body admission by the registered HTTP route. */
	async receive(bindingId, headers, body) {
		this.owner.assertService();
		const binding = this.owner.binding(bindingId);
		if (!binding?.live) throw new CallbackError(410, "Subscription is no longer active");
		try {
			await this.owner.refreshAuthority(binding);
		} catch (error) {
			if (isAuthorityUnavailable(error)) throw new CallbackError(503, "Subscription authority is temporarily unavailable");
			await this.owner.revoke(binding);
			throw new CallbackError(410, "Subscription source is no longer authorized");
		}
		const guard = this.owner.guard(binding);
		guard();
		const parsed = parseCallback(body, verifyWebhook({
			headers,
			body,
			secrets: [
				binding.facts.secret,
				...binding.facts.pendingSecret ? [binding.facts.pendingSecret] : [],
				...binding.facts.previousSecret && binding.facts.previousSecret.until > this.now ? [binding.facts.previousSecret.value] : []
			],
			now: this.now
		}), binding.facts.definition);
		if (parsed.kind === "verification") {
			guard();
			return { challenge: parsed.challenge };
		}
		if (binding.facts.status !== "active") throw new CallbackError(503, "Subscription activation is pending");
		if (!binding.facts.refreshBefore || binding.facts.refreshBefore <= this.now) {
			if (binding.pending || binding.facts.pendingSecret) throw new CallbackError(503, "Subscription renewal is pending");
			throw new CallbackError(410, "Subscription expired");
		}
		const account = this.account(binding.facts.accountId);
		const admission = account.admission.then(async () => {
			guard();
			const id = identityHash([
				binding.facts.accountId,
				bindingId,
				parsed.event.eventId
			]);
			const unsettled = await account.queue.listUnsettled();
			guard();
			if (!(unsettled.pending.some((row) => row.id === id) || unsettled.claims.some((row) => row.id === id)) && unsettled.pending.length + unsettled.claims.length >= this.deps.config.maxPendingEvents) throw new CallbackError(503, "Event queue is full; retry later");
			const result = await account.queue.enqueueAuthorized(id, {
				jobId: binding.facts.jobId,
				sourceIdentity: binding.facts.sourceIdentity,
				eventId: parsed.event.eventId,
				receivedAtMs: this.now,
				payload: {
					profile: MCP_EVENTS_PROFILE,
					bindingId,
					event: parsed.event
				}
			}, {
				laneKey: binding.facts.jobId,
				receivedAt: this.now,
				assertCurrent: guard
			});
			guard();
			if (result.kind === "failed") throw new CallbackError(503, "Event is retained for recovery; inspect ingress diagnostics");
			if (result.kind === "accepted" || result.kind === "pending" || result.kind === "claimed") await this.owner.persistCursor(binding, result.record.payload.payload.event.cursor);
			guard();
		});
		account.admission = admission.catch(() => {});
		try {
			await this.owner.track(admission);
		} finally {
			this.requestDrain();
		}
		return {};
	}
};
//#endregion
//#region extensions/mcp-events/src/state.ts
function createMcpEventsState(runtime) {
	const bindings = runtime.state.openKeyedStore({
		namespace: "subscriptions-v1",
		maxEntries: 4096,
		overflowPolicy: "reject-new"
	});
	if (!bindings.withCurrent) throw new Error("MCP Events requires current-authority plugin state writes; update OpenClaw");
	return {
		bindings,
		withCurrent: bindings.withCurrent.bind(bindings),
		openQueue: (accountId) => runtime.state.openChannelIngressQueue({ accountId })
	};
}
//#endregion
//#region extensions/mcp-events/src/service.ts
const REQUEST_TTL_MS = 36e5;
const ROTATION_WINDOW_MS = 3e5;
const MAX_CLEANUP_RETRIES = 8;
var McpEventsService = class {
	constructor(deps) {
		this.deps = deps;
		this.bindings = /* @__PURE__ */ new Map();
		this.controller = new AbortController();
		this.scheduled = /* @__PURE__ */ new Map();
		this.work = /* @__PURE__ */ new Set();
		this.stopped = false;
		this.initialization = "restoring";
		this.reconcileRequested = false;
		this.unavailable = /* @__PURE__ */ new Map();
		this.assertService = () => {
			if (this.stopped || this.signal.aborted) throw new SourceRevokedError("MCP Events service stopped");
		};
		this.state = createMcpEventsState(deps.runtime);
		this.authority = new McpEventsSourceAuthority(deps.prepareSource, this.assertService);
		this.signal = AbortSignal.any([this.controller.signal, deps.scheduler.signal]);
		this.ingress = new McpEventsIngress(deps, this.state.openQueue, {
			signal: this.signal,
			assertService: this.assertService,
			isStopped: () => this.stopped,
			binding: (id) => this.bindings.get(id),
			hasJob: (jobId) => [...this.bindings.values()].some((binding) => binding.facts.jobId === jobId),
			refreshAuthority: (binding) => this.authority.refresh(binding),
			guard: (binding) => this.authority.guard(binding),
			revoke: (binding) => this.revoke(binding, "source_unavailable"),
			persistCursor: (binding, cursor) => this.mutate(binding, (facts) => ({
				...facts,
				cursor,
				cursorRevision: facts.cursorRevision + 1,
				updatedAt: this.now
			})),
			track: (promise) => this.track(promise),
			schedule: (id, atMs, run, earliest) => this.schedule(id, atMs, run, earliest)
		});
	}
	get now() {
		return this.deps.scheduler.now();
	}
	track(promise) {
		this.work.add(promise);
		promise.finally(() => this.work.delete(promise)).catch(() => {});
		return promise;
	}
	schedule(id, atMs, run, earliest = false) {
		if (this.stopped || this.signal.aborted) return;
		this.scheduled.set(id, this.deps.scheduler.schedule({
			id,
			atMs,
			mode: earliest ? "earliest" : "replace",
			run: async () => {
				this.scheduled.delete(id);
				await this.track(run());
			}
		}));
	}
	cancelScheduled(id) {
		this.scheduled.get(id)?.cancel();
		this.scheduled.delete(id);
	}
	/** Serializes facts, not network calls: callbacks can verify during subscribe. */
	mutate(binding, update, assertCurrent = this.authority.guard(binding)) {
		const write = binding.writes.then(async () => {
			assertCurrent();
			const next = update(binding.facts);
			for (const field of [
				"remoteId",
				"refreshBefore",
				"previousSecret",
				"pendingSecret",
				"lastError",
				"retiredAt"
			]) if (next[field] === void 0) delete next[field];
			await this.state.withCurrent({ assertCurrent }).register(next.bindingId, next);
			binding.facts = next;
		});
		binding.writes = write.catch(() => {});
		return write;
	}
	async start() {
		await preflightCallbackOrigin(this.deps.config.callbackOrigin, this.signal);
		this.assertService();
		for (const { value: facts } of await this.state.bindings.entries()) {
			if (facts.status === "revoked" && !facts.cleanupPending) {
				await this.state.withCurrent({ assertCurrent: this.assertService }).delete(facts.bindingId);
				continue;
			}
			this.bindings.set(facts.bindingId, {
				facts,
				live: facts.status !== "revoked",
				writes: Promise.resolve()
			});
			this.ingress.account(facts.accountId);
		}
		this.initialization = "reconciling";
		await this.reconcile();
		this.requestDrain();
	}
	async stop() {
		this.stopped = true;
		this.controller.abort();
		for (const job of this.scheduled.values()) job.cancel();
		this.scheduled.clear();
		for (const binding of this.bindings.values()) binding.live = false;
		await Promise.allSettled(this.work);
		await Promise.all([...this.bindings.values()].map((binding) => binding.writes));
		await this.ingress.stop();
		for (const binding of this.bindings.values()) binding.source?.dispose();
	}
	requestDrain(jobId) {
		this.ingress.requestDrain(jobId);
	}
	requestReconcile() {
		if (this.stopped) return;
		if (this.initialization === "restoring" || this.reconcileWork) {
			this.reconcileRequested = true;
			return;
		}
		this.schedule("reconcile", this.now, () => this.reconcile(), true);
	}
	reconcile() {
		if (this.initialization === "restoring") return Promise.reject(/* @__PURE__ */ new Error("MCP Events subscription state is still restoring"));
		if (this.reconcileWork) return this.reconcileWork;
		const run = this.reconcileSources();
		this.reconcileWork = run;
		run.finally(() => {
			this.reconcileWork = void 0;
			if (this.reconcileRequested) {
				this.reconcileRequested = false;
				this.requestReconcile();
			}
		}).catch(() => {});
		return this.track(run);
	}
	async reconcileSources() {
		const sources = await this.deps.cron.readEventSources();
		this.assertService();
		this.initialization = "ready";
		const desired = new Map(sources.filter((source) => source.enabled).map((source) => [source.jobId, source]));
		for (const binding of this.bindings.values()) {
			const source = desired.get(binding.facts.jobId);
			if (!source || source.sourceIdentity !== binding.facts.sourceIdentity || !binding.facts.callbackUrl.startsWith(this.deps.config.callbackOrigin + "/plugins/mcp-events/callback/")) await this.revoke(binding);
		}
		for (const [jobId, failed] of this.unavailable) if (desired.get(jobId)?.sourceIdentity !== failed.source.sourceIdentity) {
			this.unavailable.delete(jobId);
			this.cancelScheduled("source:" + jobId);
		}
		const started = [];
		for (const source of desired.values()) {
			this.assertService();
			let binding = [...this.bindings.values()].find((entry) => entry.live && entry.facts.jobId === source.jobId && entry.facts.sourceIdentity === source.sourceIdentity);
			try {
				if (!binding) binding = await this.createBinding(source);
				else await this.authority.refresh(binding);
				this.unavailable.delete(source.jobId);
				if (binding.pending) continue;
				if (binding.facts.nextAttemptAt <= this.now) started.push(this.begin(binding, this.refresh.bind(this, binding)));
				else this.armRefresh(binding);
			} catch (error) {
				if (binding && !isAuthorityUnavailable(error)) await this.revoke(binding, "source_unavailable");
				this.retrySource(source);
			}
		}
		await Promise.allSettled(started);
		this.requestDrain();
		for (const binding of this.bindings.values()) if (!binding.live && binding.facts.cleanupPending && binding.facts.nextAttemptAt <= this.now && !binding.pending) await this.beginCleanup(binding);
		else if (!binding.live) this.armCleanup(binding);
	}
	retrySource(source) {
		const previous = this.unavailable.get(source.jobId);
		const attempts = previous?.source.sourceIdentity === source.sourceIdentity ? previous.attempts + 1 : 1;
		this.unavailable.set(source.jobId, {
			source,
			attempts
		});
		this.deps.logger.warn("mcp-events: source unavailable; check MCP account, event filters, and callback reachability");
		this.schedule("source:" + source.jobId, this.now + Math.min(3e5, 1e3 * 2 ** Math.min(attempts, 9)), async () => {
			if (this.unavailable.get(source.jobId)?.source !== source) return;
			try {
				await this.reconcile();
			} catch {
				if (!this.stopped) this.retrySource(source);
			}
		});
	}
	armRefresh(binding, atMs = binding.facts.nextAttemptAt) {
		this.schedule("refresh:" + binding.facts.bindingId, atMs, async () => {
			if (binding.live && !binding.pending) await this.begin(binding, this.refresh.bind(this, binding));
		});
	}
	async createBinding(snapshot) {
		const options = resolveMcpEventSourceOptions(snapshot.options);
		const source = await this.deps.prepareSource({
			...snapshot,
			serverName: options.serverName
		});
		try {
			const discovered = record(await source.request("server/discover", {}, this.signal));
			source.assertCurrent();
			const capabilities = record(discovered?.capabilities);
			if (!discovered || !Array.isArray(discovered.supportedVersions) || !discovered.supportedVersions.includes("2026-07-28") || !capabilities || !Object.hasOwn(capabilities, "events")) throw new Error("Configured MCP server does not advertise MCP 2.0 events");
			let cursor;
			const seen = /* @__PURE__ */ new Set();
			let definition;
			for (let page = 0; page < 100; page++) {
				const catalog = parseEventCatalog(await source.request("events/list", cursor ? { cursor } : {}, this.signal));
				source.assertCurrent();
				definition = catalog.events.find((event) => event.name === options.name);
				if (definition || !catalog.nextCursor) break;
				if (seen.has(catalog.nextCursor)) throw new Error("MCP event catalog cursor repeated");
				seen.add(catalog.nextCursor);
				cursor = catalog.nextCursor;
			}
			if (!definition || !validateJsonSchemaValue({
				schema: definition.inputSchema,
				value: options.arguments
			}).ok) throw new Error("MCP event or subscription arguments are unavailable");
			this.assertService();
			source.assertCurrent();
			const bindingId = randomUUID();
			const facts = {
				version: 1,
				bindingId,
				jobId: snapshot.jobId,
				sourceIdentity: snapshot.sourceIdentity,
				serverName: options.serverName,
				accountId: source.accountId,
				principalId: source.principalId,
				arguments: options.arguments,
				definition,
				callbackUrl: this.deps.config.callbackOrigin + CALLBACK_PREFIX + bindingId,
				secret: createSigningSecret(),
				status: "pending",
				cursor: null,
				cursorRevision: 0,
				truncated: false,
				nextAttemptAt: this.now,
				failures: 0,
				cleanupPending: false,
				updatedAt: this.now
			};
			const binding = {
				facts,
				source,
				live: true,
				writes: Promise.resolve()
			};
			await this.state.withCurrent({ assertCurrent: this.authority.guard(binding) }).register(bindingId, facts);
			this.authority.guard(binding)();
			this.bindings.set(bindingId, binding);
			this.ingress.account(facts.accountId);
			return binding;
		} catch (error) {
			source.dispose();
			throw error;
		}
	}
	begin(binding, run) {
		if (binding.pending) return binding.pending;
		const pending = run();
		binding.pending = pending;
		this.track(pending).catch(() => this.deps.logger.warn("mcp-events: subscription state unavailable; retry remains pending"));
		pending.finally(() => {
			binding.pending = void 0;
		}).catch(() => {});
		return pending;
	}
	async refresh(binding) {
		let retryAt;
		try {
			await this.authority.refresh(binding);
			const source = binding.source;
			const guard = this.authority.guard(binding);
			if (binding.facts.status === "active" && !binding.facts.pendingSecret) await this.mutate(binding, (facts) => ({
				...facts,
				pendingSecret: createSigningSecret(),
				updatedAt: this.now
			}));
			const secret = binding.facts.pendingSecret ?? binding.facts.secret;
			const cursorRevision = binding.facts.cursorRevision;
			guard();
			const response = await source.request("events/subscribe", {
				name: binding.facts.definition.name,
				arguments: binding.facts.arguments,
				delivery: {
					mode: "webhook",
					url: binding.facts.callbackUrl,
					secret
				},
				cursor: binding.facts.cursor,
				ttlMs: REQUEST_TTL_MS
			}, this.signal);
			guard();
			const result = parseSubscriptionResult(response, this.now);
			await this.mutate(binding, (facts) => ({
				...facts,
				status: "active",
				remoteId: result.id,
				refreshBefore: result.refreshBefore,
				secret,
				pendingSecret: void 0,
				previousSecret: facts.secret !== secret ? {
					value: facts.secret,
					until: this.now + ROTATION_WINDOW_MS
				} : facts.previousSecret,
				cursor: facts.cursorRevision === cursorRevision ? result.cursor : facts.cursor,
				truncated: facts.truncated || result.truncated,
				failures: 0,
				lastError: void 0,
				nextAttemptAt: this.now + Math.max(1, Math.floor((result.refreshBefore - this.now) * .8)),
				updatedAt: this.now
			}));
		} catch (error) {
			if (!binding.live || this.stopped) return;
			if (error instanceof SourceRevokedError) {
				await this.revoke(binding, "source_unavailable");
				return;
			}
			try {
				this.authority.guard(binding)();
			} catch (guardError) {
				if (!isAuthorityUnavailable(guardError)) {
					await this.revoke(binding, "source_unavailable");
					return;
				}
			}
			const assertBindingCurrent = () => {
				this.assertService();
				if (!binding.live || this.bindings.get(binding.facts.bindingId) !== binding) throw new SourceRevokedError("MCP event binding retired");
			};
			const nextAttemptAt = this.now + Math.min(3e5, 1e3 * 2 ** Math.min(binding.facts.failures, 8));
			retryAt = nextAttemptAt;
			await this.mutate(binding, (facts) => ({
				...facts,
				failures: facts.failures + 1,
				lastError: "subscribe_failed",
				nextAttemptAt,
				updatedAt: this.now
			}), assertBindingCurrent);
		} finally {
			if (binding.live) this.armRefresh(binding, retryAt);
		}
	}
	async revoke(binding, reason) {
		if (!binding.live && binding.facts.status === "revoked") {
			this.armCleanup(binding);
			return;
		}
		binding.live = false;
		this.cancelScheduled("refresh:" + binding.facts.bindingId);
		let retryAt = this.now;
		try {
			await this.mutate(binding, (facts) => ({
				...facts,
				status: "revoked",
				cleanupPending: true,
				retiredAt: this.now,
				failures: 0,
				lastError: reason,
				nextAttemptAt: this.now,
				updatedAt: this.now
			}), this.assertService);
		} catch (error) {
			retryAt = this.now + 1e3;
			throw error;
		} finally {
			this.armCleanup(binding, retryAt);
			if (reason === "source_unavailable") this.requestReconcile();
		}
	}
	async forgetBinding(binding) {
		const assertCurrent = () => {
			this.assertService();
			if (binding.live || this.bindings.get(binding.facts.bindingId) !== binding) throw new SourceRevokedError("Subscription cleanup owner changed");
		};
		await this.state.withCurrent({ assertCurrent }).delete(binding.facts.bindingId);
		this.cancelScheduled("cleanup:" + binding.facts.bindingId);
		binding.source?.dispose();
		binding.source = void 0;
		this.bindings.delete(binding.facts.bindingId);
	}
	cleanupExpiry(binding) {
		return binding.facts.refreshBefore ?? (binding.facts.retiredAt ?? binding.facts.updatedAt) + REQUEST_TTL_MS + ROTATION_WINDOW_MS;
	}
	armCleanup(binding, retryAt = this.now) {
		if (binding.live || this.bindings.get(binding.facts.bindingId) !== binding) return;
		const deadline = binding.facts.status === "revoked" && binding.facts.cleanupPending && binding.facts.failures >= MAX_CLEANUP_RETRIES ? this.cleanupExpiry(binding) : binding.facts.status === "revoked" ? binding.facts.nextAttemptAt : this.now;
		this.schedule("cleanup:" + binding.facts.bindingId, Math.max(retryAt, deadline), async () => {
			await binding.pending?.catch(() => {});
			if (!this.stopped && !binding.live && this.bindings.get(binding.facts.bindingId) === binding) await this.beginCleanup(binding);
		});
	}
	beginCleanup(binding) {
		return this.begin(binding, async () => {
			const retryAt = this.now + Math.min(3e5, 1e3 * 2 ** Math.min(binding.facts.failures, 8));
			try {
				if (binding.facts.status !== "revoked") await this.revoke(binding);
				if (!binding.facts.cleanupPending || binding.facts.failures >= MAX_CLEANUP_RETRIES) {
					if (!binding.facts.cleanupPending || this.now >= this.cleanupExpiry(binding)) await this.forgetBinding(binding);
					return;
				}
				if (!binding.source) throw new Error("Original account authority unavailable after restart");
				await binding.source.unsubscribe(this.signal);
				await this.mutate(binding, (facts) => ({
					...facts,
					cleanupPending: false,
					lastError: void 0,
					updatedAt: this.now
				}), this.assertService);
				await this.forgetBinding(binding);
			} catch {
				if (this.stopped) return;
				await this.mutate(binding, (facts) => ({
					...facts,
					lastError: "cleanup_failed",
					failures: facts.failures + 1,
					nextAttemptAt: retryAt,
					updatedAt: this.now
				}), this.assertService);
			} finally {
				this.armCleanup(binding, retryAt);
			}
		});
	}
	receive(bindingId, headers, body) {
		if (this.initialization !== "ready") throw new CallbackError(503, "Subscription state is loading; retry later");
		return this.ingress.receive(bindingId, headers, body);
	}
	diagnostics() {
		return [...[...this.bindings.values()].map(({ facts, live }) => ({
			bindingId: facts.bindingId,
			jobId: facts.jobId,
			sourceIdentity: facts.sourceIdentity,
			serverName: facts.serverName,
			name: facts.definition.name,
			profile: MCP_EVENTS_PROFILE,
			status: !live ? "revoked" : facts.refreshBefore && facts.refreshBefore <= this.now ? "expired" : facts.status,
			refreshBefore: facts.refreshBefore,
			replayAvailable: facts.cursor !== null,
			truncated: facts.truncated,
			failures: facts.failures,
			nextAttemptAt: facts.nextAttemptAt,
			cleanupPending: facts.cleanupPending,
			lastError: facts.lastError,
			updatedAt: facts.updatedAt
		})), ...[...this.unavailable.values()].map(({ source, attempts }) => ({
			jobId: source.jobId,
			sourceIdentity: source.sourceIdentity,
			serverName: typeof source.options.server === "string" ? source.options.server : void 0,
			name: typeof source.options.name === "string" ? source.options.name : void 0,
			profile: MCP_EVENTS_PROFILE,
			status: "unavailable",
			lastError: "source_unavailable",
			failures: attempts
		}))];
	}
};
//#endregion
//#region extensions/mcp-events/index.ts
function currentCron(context) {
	const cron = context.getCron?.();
	if (!cron?.readEventSources || !cron.runEvent) throw new Error("MCP Events requires Gateway event-driven automation admission");
	return {
		readEventSources: cron.readEventSources,
		runEvent: cron.runEvent
	};
}
var mcp_events_default = definePluginEntry({
	id: "mcp-events",
	name: "MCP Events",
	description: "Authenticated MCP webhook events for authored automations.",
	configSchema: { parse: resolveMcpEventsConfig },
	register(api) {
		api.registerTool({
			contextVersion: 2,
			create: (context) => ({
				name: "mcp_events",
				label: "MCP Events",
				description: "List webhook events and subscription argument schemas from a configured MCP server. Use the descriptors to create an Automation event source; this tool does not schedule or subscribe by itself. Pass nextCursor as cursor for another page.",
				parameters: {
					type: "object",
					properties: {
						serverName: {
							type: "string",
							minLength: 1,
							maxLength: 256
						},
						cursor: {
							type: "string",
							minLength: 1,
							maxLength: 16384
						}
					},
					required: ["serverName"],
					additionalProperties: false
				},
				execute: async (_id, input) => {
					context.assertInvocationCurrent();
					const params = record(input);
					if (!params || typeof params.serverName !== "string" || !params.serverName.trim() || params.cursor !== void 0 && typeof params.cursor !== "string") throw new Error("Expected a configured serverName and optional cursor");
					const result = await api.runtime.gateway.request("mcp.events.list", {
						agentId: context.agentId,
						serverName: params.serverName,
						...params.cursor !== void 0 ? { cursor: params.cursor } : {}
					});
					context.assertInvocationCurrent();
					return {
						content: [{
							type: "text",
							text: JSON.stringify(result)
						}],
						details: result
					};
				}
			})
		}, { names: ["mcp_events"] });
		if (api.registrationMode !== "full") return;
		let service;
		api.registerHttpRoute({
			path: CALLBACK_PREFIX,
			auth: "plugin",
			match: "prefix",
			handler: createCallbackHandler(() => service)
		});
		api.on("cron_changed", (event) => {
			if (event.action === "finished") service?.requestDrain(event.jobId);
			else if (event.action === "added" || event.action === "updated" || event.action === "removed") service?.requestReconcile();
		});
		api.on("cron_reconciled", () => {
			service?.requestReconcile();
		});
		api.registerGatewayMethod("mcp-events.status", ({ respond }) => {
			respond(true, {
				running: Boolean(service),
				profile: MCP_EVENTS_PROFILE,
				subscriptions: service?.diagnostics() ?? []
			});
		}, { scope: "operator.admin" });
		api.registerService({
			id: "mcp-events",
			apiVersion: 2,
			reload: { configPrefixes: ["plugins.entries.mcp-events", "mcp"] },
			async start(context) {
				const config = resolveMcpEventsConfig(context.config.plugins?.entries?.["mcp-events"]?.config);
				if (!context.mcpEvents?.prepareSource) throw new Error("MCP Events requires the Gateway's source authority and scheduler capabilities");
				currentCron(context);
				const active = new McpEventsService({
					runtime: api.runtime,
					config,
					scheduler: context.scheduler,
					prepareSource: context.mcpEvents.prepareSource,
					cron: {
						readEventSources: () => currentCron(context).readEventSources(),
						runEvent: (id, input) => currentCron(context).runEvent(id, input)
					},
					logger: context.logger
				});
				service = active;
				try {
					await active.start();
				} catch (error) {
					if (service === active) service = void 0;
					await active.stop();
					throw error;
				}
			},
			async stop() {
				const active = service;
				service = void 0;
				await active?.stop();
			}
		});
	}
});
//#endregion
export { mcp_events_default as default };
