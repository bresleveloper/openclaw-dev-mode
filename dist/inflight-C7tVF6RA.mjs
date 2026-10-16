//#region src/gateway/server-methods/inflight.ts
const inflightByContext = /* @__PURE__ */ new WeakMap();
function getInflightMap(context) {
	let inflight = inflightByContext.get(context);
	if (!inflight) {
		inflight = /* @__PURE__ */ new Map();
		inflightByContext.set(context, inflight);
	}
	return inflight;
}
/** Joins concurrent idempotent requests and replays completed Gateway dedupe entries. */
function resolveGatewayInflightRequest(params) {
	const cached = params.context.dedupe.get(params.dedupeKey);
	if (cached) {
		params.respond(cached.ok, cached.payload, cached.error, { cached: true });
		return {
			kind: "handled",
			done: Promise.resolve()
		};
	}
	const inflightMap = getInflightMap(params.context);
	const inflight = inflightMap.get(params.dedupeKey);
	if (inflight) return {
		kind: "handled",
		done: inflight.then((result) => {
			const meta = result.meta ? {
				...result.meta,
				cached: true
			} : { cached: true };
			params.respond(result.ok, result.payload, result.error, meta);
		})
	};
	return {
		kind: "ready",
		idem: params.idempotencyKey,
		dedupeKey: params.dedupeKey,
		inflightMap
	};
}
async function runGatewayInflightWork(params) {
	params.inflightMap.set(params.dedupeKey, params.work);
	try {
		const result = await params.work;
		params.respond(result.ok, result.payload, result.error, result.meta);
	} finally {
		params.inflightMap.delete(params.dedupeKey);
	}
}
function cacheGatewayDedupeResult(params) {
	params.context.dedupe.set(params.dedupeKey, {
		ts: Date.now(),
		ok: params.result.ok,
		...params.requestIdentity ? { requestIdentity: params.requestIdentity } : {},
		...params.result.payload !== void 0 ? { payload: params.result.payload } : {},
		...params.result.error ? { error: params.result.error } : {}
	});
}
//#endregion
export { resolveGatewayInflightRequest as n, runGatewayInflightWork as r, cacheGatewayDedupeResult as t };
