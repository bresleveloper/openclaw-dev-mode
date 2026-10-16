import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as readResponseWithLimit } from "./http-response-body-umfRGZ-E.mjs";
import { r as fetchWithTimeout } from "./fetch-timeout-BoUn0ffV.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { n as makeProxyFetch } from "./proxy-fetch-Dq9J8411.mjs";
import "./fetch-runtime-DT4gd-qk.mjs";
import "./response-limit-runtime-CpfmMF5T.mjs";
import { E as normalizeTelegramApiRoot, n as resolveTelegramTransport } from "./fetch-87l6dlPX.mjs";
import "./number-runtime-CgyXj1A5.mjs";
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
	const transport = resolveTelegramTransport(proxyFetch, { network: params.network });
	try {
		const base = `${normalizeTelegramApiRoot(params.apiRoot)}/bot${params.token}`;
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
				const res = await fetchWithTimeout(url, {}, requestTimeoutMs, transport.fetch);
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
	} finally {
		await transport.close();
	}
}
//#endregion
export { auditTelegramGroupMembershipImpl };
