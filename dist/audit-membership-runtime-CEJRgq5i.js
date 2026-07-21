import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { c as isRecord } from "./utils-CRO4LGEB.js";
import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import { r as fetchWithTimeout } from "./fetch-timeout-CxA7qokj.js";
import "./error-runtime-CDUW9C58.js";
import { r as makeProxyFetch } from "./proxy-fetch-ColTyRtu.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import "./text-utility-runtime-CEmCehV8.js";
import "./response-limit-runtime-B7RO3Er4.js";
import { n as resolveTelegramFetch, t as resolveTelegramApiBase } from "./fetch-znfvQWlD.js";
//#region extensions/telegram/src/audit-membership-runtime.ts
const TELEGRAM_BOT_API_MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
async function auditTelegramGroupMembershipImpl(params) {
	const fetcher = resolveTelegramFetch(params.proxyUrl ? makeProxyFetch(params.proxyUrl) : void 0, { network: params.network });
	const base = `${resolveTelegramApiBase(params.apiRoot)}/bot${params.token}`;
	const groups = [];
	for (const chatId of params.groupIds) try {
		const res = await fetchWithTimeout(`${base}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(String(params.botId))}`, {}, params.timeoutMs, fetcher);
		const json = JSON.parse((await readResponseWithLimit(res, TELEGRAM_BOT_API_MAX_RESPONSE_BYTES)).toString("utf8"));
		if (!res.ok || !isRecord(json) || !json.ok) {
			const desc = isRecord(json) && !json.ok && typeof json.description === "string" ? json.description : `getChatMember failed (${res.status})`;
			groups.push({
				chatId,
				ok: false,
				status: null,
				error: desc,
				matchKey: chatId,
				matchSource: "id"
			});
			continue;
		}
		const status = isRecord(json.result) && typeof json.result.status === "string" ? json.result.status : null;
		const ok = status === "creator" || status === "administrator" || status === "member";
		groups.push({
			chatId,
			ok,
			status,
			error: ok ? null : "bot not in group",
			matchKey: chatId,
			matchSource: "id"
		});
	} catch (err) {
		groups.push({
			chatId,
			ok: false,
			status: null,
			error: formatErrorMessage(err),
			matchKey: chatId,
			matchSource: "id"
		});
	}
	return {
		ok: groups.every((g) => g.ok),
		checkedGroups: groups.length,
		unresolvedGroups: 0,
		hasWildcardUnmentionedGroups: false,
		groups
	};
}
//#endregion
export { auditTelegramGroupMembershipImpl };
