import { r as canonicalizePathVariant } from "./security-path-y4_rzTXB.mjs";
import { i as beginWebhookRequestPipelineOrReject } from "./webhook-request-guards-CccCHICi.mjs";
import { r as registerPluginHttpRoute } from "./http-registry-fCJWQGrb.mjs";
//#region src/plugin-sdk/webhook-targets.ts
/** Normalize a webhook path to a leading slash without a trailing slash. */
function normalizeWebhookPath(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "/";
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
/** Canonicalize a webhook path for Gateway route identity and registry keys. */
function canonicalizeWebhookRouteKey(raw) {
	return canonicalizePathVariant(normalizeWebhookPath(raw));
}
/** Resolve a webhook path from explicit config, URL pathname, or a caller default. */
function resolveWebhookPath(params) {
	const trimmedPath = params.webhookPath?.trim();
	if (trimmedPath) return normalizeWebhookPath(trimmedPath);
	if (params.webhookUrl?.trim()) try {
		return normalizeWebhookPath(new URL(params.webhookUrl).pathname || "/");
	} catch {
		return null;
	}
	return params.defaultPath ?? null;
}
/** Register a webhook target and lazily install the matching plugin HTTP route on first use. */
function registerWebhookTargetWithPluginRoute(params) {
	const canonicalTarget = {
		...params.target,
		path: canonicalizeWebhookRouteKey(params.target.path)
	};
	return registerWebhookTarget(params.targetsByPath, canonicalTarget, {
		onFirstPathTarget: ({ path }) => registerPluginHttpRoute({
			...params.route,
			path,
			replaceExisting: params.route.replaceExisting ?? true
		}),
		onLastPathTargetRemoved: params.onLastPathTargetRemoved
	});
}
const pathTeardownByTargetMap = /* @__PURE__ */ new WeakMap();
function getPathTeardownMap(targetsByPath) {
	const mapKey = targetsByPath;
	const existing = pathTeardownByTargetMap.get(mapKey);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	pathTeardownByTargetMap.set(mapKey, created);
	return created;
}
/** Add a normalized target to a path bucket and clean up route state when the last target leaves. */
function registerWebhookTarget(targetsByPath, target, opts) {
	const key = normalizeWebhookPath(target.path);
	const normalizedTarget = {
		...target,
		path: key
	};
	const existing = targetsByPath.get(key) ?? [];
	if (existing.length === 0) {
		const onFirstPathResult = opts?.onFirstPathTarget?.({
			path: key,
			target: normalizedTarget
		});
		if (typeof onFirstPathResult === "function") getPathTeardownMap(targetsByPath).set(key, onFirstPathResult);
	}
	targetsByPath.set(key, [...existing, normalizedTarget]);
	let isActive = true;
	const unregister = () => {
		if (!isActive) return;
		isActive = false;
		const updated = (targetsByPath.get(key) ?? []).filter((entry) => entry !== normalizedTarget);
		if (updated.length > 0) {
			targetsByPath.set(key, updated);
			return;
		}
		targetsByPath.delete(key);
		const teardown = getPathTeardownMap(targetsByPath).get(key);
		if (teardown) {
			getPathTeardownMap(targetsByPath).delete(key);
			teardown();
		}
		opts?.onLastPathTargetRemoved?.({ path: key });
	};
	return {
		target: normalizedTarget,
		unregister
	};
}
/** Resolve all registered webhook targets for the incoming request path. */
function resolveWebhookTargets(req, targetsByPath) {
	const normalizedPath = normalizeWebhookPath(new URL(req.url ?? "/", "http://localhost").pathname);
	const normalizedTargets = targetsByPath.get(normalizedPath);
	if (normalizedTargets && normalizedTargets.length > 0) return {
		path: normalizedPath,
		targets: normalizedTargets
	};
	const path = canonicalizeWebhookRouteKey(normalizedPath);
	const targets = path === normalizedPath ? void 0 : targetsByPath.get(path);
	if (!targets || targets.length === 0) return null;
	return {
		path,
		targets
	};
}
/** Run common webhook guards, then dispatch only when the request path resolves to live targets. */
async function withResolvedWebhookRequestPipeline(params) {
	const resolved = resolveWebhookTargets(params.req, params.targetsByPath);
	if (!resolved) return false;
	const inFlightKey = typeof params.inFlightKey === "function" ? params.inFlightKey({
		req: params.req,
		path: resolved.path,
		targets: resolved.targets
	}) : params.inFlightKey ?? `${resolved.path}:${params.req.socket?.remoteAddress ?? "unknown"}`;
	const requestLifecycle = beginWebhookRequestPipelineOrReject({
		req: params.req,
		res: params.res,
		allowMethods: params.allowMethods,
		rateLimiter: params.rateLimiter,
		rateLimitKey: params.rateLimitKey,
		nowMs: params.nowMs,
		requireJsonContentType: params.requireJsonContentType,
		inFlightLimiter: params.inFlightLimiter,
		inFlightKey,
		inFlightLimitStatusCode: params.inFlightLimitStatusCode,
		inFlightLimitMessage: params.inFlightLimitMessage
	});
	if (!requestLifecycle.ok) return true;
	try {
		await params.handle(resolved);
		return true;
	} finally {
		requestLifecycle.release();
	}
}
function updateMatchedWebhookTarget(matched, target) {
	if (matched) return {
		ok: false,
		result: { kind: "ambiguous" }
	};
	return {
		ok: true,
		matched: target
	};
}
function finalizeMatchedWebhookTarget(matched) {
	if (!matched) return { kind: "none" };
	return {
		kind: "single",
		target: matched
	};
}
/** Match exactly one synchronous target or report whether resolution was empty or ambiguous. */
function resolveSingleWebhookTarget(targets, isMatch) {
	let matched;
	for (const target of targets) {
		if (!isMatch(target)) continue;
		const updated = updateMatchedWebhookTarget(matched, target);
		if (!updated.ok) return updated.result;
		matched = updated.matched;
	}
	return finalizeMatchedWebhookTarget(matched);
}
/** Async variant of single-target resolution for auth checks that need I/O. */
async function resolveSingleWebhookTargetAsync(targets, isMatch) {
	let matched;
	for (const target of targets) {
		if (!await isMatch(target)) continue;
		const updated = updateMatchedWebhookTarget(matched, target);
		if (!updated.ok) return updated.result;
		matched = updated.matched;
	}
	return finalizeMatchedWebhookTarget(matched);
}
/** Resolve an authorized target and send the standard unauthorized or ambiguous response on failure. */
async function resolveWebhookTargetWithAuthOrReject(params) {
	return resolveWebhookTargetMatchOrReject(params, await resolveSingleWebhookTargetAsync(params.targets, async (target) => params.isMatch(target)));
}
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
function resolveWebhookTargetWithAuthOrRejectSync(params) {
	return resolveWebhookTargetMatchOrReject(params, resolveSingleWebhookTarget(params.targets, params.isMatch));
}
function resolveWebhookTargetMatchOrReject(params, match) {
	if (match.kind === "single") return match.target;
	if (match.kind === "ambiguous") {
		params.res.statusCode = params.ambiguousStatusCode ?? 401;
		params.res.end(params.ambiguousMessage ?? "ambiguous webhook target");
		return null;
	}
	params.res.statusCode = params.unauthorizedStatusCode ?? 401;
	params.res.end(params.unauthorizedMessage ?? "unauthorized");
	return null;
}
/** Reject non-POST webhook requests with the conventional Allow header. */
function rejectNonPostWebhookRequest(req, res) {
	if (req.method === "POST") return false;
	res.statusCode = 405;
	res.setHeader("Allow", "POST");
	res.end("Method Not Allowed");
	return true;
}
//#endregion
export { rejectNonPostWebhookRequest as a, resolveWebhookPath as c, resolveWebhookTargets as d, withResolvedWebhookRequestPipeline as f, registerWebhookTargetWithPluginRoute as i, resolveWebhookTargetWithAuthOrReject as l, normalizeWebhookPath as n, resolveSingleWebhookTarget as o, registerWebhookTarget as r, resolveSingleWebhookTargetAsync as s, canonicalizeWebhookRouteKey as t, resolveWebhookTargetWithAuthOrRejectSync as u };
