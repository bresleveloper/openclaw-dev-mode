import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DA20vxhR.mjs";
import { a as parseUsageResetAt, n as buildUsageHttpErrorSnapshot, o as readUsageJson, r as fetchJson } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.claude.ts
function readClaudeWindow(value, label, includeReset = false) {
	const window = isRecord(value) ? value : void 0;
	const utilization = asFiniteNumber(window?.utilization);
	if (utilization === void 0) return;
	return {
		label,
		usedPercent: clampPercent(utilization),
		...includeReset ? { resetAt: parseUsageResetAt(window?.resets_at) } : {}
	};
}
function parseClaudeUsage(value) {
	const usage = isRecord(value) ? value : {};
	const windows = [];
	const fiveHour = readClaudeWindow(usage.five_hour, "5h", true);
	if (fiveHour) windows.push(fiveHour);
	const sevenDay = readClaudeWindow(usage.seven_day, "Week", true);
	if (sevenDay) windows.push(sevenDay);
	const modelWindow = readClaudeWindow(usage.seven_day_sonnet, "Sonnet") ?? readClaudeWindow(usage.seven_day_opus, "Opus");
	if (modelWindow) windows.push(modelWindow);
	const knownLabels = new Set(windows.map((window) => window.label.toLowerCase()));
	for (const limit of Array.isArray(usage.limits) ? usage.limits : []) {
		if (!isRecord(limit)) continue;
		const percent = asFiniteNumber(limit.percent);
		if (limit.is_active === false || percent === void 0) continue;
		const scope = isRecord(limit.scope) ? limit.scope : void 0;
		const model = scope && isRecord(scope.model) ? scope.model : void 0;
		const label = normalizeOptionalString(model?.display_name) ?? normalizeOptionalString(model?.id);
		if (!label || knownLabels.has(label.toLowerCase())) continue;
		knownLabels.add(label.toLowerCase());
		windows.push({
			label,
			usedPercent: clampPercent(percent),
			resetAt: parseUsageResetAt(limit.resets_at)
		});
	}
	const extra = isRecord(usage.extra_usage) ? usage.extra_usage : void 0;
	return {
		windows,
		extra_usage: extra ? {
			is_enabled: extra.is_enabled === true,
			monthly_limit: asFiniteNumber(extra.monthly_limit),
			used_credits: asFiniteNumber(extra.used_credits),
			utilization: asFiniteNumber(extra.utilization),
			currency: normalizeOptionalString(extra.currency)
		} : void 0
	};
}
function buildClaudeUsageWindows(usage, options) {
	const { extra_usage: extraUsage } = usage;
	if (!options?.skipExtraUsage && extraUsage?.is_enabled === true && extraUsage.utilization !== void 0) return [...usage.windows, {
		label: "Extra usage",
		usedPercent: clampPercent(extraUsage.utilization)
	}];
	return usage.windows;
}
function resolveClaudeWebSessionKey() {
	const direct = process.env.CLAUDE_AI_SESSION_KEY?.trim() ?? process.env.CLAUDE_WEB_SESSION_KEY?.trim();
	if (direct?.startsWith("sk-ant-")) return direct;
	const cookieHeader = process.env.CLAUDE_WEB_COOKIE?.trim();
	if (!cookieHeader) return;
	const value = cookieHeader.replace(/^cookie:\s*/i, "").match(/(?:^|;\s*)sessionKey=([^;\s]+)/i)?.[1]?.trim();
	return value?.startsWith("sk-ant-") ? value : void 0;
}
async function fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn) {
	const headers = {
		Cookie: `sessionKey=${sessionKey}`,
		Accept: "application/json"
	};
	const orgRes = await fetchJson("https://claude.ai/api/organizations", { headers }, timeoutMs, fetchFn);
	if (!orgRes.ok) {
		await cancelUnreadResponseBody(orgRes);
		return null;
	}
	const parsedOrgs = await readUsageJson("anthropic", orgRes);
	if (!parsedOrgs.ok) return null;
	const firstOrg = Array.isArray(parsedOrgs.data) ? parsedOrgs.data[0] : void 0;
	const orgId = isRecord(firstOrg) ? normalizeOptionalString(firstOrg.uuid) : void 0;
	if (!orgId) return null;
	const usageRes = await fetchJson(`https://claude.ai/api/organizations/${orgId}/usage`, { headers }, timeoutMs, fetchFn);
	if (!usageRes.ok) {
		await cancelUnreadResponseBody(usageRes);
		return null;
	}
	const parsedUsage = await readUsageJson("anthropic", usageRes);
	if (!parsedUsage.ok) return null;
	const windows = buildClaudeUsageWindows(parseClaudeUsage(parsedUsage.data));
	if (windows.length === 0) return null;
	return {
		provider: "anthropic",
		displayName: PROVIDER_LABELS.anthropic,
		windows
	};
}
async function fetchClaudeUsage(token, timeoutMs, fetchFn) {
	const res = await fetchJson("https://api.anthropic.com/api/oauth/usage", { headers: {
		Authorization: `Bearer ${token}`,
		"User-Agent": "openclaw",
		Accept: "application/json",
		"anthropic-version": "2023-06-01",
		"anthropic-beta": "oauth-2025-04-20"
	} }, timeoutMs, fetchFn);
	if (!res.ok) {
		let message;
		try {
			const raw = (await readProviderJsonResponse(res, "Anthropic usage error"))?.error?.message;
			if (typeof raw === "string" && raw.trim()) message = raw.trim();
		} catch {}
		if (res.status === 403 && message?.includes("scope requirement user:profile")) {
			const sessionKey = resolveClaudeWebSessionKey();
			if (sessionKey) {
				const web = await fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn);
				if (web) return web;
			}
		}
		return buildUsageHttpErrorSnapshot({
			provider: "anthropic",
			status: res.status,
			message
		});
	}
	const parsed = await readUsageJson("anthropic", res);
	if (!parsed.ok) return parsed.snapshot;
	const usage = parseClaudeUsage(parsed.data);
	const extra = usage.extra_usage;
	const unit = extra?.currency?.toUpperCase() || "USD";
	const billing = extra?.is_enabled === true && extra.used_credits !== void 0 && extra.used_credits >= 0 && extra.monthly_limit !== void 0 && extra.monthly_limit >= 0 ? [{
		type: "budget",
		used: extra.used_credits / 100,
		limit: extra.monthly_limit / 100,
		unit,
		period: "month"
	}] : void 0;
	const windows = buildClaudeUsageWindows(usage, { skipExtraUsage: Boolean(billing) });
	return {
		provider: "anthropic",
		displayName: PROVIDER_LABELS.anthropic,
		windows,
		...billing ? { billing } : {}
	};
}
//#endregion
export { fetchClaudeUsage };
