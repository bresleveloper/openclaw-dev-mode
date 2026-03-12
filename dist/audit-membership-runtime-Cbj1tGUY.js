import "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import { u as isRecord } from "./utils-DMInpDZe.js";
import "./logger-GQFppKMT.js";
import { n as fetchWithTimeout } from "./fetch-timeout-CyPcfYYz.js";
import { n as makeProxyFetch } from "./proxy-fetch-wuVrlEmU.js";
import "./fetch-BhUTuYqs.js";
import { t as resolveTelegramFetch } from "./fetch-BXEZfVK2.js";
//#region src/telegram/audit-membership-runtime.ts
const TELEGRAM_API_BASE = "https://api.telegram.org";
async function auditTelegramGroupMembershipImpl(params) {
	const fetcher = resolveTelegramFetch(params.proxyUrl ? makeProxyFetch(params.proxyUrl) : void 0, { network: params.network });
	const base = `${TELEGRAM_API_BASE}/bot${params.token}`;
	const groups = [];
	for (const chatId of params.groupIds) try {
		const res = await fetchWithTimeout(`${base}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(String(params.botId))}`, {}, params.timeoutMs, fetcher);
		const json = await res.json();
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
		const status = isRecord(json.result) ? json.result.status ?? null : null;
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
			error: err instanceof Error ? err.message : String(err),
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
