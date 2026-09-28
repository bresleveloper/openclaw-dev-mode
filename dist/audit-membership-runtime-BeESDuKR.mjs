import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import { r as fetchWithTimeout } from "./fetch-timeout-BOG6Do5a.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { r as makeProxyFetch } from "./proxy-fetch-0WBdYnFw.mjs";
import "./response-limit-runtime-Wtkm2X7a.mjs";
import { n as resolveTelegramFetch, t as resolveTelegramApiBase } from "./fetch-BZlDgFP3.mjs";
import "./number-runtime-CGwowceO.mjs";
//#region extensions/telegram/src/audit-membership-runtime.ts
const TELEGRAM_BOT_API_MAX_RESPONSE_BYTES = 4194304;
async function readTelegramMembershipAuditBody(response, timeoutMs) {
	return await readResponseWithLimit(response, TELEGRAM_BOT_API_MAX_RESPONSE_BYTES, {
		timeoutMs,
		chunkTimeoutMs: timeoutMs / 2,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Telegram membership audit response body stalled for ${chunkTimeoutMs}ms`),
		onTimeout: ({ timeoutMs: resolvedTimeoutMs }) => /* @__PURE__ */ new Error(`Telegram membership audit response body timed out after ${resolvedTimeoutMs}ms`)
	});
}
async function auditTelegramGroupMembershipImpl(params) {
	const proxyFetch = params.proxyUrl ? makeProxyFetch(params.proxyUrl) : void 0;
	const fetcher = resolveTelegramFetch(proxyFetch, { network: params.network });
	const base = `${resolveTelegramApiBase(params.apiRoot)}/bot${params.token}`;
	const groups = [];
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const deadlineMs = Date.now() + timeoutMs;
	for (const chatId of params.groupIds) {
		const requestTimeoutMs = Math.max(0, deadlineMs - Date.now());
		if (requestTimeoutMs === 0) {
			groups.push({
				chatId,
				ok: false,
				status: null,
				error: `Telegram membership audit timed out after ${timeoutMs}ms`,
				matchKey: chatId,
				matchSource: "id"
			});
			continue;
		}
		try {
			const url = `${base}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(String(params.botId))}`;
			const res = await fetchWithTimeout(url, {}, requestTimeoutMs, fetcher);
			const json = JSON.parse((await readTelegramMembershipAuditBody(res, Math.max(1, deadlineMs - Date.now()))).toString("utf8"));
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
