import { n as __reExport, t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { C as parseDiscordRetryAfterBodySeconds } from "./allow-list-CkqpzPvP.mjs";
import { n as getDiscordEndpointRuntime } from "./endpoint-runtime-BM3x-m6O.mjs";
import { i as parseCustomId, n as BaseModalComponent, t as BaseMessageInteractiveComponent } from "./components.base-C5sAPHe4.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asOptionalObjectRecord, asRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ApplicationCommandOptionType, ApplicationCommandType, ComponentType, GatewayDispatchEvents, InteractionContextType, InteractionResponseType, InteractionType, MessageFlags, Routes, TextInputStyle } from "discord-api-types/v10";
import { asDateTimestampMs, clampTimerTimeoutMs, parseStrictNonNegativeInteger, resolveExpiresAtMsFromDurationMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { gunzipSync } from "node:zlib";
import { captureChannelReadAuthority, captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { redactIdentifier, redactSensitiveFieldValue } from "openclaw/plugin-sdk/logging-core";
import { parseRetryAfterHeaderSeconds } from "openclaw/plugin-sdk/retry-runtime";
import { Type } from "typebox";
import { Check } from "typebox/value";
import { createHash } from "node:crypto";
import { createPermitPool } from "openclaw/plugin-sdk/concurrency-runtime";
// extensions/discord/src/internal/undefined-fields.ts
function stripUndefinedFields(value) {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0));
}
// extensions/discord/src/internal/request-authority.ts
const requestAuthority = resolveGlobalSingleton(Symbol.for("openclaw.discord.requestAuthority"), () => new AsyncLocalStorage());
/** Carry the host's existing assertion without changing its lifetime or ownership. */
function withDiscordRequestAuthority(assertCurrent, run) {
	if (!assertCurrent) return run();
	const inherited = requestAuthority.getStore();
	return requestAuthority.run(inherited && inherited !== assertCurrent ? () => {
		inherited();
		assertCurrent();
	} : assertCurrent, run);
}
function captureDiscordRequestAuthority() {
	return requestAuthority.getStore();
}
// extensions/discord/src/internal/rest-body.ts
function fileBlob(file) {
	return file.data instanceof Blob ? file.data : new Blob([file.data], { type: typeof file.contentType === "string" ? file.contentType : void 0 });
}
function serializeRequestBody(data, headers) {
	if (data?.headers) for (const [key, value] of Object.entries(data.headers)) headers.set(key, value);
	if (data?.body == null) return;
	if (typeof data.body === "object") {
		const bodyObject = data.body;
		const topLevelFiles = Array.isArray(bodyObject.files) ? bodyObject.files : void 0;
		const nestedData = bodyObject.data && typeof bodyObject.data === "object" ? bodyObject.data : void 0;
		const nestedFiles = nestedData && Array.isArray(nestedData.files) ? nestedData.files : void 0;
		const files = topLevelFiles ?? nestedFiles;
		const filesContainer = topLevelFiles ? bodyObject : nestedFiles ? nestedData : void 0;
		if (files?.length && filesContainer) {
			if (data.multipartStyle === "form") {
				const formData = new FormData();
				for (const [key, value] of Object.entries(filesContainer)) {
					if (key === "files" || value === void 0 || value === null) continue;
					formData.append(key, typeof value === "string" ? value : JSON.stringify(value));
				}
				for (const file of files) {
					const item = file;
					const name = typeof item.name === "string" && item.name ? item.name : "file";
					formData.append(typeof item.fieldName === "string" && item.fieldName ? item.fieldName : "file", fileBlob(item), name);
				}
				return formData;
			}
			const payloadFilesContainer = { ...filesContainer };
			const payloadJson = topLevelFiles ? payloadFilesContainer : {
				...bodyObject,
				data: payloadFilesContainer
			};
			const formData = new FormData();
			const existingAttachments = Array.isArray(payloadFilesContainer.attachments) ? payloadFilesContainer.attachments : [];
			const uploaded = files.map((file, index) => {
				const item = file;
				const name = typeof item.name === "string" && item.name ? item.name : `file-${index}`;
				const id = existingAttachments.length + index;
				formData.append(`files[${id}]`, fileBlob(item), name);
				const attachment = {
					id,
					filename: name
				};
				if (typeof item.description === "string") attachment.description = item.description;
				if (typeof item.duration_secs === "number") attachment.duration_secs = item.duration_secs;
				if (typeof item.waveform === "string") attachment.waveform = item.waveform;
				return attachment;
			});
			payloadFilesContainer.attachments = [...existingAttachments, ...uploaded];
			delete payloadFilesContainer.files;
			formData.append("payload_json", JSON.stringify(payloadJson));
			return formData;
		}
	}
	headers.set("Content-Type", "application/json");
	return JSON.stringify(data.body);
}
// extensions/discord/src/internal/rest-errors.ts
const DISCORD_UNKNOWN_MESSAGE = 10008;
const DISCORD_UNKNOWN_VOICE_STATE = 10065;
const DISCORD_ERROR_BODY_MAX_DEPTH = 64;
const DISCORD_ERROR_BODY_MAX_NODES = 1e4;
const DISCORD_ERROR_BODY_MAX_DEPTH_MARKER = "[Discord error body redacted: maximum depth exceeded]";
const DISCORD_ERROR_BODY_MAX_NODES_MARKER = "[Discord error body redacted: node limit exceeded]";
const DISCORD_ERROR_BODY_PRIORITY_KEYS = /* @__PURE__ */ new Set([
	"message",
	"code",
	"retry_after",
	"global"
]);
const DISCORD_RATE_LIMIT_SCOPES = /* @__PURE__ */ new Set([
	"user",
	"global",
	"shared"
]);
function reserveRedactedKey(key, usedKeys, collisionCounts) {
	let count = (collisionCounts.get(key) ?? 0) + 1;
	let candidate = count === 1 ? key : `${key} [${count}]`;
	while (usedKeys.has(candidate)) {
		count += 1;
		candidate = `${key} [${count}]`;
	}
	collisionCounts.set(key, count);
	usedKeys.add(candidate);
	return candidate;
}
function redactDiscordErrorBody(body, fieldKey = "", sensitiveAncestorKey, state = {
	seen: /* @__PURE__ */ new WeakSet(),
	remainingNodes: DISCORD_ERROR_BODY_MAX_NODES
}, depth = 0) {
	if (state.remainingNodes <= 0) return DISCORD_ERROR_BODY_MAX_NODES_MARKER;
	state.remainingNodes -= 1;
	if (typeof body === "string") return redactSensitiveFieldValue(sensitiveAncestorKey ?? fieldKey, body);
	if (sensitiveAncestorKey && (typeof body === "number" || typeof body === "boolean" || typeof body === "bigint")) return redactSensitiveFieldValue(sensitiveAncestorKey, String(body));
	if (!body || typeof body !== "object") return body;
	if (depth >= DISCORD_ERROR_BODY_MAX_DEPTH) return DISCORD_ERROR_BODY_MAX_DEPTH_MARKER;
	if (state.seen.has(body)) return "[Circular]";
	state.seen.add(body);
	let redacted;
	if (Array.isArray(body)) {
		const items = [];
		for (const entry of body) {
			if (state.remainingNodes <= 0) {
				items.push(DISCORD_ERROR_BODY_MAX_NODES_MARKER);
				break;
			}
			items.push(redactDiscordErrorBody(entry, fieldKey, sensitiveAncestorKey, state, depth + 1));
		}
		redacted = items;
	} else {
		const usedKeys = /* @__PURE__ */ new Set();
		const collisionCounts = /* @__PURE__ */ new Map();
		const entries = [];
		const appendEntry = (nestedKey) => {
			if (state.remainingNodes <= 0) return false;
			const outputKey = reserveRedactedKey(redactSensitiveFieldValue(sensitiveAncestorKey ?? "", nestedKey), usedKeys, collisionCounts);
			const nestedSensitiveKey = redactSensitiveFieldValue(nestedKey, "") !== "" ? nestedKey : sensitiveAncestorKey;
			entries.push([outputKey, redactDiscordErrorBody(body[nestedKey], nestedKey, nestedSensitiveKey, state, depth + 1)]);
			return true;
		};
		let truncated = false;
		for (const priorityKey of DISCORD_ERROR_BODY_PRIORITY_KEYS) if (Object.hasOwn(body, priorityKey) && !appendEntry(priorityKey)) {
			truncated = true;
			break;
		}
		if (!truncated) for (const nestedKey in body) {
			if (!Object.hasOwn(body, nestedKey) || DISCORD_ERROR_BODY_PRIORITY_KEYS.has(nestedKey)) continue;
			if (!appendEntry(nestedKey)) {
				truncated = true;
				break;
			}
		}
		if (truncated) {
			const markerKey = reserveRedactedKey(DISCORD_ERROR_BODY_MAX_NODES_MARKER, usedKeys, collisionCounts);
			entries.push([markerKey, DISCORD_ERROR_BODY_MAX_NODES_MARKER]);
		}
		redacted = Object.fromEntries(entries);
	}
	state.seen.delete(body);
	return redacted;
}
function readDiscordCode(body) {
	return parseStrictNonNegativeInteger(asOptionalObjectRecord(body)?.code);
}
function readDiscordMessage(body, fallback) {
	const value = asOptionalObjectRecord(body)?.message;
	return typeof value === "string" && value.trim() ? value : fallback;
}
function readErrorDiscordCode(err) {
	return parseStrictNonNegativeInteger(asOptionalObjectRecord(err)?.discordCode);
}
function isUnknownDiscordMessageError(err) {
	return readErrorDiscordCode(err) === DISCORD_UNKNOWN_MESSAGE;
}
function isUnknownDiscordVoiceStateError(err) {
	return readErrorDiscordCode(err) === DISCORD_UNKNOWN_VOICE_STATE || /unknown voice state/i.test(formatErrorMessage(err));
}
function readRetryAfter(body, response) {
	return parseDiscordRetryAfterBodySeconds(asOptionalObjectRecord(body)?.retry_after) ?? parseRetryAfterHeaderSeconds(response.headers.get("Retry-After")) ?? 1;
}
function readDiscordRateLimitBucket(response) {
	const value = response.headers.get("X-RateLimit-Bucket")?.trim();
	return value ? redactIdentifier(value, { len: 32 }) : null;
}
function readDiscordRateLimitScope(response) {
	const value = response.headers.get("X-RateLimit-Scope");
	return value && DISCORD_RATE_LIMIT_SCOPES.has(value) ? value : null;
}
var DiscordError = class extends Error {
	constructor(response, body) {
		const fallbackMessage = `Discord API request failed (${response.status})`;
		const redactedMessage = redactSensitiveFieldValue("message", readDiscordMessage(body, fallbackMessage));
		const redactedBody = redactDiscordErrorBody(body);
		super(redactedMessage);
		this.name = "DiscordError";
		this.status = response.status;
		this.statusCode = response.status;
		this.rawBody = redactedBody;
		this.discordCode = readDiscordCode(body);
	}
};
var RateLimitError = class extends DiscordError {
	constructor(response, body) {
		super(response, body);
		this.name = "RateLimitError";
		this.retryAfter = readRetryAfter(body, response);
		this.scope = body.global ? "global" : readDiscordRateLimitScope(response);
	}
};
// extensions/discord/src/internal/rest-routes.ts
const RATE_LIMIT_HEADER_NUMBER_RE = /^\d+(?:\.\d+)?$/;
const DISCORD_ROUTE_IDENTIFIER_HASH_LENGTH = 32;
function redactWebhookTokenInPath(path) {
	const hasLeadingSlash = path.startsWith("/");
	const segments = path.replace(/^\/+/, "").split("/");
	if (segments[0] !== "webhooks" || !segments[1] || !segments[2]) return path;
	segments[2] = redactIdentifier(segments[2], { len: DISCORD_ROUTE_IDENTIFIER_HASH_LENGTH });
	return `${hasLeadingSlash ? "/" : ""}${segments.join("/")}`;
}
function createRouteKey(method, path) {
	const pathname = path.split("?")[0] ?? path;
	return `${method.toUpperCase()} ${redactWebhookTokenInPath(pathname)}`;
}
function readTopLevelRouteKey(path) {
	const [pathname = path] = path.split("?");
	const [first, id, token] = pathname.replace(/^\/+/, "").split("/");
	if (!first || !id) return pathname;
	if (first === "channels" || first === "guilds" || first === "webhooks") return first === "webhooks" && token ? `${first}/${id}/${redactIdentifier(token, { len: DISCORD_ROUTE_IDENTIFIER_HASH_LENGTH })}` : `${first}/${id}`;
	return first;
}
function createBucketKey(bucket, path) {
	return `${bucket}:${readTopLevelRouteKey(path)}`;
}
function readHeaderNumber(headers, name) {
	const value = headers.get(name);
	if (!value) return;
	const trimmed = value.trim();
	if (!RATE_LIMIT_HEADER_NUMBER_RE.test(trimmed)) return;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) && Math.abs(parsed) <= Number.MAX_SAFE_INTEGER ? parsed : void 0;
}
function resolveRateLimitResetAt(delayMs) {
	const clampedDelayMs = Math.ceil(Math.max(0, delayMs));
	if (!Number.isSafeInteger(clampedDelayMs)) return;
	if (clampedDelayMs === 0) return asDateTimestampMs(Date.now());
	return resolveExpiresAtMsFromDurationMs(clampedDelayMs);
}
function readResetAt(response) {
	const resetAfter = readHeaderNumber(response.headers, "X-RateLimit-Reset-After");
	if (resetAfter !== void 0) return resolveRateLimitResetAt(resetAfter * 1e3);
	const reset = readHeaderNumber(response.headers, "X-RateLimit-Reset");
	return reset !== void 0 ? asDateTimestampMs(reset * 1e3) : void 0;
}
function appendQuery(path, query) {
	if (!query || Object.keys(query).length === 0) return path;
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) search.set(key, String(value));
	return `${path}?${search.toString()}`;
}
// extensions/discord/src/internal/rest-scheduler.ts
const MAX_QUEUE_SIZE = 1e3;
const MAX_CONCURRENT_WORKERS = 4;
const MAX_RATE_LIMIT_RETRIES = 3;
const requestPriorities = [
	"critical",
	"standard",
	"background"
];
const laneSchedule = [
	"critical",
	"critical",
	"critical",
	"critical",
	"critical",
	"critical",
	"standard",
	"standard",
	"standard",
	"background"
];
function countPending(bucket) {
	return requestPriorities.reduce((count, lane) => count + bucket.pending[lane].length, 0);
}
var RestScheduler = class {
	constructor(executor) {
		this.executor = executor;
		this.activeWorkers = 0;
		this.buckets = /* @__PURE__ */ new Map();
		this.globalRateLimitUntil = 0;
		this.laneCursor = 0;
		this.queuedByLane = {
			critical: 0,
			standard: 0,
			background: 0
		};
		this.queuedRequests = 0;
		this.routeBuckets = /* @__PURE__ */ new Map();
	}
	enqueue(params) {
		if (this.queuedRequests >= MAX_QUEUE_SIZE) throw new Error("Discord request queue is full");
		const signal = params.signal;
		if (signal?.aborted) return Promise.reject(abortReason(signal));
		const routeKey = createRouteKey(params.method, params.path);
		const bucket = this.getBucket(this.routeBuckets.get(routeKey) ?? routeKey);
		return new Promise((resolve, reject) => {
			const request = {
				...params,
				routeKey,
				retryCount: 0,
				state: "queued",
				resolve: (value) => {
					this.settleRequest(request);
					resolve(value);
				},
				reject: (reason) => {
					this.settleRequest(request);
					reject(reason);
				}
			};
			if (signal) {
				const onAbort = () => this.cancelQueuedRequest(request);
				signal.addEventListener("abort", onAbort, { once: true });
				request.detachAbort = () => signal.removeEventListener("abort", onAbort);
			}
			this.queuedRequests += 1;
			this.queuedByLane[params.priority] += 1;
			bucket.pending[params.priority].push(request);
			this.drainQueues();
		});
	}
	/** Settles each request once, whether it completed, failed, or was cancelled. */
	settleRequest(request) {
		if (request.state === "settled") return;
		request.state = "settled";
		request.detachAbort?.();
		request.detachAbort = void 0;
		this.queuedRequests = Math.max(0, this.queuedRequests - 1);
	}
	/** Drops a queued attempt; dispatched work settles normally. */
	cancelQueuedRequest(request) {
		if (request.state !== "queued") return;
		for (const bucket of this.buckets.values()) for (const lane of requestPriorities) {
			const queue = bucket.pending[lane];
			const index = queue.indexOf(request);
			if (index < 0) continue;
			queue.splice(index, 1);
			this.queuedByLane[lane] = Math.max(0, this.queuedByLane[lane] - 1);
			request.reject(abortReason(request.signal));
			return;
		}
		request.reject(abortReason(request.signal));
	}
	getBucket(key) {
		const existing = this.buckets.get(key);
		if (existing) return existing;
		const bucket = {
			active: 0,
			pending: {
				critical: [],
				standard: [],
				background: []
			},
			resetAt: 0,
			routeKeys: /* @__PURE__ */ new Set([key])
		};
		this.buckets.set(key, bucket);
		return bucket;
	}
	bindRouteToBucket(routeKey, bucketKey) {
		const target = this.getBucket(bucketKey);
		target.routeKeys.add(routeKey);
		this.routeBuckets.set(routeKey, bucketKey);
		const routeBucket = this.buckets.get(routeKey);
		if (routeBucket && routeBucket !== target) {
			for (const lane of requestPriorities) {
				target.pending[lane].push(...routeBucket.pending[lane]);
				routeBucket.pending[lane] = [];
			}
			if (routeBucket.active === 0) this.buckets.delete(routeKey);
		}
		return target;
	}
	recordResponse(routeKey, path, response, parsed) {
		const bucketHeader = readDiscordRateLimitBucket(response);
		const bucket = bucketHeader ? this.bindRouteToBucket(routeKey, createBucketKey(bucketHeader, path)) : this.getBucket(this.routeBuckets.get(routeKey) ?? routeKey);
		const limit = readHeaderNumber(response.headers, "X-RateLimit-Limit");
		if (limit !== void 0) bucket.limit = limit;
		const remaining = readHeaderNumber(response.headers, "X-RateLimit-Remaining");
		if (remaining !== void 0) bucket.remaining = remaining;
		const resetAt = readResetAt(response);
		if (resetAt !== void 0) bucket.resetAt = resetAt;
		if (response.status !== 429) return;
		const retryAt = resolveRateLimitResetAt(Math.max(0, readRetryAfter(parsed, response) * 1e3));
		if (retryAt === void 0) return;
		if (response.headers.get("X-RateLimit-Global") === "true" || isGlobalRateLimit(parsed)) {
			this.globalRateLimitUntil = Math.max(this.globalRateLimitUntil, retryAt);
			return;
		}
		bucket.remaining = 0;
		bucket.resetAt = Math.max(bucket.resetAt, retryAt);
	}
	getBucketWaitMs(bucket, now) {
		if (bucket.remaining === 0 && bucket.resetAt > now) return bucket.resetAt - now;
		if (bucket.remaining === 0 && bucket.resetAt <= now) bucket.remaining = bucket.limit;
		return 0;
	}
	scheduleDrain(delayMs = 0) {
		if (this.drainTimer) return;
		this.drainTimer = setTimeout(() => {
			this.drainTimer = void 0;
			this.drainQueues();
		}, resolveTimerTimeoutMs(delayMs, 0, 0));
		this.drainTimer.unref();
	}
	drainQueues() {
		while (this.activeWorkers < MAX_CONCURRENT_WORKERS) {
			const next = this.takeNextQueuedRequest();
			if (!next.queued) {
				if (next.waitMs !== void 0 && Number.isFinite(next.waitMs)) this.scheduleDrain(next.waitMs);
				break;
			}
			const { bucket, queued } = next;
			if (bucket.remaining !== void 0 && bucket.remaining > 0) bucket.remaining -= 1;
			bucket.active += 1;
			this.activeWorkers += 1;
			this.runQueuedRequest(queued, bucket);
		}
	}
	takeNextQueuedRequest() {
		const now = Date.now();
		if (this.globalRateLimitUntil > now) return { waitMs: this.globalRateLimitUntil - now };
		for (const [key, bucket] of this.buckets) {
			if (bucket.active !== 0 || countPending(bucket) > 0) continue;
			if (bucket.remaining === 0 && bucket.resetAt > now) continue;
			for (const routeKey of bucket.routeKeys) if (this.routeBuckets.get(routeKey) === key) this.routeBuckets.delete(routeKey);
			this.buckets.delete(key);
		}
		let nextDelayMs;
		const buckets = Array.from(this.buckets.values()).filter((bucket) => countPending(bucket) > 0);
		if (buckets.length === 0) return {};
		for (let laneOffset = 0; laneOffset < laneSchedule.length; laneOffset += 1) {
			const lane = laneSchedule[(this.laneCursor + laneOffset) % laneSchedule.length];
			if (!lane || this.queuedByLane[lane] <= 0) continue;
			for (const bucket of buckets) {
				const queue = bucket.pending[lane];
				if (queue.length === 0 || bucket.active > 0) continue;
				const waitMs = this.getBucketWaitMs(bucket, now);
				if (waitMs > 0) {
					nextDelayMs = Math.min(nextDelayMs ?? waitMs, waitMs);
					continue;
				}
				const queued = queue.shift();
				if (!queued) continue;
				queued.state = "dispatched";
				this.queuedByLane[lane] = Math.max(0, this.queuedByLane[lane] - 1);
				this.laneCursor = (this.laneCursor + laneOffset + 1) % laneSchedule.length;
				return {
					bucket,
					queued
				};
			}
		}
		return { waitMs: nextDelayMs };
	}
	async runQueuedRequest(queued, bucket) {
		try {
			queued.resolve(await this.executor(queued));
		} catch (error) {
			if (error instanceof RateLimitError && this.requeueRateLimitedRequest(queued)) return;
			queued.reject(error instanceof Error ? error : new Error(String(error)));
		} finally {
			bucket.active = Math.max(0, bucket.active - 1);
			this.activeWorkers = Math.max(0, this.activeWorkers - 1);
			this.drainQueues();
		}
	}
	requeueRateLimitedRequest(queued) {
		if (queued.signal?.aborted || queued.retryCount >= MAX_RATE_LIMIT_RETRIES) return false;
		const bucketKey = this.routeBuckets.get(queued.routeKey) ?? queued.routeKey;
		queued.retryCount += 1;
		queued.state = "queued";
		this.getBucket(bucketKey).pending[queued.priority].push(queued);
		this.queuedByLane[queued.priority] += 1;
		return true;
	}
};
/** Promise rejections always carry an Error; a non-Error abort reason uses the standard shape. */
function abortReason(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : new DOMException("The operation was aborted.", "AbortError");
}
function isGlobalRateLimit(parsed) {
	return parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false;
}
// extensions/discord/src/internal/schemas.ts
const discordInteractionPayloadSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
	token: Type.String({ minLength: 1 }),
	type: Type.Number()
}, { additionalProperties: true });
const discordRateLimitBodySchema = Type.Object({
	message: Type.Optional(Type.String()),
	retry_after: Type.Optional(Type.Union([Type.Number(), Type.String()])),
	global: Type.Optional(Type.Boolean()),
	code: Type.Optional(Type.Union([Type.Number(), Type.String()]))
}, { additionalProperties: true });
function assertDiscordInteractionPayload(value) {
	if (!Check(discordInteractionPayloadSchema, value)) throw new Error("Invalid Discord interaction payload");
}
function isDiscordRateLimitBody(value) {
	return Check(discordRateLimitBodySchema, value);
}
// extensions/discord/src/internal/rest.ts
const DISCORD_REST_TIMEOUT_MS = 15e3;
const defaultOptions = {
	baseUrl: "https://discord.com/api",
	timeout: DISCORD_REST_TIMEOUT_MS,
	queueRequests: true
};
const DISCORD_REST_RESPONSE_BODY_MAX_BYTES = 8388608;
const GZIP_MAGIC = [31, 139];
function createResponseBodyOverflowError(size) {
	return /* @__PURE__ */ new Error(`Discord REST response body exceeds ${DISCORD_REST_RESPONSE_BODY_MAX_BYTES} bytes (received ${size})`);
}
async function readResponseBodyText(response, idleTimeoutMs) {
	const buffer = await readResponseWithLimit(response, DISCORD_REST_RESPONSE_BODY_MAX_BYTES, {
		chunkTimeoutMs: idleTimeoutMs,
		onOverflow: ({ size }) => createResponseBodyOverflowError(size),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Discord REST response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	if (!buffer.byteLength) return "";
	if (buffer[0] === GZIP_MAGIC[0] && buffer[1] === GZIP_MAGIC[1]) try {
		return gunzipSync(buffer, { maxOutputLength: DISCORD_REST_RESPONSE_BODY_MAX_BYTES }).toString("utf8");
	} catch (err) {
		if (err instanceof RangeError && "code" in err && err.code === "ERR_BUFFER_TOO_LARGE") throw createResponseBodyOverflowError("decompressed output");
		throw err;
	}
	return buffer.toString("utf8");
}
function coerceResponseBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}
var RequestClient = class {
	constructor(token, options) {
		const endpoint = getDiscordEndpointRuntime();
		const resolvedOptions = endpoint ? {
			...options,
			apiBaseUrl: endpoint.descriptor.restApiBaseUrl,
			fetch: endpoint.fetch
		} : options;
		this.token = token.replace(/^Bot\s+/i, "");
		this.customFetch = resolvedOptions?.fetch;
		this.guardedEndpoint = endpoint !== void 0;
		this.options = normalizeRequestClientOptions(resolvedOptions);
		this.scheduler = new RestScheduler(async (request) => await this.executeRequest(request.method, request.path, {
			data: request.data?.data,
			query: request.query
		}, request.routeKey, request.data?.assertCurrent, request.data?.effect));
	}
	async get(path, query) {
		return await this.request("GET", path, { query });
	}
	async post(path, data, query) {
		return await this.request("POST", path, {
			data,
			query
		});
	}
	async patch(path, data, query) {
		return await this.request("PATCH", path, {
			data,
			query
		});
	}
	async put(path, data, query) {
		return await this.request("PUT", path, {
			data,
			query
		});
	}
	async delete(path, data, query) {
		return await this.request("DELETE", path, {
			data,
			query
		});
	}
	async request(method, path, params) {
		const routeKey = createRouteKey(method, path);
		const assertActionAuthority = captureDiscordRequestAuthority();
		const assertReadAuthority = captureChannelReadAuthority();
		const effect = captureEffectAuthority();
		const assertCurrent = assertActionAuthority ? () => {
			assertActionAuthority();
			assertReadAuthority?.();
		} : assertReadAuthority;
		const callerSignal = this.options.callerSignal;
		callerSignal?.throwIfAborted();
		assertCurrent?.();
		if (!this.options.queueRequests) return await this.executeRequest(method, path, params, routeKey, assertCurrent, effect);
		return await this.scheduler.enqueue({
			method,
			path,
			priority: getRequestPriority(method, path),
			query: params.query,
			data: {
				data: params.data,
				assertCurrent,
				effect
			},
			...callerSignal ? { signal: callerSignal } : {}
		});
	}
	async executeRequest(method, path, params, routeKey = createRouteKey(method, path), assertCurrent, effect = captureEffectAuthority()) {
		const url = `${this.options.apiBaseUrl}${appendQuery(path, params.query)}`;
		const headers = new Headers({ "User-Agent": "OpenClaw Discord" });
		if (this.token !== "webhook") headers.set("Authorization", `Bot ${this.token}`);
		const body = serializeRequestBody(params.data, headers);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.options.timeout).unref();
		const signal = this.options.signal ? AbortSignal.any([this.options.signal, controller.signal]) : controller.signal;
		try {
			assertCurrent?.();
			const init = {
				method,
				headers,
				body,
				signal
			};
			const request = () => {
				assertCurrent?.();
				return this.customFetch && assertCurrent ? this.customFetch(url, init, assertCurrent) : (this.customFetch ?? fetch)(url, init);
			};
			const response = this.guardedEndpoint ? await effect.run(request) : await effect.initiate(request);
			const parsed = coerceResponseBody(await readResponseBodyText(response, this.options.timeout).catch((error) => {
				if (response.ok) throw error;
				return "";
			}));
			this.scheduler.recordResponse(routeKey, path, response, parsed);
			if (response.status === 204) return;
			if (response.status === 429) {
				const rateLimitBody = isDiscordRateLimitBody(parsed) ? parsed : void 0;
				throw new RateLimitError(response, {
					message: readDiscordMessage(rateLimitBody, "Rate limited"),
					retry_after: readRetryAfter(rateLimitBody, response),
					code: readDiscordCode(rateLimitBody),
					global: Boolean(rateLimitBody?.global)
				});
			}
			if (!response.ok) throw new DiscordError(response, parsed);
			return parsed;
		} finally {
			clearTimeout(timeout);
		}
	}
};
function normalizeRequestClientOptions(options) {
	const merged = {
		...defaultOptions,
		...options
	};
	return {
		...merged,
		apiBaseUrl: options?.apiBaseUrl ?? `${options?.baseUrl ?? defaultOptions.baseUrl}/v10`,
		timeout: clampTimerTimeoutMs(merged.timeout, 1) ?? resolveTimerTimeoutMs(defaultOptions.timeout, 1)
	};
}
function getRequestPriority(method, path) {
	const normalizedMethod = method.toUpperCase();
	const normalizedPath = path.toLowerCase();
	if (/^\/interactions\/\d+\/[^/]+\/callback$/.test(normalizedPath)) return "critical";
	return normalizedMethod === "GET" ? "background" : "standard";
}
// extensions/discord/src/internal/api.guild.ts
const discordGuildEmojiListSchema = Type.Array(Type.Object({
	id: Type.Union([Type.String(), Type.Null()]),
	name: Type.Union([Type.String(), Type.Null()]),
	animated: Type.Optional(Type.Boolean())
}, { additionalProperties: true }));
async function getGuild(rest, guildId) {
	return await rest.get(Routes.guild(guildId));
}
function guildUserRead(route) {
	return async (rest, guildId, userId) => await rest.get(Routes[route](guildId, userId));
}
const getGuildMember = guildUserRead("guildMember");
const getGuildVoiceState = guildUserRead("guildVoiceState");
async function listGuildEmojis(rest, guildId) {
	const emojis = await rest.get(Routes.guildEmojis(guildId));
	if (!Check(discordGuildEmojiListSchema, emojis)) throw new Error("Invalid Discord guild emoji response.");
	return emojis;
}
// extensions/discord/src/internal/api.messages.ts
function normalizeDiscordMessageId(messageId) {
	const normalized = messageId.trim();
	if (!/^[0-9]+$/u.test(normalized)) throw new Error("Invalid Discord message ID. Expected decimal digits.");
	return normalized;
}
async function getChannel(rest, channelId) {
	return await rest.get(Routes.channel(channelId));
}
async function createChannelMessage(rest, channelId, data) {
	return await rest.post(Routes.channelMessages(channelId), data);
}
async function getThreadMember(rest, threadId, userId) {
	return await rest.get(Routes.threadMembers(threadId, userId));
}
async function getChannelMessage(rest, channelId, messageId) {
	return await rest.get(Routes.channelMessage(channelId, normalizeDiscordMessageId(messageId)));
}
async function editChannelMessage(rest, channelId, messageId, data) {
	return await rest.patch(Routes.channelMessage(channelId, normalizeDiscordMessageId(messageId)), data);
}
function messageMutation(method, route) {
	return async (rest, channelId, messageId) => {
		await rest[method](Routes[route](channelId, normalizeDiscordMessageId(messageId)));
	};
}
const deleteChannelMessage = messageMutation("delete", "channelMessage");
const pinChannelMessage = messageMutation("put", "channelMessagesPin");
const unpinChannelMessage = messageMutation("delete", "channelMessagesPin");
async function createThread(rest, channelId, data, messageId) {
	const route = messageId === void 0 ? Routes.threads(channelId) : Routes.threads(channelId, normalizeDiscordMessageId(messageId));
	return await rest.post(route, data);
}
// extensions/discord/src/internal/api.reactions.ts
function ownReactionMutation(method) {
	return async (rest, channelId, messageId, encodedEmoji) => {
		await rest[method](Routes.channelMessageOwnReaction(channelId, normalizeDiscordMessageId(messageId), encodedEmoji));
	};
}
const createOwnMessageReaction = ownReactionMutation("put");
const deleteOwnMessageReaction = ownReactionMutation("delete");
async function listMessageReactionUsers(rest, channelId, messageId, encodedEmoji, query) {
	return await rest.get(Routes.channelMessageReaction(channelId, normalizeDiscordMessageId(messageId), encodedEmoji), query);
}
// extensions/discord/src/internal/api.users.ts
async function getCurrentUser(rest) {
	return await rest.get(Routes.user("@me"));
}
async function getUser(rest, userId) {
	return await rest.get(Routes.user(userId));
}
async function createUserDmChannel(rest, recipientId) {
	return await rest.post(Routes.userChannels(), { body: { recipient_id: recipientId } });
}
// extensions/discord/src/internal/commands.ts
async function deferCommandInteractionIfNeeded(command, interaction) {
	if (!command.defer) return;
	await interaction.defer({ ephemeral: command.ephemeral });
}
function readRawCommandOptions(interaction) {
	const options = interaction.rawData.data?.options;
	return Array.isArray(options) ? options : [];
}
function findSelectedSubcommand(subcommands, interaction) {
	const subcommandName = readRawCommandOptions(interaction).find((option) => option.type === ApplicationCommandOptionType.Subcommand)?.name;
	return typeof subcommandName === "string" ? subcommands.find((command) => command.name === subcommandName) : void 0;
}
function resolveFocusedCommandOptionAutocompleteHandler(command, interaction) {
	const focusedName = interaction.options.getFocused()?.name;
	const options = command.commandKind === "group" ? findSelectedSubcommand(command.subcommands, interaction)?.options : command.options;
	const option = focusedName ? options?.find((candidate) => candidate.name === focusedName) : void 0;
	if (option?.type === ApplicationCommandOptionType.String || option?.type === ApplicationCommandOptionType.Integer || option?.type === ApplicationCommandOptionType.Number) return typeof option.autocomplete === "function" ? option.autocomplete : void 0;
}
var BaseCommand = class {
	constructor() {
		this.defer = false;
		this.ephemeral = false;
		this.type = ApplicationCommandType.ChatInput;
	}
	serialize() {
		return stripUndefinedFields({
			name: this.name,
			description: this.description ?? "",
			description_localizations: this.descriptionLocalizations,
			type: this.type,
			options: this.serializeOptions(),
			integration_types: [0, 1],
			contexts: [
				InteractionContextType.Guild,
				InteractionContextType.BotDM,
				InteractionContextType.PrivateChannel
			],
			default_member_permissions: null
		});
	}
};
var Command = class extends BaseCommand {
	constructor(..._args) {
		super(..._args);
		this.commandKind = "leaf";
	}
	async autocomplete(interaction) {
		throw new Error(`The ${interaction.rawData?.data?.name ?? this.name} command does not support autocomplete`);
	}
	serializeOptions() {
		return this.options?.map((option) => {
			const type = option.type;
			if ((type === ApplicationCommandOptionType.String || type === ApplicationCommandOptionType.Integer || type === ApplicationCommandOptionType.Number) && typeof option.autocomplete === "function") {
				const { autocomplete: _autocomplete, ...rest } = option;
				return {
					...rest,
					autocomplete: true
				};
			}
			return option;
		});
	}
};
var CommandWithSubcommands = class extends BaseCommand {
	constructor(..._args2) {
		super(..._args2);
		this.commandKind = "group";
	}
	async run(interaction) {
		const subcommand = findSelectedSubcommand(this.subcommands, interaction);
		if (!subcommand) {
			const subcommandName = readRawCommandOptions(interaction).find((option) => option.type === ApplicationCommandOptionType.Subcommand)?.name;
			throw new Error(`Unknown Discord subcommand: ${typeof subcommandName === "string" ? subcommandName : "<missing>"}`);
		}
		await deferCommandInteractionIfNeeded(subcommand, interaction);
		return await subcommand.run(interaction);
	}
	serializeOptions() {
		return this.subcommands.map((command) => stripUndefinedFields({
			name: command.name,
			description: command.description ?? "",
			description_localizations: command.descriptionLocalizations,
			type: ApplicationCommandOptionType.Subcommand,
			options: command.serializeOptions()
		}));
	}
};
// extensions/discord/src/internal/structures.ts
var Base = class {
	constructor(client) {
		this.client = client;
	}
};
var PartialEntity = class extends Base {
	constructor(client, rawDataOrId) {
		super(client);
		this.rawDataValue = typeof rawDataOrId === "string" ? null : rawDataOrId;
		this.id = typeof rawDataOrId === "string" ? rawDataOrId : rawDataOrId.id;
	}
};
var User = class extends PartialEntity {
	get username() {
		return this.rawDataValue?.username ?? "";
	}
	get globalName() {
		return this.rawDataValue?.global_name;
	}
	get discriminator() {
		return this.rawDataValue?.discriminator;
	}
	get bot() {
		return this.rawDataValue?.bot;
	}
	get avatar() {
		return this.rawDataValue?.avatar;
	}
};
var Role = class extends PartialEntity {
	get name() {
		return this.rawDataValue?.name ?? "";
	}
};
var Guild = class extends PartialEntity {
	get name() {
		return this.rawDataValue?.name ?? "";
	}
	get icon() {
		return this.rawDataValue?.icon;
	}
};
var GuildMember = class extends Base {
	constructor(client, rawData) {
		super(client);
		this.rawData = rawData;
	}
	get user() {
		return this.rawData.user ? new User(this.client, this.rawData.user) : null;
	}
	get roles() {
		return this.rawData.roles ?? [];
	}
	get nickname() {
		return this.rawData.nick ?? void 0;
	}
};
var Message = class Message extends Base {
	constructor(client, rawDataOrIds) {
		super(client);
		this.rawDataValue = typeof rawDataOrIds === "string" || !("author" in rawDataOrIds) ? null : rawDataOrIds;
		this.id = typeof rawDataOrIds === "string" ? rawDataOrIds : rawDataOrIds.id;
		this.channelId = typeof rawDataOrIds === "string" ? "" : "channel_id" in rawDataOrIds ? rawDataOrIds.channel_id : rawDataOrIds.channelId ?? "";
	}
	get rawData() {
		if (!this.rawDataValue) throw new Error("Partial Discord message has no raw data");
		return this.rawDataValue;
	}
	get partial() {
		return this.rawDataValue === null;
	}
	get message() {
		return this;
	}
	get channel_id() {
		return this.channelId;
	}
	get guild_id() {
		return this.rawDataValue?.guild_id;
	}
	get guild() {
		return this.guild_id ? new Guild(this.client, this.guild_id) : null;
	}
	get webhookId() {
		return this.webhook_id;
	}
	get webhook_id() {
		return this.rawDataValue?.webhook_id ?? null;
	}
	get member() {
		const member = this.rawDataValue?.member;
		return member ? new GuildMember(this.client, member) : null;
	}
	get rawMember() {
		return this.rawDataValue?.member;
	}
	get content() {
		return this.rawDataValue?.content ?? "";
	}
	get author() {
		return this.rawDataValue?.author ? new User(this.client, this.rawDataValue.author) : null;
	}
	get embeds() {
		return this.rawDataValue?.embeds ?? [];
	}
	get components() {
		return this.rawDataValue?.components;
	}
	get attachments() {
		return this.rawDataValue?.attachments ?? [];
	}
	get stickers() {
		return this.rawDataValue?.sticker_items ?? [];
	}
	get mentionedUsers() {
		return (this.rawDataValue?.mentions ?? []).map((user) => new User(this.client, user));
	}
	get mentionedRoles() {
		return this.rawDataValue?.mention_roles ?? [];
	}
	get mentionedEveryone() {
		return this.rawDataValue?.mention_everyone ?? false;
	}
	get timestamp() {
		return this.rawDataValue?.timestamp;
	}
	get type() {
		return this.rawDataValue?.type;
	}
	get messageReference() {
		return this.rawDataValue?.message_reference;
	}
	get referencedMessage() {
		return this.rawDataValue?.referenced_message ? new Message(this.client, this.rawDataValue.referenced_message) : null;
	}
	get thread() {
		return this.rawDataValue?.thread ? channelFactory(this.client, this.rawDataValue.thread) : null;
	}
	async fetch() {
		const raw = await getChannelMessage(this.client.rest, this.channelId, this.id);
		return new Message(this.client, raw);
	}
};
function channelFactory(clientForTest, channelData) {
	return {
		...channelData,
		rawData: channelData,
		guildId: "guild_id" in channelData ? channelData.guild_id : void 0,
		guild: "guild_id" in channelData && typeof channelData.guild_id === "string" ? new Guild(clientForTest, channelData.guild_id) : void 0,
		parentId: "parent_id" in channelData ? channelData.parent_id : void 0,
		ownerId: "owner_id" in channelData ? channelData.owner_id : void 0
	};
}
// extensions/discord/src/internal/interaction-options.ts
function findOption(options, matches) {
	for (const option of options ?? []) {
		if (matches(option)) return option;
		const child = "options" in option && Array.isArray(option.options) ? findOption(option.options, matches) : void 0;
		if (child) return child;
	}
}
var OptionsHandler = class {
	constructor(rawOptions, client, resolvedChannels) {
		this.rawOptions = rawOptions;
		this.client = client;
		this.resolvedChannels = resolvedChannels;
	}
	value(name) {
		const option = findOption(this.rawOptions, (entry) => entry.name === name);
		return option && "value" in option ? option.value : void 0;
	}
	getString(name) {
		const value = this.value(name);
		return typeof value === "string" ? value : null;
	}
	getNumber(name) {
		const value = this.value(name);
		return typeof value === "number" ? value : null;
	}
	getBoolean(name) {
		const value = this.value(name);
		return typeof value === "boolean" ? value : null;
	}
	async getChannel(name, required = false) {
		const value = this.value(name);
		const id = typeof value === "string" ? value : void 0;
		const resolved = id ? this.resolvedChannels?.[id] : void 0;
		if (resolved) return channelFactory(this.client, resolved);
		if (id) return await this.client.fetchChannel(id);
		if (required) throw new Error(`Missing required channel option ${name}`);
		return null;
	}
	getFocused() {
		return findOption(this.rawOptions, (option) => "focused" in option && Boolean(option.focused));
	}
};
// extensions/discord/src/internal/modal-fields.ts
function extractModalFields(components) {
	const out = {};
	for (const component of flattenModalComponents(components)) {
		const raw = component;
		if (typeof raw.custom_id !== "string") continue;
		if (Array.isArray(raw.values)) out[raw.custom_id] = raw.values.map(String);
		else if (typeof raw.value === "string" || typeof raw.value === "number" || typeof raw.value === "boolean") out[raw.custom_id] = String(raw.value);
	}
	return out;
}
function* flattenModalComponents(components) {
	for (const entry of components) {
		if (!entry || typeof entry !== "object") continue;
		const component = entry;
		if (component.component && typeof component.component === "object") yield component.component;
		if (Array.isArray(component.components)) yield* flattenModalComponents(component.components);
		yield entry;
	}
}
var ModalFields = class {
	constructor(values, resolved, client) {
		this.values = values;
		this.resolved = resolved;
		this.client = client;
	}
	value(id, required) {
		const value = this.values[id];
		if (required && (value === void 0 || Array.isArray(value) && value.length === 0)) throw new Error(`Missing required modal field ${id}`);
		return value;
	}
	getText(id, required = false) {
		const value = this.value(id, required);
		return typeof value === "string" ? value : null;
	}
	getStringSelect(id, required = false) {
		const value = this.value(id, required);
		if (Array.isArray(value)) return value;
		return typeof value === "string" ? [value] : [];
	}
	getRoleSelect(id, required = false) {
		return this.getStringSelect(id, required).map((roleId) => {
			const raw = this.resolved?.roles?.[roleId];
			return raw ? new Role(this.client, {
				id: roleId,
				name: raw.name ?? ""
			}) : new Role(this.client, roleId);
		});
	}
	getUserSelect(id, required = false) {
		return this.getStringSelect(id, required).map((userId) => {
			const raw = this.resolved?.users?.[userId];
			return new User(this.client, {
				id: userId,
				username: raw?.username ?? ""
			});
		});
	}
};
// extensions/discord/src/internal/embeds.ts
var Embed = class {
	constructor(embed) {
		Object.assign(this, embed);
	}
	serialize() {
		return stripUndefinedFields({
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: typeof this.image === "string" ? { url: this.image } : this.image,
			thumbnail: typeof this.thumbnail === "string" ? { url: this.thumbnail } : this.thumbnail,
			author: this.author,
			fields: this.fields
		});
	}
};
// extensions/discord/src/internal/payload.ts
function asSerializableComponent(component) {
	return {
		isV2: component.type !== ComponentType.ActionRow,
		serialize: () => component
	};
}
function hasDiscordV2Components(components) {
	return Boolean(components?.some((component) => "isV2" in component && component.isV2 || "type" in component && component.type !== ComponentType.ActionRow));
}
function normalizePayloadFlags(payload) {
	const flags = payload.ephemeral ? (payload.flags ?? 0) | MessageFlags.Ephemeral : payload.flags;
	if (!hasDiscordV2Components(payload.components)) return flags;
	if (payload.content || payload.embeds?.length) throw new Error("Discord Components V2 payloads cannot include content or embeds");
	return (flags ?? 0) | MessageFlags.IsComponentsV2;
}
function serializePayload(payload) {
	if (typeof payload === "string") return { content: payload };
	const flags = normalizePayloadFlags(payload);
	return stripUndefinedFields({
		content: payload.content,
		embeds: payload.embeds?.map((entry) => "serialize" in entry ? entry.serialize() : entry),
		components: payload.components?.map((entry) => "serialize" in entry ? entry.serialize() : entry),
		allowed_mentions: payload.allowed_mentions ?? payload.allowedMentions,
		flags,
		tts: payload.tts,
		files: payload.files,
		poll: payload.poll,
		sticker_ids: payload.stickers
	});
}
// extensions/discord/src/internal/interactions.ts
function needsComponentsV2Query(body) {
	return "flags" in body && ((body.flags ?? 0) & MessageFlags.IsComponentsV2) !== 0;
}
function readInteractionUser(rawData, client) {
	const directUser = "user" in rawData ? rawData.user : void 0;
	if (directUser && typeof directUser === "object" && "id" in directUser) return new User(client, directUser);
	const memberUser = rawData.member?.user;
	if (memberUser && typeof memberUser === "object" && typeof memberUser.id === "string") {
		const user = { ...memberUser };
		if (typeof user.username !== "string") user.username = "";
		return new User(client, user);
	}
	return null;
}
var BaseInteraction = class {
	constructor(client, rawData) {
		this.client = client;
		this.rawData = rawData;
		this.message = null;
		this.responseState = "unacknowledged";
		this.pendingResponse = Promise.resolve();
		this.sentFollowUp = false;
		this.id = rawData.id;
		this.token = rawData.token;
		this.user = readInteractionUser(rawData, client);
		this.userId = this.user?.id ?? "";
		this.guild = rawData.guild_id ? new Guild(client, rawData.guild_id) : null;
		this.channel = "channel" in rawData && rawData.channel ? channelFactory(client, rawData.channel) : null;
	}
	get acknowledged() {
		return this.responseState !== "unacknowledged";
	}
	get hasSentFollowUp() {
		return this.sentFollowUp;
	}
	enqueueResponse(operation) {
		const result = this.pendingResponse.then(operation);
		this.pendingResponse = result.then(() => void 0, () => void 0);
		return result;
	}
	async performCallback(type, data) {
		if (this.responseState !== "unacknowledged") throw new Error("Discord interaction has already been acknowledged.");
		const result = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), { body: data === void 0 ? { type } : {
			type,
			data
		} });
		this.responseState = type === InteractionResponseType.DeferredChannelMessageWithSource ? "deferred" : type === InteractionResponseType.DeferredMessageUpdate ? "deferred-update" : "replied";
		return result;
	}
	async callback(type, data) {
		return await this.enqueueResponse(() => this.performCallback(type, data));
	}
	async reply(payload) {
		return await this.enqueueResponse(async () => {
			if (this.responseState === "deferred" || this.responseState === "deferred-update") return await this.performReplyEdit(payload);
			if (this.responseState !== "unacknowledged") return await this.performFollowUp(payload);
			return await this.performCallback(InteractionResponseType.ChannelMessageWithSource, serializePayload(payload));
		});
	}
	async defer(options) {
		return await this.callback(InteractionResponseType.DeferredChannelMessageWithSource, options?.ephemeral ? { flags: 64 } : void 0);
	}
	async acknowledge() {
		return await this.defer();
	}
	async editReply(payload) {
		return await this.enqueueResponse(() => this.performReplyEdit(payload));
	}
	async editDeferredPlaceholderIfUnanswered(payload) {
		return await this.enqueueResponse(async () => {
			if (this.responseState !== "deferred" || this.sentFollowUp) return false;
			await this.performReplyEdit(payload);
			return true;
		});
	}
	async performReplyEdit(payload) {
		const body = serializePayload(payload);
		const query = needsComponentsV2Query(body) ? { with_components: true } : void 0;
		const result = query ? await this.client.rest.patch(this.originalReplyRoute, { body }, query) : await this.client.rest.patch(this.originalReplyRoute, { body });
		this.responseState = "replied";
		return result;
	}
	async deleteReply() {
		return await this.enqueueResponse(async () => {
			const result = await this.client.rest.delete(this.originalReplyRoute);
			this.responseState = "replied";
			return result;
		});
	}
	async fetchReply() {
		return await this.enqueueResponse(() => this.client.rest.get(this.originalReplyRoute));
	}
	get originalReplyRoute() {
		return Routes.webhookMessage(this.client.options.clientId, this.token, "@original");
	}
	async followUp(payload) {
		return await this.enqueueResponse(() => this.performFollowUp(payload));
	}
	async performFollowUp(payload) {
		const body = serializePayload(payload);
		const result = await this.client.rest.post(Routes.webhook(this.client.options.clientId, this.token), { body }, needsComponentsV2Query(body) ? { with_components: true } : void 0);
		this.sentFollowUp = true;
		return result;
	}
};
var CommandInteraction = class extends BaseInteraction {
	constructor(client, rawData) {
		super(client, rawData);
		this.options = new OptionsHandler(rawData.data.options, client, rawData.data.resolved?.channels);
	}
};
var AutocompleteInteraction = class extends CommandInteraction {
	async respond(choices) {
		return await this.callback(InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
	}
};
var BaseComponentInteraction = class extends BaseInteraction {
	constructor(client, rawData) {
		super(client, rawData);
		this.message = rawData.message && typeof rawData.message === "object" ? new Message(client, rawData.message) : null;
		this.values = Array.isArray(rawData.data.values) ? rawData.data.values.map(String) : [];
	}
	async update(payload) {
		return await this.callback(InteractionResponseType.UpdateMessage, serializePayload(payload));
	}
	async acknowledge() {
		return await this.callback(InteractionResponseType.DeferredMessageUpdate);
	}
	async showModal(modal) {
		return await this.callback(InteractionResponseType.Modal, modal.serialize());
	}
	async launchActivity() {
		return await this.callback(InteractionResponseType.LaunchActivity);
	}
};
var ModalInteraction = class extends BaseInteraction {
	constructor(client, rawData) {
		super(client, rawData);
		this.fields = new ModalFields(extractModalFields(rawData.data.components ?? []), rawData.data.resolved, client);
	}
	async acknowledge() {
		return await this.callback(InteractionResponseType.DeferredMessageUpdate);
	}
};
function createInteraction(client, rawData) {
	assertDiscordInteractionPayload(rawData);
	if (rawData.type === InteractionType.ApplicationCommandAutocomplete) return new AutocompleteInteraction(client, rawData);
	if (rawData.type === InteractionType.ApplicationCommand) return new CommandInteraction(client, rawData);
	if (rawData.type === InteractionType.ModalSubmit) return new ModalInteraction(client, rawData);
	if (rawData.type === InteractionType.MessageComponent) return new BaseComponentInteraction(client, rawData);
	return new BaseInteraction(client, rawData);
}
// extensions/discord/src/internal/interaction-dispatch.ts
async function dispatchInteraction(client, rawData) {
	const interaction = createInteraction(client, rawData);
	if (rawData.type === InteractionType.ApplicationCommandAutocomplete) {
		const command = client.commands.find((entry) => entry.name === rawData.data?.name);
		if (!command) return;
		const autocompleteInteraction = interaction;
		const optionAutocomplete = resolveFocusedCommandOptionAutocompleteHandler(command, autocompleteInteraction);
		if (optionAutocomplete) {
			await optionAutocomplete(autocompleteInteraction);
			return;
		}
		if (command.commandKind === "leaf") await command.autocomplete(autocompleteInteraction);
		return;
	}
	try {
		if (rawData.type === InteractionType.ApplicationCommand) {
			const command = client.commands.find((entry) => entry.name === rawData.data?.name);
			if (command) {
				await deferCommandInteractionIfNeeded(command, interaction);
				await command.run(interaction);
			}
			return;
		}
		if (rawData.type === InteractionType.MessageComponent) {
			const customId = rawData.data?.custom_id;
			if (!customId) return;
			const componentInteraction = interaction;
			const component = client.componentHandler.resolve(customId, { componentType: rawData.data?.component_type });
			if (component) {
				await deferComponentInteractionIfNeeded(component, componentInteraction);
				await component.run(componentInteraction, (component.customIdParser ?? parseCustomId)(customId).data);
			}
			return;
		}
		if (rawData.type === InteractionType.ModalSubmit) {
			const customId = rawData.data?.custom_id;
			if (!customId) return;
			const modal = client.modalHandler.resolve(customId);
			if (modal) await modal.run(interaction, modal.customIdParser(customId).data);
		}
	} catch (error) {
		await reportInteractionFailure(interaction);
		throw error;
	}
}
const INTERACTION_FAILURE_NOTICE = "Command failed. Check the Gateway logs for details.";
async function reportInteractionFailure(interaction) {
	if (interaction.responseState !== "deferred" || interaction.hasSentFollowUp) return;
	try {
		await interaction.editDeferredPlaceholderIfUnanswered({
			content: INTERACTION_FAILURE_NOTICE,
			allowed_mentions: { parse: [] }
		});
	} catch {}
}
function resolveConditionalComponentOption(value, interaction) {
	return typeof value === "function" ? value(interaction) : value ?? false;
}
async function deferComponentInteractionIfNeeded(component, interaction) {
	if (!resolveConditionalComponentOption(component.defer, interaction)) return;
	if (resolveConditionalComponentOption(component.ephemeral, interaction)) {
		await interaction.defer({ ephemeral: true });
		return;
	}
	await interaction.acknowledge();
}
// extensions/discord/src/internal/client.ts
const DEFAULT_REST_CACHE_TTL_MS = 3e4;
const DEFAULT_MAX_ENTRIES = 5e3;
const DEFAULT_SWEEP_INTERVAL_MS = 3e4;
const CACHE_KIND_BY_EVENT = /* @__PURE__ */ new Map([
	[GatewayDispatchEvents.ChannelUpdate, "channel"],
	[GatewayDispatchEvents.ChannelDelete, "channel"],
	[GatewayDispatchEvents.ThreadUpdate, "channel"],
	[GatewayDispatchEvents.ThreadDelete, "channel"],
	[GatewayDispatchEvents.GuildUpdate, "guild"],
	[GatewayDispatchEvents.GuildEmojisUpdate, "guild-emojis"],
	[GatewayDispatchEvents.GuildMemberAdd, "member"],
	[GatewayDispatchEvents.GuildMemberRemove, "member"],
	[GatewayDispatchEvents.GuildMemberUpdate, "member"]
]);
const DISCORD_APPLICATION_COMMAND_LIMIT_REACHED = 30032;
const DISCORD_UNKNOWN_APPLICATION_COMMAND = 10063;
function stableCommandKey(command) {
	return `${command.type ?? ApplicationCommandType.ChatInput}:${command.name}`;
}
function stableCommandSetHash(commands) {
	const stable = commands.toSorted((a, b) => stableCommandKey(a).localeCompare(stableCommandKey(b))).map((command) => stableComparableObject(command));
	return createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}
const unorderedCommandArrayFields = /* @__PURE__ */ new Set([
	"channel_types",
	"contexts",
	"integration_types"
]);
const optionComparisonOmittedFields = /* @__PURE__ */ new Set([
	"contexts",
	"default_member_permissions",
	"description_localized",
	"integration_types",
	"name_localized"
]);
const nullableLocalizationFields = /* @__PURE__ */ new Set(["description_localizations", "name_localizations"]);
function comparableCommand(value) {
	if (!value || typeof value !== "object") return value;
	const omit = /* @__PURE__ */ new Set([
		"application_id",
		"description_localized",
		"dm_permission",
		"guild_id",
		"id",
		"name_localized",
		"nsfw",
		"version",
		"default_permission"
	]);
	return stableComparableObject(Object.fromEntries(Object.entries(value).filter(([key, entry]) => !omit.has(key) && entry !== void 0)));
}
function stableComparableObject(value, pathValue = []) {
	if (Array.isArray(value)) {
		const normalized = value.map((entry) => stableComparableObject(entry, pathValue));
		const key = pathValue.at(-1);
		if (key && unorderedCommandArrayFields.has(key) && normalized.every((entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean")) return normalized.toSorted((left, right) => String(left).localeCompare(String(right)));
		return normalized;
	}
	const object = asOptionalObjectRecord(value);
	if (!object) return value;
	return Object.fromEntries(Object.entries(object).filter(([key, entry]) => {
		if (entry === void 0) return false;
		if (entry === null && nullableLocalizationFields.has(key)) return false;
		if (pathValue.includes("options") && optionComparisonOmittedFields.has(key)) return false;
		if ((key === "required" || key === "autocomplete") && entry === false) return false;
		return true;
	}).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, entry]) => [key, typeof entry === "string" && (key === "description" || pathValue.at(-1) === "description_localizations") ? normalizeDescriptionForComparison(entry) : stableComparableObject(entry, [...pathValue, key])]));
}
/**
* Normalize descriptions to match Discord's server-side storage semantics.
* Discord collapses whitespace and removes whitespace between CJK characters.
*/
function normalizeDescriptionForComparison(description) {
	const collapsed = description.replace(/\s+/g, " ");
	const cjkBoundaryWhitespace = /([\u3000-\u303F\u4E00-\u9FFF\uFF00-\uFFEF])\s+([\u3000-\u303F\u4E00-\u9FFF\uFF00-\uFFEF])/g;
	return collapsed.replace(cjkBoundaryWhitespace, "$1$2").replace(cjkBoundaryWhitespace, "$1$2").trim();
}
function commandsEqual(a, b) {
	return JSON.stringify(comparableCommand(a)) === JSON.stringify(comparableCommand(b));
}
var ComponentRegistry = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
		this.wildcardEntries = [];
	}
	register(entry) {
		const key = (entry.customIdParser ?? parseCustomId)(entry.customId).key;
		const entries = key === "*" ? this.wildcardEntries : this.entries.get(key) ?? [];
		if (!entries.includes(entry)) {
			entries.push(entry);
			if (key !== "*") this.entries.set(key, entries);
		}
	}
	resolve(customId, options) {
		for (const entries of this.entries.values()) {
			const match = entries.find((entry) => {
				if (options?.componentType !== void 0 && entry.type !== options.componentType) return false;
				const parser = entry.customIdParser ?? parseCustomId;
				return parser(entry.customId).key === parser(customId).key;
			});
			if (match) return match;
		}
		return this.wildcardEntries.find((entry) => options?.componentType === void 0 || entry.type === options.componentType);
	}
};
var Client = class {
	constructor(options, handlers, plugins = []) {
		this.plugins = [];
		this.componentHandler = new ComponentRegistry();
		this.commandDeployHashLoaded = false;
		this.entityEntries = /* @__PURE__ */ new Map();
		this.lastEntitySweepAt = 0;
		this.modalHandler = new ComponentRegistry();
		if (!options.clientId) throw new Error("Missing Discord application ID");
		if (!options.token) throw new Error("Missing Discord bot token");
		this.options = { ...options };
		this.commands = handlers.commands ?? [];
		this.listeners = handlers.listeners ?? [];
		this.rest = new RequestClient(options.token, options.requestOptions);
		const eventQueue = this.options.eventQueue;
		this.eventQueue = eventQueue ? {
			permits: createPermitPool(eventQueue.maxConcurrency ?? 50),
			maxQueueSize: eventQueue.maxQueueSize ?? 1e4
		} : void 0;
		for (const component of handlers.components ?? []) this.componentHandler.register(component);
		for (const modal of handlers.modals ?? []) this.modalHandler.register(modal);
		for (const plugin of plugins) {
			plugin.registerClient?.(this);
			this.plugins.push(plugin);
		}
	}
	getPlugin(id) {
		return this.plugins.find((plugin) => plugin.id === id);
	}
	async fetchUser(id) {
		return await this.fetchCachedEntity(`user:${id}`, async () => {
			const raw = await getUser(this.rest, id);
			return new User(this, raw);
		});
	}
	async fetchChannel(id) {
		return await this.fetchCachedEntity(`channel:${id}`, async () => {
			const raw = await getChannel(this.rest, id);
			return channelFactory(this, raw);
		});
	}
	async fetchGuild(id) {
		return await this.fetchCachedEntity(`guild:${id}`, async () => {
			const raw = await getGuild(this.rest, id);
			return new Guild(this, raw);
		});
	}
	async fetchMember(guildId, userId) {
		return await this.fetchCachedEntity(`member:${guildId}:${userId}`, async () => {
			const raw = await getGuildMember(this.rest, guildId, userId);
			return new GuildMember(this, raw);
		});
	}
	async fetchGuildEmojis(guildId, fetcher) {
		return await this.fetchCachedEntity(`guild-emojis:${guildId}`, fetcher);
	}
	invalidateEntityCacheForGatewayEvent(type, data) {
		const kind = CACHE_KIND_BY_EVENT.get(type);
		if (!kind) return;
		const raw = asRecord(data);
		if (kind === "member") {
			const guildId = raw.guild_id;
			const user = asRecord(raw.user);
			if (typeof guildId === "string" && typeof user.id === "string") {
				this.entityEntries.delete(`member:${guildId}:${user.id}`);
				this.entityEntries.delete(`user:${user.id}`);
			}
		} else {
			const id = kind === "guild-emojis" ? raw.guild_id : raw.id;
			if (typeof id === "string") this.entityEntries.delete(`${kind}:${id}`);
		}
	}
	async fetchCachedEntity(key, fetcher) {
		const now = performance.now();
		const cached = this.entityEntries.get(key);
		if (cached && cached.expiresAt > now) return cached.value;
		if (cached) this.entityEntries.delete(key);
		const value = await fetcher();
		this.sweepExpiredEntities(now);
		this.entityEntries.set(key, {
			expiresAt: now + DEFAULT_REST_CACHE_TTL_MS,
			value
		});
		if (this.entityEntries.size > DEFAULT_MAX_ENTRIES) this.entityEntries.delete(this.entityEntries.keys().next().value);
		return value;
	}
	sweepExpiredEntities(now) {
		if (now - this.lastEntitySweepAt < DEFAULT_SWEEP_INTERVAL_MS) return;
		this.lastEntitySweepAt = now;
		for (const [key, entry] of this.entityEntries) if (entry.expiresAt <= now) this.entityEntries.delete(key);
	}
	async deployCommands() {
		const commands = this.commands.filter((command) => command.name !== "*").map((command) => command.serialize());
		const hash = stableCommandSetHash(commands);
		await this.loadPersistedHash();
		if (this.commandDeployHash === hash) return;
		await this.reconcileGlobalCommands(commands);
		this.commandDeployHash = hash;
		try {
			await this.options.commandDeployHashStore?.register(this.commandDeployCacheKey, hash);
		} catch {}
	}
	get commandDeployCacheKey() {
		return `app:${this.options.clientId}:global:reconcile`;
	}
	async reconcileGlobalCommands(desired) {
		const existing = await this.requestCommandDeploy("get", Routes.applicationCommands(this.options.clientId));
		const existingByKey = new Map(existing.map((command) => [stableCommandKey(command), command]));
		const desiredCommands = desired.map((command) => ({
			command,
			key: stableCommandKey(command)
		}));
		const desiredKeys = new Set(desiredCommands.map(({ key }) => key));
		for (const { command, key } of desiredCommands) {
			const current = existingByKey.get(key);
			if (current && !commandsEqual(current, command)) await this.requestCommandDeploy("patch", Routes.applicationCommand(this.options.clientId, current.id), command);
		}
		for (const { command, key } of desiredCommands) {
			if (existingByKey.has(key)) continue;
			try {
				await this.requestCommandDeploy("post", Routes.applicationCommands(this.options.clientId), command);
			} catch (error) {
				if (!(error !== null && typeof error === "object" && "discordCode" in error && error.discordCode === DISCORD_APPLICATION_COMMAND_LIMIT_REACHED)) throw error;
				await this.requestCommandDeploy("put", Routes.applicationCommands(this.options.clientId), desired);
				return;
			}
		}
		for (const command of existing) if (!desiredKeys.has(stableCommandKey(command))) try {
			await this.requestCommandDeploy("delete", Routes.applicationCommand(this.options.clientId, command.id));
		} catch (error) {
			if (!(error instanceof DiscordError && error.status === 404 && error.discordCode === DISCORD_UNKNOWN_APPLICATION_COMMAND)) throw error;
		}
	}
	async loadPersistedHash() {
		if (this.commandDeployHashLoaded) return;
		this.commandDeployHashLoaded = true;
		try {
			this.commandDeployHash = await this.options.commandDeployHashStore?.lookup(this.commandDeployCacheKey);
		} catch {}
	}
	async requestCommandDeploy(method, path, body) {
		const rest = this.rest;
		const timeoutMs = rest.options.timeout;
		const startedAt = performance.now();
		try {
			return method === "get" || body === void 0 ? await rest[method](path) : await rest[method](path, { body });
		} catch (error) {
			if (error && typeof error === "object") {
				if (body !== void 0 && (!("deployRequestBody" in error) || error.deployRequestBody === void 0)) Object.assign(error, { deployRequestBody: body });
				Object.assign(error, {
					deployRestMethod: method,
					deployRestPath: path,
					deployRequestMs: performance.now() - startedAt,
					...Number.isFinite(timeoutMs) ? { deployTimeoutMs: timeoutMs } : {}
				});
			}
			throw error;
		}
	}
	async handleInteraction(rawData) {
		await dispatchInteraction(this, rawData);
	}
	async dispatchGatewayEvent(type, data) {
		this.invalidateEntityCacheForGatewayEvent(type, data);
		const listeners = this.listeners.filter((entry) => entry.type === type);
		if (!this.eventQueue) {
			for (const listener of listeners) await listener.handle(data, this);
			return;
		}
		const queue = this.eventQueue;
		await Promise.all(listeners.map(async (listener) => {
			if (queue.permits.pendingCount >= queue.maxQueueSize) throw new Error(`Discord event queue is full for ${type}; maxQueueSize=${queue.maxQueueSize}`);
			const listenerName = listener.constructor.name || "AnonymousListener";
			const release = await queue.permits.acquire();
			const startedAt = performance.now();
			try {
				await listener.handle(data, this);
				const durationMs = performance.now() - startedAt;
				if (durationMs < 3e4) return;
				console.warn(`[EventQueue] Slow listener detected: ${listenerName} took ${durationMs}ms for event ${type}`);
			} catch (error) {
				console.error(`[EventQueue] Listener ${listenerName} failed for event ${type}:`, error);
			} finally {
				release?.();
			}
		}));
	}
};
// extensions/discord/src/internal/components.modal.ts
var TextInput = class extends BaseModalComponent {
	constructor(..._args) {
		super(..._args);
		this.type = ComponentType.TextInput;
		this.customIdParser = parseCustomId;
		this.style = TextInputStyle.Short;
	}
	serialize() {
		return stripUndefinedFields({
			type: this.type,
			custom_id: this.customId,
			style: this.style,
			min_length: this.minLength,
			max_length: this.maxLength,
			required: this.required,
			value: this.value,
			placeholder: this.placeholder
		});
	}
};
var ModalChoiceGroup = class extends BaseModalComponent {
	constructor(..._args2) {
		super(..._args2);
		this.options = [];
	}
	serialize() {
		return stripUndefinedFields({
			type: this.type,
			custom_id: this.customId,
			options: this.options,
			required: this.required,
			min_values: this.minValues,
			max_values: this.maxValues
		});
	}
};
var CheckboxGroup = class extends ModalChoiceGroup {
	constructor(..._args3) {
		super(..._args3);
		this.type = 22;
	}
};
var RadioGroup = class extends ModalChoiceGroup {
	constructor(..._args4) {
		super(..._args4);
		this.type = 21;
	}
};
var Label = class extends BaseModalComponent {
	constructor(component) {
		super();
		this.component = component;
		this.type = ComponentType.Label;
		this.customId = "";
	}
	serialize() {
		return stripUndefinedFields({
			type: this.type,
			label: this.label,
			description: this.description,
			component: this.component?.serialize()
		});
	}
};
var Modal = class {
	constructor() {
		this.components = [];
		this.customIdParser = parseCustomId;
	}
	serialize() {
		return {
			title: this.title,
			custom_id: this.customId,
			components: this.components.map((entry) => entry.serialize())
		};
	}
};
// extensions/discord/src/internal/listeners.ts
var BaseListener = class {};
var ReadyListener = class extends BaseListener {
	constructor(..._args) {
		super(..._args);
		this.type = GatewayDispatchEvents.Ready;
	}
};
var GuildCreateListener = class extends BaseListener {
	constructor(..._args2) {
		super(..._args2);
		this.type = GatewayDispatchEvents.GuildCreate;
	}
};
// extensions/discord/src/internal/discord.ts
var discord_exports = /* @__PURE__ */ __exportAll({
	AutocompleteInteraction: () => AutocompleteInteraction,
	BaseCommand: () => BaseCommand,
	BaseComponentInteraction: () => BaseComponentInteraction,
	BaseMessageInteractiveComponent: () => BaseMessageInteractiveComponent,
	Client: () => Client,
	Command: () => Command,
	CommandInteraction: () => CommandInteraction,
	CommandWithSubcommands: () => CommandWithSubcommands,
	DISCORD_REST_TIMEOUT_MS: () => DISCORD_REST_TIMEOUT_MS,
	DiscordError: () => DiscordError,
	Embed: () => Embed,
	Guild: () => Guild,
	GuildCreateListener: () => GuildCreateListener,
	GuildMember: () => GuildMember,
	Message: () => Message,
	Modal: () => Modal,
	ModalInteraction: () => ModalInteraction,
	RateLimitError: () => RateLimitError,
	ReadyListener: () => ReadyListener,
	RequestClient: () => RequestClient,
	Role: () => Role,
	User: () => User,
	asSerializableComponent: () => asSerializableComponent,
	channelFactory: () => channelFactory,
	createChannelMessage: () => createChannelMessage,
	createInteraction: () => createInteraction,
	createOwnMessageReaction: () => createOwnMessageReaction,
	createThread: () => createThread,
	createUserDmChannel: () => createUserDmChannel,
	deferCommandInteractionIfNeeded: () => deferCommandInteractionIfNeeded,
	deleteChannelMessage: () => deleteChannelMessage,
	deleteOwnMessageReaction: () => deleteOwnMessageReaction,
	editChannelMessage: () => editChannelMessage,
	getChannel: () => getChannel,
	getChannelMessage: () => getChannelMessage,
	getCurrentUser: () => getCurrentUser,
	getGuild: () => getGuild,
	getGuildMember: () => getGuildMember,
	getGuildVoiceState: () => getGuildVoiceState,
	getThreadMember: () => getThreadMember,
	getUser: () => getUser,
	hasDiscordV2Components: () => hasDiscordV2Components,
	isUnknownDiscordVoiceStateError: () => isUnknownDiscordVoiceStateError,
	listGuildEmojis: () => listGuildEmojis,
	listMessageReactionUsers: () => listMessageReactionUsers,
	normalizeDiscordMessageId: () => normalizeDiscordMessageId,
	pinChannelMessage: () => pinChannelMessage,
	resolveFocusedCommandOptionAutocompleteHandler: () => resolveFocusedCommandOptionAutocompleteHandler,
	serializePayload: () => serializePayload,
	unpinChannelMessage: () => unpinChannelMessage
});
import * as import_discord_api_types_v10 from "discord-api-types/v10";
__reExport(discord_exports, import_discord_api_types_v10);
export { getThreadMember as A, RateLimitError as B, listMessageReactionUsers as C, editChannelMessage as D, deleteChannelMessage as E, getGuildVoiceState as F, readRetryAfter as G, isUnknownDiscordVoiceStateError as H, listGuildEmojis as I, stripUndefinedFields as J, captureDiscordRequestAuthority as K, DISCORD_REST_TIMEOUT_MS as L, unpinChannelMessage as M, getGuild as N, getChannel as O, getGuildMember as P, RequestClient as R, deleteOwnMessageReaction as S, createThread as T, readDiscordCode as U, isUnknownDiscordMessageError as V, readDiscordMessage as W, Command as _, Label as a, getCurrentUser as b, TextInput as c, hasDiscordV2Components as d, serializePayload as f, User as g, Message as h, CheckboxGroup as i, pinChannelMessage as j, getChannelMessage as k, Client as l, Guild as m, GuildCreateListener as n, Modal as o, Embed as p, withDiscordRequestAuthority as q, ReadyListener as r, RadioGroup as s, discord_exports as t, asSerializableComponent as u, CommandWithSubcommands as v, createChannelMessage as w, createOwnMessageReaction as x, createUserDmChannel as y, DiscordError as z };
