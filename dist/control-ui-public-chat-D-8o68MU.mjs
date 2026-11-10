import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { n as buildControlUiPublicSessionCardPath } from "./public-share-aG2ajaph.mjs";
import { n as buildPublicSessionMediaBaseUrl } from "./control-ui-public-session-project-BdcQ5aRP.mjs";
import { t as isSecurePublicSessionIngress } from "./control-ui-public-session-ingress-C0YCOnAV.mjs";
import { r as renderPublicSessionDocument, t as PUBLIC_SESSION_CONTENT_SECURITY_POLICY } from "./control-ui-public-session-render-NfQNyGuT.mjs";
import { n as resolveControlUiShareOrigin } from "./control-ui-share-DxzTW02e.mjs";
import { r as parseControlUiSessionReturnPath, t as buildControlUiSessionEntryUrl } from "./control-ui-session-entry-path-mAdcjKkp.mjs";
import { t as servePublicSessionRepresentation } from "./control-ui-public-session-response-BZTvB8w7.mjs";
import { r as mintExistingPublicSessionShareToken } from "./control-ui-public-session-token-Dcl_JPw_.mjs";
import { t as resolveControlUiSessionPath } from "./control-ui-session-path-resolve-BzHBuCi1.mjs";
//#region src/gateway/control-ui-public-chat.ts
async function serveControlUiPublicChat(params) {
	const { req, res, basePath, config, projection, gate } = params;
	const url = new URL(req.url ?? "/", "http://localhost");
	const entryQuery = new URLSearchParams(url.searchParams);
	entryQuery.delete("offset");
	const entryPath = url.pathname + (entryQuery.size ? `?${entryQuery}` : "");
	const target = parseControlUiSessionReturnPath(entryPath, basePath);
	const publicOrigin = resolveGatewayPublicOrigin(config);
	const origin = resolveControlUiShareOrigin(req, publicOrigin);
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	res.setHeader("Content-Security-Policy", PUBLIC_SESSION_CONTENT_SECURITY_POLICY);
	const end = (status, body) => {
		res.statusCode = status;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.setHeader("Content-Length", Buffer.byteLength(body));
		res.end(req.method === "HEAD" ? void 0 : body);
		return true;
	};
	const offsetText = url.searchParams.get("offset") ?? "0";
	if (!target || !origin || req.method !== "GET" && req.method !== "HEAD" || url.searchParams.getAll("offset").length > 1 || !/^(?:0|[1-9][0-9]{0,9})$/u.test(offsetText)) return end(404, "Not found");
	if (req.method === "HEAD") {
		res.setHeader("Allow", "GET");
		return end(405, "");
	}
	const entryUrl = buildControlUiSessionEntryUrl(entryPath, basePath);
	const clientAuthBasePath = params.auth.mode === "token" || params.auth.mode === "password" ? basePath : void 0;
	const secureIngress = isSecurePublicSessionIngress(req, params.ingress, publicOrigin);
	if (!secureIngress && clientAuthBasePath !== void 0) {
		await params.serveApp(entryPath);
		return true;
	}
	const unavailable = (status = 404, retryAfterSeconds = 1) => {
		if (status !== 404) {
			res.setHeader("Retry-After", status === 429 ? retryAfterSeconds : "1");
			return end(status, status === 429 ? "Too many public session requests. Please retry later." : "This conversation is temporarily unavailable. Please retry.");
		}
		return end(404, renderPublicSessionDocument({
			title: "Conversation unavailable",
			messages: [],
			truncated: false,
			latestUrl: url.pathname,
			entryUrl,
			clientAuthBasePath,
			assetBasePath: basePath,
			cardUrl: `${origin}${basePath}/share/card.png`,
			unavailable: true
		}));
	};
	const admitted = gate.admitClient(params.ingress.rateLimit.subject.key);
	if (admitted.kind === "rate-limited") return unavailable(429, admitted.retryAfterSeconds);
	if (!secureIngress) return unavailable();
	if (!projection) return unavailable(503);
	try {
		const selected = await resolveControlUiSessionPath({
			target,
			projection,
			client: null,
			publicOnly: true
		});
		if (!selected) return unavailable();
		const query = {
			key: selected.key,
			agentId: selected.agentId
		};
		const queries = () => [query];
		const share = await withReadySessionRows(projection, queries, () => {
			const current = projection.sharingTargetState(query);
			return current.status === "ready" ? resolveSessionPublicShare(current.target.entry) : void 0;
		});
		if (!share) return unavailable();
		const locator = {
			agentId: selected.agentId,
			sessionKey: selected.key,
			sessionId: share.sessionId,
			shareId: share.id
		};
		const offset = Number(offsetText);
		const token = await mintExistingPublicSessionShareToken(locator);
		return await servePublicSessionRepresentation({
			...params,
			locator,
			projection,
			offset,
			requestKey: JSON.stringify([
				"canonical",
				share.id,
				url.pathname,
				offset,
				origin,
				entryUrl,
				clientAuthBasePath
			]),
			document: {
				latestUrl: url.pathname,
				...token ? { mediaBaseUrl: buildPublicSessionMediaBaseUrl(basePath, token) } : {},
				entryUrl,
				clientAuthBasePath,
				assetBasePath: basePath,
				canonicalUrl: `${origin}${url.pathname}`,
				cardUrl: token ? `${origin}${buildControlUiPublicSessionCardPath({
					basePath,
					token
				})}` : `${origin}${basePath}/share/card.png`
			},
			olderUrl: (olderOffset) => `${url.pathname}?offset=${olderOffset}`,
			unavailable
		});
	} catch {
		return unavailable(503);
	}
}
//#endregion
export { serveControlUiPublicChat };
