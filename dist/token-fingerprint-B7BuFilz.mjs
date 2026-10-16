import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/token-fingerprint.ts
function fingerprintTelegramBotToken(token) {
	return createHash("sha256").update(token).digest("hex").slice(0, 16);
}
function resolveTelegramBotUserIdFromToken(token) {
	const rawBotId = token?.trim().split(":", 1)[0];
	if (!rawBotId || !/^\d+$/.test(rawBotId)) return;
	return parseStrictPositiveInteger(rawBotId);
}
//#endregion
export { resolveTelegramBotUserIdFromToken as n, fingerprintTelegramBotToken as t };
