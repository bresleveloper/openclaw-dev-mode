import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/token-fingerprint.ts
function fingerprintTelegramBotToken(token) {
	return createHash("sha256").update(token).digest("hex").slice(0, 16);
}
function fingerprintOptionalTelegramBotToken(token) {
	const trimmed = token?.trim();
	return trimmed ? fingerprintTelegramBotToken(trimmed) : null;
}
function resolveTelegramBotUserIdFromToken(token) {
	const rawBotId = token?.trim().split(":", 1)[0];
	return rawBotId && /^\d+$/.test(rawBotId) ? parseStrictPositiveInteger(rawBotId) : void 0;
}
//#endregion
export { fingerprintTelegramBotToken as n, resolveTelegramBotUserIdFromToken as r, fingerprintOptionalTelegramBotToken as t };
