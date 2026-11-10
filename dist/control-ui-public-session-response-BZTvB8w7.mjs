import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { r as renderPublicSessionDocument } from "./control-ui-public-session-render-NfQNyGuT.mjs";
import { r as readPublicSessionShare, t as isPublicSessionShareActive } from "./control-ui-public-session-read-CbOQ1V4-.mjs";
//#region src/gateway/control-ui-public-session-response.ts
/** Both public routes recheck publication in the synchronous response frame, including 304s. */
async function servePublicSessionRepresentation(params) {
	const { req, res, config, gate, locator, projection, offset, unavailable } = params;
	const result = await gate.run({
		kind: "transcript",
		publicationKey: locator.shareId,
		sessionKey: locator.sessionKey,
		config,
		requestKey: params.requestKey,
		work: async () => {
			const session = await readPublicSessionShare(config, locator, {
				offset,
				projection
			});
			return session ? renderPublicSessionDocument({
				...session,
				...params.document,
				isLatest: offset === 0,
				...session.olderOffset !== void 0 ? { olderUrl: params.olderUrl(session.olderOffset) } : {}
			}) : null;
		}
	});
	if (result.kind !== "ok") {
		await unavailable(result.kind === "rate-limited" ? 429 : 503, result.kind === "rate-limited" ? result.retryAfterSeconds : void 0);
		return true;
	}
	const unavailableStatus = await withReadySessionRows(projection, () => [{
		key: locator.sessionKey,
		agentId: locator.agentId
	}], () => {
		const representation = result.value;
		if (!representation || !isPublicSessionShareActive(config, locator, projection)) return 404;
		if (!representation.isCurrent()) return 503;
		const { body, etag } = representation;
		if (typeof body !== "string") return 503;
		res.setHeader("ETag", etag);
		if (req.headers["if-none-match"] === etag) {
			res.statusCode = 304;
			res.end();
		} else {
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.setHeader("Content-Length", Buffer.byteLength(body));
			res.end(body);
		}
	});
	if (unavailableStatus !== void 0) await unavailable(unavailableStatus);
	return true;
}
//#endregion
export { servePublicSessionRepresentation as t };
