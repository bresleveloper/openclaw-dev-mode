import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { c as publicSessionMessageText, s as publicSessionMessageEntry } from "./control-ui-public-session-project-BdcQ5aRP.mjs";
import { n as publicSessionTitle } from "./control-ui-public-session-render-NfQNyGuT.mjs";
import { r as readPublicSessionShare, t as isPublicSessionShareActive } from "./control-ui-public-session-read-CbOQ1V4-.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/control-ui-public-session-card-response.ts
/** Uses the document's admission/cache owner; PNG bytes are cached as base64 text. */
async function servePublicSessionCardRepresentation(params) {
	const { res, config, gate, locator, projection, card } = params;
	const result = await gate.run({
		kind: "card",
		publicationKey: locator.shareId,
		sessionKey: locator.sessionKey,
		config,
		requestKey: JSON.stringify([
			"card",
			createHash("sha256").update(params.token).digest("base64url"),
			params.host
		]),
		work: async () => {
			const session = await readPublicSessionShare(config, locator, {
				projection,
				card: true,
				pullRequests: card.pullRequests
			});
			if (!session) return null;
			const quote = session.messages.map((message) => {
				const entry = publicSessionMessageEntry(message);
				return entry?.role === "user" ? publicSessionMessageText(entry) : void 0;
			}).find((text) => text);
			return (await card.render({
				...session.cardFacts,
				title: publicSessionTitle(session.title),
				quote,
				messageCount: session.totalMessages,
				host: params.host
			})).toString("base64");
		}
	});
	if (result.kind !== "ok") {
		await card.fallback();
		return true;
	}
	if (!await withReadySessionRows(projection, () => [{
		key: locator.sessionKey,
		agentId: locator.agentId
	}], () => {
		const representation = result.value;
		if (!representation || typeof representation.body !== "string" || !representation.isCurrent() || !isPublicSessionShareActive(config, locator, projection)) return false;
		const body = Buffer.from(representation.body, "base64");
		res.statusCode = 200;
		res.setHeader("Cache-Control", "public, max-age=300");
		res.setHeader("Content-Type", "image/png");
		res.setHeader("Content-Length", body.byteLength);
		res.end(body);
		return true;
	})) await card.fallback();
	return true;
}
//#endregion
export { servePublicSessionCardRepresentation };
