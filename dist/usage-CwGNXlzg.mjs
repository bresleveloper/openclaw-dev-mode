import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-B2Q7uCr7.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-C8eJEO7a.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import "./provider-usage-DGQhrvJu.mjs";
import { n as buildUsageHttpErrorSnapshot, r as fetchJson } from "./provider-usage.fetch.shared-DCZdARu5.mjs";
import { t as PUBLIC_GITHUB_COPILOT_DOMAIN } from "./domain-VvPJpQNG.mjs";
//#region extensions/github-copilot/usage.ts
async function fetchCopilotUsage(token, timeoutMs, fetchFn, githubDomain = PUBLIC_GITHUB_COPILOT_DOMAIN) {
	const res = await fetchJson(`https://api.${githubDomain}/copilot_internal/user`, { headers: {
		Authorization: `token ${token}`,
		...buildCopilotIdeHeaders({ includeApiVersion: true })
	} }, timeoutMs, fetchFn);
	if (!res.ok) {
		await res.body?.cancel().catch(() => void 0);
		return buildUsageHttpErrorSnapshot({
			provider: "github-copilot",
			status: res.status
		});
	}
	const payload = await readProviderJsonResponse(res, "github-copilot-usage");
	const data = isRecord(payload) ? payload : {};
	const windows = [];
	for (const [key, label] of [["premium_interactions", "Premium"], ["chat", "Chat"]]) {
		const quota = data.quota_snapshots?.[key];
		if (quota) windows.push({
			label,
			usedPercent: clampPercent(100 - (quota.percent_remaining ?? 0))
		});
	}
	return {
		provider: "github-copilot",
		displayName: PROVIDER_LABELS["github-copilot"],
		windows,
		plan: data.copilot_plan
	};
}
//#endregion
export { fetchCopilotUsage as t };
