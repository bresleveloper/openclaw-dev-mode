import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as readResponseWithLimit } from "./http-response-body-B70cE6fn.mjs";
import { r as fetchWithTimeout } from "./fetch-timeout-AfCp6rSy.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { n as makeProxyFetch } from "./proxy-fetch-jG_wX5MX.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./response-limit-runtime-obgw0EAQ.mjs";
import { D as normalizeTelegramApiRoot, n as resolveTelegramTransport } from "./fetch-ZC4IpYLZ.mjs";
import "./number-runtime-D3v2w3D4.mjs";
//#region extensions/telegram/src/audit-membership-runtime.ts
const TELEGRAM_BOT_API_MAX_RESPONSE_BYTES = 4194304;
async function auditTelegramGroupMembershipImpl(params) {
	const proxyFetch = params.proxyUrl ? makeProxyFetch(params.proxyUrl) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: params.network });
	try {
		const base = `${normalizeTelegramApiRoot(params.apiRoot)}/bot${params.token}`;
		const groups = [];
		const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
		const deadlineMs = performance.now() + timeoutMs;
		for (const chatId of params.groupIds) {
			const entry = {
				chatId,
				ok: false,
				status: null,
				error: null,
				matchKey: chatId,
				matchSource: "id"
			};
			groups.push(entry);
			const requestTimeoutMs = Math.max(0, deadlineMs - performance.now());
			if (requestTimeoutMs === 0) {
				entry.error = `Telegram membership audit timed out after ${timeoutMs}ms`;
				continue;
			}
			try {
				const url = `${base}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(String(params.botId))}`;
				const res = await fetchWithTimeout(url, {}, requestTimeoutMs, transport.fetch);
				const bodyTimeoutMs = Math.max(1, deadlineMs - performance.now());
				const body = await readResponseWithLimit(res, TELEGRAM_BOT_API_MAX_RESPONSE_BYTES, {
					timeoutMs: bodyTimeoutMs,
					chunkTimeoutMs: bodyTimeoutMs / 2,
					onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Telegram membership audit response body stalled for ${chunkTimeoutMs}ms`),
					onTimeout: ({ timeoutMs: resolvedTimeoutMs }) => /* @__PURE__ */ new Error(`Telegram membership audit response body timed out after ${resolvedTimeoutMs}ms`)
				});
				const json = JSON.parse(body.toString("utf8"));
				if (!res.ok || !isRecord(json) || !json.ok) {
					entry.error = isRecord(json) && !json.ok && typeof json.description === "string" ? json.description : `getChatMember failed (${res.status})`;
					continue;
				}
				const status = isRecord(json.result) && typeof json.result.status === "string" ? json.result.status : null;
				const ok = status === "creator" || status === "administrator" || status === "member";
				Object.assign(entry, {
					ok,
					status,
					error: ok ? null : "bot not in group"
				});
			} catch (err) {
				entry.error = formatErrorMessage(err);
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
