import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { randomBytes } from "node:crypto";
//#region src/gateway/session-publication-grant.ts
/** Call only inside the owning, authorized session mutation's commit preparation. */
function prepareSessionPublicShareGrant(entry, sessionKey) {
	if (entry.incognito || isIncognitoSessionKey(sessionKey)) throw new Error("Incognito sessions cannot be published.");
	const grant = resolveSessionPublicShare(entry) ?? {
		id: randomBytes(24).toString("hex"),
		sessionId: entry.sessionId,
		createdAt: Date.now()
	};
	registerSecretValueForRedaction(grant.id);
	return grant;
}
//#endregion
export { prepareSessionPublicShareGrant as t };
