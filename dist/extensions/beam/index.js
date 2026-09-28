import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-BLBH-Gpf.mjs";
import { b as redactToolPayloadText } from "../../redact-B5EGyLvV.mjs";
import { b as resolveSessionAgentIdsStrict } from "../../agent-scope-CTuYDtny.mjs";
import { t as resolveConfiguredSecretInputString } from "../../resolve-configured-secret-input-string-SF_iuPva.mjs";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "../../ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard, n as GuardedFetchRedirectError } from "../../fetch-guard-EFfAF2PS.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../text-utility-runtime-D7I29NA0.mjs";
import "../../agent-scope-runtime-OY7yRyJL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../ssrf-runtime-Darh53Ay.mjs";
import "../../plugin-runtime-BUxbDDeH.mjs";
import "../../logging-core-CUJDGfv-.mjs";
import { n as buildControlUiCatalogSharePath, r as isControlUiCatalogShareId, t as listActiveSessionCatalogs } from "../../session-catalog-runtime-DzkYyo6M.mjs";
import "../../secret-input-runtime-C01-y7l7.mjs";
import { o as createFixedWindowRateLimiter } from "../../webhook-ingress-CLBPfE22.mjs";
import { a as createWebhookInFlightLimiter, i as beginWebhookRequestPipelineOrReject, s as readJsonWebhookBodyOrReject } from "../../webhook-request-guards-CccCHICi.mjs";
import { createHash } from "node:crypto";
//#region extensions/beam/src/types.ts
const BEAM_HOST_ID = "gateway";
const BEAM_SESSION_SHARE_ROUTE = {
	kind: "thread-id-prefix",
	routeSegment: "beam",
	hostId: BEAM_HOST_ID,
	identifierAlphabet: "lowercase-hex",
	fullLength: 32,
	minPrefixLength: 12,
	lookup: "catalog-list-search-by-thread-id-prefix",
	ambiguity: "multiple-results-or-next-cursor"
};
const BEAM_MAX_BODY_BYTES = 57344;
const BEAM_RETENTION_MS = 6048e5;
const BEAM_MAX_ITEM_CHARS = 6e3;
const TOP_LEVEL_KEYS = /* @__PURE__ */ new Set([
	"version",
	"beamId",
	"source",
	"title",
	"updatedAt",
	"completed",
	"truncated",
	"hookEvent",
	"sourceModel",
	"items"
]);
const ITEM_KEYS = /* @__PURE__ */ new Set(["type", "text"]);
const SOURCE_MODEL_KEYS = /* @__PURE__ */ new Set(["provider", "model"]);
const ITEM_TYPES = /* @__PURE__ */ new Set([
	"userMessage",
	"agentMessage",
	"other"
]);
function hasOnlyKeys(value, allowed) {
	return Object.keys(value).every((key) => allowed.has(key));
}
function isIsoTimestamp(value) {
	const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
	if (!match || !Number.isFinite(Date.parse(value))) return false;
	return (/* @__PURE__ */ new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`)).getUTCDate() === Number(match[3]) && Number(match[4]) < 24 && Number(match[5]) < 60 && Number(match[6]) < 60 && Number(match[8] ?? 0) < 24 && Number(match[9] ?? 0) < 60;
}
function parseBeamUpload(value) {
	if (!isRecord(value) || !hasOnlyKeys(value, TOP_LEVEL_KEYS)) return {
		ok: false,
		error: "request body must be a closed Beam object"
	};
	if (value.version !== 1) return {
		ok: false,
		error: "version must be 1"
	};
	const beamId = normalizeBoundedOptionalString(value.beamId, 64);
	if (!beamId || !/^[a-f0-9]{32}$/i.test(beamId)) return {
		ok: false,
		error: "beamId must be a 32-character hex id"
	};
	const source = normalizeBoundedOptionalString(value.source, 32);
	if (!source || !/^[a-z0-9._-]+$/i.test(source)) return {
		ok: false,
		error: "source must be a short identifier"
	};
	const title = normalizeBoundedOptionalString(value.title, 160);
	if (!title) return {
		ok: false,
		error: "title must be a non-empty string"
	};
	const updatedAt = normalizeBoundedOptionalString(value.updatedAt, 64);
	if (!updatedAt || !isIsoTimestamp(updatedAt)) return {
		ok: false,
		error: "updatedAt must be an ISO timestamp"
	};
	if (typeof value.completed !== "boolean") return {
		ok: false,
		error: "completed must be a boolean"
	};
	if (value.truncated !== void 0 && typeof value.truncated !== "boolean") return {
		ok: false,
		error: "truncated must be a boolean"
	};
	const hookEvent = value.hookEvent === void 0 ? void 0 : normalizeBoundedOptionalString(value.hookEvent, 64);
	if (value.hookEvent !== void 0 && !hookEvent) return {
		ok: false,
		error: "hookEvent must be a short string"
	};
	let sourceModel;
	if (value.sourceModel !== void 0) {
		if (!isRecord(value.sourceModel) || !hasOnlyKeys(value.sourceModel, SOURCE_MODEL_KEYS)) return {
			ok: false,
			error: "sourceModel must be a closed object"
		};
		const provider = normalizeBoundedOptionalString(value.sourceModel.provider, 64);
		const model = normalizeBoundedOptionalString(value.sourceModel.model, 256);
		if (!provider || !/^[a-z0-9._-]+$/i.test(provider) || !model || !/^\S+$/u.test(model)) return {
			ok: false,
			error: "sourceModel must contain a provider and model"
		};
		sourceModel = {
			provider: provider.toLowerCase(),
			model
		};
	}
	if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 200) return {
		ok: false,
		error: `items must contain 1-200 entries`
	};
	const items = [];
	for (const rawItem of value.items) {
		if (!isRecord(rawItem) || !hasOnlyKeys(rawItem, ITEM_KEYS)) return {
			ok: false,
			error: "each transcript item must be a closed object"
		};
		if (typeof rawItem.type !== "string" || !ITEM_TYPES.has(rawItem.type)) return {
			ok: false,
			error: "transcript item type is invalid"
		};
		const text = normalizeBoundedOptionalString(rawItem.text, BEAM_MAX_ITEM_CHARS);
		if (!text) return {
			ok: false,
			error: `transcript item text must be 1-${BEAM_MAX_ITEM_CHARS} characters`
		};
		items.push({
			type: rawItem.type,
			text
		});
	}
	return {
		ok: true,
		value: {
			version: 1,
			beamId: beamId.toLowerCase(),
			source: source.toLowerCase(),
			title,
			updatedAt,
			completed: value.completed,
			...value.truncated === true ? { truncated: true } : {},
			...hookEvent ? { hookEvent } : {},
			...sourceModel ? { sourceModel } : {},
			items
		}
	};
}
//#endregion
//#region extensions/beam/src/http.ts
function sendJson(res, status, value) {
	res.statusCode = status;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(value));
}
function currentRequestClient(req) {
	const client = getPluginRuntimeGatewayRequestScope()?.client;
	return {
		clientIp: client?.clientIp ?? req.socket.remoteAddress ?? "unknown",
		scopes: client?.connect?.scopes ?? [],
		profileId: client?.authenticatedUserProfile?.profileId
	};
}
function canPublish(scopes) {
	return scopes.includes("operator.write") || scopes.includes("operator.admin");
}
function createBeamRequestHandler(params) {
	const rateLimiter = createFixedWindowRateLimiter({
		windowMs: 6e4,
		maxRequests: 60,
		maxTrackedKeys: 2048
	});
	const inFlightLimiter = createWebhookInFlightLimiter({
		maxInFlightPerKey: 2,
		maxTrackedKeys: 2048
	});
	return async (req, res) => {
		const client = params.resolveClient?.(req) ?? currentRequestClient(req);
		if (!canPublish(client.scopes)) {
			sendJson(res, 403, {
				ok: false,
				error: "operator.write is required"
			});
			return true;
		}
		const pipeline = beginWebhookRequestPipelineOrReject({
			req,
			res,
			allowMethods: ["POST"],
			requireJsonContentType: true,
			rateLimiter,
			rateLimitKey: client.clientIp,
			inFlightLimiter,
			inFlightKey: client.clientIp
		});
		if (!pipeline.ok) return true;
		try {
			const body = await readJsonWebhookBodyOrReject({
				req,
				res,
				maxBytes: BEAM_MAX_BODY_BYTES,
				timeoutMs: 1e4,
				emptyObjectOnEmpty: false,
				invalidJsonMessage: "invalid Beam request body"
			});
			if (!body.ok) return true;
			const parsed = parseBeamUpload(body.value);
			if (!parsed.ok) {
				sendJson(res, 400, {
					ok: false,
					error: parsed.error
				});
				return true;
			}
			const revalidatePublisher = getPluginRuntimeGatewayRequestScope()?.revalidate;
			await revalidatePublisher?.();
			const receivedAt = params.now?.() ?? Date.now();
			await params.store.upload(parsed.value, {
				receivedAt,
				uploaderProfileId: client.profileId,
				revalidatePublisher
			});
			sendJson(res, 200, {
				ok: true,
				beamId: parsed.value.beamId,
				url: buildControlUiCatalogSharePath({
					shareRoute: BEAM_SESSION_SHARE_ROUTE,
					threadId: parsed.value.beamId,
					displayName: parsed.value.title,
					basePath: params.resolveControlUiBasePath()
				})
			});
			return true;
		} finally {
			pipeline.release();
		}
	};
}
//#endregion
//#region extensions/beam/src/mirror.ts
const MIRROR_CONFIG_PATH = "plugins.entries.beam.config.mirror";
const MIRROR_TOKEN_PATH = `${MIRROR_CONFIG_PATH}.token`;
const DEFAULT_POLL_SECONDS = 30;
const DEFAULT_ACTIVE_WINDOW_MINUTES = 180;
const MIRROR_LIST_LIMIT = 100;
const MIRROR_READ_LIMIT = 50;
const MIRROR_MAX_SESSIONS = 32;
const MIRROR_RETRY_CAP = 1e3;
const MIRROR_BODY_BUDGET_BYTES = 55296;
const MIRROR_WARN_INTERVAL_MS = 3e5;
const MIRROR_UPLOAD_TIMEOUT_MS = 15e3;
function isLoopbackHostname(hostname) {
	const bare = hostname.replace(/^\[|\]$/g, "");
	return bare === "localhost" || bare === "127.0.0.1" || bare === "::1";
}
const MIRROR_KEYS = /* @__PURE__ */ new Set([
	"endpoint",
	"token",
	"catalogs",
	"pollSeconds",
	"activeWindowMinutes"
]);
function boundedNumber(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(max, Math.max(min, value));
}
/** Returns the mirror config, undefined when mirroring is not configured, or an error string. */
function parseBeamMirrorConfig(config) {
	const mirror = config.plugins?.entries?.beam?.config?.mirror;
	if (mirror === void 0) return;
	if (!isRecord(mirror) || !Object.keys(mirror).every((key) => MIRROR_KEYS.has(key))) return `${MIRROR_CONFIG_PATH} must be a closed object with endpoint/token/catalogs/pollSeconds/activeWindowMinutes`;
	const endpoint = typeof mirror.endpoint === "string" ? mirror.endpoint.trim() : "";
	let parsedEndpoint;
	try {
		parsedEndpoint = new URL(endpoint);
	} catch {
		return `${MIRROR_CONFIG_PATH}.endpoint must be an absolute URL`;
	}
	if (parsedEndpoint.protocol === "http:") {
		if (!isLoopbackHostname(parsedEndpoint.hostname)) return `${MIRROR_CONFIG_PATH}.endpoint must use https for non-loopback hosts`;
	} else if (parsedEndpoint.protocol !== "https:") return `${MIRROR_CONFIG_PATH}.endpoint must use http(s)`;
	if (!Array.isArray(mirror.catalogs) || mirror.catalogs.length === 0 || mirror.catalogs.some((id) => typeof id !== "string" || !id.trim())) return `${MIRROR_CONFIG_PATH}.catalogs must explicitly list the catalog ids to mirror`;
	const catalogs = mirror.catalogs.map((id) => id.trim().toLowerCase());
	return {
		endpoint,
		...mirror.token !== void 0 ? { token: mirror.token } : {},
		catalogs,
		pollSeconds: boundedNumber(mirror.pollSeconds, DEFAULT_POLL_SECONDS, 10, 3600),
		activeWindowMinutes: boundedNumber(mirror.activeWindowMinutes, DEFAULT_ACTIVE_WINDOW_MINUTES, 1, 10080)
	};
}
function beamMirrorId(catalogId, hostId, threadId) {
	return createHash("sha256").update(`${catalogId}\0${hostId}\0${threadId}`).digest("hex").slice(0, 32);
}
/**
* Reduce newest-first catalog items to chronological Beam uploads. Only user/agent
* message text crosses the wire; reasoning, tool calls, tool results, and raw
* payloads collapse into compact counts. Redact credentials before clipping so
* the character boundary cannot hide the suffix needed to recognize a secret.
*/
function buildBeamMirrorItems(items) {
	const out = [];
	const dropped = /* @__PURE__ */ new Map();
	let truncated = items.some((item) => item.truncated);
	const flush = () => {
		if (dropped.size > 0) {
			const counts = [...dropped].map(([kind, count]) => `${count} ${kind}`).join(", ");
			out.push({
				type: "other",
				text: `${counts}; raw content dropped`
			});
			dropped.clear();
		}
	};
	const labels = {
		toolCall: "tool calls",
		toolResult: "tool results",
		reasoning: "reasoning items"
	};
	for (const item of items.toReversed()) {
		const text = item.text?.trim();
		if ((item.type === "userMessage" || item.type === "agentMessage") && text) {
			flush();
			const redacted = redactToolPayloadText(text);
			const clipped = truncateUtf16Safe(redacted, BEAM_MAX_ITEM_CHARS);
			truncated ||= clipped.length < redacted.length;
			out.push({
				type: item.type,
				text: clipped
			});
			continue;
		}
		const label = labels[item.type] ?? "other entries";
		dropped.set(label, (dropped.get(label) ?? 0) + 1);
	}
	flush();
	return {
		items: out,
		truncated
	};
}
/** Drop oldest items until the payload fits the receiver's item and byte caps. */
function fitBeamMirrorUpload(upload) {
	const items = upload.items.slice(-200);
	const fitted = {
		...upload,
		items
	};
	let bytes = Buffer.byteLength(JSON.stringify(fitted), "utf8");
	if (items.length < upload.items.length || bytes > MIRROR_BODY_BUDGET_BYTES) {
		fitted.truncated = true;
		bytes = Buffer.byteLength(JSON.stringify(fitted), "utf8");
	}
	let start = 0;
	while (start + 1 < items.length && bytes > MIRROR_BODY_BUDGET_BYTES) bytes -= Buffer.byteLength(JSON.stringify(items[start++]), "utf8") + 1;
	return {
		...fitted,
		items: items.slice(start)
	};
}
function sourceModelForMirror(providerValue, items) {
	const provider = providerValue?.trim().toLowerCase();
	const rawModel = items.find((item) => item.type === "agentMessage" && item.model?.trim())?.model;
	if (!provider || !/^[a-z0-9._-]+$/i.test(provider) || !rawModel) return;
	const prefixed = rawModel.trim();
	const model = truncateUtf16Safe(prefixed.startsWith(`${provider}/`) ? prefixed.slice(provider.length + 1) : prefixed, 256).trim();
	return model && /^\S+$/u.test(model) ? {
		provider,
		model
	} : void 0;
}
function mirrorCandidateKey(candidate) {
	return `${candidate.catalogId}\0${candidate.hostId}\0${candidate.threadId}`;
}
function createBeamMirrorRunner(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now;
	const listCatalogs = params.listCatalogs ?? listActiveSessionCatalogs;
	const tracked = /* @__PURE__ */ new Map();
	const controller = new AbortController();
	const { signal } = controller;
	let lastWarnAt = 0;
	let warnedProcessHomeIsolation = false;
	let endpoint = "";
	let redirectBlocked = false;
	let activeTick;
	let stopPromise;
	const stopError = /* @__PURE__ */ new Error("Beam mirror stopped");
	const raceCatalog = async (operation) => {
		let rejectAbort;
		const aborted = new Promise((_, reject) => {
			rejectAbort = reject;
		});
		const abort = () => rejectAbort(stopError);
		signal.addEventListener("abort", abort, { once: true });
		try {
			if (signal.aborted) abort();
			return await Promise.race([operation, aborted]);
		} finally {
			signal.removeEventListener("abort", abort);
		}
	};
	const trackSuccessfulUpload = (key, candidate, fingerprint) => {
		tracked.set(key, {
			candidate,
			fingerprint,
			expiresAt: now() + BEAM_RETENTION_MS
		});
		if (tracked.size <= MIRROR_RETRY_CAP) return;
		let oldest;
		for (const item of tracked) if (item[0] !== key && (!oldest || item[1].expiresAt < oldest[1].expiresAt)) oldest = item;
		if (oldest) tracked.delete(oldest[0]);
	};
	const warnThrottled = (message) => {
		if (now() - lastWarnAt >= MIRROR_WARN_INTERVAL_MS) {
			lastWarnAt = now();
			params.logger.warn(message);
		}
	};
	const upload = async (token, payload) => {
		if (signal.aborted || redirectBlocked) return false;
		let guarded;
		try {
			guarded = await fetchWithSsrFGuard({
				url: endpoint,
				fetchImpl: params.fetchFn,
				timeoutMs: MIRROR_UPLOAD_TIMEOUT_MS,
				signal,
				policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(endpoint),
				auditContext: "beam.mirror_upload",
				maxRedirects: 0,
				init: {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...token ? { Authorization: `Bearer ${token}` } : {}
					},
					body: JSON.stringify(payload)
				}
			});
		} catch (error) {
			signal.throwIfAborted();
			if (error instanceof GuardedFetchRedirectError) {
				redirectBlocked = true;
				params.logger.warn(`beam mirror upload blocked for ${payload.source}: receiver returned redirect (${error.status}); redirects are not followed; configure the final endpoint`);
				return false;
			}
			throw error;
		}
		const { response, release } = guarded;
		try {
			signal.throwIfAborted();
			if (!response.ok) warnThrottled(`beam mirror upload failed (${response.status}) for ${payload.source}`);
			return response.ok;
		} finally {
			await response.body?.cancel().catch(() => void 0);
			await release();
		}
	};
	const buildUpload = async (agentId, catalog, candidate, completed) => {
		const transcript = await raceCatalog(catalog.read({
			agentId,
			hostId: candidate.hostId,
			threadId: candidate.threadId,
			limit: MIRROR_READ_LIMIT
		}));
		signal.throwIfAborted();
		const reduced = buildBeamMirrorItems(transcript.items);
		const sourceModel = sourceModelForMirror(candidate.modelProvider, transcript.items);
		const items = reduced.items.length ? reduced.items : [{
			type: "other",
			text: "no shareable messages yet"
		}];
		return fitBeamMirrorUpload({
			version: 1,
			beamId: beamMirrorId(candidate.catalogId, candidate.hostId, candidate.threadId),
			source: candidate.catalogId,
			title: truncateUtf16Safe(redactToolPayloadText(candidate.title), 160),
			updatedAt: new Date(candidate.recencyAt || now()).toISOString(),
			completed,
			...sourceModel ? { sourceModel } : {},
			...reduced.truncated || transcript.nextCursor ? { truncated: true } : {},
			items
		});
	};
	const mirrorFingerprint = ({ updatedAt: _updatedAt, ...content }) => createHash("sha256").update(JSON.stringify(content)).digest("hex");
	const scan = async () => {
		try {
			const config = params.runtime.config.current();
			const mirror = parseBeamMirrorConfig(config);
			if (mirror === void 0) return;
			if (typeof mirror === "string") {
				warnThrottled(`beam mirror disabled: ${mirror}`);
				return;
			}
			if (endpoint !== mirror.endpoint) {
				endpoint = mirror.endpoint;
				tracked.clear();
				redirectBlocked = false;
			}
			let agentId;
			try {
				agentId = resolveSessionAgentIdsStrict({ config }).defaultAgentId;
			} catch (error) {
				warnThrottled(`beam mirror disabled: ${String(error)}`);
				return;
			}
			let token;
			if (mirror.token !== void 0) {
				const resolved = await resolveConfiguredSecretInputString({
					config,
					env,
					value: mirror.token,
					path: MIRROR_TOKEN_PATH
				});
				signal.throwIfAborted();
				if (!resolved.value) {
					warnThrottled(`beam mirror token unresolved${resolved.unresolvedRefReason ? `: ${resolved.unresolvedRefReason}` : ""}`);
					return;
				}
				token = resolved.value;
			}
			const activeSinceMs = now() - mirror.activeWindowMinutes * 6e4;
			const catalogs = listCatalogs().filter((catalog) => catalog.id !== "beam" && mirror.catalogs.includes(catalog.id));
			if (!warnedProcessHomeIsolation && catalogs.some((catalog) => !catalog.processHomeFallbackAllowed)) {
				warnedProcessHomeIsolation = true;
				params.logger.warn("beam mirror process-HOME fallback disabled: isolated state; only explicit catalog roots can be mirrored");
			}
			const catalogById = new Map(catalogs.map((catalog) => [catalog.id, catalog]));
			const observed = /* @__PURE__ */ new Map();
			const fullyObservedHosts = /* @__PURE__ */ new Set();
			for (const catalog of catalogs) {
				signal.throwIfAborted();
				try {
					const hosts = await raceCatalog(catalog.list({
						agentId,
						limitPerHost: MIRROR_LIST_LIMIT
					}));
					signal.throwIfAborted();
					for (const host of hosts) {
						if (host.kind !== "gateway" || !host.connected || host.error) continue;
						if (host.nextCursor === void 0) fullyObservedHosts.add(`${catalog.id}\0${host.hostId}`);
						for (const session of host.sessions) {
							const candidate = {
								catalogId: catalog.id,
								hostId: host.hostId,
								modelProvider: session.modelProvider,
								threadId: session.threadId,
								title: session.name?.trim() || `${catalog.id} session`,
								recencyAt: session.recencyAt ?? session.updatedAt ?? 0
							};
							observed.set(mirrorCandidateKey(candidate), candidate);
						}
					}
				} catch (error) {
					signal.throwIfAborted();
					warnThrottled(`beam mirror list failed for ${catalog.id}: ${String(error)}`);
				}
			}
			const selected = [...observed.values()].filter((candidate) => candidate.recencyAt >= activeSinceMs).toSorted((left, right) => right.recencyAt - left.recencyAt).slice(0, MIRROR_MAX_SESSIONS);
			for (const candidate of selected) {
				signal.throwIfAborted();
				const key = mirrorCandidateKey(candidate);
				const catalog = catalogById.get(candidate.catalogId);
				if (!catalog) continue;
				try {
					const payload = await buildUpload(agentId, catalog, candidate, false);
					signal.throwIfAborted();
					const fingerprint = mirrorFingerprint(payload);
					if (tracked.get(key)?.fingerprint === fingerprint) continue;
					const uploaded = await upload(token, payload);
					signal.throwIfAborted();
					if (uploaded) trackSuccessfulUpload(key, candidate, fingerprint);
				} catch (error) {
					signal.throwIfAborted();
					warnThrottled(`beam mirror upload failed for ${candidate.catalogId}: ${String(error)}`);
				}
			}
			const tickNow = now();
			const terminalEntries = [];
			for (const [key, entry] of tracked) {
				signal.throwIfAborted();
				const candidate = observed.get(key);
				if (!(candidate ? candidate.recencyAt < activeSinceMs : fullyObservedHosts.has(`${entry.candidate.catalogId}\0${entry.candidate.hostId}`))) continue;
				if (entry.expiresAt <= tickNow) tracked.delete(key);
				else if (terminalEntries.length < MIRROR_MAX_SESSIONS) terminalEntries.push([key, candidate ? {
					...entry,
					candidate
				} : entry]);
			}
			for (const [key, entry] of terminalEntries) {
				signal.throwIfAborted();
				let uploaded = false;
				const catalog = catalogById.get(entry.candidate.catalogId);
				if (catalog) try {
					const payload = await buildUpload(agentId, catalog, entry.candidate, true);
					signal.throwIfAborted();
					uploaded = await upload(token, payload);
					signal.throwIfAborted();
				} catch {
					signal.throwIfAborted();
				}
				tracked.delete(key);
				if (!uploaded) tracked.set(key, entry);
			}
		} catch (error) {
			if (!signal.aborted) throw error;
		}
	};
	return {
		tick: () => {
			if (signal.aborted) return stopPromise ?? Promise.resolve();
			activeTick ??= scan().finally(() => {
				activeTick = void 0;
			});
			return activeTick;
		},
		stop: () => {
			if (!stopPromise) {
				stopPromise = activeTick ?? Promise.resolve();
				controller.abort();
			}
			return stopPromise;
		}
	};
}
function createBeamMirrorService(params) {
	let interval;
	let runner;
	return {
		id: "beam-mirror",
		start(ctx) {
			const mirror = parseBeamMirrorConfig(params.runtime.config.current());
			if (mirror === void 0) return;
			if (typeof mirror === "string") {
				ctx.logger.warn(`beam mirror disabled: ${mirror}`);
				return;
			}
			runner = createBeamMirrorRunner({
				runtime: params.runtime,
				logger: ctx.logger
			});
			interval = setInterval(() => {
				runner?.tick();
			}, mirror.pollSeconds * 1e3);
			interval.unref?.();
			ctx.logger.info(`beam mirror active: ${mirror.catalogs.join(", ")} -> ${new URL(mirror.endpoint).origin}`);
			runner.tick();
		},
		stop() {
			if (interval) {
				clearInterval(interval);
				interval = void 0;
			}
			return runner?.stop() ?? Promise.resolve();
		}
	};
}
//#endregion
//#region extensions/beam/src/session-catalog.ts
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
function boundedLimit(value) {
	return Math.min(MAX_LIMIT, Math.max(1, value ?? DEFAULT_LIMIT));
}
function cursorOffset(value) {
	if (!value || !/^\d+$/.test(value)) return 0;
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}
function searchableText(session) {
	return `${session.title}\n${session.source}`.toLowerCase();
}
function transcriptRevision(session) {
	return createHash("sha256").update(JSON.stringify(session.items)).digest("base64url");
}
function encodeTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function decodeTranscriptCursor(value) {
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (isRecord(parsed) && typeof parsed.revision === "string" && /^[A-Za-z0-9_-]{43}$/.test(parsed.revision) && typeof parsed.end === "number" && Number.isSafeInteger(parsed.end) && parsed.end >= 0) return {
			revision: parsed.revision,
			end: parsed.end
		};
	} catch {}
	throw new Error("invalid Beam transcript cursor");
}
function createBeamSessionCatalog(store) {
	return {
		id: "beam",
		label: "Beam",
		audience: "gateway-operators",
		shareRoute: BEAM_SESSION_SHARE_ROUTE,
		supportsProcessHomeIsolation: true,
		async list(params) {
			const search = params.search?.trim().toLowerCase();
			const shareId = search && isControlUiCatalogShareId(BEAM_SESSION_SHARE_ROUTE, search) ? search : void 0;
			const sessions = (await store.list()).filter((session) => !search || (shareId ? session.beamId.startsWith(shareId) : searchableText(session).includes(search))).toSorted((left, right) => right.receivedAt - left.receivedAt || left.beamId.localeCompare(right.beamId));
			const offset = cursorOffset(params.cursors?.[BEAM_HOST_ID]);
			const limit = boundedLimit(params.limitPerHost);
			const page = sessions.slice(offset, offset + limit);
			return [{
				hostId: BEAM_HOST_ID,
				label: "Beamed sessions",
				kind: "gateway",
				connected: true,
				sessions: page.map((session) => ({
					threadId: session.beamId,
					name: session.title,
					status: session.completed ? "completed" : "live",
					createdAt: session.createdAt,
					updatedAt: session.receivedAt,
					recencyAt: session.receivedAt,
					source: session.source,
					archived: false,
					canContinue: true,
					canArchive: true
				})),
				...offset + page.length < sessions.length ? { nextCursor: String(offset + page.length) } : {}
			}];
		},
		async read(params) {
			if (params.hostId !== "gateway") throw new Error(`unknown Beam host: ${params.hostId}`);
			const session = await store.get(params.threadId);
			if (!session) throw new Error(`unknown Beam session: ${params.threadId}`);
			const cursor = params.cursor === void 0 ? void 0 : decodeTranscriptCursor(params.cursor);
			const end = Math.min(session.items.length, cursor?.end ?? session.items.length);
			const start = Math.max(0, end - boundedLimit(params.limit));
			let nextCursor;
			if (cursor || start > 0) {
				const revision = transcriptRevision(session);
				if (cursor && cursor.revision !== revision) throw new Error("stale Beam transcript cursor");
				if (start > 0) nextCursor = encodeTranscriptCursor({
					revision,
					end: start
				});
			}
			return {
				hostId: BEAM_HOST_ID,
				label: session.title,
				threadId: session.beamId,
				items: session.items.slice(start, end).map((item, index) => ({
					id: `${session.beamId}:${start + index}`,
					type: item.type,
					text: item.text,
					timestamp: session.updatedAt,
					sender: item.type === "userMessage" && session.uploaderProfileId ? { identity: {
						type: "profile",
						id: session.uploaderProfileId
					} } : void 0
				})).toReversed(),
				...nextCursor ? { nextCursor } : {}
			};
		},
		async archive(params) {
			if (params.hostId !== "gateway") throw new Error(`unknown Beam host: ${params.hostId}`);
			if (!await store.delete(params.threadId)) throw new Error(`unknown Beam session: ${params.threadId}`);
			return { ok: true };
		},
		async copyToGatewaySession(params) {
			if (params.hostId !== "gateway") throw new Error(`unknown Beam host: ${params.hostId}`);
			const session = await store.get(params.threadId);
			if (!session) throw new Error(`unknown Beam session: ${params.threadId}`);
			return {
				displayName: session.title,
				...session.sourceModel ? { preferredModel: `${session.sourceModel.provider}/${session.sourceModel.model}` } : {}
			};
		}
	};
}
//#endregion
//#region extensions/beam/src/store.ts
function beamTimestampEpochNanoseconds(value) {
	const match = /\.(\d{1,9})(?=Z|[+-]\d{2}:\d{2}$)/.exec(value);
	const fraction = (match?.[1] ?? "").padEnd(9, "0");
	const millisecondTimestamp = match ? `${value.slice(0, match.index)}.${fraction.slice(0, 3)}${value.slice(match.index + match[0].length)}` : value;
	return BigInt(Date.parse(millisecondTimestamp)) * 1000000n + BigInt(fraction.slice(3));
}
function compareBeamTimestamps(left, right) {
	const leftNanoseconds = beamTimestampEpochNanoseconds(left);
	const rightNanoseconds = beamTimestampEpochNanoseconds(right);
	return leftNanoseconds < rightNanoseconds ? -1 : leftNanoseconds > rightNanoseconds ? 1 : 0;
}
function decideBeamUpload(existing, snapshot) {
	const revisionOrder = existing ? compareBeamTimestamps(snapshot.updatedAt, existing.updatedAt) : 1;
	if (revisionOrder < 0 || revisionOrder === 0 && existing?.completed && !snapshot.completed) return;
	return {
		...snapshot,
		createdAt: existing?.createdAt ?? snapshot.receivedAt
	};
}
function createBeamStore(runtime) {
	const store = runtime.state.openKeyedStore({
		namespace: "sessions",
		maxEntries: 500,
		overflowPolicy: "evict-oldest",
		defaultTtlMs: BEAM_RETENTION_MS
	});
	return {
		async upload(upload, { receivedAt, uploaderProfileId, revalidatePublisher }) {
			if (!store.observe || !store.compareAndApply) throw new Error("Beam uploads require plugin-state observe and compareAndApply support");
			const snapshot = {
				...structuredClone(upload),
				...uploaderProfileId ? { uploaderProfileId } : {},
				receivedAt
			};
			let observation = await store.observe(snapshot.beamId);
			for (;;) {
				const value = decideBeamUpload(observation.value, snapshot);
				await revalidatePublisher?.();
				const result = await store.compareAndApply(snapshot.beamId, observation.comparison, value ? {
					operation: "update",
					action: "set",
					value
				} : {
					operation: "update",
					action: "keep"
				});
				if (result.status !== "conflict") return result.status === "applied";
				observation = result.current;
			}
		},
		get: (beamId) => store.lookup(beamId),
		delete: (beamId) => store.delete(beamId),
		list: async () => (await store.entries()).map((entry) => entry.value)
	};
}
//#endregion
//#region extensions/beam/index.ts
var beam_default = definePluginEntry({
	id: "beam",
	name: "Beam",
	description: "Receive redacted coding-session snapshots for review or Team continuation",
	register(api) {
		const store = createBeamStore(api.runtime);
		api.registerSessionCatalog(createBeamSessionCatalog(store));
		api.registerHttpRoute({
			path: "/api/v1/beam/sessions",
			auth: "gateway",
			match: "exact",
			handler: createBeamRequestHandler({
				store,
				resolveControlUiBasePath: () => api.runtime.config.current().gateway?.controlUi?.basePath
			})
		});
		api.registerService(createBeamMirrorService({ runtime: api.runtime }));
	}
});
//#endregion
export { beam_default as default };
